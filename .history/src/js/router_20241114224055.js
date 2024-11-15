// js/router.js
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.navigate = this.navigate.bind(this);
        window.addEventListener('popstate', this.navigate);
        window.addEventListener('DOMContentLoaded', this.navigate);
    }

    navigate() {
        const path = window.location.pathname;
        console.log('Current path:', path);
        const route = this.routes.find(route => route.path === path) || this.routes.find(route => route.path === '/');
        if (route) {
            console.log('Rendering route:', route.path);
            try {
                route.component();
            } catch (error) {
                console.error('Error rendering route:', error);
                this.handleRouteError();
            }
        } else {
            console.error('Route not found for path:', path);
            this.handleRouteError();
        }
    }

    handleRouteError() {
        const app = document.getElementById("app");
        if (app) {
            app.innerHTML = `
                <div class="flex items-center justify-center h-screen">
                    <div class="text-center">
                        <h2 class="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                        <p class="text-gray-600">Something went wrong. Please try again.</p>
                        <button onclick="window.router.push('/')" 
                                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Go Back Home
                        </button>
                    </div>
                </div>
            `;
        }
    }

    push(path) {
        console.log('Pushing new path:', path);
        window.history.pushState(null, '', path);
        this.navigate();
    }
}
