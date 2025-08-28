# NestJS User Management System

A complete user management system built with NestJS, TypeORM, and PostgreSQL. Features include authentication, friend requests, file uploads, and email notifications.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Email verification
- Password reset functionality
- Secure password hashing with bcrypt
- Access token refresh mechanism

### 👥 User Management
- Complete user profile management
- Location tracking (latitude, longitude)
- Profile picture handling
- Pagination support
- CRUD operations
- Role-based permissions

### 🤝 Friend System
- Send friend requests
- Accept/Reject friend requests
- View pending requests
- List friends
- Real-time status updates

### 📧 Email System
- Email verification
- Password reset emails
- Beautiful email templates
- Gmail SMTP integration
- OTP support

### 📁 File Management
- Secure file uploads
- File type validation
- Size restrictions
- File deletion
- Public/Private access control

### 📚 API Documentation
- Swagger/OpenAPI integration
- Detailed endpoint documentation
- Request/Response examples
- Authentication documentation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Gmail account (for email notifications)

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd user-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file in the root directory:
\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_management
DB_SYNC=true

# JWT Configuration
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=1d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# App Configuration
APP_URL=http://localhost:3000
PORT=3000
\`\`\`

## Database Schema

### User Entity
\`\`\`typescript
- id: number (Primary Key)
- name: string
- email: string (Unique)
- password: string (Hashed)
- phone: string (Optional)
- role: UserRole (ADMIN/USER)
- status: UserStatus (true/false)
- isEmailVerified: boolean
- profilePicture: string
- latitude: number
- longitude: number
- address: string
- city: string
- country: string
- friends: number[] (Array of friend IDs)
- createdAt: Date
- updatedAt: Date
\`\`\`

### FriendRequest Entity
\`\`\`typescript
- id: number (Primary Key)
- senderId: number (Foreign Key)
- receiverId: number (Foreign Key)
- status: FriendRequestStatus (PENDING/ACCEPTED/REJECTED)
- createdAt: Date
- updatedAt: Date
\`\`\`

## API Endpoints

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login
- POST /auth/verify-email - Verify email address
- POST /auth/forgot-password - Request password reset
- POST /auth/reset-password - Reset password
- GET /auth/refresh - Refresh access token

### User Management
- GET /users - Get all users (with pagination)
- GET /users/:id - Get user by ID
- PATCH /users/:id - Update user
- DELETE /users/:id - Delete user (Admin only)

### Friend System
- POST /friend-requests/send - Send friend request
- POST /friend-requests/:requestId/respond - Respond to friend request
- GET /friend-requests - Get friend requests
- GET /friend-requests/friends - Get user's friends

### File Management
- POST /files/upload - Upload file
- GET /files/:fileName - Get file
- DELETE /files/:fileName - Delete file (Admin only)
- GET /files - List all files (Admin only)

## Security Features

1. **Password Security**
   - Bcrypt hashing
   - Configurable salt rounds
   - Password strength validation

2. **JWT Security**
   - Token expiration
   - Refresh token rotation
   - Blacklist support

3. **File Upload Security**
   - File type validation
   - Size limits
   - Malware scanning
   - Secure storage

4. **API Security**
   - Rate limiting
   - CORS protection
   - Helmet security headers
   - Input validation

## Error Handling

The application uses a centralized error handling system with custom exceptions:

\`\`\`typescript
- BadRequestException
- UnauthorizedException
- NotFoundException
- ConflictException
\`\`\`

## Email Templates

1. **Verification Email**
   - Welcome message
   - Verification link
   - 24-hour expiration

2. **Password Reset**
   - Reset instructions
   - Secure reset link
   - 1-hour expiration

3. **OTP Email**
   - 6-digit code
   - 5-minute expiration
   - Usage instructions

## Development

1. Start in development mode:
\`\`\`bash
npm run start:dev
\`\`\`

2. Run tests:
\`\`\`bash
npm run test
npm run test:e2e
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Production Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start in production mode:
\`\`\`bash
npm run start:prod
\`\`\`

## Documentation

Access the Swagger documentation at:
\`\`\`
http://localhost:3000/api
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.