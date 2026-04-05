import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useContentStore = defineStore('content', () => {
    const banners = ref([])
    const services = ref([])
    const loading = ref(false)

    async function fetchHomeBanners() {
        try {
            const response = await api.get('/content/banners')
            banners.value = response.data.data.banners
            return banners.value
        } catch (err) {
            console.error('Error fetching banners:', err)
            return []
        }
    }

    async function fetchServices() {
        try {
            const response = await api.get('/content/services')
            services.value = response.data.data.services
            return services.value
        } catch (err) {
            console.error('Error fetching services:', err)
            return []
        }
    }

    // Admin CRUD
    async function createBanner(data) {
        return await api.post('/content/banners', data)
    }
    async function updateBanner(id, data) {
        return await api.put(`/content/banners/${id}`, data)
    }
    async function deleteBanner(id) {
        return await api.delete(`/content/banners/${id}`)
    }

    async function createService(data) {
        return await api.post('/content/services', data)
    }
    async function updateService(id, data) {
        return await api.put(`/content/services/${id}`, data)
    }
    async function deleteService(id) {
        return await api.delete(`/content/services/${id}`)
    }

    return {
        banners, services, loading,
        fetchHomeBanners, fetchServices,
        createBanner, updateBanner, deleteBanner,
        createService, updateService, deleteService
    }
})
