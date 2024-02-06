// script.js

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
        const sidebar = document.querySelector("#sidebar");
        const sidebarLogo = document.querySelector(".sidebar-logo");
        const sidebarHeader = document.querySelector(".sidebar-header");
        const sidebarLinks = document.querySelectorAll(".sidebar-link");

        // Dynamically set background color and border based on the theme
        if (newTheme === 'dark') {
            sidebar.style.backgroundColor = '#212529';  // Dark theme background color
            sidebar.style.borderRight = 'none';  // No border in dark mode
            sidebarLogo.style.color = '#fff';  // Light text color
            sidebarHeader.style.color = '#adb5bd';  // Light text color

            // Change text color for each sidebar link in dark mode
            sidebarLinks.forEach(link => {
                link.style.color = '#e9ecef';
            });

            // Reset styles for all links in dark mode
            sidebarLinks.forEach(link => {
                link.style.backgroundColor = '';  // Reset background color
            });

            // Apply styles for active text color in dark mode
            const activeLink = document.querySelector(".sidebar-link.active");
            if (activeLink) {
                activeLink.style.color = 'black';
            }
        } else {
            sidebar.style.backgroundColor = '#ced4da';  // Light theme background color
            sidebar.style.borderRight = '1px solid #212529';  // Border in light mode
            sidebarLogo.style.color = '#000';  // Dark text color
            sidebarHeader.style.color = '#000';  // Dark text color

            // Change text color for each sidebar link in light mode
            sidebarLinks.forEach(link => {
                link.style.color = '#000';
            });

            // Reset styles for all links in light mode
            sidebarLinks.forEach(link => {
                link.style.backgroundColor = '';  // Reset background color
            });

            // Apply styles for active text color in light mode
            const activeLink = document.querySelector(".sidebar-link.active");
            if (activeLink) {
                activeLink.style.color = 'black';
            }
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
