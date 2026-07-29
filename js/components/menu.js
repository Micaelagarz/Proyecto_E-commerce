export function initMenu() {

    const menuOpenButton = document.querySelector("#menu-open-button");

    if (!menuOpenButton) return;

    menuOpenButton.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });

}