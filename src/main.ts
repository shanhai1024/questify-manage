
import { createApp, computed } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './theme/index.scss'
import { useAppStore } from './stores/app'

const app = createApp(App)
app.use(createPinia()).use(router).use(ElementPlus)

app.mount('#app')
