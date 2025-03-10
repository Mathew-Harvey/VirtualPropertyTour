/* 
==========================================
LUXE ESTATES - Properties Page JavaScript
==========================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all property listings components
    initializePropertyFilters();
    initializePropertySort();
    initializePagination();
    initializePropertyCards();
    initializeFavorites();
  });
  
  /* === Property Filters === */
  function initializePropertyFilters() {
    const filterForm = document.querySelector('.property-filter-form');
    if (!filterForm) return;
    
    // Elements
    const locationFilter = document.getElementById('location-filter');
    const propertyTypeFilter = document.getElementById('property-type-filter');
    const bedroomsFilter = document.getElementById('bedrooms-filter');
    const priceFilter = document.getElementById('price-filter');
    const featureCheckboxes = document.querySelectorAll('.feature-checkbox input');
    const resetButton = document.querySelector('.filter-reset-btn');
    
    // Apply filters on form submission
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
    
    // Reset filters
    resetButton.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
    });
    
    // Apply filters function
    function applyFilters() {
      // Show loading state
      const propertyGrid = document.querySelector('.property-grid');
      propertyGrid.classList.add('loading');
      
      // Get selected values
      const filters = {
        location: locationFilter.value,
        propertyType: propertyTypeFilter.value,
        bedrooms: bedroomsFilter.value,
        price: priceFilter.value,
        features: Array.from(featureCheckboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value)
      };
      
      console.log('Applied filters:', filters);
      
      // In a real application, you would make an API call with these filters
      // For this demo, we'll simulate filtering with a delay
      
      setTimeout(() => {
        // Simulate filtered results
        const propertyCards = document.querySelectorAll('.property-card');
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
          // Randomize which cards are shown (in a real app, this would be actual filtering)
          const shouldShow = Math.random() > 0.3; // 70% chance to show each card
          
          if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
        
        // Update properties found count
        document.querySelector('.properties-found h2').textContent = `${visibleCount} Properties Found`;
        
        // Reset pagination to first page
        const paginationNumbers = document.querySelectorAll('.pagination-number');
        paginationNumbers.forEach((btn, index) => {
          btn.classList.toggle('active', index === 0);
        });
        
        // Enable/disable pagination buttons
        document.querySelector('.pagination-prev').disabled = true;
        document.querySelector('.pagination-next').disabled = visibleCount <= 9;
        
        // Remove loading state
        propertyGrid.classList.remove('loading');
      }, 800);
    }
  }
  
  /* === Property Sort === */
  function initializePropertySort() {
    const sortSelect = document.getElementById('sort-options');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      const propertyGrid = document.querySelector('.property-grid');
      const propertyCards = Array.from(document.querySelectorAll('.property-card'));
      
      // Show loading state
      propertyGrid.classList.add('loading');
      
      setTimeout(() => {
        // Sort the cards based on selected option
        propertyCards.sort((a, b) => {
          const priceA = getPriceValue(a);
          const priceB = getPriceValue(b);
          
          switch (sortValue) {
            case 'price-high':
              return priceB - priceA;
            case 'price-low':
              return priceA - priceB;
            case 'newest':
              // In a real app, you would sort by date
              // For demo purposes, we'll use the property ID as a proxy for "newest"
              return parseInt(b.dataset.id) - parseInt(a.dataset.id);
            default: // featured
              // In a real app, you would have a "featured" flag
              // For demo purposes, we'll just randomize the order
              return Math.random() - 0.5;
          }
        });
        
        // Reorder cards in the DOM
        propertyCards.forEach(card => {
          propertyGrid.appendChild(card);
        });
        
        // Remove loading state
        propertyGrid.classList.remove('loading');
      }, 500);
    });
    
    // Helper function to extract price value from card
    function getPriceValue(card) {
      const priceText = card.querySelector('.property-price').textContent;
      // Remove $ and commas, then convert to number
      return parseFloat(priceText.replace(/[$,]/g, ''));
    }
  }
  
  /* === Pagination === */
  function initializePagination() {
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const pageButtons = document.querySelectorAll('.pagination-number');
    
    // Initial state
    prevButton.disabled = true;
    let currentPage = 1;
    
    // Previous button
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
        scrollToTop();
      }
    });
    
    // Next button
    nextButton.addEventListener('click', () => {
      if (currentPage < pageButtons.length) {
        currentPage++;
        updatePagination();
        scrollToTop();
      }
    });
    
    // Page number buttons
    pageButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        currentPage = index + 1;
        updatePagination();
        scrollToTop();
      });
    });
    
    // Update pagination state
    function updatePagination() {
      // Update active page button
      pageButtons.forEach((button, index) => {
        button.classList.toggle('active', index + 1 === currentPage);
      });
      
      // Enable/disable prev/next buttons
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === pageButtons.length;
      
      // In a real app, you would load the appropriate page of results here
      simulatePageChange(currentPage);
    }
    
    // Simulate changing pages
    function simulatePageChange(page) {
      // Show loading state
      const propertyGrid = document.querySelector('.property-grid');
      propertyGrid.classList.add('loading');
      
      setTimeout(() => {
        // In a real app, you would show different properties for each page
        // For this demo, we'll just hide/show random properties
        
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
          // Show all cards initially
          card.style.display = 'block';
          
          // Then hide some randomly to simulate different pages
          // In a real app, this would use actual pagination logic
          if (Math.random() < 0.3) {
            card.style.display = 'none';
          }
        });
        
        // Remove loading state
        propertyGrid.classList.remove('loading');
      }, 800);
    }
    
    // Scroll to top of property grid
    function scrollToTop() {
      const propertySection = document.querySelector('.properties-grid-section');
      propertySection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  /* === Property Cards === */
  function initializePropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
      // Add hover effect
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });
  }
  
  /* === Favorites === */
  function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.property-favorite');
    
    // Check local storage for previously saved favorites
    const savedFavorites = getSavedFavorites();
    
    // Initialize favorite buttons
    favoriteButtons.forEach(button => {
      const propertyId = button.closest('.property-card').dataset.id;
      const icon = button.querySelector('i');
      
      // Set initial state based on saved favorites
      if (savedFavorites.includes(propertyId)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#e91e63';
      }
      
      // Toggle favorite status on click
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        toggleFavorite(propertyId, icon);
      });
    });
  }
  
  // Toggle property favorite status
  function toggleFavorite(propertyId, icon) {
    const favorites = getSavedFavorites();
    const index = favorites.indexOf(propertyId);
    
    if (index === -1) {
      // Add to favorites
      favorites.push(propertyId);
      icon.classList.remove('far');
      icon.classList.add('fas');
      icon.style.color = '#e91e63';
      showNotification('Property added to favorites');
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      icon.classList.remove('fas');
      icon.classList.add('far');
      icon.style.color = '';
      showNotification('Property removed from favorites');
    }
    
    // Save updated favorites
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
  }
  
  // Get saved favorites from local storage
  function getSavedFavorites() {
    const savedFavorites = localStorage.getItem('propertyFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  }
  
  // Add loading indicator styles
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      .property-grid.loading {
        position: relative;
        min-height: 50rem;
      }
      
      .property-grid.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
      }
      
      .property-grid.loading::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 5rem;
        height: 5rem;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 11;
      }
      
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
  });