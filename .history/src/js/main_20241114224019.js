import { gsap } from "gsap";
import { Router } from "./router.js";
import { ReferenceInputPage } from "./components/ReferenceInputPage.js";
import { QuoteResultPage } from "./components/QuoteResultPage.js";
import { initializeSolarSizingState } from "./store/solarSizingState.js";
import { Toasts } from './components/Toasts.js';
import '../input.css';
import { BillReviewPage } from "./components/BillReviewPage.js";

const routes = [
  {
      path: "/",
      component: () => {
          console.log("Rendering ReferenceInputPage");
          const page = new ReferenceInputPage();
          page.render();
      },
  },
  {
      path: "/bill-review",
      component: () => {
          console.log("Rendering BillReviewPage");
          const page = new BillReviewPage();
          page.render();
      },
  },
  {
      path: "/quote",
      component: () => {
          console.log("Rendering QuoteResultPage");
          const page = new QuoteResultPage();
          page.render();
      }
  },
];

const router = new Router(routes);
initializeSolarSizingState();

// Expose router to window for global access
window.router = router;

// Initialize Toasts
window.toasts = new Toasts();

// Start the router
router.navigate();