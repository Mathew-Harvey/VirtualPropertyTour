/* 
==========================================
LUXE ESTATES - Property Detail JavaScript
==========================================
*/

document.addEventListener('DOMContentLoaded', function() {
  console.log('Property detail page initialized');
  
  // Initialize all components
  initializeGallery();
  initializeTabs();
  initializeFloorPlanTabs();
  initializeShareButton();
  initializeTourForm();
  initializeFavoriteToggle();
  
  // Set up the Unreal Engine placeholder
  setupUnrealPlaceholder();
  
  // Initialize virtual tour functionality
  initializeVirtualTour();
});

/**
 * Initialize the property image gallery
 */
function initializeGallery() {
  const galleryMain = document.querySelector('.gallery-main img');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb img');
  const viewAllPhotosBtn = document.querySelector('.view-all-photos');
  
  if (!galleryMain || !galleryThumbs.length) return;
  
  // Set up thumbnail click events
  galleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      // Update main image
      galleryMain.src = thumb.src.replace('-thumb', '-large');
      galleryMain.alt = thumb.alt;
      
      // Update active thumb
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.parentElement.classList.add('active');
    });
    
    // Set first thumb as active by default
    if (index === 0) {
      thumb.parentElement.classList.add('active');
    }
  });
  
  // Set up view all photos button
  if (viewAllPhotosBtn) {
    viewAllPhotosBtn.addEventListener('click', openPhotoGallery);
  }
}

/**
 * Open full-screen photo gallery
 */
function openPhotoGallery() {
  // Create gallery overlay
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  
  // Get all property images
  const mainImg = document.querySelector('.gallery-main img');
  const thumbImgs = document.querySelectorAll('.gallery-thumb img');
  const allImages = [];
  
  // Add main image
  allImages.push({
    src: mainImg.src,
    alt: mainImg.alt
  });
  
  // Add all thumb images as full-size
  thumbImgs.forEach(img => {
    allImages.push({
      src: img.src.replace('-thumb', '-large'),
      alt: img.alt
    });
  });
  
  // Create gallery HTML
  let galleryHTML = `
    <div class="gallery-fullscreen">
      <button class="gallery-close"><i class="fas fa-times"></i></button>
      <div class="gallery-container">
        <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
        <div class="gallery-image-container">
          <img src="${allImages[0].src}" alt="${allImages[0].alt}" class="gallery-current-image">
          <div class="image-count">1 / ${allImages.length}</div>
        </div>
        <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="gallery-thumbnails">
  `;
  
  // Add thumbnails
  allImages.forEach((img, index) => {
    galleryHTML += `
      <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}">
        <img src="${img.src}" alt="${img.alt}" data-index="${index}">
      </div>
    `;
  });
  
  galleryHTML += `
      </div>
    </div>
  `;
  
  overlay.innerHTML = galleryHTML;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  
  // Set up gallery controls
  let currentIndex = 0;
  const galleryImage = overlay.querySelector('.gallery-current-image');
  const imageCount = overlay.querySelector('.image-count');
  
  // Gallery navigation
  function navigateGallery(direction) {
    currentIndex = (currentIndex + direction + allImages.length) % allImages.length;
    galleryImage.src = allImages[currentIndex].src;
    galleryImage.alt = allImages[currentIndex].alt;
    imageCount.textContent = `${currentIndex + 1} / ${allImages.length}`;
    
    // Update active thumbnail
    overlay.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Set up event listeners
  overlay.querySelector('.gallery-close').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // Restore scrolling
  });
  
  overlay.querySelector('.gallery-prev').addEventListener('click', () => navigateGallery(-1));
  overlay.querySelector('.gallery-next').addEventListener('click', () => navigateGallery(1));
  
  // Thumbnail clicks
  overlay.querySelectorAll('.gallery-thumbnail img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentIndex = parseInt(thumb.dataset.index);
      navigateGallery(0);
    });
  });
  
  // Keyboard navigation
  window.addEventListener('keydown', handleKeyNavigation);
  
  function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
      navigateGallery(1);
    } else if (e.key === 'Escape') {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyNavigation);
    }
  }
  
  // Update gallery position on resize
  window.addEventListener('resize', updateGalleryPosition);
  
  function updateGalleryPosition() {
    const container = overlay.querySelector('.gallery-container');
    container.style.height = `${window.innerHeight * 0.8}px`;
  }
  
  // Initial call to set position
  updateGalleryPosition();
}

