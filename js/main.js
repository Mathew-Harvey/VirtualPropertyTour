/* 
==================================
LUXE ESTATES - Main JavaScript
==================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeHeader();
    initializeMobileMenu();
    initializePropertyCards();
    initializeNewsletterForm();
    
    // If on property details page, initialize virtual tour
    if (document.querySelector('.virtual-tour-container')) {
      initializeVirtualTour();
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
  
  /* === Property Cards === */
  function initializePropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    const favoriteButtons = document.querySelectorAll('.property-favorite');
    
    // Add hover effect for property cards
    propertyCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });
    
    // Handle favorite toggle
    favoriteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const icon = button.querySelector('i');
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
        
        // In a real app, you would save this to user preferences
        const propertyId = button.closest('.property-card').dataset.id;
        toggleFavoriteProperty(propertyId);
      });
    });
  }
  
  // Simulated function to toggle property favorites (would connect to backend in real app)
  function toggleFavoriteProperty(propertyId) {
    console.log(`Property ${propertyId} favorite status toggled`);
    // In a real app: API call to save user preferences
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
      
      // In a real app, you would submit this to your backend
      subscribeToNewsletter(email)
        .then(() => {
          showNotification('Thank you for subscribing!', 'success');
          emailInput.value = '';
        })
        .catch(error => {
          showNotification('There was an error. Please try again.', 'error');
          console.error('Newsletter subscription error:', error);
        });
    });
  }
  
  // Simulated API call for newsletter subscription
  function subscribeToNewsletter(email) {
    // Simulating API response with a promise
    return new Promise((resolve) => {
      console.log(`Email ${email} subscribed to newsletter`);
      setTimeout(resolve, 1000); // Simulate network delay
    });
  }
  
  /* === Virtual Tour Functionality === */
  function initializeVirtualTour() {
    // Elements
    const container = document.querySelector('.virtual-tour-container');
    const fullscreenBtn = document.querySelector('.tour-fullscreen-btn');
    const tourControls = document.querySelector('.tour-controls');
    const rotateLeftBtn = document.querySelector('.rotate-left-btn');
    const rotateRightBtn = document.querySelector('.rotate-right-btn');
    const zoomInBtn = document.querySelector('.zoom-in-btn');
    const zoomOutBtn = document.querySelector('.zoom-out-btn');
    const floorSelector = document.querySelector('.floor-selector');
    const hotspots = document.querySelectorAll('.hotspot');
    
    // State
    let isFullscreen = false;
    let currentRotation = 0;
    let currentZoom = 1;
    let currentFloor = 1;
    
    // Toggle fullscreen mode
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!isFullscreen) {
          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
          } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      });
      
      // Update fullscreen state
      document.addEventListener('fullscreenchange', updateFullscreenState);
      document.addEventListener('webkitfullscreenchange', updateFullscreenState);
      document.addEventListener('msfullscreenchange', updateFullscreenState);
      
      function updateFullscreenState() {
        isFullscreen = !!document.fullscreenElement;
        
        if (isFullscreen) {
          fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          tourControls.classList.add('fullscreen');
        } else {
          fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          tourControls.classList.remove('fullscreen');
        }
      }
    }
    
    // Rotation controls
    if (rotateLeftBtn && rotateRightBtn) {
      rotateLeftBtn.addEventListener('click', () => {
        currentRotation -= 45;
        updateTourView();
      });
      
      rotateRightBtn.addEventListener('click', () => {
        currentRotation += 45;
        updateTourView();
      });
    }
    
    // Zoom controls
    if (zoomInBtn && zoomOutBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 2) {
          currentZoom += 0.1;
          updateTourView();
        }
      });
      
      zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 0.5) {
          currentZoom -= 0.1;
          updateTourView();
        }
      });
    }
    
    // Floor selector
    if (floorSelector) {
      floorSelector.addEventListener('change', () => {
        currentFloor = parseInt(floorSelector.value);
        loadFloor(currentFloor);
      });
    }
    
    // Hotspot interaction
    if (hotspots.length > 0) {
      hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
          const roomId = hotspot.dataset.room;
          const roomName = hotspot.dataset.name;
          showRoomDetail(roomId, roomName);
        });
      });
    }
    
    // Update the 3D view based on current state
    function updateTourView() {
      const tourScene = document.querySelector('.tour-scene');
      if (!tourScene) return;
      
      tourScene.style.transform = `rotateY(${currentRotation}deg) scale(${currentZoom})`;
    }
    
    // Load a different floor
    function loadFloor(floorNumber) {
      console.log(`Loading floor ${floorNumber}`);
      // In a real implementation, this would change the 3D model or scene
      
      // Hide all floor-specific elements
      document.querySelectorAll('[data-floor]').forEach(el => {
        el.classList.add('hidden');
      });
      
      // Show elements for the current floor
      document.querySelectorAll(`[data-floor="${floorNumber}"]`).forEach(el => {
        el.classList.remove('hidden');
      });
      
      // Reset view
      currentRotation = 0;
      currentZoom = 1;
      updateTourView();
    }
    
    // Show room detail panel
    function showRoomDetail(roomId, roomName) {
      const detailPanel = document.querySelector('.room-detail-panel');
      if (!detailPanel) return;
      
      // Update content
      detailPanel.querySelector('.room-title').textContent = roomName;
      
      // Show the panel
      detailPanel.classList.remove('hidden');
      
      // In a real implementation, you would load room-specific details via AJAX
      console.log(`Showing details for room: ${roomId} (${roomName})`);
    }
    
    // Initialize with first floor
    if (floorSelector) {
      loadFloor(currentFloor);
    }
    
    // Set up placeholder for Unreal Engine integration
    setupUnrealPlaceholder();
  }
  
  /* === Unreal Engine Integration Placeholder === */
  function setupUnrealPlaceholder() {
    const unrealContainer = document.querySelector('.unreal-container');
    if (!unrealContainer) return;
    
    // Show a message that this would connect to Unreal Engine
    const placeholderMsg = document.createElement('div');
    placeholderMsg.className = 'unreal-placeholder';
    placeholderMsg.innerHTML = `
      <div class="placeholder-content">
        <h3>Unreal Engine Integration</h3>
        <p>This area will connect to an Unreal Engine server to provide real-time 3D streaming.</p>
        <div class="placeholder-loader">
          <div class="loader-animation"></div>
          <span>Ready to connect...</span>
        </div>
      </div>
    `;
    
    unrealContainer.appendChild(placeholderMsg);
    
    // Add a simulated "Connect" button
    const connectBtn = document.createElement('button');
    connectBtn.className = 'btn btn-primary connect-unreal-btn';
    connectBtn.textContent = 'Simulate Connection';
    placeholderMsg.querySelector('.placeholder-content').appendChild(connectBtn);
    
    // Simulate connection when clicked
    connectBtn.addEventListener('click', () => {
      simulateUnrealConnection(unrealContainer, placeholderMsg);
    });
  }
  
  // Simulate connection to Unreal Engine
  function simulateUnrealConnection(container, placeholder) {
    // Show connecting state
    const loader = placeholder.querySelector('.placeholder-loader');
    loader.innerHTML = '<div class="loader-animation active"></div><span>Connecting to Unreal Engine server...</span>';
    
    // Hide the connect button
    placeholder.querySelector('.connect-unreal-btn').style.display = 'none';
    
    // Simulate loading delay
    setTimeout(() => {
      // Switch to the simulated view
      placeholder.style.display = 'none';
      
      // Create simulated 3D view
      const simulatedView = document.createElement('div');
      simulatedView.className = 'simulated-3d-view';
      simulatedView.innerHTML = `
        <div class="simulated-3d-scene">
          <div class="simulated-model">
            <div class="model-front"></div>
            <div class="model-back"></div>
            <div class="model-left"></div>
            <div class="model-right"></div>
            <div class="model-top"></div>
            <div class="model-bottom"></div>
          </div>
        </div>
        <div class="simulated-controls">
          <div class="control-message">
            <p>This is a simulated 3D view. In the actual implementation, this would be a live stream from Unreal Engine.</p>
          </div>
        </div>
      `;
      
      container.appendChild(simulatedView);
      
      // Make the model interactive with mouse
      initializeSimulatedModel();
      
    }, 3000); // 3 second simulated loading time
  }
  
  // Initialize the simulated 3D model
  function initializeSimulatedModel() {
    const model = document.querySelector('.simulated-model');
    if (!model) return;
    
    let isDragging = false;
    let startX, startY, rotX = 0, rotY = 0;
    
    // Mouse controls
    model.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      model.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      rotY += deltaX * 0.5;
      rotX += deltaY * 0.5;
      
      model.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      
      startX = e.clientX;
      startY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      model.style.cursor = 'grab';
    });
    
    // Initial style
    model.style.cursor = 'grab';
  }
  
  /* === Property Listing Page === */
  // This would be called on the property listing page
  function initializePropertyFilters() {
    const filterForm = document.querySelector('.property-filter-form');
    if (!filterForm) return;
    
    // Price range slider
    const priceSlider = document.querySelector('.price-range-slider');
    if (priceSlider) {
      // Implementation would depend on the specific slider library used
      // This is a placeholder for the functionality
      console.log('Price range slider initialized');
    }
    
    // Location filter
    const locationSelect = document.querySelector('#location-filter');
    if (locationSelect) {
      locationSelect.addEventListener('change', applyFilters);
    }
    
    // Property type filter
    const propertyTypeInputs = document.querySelectorAll('input[name="property-type"]');
    propertyTypeInputs.forEach(input => {
      input.addEventListener('change', applyFilters);
    });
    
    // Apply filters when form is submitted
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
    
    // Reset filters
    const resetBtn = document.querySelector('.filter-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        filterForm.reset();
        applyFilters();
      });
    }
    
    // Apply filters and update property listing
    function applyFilters() {
      // Get all filter values
      const filters = {
        location: locationSelect ? locationSelect.value : null,
        propertyTypes: Array.from(propertyTypeInputs)
          .filter(input => input.checked)
          .map(input => input.value),
        // Add other filters as needed
      };
      
      console.log('Applying filters:', filters);
      
      // In a real implementation, this would make an AJAX request to the backend
      // or filter the properties client-side
      
      // For now, let's just show a loading indicator
      const propertyGrid = document.querySelector('.property-grid');
      if (propertyGrid) {
        propertyGrid.classList.add('loading');
        
        // Simulate loading delay
        setTimeout(() => {
          propertyGrid.classList.remove('loading');
          // In a real app, this is where you would update the property cards
        }, 800);
      }
    }
  }
  
  /* === Utility Functions === */
  // Show notification message
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
  
  // Function to get URL parameters (for property detail page)
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }