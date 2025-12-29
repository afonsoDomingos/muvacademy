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
  <div class="card card-hover overflow-hidden group">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="course.image"
        :src="course.image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
        <i class="pi pi-book text-4xl text-white/50"></i>
      </div>
      
      <!-- Featured badge -->
      <div v-if="course.featured" class="absolute top-3 left-3 badge bg-yellow-500/20 text-yellow-400">
        <i class="pi pi-star-fill mr-1"></i>
        Destaque
      </div>
      
      <!-- Level badge -->
      <div class="absolute top-3 right-3 badge badge-primary">
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
          class="text-xs text-gray-400"
        >
          #{{ cat }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-400 text-sm line-clamp-2 mb-4">
        {{ description }}
      </p>

      <!-- Instructor -->
      <div v-if="course.instructor" class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <span class="text-white text-xs">{{ course.instructor.name?.charAt(0) }}</span>
        </div>
        <span class="text-sm text-gray-400">{{ course.instructor.name }}</span>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span class="flex items-center gap-1">
          <i class="pi pi-users"></i>
          {{ course.enrollmentCount || 0 }} {{ t('courses.card.students') }}
        </span>
        <span v-if="course.duration" class="flex items-center gap-1">
          <i class="pi pi-clock"></i>
          {{ course.duration.hours }}h
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-white/10">
        <!-- Price -->
        <div>
          <span v-if="hasDiscount" class="text-sm text-gray-500 line-through mr-2">
            {{ price.toLocaleString() }} {{ currency }}
          </span>
          <span class="text-xl font-bold text-primary-400">
            {{ (hasDiscount ? discountedPrice : price).toLocaleString() }}
            <span class="text-sm text-gray-400">{{ currency }}</span>
          </span>
        </div>

        <!-- Action -->
        <RouterLink
          :to="`/courses/${course.slug || course._id}`"
          class="btn btn-primary !py-2 !px-4 text-sm"
        >
          {{ t('courses.card.view') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>
