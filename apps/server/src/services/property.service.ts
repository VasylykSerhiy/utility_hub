import type { CreatePropertySchema, UpdatePropertySchema } from '@workspace/utils';

import { supabase } from '../configs/supabase';
import {
  createEmptyReading,
  mapPropertyToFrontend,
  mapReadingToFrontend,
  mapTariffToFrontend,
} from '../mappers/property.mappers';
import { enrichWithReplacement, enrichRowsWithReplacement } from './reading.service';
import { findTariffForDate } from './tariff.service';
import { insertAuditLog, AUDIT_ACTIONS } from './audit.service';
import {
  ensureCanAccessProperty,
  ensureOwner,
  ensureStrictOwner,
} from './property-access.service';

type PropertyRow = {
  id: string;
  user_id: string;
  name: string;
  electricity_type: 'single' | 'double' | null;
  created_at: string;
  updated_at: string;
};

const fetchPropertyWithDetails = async (prop: PropertyRow) => {
  const electricityType = prop.electricity_type ?? 'single';
  const { data: lastReading } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('property_id', prop.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  let historicalTariff = null;
  let lastReadingEnriched = lastReading;
  if (lastReading) {
    historicalTariff = await findTariffForDate(prop.id, lastReading.date);
    lastReadingEnriched = await enrichWithReplacement(lastReading, lastReading.id);
  }

  const { data: currentTariff } = await supabase
    .from('tariffs')
    .select('*')
    .eq('property_id', prop.id)
    .order('start_date', { ascending: false })
    .limit(1)
    .single();

  const mappedLastReading = lastReadingEnriched
    ? mapReadingToFrontend(lastReadingEnriched, historicalTariff, electricityType)
    : createEmptyReading(electricityType, prop.id);

  const mappedCurrentTariff = currentTariff ? mapTariffToFrontend(currentTariff) : null;

  return mapPropertyToFrontend(prop, mappedLastReading, mappedCurrentTariff);
};

const getProperties = async (userId: string) => {
  const { data: owned, error: ownedError } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ownedError) throw new Error(ownedError.message);

  const { data: memberRows } = await supabase
    .from('property_members')
    .select('property_id, role')
    .eq('user_id', userId);

  const memberIds = (memberRows ?? []).map(r => r.property_id).filter(Boolean);
  const uniqueMemberIds = [...new Set(memberIds)];
  const memberRoleByPropertyId = new Map<string, 'viewer' | 'admin'>(
    (memberRows ?? []).map(r => [r.property_id, r.role === 'admin' ? 'admin' : 'viewer']),
  );

  let shared: PropertyRow[] = [];
  if (uniqueMemberIds.length > 0) {
    const { data: sharedRows } = await supabase
      .from('properties')
      .select('*')
      .in('id', uniqueMemberIds);
    shared = (sharedRows ?? []) as PropertyRow[];
  }

  const ownedWithRole = await Promise.all(
    (owned ?? []).map(async prop => {
      const mapped = await fetchPropertyWithDetails(prop);
      return { ...mapped, role: 'owner' as const };
    }),
  );

  const sharedWithRole = await Promise.all(
    shared.map(async prop => {
      const mapped = await fetchPropertyWithDetails(prop);
      const role = memberRoleByPropertyId.get(prop.id) ?? 'viewer';
      return { ...mapped, role };
    }),
  );

  return [...ownedWithRole, ...sharedWithRole];
};

const getProperty = async (userId: string, propertyId: string) => {
  const role = await ensureCanAccessProperty(userId, propertyId);

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error || !property) throw new Error('Property not found');

  const mapped = await fetchPropertyWithDetails(property);
  return { ...mapped, role };
};

const createProperty = async ({
  userId,
  data,
  actorEmail,
}: {
  userId: string;
  data: CreatePropertySchema;
  actorEmail?: string;
}) => {
  const { tariffs, fixedCosts, ...propData } = data;

  const { data: newProp, error: propError } = await supabase
    .from('properties')
    .insert({
      user_id: userId,
      name: propData.name,
      electricity_type: tariffs.electricity.type,
    })
    .select()
    .single();

  if (propError) throw new Error(`Failed to create property: ${propError.message}`);

  const { error: tariffError } = await supabase.from('tariffs').insert({
    property_id: newProp.id,
    start_date: new Date('1900-01-01').toISOString(),
    ...(tariffs?.electricity.type === 'single' && {
      rate_electricity_single: tariffs.electricity?.single,
      rate_electricity_day: 0,
      rate_electricity_night: 0,
    }),
    ...(tariffs?.electricity.type === 'double' && {
      rate_electricity_single: 0,
      rate_electricity_day: tariffs.electricity.day,
      rate_electricity_night: tariffs.electricity.night,
    }),
    rate_water: tariffs?.water || 0,
    rate_gas: tariffs?.gas || 0,
    fixed_internet: fixedCosts?.internet || 0,
    fixed_maintenance: fixedCosts?.maintenance || 0,
    fixed_gas_delivery: fixedCosts?.gas_delivery || 0,
  });

  if (tariffError) {
    await supabase.from('properties').delete().eq('id', newProp.id);
    throw new Error(`Failed to create tariff: ${tariffError.message}`);
  }

  await insertAuditLog({
    userId,
    propertyId: newProp.id,
    action: AUDIT_ACTIONS.PROPERTY_CREATE,
    entityType: 'property',
    entityId: newProp.id,
    details: { name: propData.name },
    actorEmail,
  });
  return mapPropertyToFrontend(newProp);
};

