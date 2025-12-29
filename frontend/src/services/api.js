import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        if (authStore.accessToken) {
            config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }

        // Add language header
        const language = localStorage.getItem('muv-language') || 'pt'
        config.headers['Accept-Language'] = language

        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authStore = useAuthStore()
        const originalRequest = error.config

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            // Try to refresh token
            const refreshed = await authStore.refreshAccessToken()
            if (refreshed) {
                originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
                return api(originalRequest)
            } else {
                // Redirect to login
                router.push('/login')
            }
        }

        return Promise.reject(error)
    }
)

export default api
