import './assets/main.css'

import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'

import App from './App.vue'
import config from '../formkit.config.js'
import PrimeVue from 'primevue/config';

import Lara from '@/primevue-presets/Lara';

createApp(App).use(PrimeVue, {
  unstyled: true,
  pt: Lara,
}).use(plugin, defaultConfig(config)).mount('#app')
