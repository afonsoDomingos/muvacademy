<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import api from '@/services/api'

const props = defineProps({
  visible: Boolean,
  service: Object
})

const emit = defineEmits(['update:visible', 'success'])
const toast = useToast()
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  type: 'orcamento',
  message: ''
})

const types = [
  { label: 'Solicitar Orçamento', value: 'orcamento' },
  { label: 'Agendar Reunião / Consultoria', value: 'marcacao' }
]

async function handleSubmit() {
  try {
    loading.value = true
    const payload = {
      ...form.value,
      service: props.service?.title?.pt || props.service?.title || 'Consulta Geral'
    }
    await api.post('/service-requests', payload)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido enviado! Entraremos em contacto brevemente.', life: 5000 })
    emit('success')
    emit('update:visible', false)
    resetForm()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível enviar o pedido. Tente novamente.', life: 5000 })
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'orcamento',
    message: ''
  }
}
</script>

<template>
  <Dialog 
    :visible="visible" 
    @update:visible="emit('update:visible', $event)"
    modal
    header="Falar com Especialistas"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}"
    :style="{width: '500px'}"
    class="bg-surface-dark border-white/10"
  >
    <div class="py-4">
      <div v-if="service" class="mb-8 p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20">
        <p class="text-xs font-bold uppercase tracking-widest text-primary-400 mb-1">Serviço Selecionado</p>
        <h4 class="text-white font-bold">{{ service.title?.pt || service.title }}</h4>
      </div>

      <div class="grid gap-6">
        <div class="field">
          <label class="block text-sm font-bold mb-2 text-slate-300">Seu Nome *</label>
          <InputText v-model="form.name" class="input w-full" placeholder="Ex: Afonso Domingos" />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2 text-slate-300">Email *</label>
            <InputText v-model="form.email" type="email" class="input w-full" placeholder="exemplo@muv.co.mz" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2 text-slate-300">Telefone</label>
            <InputText v-model="form.phone" class="input w-full" placeholder="+258 84..." />
          </div>
        </div>

        <div class="field">
          <label class="block text-sm font-bold mb-2 text-slate-300">Empresa (opcional)</label>
          <InputText v-model="form.company" class="input w-full" placeholder="Nome da empresa" />
        </div>

        <div class="field">
          <label class="block text-sm font-bold mb-2 text-slate-300">O que deseja? *</label>
          <Dropdown v-model="form.type" :options="types" optionLabel="label" optionValue="value" class="input w-full" />
        </div>

        <div class="field">
          <label class="block text-sm font-bold mb-2 text-slate-300">Detalhes do Pedido *</label>
          <Textarea v-model="form.message" rows="4" class="input w-full" placeholder="Descreva brevemente a sua necessidade..." />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-4 w-full">
        <button @click="emit('update:visible', false)" class="btn btn-secondary flex-1 py-3">Cancelar</button>
        <button @click="handleSubmit" :disabled="loading || !form.name || !form.email || !form.message" class="btn btn-primary flex-1 py-3">
          <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
          {{ loading ? 'Enviando...' : 'Enviar Pedido' }}
        </button>
      </div>
    </template>
  </Dialog>
</template>
