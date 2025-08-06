// Enhanced Modern Portfolio JavaScript with 2025 Features
// Author: Portfolio Enhancement System
// Version: 2.0.0

'use strict';

// Application Configuration
const CONFIG = {
    animations: {
        typingSpeed: 50,
        scrollThreshold: 0.1,
        transitionDuration: 600,
        easeFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    performance: {
        debounceDelay: 16,
        throttleDelay: 100,
        lazyLoadOffset: 100
    },
    features: {
        enableParticles: true,
        enableAudio: true,
        enableAnalytics: false,
        enablePWA: true
    }
};

// Global State Management
const AppState = {
    currentSlide: 0,
    isTyping: false,
    isPlaying: false,
    isLoading: true,
    activeFilter: 'all',
    scrollPosition: 0,
    isMobile: window.innerWidth < 768,
    preferredReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    theme: 'auto',
    interactions: new Map()
};

// Utility Functions
const Utils = {
    // Debounce function for performance
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Modern random number generator
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Element visibility checker
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Modern element selector with error handling
    $(selector, context = document) {
        try {
            const elements = context.querySelectorAll(selector);
            return elements.length === 1 ? elements[0] : elements;
        } catch (error) {
            console.warn(`Selector "${selector}" not found:`, error);
            return null;
        }
    },

    // Animation frame helper
    requestAnimationFrame(callback) {
        return window.requestAnimationFrame(callback) || 
               window.webkitRequestAnimationFrame(callback) ||
               window.mozRequestAnimationFrame(callback) ||
               setTimeout(callback, 16);
    },

    // Get optimal image format
    getOptimalImageFormat() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Check WebP support
        if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            return 'webp';
        }
        // Check AVIF support
        if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
            return 'avif';
        }
        return 'jpg';
    }
};

