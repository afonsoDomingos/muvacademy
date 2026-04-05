<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import api from '@/services/api'

const requests = ref([])
const loading = ref(false)
const toast = useToast()

const loadRequests = async () => {
    try {
        loading.value = true
        const response = await api.get('/service-requests')
        requests.value = response.data.data.requests
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pedidos' })
    } finally {
        loading.value = false
    }
}

const updateStatus = async (id, status) => {
    try {
        await api.put(`/service-requests/${id}`, { status })
        toast.add({ severity: 'success', summary: 'Atualizado', detail: `Pedido ${status}` })
        loadRequests()
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar estado' })
    }
}

const getStatusSeverity = (status) => {
    switch (status) {
        case 'pendente': return 'warning';
        case 'em_analise': return 'info';
        case 'concluido': return 'success';
        case 'cancelado': return 'danger';
    }
}

onMounted(loadRequests)
</script>

<template>
    <div class="card p-8">
        <h1 class="text-3xl font-display font-bold text-white mb-8">Pedidos de Serviço / Orçamentos</h1>

        <DataTable :value="requests" :loading="loading" class="p-datatable-sm bg-surface-dark" paginator :rows="10">
            <template #empty>Nenhum pedido encontrado.</template>
            
            <Column field="createdAt" header="Data" sortable>
                <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleDateString() }}
                </template>
            </Column>
            
            <Column field="service" header="Serviço" sortable></Column>
            <Column field="name" header="Cliente" sortable></Column>
            <Column field="email" header="Email"></Column>
            <Column field="type" header="Tipo">
                <template #body="{ data }">
                    <span class="uppercase text-xs font-bold">{{ data.type }}</span>
                </template>
            </Column>
            
            <Column field="status" header="Estado">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            
            <Column header="Ações">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <button v-if="data.status === 'pendente'" @click="updateStatus(data._id, 'em_analise')" class="p-button-text p-1 text-xs">Analisar</button>
                        <button v-if="data.status !== 'concluido'" @click="updateStatus(data._id, 'concluido')" class="p-button-text p-1 text-xs text-green-400">Concluir</button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
