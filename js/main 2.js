/* ============================================
   Brian Yin Portfolio - Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Page Loader ---
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Hamburger menu ---
  const hamburger = document.querySelector('.nav-hamburger');
  const navRight  = document.querySelector('.nav-right');
  if (hamburger && navRight) {
    hamburger.addEventListener('click', () => {
      const open = navbar.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on link click (mobile navigation)
    navRight.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navbar.classList.remove('nav-open'));
    });
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) navbar.classList.remove('nav-open');
    });
  }

  // --- Scroll-triggered reveal animations ---
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // --- Stagger children delays ---
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  // --- Smooth page transitions ---
  const transition = document.querySelector('.page-transition');
  if (transition) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !link.getAttribute('target')) {
          e.preventDefault();
          transition.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 350);
        }
      });
    });
  }

  // --- Cursor glow ---
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // --- Simple carousel ---
  document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = container.querySelectorAll('.carousel-slide');
    const dots = container.querySelectorAll('.carousel-dot');
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');
    let current = 0;

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-advance
    let interval = setInterval(() => goTo(current + 1), 5000);
    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', () => {
      interval = setInterval(() => goTo(current + 1), 5000);
    });
  });

  // --- Hover tilt effect on work cards (desktop only) ---
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Mobile tap-to-reveal overlay on work cards ---
  // On touch devices: first tap shows the white overlay, second tap navigates.
  const isTouchDevice = () => window.matchMedia('(max-width: 768px)').matches;

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!isTouchDevice()) return; // desktop: normal hover behaviour, let link through

      if (!card.classList.contains('tapped')) {
        // First tap: show overlay, suppress navigation
        e.preventDefault();
        // Dismiss any other open cards
        document.querySelectorAll('.work-card.tapped').forEach(c => c.classList.remove('tapped'));
        card.classList.add('tapped');
      }
      // Second tap: overlay already visible, let the <a> navigate naturally
    });
  });

  // Dismiss overlay when tapping outside a card
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.work-card')) {
      document.querySelectorAll('.work-card.tapped').forEach(c => c.classList.remove('tapped'));
    }
  });

});
