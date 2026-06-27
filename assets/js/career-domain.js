/* =====================================================
   Career Guide v3.0
   Dynamic Career Domain Loader
   Designed & Developed by Kunal Gautam
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        /* =========================
           GET DOMAIN ID
        ========================= */

        const params =
            new URLSearchParams(window.location.search);

        const domainId =
            params.get("id");

        if (!domainId) {

            showError();
            return;

        }

        /* =========================
           LOAD JSON FILE
        ========================= */

        const response =
            await fetch(`../data/${domainId}.json`);

        if (!response.ok) {

            throw new Error(
                "Domain file not found"
            );

        }

        const data =
            await response.json();

        /* =========================
           HERO SECTION
        ========================= */

        document.getElementById("domainName")
            .textContent =
            data.domain || "Career Domain";

        document.getElementById("domainDescription")
            .textContent =
            data.description ||
            "Explore careers in this domain.";

        /* =========================
           CAREER COUNT
        ========================= */

        const careerCount =
            document.getElementById("careerCount");

        if (careerCount) {

            careerCount.textContent =
                `${data.careers.length}+`;

        }

        /* =========================
           LOAD CAREERS
        ========================= */

        loadCareers(data.careers);
        loadTrendingCareers(data.careers);

    }

    catch (error) {

        console.error(
            "Domain Load Error:",
            error
        );

        showError();

    }

});

/* =========================
   LOAD CAREERS
========================= */

function loadCareers(careers) {

    const container =
        document.getElementById(
            "careerContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    careers.forEach(career => {

        const card =
            document.createElement("div");

        card.className =
            "career-card";

        card.innerHTML = `

        <h4>
            ${career.name}
        </h4>

        ${career.salary ? `
        <div class="career-info">
            💰 Salary: ${career.salary}
        </div>
        ` : ""}

        ${career.duration ? `
        <div class="career-info">
            🎓 Duration: ${career.duration}
        </div>
        ` : ""}

        <button
            class="view-btn"
            onclick="openCareer('${career.id}')">

            Explore Career →

        </button>

        `;

        container.appendChild(card);

    });

}

/* =========================
   OPEN CAREER
========================= */

function openCareer(careerId) {

    window.location.href =
        `career.html?id=${careerId}`;

}

/* =========================
   ERROR HANDLER
========================= */

function showError() {

    const domainName =
        document.getElementById(
            "domainName"
        );

    const domainDescription =
        document.getElementById(
            "domainDescription"
        );

    if (domainName) {

        domainName.textContent =
            "Domain Not Found";

    }

    if (domainDescription) {

        domainDescription.textContent =
            "The requested domain could not be loaded.";

    }

}
function loadTrendingCareers(careers){

    const container =
        document.getElementById(
            "trendingContainer"
        );

    if(!container) return;

    container.innerHTML = "";

    careers.slice(0,6).forEach(career=>{

        const card =
            document.createElement("div");

        card.className =
            "trend-card";

        card.textContent =
            career.name;

        container.appendChild(card);

    });

}