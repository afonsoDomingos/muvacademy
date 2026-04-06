<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t } = useI18n()

const loading = ref(true)
const stats = ref(null)

const donutSeries = ref([])
const donutOptions = ref({
  chart: { type: 'donut', background: 'transparent' },
  labels: ['Pendentes', 'Aprovadas'],
  theme: { mode: 'dark' },
  colors: ['#eab308', '#10b981'],
  plotOptions: { pie: { donut: { size: '65%' } } },
  dataLabels: { enabled: false },
  stroke: { show: false },
  legend: { position: 'bottom' }
})

const barSeries = ref([])
const barOptions = ref({
  chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
  theme: { mode: 'dark' },
  colors: ['#3b82f6'],
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: { categories: [] }
})

onMounted(async () => {
  try {
    const response = await api.get('/stats/dashboard')
    stats.value = response.data.data

    // Setup Donut
    donutSeries.value = [
      stats.value?.summary?.pendingEnrollments || 0,
      stats.value?.summary?.approvedEnrollments || 0
    ]

    // Setup Bar
    if (stats.value?.topCourses) {
      barSeries.value = [{ name: 'Inscritos', data: stats.value.topCourses.map(c => c.count) }]
      barOptions.value = {
        ...barOptions.value,
        xaxis: { categories: stats.value.topCourses.map(c => c.course?.title?.pt?.substring(0, 20) + '...' || 'Sem Título') }
      }
    }
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
      <!-- Graphical Charts Area -->
      <div class="card">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold text-white">Status das Inscrições</h2>
        </div>
        <div class="p-6 flex items-center justify-center">
          <apexchart 
            type="donut" 
            height="320" 
            :options="donutOptions" 
            :series="donutSeries"
          ></apexchart>
        </div>
      </div>

      <div class="card">
        <div class="p-6 border-b border-white/10">
          <h2 class="text-xl font-bold text-white">Top 5 Cursos (Inscritos)</h2>
        </div>
        <div class="p-6">
          <apexchart 
            type="bar" 
            height="320" 
            :options="barOptions" 
            :series="barSeries"
          ></apexchart>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card md:col-span-2">
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
