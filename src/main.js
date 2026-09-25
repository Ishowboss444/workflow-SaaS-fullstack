import '@/assets/style.scss';
import '@/assets/scss/main.scss';
import '@/assets/scss/_variables.scss';
import '@/assets/scss/_mixins.scss';


import '../node_modules/vue-sonner/lib/index.css';
import { createApp } from 'vue';
import App from './App.vue';
import routes from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(routes);
app.use(pinia);
app.mount('#app');
