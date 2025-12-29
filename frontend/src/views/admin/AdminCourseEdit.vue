<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCourseStore } from '@/stores/course'
import { useToast } from 'primevue/usetoast'
import api from '@/services/api'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const toast = useToast()

const isEdit = route.params.id !== undefined
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)

const form = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' },
  shortDescription: { pt: '', en: '' },
  priceMZN: 0,
  priceUSD: 0,
  categories: [],
  level: 'todos',
  image: ''
})

const levels = [
  { value: 'todos', label: 'Todos os Níveis' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' }
]

const categories = ref([])

async function uploadImage(event) {
  const file = event.files[0]
  if (!file) return
  
  uploading.value = true
  const formData = new FormData()
  formData.append('image', file)
  
  try {
    const response = await api.post('/upload/course-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.image = response.data.data.url
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Imagem enviada!', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao enviar imagem', life: 5000 })
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  saving.value = true
  
  let result
  if (isEdit) {
    result = await courseStore.updateCourse(route.params.id, form.value)
  } else {
    result = await courseStore.createCourse(form.value)
  }
  
  saving.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: isEdit ? 'Curso atualizado!' : 'Curso criado!', life: 3000 })
    router.push('/admin/courses')
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}

onMounted(async () => {
  loading.value = true
  
  const cats = await courseStore.fetchCategories()
  categories.value = cats.map(c => ({ value: c.id, label: c.name.pt }))
  
  if (isEdit) {
    const data = await courseStore.fetchCourse(route.params.id)
    if (data?.course) {
      form.value = {
        title: data.course.title || { pt: '', en: '' },
        description: data.course.description || { pt: '', en: '' },
        shortDescription: data.course.shortDescription || { pt: '', en: '' },
        priceMZN: data.course.priceMZN || 0,
        priceUSD: data.course.priceUSD || 0,
        categories: data.course.categories || [],
        level: data.course.level || 'todos',
        image: data.course.image || ''
      }
    }
  }
  
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-display font-bold text-white mb-8">
      {{ isEdit ? t('admin.editCourse') : t('admin.addCourse') }}
    </h1>

    <div v-if="loading" class="card p-8">
      <div class="animate-pulse space-y-4">
        <div class="h-6 bg-white/10 rounded w-1/3"></div>
        <div class="h-10 bg-white/10 rounded"></div>
        <div class="h-6 bg-white/10 rounded w-1/3"></div>
        <div class="h-32 bg-white/10 rounded"></div>
      </div>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Informações Básicas</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-300 mb-2">Título (Português)</label>
              <InputText v-model="form.title.pt" class="w-full" required />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Título (Inglês)</label>
              <InputText v-model="form.title.en" class="w-full" required />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Descrição Curta (PT)</label>
              <Textarea v-model="form.shortDescription.pt" rows="2" class="w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Descrição Curta (EN)</label>
              <Textarea v-model="form.shortDescription.en" rows="2" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Pricing & Categories -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Preço e Categorias</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-300 mb-2">Preço (MZN)</label>
                <InputNumber v-model="form.priceMZN" mode="currency" currency="MZN" locale="pt-MZ" class="w-full" />
              </div>
              <div>
                <label class="block text-sm text-gray-300 mb-2">Preço (USD)</label>
                <InputNumber v-model="form.priceUSD" mode="currency" currency="USD" locale="en-US" class="w-full" />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Categorias</label>
              <MultiSelect v-model="form.categories" :options="categories" optionLabel="label" optionValue="value" class="w-full" placeholder="Selecione" />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Nível</label>
              <Dropdown v-model="form.level" :options="levels" optionLabel="label" optionValue="value" class="w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-2">Imagem do Curso</label>
              <FileUpload mode="basic" :auto="true" accept="image/*" :maxFileSize="5242880" :customUpload="true" @uploader="uploadImage" chooseLabel="Selecionar" :disabled="uploading" />
              <img v-if="form.image" :src="form.image" class="mt-2 w-32 h-20 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <!-- Full Description -->
      <div class="card p-6">
        <h2 class="text-xl font-bold text-white mb-4">Descrição Completa</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-300 mb-2">Português</label>
            <Textarea v-model="form.description.pt" rows="6" class="w-full" />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-2">Inglês</label>
            <Textarea v-model="form.description.en" rows="6" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <Button type="submit" :label="isEdit ? 'Salvar Alterações' : 'Criar Curso'" :loading="saving" icon="pi pi-check" class="p-button-primary" />
        <Button type="button" label="Cancelar" class="p-button-secondary" @click="router.push('/admin/courses')" />
      </div>
    </form>
  </div>
</template>
