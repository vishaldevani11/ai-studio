export const API_VERSION = 'v1';
export const API_PREFIX = `api/${API_VERSION}`;

export const ROUTES = {
  AUTH: {
    REGISTER: 'auth/register',
    LOGIN: 'auth/login',
    REFRESH: 'auth/refresh',
    LOGOUT: 'auth/logout',
    PROFILE: 'auth/profile',
  },
  USERS: {
    BASE: 'users',
    PROFILE: 'users/profile',
  },
  IMAGES: {
    BASE: 'images',
    UPLOAD: 'images/upload',
  },
  BILLING: {
    BASE: 'billing',
    SUBSCRIPTION: 'billing/subscription',
    WEBHOOK: 'billing/webhook',
  },
  HEALTH: {
    BASE: 'health',
  },
} as const;

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const JWT_STRATEGIES = {
  ACCESS: 'jwt-access',
  REFRESH: 'jwt-refresh',
} as const;
