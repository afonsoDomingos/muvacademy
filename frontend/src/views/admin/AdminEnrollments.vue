<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEnrollmentStore } from '@/stores/enrollment'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Image from 'primevue/image'

const { t, locale } = useI18n()
const enrollmentStore = useEnrollmentStore()
const toast = useToast()
const confirm = useConfirm()

const loading = computed(() => enrollmentStore.loading)
const enrollments = computed(() => enrollmentStore.enrollments)
const statusFilter = ref('')

const showProofDialog = ref(false)
const currentProofUrl = ref('')
const showRejectDialog = ref(false)
const currentEnrollment = ref(null)
const rejectionReason = ref('')

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDENTE', label: 'Pendentes' },
  { value: 'APROVADO', label: 'Aprovados' },
  { value: 'REJEITADO', label: 'Rejeitados' }
]

async function fetchEnrollments() {
  await enrollmentStore.fetchAllEnrollments({ status: statusFilter.value || undefined })
}

function viewProof(url) {
  currentProofUrl.value = url
  showProofDialog.value = true
}

async function approveEnrollment(enrollment) {
  confirm.require({
    message: `Aprovar inscrição de ${enrollment.userId?.name} no curso ${enrollment.courseId?.title?.pt}?`,
    header: 'Confirmar Aprovação',
    icon: 'pi pi-check-circle',
    acceptClass: 'p-button-success',
    accept: async () => {
      const result = await enrollmentStore.approveEnrollment(enrollment._id)
      if (result.success) {
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Inscrição aprovada!', life: 3000 })
        fetchEnrollments()
      } else {
        toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
      }
    }
  })
}

function openRejectDialog(enrollment) {
  currentEnrollment.value = enrollment
  rejectionReason.value = ''
  showRejectDialog.value = true
}

async function confirmReject() {
  const result = await enrollmentStore.rejectEnrollment(currentEnrollment.value._id, rejectionReason.value)
  if (result.success) {
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Inscrição rejeitada', life: 3000 })
    showRejectDialog.value = false
    fetchEnrollments()
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: result.message, life: 5000 })
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'APROVADO': return 'badge-success'
    case 'PENDENTE': return 'badge-warning'
    case 'REJEITADO': return 'badge-error'
    default: return 'badge-primary'
  }
}

onMounted(fetchEnrollments)
</script>

<template>
  <div>
    <h1 class="text-3xl font-display font-bold text-white mb-8">{{ t('admin.enrollments') }}</h1>

    <!-- Filters -->
    <div class="card p-4 mb-6">
      <Dropdown v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Filtrar por status" class="w-48" @change="fetchEnrollments" />
    </div>

    <!-- Table -->
    <div class="card">
      <DataTable :value="enrollments" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column header="Aluno">
          <template #body="{ data }">
            <div>
              <p class="text-white font-medium">{{ data.userId?.name }}</p>
              <p class="text-gray-400 text-sm">{{ data.userId?.email }}</p>
            </div>
          </template>
        </Column>
        <Column header="Curso">
          <template #body="{ data }">
            <span class="text-gray-300">{{ data.courseId?.title?.[locale] || data.courseId?.title?.pt }}</span>
          </template>
        </Column>
        <Column header="Método">
          <template #body="{ data }">
            <span class="text-gray-300 capitalize">{{ data.paymentMethod }}</span>
          </template>
        </Column>
        <Column header="Data">
          <template #body="{ data }">
            <span class="text-gray-400 text-sm">{{ new Date(data.createdAt).toLocaleDateString() }}</span>
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <span :class="getStatusClass(data.status)" class="badge">{{ data.status }}</span>
          </template>
        </Column>
        <Column header="Ações" style="width: 200px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button v-if="data.proofUrl" icon="pi pi-image" class="p-button-sm p-button-text" @click="viewProof(data.proofUrl)" v-tooltip="'Ver Comprovativo'" />
              <template v-if="data.status === 'PENDENTE'">
                <Button icon="pi pi-check" class="p-button-sm p-button-success p-button-text" @click="approveEnrollment(data)" v-tooltip="'Aprovar'" />
                <Button icon="pi pi-times" class="p-button-sm p-button-danger p-button-text" @click="openRejectDialog(data)" v-tooltip="'Rejeitar'" />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Proof Dialog -->
    <Dialog v-model:visible="showProofDialog" header="Comprovativo de Pagamento" :style="{ width: '500px' }" modal>
      <div class="flex justify-center">
        <Image :src="currentProofUrl" alt="Comprovativo" width="400" preview />
      </div>
    </Dialog>

    <!-- Reject Dialog -->
    <Dialog v-model:visible="showRejectDialog" header="Rejeitar Inscrição" :style="{ width: '500px' }" modal>
      <p class="text-gray-300 mb-4">Informe o motivo da rejeição:</p>
      <Textarea v-model="rejectionReason" rows="4" class="w-full" placeholder="Motivo da rejeição..." />
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="showRejectDialog = false" />
        <Button label="Confirmar Rejeição" class="p-button-danger" @click="confirmReject" />
      </template>
    </Dialog>
  </div>
</template>
