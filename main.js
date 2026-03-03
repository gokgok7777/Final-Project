/* ======================================================
   YUM SPICY SALAD – main.js
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky navbar shadow on scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── 2. Mobile hamburger menu ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── 3. Active nav link on scroll (Intersection Observer) ── */
  const sections  = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 4. Scroll-reveal for menu cards ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each card slightly
        const delay = (entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 6) * 60; // 0–300ms stagger within each row
    revealObserver.observe(el);
  });

  /* ── 5. Cart / order counter ── */
  let cartCount = 0;
  const cartBtn   = document.getElementById('cart-btn');
  const cartNum   = document.getElementById('cart-count');
  const toast     = document.getElementById('toast');
  const toastMsg  = document.getElementById('toast-msg');
  let toastTimer;

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Click any menu card to "add to order"
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const name  = card.querySelector('.card-name')?.textContent.trim() || 'Item';
      const price = card.querySelector('.price-badge')?.textContent.trim() || '';
      cartCount++;
      cartNum.textContent = cartCount;
      cartNum.style.display = 'flex';
      showToast(`✅ Added: ${name} ${price}`);

      // Bounce animation on cart button
      cartBtn.style.transform = 'scale(1.25)';
      setTimeout(() => { cartBtn.style.transform = ''; }, 200);
    });
  });

  cartBtn.addEventListener('click', () => {
    if (cartCount === 0) {
      showToast('🛒 Your cart is empty. Tap a dish to add!');
    } else {
      showToast(`🛒 ${cartCount} item${cartCount > 1 ? 's' : ''} in your order`);
    }
  });

  /* ── 6. Smooth scroll override (for older browsers) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 7. Animated counter for hero stats ── */
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + suffix;
    }, step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          el.removeAttribute('data-target'); // run once
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.hero-stats');
  if (statsRow) statsObserver.observe(statsRow);

  /* ── 8. Floating chili particles on hero click ── */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('click', e => {
      spawnParticles(e.clientX, e.clientY, ['🌶', '🔥', '✦'], 6);
    });
  }

  function spawnParticles(x, y, emojis, count) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        position: fixed;
        left: ${x}px; top: ${y}px;
        font-size: ${0.8 + Math.random() * 0.8}rem;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: transform 0.9s ease-out, opacity 0.9s ease-out;
      `;
      document.body.appendChild(p);
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist  = 60 + Math.random() * 80;
      const dx    = Math.cos(angle) * dist;
      const dy    = Math.sin(angle) * dist - 40;
      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        p.style.opacity   = '0';
      });
      setTimeout(() => p.remove(), 1000);
    }
  }

  /* ── 9. Section title typing effect (Larb & Nam Tok) ── */
  const typedEl = document.getElementById('typed-title');
  if (typedEl) {
    const text  = typedEl.dataset.text || '';
    let index   = 0;
    let started = false;

    const typedObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        typedEl.textContent = '';
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.cssText = 'color:var(--chili-400); animation: flicker 0.7s infinite;';
        typedEl.parentNode.insertBefore(cursor, typedEl.nextSibling);
        const interval = setInterval(() => {
          typedEl.textContent += text[index++];
          if (index >= text.length) {
            clearInterval(interval);
            setTimeout(() => cursor.remove(), 600);
          }
        }, 60);
        typedObserver.disconnect();
      }
    }, { threshold: 0.6 });

    typedObserver.observe(typedEl);
  }

  console.log('%c🌶 Yum Spicy – main.js loaded', 'color:#ff5c3a; font-family:Kanit; font-size:1rem;');
});
