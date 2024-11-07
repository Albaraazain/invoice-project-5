// ReferenceInputPage.js

export class ReferenceInputPage {
  constructor() {
      this.state = {
          provider: '',
          referenceNumber: '',
          whatsapp: '',
          isLoading: false,
          error: null
      };

      // Inject base styles when class is instantiated
      this.injectBaseStyles();
      this.injectUtilityStyles();
      this.injectAnimationStyles();
  }

  injectBaseStyles() {
      const style = document.createElement('style');
      style.textContent = `
          /* Reset and Base Styles */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          :root {
              --color-primary: #00a651;
              --color-primary-dark: #008c44;
              --color-primary-light: rgba(0, 166, 81, 0.1);
              --color-yellow: #ffde17;
              --color-gray-800: #2d3748;
              --color-gray-600: #4a5568;
              --color-gray-400: #cbd5e0;
              --color-gray-200: #edf2f7;
              --color-white: #ffffff;
          }

          body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                         "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
              color: var(--color-gray-800);
          }

          /* Main Container Styles */
          .main-content {
              position: relative;
              width: 100%;
              min-height: 100vh;
              background-color: var(--color-white);
              overflow: hidden;
          }

          /* Logo Section */
          .logo-section {
              position: absolute;
              top: 2rem;
              left: 3rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              z-index: 10;
          }

          .logo-icon {
              width: 3rem;
              height: 3rem;
          }

          .logo-text h1 {
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--color-gray-800);
          }

          .logo-text p {
              font-size: 0.875rem;
              font-style: italic;
              color: var(--color-gray-600);
          }

          /* Layout Grid */
          .layout-grid {
              display: flex;
              height: 100vh;
          }

          /* Form Section */
          .form-section {
              width: 66.666667%;
              padding: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .form-container {
              max-width: 28rem;
              width: 100%;
          }

          .form-title {
              font-size: 2.25rem;
              font-weight: 700;
              color: var(--color-primary);
              margin-bottom: 2rem;
          }

          /* Form Elements */
          .form-group {
              margin-bottom: 1.5rem;
          }

          .form-label {
              display: block;
              font-size: 0.875rem;
              color: var(--color-gray-600);
              margin-bottom: 0.5rem;
          }

          .form-input {
              width: 100%;
              height: 2.5rem;
              padding: 0 1rem;
              border: 1px solid var(--color-gray-400);
              border-radius: 0.375rem;
              transition: all 0.2s ease;
          }

          .form-input:focus {
              outline: none;
              border-color: var(--color-primary);
              box-shadow: 0 0 0 3px var(--color-primary-light);
          }

          .form-button {
              width: 100%;
              height: 3rem;
              background-color: var(--color-primary);
              color: var(--color-white);
              border: none;
              border-radius: 9999px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              cursor: pointer;
              transition: all 0.2s ease;
          }

          .form-button:hover:not(:disabled) {
              background-color: var(--color-primary-dark);
          }

          .form-button:disabled {
              opacity: 0.7;
              cursor: not-allowed;
          }

          /* Right Section */
          .right-section {
              width: 33.333333%;
              background-color: var(--color-primary);
              padding: 2rem;
              display: flex;
              flex-direction: column;
              position: relative;
          }

          .right-content {
              margin-top: 4rem;
              color: var(--color-white);
          }

          .right-content p {
              font-size: 1.5rem;
              line-height: 1.4;
          }

          .powered-by {
              position: absolute;
              bottom: 6rem;
              font-size: 1.5rem;
              font-weight: 700;
              color: var(--color-white);
          }
      `;
      document.head.appendChild(style);
  }

  injectUtilityStyles() {
      const style = document.createElement('style');
      style.textContent = `
          /* Utility Classes */
          .relative { position: relative; }
          .absolute { position: absolute; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-2 { gap: 0.5rem; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .text-white { color: white; }
          .bg-white { background-color: white; }
          .overflow-hidden { overflow: hidden; }
          .z-10 { z-index: 10; }
          .space-y-2 > * + * { margin-top: 0.5rem; }
          .space-y-6 > * + * { margin-top: 1.5rem; }
      `;
      document.head.appendChild(style);
  }

