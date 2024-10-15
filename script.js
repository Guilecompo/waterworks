document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    sidebarToggle.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("collapsed");
    });

    // Listen for the theme toggle globally
    document.querySelectorAll(".theme-toggle").forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            toggleLocalStorage();
            toggleRootClass();
        });
    });

    function toggleRootClass() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme == 'dark' ? 'light' : 'dark';

        // Update root HTML element theme attribute
        document.documentElement.setAttribute('data-bs-theme', newTheme);

        // Update styles for the sidebar (adjust according to your needs)
        const card = document.querySelector("#card");
        const sidebar = document.querySelector("#sidebar");
        const sidebarLogo = document.querySelector(".sidebar-logo");
        const sidebarHeader = document.querySelector(".sidebar-header");
        const sidebarLinks = document.querySelectorAll(".sidebar-link");

        // Check if elements exist before accessing their properties
        if (card) {
            card.style.backgroundColor = newTheme === 'dark' ? '#212529' : '#217899';
        }

        if (sidebar) {
            sidebar.style.backgroundColor = newTheme === 'dark' ? '#212529' : '#212529';
        }

        if (sidebarLogo) {
            sidebarLogo.style.color = newTheme === 'dark' ? '#fff' : '#000';
        }

        if (sidebarHeader) {
            sidebarHeader.style.color = newTheme === 'dark' ? '#adb5bd' : '#adb5bd';
        }
        if (sidebarToggle) {
            sidebarToggle.style.color = newTheme === 'dark' ? '#ffffff' : '#ffffff';
        }
        

        // Dynamically set text color for each sidebar link based on the theme
        sidebarLinks.forEach(link => {
            link.style.color = newTheme === 'dark' ? '#e9ecef' : '#e9ecef';
        });

        // Reset styles for all links
        sidebarLinks.forEach(link => {
            link.style.backgroundColor = '';
        });

        // Apply styles for active text color
        const activeLink = document.querySelector(".sidebar-link.active");
        if (activeLink) {
            activeLink.style.color = 'black';
        }
    }

    function toggleLocalStorage() {
        if (isLight()) {
            localStorage.removeItem("light");
        } else {
            localStorage.setItem("light", "set");
        }
    }

    function isLight() {
        return localStorage.getItem("light");
    }

    if (isLight()) {
        toggleRootClass();
    }
});
