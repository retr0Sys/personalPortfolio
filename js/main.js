/* ══════════════════════════════════════════════════
   THIAGO SOSA — PORTFOLIO
   Main JavaScript v2 — Particles + Carousel + Motion
   ══════════════════════════════════════════════════ */

(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ═══════════════════════════════════════════
       1. PARTICLES BACKGROUND
       ═══════════════════════════════════════════ */
    const canvas = $('#particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.r = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.4 + 0.1;
                // Cyan or purple
                this.color = Math.random() > 0.7
                    ? `rgba(124, 58, 237, ${this.alpha})`
                    : `rgba(0, 229, 255, ${this.alpha})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Create particles — fewer on mobile
        const count = window.innerWidth < 768 ? 40 : 80;
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ═══════════════════════════════════════════
       2. TYPING CAROUSEL
       ═══════════════════════════════════════════ */
    const typingEl = $('#typingCarousel');
    const roles = [
        'Estudiante de Profesorado en Informática',
        'Especialista en Ciberseguridad',
        'Técnico Informático',
        'Desarrollador',
        'Auxiliar Contable'
    ];

    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeStep() {
        if (!typingEl) return;
        const current = roles[roleIdx];
        if (!deleting) {
            typingEl.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeStep, 2000);
                return;
            }
            setTimeout(typeStep, 65);
        } else {
            typingEl.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(typeStep, 400);
                return;
            }
            setTimeout(typeStep, 35);
        }
    }
    typeStep();

    /* ═══════════════════════════════════════════
       3. TECH CAROUSEL — duplicate items for infinite loop
       ═══════════════════════════════════════════ */
    const techTrack = $('#techTrack');
    if (techTrack) {
        const items = techTrack.innerHTML;
        techTrack.innerHTML = items + items; // Duplicate for seamless loop
    }

    /* ═══════════════════════════════════════════
       4. MOBILE NAV
       ═══════════════════════════════════════════ */
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';

            // Staggered animation for nav items
            const items = $$('li', navLinks);
            if (isOpen) {
                items.forEach((item, i) => {
                    item.style.transitionDelay = `${0.05 * i}s`;
                    item.classList.add('nav-animate');
                });
            } else {
                items.forEach(item => {
                    item.style.transitionDelay = '0s';
                    item.classList.remove('nav-animate');
                });
            }
        });

        $$('a', navLinks).forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                $$('li', navLinks).forEach(item => {
                    item.style.transitionDelay = '0s';
                    item.classList.remove('nav-animate');
                });
            });
        });

        // Close mobile nav on scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (navLinks.classList.contains('open') && Math.abs(window.scrollY - lastScrollY) > 60) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                $$('li', navLinks).forEach(item => {
                    item.style.transitionDelay = '0s';
                    item.classList.remove('nav-animate');
                });
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════
       5. SCROLL REVEAL
       ═══════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    $$('.reveal').forEach(el => revealObserver.observe(el));

    /* ═══════════════════════════════════════════
       6. NAVBAR SCROLL FX
       ═══════════════════════════════════════════ */
    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(0,229,255,0.05)'
                : 'none';
        }
    }, { passive: true });

    /* ═══════════════════════════════════════════
       7. LIGHTBOX
       ═══════════════════════════════════════════ */
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
    }

    // Cert cards — click on img wrapper opens lightbox
    $$('.cert-card').forEach(card => {
        const imgWrapper = card.querySelector('.cert-img-wrapper');
        if (imgWrapper) {
            imgWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = card.dataset.img;
                const alt = card.querySelector('img')?.alt || '';
                if (src) openLightbox(src, alt);
            });
        }
    });

    $$('.project-img-wrapper[data-img]').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const src = wrapper.dataset.img;
            const alt = wrapper.querySelector('img')?.alt || '';
            if (src) openLightbox(src, alt);
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox();
        });
        $('.lightbox-close', lightbox)?.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    /* ═══════════════════════════════════════════
       8. SECURITY MEASURES & CONTACT LOGIC
       ═══════════════════════════════════════════ */
    const toast = $('#securityToast');

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Secure Email Link Construction
    const emailContact = $('#emailContact');
    if (emailContact) {
        emailContact.addEventListener('click', (e) => {
            e.preventDefault();
            // Obfuscated to prevent simple spam bot scraping
            const user = 'sosat279';
            const domain = 'gmail.com';
            const subject = 'Contacto%20desde%20el%20Portfolio';
            window.location.href = `mailto:${user}@${domain}?subject=${subject}`;
        });
    }

    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showToast('🔒 Las imágenes están protegidas');
        }
    });

    $$('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', e => e.preventDefault());
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') { e.preventDefault(); showToast('🔒 Herramientas de desarrollo deshabilitadas'); return; }
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
            e.preventDefault(); showToast('🔒 Herramientas de desarrollo deshabilitadas'); return;
        }
        if (e.ctrlKey && e.key.toUpperCase() === 'U') {
            e.preventDefault(); showToast('🔒 Ver código fuente deshabilitado'); return;
        }
    });

    /* ═══════════════════════════════════════════
       10. ACTIVE NAV ON SCROLL
       ═══════════════════════════════════════════ */
    const sections = $$('section[id]');
    const navLinksAll = $$('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinksAll.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(sec => sectionObserver.observe(sec));

})();
