<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref({})

async function handleSubmit() {
  errors.value = {}
  
  if (!email.value) errors.value.email = t('auth.errors.requiredField')
  if (!password.value) errors.value.password = t('auth.errors.requiredField')
  
  if (Object.keys(errors.value).length) return
  
  loading.value = true
  
  const result = await authStore.login(email.value, password.value)
  
  loading.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: t('common.success'), detail: 'Login realizado!', life: 3000 })
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
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
          {{ t('auth.login.title') }}
        </h1>
        <p class="text-gray-400">{{ t('auth.login.subtitle') }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="card p-8">
        <!-- Email -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            {{ t('auth.login.email') }}
          </label>
          <InputText
            v-model="email"
            type="email"
            :class="{ 'p-invalid': errors.email }"
            class="w-full"
            placeholder="seu@email.com"
          />
          <small v-if="errors.email" class="text-red-400">{{ errors.email }}</small>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            {{ t('auth.login.password') }}
          </label>
          <Password
            v-model="password"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': errors.password }"
            class="w-full"
            inputClass="w-full"
            placeholder="••••••••"
          />
          <small v-if="errors.password" class="text-red-400">{{ errors.password }}</small>
        </div>

        <!-- Submit -->
        <Button
          type="submit"
          :label="t('auth.login.submit')"
          :loading="loading"
          class="w-full p-button-primary"
          icon="pi pi-sign-in"
        />

        <!-- Register link -->
        <p class="text-center mt-6 text-gray-400">
          {{ t('auth.login.noAccount') }}
          <RouterLink to="/register" class="text-primary-400 hover:text-primary-300 font-medium">
            {{ t('auth.login.register') }}
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
