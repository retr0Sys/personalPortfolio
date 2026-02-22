/* ══════════════════════════════════════════════════
   THIAGO SOSA — PORTFOLIO
   Main JavaScript v3 — All Features
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

        const count = window.innerWidth < 768 ? 40 : 80;
        for (let i = 0; i < count; i++) particles.push(new Particle());

        function connectParticles() {
            const maxDist = 140;
            const maxDistSq = maxDist * maxDist;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDistSq) {
                        const dist = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / maxDist)})`;
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
       2. TYPING CAROUSEL WITH GLITCH EFFECT
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
                // Glitch effect when word completes
                typingEl.classList.add('glitch');
                setTimeout(() => typingEl.classList.remove('glitch'), 400);
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
       3. SKILL DOTS GENERATION
       ═══════════════════════════════════════════ */
    $$('.skill-dots').forEach(container => {
        const level = parseInt(container.dataset.level) || 0;
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement('span');
            dot.className = 'skill-dot' + (i < level ? ' filled' : '');
            container.appendChild(dot);
        }
    });

    /* ═══════════════════════════════════════════
       4. TECH TABS FILTERING
       ═══════════════════════════════════════════ */
    const techTabs = $$('.tech-tab');
    const techItems = $$('#techGrid .tech-item');
    const showMoreBtn = $('#techShowMoreBtn');
    const INITIAL_LIMIT = 8;
    let isExpanded = false;

    function renderTechItems(category) {
        let visibleCount = 0;
        techItems.forEach(item => {
            const matches = category === 'all' || item.dataset.category === category;
            if (matches) {
                if (category === 'all' && !isExpanded && visibleCount >= INITIAL_LIMIT) {
                    item.classList.add('filter-hidden');
                } else {
                    item.classList.remove('filter-hidden');
                    visibleCount++;
                }
            } else {
                item.classList.add('filter-hidden');
            }
        });

        if (showMoreBtn) {
            if (category === 'all' && techItems.length > INITIAL_LIMIT) {
                showMoreBtn.style.display = 'block';
                showMoreBtn.textContent = isExpanded ? 'Mostrar menos' : 'Mostrar más';
            } else {
                showMoreBtn.style.display = 'none';
            }
        }
    }

    techTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            techTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            isExpanded = false;
            renderTechItems(tab.dataset.category);
        });
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            const activeTab = $('.tech-tab.active');
            renderTechItems(activeTab ? activeTab.dataset.category : 'all');
        });
    }

    renderTechItems('all');

    /* ═══════════════════════════════════════════
       5. MOBILE NAV
       ═══════════════════════════════════════════ */
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');

    function closeMobileNav() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        $$('li', navLinks).forEach(item => {
            item.style.transitionDelay = '0s';
            item.classList.remove('nav-animate');
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';

            const items = $$('li', navLinks);
            if (isOpen) {
                items.forEach((item, i) => {
                    item.style.transitionDelay = `${0.05 * i}s`;
                    item.classList.add('nav-animate');
                });
            } else {
                closeMobileNav();
            }
        });

        $$('a', navLinks).forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (navLinks.classList.contains('open') && Math.abs(window.scrollY - lastScrollY) > 60) {
                closeMobileNav();
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════
       6. SCROLL REVEAL
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
       7. ANIMATED STATS COUNTER
       ═══════════════════════════════════════════ */
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target) || 0;
                    let current = 0;
                    const duration = 1500;
                    const increment = target / (duration / 16);

                    function updateCounter() {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                        } else {
                            el.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    updateCounter();
                    statsObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );
    $$('.stat-number[data-target]').forEach(el => statsObserver.observe(el));

    /* ═══════════════════════════════════════════
       8. NAVBAR SCROLL FX
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
       9. LIGHTBOX
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
        if (e.key === 'Escape') {
            closeLightbox();
            closeTerminal();
        }
    });

    /* ═══════════════════════════════════════════
       10. TIMELINE FILTERS
       ═══════════════════════════════════════════ */
    const filterBtns = $$('.filter-btn');
    const timelineItems = $$('.timeline-item[data-type]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            timelineItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ═══════════════════════════════════════════
       11. 3D TILT EFFECT ON PROFESSION CARDS
       ═══════════════════════════════════════════ */
    $$('.profession-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ═══════════════════════════════════════════
       12. SECURITY MEASURES & CONTACT LOGIC
       ═══════════════════════════════════════════ */
    const toast = $('#securityToast');

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    const emailContact = $('#emailContact');
    if (emailContact) {
        emailContact.addEventListener('click', (e) => {
            e.preventDefault();
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
       13. BACK TO TOP BUTTON
       ═══════════════════════════════════════════ */
    const backToTop = $('#backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ═══════════════════════════════════════════
       14. TERMINAL EASTER EGG (Ctrl+Shift+T)
       ═══════════════════════════════════════════ */
    const terminal = $('#terminal');
    const terminalInput = $('#terminalInput');
    const terminalBody = $('#terminalBody');

    const terminalCommands = {
        help: () => `Comandos disponibles:
  <span class="cmd-highlight">about</span>     — Sobre Thiago
  <span class="cmd-highlight">skills</span>    — Tecnologías
  <span class="cmd-highlight">contact</span>   — Info de contacto
  <span class="cmd-highlight">certs</span>     — Certificaciones
  <span class="cmd-highlight">clear</span>     — Limpiar terminal
  <span class="cmd-highlight">exit</span>      — Cerrar terminal`,

        about: () => `┌──────────────────────────────┐
│  Thiago Sosa                │
│  Estudiante de Profesorado  │
│  en Informática             │
├──────────────────────────────┤
│  🎓 Educador + 💻 Dev       │
│  🛡️ CyberSec + 🔧 Técnico   │
│  📍 Uruguay                 │
└──────────────────────────────┘`,

        skills: () => `⚡ Lenguajes: HTML, CSS, JS, Java, Python, Bash
🔧 Herramientas: VS Code, IntelliJ, Git, GitHub
🛡️ CyberSec: Wireshark, Nmap, Kali Linux
☁️ Cloud: Google Cloud, Linux, Redes, Win Server`,

        contact: () => `📧 Email: sosat279@gmail.com
🐙 GitHub: github.com/retr0Sys
🔗 LinkedIn: linkedin.com/in/thiago-sosa-993a673a6`,

        certs: () => `📜 Google Cloud Cybersecurity
📜 OPSWAT - Infraestructura Crítica
📜 Cisco - Networking Devices
📜 Cisco - Networking Basics
📜 Cisco - Intro to Cybersecurity
📜 Certificado Inteligencia Artificial`,

        clear: () => '__CLEAR__',
        exit: () => '__EXIT__'
    };

    function openTerminal() {
        if (!terminal) return;
        terminal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => terminalInput?.focus(), 300);
    }

    function closeTerminal() {
        if (!terminal) return;
        terminal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function handleTerminalCommand(cmd) {
        const trimmed = cmd.trim().toLowerCase();
        if (!trimmed) return;

        // Show command
        const cmdLine = document.createElement('div');
        cmdLine.className = 'term-cmd';
        cmdLine.textContent = `$ ${cmd}`;
        terminalBody.appendChild(cmdLine);

        const handler = terminalCommands[trimmed];
        if (handler) {
            const result = handler();
            if (result === '__CLEAR__') {
                terminalBody.innerHTML = '';
                return;
            }
            if (result === '__EXIT__') {
                closeTerminal();
                return;
            }
            const output = document.createElement('div');
            output.className = 'term-output';
            output.innerHTML = result;
            terminalBody.appendChild(output);
        } else {
            const errLine = document.createElement('div');
            errLine.className = 'term-error';
            errLine.textContent = `comando no encontrado: ${trimmed}. Escribí "help" para ver los comandos.`;
            terminalBody.appendChild(errLine);
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleTerminalCommand(terminalInput.value);
                terminalInput.value = '';
            }
        });
    }

    // Open with Ctrl+Shift+T (won't conflict with browser since we prevent it in specific cases)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'T') {
            e.preventDefault();
            if (terminal?.classList.contains('active')) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
    });

    // Close terminal on overlay click or close button
    if (terminal) {
        terminal.addEventListener('click', (e) => {
            if (e.target === terminal) closeTerminal();
        });
        $('.terminal-close', terminal)?.addEventListener('click', closeTerminal);
    }

    /* ═══════════════════════════════════════════
       15. ACTIVE NAV ON SCROLL
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
