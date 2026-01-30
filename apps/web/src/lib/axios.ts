import axios, { type AxiosInstance } from 'axios';
import { createClient } from '@/lib/supabase/client';

export const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}v1`;

export enum API {
  AUTH = '/auth',
  ME = '/users/me',
  PROPERTIES = '/properties',
  DASHBOARD = '/dashboard',
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    ContentType: 'application/json',
  },
});
export const apiAuth: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 0,
  headers: {
    ContentType: 'application/json',
  },
});

apiAuth.interceptors.request.use(async request => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  if (!accessToken) {
    return Promise.reject(new Error('No access token available'));
  }
  if (request.headers) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }
  return request;
});