// Performance Monitor
const PerformanceMonitor = {
    metrics: {
        loadTime: 0,
        renderTime: 0,
        interactionDelay: 0,
        memoryUsage: 0
    },

    startTiming(name) {
        performance.mark(`${name}-start`);
    },

    endTiming(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        this.metrics[name] = measure.duration;
        return measure.duration;
    },

    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    },

    logMetrics() {
        console.group('🚀 Performance Metrics');
        Object.entries(this.metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value.toFixed(2)}ms`);
        });

        const memory = this.getMemoryUsage();
        if (memory) {
            console.log(`Memory Usage: ${(memory.used / 1048576).toFixed(2)}MB`);
        }
        console.groupEnd();
    }
};

// Enhanced Loading Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = Utils.$('#loading-screen');
        this.progressBar = Utils.$('.loading-progress');
        this.resources = [];
        this.loadedCount = 0;
        this.init();
    }

    init() {
        if (this.loadingScreen) {
            this.showLoading();
            this.preloadCriticalResources();
        }
    }

    showLoading() {
        this.loadingScreen.style.display = 'flex';
        this.animateLoadingElements();
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.style.transition = 'opacity 0.5s ease';
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                AppState.isLoading = false;
                this.onLoadingComplete();
            }, 500);
        }
    }

    animateLoadingElements() {
        const heart = Utils.$('.loading-heart');
        const text = Utils.$('.loading-text');

        if (heart) {
            heart.style.animation = 'heartPulse 1.5s ease-in-out infinite';
        }

        if (text) {
            text.style.animation = 'textGlow 2s ease-in-out infinite alternate';
        }
    }

    preloadCriticalResources() {
        const criticalImages = [
            'images/ladli-profile.jpg',
            'images/photo1.jpg',
            'images/photo2.jpg',
            'images/photo3.jpg'
        ];

        const fonts = [
            'Poppins:300,400,500,600,700',
            'Dancing Script:400,600,700'
        ];

        // Preload images
        criticalImages.forEach(src => this.preloadImage(src));

        // Preload fonts
        fonts.forEach(font => this.preloadFont(font));

        // Set minimum loading time for UX
        setTimeout(() => {
            if (this.loadedCount >= this.resources.length * 0.8) {
                this.hideLoading();
            }
        }, 2000);
    }

    preloadImage(src) {
        this.resources.push(src);
        const img = new Image();
        img.onload = () => this.onResourceLoaded();
        img.onerror = () => this.onResourceLoaded();
        img.src = src;
    }

    preloadFont(fontFamily) {
        if ('fonts' in document) {
            this.resources.push(fontFamily);
            document.fonts.load(`16px ${fontFamily.split(':')[0]}`).then(() => {
                this.onResourceLoaded();
            }).catch(() => {
                this.onResourceLoaded();
            });
        }
    }

    onResourceLoaded() {
        this.loadedCount++;
        const progress = (this.loadedCount / this.resources.length) * 100;

        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }

        if (this.loadedCount >= this.resources.length) {
            setTimeout(() => this.hideLoading(), 500);
        }
    }

    onLoadingComplete() {
        // Initialize app after loading
        App.init();
        PerformanceMonitor.endTiming('loadTime');
    }
}

// Enhanced Love Letter Slider with Modern Features
class EnhancedLoveLetterSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = Utils.$('.letter-slide');
        this.dots = Utils.$('.letter-dot');
        this.prevBtn = Utils.$('.prev-letter');
        this.nextBtn = Utils.$('.next-letter');
        this.container = Utils.$('.letter-slides-container');

        // Control buttons
        this.typewriterToggle = Utils.$('#typewriter-toggle');
        this.readAloudBtn = Utils.$('#read-aloud');
        this.printBtn = Utils.$('#print-letter');
        this.shareBtn = Utils.$('#share-letter');

        // State
        this.isTyping = false;
        this.typewriterSpeed = CONFIG.animations.typingSpeed;
        this.currentTypewriter = null;
        this.speechSynthesis = window.speechSynthesis;

        this.init();
    }

    init() {
        if (!this.slides || this.slides.length === 0) return;

        this.setupEventListeners();
        this.updateSlide();
        this.initializeAccessibility();
        this.enableTouchGestures();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Dot navigation with keyboard support
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });

        // Control buttons
        this.typewriterToggle?.addEventListener('click', () => this.toggleTypewriter());
        this.readAloudBtn?.addEventListener('click', () => this.readAloud());
        this.printBtn?.addEventListener('click', () => this.printLetter());
        this.shareBtn?.addEventListener('click', () => this.shareLetter());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Auto-advance (optional)
        if (CONFIG.features.autoAdvance) {
            this.startAutoAdvance();
        }
    }

    handleKeyboard(e) {
        if (!this.isInViewport()) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleTypewriter();
                break;
            case 'Enter':
                if (e.target.classList.contains('letter-dot')) {
                    e.preventDefault();
                }
                break;
        }
    }

    enableTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.container?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.container?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: true });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlide('left');
        this.trackInteraction('slide_previous');
    }

    nextSlide() {
        this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.updateSlide('right');
        this.trackInteraction('slide_next');
    }

    goToSlide(index) {
        if (index !== this.currentSlide && index >= 0 && index < this.slides.length) {
            const direction = index > this.currentSlide ? 'right' : 'left';
            this.currentSlide = index;
            this.updateSlide(direction);
            this.trackInteraction('slide_direct', { targetSlide: index });
        }
    }

    updateSlide(direction = 'right') {
        if (!this.slides || this.slides.length === 0) return;

        PerformanceMonitor.startTiming('slideTransition');

        // Update slides with improved animations
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            slide.setAttribute('aria-hidden', 'true');

            if (index === this.currentSlide) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
                slide.style.transform = 'translateX(0) scale(1)';
                slide.style.opacity = '1';
            } else if (index < this.currentSlide) {
                slide.classList.add('prev');
                slide.style.transform = 'translateX(-100px) scale(0.9)';
                slide.style.opacity = '0';
            } else {
                slide.classList.add('next');
                slide.style.transform = 'translateX(100px) scale(0.9)';
                slide.style.opacity = '0';
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
            dot.setAttribute('aria-selected', index === this.currentSlide);
        });

        // Update navigation buttons
        this.updateNavigationButtons();

        // Reset typewriter for new slide
        this.stopTypewriter();
        this.initializeTypewriter();

        // Create slide change effects
        this.createSlideChangeEffect();

        PerformanceMonitor.endTiming('slideTransition');
    }

    updateNavigationButtons() {
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.disabled = false;
            this.nextBtn.disabled = false;

            // Optional: disable buttons at ends for non-infinite slider
            // this.prevBtn.disabled = this.currentSlide === 0;
            // this.nextBtn.disabled = this.currentSlide === this.slides.length - 1;
        }
    }

    initializeTypewriter() {
        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');

        if (typewriterElement) {
            if (!typewriterElement.dataset.originalContent) {
                typewriterElement.dataset.originalContent = typewriterElement.innerHTML;
            }
            typewriterElement.innerHTML = typewriterElement.dataset.originalContent;
            typewriterElement.classList.remove('typing');
        }
    }

    toggleTypewriter() {
        if (this.isTyping) {
            this.stopTypewriter();
        } else {
            this.startTypewriter();
        }
    }

    startTypewriter() {
        if (this.isTyping) return;

        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');

        if (!typewriterElement) return;

        this.isTyping = true;
        this.updateTypewriterButton('stop');

        const originalContent = typewriterElement.dataset.originalContent;
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalContent, 'text/html');
        const textContent = doc.body.textContent || doc.body.innerText || '';

        typewriterElement.innerHTML = '';
        typewriterElement.classList.add('typing');

        this.typeText(typewriterElement, textContent, 0);
        this.trackInteraction('typewriter_start');
    }

    typeText(element, text, index) {
        if (index < text.length && this.isTyping) {
            element.textContent += text.charAt(index);

            const delay = this.typewriterSpeed + Utils.randomBetween(-10, 10);
            this.currentTypewriter = setTimeout(() => {
                this.typeText(element, text, index + 1);
            }, delay);
        } else {
            this.completeTypewriter();
        }
    }

    stopTypewriter() {
        this.isTyping = false;
        if (this.currentTypewriter) {
            clearTimeout(this.currentTypewriter);
            this.currentTypewriter = null;
        }

        this.updateTypewriterButton('start');

        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');

        if (typewriterElement) {
            typewriterElement.classList.remove('typing');
            typewriterElement.innerHTML = typewriterElement.dataset.originalContent;
        }
    }

    completeTypewriter() {
        this.isTyping = false;
        if (this.currentTypewriter) {
            clearTimeout(this.currentTypewriter);
            this.currentTypewriter = null;
        }

        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');

        if (typewriterElement) {
            typewriterElement.classList.remove('typing');
            typewriterElement.innerHTML = typewriterElement.dataset.originalContent;
            this.createCompletionEffect();
        }

        this.updateTypewriterButton('start');
        this.trackInteraction('typewriter_complete');
    }

    updateTypewriterButton(state) {
        if (!this.typewriterToggle) return;

        const icon = this.typewriterToggle.querySelector('.control-icon');
        const text = this.typewriterToggle.querySelector('.control-text');

        if (state === 'stop') {
            icon.textContent = '⏹️';
            text.textContent = 'Stop Typing';
            this.typewriterToggle.classList.add('active');
        } else {
            icon.textContent = '⌨️';
            text.textContent = 'Start Typing';
            this.typewriterToggle.classList.remove('active');
        }
    }

    readAloud() {
        if (!this.speechSynthesis) {
            this.showNotification('Speech synthesis not supported in this browser');
            return;
        }

        // Stop current speech
        this.speechSynthesis.cancel();

        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');

        if (typewriterElement) {
            const text = typewriterElement.textContent || typewriterElement.innerText;
            const utterance = new SpeechSynthesisUtterance(text);

            // Configure speech settings
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            utterance.lang = 'en-US';

            utterance.onstart = () => this.updateReadAloudButton('stop');
            utterance.onend = () => this.updateReadAloudButton('start');
            utterance.onerror = () => {
                this.updateReadAloudButton('start');
                this.showNotification('Error occurred during speech synthesis');
            };

            this.speechSynthesis.speak(utterance);
            this.trackInteraction('read_aloud_start');
        }
    }

    updateReadAloudButton(state) {
        if (!this.readAloudBtn) return;

        const icon = this.readAloudBtn.querySelector('.control-icon');
        const text = this.readAloudBtn.querySelector('.control-text');

        if (state === 'stop') {
            icon.textContent = '🔇';
            text.textContent = 'Stop Reading';
            this.readAloudBtn.classList.add('active');
        } else {
            icon.textContent = '🔊';
            text.textContent = 'Read Aloud';
            this.readAloudBtn.classList.remove('active');
        }
    }

    printLetter() {
        const currentSlideElement = this.slides[this.currentSlide];
        const letterContent = currentSlideElement?.querySelector('.letter-paper')?.cloneNode(true);

        if (!letterContent) return;

        // Remove decorations for print
        const decorations = letterContent.querySelector('.letter-decorations');
        if (decorations) decorations.remove();

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            this.showNotification('Please allow popups to print the letter');
            return;
        }

        const printHTML = this.generatePrintHTML(letterContent);
        printWindow.document.write(printHTML);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        };

        this.trackInteraction('print_letter');
    }

    generatePrintHTML(content) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Love Letter - Print</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');

                    body {
                        font-family: 'Poppins', serif;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px 20px;
                        background: white;
                        color: #333;
                        line-height: 1.6;
                    }
                    .letter-header {
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #ff6b9d;
                    }
                    .date {
                        font-size: 1rem;
                        color: #ff6b9d;
                        font-weight: 600;
                        margin-bottom: 10px;
                    }
                    .address {
                        font-family: 'Dancing Script', cursive;
                        font-size: 1.6rem;
                        color: #845ec2;
                        font-weight: 700;
                    }
                    .greeting {
                        font-family: 'Dancing Script', cursive;
                        font-size: 1.8rem;
                        color: #ff6b9d;
                        font-weight: 700;
                        margin-bottom: 20px;
                    }
                    .signature {
                        font-family: 'Dancing Script', cursive;
                        font-size: 1.4rem;
                        color: #845ec2;
                        font-weight: 600;
                        text-align: right;
                        margin-top: 30px;
                        font-style: italic;
                    }
                    p {
                        margin-bottom: 15px;
                    }
                    @media print {
                        body { margin: 0; padding: 20px; }
                        .letter-header { border-bottom-color: #ccc; }
                    }
                </style>
            </head>
            <body>
                ${content.outerHTML}
            </body>
            </html>
        `;
    }

    async shareLetter() {
        const currentSlideElement = this.slides[this.currentSlide];
        const typewriterElement = currentSlideElement?.querySelector('.typewriter-text');
        const letterTitle = currentSlideElement?.querySelector('.address')?.textContent || 'Love Letter';

        if (!typewriterElement) return;

        const text = typewriterElement.textContent || typewriterElement.innerText;
        const shareData = {
            title: letterTitle,
            text: text.substring(0, 200) + '...',
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                this.trackInteraction('share_native');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${letterTitle}\n\n${text}\n\n${window.location.href}`);
                this.showNotification('Love letter copied to clipboard! 💕');
                this.trackInteraction('share_clipboard');
            }
        } catch (error) {
            console.warn('Sharing failed:', error);
            this.showNotification('Sharing not supported in this browser');
        }
    }

    createSlideChangeEffect() {
        if (AppState.preferredReducedMotion) return;

        const heartsContainer = Utils.$('.love-letters-section');
        if (!heartsContainer) return;

        const hearts = ['💖', '💕', '💘', '💝', '❤️'];

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.className = 'slide-effect-heart';
                heart.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    font-size: ${Utils.randomBetween(1.5, 2.5)}rem;
                    pointer-events: none;
                    z-index: 1000;
                    animation: heartFloat 2s ease-out forwards;
                    opacity: 0.8;
                `;

                heartsContainer.appendChild(heart);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 2000);
            }, i * 100);
        }
    }

    createCompletionEffect() {
        if (AppState.preferredReducedMotion) return;

        const currentSlideElement = this.slides[this.currentSlide];
        const envelope = currentSlideElement?.querySelector('.letter-envelope');

        if (envelope) {
            const sparkles = ['✨', '⭐', '💫', '🌟'];

            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                    sparkle.className = 'completion-sparkle';
                    sparkle.style.cssText = `
                        position: absolute;
                        left: ${Math.random() * 100}%;
                        top: ${Math.random() * 100}%;
                        font-size: 1.5rem;
                        pointer-events: none;
                        z-index: 1000;
                        animation: sparkleEffect 1.5s ease-out forwards;
                    `;

                    envelope.appendChild(sparkle);

                    setTimeout(() => {
                        if (sparkle.parentNode) {
                            sparkle.parentNode.removeChild(sparkle);
                        }
                    }, 1500);
                }, i * 100);
            }
        }
    }

    initializeAccessibility() {
        // Set ARIA attributes
        if (this.container) {
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-label', 'Love Letter Slider');
        }

        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-labelledby', `dot-${index}`);
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
        });

        this.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab');
            dot.setAttribute('id', `dot-${index}`);
            dot.setAttribute('aria-controls', `slide-${index}`);
            dot.setAttribute('aria-selected', index === this.currentSlide);
        });
    }

    isInViewport() {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    trackInteraction(action, data = {}) {
        if (CONFIG.features.enableAnalytics) {
            AppState.interactions.set(Date.now(), {
                action,
                slide: this.currentSlide,
                timestamp: new Date().toISOString(),
                ...data
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b9d, #845ec2);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        `;

        document.body.appendChild(notification);

        // Animate in
        Utils.requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    destroy() {
        // Cleanup
        if (this.currentTypewriter) {
            clearTimeout(this.currentTypewriter);
        }

        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboard);
    }
}

// Enhanced Gallery with Modern Features
class EnhancedGallery {
    constructor() {
        this.gallery = Utils.$('.modern-gallery');
        this.filterButtons = Utils.$('.filter-btn');
        this.galleryCards = Utils.$('.gallery-card');
        this.currentFilter = 'all';
        this.observer = null;

        this.init();
    }

    init() {
        if (!this.gallery) return;

        this.setupFilters();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.initializeIntersectionObserver();
    }

    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterGallery(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }

    filterGallery(filter) {
        this.currentFilter = filter;

        this.galleryCards.forEach(card => {
            const shouldShow = filter === 'all' || card.dataset.category === filter;

            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    setupLazyLoading() {
        const images = this.gallery.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            img.addEventListener('error', () => {
                img.classList.add('error');
                // Fallback image
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" fill="%23999" text-anchor="middle" dy=".3em">Image not available</text></svg>';
            });
        });
    }

    setupImageOptimization() {
        const format = Utils.getOptimalImageFormat();

        this.galleryCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                const originalSrc = img.src;
                const optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);

                // Test if optimized image exists
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = optimizedSrc;
                };
                testImg.onerror = () => {
                    // Keep original format
                    console.log('Optimized format not available, using original');
                };
                testImg.src = optimizedSrc;
            }
        });
    }

    initializeIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            this.galleryCards.forEach(card => {
                card.classList.add('animate-on-scroll');
                this.observer.observe(card);
            });
        }
    }
}

// Enhanced Skills Section with Animations
class EnhancedSkills {
    constructor() {
        this.skillCards = Utils.$('.skill-card');
        this.skillBars = Utils.$('.skill-progress');
        this.observer = null;

        this.init();
    }

    init() {
        if (!this.skillCards || this.skillCards.length === 0) return;

        this.setupIntersectionObserver();
        this.animateSkillBars();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkillCard(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.3
            });

            this.skillCards.forEach(card => {
                this.observer.observe(card);
            });
        }
    }

    animateSkillCard(card) {
        card.classList.add('visible');

        const progressBar = card.querySelector('.skill-progress');
        if (progressBar) {
            const level = progressBar.dataset.level || 100;

            setTimeout(() => {
                progressBar.style.width = `${level}%`;
            }, 200);
        }
    }

    animateSkillBars() {
        this.skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
}

// Enhanced Audio Manager
class EnhancedAudioManager {
    constructor() {
        this.audioElement = Utils.$('#background-music');
        this.toggleButton = Utils.$('#music-toggle');
        this.isPlaying = false;
        this.volume = 0.3;
        this.fadeInterval = null;

        this.init();
    }

    init() {
        if (!this.audioElement || !this.toggleButton) return;

        this.setupEventListeners();
        this.setupAudioContext();
        this.preloadAudio();
    }

    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => this.toggleMusic());

        // Audio events
        this.audioElement.addEventListener('loadstart', () => this.onLoadStart());
        this.audioElement.addEventListener('canplaythrough', () => this.onCanPlayThrough());
        this.audioElement.addEventListener('error', (e) => this.onError(e));
        this.audioElement.addEventListener('ended', () => this.onEnded());

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.pauseMusic();
            }
        });
    }

    setupAudioContext() {
        // Create audio context for better control
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.gainNode = this.audioContext.createGain();
                this.source = this.audioContext.createMediaElementSource(this.audioElement);
                this.source.connect(this.gainNode);
                this.gainNode.connect(this.audioContext.destination);

                this.gainNode.gain.value = this.volume;
            } catch (error) {
                console.warn('Audio context setup failed:', error);
            }
        }
    }

    preloadAudio() {
        // Preload audio on user interaction
        const preloadAudio = () => {
            this.audioElement.load();
            document.removeEventListener('click', preloadAudio);
            document.removeEventListener('touchstart', preloadAudio);
        };

        document.addEventListener('click', preloadAudio);
        document.addEventListener('touchstart', preloadAudio);
    }

    async toggleMusic() {
        try {
            if (this.isPlaying) {
                await this.pauseMusic();
            } else {
                await this.playMusic();
            }
        } catch (error) {
            console.warn('Audio toggle failed:', error);
            this.showAudioError();
        }
    }

    async playMusic() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        await this.audioElement.play();
        this.isPlaying = true;
        this.fadeIn();
        this.updateButton('playing');
    }

    async pauseMusic() {
        this.fadeOut(() => {
            this.audioElement.pause();
            this.isPlaying = false;
            this.updateButton('paused');
        });
    }

    fadeIn() {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 1);
        } else {
            this.audioElement.volume = 0;
            this.fadeInterval = setInterval(() => {
                if (this.audioElement.volume < this.volume) {
                    this.audioElement.volume = Math.min(this.audioElement.volume + 0.05, this.volume);
                } else {
                    clearInterval(this.fadeInterval);
                }
            }, 50);
        }
    }

    fadeOut(callback) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            setTimeout(callback, 500);
        } else {
            this.fadeInterval = setInterval(() => {
                if (this.audioElement.volume > 0) {
                    this.audioElement.volume = Math.max(this.audioElement.volume - 0.1, 0);
                } else {
                    clearInterval(this.fadeInterval);
                    callback();
                }
            }, 50);
        }
    }

    updateButton(state) {
        const icon = this.toggleButton.querySelector('.music-icon');
        const text = this.toggleButton.querySelector('.music-text');

        if (state === 'playing') {
            icon.textContent = '🔊';
            text.textContent = 'Pause Music';
            this.toggleButton.classList.add('playing');
        } else {
            icon.textContent = '🎵';
            text.textContent = 'Play Music';
            this.toggleButton.classList.remove('playing');
        }
    }

    onLoadStart() {
        console.log('Audio loading started');
    }

    onCanPlayThrough() {
        console.log('Audio can play through');
    }

    onError(error) {
        console.error('Audio error:', error);
        this.showAudioError();
    }

    onEnded() {
        this.isPlaying = false;
        this.updateButton('paused');
    }

    showAudioError() {
        const notification = document.createElement('div');
        notification.textContent = 'Audio playback not available';
        notification.className = 'audio-error-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff6b9d;
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 10000;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Enhanced Particle System
class EnhancedParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isActive = CONFIG.features.enableParticles && !AppState.preferredReducedMotion;

        if (this.isActive) {
            this.init();
        }
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.startAnimation();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    setupEventListeners() {
        window.addEventListener('resize', Utils.debounce(() => this.resizeCanvas(), 250));

        // Mouse interaction
        document.addEventListener('mousemove', Utils.throttle((e) => {
            this.createParticleAt(e.clientX, e.clientY);
        }, 100));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x = null, y = null) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: Utils.randomBetween(-1, 1),
            vy: Utils.randomBetween(-1, 1),
            size: Utils.randomBetween(2, 6),
            opacity: Utils.randomBetween(0.3, 0.8),
            life: 1,
            decay: Utils.randomBetween(0.005, 0.02),
            color: this.getRandomColor()
        };
    }

    createParticleAt(x, y) {
        if (this.particles.length < 50) {
            this.particles.push(this.createParticle(x, y));
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 107, 157, ',
            'rgba(132, 94, 194, ',
            'rgba(179, 155, 200, ',
            'rgba(255, 234, 167, ',
            'rgba(116, 185, 255, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Update life
            particle.life -= particle.decay;
            particle.opacity = particle.life;

            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            return particle.life > 0;
        });

        // Add new particles occasionally
        if (this.particles.length < 20 && Math.random() < 0.02) {
            this.particles.push(this.createParticle());
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = Utils.requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Enhanced Scroll Manager
class EnhancedScrollManager {
    constructor() {
        this.scrollElements = Utils.$('.animate-on-scroll');
        this.scrollToTopBtn = Utils.$('#scroll-to-top');
        this.observer = null;
        this.currentSection = 'home';

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollToTop();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -50px 0px',
                threshold: CONFIG.animations.scrollThreshold
            });

            this.scrollElements.forEach(el => {
                if (el) this.observer.observe(el);
            });
        }
    }

    setupScrollToTop() {
        if (!this.scrollToTopBtn) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 300) {
                this.scrollToTopBtn.classList.add('visible');
            } else {
                this.scrollToTopBtn.classList.remove('visible');
            }
        }, CONFIG.performance.throttleDelay));

        this.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupSmoothScrolling() {
        const navLinks = Utils.$('.nav-link[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = Utils.$(`#${targetId}`);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupActiveNavigation() {
        const sections = Utils.$('section[id]');
        const navLinks = Utils.$('.nav-link[data-section]');

        if ('IntersectionObserver' in window) {
            const navObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.updateActiveNavigation(entry.target.id);
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0
            });

            sections.forEach(section => {
                if (section) navObserver.observe(section);
            });
        }
    }

    updateActiveNavigation(activeSection) {
        const navLinks = Utils.$('.nav-link[data-section]');

        navLinks.forEach(link => {
            const section = link.dataset.section;
            link.classList.toggle('active', section === activeSection);
        });

        this.currentSection = activeSection;
    }
}

// Enhanced Statistics Counter
class EnhancedStatsCounter {
    constructor() {
        this.statElements = Utils.$('.stat-number');
        this.hasAnimated = false;

        this.init();
    }

    init() {
        if (!this.statElements || this.statElements.length === 0) return;

        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateStats();
                        this.hasAnimated = true;
                        observer.disconnect();
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(Utils.$('.hero-stats'));
        }
    }

    animateStats() {
        this.statElements.forEach((stat, index) => {
            const targetValue = stat.dataset.count;

            if (targetValue === '∞') {
                this.animateInfinitySymbol(stat);
            } else {
                this.animateNumber(stat, parseInt(targetValue), index * 200);
            }
        });
    }

    animateNumber(element, target, delay) {
        setTimeout(() => {
            let current = 0;
            const increment = target / 60; // 1 second animation at 60fps
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString();
            }, 16);
        }, delay);
    }

    animateInfinitySymbol(element) {
        setTimeout(() => {
            element.textContent = '∞';
            element.style.animation = 'infinityGlow 2s ease-in-out infinite alternate';
        }, 400);
    }
}

// Main Application Class
class App {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        console.log('🚀 Initializing Enhanced Portfolio App...');
        PerformanceMonitor.startTiming('appInit');

        try {
            // Initialize core components
            await this.initializeComponents();

            // Setup global event listeners
            this.setupGlobalEvents();

            // Initialize PWA features
            this.initializePWA();

            // Setup error handling
            this.setupErrorHandling();

            this.isInitialized = true;
            console.log('✅ App initialized successfully!');

            PerformanceMonitor.endTiming('appInit');
            PerformanceMonitor.logMetrics();

        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }

