<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useEnrollmentStore } from '@/stores/enrollment'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const authStore = useAuthStore()
const enrollmentStore = useEnrollmentStore()

// State
const course = ref(null)
const modules = ref([])
const currentLesson = ref(null)
const enrollment = ref(null)
const loading = ref(true)
const error = ref(null)
const sidebarOpen = ref(true)
const markingComplete = ref(false)
const completedIds = computed(() => new Set((enrollment.value?.progress || []).filter(p => p.completed).map(p => p.lessonId)))

// Flat list of all lessons across all modules
const allLessons = computed(() => modules.value.flatMap(m => m.lessons || []))
const currentIndex = computed(() => allLessons.value.findIndex(l => l._id === currentLesson.value?._id))
const prevLesson = computed(() => currentIndex.value > 0 ? allLessons.value[currentIndex.value - 1] : null)
const nextLesson = computed(() => currentIndex.value < allLessons.value.length - 1 ? allLessons.value[currentIndex.value + 1] : null)
const overallProgress = computed(() => {
  const total = allLessons.value.length
  if (!total) return 0
  return Math.round((completedIds.value.size / total) * 100)
})

// Helpers
const t = (obj) => obj?.[locale.value] || obj?.pt || obj?.en || ''
const fmtDuration = (h, m) => h ? `${h}h ${m}m` : `${m}m`

// Video material (first video in lesson)
const videoMaterial = computed(() =>
  currentLesson.value?.materials?.find(m => m.fileType === 'video') || null
)
// PDF materials
const pdfMaterials = computed(() =>
  currentLesson.value?.materials?.filter(m => m.fileType === 'pdf') || []
)
// Other downloadable materials
const otherMaterials = computed(() =>
  currentLesson.value?.materials?.filter(m => !['video','pdf'].includes(m.fileType)) || []
)

// Is Cloudinary URL? Return raw URL (supports both video & embed)
function videoSrc(url) {
  if (!url) return ''
  // YouTube embed support
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
  return url
}
function isYouTube(url) {
  return /youtube\.com|youtu\.be/.test(url || '')
}

