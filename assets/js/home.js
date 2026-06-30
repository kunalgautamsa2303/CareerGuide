/* ==========================================================
   Career Guide v2.1
   Homepage JavaScript
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       Back To Top Button
    ========================================== */

    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }

    /* ==========================================
       Sticky Header Shadow
    ========================================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 20) {

            header.style.boxShadow = "0 10px 30px rgba(15,23,42,.08)";

        } else {

            header.style.boxShadow = "none";

        }

    });

    /* ==========================================
       Scroll Animation
    ========================================== */

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {

        threshold: 0.15

    });

    document.querySelectorAll(

        "section,.career-card,.field-card,.university-card,.counsellor-card,.spotlight-card"

    ).forEach(item => {

        item.classList.add("hidden");

        observer.observe(item);

    });

    /* ==========================================
       Smooth Anchor Navigation
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });

    /* ==========================================
       Mobile Menu
       (Temporary)
    ========================================== */

    const menuButton = document.querySelector(".mobile-menu");

    const desktopMenu = document.querySelector(".desktop-menu");

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            desktopMenu.classList.toggle("mobile-open");

        });

    }

    /* ==========================================
       Search
    ========================================== */

    const searchInput = document.querySelector(".search-box input");

    const searchButton = document.querySelector(".search-box button");

    function performSearch() {

        const keyword = searchInput.value.trim();

        if (keyword === "") {

            alert("Please enter a career, university or counsellor.");

            searchInput.focus();

            return;

        }

        console.log("Searching for:", keyword);

        /*
        Future Integration

        window.location.href =
        "search/index.html?q=" +
        encodeURIComponent(keyword);
        */

    }

    if (searchButton) {

        searchButton.addEventListener("click", performSearch);

    }

    if (searchInput) {

        searchInput.addEventListener("keypress", (e) => {

            if (e.key === "Enter") {

                performSearch();

            }

        });

    }

    /* ==========================================
       Active Card Effect
    ========================================== */

    document.querySelectorAll(

        ".career-card,.field-card,.university-card,.counsellor-card,.spotlight-card"

    ).forEach(card => {

        card.addEventListener("mousedown", () => {

            card.style.transform = "scale(.98)";

        });

        card.addEventListener("mouseup", () => {

            card.style.transform = "";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

    /* ==========================================
       Navbar Active Link
    ========================================== */

    const navLinks = document.querySelectorAll(".desktop-menu a");

    window.addEventListener("scroll", () => {

        let current = "";

        document.querySelectorAll("section").forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (pageYOffset >= sectionTop) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /* ==========================================
       Page Loaded
    ========================================== */

    document.body.classList.add("loaded");

});

/* ==========================================================
   End of File
========================================================== */