<script setup>
import { ref } from 'vue'

const showBanner = ref(true)
const announcementText = ref('🔥 Novidade: MUV Academy 2026 agora com suporte a Consultoria e Energias Renováveis!')
</script>

<template>
  <transition name="slide-down">
    <div v-if="showBanner" class="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 h-10 flex items-center justify-center relative px-10 text-white text-[11px] sm:text-[13px] font-bold tracking-wider uppercase overflow-hidden z-[100]">
      <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
      
      <p class="relative flex items-center gap-2">
        <span class="animate-bounce">👉</span>
        {{ announcementText }}
        <button @click="showBanner = false" class="ml-4 hover:scale-125 transition-transform">
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