/**
 * Initialize the virtual tour and interactive features
 */
function initializeVirtualTour() {
  const tourContainer = document.querySelector('.virtual-tour-container');
  if (!tourContainer) return;
  
  const floorSelector = tourContainer.querySelector('.floor-selector');
  const hotspots = tourContainer.querySelectorAll('.hotspot');
  const roomDetailPanel = tourContainer.querySelector('.room-detail-panel');
  const unrealContainer = tourContainer.querySelector('.unreal-container');
  const rotateLeftBtn = tourContainer.querySelector('.rotate-left-btn');
  const rotateRightBtn = tourContainer.querySelector('.rotate-right-btn');
  const zoomInBtn = tourContainer.querySelector('.zoom-in-btn');
  const zoomOutBtn = tourContainer.querySelector('.zoom-out-btn');
  const fullscreenBtn = tourContainer.querySelector('.tour-fullscreen-btn');
  const tourControls = tourContainer.querySelector('.tour-controls');
  
  let currentFloor = '1';
  let isFullscreen = false;
  let rotation = 0;
  let zoomLevel = 1;
  
  // Virtual model properties for simulation
  const simulatedModel = {
    rotation: 0,
    zoom: 1,
    floor: '1'
  };
  
  // Initialize simulated 3D model
  initializeSimulatedModel();
  
  // Floor selector change event
  if (floorSelector) {
    floorSelector.addEventListener('change', function() {
      currentFloor = this.value;
      loadFloor(currentFloor);
      simulatedModel.floor = currentFloor;
      updateTourView();
    });
  }
  
  // Hotspot click events
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', function() {
      const roomId = this.dataset.room;
      const roomName = this.dataset.name;
      showRoomDetail(roomId, roomName);
    });
  });
  
  // Close room detail panel
  if (roomDetailPanel) {
    const closeBtn = roomDetailPanel.querySelector('.close-panel-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        roomDetailPanel.classList.remove('show');
      });
    }
  }
  
  // Rotation controls
  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      simulatedModel.rotation -= 30;
      updateTourView();
    });
  }
  
  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      simulatedModel.rotation += 30;
      updateTourView();
    });
  }
  
  // Zoom controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      simulatedModel.zoom = Math.min(simulatedModel.zoom + 0.2, 2.5);
      updateTourView();
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      simulatedModel.zoom = Math.max(simulatedModel.zoom - 0.2, 0.5);
      updateTourView();
    });
  }
  
  // Fullscreen toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      isFullscreen = !isFullscreen;
      tourContainer.classList.toggle('fullscreen', isFullscreen);
      tourControls.classList.toggle('fullscreen', isFullscreen);
      fullscreenBtn.innerHTML = isFullscreen ? 
        '<i class="fas fa-compress"></i>' : 
        '<i class="fas fa-expand"></i>';
      
      // Update the model view size
      updateTourView();
    });
  }
  
  // Update the 3D tour view
  function updateTourView() {
    const simulated3dView = document.querySelector('.simulated-3d-view');
    if (simulated3dView) {
      const simulatedModel = simulated3dView.querySelector('.simulated-model');
      simulatedModel.style.transform = `rotateY(${rotation}deg) scale(${zoomLevel})`;
    }
  }
  
  // Load floor based on floor number
  function loadFloor(floorNumber) {
    // Hide all hotspots
    hotspots.forEach(hotspot => {
      hotspot.classList.add('hidden');
    });
    
    // Show only hotspots for the selected floor
    const floorHotspots = tourContainer.querySelectorAll(`.hotspot[data-floor="${floorNumber}"]`);
    floorHotspots.forEach(hotspot => {
      hotspot.classList.remove('hidden');
    });
    
    console.log(`Loaded floor ${floorNumber}`);
    
    // In a real implementation, this would load the appropriate 3D model
    // For now, we'll just update our simulated view
    const modelDivs = document.querySelectorAll('.simulated-model div');
    if (modelDivs.length) {
      // Change the color based on the floor
      const colors = {
        '1': 'rgba(64, 128, 255, 0.5)',  // Blue for first floor
        '2': 'rgba(64, 255, 128, 0.5)',  // Green for second floor
        '3': 'rgba(255, 128, 64, 0.5)'   // Orange for basement
      };
      
      modelDivs.forEach(div => {
        div.style.backgroundColor = colors[floorNumber] || colors['1'];
      });
    }
  }
  
  // Show room detail panel
  function showRoomDetail(roomId, roomName) {
    if (!roomDetailPanel) return;
    
    // Get room details - in a real app, this might come from an API
    const roomDetails = {
      'living': {
        title: 'Living Room',
        description: 'The spacious living room features floor-to-ceiling windows with panoramic ocean views, a fireplace, and custom Italian furniture. The room measures 22\' x 28\' with 12\' ceilings.'
      },
      'kitchen': {
        title: 'Gourmet Kitchen',
        description: 'This chef\'s kitchen includes top-of-the-line appliances, dual islands, custom cabinetry, and a butler\'s pantry. The kitchen measures 20\' x 24\' and opens to the family room.'
      },
      'dining': {
        title: 'Formal Dining Room',
        description: 'The elegant dining room accommodates 12 guests comfortably with custom lighting and direct access to the butler\'s pantry. The room measures 18\' x 20\'.'
      },
      'master': {
        title: 'Master Suite',
        description: 'The luxurious master suite features a private terrace, sitting area, dual walk-in closets, and a spa-like bathroom with soaking tub and rainfall shower. The bedroom measures 24\' x 26\'.'
      },
      'bedroom2': {
        title: 'Guest Bedroom',
        description: 'This well-appointed guest bedroom includes a private bathroom, walk-in closet, and balcony with ocean views. The room measures 16\' x 18\'.'
      },
      'cinema': {
        title: 'Home Cinema',
        description: 'The state-of-the-art home theater features 4K projection, premium surround sound, custom seating for 12, and sound-dampening walls. The room measures 20\' x 24\'.'
      },
      'wine': {
        title: 'Wine Cellar',
        description: 'The climate-controlled wine cellar has capacity for over 500 bottles, custom racking, tasting area, and additional storage for spirits. The room measures 12\' x 16\'.'
      }
    };
    
    const roomInfo = roomDetails[roomId] || {
      title: roomName || 'Room Details',
      description: 'Detailed information about this room is not available.'
    };
    
    // Update panel content
    roomDetailPanel.querySelector('.room-title').textContent = roomInfo.title;
    roomDetailPanel.querySelector('.room-detail-content').innerHTML = `<p>${roomInfo.description}</p>`;
    
    // Show the panel
    roomDetailPanel.classList.add('show');
  }
}

