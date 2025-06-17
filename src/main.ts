import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import authPlugin from './plugins/auth'
import analyticsPlugin from './plugins/analytics'
import axiosInterceptor from './plugins/axios-interceptor'
import authDirective from './directives/auth.directive'
import pwaPlugin from './plugins/pwa'


const app = createApp(App)
    .use(router)
    .use(pinia)
    // Initialize authentication plugin after Pinia and router
    .use(authPlugin, { router })
    // Initialize analytics plugin with router for automatic tracking
    .use(analyticsPlugin, { router })
    // Authorization directive
    .use(authDirective)
    .use(pwaPlugin)

// Setup Axios interceptors
axiosInterceptor.setup()



app.mount('#app')