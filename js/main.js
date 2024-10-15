import { Router } from "./router.js";
import { QuoteResultPage } from "./components/QuoteResultPage.js";
import ReferenceInputPage from "./components/ReferenceInputPage.vue";
import { initializeSolarSizingState } from "./store/solarSizingState.js";
import { Toasts } from './components/Toasts.js';
import '../src/input.css';
import { createApp } from 'vue';

const routes = [
  {
    path: "/",
    vueComponent: ReferenceInputPage
  },
  {
    path: "/quote",
    component: () => {
      console.log("Rendering QuoteResultPage");
      const page = new QuoteResultPage();
      page.render();
    },
  },
];

const router = new Router(routes);
initializeSolarSizingState();

// Create Vue app instance
const app = createApp({});

// Expose router and Vue app to window for global access
window.router = router;
window.vueApp = app;

// Initialize Toasts
window.toasts = new Toasts();

// Start the router
router.navigate();