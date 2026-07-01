"use strict";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", event => {
            const action = form.getAttribute("action");
            if (!action || action === "#") {
                event.preventDefault();
                window.location.href = "../student/dashboard.html";
            }
        });
    });
});
