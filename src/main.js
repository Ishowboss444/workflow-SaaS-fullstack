import '@/assets/style.scss'
import '../node_modules/vue-sonner/lib/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import {routes} from './router/index.js'
const app = createApp(App)
app.use(routes)
app.mount('#app')
