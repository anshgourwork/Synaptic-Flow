/* ============================================================
   SYNAPTIC FLOW — JavaScript
   Scroll Reveals, Nav Behavior, Mobile Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal with Intersection Observer ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Navbar: scroll detection + light-to-dark transition ---
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function updateNav() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Liquid Glass Nav Indicator (Desktop Only) ---
  if (window.innerWidth > 768) {
    const navLinksContainer = document.getElementById('navLinks');
    const indicator = document.getElementById('navGlassIndicator');
    const navLinkEls = navLinksContainer.querySelectorAll('.nav-link');
    let currentActiveLink = null;
    let isHovering = false;

    function moveIndicatorTo(linkEl) {
      if (!linkEl || !indicator) return;
      const containerRect = navLinksContainer.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      const left = linkRect.left - containerRect.left;
      const width = linkRect.width;

      indicator.style.left = left + 'px';
      indicator.style.width = width + 'px';
      indicator.classList.add('active');
    }

    // Hover events
    navLinkEls.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        isHovering = true;
        moveIndicatorTo(link);
      });
    });

    navLinksContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      if (currentActiveLink) {
        moveIndicatorTo(currentActiveLink);
      } else {
        indicator.classList.remove('active');
      }
    });

    // Scroll-based active section detection & Theme Switcher
    const sections = ['hero', 'overview', 'about', 'testimonials', 'services', 'approach', 'solutions'];
    const darkSections = ['overview', 'services', 'solutions'];

    function updateActiveSection() {
      if (isHovering) return;

      const scrollY = window.scrollY + 100;
      let activeSection = 'hero';

      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            activeSection = id;
            break;
          }
        }
      }

      // Update Nav Theme (Desktop)
      if (darkSections.includes(activeSection)) {
        nav.classList.add('nav-over-dark');
        nav.classList.remove('nav-over-light');
      } else {
        nav.classList.add('nav-over-light');
        nav.classList.remove('nav-over-dark');
      }

      // Update active link styling
      navLinkEls.forEach((link) => {
        if (link.dataset.section === activeSection) {
          link.classList.add('glass-active');
          currentActiveLink = link;
        } else {
          link.classList.remove('glass-active');
        }
      });

      // Move indicator to active section
      if (currentActiveLink) {
        moveIndicatorTo(currentActiveLink);
      }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    // Initial position
    setTimeout(() => {
      updateActiveSection();
    }, 100);
  }



  // --- Dynamic year in copyright ---
  const yearEl = document.querySelector('.footer-copy');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace('2026', year);
  }
  
  // --- Custom Vanilla JS 'BackgroundPaths' Animation ---
  const bgContainer = document.getElementById('floatingPathsBg');
  if (bgContainer) {
    const isMobile = window.innerWidth < 768;
    const createPaths = (position) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'floating-paths-svg');
      svg.setAttribute('viewBox', '0 0 696 316');
      svg.setAttribute('fill', 'none');

      const pathCount = isMobile ? 12 : 36;
      for (let i = 0; i < pathCount; i++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
        
        path.setAttribute('d', d);
        const opacity = 0.1 + i * 0.03;
        path.setAttribute('stroke', `rgba(15,23,42,${opacity})`); 
        path.setAttribute('stroke-width', 0.5 + i * 0.03);

        svg.appendChild(path);
      }
      return svg;
    };

    bgContainer.appendChild(createPaths(1));
    bgContainer.appendChild(createPaths(-1));

    // Calculate length for the CSS animation DashArray mimicking Framer Motion logic
    const allPaths = bgContainer.querySelectorAll('path');
    allPaths.forEach((path) => {
      const length = path.getTotalLength();
      
      // Frame motion pathLength: 0.3 to 1 means we can set dash array so it draws 30% to 100% of the line.
      // Easiest seamless way in vanilla is to set the dash array to a fraction, and animate the offset entirely.
      path.style.strokeDasharray = `${length * 0.25} ${length * 0.75}`;
      path.style.setProperty('--path-length', length);
      
      const duration = 20 + Math.random() * 10;
      path.style.animation = `dashAnim ${duration}s linear infinite`;
    });
  }

  // --- Special Text Animation (Scramble Reveal) ---
  const RANDOM_CHARS = "_!X$0-+*#";
  function getRandomChar(prevChar) {
    let char;
    do { char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]; }
    while (char === prevChar);
    return char;
  }

  function initSpecialText(elementId, text, speed = 25, delay = 0.8) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let animationStep = 0;
    let currentPhase = 'phase1';
    let intervalId = null;

    const runPhase1 = () => {
      const maxSteps = text.length * 2;
      const currentLength = Math.min(animationStep + 1, text.length);
      let chars = "";
      for (let i = 0; i < currentLength; i++) {
        if (text[i] === "\n") {
          chars += "\n";
        } else {
          chars += getRandomChar(chars[i - 1]);
        }
      }
      for (let i = currentLength; i < text.length; i++) {
        chars += (text[i] === "\n") ? "\n" : "\u00A0"; 
      }
      el.textContent = chars;
      if (animationStep < maxSteps - 1) {
        animationStep++;
      } else {
        currentPhase = 'phase2';
        animationStep = 0;
      }
    };

    const runPhase2 = () => {
      const revealedCount = Math.floor(animationStep / 2);
      let chars = "";
      for (let i = 0; i < revealedCount && i < text.length; i++) {
        chars += text[i];
      }
      if (revealedCount < text.length) {
        if (text[revealedCount] === "\n") {
          chars += "\n";
        } else {
          chars += (animationStep % 2 === 0) ? "_" : getRandomChar();
        }
      }
      for (let i = chars.length; i < text.length; i++) {
        if (text[i] === "\n") {
          chars += "\n";
        } else {
          chars += getRandomChar();
        }
      }
      el.textContent = chars;
      if (animationStep < text.length * 2 - 1) {
        animationStep++;
      } else {
        el.textContent = text;
        clearInterval(intervalId);
        el.classList.add('reveal-done');
      }
    };

    const startAnimation = () => {
      intervalId = setInterval(() => {
        if (currentPhase === 'phase1') runPhase1();
        else runPhase2();
      }, speed);
    };

    setTimeout(startAnimation, delay * 1000);
  }

  const isMobileView = window.innerWidth < 768;
  initSpecialText('specialTextSubheading', "Intelligence that runs your business\nbehind the scenes", isMobileView ? 15 : 25, 0.4);

});
