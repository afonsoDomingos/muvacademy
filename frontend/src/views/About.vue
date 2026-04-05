<script setup>
import { onMounted } from 'vue'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950">
    <main class="pt-20">
      <!-- Hero Section -->
      <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-mesh opacity-20"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="max-w-3xl">
            <h3 class="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">A Nossa Identidade</h3>
            <h1 class="text-5xl sm:text-7xl font-display font-bold text-white tracking-tighter leading-tight mb-8">
              MUV Educação e Engenharia
            </h1>
            <p class="text-slate-400 text-xl leading-relaxed">
              A MUV é uma empresa moçambicana especializada em Educação, Engenharia e Transformação Digital, comprometida em impulsionar o desenvolvimento sustentável de pessoas e organizações.
            </p>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-24 bg-white/5 border-y border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-20 items-center mb-24">
            <p class="text-slate-400 text-lg leading-relaxed">
              Acreditamos que educação e tecnologia são os motores do progresso — por isso, unimos formação de excelência e soluções tecnológicas práticas para preparar profissionais e empresas para os desafios do futuro.
            </p>
            <div class="relative rounded-[2rem] overflow-hidden group aspect-video shadow-2xl border border-white/10">
               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
               <div class="absolute bottom-6 left-6 flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Engenharia de Excelência</span>
               </div>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-8">
             <!-- Missão -->
             <div class="glass-card p-10 group hover:bg-primary-500/10 transition-all duration-500 border-white/10 hover:border-primary-500/40">
                <div class="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-8 group-hover:scale-110 transition-transform">
                   <i class="pi pi-target text-2xl"></i>
                </div>
                <h4 class="text-white font-bold text-2xl mb-4">Missão</h4>
                <p class="text-slate-500 text-sm leading-relaxed italic">"Contribuir para o avanço da educação e da engenharia, oferecendo formações de excelência e soluções consultivas inovadoras, atuando como um hub integrador de marcas, pessoas e conhecimentos que impulsionam o desenvolvimento sustentável."</p>
             </div>

             <!-- Visão -->
             <div class="glass-card p-10 group hover:bg-accent-500/10 transition-all duration-500 border-white/10 hover:border-accent-500/40">
                <div class="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-400 mb-8 group-hover:scale-110 transition-transform">
                   <i class="pi pi-eye text-2xl"></i>
                </div>
                <h4 class="text-white font-bold text-2xl mb-4">Visão</h4>
                <p class="text-slate-500 text-sm leading-relaxed italic">"Ser reconhecida como uma referência global em educação técnico-profissional e consultoria em engenharia, impulsionando a inovação, a formação de profissionais qualificados e o sucesso de projetos estratégicos em Moçambique e além-fronteiras."</p>
             </div>

             <!-- Valores -->
             <div class="glass-card p-10 sm:col-span-2 group hover:bg-white/10 transition-all duration-500 border-white/10 hover:border-white/20">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div>
                      <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                         <i class="pi pi-verified text-2xl"></i>
                      </div>
                      <h4 class="text-white font-bold text-2xl mb-2 uppercase tracking-tighter">Os Nossos Valores</h4>
                      <p class="text-slate-500 text-sm">Os pilares que sustentam a nossa excelência.</p>
                   </div>
                   <div class="flex flex-wrap gap-x-8 gap-y-4 max-w-xl">
                      <div v-for="val in ['Excelência Educacional', 'Inovação', 'Colaboração', 'Integridade', 'Sustentabilidade']" :key="val" class="flex items-center gap-3">
                          <div class="w-2 h-2 rounded-full bg-primary-500"></div>
                          <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-300">{{ val }}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
