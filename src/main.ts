import { createApp } from 'vue'
import App from './App.vue'
import Vuetify from './vuetify'
import VContextMeun from '../dist/vuetify-ctx-menu.es'
import '../dist/style.css'
createApp(App).use(Vuetify).use(VContextMeun).mount('#app')
