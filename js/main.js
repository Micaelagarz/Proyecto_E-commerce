import { initMenu } from "./components/menu.js";
import { initSwiper } from "./components/swiper.js";
import { initContactForm } from "./components/contact-form.js";
import { initProducts } from "./products/products.js";
import { initCart } from "./cart/cart.js";

document.addEventListener("DOMContentLoaded", async () => {

    initMenu();
    initSwiper();
    initContactForm();
    
    await initProducts();

    initCart();


});