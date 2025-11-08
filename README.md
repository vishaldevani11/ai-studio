# SaaS Backend Boilerplate

A production-ready SaaS backend boilerplate built with NestJS, TypeScript, PostgreSQL, and modern development practices.

## 🚀 Features

### Core Setup
- **NestJS** with TypeScript
- **ESLint** + **Prettier** + **Husky** pre-commit hooks
- Environment-based configuration with validation
- **GitHub Actions** CI/CD pipeline

### API & Developer Experience
- REST API with versioning (`/api/v1`)
- **Swagger** documentation auto-generated
- Request validation with `class-validator`
- Global exception filters & error handling
- Structured logging with request correlation
- CORS configuration with whitelist
- Public vs Private routes separation

### Security
- **JWT Authentication** (access + refresh tokens)
- Role-based authorization (admin, user)
- Password hashing with bcrypt
- **Helmet** for secure headers
- Rate limiting
- CSRF protection (configurable)

### Database
- **PostgreSQL** with **TypeORM**
- Migration support
- BaseEntity with UUID, timestamps, soft delete
- User and Image entities

### Modules
- **AuthModule**: Register, Login, Refresh, Logout
- **UserModule**: CRUD operations with role-based access
- **ImageModule**: AI image generation with Gemini API
- **BillingModule**: Stripe integration for subscriptions
- **HealthModule**: Health and readiness checks
- **CommonModule**: Shared utilities, guards, interceptors

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup everything automatically
git clone <repository-url>
cd saas-backend-boilerplate
node start-dev.js
```

### Option 2: Manual Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd saas-backend-boilerplate

# 2. Install dependencies
npm install

# 3. Setup environment (already configured)
# env.development is ready to use

# 4. Start the application
npm run start:dev
```

### Option 3: Test Everything
```bash
# Run comprehensive tests
node test-setup.js
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-backend-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment is pre-configured**
   ```bash
   # env.development is already configured with:
   # - Database: PostgreSQL (localhost:5432)
   # - Redis: localhost:6379 (optional)
   # - Storage: Local filesystem
   # - All API keys: Mock values ready
   ```

4. **Setup database** (if needed)
   ```bash
   # Create PostgreSQL database
   createdb saas_dev
   
   # Run migrations (automatic on first start)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 🎯 What You Get

After starting the application, you'll have:

- ✅ **API Server**: http://localhost:3000
- ✅ **Swagger Docs**: http://localhost:3000/api/docs
- ✅ **Health Check**: http://localhost:3000/api/v1/health
- ✅ **Metrics**: http://localhost:3000/api/v1/metrics/prometheus
- ✅ **Image Generation**: AI-powered with Gemini API
- ✅ **Authentication**: JWT-based with refresh tokens
- ✅ **File Storage**: Local + Cloud ready
- ✅ **Monitoring**: Prometheus metrics
- ✅ **Security**: Rate limiting, validation, CORS

## 🔧 Configuration

### Environment Variables

The application uses environment-specific configuration files:

- `env.development` - Development environment
- `env.production` - Production environment  
- `env.test` - Test environment

Key configuration options:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=saas_dev

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 📚 API Documentation

Once the application is running, you can access:

- **🌐 Swagger UI**: http://localhost:3000/api/docs
- **❤️ Health Check**: http://localhost:3000/api/v1/health
- **📊 Metrics**: http://localhost:3000/api/v1/metrics/prometheus
- **🔍 Health Metrics**: http://localhost:3000/api/v1/metrics/health

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ |
| `POST` | `/api/v1/auth/login` | Login user | ❌ |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | ❌ |
| `POST` | `/api/v1/auth/logout` | Logout user | ✅ |
| `GET` | `/api/v1/auth/profile` | Get user profile | ✅ |

### 👥 User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `GET` | `/api/v1/users` | Get all users | ✅ | Admin |
| `GET` | `/api/v1/users/:id` | Get user by ID | ✅ | User/Admin |
| `PATCH` | `/api/v1/users/:id` | Update user | ✅ | User/Admin |
| `PATCH` | `/api/v1/users/:id/change-password` | Change password | ✅ | User/Admin |
| `DELETE` | `/api/v1/users/:id` | Delete user | ✅ | Admin |

### 🎨 Image Generation Endpoints

