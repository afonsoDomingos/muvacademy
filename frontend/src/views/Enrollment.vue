<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useCourseStore } from '@/stores/course'
import { useEnrollmentStore } from '@/stores/enrollment'
import api from '@/services/api'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const courseStore = useCourseStore()
const enrollmentStore = useEnrollmentStore()

const loading = ref(true)
const submitting = ref(false)
const uploading = ref(false)
const course = ref(null)
const proofUrl = ref('')
const proofPublicId = ref('')
const paymentMethod = ref('transferencia')
const observations = ref('')

const paymentMethods = [
  { value: 'transferencia', label: 'Transferência Bancária' },
  { value: 'deposito', label: 'Depósito Bancário' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'emola', label: 'e-Mola' }
]

const selectedOptionIndex = computed(() => {
  const opt = route.query.option
  return opt !== undefined && opt !== null ? parseInt(opt) : -1
})

const selectedPricingOption = computed(() => {
  if (selectedOptionIndex.value >= 0 && course.value?.pricingOptions?.length > selectedOptionIndex.value) {
    return course.value.pricingOptions[selectedOptionIndex.value]
  }
  return null
})

const title = computed(() => {
  const baseTitle = course.value?.title?.[locale.value] || course.value?.title?.pt
  if (selectedPricingOption.value) {
    const optTitle = selectedPricingOption.value.title?.[locale.value] || selectedPricingOption.value.title?.pt
    return `${baseTitle} - ${optTitle}`
  }
  return baseTitle
})

const price = computed(() => {
  if (selectedPricingOption.value) {
    return locale.value === 'en' ? selectedPricingOption.value.priceUSD : selectedPricingOption.value.priceMZN
  }
  return locale.value === 'en' ? course.value?.priceUSD : course.value?.priceMZN
})

const currency = computed(() => locale.value === 'en' ? 'USD' : 'MZN')

// Automatically append option to observations when submitting
const effectiveObservations = computed(() => {
  let obs = observations.value
  if (selectedPricingOption.value) {
    const optTitle = selectedPricingOption.value.title?.[locale.value] || selectedPricingOption.value.title?.pt
    const optPrice = price.value
    const autoInfo = ` [Opção Selecionada: ${optTitle} - ${optPrice} ${currency.value}]`
    return obs ? obs + autoInfo : autoInfo
  }
  return obs
})

async function uploadProof(event) {
  const file = event.files[0]
  if (!file) return
  
  uploading.value = true
  const formData = new FormData()
  formData.append('proof', file)
  
  try {
    const response = await api.post('/upload/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    proofUrl.value = response.data.data.url
    proofPublicId.value = response.data.data.publicId
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Comprovativo enviado!', life: 3000 })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao enviar comprovativo', life: 5000 })
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  if (!proofUrl.value) {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Envie o comprovativo de pagamento', life: 3000 })
    return
  }
  
  submitting.value = true
  const result = await enrollmentStore.createEnrollment({
    courseId: route.params.courseId,
    proofUrl: proofUrl.value,
    proofPublicId: proofPublicId.value,
    paymentMethod: paymentMethod.value,
    observations: effectiveObservations.value
  })
  submitting.value = false
  
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Inscrição realizada! Aguarde aprovação.', life: 5000 })
    router.push('/dashboard')
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}

onMounted(async () => {
  loading.value = true
  const data = await courseStore.fetchCourse(route.params.courseId)
  course.value = data?.course
  loading.value = false
  
  if (!course.value) router.push('/courses')
})
</script>

<template>
  <div class="min-h-screen py-12 bg-background">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-display font-bold text-foreground mb-8">{{ t('enrollment.title') }}</h1>

      <div v-if="loading" class="card p-8 animate-pulse bg-surface border border-themeborder">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-8">
        <!-- Course Summary -->
        <div class="card p-6 bg-surface border border-themeborder">
          <h2 class="text-xl font-bold text-foreground mb-4">{{ t('enrollment.course') }}</h2>
          <div class="flex gap-4 mb-6">
            <img v-if="course.image" :src="course.image" class="w-24 h-16 object-cover rounded-lg" />
            <div>
              <h3 class="text-foreground font-medium">{{ title }}</h3>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">{{ price?.toLocaleString() }} {{ currency }}</p>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-themeborder">
            <h3 class="text-foreground font-medium mb-3">{{ t('enrollment.paymentInfo') }}</h3>
            <div v-if="course.paymentInfo" class="space-y-2 text-sm text-muted">
              <p v-if="course.paymentInfo.bankName"><strong>Banco:</strong> {{ course.paymentInfo.bankName }}</p>
              <p v-if="course.paymentInfo.accountNumber"><strong>Conta:</strong> {{ course.paymentInfo.accountNumber }}</p>
              <p v-if="course.paymentInfo.accountName"><strong>Nome:</strong> {{ course.paymentInfo.accountName }}</p>
              <p v-if="course.paymentInfo.nuit"><strong>NUIT:</strong> {{ course.paymentInfo.nuit }}</p>
              <p v-if="course.paymentInfo.mpesaNumber"><strong>M-Pesa:</strong> {{ course.paymentInfo.mpesaNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Enrollment Form -->
        <div class="card p-6 bg-surface border border-themeborder">
          <h2 class="text-xl font-bold text-foreground mb-4">{{ t('enrollment.uploadProof') }}</h2>
          
          <!-- Payment Method -->
          <div class="mb-4">
            <label class="block text-sm text-muted mb-2">Método de Pagamento</label>
            <Dropdown v-model="paymentMethod" :options="paymentMethods" optionLabel="label" optionValue="value" class="w-full" />
          </div>

          <!-- File Upload -->
          <div class="mb-4">
            <label class="block text-sm text-muted mb-2">Comprovativo</label>
            <FileUpload
              mode="basic"
              :auto="true"
              accept="image/*,application/pdf"
              :maxFileSize="10485760"
              :customUpload="true"
              @uploader="uploadProof"
              chooseLabel="Selecionar Arquivo"
              class="w-full"
              :disabled="uploading"
            />
            <div v-if="proofUrl" class="mt-2 flex items-center gap-2 text-green-500 text-sm">
              <i class="pi pi-check-circle"></i> Comprovativo enviado
            </div>
          </div>

          <!-- Observations -->
          <div class="mb-6">
            <label class="block text-sm text-muted mb-2">Observações (opcional)</label>
            <Textarea v-model="observations" rows="3" class="w-full" placeholder="Informações adicionais..." />
          </div>

          <!-- Submit -->
          <Button
            @click="handleSubmit"
            :label="t('enrollment.submit')"
            :loading="submitting"
            :disabled="!proofUrl"
            icon="pi pi-check"
            class="w-full p-button-primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>
