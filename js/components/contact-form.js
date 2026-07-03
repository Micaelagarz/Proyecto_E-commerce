export function initContactForm() {

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
    

}