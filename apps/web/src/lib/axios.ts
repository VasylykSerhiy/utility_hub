import axios, { type AxiosInstance, isAxiosError } from 'axios';

import { Routes } from '@/constants/router';
import { createClient } from '@/lib/supabase/client';

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
}

const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');

export const API_URL = `${apiBaseUrl}/v1`;

export enum API {
  AUTH = '/auth',
  ME = '/users/me',
  PROPERTIES = '/properties',
  DASHBOARD = '/dashboard',
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: defaultHeaders,
});

export const apiAuth: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 0,
  headers: defaultHeaders,
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

apiAuth.interceptors.response.use(
  response => response,
  error => {
    if (isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.assign(Routes.SING_IN);
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
