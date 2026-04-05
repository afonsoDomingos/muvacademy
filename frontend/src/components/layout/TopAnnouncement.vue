<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const showBanner = ref(false)
const announcementText = ref('')
const announcementLink = ref('')

onMounted(async () => {
    try {
        const response = await api.get('/content/settings/top_announcement')
        const setting = response.data.data.setting
        
        if (setting && setting.active) {
            announcementText.value = setting.text || ''
            announcementLink.value = setting.link || ''
            if (announcementText.value) {
                showBanner.value = true
            }
        }
    } catch(err) {
        // Fallback or silent catch
        console.error('Failed to load announcement settings')
    }
})
</script>

<template>
  <transition name="slide-down">
    <div v-if="showBanner" class="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 min-h-[40px] flex items-center justify-center relative px-10 py-1 text-white text-[11px] sm:text-[13px] font-bold tracking-wider uppercase overflow-hidden z-[100]">
      <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
      
      <p class="relative flex flex-wrap items-center justify-center gap-2 text-center">
        <span class="animate-bounce">👉</span>
        <span>{{ announcementText }}</span>
        <a v-if="announcementLink" :href="announcementLink" target="_blank" class="text-white/90 hover:text-white underline decoration-dashed decoration-1 underline-offset-4 ml-2 group">
            Ver Mais <i class="pi pi-arrow-right text-[10px] ml-1 group-hover:translate-x-1 transition-transform"></i>
        </a>
        <button @click="showBanner = false" class="ml-4 hover:scale-125 transition-transform absolute right-2">
          <i class="pi pi-times"></i>
        </button>
      </p>
    </div>
  </transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
