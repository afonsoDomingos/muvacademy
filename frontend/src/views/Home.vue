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
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
      <!-- Minimalist Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="h-full w-full" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 animate-fade-in">
            {{ t('home.hero.title') }}
          </h1>
          <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 animate-slide-up" style="animation-delay: 0.2s">
            {{ t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.4s">
            <RouterLink to="/courses" class="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
              <i class="pi pi-play"></i>
              {{ t('home.hero.cta') }}
            </RouterLink>
            <a href="#features" class="btn btn-secondary text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
              {{ t('home.hero.secondary') }}
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up" style="animation-delay: 0.6s">
          <div v-for="stat in stats" :key="stat.key" class="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div class="text-3xl sm:text-4xl font-bold text-primary-400 mb-2">{{ stat.value }}</div>
            <div class="text-gray-300 font-medium">{{ t(`home.stats.${stat.key}`) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-surface border-y border-themeborder">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            {{ t('home.features.title') }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="card p-8 text-center card-hover group !bg-background"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i :class="feature.icon" class="text-2xl text-primary-600 dark:text-primary-400"></i>
            </div>
            <h3 class="text-xl font-bold text-foreground mb-3">
              {{ t(`home.features.${feature.key}.title`) }}
            </h3>
            <p class="text-muted">
              {{ t(`home.features.${feature.key}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="py-24 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-foreground">
            {{ t('home.courses.title') }}
          </h2>
          <RouterLink to="/courses" class="btn btn-outline">
            {{ t('home.courses.viewAll') }}
            <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="error" class="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
          <div class="text-red-500 mb-2"><i class="pi pi-exclamation-circle text-2xl"></i></div>
          <p class="text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="card p-6 animate-pulse !bg-surface">
            <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="featuredCourses.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard v-for="course in featuredCourses" :key="course._id" :course="course" />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-muted">{{ t('common.noResults') }}</p>
        </div>
      </div>
    </section>

    <!-- Consulting Section -->
    <section id="consulting" class="py-24 bg-surface border-y border-themeborder">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm mb-3">
              {{ t('home.consulting.title') }}
            </h2>
            <h3 class="text-3xl sm:text-5xl font-display font-bold mb-6 text-foreground">
              {{ t('home.consulting.subtitle') }}
            </h3>
            <p class="text-lg text-muted mb-8 leading-relaxed">
              {{ t('home.consulting.description') }}
            </p>
            
            <ul class="space-y-4 mb-8">
              <li v-for="(service, index) in tm('home.consulting.services')" :key="index" class="flex items-start gap-3">
                <i class="pi pi-check text-primary-600 mt-1"></i>
                <span class="text-muted">{{ service }}</span>
              </li>
            </ul>

            <div class="flex flex-wrap gap-4">
              <button class="btn btn-primary">
                {{ t('home.consulting.ctaPrimary') }}
              </button>
              <button class="btn btn-secondary">
                {{ t('home.consulting.ctaSecondary') }}
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="aspect-square rounded-3xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-500/20 p-8 relative overflow-hidden group">
              <!-- Solid Circles Decoration -->
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 dark:bg-primary-500/10 rounded-full"></div>
              <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-100 dark:bg-accent-500/10 rounded-full"></div>
              
              <div class="relative h-full flex flex-col justify-center items-center text-center">
                <div class="w-20 h-20 rounded-2xl bg-white dark:bg-surface border border-themeborder shadow-lg flex items-center justify-center mb-6">
                  <i class="pi pi-briefcase text-4xl text-primary-600"></i>
                </div>
                <h4 class="text-2xl font-bold mb-2 text-foreground">Parceria Estratégica</h4>
                <p class="text-muted">Transformamos desafios técnicos em resultados de negócio com soluções sob medida.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section id="team" class="py-24 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase text-sm mb-3">
            {{ t('home.team.title') }}
          </h2>
          <h3 class="text-3xl sm:text-4xl font-display font-bold mb-4 text-foreground">
            {{ t('home.team.subtitle') }}
          </h3>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="member in team"
            :key="member.id"
            class="card p-8 text-center card-hover group !bg-surface"
          >
            <div class="relative w-40 h-40 mx-auto mb-6">
              <img
                :src="member.image"
                :alt="t(`home.team.members.${member.id}.name`)"
                class="relative w-full h-full object-cover rounded-full border-4 border-gray-100 dark:border-gray-800"
              />
            </div>
            <h4 class="text-xl font-bold mb-1 text-foreground">
              {{ t(`home.team.members.${member.id}.name`) }}
            </h4>
            <p class="text-primary-600 dark:text-primary-400 font-medium text-sm mb-4">
              {{ t(`home.team.members.${member.id}.role`) }}
            </p>
            <p class="text-muted text-sm leading-relaxed">
              {{ t(`home.team.members.${member.id}.bio`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-primary-600 relative overflow-hidden">
      <!-- Minimalist background circles -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-xl text-white/90 mb-10">
          {{ t('home.cta.subtitle') }}
        </p>
        <RouterLink to="/register" class="btn bg-white text-primary-700 hover:bg-gray-50 text-lg px-8 py-4 shadow-lg border-none">
          {{ t('home.cta.button') }}
          <i class="pi pi-arrow-right"></i>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
