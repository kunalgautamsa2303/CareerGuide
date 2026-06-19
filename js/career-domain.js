/* =====================================================
   Career Guide v1.0
   Career Domain Script v2
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

            document.getElementById("domainName")
                .textContent = "Domain Not Found";

            return;
        }

        /* =========================
           LOAD DOMAIN FILE
        ========================= */

        const response =
            await fetch(`../data/${domainId}.json`);

        const data =
            await response.json();

        /* =========================
           PAGE DETAILS
        ========================= */

        document.getElementById("domainName")
            .textContent = data.domain;

        document.getElementById("domainDescription")
            .textContent =
            `Explore careers in ${data.domain}`;

        document.getElementById("careerCount")
            .textContent =
            `${data.careers.length} Careers`;

        /* =========================
           LOAD CAREERS
        ========================= */

        const container =
            document.getElementById("careerContainer");

        container.innerHTML = "";

        data.careers.forEach(career => {

            const card =
                document.createElement("div");

            card.className =
                "career-card";

            card.innerHTML = `

                <h4>
                    ${career.name}
                </h4>

                <div class="career-info">
                    Career Path
                </div>

                <button
                    class="view-btn"
                    onclick="openCareer('${career.id}')">

                    Explore Career →

                </button>

            `;

            container.appendChild(card);

        });

    }

    catch(error){

        console.error(error);

        document.getElementById("domainName")
            .textContent =
            "Domain Not Found";

    }

});

/* =========================
   OPEN CAREER
========================= */

function openCareer(careerId){

    window.location.href =
        `career.html?id=${careerId}`;

}
