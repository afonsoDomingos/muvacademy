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
import api from '@/services/api'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import Dialog from 'primevue/dialog'

const { t, tm, locale } = useI18n()
const courseStore = useCourseStore()
const contentStore = useContentStore()
const route = useRoute()

const featuredCourses = ref([])
const banners = ref([])
const services = ref([])
const workshops = ref([])
const partners = ref([])
const aboutUs = ref({
   title: 'MUV Educação e Engenharia',
   description: 'A MUV é uma empresa moçambicana especializada em Educação, Engenharia e Transformação Digital, comprometida em impulsionar o desenvolvimento sustentável de pessoas e organizações. Acreditamos que educação e tecnologia são os motores do progresso — por isso, unimos formação de excelência e soluções tecnológicas práticas para preparar profissionais e empresas para os desafios do futuro.',
   image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
   mission: 'Contribuir para o avanço da educação e da engenharia, oferecendo formações de excelência e soluções consultivas inovadoras, atuando como um hub integrador de marcas, pessoas e conhecimentos que impulsionam o desenvolvimento sustentável.',
   vision: 'Ser reconhecida como uma referência global em educação técnico-profissional e consultoria em engenharia, impulsionando a inovação, a formação de profissionais qualificados e o sucesso de projetos estratégicos em Moçambique e além-fronteiras.',
   values: ['Excelência Educacional', 'Inovação', 'Colaboração', 'Integridade', 'Sustentabilidade']
})
const loading = ref(true)
const currentSlide = ref(0)
let sliderInterval = null

const handleAutoScroll = () => {
    if (route.name === 'about') scrollTo('about')
    if (route.name === 'services') scrollTo('services')
}

const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}

watch(() => route.name, () => {
    handleAutoScroll()
})

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
    const [coursesData, bannersData, servicesData, workshopsRes, aboutRes, partnersRes] = await Promise.all([
      courseStore.fetchFeaturedCourses().catch(e => { console.error('FeaturedCourses Error:', e); return [] }),
      contentStore.fetchHomeBanners().catch(e => { console.error('Banners Error:', e); return [] }),
      contentStore.fetchServices().catch(e => { console.error('Services Error:', e); return [] }),
      api.get('/workshops').catch(e => { console.error('Workshops Error:', e); return { data: { data: { workshops: [] } } } }),
      api.get('/content/settings/about_us').catch(e => { console.error('About Error:', e); return { data: { data: { setting: null } } } }),
      api.get('/content/settings/partners').catch(e => { console.error('Partners Error:', e); return { data: { data: { setting: null } } } })
    ])
    
    featuredCourses.value = coursesData || []
    banners.value = bannersData || []
    services.value = servicesData || []
    workshops.value = workshopsRes.data?.data?.workshops || []
    
    if (aboutRes.data?.data?.setting?.value) {
      aboutUs.value = aboutRes.data.data.setting.value
    }

    if (partnersRes.data?.data?.setting?.value) {
      partners.value = partnersRes.data.data.setting.value
    }
    
    // Smooth scroll for pretty URLs
    setTimeout(handleAutoScroll, 300)
    
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

const showWorkshopImageModal = ref(false)
const selectedWorkshopImage = ref(null)

