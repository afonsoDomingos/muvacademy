<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({
  employees: 0,
  customers: 0,
  activeTasks: 0,
  submittedProposals: 0,
  finances: []
})

const loading = ref(true)

async function fetchStats() {
  try {
    const res = await api.get('/organization/overview')
    stats.value = res.data.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)

const getFinanceTotal = (type) => {
    const item = stats.value.finances.find(f => f._id === type)
    return item ? item.total : 0
}
</script>

<template>
  <div class="space-y-10">
    <div>
      <h1 class="text-3xl font-display font-bold text-white mb-2">Painel de Gestão <span class="text-primary-500 italic">MUV</span></h1>
      <p class="text-slate-400">Visão geral do crescimento e produtividade da organização.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="card in [
        { label: 'Colaboradores', value: stats.employees, icon: 'pi pi-users', color: 'text-primary-400', bg: 'bg-primary-500/10' },
        { label: 'Clientes Registados', value: stats.customers, icon: 'pi pi-briefcase', color: 'text-accent-400', bg: 'bg-accent-500/10' },
        { label: 'Tarefas Ativas', value: stats.activeTasks, icon: 'pi pi-list', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Concursos Submetidos', value: stats.submittedProposals, icon: 'pi pi-file', color: 'text-blue-400', bg: 'bg-blue-500/10' }
      ]" :key="card.label" class="glass-card p-8 group">
        <div class="flex justify-between items-start">
          <div :class="[card.bg, card.color, 'p-3 rounded-2xl text-xl']">
            <i :class="card.icon"></i>
          </div>
          <i class="pi pi-trending-up text-slate-800 text-sm group-hover:text-primary-500 transition-colors"></i>
        </div>
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mt-6 mb-2">{{ card.label }}</h3>
        <p class="text-3xl font-bold text-white">{{ card.value }}</p>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="grid lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 glass-card p-10 bg-gradient-to-br from-slate-900 to-slate-950">
        <h2 class="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <i class="pi pi-chart-line text-primary-400"></i>
          Fluxo Financeiro Global
        </h2>
        <div class="grid sm:grid-cols-2 gap-10">
          <div class="flex flex-col gap-2">
            <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Receita Total</span>
            <span class="text-3xl font-bold text-green-400 font-mono">{{ getFinanceTotal('receita').toLocaleString() }} MT</span>
          </div>
          <div class="flex flex-col gap-2 border-l border-white/10 pl-10">
            <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Despesa Total</span>
            <span class="text-3xl font-bold text-red-400 font-mono">{{ getFinanceTotal('despesa').toLocaleString() }} MT</span>
          </div>
        </div>
        <div class="mt-12 h-2 bg-white/5 rounded-full overflow-hidden flex">
          <div 
            class="bg-green-500" 
            :style="`width: ${(getFinanceTotal('receita') / (getFinanceTotal('receita') + getFinanceTotal('despesa'))) * 100}%`"
          ></div>
          <div 
            class="bg-red-500" 
            :style="`width: ${(getFinanceTotal('despesa') / (getFinanceTotal('receita') + getFinanceTotal('despesa'))) * 100}%`"
          ></div>
        </div>
      </div>

      <div class="glass-card p-10 flex flex-col justify-center items-center text-center">
         <div class="w-24 h-24 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-4xl text-primary-500 mb-6">
            <i class="pi pi-shield"></i>
         </div>
         <h4 class="text-white font-bold text-xl mb-4">MUV Corporate</h4>
         <p class="text-slate-400 text-sm leading-relaxed mb-6">Ambiente seguro para colaboradores. Use as ferramentas ao lado para gerir tarefas e concursos.</p>
         <button @click="$router.push('/management/tasks')" class="btn btn-primary w-full !py-3">Minhas Tarefas</button>
      </div>
    </div>
  </div>
</template>
