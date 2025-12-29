<script setup>
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const themeStore = useThemeStore()

// Apply theme on mount and watch for changes
onMounted(() => {
  themeStore.initTheme()
})

watch(() => themeStore.isDark, (isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
    <Toast position="top-right" />
    <ConfirmDialog />
    
    <AppHeader />
    
    <main class="min-h-[calc(100vh-160px)]">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    
    <AppFooter />
  </div>
</template>