const updateProperty = async ({
  userId,
  propertyId,
  data,
  actorEmail,
}: {
  userId: string;
  propertyId: string;
  data: UpdatePropertySchema;
  actorEmail?: string;
}) => {
  await ensureOwner(userId, propertyId);

  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .single();

  if (fetchError || !property) throw new Error('Property not found');

  const { tariffs, fixedCosts } = data;
  const electricityType = data.tariffs?.electricity?.type;

  if (electricityType) {
    await supabase
      .from('properties')
      .update({
        ...(electricityType && { electricity_type: electricityType }),
      })
      .eq('id', propertyId);
  }

  if (tariffs || fixedCosts) {
    const now = new Date().toISOString();

    await supabase
      .from('tariffs')
      .update({ end_date: now })
      .eq('property_id', propertyId)
      .is('end_date', null);

    await supabase.from('tariffs').insert({
      property_id: propertyId,
      start_date: now,
      ...(tariffs?.electricity.type === 'single' && {
        rate_electricity_single: tariffs.electricity?.single,
        rate_electricity_day: 0,
        rate_electricity_night: 0,
      }),
      ...(tariffs?.electricity.type === 'double' && {
        rate_electricity_single: 0,
        rate_electricity_day: tariffs.electricity.day,
        rate_electricity_night: tariffs.electricity.night,
      }),
      rate_water: tariffs?.water ?? 0,
      rate_gas: tariffs?.gas ?? 0,
      fixed_internet: fixedCosts?.internet ?? 0,
      fixed_maintenance: fixedCosts?.maintenance ?? 0,
      fixed_gas_delivery: fixedCosts?.gas_delivery ?? 0,
    });
  }

  await insertAuditLog({
    userId,
    propertyId,
    action: AUDIT_ACTIONS.PROPERTY_UPDATE,
    entityType: 'property',
    entityId: propertyId,
    actorEmail,
  });
  return { success: true };
};

const deleteProperty = async ({
  userId,
  propertyId,
  actorEmail,
}: {
  userId: string;
  propertyId: string;
  actorEmail?: string;
}) => {
  await ensureOwner(userId, propertyId);

  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error deleting property:', error);
    throw new Error(`Failed to delete property: ${error.message}`);
  }

  if (!data) {
    throw new Error('Property not found or access denied');
  }

  await insertAuditLog({
    userId,
    propertyId,
    action: AUDIT_ACTIONS.PROPERTY_DELETE,
    entityType: 'property',
    entityId: propertyId,
    actorEmail,
  });
  return { success: true };
};

const getMetrics = async ({
  userId,
  propertyId,
}: {
  userId: string;
  propertyId: string;
}) => {
  await ensureCanAccessProperty(userId, propertyId);

  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth() - 1, 1).toISOString();

  const { data: property } = await supabase
    .from('properties')
    .select('electricity_type')
    .eq('id', propertyId)
    .single();

  const electricityType = property?.electricity_type || 'single';

  const { data: readings, error } = await supabase
    .from('view_readings_stats')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', oneYearAgo)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);

  const readingsEnriched = await enrichRowsWithReplacement(readings);
  return await Promise.all(
    readingsEnriched.map(async r => {
      const tariff = await findTariffForDate(propertyId, r.date);
      return mapReadingToFrontend(r, tariff, electricityType);
    }),
  );
};

/** UA: Список учасників об'єкта (лише власник може переглядати/керувати). EN: List property members (owner only). */
const getPropertyMembers = async (userId: string, propertyId: string) => {
  await ensureStrictOwner(userId, propertyId);

  const { data: rows, error } = await supabase
    .from('property_members')
    .select('id, property_id, user_id, role, created_at, invited_email')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (rows ?? []).map(r => ({
    id: r.id,
    propertyId: r.property_id,
    userId: r.user_id,
    role: (r.role === 'admin' ? 'admin' : 'viewer') as 'admin' | 'viewer',
    createdAt: r.created_at,
    email: r.invited_email ?? undefined,
  }));
};

