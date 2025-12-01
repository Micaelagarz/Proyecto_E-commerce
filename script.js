// Abrir y cerrar el navbar
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility 
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

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

// DOM + eventos + validación
const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {
    const nombre = document.querySelector('input[name="nombre"]');
    const email = document.querySelector('input[name="email"]');
    const mensaje = document.querySelector('textarea[name="asunto"]');

    if (nombre.value.trim() === "" || email.value.trim() === "" || mensaje.value.trim() === "") {
        e.preventDefault();
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Validar email (regex simple)
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email.value)) {
        e.preventDefault();
        alert("El formato del correo no es válido.");
        return;
    }

    // Si todo está bien:
    alert("Formulario enviado correctamente!");
});

// API REST
document.addEventListener('DOMContentLoaded', () => {

    /* -------------------- FETCH PRODUCTOS -------------------- */
    fetch("https://dummyjson.com/products/category/groceries")
        .then(res => res.json())
        .then(data => {

            const idsPermitidos = [23, 29, 30, 34];
            const productos = data.products.filter(p => idsPermitidos.includes(p.id));

            const contenedor = document.getElementById("productos-container");
            const mensajeCargando = document.getElementById("mensaje-cargando");

            if (mensajeCargando) mensajeCargando.style.display = "none";

            if (!contenedor) {
                console.error("No se encontró #productos-container en el HTML");
                return;
            }

            contenedor.innerHTML = "";

            productos.forEach(producto => {
                const { id, title, price, images } = producto;
                const imgSrc = images?.[0] || "img/default.png";

                const card = document.createElement("div");
                card.classList.add("card-product");

                card.innerHTML = `
                    <div class="container-img">
                        <img src="${imgSrc}" alt="${title}">
                        <span class="discount">-13%</span>

                        <div class="button-group">
                            <span><i class="fa-regular fa-eye"></i></span>
                            <span class="btn-fav"><i class="fa-regular fa-heart"></i></span>
                            <span class="btn-add" data-id="${id}">
                                <i class="fa-solid fa-cart-plus"></i>
                            </span>
                        </div>
                    </div>

                    <div class="content-card-product">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>

                        <h3>${title}</h3>

                        <p class="price">$${price} <span>$${(price * 1.25).toFixed(2)}</span></p>

                        <span class="add-cart" data-id="${id}">
                            <p>Agregar</p>
                        </span>
                    </div>
                `;

                contenedor.appendChild(card);
            });

            cargarEventosAgregar();
            actualizarContador();
        })
        .catch(error => {
            const mensaje = document.getElementById("mensaje-cargando");
            if (mensaje) mensaje.textContent = "Error al cargar productos: " + error.message;
            console.error("Fetch error:", error);
        });



    /* -------------------- CARRITO -------------------- */
    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    function guardarCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function agregarAlCarrito(id) {
        const idNum = Number(id);

        const card = document.querySelector(`.btn-add[data-id="${idNum}"]`).closest(".card-product");
        const title = card.querySelector("h3").textContent;
        
        // FIX: convertir correctamente
        const price = Number(card.querySelector(".price").childNodes[0].textContent.replace("$", ""));

        const img = card.querySelector("img").src;

        let carrito = obtenerCarrito();

        const item = carrito.find(p => p.id === idNum);

        if (item) {
            item.qty++;
        } else {
            carrito.push({
                id: idNum,
                title: title,
                price: Number(price), // ← FIX aseguramos número
                img: img,
                qty: 1
            });
        }

        guardarCarrito(carrito);
        actualizarContador();
        renderCarrito();
    }

    const contadorCarrito = document.getElementById('contador-carrito');

    function actualizarContador() {
        const carrito = obtenerCarrito();
        const total = carrito.reduce((acc, item) => acc + item.qty, 0);
    
        if (contadorCarrito) {
            contadorCarrito.textContent = total;
    
            // si es 0 → ocultar
            if (total === 0) {
                contadorCarrito.classList.add("hidden");
            } else {
                contadorCarrito.classList.remove("hidden");
            }
        }
    }

    function cargarEventosAgregar() {
        const botones = document.querySelectorAll('.btn-add, .add-cart');
        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.getAttribute('data-id');
                agregarAlCarrito(id);
            });
        });
    }


    /* -------------------- RENDER CARRITO -------------------- */

    function renderCarrito() {
        const carrito = obtenerCarrito();
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");

        if (!cartItems) return;

        cartItems.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;

            const li = document.createElement("li");
            li.classList.add("cart-item");

            li.innerHTML = `
                <img src="${item.img}" style="width:40px; height:40px; border-radius:6px; margin-right:8px;">
                
                <div class="cart-item-info">
                    <p class="cart-title">${item.title}</p>
                    <p class="cart-unitary-price">$${item.price.toFixed(2)} x ${item.qty} = 
                       <b>$${subtotal.toFixed(2)}</b></p>
                </div>

                <div class="quantity-buttons">
                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="eliminarItem(${item.id})">X</button>
            `;

            cartItems.appendChild(li);
        });

        // ← FIX IMPORTANTE
        cartTotal.textContent = total.toFixed(2);
    }


    /* -------------------- SUMAR / RESTAR -------------------- */

    function cambiarCantidad(id, amount) {
        let carrito = obtenerCarrito();
        const item = carrito.find(p => p.id === id);

        if (!item) return;

        item.qty += amount;

        if (item.qty <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }

        guardarCarrito(carrito);
        actualizarContador();
        renderCarrito();
    }


    /* -------------------- ELIMINAR ITEM -------------------- */

    function eliminarItem(id) {
        let carrito = obtenerCarrito();
        carrito = carrito.filter(p => p.id !== id);

        guardarCarrito(carrito);
        actualizarContador();
        renderCarrito();
    }

    window.cambiarCantidad = cambiarCantidad;
    window.eliminarItem = eliminarItem;


    /* -------------------- VACIAR CARRITO -------------------- */

    const btnVaciar = document.getElementById('vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.onclick = () => {
            localStorage.removeItem('carrito');
            actualizarContador();
            renderCarrito();
        };
    }


    /* -------------------- MOSTRAR / OCULTAR CARRITO -------------------- */

    const cartBox = document.getElementById("cart-box");
    const iconCart = document.getElementById("icon-cart");

    if (iconCart && cartBox) {
        iconCart.addEventListener("click", () => {
            cartBox.classList.toggle("hidden");
            renderCarrito();
        });
    }

});