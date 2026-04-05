<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/courses/CourseCard.vue'
import afonsoImg from '@/assets/team/afonso.jpg'
import gilImg from '@/assets/team/gil.jpg'
import antonioImg from '@/assets/team/antonio.jpg'

const { t, tm } = useI18n()
const courseStore = useCourseStore()

const featuredCourses = ref([])
const loading = ref(true)

const features = [
  { icon: 'pi pi-book', key: 'quality' },
  { icon: 'pi pi-verified', key: 'certificate' },
  { icon: 'pi pi-users', key: 'support' },
  { icon: 'pi pi-clock', key: 'access' }
]

const stats = [
  { value: '500+', key: 'students' },
  { value: '20+', key: 'courses' },
  { value: '10+', key: 'instructors' },
  { value: '300+', key: 'certificates' }
]

const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    console.log('Fetching featured courses...')
    const data = await courseStore.fetchFeaturedCourses()
    console.log('Featured courses data:', data)
    
    if (data && data.length > 0) {
      featuredCourses.value = data
    } else {
      console.warn('No featured courses returned from API')
    }
  } catch (e) {
    console.error('Error loading featured courses:', e)
    error.value = 'Failed to load featured courses. Please check connection.'
  } finally {
    loading.value = false
  }
})

const team = [
  { id: 'afonso', image: afonsoImg },
  { id: 'gil', image: gilImg },
  { id: 'antonio', image: antonioImg }
]
</script>

<template>
  <div class="bg-mesh min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[95vh] flex items-center overflow-hidden">
      <!-- Animated Background elements -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            MUV ACADEMY 2026
          </div>
          
          <h1 class="text-5xl sm:text-6xl lg:text-8xl font-display font-bold text-white mb-8 tracking-tighter animate-fade-in">
            <span class="gradient-text">{{ t('home.hero.title') }}</span>
          </h1>
          
          <p class="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style="animation-delay: 0.2s">
            {{ t('home.hero.subtitle') }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style="animation-delay: 0.4s">
            <RouterLink to="/courses" class="btn btn-primary text-lg px-10 py-5">
              <i class="pi pi-play-circle text-xl"></i>
              {{ t('home.hero.cta') }}
            </RouterLink>
            <a href="#features" class="btn btn-secondary text-lg px-10 py-5">
              {{ t('home.hero.secondary') }}
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 animate-slide-up" style="animation-delay: 0.6s">
          <div v-for="stat in stats" :key="stat.key" class="glass-card p-10 rounded-3xl text-center group hover:border-primary-500/50 transition-all duration-500">
            <div class="text-4xl sm:text-5xl font-black text-white mb-3 group-hover:scale-110 group-hover:text-glow transition-all">
              {{ stat.value }}
            </div>
            <div class="text-slate-400 font-bold tracking-widest uppercase text-[10px]">{{ t(`home.stats.${stat.key}`) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-32 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-24">
          <h2 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Experiência de Aprendizagem</h2>
          <h3 class="text-4xl sm:text-6xl font-display font-bold text-white">
            {{ t('home.features.title') }}
          </h3>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="card-premium p-10 group"
          >
            <div class="w-16 h-16 mb-8 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
              <i :class="feature.icon" class="text-2xl text-slate-400 group-hover:text-primary-400 transition-colors"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">
              {{ t(`home.features.${feature.key}.title`) }}
            </h3>
            <p class="text-slate-400 leading-relaxed">
              {{ t(`home.features.${feature.key}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="py-32 bg-slate-950/40 backdrop-blur-3xl border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-end gap-8 mb-16">
          <div class="max-w-2xl">
            <h2 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Nossa Seleção</h2>
            <h3 class="text-4xl sm:text-6xl font-display font-bold text-white">
              {{ t('home.courses.title') }}
            </h3>
          </div>
          <RouterLink to="/courses" class="btn btn-secondary group">
            {{ t('home.courses.viewAll') }}
            <i class="pi pi-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </RouterLink>
        </div>

        <div v-if="error" class="glass-card p-12 text-center text-red-400 border-red-500/20">
          <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
          <p class="text-lg font-bold">{{ error }}</p>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="i in 3" :key="i" class="glass-card h-[400px] animate-pulse"></div>
        </div>

        <div v-else-if="featuredCourses.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <CourseCard v-for="course in featuredCourses" :key="course._id" :course="course" />
        </div>

        <div v-else class="text-center py-20 glass-card">
          <p class="text-slate-500 italic">{{ t('common.noResults') }}</p>
        </div>
      </div>
    </section>

    <!-- Consulting Section -->
    <section id="consulting" class="py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-24 items-center">
          <div class="animate-on-scroll">
            <h2 class="text-accent-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">
              {{ t('home.consulting.title') }}
            </h2>
            <h3 class="text-4xl sm:text-6xl font-display font-bold mb-8 text-white leading-tight">
              {{ t('home.consulting.subtitle') }}
            </h3>
            <p class="text-xl text-slate-400 mb-10 leading-relaxed">
              {{ t('home.consulting.description') }}
            </p>
            
            <div class="space-y-6 mb-12">
              <div v-for="(service, index) in tm('home.consulting.services')" :key="index" class="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div class="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <i class="pi pi-check text-accent-400"></i>
                </div>
                <span class="text-slate-300 font-medium">{{ service }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-6">
              <button class="btn btn-accent px-10 py-5 shadow-2xl">
                {{ t('home.consulting.ctaPrimary') }}
              </button>
              <button class="btn btn-secondary px-10 py-5">
                {{ t('home.consulting.ctaSecondary') }}
              </button>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-[40px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div class="relative glass-card p-16 rounded-[40px] border-white/20 flex flex-col justify-center items-center text-center">
              <div class="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 shadow-2xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform duration-500">
                <i class="pi pi-briefcase text-6xl text-accent-400"></i>
              </div>
              <h4 class="text-3xl font-bold mb-4 text-white">Parceria de Elite</h4>
              <p class="text-slate-400 text-lg leading-relaxed">Desenvolvemos inteligência técnica para as maiores infraestruturas de Moçambique.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="py-32 bg-slate-950/20">
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
  </div>
</template>

