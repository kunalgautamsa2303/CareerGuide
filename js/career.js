/* =====================================================
   Career Guide v2.0
   Multi Domain Career Loader
===================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const careerId =
            params.get("id");

        if (!careerId) {

            document.getElementById("careerName")
                .textContent = "Career Not Found";

            return;
        }

        /* =========================
           ALL DETAIL FILES
        ========================= */

        const detailFiles = [

            "../data/engineering-details.json",
            "../data/medicine-details.json",
            "../data/design-details.json",
            "../data/finance-details.json",
            "../data/management-details.json",
            "../data/law-details.json",
            "../data/psychology-details.json",
            "../data/architecture-details.json",
            "../data/media-details.json",
            "../data/education-details.json",
            "../data/sports-details.json"

        ];

        let career = null;

        /* =========================
           SEARCH ALL FILES
        ========================= */

        for (const file of detailFiles) {

            try {

                const response =
                    await fetch(file);

                if (!response.ok) continue;

                const data =
                    await response.json();

                const foundCareer =
                    data.careers.find(
                        item => item.id === careerId
                    );

                if (foundCareer) {

                    career = foundCareer;
                    break;
                }

            }

            catch(error){

                console.log(
                    `${file} not available yet`
                );
            }

        }

        if (!career) {

            document.getElementById("careerName")
                .textContent =
                "Career Not Found";

            return;
        }

        /* =========================
           BASIC DETAILS
        ========================= */

        document.getElementById("careerName")
            .textContent =
            career.name;

        document.getElementById("careerOverview")
            .textContent =
            career.overview;

        document.getElementById("eligibility")
            .textContent =
            career.eligibility;

        document.getElementById("educationPath")
            .textContent =
            career.educationPath;

        document.getElementById("salary")
            .textContent =
            career.salary;

        document.getElementById("futureScope")
            .textContent =
            career.futureScope;

        document.getElementById("aiImpact")
            .textContent =
            career.aiImpact;

        /* =========================
           LISTS
        ========================= */

        loadList(
            "skills",
            career.skills
        );

        loadList(
            "entranceExams",
            career.entranceExams
        );

        loadList(
            "topColleges",
            career.topColleges
        );

        loadList(
            "careerOpportunities",
            career.careerOpportunities
        );

        loadList(
            "recruiters",
            career.recruiters
        );

        loadList(
            "pros",
            career.pros
        );

        loadList(
            "cons",
            career.cons
        );

    }

    catch(error){

        console.error(
            "Career Load Error:",
            error
        );

    }

});

/* =========================
   LIST LOADER
========================= */

function loadList(elementId, items){

    const container =
        document.getElementById(elementId);

    container.innerHTML = "";

    if (!items) return;

    items.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        container.appendChild(li);

    });

}
