import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load views
const Home = () => import('@/views/Home.vue')
const Courses = () => import('@/views/Courses.vue')
const CourseDetail = () => import('@/views/CourseDetail.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Enrollment = () => import('@/views/Enrollment.vue')
const Profile = () => import('@/views/Profile.vue')
const LessonPlayer = () => import('@/views/LessonPlayer.vue')

// Admin views
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/AdminDashboard.vue')
const AdminCourses = () => import('@/views/admin/AdminCourses.vue')
const AdminCourseEdit = () => import('@/views/admin/AdminCourseEdit.vue')
const AdminEnrollments = () => import('@/views/admin/AdminEnrollments.vue')
const AdminUsers = () => import('@/views/admin/AdminUsers.vue')

const routes = [
    { path: '/', name: 'home', component: Home, meta: { title: 'MUV Academy - Início' } },
    { path: '/courses', name: 'courses', component: Courses, meta: { title: 'Cursos' } },
    { path: '/courses/:identifier', name: 'course-detail', component: CourseDetail, meta: { title: 'Detalhes do Curso' } },
    { path: '/login', name: 'login', component: Login, meta: { title: 'Entrar', guest: true } },
    { path: '/register', name: 'register', component: Register, meta: { title: 'Criar Conta', guest: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'Dashboard', requiresAuth: true } },
    { path: '/enroll/:courseId', name: 'enrollment', component: Enrollment, meta: { title: 'Inscrição', requiresAuth: true } },
    { path: '/profile', name: 'profile', component: Profile, meta: { title: 'Perfil', requiresAuth: true } },
    { path: '/learn/:courseId/lesson/:lessonId', name: 'lesson-player', component: LessonPlayer, meta: { title: 'Aula', requiresAuth: true } },

    // Admin routes
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            { path: '', name: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Admin - Dashboard' } },
            { path: 'courses', name: 'admin-courses', component: AdminCourses, meta: { title: 'Admin - Cursos' } },
            { path: 'courses/new', name: 'admin-course-new', component: AdminCourseEdit, meta: { title: 'Admin - Novo Curso' } },
            { path: 'courses/:id/edit', name: 'admin-course-edit', component: AdminCourseEdit, meta: { title: 'Admin - Editar Curso' } },
            { path: 'enrollments', name: 'admin-enrollments', component: AdminEnrollments, meta: { title: 'Admin - Inscrições' } },
            { path: 'users', name: 'admin-users', component: AdminUsers, meta: { title: 'Admin - Usuários', requiresSuperAdmin: true } }
        ]
    },

    // 404
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0 }
    }
})

// Navigation guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Update page title
    document.title = to.meta.title || 'MUV Academy'

    // Check auth requirements
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Check admin requirements
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return next({ name: 'dashboard' })
    }

    // Check superadmin requirements
    if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
        return next({ name: 'admin-dashboard' })
    }

    // Redirect authenticated users from guest pages
    if (to.meta.guest && authStore.isAuthenticated) {
        return next({ name: 'dashboard' })
    }

    next()
})

export default router
