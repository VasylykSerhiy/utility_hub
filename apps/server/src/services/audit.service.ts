import { supabase } from '../configs/supabase';
import { serverError } from '../utils/http-errors';

export const AUDIT_ACTIONS = {
  PROPERTY_CREATE: 'property.create',
  PROPERTY_UPDATE: 'property.update',
  PROPERTY_DELETE: 'property.delete',
  READING_CREATE: 'reading.create',
  READING_UPDATE: 'reading.update',
  READING_DELETE: 'reading.delete',
  MEMBER_ADD: 'member.add',
  MEMBER_REMOVE: 'member.remove',
  MEMBER_ROLE_CHANGE: 'member.role_change',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export type AuditDetails = Record<string, unknown>;

export const insertAuditLog = async (params: {
  userId: string;
  propertyId: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  details?: AuditDetails;
  actorEmail?: string;
}): Promise<void> => {
  const { userId, propertyId, action, entityType, entityId, details, actorEmail } = params;
  const mergedDetails: AuditDetails = {
    ...(details ?? {}),
    ...(actorEmail && { actor_email: actorEmail }),
  };
  const { error } = await supabase.from('audit_log').insert({
    property_id: propertyId,
    user_id: userId,
    action,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    details: mergedDetails,
  });
  if (error) {
    console.error('audit_log insert failed:', error);
  }
};

type AuditRow = {
  id: string;
  property_id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

export type AuditLogEntry = {
  id: string;
  propertyId: string;
  userId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
};

export const getAuditLog = async (
  propertyId: string,
  page: number,
  pageSize: number,
): Promise<{
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: AuditLogEntry[];
}> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { count, error: countError } = await supabase
    .from('audit_log')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId);

  if (countError) serverError('Failed to load audit log', countError);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const { data: rows, error } = await supabase
    .from('audit_log')
    .select('id, property_id, user_id, action, entity_type, entity_id, details, created_at')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) serverError('Failed to load audit log', error);

  const data = (rows ?? []).map((r: AuditRow) => ({
    id: r.id,
    propertyId: r.property_id,
    userId: r.user_id,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    details: (r.details as Record<string, unknown>) ?? {},
    createdAt: r.created_at,
  }));

  return { page, pageSize, total, totalPages, data };
};

export default {
  insertAuditLog,
  getAuditLog,
  AUDIT_ACTIONS,
};
