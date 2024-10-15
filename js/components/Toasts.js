// js/components/Toasts.js
export class Toasts {
    constructor() {
        this.container = document.getElementById('toasts');
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                this.container.removeChild(toast);
            }, 300);
        }, 3000);
    }
}
