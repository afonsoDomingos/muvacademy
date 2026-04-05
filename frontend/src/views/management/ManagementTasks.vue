<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const tasks = ref([])
const employees = ref([])
const loading = ref(true)
const authStore = useAuthStore()
const toast = useToast()

const showTaskDialog = ref(false)
const taskForm = ref({
  title: '',
  description: '',
  assignedTo: '',
  department: 'Geral',
  priority: 'media',
  deadline: ''
})

const isAdmin = computed(() => authStore.isAdmin)
const myDepartment = computed(() => authStore.user?.department || 'Geral')

const departments = [
  'Finanças', 'Comunicação e Marketing', 'Procurement', 'Recursos Humanos',
  'Gestão de Propostas', 'Análise de Desempenho', 'Engenharia', 'Direção', 'Geral'
]

async function fetchData() {
  try {
    const [tasksRes, empRes] = await Promise.all([
      api.get('/organization/tasks'),
      api.get('/organization/employees')
    ])
    tasks.value = tasksRes.data.data.tasks
    employees.value = empRes.data.data.employees
  } catch (error) {
    console.error('Error fetching tasks details:', error)
  } finally {
    loading.value = false
  }
}

async function handleCreateTask() {
  try {
    await api.post('/organization/tasks', taskForm.value)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa atribuída!', life: 3000 })
    showTaskDialog.value = false
    fetchData()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar tarefa', life: 3000 })
  }
}

async function updateTaskStatus(task, status) {
    try {
        await api.put(`/organization/tasks/${task._id}`, { status })
        toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Estado da tarefa alterado', life: 3000 })
        fetchData()
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar estado', life: 3000 })
    }
}

onMounted(fetchData)

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'urgente': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'alta': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'media': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2 italic">Fluxo de <span class="text-primary-500 uppercase italic">Trabalho</span></h1>
        <p class="text-slate-400">Atribuição de tarefas, prazos e monitorização de desempenho MUV.</p>
      </div>
      <button v-if="isAdmin" @click="showTaskDialog = true" class="btn btn-primary !py-3 !px-6 text-sm font-black uppercase tracking-widest flex items-center gap-3">
        <i class="pi pi-plus"></i> Atribuir Nova Tarefa
      </button>
    </div>

    <!-- Task Filters/Stats -->
    <div class="grid sm:grid-cols-3 gap-6">
       <div class="glass-card p-6 flex flex-col gap-2">
          <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">Tarefas Pendentes</span>
          <span class="text-2xl font-bold text-white">{{ tasks.filter(t => t.status !== 'concluida').length }}</span>
       </div>
       <div class="glass-card p-6 flex flex-col gap-2">
          <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">Taxa de Conclusão</span>
          <span class="text-2xl font-bold text-green-500">{{ Math.round((tasks.filter(t => t.status === 'concluida').length / (tasks.length || 1)) * 100) }}%</span>
       </div>
       <div class="glass-card p-6 flex flex-col gap-2">
          <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">Atrasadas</span>
          <span class="text-2xl font-bold text-red-500">{{ tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'concluida').length }}</span>
       </div>
    </div>

    <!-- Task Board -->
    <div class="grid lg:grid-cols-2 gap-8">
      <div v-for="task in tasks" :key="task._id" class="glass-card p-10 group border-white/5 hover:border-primary-500/20 transition-all duration-700">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
           <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                 <span :class="['px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border', getPriorityColor(task.priority)]">
                    {{ task.priority }}
                 </span>
                 <span class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{{ task.department }}</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{{ task.title }}</h3>
              <p class="text-slate-400 text-sm leading-relaxed line-clamp-2 italic">"{{ task.description }}"</p>
           </div>
           
           <div class="flex flex-col items-end gap-3 text-right">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                 <img v-if="task.assignedTo?.avatar" :src="task.assignedTo.avatar" class="w-6 h-6 rounded-full" />
                 <span class="text-xs text-white font-bold">{{ task.assignedTo?.name }}</span>
              </div>
              <span class="text-[10px] text-slate-500 font-mono">Deadline: {{ new Date(task.deadline).toLocaleDateString() }}</span>
           </div>
        </div>

        <div class="flex flex-wrap gap-4 items-center justify-between border-t border-white/5 pt-8">
           <div class="flex gap-2">
              <div v-for="st in ['pendente', 'em_progresso', 'concluida']" :key="st">
                 <button 
                   v-if="task.status !== st"
                   @click="updateTaskStatus(task, st)"
                   class="px-4 py-2 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
                 >
                    Marcar como {{ st.replace('_', ' ') }}
                 </button>
              </div>
           </div>
           
           <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', task.status === 'concluida' ? 'bg-green-500 shadow-lg shadow-green-500/40' : 'bg-primary-500 animate-pulse']"></div>
              <span :class="['text-xs font-black uppercase tracking-[0.2em]', task.status === 'concluida' ? 'text-green-500' : 'text-primary-400']">
                 {{ task.status.replace('_', ' ') }}
              </span>
           </div>
        </div>
      </div>
    </div>

    <!-- Create Task Dialog -->
    <Dialog v-model:visible="showTaskDialog" header="Atribuir Nova Tarefa" modal class="p-fluid w-full max-w-2xl bg-slate-900 text-white rounded-[3rem]">
      <div class="grid gap-10 p-12">
        <div class="grid sm:grid-cols-2 gap-8">
           <div class="field">
              <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Título da Tarefa</label>
              <input v-model="taskForm.title" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 placeholder-slate-600 focus:border-primary-500 transition-all h-14" placeholder="Ex: Relatório Mensal" />
           </div>
           <div class="field">
              <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Prazo Limite</label>
              <input v-model="taskForm.deadline" type="date" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 focus:border-primary-500 transition-all h-14" />
           </div>
        </div>

        <div class="field">
           <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Descrição Detalhada</label>
           <textarea v-model="taskForm.description" rows="3" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 placeholder-slate-600 focus:border-primary-500 transition-all" placeholder="O que precisa ser feito?"></textarea>
        </div>

        <div class="grid sm:grid-cols-3 gap-8">
           <div class="field">
              <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Atribuir a</label>
              <select v-model="taskForm.assignedTo" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl h-14 px-4 appearance-none focus:border-primary-500 transition-all cursor-pointer">
                 <option v-for="emp in employees" :key="emp._id" :value="emp._id">{{ emp.name }}</option>
              </select>
           </div>
           <div class="field">
              <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Prioridade</label>
              <select v-model="taskForm.priority" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl h-14 px-4 appearance-none focus:border-primary-500 transition-all cursor-pointer">
                 <option value="baixa">Baixa</option>
                 <option value="media">Média</option>
                 <option value="alta">Alta</option>
                 <option value="urgente">Urgente</option>
              </select>
           </div>
           <div class="field">
              <label class="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Departamento</label>
              <select v-model="taskForm.department" class="w-full bg-white/5 border border-white/10 text-white rounded-2xl h-14 px-4 appearance-none focus:border-primary-500 transition-all cursor-pointer">
                 <option v-for="dep in departments" :key="dep" :value="dep">{{ dep }}</option>
              </select>
           </div>
        </div>

        <div class="flex gap-6 mt-6">
           <button @click="showTaskDialog = false" class="btn btn-secondary flex-1 !py-4 font-bold border-white/10">Descartar</button>
           <button @click="handleCreateTask" class="btn btn-primary flex-1 !py-4 font-black uppercase tracking-widest shadow-2xl shadow-primary-500/20">Atribuir Agora</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
