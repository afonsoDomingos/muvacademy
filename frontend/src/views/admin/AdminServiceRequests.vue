<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import api from '@/services/api'

const requests = ref([])
const expandedRows = ref({})
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

        <DataTable v-model:expandedRows="expandedRows" :value="requests" :loading="loading" dataKey="_id" class="p-datatable-sm bg-surface-dark" paginator :rows="10">
            <template #empty>Nenhum pedido encontrado.</template>
            
            <Column expander style="width: 3rem" />
            
            <Column field="createdAt" header="Data" sortable>
                <template #body="{ data }">
                    {{ new Date(data.createdAt).toLocaleDateString() }}
                </template>
            </Column>
            
            <Column field="service" header="Serviço" sortable></Column>
            <Column field="name" header="Cliente" sortable></Column>
            <Column field="email" header="Email"></Column>
            
            <Column field="status" header="Estado">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            
            <Column header="Ações">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <button v-if="data.status === 'pendente'" @click="updateStatus(data._id, 'em_analise')" class="btn btn-secondary !py-1 !px-2 text-xs">Analisar</button>
                        <button v-if="data.status !== 'concluido'" @click="updateStatus(data._id, 'concluido')" class="btn btn-primary !py-1 !px-2 text-xs">Concluir</button>
                    </div>
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-4 bg-white/5 border border-white/10 rounded-xl m-2">
                    <h5 class="text-primary-400 font-bold tracking-widest uppercase text-xs mb-4">Detalhes do Pedido</h5>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-slate-400 text-sm mb-1"><strong>Tipo de Pedido:</strong> <span class="uppercase text-white">{{ slotProps.data.type }}</span></p>
                            <p class="text-slate-400 text-sm mb-1"><strong>Telefone:</strong> <span class="text-white">{{ slotProps.data.phone || 'Não fornecido' }}</span></p>
                            <p class="text-slate-400 text-sm mb-1"><strong>Empresa:</strong> <span class="text-white">{{ slotProps.data.company || 'Não fornecido' }}</span></p>
                        </div>
                        <div>
                            <p class="text-slate-400 text-sm font-bold mb-2">Mensagem do Cliente:</p>
                            <div class="p-4 bg-slate-900 rounded-lg border border-white/5">
                                <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{{ slotProps.data.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>
    </div>
</template>
