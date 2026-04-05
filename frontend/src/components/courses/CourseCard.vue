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
  <div class="card-premium group relative flex flex-col h-full hover:z-10">
    <!-- Image with gradient overlay -->
    <div class="relative aspect-video overflow-hidden bg-slate-900">
      <img
        v-if="course.image"
        :src="course.image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 opacity-80 group-hover:opacity-100"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <i class="pi pi-book text-6xl text-white/10 group-hover:scale-125 transition-transform duration-700"></i>
      </div>
      
      <!-- Overlays -->
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent"></div>
      
      <!-- Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <div v-if="course.featured" class="badge-accent px-3 py-1 bg-accent-500 text-white rounded-full flex items-center gap-1.5 shadow-xl scale-90 origin-left">
          <i class="pi pi-sparkles text-[10px]"></i>
          <span class="text-[9px] font-black uppercase tracking-widest">Destaque</span>
        </div>
        <div class="badge glass-card px-3 py-1 text-white border-white/20 scale-90 origin-left">
          {{ t(`courses.levels.${course.level}`) }}
        </div>
      </div>
      
      <!-- Price on image -->
      <div class="absolute bottom-4 right-4 text-right">
        <div v-if="hasDiscount" class="text-[10px] text-slate-400 line-through mb-0.5">
          {{ price.toLocaleString() }} {{ currency }}
        </div>
        <div class="text-xl font-black text-white text-glow">
          {{ (hasDiscount ? discountedPrice : price).toLocaleString() }}
          <span class="text-[10px] font-medium opacity-70">{{ currency }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8 flex flex-col flex-1">
      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="cat in course.categories?.slice(0, 2)"
          :key="cat"
          class="text-[9px] font-black tracking-widest uppercase text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/10 shadow-sm"
        >
          {{ cat }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors duration-300">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
        {{ description }}
      </p>

      <!-- Bottom Meta -->
      <div class="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <!-- Instructor -->
        <div v-if="course.instructor" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-white/5 overflow-hidden">
             <img 
              v-if="course.instructor.avatar" 
              :src="course.instructor.avatar" 
              class="w-full h-full object-cover"
            />
            <span v-else class="text-white text-[10px] font-bold">{{ course.instructor.name?.charAt(0) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] text-white font-bold truncate max-w-[100px]">{{ course.instructor.name }}</span>
            <span class="text-[9px] text-slate-500 font-medium">Instrutor</span>
          </div>
        </div>

        <!-- Action -->
        <RouterLink
          :to="`/courses/${course.slug || course._id}`"
          class="btn btn-secondary !py-2.5 !px-5 text-[11px] font-black active:scale-95 group/btn"
        >
          {{ t('courses.card.view') }}
          <i class="pi pi-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

