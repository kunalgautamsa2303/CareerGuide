/* ==========================================================
   Career Guide
   Career Library v2.0
========================================================== */

"use strict";

/* ==========================================================
   Global Variables
========================================================== */

let domains = [];
let currentDomain = null;

/* ==========================================================
   Initialize
========================================================== */

document.addEventListener("DOMContentLoaded", initializeCareerLibrary);

async function initializeCareerLibrary() {

    try {

        const database = await loadAllCareers();

        domains = database.domains || [];

        const params = new URLSearchParams(window.location.search);

        currentDomain = params.get("domain");

        if (currentDomain) {

            await loadCareerDomain(currentDomain);

        } else {

            renderDomainCards();

        }

        initializeSearch();

    }

    catch (error) {

        console.error(error);

        showError("Unable to load Career Library.");

    }

}

/* ==========================================================
   Render Domain Cards
========================================================== */

function renderDomainCards() {

    const container = document.getElementById("careerContainer");

    const title = document.getElementById("libraryTitle");

    const subtitle = document.getElementById("librarySubtitle");

    title.textContent = "Explore Career Domains";

    subtitle.textContent =
        "Choose a domain to explore all available careers.";

    container.innerHTML = "";

    domains.forEach(domain => {

        container.appendChild(createDomainCard(domain));

    });

}

/* ==========================================================
   Domain Card
========================================================== */

function createDomainCard(domain) {

    const card = document.createElement("article");

    card.className = "career-card";

    card.innerHTML = `

        <div class="career-icon">

            ${domain.icon}

        </div>

        <h3>

            ${domain.name}

        </h3>

        <p>

            ${domain.description}

        </p>

        <div class="career-meta">

            <span class="career-count">

                Explore Careers

            </span>

            <button class="explore-btn">

                Explore
                <i class="bi bi-arrow-right"></i>

            </button>

        </div>

    `;

    card.addEventListener("click", () => {

        window.location.href =
            `index.html?domain=${domain.id}`;

    });

    return card;

}

/* ==========================================================
   Load Selected Domain
========================================================== */

async function loadCareerDomain(domainId) {

    const container = document.getElementById("careerContainer");

    const title = document.getElementById("libraryTitle");

    const subtitle = document.getElementById("librarySubtitle");

    const selectedDomain = domains.find(

        item => item.id === domainId

    );

    if (!selectedDomain) {

        showError("Career domain not found.");

        return;

    }

    const data =
        await loadCareerCategory(selectedDomain.id);

    if (!data || !data.careers) {

        showError("No careers available.");

        return;

    }

    title.textContent = selectedDomain.name;

    subtitle.textContent =
        `${data.careers.length} Careers Available`;

    container.innerHTML = "";

    data.careers.forEach(career => {

        container.appendChild(

            createCareerCard(

                career,

                selectedDomain.id

            )

        );

    });

}
/* ==========================================================
   Career Card
========================================================== */

function createCareerCard(career, domainId) {

    const card = document.createElement("article");

    card.className = "career-card";

    card.innerHTML = `

        <div class="career-icon">
            <i class="bi bi-briefcase-fill"></i>
        </div>

        <h3>${career.name}</h3>

        <p>
            Click to explore career details, eligibility,
            entrance exams and future opportunities.
        </p>

        <div class="career-meta">

            <span class="career-count">
                View Details
            </span>

            <button class="explore-btn">

                Open
                <i class="bi bi-arrow-right"></i>

            </button>

        </div>

    `;

    card.addEventListener("click", () => {

        window.location.href =
            `details.html?domain=${domainId}&career=${career.id}`;

    });

    return card;

}

/* ==========================================================
   Search
========================================================== */

function initializeSearch() {

    const input = document.getElementById("careerSearch");

    if (!input) return;

    input.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        const cards =
            document.querySelectorAll(".career-card");

        cards.forEach(card => {

            const text =
                card.textContent.toLowerCase();

            card.style.display =
                text.includes(keyword)
                    ? ""
                    : "none";

        });

    });

}

/* ==========================================================
   Empty State
========================================================== */

function showEmpty(message = "No careers found.") {

    const container =
        document.getElementById("careerContainer");

    container.innerHTML = `

        <div class="empty-state">

            <i class="bi bi-search"></i>

            <h3>${message}</h3>

        </div>

    `;

}

/* ==========================================================
   Error State
========================================================== */

function showError(message) {

    const container =
        document.getElementById("careerContainer");

    container.innerHTML = `

        <div class="empty-state">

            <i class="bi bi-exclamation-circle"></i>

            <h3>${message}</h3>

        </div>

    `;

}

/* ==========================================================
   Back to Domains
========================================================== */

function backToDomains() {

    window.location.href = "index.html";

}

/* ==========================================================
   Utilities
========================================================== */

function getDomain(id) {

    return domains.find(

        domain => domain.id === id

    );

}

function getCareer(domainData, careerId) {

    if (!domainData || !domainData.careers) {

        return null;

    }

    return domainData.careers.find(

        career => career.id === careerId

    );

}

/* ==========================================================
   End of File
========================================================== */