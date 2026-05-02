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
  // 3. CAMERA SCROLL MORPH (Home page only)
  // ═══════════════════════════════════════════
  function initCamera() {
    const camera = document.getElementById('camera-graphic');
    if (!camera) return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    const mqMobile = window.matchMedia('(max-width: 768px)');

    function scrollToTopIfPinned() {
      if (camera.classList.contains('camera-pinned')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    if (prefersReducedMotion) {
      camera.classList.add('camera-pinned');
      camera.style.pointerEvents = 'auto';
      camera.addEventListener('click', scrollToTopIfPinned);
      return;
    }

    function applyUnpinnedLayout() {
      if (mqMobile.matches) {
        camera.style.position = '';
        camera.style.left = '';
        camera.style.top = '';
        camera.style.transform = '';
      } else {
        camera.style.position = 'absolute';
        camera.style.left = '50%';
        camera.style.top = '50%';
        camera.style.transform = 'translate(-50%, -50%)';
      }
    }

    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const progress = Math.min(scrollY / maxScroll, 1);
      const size = 420 - (420 - 72) * progress;

      camera.style.height = 'auto';

      const heroText = document.querySelector('.hero-text');
      if (heroText) {
        heroText.style.opacity = String(Math.max(0, 1 - progress * 1.5));
      }

      if (progress >= 1) {
        camera.classList.add('camera-pinned');
        camera.style.pointerEvents = 'auto';
        camera.style.width = '';
      } else {
        camera.classList.remove('camera-pinned');
        applyUnpinnedLayout();
        camera.style.pointerEvents = 'none';
        camera.style.width = size + 'px';
      }
    }

    applyUnpinnedLayout();
    camera.style.width = '420px';

    window.addEventListener('scroll', onScroll, { passive: true });
    mqMobile.addEventListener('change', () => {
      if (!camera.classList.contains('camera-pinned')) {
        applyUnpinnedLayout();
      }
    });
    onScroll();

    camera.addEventListener('click', scrollToTopIfPinned);
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
    initCamera();
    initTextSplit();
    // Trigger hero text animations
    setTimeout(() => {
      document.querySelectorAll('.split-inner').forEach(el => {
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
