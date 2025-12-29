import { createI18n } from 'vue-i18n'
import pt from './locales/pt.json'
import en from './locales/en.json'

// Get saved language or detect from browser
const savedLanguage = localStorage.getItem('muv-language')
const browserLanguage = navigator.language.split('-')[0]
const defaultLanguage = savedLanguage || (browserLanguage === 'en' ? 'en' : 'pt')

const i18n = createI18n({
    legacy: false,
    locale: defaultLanguage,
    fallbackLocale: 'pt',
    messages: { pt, en }
})

export default i18n
