// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); 
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});


document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});


document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
   
        if (!link.href.includes(window.location.pathname)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});


let cart = [];
const cartToggle = document.querySelector('.cart-toggle');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutButton = document.querySelector('.checkout-button');


cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');

    cartToggle.classList.add('clicked');
    setTimeout(() => cartToggle.classList.remove('clicked'), 200);
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
   
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 200);
        
        const card = e.target.closest('.product-card');
        const product = {
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
            image: card.querySelector('img').src,
            quantity: 1
        };
        addToCart(product);
    });
});

function addToCart(product) {
   
    let cart = JSON.parse(localStorage.getItem('scrubDaddyCart')) || [];
    
   
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingProductIndex !== -1) {
       
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        
        cart.push(product);
    }
    
    
    localStorage.setItem('scrubDaddyCart', JSON.stringify(cart));
    
    
    updateCart();
    
    
    setTimeout(() => {
        showNotification('Product added to cart!', 'success');
    }, 50);
}

function updateCart() {
    
    const cart = JSON.parse(localStorage.getItem('scrubDaddyCart')) || [];
    
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;

   
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">Quantity: ${item.quantity || 1}</div>
            </div>
            <button class="remove-item" data-index="${index}">&times;</button>
        </div>
    `).join('');

    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;

    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
           
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 200);
            
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('scrubDaddyCart', JSON.stringify(cart));
            updateCart();
            
            
            setTimeout(() => {
                showNotification('Product removed from cart!', 'info');
            }, 50);
        });
    });
}


const filterOptions = document.querySelectorAll('.filter-option input');
const applyFilters = document.querySelector('.apply-filters');
const productCards = document.querySelectorAll('.product-card');

applyFilters.addEventListener('click', () => {
    
    const selectedTypes = Array.from(filterOptions)
        .filter(option => option.checked && ['sponges', 'brushes', 'accessories'].includes(option.value))
        .map(option => option.value);

 
    const selectedPriceRanges = Array.from(filterOptions)
        .filter(option => option.checked && ['under-10', '10-20', 'over-20'].includes(option.value))
        .map(option => option.value);

    let hasVisibleProducts = false;

    productCards.forEach(card => {
        const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
        const type = card.dataset.type;
        
       
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
        
       
        const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
            switch(range) {
                case 'under-10': return price < 10;
                case '10-20': return price >= 10 && price <= 20;
                case 'over-20': return price > 20;
                default: return true;
            }
        });

        
        if (matchesType && matchesPrice) {
            card.style.display = 'block';
            hasVisibleProducts = true;
        } else {
            card.style.display = 'none';
        }
    });

    
    if (!hasVisibleProducts) {
        showNotification('No products match your filters');
    }
});


const resetFilters = document.createElement('button');
resetFilters.className = 'reset-filters';
resetFilters.textContent = 'Reset Filters';
document.querySelector('.filters-sidebar').appendChild(resetFilters);

resetFilters.addEventListener('click', () => {
    filterOptions.forEach(option => {
        option.checked = false;
    });
    productCards.forEach(card => {
        card.style.display = 'block';
    });
    showNotification('Filters reset');
});

document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        
        button.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('active');
        
        
        document.querySelectorAll('.accordion-header').forEach(otherButton => {
            if (otherButton !== button) {
                otherButton.setAttribute('aria-expanded', 'false');
                otherButton.nextElementSibling.classList.remove('active');
            }
        });
    });
});

// Sort functionality
const sortSelect = document.getElementById('sort-products');
sortSelect.addEventListener('change', () => {
    const productsGrid = document.querySelector('.products-grid');
    const cards = Array.from(productCards);

    cards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

        switch(sortSelect.value) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            default:
                return 0;
        }
    });

    cards.forEach(card => productsGrid.appendChild(card));
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});


// Product Info Modal
const modal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');

// Close modal when clicking the close button
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close modal when clicking outside the modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

// Product information data
const productInfo = {
    'Original Scrub Daddy': {
        recommendedUses: [
            'Dishes and cookware',
            'Kitchen countertops',
            'Bathroom surfaces',
            'Outdoor furniture'
        ],
        surfaceCompatibility: [
            'Stainless steel',
            'Non-stick cookware',
            'Glass and ceramic',
            'Wood surfaces'
        ],
        careInstructions: [
            'Rinse thoroughly after use',
            'Air dry between uses',
            'Use cold water for tough stains',
            'Warm water for gentle cleaning'
        ]
    },
    'Grill Brush': {
        recommendedUses: [
            'BBQ grills',
            'Outdoor grates',
            'Metal surfaces',
            'Heavy-duty cleaning'
        ],
        surfaceCompatibility: [
            'Metal grills',
            'Stainless steel',
            'Cast iron',
            'Outdoor surfaces'
        ],
        careInstructions: [
            'Clean after each use',
            'Store in dry place',
            'Check bristles regularly',
            'Replace when worn'
        ]
    },
    'Power Paste': {
        recommendedUses: [
            'Stovetops',
            'Sinks',
            'Bathroom tiles',
            'Kitchen surfaces'
        ],
        surfaceCompatibility: [
            'Stainless steel',
            'Ceramic',
            'Glass',
            'Porcelain'
        ],
        careInstructions: [
            'Apply with damp sponge',
            'Rinse thoroughly',
            'Store in cool place',
            'Keep away from children'
        ]
    }
};

// Update the openModal function
function openModal(productName) {
    const modalBody = document.querySelector('.modal-body');
    const productInfo = productInfoData[productName];
    
    if (productInfo) {
        modalBody.innerHTML = `
            <h3>${productName}</h3>
            <div class="product-details">
                <h4>Recommended Uses:</h4>
                <ul>
                    ${productInfo.uses.map(use => `<li>${use}</li>`).join('')}
                </ul>
                <h4>Surface Compatibility:</h4>
                <ul>
                    ${productInfo.surfaces.map(surface => `<li>${surface}</li>`).join('')}
                </ul>
                <h4>Care Instructions:</h4>
                <ul>
                    ${productInfo.care.map(instruction => `<li>${instruction}</li>`).join('')}
                </ul>
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
}

