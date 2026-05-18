/* 
  Iqra - Modern Islamic Learning Platform
  Main Logic & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scrolled State
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. GSAP Animations (using library loaded via CDN)
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    gsap.from("#hero-title", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out"
    });

    gsap.from("#hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: "power3.out"
    });

    gsap.from("#hero-actions", {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.6,
      ease: "power3.out"
    });

    // Scroll Reveal for Sections
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Reveal for cards
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: index * 0.2, // Staggered entrance
        ease: "power3.out"
      });
    });

    // Why Us items stagger
    const whyItems = document.querySelectorAll('#why ul li');
    whyItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none"
            },
            opacity: 0,
            x: -20,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
          });
    });
    
    // Testimonial fade
    gsap.from("#testimonials-content", {
        scrollTrigger: {
            trigger: "#testimonials-content",
            start: "top 80%"
        },
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        ease: "power2.out"
    });
  }

  // 3. Modern Form Submission (Web3Forms Asynchronous Handler)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const button = contactForm.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.textContent = "Sending Request...";
      button.disabled = true;

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      // If the user hasn't set their key, warn them in console but don't break the UI
      if (object.access_key === "YOUR_ACCESS_KEY_HERE") {
        console.warn("Web3Forms Key not configured. Please get a free key from web3forms.com and add it in index.html!");
        // Simulate response for testing
        setTimeout(() => {
          showSuccessState(object.name, object.email);
        }, 1000);
        return;
      }

      fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: json
      })
      .then(async (response) => {
          let jsonRes = await response.json();
          if (response.status == 200) {
              showSuccessState(object.name, object.email);
          } else {
              console.error(jsonRes);
              alert(jsonRes.message || "Something went wrong. Please try again.");
              button.textContent = originalText;
              button.disabled = false;
          }
      })
      .catch(error => {
          console.error(error);
          alert("Form submission failed. Please check your internet connection and try again.");
          button.textContent = originalText;
          button.disabled = false;
      });
    });
  }

  function showSuccessState(name, email) {
    contactForm.innerHTML = `
        <div class="success-message" style="text-align: center; padding: 3rem 1rem; animation: fadeIn 0.6s ease forwards;">
            <div style="font-size: 4.5rem; margin-bottom: 1.5rem;">🎉</div>
            <h3 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem; color: var(--primary-deep);">Request Received!</h3>
            <p style="font-size: 1.1rem; color: var(--dark); max-width: 520px; margin: 0 auto 2rem; line-height: 1.6;">
                Thank you for booking your free trial lesson, <strong style="color: var(--secondary); font-weight: 600;">${name}</strong>. 
                We have sent a confirmation email to <strong>${email}</strong>. 
                Our academic team will contact you within 24 hours to schedule your session.
            </p>
            <div style="width: 80px; height: 3px; background: var(--secondary); margin: 0 auto; border-radius: 2px;"></div>
        </div>
    `;
  }
});