  injectAnimationStyles() {
      const style = document.createElement('style');
      style.textContent = `
          /* Grain Animation */
          .main-content:before {
              animation: grain 4s steps(10) infinite;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEVMaXH///////////////////////////////////////////9/ePoGAAAACHRSTlMAGBonNDtASlb65KYAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAFD0lEQVQ4yx2TTWhcVRTH/+fe++67783LvDZJx1hLKlQFFcFuXMWdC7Ql2I0ILkUXbXEhrSBd2BbE0IWQgKBddBNcFCpSEAyiQrt2IW4UNwoukhRsTKck6WQyH+/jvnfvPefcjwv3/s9v8b+/QwDQg19VDIkiUCBAhQAibsACkH0E5O3tzdreeMrdvff+9vb2ixuAu1UHsSAtrdyrA9QIAC/cu9F7OIwOe/3+cXt4fPwkAM3ojI4t5YBmE5BmetDpxo92dzqdjyfj0+kz0zQPTvY+kX08tGQqpWEqIGknrbb1TqvX+5REz/XNRXv97jL0z6ZprEYqoAPA0Eqr1Ta/7XbNVzzPfnZ9Z2ey7Z+fTc+GUQxrCssCQFpJK8z7rZb7/uZmr900vVa/89vZ2Dsd+T1iqEQQKNJgXlZ23lmzbK0P/XC71tDq9fU7+5fj8fnIG85VCFwzQ5KSdrPZvOK5rqvVSLkn6vcPL0fToS+YADDDG1Qx2mGz0TDfXXGcTsuyPvJOj5+eDvv9+FgJ0AAoyAHCBq+/67muuzJrGLVyo1a5NhyfBfE0QhGgITBDggR/08SH7ebqrF4v+xeB/30cngzm8WipRcRiAVBBOkr9F6/UdN3GDQz+aMd8URvOw+FcqwxCAdJCYkRZJ4rjpQa31suN50Uci7KSaWwVgtkaMXB+fhlHUZQsFYZcJgmAK/9FWGgR6RwAipwkqaRfbheypWAYRUk6S1d9zxdIlqYXhJ4qYiRG7uGMEi09z1PsiwQ6LWxEo5lXC5hoZSYV0iRWrFCInTwAFgLQQhZKQokhHTyYS2EsBSI0xEIgEsCRwVEkEksYgZGAUQW5wP8NOYwx8UFZA0qlFEgGmEIAiQJSFyB0oQIpC0CKpUI0EYAkgJUnJQoDWCAa1EABEAEAYpICQEFE/wLQ4FIJKBAGmAFBCYNZAUEAQIYxBBE4UhSHsWRYAFQRUCQgmKSCRzl+ZEAyiJgw3ghJ4hlAiKRMADAJKEiK7NJHpGqsAQhDEL+mF6AQChFkwBggcEVNh4o9JT0CuADoAIGGtCAGyzgPBsWj4a8vv7q5mKvlhEgKDFBENHUl6SnZ8ACgBQV4MZPEXMwFZuzY+fzrh2u12qyxtl7+2iBuWQiDGYyRxN2QS/0KgMQ1WqcYzZL4vFc1n/R+uO27lc21h2Udy9uA1hljK2kMgxY0gAAIS2gpsSCKGPq4WvGcr75/uVR0rXLrthiclO2i72mMFAF1IgYBYCWRW/UU1v0PW4bhrlSM8nfnl74ppdSU5XAeaakQsQSCWAEpxKK/1ry9bZn2m0YZhWKlqNOyxGiMOJ5HGlEiIJJA5KIkPsE8HRiF4r2y7fzKXF6aDKBgX/pz6KtckRhKQKiFeZauv9tynbJhmAQQU9Cp5Eo+8WweRqqGWEgKWKTxSavytuUUS7ZjMKaYtTxhLSVnQjBBqgygApBWPOGl/9TpteaUAWAqmAh1E4dpspQwSGlFjPFd/4Xu7rOvvc7mZsUqlXN6QbX0z2kS+3FWzkABlBaUBs3gS7sdJq1eZ2U8j31KUhb746FcSrATQjRfJhBTCmlrVdpJ2r3e/s9B6KfzJFGm+DcdBDG0KYq6jMrCkSJClClCZPXg++E4OP0WsKxxPhlN07wqPuJqPa23XGG8/uG1VbOk12yX5fV9LzyfLnWRp3cBBv8AL4A74Q+hss4AAAAASUVORK5CYII=);
              content: "";
              height: 350%;
              left: -50%;
              opacity: 0.02;
              position: fixed;
              top: -150%;
              width: 300%;
              z-index: 999 !important;
              pointer-events: none;
          }

          @keyframes grain {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-5%, -10%); }
              20% { transform: translate(-15%, 5%); }
              30% { transform: translate(7%, -25%); }
              40% { transform: translate(-5%, 25%); }
              50% { transform: translate(-15%, 10%); }
              60% { transform: translate(15%, 0%); }
              70% { transform: translate(0%, 15%); }
              80% { transform: translate(3%, 35%); }
              90% { transform: translate(-10%, 10%); }
          }

          /* Decorative Wave Animation */
          .wave-animation {
              animation: wave 10s ease-in-out infinite;
              transform-origin: center bottom;
          }

          @keyframes wave {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
          }

          /* Loading Spinner Animation */
          .spinner {
              animation: spin 1s linear infinite;
          }

          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }

          /* Character Animation */
          .char {
              transform: translateY(115px);
              transition: transform 0.5s;
          }

          /* Selection Style */
          ::selection {
              background-color: var(--color-primary-light);
              color: var(--color-primary);
          }
      `;
      document.head.appendChild(style);
  }
}