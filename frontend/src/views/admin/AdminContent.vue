<script setup>
import { ref, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const contentStore = useContentStore()
const toast = useToast()
const confirm = useConfirm()

const banners = ref([])
const services = ref([])
const workshops = ref([])
const projects = ref([])
const loading = ref(false)

const showBannerDialog = ref(false)
const showServiceDialog = ref(false)
const showWorkshopDialog = ref(false)
const showProjectDialog = ref(false)
const editingItem = ref(null)

const topAnnouncement = ref({
    active: false,
    messages: [ { text: '', link: '' } ]
})

const aboutUsSetting = ref({
   title: 'MUV Educação e Engenharia',
   description: 'A MUV é uma empresa moçambicana especializada em Educação...',
   image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
   mission: 'Contribuir...',
   vision: 'Ser reconhecida...',
   values: 'Excelência Educacional, Inovação, Colaboração, Integridade, Sustentabilidade'
})

const partnersSetting = ref([])

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

const projectForm = ref({
  title: '',
  category: 'web',
  description: '',
  image: '',
  tags: '',
  link: '#',
  order: 0
})

import api from '@/services/api'

async function loadData() {
  loading.value = true
  banners.value = await contentStore.fetchHomeBanners()
  services.value = await contentStore.fetchServices()
  projects.value = await contentStore.fetchProjects()
   try {
     const [wsRes, setRes, aboutRes, partnersRes] = await Promise.all([
        api.get('/workshops'),
        api.get('/content/settings/top_announcement'),
        api.get('/content/settings/about_us').catch(() => ({ data: { data: { setting: null } } })),
        api.get('/content/settings/partners').catch(() => ({ data: { data: { setting: null } } }))
     ])
     workshops.value = wsRes.data.data.workshops
     if (setRes.data.data.setting) {
         const savedSetting = setRes.data.data.setting
         if (savedSetting.messages && savedSetting.messages.length > 0) {
             topAnnouncement.value = savedSetting
         } else {
             topAnnouncement.value = {
                 active: savedSetting.active,
                 messages: [{ text: savedSetting.text || '', link: savedSetting.link || '' }]
             }
         }
     }
     
     if (aboutRes.data.data.setting) {
         const s = aboutRes.data.data.setting
         aboutUsSetting.value = {
             title: s.title || '',
             description: s.description || '',
             image: s.image || '',
             mission: s.mission || '',
             vision: s.vision || '',
             values: Array.isArray(s.values) ? s.values.join(', ') : (s.values || '')
         }
     }

     if (partnersRes.data.data.setting && partnersRes.data.data.setting.value) {
         partnersSetting.value = partnersRes.data.data.setting.value;
     } else {
         partnersSetting.value = [];
     }
  } catch (e) {
     console.error('Error loading extra data:', e)
  }
  loading.value = false
}

async function saveAnnouncement() {
  try {
      await api.put('/content/settings/top_announcement', { value: topAnnouncement.value })
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Barra de Novidade atualizada', life: 3000 })
  } catch (err) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao guardar novidade', life: 3000 })
  }
}

async function saveAboutUs() {
  try {
      const payload = { 
         ...aboutUsSetting.value, 
         values: aboutUsSetting.value.values.split(',').map(v => v.trim()).filter(v => v) 
      };
      await api.put('/content/settings/about_us', { value: payload })
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Identidade atualizada', life: 3000 })
  } catch (err) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao guardar identidade', life: 3000 })
  }
}

async function savePartners() {
  try {
      await api.put('/content/settings/partners', { value: partnersSetting.value })
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parceiros atualizados', life: 3000 })
  } catch (err) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao guardar parceiros', life: 3000 })
  }
}

function addPartner() {
    partnersSetting.value.push({ name: '', image: '' })
}

function removePartner(idx) {
    partnersSetting.value.splice(idx, 1)
}

function addAnnouncementMessage() {
    topAnnouncement.value.messages.push({ text: '', link: '' })
}

