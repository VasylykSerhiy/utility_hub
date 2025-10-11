import dotenv from 'dotenv';

dotenv.config();
module.exports = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT,
};
