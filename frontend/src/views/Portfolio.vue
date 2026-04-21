<script setup>
import { ref, computed, onMounted } from 'vue'
import { contentService } from '@/services/content.service'

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'web', label: 'Web Apps' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'system', label: 'Sistemas & ERP' },
  { id: 'design', label: 'UI/UX Design' }
]

const activeCategory = ref('all')
const projects = ref([])
const loading = ref(true)

const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await contentService.getProjects()
    if (response.data.success) {
      projects.value = response.data.data.projects
    }
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects.value
  return projects.value.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <div class="pt-12 pb-24 animate-fade-in relative">
    <!-- Grade Decorativa de Fundo -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwaC02MHY2MGg2MFYweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-5 pointer-events-none -z-10"></div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-8 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">
        <i class="pi pi-star-fill text-xs"></i> Seleção Especial
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white leading-tight">
        Nosso <span class="gradient-text">Portfólio</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Transformamos ideias complexas em plataformas digitais elegantes. Conheça as nossas 
        soluções de destaque criadas sob medida para nossos clientes.
      </p>
    </section>

    <!-- Filters Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 mx-auto w-fit shadow-sm">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
          :class="[
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[400px]">
      <transition-group 
        name="project-list" 
        tag="div" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 relative isolate"
        >
          <!-- Hover Highlight -->
          <div class="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>

          <!-- Image Container -->
          <div class="relative h-64 overflow-hidden mask-image">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10"></div>
            <img 
              :src="project.image" 
              :alt="project.title"
              class="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
              loading="lazy"
            />
            
            <div class="absolute top-4 right-4 z-20">
              <button class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-colors tooltip" data-tip="Ver detalhes">
                <i class="pi pi-arrow-up-right text-sm"></i>
              </button>
            </div>

            <div class="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 pr-4">
              <span 
                v-for="(tag, index) in project.tags" 
                :key="index"
                class="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors cursor-default shadow-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 flex flex-col flex-grow relative z-10">
            <!-- category badge -->
            <div class="mb-4">
              <span class="text-xs font-bold tracking-wider uppercase bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-500/20">
                {{ categories.find(c => c.id === project.category)?.label }}
              </span>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
              {{ project.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 text-[15px] mb-8 flex-grow leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Divider -->
            <div class="h-px w-full bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent mb-6"></div>

            <a 
              :href="project.link" 
              class="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors mt-auto w-fit group/link"
            >
              Explorar Case <i class="pi pi-arrow-right text-xs transform group-hover/link:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>
      </transition-group>
      
      <!-- Empty State -->
      <transition name="fade">
        <div v-if="filteredProjects.length === 0" class="absolute inset-0 flex flex-col items-center justify-center py-20 text-center">
          <div class="w-24 h-24 bg-gray-100 dark:bg-surface-dark rounded-full flex items-center justify-center mb-6">
            <i class="pi pi-filter-slash text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sem resultados</h3>
          <p class="text-gray-500 dark:text-gray-400 text-lg max-w-sm">Nenhum projeto encontrado para esta categoria no momento.</p>
        </div>
      </transition>
    </section>

    <!-- Call to Action Banner -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative">
      <div class="relative rounded-[2.5rem] overflow-hidden p-12 md:p-16 text-center text-white border border-white/10 shadow-2xl">
        <!-- Background elements -->
        <div class="absolute inset-0 bg-gray-900 z-0"></div>
        <div class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600 via-gray-900 to-gray-900 z-0"></div>
        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-950 to-transparent z-0"></div>
        
        <div class="relative z-10 max-w-2xl mx-auto">
          <i class="pi pi-bolt text-5xl text-accent-400 mb-6 drop-shadow-lg"></i>
          <h2 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">Inspiração que gera <span class="gradient-text">Resultados.</span></h2>
          <p class="text-gray-300 text-lg mb-10 leading-relaxed font-light">
            O próximo case de sucesso pode ser a sua empresa. Fale com nossos especialistas 
            e construa algo extraordinário para os seus clientes.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link to="/services" class="btn btn-primary !px-8 !py-4 !rounded-full text-lg w-full sm:w-auto font-bold shadow-lg shadow-primary-500/25">
              Iniciar Projeto
            </router-link>
            <router-link to="/about" class="btn bg-white/10 hover:bg-white/20 !px-8 !py-4 !rounded-full text-lg w-full sm:w-auto font-bold border border-white/10 backdrop-blur-md transition-all">
              Conheça a Equipa
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* List transitions */
.project-list-move, /* apply transition to moving elements */
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(40px);
}

.project-list-leave-active {
  position: absolute; /* Ensures smooth list rearrangement */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
