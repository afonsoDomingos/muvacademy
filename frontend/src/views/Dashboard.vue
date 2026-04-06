<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useEnrollmentStore } from '@/stores/enrollment'
import { useNotificationStore } from '@/stores/notification'
import ProgressBar from 'primevue/progressbar'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const enrollmentStore = useEnrollmentStore()
const notificationStore = useNotificationStore()

const loading = ref(true)
const activeTab = ref('inProgress')

const user = computed(() => authStore.user)
const completing = ref(false)
const myRequests = ref([])

const enrollments = computed(() => enrollmentStore.myEnrollments || [])
const notifications = computed(() => notificationStore.notifications || [])

const approvedEnrollments = computed(() => enrollments.value.filter(e => e.status === 'APROVADO'))
const pendingEnrollments = computed(() => enrollments.value.filter(e => e.status === 'PENDENTE'))
const inProgressCourses = computed(() => approvedEnrollments.value.filter(e => e.overallProgress < 100))
const completedCourses = computed(() => approvedEnrollments.value.filter(e => e.overallProgress === 100))

const tabs = [
  { id: 'inProgress', label: 'dashboard.inProgress', count: () => inProgressCourses.value.length },
  { id: 'completed', label: 'dashboard.completed', count: () => completedCourses.value.length },
  { id: 'pending', label: 'dashboard.pending', count: () => pendingEnrollments.value.length },
  { id: 'requests', label: 'Meus Pedidos', count: () => myRequests.value.length }
]

import api from '@/services/api'
const fetchMyRequests = async () => {
    try {
        const response = await api.get('/service-requests/my')
        myRequests.value = response.data.data?.requests || []
    } catch (e) {
        console.error('Error fetching my requests:', e)
        myRequests.value = []
    }
}

function getTitle(enrollment) {
  return enrollment.courseId?.title?.[locale.value] || enrollment.courseId?.title?.pt || ''
}

function getStatusClass(status) {
  switch (status) {
    case 'APROVADO': return 'badge-success'
    case 'PENDENTE': return 'badge-warning'
    case 'REJEITADO': return 'badge-error'
    default: return 'badge-primary'
  }
}

