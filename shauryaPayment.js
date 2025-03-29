/**
 * shauryaPayment.js - Modern Payment Popup System
 * Features:
 * - Smooth animations
 * - Responsive design
 * - Razorpay and PayPal integration
 * - Error handling
 * - Accessibility support
 */

class PaymentSystem {
    constructor() {
      // DOM Elements
      this.elements = {
        planButtons: document.querySelectorAll('.cta-button'),
        paymentPopup: document.getElementById('payment-popup'),
        overlay: document.querySelector('.popup-overlay'),
        closeBtn: document.querySelector('.close-popup'),
        paymentOptions: document.querySelectorAll('.payment-option'),
        orderSummary: document.querySelector('.order-summary'),
        loadingIndicator: this.createLoadingIndicator()
      };
  
      // State
      this.state = {
        currentPlan: null,
        isOpen: false
      };
  
      // Initialize
      this.init();
    }
  
    init() {
      // Add event listeners
      this.addEventListeners();
      
      // Inject CSS if not already present
      this.injectStyles();
      
      // Add loading indicator to body
      document.body.appendChild(this.elements.loadingIndicator);
    }
  
    createLoadingIndicator() {
      const loader = document.createElement('div');
      loader.className = 'payment-loader hidden';
      loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p class="loader-text">Processing Payment...</p>
      `;
      return loader;
    }
  
    injectStyles() {
      if (document.getElementById('payment-system-styles')) return;
  
      const style = document.createElement('style');
      style.id = 'payment-system-styles';
      style.textContent = `
        .payment-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          width: 90%;
          max-width: 500px;
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 5px 30px rgba(0,0,0,0.3);
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .payment-popup.active {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .popup-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .close-popup {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 25px;
          cursor: pointer;
          background: none;
          border: none;
          color: #666;
          transition: transform 0.2s ease;
        }
        
        .close-popup:hover {
          transform: scale(1.2);
          color: #333;
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          padding: 15px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .payment-option:hover {
          background: #f9f9f9;
          border-color: #bbb;
        }
        
        .payment-option img {
          width: 40px;
          margin-right: 15px;
        }
        
        .order-summary {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .payment-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          transition: all 0.3s ease;
        }
        
        .payment-loader.hidden {
          opacity: 0;
          visibility: hidden;
        }
        
        .loader-spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #007bff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .payment-popup {
            padding: 15px;
          }
          
          .payment-option {
            padding: 10px;
          }
          
          .payment-option img {
            width: 30px;
            margin-right: 10px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    addEventListeners() {
      // Plan selection buttons
      this.elements.planButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const plan = button.dataset.plan || 'Basic Plan';
          const price = button.dataset.price || '₹239';
          const cycle = button.dataset.cycle || 'month';
          this.showPaymentPopup(plan, price, cycle);
        });
      });
  
      // Close events
      this.elements.closeBtn.addEventListener('click', () => this.closePaymentPopup());
      this.elements.overlay.addEventListener('click', () => this.closePaymentPopup());
  
      // Payment method selection
      this.elements.paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
          const method = option.dataset.method;
          this.processPayment(method);
        });
      });
  
      // Keyboard accessibility
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isOpen) {
          this.closePaymentPopup();
        }
      });
    }
  
    showPaymentPopup(planName, price, billingCycle) {
      this.state.currentPlan = { planName, price, billingCycle };
      this.state.isOpen = true;
  
      // Update order summary
      this.elements.orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        <p><strong>Plan:</strong> ${planName}</p>
        <p><strong>Billing:</strong> ${billingCycle === 'month' ? 'Monthly' : 'Annual'}</p>
        <p><strong>Price:</strong> ${price}${billingCycle === 'month' ? '/month' : '/year'}</p>
        <p><strong>Total:</strong> ${price}</p>
      `;
  
      // Show popup and overlay
      this.elements.paymentPopup.classList.add('active');
      this.elements.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Set focus to close button for accessibility
      this.elements.closeBtn.focus();
    }
  
    closePaymentPopup() {
      this.state.isOpen = false;
      this.elements.paymentPopup.classList.remove('active');
      this.elements.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  
    showLoading() {
      this.elements.loadingIndicator.classList.remove('hidden');
    }
  
    hideLoading() {
      this.elements.loadingIndicator.classList.add('hidden');
    }
  
    async processPayment(method) {
      try {
        this.showLoading();
        this.closePaymentPopup();
  
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
  
        switch (method) {
          case 'razorpay':
            this.processRazorpayPayment();
            break;
          case 'paypal':
            this.processPaypalPayment();
            break;
          default:
            throw new Error('Invalid payment method');
        }
      } catch (error) {
        console.error('Payment error:', error);
        this.showPaymentError(error.message);
      } finally {
        this.hideLoading();
      }
    }
  
    processRazorpayPayment() {
      // In a real implementation, this would initialize Razorpay checkout
      // For demo purposes, we'll simulate a successful payment
      console.log('Processing Razorpay payment for:', this.state.currentPlan);
      this.showPaymentSuccess();
      
      /* Actual Razorpay implementation would look like:
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: this.convertToPaise(this.state.currentPlan.price),
        currency: 'INR',
        name: 'Your Business Name',
        description: this.state.currentPlan.planName,
        handler: (response) => {
          this.showPaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#007bff'
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
      */
    }
  
    processPaypalPayment() {
      // In a real implementation, this would initialize PayPal checkout
      console.log('Processing PayPal payment for:', this.state.currentPlan);
      this.showPaymentSuccess();
    }
  
    showPaymentSuccess(paymentId = null) {
      const successHTML = `
        <div class="payment-success">
          <h3>Payment Successful!</h3>
          <p>Thank you for your purchase.</p>
          ${paymentId ? `<p>Transaction ID: ${paymentId}</p>` : ''}
          <button onclick="window.location.href='/success'" class="success-btn">
            Continue to Dashboard
          </button>
        </div>
      `;
      
      this.elements.paymentPopup.querySelector('.popup-content').innerHTML = successHTML;
      this.showPaymentPopup();
    }
  
    showPaymentError(message) {
      const errorHTML = `
        <div class="payment-error">
          <h3>Payment Failed</h3>
          <p>${message || 'There was an error processing your payment.'}</p>
          <button onclick="window.location.reload()" class="retry-btn">
            Try Again
          </button>
        </div>
      `;
      
      this.elements.paymentPopup.querySelector('.popup-content').innerHTML = errorHTML;
      this.showPaymentPopup();
    }
  
    convertToPaise(priceString) {
      // Helper function to convert ₹ price to paise
      const amount = parseFloat(priceString.replace(/[^0-9.]/g, ''));
      return Math.round(amount * 100);
    }
  }
  
  // Initialize the payment system when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const paymentSystem = new PaymentSystem();
    
    // Make available globally if needed
    window.shauryaPayment = paymentSystem;
  });