    async initializeComponents() {
        // Initialize components in order
        const componentClasses = [
            { name: 'loveLetterSlider', class: EnhancedLoveLetterSlider },
            { name: 'gallery', class: EnhancedGallery },
            { name: 'skills', class: EnhancedSkills },
            { name: 'audioManager', class: EnhancedAudioManager },
            { name: 'scrollManager', class: EnhancedScrollManager },
            { name: 'statsCounter', class: EnhancedStatsCounter }
        ];

        for (const { name, class: ComponentClass } of componentClasses) {
            try {
                this.components.set(name, new ComponentClass());
                console.log(`✅ ${name} initialized`);
            } catch (error) {
                console.warn(`⚠️ ${name} initialization failed:`, error);
            }
        }

        // Initialize particle system if enabled
        if (CONFIG.features.enableParticles && !AppState.preferredReducedMotion) {
            this.components.set('particleSystem', new EnhancedParticleSystem());
        }
    }

    setupGlobalEvents() {
        // Resize handler
        window.addEventListener('resize', Utils.debounce(() => {
            AppState.isMobile = window.innerWidth < 768;
            this.handleResize();
        }, 250));

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Magic surprise button
        const magicBtn = Utils.$('#magic-surprise');
        if (magicBtn) {
            magicBtn.addEventListener('click', () => this.createMagicalSurprise());
        }
    }

