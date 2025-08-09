document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element Selection
    const mainImage = document.getElementById('main-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const thumbnailsContainer = document.querySelector('.thumbnail-gallery');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');

    let currentIndex = 0;
    const images = Array.from(thumbnails).map(img => img.src);
    let filteredImages = images;

    // 2. Main Gallery Functions
    function updateGallery(index) {
        if (index >= 0 && index < filteredImages.length) {
            mainImage.src = filteredImages[index];
            currentIndex = index;
            updateActiveThumbnail(filteredImages[index]);
        }
    }

    function updateActiveThumbnail(currentSrc) {
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.src === currentSrc) {
                thumb.classList.add('active');
            }
        });
    }

    // 3. Event Listeners for Navigation
    prevBtn.addEventListener('click', () => {
        updateGallery(currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1);
    });

    nextBtn.addEventListener('click', () => {
        updateGallery(currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0);
    });

    thumbnailsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('thumbnail')) {
            const clickedSrc = e.target.src;
            const newIndex = filteredImages.indexOf(clickedSrc);
            if (newIndex !== -1) {
                updateGallery(newIndex);
            }
        }
    });
    
    // 4. Image Filtering (Bonus)
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Update active state of filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            const allThumbnails = document.querySelectorAll('.thumbnail');

            filteredImages = [];

            allThumbnails.forEach(thumb => {
                if (filter === 'all' || thumb.dataset.category === filter) {
                    thumb.classList.remove('hidden');
                    filteredImages.push(thumb.src);
                } else {
                    thumb.classList.add('hidden');
                }
            });

            // Update gallery with the first image of the new category
            if (filteredImages.length > 0) {
                updateGallery(0);
            } else {
                 mainImage.src = ''; // Or a placeholder
                 currentIndex = -1;
            }
        });
    });

    // 5. Lightbox Functionality
    mainImage.addEventListener('click', () => {
        if (mainImage.src) { // Ensure there's an image to show
            lightbox.style.display = 'flex';
            lightboxImage.src = mainImage.src;
        }
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Lightbox navigation
    lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        updateGallery(currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1);
        lightboxImage.src = filteredImages[currentIndex];
    });

    lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGallery(currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0);
        lightboxImage.src = filteredImages[currentIndex];
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                lightboxPrevBtn.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        }
    });
});