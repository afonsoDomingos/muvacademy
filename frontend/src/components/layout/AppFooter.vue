<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

const quickLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/courses', label: 'nav.courses' }
]

const socialLinks = [
  { icon: 'pi pi-facebook', url: '#', label: 'Facebook' },
  { icon: 'pi pi-instagram', url: '#', label: 'Instagram' },
  { icon: 'pi pi-linkedin', url: '#', label: 'LinkedIn' },
  { icon: 'pi pi-youtube', url: '#', label: 'YouTube' }
]
</script>

<template>
  <footer class="bg-surface-dark border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span class="text-white font-bold text-lg">M</span>
            </div>
            <span class="text-xl font-display font-bold gradient-text">MUV Academy</span>
          </div>
          <p class="text-gray-400 max-w-md leading-relaxed">
            {{ t('footer.aboutText') }}
          </p>
          
          <!-- Social Links -->
          <div class="flex gap-3 mt-6">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              :aria-label="social.label"
              class="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all"
            >
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ t('footer.quickLinks') }}</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink :to="link.path" class="text-gray-400 hover:text-white transition-colors">
                {{ t(link.label) }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/login" class="text-gray-400 hover:text-white transition-colors">
                {{ t('nav.login') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/register" class="text-gray-400 hover:text-white transition-colors">
                {{ t('nav.register') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ t('footer.contact') }}</h4>
          <ul class="space-y-3 text-gray-400">
            <li class="flex items-center gap-2">
              <i class="pi pi-map-marker text-primary-500"></i>
              Maputo, Moçambique
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-envelope text-primary-500"></i>
              info@muvacademy.co.mz
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-phone text-primary-500"></i>
              +258 84 123 4567
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-sm">
          © {{ currentYear }} MUV Educação e Engenharia. {{ t('footer.rights') }}.
        </p>
        <div class="flex gap-6 text-sm text-gray-500">
          <a href="#" class="hover:text-white transition-colors">{{ t('footer.terms') }}</a>
          <a href="#" class="hover:text-white transition-colors">{{ t('footer.privacy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
