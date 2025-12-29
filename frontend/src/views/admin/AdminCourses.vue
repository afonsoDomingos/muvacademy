<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

const { t, locale } = useI18n()
const courseStore = useCourseStore()
const toast = useToast()

const search = ref('')
const loading = computed(() => courseStore.loading)
const courses = computed(() => courseStore.courses)

async function fetchCourses() {
  await courseStore.fetchCourses({ published: 'all', search: search.value || undefined })
}

async function togglePublish(course) {
  const result = await courseStore.togglePublish(course._id)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: result.course.published ? 'Curso publicado!' : 'Curso despublicado!', life: 3000 })
    fetchCourses()
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}

onMounted(fetchCourses)
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-display font-bold text-white">{{ t('admin.courses') }}</h1>
      <RouterLink to="/admin/courses/new" class="btn btn-primary">
        <i class="pi pi-plus"></i>{{ t('admin.addCourse') }}
      </RouterLink>
    </div>

    <!-- Search -->
    <div class="card p-4 mb-6">
      <span class="p-input-icon-left w-full md:w-80">
        <i class="pi pi-search" />
        <InputText v-model="search" placeholder="Buscar cursos..." class="w-full" @keyup.enter="fetchCourses" />
      </span>
    </div>

    <!-- Table -->
    <div class="card">
      <DataTable :value="courses" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="image" header="" style="width: 80px">
          <template #body="{ data }">
            <img v-if="data.image" :src="data.image" class="w-16 h-10 object-cover rounded-lg" />
            <div v-else class="w-16 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg"></div>
          </template>
        </Column>
        <Column header="Título">
          <template #body="{ data }">
            <span class="text-white font-medium">{{ data.title?.[locale] || data.title?.pt }}</span>
          </template>
        </Column>
        <Column header="Preço">
          <template #body="{ data }">
            <span class="text-gray-300">{{ data.priceMZN?.toLocaleString() }} MZN</span>
          </template>
        </Column>
        <Column header="Inscritos">
          <template #body="{ data }">
            <span class="text-gray-300">{{ data.enrollmentCount || 0 }}</span>
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <span :class="data.published ? 'badge-success' : 'badge-warning'" class="badge">
              {{ data.published ? 'Publicado' : 'Rascunho' }}
            </span>
          </template>
        </Column>
        <Column header="Ações" style="width: 150px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <RouterLink :to="`/admin/courses/${data._id}/edit`">
                <Button icon="pi pi-pencil" class="p-button-sm p-button-text" v-tooltip="'Editar'" />
              </RouterLink>
              <Button
                :icon="data.published ? 'pi pi-eye-slash' : 'pi pi-eye'"
                class="p-button-sm p-button-text"
                @click="togglePublish(data)"
                v-tooltip="data.published ? 'Despublicar' : 'Publicar'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