/**
 * Set up the Unreal Engine placeholder before the actual connection
 */
function setupUnrealPlaceholder() {
  const unrealContainer = document.querySelector('.unreal-container');
  if (!unrealContainer) return;
  
  const placeholder = document.createElement('div');
  placeholder.className = 'unreal-placeholder';
  placeholder.innerHTML = `
    <div class="placeholder-content">
      <h3>Interactive 3D Tour</h3>
      <p>Connect to our visualization server to explore this property in detailed 3D</p>
      <div class="placeholder-loader">
        <div class="loader-animation"></div>
      </div>
      <button class="btn btn-primary connect-unreal-btn">Start 3D Tour</button>
    </div>
  `;
  
  unrealContainer.appendChild(placeholder);
  
  // Set up connect button
  const connectBtn = placeholder.querySelector('.connect-unreal-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      // Show loading animation
      placeholder.querySelector('.loader-animation').classList.add('active');
      connectBtn.disabled = true;
      connectBtn.textContent = 'Connecting...';
      
      // Simulate connection to Unreal Engine server
      simulateUnrealConnection(unrealContainer, placeholder);
    });
  }
}

/**
 * Simulate connecting to Unreal Engine server
 * In a real implementation, this would establish a WebRTC connection
 */
function simulateUnrealConnection(container, placeholder) {
  // Simulate loading delay
  setTimeout(() => {
    // Remove placeholder
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
    
    // Create a simulated 3D view for demonstration
    const simulatedView = document.createElement('div');
    simulatedView.className = 'simulated-3d-view';
    simulatedView.innerHTML = `
      <div class="simulated-3d-scene">
        <div class="simulated-model">
          <div class="model-front">Front</div>
          <div class="model-back">Back</div>
          <div class="model-left">Left</div>
          <div class="model-right">Right</div>
          <div class="model-top">Top</div>
          <div class="model-bottom">Bottom</div>
        </div>
      </div>
      <div class="simulated-controls">
        <div class="control-message">
          <p>This is a simulated 3D view for demonstration purposes.<br>In the actual implementation, this would be an Unreal Engine WebRTC stream.</p>
        </div>
      </div>
    `;
    
    container.appendChild(simulatedView);
    
    // Display message
    showNotification('3D tour loaded successfully! Use the controls to navigate.', 'success');
    
  }, 2500); // Simulated 2.5 second loading time
}

