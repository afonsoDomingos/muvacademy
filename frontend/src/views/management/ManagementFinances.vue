<script setup>
import { ref } from 'vue'

const finances = ref([
    { id: 1, date: '2026-04-01', description: 'Venda de Curso: Energia Solar', amount: 15000, type: 'receita', category: 'cursos' },
    { id: 2, date: '2026-04-03', description: 'Pagamento Salários - Março', amount: 85000, type: 'despesa', category: 'salarios' },
    { id: 3, date: '2026-04-05', description: 'Anúncios Facebook/IG', amount: 5000, type: 'despesa', category: 'marketing' }
])

const stats = {
    receita: 15000,
    despesa: 90000,
    balance: -75000
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2 italic">Controladoria <span class="text-primary-500 uppercase italic">Financeira</span></h1>
        <p class="text-slate-400">Fluxo de caixa, despesas operacionais e receitas da MUV.</p>
      </div>
      <button class="btn btn-primary !py-3 !px-6 text-sm font-black uppercase tracking-widest flex items-center gap-3">
        <i class="pi pi-plus"></i> Novo Registo
      </button>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
       <div class="glass-card p-10 flex flex-col gap-2 border-green-500/10">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Entradas</span>
          <span class="text-3xl font-bold text-green-400">{{ stats.receita.toLocaleString() }} MT</span>
       </div>
       <div class="glass-card p-10 flex flex-col gap-2 border-red-500/10">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Saídas</span>
          <span class="text-3xl font-bold text-red-400">{{ stats.despesa.toLocaleString() }} MT</span>
       </div>
       <div class="glass-card p-10 flex flex-col gap-2" :class="stats.balance >= 0 ? 'border-green-500/10' : 'border-red-500/10'">
          <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Saldo Mensal</span>
          <span class="text-3xl font-bold" :class="stats.balance >= 0 ? 'text-green-500' : 'text-red-500'">{{ stats.balance.toLocaleString() }} MT</span>
       </div>
    </div>

    <!-- Ledgers Table Placeholder -->
    <div class="glass-card overflow-hidden">
       <table class="w-full text-left">
          <thead>
             <tr class="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th class="p-6">Data</th>
                <th class="p-6">Descrição</th>
                <th class="p-6">Categoria</th>
                <th class="p-6 text-right">Valor</th>
             </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
             <tr v-for="item in finances" :key="item.id" class="hover:bg-white/5 transition-colors">
                <td class="p-6 text-slate-400 font-mono text-xs">{{ item.date }}</td>
                <td class="p-6 text-white font-bold text-sm">{{ item.description }}</td>
                <td class="p-6">
                   <span class="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 border border-white/10">
                      {{ item.category }}
                   </span>
                </td>
                <td class="p-6 text-right font-bold" :class="item.type === 'receita' ? 'text-green-400' : 'text-red-400'">
                   {{ item.type === 'receita' ? '+' : '-' }} {{ item.amount.toLocaleString() }} MT
                </td>
             </tr>
          </tbody>
       </table>
    </div>
  </div>
</template>
