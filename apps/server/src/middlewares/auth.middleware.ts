import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';

import { User } from '../models/database';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return res.status(401).json({ message: 'Invalid token' });

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    req.user = mongoUser;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  requireAuth,
};
