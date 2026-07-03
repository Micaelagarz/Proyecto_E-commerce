export function initCart(){

    const contadorCarrito = document.getElementById('contador-carrito');
    
    cargarEventosAgregar();
    actualizarContador();

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

}

