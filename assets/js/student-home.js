"use strict";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-suite-action]").forEach(action => {
        action.addEventListener("click", event => {
            event.preventDefault();
            window.location.href = "../student/dashboard.html";
        });
    });
});
