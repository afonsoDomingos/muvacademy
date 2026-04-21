import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useContentStore = defineStore('content', () => {
    const banners = ref([])
    const services = ref([])
    const projects = ref([])
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

    async function fetchProjects() {
        try {
            const response = await api.get('/content/projects')
            projects.value = response.data.data.projects
            return projects.value
        } catch (err) {
            console.error('Error fetching projects:', err)
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

    async function createProject(data) {
        return await api.post('/content/projects', data)
    }
    async function updateProject(id, data) {
        return await api.put(`/content/projects/${id}`, data)
    }
    async function deleteProject(id) {
        return await api.delete(`/content/projects/${id}`)
    }

    return {
        banners, services, projects, loading,
        fetchHomeBanners, fetchServices, fetchProjects,
        createBanner, updateBanner, deleteBanner,
        createService, updateService, deleteService,
        createProject, updateProject, deleteProject
    }
})
