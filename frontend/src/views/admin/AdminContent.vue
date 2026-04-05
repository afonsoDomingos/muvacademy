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
const workshops = ref([])
const loading = ref(false)

const showBannerDialog = ref(false)
const showServiceDialog = ref(false)
const showWorkshopDialog = ref(false)
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
  category: 'consultoria',
  slug: ''
})

const workshopForm = ref({
  title: { pt: '', en: '' },
  description: { pt: '', en: '' },
  date: '',
  location: { pt: '', en: '' },
  image: '',
  link: '',
  isActive: true
})

import api from '@/services/api'

async function loadData() {
  loading.value = true
  banners.value = await contentStore.fetchHomeBanners()
  services.value = await contentStore.fetchServices()
  try {
     const res = await api.get('/workshops')
     workshops.value = res.data.data.workshops
  } catch (e) {
     console.error('Error loading workshops:', e)
  }
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
    category: 'consultoria',
    slug: ''
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

function openNewWorkshop() {
  editingItem.value = null
  workshopForm.value = {
    title: { pt: '', en: '' },
    description: { pt: '', en: '' },
    date: '',
    location: { pt: 'Online / Zoom', en: 'Online / Zoom' },
    image: '/images/courses/ai-business.jpg',
    link: '',
    isActive: true
  }
  showWorkshopDialog.value = true
}

async function saveWorkshop() {
  try {
    if (editingItem.value) {
      await api.put(`/workshops/${editingItem.value._id}`, workshopForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Workshop atualizado', life: 3000 })
    } else {
      await api.post('/workshops', workshopForm.value)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Workshop criado', life: 3000 })
    }
    showWorkshopDialog.value = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao guardar workshop', life: 3000 })
  }
}

function editWorkshop(workshop) {
  editingItem.value = workshop
  workshopForm.value = { ...workshop }
  showWorkshopDialog.value = true
}

function confirmDeleteWorkshop(workshop) {
  confirm.require({
    message: 'Tem a certeza que deseja eliminar este workshop?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await api.delete(`/workshops/${workshop._id}`)
      loadData()
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Workshop removido', life: 3000 })
    }
  })
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

const uploading = ref(false)

async function handleFileUpload(event, type) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)
  
  uploading.value = true
  try {
    const endpoint = type === 'banner' ? '/upload/banner' : '/upload/workshop'
    const res = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (type === 'banner') {
      bannerForm.value.image = res.data.data.url
    } else {
      workshopForm.value.image = res.data.data.url
    }
    toast.add({ severity: 'info', summary: 'Upload concluído', detail: 'Imagem carregada com sucesso', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro de Upload', detail: 'Falha ao carregar imagem', life: 3000 })
  } finally {
    uploading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="p-4 sm:p-8 max-w-7xl mx-auto pb-20">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2">Gestão de Conteúdo</h1>
        <p class="text-slate-400">Gira os banners, workshops e serviços da MUV.</p>
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

    <!-- Workshops Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i class="pi pi-calendar text-primary-400"></i>
          Workshops Semanais
        </h2>
        <button @click="openNewWorkshop" class="btn btn-primary !py-2 !px-4 text-sm">
          <i class="pi pi-plus"></i> Novo Workshop
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="workshop in workshops" :key="workshop._id" class="glass-card overflow-hidden group">
          <div class="h-32 relative">
            <img :src="workshop.image" class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div class="absolute bottom-2 left-4">
              <span class="text-[10px] font-bold uppercase tracking-widest text-primary-400">{{ new Date(workshop.date).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-white font-bold mb-2 truncate">{{ workshop.title.pt }}</h3>
            <p class="text-slate-400 text-sm mb-6 line-clamp-2">{{ workshop.description.pt }}</p>
            <div class="flex gap-2">
              <button @click="editWorkshop(workshop)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
              <button @click="confirmDeleteWorkshop(workshop)" class="btn bg-red-500/10 text-red-500 border border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
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
            <label class="block text-sm font-bold mb-2">Imagem do Banner</label>
            <div class="flex gap-2">
               <InputText v-model="bannerForm.image" class="input flex-1" placeholder="/images/hero-premium.png" disabled />
               <label class="btn btn-secondary !py-2 !px-4 cursor-pointer flex items-center gap-2">
                  <i v-if="uploading" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-upload"></i>
                  <span>Alterar</span>
                  <input type="file" @change="handleFileUpload($event, 'banner')" class="hidden" accept="image/*" />
               </label>
            </div>
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
    <Dialog v-model:visible="showServiceDialog" :header="editingItem ? 'Editar Serviço' : 'Novo Serviço'" modal class="p-fluid w-full max-w-2xl bg-surface-dark text-white">
      <div class="grid gap-6 py-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (PT)</label>
            <InputText v-model="serviceForm.title.pt" class="input" @input="!editingItem && (serviceForm.slug = serviceForm.title.pt.toLowerCase().replace(/ /g, '-'))" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (EN)</label>
            <InputText v-model="serviceForm.title.en" class="input" />
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Descrição (PT)</label>
            <Textarea v-model="serviceForm.description.pt" rows="3" class="input w-full" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Descrição (EN)</label>
            <Textarea v-model="serviceForm.description.en" rows="3" class="input w-full" />
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Slug Único</label>
            <InputText v-model="serviceForm.slug" class="input" placeholder="ex: consultoria-solar" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Ícone (PrimeIcons)</label>
            <InputText v-model="serviceForm.icon" class="input" placeholder="pi pi-briefcase" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Categoria</label>
            <Dropdown v-model="serviceForm.category" :options="['consultoria', 'energia', 'engenharia', 'tecnologia', 'outros']" class="input" />
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showServiceDialog = false" class="btn btn-secondary !py-2 !px-4">Cancelar</button>
        <button @click="saveService" class="btn btn-accent !py-2 !px-4">Guardar</button>
      </template>
    </Dialog>
    <!-- Workshop Dialog -->
    <Dialog v-model:visible="showWorkshopDialog" :header="editingItem ? 'Editar Workshop' : 'Novo Workshop'" modal class="p-fluid w-full max-w-2xl bg-surface-dark text-white">
      <div class="grid gap-6 py-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (PT)</label>
            <InputText v-model="workshopForm.title.pt" class="input" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título (EN)</label>
            <InputText v-model="workshopForm.title.en" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="block text-sm font-bold mb-2">Descrição (PT)</label>
          <Textarea v-model="workshopForm.description.pt" rows="3" class="input w-full" />
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Data do Evento</label>
            <InputText v-model="workshopForm.date" type="datetime-local" class="input" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Localização (PT)</label>
            <InputText v-model="workshopForm.location.pt" class="input" />
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Imagem do Workshop</label>
            <div class="flex gap-2">
               <InputText v-model="workshopForm.image" class="input flex-1" placeholder="Selecione imagem..." disabled />
               <label class="btn btn-secondary !py-2 !px-4 cursor-pointer flex items-center gap-2">
                  <i v-if="uploading" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-upload"></i>
                  <span>Alterar</span>
                  <input type="file" @change="handleFileUpload($event, 'workshop')" class="hidden" accept="image/*" />
               </label>
            </div>
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Link de Inscrição</label>
            <InputText v-model="workshopForm.link" class="input" />
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showWorkshopDialog = false" class="btn btn-secondary !py-2 !px-4">Cancelar</button>
        <button @click="saveWorkshop" class="btn btn-primary !py-2 !px-4">Guardar</button>
      </template>
    </Dialog>
  </div>
</template>
