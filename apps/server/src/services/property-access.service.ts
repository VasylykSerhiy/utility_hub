import { supabase } from '../configs/supabase';
import { assertFound, forbidden } from '../utils/http-errors';

export type PropertyAccessRole = 'owner' | 'admin' | 'viewer';

export const getPropertyAccess = async (
  userId: string,
  propertyId: string,
): Promise<PropertyAccessRole | null> => {
  const { data: property } = await supabase
    .from('properties')
    .select('user_id')
    .eq('id', propertyId)
    .single();
  if (property?.user_id === userId) return 'owner';
  const { data: member } = await supabase
    .from('property_members')
    .select('role')
    .eq('property_id', propertyId)
    .eq('user_id', userId)
    .maybeSingle();
  return member ? (member.role as PropertyAccessRole) : null;
};

/** UA: Дозволити тільки тому, хто може керувати об'єктом (власник або адмін). EN: Allow only those who can manage the property (owner or admin). */
export const ensureOwner = async (userId: string, propertyId: string): Promise<void> => {
  const role = await getPropertyAccess(userId, propertyId);
  if (role !== 'owner' && role !== 'admin') {
    forbidden('Property not found or access denied');
  }
};

/** UA: Дозволити тільки власнику об'єкта (для керування учасниками). EN: Allow only property owner (for managing members). */
export const ensureStrictOwner = async (userId: string, propertyId: string): Promise<void> => {
  const role = await getPropertyAccess(userId, propertyId);
  if (role !== 'owner') {
    forbidden('Only the property owner can manage members');
  }
};

export const ensureCanAccessProperty = async (
  userId: string,
  propertyId: string,
): Promise<PropertyAccessRole> => {
  const role = await getPropertyAccess(userId, propertyId);
  assertFound(role, 'Property not found');
  return role;
};