| Method | Endpoint | Description | Auth Required | Rate Limit |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/v1/images/generate` | **Generate AI image with Gemini** | ✅ | 10/hour |
| `GET` | `/api/v1/images/generation-history` | Get generation history | ✅ | 100/hour |
| `POST` | `/api/v1/images` | Create new image | ✅ | 100/hour |
| `GET` | `/api/v1/images` | Get user's images | ✅ | 100/hour |
| `GET` | `/api/v1/images/:id` | Get image by ID | ✅ | 100/hour |
| `GET` | `/api/v1/images/:id/file` | Get image file | ✅ | 100/hour |
| `PATCH` | `/api/v1/images/:id` | Update image | ✅ | 100/hour |
| `DELETE` | `/api/v1/images/:id` | Delete image | ✅ | 100/hour |

### 💳 Billing & Subscription Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `POST` | `/api/v1/billing/subscription` | Create subscription | ✅ | User |
| `GET` | `/api/v1/billing/subscription` | Get subscription | ✅ | User |
| `PATCH` | `/api/v1/billing/subscription/cancel` | Cancel subscription | ✅ | User |
| `POST` | `/api/v1/billing/webhook` | Stripe webhook | ❌ | - |

### 📊 Monitoring & Health Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/health` | Application health check | ❌ |
| `GET` | `/api/v1/metrics/prometheus` | Prometheus metrics | ❌ |
| `GET` | `/api/v1/metrics/health` | Detailed health metrics | ✅ |
| `GET` | `/api/v1/metrics/json` | Metrics in JSON format | ✅ |

### 🎯 Image Generation API Details

#### Generate AI Image
```bash
POST /api/v1/images/generate
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

# Form Data:
- images: File[] (max 5 files, 10MB each)
- gender: "male" | "female"
- style: "classic" | "indian-traditional" | "modern" | "casual" | "formal" | "ethnic" | "western" | "fusion" | "vintage" | "contemporary"
- description: string (optional, max 500 chars)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "gender": "male",
    "style": "indian-traditional",
    "description": "Additional instructions",
    "originalImages": ["/uploads/raw/abc123.jpg"],
    "generatedImage": "/uploads/generated/xyz789.jpg",
    "createdAt": "2025-01-17T10:00:00.000Z",
    "status": "completed",
    "processingTime": 2500
  }
}
```

### 🔧 Quick API Testing

#### 1. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Generate Image
```bash
curl -X POST http://localhost:3000/api/v1/images/generate \
  -H "Authorization: Bearer <jwt-token>" \
  -F "images=@test-image.jpg" \
  -F "gender=male" \
  -F "style=modern" \
  -F "description=Make it look professional"
```

#### 4. Check Health
```bash
curl http://localhost:3000/api/v1/health
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🔍 Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run build
```

## 🚀 Deployment

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Environment Setup

1. **Production Database**: Set up PostgreSQL with proper credentials
2. **Environment Variables**: Configure production environment variables
3. **SSL Certificates**: Set up SSL for HTTPS
4. **Reverse Proxy**: Configure Nginx or similar
5. **Process Manager**: Use PM2 or similar for process management

### CI/CD

The GitHub Actions workflow includes:
- Linting and formatting checks
- Unit and integration tests
- Security audits
- Build verification
- Deployment (configure as needed)

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
├── database/              # Database entities and configuration
├── common/                # Shared utilities, guards, decorators
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── users/            # User management module
│   ├── images/           # Image generation module
│   ├── billing/          # Billing and subscriptions
│   └── health/           # Health checks
├── app.module.ts         # Root module
└── main.ts              # Application entry point
```

## 🔐 Security Features

- **JWT Authentication** with access and refresh tokens
- **Role-based Authorization** (Admin, User)
- **Password Hashing** with bcrypt
- **Rate Limiting** to prevent abuse
- **CORS** configuration
- **Helmet** for security headers
- **Input Validation** with class-validator
- **SQL Injection Protection** with TypeORM

## 🎯 Best Practices

- **Environment-based Configuration**: Separate configs for dev/prod/test
- **Validation**: Request validation with DTOs
- **Error Handling**: Global exception filters
- **Logging**: Structured logging with correlation IDs
- **Testing**: Unit and integration tests
- **Code Quality**: ESLint, Prettier, Husky hooks
- **Documentation**: Auto-generated Swagger docs
- **Security**: Multiple layers of security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at `/api/docs`

## 🔄 Updates

This boilerplate is regularly updated with:
- Latest NestJS features
- Security updates
- Best practices improvements
- New integrations and modules

---

**Happy Coding! 🚀**
