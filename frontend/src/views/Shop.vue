<script setup>
import { ref, computed, onMounted } from 'vue'
import { contentService } from '@/services/content.service'
import Dialog from 'primevue/dialog'

const products = ref([])
const loading = ref(true)
const activeCategory = ref('all')
const showDetailDialog = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)
const activeThumbIndex = ref(0)

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'solar', label: 'Painéis & Solar' },
  { id: 'lighting', label: 'Iluminação LED' },
  { id: 'accessories', label: 'Acessórios' }
]

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await contentService.getProducts()
    if (response.data.success) {
      products.value = response.data.data.products
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(price)
}

const totalPrice = computed(() => {
  if (!selectedProduct.value) return 0
  return selectedProduct.value.price * quantity.value
})

const openProductDetails = (product) => {
  selectedProduct.value = product
  quantity.value = 1
  activeThumbIndex.value = 0
  showDetailDialog.value = true
}

const buyViaWhatsApp = async (product, qty = 1) => {
  try {
     await contentService.trackProductClick(product._id)
  } catch (err) {
     console.error('Falha ao registar clique:', err)
  }
  const total = product.price * qty
  const message = encodeURIComponent(`Olá MUV! Gostaria de adquirir o produto: ${product.name}\nQuantidade: ${qty}\nPreço Unitário: ${formatPrice(product.price)}\nTotal: ${formatPrice(total)}`)
  window.open(`https://wa.me/258834802943?text=${message}`, '_blank')
}
</script>

<template>
  <div class="pt-12 pb-24 animate-fade-in relative min-h-screen">
    <!-- Background Elements -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwaC02MHY2MGg2MFYweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-5 pointer-events-none -z-10"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-8 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/10 text-accent-600 dark:text-accent-400 text-sm font-semibold rounded-full mb-4">
        <i class="pi pi-shopping-bag text-xs"></i> MUV Shop
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white leading-tight">
        Equipamentos de <span class="gradient-text">Excelência</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Soluções profissionais em energia e iluminação para a sua casa ou empresa. 
        Tecnologia de ponta com a garantia e suporte técnico da MUV.
      </p>
    </section>

    <!-- Categories Filter -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex flex-wrap justify-center gap-3">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          class="px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border"
          :class="[
            activeCategory === cat.id
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-lg'
              : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary-500'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white dark:bg-white/5 rounded-3xl h-96"></div>
      </div>

      <transition-group 
        v-else
        name="list" 
        tag="div" 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <div 
          v-for="product in filteredProducts" 
          :key="product._id"
          @click="openProductDetails(product)"
          class="group bg-white dark:bg-surface-dark rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
        >
          <!-- Product Image -->
          <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-black/20">
            <img 
              :src="product.images?.[0] || 'https://images.unsplash.com/photo-1509391366360-fe19a78e729b?auto=format&fit=crop&w=800&q=80'" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="px-6 py-2 bg-white text-gray-900 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                Ver Detalhes
              </span>
            </div>
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm text-gray-900 dark:text-white">
                {{ categories.find(c => c.id === product.category)?.label || 'Produto' }}
              </span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-6 flex flex-col flex-grow text-left">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
              {{ product.description }}
            </p>
            
            <div class="mt-auto flex items-center justify-between gap-4">
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase font-bold tracking-tighter">A partir de</span>
                <span class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                <i class="pi pi-arrow-right text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="py-24 text-center">
        <i class="pi pi-search text-5xl text-gray-300 dark:text-gray-700 mb-6"></i>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum produto encontrado</h3>
        <p class="text-gray-500">Tente selecionar outra categoria ou volte mais tarde.</p>
      </div>
    </section>

    <!-- Support Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
      <div class="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Precisa de ajuda na escolha?</h2>
          <p class="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Nossa equipe técnica está pronta para dimensionar a solução ideal para o seu projeto de energia ou iluminação.
          </p>
          <a 
            href="https://wa.me/258834802943" 
            target="_blank"
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-xl"
          >
            <i class="pi pi-whatsapp"></i> Falar com um Consultor
          </a>
        </div>
      </div>
    </section>

    <!-- Product Detail Dialog -->
    <Dialog 
      v-model:visible="showDetailDialog" 
      modal 
      dismissableMask
      :header="selectedProduct?.name"
      class="w-full max-w-5xl bg-white dark:bg-surface-dark overflow-hidden p-0"
      contentClass="!p-0 overflow-hidden"
    >
      <div v-if="selectedProduct" class="grid grid-cols-1 lg:grid-cols-2">
        <!-- Left: Image Gallery -->
        <div class="p-6 lg:p-10 bg-gray-50 dark:bg-black/20">
          <div class="aspect-square rounded-3xl overflow-hidden mb-6 shadow-2xl relative">
             <transition name="fade" mode="out-in">
               <img 
                 :key="activeThumbIndex"
                 :src="selectedProduct.images?.[activeThumbIndex] || selectedProduct.images?.[0]" 
                 class="w-full h-full object-cover"
               />
             </transition>
          </div>
          <div class="flex flex-wrap gap-4 justify-center">
            <button 
              v-for="(img, idx) in selectedProduct.images" 
              :key="idx"
              @click="activeThumbIndex = idx"
              class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all"
              :class="activeThumbIndex === idx ? 'border-primary-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Right: Content & Purchase -->
        <div class="p-8 lg:p-12 flex flex-col">
          <div class="mb-8">
            <span class="px-3 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block">
              {{ categories.find(c => c.id === selectedProduct.category)?.label }}
            </span>
            <h2 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {{ selectedProduct.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ selectedProduct.description }}
            </p>
          </div>

          <div class="space-y-8 mt-auto">
            <!-- Price and Quantity -->
            <div class="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <span class="text-xs text-gray-400 uppercase font-bold block mb-1">Preço Unitário</span>
                  <span class="text-2xl font-display font-bold text-gray-900 dark:text-white">{{ formatPrice(selectedProduct.price) }}</span>
                </div>
                <div class="flex items-center gap-4">
                   <button @click="quantity > 1 && quantity--" class="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-colors">
                     <i class="pi pi-minus"></i>
                   </button>
                   <span class="text-xl font-bold w-6 text-center">{{ quantity }}</span>
                   <button @click="quantity++" class="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-colors">
                     <i class="pi pi-plus"></i>
                   </button>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                <span class="text-sm font-bold text-gray-500">Total Estimado</span>
                <span class="text-3xl font-display font-bold text-primary-500">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <!-- Action Button -->
            <button 
              @click="buyViaWhatsApp(selectedProduct, quantity)"
              class="w-full py-5 rounded-[2rem] bg-primary-500 text-white font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-600 shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:scale-95"
            >
              <i class="pi pi-whatsapp text-2xl"></i>
              Comprar via WhatsApp
            </button>
            <p class="text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              Entrega em todo o país • Pagamento Seguro • Garantia MUV
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
