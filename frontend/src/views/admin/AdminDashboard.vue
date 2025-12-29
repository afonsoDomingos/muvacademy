<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()

const loading = ref(true)
const stats = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('/stats/dashboard')
    stats.value = response.data.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-display font-bold text-white mb-8">{{ t('admin.dashboard') }}</h1>

    <!-- Stats Cards -->
    <div class="grid md:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total Alunos</p>
            <p class="text-3xl font-bold text-white">{{ stats?.summary?.totalUsers || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <i class="pi pi-users text-xl text-primary-400"></i>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Total Cursos</p>
            <p class="text-3xl font-bold text-white">{{ stats?.summary?.totalCourses || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <i class="pi pi-book text-xl text-green-400"></i>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Inscrições Pendentes</p>
            <p class="text-3xl font-bold text-white">{{ stats?.summary?.pendingEnrollments || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <i class="pi pi-clock text-xl text-yellow-400"></i>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm">Inscrições Aprovadas</p>
            <p class="text-3xl font-bold text-white">{{ stats?.summary?.approvedEnrollments || 0 }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
            <i class="pi pi-check-circle text-xl text-accent-400"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Top Courses -->
      <div class="card">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold text-white">Cursos Mais Populares</h2>
        </div>
        <div class="p-6">
          <div v-if="stats?.topCourses?.length" class="space-y-4">
            <div v-for="item in stats.topCourses" :key="item._id" class="flex items-center gap-4">
              <img v-if="item.course?.image" :src="item.course.image" class="w-16 h-10 object-cover rounded-lg" />
              <div v-else class="w-16 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg"></div>
              <div class="flex-1">
                <p class="text-white font-medium truncate">{{ item.course?.title?.pt }}</p>
                <p class="text-sm text-gray-400">{{ item.count }} inscritos</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-center py-4">Nenhum dado disponível</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold text-white">Atividade Recente</h2>
        </div>
        <div class="p-6">
          <div v-if="stats?.recentLogs?.length" class="space-y-3">
            <div v-for="log in stats.recentLogs" :key="log._id" class="flex items-start gap-3 text-sm">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <i class="pi pi-history text-gray-400"></i>
              </div>
              <div>
                <p class="text-gray-300">{{ log.description }}</p>
                <p class="text-gray-500 text-xs">{{ new Date(log.createdAt).toLocaleString() }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-center py-4">Nenhuma atividade recente</p>
        </div>
      </div>
    </div>
  </div>
</template>
