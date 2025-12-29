<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Button from 'primevue/button'

const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const activeTab = ref('profile')

const name = ref(user.value?.name || '')
const phone = ref(user.value?.phone || '')
const bio = ref(user.value?.bio || '')
const profession = ref(user.value?.profession || '')
const savingProfile = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)

async function saveProfile() {
  savingProfile.value = true
  const result = await authStore.updateProfile({ name: name.value, phone: phone.value, bio: bio.value, profession: profession.value })
  savingProfile.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado!', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}

async function savePassword() {
  if (newPassword.value !== confirmPassword.value) {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'As senhas não coincidem', life: 3000 })
    return
  }
  
  savingPassword.value = true
  const result = await authStore.changePassword(currentPassword.value, newPassword.value)
  savingPassword.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada!', life: 3000 })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-display font-bold text-white mb-8">{{ t('nav.profile') }}</h1>

      <div class="grid md:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="card p-4 space-y-2">
            <button
              @click="activeTab = 'profile'"
              class="w-full text-left px-4 py-3 rounded-lg transition-colors"
              :class="activeTab === 'profile' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5'"
            >
              <i class="pi pi-user mr-2"></i>Perfil
            </button>
            <button
              @click="activeTab = 'password'"
              class="w-full text-left px-4 py-3 rounded-lg transition-colors"
              :class="activeTab === 'password' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5'"
            >
              <i class="pi pi-lock mr-2"></i>Senha
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="md:col-span-3">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="card p-8">
            <h2 class="text-xl font-bold text-white mb-6">Informações do Perfil</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Nome Completo</label>
                <InputText v-model="name" class="w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Email</label>
                <InputText :value="user?.email" class="w-full" disabled />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Telefone</label>
                <InputText v-model="phone" class="w-full" placeholder="+258 84 123 4567" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Profissão</label>
                <InputText v-model="profession" class="w-full" placeholder="Ex: Engenheiro Civil" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Bio</label>
                <Textarea v-model="bio" rows="3" class="w-full" placeholder="Fale um pouco sobre você..." />
              </div>
              <Button @click="saveProfile" :loading="savingProfile" label="Salvar Alterações" icon="pi pi-check" class="p-button-primary" />
            </div>
          </div>

          <!-- Password Tab -->
          <div v-if="activeTab === 'password'" class="card p-8">
            <h2 class="text-xl font-bold text-white mb-6">Alterar Senha</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Senha Atual</label>
                <Password v-model="currentPassword" :feedback="false" toggleMask class="w-full" inputClass="w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Nova Senha</label>
                <Password v-model="newPassword" toggleMask class="w-full" inputClass="w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Confirmar Nova Senha</label>
                <Password v-model="confirmPassword" :feedback="false" toggleMask class="w-full" inputClass="w-full" />
              </div>
              <Button @click="savePassword" :loading="savingPassword" label="Alterar Senha" icon="pi pi-lock" class="p-button-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
