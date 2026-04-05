<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import { useContentStore } from '@/stores/content'
import CourseCard from '@/components/courses/CourseCard.vue'
import afonsoImg from '@/assets/team/afonso.jpg'
import gilImg from '@/assets/team/gil.jpg'
import antonioImg from '@/assets/team/antonio.jpg'
import ServiceRequestModal from '@/components/services/ServiceRequestModal.vue'

const { t, tm, locale } = useI18n()
const courseStore = useCourseStore()
const contentStore = useContentStore()

const featuredCourses = ref([])
const banners = ref([])
const services = ref([])
const loading = ref(true)
const currentSlide = ref(0)
let sliderInterval = null

const startSlider = () => {
  sliderInterval = setInterval(() => {
    nextSlide()
  }, 6000)
}

const nextSlide = () => {
  if (banners.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % banners.value.length
  }
}

const prevSlide = () => {
  if (banners.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + banners.value.length) % banners.value.length
  }
}

const selectSlide = (index) => {
  currentSlide.value = index
  clearInterval(sliderInterval)
  startSlider()
}

onMounted(async () => {
  try {
    loading.value = true
    const [coursesData, bannersData, servicesData] = await Promise.all([
      courseStore.fetchFeaturedCourses(),
      contentStore.fetchHomeBanners(),
      contentStore.fetchServices()
    ])
    
    featuredCourses.value = coursesData || []
    
    // Default static banners if empty
    if (!bannersData || bannersData.length === 0) {
       banners.value = [
         {
           _id: 'default-1',
           title: { pt: 'MUV Academy 2026', en: 'MUV Academy 2026' },
           subtitle: { pt: 'Capacitação técnica de elite para profissionais do futuro.', en: 'Elite technical training for future professionals.' },
           ctaText: { pt: 'Ver Cursos', en: 'See Courses' },
           ctaLink: '/courses',
           image: '/images/hero-premium.png'
         },
         {
            _id: 'default-2',
            title: { pt: 'Infraestrutura & Energia', en: 'Infrastructure & Energy' },
            subtitle: { pt: 'Soluções completas em Engenharia e Energias Sustentáveis.', en: 'Complete solutions in Engineering and Sustainable Energies.' },
            ctaText: { pt: 'Consultoria MUV', en: 'MUV Consultancy' },
            ctaLink: '#consulting',
            image: '/images/courses/pvsyst.jpg'
         }
       ]
    } else {
      banners.value = bannersData
    }

    // Default static services if empty
    if (!servicesData || servicesData.length === 0) {
        services.value = [
            { id: 1, title: { pt: 'Consultoria Técnica', en: 'Technical Consultancy' }, description: { pt: 'Apoio especializado em infraestruturas e gestão de projetos.', en: 'Specialized support in infrastructure and project management.' }, icon: 'pi pi-briefcase' },
            { id: 2, title: { pt: 'Energia Solar', en: 'Solar Energy' }, description: { pt: 'Dimensionamento e instalação de sistemas fotovoltaicos.', en: 'Sizing and installation of photovoltaic systems.' }, icon: 'pi pi-sun' },
            { id: 3, title: { pt: 'Sistemas SAP', en: 'SAP Systems' }, description: { pt: 'Implementação e formação em módulos empresariais de elite.', en: 'Implementation and training in elite business modules.' }, icon: 'pi pi-box' }
        ]
    } else {
        services.value = servicesData
    }

    startSlider()
  } catch (e) {
    console.error('Error loading home data:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  clearInterval(sliderInterval)
})

const stats = [
  { value: '500+', key: 'students' },
  { value: '20+', key: 'courses' },
  { value: '10+', key: 'instructors' },
  { value: '300+', key: 'certificates' }
]

const team = [
  { id: 'afonso', image: afonsoImg },
  { id: 'gil', image: gilImg },
  { id: 'antonio', image: antonioImg }
]

const error = ref(null)
const showServiceModal = ref(false)
const selectedService = ref(null)

const openServiceModal = (service) => {
  selectedService.value = service
  showServiceModal.value = true
}
</script>

<template>
  <div class="bg-mesh min-h-screen">
    <!-- Hero Slider Section -->
    <section class="relative min-h-[95vh] flex items-center overflow-hidden">
      <!-- Animated Background elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

      <!-- Carousel Items -->
      <transition-group name="fade" tag="div" class="absolute inset-0">
        <div 
          v-for="(banner, index) in banners" 
          :key="banner._id"
          v-show="currentSlide === index"
          class="absolute inset-0 flex items-center"
        >
          <!-- Background Image with Overlay -->
          <div class="absolute inset-0 z-0">
            <img :src="banner.image" class="w-full h-full object-cover opacity-30" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div class="max-w-4xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                MUV ACADEMY 2026
              </div>
              
              <h1 class="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-white mb-8 tracking-tighter animate-fade-in leading-tight">
                <span class="gradient-text">{{ banner.title?.[locale] || banner.title?.pt }}</span>
              </h1>
              
              <p class="text-xl sm:text-2xl text-slate-400 mb-12 leading-relaxed animate-slide-up" style="animation-delay: 0.2s">
                {{ banner.subtitle?.[locale] || banner.subtitle?.pt }}
              </p>
              
              <div class="flex flex-col sm:flex-row gap-6 animate-slide-up" style="animation-delay: 0.4s">
                <RouterLink :to="banner.ctaLink" class="btn btn-primary text-lg px-10 py-5">
                  <i class="pi pi-bolt text-xl"></i>
                  {{ banner.ctaText?.[locale] || banner.ctaText?.pt }}
                </RouterLink>
                <a href="#services" class="btn btn-secondary text-lg px-10 py-5">
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Slider Controls -->
      <div v-if="banners.length > 1" class="absolute bottom-10 left-12 z-20 flex gap-4">
        <button @click="prevSlide" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <i class="pi pi-chevron-left"></i>
        </button>
        <button @click="nextSlide" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>

      <!-- Indicators -->
      <div v-if="banners.length > 1" class="absolute bottom-14 right-12 z-20 flex gap-2">
        <button 
          v-for="(b, i) in banners" :key="i"
          @click="selectSlide(i)"
          class="h-1.5 transition-all duration-500 rounded-full"
          :class="currentSlide === i ? 'w-10 bg-primary-500' : 'w-4 bg-white/20 hover:bg-white/40'"
        ></button>
      </div>

      <!-- Scroll Down Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block group">
        <a href="#services" class="flex flex-col items-center gap-3">
          <span class="text-[9px] font-bold tracking-[0.4em] uppercase text-white/30 group-hover:text-primary-400 transition-colors">Role para Ver Mais</span>
          <div class="w-5 h-8 rounded-full border border-white/20 flex justify-center p-1 group-hover:border-primary-500/40 transition-colors">
            <div class="w-1 h-1.5 bg-primary-500 rounded-full animate-mouse-scroll"></div>
          </div>
        </a>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-32 relative overflow-hidden bg-slate-950/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 class="text-accent-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">MUV Além do Ensino</h2>
            <h3 class="text-4xl sm:text-6xl font-display font-bold mb-8 text-white leading-tight">
              Consultoria & Soluções em <span class="gradient-text">Engenharia</span>
            </h3>
            <p class="text-xl text-slate-400 mb-10 leading-relaxed">
              Não somos apenas uma academia. Somos parceiros estratégicos para o desenvolvimento tecnológico de Moçambique, fornecendo sistemas de energia e inteligência técnica.
            </p>
            
            <div class="grid sm:grid-cols-2 gap-4 mb-12">
              <div 
                v-for="service in services" 
                :key="service._id || service.id" 
                class="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/30 group transition-all cursor-pointer"
                @click="openServiceModal(service)"
              >
                <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i :class="service.icon" class="text-primary-400 text-xl"></i>
                </div>
                <h4 class="text-white font-bold mb-2">{{ service.title?.[locale] || service.title?.pt }}</h4>
                <p class="text-slate-500 text-sm mb-4">{{ service.description?.[locale] || service.description?.pt }}</p>
                <span class="text-primary-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Solicitar <i class="pi pi-arrow-right text-[10px]"></i>
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-6">
              <button @click="openServiceModal({title: {pt: 'Consultoria Geral', en: 'General Consultancy'}})" class="btn btn-accent px-10 py-5">
                Solicitar Consultoria
              </button>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-[40px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div class="relative glass-card p-16 rounded-[40px] border-white/20 flex flex-col justify-center items-center text-center">
              <div class="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 shadow-2xl flex items-center justify-center mb-10">
                <i class="pi pi-briefcase text-6xl text-accent-400"></i>
              </div>
              <h4 class="text-3xl font-bold mb-4 text-white">Parceria de Elite</h4>
              <p class="text-slate-400 text-lg leading-relaxed">Desenvolvemos inteligência técnica para as maiores infraestruturas de Moçambique.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section (Simplified for Focus) -->
    <section id="features" class="py-24 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-12">
         <div v-for="feat in [
           { icon: 'pi pi-verified', text: 'Certificação Internacional' },
           { icon: 'pi pi-sun', text: 'Soluções de Energia Verde' },
           { icon: 'pi pi-users', text: 'Suporte Técnico 24/7' },
           { icon: 'pi pi-book', text: 'Conteúdo de Elite' }
         ]" :key="feat.text" class="flex items-center gap-4">
           <i :class="feat.icon" class="text-primary-400 text-2xl"></i>
           <span class="text-white font-bold tracking-wide uppercase text-xs">{{ feat.text }}</span>
         </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">
            {{ t('home.team.title') }}
          </h2>
          <h3 class="text-4xl sm:text-6xl font-display font-bold text-white">
            {{ t('home.team.subtitle') }}
          </h3>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <div
            v-for="member in team"
            :key="member.id"
            class="glass-card p-10 rounded-[32px] group text-center"
          >
            <div class="relative w-48 h-48 mx-auto mb-8">
              <div class="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <img
                :src="member.image"
                :alt="t(`home.team.members.${member.id}.name`)"
                class="relative w-full h-full object-cover rounded-full border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <h4 class="text-2xl font-bold mb-2 text-white">
              {{ t(`home.team.members.${member.id}.name`) }}
            </h4>
            <p class="text-primary-400 font-bold tracking-widest uppercase text-[10px] mb-6">
              {{ t(`home.team.members.${member.id}.role`) }}
            </p>
            <p class="text-slate-400 leading-relaxed text-sm">
              {{ t(`home.team.members.${member.id}.bio`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-40 relative overflow-hidden">
      <div class="absolute inset-0 bg-primary-600"></div>
      <div class="absolute inset-0 bg-mesh opacity-40"></div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-5xl sm:text-7xl font-display font-bold text-white mb-8 tracking-tighter">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-xl sm:text-2xl text-white/80 mb-16 leading-relaxed">
          {{ t('home.cta.subtitle') }}
        </p>
        <RouterLink to="/register" class="btn bg-white text-slate-900 border-none px-12 py-6 text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-100">
          {{ t('home.cta.button') }}
          <i class="pi pi-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
        </RouterLink>
      </div>
    </section>
    <ServiceRequestModal 
      v-model:visible="showServiceModal" 
      :service="selectedService"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-glow {
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

@keyframes mouse-scroll {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

.animate-mouse-scroll {
  animation: mouse-scroll 1.5s infinite;
}
</style>

