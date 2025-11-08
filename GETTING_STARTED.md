# Getting Started Guide

This guide will help you set up and run the SaaS Backend Boilerplate locally.

## 🚀 Quick Start

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd saas-backend-boilerplate

# Install dependencies
npm install
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb saas_dev

# Or using psql
psql -U postgres
CREATE DATABASE saas_dev;
\q
```

### 4. Environment Configuration

```bash
# Copy development environment file
cp env.development .env

# Edit the .env file with your database credentials
nano .env
```

Update the following in your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_DATABASE=saas_dev
```

### 5. Run Database Migrations

```bash
# Generate migration (if needed)
npm run migration:generate -- src/database/migrations/InitialMigration

# Run migrations
npm run migration:run
```

### 6. Start the Application

```bash
# Development mode
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🔧 Development Commands

```bash
# Code formatting
npm run format

# Linting
npm run lint

# Type checking
npm run build

# Database operations
npm run migration:generate -- src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert
```

## 📝 API Testing

### 1. Register a User

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

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Generate an Image (with JWT token)

```bash
curl -X POST http://localhost:3000/api/v1/images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful Sunset",
    "description": "A beautiful sunset over the mountains",
    "prompt": "A beautiful sunset over the mountains with vibrant colors"
  }'
```

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t saas-backend .

# Run container
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=password \
  -e DB_DATABASE=saas_dev \
  saas-backend
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_DATABASE` | Database name | `saas_dev` |
| `JWT_SECRET` | JWT secret key | `your-secret-key` |
| `JWT_REFRESH_SECRET` | JWT refresh secret | `your-refresh-secret` |
| `GEMINI_API_KEY` | Gemini API key | `your-gemini-key` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | CORS origins | `http://localhost:3000` |
| `THROTTLE_TTL` | Rate limit TTL | `60` |
| `THROTTLE_LIMIT` | Rate limit count | `100` |
| `LOG_LEVEL` | Log level | `info` |

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Migration Errors**
   ```
   Error: relation "users" already exists
   ```
   - Drop and recreate database
   - Or check existing migrations

3. **JWT Errors**
   ```
   Error: jwt malformed
   ```
   - Ensure JWT_SECRET is set
   - Check token format in requests

4. **Port Already in Use**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   - Change PORT in `.env`
   - Or kill process using port 3000

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run start:dev

# Check database connection
npm run typeorm -- query "SELECT 1"
```

## 📚 Next Steps

1. **Customize Configuration**: Update environment variables for your needs
2. **Add Features**: Extend modules with your business logic
3. **Database Design**: Modify entities and create new migrations
4. **API Documentation**: Update Swagger decorators
5. **Testing**: Add more comprehensive tests
6. **Deployment**: Set up production environment

## 🆘 Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review API documentation at `/api/docs`
- Create an issue for bugs or feature requests
- Check existing issues and discussions

---

**Happy Coding! 🚀**
