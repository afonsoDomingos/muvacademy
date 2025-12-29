<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const loading = ref(true)
const courseData = computed(() => courseStore.currentCourse)
const course = computed(() => courseData.value?.course)
const modules = computed(() => courseData.value?.modules || [])
const enrollment = computed(() => courseData.value?.enrollment)
const isEnrolled = computed(() => courseData.value?.isEnrolled)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const title = computed(() => course.value?.title?.[locale.value] || course.value?.title?.pt)
const description = computed(() => course.value?.description?.[locale.value] || course.value?.description?.pt)
const price = computed(() => locale.value === 'en' ? course.value?.priceUSD : course.value?.priceMZN)
const currency = computed(() => locale.value === 'en' ? 'USD' : 'MZN')

const totalLessons = computed(() => modules.value.reduce((sum, m) => sum + (m.lessons?.length || 0), 0))

function handleEnroll() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  router.push({ name: 'enrollment', params: { courseId: course.value._id } })
}

onMounted(async () => {
  loading.value = true
  await courseStore.fetchCourse(route.params.identifier)
  loading.value = false
  
  if (!courseStore.currentCourse?.course) {
    router.push('/courses')
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12">
      <div class="animate-pulse">
        <div class="h-64 bg-white/10 rounded-2xl mb-8"></div>
        <div class="h-8 bg-white/10 rounded w-1/2 mb-4"></div>
        <div class="h-4 bg-white/10 rounded w-3/4"></div>
      </div>
    </div>

    <template v-else-if="course">
      <!-- Hero -->
      <section class="relative py-16 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-accent-900/50"></div>
        <div class="absolute inset-0" v-if="course.image">
          <img :src="course.image" class="w-full h-full object-cover opacity-20" />
        </div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-12">
            <!-- Info -->
            <div class="lg:col-span-2">
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="cat in course.categories" :key="cat" class="badge badge-primary">{{ cat }}</span>
                <span class="badge" :class="course.level === 'avancado' ? 'badge-error' : course.level === 'intermediario' ? 'badge-warning' : 'badge-success'">
                  {{ t(`courses.levels.${course.level}`) }}
                </span>
              </div>
              
              <h1 class="text-3xl sm:text-4xl font-display font-bold text-white mb-4">{{ title }}</h1>
              
              <p class="text-gray-300 text-lg mb-6">{{ course.shortDescription?.[locale] || course.shortDescription?.pt }}</p>
              
              <div class="flex flex-wrap gap-6 text-gray-400 mb-6">
                <span class="flex items-center gap-2"><i class="pi pi-users"></i> {{ course.enrollmentCount || 0 }} alunos</span>
                <span class="flex items-center gap-2"><i class="pi pi-book"></i> {{ modules.length }} {{ t('courses.detail.modules') }}</span>
                <span class="flex items-center gap-2"><i class="pi pi-video"></i> {{ totalLessons }} {{ t('courses.detail.lessons') }}</span>
                <span v-if="course.duration?.hours" class="flex items-center gap-2"><i class="pi pi-clock"></i> {{ course.duration.hours }}h {{ course.duration.minutes }}min</span>
              </div>

              <!-- Instructor -->
              <div v-if="course.instructor" class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span class="text-white font-bold">{{ course.instructor.name?.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-white font-medium">{{ course.instructor.name }}</p>
                  <p class="text-gray-400 text-sm">{{ course.instructor.profession }}</p>
                </div>
              </div>
            </div>

            <!-- Price Card -->
            <div class="lg:col-span-1">
              <div class="card p-6 sticky top-20">
                <div class="text-3xl font-bold text-white mb-4">
                  {{ price?.toLocaleString() }} <span class="text-lg text-gray-400">{{ currency }}</span>
                </div>
                
                <div class="space-y-3 mb-6">
                  <div v-if="course.certificate" class="flex items-center gap-2 text-gray-300">
                    <i class="pi pi-verified text-green-400"></i>{{ t('courses.detail.certificate') }}
                  </div>
                  <div class="flex items-center gap-2 text-gray-300">
                    <i class="pi pi-clock text-primary-400"></i>{{ t('courses.detail.lifetime') }}
                  </div>
                </div>
                
                <div v-if="isEnrolled">
                  <RouterLink :to="`/courses/${course.slug || course._id}`" class="btn btn-primary w-full">
                    <i class="pi pi-play"></i> Continuar Curso
                  </RouterLink>
                </div>
                <div v-else-if="enrollment?.status === 'PENDENTE'">
                  <Button label="Aguardando Aprovação" icon="pi pi-clock" class="w-full" disabled />
                </div>
                <div v-else>
                  <Button @click="handleEnroll" :label="t('courses.detail.enrollNow')" icon="pi pi-shopping-cart" class="w-full p-button-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2 space-y-8">
              <!-- Description -->
              <div class="card p-8">
                <h2 class="text-2xl font-bold text-white mb-4">{{ t('courses.detail.about') }}</h2>
                <div class="text-gray-300 whitespace-pre-line">{{ description }}</div>
              </div>

              <!-- Objectives -->
              <div v-if="course.objectives?.[locale]?.length || course.objectives?.pt?.length" class="card p-8">
                <h2 class="text-2xl font-bold text-white mb-4">{{ t('courses.detail.objectives') }}</h2>
                <ul class="space-y-3">
                  <li v-for="(obj, i) in (course.objectives?.[locale] || course.objectives?.pt)" :key="i" class="flex items-start gap-3 text-gray-300">
                    <i class="pi pi-check-circle text-green-400 mt-1"></i>{{ obj }}
                  </li>
                </ul>
              </div>

              <!-- Curriculum -->
              <div class="card">
                <div class="p-8 border-b border-white/10">
                  <h2 class="text-2xl font-bold text-white">{{ t('courses.detail.curriculum') }}</h2>
                </div>
                <Accordion :multiple="true" class="course-accordion">
                  <AccordionTab v-for="module in modules" :key="module._id">
                    <template #header>
                      <div class="flex justify-between w-full pr-4">
                        <span class="text-white">{{ module.title?.[locale] || module.title?.pt }}</span>
                        <span class="text-gray-400 text-sm">{{ module.lessons?.length || 0 }} aulas</span>
                      </div>
                    </template>
                    <div class="space-y-2">
                      <div v-for="lesson in module.lessons" :key="lesson._id" class="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <i class="pi pi-play-circle text-primary-400"></i>
                        <span class="text-gray-300 flex-1">{{ lesson.title?.[locale] || lesson.title?.pt }}</span>
                        <span v-if="lesson.isFree" class="badge badge-success text-xs">Grátis</span>
                      </div>
                    </div>
                  </AccordionTab>
                </Accordion>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Requirements -->
              <div v-if="course.requirements?.[locale]?.length || course.requirements?.pt?.length" class="card p-6">
                <h3 class="text-xl font-bold text-white mb-4">{{ t('courses.detail.requirements') }}</h3>
                <ul class="space-y-2">
                  <li v-for="(req, i) in (course.requirements?.[locale] || course.requirements?.pt)" :key="i" class="flex items-start gap-2 text-gray-400 text-sm">
                    <i class="pi pi-angle-right text-primary-400 mt-1"></i>{{ req }}
                  </li>
                </ul>
              </div>

              <!-- Target Audience -->
              <div v-if="course.targetAudience?.[locale]?.length || course.targetAudience?.pt?.length" class="card p-6">
                <h3 class="text-xl font-bold text-white mb-4">{{ t('courses.detail.audience') }}</h3>
                <ul class="space-y-2">
                  <li v-for="(aud, i) in (course.targetAudience?.[locale] || course.targetAudience?.pt)" :key="i" class="flex items-start gap-2 text-gray-400 text-sm">
                    <i class="pi pi-user text-primary-400"></i>{{ aud }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style>
.course-accordion .p-accordion-header-link {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
}
.course-accordion .p-accordion-content {
  background: transparent !important;
  border: none !important;
  padding: 1rem !important;
}
</style>