/**
 * Initialize a simulated 3D model for demonstration purposes
 * This is a placeholder for the actual Unreal Engine integration
 */
function initializeSimulatedModel() {
  // This function would set up WebRTC connection to Unreal Engine server
  // For demonstration, we're using CSS 3D transforms to simulate a model
  
  console.log('Simulated 3D model initialized');
  
  // In a real implementation:
  // 1. Establish WebRTC connection to Unreal Engine server
  // 2. Set up input handling to send commands to the server
  // 3. Receive video stream from the server
  // 4. Handle connection events, reconnection, etc.
}

/**
 * Initialize the tabs for property details, amenities, etc.
 */
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (!tabButtons.length || !tabContents.length) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Remove active class from all buttons and content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and target content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

/**
 * Initialize floor plan tabs
 */
function initializeFloorPlanTabs() {
  const floorPlanTabs = document.querySelectorAll('.floor-plan-tab');
  const floorPlanItems = document.querySelectorAll('.floor-plan-item');
  
  if (!floorPlanTabs.length || !floorPlanItems.length) return;
  
  floorPlanTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetFloor = tab.dataset.floor;
      
      // Remove active class from all tabs and items
      floorPlanTabs.forEach(t => t.classList.remove('active'));
      floorPlanItems.forEach(item => item.classList.remove('active'));
      
      // Add active class to clicked tab and target item
      tab.classList.add('active');
      document.querySelector(`.floor-plan-item[data-floor="${targetFloor}"]`).classList.add('active');
    });
  });
}

/**
 * Initialize share button functionality
 */
function initializeShareButton() {
  const shareBtn = document.querySelector('.share-btn');
  if (!shareBtn) return;
  
  shareBtn.addEventListener('click', () => {
    // Get current URL
    const url = window.location.href;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url
      })
      .then(() => console.log('Shared successfully'))
      .catch(err => {
        console.warn('Error sharing:', err);
        showShareFallback(url);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      showShareFallback(url);
    }
  });
}

/**
 * Show fallback share options
 */
