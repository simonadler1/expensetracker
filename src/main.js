import { createApp } from 'vue';
import toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/style.css';
import App from './App.vue';
const app = createApp(App);
app.use(toast);
app.mount('#app');
