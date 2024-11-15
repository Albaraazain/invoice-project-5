// src/components/BillReview/components/SolarQuoteCard.js
import { html } from 'lit-html';

export function SolarQuoteCard() {
    return html`
        <div class="mt-3 mb-4 md:mb-6" id="next-steps-card-container">
            <div class="bg-emerald-600 rounded-lg sm:rounded-xl shadow-sm opacity-0" id="next-steps-card">
                <div class="p-4 sm:p-5 md:p-6">
                    <div class="relative z-10 flex flex-col gap-4 sm:gap-5">
                        <!-- Header -->
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 class="text-lg sm:text-xl font-semibold text-white">Ready For Your Solar Quote?</h3>
                        </div>

                        <!-- Content -->
                        <div class="space-y-4">
                            <p class="text-sm sm:text-base text-white/90 leading-relaxed">
                                We've analyzed your consumption patterns and can now provide you with a personalized solar solution. 
                                Find out how much you could save!
                            </p>
                            
                            <!-- Benefits -->
                            <div class="flex flex-wrap gap-2">
                                <div class="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                                    <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span class="text-sm text-white">Personalized Solution</span>
                                </div>
                                <div class="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                                    <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                                    </svg>
                                    <span class="text-sm text-white">Cost Savings</span>
                                </div>
                            </div>
                        </div>

                        <!-- Button -->
                        <button 
                            id="proceed-to-quote" 
                            class="w-full sm:w-auto bg-white hover:bg-white/90 text-emerald-700 px-5 py-2.5 
                                   rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md
                                   flex items-center justify-center gap-2 group mt-2"
                        >
                            <span>Generate My Quote</span>
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Decorative Background -->
                <div class="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl">
                    <div class="absolute top-0 right-0 w-48 h-48 md:w-56 md:h-56 translate-x-1/4 -translate-y-1/4 opacity-10">
                        <svg class="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    `;
}