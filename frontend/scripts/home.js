document.addEventListener("DOMContentLoaded", function () {
    async function fetchImages() {
        try {
            const response = await fetch('http://localhost:3000/api/upload/getImages');
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                const imageGallery = document.getElementById('image-gallery');


                if (imageGallery) {
                    imageGallery.innerHTML = ''; // Clear existing images


                    data.data.forEach(image => {
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
                        imageGallery.appendChild(card);
                    });
                } else {
                    console.error("Image gallery not found");
                }
            } else {
                const imageGallery = document.getElementById('image-gallery');
                if (imageGallery) {
                    imageGallery.innerHTML = '<p>No images available.</p>';
                }
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    fetchImages();
});
