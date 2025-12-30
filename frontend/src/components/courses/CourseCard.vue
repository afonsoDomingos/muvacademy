<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  course: { type: Object, required: true }
})

const { t, locale } = useI18n()

const title = computed(() => props.course.title?.[locale.value] || props.course.title?.pt)
const description = computed(() => props.course.shortDescription?.[locale.value] || props.course.shortDescription?.pt)
const price = computed(() => locale.value === 'en' ? props.course.priceUSD : props.course.priceMZN)
const currency = computed(() => locale.value === 'en' ? 'USD' : 'MZN')
const hasDiscount = computed(() => {
  if (locale.value === 'en') return props.course.discountUSD > 0
  return props.course.discountMZN > 0
})
const discountedPrice = computed(() => {
  if (locale.value === 'en') return props.course.priceUSD - (props.course.discountUSD || 0)
  return props.course.priceMZN - (props.course.discountMZN || 0)
})
</script>

<template>
  <div class="card card-hover overflow-hidden group bg-surface border border-themeborder">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        v-if="course.image"
        :src="course.image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <!-- Placeholder with solid color -->
      <div v-else class="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <i class="pi pi-book text-4xl text-slate-400"></i>
      </div>
      
      <!-- Featured badge -->
      <div v-if="course.featured" class="absolute top-3 left-3 badge bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-200 dark:border-transparent">
        <i class="pi pi-star-fill mr-1"></i>
        Destaque
      </div>
      
      <!-- Level badge -->
      <div class="absolute top-3 right-3 badge bg-white/90 dark:bg-black/60 backdrop-blur-sm text-foreground shadow-sm">
        {{ t(`courses.levels.${course.level}`) }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="cat in course.categories?.slice(0, 2)"
          :key="cat"
          class="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded"
        >
          #{{ cat }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-muted text-sm line-clamp-2 mb-4">
        {{ description }}
      </p>

      <!-- Instructor -->
      <div v-if="course.instructor" class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
           <img 
            v-if="course.instructor.avatar" 
            :src="course.instructor.avatar" 
            class="w-full h-full object-cover"
          />
          <span v-else class="text-muted text-xs font-bold">{{ course.instructor.name?.charAt(0) }}</span>
        </div>
        <span class="text-sm text-muted font-medium">{{ course.instructor.name }}</span>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm text-muted mb-4">
        <span class="flex items-center gap-1">
          <i class="pi pi-users text-primary-500"></i>
          {{ course.enrollmentCount || 0 }} {{ t('courses.card.students') }}
        </span>
        <span v-if="course.duration" class="flex items-center gap-1">
          <i class="pi pi-clock text-primary-500"></i>
          {{ course.duration.hours }}h
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-themeborder">
        <!-- Price -->
        <div>
          <span v-if="hasDiscount" class="text-sm text-muted line-through mr-2 block">
            {{ price.toLocaleString() }} {{ currency }}
          </span>
          <span class="text-xl font-bold text-foreground">
            {{ (hasDiscount ? discountedPrice : price).toLocaleString() }}
            <span class="text-xs font-normal text-muted">{{ currency }}</span>
          </span>
        </div>

        <!-- Action -->
        <RouterLink
          :to="`/courses/${course.slug || course._id}`"
          class="btn btn-primary !py-2 !px-4 text-sm shadow-none"
        >
          {{ t('courses.card.view') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
