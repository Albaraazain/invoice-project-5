// js/components/QuoteResultPage.js
import { getBillData, getError } from '../store/solarSizingState.js';
import { BillPreview } from './BillPreview.js';
import { SystemSizing } from './SystemSizing.js';

export class QuoteResultPage {
    constructor() {
        try {
            this.billData = getBillData();
            this.error = getError();
        } catch (error) {
            console.error('Error in QuoteResultPage constructor:', error);
            this.error = 'Failed to load bill data. Please try again.';
        }
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="quote-result-page">
                <div class="animation-container">
                    <div class="bill-preview-container centered">
                        <div id="bill-preview" class="content-fade"></div>
                        <div class="loading-indicator">
                            <div class="spinner"></div>
                            <p>Analyzing your bill...</p>
                        </div>
                    </div>
                    <div class="system-sizing-container hidden">
                        <div id="system-sizing" class="content-fade"></div>
                    </div>
                </div>
                <div class="error-message hidden">
                    <p>An error occurred. Please try again.</p>
                    <button id="retry-button">Retry</button>
                </div>
            </div>
        `;

        if (this.error) {
            this.showError();
        } else {
            this.renderBillPreview();
            this.renderSystemSizing();
            this.startAnimation();
        }

        this.attachStyles();
    }

    renderBillPreview() {
        if (!this.billData) {
            console.error('Bill data is not available');
            this.showError();
            return;
        }
        const billPreviewContainer = document.querySelector('#bill-preview');
        const billPreview = new BillPreview(this.billData);
        billPreview.render(billPreviewContainer);
    }

    renderSystemSizing() {
        if (!this.billData) {
            console.error('Bill data is not available');
            this.showError();
            return;
        }
        const systemSizingContainer = document.querySelector('#system-sizing');
        const systemSizing = new SystemSizing(this.billData);
        systemSizing.render(systemSizingContainer);
    }

    startAnimation() {
        if (this.error) {
            this.showError();
            return;
        }

        const quoteResultPage = document.querySelector('.quote-result-page');
        const billPreviewContainer = document.querySelector('.bill-preview-container');
        const systemSizingContainer = document.querySelector('.system-sizing-container');
        const loadingIndicator = document.querySelector('.loading-indicator');
        const billPreviewContent = document.querySelector('#bill-preview');
        const systemSizingContent = document.querySelector('#system-sizing');

        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            billPreviewContent.classList.add('fade-in');

            setTimeout(() => {
                loadingIndicator.classList.add('fade-in');
            }, 500);

            setTimeout(() => {
                requestAnimationFrame(() => {
                    quoteResultPage.classList.add('transition-bg');
                    billPreviewContainer.classList.remove('centered');
                    billPreviewContainer.classList.add('slide-left');
                    loadingIndicator.classList.add('fade-out');

                    systemSizingContainer.classList.remove('hidden');
                    systemSizingContainer.classList.add('slide-in');

                    setTimeout(() => {
                        systemSizingContent.classList.add('fade-in');
                    }, 400);
                });
            }, 3000);
        });
    }

    showError() {
        const errorMessage = document.querySelector('.error-message');
        errorMessage.classList.remove('hidden');
        
        const retryButton = document.querySelector('#retry-button');
        retryButton.addEventListener('click', () => {
            window.router.push('/');
        });
    }

    attachStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .quote-result-page {
                height: 100vh;
                width: 100vw;
                overflow: hidden;
                background-color: var(--color-bg);
                transition: background-color 1s ease-in-out;
            }

            .transition-bg {
                background-color: var(--color-bg-secondary);
            }

            .animation-container {
                position: relative;
                width: 100%;
                height: 100%;
            }

            .bill-preview-container,
            .system-sizing-container {
                position: absolute;
                top: 0;
                width: 50%;
                height: 100%;
                transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            }

            .bill-preview-container {
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .system-sizing-container {
                right: -50%;
            }

            .centered {
                left: 25% !important;
                width: 50% !important;
            }

            .hidden {
                opacity: 0;
                pointer-events: none;
            }

            .slide-left {
                left: 0 !important;
                width: 50% !important;
            }

            .slide-in {
                right: 0 !important;
                opacity: 1;
                pointer-events: auto;
            }

            .loading-indicator {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                transition: opacity 0.5s ease-in-out;
                opacity: 0;
            }

            .loading-indicator.fade-in {
                opacity: 1;
            }

            .loading-indicator.fade-out {
                opacity: 0;
            }

            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: var(--color-tint);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .content-fade {
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }

            .content-fade.fade-in {
                opacity: 1;
            }

            .error-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                background-color: var(--color-bg);
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .error-message p {
                margin-bottom: 15px;
                color: var(--color-error);
            }

            #retry-button {
                background-color: var(--color-tint);
                color: var(--color-bg);
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            #retry-button:hover {
                background-color: var(--color-brand-lavender);
            }

            @media (max-width: 1024px) {
                .bill-preview-container,
                .system-sizing-container {
                    width: 100%;
                    height: 50%;
                }

                .bill-preview-container {
                    top: 0;
                    left: 0 !important;
                }

                .system-sizing-container {
                    top: 100%;
                    right: 0 !important;
                }

                .centered {
                    top: 25% !important;
                    height: 50% !important;
                }

                .slide-left {
                    top: 0 !important;
                    height: 50% !important;
                }

                .slide-in {
                    top: 50% !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}