export const API_VERSION = 'v1';
export const API_PREFIX = `api/${API_VERSION}`;

export const ROUTES = {
  AUTH: {
    BASE: 'auth',
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
  HEALTH: {
    BASE: 'health',
  },
  ADMIN: {
    BASE: 'admin',
    CATEGORIES: 'admin/categories',
    INDUSTRIES: 'admin/industries',
    PRODUCT_BACKGROUNDS: 'admin/product-backgrounds',
    PRODUCT_POSES: 'admin/poses',
    PRODUCT_THEMES: 'admin/product-themes',
    PRODUCT_TYPES: 'admin/product-types',
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
