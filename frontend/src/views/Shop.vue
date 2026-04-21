<script setup>
import { ref, computed, onMounted } from 'vue'
import { contentService } from '@/services/content.service'

const products = ref([])
const loading = ref(true)
const activeCategory = ref('all')

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

const buyViaWhatsApp = (product) => {
  const message = encodeURIComponent(`Olá MUV! Gostaria de adquirir o produto: ${product.name} (${formatPrice(product.price)}).`)
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
          class="group bg-white dark:bg-surface-dark rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col"
        >
          <!-- Product Image -->
          <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-black/20">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm text-gray-900 dark:text-white">
                {{ categories.find(c => c.id === product.category)?.label || 'Produto' }}
              </span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-6 flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
              {{ product.description }}
            </p>
            
            <div class="mt-auto flex items-center justify-between gap-4">
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase font-bold tracking-tighter">Preço</span>
                <span class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ formatPrice(product.price) }}</span>
              </div>
              <button 
                @click="buyViaWhatsApp(product)"
                class="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-all hover:scale-110 group/btn"
              >
                <i class="pi pi-whatsapp text-xl group-hover:rotate-12 transition-transform"></i>
              </button>
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
</style>
