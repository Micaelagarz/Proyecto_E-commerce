export async function initProducts() {

    try {

        const res = await fetch("https://dummyjson.com/products/category/groceries");

        const data = await res.json();

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
                                <p>Add</p>
                            </span>
                        </div>
                    `;
    
                    contenedor.appendChild(card);
        });

    } catch (error) {

        const mensaje = document.getElementById("mensaje-cargando");

        if (mensaje)
            mensaje.textContent = "Error al cargar productos: " + error.message;

        console.error(error);

    }

}

