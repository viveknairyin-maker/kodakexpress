/**
 * KODAK EXPRESS USHA PHOTO STUDIO
 * Main JavaScript — All Interactive Features
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  // ═══════════════════════════════════════════
  // 1. INTRO OVERLAY
  // ═══════════════════════════════════════════
  function initIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    if (prefersReducedMotion) {
      overlay.style.display = 'none';
      initAfterIntro();
      return;
    }

    // Show overlay for 1.8s then slide up
    setTimeout(() => {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 800);
      initAfterIntro();
    }, 1800);
  }

  // ═══════════════════════════════════════════
  // 2. CUSTOM CURSOR
  // ═══════════════════════════════════════════
  function initCursor() {
    if (isTouchDevice) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });

    const expandables = document.querySelectorAll('a, button, .portfolio-item, input, select, textarea, .filter-tab');
    expandables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.borderColor = 'rgba(200,151,42,0.9)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(200,151,42,0.5)';
      });
    });
  }

  // ═══════════════════════════════════════════
  // 3. HERO PARTICLES (Home page only)
  // ═══════════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 80;
    const particles = [];

    function resizeCanvas() {
      const w = hero.offsetWidth;
      const h = hero.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < 0) this.reset();
      }
      draw() {
        const fade =
          this.life < 30
            ? this.life / 30
            : this.life > this.maxLife - 30
              ? (this.maxLife - this.life) / 30
              : 1;
        ctx.save();
        ctx.globalAlpha = this.opacity * fade;
        ctx.fillStyle = '#C8972A';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      particles.forEach((p) => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.speedX += dx * 0.00015;
          p.speedY += dy * 0.00015;
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // 3b. HERO TITLE — word reveal (Home only)
  // ═══════════════════════════════════════════
  function initHeroTitleReveal() {
    const heading = document.querySelector('#hero .hero-title');
    if (!heading || heading.querySelector('.word-wrap')) return;
    if (prefersReducedMotion) return;

    const words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(
        (word, i) =>
          `<span class="word-wrap" style="overflow:hidden;display:inline-block;margin-right:0.25em;"><span class="word-inner" style="display:inline-block;transform:translateY(110%);opacity:0;transition:transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, opacity 0.8s ease ${i * 0.12}s;">${word}</span></span>`
      )
      .join('');

    setTimeout(() => {
      heading.querySelectorAll('.word-inner').forEach((el) => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    }, 300);
  }

  // ═══════════════════════════════════════════
  // 4. NAVBAR SCROLL BEHAVIOR
  // ═══════════════════════════════════════════
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu on link click
      mobileMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // ═══════════════════════════════════════════
  // 5. SCROLL-TRIGGERED REVEALS (sections + cards)
  // ═══════════════════════════════════════════
  function revealDescendants(root) {
    root.querySelectorAll('.reveal-section, .reveal-left').forEach((el) => {
      el.classList.add('revealed');
    });
    root.querySelectorAll('.reveal-stagger').forEach((stagger) => {
      stagger.classList.add('revealed');
      stagger.querySelectorAll('.reveal-child').forEach((child, i) => {
        setTimeout(() => {
          child.style.transform = 'translateY(0)';
          if (!child.classList.contains('testimonial-card')) {
            child.style.opacity = '1';
          }
        }, i * 100);
      });
    });
    root.querySelectorAll('h2.animated-heading').forEach((h) => {
      h.classList.add('revealed');
    });
  }

  function initRevealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          if (e.target.matches('section')) {
            revealDescendants(e.target);
          } else {
            e.target.querySelectorAll('h2.animated-heading').forEach((h) => {
              h.classList.add('revealed');
            });
          }
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    const selectors =
      'main section:not(#hero), .card, .service-card, .portfolio-item';
    document.querySelectorAll(selectors).forEach((el) => {
      if (el.closest('#hero')) return;
      if (
        el.closest('.reveal-stagger') &&
        el.matches('.service-card.reveal-child, .portfolio-item.reveal-child')
      ) {
        return;
      }
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════
  // 6. TEXT SPLIT ANIMATION
  // ═══════════════════════════════════════════
  function initTextSplit() {
    const headings = document.querySelectorAll('.split-text');
    if (!headings.length) return;

    headings.forEach(heading => {
      const text = heading.textContent;
      const words = text.split(' ');
      heading.innerHTML = '';

      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'split-word';
        const inner = document.createElement('span');
        inner.className = 'split-inner';
        inner.textContent = word;
        inner.style.animationDelay = `${i * 0.06}s`;
        span.appendChild(inner);
        heading.appendChild(span);
        // Add space between words
        if (i < words.length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // 7. STATS COUNTER
  // ═══════════════════════════════════════════
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    function animateCounter(el) {
      const raw = el.dataset.target;
      const suffix = el.dataset.suffix != null ? el.dataset.suffix : '';
      const isDecimal = raw.includes('.');
      const target = isDecimal ? parseFloat(raw) : parseInt(raw, 10);
      let current = 0;
      const steps = 60;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent =
            (isDecimal ? target.toFixed(1) : target) + suffix;
          clearInterval(timer);
        } else {
          el.textContent =
            (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        }
      }, 25);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    statNumbers.forEach((el) => observer.observe(el));
  }

  // ═══════════════════════════════════════════
  // 8. TESTIMONIALS CAROUSEL (Home only)
  // ═══════════════════════════════════════════
  function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!cards.length) return;

    let activeIndex = 0;
    let intervalId;

    function setActive(index) {
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      activeIndex = index;
    }

    function next() {
      setActive((activeIndex + 1) % cards.length);
    }

    function startAutoRotate() {
      intervalId = setInterval(next, 4000);
    }

    // Dot click handlers
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(intervalId);
        setActive(i);
        startAutoRotate();
      });
    });

    setActive(0);
    startAutoRotate();
  }

  // ═══════════════════════════════════════════
  // 9. FILTER TABS (Work page)
  // ═══════════════════════════════════════════
  function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const items = document.querySelectorAll('.portfolio-item');
    if (!tabs.length || !items.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter items with fade
        items.forEach(item => {
          const category = item.dataset.category;
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════
  // 10. LIGHTBOX (Work page)
  // ═══════════════════════════════════════════
  function initLightbox() {
    const items = document.querySelectorAll('.portfolio-item');
    if (!items.length) return;

    // Create lightbox elements
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&#8249;</button>
      <div class="lightbox-content">
        <img src="" alt="Portfolio">
      </div>
      <button class="lightbox-next">&#8250;</button>
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(overlay);

    const content = overlay.querySelector('.lightbox-content img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    const counter = overlay.querySelector('.lightbox-counter');

    let currentIndex = 0;
    const visibleItems = () => Array.from(items).filter(item => item.style.display !== 'none');

    function openLightbox(index) {
      const visItems = visibleItems();
      currentIndex = index;
      const img = visItems[currentIndex].querySelector('img');
      content.src = img.src;
      content.alt = img.alt;
      counter.textContent = `${currentIndex + 1} / ${visItems.length}`;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function nextImage() {
      const visItems = visibleItems();
      currentIndex = (currentIndex + 1) % visItems.length;
      const img = visItems[currentIndex].querySelector('img');
      content.src = img.src;
      content.alt = img.alt;
      counter.textContent = `${currentIndex + 1} / ${visItems.length}`;
    }

    function prevImage() {
      const visItems = visibleItems();
      currentIndex = (currentIndex - 1 + visItems.length) % visItems.length;
      const img = visItems[currentIndex].querySelector('img');
      content.src = img.src;
      content.alt = img.alt;
      counter.textContent = `${currentIndex + 1} / ${visItems.length}`;
    }

    // Event listeners
    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  // ═══════════════════════════════════════════
  // 11. CONTACT FORM
  // ═══════════════════════════════════════════
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMsg = document.querySelector('.form-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide form, show success
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.classList.add('show');
      }
    });
  }

  // ═══════════════════════════════════════════
  // 12. SERVICE CARDS — 3D TILT
  // ═══════════════════════════════════════════
  function initServiceCardTilt() {
    if (prefersReducedMotion || isTouchDevice) return;

    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  // ═══════════════════════════════════════════
  // 13. MARQUEE CLONE (for seamless loop)
  // ═══════════════════════════════════════════
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    // Clone children for seamless loop
    const children = Array.from(track.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // ═══════════════════════════════════════════
  // INITIALIZATION ORDER
  // ═══════════════════════════════════════════
  function initAfterIntro() {
    initParticles();
    initHeroTitleReveal();
    initTextSplit();
    setTimeout(() => {
      document.querySelectorAll('.split-inner').forEach((el) => {
        el.classList.add('revealed');
      });
    }, 200);
  }

  // Initialize everything on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initIntro();
      initCursor();
      initNavbar();
      initRevealOnScroll();
      initStatsCounter();
      initTestimonials();
      initFilterTabs();
      initLightbox();
      initContactForm();
      initMarquee();
      initServiceCardTilt();
    });
  } else {
    initIntro();
    initCursor();
    initNavbar();
    initRevealOnScroll();
    initStatsCounter();
    initTestimonials();
    initFilterTabs();
    initLightbox();
    initContactForm();
    initMarquee();
    initServiceCardTilt();
  }

})();
