// App.js - Romantic Birthday Website for Amisha
class RomanticBirthdayApp {
    constructor() {
        this.currentLetter = 0;
        this.isTyping = false;
        this.heartClicked = false;
        this.audioContext = null;
        this.backgroundMusic = null;
        this.isAudioPlaying = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createFloatingHearts();
        this.animateStatistics();
        this.animateSkillBars();
        this.setupIntersectionObserver();
        this.initializeLetters();
        
        // Initialize first letter
        setTimeout(() => {
            this.startTypewriterEffect(0);
        }, 1000);
    }

    initializeLetters() {
        // Ensure only the first letter is visible initially
        const allLetters = document.querySelectorAll('.letter-content');
        allLetters.forEach((letter, index) => {
            if (index === 0) {
                letter.classList.add('active');
                letter.style.display = 'block';
                letter.style.opacity = '1';
                letter.style.transform = 'translateX(0)';
            } else {
                letter.classList.remove('active');
                letter.style.display = 'none';
                letter.style.opacity = '0';
                letter.style.transform = 'translateX(100px)';
            }
        });

        // Ensure first nav dot is active
        const allDots = document.querySelectorAll('.nav-dot');
        allDots.forEach((dot, index) => {
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Letter navigation
        const navDots = document.querySelectorAll('.nav-dot');
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.switchLetter(index));
        });

        // Letter controls
        const startTypingBtn = document.getElementById('start-typing');
        const readAloudBtn = document.getElementById('read-aloud');
        const shareLetterBtn = document.getElementById('share-letter');

        if (startTypingBtn) {
            startTypingBtn.addEventListener('click', () => this.startTypewriterEffect(this.currentLetter));
        }

        if (readAloudBtn) {
            readAloudBtn.addEventListener('click', () => this.readAloud());
        }

        if (shareLetterBtn) {
            shareLetterBtn.addEventListener('click', () => this.shareLetter());
        }

