/* 
==========================================
LUXE ESTATES - Property Detail JavaScript
==========================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all property detail components
    initializeGallery();
    initializeTabs();
    initializeFloorPlanTabs();
    initializeShareButton();
    initializeTourForm();
    
    // Initialize the close button for room detail panel
    const closeRoomPanelBtn = document.querySelector('.close-panel-btn');
    if (closeRoomPanelBtn) {
      closeRoomPanelBtn.addEventListener('click', () => {
        document.querySelector('.room-detail-panel').classList.remove('show');
      });
    }
  });
  
  /* === Property Gallery === */
  function initializeGallery() {
    const mainImage = document.querySelector('.gallery-main img');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const viewAllPhotosBtn = document.querySelector('.view-all-photos');
    
    // Handle thumbnail clicks to change main image
    thumbs.forEach((thumb, index) => {
      // Add active class to first thumb
      if (index === 0) {
        thumb.classList.add('active');
      }
      
      thumb.addEventListener('click', () => {
        // Update active class
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Update main image
        const imgSrc = thumb.querySelector('img').src;
        mainImage.src = imgSrc;
        
        // Animate image change
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.style.opacity = '1';
        }, 300);
      });
    });
    
    // View all photos functionality
    if (viewAllPhotosBtn) {
      viewAllPhotosBtn.addEventListener('click', openPhotoGallery);
    }
  }
  
  // Open full photo gallery
  function openPhotoGallery() {
    // Create gallery overlay
    const galleryOverlay = document.createElement('div');
    galleryOverlay.className = 'gallery-overlay';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-close-btn';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(galleryOverlay);
      document.body.style.overflow = 'auto';
    });
    
    // Gallery container
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';
    
    // Fetch all property images (in a real app, these would come from an API)
    const images = [
      'assets/images/property1-large.jpg',
      'assets/images/property1-thumb1.jpg',
      'assets/images/property1-thumb2.jpg',
      'assets/images/property1-thumb3.jpg',
      'assets/images/property1-thumb4.jpg',
      // Add more images here (in a real app)
    ];
    
    // Create gallery items
    images.forEach(src => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Property image';
      
      item.appendChild(img);
      galleryContainer.appendChild(item);
    });
    
    // Navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav gallery-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav gallery-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Add all elements to the overlay
    galleryOverlay.appendChild(closeBtn);
    galleryOverlay.appendChild(prevBtn);
    galleryOverlay.appendChild(galleryContainer);
    galleryOverlay.appendChild(nextBtn);
    
    // Add overlay to the body
    document.body.appendChild(galleryOverlay);
    document.body.style.overflow = 'hidden';
    
    // Initialize gallery navigation
    let currentIndex = 0;
    
    // Show first image
    updateGalleryPosition();
    
    // Event listeners for navigation
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateGalleryPosition();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateGalleryPosition();
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    function handleKeyNavigation(e) {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGalleryPosition();
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        updateGalleryPosition();
      } else if (e.key === 'Escape') {
        document.body.removeChild(galleryOverlay);
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleKeyNavigation);
      }
    }
    
    // Update gallery position based on current index
    function updateGalleryPosition() {
      galleryContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Add CSS for gallery overlay
    const style = document.createElement('style');
    style.textContent = `
      .gallery-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .gallery-close-btn {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 10000;
      }
      
      .gallery-container {
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease;
      }
      
      .gallery-item {
        flex: 0 0 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5rem;
      }
      
      .gallery-item img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      
      .gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10000;
        transition: background 0.3s ease;
      }
      
      .gallery-nav:hover {
        background: rgba(212, 175, 55, 0.6);
      }
      
      .gallery-prev {
        left: 2rem;
      }
      
      .gallery-next {
        right: 2rem;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /* === Tabs === */
  function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to current tab
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  /* === Floor Plan Tabs === */
  function initializeFloorPlanTabs() {
    const floorPlanTabs = document.querySelectorAll('.floor-plan-tab');
    const floorPlanItems = document.querySelectorAll('.floor-plan-item');
    
    floorPlanTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        floorPlanTabs.forEach(t => t.classList.remove('active'));
        floorPlanItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to current tab
        tab.classList.add('active');
        
        // Show corresponding floor plan
        const floorId = tab.getAttribute('data-floor');
        document.querySelector(`.floor-plan-item[data-floor="${floorId}"]`).classList.add('active');
      });
    });
  }
  
  /* === Share Button === */
  function initializeShareButton() {
    const shareBtn = document.querySelector('.share-btn');
    
    if (!shareBtn) return;
    
    shareBtn.addEventListener('click', () => {
      // Get current URL
      const url = window.location.href;
      const title = document.title;
      
      // Check if Web Share API is supported
      if (navigator.share) {
        navigator.share({
          title: title,
          url: url
        })
        .catch(error => {
          console.error('Error sharing:', error);
          showShareFallback(url);
        });
      } else {
        showShareFallback(url);
      }
    });
  }
  
  // Fallback for browsers that don't support Web Share API
  function showShareFallback(url) {
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    
    // Modal content
    modal.innerHTML = `
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>Share this Property</h3>
          <button class="share-modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="share-modal-body">
          <p>Share this property with your network:</p>
          <div class="share-links">
            <a href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="share-link facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}" target="_blank" class="share-link twitter">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="share-link linkedin">
              <i class="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(url)}" target="_blank" class="share-link whatsapp">
              <i class="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
          </div>
          <div class="share-copy">
            <input type="text" value="${url}" readonly>
            <button class="btn btn-primary copy-link-btn">Copy Link</button>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .share-modal-content {
        background-color: white;
        border-radius: 3px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .share-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .share-modal-header h3 {
        margin: 0;
        font-size: 1.8rem;
      }
      
      .share-modal-close {
        background: none;
        border: none;
        font-size: 1.6rem;
        cursor: pointer;
      }
      
      .share-modal-body {
        padding: 2rem;
      }
      
      .share-links {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .share-link {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border-radius: 3px;
        color: white;
        text-decoration: none;
        transition: opacity 0.3s ease;
      }
      
      .share-link:hover {
        opacity: 0.9;
      }
      
      .share-link i {
        margin-right: 0.8rem;
        font-size: 1.8rem;
      }
      
      .facebook {
        background-color: #3b5998;
      }
      
      .twitter {
        background-color: #1da1f2;
      }
      
      .linkedin {
        background-color: #0077b5;
      }
      
      .whatsapp {
        background-color: #25d366;
      }
      
      .share-copy {
        display: flex;
        margin-top: 1.5rem;
      }
      
      .share-copy input {
        flex-grow: 1;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-right: none;
        font-size: 1.4rem;
      }
      
      .copy-link-btn {
        white-space: nowrap;
      }
      
      @media (max-width: 576px) {
        .share-links {
          grid-template-columns: 1fr;
        }
        .share-copy {
          flex-direction: column;
        }
        .share-copy input {
          border-right: 1px solid #e0e0e0;
          margin-bottom: 1rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close button functionality
    const closeBtn = modal.querySelector('.share-modal-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
      }
    });
    
    // Copy link functionality
    const copyBtn = modal.querySelector('.copy-link-btn');
    const input = modal.querySelector('input');
    
    copyBtn.addEventListener('click', () => {
      input.select();
      document.execCommand('copy');
      
      // Show confirmation
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  }
  
  /* === Tour Form === */
  function initializeTourForm() {
    const tourForm = document.querySelector('.tour-form');
    
    if (!tourForm) return;
    
    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('tour-name').value;
      const email = document.getElementById('tour-email').value;
      const phone = document.getElementById('tour-phone').value;
      const tourType = document.getElementById('tour-type').value;
      const date = document.getElementById('tour-date').value;
      const time = document.getElementById('tour-time').value;
      const message = document.getElementById('tour-message').value;
      
      // In a real app, you would submit this to your backend
      // For now, we'll just log it
      console.log('Tour Request:', { name, email, phone, tourType, date, time, message });
      
      // Show success message
      showTourConfirmation();
      
      // Reset form
      tourForm.reset();
    });
  }
  
  // Show tour confirmation message
  function showTourConfirmation() {
    // Create confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'tour-confirmation';
    
    confirmation.innerHTML = `
      <div class="tour-confirmation-content">
        <div class="icon-success">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Tour Request Sent!</h3>
        <p>Thank you for your interest in this property. A luxury real estate specialist will contact you shortly to confirm your tour.</p>
        <button class="btn btn-primary close-confirmation-btn">Close</button>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .tour-confirmation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .tour-confirmation-content {
        background-color: white;
        border-radius: 3px;
        width: 90%;
        max-width: 500px;
        padding: 3rem;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .icon-success {
        font-size: 5rem;
        color: #4CAF50;
        margin-bottom: 2rem;
      }
      
      .tour-confirmation-content h3 {
        margin-bottom: 1.5rem;
      }
      
      .tour-confirmation-content p {
        margin-bottom: 2rem;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(confirmation);
    document.body.style.overflow = 'hidden';
    
    // Close button functionality
    const closeBtn = confirmation.querySelector('.close-confirmation-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(confirmation);
      document.body.style.overflow = 'auto';
    });
  }
  
  /* === Room Detail Functionality === */
  // This function is called from main.js when a hotspot is clicked
  function showRoomDetail(roomId, roomName) {
    const panel = document.querySelector('.room-detail-panel');
    if (!panel) return;
    
    // Update room title
    panel.querySelector('.room-title').textContent = roomName;
    
    // In a real app, you would fetch room details from an API based on roomId
    // For now, we'll use placeholder content based on the room name
    let roomContent = '';
    
    switch(roomId) {
      case 'living':
        roomContent = `
          <p>The spacious living room features floor-to-ceiling windows offering breathtaking ocean views. The space is designed for both entertaining and relaxation.</p>
          <ul>
            <li>Size: 22' x 28'</li>
            <li>Ceiling Height: 12'</li>
            <li>Flooring: Italian marble</li>
            <li>Features: Fireplace, built-in entertainment system</li>
          </ul>
        `;
        break;
        
      case 'kitchen':
        roomContent = `
          <p>This gourmet chef's kitchen features top-of-the-line appliances, dual islands, and custom cabinetry. Perfect for culinary enthusiasts and entertaining.</p>
          <ul>
            <li>Size: 20' x 24'</li>
            <li>Appliances: Wolf, Sub-Zero, Miele</li>
            <li>Features: Dual islands, butler's pantry, wine refrigerator</li>
            <li>Countertops: Calacatta marble</li>
          </ul>
        `;
        break;
        
      case 'dining':
        roomContent = `
          <p>The elegant formal dining room can accommodate large dinner parties and features stunning ocean views through floor-to-ceiling windows.</p>
          <ul>
            <li>Size: 18' x 20'</li>
            <li>Ceiling Height: 10'</li>
            <li>Features: Custom chandelier, built-in wine display</li>
            <li>Seating Capacity: 12 people</li>
          </ul>
        `;
        break;
        
      case 'master':
        roomContent = `
          <p>The luxurious master suite offers panoramic ocean views, a private terrace, dual walk-in closets, and a spa-like bathroom.</p>
          <ul>
            <li>Size: 24' x 26'</li>
            <li>Ceiling Height: 10'</li>
            <li>Features: Fireplace, morning bar, sitting area</li>
            <li>Bathroom: Dual vanities, soaking tub, steam shower</li>
          </ul>
        `;
        break;
        
      default:
        roomContent = `
          <p>Detailed information about this room will be provided by your luxury real estate specialist during your personalized tour.</p>
        `;
    }
    
    // Update content
    panel.querySelector('.room-detail-content').innerHTML = roomContent;
    
    // Show the panel
    panel.classList.add('show');
  }
  
  /* === Favorite Toggle === */
  function initializeFavoriteToggle() {
    const favoriteBtn = document.querySelector('.favorite-btn');
    
    if (!favoriteBtn) return;
    
    favoriteBtn.addEventListener('click', () => {
      // Toggle favorite icon
      const icon = favoriteBtn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#e91e63';
        showNotification('Property added to favorites');
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showNotification('Property removed from favorites');
      }
      
      // In a real app, you would save this to user preferences
      const propertyId = getPropertyIdFromUrl();
      toggleFavoriteProperty(propertyId);
    });
  }
  
  // Get property ID from URL
  function getPropertyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
  }
  
  /* === Utility Functions === */
  // Show notification message (defined in main.js)
  // Additional initialization after page load
  window.addEventListener('load', () => {
    // Initialize favorite toggle
    initializeFavoriteToggle();
    
    // Check if virtual tour tab is active
    if (document.querySelector('.tab-btn[data-tab="virtual-tour"]').classList.contains('active')) {
      // If virtual tour is active, initialize it
      initializeVirtualTour();
    }
  });