function showShareFallback(url) {
  // Create share modal
  const modal = document.createElement('div');
  modal.className = 'share-modal';
  modal.innerHTML = `
    <div class="share-modal-content">
      <button class="share-modal-close"><i class="fas fa-times"></i></button>
      <h3>Share This Property</h3>
      <div class="share-options">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-option facebook">
          <i class="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </a>
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(document.title)}" target="_blank" class="share-option twitter">
          <i class="fab fa-twitter"></i>
          <span>Twitter</span>
        </a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}" target="_blank" class="share-option linkedin">
          <i class="fab fa-linkedin-in"></i>
          <span>LinkedIn</span>
        </a>
        <a href="mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent('Check out this property: ' + url)}" class="share-option email">
          <i class="fas fa-envelope"></i>
          <span>Email</span>
        </a>
      </div>
      <div class="share-link">
        <p>Or copy the link:</p>
        <div class="copy-link-container">
          <input type="text" value="${url}" readonly>
          <button class="copy-link-btn"><i class="fas fa-copy"></i></button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close button
  const closeBtn = modal.querySelector('.share-modal-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Copy link button
  const copyBtn = modal.querySelector('.copy-link-btn');
  const linkInput = modal.querySelector('input');
  
  copyBtn.addEventListener('click', () => {
    linkInput.select();
    document.execCommand('copy');
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
  });
  
  // Close when clicking outside the modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Initialize the tour scheduling form
 */
function initializeTourForm() {
  const tourForm = document.querySelector('.tour-form');
  if (!tourForm) return;
  
  tourForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = tourForm.querySelector('#tour-name').value;
    const email = tourForm.querySelector('#tour-email').value;
    const phone = tourForm.querySelector('#tour-phone').value;
    const tourType = tourForm.querySelector('#tour-type').value;
    const date = tourForm.querySelector('#tour-date').value;
    const time = tourForm.querySelector('#tour-time').value;
    const message = tourForm.querySelector('#tour-message').value;
    
    // Validate form (simple validation)
    if (!name || !email || !phone || !date) {
      showNotification('Please fill out all required fields.', 'error');
      return;
    }
    
    // In a real implementation, we would submit the form data to a server
    // For demo purposes, we'll just show a success message
    
    // Clear form
    tourForm.reset();
    
    // Show success message
    showTourConfirmation();
  });
}

/**
 * Show tour confirmation message
 */
function showTourConfirmation() {
  const formContainer = document.querySelector('.schedule-tour-form');
  if (!formContainer) return;
  
  // Store original content to restore later
  const originalContent = formContainer.innerHTML;
  
  // Replace with confirmation message
  formContainer.innerHTML = `
    <div class="tour-confirmation">
      <div class="confirmation-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3>Tour Request Received!</h3>
      <p>Thank you for scheduling a tour of this property. Our representative will contact you within 24 hours to confirm your appointment.</p>
      <p>A confirmation email has been sent to your inbox with the details of your request.</p>
      <button class="btn btn-primary new-request-btn">Request Another Tour</button>
    </div>
  `;
  
  // Set up button to restore form
  const newRequestBtn = formContainer.querySelector('.new-request-btn');
  if (newRequestBtn) {
    newRequestBtn.addEventListener('click', () => {
      formContainer.innerHTML = originalContent;
      initializeTourForm(); // Re-initialize the form
    });
  }
}

/**
 * Handle favorite toggle functionality
 */
function initializeFavoriteToggle() {
  const favoriteBtn = document.querySelector('.favorite-btn');
  if (!favoriteBtn) return;
  
  // Check if this property is already in favorites
  const propertyId = getPropertyIdFromUrl();
  const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
  const isFavorite = favorites.includes(propertyId);
  
  // Update button state
  if (isFavorite) {
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
    favoriteBtn.classList.add('active');
  }
  
  // Toggle favorite status
  favoriteBtn.addEventListener('click', () => {
    const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
    const index = favorites.indexOf(propertyId);
    
    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
      favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Save';
      favoriteBtn.classList.remove('active');
      showNotification('Removed from favorites', 'info');
    } else {
      // Add to favorites
      favorites.push(propertyId);
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Saved';
      favoriteBtn.classList.add('active');
      showNotification('Added to favorites', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
  });
}

/**
 * Get property ID from URL query parameter
 */
function getPropertyIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || '1'; // Default to '1' if not specified
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Add active class after a small delay (for animation)
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Set up close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300); // Match transition duration
  });
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove('active');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}