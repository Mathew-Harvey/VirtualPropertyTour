/* 
==================================
REALVISION3D - Main JavaScript
==================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeHeader();
  initializeMobileMenu();
  initializeTestimonials();
  initializeNewsletterForm();
  
  // Add page load animations
  animatePageLoad();
  
  // Initialize demo popup if needed
  if (document.querySelector('.hero-cta .btn-primary')) {
    initializeDemoPopup();
  }
});

/* === Header Functionality === */
function initializeHeader() {
  const header = document.querySelector('.header');
  
  // Handle header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Trigger once on page load to set initial state
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
}

/* === Mobile Menu === */
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  
  if (!mobileMenuToggle || !navList) return;
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navList.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-item a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('active') &&
      !e.target.closest('.nav-list') &&
      !e.target.closest('.mobile-menu-toggle')
    ) {
      mobileMenuToggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

/* === Testimonials Slider === */
function initializeTestimonials() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const prevButton = document.querySelector('.testimonial-prev');
  const nextButton = document.querySelector('.testimonial-next');
  
  if (!testimonialSlides.length) return;
  
  let currentSlide = 0;
  const totalSlides = testimonialSlides.length;
  
  // Set up auto-advance timer
  let slideInterval = setInterval(nextSlide, 7000);
  
  // Previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      clearInterval(slideInterval);
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
      slideInterval = setInterval(nextSlide, 7000);
    });
  }
  
  // Next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      clearInterval(slideInterval);
      nextSlide();
      slideInterval = setInterval(nextSlide, 7000);
    });
  }
  
  // Dot navigation
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      currentSlide = index;
      updateSlider();
      slideInterval = setInterval(nextSlide, 7000);
    });
  });
  
  // Next slide function
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }
  
  // Update slider display
  function updateSlider() {
    // Hide all slides
    testimonialSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show current slide
    testimonialSlides[currentSlide].classList.add('active');
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Initialize slider
  updateSlider();
}

/* === Newsletter Form === */
function initializeNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // In a real app, you would submit this to your backend
    // For demo purposes, we'll just show a success message
    
    // Simulate API response
    setTimeout(() => {
      showNotification('Thank you for subscribing to our newsletter!', 'success');
      emailInput.value = '';
    }, 800);
  });
  
  // Email validation function
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

/* === Demo Popup === */
function initializeDemoPopup() {
  const ctaButton = document.querySelector('.hero-cta .btn-primary');
  
  if (!ctaButton) return;
  
  ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Create demo modal
    const demoModal = document.createElement('div');
    demoModal.className = 'demo-modal';
    
    demoModal.innerHTML = `
      <div class="demo-modal-content">
        <button class="demo-close-btn">
          <i class="fas fa-times"></i>
        </button>
        <h2>Experience Our Virtual Tours</h2>
        <p>Select a property to explore in our interactive 3D environment:</p>
        <div class="demo-options">
          <div class="demo-option" data-tour="oceanfront">
            <img src="assets/images/property1.jpg" alt="Oceanfront Villa">
            <h3>Oceanfront Villa</h3>
            <span class="demo-badge">Featured</span>
          </div>
          <div class="demo-option" data-tour="penthouse">
            <img src="assets/images/property2.jpg" alt="Penthouse Suite">
            <h3>Penthouse Suite</h3>
            <span class="demo-badge">New</span>
          </div>
          <div class="demo-option" data-tour="mountain">
            <img src="assets/images/property3.jpg" alt="Mountain Retreat">
            <h3>Mountain Retreat</h3>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .demo-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease forwards;
      }
      
      .demo-modal-content {
        background-color: white;
        border-radius: 5px;
        max-width: 80rem;
        width: 90%;
        padding: 3rem;
        position: relative;
        animation: slideUp 0.5s ease forwards;
      }
      
      .demo-close-btn {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #333;
      }
      
      .demo-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .demo-option {
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
      }
      
      .demo-option:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-color: #d4af37;
      }
      
      .demo-option img {
        width: 100%;
        height: 15rem;
        object-fit: cover;
      }
      
      .demo-option h3 {
        padding: 1.5rem;
        margin: 0;
        font-size: 1.8rem;
        text-align: center;
      }
      
      .demo-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background-color: #d4af37;
        color: white;
        padding: 0.3rem 1rem;
        font-size: 1.2rem;
        border-radius: 3px;
      }
      
      @media (max-width: 768px) {
        .demo-options {
          grid-template-columns: 1fr;
        }
        
        .demo-modal-content {
          padding: 2rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(demoModal);
    document.body.style.overflow = 'hidden';
    
    // Close button
    const closeBtn = demoModal.querySelector('.demo-close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(demoModal);
      document.body.style.overflow = 'auto';
    });
    
    // Close on outside click
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        document.body.removeChild(demoModal);
        document.body.style.overflow = 'auto';
      }
    });
    
    // Demo options
    const demoOptions = demoModal.querySelectorAll('.demo-option');
    demoOptions.forEach(option => {
      option.addEventListener('click', () => {
        const tourId = option.getAttribute('data-tour');
        launchDemoTour(tourId);
        document.body.removeChild(demoModal);
        document.body.style.overflow = 'auto';
      });
    });
  });
}

// Launch demo tour
function launchDemoTour(tourId) {
  // In a real app, you would redirect to the actual tour page
  // For this demo, we'll just redirect to the portfolio detail page
  window.location.href = `portfolio-detail.html?id=${getTourId(tourId)}`;
  
  // Helper to convert tour name to ID
  function getTourId(tourName) {
    switch(tourName) {
      case 'oceanfront': return 1;
      case 'penthouse': return 2;
      case 'mountain': return 3;
      default: return 1;
    }
  }
}

/* === Page Load Animations === */
function animatePageLoad() {
  // Add animation class to elements
  const elementsToAnimate = document.querySelectorAll('.process-card, .benefit-item, .property-card');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.2 });
  
  // Observe elements
  elementsToAnimate.forEach((element, index) => {
    // Set delay based on index
    element.style.transitionDelay = `${0.1 * (index % 4)}s`;
    
    // Add base animation styles
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    // Observe the element
    observer.observe(element);
  });
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
  `;
  
  document.head.appendChild(style);
}

/* === Utility Functions === */
// Show notification
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Show notification
  notification.classList.add('show');
  
  // Hide after delay
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add loading indicator for page transitions
window.addEventListener('beforeunload', () => {
  // Create loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  
  // Add to body
  document.body.appendChild(loadingOverlay);
});