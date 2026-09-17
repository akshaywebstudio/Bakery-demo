// ===========================================================
// Sweet Crumbs Bakery — site behaviour
// Everything here is vanilla JavaScript. No build step, no
// external libraries — this file works as soon as it's linked
// from index.html.
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {

  // -----------------------------------------------------------
  // 1. Mobile nav toggle
  // -----------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the mobile menu after tapping a link, so the page
    // actually scrolls to the section instead of staying hidden behind it.
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -----------------------------------------------------------
  // 2. Sticky mobile CTA — hide while the footer is on screen so
  //    it doesn't sit on top of the footer content.
  // -----------------------------------------------------------
  const mobileCta = document.getElementById('mobileCta');
  const footer = document.querySelector('.site-footer');

  if (mobileCta && footer && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        mobileCta.style.display = entry.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.1 });
    footerObserver.observe(footer);
  }

  // -----------------------------------------------------------
  // 3. Testimonial carousel — simple, dependency-free slider
  // -----------------------------------------------------------
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    let current = 0;

    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      track.style.transition = 'transform .35s ease';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Auto-advance every 6 seconds, pausing if the user is interacting.
    let autoplay = setInterval(function () { goTo(current + 1); }, 6000);
    const carousel = track.closest('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () { clearInterval(autoplay); });
      carousel.addEventListener('mouseleave', function () {
        autoplay = setInterval(function () { goTo(current + 1); }, 6000);
      });
    }
  }

  // -----------------------------------------------------------
  // 4. Contact form — no backend, so this opens the visitor's
  //    email app with the message pre-filled via a mailto: link.
  //    Replace the OWNER_EMAIL constant with the bakery's real inbox.
  // -----------------------------------------------------------
  const OWNER_EMAIL = 'hello@sweetcrumbsbakery.example';
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const message = document.getElementById('cMessage').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in every field before sending.';
        formStatus.style.color = '#B23A56';
        return;
      }

      const subject = encodeURIComponent('Message from ' + name + ' via website');
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      const mailtoLink = 'mailto:' + OWNER_EMAIL + '?subject=' + subject + '&body=' + body;

      window.location.href = mailtoLink;

      formStatus.style.color = '';
      formStatus.textContent = 'Opening your email app…';
      contactForm.reset();
    });
  }

  // -----------------------------------------------------------
  // 5. Footer year — keeps the copyright line correct automatically
  // -----------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
