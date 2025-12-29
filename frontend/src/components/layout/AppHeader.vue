<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useNotificationStore } from '@/stores/notification'
import logoImg from '@/assets/logo.png'

const { t, locale } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const notificationMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
const unreadCount = computed(() => notificationStore.unreadCount)

const navLinks = computed(() => [
  { name: 'home', path: '/', label: t('nav.home') },
  { name: 'courses', path: '/courses', label: t('nav.courses') }
])

function toggleLanguage() {
  const newLocale = locale.value === 'pt' ? 'en' : 'pt'
  locale.value = newLocale
  localStorage.setItem('muv-language', newLocale)
}

function closeMenus() {
  userMenuOpen.value = false
  notificationMenuOpen.value = false
  mobileMenuOpen.value = false
}

async function logout() {
  closeMenus()
  await authStore.logout()
}

onMounted(() => {
  if (isAuthenticated.value) {
    notificationStore.fetchUnreadCount()
  }
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group" @click="closeMenus">
          <img :src="logoImg" alt="MUV Academy" class="h-10 w-auto group-hover:scale-105 transition-transform" />
          <span class="text-xl font-display font-bold gradient-text hidden sm:block">MUV Academy</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="text-gray-300 hover:text-white transition-colors relative py-2"
            :class="{ 'text-white': route.name === link.name }"
          >
            {{ link.label }}
            <span
              v-if="route.name === link.name"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            ></span>
          </RouterLink>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center gap-4">
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            :title="locale === 'pt' ? 'Switch to English' : 'Mudar para Português'"
          >
            <span class="text-sm font-medium">{{ locale.toUpperCase() }}</span>
          </button>

          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <i :class="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg"></i>
          </button>

          <!-- Authenticated User -->
          <template v-if="isAuthenticated">
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="notificationMenuOpen = !notificationMenuOpen"
                class="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative"
              >
                <i class="pi pi-bell text-lg"></i>
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ user?.name?.charAt(0).toUpperCase() }}</span>
                </div>
                <i class="pi pi-chevron-down text-gray-400 text-sm hidden sm:block"></i>
              </button>

              <!-- Dropdown -->
              <transition name="fade">
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-56 rounded-xl bg-surface-dark border border-white/10 shadow-xl py-2"
                >
                  <div class="px-4 py-2 border-b border-white/10">
                    <p class="text-white font-medium truncate">{{ user?.name }}</p>
                    <p class="text-gray-400 text-sm truncate">{{ user?.email }}</p>
                  </div>
                  <RouterLink
                    to="/dashboard"
                    class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                    @click="closeMenus"
                  >
                    <i class="pi pi-th-large"></i>
                    {{ t('nav.dashboard') }}
                  </RouterLink>
                  <RouterLink
                    to="/profile"
                    class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                    @click="closeMenus"
                  >
                    <i class="pi pi-user"></i>
                    {{ t('nav.profile') }}
                  </RouterLink>
                  <RouterLink
                    v-if="isAdmin"
                    to="/admin"
                    class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5"
                    @click="closeMenus"
                  >
                    <i class="pi pi-cog"></i>
                    {{ t('nav.admin') }}
                  </RouterLink>
                  <div class="border-t border-white/10 mt-2 pt-2">
                    <button
                      @click="logout"
                      class="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 w-full"
                    >
                      <i class="pi pi-sign-out"></i>
                      {{ t('nav.logout') }}
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink to="/login" class="hidden sm:block text-gray-300 hover:text-white transition-colors">
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink to="/register" class="btn btn-primary !py-2 !px-4 text-sm">
              {{ t('nav.register') }}
            </RouterLink>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-400 hover:text-white"
          >
            <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="md:hidden bg-surface-dark border-t border-white/10">
        <nav class="px-4 py-4 space-y-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            @click="closeMenus"
          >
            {{ link.label }}
          </RouterLink>
          <template v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              @click="closeMenus"
            >
              {{ t('nav.login') }}
            </RouterLink>
          </template>
        </nav>
      </div>
    </transition>
  </header>

  <!-- Spacer for fixed header -->
  <div class="h-16"></div>
</template>
