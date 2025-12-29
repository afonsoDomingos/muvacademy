import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref([])
    const unreadCount = ref(0)
    const loading = ref(false)

    const hasUnread = computed(() => unreadCount.value > 0)

    async function fetchNotifications(params = {}) {
        loading.value = true
        try {
            const response = await api.get('/notifications', { params })
            notifications.value = response.data.data.notifications
            unreadCount.value = response.data.data.unreadCount
            return notifications.value
        } catch (err) {
            console.error('Error fetching notifications:', err)
            return []
        } finally {
            loading.value = false
        }
    }

    async function fetchUnreadCount() {
        try {
            const response = await api.get('/notifications/unread-count')
            unreadCount.value = response.data.data.count
            return unreadCount.value
        } catch (err) {
            console.error('Error fetching unread count:', err)
            return 0
        }
    }

    async function markAsRead(id) {
        try {
            await api.patch(`/notifications/${id}/read`)
            const notification = notifications.value.find(n => n._id === id)
            if (notification && !notification.read) {
                notification.read = true
                unreadCount.value = Math.max(0, unreadCount.value - 1)
            }
            return { success: true }
        } catch (err) {
            return { success: false }
        }
    }

    async function markAllAsRead() {
        try {
            await api.patch('/notifications/read-all')
            notifications.value.forEach(n => n.read = true)
            unreadCount.value = 0
            return { success: true }
        } catch (err) {
            return { success: false }
        }
    }

    async function deleteNotification(id) {
        try {
            await api.delete(`/notifications/${id}`)
            const index = notifications.value.findIndex(n => n._id === id)
            if (index !== -1) {
                if (!notifications.value[index].read) {
                    unreadCount.value = Math.max(0, unreadCount.value - 1)
                }
                notifications.value.splice(index, 1)
            }
            return { success: true }
        } catch (err) {
            return { success: false }
        }
    }

    // Add notification locally (for real-time updates)
    function addNotification(notification) {
        notifications.value.unshift(notification)
        if (!notification.read) {
            unreadCount.value++
        }
    }

    return {
        notifications, unreadCount, loading, hasUnread,
        fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead,
        deleteNotification, addNotification
    }
})
