import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCourseStore = defineStore('courses', () => {
    const courses = ref([])
    const currentCourse = ref(null)
    const categories = ref([])
    const loading = ref(false)
    const pagination = ref({ page: 1, limit: 12, total: 0, pages: 0 })

    async function fetchCourses(params = {}) {
        loading.value = true
        try {
            const response = await api.get('/courses', { params })
            courses.value = response.data.data.courses
            pagination.value = response.data.data.pagination
        } catch (err) {
            console.error('Error fetching courses:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchCourse(identifier) {
        loading.value = true
        try {
            const response = await api.get(`/courses/${identifier}`)
            currentCourse.value = response.data.data
            return response.data.data
        } catch (err) {
            console.error('Error fetching course:', err)
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchFeaturedCourses() {
        try {
            const response = await api.get('/courses/featured')
            return response.data.data.courses
        } catch (err) {
            console.error('Error fetching featured courses:', err)
            return []
        }
    }

    async function fetchCategories() {
        try {
            const response = await api.get('/courses/categories')
            categories.value = response.data.data.categories
            return categories.value
        } catch (err) {
            console.error('Error fetching categories:', err)
            return []
        }
    }

    async function createCourse(data) {
        loading.value = true
        try {
            const response = await api.post('/courses', data)
            return { success: true, course: response.data.data.course }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao criar curso' }
        } finally {
            loading.value = false
        }
    }

    async function updateCourse(id, data) {
        loading.value = true
        try {
            const response = await api.put(`/courses/${id}`, data)
            return { success: true, course: response.data.data.course }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao atualizar curso' }
        } finally {
            loading.value = false
        }
    }

    async function togglePublish(id) {
        try {
            const response = await api.patch(`/courses/${id}/publish`)
            return { success: true, course: response.data.data.course }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao alterar status' }
        }
    }

    async function deleteCourse(id) {
        try {
            await api.delete(`/courses/${id}`)
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Erro ao deletar curso' }
        }
    }

    return {
        courses, currentCourse, categories, loading, pagination,
        fetchCourses, fetchCourse, fetchFeaturedCourses, fetchCategories,
        createCourse, updateCourse, togglePublish, deleteCourse
    }
})
