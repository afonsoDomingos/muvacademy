<script setup>
import { ref, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

const contentStore = useContentStore()
const toast = useToast()
const confirm = useConfirm()

const banners = ref([])
const services = ref([])
const loading = ref(false)

const showBannerDialog = ref(false)
const showServiceDialog = ref(false)
const editingItem = ref(null)

const bannerForm = ref({
  title: { pt: '', en: '' },
  subtitle: { pt: '', en: '' },
  ctaText: { pt: '', en: '' },
  ctaLink: '',
  image: '',
  type: 'home'
})

const serviceForm = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' },
  icon: 'pi pi-briefcase',
  category: 'consultoria'
})

async function loadData() {
  loading.value = true
  banners.value = await contentStore.fetchHomeBanners()
  services.value = await contentStore.fetchServices()
  loading.value = false
}

function openNewBanner() {
  editingItem.value = null
  bannerForm.value = {
    title: { pt: '', en: '' },
    subtitle: { pt: '', en: '' },
    ctaText: { pt: 'Ver Cursos', en: 'See Courses' },
    ctaLink: '/courses',
    image: '',
    type: 'home'
  }
  showBannerDialog.value = true
}

function openNewService() {
  editingItem.value = null
  serviceForm.value = {
    title: { pt: '', en: '' },
    description: { pt: '', en: '' },
    icon: 'pi pi-briefcase',
    category: 'consultoria'
  }
  showServiceDialog.value = true
}

async function saveBanner() {
  try {
    if (editingItem.value) {
      await contentStore.updateBanner(editingItem.value._id, bannerForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Banner atualizado', life: 3000 })
    } else {
      await contentStore.createBanner(bannerForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Banner criado', life: 3000 })
    }
    showBannerDialog.value = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao guardar banner', life: 3000 })
  }
}

async function saveService() {
  try {
    if (editingItem.value) {
      await contentStore.updateService(editingItem.value._id, serviceForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço atualizado', life: 3000 })
    } else {
      await contentStore.createService(serviceForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço criado', life: 3000 })
    }
    showServiceDialog.value = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao guardar serviço', life: 3000 })
  }
}

function editBanner(banner) {
  editingItem.value = banner
  bannerForm.value = { ...banner }
  showBannerDialog.value = true
}

function editService(service) {
  editingItem.value = service
  serviceForm.value = { ...service }
  showServiceDialog.value = true
}

function confirmDeleteBanner(banner) {
  confirm.require({
    message: 'Tem a certeza que deseja eliminar este banner?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await contentStore.deleteBanner(banner._id)
      loadData()
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Banner removido', life: 3000 })
    }
  })
}

function confirmDeleteService(service) {
  confirm.require({
    message: 'Tem a certeza que deseja eliminar este serviço?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await contentStore.deleteService(service._id)
      loadData()
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Serviço removido', life: 3000 })
    }
  })
}

onMounted(loadData)
</script>

<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2">Gestão de Conteúdo</h1>
        <p class="text-slate-400">Gira os banners do carrossel e as áreas de serviço da MUV.</p>
      </div>
    </div>

    <!-- Banners Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="pi pi-images text-primary-400"></i>
          Banners do Carrossel
        </h2>
        <button @click="openNewBanner" class="btn btn-primary !py-2 !px-4 text-sm">
          <i class="pi pi-plus"></i> Novo Banner
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="banner in banners" :key="banner._id" class="glass-card overflow-hidden group">
          <div class="h-32 relative">
            <img :src="banner.image" class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div class="absolute bottom-2 left-4">
              <span class="text-xs font-bold uppercase tracking-widest text-primary-400">{{ banner.type }}</span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-white font-bold mb-2 truncate">{{ banner.title.pt }}</h3>
            <p class="text-slate-400 text-sm mb-6 line-clamp-2">{{ banner.subtitle.pt }}</p>
            <div class="flex gap-2">
              <button @click="editBanner(banner)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
              <button @click="confirmDeleteBanner(banner)" class="btn bg-red-500/10 text-red-500 border border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="pi pi-briefcase text-accent-400"></i>
          Áreas de Serviço
        </h2>
        <button @click="openNewService" class="btn btn-accent !py-2 !px-4 text-sm">
          <i class="pi pi-plus"></i> Novo Serviço
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service._id" class="glass-card p-6">
          <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
            <i :class="service.icon" class="text-2xl text-accent-400"></i>
          </div>
          <h3 class="text-white font-bold mb-2">{{ service.title.pt }}</h3>
          <p class="text-slate-400 text-sm mb-6 line-clamp-2">{{ service.description.pt }}</p>
          <div class="flex gap-2">
            <button @click="editService(service)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
            <button @click="confirmDeleteService(service)" class="btn bg-red-500/10 text-red-500 border border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner Dialog -->
    <Dialog v-model:visible="showBannerDialog" :header="editingItem ? 'Editar Banner' : 'Novo Banner'" modal class="p-fluid w-full max-w-2xl bg-surface-dark text-white">
      <div class="grid gap-6 py-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (PT)</label>
            <InputText v-model="bannerForm.title.pt" class="input" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (EN)</label>
            <InputText v-model="bannerForm.title.en" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="block text-sm font-bold mb-2">Subtítulo (PT)</label>
          <Textarea v-model="bannerForm.subtitle.pt" rows="2" class="input w-full" />
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">URL da Imagem</label>
            <InputText v-model="bannerForm.image" class="input" placeholder="/images/hero-premium.png" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Link do CTA</label>
            <InputText v-model="bannerForm.ctaLink" class="input" />
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showBannerDialog = false" class="btn btn-secondary !py-2 !px-4">Cancelar</button>
        <button @click="saveBanner" class="btn btn-primary !py-2 !px-4">Guardar</button>
      </template>
    </Dialog>

    <!-- Service Dialog -->
    <Dialog v-model:visible="showServiceDialog" :header="editingItem ? 'Editar Serviço' : 'Novo Serviço'" modal class="p-fluid w-full max-w-xl bg-surface-dark text-white">
      <div class="grid gap-6 py-4">
        <div class="field">
          <label class="block text-sm font-bold mb-2">Título (PT)</label>
          <InputText v-model="serviceForm.title.pt" class="input" />
        </div>
        <div class="field">
          <label class="block text-sm font-bold mb-2">Descrição (PT)</label>
          <Textarea v-model="serviceForm.description.pt" rows="3" class="input w-full" />
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Ícone (PrimeIcons)</label>
            <InputText v-model="serviceForm.icon" class="input" placeholder="pi pi-briefcase" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Categoria</label>
            <Dropdown v-model="serviceForm.category" :options="['consultoria', 'energia', 'engenharia', 'tecnologia']" class="input" />
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showServiceDialog = false" class="btn btn-secondary !py-2 !px-4">Cancelar</button>
        <button @click="saveService" class="btn btn-accent !py-2 !px-4">Guardar</button>
      </template>
    </Dialog>
  </div>
</template>
