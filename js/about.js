document.addEventListener('DOMContentLoaded', function() {
    const imageContainers = document.querySelectorAll('.image-container');
    
    imageContainers.forEach(container => {
        const defaultImage = container.querySelector('.default-image');
        const hoverImage = container.querySelector('.hover-image');
        
        if (hoverImage) {
            const img = new Image();
            img.src = hoverImage.src;
        }
        
        container.addEventListener('mouseenter', function() {
            if (defaultImage && hoverImage) {
                defaultImage.style.opacity = '0';
                hoverImage.style.opacity = '1';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            if (defaultImage && hoverImage) {
                defaultImage.style.opacity = '1';
                hoverImage.style.opacity = '0';
            }
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
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
    }
}); 