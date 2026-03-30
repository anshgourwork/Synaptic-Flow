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

});
