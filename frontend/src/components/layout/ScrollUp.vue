<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

function handleScroll() {
  showButton.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <transition name="fade">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-[60] w-12 h-12 rounded-full bg-primary-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Scroll to top"
    >
      <i class="pi pi-arrow-up text-lg group-hover:-translate-y-1 transition-transform"></i>
    </button>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
