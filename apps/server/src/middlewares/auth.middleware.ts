import type { NextFunction, Request, Response } from 'express';
import { supabase } from '../configs/supabase';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user)
      return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  requireAuth,
};
