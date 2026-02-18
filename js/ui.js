export function toggleSidebar() {
    const nav = document.getElementById("main-nav");
    const backdrop = document.querySelector(".mobile-backdrop");
    nav.classList.toggle("active");
    backdrop.classList.toggle("visible");
}

export function closeAllMenus() {
    document.getElementById("main-nav")?.classList.remove("active");
    document.querySelector(".mobile-backdrop")?.classList.remove("visible");
    document.querySelectorAll(".dropdown-content").forEach(d => d.classList.remove("show"));
}

export function attachNavigationListeners() {
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle?.addEventListener("click", toggleSidebar);
    
    document.querySelector(".mobile-backdrop")?.addEventListener("click", closeAllMenus);
}
