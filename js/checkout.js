document.addEventListener('DOMContentLoaded', function() {
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('scrubDaddyCart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total');

    // Add CSS for click animations
    const clickAnimationStyle = document.createElement('style');
    clickAnimationStyle.textContent = `
        .clicked {
            transform: scale(0.95);
            opacity: 0.8;
        }
        
        .quantity-btn {
            transition: transform 0.1s ease, opacity 0.1s ease;
        }
    `;
    document.head.appendChild(clickAnimationStyle);

    // Display cart items
    if (cart.length > 0) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-name="${item.name}">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-name="${item.name}">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Add immediate visual feedback
                this.classList.add('clicked');
                setTimeout(() => this.classList.remove('clicked'), 200);
                
                const name = this.dataset.name;
                const item = cart.find(item => item.name === name);
                const quantitySpan = this.parentElement.querySelector('.quantity');
                const cartItemElement = this.closest('.cart-item');
                
                if (item) {
                    if (this.classList.contains('plus')) {
                        item.quantity = (item.quantity || 1) + 1;
                        quantitySpan.textContent = item.quantity;
                    } else if (this.classList.contains('minus')) {
                        item.quantity = (item.quantity || 1) - 1;
                        
                        if (item.quantity <= 0) {
                            // Remove item from cart
                            const itemIndex = cart.findIndex(i => i.name === name);
                            if (itemIndex !== -1) {
                                cart.splice(itemIndex, 1);
                                cartItemElement.remove();
                                
                                // If cart is empty, show empty cart message
                                if (cart.length === 0) {
                                    cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
                                }
                            }
                        } else {
                            quantitySpan.textContent = item.quantity;
                        }
                    }
                    
                    // Update totals immediately
                    updateTotals();
                    
                    // Save to localStorage with a slight delay to ensure UI updates first
                    setTimeout(() => {
                        localStorage.setItem('scrubDaddyCart', JSON.stringify(cart));
                    }, 50);
                }
            });
        });
    } else {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
    }

    // Update totals
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const tax = subtotal * 0.13; // 13% tax
        const total = subtotal + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Initial totals update
    updateTotals();

    // Handle form submission with immediate visual feedback
    const checkoutForm = document.querySelector('.checkout-form');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            // Add immediate visual feedback
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 200);
        });
    }
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the order to a server
        // For now, we'll just clear the cart and show a success message
        localStorage.removeItem('scrubDaddyCart');
        
        // Show success popup
        showOrderSuccessPopup();
    });
    
    // Function to show order success popup
    function showOrderSuccessPopup() {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = 'order-success-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <i class="fas fa-check-circle"></i>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
                <a href="buy_scrub_daddy.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(popup);
        
        // Add animation class after a small delay
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);
    }
}); 