/** UA: Знайти user id за email через Auth Admin (listUsers + пошук). EN: Resolve user id by email via Auth Admin. */
const findUserIdByEmail = async (email: string): Promise<string> => {
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error('Email is required');
  let page = 1;
  const perPage = 500;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw new Error(error.message);
    const users = data?.users ?? [];
    const found = users.find(
      u => (u.email ?? '').toLowerCase() === normalized,
    );
    if (found) return found.id;
    if (users.length < perPage) break;
    page += 1;
  }
  throw new Error('User with this email not found');
};

const MEMBER_ROLES = ['viewer', 'admin'] as const;
type MemberRole = (typeof MEMBER_ROLES)[number];

/** UA: Додати учасника за email або за user ID; роль за замовчуванням viewer. EN: Add member by email or userId; default role viewer. */
const addPropertyMember = async ({
  userId,
  propertyId,
  email,
  memberUserId,
  role = 'viewer',
  actorEmail,
}: {
  userId: string;
  propertyId: string;
  email?: string;
  memberUserId?: string;
  role?: MemberRole;
  actorEmail?: string;
}) => {
  await ensureStrictOwner(userId, propertyId);
  if (!MEMBER_ROLES.includes(role)) throw new Error('Role must be viewer or admin');

  const hasEmail = Boolean(email?.trim());
  const hasUserId = Boolean(memberUserId?.trim());
  if (hasEmail === hasUserId) {
    throw new Error('Provide either email or userId');
  }

  let targetUserId: string;
  let invitedEmail: string | null = null;

  if (hasEmail && email) {
    const emailTrimmed = email.trim();
    targetUserId = await findUserIdByEmail(emailTrimmed);
    invitedEmail = emailTrimmed.toLowerCase();
  } else if (memberUserId) {
    targetUserId = memberUserId.trim();
  } else {
    throw new Error('Provide either email or userId');
  }

  if (targetUserId === userId) throw new Error('Cannot add yourself as member');

  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .single();
  if (!property) throw new Error('Property not found');

  const { error } = await supabase.from('property_members').insert({
    property_id: propertyId,
    user_id: targetUserId,
    role,
    ...(invitedEmail && { invited_email: invitedEmail }),
  });

  if (error) {
    if (error.code === '23505') throw new Error('User is already a member');
    throw new Error(error.message);
  }

  await insertAuditLog({
    userId,
    propertyId,
    action: AUDIT_ACTIONS.MEMBER_ADD,
    entityType: 'member',
    entityId: targetUserId,
    details: { role, ...(invitedEmail && { email: invitedEmail }) },
    actorEmail,
  });
  return { success: true };
};

/** UA: Змінити роль учасника (viewer | admin). Лише власник або адмін. EN: Update member role. Owner or admin only. */
const updatePropertyMemberRole = async ({
  userId,
  propertyId,
  memberUserId,
  role,
  actorEmail,
}: {
  userId: string;
  propertyId: string;
  memberUserId: string;
  role: MemberRole;
  actorEmail?: string;
}) => {
  await ensureStrictOwner(userId, propertyId);
  if (!MEMBER_ROLES.includes(role)) throw new Error('Role must be viewer or admin');

  const { error } = await supabase
    .from('property_members')
    .update({ role })
    .eq('property_id', propertyId)
    .eq('user_id', memberUserId);

  if (error) throw new Error(error.message);
  await insertAuditLog({
    userId,
    propertyId,
    action: AUDIT_ACTIONS.MEMBER_ROLE_CHANGE,
    entityType: 'member',
    entityId: memberUserId,
    details: { role },
    actorEmail,
  });
  return { success: true };
};

/** UA: Видалити учасника. Лише власник. EN: Remove member. Owner only. */
const removePropertyMember = async ({
  userId,
  propertyId,
  memberUserId,
  actorEmail,
}: {
  userId: string;
  propertyId: string;
  memberUserId: string;
  actorEmail?: string;
}) => {
  await ensureStrictOwner(userId, propertyId);

  const { error } = await supabase
    .from('property_members')
    .delete()
    .eq('property_id', propertyId)
    .eq('user_id', memberUserId);

  if (error) throw new Error(error.message);
  await insertAuditLog({
    userId,
    propertyId,
    action: AUDIT_ACTIONS.MEMBER_REMOVE,
    entityType: 'member',
    entityId: memberUserId,
    actorEmail,
  });
  return { success: true };
};

export default {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getProperty,
  getMetrics,
  getPropertyMembers,
  addPropertyMember,
  updatePropertyMemberRole,
  removePropertyMember,
};