// Fetch data
async function loadCourse() {
  loading.value = true; error.value = null
  try {
    const courseId = route.params.courseId
    const lessonId = route.params.lessonId

    // GET /api/courses/:id already returns modules + lessons + enrollment status
    const [courseRes, enrollRes] = await Promise.all([
      api.get(`/courses/${courseId}`),
      api.get('/enrollments/my')
    ])

    course.value = courseRes.data.data.course
    // Modules with lessons come embedded in the course response
    modules.value = courseRes.data.data.modules || []

    // Find enrollment for this course
    enrollment.value = (enrollRes.data.data.enrollments || []).find(
      e => (e.courseId?._id || e.courseId) === courseId && e.status === 'APROVADO'
    ) || null

    // Set current lesson
    if (lessonId) {
      currentLesson.value = allLessons.value.find(l => l._id === lessonId) || allLessons.value[0] || null
    } else {
      currentLesson.value = allLessons.value[0] || null
    }

    // If enrolled, fetch full lesson data with material URLs
    if (enrollment.value && currentLesson.value) {
      await refreshCurrentLesson()
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao carregar a aula.'
  } finally {
    loading.value = false
  }
}

// Fetch full lesson with material URLs (requires auth + enrollment)
async function refreshCurrentLesson() {
  if (!currentLesson.value) return
  try {
    const res = await api.get(`/lessons/${currentLesson.value._id}`)
    currentLesson.value = res.data.data.lesson
  } catch (e) {
    // silently ignore — use cached version
  }
}

async function selectLesson(lesson) {
  if (!lesson) return
  currentLesson.value = lesson
  router.replace({ name: 'lesson-player', params: { courseId: route.params.courseId, lessonId: lesson._id } })
  if (enrollment.value) await refreshCurrentLesson()
  // Mobile: close sidebar after selection
  if (window.innerWidth < 1024) sidebarOpen.value = false
}

async function markComplete() {
  if (!enrollment.value || markingComplete.value) return
  if (completedIds.value.has(currentLesson.value._id)) return
  markingComplete.value = true
  try {
    await api.post(`/lessons/${currentLesson.value._id}/complete`)
    // Refresh enrollment progress
    const res = await api.get('/enrollments/my')
    enrollment.value = (res.data.data.enrollments || []).find(
      e => (e.courseId?._id || e.courseId) === route.params.courseId && e.status === 'APROVADO'
    ) || enrollment.value
  } catch (e) {
    console.error('markComplete error', e)
  } finally {
    markingComplete.value = false
  }
}

watch(() => route.params.lessonId, async (id) => {
  if (id && allLessons.value.length) {
    const found = allLessons.value.find(l => l._id === id)
    if (found) {
      currentLesson.value = found
      if (enrollment.value) await refreshCurrentLesson()
    }
  }
})


onMounted(loadCourse)
</script>

<template>
  <div class="min-h-screen bg-[#0d1117] flex flex-col">

    <!-- Top Bar -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-[#161b22] border-b border-white/10 h-14 flex items-center px-4 gap-4">
      <RouterLink to="/dashboard" class="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
        <i class="pi pi-arrow-left"></i>
        <span class="hidden sm:inline">Dashboard</span>
      </RouterLink>
      <div class="h-5 w-px bg-white/10"></div>
      <div class="flex-1 min-w-0">
        <p class="text-white text-sm font-medium truncate">{{ t(course?.title) }}</p>
        <p v-if="currentLesson" class="text-gray-400 text-xs truncate">{{ t(currentLesson.title) }}</p>
      </div>
      <!-- Progress -->
      <div class="hidden sm:flex items-center gap-3">
        <div class="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-primary-500 rounded-full transition-all duration-500" :style="`width:${overallProgress}%`"></div>
        </div>
        <span class="text-xs text-gray-400 whitespace-nowrap">{{ overallProgress }}% completo</span>
      </div>
      <!-- Toggle sidebar -->
      <button @click="sidebarOpen = !sidebarOpen" class="ml-2 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
        <i :class="sidebarOpen ? 'pi pi-times' : 'pi pi-list'"></i>
      </button>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-1 pt-14">

      <!-- ── Sidebar ── -->
      <aside
        :class="[
          'fixed top-14 bottom-0 left-0 z-40 w-80 bg-[#161b22] border-r border-white/10 overflow-y-auto transition-transform duration-300 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="p-4 border-b border-white/10">
          <h2 class="text-white font-semibold text-sm">Conteúdo do Curso</h2>
          <p class="text-gray-400 text-xs mt-1">{{ allLessons.length }} aulas · {{ completedIds.size }} concluídas</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Module list -->
        <div v-else class="flex-1">
          <div v-for="(mod, mi) in modules" :key="mod._id" class="border-b border-white/5">
            <!-- Module header -->
            <div class="px-4 py-3 bg-white/3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Módulo {{ mi + 1 }}</span>
              </div>
              <p class="text-white text-sm font-medium mt-0.5">{{ t(mod.title) }}</p>
            </div>
            <!-- Lessons -->
            <button
              v-for="lesson in (mod.lessons || [])"
              :key="lesson._id"
              @click="selectLesson(lesson)"
              :class="[
                'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5',
                currentLesson?._id === lesson._id ? 'bg-primary-500/15 border-l-2 border-primary-500' : ''
              ]"
            >
              <!-- Status icon -->
              <div class="mt-0.5 flex-shrink-0">
                <div v-if="completedIds.has(lesson._id)" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <i class="pi pi-check text-white text-[10px]"></i>
                </div>
                <div v-else-if="currentLesson?._id === lesson._id" class="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <i class="pi pi-play-circle text-white text-[10px]"></i>
                </div>
                <div v-else class="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                  <i class="pi pi-circle text-gray-600 text-[10px]"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm leading-tight', currentLesson?._id === lesson._id ? 'text-white font-medium' : 'text-gray-300']">
                  {{ t(lesson.title) }}
                </p>
                <p v-if="lesson.duration?.hours || lesson.duration?.minutes" class="text-xs text-gray-500 mt-0.5">
                  {{ fmtDuration(lesson.duration.hours, lesson.duration.minutes) }}
                </p>
                <span v-if="lesson.isFree" class="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Gratuito</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <!-- ── Content Area ── -->
      <main :class="['flex-1 flex flex-col transition-all duration-300 min-h-0', sidebarOpen ? 'lg:ml-80' : '']">

        <!-- Error -->
        <div v-if="error" class="flex-1 flex items-center justify-center p-8">
          <div class="text-center">
            <i class="pi pi-exclamation-triangle text-5xl text-red-400 mb-4"></i>
            <p class="text-white text-lg font-medium mb-2">Erro ao carregar</p>
            <p class="text-gray-400 text-sm mb-6">{{ error }}</p>
            <RouterLink to="/dashboard" class="btn btn-primary">Voltar ao Dashboard</RouterLink>
          </div>
        </div>

        <!-- Loading -->
        <div v-else-if="loading" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <i class="pi pi-spin pi-spinner text-4xl text-primary-400 mb-4"></i>
            <p class="text-gray-400">A carregar aula...</p>
          </div>
        </div>

        <!-- No lesson -->
        <div v-else-if="!currentLesson" class="flex-1 flex items-center justify-center p-8">
          <div class="text-center">
            <i class="pi pi-book text-5xl text-gray-600 mb-4"></i>
            <p class="text-white text-lg font-medium mb-2">Nenhuma aula disponível</p>
            <p class="text-gray-400 text-sm mb-6">Este curso ainda não tem aulas publicadas.</p>
            <RouterLink to="/dashboard" class="btn btn-primary">Voltar ao Dashboard</RouterLink>
          </div>
        </div>

        <!-- Lesson Content -->
        <template v-else>

          <!-- ── VIDEO PLAYER ── -->
          <div class="bg-black w-full" style="max-height: 60vh;">
            <!-- YouTube embed -->
            <iframe
              v-if="videoMaterial && isYouTube(videoMaterial.fileUrl)"
              :src="videoSrc(videoMaterial.fileUrl)"
              class="w-full aspect-video max-h-[60vh]"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>

            <!-- Native video (Cloudinary or direct URL) -->
            <video
              v-else-if="videoMaterial"
              :key="videoMaterial.fileUrl"
              controls
              class="w-full max-h-[60vh]"
              controlslist="nodownload"
            >
              <source :src="videoMaterial.fileUrl" />
              O teu browser não suporta vídeo HTML5.
            </video>

            <!-- No video: placeholder -->
            <div v-else class="w-full aspect-video max-h-[60vh] flex items-center justify-center bg-[#0d1117]">
              <div class="text-center">
                <i class="pi pi-file text-5xl text-gray-600 mb-4"></i>
                <p class="text-gray-400">Esta aula não tem vídeo</p>
              </div>
            </div>
          </div>

          <!-- ── LESSON INFO ── -->
          <div class="flex-1 overflow-y-auto">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6">

              <!-- Title + actions -->
              <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-white">{{ t(currentLesson.title) }}</h1>
                  <p v-if="currentLesson.duration?.hours || currentLesson.duration?.minutes" class="text-sm text-gray-400 mt-1">
                    <i class="pi pi-clock mr-1"></i>
                    {{ fmtDuration(currentLesson.duration.hours, currentLesson.duration.minutes) }}
                  </p>
                </div>

                <!-- Mark complete button -->
                <button
                  v-if="enrollment"
                  @click="markComplete"
                  :disabled="completedIds.has(currentLesson._id) || markingComplete"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                    completedIds.has(currentLesson._id)
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-primary-600 hover:bg-primary-500 text-white cursor-pointer'
                  ]"
                >
                  <i :class="markingComplete ? 'pi pi-spin pi-spinner' : completedIds.has(currentLesson._id) ? 'pi pi-check-circle' : 'pi pi-check'"></i>
                  {{ completedIds.has(currentLesson._id) ? 'Concluída' : 'Marcar como Concluída' }}
                </button>
              </div>

              <!-- Description -->
              <div v-if="t(currentLesson.description)" class="bg-white/5 rounded-xl p-4 mb-6">
                <h3 class="text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wide">Sobre esta aula</h3>
                <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ t(currentLesson.description) }}</p>
              </div>

              <!-- PDF Viewer -->
              <div v-if="pdfMaterials.length" class="mb-6">
                <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                  <i class="pi pi-file-pdf text-red-400"></i>
                  Materiais PDF
                </h3>
                <div class="space-y-3">
                  <div v-for="pdf in pdfMaterials" :key="pdf._id" class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div class="flex items-center gap-3 p-3 border-b border-white/10">
                      <i class="pi pi-file-pdf text-red-400 text-lg"></i>
                      <div class="flex-1 min-w-0">
                        <p class="text-white text-sm font-medium truncate">{{ t(pdf.title) }}</p>
                        <p v-if="t(pdf.description)" class="text-gray-400 text-xs truncate">{{ t(pdf.description) }}</p>
                      </div>
                      <a v-if="pdf.isDownloadable" :href="pdf.fileUrl" target="_blank" download
                        class="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-colors flex items-center gap-1">
                        <i class="pi pi-download"></i> Download
                      </a>
                    </div>
                    <!-- Embedded PDF -->
                    <iframe :src="`${pdf.fileUrl}#toolbar=0`" class="w-full h-96" frameborder="0"></iframe>
                  </div>
                </div>
              </div>

              <!-- Other materials -->
              <div v-if="otherMaterials.length" class="mb-6">
                <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                  <i class="pi pi-paperclip text-primary-400"></i>
                  Outros Materiais
                </h3>
                <div class="space-y-2">
                  <a
                    v-for="mat in otherMaterials"
                    :key="mat._id"
                    :href="mat.fileUrl"
                    target="_blank"
                    class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <i class="pi pi-file text-primary-400 text-lg"></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-white text-sm font-medium truncate">{{ t(mat.title) }}</p>
                      <p v-if="t(mat.description)" class="text-gray-400 text-xs truncate">{{ t(mat.description) }}</p>
                    </div>
                    <i class="pi pi-external-link text-gray-500 text-sm"></i>
                  </a>
                </div>
              </div>

              <!-- Navigation buttons -->
              <div class="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  @click="selectLesson(prevLesson)"
                  :disabled="!prevLesson"
                  :class="['flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all', prevLesson ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-30 bg-white/5 text-gray-500 cursor-not-allowed']"
                >
                  <i class="pi pi-chevron-left"></i>
                  <span class="hidden sm:inline">Aula Anterior</span>
                </button>

                <div class="text-center">
                  <span class="text-gray-400 text-sm">{{ currentIndex + 1 }} / {{ allLessons.length }}</span>
                </div>

                <button
                  @click="selectLesson(nextLesson)"
                  :disabled="!nextLesson"
                  :class="['flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all', nextLesson ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'opacity-30 bg-white/5 text-gray-500 cursor-not-allowed']"
                >
                  <span class="hidden sm:inline">Próxima Aula</span>
                  <i class="pi pi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

        </template>
      </main>
    </div>

    <!-- Sidebar overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-30 bg-black/60 lg:hidden"
    ></div>
  </div>
</template>