        // Gallery filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterGallery(e.target.dataset.filter));
        });

        // Heart button (proposal)
        const heartButton = document.getElementById('heart-button');
        if (heartButton) {
            heartButton.addEventListener('click', () => this.handleProposal());
        }

        // Share moment button
        const shareMomentBtn = document.getElementById('share-moment');
        if (shareMomentBtn) {
            shareMomentBtn.addEventListener('click', () => this.shareMoment());
        }

        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }

        // Smooth scrolling for navigation
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('onclick') && e.target.getAttribute('onclick').includes('scrollToSection')) {
                e.preventDefault();
                const sectionId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.scrollToSection(sectionId);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Floating Hearts Animation
    createFloatingHearts() {
        const heartsContainer = document.getElementById('floating-hearts');
        if (!heartsContainer) return;

        const hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💌', '🌹', '✨', '💫'];
        
        setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            heart.style.opacity = Math.random() * 0.7 + 0.3;
            
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 6000);
        }, 800);
    }

    // Statistics Animation
    animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Skill Progress Bars Animation
    animateSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar[data-progress]');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.dataset.progress;
                bar.style.width = progress + '%';
            }, index * 200);
        });
    }

    // Letter Management - Fixed version
    switchLetter(index) {
        if (index === this.currentLetter || this.isTyping) return;

        const currentLetterEl = document.querySelector(`.letter-content[data-letter="${this.currentLetter}"]`);
        const newLetterEl = document.querySelector(`.letter-content[data-letter="${index}"]`);
        const currentDot = document.querySelector(`.nav-dot[data-letter="${this.currentLetter}"]`);
        const newDot = document.querySelector(`.nav-dot[data-letter="${index}"]`);

        // Hide current letter with animation
        if (currentLetterEl) {
            currentLetterEl.classList.remove('active');
            currentLetterEl.style.opacity = '0';
            currentLetterEl.style.transform = 'translateX(-100px)';
            
            setTimeout(() => {
                currentLetterEl.style.display = 'none';
            }, 300);
        }

        // Show new letter with animation
        if (newLetterEl) {
            newLetterEl.style.display = 'block';
            newLetterEl.style.opacity = '0';
            newLetterEl.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                newLetterEl.classList.add('active');
                newLetterEl.style.opacity = '1';
                newLetterEl.style.transform = 'translateX(0)';
            }, 50);
        }

        // Update navigation dots
        if (currentDot) currentDot.classList.remove('active');
        if (newDot) newDot.classList.add('active');

        this.currentLetter = index;
        
        // Auto-start typewriter effect for new letter
        setTimeout(() => {
            this.startTypewriterEffect(index);
        }, 400);
    }

    startTypewriterEffect(letterIndex) {
        if (this.isTyping) return;

        const letterText = document.getElementById(`letter-text-${letterIndex}`);
        if (!letterText) return;

        this.isTyping = true;
        const originalHTML = letterText.innerHTML;
        const paragraphs = letterText.querySelectorAll('p');
        
        // Clear all paragraphs
        paragraphs.forEach(p => p.style.opacity = '0');
        
        // Show paragraphs one by one with typewriter effect
        let paragraphIndex = 0;
        const showNextParagraph = () => {
            if (paragraphIndex < paragraphs.length) {
                const currentP = paragraphs[paragraphIndex];
                const text = currentP.textContent;
                currentP.textContent = '';
                currentP.style.opacity = '1';
                
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        currentP.textContent += text.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        paragraphIndex++;
                        setTimeout(showNextParagraph, 200);
                    }
                }, 30);
            } else {
                this.isTyping = false;
            }
        };
        
        showNextParagraph();
    }

    readAloud() {
        if ('speechSynthesis' in window) {
            const currentLetterText = document.getElementById(`letter-text-${this.currentLetter}`);
            if (currentLetterText) {
                const text = currentLetterText.textContent;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1.1;
                speechSynthesis.speak(utterance);
                
                // Visual feedback
                const btn = document.getElementById('read-aloud');
                btn.textContent = 'Reading...';
                btn.disabled = true;
                
                utterance.onend = () => {
                    btn.textContent = 'Read Aloud';
                    btn.disabled = false;
                };
            }
        } else {
            alert('Speech synthesis not supported in your browser.');
        }
    }

    shareLetter() {
        const currentLetterEl = document.querySelector(`.letter-content[data-letter="${this.currentLetter}"]`);
        if (!currentLetterEl) return;
        
        const title = currentLetterEl.querySelector('h3').textContent;
        const text = `Check out this beautiful love letter: "${title}" from a romantic birthday website! 💕`;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `Love Letter: ${title}`,
                text: text,
                url: url
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                this.showNotification('Letter link copied to clipboard! 💕');
            });
        }
    }

    // Gallery Management
    filterGallery(filter) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Filter items
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 100);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Proposal Handler
    handleProposal() {
        if (this.heartClicked) return;
        
        this.heartClicked = true;
        const heartButton = document.getElementById('heart-button');
        const proposalResponse = document.getElementById('proposal-response');
        
        // Animate heart button
        heartButton.style.transform = 'scale(1.2)';
        heartButton.style.background = 'linear-gradient(135deg, #ff6b9d, #ffd700)';
        
        setTimeout(() => {
            heartButton.style.transform = 'scale(1)';
        }, 200);
        
        // Show response
        setTimeout(() => {
            proposalResponse.classList.remove('hidden');
            proposalResponse.classList.add('fade-in');
        }, 500);
        
        // Create celebration effects
        this.createConfetti();
        this.createHeartExplosion();
        
        // Play celebration sound (if audio is enabled)
        this.playCelebrationSound();
    }

    createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        const colors = ['#ff6b9d', '#845ec2', '#74b9ff', '#ffeaa7', '#ffd700'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 20);
        }
    }

    createHeartExplosion() {
        const heartButton = document.getElementById('heart-button');
        const rect = heartButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const hearts = ['💖', '💕', '💗', '💓', '💝'];
        
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.fontSize = '2rem';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1001';
            heart.style.transition = 'all 2s ease-out';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                const angle = (i / 12) * 2 * Math.PI;
                const distance = 200;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                heart.style.transform = `translate(${x}px, ${y}px) scale(0.5)`;
                heart.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2100);
        }
    }

    playCelebrationSound() {
        // Simple celebration sound using Web Audio API
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return; // Audio not supported
            }
        }
        
        // Create a simple celebration tone
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(523.25 + (i * 130), this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }, i * 200);
        }
    }

    shareMoment() {
        const text = "She said YES! 💖 Check out this beautiful romantic birthday website! 🎉";
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: "Our Special Moment 💕",
                text: text,
                url: url
            });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                this.showNotification('Moment shared! Link copied to clipboard! 🎉');
            });
        }
    }

    // Audio Management
    toggleAudio() {
        const audioToggle = document.getElementById('audio-toggle');
        
        if (this.isAudioPlaying) {
            this.stopBackgroundMusic();
            audioToggle.textContent = '🎵';
            audioToggle.style.opacity = '0.7';
        } else {
            this.playBackgroundMusic();
            audioToggle.textContent = '🔇';
            audioToggle.style.opacity = '1';
        }
    }

    playBackgroundMusic() {
        // Create a simple ambient background tone
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }
        
        this.isAudioPlaying = true;
        this.createAmbientTone();
    }

    createAmbientTone() {
        if (!this.isAudioPlaying) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 4);
        oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 8);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 1);
        gainNode.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 7);
        gainNode.gain.exponentialRampToValueAtTime(0, this.audioContext.currentTime + 8);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 8);
        
        setTimeout(() => {
            if (this.isAudioPlaying) {
                this.createAmbientTone();
            }
        }, 8000);
    }

    stopBackgroundMusic() {
        this.isAudioPlaying = false;
    }

    // Utility Functions
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
                if (this.currentLetter > 0) {
                    this.switchLetter(this.currentLetter - 1);
                }
                break;
            case 'ArrowRight':
                if (this.currentLetter < 3) {
                    this.switchLetter(this.currentLetter + 1);
                }
                break;
            case 'Enter':
                if (document.activeElement.id === 'heart-button') {
                    this.handleProposal();
                }
                break;
            case 'Escape':
                // Close any modals or overlays
                break;
        }
    }

    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b9d, #845ec2);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1002;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    
                    // Trigger animations based on section
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Global Functions (for inline event handlers)
window.scrollToSection = function(sectionId) {
    if (window.app) {
        window.app.scrollToSection(sectionId);
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RomanticBirthdayApp();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production environment
        console.log('Service Worker support detected');
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        if (window.app && window.app.isAudioPlaying) {
            window.app.stopBackgroundMusic();
        }
    } else {
        // Resume animations when page becomes visible
        if (window.app) {
            window.app.createFloatingHearts();
        }
    }
});