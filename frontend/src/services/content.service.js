import api from './api'

export const contentService = {
    // Banners
    getBanners: () => api.get('/content/banners'),
    createBanner: (data) => api.post('/content/banners', data),
    updateBanner: (id, data) => api.put(`/content/banners/${id}`, data),
    deleteBanner: (id) => api.delete(`/content/banners/${id}`),

    // Services
    getServices: () => api.get('/content/services'),
    createService: (data) => api.post('/content/services', data),
    updateService: (id, data) => api.put(`/content/services/${id}`, data),
    deleteService: (id) => api.delete(`/content/services/${id}`),

    // Settings
    getSetting: (key) => api.get(`/content/settings/${key}`),
    updateSetting: (key, value) => api.put(`/content/settings/${key}`, { value }),

    // Projects (Portfolio)
    getProjects: () => api.get('/content/projects'),
    createProject: (data) => api.post('/content/projects', data),
    updateProject: (id, data) => api.put(`/content/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/content/projects/${id}`),
    
    // Products (Shop)
    getProducts: () => api.get('/content/products'),
    createProduct: (data) => api.post('/content/products', data),
    updateProduct: (id, data) => api.put(`/content/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/content/products/${id}`)
}
