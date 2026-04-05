<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoImg from '@/assets/logo.png'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const user = computed(() => authStore.user)

const menuItems = [
  { path: '/management', name: 'management-dashboard', icon: 'pi pi-chart-bar', label: 'Dashboard' },
  { path: '/management/tasks', name: 'management-tasks', icon: 'pi pi-list', label: 'Minhas Tarefas' },
  { path: '/management/employees', name: 'management-employees', icon: 'pi pi-users', label: 'Equipa MUV' },
  { path: '/management/finances', name: 'management-finances', icon: 'pi pi-wallet', label: 'Finanças' },
  { path: '/management/tenders', name: 'management-tenders', icon: 'pi pi-file', label: 'Concursos' }
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-slate-900 border-r border-white/5 flex flex-col">
      <div class="p-6 border-b border-white/5 flex items-center gap-3">
        <img :src="logoImg" class="h-8" />
        <span class="text-white font-display font-bold text-lg tracking-tighter">MUV <span class="text-primary-500 italic">ERP</span></span>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <RouterLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
          :class="route.name === item.name ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span class="font-medium">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-white/5 space-y-4">
        <div class="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl">
          <img v-if="user?.avatar" :src="user.avatar" class="w-10 h-10 rounded-full border border-white/10" />
          <div v-else class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            {{ user?.name?.[0] }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-bold truncate">{{ user?.name }}</p>
            <p class="text-slate-500 text-[10px] uppercase font-black tracking-widest truncate">{{ user?.role }}</p>
          </div>
        </div>
        
        <RouterLink to="/" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <i class="pi pi-arrow-left"></i>
          <span class="text-sm">Voltar ao Site</span>
        </RouterLink>
        
        <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <i class="pi pi-power-off"></i>
          <span class="text-sm font-bold">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
      <div class="max-w-7xl mx-auto pb-20">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-primary-500 text-white shadow-lg shadow-primary-500/20;
}
</style>