// // Bulk Order Modal functionality
// document.addEventListener('DOMContentLoaded', () => {
//     const bulkOrderBtn = document.getElementById('bulkOrderBtn');
//     const bulkOrderModal = document.getElementById('bulkOrderModal');
//     const closeBulkModal = bulkOrderModal.querySelector('.close-modal');

//     // Open bulk order modal
//     bulkOrderBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         bulkOrderModal.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     });

//     // Close bulk order modal
//     closeBulkModal.addEventListener('click', () => {
//         bulkOrderModal.classList.remove('active');
//         document.body.style.overflow = 'auto';
//     });

//     // Close bulk order modal when clicking outside
//     bulkOrderModal.addEventListener('click', (e) => {
//         if (e.target === bulkOrderModal) {
//             bulkOrderModal.classList.remove('active');
//             document.body.style.overflow = 'auto';
//         }
//     });

//     // Close bulk order modal with Escape key
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape' && bulkOrderModal.classList.contains('active')) {
//             bulkOrderModal.classList.remove('active');
//             document.body.style.overflow = 'auto';
//         }
//     });
// });

// Add event listener for checkout button with immediate visual feedback
document.querySelector('.checkout-button').addEventListener('click', function(e) {
    // Add immediate visual feedback
    this.classList.add('clicked');
    setTimeout(() => this.classList.remove('clicked'), 200);
    
    const cart = JSON.parse(localStorage.getItem('scrubDaddyCart')) || [];
    
    if (cart.length === 0) {
        e.preventDefault();
        showNotification('Please select items before proceeding to checkout', 'warning');
    }
});

// Add CSS for click animations
const clickAnimationStyle = document.createElement('style');
clickAnimationStyle.textContent = `
    .clicked {
        transform: scale(0.95);
        opacity: 0.8;
    }
    
    .add-to-cart, .remove-item, .cart-toggle, .checkout-button {
        transition: transform 0.1s ease, opacity 0.1s ease;
    }
`;
document.head.appendChild(clickAnimationStyle); 