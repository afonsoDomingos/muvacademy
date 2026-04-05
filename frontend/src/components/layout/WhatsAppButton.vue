<script setup>
import { ref } from 'vue'

const showTooltip = ref(false)
const whatsappNumber = '258834802943'
const message = encodeURIComponent('Olá MUV Academy! Gostaria de saber mais sobre os vossos cursos e serviços de engenharia.')
</script>

<template>
  <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 group">
    <!-- Tooltip / Greeting -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div 
        v-if="showTooltip"
        class="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl max-w-[200px]"
      >
        <p class="text-xs text-white font-medium">👋 Precisa de ajuda ou quer inscrever-se? Fale connosco agora!</p>
      </div>
    </transition>

    <!-- Floating Button -->
    <a 
      :href="`https://wa.me/${whatsappNumber}?text=${message}`"
      target="_blank"
      class="relative group"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <!-- Pulse Effect -->
      <span class="absolute inset-0 rounded-full bg-green-500/40 animate-ping group-hover:animate-none"></span>
      
      <!-- Button Body -->
      <div class="relative w-16 h-16 bg-[#25D366] hover:bg-[#20ba59] rounded-2xl flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] transform transition-all duration-500 hover:rotate-[15deg] hover:scale-110 active:scale-95 group-hover:rounded-full">
        <i class="pi pi-whatsapp text-3xl text-white"></i>
      </div>

      <!-- Badge Notification -->
      <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-bounce"></span>
    </a>
  </div>
</template>

<style scoped>
.group-hover\:rounded-full:hover {
  border-radius: 9999px !important;
}
</style>
