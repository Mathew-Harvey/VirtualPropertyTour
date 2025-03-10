/* 
=============================================
REALVISION3D - Services Page JavaScript
=============================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeFAQs();
    initializeCalculator();
  });
  
  /* === FAQ Accordion === */
  function initializeFAQs() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        // Toggle active class for this question
        question.classList.toggle('active');
        
        // Toggle answer visibility
        const answer = question.nextElementSibling;
        answer.classList.toggle('active');
        
        // Toggle icon
        const icon = question.querySelector('.faq-icon i');
        if (answer.classList.contains('active')) {
          icon.className = 'fas fa-minus';
        } else {
          icon.className = 'fas fa-plus';
        }
      });
    });
  }
  
  /* === Pricing Calculator === */
  function initializeCalculator() {
    const calculateBtn = document.querySelector('.calculate-btn');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateEstimate);
    
    // Also calculate when input values change
    const inputs = document.querySelectorAll('.calculator-form input, .calculator-form select');
    inputs.forEach(input => {
      input.addEventListener('change', calculateEstimate);
    });
    
    // Initial calculation
    calculateEstimate();
  }
  
  // Calculate price estimate based on inputs
  function calculateEstimate() {
    // Get form values
    const size = parseFloat(document.getElementById('property-size').value) || 0;
    const propertyType = document.getElementById('property-type').value;
    const rooms = parseInt(document.getElementById('rooms').value) || 0;
    const turnaround = document.getElementById('turnaround').value;
    const addons = Array.from(document.querySelectorAll('input[name="addons"]:checked')).map(el => el.value);
    
    // Base price calculation
    let basePrice = 0;
    
    // Calculate based on property size and type
    if (propertyType === 'residential') {
      if (size <= 2500) {
        basePrice = 1499;
      } else if (size <= 5000) {
        basePrice = 2499;
      } else {
        basePrice = 4999;
      }
    } else if (propertyType === 'commercial') {
      if (size <= 3000) {
        basePrice = 2999;
      } else if (size <= 7000) {
        basePrice = 4999;
      } else {
        basePrice = 7999;
      }
    } else if (propertyType === 'luxury') {
      if (size <= 3000) {
        basePrice = 3999;
      } else if (size <= 7000) {
        basePrice = 5999;
      } else {
        basePrice = 9999;
      }
    }
    
    // Adjust for number of rooms (if outside standard range)
    const standardRoomsBySize = {
      residential: { small: 8, medium: 15, large: 25 },
      commercial: { small: 10, medium: 20, large: 30 },
      luxury: { small: 12, medium: 25, large: 35 }
    };
    
    let standardRooms;
    if (size <= 2500) {
      standardRooms = standardRoomsBySize[propertyType].small;
    } else if (size <= 5000) {
      standardRooms = standardRoomsBySize[propertyType].medium;
    } else {
      standardRooms = standardRoomsBySize[propertyType].large;
    }
    
    if (rooms > standardRooms) {
      const extraRooms = rooms - standardRooms;
      basePrice += extraRooms * 100; // $100 per extra room
    }
    
    // Turnaround time adjustments
    if (turnaround === 'priority') {
      basePrice *= 1.25; // 25% rush fee
    } else if (turnaround === 'rush') {
      basePrice *= 1.5; // 50% rush fee
    }
    
    // Add prices for additional services
    let addonPrice = 0;
    addons.forEach(addon => {
      switch (addon) {
        case 'photography':
          addonPrice += 399;
          break;
        case 'staging':
          // Charge per room, estimate 3 key rooms for staging
          addonPrice += 299 * 3;
          break;
        case 'floorplan':
          addonPrice += 199;
          break;
        case 'video':
          addonPrice += 699;
          break;
      }
    });
    
    // Total price
    const totalPrice = basePrice + addonPrice;
    
    // Update price estimate display
    const priceElement = document.querySelector('.price-estimate');
    priceElement.textContent = `$${totalPrice.toLocaleString()}`;
    
    // Show/hide note based on complexity
    const noteElement = document.querySelector('.estimate-note');
    if (size > 10000 || rooms > 30 || addons.length > 2) {
      noteElement.textContent = "This is a complex project. Contact us for a personalized quote.";
    } else {
      noteElement.textContent = "This is an estimate only. Contact us for an accurate quote.";
    }
  }
  
  /* === Animation on Scroll === */
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
            }, 100 * index);
          });
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
    
    // Observe all sections
    sections.forEach(section => {
      observer.observe(section);
      
      // Add animation class to package cards
      const cards = section.querySelectorAll('.package-card, .process-step, .service-card');
      cards.forEach(card => {
        card.classList.add('animate-on-scroll');
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
      
      /* Process Steps Animation */
      .process-step.animate-on-scroll {
        transform: translateX(-20px);
      }
      
      .process-step.animate-on-scroll.in-view {
        transform: translateX(0);
      }
      
      /* Staggered animation for cards */
      .package-card.animate-on-scroll:nth-child(2) {
        transition-delay: 0.1s;
      }
      
      .package-card.animate-on-scroll:nth-child(3) {
        transition-delay: 0.2s;
      }
      
      .service-card.animate-on-scroll {
        transition-delay: calc(0.1s * var(--i, 0));
      }
    `;
    
    document.head.appendChild(style);
    
    // Set index for service cards for staggered animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      card.style.setProperty('--i', index);
    });
  });