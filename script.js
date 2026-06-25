/* ============================================
   JENSEN HEALING CONCEPT — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation Scroll Effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile Menu ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal and anim-fade elements
  document.querySelectorAll('.reveal, .anim-fade').forEach(el => {
    revealObserver.observe(el);
  });

  // Stagger animation for feature cards and service cards
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.feature-card, .service-card, .vns-card, .process-step');
        cards.forEach((card, index) => {
          card.style.transitionDelay = `${index * 0.1}s`;
          card.classList.add('visible');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { ...observerOptions, threshold: 0.05 });

  document.querySelectorAll('.rotlicht__features, .angebot__grid, .vns__features, .process-steps').forEach(el => {
    staggerObserver.observe(el);
  });

  // --- Hero animations (trigger immediately) ---
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Active navigation link highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + nav.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- Contact Form Handler ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      if (!data.name || !data.email) {
        alert('Bitte füllen Sie die Pflichtfelder aus.');
        return;
      }

      // Build mailto link as a simple solution
      const subject = encodeURIComponent(`Terminanfrage: ${data.service || 'Allgemein'}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nE-Mail: ${data.email}\nTelefon: ${data.phone || 'Nicht angegeben'}\nGewünschte Anwendung: ${data.service || 'Nicht ausgewählt'}\n\nNachricht:\n${data.message || 'Keine Nachricht'}`
      );

      window.location.href = `mailto:jensenhealingconcept@gmail.com?subject=${subject}&body=${body}`;

      // Show confirmation
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Vielen Dank!';
      btn.style.backgroundColor = '#2D6A4F';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 3000);
    });
  }

  // --- Parallax effect for hero orbs ---
  let ticking = false;

  function handleParallax() {
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.hero__orb');

    orbs.forEach((orb, index) => {
      const speed = 0.15 + (index * 0.05);
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleParallax);
      ticking = true;
    }
  }, { passive: true });

  // --- Rotlicht Wavy Background ---
  const rotlichtCanvas = document.getElementById('rotlichtCanvas');
  if (rotlichtCanvas) {
    const ctx = rotlichtCanvas.getContext('2d');
    let wW, wH, nt = 0;
    let wavesAnimId;
    let wavesRunning = false;

    // Lightweight simplex-like noise (no dependencies)
    const perm = new Uint8Array(512);
    const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    (function seedPerm() {
      const p = [];
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    })();

    function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z; }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + t * (b - a); }

    function noise3D(x, y, z) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z);
      const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
      const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      return lerp(
        lerp(lerp(dot3(grad3[perm[AA] % 12], x, y, z), dot3(grad3[perm[BA] % 12], x-1, y, z), u),
             lerp(dot3(grad3[perm[AB] % 12], x, y-1, z), dot3(grad3[perm[BB] % 12], x-1, y-1, z), u), v),
        lerp(lerp(dot3(grad3[perm[AA+1] % 12], x, y, z-1), dot3(grad3[perm[BA+1] % 12], x-1, y, z-1), u),
             lerp(dot3(grad3[perm[AB+1] % 12], x, y-1, z-1), dot3(grad3[perm[BB+1] % 12], x-1, y-1, z-1), u), v), w);
    }

    const waveColors = [
      'rgba(91, 134, 199, 0.35)',
      'rgba(120, 160, 220, 0.2)',
      'rgba(58, 95, 154, 0.3)',
      'rgba(142, 175, 230, 0.18)',
      'rgba(40, 70, 130, 0.25)'
    ];

    const section = rotlichtCanvas.closest('.rotlicht');

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      wW = rotlichtCanvas.offsetWidth;
      wH = rotlichtCanvas.offsetHeight;
      rotlichtCanvas.width = wW * dpr;
      rotlichtCanvas.height = wH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.filter = 'blur(14px)';
    }

    function drawWaves() {
      nt += 0.0007;
      ctx.fillStyle = '#0A1628';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, wW, wH);
      ctx.globalAlpha = 1;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = 55;
        ctx.strokeStyle = waveColors[i];
        for (let x = 0; x < wW; x += 5) {
          const y = noise3D(x / 800, 0.3 * i, nt) * (wH * 0.35);
          ctx.lineTo(x, y + wH * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }

      wavesAnimId = requestAnimationFrame(drawWaves);
    }

    // Only run animation when section is visible (performance)
    const wavesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !wavesRunning) {
          wavesRunning = true;
          sizeCanvas();
          drawWaves();
        } else if (!entry.isIntersecting && wavesRunning) {
          wavesRunning = false;
          cancelAnimationFrame(wavesAnimId);
        }
      });
    }, { threshold: 0.05 });

    sizeCanvas();
    wavesObserver.observe(section);

    window.addEventListener('resize', () => {
      if (wavesRunning) {
        sizeCanvas();
      }
    });
  }

});
