# Image Generation API Documentation

## Overview

The Image Generation API provides AI-powered image generation using Gemini AI Studio. Users can upload reference images and generate new images with specified gender and style preferences.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Generate AI Image

**POST** `/images/generate`

Generate a new image using Gemini AI Studio based on uploaded reference images.

#### Request

**Content-Type:** `multipart/form-data`

**Rate Limit:** 10 requests per hour

**Parameters:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `images` | File[] | Yes | Reference images (max 5 files, 10MB each) | `image1.jpg, image2.png` |
| `gender` | String | Yes | Gender enum: `male`, `female` | `male` |
| `style` | String | Yes | Style enum: `classic`, `indian-traditional`, `modern`, `casual`, `formal`, `ethnic`, `western`, `fusion`, `vintage`, `contemporary` | `indian-traditional` |
| `description` | String | No | Additional instructions (max 500 chars) | `Please make the outfit more colorful and add traditional jewelry` |

#### Available Styles

- **classic** - Timeless, elegant designs with clean lines
- **indian-traditional** - Traditional Indian elements like sarees, kurtas, ethnic jewelry
- **modern** - Contemporary designs with current fashion trends
- **casual** - Relaxed, comfortable outfits for everyday wear
- **formal** - Professional, business-appropriate attire
- **ethnic** - Cultural and traditional elements from various backgrounds
- **western** - Western fashion trends and contemporary styling
- **fusion** - Blend of traditional and modern elements
- **vintage** - Retro and vintage fashion elements
- **contemporary** - Current, trendy designs reflecting modern fashion

#### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/images/generate \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "images=@reference1.jpg" \
  -F "images=@reference2.jpg" \
  -F "gender=male" \
  -F "style=indian-traditional" \
  -F "description=Please make the outfit more colorful and add traditional jewelry"
```

#### Response

**Success (201):**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "gender": "male",
    "style": "indian-traditional",
    "description": "Please make the outfit more colorful and add traditional jewelry",
    "originalImages": [
      "/uploads/raw/user123/abc123.jpg",
      "/uploads/raw/user123/def456.jpg"
    ],
    "generatedImage": "/uploads/generated/user123/xyz789.jpg",
    "createdAt": "2025-01-17T10:00:00.000Z",
    "status": "completed",
    "processingTime": 2500
  },
  "message": "Image generated successfully",
  "timestamp": "2025-01-17T10:00:00.000Z"
}
```

**Error (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid file format",
    "statusCode": 400,
    "timestamp": "2025-01-17T10:00:00.000Z",
    "path": "/api/v1/images/generate",
    "method": "POST"
  }
}
```

**Error (429 - Rate Limit):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Maximum 10 requests per 3600 seconds",
    "statusCode": 429,
    "retryAfter": 1800,
    "timestamp": "2025-01-17T10:00:00.000Z"
  }
}
```

### 2. Get Generation History

**GET** `/images/generation-history`

Retrieve the history of AI-generated images for the current user.

#### Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 10 | Items per page |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/v1/images/generation-history?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### Response

**Success (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "gender": "male",
      "style": "indian-traditional",
      "description": "Please make the outfit more colorful and add traditional jewelry",
      "originalImages": ["/uploads/raw/user123/abc123.jpg"],
      "generatedImage": "/uploads/generated/user123/xyz789.jpg",
      "createdAt": "2025-01-17T10:00:00.000Z",
      "status": "completed",
      "processingTime": 2500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "message": "Generation history retrieved successfully",
  "timestamp": "2025-01-17T10:00:00.000Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `IMAGE_GENERATION_FAILED` | Gemini AI generation failed |
| `FILE_UPLOAD_FAILED` | File upload/storage failed |
| `UNAUTHORIZED_ACCESS` | Invalid or missing JWT token |
| `QUOTA_EXCEEDED` | User quota exceeded |

## File Requirements

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

### File Limits
- **Maximum files:** 5 per request
- **Maximum file size:** 10MB per file
- **Total request size:** 50MB

## Rate Limiting

- **Generate Image:** 10 requests per hour
- **Generation History:** 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1642424400
```

## Security Features

1. **JWT Authentication** - All endpoints require valid JWT tokens
2. **Rate Limiting** - Prevents abuse and ensures fair usage
3. **File Validation** - Comprehensive file type and size validation
4. **Input Sanitization** - All inputs are sanitized and validated
5. **User Isolation** - Users can only access their own generated images

## Integration with Gemini AI Studio

The API integrates with Google's Gemini AI Studio for image generation:

- **Model:** Gemini Pro Vision
- **Input:** Reference images + text prompt
- **Output:** Generated image in JPEG format
- **Quality:** High resolution (1024x1024)
- **Processing Time:** Typically 2-5 seconds

## Storage

Generated images are stored in the configured storage provider:

- **Local Storage:** `/uploads/generated/{userId}/`
- **Cloud Storage:** Configurable (S3, Cloudinary, etc.)
- **Metadata:** Stored in PostgreSQL database
- **Retention:** Configurable based on subscription plan

## Monitoring & Analytics

The API includes comprehensive monitoring:

- **Metrics:** Request count, processing time, success rate
- **Logging:** Structured logging with correlation IDs
- **Error Tracking:** Automatic error reporting and alerting
- **Performance:** Response time monitoring

## Testing

### Test with cURL

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# 2. Login to get JWT token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Generate image (replace <token> with actual JWT)
curl -X POST http://localhost:3000/api/v1/images/generate \
  -H "Authorization: Bearer <token>" \
  -F "images=@test-image.jpg" \
  -F "gender=male" \
  -F "style=modern" \
  -F "description=Make it look professional"
```

### Test with Postman

1. Import the API collection
2. Set up authentication with JWT token
3. Upload test images
4. Test different gender/style combinations

## Support

For API support and questions:
- **Documentation:** `/api/docs` (Swagger UI)
- **Health Check:** `/api/v1/health`
- **Metrics:** `/api/v1/metrics/prometheus`
