import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Styles
import './assets/css/main.css'
import 'primevue/resources/themes/lara-dark-blue/theme.css'
import 'primeicons/primeicons.css'

// Create app
const app = createApp(App)

// Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Use plugins
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)
app.use(VueApexCharts)

// Mount
app.mount('#app')
