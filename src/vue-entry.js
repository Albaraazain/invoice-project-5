import { createApp } from 'vue'
import { initializeSolarSizingState } from '../js/store/solarSizingState.js'

// We'll create this component in the next stage
import ReferenceInputPage from '../js/components/ReferenceInputPage.vue'

// Initialize the state
initializeSolarSizingState()

// Create a Vue app instance
const app = createApp(ReferenceInputPage)

// Mount the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.mount('#vue-app')
})

// Expose the app instance globally for potential use in other parts of the application
window.vueApp = app