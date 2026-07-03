export function initSwiper() {

    new Swiper('.card-wrapper', {
        loop: true,
        spaceBetween: 30,
    
        // Navigation arrows
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
    
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    
        // Reponsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            768: {
                slidesPerView: 1
            },
            1024: {
                slidesPerView: 1
            },
        }
    
    });
    
}