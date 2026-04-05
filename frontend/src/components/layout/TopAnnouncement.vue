<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '@/services/api'

const showBanner = ref(false)
const items = ref([])
const currentIndex = ref(0)
let timer = null

const currentItem = computed(() => items.value[currentIndex.value] || null)

onMounted(async () => {
    try {
        const response = await api.get('/content/settings/top_announcement')
        const setting = response.data.data.setting
        
        if (setting && setting.active) {
            // Suporta novo formato array (messages) e também formato antigo (text/link isolados)
            if (setting.messages && setting.messages.length > 0) {
                items.value = setting.messages
            } else if (setting.text) {
                items.value = [{ text: setting.text, link: setting.link }]
            }
            
            if (items.value.length > 0) {
                showBanner.value = true
                if (items.value.length > 1) {
                    timer = setInterval(() => {
                        currentIndex.value = (currentIndex.value + 1) % items.value.length
                    }, 4500) // Troca a novidade a cada 4.5 segundos
                }
            }
        }
    } catch(err) {
        console.error('Failed to load announcement settings', err)
    }
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>

<template>
  <transition name="slide-down">
    <div v-if="showBanner" class="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 min-h-[46px] flex items-center justify-center relative px-10 py-2 text-white text-[11px] sm:text-[13px] font-bold tracking-wider uppercase overflow-hidden z-[100]">
      <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
      
      <div class="relative flex items-center justify-center text-center max-w-5xl w-full pr-8">
        <transition name="fade-slide" mode="out-in">
            <div :key="currentIndex" class="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
                <div class="flex items-center gap-2">
                    <span class="animate-bounce text-base">👉</span>
                    <span>{{ currentItem?.text }}</span>
                </div>
                
                <a v-if="currentItem?.link" :href="currentItem.link" target="_blank" class="inline-flex items-center gap-2 bg-white text-accent-700 hover:bg-accent-50 hover:text-accent-800 hover:scale-105 active:scale-95 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    VER MAIS <i class="pi pi-arrow-right text-[10px]"></i>
                </a>
            </div>
        </transition>
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

/* Transição do Carrossel de Texto Interno */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