    handleResize() {
        // Notify components of resize
        this.components.forEach(component => {
            if (typeof component.onResize === 'function') {
                component.onResize();
            }
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            this.pauseAnimations();
        } else {
            // Resume animations when tab becomes visible
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        const particleSystem = this.components.get('particleSystem');
        if (particleSystem) {
            particleSystem.stopAnimation();
        }
    }

    resumeAnimations() {
        const particleSystem = this.components.get('particleSystem');
        if (particleSystem && CONFIG.features.enableParticles) {
            particleSystem.startAnimation();
        }
    }

    createMagicalSurprise() {
        // Create magical surprise effect
        const surprises = [
            () => this.createHeartExplosion(),
            () => this.createRainbowEffect(),
            () => this.createStarShower(),
            () => this.showLoveMessage()
        ];

        const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
        randomSurprise();
    }

    createHeartExplosion() {
        const hearts = ['💖', '💕', '💘', '💝', '❤️', '💗', '💓', '💞'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.className = 'magical-heart';
                heart.style.cssText = `
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    font-size: ${Utils.randomBetween(2, 4)}rem;
                    pointer-events: none;
                    z-index: 10000;
                    transform: translate(-50%, -50%);
                    animation: heartExplosion ${Utils.randomBetween(2, 4)}s ease-out forwards;
                `;

                const angle = (Math.PI * 2 * i) / 20;
                const distance = Utils.randomBetween(200, 400);
                heart.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
                heart.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');

                document.body.appendChild(heart);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 4000);
            }, i * 50);
        }

