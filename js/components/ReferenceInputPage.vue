<template>
  <div class="sap_form">
    <div class="container mx-auto px-6 md:px-10">
      <!-- Mobile Contact Icons -->
      <div class="flex md:hidden pt-5 space-x-1 animate-fadeIn">
        <p>
          <a
            href="tel:+14155551234"
            class="contact-icon phn_mb animate-bounce"
            aria-label="Solar System Sizing Phone"
          ></a>
        </p>
        <p>
          <a
            href="mailto:info@solarsizing.com"
            class="contact-icon eml_mb animate-bounce"
            aria-label="Solar System Sizing Email"
          ></a>
        </p>
        <p>
          <a
            href="https://t.me/solarsizing"
            class="contact-icon tg_mb animate-bounce"
            aria-label="Solar System Sizing Telegram"
          ></a>
        </p>
      </div>

      <!-- Desktop Contact Label -->
      <div class="hidden md:flex pt-4 animate-fadeIn">
        <div class="w-full">
          <p class="text-black opacity-20 text-xl tracking-tight">Contact us</p>
        </div>
      </div>

      <!-- Desktop Contact Details -->
      <div class="mt-6 hidden md:flex justify-between animate-fadeIn">
        <div class="flex items-center">
          <p class="text-black opacity-20 text-xl tracking-tight">
            <a
              href="https://t.me/solarsizing"
              class="hover:text-gray-400 transition-colors duration-300"
              aria-label="Solar System Sizing Telegram"
            >
              Telegram
            </a>
          </p>
        </div>
        <div class="flex items-center">
          <p class="text-black opacity-20 text-xl tracking-tight">
            <a
              href="mailto:info@solarsizing.com"
              class="hover:text-gray-400 transition-colors duration-300"
              aria-label="Solar System Sizing Email"
            >
              info@solarsizing.com
            </a>
          </p>
        </div>
      </div>

      <!-- Form Title -->
      <div class="mt-20 animate-slideInLeft">
        <h2 class="hidden md:block text-5xl font-normal tracking-tight">
          Solar System Sizing Tool -
          <span class="block">Enter Your Details</span>
        </h2>
        <h2 class="block md:hidden text-3xl font-normal tracking-tight">
          Solar System Sizing Tool -
          <span class="block">Enter Your Details</span>
        </h2>
      </div>

      <!-- Form -->
      <div class="mt-24 animate-fadeIn">
        <form
          @submit.prevent="handleSubmit"
          id="solar-sizing-form"
          class="space-y-6"
          novalidate
        >
          <!-- Name Field -->
          <div class="relative">
            <input
              type="text"
              id="name"
              v-model="formData.name"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              placeholder=" "
              required
              aria-label="NAME"
              class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300"
            />
            <label
              for="name"
              class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your name
            </label>
          </div>

          <!-- Phone and Email Fields -->
          <div class="grid md:grid-cols-2 gap-6">
            <div class="relative">
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                placeholder=" "
                required
                aria-label="PHONE"
                class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
              <label
                for="phone"
                class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Phone
              </label>
            </div>
            <div class="relative">
              <input
                type="email"
                id="email"
                v-model="formData.email"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                placeholder=" "
                required
                aria-label="EMAIL"
                class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
              <label
                for="email"
                class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                E-mail
              </label>
            </div>
          </div>

          <!-- Reference Number -->
          <div class="relative">
            <input
              type="text"
              id="referenceNumber"
              v-model="formData.referenceNumber"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              placeholder=" "
              required
              aria-label="REFERENCE"
              class="peer w-full bg-transparent border-b border-black text-black text-lg p-2 focus:outline-none focus:border-blue-500 transition-colors duration-300"
            />
            <label
              for="referenceNumber"
              class="absolute left-0 top-0 text-black text-lg transition-all duration-300 -translate-y-6 scale-75 transform origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              MEPCO Bill Reference Number
            </label>
          </div>
          <!-- File Upload -->
          <div class="mt-8 animate-slideInRight">
            <div class="flex flex-wrap items-start max-w-full">
              <ul class="list_dwn flex flex-wrap mt-4 w-full"></ul>
              <div class="relative">
                <div
                  class="dwn text-lg text-black cursor-pointer px-4 py-2 hover:text-gray-400 transition-colors duration-300"
                >
                  Add attachment
                </div>
                <input
                  type="file"
                  name="files[]"
                  data-url="/user_files/"
                  class="hidden"
                />
                <div
                  class="progress bg-gray-400 mt-2 relative h-0.5 w-full max-w-full"
                  role="progressbar"
                  aria-label="File Upload Progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow="0"
                >
                  <div
                    class="progress-bar-success bg-green-500 absolute top-0 left-0 h-full"
                    style="width: 0%"
                  ></div>
                </div>
                <div class="progress_txt mt-4 text-sm text-black">
                  <div>
                    Supported formats: jpg, png, pdf, doc(x), xls(x), ppt(x)
                  </div>
                  <div>Maximum file size 20 MB</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="error"
            id="error-message"
            class="text-red-500 mt-4 animate-shake"
          >
            {{ error }}
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="get_go w-full bg-black text-white font-medium text-lg rounded-full px-8 py-3 hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-default"
          >
            <span v-if="!isLoading">Get Quote</span>
            <span v-else class="animate-pulse">Loading...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useVueState } from "../store/vueState.js";

export default {
  name: "ReferenceInputPage",
  setup() {
    const {
      fetchBillData,
      getIsLoading,
      getError,
      initializeSolarSizingState,
    } = useVueState();

    const formData = reactive({
      name: "",
      phone: "",
      email: "",
      referenceNumber: "",
    });

    const isLoading = ref(false);
    const error = ref(null);

    const handleKeyDown = (event) => {
      const focusableElements = document.querySelectorAll(
        'button, input, [tabindex="0"]'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    onMounted(() => {
      initializeSolarSizingState();
      document.addEventListener("keydown", handleKeyDown);
    });

    const isFormValid = () => {
      return (
        formData.name &&
        formData.phone &&
        formData.email &&
        formData.referenceNumber
      );
    };

    const handleSubmit = async () => {
      if (isFormValid()) {
        isLoading.value = true;
        error.value = null;

        try {
          await fetchBillData(formData.referenceNumber);
          console.log("Navigating to /quote");
          window.router.push("/quote");
        } catch (err) {
          console.error("Error generating quote:", err);
          error.value = "Error generating quote. Please try again.";
        } finally {
          isLoading.value = false;
        }
      } else {
        error.value = "Please fill in all required fields.";
      }
    };

    const handleInput = (event) => {
      formData[event.target.id] = event.target.value;
    };

    const handleFocus = (event) => {
      event.target.parentElement.classList.add("focused");
    };

    const handleBlur = (event) => {
      if (!event.target.value) {
        event.target.parentElement.classList.remove("focused");
      }
    };

    return {
      formData,
      isLoading,
      error,
      handleSubmit,
      handleInput,
      handleFocus,
      handleBlur,
      handleKeyDown,
    };
  },
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
.animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out;
}
.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}
.animate-bounce {
  animation: bounce 2s infinite;
}
.animate-shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideInLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideInRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.contact-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}

.phn_mb {
  background-image: url("path-to-your-phone-icon.svg");
}

.eml_mb {
  background-image: url("path-to-your-email-icon.svg");
}

.tg_mb {
  background-image: url("path-to-your-telegram-icon.svg");
}

.focused label {
  transform: translateY(-1.5rem) scale(0.75);
  transform-origin: left top;
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideInLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideInRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
