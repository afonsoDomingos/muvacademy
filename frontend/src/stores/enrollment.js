import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useEnrollmentStore = defineStore('enrollments', () => {
    const enrollments = ref([])
    const myEnrollments = ref([])
    const loading = ref(false)
    const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

    async function fetchMyEnrollments(params = {}) {
        loading.value = true
        try {
            const response = await api.get('/enrollments/my', { params })
            myEnrollments.value = response.data.data.enrollments
            pagination.value = response.data.data.pagination
            return myEnrollments.value
        } catch (err) {
            console.error('Error fetching my enrollments:', err)
            return []
        } finally {
            loading.value = false
        }
    }

    async function fetchAllEnrollments(params = {}) {
        loading.value = true
        try {
            const response = await api.get('/enrollments', { params })
            enrollments.value = response.data.data.enrollments
            pagination.value = response.data.data.pagination
            return enrollments.value
        } catch (err) {
            console.error('Error fetching enrollments:', err)
            return []
        } finally {
            loading.value = false
        }
    }

    async function createEnrollment(data) {
        loading.value = true
        try {
            const response = await api.post('/enrollments', data)
            return { success: true, enrollment: response.data.data.enrollment }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao criar inscrição' }
        } finally {
            loading.value = false
        }
    }

    async function approveEnrollment(id, adminNotes = '') {
        try {
            const response = await api.patch(`/enrollments/${id}/approve`, { adminNotes })
            return { success: true, enrollment: response.data.data.enrollment }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao aprovar' }
        }
    }

    async function rejectEnrollment(id, rejectionReason, adminNotes = '') {
        try {
            const response = await api.patch(`/enrollments/${id}/reject`, { rejectionReason, adminNotes })
            return { success: true, enrollment: response.data.data.enrollment }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao rejeitar' }
        }
    }

    async function updateProgress(courseId, lessonId, data) {
        try {
            const response = await api.put(`/enrollments/${courseId}/progress`, { lessonId, ...data })
            return { success: true, enrollment: response.data.data.enrollment }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao atualizar progresso' }
        }
    }

    return {
        enrollments, myEnrollments, loading, pagination,
        fetchMyEnrollments, fetchAllEnrollments, createEnrollment,
        approveEnrollment, rejectEnrollment, updateProgress
    }
})
