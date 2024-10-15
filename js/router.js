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
            route.component();
        } else {
            console.error('Route not found for path:', path);
        }
    }

    push(path) {
        console.log('Pushing new path:', path);
        window.history.pushState(null, '', path);
        this.navigate();
    }
}