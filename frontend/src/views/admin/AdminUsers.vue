<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/services/api'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const loading = ref(false)
const users = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)

const form = ref({ name: '', email: '', password: '', role: 'cliente', phone: '' })
const roles = [
  { value: 'cliente', label: 'Cliente (Aluno)' },
  { value: 'admin', label: 'Admin' },
  { value: 'superadmin', label: 'Superadmin' }
]

async function fetchUsers() {
  loading.value = true
  try {
    const response = await api.get('/users', { params: { limit: 100 } })
    users.value = response.data.data.users
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar usuários', life: 5000 })
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  form.value = { name: '', email: '', password: '', role: 'cliente', phone: '' }
  isEdit.value = false
  showDialog.value = true
}

function openEditDialog(user) {
  form.value = { ...user, password: '' }
  isEdit.value = true
  showDialog.value = true
}

async function saveUser() {
  saving.value = true
  try {
    if (isEdit.value) {
      const data = { ...form.value }
      if (!data.password) delete data.password
      await api.put(`/users/${form.value._id}`, data)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário atualizado!', life: 3000 })
    } else {
      await api.post('/users', form.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado!', life: 3000 })
    }
    showDialog.value = false
    fetchUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao salvar', life: 5000 })
  } finally {
    saving.value = false
  }
}

async function deleteUser(user) {
  confirm.require({
    message: `Tem certeza que deseja excluir ${user.name}?`,
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await api.delete(`/users/${user._id}`)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído!', life: 3000 })
        fetchUsers()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Falha ao excluir', life: 5000 })
      }
    }
  })
}

async function toggleActive(user) {
  try {
    await api.patch(`/users/${user._id}/toggle-active`)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: user.isActive ? 'Usuário desativado' : 'Usuário ativado', life: 3000 })
    fetchUsers()
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message, life: 5000 })
  }
}

function getRoleClass(role) {
  switch (role) {
    case 'superadmin': return 'badge-error'
    case 'admin': return 'badge-warning'
    default: return 'badge-primary'
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-display font-bold text-white">{{ t('admin.users') }}</h1>
      <Button label="Novo Usuário" icon="pi pi-plus" class="p-button-primary" @click="openCreateDialog" />
    </div>

    <div class="card">
      <DataTable :value="users" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column header="Usuário">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span class="text-white font-medium">{{ data.name?.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-white font-medium">{{ data.name }}</p>
                <p class="text-gray-400 text-sm">{{ data.email }}</p>
              </div>
            </div>
          </template>
        </Column>
        <Column header="Role">
          <template #body="{ data }">
            <span :class="getRoleClass(data.role)" class="badge uppercase">{{ data.role }}</span>
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <span :class="data.isActive ? 'badge-success' : 'badge-error'" class="badge">
              {{ data.isActive ? 'Ativo' : 'Inativo' }}
            </span>
          </template>
        </Column>
        <Column header="Criado em">
          <template #body="{ data }">
            <span class="text-gray-400 text-sm">{{ new Date(data.createdAt).toLocaleDateString() }}</span>
          </template>
        </Column>
        <Column header="Ações" style="width: 150px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-pencil" class="p-button-sm p-button-text" @click="openEditDialog(data)" v-tooltip="'Editar'" />
              <Button :icon="data.isActive ? 'pi pi-lock' : 'pi pi-lock-open'" class="p-button-sm p-button-text" @click="toggleActive(data)" v-tooltip="data.isActive ? 'Desativar' : 'Ativar'" />
              <Button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click="deleteUser(data)" v-tooltip="'Excluir'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- User Dialog -->
    <Dialog v-model:visible="showDialog" :header="isEdit ? 'Editar Usuário' : 'Novo Usuário'" :style="{ width: '500px' }" modal>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-2">Nome</label>
          <InputText v-model="form.name" class="w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">Email</label>
          <InputText v-model="form.email" type="email" class="w-full" :disabled="isEdit" />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">{{ isEdit ? 'Nova Senha (deixe vazio para manter)' : 'Senha' }}</label>
          <Password v-model="form.password" :feedback="false" toggleMask class="w-full" inputClass="w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">Telefone</label>
          <InputText v-model="form.phone" class="w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-2">Role</label>
          <Dropdown v-model="form.role" :options="roles" optionLabel="label" optionValue="value" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="showDialog = false" />
        <Button :label="isEdit ? 'Salvar' : 'Criar'" class="p-button-primary" :loading="saving" @click="saveUser" />
      </template>
    </Dialog>
  </div>
</template>
