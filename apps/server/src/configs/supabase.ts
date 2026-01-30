import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env.local',
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
