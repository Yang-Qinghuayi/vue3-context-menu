import { createApp } from 'vue'
import App from './App.vue'
import Vuetify from './vuetify'
import VContextMeun from '../lib/ContextMenuInstance'
createApp(App).use(Vuetify).use(VContextMeun).mount('#app')
