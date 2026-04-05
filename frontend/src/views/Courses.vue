<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/courses/CourseCard.vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const search = ref(route.query.search || '')
const selectedCategory = ref(route.query.category || '')
const selectedLevel = ref(route.query.level || '')
const page = ref(parseInt(route.query.page) || 1)

const courses = computed(() => courseStore.courses)
const pagination = computed(() => courseStore.pagination)
const loading = computed(() => courseStore.loading)
const categories = computed(() => courseStore.categories)

const levels = computed(() => [
  { value: '', label: t('courses.levels.all') },
  { value: 'iniciante', label: t('courses.levels.iniciante') },
  { value: 'intermediario', label: t('courses.levels.intermediario') },
  { value: 'avancado', label: t('courses.levels.avancado') }
])

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return null
  const cat = categories.value.find(c => c.id === selectedCategory.value)
  return cat ? cat.name[locale.value] : null
})

const categoryIcon = computed(() => {
  const icons = {
    'engenharia-civil': 'pi-home',
    'energia-sustentabilidade': 'pi-sun',
    'gestao': 'pi-briefcase',
    'software': 'pi-code',
    'geoprocessamento': 'pi-map'
  }
  return icons[selectedCategory.value] || 'pi-book'
})

async function fetchCourses() {
  const params = {
    page: page.value,
    limit: 12,
    search: search.value || undefined,
    category: selectedCategory.value || undefined,
    level: selectedLevel.value || undefined
  }
  
  await courseStore.fetchCourses(params)
  
  // Update URL
  router.replace({
    query: { ...params, search: params.search || undefined }
  })
}

function handleSearch() {
  page.value = 1
  fetchCourses()
}

function changePage(newPage) {
  page.value = newPage
  fetchCourses()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([selectedCategory, selectedLevel], () => {
  page.value = 1
  fetchCourses()
})

onMounted(async () => {
  await courseStore.fetchCategories()
  await fetchCourses()
})
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Category Hero Banner -->
      <transition name="fade" mode="out-in">
        <div 
          :key="selectedCategory || 'all'"
          class="relative h-64 rounded-[32px] overflow-hidden mb-12 flex items-center group shadow-2xl"
        >
          <!-- Background with dynamic gradient -->
          <div class="absolute inset-0 z-0 transition-all duration-700 bg-slate-900">
             <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
             <div 
               class="absolute inset-0 opacity-30 animate-pulse-slow"
               :class="{
                 'bg-gradient-to-br from-primary-500 to-blue-600': !selectedCategory,
                 'bg-gradient-to-br from-accent-500 to-red-600': selectedCategory === 'gestao',
                 'bg-gradient-to-br from-blue-500 to-indigo-600': selectedCategory === 'software',
                 'bg-gradient-to-br from-green-500 to-teal-600': selectedCategory === 'energia-sustentabilidade'
               }"
             ></div>
          </div>
          
          <div class="relative z-10 px-12 max-w-3xl">
             <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold tracking-widest uppercase mb-4">
                {{ selectedCategory ? 'Categoria' : 'Explorar' }}
             </div>
             <h1 class="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
               {{ selectedCategoryName || t('courses.title') }}
             </h1>
             <p class="text-slate-400 text-lg max-w-xl">
               {{ selectedCategory ? 'Especialize-se com os melhores instrutores do mercado nesta área técnica.' : t('courses.subtitle') }}
             </p>
          </div>

          <!-- Decorative element -->
          <div class="absolute right-12 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform duration-1000 hidden lg:block">
             <i class="text-[120px] text-white pi" :class="categoryIcon"></i>
          </div>
        </div>
      </transition>

      <!-- Filters -->
      <div class="card p-6 mb-8">
        <div class="grid md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search" />
              <InputText
                v-model="search"
                :placeholder="t('courses.search')"
                class="w-full"
                @keyup.enter="handleSearch"
              />
            </span>
          </div>

          <Dropdown
            v-model="selectedCategory"
            :options="[{ id: '', name: { [locale]: t('courses.filters.all') } }, ...categories]"
            :optionLabel="`name.${locale}`"
            optionValue="id"
            :placeholder="t('courses.filters.category')"
            class="w-full"
          />

          <Dropdown
            v-model="selectedLevel"
            :options="levels"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('courses.filters.level')"
            class="w-full"
          />
        </div>
      </div>

      <!-- Courses Grid -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="card p-6 animate-pulse bg-surface">
          <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else-if="courses.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CourseCard v-for="course in courses" :key="course._id" :course="course" />
      </div>

      <div v-else class="text-center py-20">
        <i class="pi pi-search text-5xl text-gray-600 mb-4"></i>
        <p class="text-gray-400 text-xl">{{ t('common.noResults') }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="flex justify-center gap-2 mt-12">
        <button
          v-for="p in pagination.pages"
          :key="p"
          @click="changePage(p)"
          class="w-10 h-10 rounded-lg transition-all"
          :class="page === p ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>