const openWorkshopImage = (workshop) => {
  selectedWorkshopImage.value = workshop
  showWorkshopImageModal.value = true
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
                <a href="#services" class="btn btn-secondary text-lg px-10 py-5 !text-white">
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
    <section id="services" class="py-16 lg:py-32 relative overflow-hidden bg-slate-950/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
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
    <section id="features" class="py-12 lg:py-24 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row flex-wrap justify-between gap-8 md:gap-12">
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

    <!-- Workshops Section -->
    <section v-if="workshops.length > 0" class="py-16 lg:py-32 bg-slate-900/40 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div class="max-w-2xl">
            <h3 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">MUV Eventos</h3>
            <h2 class="text-4xl sm:text-6xl font-display font-bold text-white tracking-tighter">Workshops Semanais</h2>
            <p class="text-slate-400 text-lg mt-6">Promoção de inteligência técnica e networking de elite.</p>
          </div>
          <RouterLink to="/courses" class="btn btn-primary !py-3 !px-8 text-sm group shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-shadow">
            Ver Todos Eventos <i class="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </RouterLink>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="workshop in workshops" :key="workshop._id" class="glass-card group flex flex-col overflow-hidden hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]">
            <div @click="openWorkshopImage(workshop)" class="cursor-pointer relative aspect-square w-full overflow-hidden bg-white/5 flex items-center justify-center p-2">
              <img :src="workshop.image" class="w-full h-full object-contain transition-transform duration-700 drop-shadow-xl" loading="lazy" />
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <i class="pi pi-search-plus text-5xl text-white"></i>
              </div>
            </div>
            <div class="p-8 flex-1 flex flex-col">
              <div class="mb-4 self-start px-4 py-1.5 bg-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-primary-500/30">
                {{ new Date(workshop.date).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) }}
              </div>
              <h4 class="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">{{ workshop.title[locale] }}</h4>
              <p class="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">{{ workshop.description[locale] }}</p>
              
              <div class="flex items-center justify-between mt-auto">
                 <div class="flex items-center gap-2 text-slate-500">
                    <i class="pi pi-map-marker text-xs"></i>
                    <span class="text-[10px] font-bold uppercase tracking-widest">{{ workshop.location[locale] }}</span>
                 </div>
                 <a :href="workshop.link" target="_blank" class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary-500 hover:border-primary-500 transition-all">
                    <i class="pi pi-arrow-up-right"></i>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission / Vision / Values Section -->
    <section id="about" class="py-16 lg:py-32 relative overflow-hidden bg-white/5 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-16 lg:mb-24">
          <div class="relative">
            <h3 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">A Nossa Identidade</h3>
            <h2 class="text-4xl sm:text-6xl font-display font-bold text-white tracking-tighter leading-tight">
              {{ aboutUs.title }}
            </h2>
            <p class="text-slate-400 text-lg mt-8 leading-relaxed mb-12 whitespace-pre-line">
              {{ aboutUs.description }}
            </p>
            <div class="relative rounded-[2rem] overflow-hidden group aspect-video shadow-2xl border border-white/10">
               <img :src="aboutUs.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
               <div class="absolute bottom-6 left-6 flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Engenharia de Excelência</span>
               </div>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-6">
             <div class="glass-card p-8 group hover:bg-primary-500/10 transition-all duration-500 border-white/10 hover:border-primary-500/40">
                <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform">
                   <i class="pi pi-target text-xl"></i>
                </div>
                <h4 class="text-white font-bold mb-3">Missão</h4>
                <p class="text-slate-500 text-[11px] leading-relaxed italic whitespace-pre-line">{{ aboutUs.mission }}</p>
             </div>
             <div class="glass-card p-8 group hover:bg-accent-500/10 transition-all duration-500 border-white/10 hover:border-accent-500/40">
                <div class="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 mb-6 group-hover:scale-110 transition-transform">
                   <i class="pi pi-eye text-xl"></i>
                </div>
                <h4 class="text-white font-bold mb-3">Visão</h4>
                <p class="text-slate-500 text-[11px] leading-relaxed italic whitespace-pre-line">{{ aboutUs.vision }}</p>
             </div>
             <div class="glass-card p-8 sm:col-span-2 group hover:bg-white/10 transition-all duration-500 border-white/10 hover:border-white/20">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                   <i class="pi pi-verified text-xl"></i>
                </div>
                <h4 class="text-white font-bold mb-3 uppercase tracking-tighter">Os Nossos Valores</h4>
                <div class="flex flex-wrap gap-x-8 gap-y-4">
                   <div v-for="val in aboutUs.values" :key="val" class="flex items-center gap-2">
                       <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                       <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{{ val }}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Infinite Scroll -->
    <section v-if="partners.length > 0" class="py-12 border-b border-white/5 bg-slate-950/40 relative overflow-hidden flex flex-col justify-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center w-full z-10">
        <h3 class="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Os Nossos Parceiros e Clientes</h3>
      </div>
      
      <!-- Gradient Masks -->
      <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-mesh to-transparent z-10 pointer-events-none"></div>
      <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-mesh to-transparent z-10 pointer-events-none"></div>

      <div class="flex overflow-hidden group w-full">
        <div class="animate-scroll shrink-0 flex gap-20 min-w-full items-center justify-around group-hover:[animation-play-state:paused] px-10">
          <div v-for="(p, i) in partners" :key="'A'+i" class="w-40 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
             <img v-if="p.image" :src="p.image" :alt="p.name" class="max-w-full max-h-full object-contain" />
             <span v-else class="text-xl font-bold">{{ p.name }}</span>
          </div>
        </div>
        <div class="animate-scroll shrink-0 flex gap-20 min-w-full items-center justify-around group-hover:[animation-play-state:paused] px-10" aria-hidden="true">
          <div v-for="(p, i) in partners" :key="'B'+i" class="w-40 h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
             <img v-if="p.image" :src="p.image" :alt="p.name" class="max-w-full max-h-full object-contain" />
             <span v-else class="text-xl font-bold">{{ p.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Team -->
    <section class="py-16 lg:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 lg:mb-20">
          <h2 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">
            {{ t('home.team.title') }}
          </h2>
          <h3 class="text-4xl sm:text-6xl font-display font-bold text-white">
            {{ t('home.team.subtitle') }}
          </h3>
        </div>

        <div class="grid md:grid-cols-3 gap-8 lg:gap-10">
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
    <section class="py-20 lg:py-40 relative overflow-hidden">
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

    <!-- Workshop Image Preview Modal -->
    <Dialog 
      v-model:visible="showWorkshopImageModal" 
      modal 
      :header="selectedWorkshopImage?.title?.[locale]"
      class="p-fluid w-full max-w-4xl bg-surface-dark border-none"
      :style="{ borderRadius: '24px', overflow: 'hidden' }"
      contentClass="p-0 border-none bg-transparent flex flex-col"
      headerClass="bg-surface-dark text-white border-b border-white/10 p-6"
    >
      <div v-if="selectedWorkshopImage" class="flex flex-col h-full">
        <div class="w-full bg-slate-950 flex items-center justify-center p-4 h-[70vh]">
           <img :src="selectedWorkshopImage.image" class="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        <div class="p-6 bg-surface-dark border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div>
             <p class="text-white font-bold text-lg mb-1">{{ selectedWorkshopImage.title?.[locale] }}</p>
             <p class="text-slate-400 text-sm">📍 {{ selectedWorkshopImage.location?.[locale] }} &nbsp;|&nbsp; 🗓️ {{ new Date(selectedWorkshopImage.date).toLocaleDateString() }}</p>
           </div>
           <a :href="selectedWorkshopImage.link" target="_blank" class="btn btn-primary !py-4 !px-8 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow whitespace-nowrap">
             Inscrever-se Agora <i class="pi pi-arrow-up-right ml-2"></i>
           </a>
        </div>
      </div>
    </Dialog>
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

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.animate-scroll {
  animation: scroll 35s linear infinite;
}
</style>

