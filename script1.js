document.addEventListener("DOMContentLoaded", function () {
   

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
