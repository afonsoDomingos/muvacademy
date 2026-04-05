<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContentStore } from '@/stores/content'
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
            <div v-for="service in services" :key="service._id" class="glass-card group overflow-hidden flex flex-col hover:border-primary-500/30 transition-all duration-700">
               <!-- Imagem de Destaque -->
               <div class="h-48 w-full relative overflow-hidden bg-slate-900">
                  <img v-if="service.image" :src="service.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" loading="lazy" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-1000">
                     <i :class="service.icon || 'pi pi-cog'" class="text-5xl text-white/10"></i>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                  <!-- Ícone no canto -->
                  <div class="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-primary-500/90 backdrop-blur-sm flex items-center justify-center text-white shadow-xl">
                     <i :class="service.icon || 'pi pi-briefcase'" class="text-xl"></i>
                  </div>
               </div>
               
               <!-- Conteúdo do Cartão -->
               <div class="p-8 flex flex-col flex-1">
                  <h3 class="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                     {{ service.title?.pt || service.title }}
                  </h3>
                  <p class="text-slate-500 text-sm leading-relaxed mb-10 flex-1">
                     {{ service.description?.pt || service.description }}
                  </p>
                  
                  <div class="pt-6 border-t border-white/10 flex justify-between items-center mt-auto">
                     <ServiceRequestModal :service="service.title?.pt || service.title" />
                     <i class="pi pi-arrow-right text-slate-700 group-hover:text-primary-500 group-hover:translate-x-2 transition-all"></i>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>
