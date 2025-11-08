import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'saas_dev',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    path: process.env.UPLOAD_PATH || './uploads',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || 'mock-api-key',
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  security: {
    csrfEnabled: process.env.CSRF_ENABLED === 'true',
    helmetEnabled: process.env.HELMET_ENABLED !== 'false',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_secret',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    defaultTtl: parseInt(process.env.REDIS_DEFAULT_TTL, 10) || 3600,
    maxItems: parseInt(process.env.REDIS_MAX_ITEMS, 10) || 1000,
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'local',
    s3: {
      bucket: process.env.S3_BUCKET || 'your-s3-bucket',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID || 'your-access-key',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'your-secret-key',
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
      apiKey: process.env.CLOUDINARY_API_KEY || 'your-api-key',
      apiSecret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
    },
  },
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
}));
