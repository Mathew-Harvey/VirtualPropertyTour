/* 
==========================================
REALVISION3D - Portfolio Page JavaScript
==========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize portfolio components
  initializeFilters();
  initializeSearch();
  initializeLoadMore();
  initializeVideoPopup();
});

/* === Portfolio Filters === */
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const noResults = document.querySelector('.no-results');
  const resetFiltersBtn = document.querySelector('.reset-filters-btn');
  
  // Add click event to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Show/hide items based on filter
      let visibleCount = 0;
      
      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
          visibleCount++;
          
          // Reset animation to trigger it again
          item.style.animation = 'none';
          item.offsetHeight; // Force reflow
          item.style.animation = '';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide no results message
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
      
      // Reset load more button
      resetLoadMore();
    });
  });
  
  // Reset filters button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      // Simulate click on "All" filter
      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
          btn.click();
        }
      });
      
      // Clear search input
      const searchInput = document.getElementById('portfolio-search');
      if (searchInput) {
        searchInput.value = '';
      }
    });
  }
}

/* === Search Functionality === */
function initializeSearch() {
  const searchInput = document.getElementById('portfolio-search');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const noResults = document.querySelector('.no-results');
  
  if (!searchInput) return;
  
  // Search function
  const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // If search term is empty, reset to current filter
    if (searchTerm === '') {
      const activeFilter = document.querySelector('.filter-btn.active');
      if (activeFilter) {
        activeFilter.click();
      }
      return;
    }
    
    // Filter items based on search term
    let visibleCount = 0;
    
    portfolioItems.forEach(item => {
      const title = item.querySelector('.portfolio-title').textContent.toLowerCase();
      const location = item.querySelector('.portfolio-location span').textContent.toLowerCase();
      const category = item.querySelector('.portfolio-category').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || location.includes(searchTerm) || category.includes(searchTerm)) {
        item.style.display = 'block';
        visibleCount++;
        
        // Reset animation to trigger it again
        item.style.animation = 'none';
        item.offsetHeight; // Force reflow
        item.style.animation = '';
      } else {
        item.style.display = 'none';
      }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
    
    // Reset load more button
    resetLoadMore();
  };
  
  // Add input event for live search
  searchInput.addEventListener('input', debounce(performSearch, 300));
  
  // Add submit event for search button
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performSearch();
    });
  }
  
  // Add keypress event for Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/* === Load More Functionality === */
function initializeLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;
  
  // In a real implementation, you would load more items from the server
  // For this demo, we'll simulate it by adding a "loaded" class to hidden items
  
  loadMoreBtn.addEventListener('click', () => {
    // Get visible and hidden items
    const visibleItems = document.querySelectorAll('.portfolio-item[style="display: block;"]');
    const hiddenItems = document.querySelectorAll('.portfolio-item:not([style="display: block;"])');
    
    // Show the next 3 hidden items
    let itemsToShow = 3;
    let itemsShown = 0;
    
    hiddenItems.forEach(item => {
      if (itemsShown < itemsToShow) {
        item.style.display = 'block';
        item.classList.add('loaded');
        
        // Add animation with delay
        item.style.animation = 'none';
        item.offsetHeight; // Force reflow
        item.style.animation = `fadeIn 0.5s ease forwards ${0.1 * (itemsShown + 1)}s`;
        
        itemsShown++;
      }
    });
    
    // Check if there are more items to load
    const remainingHiddenItems = document.querySelectorAll('.portfolio-item:not([style="display: block;"])');
    if (remainingHiddenItems.length === 0) {
      loadMoreBtn.textContent = 'No More Projects';
      loadMoreBtn.disabled = true;
    }
  });
}

function resetLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;
  
  loadMoreBtn.textContent = 'Load More Projects';
  loadMoreBtn.disabled = false;
}

/* === Video Popup === */
function initializeVideoPopup() {
  const videoPlayButton = document.querySelector('.video-play-button');
  if (!videoPlayButton) return;
  
  videoPlayButton.addEventListener('click', () => {
    // Create video modal
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    
    // Video content
    videoModal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-close-btn">
          <i class="fas fa-times"></i>
        </button>
        <div class="video-embed">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Technology Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .video-modal {
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
      
      .video-modal-content {
        position: relative;
        width: 80%;
        max-width: 900px;
      }
      
      .video-close-btn {
        position: absolute;
        top: -4rem;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2.4rem;
        cursor: pointer;
      }
      
      .video-embed {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        height: 0;
        overflow: hidden;
      }
      
      .video-embed iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(videoModal);
    document.body.style.overflow = 'hidden';
    
    // Close button functionality
    const closeBtn = videoModal.querySelector('.video-close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(videoModal);
      document.body.style.overflow = 'auto';
    });
    
    // Close on click outside
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        document.body.removeChild(videoModal);
        document.body.style.overflow = 'auto';
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.contains(videoModal)) {
        document.body.removeChild(videoModal);
        document.body.style.overflow = 'auto';
      }
    });
  });
}

/* === Animation on Scroll === */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.case-study-section, .technology-info-section');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Animate child elements within the section
        const animateElements = entry.target.querySelectorAll('.animate-on-scroll');
        animateElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animated');
          }, 100 * index);
        });
      }
    });
  }, { threshold: 0.2 });
  
  // Observe sections
  sections.forEach(section => {
    observer.observe(section);
    
    // Add animation classes to elements
    const elementsToAnimate = section.querySelectorAll('h2, h3, p, .result-item, .tech-info-text ul li');
    elementsToAnimate.forEach(el => {
      el.classList.add('animate-on-scroll');
    });
  });
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    .result-item.animate-on-scroll {
      transform: translateY(30px);
    }
    
    .tech-info-text ul li.animate-on-scroll {
      transform: translateX(-20px);
    }
  `;
  
  document.head.appendChild(style);
});