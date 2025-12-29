<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const loading = ref(false)
const errors = ref({})

async function handleSubmit() {
  errors.value = {}
  
  if (!name.value) errors.value.name = t('auth.errors.requiredField')
  if (!email.value) errors.value.email = t('auth.errors.requiredField')
  if (!password.value) errors.value.password = t('auth.errors.requiredField')
  if (password.value !== confirmPassword.value) errors.value.confirmPassword = t('auth.errors.passwordMismatch')
  if (!acceptTerms.value) errors.value.terms = t('auth.errors.requiredField')
  
  if (Object.keys(errors.value).length) return
  
  loading.value = true
  
  const result = await authStore.register({ name: name.value, email: email.value, password: password.value, phone: phone.value || undefined })
  
  loading.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: t('common.success'), detail: 'Conta criada com sucesso!', life: 3000 })
    router.push('/dashboard')
  } else {
    toast.add({ severity: 'error', summary: t('common.error'), detail: result.message, life: 5000 })
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
          <span class="text-white font-bold text-2xl">M</span>
        </div>
        <h1 class="text-3xl font-display font-bold text-white mb-2">
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-gray-400">{{ t('auth.register.subtitle') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="card p-8">
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('auth.register.name') }}</label>
          <InputText v-model="name" :class="{ 'p-invalid': errors.name }" class="w-full" placeholder="Seu nome completo" />
          <small v-if="errors.name" class="text-red-400">{{ errors.name }}</small>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('auth.register.email') }}</label>
          <InputText v-model="email" type="email" :class="{ 'p-invalid': errors.email }" class="w-full" placeholder="seu@email.com" />
          <small v-if="errors.email" class="text-red-400">{{ errors.email }}</small>
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('auth.register.phone') }}</label>
          <InputText v-model="phone" class="w-full" placeholder="+258 84 123 4567" />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('auth.register.password') }}</label>
          <Password v-model="password" toggleMask :class="{ 'p-invalid': errors.password }" class="w-full" inputClass="w-full" />
          <small v-if="errors.password" class="text-red-400">{{ errors.password }}</small>
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">{{ t('auth.register.confirmPassword') }}</label>
          <Password v-model="confirmPassword" :feedback="false" toggleMask :class="{ 'p-invalid': errors.confirmPassword }" class="w-full" inputClass="w-full" />
          <small v-if="errors.confirmPassword" class="text-red-400">{{ errors.confirmPassword }}</small>
        </div>

        <!-- Terms -->
        <div class="mb-6 flex items-start gap-2">
          <Checkbox v-model="acceptTerms" :binary="true" inputId="terms" />
          <label for="terms" class="text-sm text-gray-400 cursor-pointer">{{ t('auth.register.terms') }}</label>
        </div>
        <small v-if="errors.terms" class="text-red-400 block -mt-4 mb-4">{{ errors.terms }}</small>

        <!-- Submit -->
        <Button type="submit" :label="t('auth.register.submit')" :loading="loading" class="w-full p-button-primary" icon="pi pi-user-plus" />

        <!-- Login link -->
        <p class="text-center mt-6 text-gray-400">
          {{ t('auth.register.hasAccount') }}
          <RouterLink to="/login" class="text-primary-400 hover:text-primary-300 font-medium">{{ t('auth.register.login') }}</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