async function markNotificationRead(id) {
  await notificationStore.markAsRead(id)
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    enrollmentStore.fetchMyEnrollments(),
    notificationStore.fetchNotifications({ limit: 5 }),
    fetchMyRequests()
  ])
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Welcome -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-slate-900 dark:text-white">
          {{ t('dashboard.welcome') }}, {{ user?.name?.split(' ')[0] }}! 👋
        </h1>
        <p class="text-slate-600 dark:text-gray-400 mt-2">Gerencie seus cursos e acompanhe seu progresso</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Stats Cards -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="card p-4 text-center">
              <div class="text-2xl font-bold text-primary-500 dark:text-primary-400">{{ inProgressCourses.length }}</div>
              <div class="text-sm text-slate-500 dark:text-gray-400">{{ t('dashboard.inProgress') }}</div>
            </div>
            <div class="card p-4 text-center">
              <div class="text-2xl font-bold text-green-500 dark:text-green-400">{{ completedCourses.length }}</div>
              <div class="text-sm text-slate-500 dark:text-gray-400">{{ t('dashboard.completed') }}</div>
            </div>
            <div class="card p-4 text-center">
              <div class="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{{ pendingEnrollments.length }}</div>
              <div class="text-sm text-slate-500 dark:text-gray-400">{{ t('dashboard.pending') }}</div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="card">
            <div class="flex border-b border-slate-200 dark:border-white/10">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex-1 px-4 py-4 text-center transition-colors relative"
                :class="activeTab === tab.id ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'"
              >
                {{ t(tab.label) }}
                <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-gray-300'">
                  {{ tab.count() }}
                </span>
                <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></span>
              </button>
            </div>

            <div class="p-6">
              <!-- Loading -->
              <div v-if="loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="flex gap-4 animate-pulse">
                  <div class="w-24 h-16 bg-slate-200 dark:bg-white/10 rounded-lg"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              <!-- In Progress -->
              <div v-else-if="activeTab === 'inProgress'">
                <div v-if="inProgressCourses.length === 0" class="text-center py-12">
                  <i class="pi pi-book text-4xl text-slate-400 dark:text-gray-600 mb-4"></i>
                  <p class="text-slate-500 dark:text-gray-400">{{ t('dashboard.noCourses') }}</p>
                  <RouterLink to="/courses" class="btn btn-primary mt-4">{{ t('dashboard.exploreCourses') }}</RouterLink>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="enrollment in inProgressCourses" :key="enrollment._id" class="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5">
                    <img v-if="enrollment.courseId?.image" :src="enrollment.courseId.image" class="w-24 h-16 object-cover rounded-lg" />
                    <div v-else class="w-24 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                      <i class="pi pi-book text-white"></i>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-slate-900 dark:text-white font-bold mb-1">{{ getTitle(enrollment) }}</h3>
                      <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mb-2">
                        <span>{{ enrollment.overallProgress || 0 }}% concluído</span>
                      </div>
                      <ProgressBar :value="enrollment.overallProgress || 0" :showValue="false" class="h-2" />
                    </div>
                    <RouterLink :to="{ name: 'lesson-player', params: { courseId: enrollment.courseId?._id } }" class="btn btn-primary !py-2 !px-4 text-sm self-center">
                      {{ t('dashboard.continue') }}
                    </RouterLink>
                  </div>
                </div>
              </div>

              <!-- Completed -->
              <div v-else-if="activeTab === 'completed'">
                <div v-if="completedCourses.length === 0" class="text-center py-12">
                  <i class="pi pi-check-circle text-4xl text-slate-400 dark:text-gray-600 mb-4"></i>
                  <p class="text-slate-500 dark:text-gray-400">Nenhum curso concluído ainda</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="enrollment in completedCourses" :key="enrollment._id" class="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl">
                    <img v-if="enrollment.courseId?.image" :src="enrollment.courseId.image" class="w-24 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h3 class="text-slate-900 dark:text-white font-bold">{{ getTitle(enrollment) }}</h3>
                      <span class="badge badge-success mt-2">✓ Concluído</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pending -->
              <div v-else-if="activeTab === 'pending'">
                <div v-if="pendingEnrollments.length === 0" class="text-center py-12">
                  <i class="pi pi-clock text-4xl text-slate-400 dark:text-gray-600 mb-4"></i>
                  <p class="text-slate-500 dark:text-gray-400">Nenhuma inscrição pendente</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="enrollment in pendingEnrollments" :key="enrollment._id" class="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl">
                    <img v-if="enrollment.courseId?.image" :src="enrollment.courseId.image" class="w-24 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h3 class="text-slate-900 dark:text-white font-bold">{{ getTitle(enrollment) }}</h3>
                      <span class="badge badge-warning mt-2">⏳ Aguardando aprovação</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- My Requests -->
              <div v-else-if="activeTab === 'requests'">
                <div v-if="myRequests.length === 0" class="text-center py-12">
                  <i class="pi pi-briefcase text-4xl text-slate-400 dark:text-gray-600 mb-4"></i>
                  <p class="text-slate-500 dark:text-gray-400">Ainda não solicitou nenhum serviço.</p>
                  <a href="/#services" class="btn btn-primary mt-4">Explorar Serviços</a>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="req in myRequests" :key="req._id" class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                    <div class="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 dark:text-primary-400">
                      <i class="pi pi-envelope text-xl"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-slate-900 dark:text-white font-bold leading-tight">{{ req.service }}</h4>
                      <p class="text-[10px] text-slate-500 dark:text-gray-500 mt-1 uppercase tracking-wider">{{ new Date(req.createdAt).toLocaleDateString() }}</p>
                    </div>
                    <div class="text-right">
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap" 
                        :class="{
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': req.status === 'pendente',
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20': req.status === 'em_analise',
                          'bg-green-500/10 text-green-500 border border-green-500/20': req.status === 'concluido',
                          'bg-red-500/10 text-red-500 border border-red-500/20': req.status === 'cancelado'
                        }">
                        {{ req.status.replace('_', ' ') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Notifications -->
          <div class="card">
            <div class="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
              <h3 class="text-slate-900 dark:text-white font-semibold">{{ t('dashboard.notifications') }}</h3>
              <button v-if="notifications.length" @click="notificationStore.markAllAsRead" class="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                {{ t('dashboard.markAllRead') }}
              </button>
            </div>
            <div class="p-4">
              <div v-if="notifications.length === 0" class="text-center py-4">
                <i class="pi pi-bell-slash text-2xl text-slate-300 dark:text-gray-600 mb-2"></i>
                <p class="text-slate-500 dark:text-gray-400 text-sm">{{ t('dashboard.noNotifications') }}</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="notif in notifications"
                  :key="notif._id"
                  @click="markNotificationRead(notif._id)"
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                  :class="notif.read ? 'bg-slate-50 dark:bg-white/5' : 'bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30'"
                >
                  <p class="text-sm text-slate-900 dark:text-white font-medium">{{ notif.title?.[locale] || notif.title?.pt }}</p>
                  <p class="text-xs text-slate-600 dark:text-gray-400 mt-1 line-clamp-2">{{ notif.message?.[locale] || notif.message?.pt }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card p-4">
            <h3 class="text-slate-900 dark:text-white font-semibold mb-4">Ações Rápidas</h3>
            <div class="space-y-2">
              <RouterLink to="/courses" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-gray-300">
                <i class="pi pi-search text-primary-500 dark:text-primary-400"></i>
                Explorar Cursos
              </RouterLink>
              <RouterLink to="/profile" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-gray-300">
                <i class="pi pi-user text-primary-500 dark:text-primary-400"></i>
                Editar Perfil
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
