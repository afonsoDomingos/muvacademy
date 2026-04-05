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
    <div v-if="showBanner" class="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 min-h-[40px] flex items-center justify-center relative px-10 py-2 text-white text-[11px] sm:text-[13px] font-bold tracking-wider uppercase overflow-hidden z-[100]">
      <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
      
      <div class="relative flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center max-w-5xl w-full pr-6">
        <div class="flex items-center gap-2">
            <span class="animate-bounce text-base">👉</span>
            <span>{{ announcementText }}</span>
        </div>
        
        <a v-if="announcementLink" :href="announcementLink" target="_blank" class="inline-flex items-center gap-2 bg-white text-accent-700 hover:bg-accent-50 hover:text-accent-800 hover:scale-105 active:scale-95 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            VER MAIS <i class="pi pi-arrow-right text-[10px]"></i>
        </a>
      </div>
      
      <button @click="showBanner = false" class="absolute right-4 hover:rotate-90 hover:scale-125 transition-all text-white/80 hover:text-white p-1">
        <i class="pi pi-times"></i>
      </button>
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
