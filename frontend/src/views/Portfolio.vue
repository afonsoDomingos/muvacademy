<script setup>
import { ref, computed, onMounted } from 'vue'
import { contentService } from '@/services/content.service'
import Dialog from 'primevue/dialog'

const categories = ref([
  { id: 'all', label: 'Todos' }
])

const activeCategory = ref('all')
const projects = ref([])
const impactStats = ref([])
const aboutMuv = ref(null)
const loading = ref(true)
const showProjectDetail = ref(false)
const selectedProject = ref(null)
const activeThumbIndex = ref(0)

const fetchData = async () => {
  try {
    loading.value = true
    const [projRes, statsRes, aboutRes, catRes] = await Promise.all([
      contentService.getProjects(),
      contentService.getSetting('impact_stats'),
      contentService.getSetting('about_us'),
      contentService.getSetting('project_categories')
    ])
    
    if (projRes.data.success) {
      projects.value = projRes.data.data.projects
    }

    if (statsRes.data.success && statsRes.data.data.setting) {
      impactStats.value = statsRes.data.data.setting.value
    }

    if (aboutRes.data.success && aboutRes.data.data.setting) {
      aboutMuv.value = aboutRes.data.data.setting
    }

    if (catRes.data.success && catRes.data.data.setting) {
      categories.value = [
        { id: 'all', label: 'Todos' },
        ...catRes.data.data.setting.value
      ]
    } else {
      categories.value = [
        { id: 'all', label: 'Todos' },
        { id: 'web', label: 'Web Apps' },
        { id: 'mobile', label: 'Mobile' },
        { id: 'system', label: 'Sistemas & ERP' },
        { id: 'design', label: 'UI/UX Design' }
      ]
    }
  } catch (error) {
    console.error('Erro ao buscar dados do portfólio:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects.value
  return projects.value.filter(p => p.category === activeCategory.value)
})

const openProjectDetails = (project) => {
  selectedProject.value = project
  activeThumbIndex.value = 0
  showProjectDetail.value = true
}
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

    <!-- Quem Somos & Informação Histórica -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 transition-all duration-700">
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Quem Somos -->
        <div class="glass-card p-8 md:p-10 border-l-4 border-primary-500 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-users text-primary-500 text-sm"></i>
            </span>
            Quem Somos
          </h2>
          <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
            <p>
              A **MUV – EDUCAÇÃO & ENGENHARIA** é uma empresa moçambicana, fundada em 2005 e sediada na província de Maputo, 
              especializada no fornecimento de materiais elétricos, soluções para geração local e armazenamento de energia.
            </p>
            <p>
              Trazemos soluções tecnológicas que reduzem a forte dependência da rede elétrica nacional, melhoram a eficiência 
              e reduzem o custo da energia. Prestamos consultoria financeira e técnica, realizando estudos de viabilidade 
              de projetos de energias renováveis e centrais solares ligadas à rede.
            </p>
            <p class="font-semibold text-primary-600 dark:text-primary-400">
              Nossa estratégia foca-se em uso produtivo, iluminação pública, sistemas domésticos e indústrias de pequeno e médio porte.
            </p>
          </div>
        </div>

        <!-- Informação Histórica -->
        <div class="glass-card p-8 md:p-10 border-l-4 border-accent-500 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-accent-500/10 rounded-lg flex items-center justify-center">
              <i class="pi pi-history text-accent-500 text-sm"></i>
            </span>
            Informação Histórica
          </h2>
          <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
            <p>
              Fundada em 2005 com a missão de ser referência de excelência no setor energético moçambicano, a MUV opera há 
              **16 anos** no fornecimento de materiais e formação profissional.
            </p>
            <p>
              Atualmente em todas as províncias de Moçambique, expandimos para mercados internacionais com parcerias globais 
              em tecnologias de armazenamento de energia. Nosso modelo baseia-se em melhorar competências técnicas e 
              eficiência energética (B2C).
            </p>
          </div>
          
          <!-- Badge de Tempo -->
          <div class="mt-8 flex items-center gap-4 py-3 px-4 bg-accent-500/10 rounded-2xl w-fit border border-accent-500/20">
            <div class="text-3xl font-bold text-accent-600 dark:text-accent-400">+16</div>
            <div class="text-xs font-bold uppercase tracking-widest leading-tight text-gray-500 dark:text-gray-400">Anos de<br/>Experiência</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Stats Bar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-xl relative overflow-hidden group">
        <!-- Background Gradient Glow -->
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/20 transition-all duration-700"></div>
        
        <div v-for="(stat, index) in impactStats" :key="index" class="relative flex flex-col items-center text-center p-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <i :class="stat.icon" class="text-2xl text-primary-500 dark:text-primary-400"></i>
          </div>
          <div class="flex items-baseline justify-center gap-1 mb-2">
            <span class="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mt-1">+</span>
            <span class="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">{{ stat.value }}</span>
          </div>
          <p class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
          
          <!-- Divider for mobile/tablet -->
          <div v-if="index < impactStats.length - 1" class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
        </div>
      </div>
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
          :key="project._id"
          @click="openProjectDetails(project)"
          class="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 cursor-pointer relative isolate"
        >
          <!-- Hover Highlight -->
          <div class="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>

          <!-- Image Container -->
          <div class="relative h-64 overflow-hidden mask-image">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10"></div>
            <img 
              :src="project.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600'" 
              :alt="project.title"
              class="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
              loading="lazy"
            />
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
               <span class="px-6 py-2 bg-white text-gray-900 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                 Ver Detalhes
               </span>
            </div>

            <div class="absolute top-4 right-4 z-30">
              <a 
                :href="project.link" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-colors" 
                @click.stop
              >
                <i class="pi pi-arrow-up-right text-sm"></i>
              </a>
            </div>

            <div class="absolute bottom-4 left-4 z-30 flex flex-wrap gap-2 pr-4">
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
            
            <p class="text-gray-600 dark:text-gray-400 text-[15px] mb-8 flex-grow line-clamp-3 leading-relaxed">
              {{ project.description }}
            </p>

            <!-- Divider -->
            <div class="h-px w-full bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent mb-6"></div>

            <div class="flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white">
               <span>Ver Case Study</span>
               <i class="pi pi-arrow-right text-xs transform group-hover:translate-x-1 transition-transform text-primary-500"></i>
            </div>
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
    <!-- Project Detail Dialog -->
    <Dialog 
      v-model:visible="showProjectDetail" 
      modal 
      dismissableMask
      class="p-0 overflow-hidden bg-surface-dark border-none w-full max-w-5xl mx-4"
      contentClass="p-0 overflow-hidden"
      :showHeader="false"
    >
      <div v-if="selectedProject" class="flex flex-col lg:flex-row h-auto lg:h-[80vh]">
        <!-- Gallery Side -->
        <div class="w-full lg:w-3/5 bg-black flex flex-col relative h-[40vh] lg:h-full">
           <button @click="showProjectDetail = false" class="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors lg:hidden">
              <i class="pi pi-times"></i>
           </button>

           <!-- Main Image -->
           <div class="flex-1 w-full h-full relative overflow-hidden">
             <transition name="fade" mode="out-in">
               <img 
                 :key="activeThumbIndex"
                 :src="selectedProject.images?.[activeThumbIndex] || selectedProject.images?.[0]" 
                 class="w-full h-full object-contain"
               />
             </transition>
           </div>

           <!-- Thumbnails -->
           <div v-if="selectedProject.images?.length > 1" class="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 z-20">
             <div 
               v-for="(img, idx) in selectedProject.images" 
               :key="idx"
               @click="activeThumbIndex = idx"
               class="w-16 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shadow-xl"
               :class="activeThumbIndex === idx ? 'border-primary-500 scale-110 shadow-primary-500/20' : 'border-white/20 opacity-60 hover:opacity-100'"
             >
               <img :src="img" class="w-full h-full object-cover" />
             </div>
           </div>
        </div>

        <!-- Info Side -->
        <div class="w-full lg:w-2/5 p-8 md:p-12 bg-surface-dark flex flex-col overflow-y-auto">
          <div class="flex justify-between items-start mb-8">
            <span class="text-xs font-bold tracking-widest uppercase text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full">
              {{ categories.find(c => c.id === selectedProject.category)?.label }}
            </span>
            <button @click="showProjectDetail = false" class="hidden lg:flex w-8 h-8 rounded-full hover:bg-white/5 items-center justify-center text-slate-400 hover:text-white transition-colors">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
            {{ selectedProject.title }}
          </h2>

          <div class="flex flex-wrap gap-2 mb-8">
            <span v-for="tag in selectedProject.tags" :key="tag" class="px-3 py-1 bg-white/5 text-slate-400 text-xs font-semibold rounded-lg border border-white/5">
              {{ tag }}
            </span>
          </div>

          <div class="space-y-6 text-slate-400 leading-relaxed text-lg mb-12">
            <p v-for="(p, i) in selectedProject.description.split('\n')" :key="i">
              {{ p }}
            </p>
          </div>

          <div class="mt-auto pt-8 border-t border-white/5 flex gap-4">
            <a 
              v-if="selectedProject.link && selectedProject.link !== '#'"
              :href="selectedProject.link" 
              target="_blank" 
              class="flex-1 btn btn-primary !py-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-primary-500/20"
            >
              <i class="pi pi-external-link"></i>
              Visitar Projeto
            </a>
            <button 
              @click="showProjectDetail = false"
              class="flex-1 lg:hidden btn bg-white/5 hover:bg-white/10 !py-4 rounded-xl text-white font-bold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
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
