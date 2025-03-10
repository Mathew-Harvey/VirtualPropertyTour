/* 
========================================
LUXE ESTATES - Contact Page JavaScript
========================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeContactForm();
    initializeFAQs();
    initializeChatWidget();
  });
  
  /* === Contact Form === */
  function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value,
        privacyConsent: document.getElementById('privacy-consent').checked
      };
      
      // Validate form
      if (!validateForm(formData)) {
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // In a real application, you would send this data to your backend
      // For this demo, we'll simulate a successful submission
      
      setTimeout(() => {
        console.log('Form data:', formData);
        
        // Reset form
        contactForm.reset();
        
        // Show success message
        showFormSuccess();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }, 1500);
    });
    
    // Form validation
    function validateForm(data) {
      // Reset previous error messages
      const errorElements = document.querySelectorAll('.form-error');
      errorElements.forEach(el => el.remove());
      
      let isValid = true;
      
      // Validate name
      if (!data.name.trim()) {
        showError('contact-name', 'Please enter your name');
        isValid = false;
      }
      
      // Validate email
      if (!data.email.trim()) {
        showError('contact-email', 'Please enter your email address');
        isValid = false;
      } else if (!isValidEmail(data.email)) {
        showError('contact-email', 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate message
      if (!data.message.trim()) {
        showError('contact-message', 'Please enter your message');
        isValid = false;
      }
      
      // Validate privacy consent
      if (!data.privacyConsent) {
        showError('privacy-consent', 'You must agree to our Privacy Policy');
        isValid = false;
      }
      
      return isValid;
    }
    
    // Show error message
    function showError(inputId, message) {
      const input = document.getElementById(inputId);
      const errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.textContent = message;
      errorElement.style.color = '#e74c3c';
      errorElement.style.fontSize = '1.2rem';
      errorElement.style.marginTop = '0.5rem';
      
      input.parentNode.appendChild(errorElement);
      input.style.borderColor = '#e74c3c';
      
      // Reset error styling on input change
      input.addEventListener('input', () => {
        input.style.borderColor = '';
        const error = input.parentNode.querySelector('.form-error');
        if (error) {
          error.remove();
        }
      });
    }
    
    // Validate email format
    function isValidEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    // Show success message
    function showFormSuccess() {
      // Create success message element
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting Luxe Estates. One of our luxury real estate specialists will get back to you within 24 hours.</p>
      `;
      
      // Style the success message
      successMessage.style.textAlign = 'center';
      successMessage.style.padding = '2rem';
      successMessage.style.backgroundColor = '#f8f9fa';
      successMessage.style.borderRadius = '3px';
      successMessage.style.marginTop = '2rem';
      
      const successIcon = successMessage.querySelector('.success-icon');
      successIcon.style.fontSize = '5rem';
      successIcon.style.color = '#2ecc71';
      successIcon.style.marginBottom = '1rem';
      
      // Replace form with success message
      const formContainer = contactForm.parentNode;
      formContainer.innerHTML = '';
      formContainer.appendChild(successMessage);
    }
  }
  
  /* === FAQs === */
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
  
  /* === Chat Widget === */
  function initializeChatWidget() {
    // Check if chat button exists
    const startChatBtn = document.querySelector('.start-chat-btn');
    if (!startChatBtn) return;
    
    // Create chat widget elements
    createChatWidget();
    
    // Chat button event
    startChatBtn.addEventListener('click', openChat);
  }
  
  // Create chat widget
  function createChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    
    // Chat button (fixed at bottom-right)
    const chatButton = document.createElement('button');
    chatButton.className = 'chat-button';
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    chatButton.setAttribute('aria-label', 'Open chat');
    
    // Chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    
    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
      <h3>Luxe Estates Live Chat</h3>
      <button class="chat-close" aria-label="Close chat">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Chat messages
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    
    // Chat input
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
      <input type="text" placeholder="Type your message...">
      <button type="button" aria-label="Send message">
        <i class="fas fa-paper-plane"></i>
      </button>
    `;
    
    // Assemble chat widget
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatMessages);
    chatContainer.appendChild(chatInput);
    
    chatWidget.appendChild(chatContainer);
    chatWidget.appendChild(chatButton);
    
    // Add to body
    document.body.appendChild(chatWidget);
    
    // Event listeners
    chatButton.addEventListener('click', () => {
      chatContainer.classList.toggle('active');
      if (chatContainer.classList.contains('active')) {
        // Add initial messages if it's the first time opening
        if (chatMessages.children.length === 0) {
          addAgentMessage("Hello! Welcome to Luxe Estates. How can I assist you with your luxury property needs today?");
        }
        // Focus on input
        chatInput.querySelector('input').focus();
      }
    });
    
    const closeBtn = chatHeader.querySelector('.chat-close');
    closeBtn.addEventListener('click', () => {
      chatContainer.classList.remove('active');
    });
    
    const sendBtn = chatInput.querySelector('button');
    const messageInput = chatInput.querySelector('input');
    
    // Send message on button click
    sendBtn.addEventListener('click', () => {
      sendChatMessage(messageInput, chatMessages);
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage(messageInput, chatMessages);
      }
    });
  }
  
  // Open chat
  function openChat() {
    const chatContainer = document.querySelector('.chat-container');
    const chatButton = document.querySelector('.chat-button');
    
    if (chatContainer && chatButton) {
      // Simulate click on chat button
      chatButton.click();
      
      // Scroll to bottom of page to ensure the chat is visible
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  // Send chat message
  function sendChatMessage(input, chatMessages) {
    const message = input.value.trim();
    
    if (message) {
      // Add user message
      addUserMessage(message);
      
      // Clear input
      input.value = '';
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const responses = [
          "Thank you for your message. One of our luxury property specialists will be with you shortly.",
          "Great question! I'd be happy to provide more information about our luxury properties.",
          "I understand you're interested in our virtual tours. They offer an immersive experience of our properties without requiring an in-person visit.",
          "Our team specializes in high-end properties in prime locations. Would you like to discuss specific areas you're interested in?",
          "Absolutely! We can arrange a private viewing of any property at your convenience."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addAgentMessage(randomResponse);
      }, 1000);
    }
  }
  
  // Add user message to chat
  function addUserMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.innerHTML = `<div class="message-content">${text}</div>`;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
  }
  
  // Add agent message to chat
  function addAgentMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message agent';
    messageElement.innerHTML = `<div class="message-content">${text}</div>`;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
  }
  
  // Scroll chat to bottom
  function scrollChatToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }