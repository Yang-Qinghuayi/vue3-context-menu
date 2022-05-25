import { createApp } from 'vue'
import App from './App.vue'
import Vuetify from './vuetify'
import { createContextMenu } from '../lib/main'
const ContextMenu = createContextMenu()
createApp(App).use(Vuetify).use(ContextMenu).mount('#app')
