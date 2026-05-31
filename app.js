document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentSlide = 1;
    const totalSlides = 14;
    let notesOpen = false;
    let slideChart = null;

    // Elements
    const appContainer = document.querySelector('.app-container');
    const slides = document.querySelectorAll('.slide');
    const noteItems = document.querySelectorAll('.note-item');
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');
    
    // Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const themeToggle = document.getElementById('themeToggle');
    const notesToggle = document.getElementById('notesToggle');
    const closeNotesBtn = document.getElementById('closeNotesBtn');

    // Chart Bars (Slide 5)
    const localBar = document.querySelector('.local-bar');
    const cloudBar = document.querySelector('.cloud-bar');

    // --- Slide Metrics Chart Initialization ---
    function initSlideChart() {
        const ctx = document.getElementById('slide-metrics-chart');
        if (!ctx) return;
        
        if (slideChart) {
            slideChart.destroy();
        }

        const epochs = Array.from({length: 30}, (_, i) => i + 1);
        
        // Simulação matemática das curvas convergindo nos valores do YOLO informados
        const makeCurve = (target, tau, noiseScale = 0.01) => {
            return epochs.map(x => {
                const val = target * (1 - Math.exp(-x / tau));
                if (x === 30) return target;
                const noise = (Math.random() - 0.5) * noiseScale * (30 - x) / 30;
                return Math.max(0, val + noise);
            });
        };

        const precisionData = makeCurve(0.7759, 6, 0.02);
        const recallData = makeCurve(0.7349, 7, 0.02);
        const map5095Data = makeCurve(0.3102, 8, 0.015);

        const isDark = document.body.classList.contains('dark-theme');
        const textColor = isDark ? '#CBD5E1' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        slideChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: epochs,
                datasets: [
                    {
                        label: 'Precisão (0.7759)',
                        data: precisionData,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Recall (0.7349)',
                        data: recallData,
                        borderColor: '#ec4899',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'mAP50-95 (0.3102)',
                        data: map5095Data,
                        borderColor: '#E30613',
                        borderWidth: 3,
                        tension: 0.3,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        title: { display: true, text: 'Época', color: textColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        grid: { color: gridColor },
                        min: 0,
                        max: 1.0,
                        title: { display: true, text: 'Pontuação', color: textColor },
                        ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: isDark ? '#F8FAFC' : '#1E293B',
                            font: { family: "'Outfit', sans-serif", weight: '600' },
                            boxWidth: 12
                        }
                    }
                }
            }
        });
    }

    // --- Slide Navigation Logic ---
    function updateSlide(index) {
        // Enforce boundaries
        if (index < 1) index = 1;
        if (index > totalSlides) index = totalSlides;

        currentSlide = index;

        // Update active slide class
        slides.forEach(slide => {
            slide.classList.remove('active');
            if (parseInt(slide.getAttribute('data-slide')) === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update speaker notes content
        noteItems.forEach(note => {
            note.classList.remove('active');
            if (note.id === `note-${currentSlide}`) {
                note.classList.add('active');
            }
        });

        // Update summary items active class
        const summaryItems = document.querySelectorAll('.summary-item');
        summaryItems.forEach(item => {
            if (parseInt(item.getAttribute('data-target')) === currentSlide) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update progress bar
        const progressPercentage = (currentSlide / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update indicator text
        slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;

        // Disable/enable buttons at boundaries
        prevBtn.style.opacity = currentSlide === 1 ? '0.4' : '1';
        prevBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'auto';
        nextBtn.style.opacity = currentSlide === totalSlides ? '0.4' : '1';
        nextBtn.style.pointerEvents = currentSlide === totalSlides ? 'none' : 'auto';

        // Custom slide animations
        triggerSlideAnimations(currentSlide);
    }

    // Interactive Trigger Animations
    function triggerSlideAnimations(slideNum) {
        // Reset Slide 5 (Estratégia de Treinamento) chart animations if not on Slide 5
        if (slideNum === 5) {
            localBar.style.width = '0%';
            cloudBar.style.width = '0%';
            setTimeout(() => {
                localBar.style.width = '15%';
                cloudBar.style.width = '100%';
            }, 100);
        }

        // Reset and trigger timeline transition on Slide 3
        if (slideNum === 3) {
            const points = document.querySelectorAll('.timeline-point');
            points.forEach((point, i) => {
                point.style.opacity = '0';
                point.style.transform = 'translateY(15px)';
                point.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    point.style.opacity = '1';
                    point.style.transform = 'translateY(0)';
                }, (i + 1) * 300);
            });
        }

        // Initialize Slide 6 training curves chart
        if (slideNum === 6) {
            setTimeout(() => {
                initSlideChart();
            }, 100);
        }



        // Auto-play video when entering Slide 8
        if (slideNum === 8) {
            const video = document.getElementById('demo-video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(err => console.log("Autoplay mitigado: ", err));
            }
        }
    }

    // --- Control Handlers ---
    function nextSlide() {
        if (currentSlide < totalSlides) {
            updateSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 1) {
            updateSlide(currentSlide - 1);
        }
    }

    // --- Event Listeners ---
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        }
    });

    // Notes Toggle
    function toggleNotes() {
        notesOpen = !notesOpen;
        if (notesOpen) {
            appContainer.classList.add('notes-open');
        } else {
            appContainer.classList.remove('notes-open');
        }
    }

    notesToggle.addEventListener('click', toggleNotes);
    closeNotesBtn.addEventListener('click', toggleNotes);

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            // Change icon to Sun
            themeIcon.innerHTML = `<path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>`;
            themeToggle.setAttribute('title', 'Alternar Tema Claro');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            // Change icon to Moon
            themeIcon.innerHTML = `<path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>`;
            themeToggle.setAttribute('title', 'Alternar Tema Escuro');
        }
        
        // Re-render Slide 5 chart with updated colors if visible
        if (currentSlide === 5) {
            initSlideChart();
        }
    });

    // Touch Swipe Navigation support (for mobile screens or touchscreen testing)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const threshold = 50; // swipe minimum distance in px
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // swipe left -> next slide
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide(); // swipe right -> prev slide
        }
    }

    // Expose switchDemoMedia function globally for the onclick attribute in HTML
    let currentDemoPhotoIndex = 0;

    window.navigateDemoPhotos = function(direction) {
        const items = document.querySelectorAll('.demo-carousel-item');
        const counter = document.getElementById('demo-carousel-counter');
        if (!items.length) return;

        // Esconde o atual
        items[currentDemoPhotoIndex].style.display = 'none';
        items[currentDemoPhotoIndex].classList.remove('active');

        currentDemoPhotoIndex += direction;

        // Loop circular
        if (currentDemoPhotoIndex < 0) {
            currentDemoPhotoIndex = items.length - 1;
        } else if (currentDemoPhotoIndex >= items.length) {
            currentDemoPhotoIndex = 0;
        }

        // Mostra o novo
        items[currentDemoPhotoIndex].style.display = 'block';
        items[currentDemoPhotoIndex].classList.add('active');

        // Atualiza o contador de fotos
        if (counter) {
            counter.textContent = `${currentDemoPhotoIndex + 1} / ${items.length}`;
        }
    };

    window.switchDemoMedia = function(type) {
        const videoWrapper = document.getElementById('demo-video-wrapper');
        const photosWrapper = document.getElementById('demo-photos-wrapper');
        const mediaTitle = document.getElementById('demo-media-title');
        const btnVideo = document.getElementById('btn-show-video');
        const btnPhotos = document.getElementById('btn-show-photos');
        
        if (!videoWrapper || !photosWrapper) return;
        
        if (type === 'video') {
            videoWrapper.style.display = 'block';
            photosWrapper.style.display = 'none';
            mediaTitle.textContent = 'MONITORAMENTO EM VÍDEO';
            btnVideo.classList.add('active');
            btnPhotos.classList.remove('active');
            
            // Play video automatically
            const video = document.getElementById('demo-video');
            if (video) video.play();
        } else {
            videoWrapper.style.display = 'none';
            photosWrapper.style.display = 'block'; // alterado de grid para block devido ao carrossel
            mediaTitle.textContent = 'GALERIA DE CAPTURAS';
            btnPhotos.classList.add('active');
            btnVideo.classList.remove('active');
            
            // Pause video to save resources
            const video = document.getElementById('demo-video');
            if (video) video.pause();
        }
    };

    // Expose switchSlide6Mode function globally for the Slide 6 toggle
    window.switchSlide6Mode = function(mode) {
        const btnTecnico = document.getElementById('btn-mode-tecnico');
        const btnFutebol = document.getElementById('btn-mode-futebol');
        const subtitle = document.getElementById('slide6-subtitle');
        
        const titlesTecnico = document.querySelectorAll('.mode-title-tecnico');
        const titlesFutebol = document.querySelectorAll('.mode-title-futebol');
        const descsTecnico = document.querySelectorAll('.mode-desc-tecnico');
        const descsFutebol = document.querySelectorAll('.mode-desc-futebol');
        
        if (!btnTecnico || !btnFutebol || !subtitle) return;
        
        if (mode === 'tecnico') {
            btnTecnico.classList.add('active');
            btnTecnico.style.background = 'var(--primary-red)';
            btnTecnico.style.borderColor = 'var(--primary-red)';
            btnTecnico.style.color = 'white';
            
            btnFutebol.classList.remove('active');
            btnFutebol.style.background = 'rgba(255,255,255,0.05)';
            btnFutebol.style.borderColor = 'rgba(255,255,255,0.08)';
            btnFutebol.style.color = 'var(--text-primary)';
            
            subtitle.textContent = 'Explicando o comportamento do modelo de forma técnica e descomplicada';
            
            titlesTecnico.forEach(el => el.style.display = 'inline');
            titlesFutebol.forEach(el => el.style.display = 'none');
            descsTecnico.forEach(el => el.style.display = 'block');
            descsFutebol.forEach(el => el.style.display = 'none');
        } else {
            btnFutebol.classList.add('active');
            btnFutebol.style.background = 'var(--primary-red)';
            btnFutebol.style.borderColor = 'var(--primary-red)';
            btnFutebol.style.color = 'white';
            
            btnTecnico.classList.remove('active');
            btnTecnico.style.background = 'rgba(255,255,255,0.05)';
            btnTecnico.style.borderColor = 'rgba(255,255,255,0.08)';
            btnTecnico.style.color = 'var(--text-primary)';
            
            subtitle.textContent = 'Explicando o comportamento do modelo com analogias de campo';
            
            titlesTecnico.forEach(el => el.style.display = 'none');
            titlesFutebol.forEach(el => el.style.display = 'inline');
            descsTecnico.forEach(el => el.style.display = 'none');
            descsFutebol.forEach(el => el.style.display = 'block');
        }
    };

    // Summary Panel Toggling
    const summaryToggle = document.getElementById('summaryToggle');
    const summaryPanel = document.getElementById('summaryPanel');
    if (summaryToggle && summaryPanel) {
        summaryToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = summaryPanel.style.display === 'block';
            summaryPanel.style.display = isOpen ? 'none' : 'block';
        });
        
        // Close summary panel on clicking anywhere else
        document.addEventListener('click', () => {
            summaryPanel.style.display = 'none';
        });
        summaryPanel.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent closure on clicking panel items
        });
    }

    // Global jump to slide function
    window.jumpToSlide = function(slideIndex) {
        updateSlide(slideIndex);
        if (summaryPanel) {
            summaryPanel.style.display = 'none';
        }
    };

    // Global Zoom image functions with navigation
    let currentGalleryIndex = 0;
    let galleryImages = [];

    window.zoomImage = function(imgEl) {
        const modal = document.getElementById('imageZoomModal');
        const modalImg = document.getElementById('zoomModalImg');
        const modalCaption = document.getElementById('zoomModalCaption');
        const modalCounter = document.getElementById('zoomModalCounter');
        if (!modal || !modalImg) return;
        
        // Find all images in the active gallery (Slide 8 demo photos)
        galleryImages = Array.from(document.querySelectorAll('#demo-photos-wrapper img'));
        currentGalleryIndex = galleryImages.indexOf(imgEl);
        if (currentGalleryIndex === -1) {
            // Fallback for single images not in the gallery grid
            galleryImages = [imgEl];
            currentGalleryIndex = 0;
        }

        updateModalImage();
        modal.style.display = 'flex';
    };

    window.closeZoomModal = function() {
        const modal = document.getElementById('imageZoomModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    window.navigateModalGallery = function(direction) {
        if (!galleryImages.length) return;
        currentGalleryIndex += direction;
        
        // Circular loop navigation
        if (currentGalleryIndex < 0) {
            currentGalleryIndex = galleryImages.length - 1;
        } else if (currentGalleryIndex >= galleryImages.length) {
            currentGalleryIndex = 0;
        }
        
        updateModalImage();
    };

    function updateModalImage() {
        const modalImg = document.getElementById('zoomModalImg');
        const modalCaption = document.getElementById('zoomModalCaption');
        const modalCounter = document.getElementById('zoomModalCounter');
        const currentImg = galleryImages[currentGalleryIndex];
        
        if (!modalImg || !currentImg) return;
        
        modalImg.src = currentImg.src;
        
        // Get text from the span next to the image in the wrapper
        const labelEl = currentImg.nextElementSibling;
        if (labelEl && modalCaption) {
            modalCaption.textContent = labelEl.textContent;
            modalCaption.style.display = 'block';
        } else if (modalCaption) {
            modalCaption.style.display = 'none';
        }
        
        if (modalCounter) {
            modalCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
        }
    }

    // Keyboard navigation in modal and ESC key to close
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageZoomModal');
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeZoomModal();
            } else if (e.key === 'ArrowRight') {
                navigateModalGallery(1);
            } else if (e.key === 'ArrowLeft') {
                navigateModalGallery(-1);
            }
            e.stopPropagation(); // prevent moving parent slides
        }
    }, true); // Use capture phase to intercept slider keydowns

    // Initialize slide deck
    updateSlide(1);
});
