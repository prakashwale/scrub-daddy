document.addEventListener('DOMContentLoaded', function() {
    const faqContainer = document.querySelector('.faq-container');
    const faqCards = document.querySelectorAll('.faq-card');
    const prevBtn = document.getElementById('prevFaq');
    const nextBtn = document.getElementById('nextFaq');
    const counter = document.querySelector('.faq-counter');
    let currentIndex = 0;

    function updateFAQDisplay() {
        faqCards.forEach((card, index) => {
            if (index === currentIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Update counter
        counter.textContent = `${currentIndex + 1} of ${faqCards.length}`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === faqCards.length - 1;
    }

    // Initialize FAQ display
    updateFAQDisplay();

    // Add click event listeners for navigation buttons
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateFAQDisplay();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < faqCards.length - 1) {
            currentIndex++;
            updateFAQDisplay();
        }
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const contactCards = document.querySelectorAll('.contact-method-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}); 