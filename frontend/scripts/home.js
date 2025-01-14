document.addEventListener("DOMContentLoaded", function () {
    async function fetchImages() {
        try {
            // Fetch images from the backend API
            const response = await fetch('http://localhost:3000/api/upload/getImages'); // Replace with your actual API endpoint
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const imageGallery = document.getElementById('image-gallery');
                // Clear existing content before appending new content
                imageGallery.innerHTML = '';

                // Loop through the fetched images
                data.data.forEach(image => {
                    // Create a new card element for each image
                    const card = document.createElement('div');
                    card.classList.add('col-md-2');

                    card.innerHTML = `
                        <div class="card">
                            <img src="${image.imageUrl}" class="card-img-top" alt="${image.imageTitle}">
                            <div class="card-body">
                                <h5 class="card-title">${image.imageTitle}</h5>
                                <p class="card-text">${image.description || 'No description available'}</p>
                                <a href="#" class="btn btn-primary">View Details</a>
                            </div>
                        </div>
                    `;

                    // Append the card to the gallery
                    imageGallery.appendChild(card);
                });
            } else {
                const imageGallery = document.getElementById('image-gallery');
                imageGallery.innerHTML = '<p>No images available.</p>';
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    // Call the fetchImages function to load images on page load
    fetchImages();
});
