<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/content'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ServiceRequestModal from '@/components/services/ServiceRequestModal.vue'

const { t, locale } = useI18n()
const contentStore = useContentStore()
const services = ref([])
const loading = ref(true)

onMounted(async () => {
  window.scrollTo(0, 0)
  try {
     loading.value = true
     services.value = await contentStore.fetchServices()
  } finally {
     loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <AppHeader />
    
    <main class="pt-20">
      <!-- Hero -->
      <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-mesh opacity-20"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="max-w-3xl">
            <h3 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Especialização MUV</h3>
            <h1 class="text-5xl sm:text-7xl font-display font-bold text-white tracking-tighter leading-tight mb-8">
              Nossos Serviços
            </h1>
            <p class="text-slate-400 text-xl leading-relaxed">
              Descubra como a MUV pode impulsionar a sua organização através de consultoria especializada em Engenharia, Educação e Tecnologia.
            </p>
          </div>
        </div>
      </section>

      <!-- Grid -->
      <section class="py-24 bg-white/5 border-y border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div v-for="i in 3" :key="i" class="h-96 rounded-3xl bg-white/5 animate-pulse"></div>
          </div>
          
          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="service in services" :key="service._id" class="glass-card group p-10 hover:bg-primary-500/10 transition-all duration-700 border-white/5 hover:border-primary-500/30">
               <div class="mb-10 w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                  <i :class="service.icon || 'pi pi-cog'" class="text-2xl"></i>
               </div>
               <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                  {{ service.title?.pt || service.title }}
               </h3>
               <p class="text-slate-500 text-sm leading-relaxed mb-10 min-h-[100px]">
                  {{ service.description?.pt || service.description }}
               </p>
               
               <div class="pt-8 border-t border-white/10 flex justify-between items-center">
                  <ServiceRequestModal :service="service.title?.pt || service.title" />
                  <i class="pi pi-arrow-right text-slate-700 group-hover:text-primary-500 group-hover:translate-x-2 transition-all"></i>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>
