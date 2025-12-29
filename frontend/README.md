# MUV Academy Frontend

Frontend Vue.js 3 for MUV Educação e Engenharia - Technical Education Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- **Vue 3** with Composition API
- **Pinia** for state management with persistence
- **Vue Router** with lazy loading and guards
- **Vue I18n** for Portuguese/English translations
- **PrimeVue** for UI components
- **Tailwind CSS** for styling with custom dark/light themes
- **Cloudinary** integration for file uploads

## Pages

### Public
- `/` - Home
- `/courses` - Course listing
- `/courses/:id` - Course details
- `/login` - Login
- `/register` - Registration

### Authenticated
- `/dashboard` - Student dashboard
- `/profile` - User profile
- `/enroll/:courseId` - Course enrollment

### Admin (Admin/Superadmin)
- `/admin` - Admin dashboard
- `/admin/courses` - Course management
- `/admin/enrollments` - Enrollment approval

### Superadmin Only
- `/admin/users` - User management

## Theming

The app supports dark (default) and light themes. Toggle in the header.

## Internationalization

Supports Portuguese (pt) and English (en). Language can be:
- Auto-detected from browser
- Changed via header toggle
- Persisted in localStorage
