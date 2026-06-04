/* ============================================
   MeiMei — Cute Cat Personal Landing Page
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------- DOM Elements ----------
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const videoWrapper = document.getElementById('videoWrapper');
  const catVideo = document.getElementById('catVideo');
  const playBtn = document.getElementById('playBtn');
  const videoOverlay = document.getElementById('videoOverlay');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

  // ============================================
  // NAVBAR — Scroll Effect
  // ============================================
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ============================================
  // MOBILE MENU
  // ============================================
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)) {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ============================================
  // ACTIVE NAV LINK — Scroll spy
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNav);
  }, { passive: true });

  // ============================================
  // SMOOTH SCROLL — For nav links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SCROLL REVEAL — IntersectionObserver
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // VIDEO PLAYER
  // ============================================
  if (videoWrapper && catVideo && playBtn) {
    function playVideo() {
      catVideo.play().then(() => {
        videoWrapper.classList.add('playing');
      }).catch(() => {
        // Fallback: try muted autoplay
        catVideo.muted = true;
        catVideo.play().then(() => {
          videoWrapper.classList.add('playing');
        });
      });
    }

    function pauseVideo() {
      catVideo.pause();
      videoWrapper.classList.remove('playing');
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playVideo();
    });

    videoWrapper.addEventListener('click', () => {
      if (videoWrapper.classList.contains('playing')) {
        pauseVideo();
      } else {
        playVideo();
      }
    });

    catVideo.addEventListener('ended', () => {
      videoWrapper.classList.remove('playing');
    });
  }

  // ============================================
  // GALLERY LIGHTBOX
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const imgAlt = item.querySelector('img').getAttribute('alt');

      if (imgSrc && lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Escape key closes lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      // Also close mobile menu
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ============================================
  // STAT COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated || prefersReducedMotion) return;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      if (!target && target !== 0) return;

      const suffix = stat.textContent.replace(/[0-9]/g, '').trim();
      let current = 0;
      const increment = target / 40;
      const duration = 1500;
      const stepTime = duration / 40;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current) + suffix;
      }, stepTime);
    });

    statsAnimated = true;
  }

  // Trigger stats animation when hero stats become visible
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }

  // ============================================
  // CURSOR SPARKLE EFFECT — On service cards
  // ============================================
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ============================================
  // PARALLAX EFFECT — Hero section subtle depth
  // ============================================
  if (!prefersReducedMotion) {
    const heroBg = document.querySelector('.hero');
    const heroBlob = document.querySelector('.hero-blob');

    if (heroBg && heroBlob) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = heroBg.offsetHeight;

        if (scrollY < maxScroll) {
          const progress = scrollY / maxScroll;
          heroBlob.style.transform = `translateY(${progress * 30}px) scale(${1 - progress * 0.1})`;
        }
      }, { passive: true });
    }
  }



  // ============================================
  // SCROLL PROGRESS BAR & WALKING CAT
  // ============================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const scrollCat = document.querySelector('.scroll-cat');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
    
    if (scrollCat) {
      const catEmojis = ['🐈', '🐈‍⬛'];
      const emojiIndex = Math.floor(scrollPercent / 5) % catEmojis.length;
      scrollCat.textContent = catEmojis[emojiIndex];
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  // ============================================
  // WEB AUDIO "MEOW" SYNTHESIZER
  // ============================================
  const meowBtn = document.getElementById('meowBtn');

  function playSynthesizedMeow() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      
      // Pitch envelope: starting lower, bending high, and dropping slightly
      osc1.frequency.setValueAtTime(450, now);
      osc1.frequency.quadraticRampToValueAtTime(880, now + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(680, now + 0.6);
      
      osc2.frequency.setValueAtTime(900, now);
      osc2.frequency.quadraticRampToValueAtTime(1760, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1360, now + 0.6);
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      // Keep it soft with lowpass filter
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, now);
      filterNode.frequency.exponentialRampToValueAtTime(800, now + 0.6);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(filterNode);
      filterNode.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Web Audio meow synth failed', e);
    }
  }

  if (meowBtn) {
    meowBtn.addEventListener('click', playSynthesizedMeow);
  }



  // ============================================
  // 3D CARD PARALLAX TILT
  // ============================================
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.service-card, .why-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;
        const angleY = ((x - halfWidth) / halfWidth) * 12;
        const angleX = -((y - halfHeight) / halfHeight) * 12;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // ============================================
  // LOADING COMPLETE — Trigger initial animations
  // ============================================
  document.body.classList.add('loaded');

  // Log a friendly console message
  console.log(
    '%c🐱 MeiMei %c— Built with love for cats! 💕',
    'color: #FF8FB3; font-size: 16px; font-weight: bold;',
    'color: #7AD7F0; font-size: 14px;'
  );
});