function removeAnnouncementMessage(idx) {
    if (topAnnouncement.value.messages.length > 1) {
        topAnnouncement.value.messages.splice(idx, 1)
    }
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

function openNewProject() {
  editingItem.value = null
  projectForm.value = {
    title: '',
    category: 'web',
    description: '',
    image: '',
    tags: '',
    link: '#',
    order: 0
  }
  showProjectDialog.value = true
}

async function saveProject() {
  try {
    const payload = {
      ...projectForm.value,
      tags: typeof projectForm.value.tags === 'string' 
        ? projectForm.value.tags.split(',').map(t => t.trim()).filter(t => t)
        : projectForm.value.tags
    }
    
    if (editingItem.value) {
      await contentStore.updateProject(editingItem.value._id, payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Projeto atualizado', life: 3000 })
    } else {
      await contentStore.createProject(payload)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Projeto criado', life: 3000 })
    }
    showProjectDialog.value = false
    loadData()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao guardar projeto', life: 3000 })
  }
}

function editProject(project) {
  editingItem.value = project
  projectForm.value = { 
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
  }
  showProjectDialog.value = true
}

function confirmDeleteProject(project) {
  confirm.require({
    message: 'Tem a certeza que deseja eliminar este projeto do portfólio?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await contentStore.deleteProject(project._id)
      loadData()
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Projeto removido', life: 3000 })
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
    const endpoint = (type === 'workshop') ? '/upload/workshop' : '/upload/banner'
    const res = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (type === 'banner') {
      bannerForm.value.image = res.data.data.url
    } else if (type === 'about') {
      aboutUsSetting.value.image = res.data.data.url
    } else if (type === 'project') {
      projectForm.value.image = res.data.data.url
    } else if (type.startsWith('partner-')) {
      const idx = parseInt(type.split('-')[1])
      partnersSetting.value[idx].image = res.data.data.url
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
        <h1 class="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">Gestão de Conteúdo</h1>
        <p class="text-slate-600 dark:text-slate-400">Gira os banners, workshops, serviços da MUV e configurações globais.</p>
      </div>
    </div>

    <!-- Top Announcement Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-megaphone text-accent-500 dark:text-accent-400"></i>
          Barra de Novidade (Topo)
        </h2>
        <button @click="saveAnnouncement" class="btn btn-accent !py-2 !px-6 text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <i class="pi pi-save"></i> Guardar Divulgação
        </button>
      </div>
      <div class="glass-card p-6 border-l-4 border-accent-500">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-white/5">
              <label class="flex items-center gap-3 cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <div class="relative">
                      <input type="checkbox" v-model="topAnnouncement.active" class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                  </div>
                  <span class="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{{ topAnnouncement.active ? 'Ativado (Online)' : 'Desativado (Oculto)' }}</span>
              </label>
              <button @click="addAnnouncementMessage" class="btn btn-secondary !p-2 text-xs">
                  <i class="pi pi-plus"></i> Adicionar Registo
              </button>
          </div>

          <div class="space-y-4">
              <div v-for="(msg, index) in topAnnouncement.messages" :key="index" class="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                  <div class="flex-1 w-full">
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Mensagem a Apresentar {{ index + 1 }}</label>
                      <InputText v-model="msg.text" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" placeholder="Ex: 🔥 Promoção Especial de Verão!" />
                  </div>
                  <div class="flex-1 w-full relative">
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Link do Botão (Opcional)</label>
                      <div class="flex gap-2">
                        <InputText v-model="msg.link" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white flex-1" placeholder="Ex: /courses ou https://link.com" />
                        <button v-if="topAnnouncement.messages.length > 1" @click="removeAnnouncementMessage(index)" class="btn bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-500 hover:text-white !p-2 w-10 flex items-center justify-center transition-all" title="Remover registo">
                            <i class="pi pi-trash"></i>
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>

    <!-- Nossa Identidade Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-id-card text-primary-500 dark:text-primary-400"></i>
          A Nossa Identidade
        </h2>
        <button @click="saveAboutUs" class="btn btn-primary !py-2 !px-6 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <i class="pi pi-save"></i> Guardar Alterações
        </button>
      </div>
      <div class="glass-card p-6 border-l-4 border-primary-500">
          <div class="grid sm:grid-cols-2 gap-6 mb-4">
              <div class="field">
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Título Principal</label>
                  <InputText v-model="aboutUsSetting.title" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" placeholder="MUV Educação e Engenharia" />
              </div>
              <div class="field">
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Imagem Representativa</label>
                  <div class="flex gap-2">
                      <InputText v-model="aboutUsSetting.image" class="input w-full !bg-slate-50 dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white cursor-not-allowed" placeholder="URL da Imagem..." disabled />
                      <label class="btn btn-secondary !py-2 !px-4 cursor-pointer flex items-center gap-2 border-slate-300 dark:border-white/10 text-slate-700 dark:text-white">
                          <i v-if="uploading" class="pi pi-spin pi-spinner"></i>
                          <i v-else class="pi pi-upload"></i>
                          <input type="file" @change="handleFileUpload($event, 'about')" class="hidden" accept="image/*" />
                      </label>
                  </div>
              </div>
          </div>
          <div class="field mb-4">
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Texto de Apresentação (descrição longa)</label>
              <Textarea v-model="aboutUsSetting.description" rows="4" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" />
          </div>
          <div class="grid sm:grid-cols-2 gap-6 mb-4">
              <div class="field">
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Missão</label>
                  <Textarea v-model="aboutUsSetting.mission" rows="3" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" />
              </div>
              <div class="field">
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Visão</label>
                  <Textarea v-model="aboutUsSetting.vision" rows="3" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" />
              </div>
          </div>
          <div class="field">
              <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Valores (Separados por vírgula)</label>
              <InputText v-model="aboutUsSetting.values" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" placeholder="Inovação, Qualidade, União..." />
          </div>
      </div>
    </section>

    <!-- Parceiros Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-star text-yellow-500 dark:text-yellow-400"></i>
          Parceiros (Scroll Infinito)
        </h2>
        <button @click="savePartners" class="btn btn-primary !py-2 !px-6 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <i class="pi pi-save"></i> Guardar Parceiros
        </button>
      </div>
      <div class="glass-card p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-white/5">
              <span class="text-sm text-slate-600 dark:text-slate-400">As imagens dos parceiros listados abaixo passarão num carrossel animado na página inicial.</span>
              <button @click="addPartner" class="btn btn-secondary !p-2 text-xs">
                  <i class="pi pi-plus"></i> Adicionar Parceiro
              </button>
          </div>

          <div v-if="partnersSetting.length === 0" class="text-center py-6 text-slate-500">
            Ainda não adicionaste parceiros. Clica no botão acima para adicionar.
          </div>

          <div class="space-y-4">
              <div v-for="(partner, index) in partnersSetting" :key="index" class="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5 relative group">
                  
                  <!-- Logo Preview -->
                  <div class="w-24 h-16 bg-white border border-slate-200 dark:border-transparent rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      <img v-if="partner.image" :src="partner.image" class="w-full h-full object-contain" />
                      <i v-else class="pi pi-image text-slate-300 dark:text-slate-400 text-2xl"></i>
                  </div>

                  <div class="flex-1 w-full">
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nome da Empresa</label>
                      <InputText v-model="partner.name" class="input w-full !bg-white dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white" placeholder="MUV Academy..." />
                  </div>
                  
                  <div class="flex-1 w-full relative">
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Logotipo (URL ou Upload)</label>
                      <div class="flex gap-2">
                        <InputText v-model="partner.image" class="input w-full !bg-slate-50 dark:!bg-slate-900 border-slate-300 dark:border-white/10 !text-sm text-slate-900 dark:text-white flex-1 cursor-not-allowed" placeholder="Endereço da imagem..." disabled />
                        
                        <label class="btn btn-secondary !py-2 !px-4 cursor-pointer flex items-center justify-center border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white" title="Fazer Upload">
                          <i v-if="uploading" class="pi pi-spin pi-spinner text-xs"></i>
                          <i v-else class="pi pi-upload text-xs"></i>
                          <input type="file" @change="handleFileUpload($event, `partner-${index}`)" class="hidden" accept="image/*" />
                        </label>

                        <button @click="removePartner(index)" class="btn bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-500 hover:text-white !p-2 w-10 flex items-center justify-center transition-all" title="Remover registo">
                            <i class="pi pi-trash"></i>
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>

    <!-- Banners Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-images text-primary-500 dark:text-primary-400"></i>
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
            <h3 class="text-slate-900 dark:text-white font-bold mb-2 truncate">{{ banner.title.pt }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{{ banner.subtitle.pt }}</p>
            <div class="flex gap-2">
              <button @click="editBanner(banner)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
              <button @click="confirmDeleteBanner(banner)" class="btn bg-red-100 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Workshops Section -->
    <section class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-calendar text-primary-500 dark:text-primary-400"></i>
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
            <h3 class="text-slate-900 dark:text-white font-bold mb-2 truncate">{{ workshop.title.pt }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{{ workshop.description.pt }}</p>
            <div class="flex gap-2">
              <button @click="editWorkshop(workshop)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
              <button @click="confirmDeleteWorkshop(workshop)" class="btn bg-red-100 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-briefcase text-accent-500 dark:text-accent-400"></i>
          Áreas de Serviço
        </h2>
        <button @click="openNewService" class="btn btn-accent !py-2 !px-4 text-sm">
          <i class="pi pi-plus"></i> Novo Serviço
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service._id" class="glass-card p-6">
          <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <i :class="service.icon" class="text-2xl text-accent-500 dark:text-accent-400"></i>
          </div>
          <h3 class="text-slate-900 dark:text-white font-bold mb-2">{{ service.title.pt }}</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{{ service.description.pt }}</p>
          <div class="flex gap-2">
            <button @click="editService(service)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
            <button @click="confirmDeleteService(service)" class="btn bg-red-100 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Portfolio Section -->
    <section class="mt-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-briefcase text-primary-500 dark:text-primary-400"></i>
          Portfólio & Cases
        </h2>
        <button @click="openNewProject" class="btn btn-primary !py-2 !px-4 text-sm">
          <i class="pi pi-plus"></i> Novo Projeto
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="project in projects" :key="project._id" class="glass-card overflow-hidden group">
          <div class="h-40 relative">
            <img :src="project.image" class="w-full h-full object-cover opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div class="absolute top-2 right-2">
              <span class="text-[10px] bg-primary-500/80 text-white px-2 py-1 rounded-full uppercase font-bold">{{ project.category }}</span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-slate-900 dark:text-white font-bold mb-2 truncate">{{ project.title }}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{{ project.description }}</p>
            <div class="flex flex-wrap gap-1 mb-6">
              <span v-for="tag in project.tags" :key="tag" class="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                {{ tag }}
              </span>
            </div>
            <div class="flex gap-2">
              <button @click="editProject(project)" class="btn btn-secondary !p-2 flex-1 text-xs">Editar</button>
              <button @click="confirmDeleteProject(project)" class="btn bg-red-100 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20 !p-2 flex-1 text-xs hover:bg-red-500 hover:text-white transition-colors">Eliminar</button>
            </div>
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

    <!-- Project Dialog -->
    <Dialog v-model:visible="showProjectDialog" :header="editingItem ? 'Editar Projeto' : 'Novo Projeto'" modal class="p-fluid w-full max-w-2xl bg-surface-dark text-white">
      <div class="grid gap-6 py-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Título do Projeto</label>
            <InputText v-model="projectForm.title" class="input" placeholder="Ex: OtakuZoneFlix" />
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Categoria</label>
            <Dropdown v-model="projectForm.category" :options="['web', 'mobile', 'system', 'design']" class="input" />
          </div>
        </div>
        <div class="field">
          <label class="block text-sm font-bold mb-2">Descrição</label>
          <Textarea v-model="projectForm.description" rows="3" class="input w-full" placeholder="Descrição curta do projeto..." />
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="field">
            <label class="block text-sm font-bold mb-2">Imagem de Capa</label>
            <div class="flex gap-2">
               <InputText v-model="projectForm.image" class="input flex-1" placeholder="URL da imagem..." disabled />
               <label class="btn btn-secondary !py-2 !px-4 cursor-pointer flex items-center gap-2">
                  <i v-if="uploading" class="pi pi-spin pi-spinner"></i>
                  <i v-else class="pi pi-upload"></i>
                  <span>Alterar</span>
                  <input type="file" @change="handleFileUpload($event, 'project')" class="hidden" accept="image/*" />
               </label>
            </div>
          </div>
          <div class="field">
            <label class="block text-sm font-bold mb-2">Link do Projeto</label>
            <InputText v-model="projectForm.link" class="input" placeholder="#" />
          </div>
        </div>
        <div class="field">
          <label class="block text-sm font-bold mb-2">Tags (Separadas por vírgula)</label>
          <InputText v-model="projectForm.tags" class="input" placeholder="Vue 3, Node.js, MongoDB" />
        </div>
      </div>
      <template #footer>
        <button @click="showProjectDialog = false" class="btn btn-secondary !py-2 !px-4">Cancelar</button>
        <button @click="saveProject" class="btn btn-primary !py-2 !px-4">Guardar Projeto</button>
      </template>
    </Dialog>
    <Toast />
    <ConfirmDialog />
  </div>
</template>
