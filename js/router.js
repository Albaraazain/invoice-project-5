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
            if (route.vueComponent) {
                // Handle Vue component
                this.renderVueComponent(route.vueComponent);
            } else {
                // Handle vanilla JS component
                this.renderJSComponent(route.component);
            }
        } else {
            console.error('Route not found for path:', path);
        }
    }

    renderVueComponent(component) {
        const appElement = document.getElementById('vue-app');
        appElement.style.display = 'block';
        document.getElementById('js-app').style.display = 'none';
        window.vueApp.component('current-page', component);
        window.vueApp.mount('#vue-app');
    }

    renderJSComponent(component) {
        const jsAppElement = document.getElementById('js-app');
        jsAppElement.style.display = 'block';
        document.getElementById('vue-app').style.display = 'none';
        jsAppElement.innerHTML = '';
        component();
    }

    push(path) {
        console.log('Pushing new path:', path);
        window.history.pushState(null, '', path);
        this.navigate();
    }
}