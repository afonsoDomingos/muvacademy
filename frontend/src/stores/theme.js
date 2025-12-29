import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const theme = ref('dark')

    const isDark = computed(() => theme.value === 'dark')

    function toggleTheme() {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        applyTheme()
        saveTheme()
    }

    function setTheme(newTheme) {
        theme.value = newTheme
        applyTheme()
        saveTheme()
    }

    function applyTheme() {
        if (theme.value === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    function saveTheme() {
        localStorage.setItem('muv-theme', theme.value)
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('muv-theme')
        if (savedTheme) {
            theme.value = savedTheme
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            theme.value = prefersDark ? 'dark' : 'dark' // Default to dark
        }
        applyTheme()
    }

    return { theme, isDark, toggleTheme, setTheme, initTheme }
}, {
    persist: {
        key: 'muv-theme',
        paths: ['theme']
    }
})
