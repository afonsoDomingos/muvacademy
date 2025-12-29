<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/courses/CourseCard.vue'

const { t } = useI18n()
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

onMounted(async () => {
  loading.value = true
  featuredCourses.value = await courseStore.fetchFeaturedCourses()
  loading.value = false
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-slate-950"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/20 to-accent-900/20"></div>
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600 rounded-full blur-[150px] animate-pulse-slow" style="animation-delay: 1s"></div>
      </div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="h-full w-full" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6 animate-fade-in">
            {{ t('home.hero.title') }}
          </h1>
          <p class="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-slide-up" style="animation-delay: 0.2s">
            {{ t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.4s">
            <RouterLink to="/courses" class="btn btn-primary text-lg px-8 py-4">
              <i class="pi pi-play"></i>
              {{ t('home.hero.cta') }}
            </RouterLink>
            <a href="#features" class="btn btn-secondary text-lg px-8 py-4">
              {{ t('home.hero.secondary') }}
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up" style="animation-delay: 0.6s">
          <div v-for="stat in stats" :key="stat.key" class="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div class="text-3xl sm:text-4xl font-bold gradient-text mb-2">{{ stat.value }}</div>
            <div class="text-white/70">{{ t(`home.stats.${stat.key}`) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-surface-dark">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            {{ t('home.features.title') }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="card p-8 text-center card-hover group"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i :class="feature.icon" class="text-2xl text-primary-400"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">
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
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-display font-bold text-white">
            {{ t('home.courses.title') }}
          </h2>
          <RouterLink to="/courses" class="btn btn-outline">
            {{ t('home.courses.viewAll') }}
            <i class="pi pi-arrow-right"></i>
          </RouterLink>
        </div>

        <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="card p-6 animate-pulse">
            <div class="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
            <div class="h-6 bg-white/10 rounded mb-2 w-3/4"></div>
            <div class="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="featuredCourses.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CourseCard v-for="course in featuredCourses" :key="course._id" :course="course" />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-400">{{ t('common.noResults') }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-xl text-white/80 mb-10">
          {{ t('home.cta.subtitle') }}
        </p>
        <RouterLink to="/register" class="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
          {{ t('home.cta.button') }}
          <i class="pi pi-arrow-right"></i>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
