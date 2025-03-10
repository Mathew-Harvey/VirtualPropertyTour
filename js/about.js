/* 
=======================================
LUXE ESTATES - About Page JavaScript
=======================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize testimonials slider
    initializeTestimonialsSlider();
  });
  
  /* === Testimonials Slider === */
  function initializeTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Initialize slider
    updateSlider();
    
    // Previous slide button
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    });
    
    // Next slide button
    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
      });
    });
    
    // Auto-advance slides
    let slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }, 7000);
    
    // Pause auto-advance on hover
    const slider = document.querySelector('.testimonials-slider');
    slider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
      }, 7000);
    });
    
    // Update slider state
    function updateSlider() {
      // Hide all slides
      slides.forEach(slide => {
        slide.classList.remove('active');
      });
      
      // Show current slide
      slides[currentSlide].classList.add('active');
      
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
  }
  
  /* === Animation on Scroll === */
  // Add animation to elements when they come into view
  document.addEventListener('DOMContentLoaded', () => {
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Animate children elements with delay
          const children = entry.target.querySelectorAll('.animate-on-scroll');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('in-view');
            }, 200 * index);
          });
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible
    
    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
      
      // Add animation class to elements that should animate
      const headings = section.querySelectorAll('h2, h3');
      headings.forEach(heading => {
        heading.classList.add('animate-on-scroll');
      });
      
      // Add animation to other elements
      const animatedElements = section.querySelectorAll('.leadership-card, .value-item, .mission-list li, .partner-item, .technology-features li');
      animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
      });
    });
  });
  
  // Add animation styles
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Animation Base */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate-on-scroll.in-view {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Section Animation */
      section {
        transition: opacity 0.8s ease;
      }
      
      section:not(.in-view) {
        opacity: 0.6;
      }
      
      /* Element-specific animations */
      .mission-list li.animate-on-scroll {
        transform: translateX(-20px);
      }
      
      .mission-list li.animate-on-scroll.in-view {
        transform: translateX(0);
      }
      
      .value-item.animate-on-scroll,
      .leadership-card.animate-on-scroll,
      .partner-item.animate-on-scroll {
        transform: translateY(30px);
      }
      
      /* Staggered animation for lists */
      .technology-features li.animate-on-scroll:nth-child(odd) {
        transform: translateX(-20px);
      }
      
      .technology-features li.animate-on-scroll:nth-child(even) {
        transform: translateX(20px);
      }
      
      .technology-features li.animate-on-scroll.in-view {
        transform: translateX(0);
      }
    `;
    
    document.head.appendChild(style);
  });