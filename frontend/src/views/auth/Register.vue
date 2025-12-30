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
  <div class="fixed inset-0 z-50 flex bg-white dark:bg-slate-900">
    <!-- Left Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-60"
        style="background-image: url('/images/auth-bg.jpg');"
      ></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      
      <!-- Content -->
      <div class="relative z-10 w-full flex flex-col justify-end p-16 pb-24 text-white">
        <div class="mb-8">
          <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-glow">
            <span class="text-3xl font-display font-bold text-white">M</span>
          </div>
          <h1 class="text-5xl font-display font-bold mb-6 leading-tight text-white drop-shadow-md">
            {{ t('auth.hero.registerTitle', 'Junte-se à Elite da Engenharia') }}
          </h1>
          <p class="text-xl text-gray-200 leading-relaxed max-w-lg drop-shadow-sm">
            {{ t('auth.hero.registerSubtitle', 'Crie sua conta hoje e desbloqueie acesso ilimitado a materiais exclusivos, mentors especializados e uma comunidade vibrante.') }}
          </p>
        </div>
        
        <div class="space-y-4 pt-8 border-t border-white/20">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
              <i class="pi pi-check"></i>
            </div>
            <span class="text-gray-200 font-medium">Acesso vitalício aos cursos adquiridos</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
              <i class="pi pi-check"></i>
            </div>
            <span class="text-gray-200 font-medium">Certificados reconhecidos pelo mercado</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
              <i class="pi pi-check"></i>
            </div>
            <span class="text-gray-200 font-medium">Suporte direto com instrutores</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-surface dark:bg-slate-950 relative overflow-y-auto">
      <div class="w-full max-w-md space-y-6 my-auto">
         <!-- Close Button (Mobile) -->
         <RouterLink to="/" class="absolute top-6 right-6 lg:hidden text-muted hover:text-foreground">
          <i class="pi pi-times text-2xl"></i>
        </RouterLink>

         <!-- Home Link (Desktop) -->
         <RouterLink to="/" class="absolute top-8 right-8 hidden lg:flex items-center gap-2 text-muted hover:text-primary transition-colors">
          <i class="pi pi-home"></i>
          <span class="text-sm font-medium">Voltar para Home</span>
        </RouterLink>

         <!-- Mobile Logo -->
         <div class="lg:hidden text-center mb-8">
          <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span class="text-white font-bold text-xl">M</span>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <h2 class="text-3xl font-bold text-foreground mb-2">{{ t('auth.register.title') }}</h2>
          <p class="text-muted text-lg">Preencha seus dados para começar.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">{{ t('auth.register.name') }}</label>
            <div class="relative">
              <i class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
              <InputText 
                v-model="name" 
                :class="{ 'p-invalid': errors.name }" 
                class="w-full pl-11 py-3 !rounded-xl !bg-background !border-themeborder focus:!border-primary-500 focus:!ring-primary-500/20 text-foreground" 
                placeholder="Seu nome completo" 
              />
            </div>
            <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">{{ t('auth.register.email') }}</label>
            <div class="relative">
              <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
              <InputText 
                v-model="email" 
                type="email" 
                :class="{ 'p-invalid': errors.email }" 
                class="w-full pl-11 py-3 !rounded-xl !bg-background !border-themeborder focus:!border-primary-500 focus:!ring-primary-500/20 text-foreground" 
                placeholder="seu@email.com" 
              />
            </div>
            <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">{{ t('auth.register.phone') }}</label>
            <div class="relative">
              <i class="pi pi-phone absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
              <InputText 
                v-model="phone" 
                class="w-full pl-11 py-3 !rounded-xl !bg-background !border-themeborder focus:!border-primary-500 focus:!ring-primary-500/20 text-foreground" 
                placeholder="+258 84 123 4567" 
              />
            </div>
          </div>

          <!-- Password Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">{{ t('auth.register.password') }}</label>
              <Password 
                v-model="password" 
                toggleMask 
                :class="{ 'p-invalid': errors.password }" 
                class="w-full [&>input]:!w-full [&>input]:!pl-11 [&>input]:!py-3 [&>input]:!rounded-xl [&>input]:!bg-background [&>input]:!border-themeborder [&>input]:focus:!border-primary-500 [&>input]:text-foreground" 
                inputClass="w-full"
              />
              <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">{{ t('auth.register.confirmPassword') }}</label>
              <Password 
                v-model="confirmPassword" 
                :feedback="false" 
                toggleMask 
                :class="{ 'p-invalid': errors.confirmPassword }" 
                class="w-full [&>input]:!w-full [&>input]:!pl-11 [&>input]:!py-3 [&>input]:!rounded-xl [&>input]:!bg-background [&>input]:!border-themeborder [&>input]:focus:!border-primary-500 [&>input]:text-foreground" 
                inputClass="w-full" 
              />
              <small v-if="errors.confirmPassword" class="text-red-500">{{ errors.confirmPassword }}</small>
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3 p-4 rounded-xl bg-background border border-themeborder">
            <Checkbox v-model="acceptTerms" :binary="true" inputId="terms" />
            <label for="terms" class="text-sm text-muted cursor-pointer flex-1">
              Li e concordo com os <a href="#" class="text-primary-600 hover:underline font-medium">Termos de Serviço</a> e <a href="#" class="text-primary-600 hover:underline font-medium">Política de Privacidade</a> da MUV Academy.
            </label>
          </div>
          <small v-if="errors.terms" class="text-red-500 block -mt-2">{{ errors.terms }}</small>

          <!-- Submit -->
          <Button 
            type="submit" 
            :loading="loading" 
            class="w-full !bg-primary-600 hover:!bg-primary-700 !border-none !h-12 !text-lg !font-semibold !rounded-xl shadow-lg shadow-primary-500/20 text-white mt-4"
          >
            <i class="pi pi-user-plus mr-2"></i>
            {{ t('auth.register.submit') }}
          </Button>

          <!-- Login link -->
          <p class="text-center text-muted">
            {{ t('auth.register.hasAccount') }}
            <RouterLink to="/login" class="text-primary-600 hover:text-primary-500 font-bold transition-colors">
              {{ t('auth.register.login') }}
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
