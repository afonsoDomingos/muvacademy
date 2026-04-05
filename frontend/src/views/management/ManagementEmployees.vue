<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'

const employees = ref([])
const loading = ref(true)
const toast = useToast()

const showPromoteDialog = ref(false)
const selectedEmp = ref(null)
const promoteForm = ref({
  role: 'colaborador',
  department: 'Nenhum'
})

const departments = [
  'Finanças', 'Comunicação e Marketing', 'Procurement', 'Recursos Humanos',
  'Gestão de Propostas', 'Análise de Desempenho', 'Engenharia', 'Direção'
]

async function fetchEmployees() {
  try {
    const res = await api.get('/organization/employees')
    employees.value = res.data.data.employees
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

function openPromote(emp) {
  selectedEmp.value = emp
  promoteForm.value = {
    role: emp.role,
    department: emp.department || 'Nenhum'
  }
  showPromoteDialog.value = true
}

async function handlePromote() {
  try {
    await api.put(`/organization/employees/${selectedEmp.value._id}/promote`, promoteForm.value)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Colaborador promovido', life: 3000 })
    showPromoteDialog.value = false
    fetchEmployees()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao promover colaborador', life: 3000 })
  }
}

onMounted(fetchEmployees)
</script>

<template>
  <div class="space-y-10">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2 italic tracking-tighter">Equipa <span class="text-primary-500">MUV Academy</span></h1>
        <p class="text-slate-400">Gestão de colaboradores, funções e departamentos organizacionais.</p>
      </div>
      <button class="btn btn-secondary !py-2 !px-4 text-xs font-bold uppercase tracking-widest bg-white/5 border-white/10 hover:bg-white/10">
        Convidar Com link
      </button>
    </div>

    <!-- Employee Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="emp in employees" :key="emp._id" class="glass-card p-8 group hover:border-primary-500/30 transition-all duration-500">
        <div class="flex items-center gap-6 mb-8">
          <div class="relative">
            <img v-if="emp.avatar" :src="emp.avatar" class="w-16 h-16 rounded-2xl object-cover border border-white/10" />
            <div v-else class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-bold text-2xl border border-white/10">
              {{ emp.name[0] }}
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-950"></div>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-1 truncate">{{ emp.name }}</h3>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-0.5">{{ emp.role }}</p>
            <p class="text-slate-500 text-xs">{{ emp.department || 'Sem Departamento' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8">
          <div>
            <p class="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1.5">Score</p>
            <p class="text-white font-mono text-sm">{{ emp.performanceScore || 0 }}%</p>
          </div>
          <div>
             <p class="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1.5">Desde</p>
             <p class="text-white font-mono text-sm italic">{{ emp.hiredAt ? new Date(emp.hiredAt).toLocaleDateString() : 'N/A' }}</p>
          </div>
        </div>

        <div class="flex gap-4">
           <button @click="openPromote(emp)" class="btn btn-primary flex-1 !py-3 !text-[10px] uppercase font-black tracking-widest">
              Gerir Promoção
           </button>
           <button class="btn border border-white/10 text-white w-12 hover:bg-red-500/10 hover:border-red-500/20 transition-all">
              <i class="pi pi-trash text-xs"></i>
           </button>
        </div>
      </div>
    </div>

    <!-- Promotion Dialog -->
    <Dialog v-model:visible="showPromoteDialog" header="Promoção de Colaborador" modal class="p-fluid w-full max-w-md bg-slate-900 text-white border-white/10 overflow-hidden rounded-[2rem]">
      <div class="grid gap-8 p-10">
        <div class="flex flex-col items-center gap-4 mb-4">
           <div class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-3xl font-bold text-primary-400">
              {{ selectedEmp?.name?.[0] }}
           </div>
           <div class="text-center">
              <h4 class="text-white font-bold text-xl">{{ selectedEmp?.name }}</h4>
              <p class="text-slate-500 text-sm italic">{{ selectedEmp?.role }} atual</p>
           </div>
        </div>

        <div class="space-y-6">
          <div class="field">
            <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Nova Função</label>
            <Dropdown v-model="promoteForm.role" :options="['colaborador', 'gestor', 'admin']" class="w-full bg-white/5 border-white/10 text-white rounded-xl placeholder-slate-600 focus:border-primary-500 transition-all h-12 flex items-center px-4" />
          </div>
          <div class="field">
             <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Departamento</label>
             <Dropdown v-model="promoteForm.department" :options="departments" class="w-full bg-white/5 border-white/10 text-white rounded-xl placeholder-slate-600 focus:border-primary-500 transition-all h-12 flex items-center px-4" />
          </div>
        </div>

        <div class="flex gap-4 mt-8">
           <button @click="showPromoteDialog = false" class="btn btn-secondary flex-1 !py-4 font-bold border-white/10">Cancelar</button>
           <button @click="handlePromote" class="btn btn-primary flex-1 !py-4 font-black uppercase tracking-widest">Confirmar Promoção</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
