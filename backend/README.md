# MUV Academy Backend

Backend API for MUV Educação e Engenharia - Technical Education Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure your MongoDB and Cloudinary credentials in `.env`

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/password` - Change password

### Users (Superadmin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/role` - Change role
- `PATCH /api/users/:id/toggle-active` - Toggle active status

### Courses
- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course
- `GET /api/courses/categories` - Get categories
- `GET /api/courses/featured` - Get featured courses
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `PATCH /api/courses/:id/publish` - Toggle publish (Admin)
- `DELETE /api/courses/:id` - Delete course (Superadmin)

### Modules
- `GET /api/modules/course/:courseId` - Get modules
- `POST /api/modules` - Create module (Admin)
- `PUT /api/modules/:id` - Update module (Admin)
- `DELETE /api/modules/:id` - Delete module (Admin)

### Lessons
- `GET /api/lessons/module/:moduleId` - Get lessons
- `GET /api/lessons/:id` - Get lesson
- `POST /api/lessons` - Create lesson (Admin)
- `PUT /api/lessons/:id` - Update lesson (Admin)
- `DELETE /api/lessons/:id` - Delete lesson (Admin)
- `POST /api/lessons/:id/materials` - Add material (Admin)
- `DELETE /api/lessons/:id/materials/:materialId` - Remove material (Admin)
- `POST /api/lessons/:id/complete` - Mark complete

### Enrollments
- `GET /api/enrollments/my` - My enrollments
- `GET /api/enrollments` - All enrollments (Admin)
- `POST /api/enrollments` - Create enrollment
- `GET /api/enrollments/:id` - Get enrollment
- `PATCH /api/enrollments/:id/approve` - Approve (Admin)
- `PATCH /api/enrollments/:id/reject` - Reject (Admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all read

### Upload
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/proof` - Upload payment proof
- `POST /api/upload/course-image` - Upload course image (Admin)
- `POST /api/upload/material` - Upload material (Admin)

### Stats
- `GET /api/stats/user` - User stats
- `GET /api/stats/dashboard` - Dashboard stats (Admin)
- `GET /api/stats/logs` - Logs (Superadmin)

## Roles

- **cliente**: Student - can enroll and access approved courses
- **admin**: Can manage courses, modules, lessons, and enrollments
- **superadmin**: Full access including user management
