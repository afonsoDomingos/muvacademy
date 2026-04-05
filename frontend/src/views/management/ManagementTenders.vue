<script setup>
import { ref } from 'vue'

const proposals = ref([
    { id: 1, title: 'Concurso: Formação em Energias Renováveis - MIREME', client: 'Governo de Moçambique', deadline: '2026-04-20', status: 'submetido', department: 'Engenharia', amount: 450000 },
    { id: 2, title: 'Proposta: Consultoria de Eficiência Energética - EDM', client: 'EDM EP', deadline: '2026-05-15', status: 'preparacao', department: 'Consultoria', amount: 120000 }
])

const stats = {
    submetidas: 1,
    preparacao: 1,
    aprovadas: 0
}

const getStatusColor = (status) => {
    switch(status) {
        case 'aprovado': return 'text-green-500 bg-green-500/10 border-green-500/20';
        case 'submetido': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        case 'preparacao': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2 italic">Hub de <span class="text-primary-400 uppercase italic">Concursos</span></h1>
        <p class="text-slate-400">Gestão de propostas técnico-comerciais e concursos públicos em Moçambique.</p>
      </div>
      <button class="btn btn-primary !py-3 !px-6 text-sm font-black uppercase tracking-widest flex items-center gap-3">
        <i class="pi pi-plus"></i> Nova Submissão
      </button>
    </div>

    <!-- Tenders Stats -->
    <div class="grid md:grid-cols-3 gap-6">
       <div class="glass-card p-10 flex flex-col gap-2">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">A aguardar resposta</span>
          <span class="text-3xl font-bold text-white">{{ stats.submetidas }}</span>
       </div>
       <div class="glass-card p-10 flex flex-col gap-2">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Em Preparação</span>
          <span class="text-3xl font-bold text-yellow-500">{{ stats.preparacao }}</span>
       </div>
       <div class="glass-card p-10 flex flex-col gap-2">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Taxa de Sucesso</span>
          <span class="text-3xl font-bold text-primary-400">{{ Math.round((stats.aprovadas / (stats.submetidas + stats.preparacao || 1)) * 100) }}%</span>
       </div>
    </div>

    <!-- Proposals List -->
    <div class="grid lg:grid-cols-2 gap-8">
       <div v-for="prop in proposals" :key="prop.id" class="glass-card p-10 group overflow-hidden border-white/5 hover:border-primary-500/20 transition-all duration-700">
          <div class="flex justify-between items-start mb-8">
             <div class="flex items-center gap-3">
                <span :class="['px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border', getStatusColor(prop.status)]">
                   {{ prop.status }}
                </span>
                <span class="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{{ prop.department }}</span>
             </div>
             <i class="pi pi-file-pdf text-slate-700 group-hover:text-red-500 transition-colors text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">{{ prop.title }}</h3>
          <p class="text-slate-500 text-sm mb-8 italic">Cliente: {{ prop.client }}</p>
          
          <div class="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10">
             <div class="flex flex-col gap-1">
                <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">Valor Estimado</span>
                <span class="text-lg font-bold text-primary-400 font-mono">{{ prop.amount.toLocaleString() }} MT</span>
             </div>
             <div class="flex flex-col gap-1 text-right">
                <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">Deadline Entrega</span>
                <span class="text-lg font-bold text-white font-mono">{{ new Date(prop.deadline).toLocaleDateString() }}</span>
             </div>
          </div>
          <div class="mt-8 flex gap-4">
             <button class="btn btn-secondary flex-1 !p-3 font-black text-[10px] uppercase tracking-widest border-white/10">Ver Detalhes</button>
             <button class="btn border border-white/10 text-white flex-1 hover:bg-primary-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">Atualizar Status</button>
          </div>
       </div>
    </div>
  </div>
</template>
