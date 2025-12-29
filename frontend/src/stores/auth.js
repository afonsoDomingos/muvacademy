import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const accessToken = ref(null)
    const refreshToken = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')
    const isSuperAdmin = computed(() => user.value?.role === 'superadmin')
    const userRole = computed(() => user.value?.role || 'cliente')

    // Actions
    async function login(email, password) {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('/auth/login', { email, password })
            const { user: userData, accessToken: token, refreshToken: refresh } = response.data.data

            user.value = userData
            accessToken.value = token
            refreshToken.value = refresh

            return { success: true }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao fazer login'
            return { success: false, message: error.value }
        } finally {
            loading.value = false
        }
    }

    async function register(data) {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('/auth/register', data)
            const { user: userData, accessToken: token, refreshToken: refresh } = response.data.data

            user.value = userData
            accessToken.value = token
            refreshToken.value = refresh

            return { success: true }
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao registrar'
            return { success: false, message: error.value }
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout')
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            user.value = null
            accessToken.value = null
            refreshToken.value = null
            router.push('/login')
        }
    }

    async function fetchUser() {
        if (!accessToken.value) return
        try {
            const response = await api.get('/auth/me')
            user.value = response.data.data.user
        } catch (err) {
            if (err.response?.status === 401) {
                await logout()
            }
        }
    }

    async function updateProfile(data) {
        loading.value = true
        try {
            const response = await api.put('/auth/me', data)
            user.value = response.data.data.user
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao atualizar perfil' }
        } finally {
            loading.value = false
        }
    }

    async function changePassword(currentPassword, newPassword) {
        loading.value = true
        try {
            await api.put('/auth/password', { currentPassword, newPassword })
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao alterar senha' }
        } finally {
            loading.value = false
        }
    }

    async function refreshAccessToken() {
        if (!refreshToken.value) return false
        try {
            const response = await api.post('/auth/refresh', { refreshToken: refreshToken.value })
            accessToken.value = response.data.data.accessToken
            refreshToken.value = response.data.data.refreshToken
            return true
        } catch (err) {
            await logout()
            return false
        }
    }

    return {
        user, accessToken, refreshToken, loading, error,
        isAuthenticated, isAdmin, isSuperAdmin, userRole,
        login, register, logout, fetchUser, updateProfile, changePassword, refreshAccessToken
    }
}, {
    persist: {
        key: 'muv-auth',
        paths: ['user', 'accessToken', 'refreshToken']
    }
})
