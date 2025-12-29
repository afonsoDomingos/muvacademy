<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

const isSuperAdmin = computed(() => authStore.isSuperAdmin)

const menuItems = computed(() => {
  const items = [
    { path: '/admin', name: 'admin-dashboard', icon: 'pi pi-home', label: t('admin.dashboard') },
    { path: '/admin/courses', name: 'admin-courses', icon: 'pi pi-book', label: t('admin.courses') },
    { path: '/admin/enrollments', name: 'admin-enrollments', icon: 'pi pi-users', label: t('admin.enrollments') }
  ]
  if (isSuperAdmin.value) {
    items.push({ path: '/admin/users', name: 'admin-users', icon: 'pi pi-user-edit', label: t('admin.users') })
  }
  return items
})

function isActive(item) {
  if (item.name === 'admin-dashboard') return route.name === 'admin-dashboard'
  return route.path.startsWith(item.path)
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-surface-dark border-r border-white/10 fixed h-full">
      <div class="p-6">
        <RouterLink to="/admin" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <i class="pi pi-cog text-white"></i>
          </div>
          <span class="text-xl font-bold gradient-text">Admin</span>
        </RouterLink>
      </div>

      <nav class="px-4 space-y-1">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          :class="isActive(item) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="absolute bottom-6 left-4 right-4">
        <RouterLink to="/" class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
          <i class="pi pi-arrow-left"></i>
          Voltar ao Site
        </RouterLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8">
      <RouterView />
    </main>
  </div>
</template>
