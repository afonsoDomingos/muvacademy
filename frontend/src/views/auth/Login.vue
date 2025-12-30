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
  <div class="fixed inset-0 z-50 flex bg-white dark:bg-slate-900">
    <!-- Left Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
      <!-- Background Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-60"
        style="background-image: url('/images/auth-bg.jpg');"
      ></div>
      
      <!-- Gradient Overlay for Readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      
      <!-- Content -->
      <div class="relative z-10 w-full flex flex-col justify-end p-16 pb-24 text-white">
        <div class="mb-8">
          <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-glow">
            <span class="text-3xl font-display font-bold text-white">M</span>
          </div>
          <h1 class="text-5xl font-display font-bold mb-6 leading-tight text-white drop-shadow-md">
            {{ t('auth.hero.title', 'Domine as Habilidades do Futuro') }}
          </h1>
          <p class="text-xl text-gray-200 leading-relaxed max-w-lg drop-shadow-sm">
            {{ t('auth.hero.subtitle', 'Acesse cursos de engenharia, gestão e tecnologia com a MUV Academy. Sua jornada para a excelência começa aqui.') }}
          </p>
        </div>
        
        <!-- Stats -->
        <div class="flex gap-12 pt-8 border-t border-white/20">
          <div>
            <div class="text-3xl font-bold mb-1 text-white">500+</div>
            <div class="text-sm text-gray-300 uppercase tracking-wider">Alunos</div>
          </div>
          <div>
            <div class="text-3xl font-bold mb-1 text-white">20+</div>
            <div class="text-sm text-gray-300 uppercase tracking-wider">Cursos</div>
          </div>
          <div>
            <div class="text-3xl font-bold mb-1 text-white">4.9</div>
            <div class="text-sm text-gray-300 uppercase tracking-wider">Avaliação</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-surface dark:bg-slate-950 relative overflow-y-auto">
      <div class="w-full max-w-md space-y-8">
        <!-- Close Button (Mobile) -->
        <RouterLink to="/" class="absolute top-6 right-6 lg:hidden text-muted hover:text-foreground">
          <i class="pi pi-times text-2xl"></i>
        </RouterLink>

        <!-- Home Link (Desktop) -->
         <RouterLink to="/" class="absolute top-8 right-8 hidden lg:flex items-center gap-2 text-muted hover:text-primary transition-colors">
          <i class="pi pi-home"></i>
          <span class="text-sm font-medium">Voltar para Home</span>
        </RouterLink>

        <!-- Logo/Header -->
        <div class="text-center lg:text-left">
          <div class="lg:hidden w-12 h-12 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span class="text-white font-bold text-xl">M</span>
          </div>
          <h2 class="text-4xl font-display font-bold text-foreground mb-3">
            {{ t('auth.login.title') }}
          </h2>
          <p class="text-muted text-lg">
            {{ t('auth.login.subtitle') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">
                {{ t('auth.login.email') }}
              </label>
              <div class="relative">
                <i class="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10"></i>
                <InputText
                  v-model="email"
                  type="email"
                  :class="{ 'p-invalid': errors.email }"
                  class="w-full pl-11 py-3 !rounded-xl !bg-background !border-themeborder focus:!border-primary-500 focus:!ring-primary-500/20 text-foreground"
                  placeholder="seu@email.com"
                />
              </div>
              <small v-if="errors.email" class="text-red-500 mt-1 block">{{ errors.email }}</small>
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-foreground">
                  {{ t('auth.login.password') }}
                </label>
                <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Esqueceu a senha?
                </a>
              </div>
              <div class="relative">
                <i class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10"></i>
                <Password
                  v-model="password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': errors.password }"
                  class="w-full [&>input]:!w-full [&>input]:!pl-11 [&>input]:!py-3 [&>input]:!rounded-xl [&>input]:!bg-background [&>input]:!border-themeborder [&>input]:focus:!border-primary-500 [&>input]:text-foreground"
                  placeholder="••••••••"
                />
              </div>
              <small v-if="errors.password" class="text-red-500 mt-1 block">{{ errors.password }}</small>
            </div>
          </div>

          <Button
            type="submit"
            :loading="loading"
            class="w-full !bg-primary-600 hover:!bg-primary-700 !border-none !h-12 !text-lg !font-semibold !rounded-xl shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-0.5 text-white"
          >
            <i class="pi pi-sign-in mr-2"></i>
            {{ t('auth.login.submit') }}
          </Button>

          <!-- Divider -->
          <div class="relative py-2">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-themeborder"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-surface px-4 text-sm text-muted">ou</span>
            </div>
          </div>

          <!-- Social Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button type="button" class="flex items-center justify-center h-12 rounded-xl bg-background border border-themeborder hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-foreground font-medium">
              <i class="pi pi-google mr-2 text-red-500"></i> Google
            </button>
            <button type="button" class="flex items-center justify-center h-12 rounded-xl bg-background border border-themeborder hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-foreground font-medium">
              <i class="pi pi-linkedin mr-2 text-blue-600"></i> LinkedIn
            </button>
          </div>
        </form>

        <p class="text-center text-muted">
          {{ t('auth.login.noAccount') }}
          <RouterLink to="/register" class="text-primary-600 hover:text-primary-500 font-bold transition-colors">
            {{ t('auth.login.register') }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