        this.addMagicalAnimations();
    }

    showLoveMessage() {
        const messages = [
            "You are my sunshine ☀️",
            "Forever and always 💍",
            "You make life beautiful 🌸",
            "My heart belongs to you 💖",
            "Together is my favorite place 🏠",
            "You are my happy ending 📖"
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = 'magical-message';
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-family: 'Dancing Script', cursive;
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b9d, #845ec2, #74b9ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            z-index: 10000;
            animation: magicalMessageAppear 3s ease-in-out forwards;
            text-align: center;
            white-space: nowrap;
        `;

        document.body.appendChild(messageElement);

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    addMagicalAnimations() {
        if (document.getElementById('magical-animations')) return;

        const style = document.createElement('style');
        style.id = 'magical-animations';
        style.textContent = `
            @keyframes heartExplosion {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0) rotate(0deg);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2) rotate(90deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.5) rotate(360deg);
                }
            }

            @keyframes magicalMessageAppear {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0) rotateY(-90deg);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.1) rotateY(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1) rotateY(90deg);
                }
            }

            @keyframes infinityGlow {
                0% {
                    text-shadow: 0 0 10px #ff6b9d, 0 0 20px #ff6b9d;
                }
                100% {
                    text-shadow: 0 0 20px #845ec2, 0 0 40px #845ec2;
                }
            }

            @keyframes heartPulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2);
                }
            }

            @keyframes textGlow {
                0% {
                    text-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
                }
                100% {
                    text-shadow: 0 0 20px rgba(132, 94, 194, 0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }

    initializePWA() {
        if (!CONFIG.features.enablePWA) return;

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Show install button
            this.showInstallPrompt(deferredPrompt);
        });
    }

    showInstallPrompt(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 Install App';
        installBtn.className = 'install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(45deg, #ff6b9d, #845ec2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
            transition: transform 0.3s ease;
        `;

        installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice: ${outcome}`);
            installBtn.remove();
            deferredPrompt = null;
        });

        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'translateY(-2px)';
        });

        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'translateY(0)';
        });

        document.body.appendChild(installBtn);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.remove();
            }
        }, 10000);
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        // Log error for debugging
        console.error('App error:', error);

        // Show user-friendly error message
        const errorNotification = document.createElement('div');
        errorNotification.textContent = 'Something went wrong, but love conquers all! 💖';
        errorNotification.className = 'error-notification';
        errorNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b9d, #845ec2);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(errorNotification);

        setTimeout(() => {
            if (errorNotification.parentNode) {
                errorNotification.remove();
            }
        }, 5000);
    }

    cleanup() {
        // Cleanup all components
        this.components.forEach(component => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });

        // Clear any remaining timers
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        console.log('🧹 App cleanup completed');
    }

    // Public API methods
    getComponent(name) {
        return this.components.get(name);
    }

    updateConfig(newConfig) {
        Object.assign(CONFIG, newConfig);
    }

    getMetrics() {
        return {
            performance: PerformanceMonitor.metrics,
            interactions: Array.from(AppState.interactions.entries()),
            state: AppState
        };
    }
}

// Initialize the application
const loadingManager = new LoadingManager();

// Global app instance
window.PortfolioApp = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Loading manager will initialize the app when ready
    });
} else {
    // DOM is already ready
    if (!AppState.isLoading) {
        window.PortfolioApp.init();
    }
}

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, CONFIG, Utils, PerformanceMonitor };
}

console.log('💖 Enhanced Portfolio JavaScript Loaded - Ready for Magic! ✨');