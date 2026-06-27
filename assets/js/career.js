/* =====================================================
   Career Guide v5.0
   Universal Career Loader
   Designed & Developed by Kunal Gautam
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
           DETAIL FILES
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
    "../data/sports-details.json",
    "../data/defence-details.json",
    "../data/aviation-details.json"

];

        let career = null;

        /* =========================
           FIND CAREER
        ========================= */

        for (const file of detailFiles) {

            try {

                const response =
                    await fetch(file);

                if (!response.ok)
                    continue;

                const data =
                    await response.json();

                const foundCareer =
                    data.careers.find(
                        item =>
                        item.id === careerId
                    );

                if (foundCareer) {

                    career = foundCareer;
                    break;

                }

            }

            catch {

                console.log(
                    `${file} not found`
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
           HERO SECTION
        ========================= */

        document.getElementById("careerName")
            .textContent =
            career.name || "Career";

        const tagline =
            document.getElementById(
                "careerTagline"
            );

        if (tagline) {

            tagline.textContent =
                career.overview ||
                "Explore this career path.";

        }

        /* =========================
           HERO STATS
        ========================= */

        if (
            career.salary &&
            typeof career.salary === "object"
        ) {

            const salaryStat =
                document.getElementById(
                    "salaryStat"
                );

            if (salaryStat) {

                salaryStat.textContent =
                    career.salary.midLevel ||
                    career.salary.fresher ||
                    "N/A";

            }

            const salaryFresher =
                document.getElementById(
                    "salaryFresher"
                );

            const salaryMid =
                document.getElementById(
                    "salaryMid"
                );

            const salarySenior =
                document.getElementById(
                    "salarySenior"
                );

            if (salaryFresher)
                salaryFresher.textContent =
                    career.salary.fresher ||
                    "N/A";

            if (salaryMid)
                salaryMid.textContent =
                    career.salary.midLevel ||
                    "N/A";

            if (salarySenior)
                salarySenior.textContent =
                    career.salary.seniorLevel ||
                    "N/A";

        }

        const educationStat =
            document.getElementById(
                "educationStat"
            );

        if (educationStat) {

            educationStat.textContent =
                "Bachelor's";

        }

        /* =========================
           TEXT SECTIONS
        ========================= */

        setText(
            "careerOverview",
            career.overview
        );

        setText(
            "whyChoose",
            career.whyChoose
        );

        setText(
            "eligibility",
            career.eligibility
        );

        setText(
            "educationPath",
            career.educationPath
        );

        setText(
            "feeRange",
            career.feeRange
        );

        setText(
            "workEnvironment",
            career.workEnvironment
        );

        setText(
            "futureScope",
            career.futureScope
        );

        setText(
            "aiImpact",
            career.aiImpact
        );

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

        loadList(
            "relatedCareers",
            career.relatedCareers
        );

    }

    catch (error) {

        console.error(
            "Career Load Error:",
            error
        );

    }

});

/* =========================
   TEXT HELPER
========================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        value || "Not Available";

}

/* =========================
   LIST LOADER
========================= */

function loadList(
    elementId,
    items
) {

    const container =
        document.getElementById(
            elementId
        );

    if (!container) return;

    container.innerHTML = "";

    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML =
            "<li>Not Available</li>";

        return;

    }

    items.forEach(item => {

        const li =
            document.createElement("li");

        /* =========================
           CLICKABLE RELATED CAREERS
        ========================= */

        if (
            elementId ===
            "relatedCareers"
        ) {

            li.className =
                "related-career-item";

            li.style.cursor =
                "pointer";

            li.title =
                "View Career";

            li.textContent =
                item;

            li.addEventListener(
                "click",
                () => {

                    const careerSlug =
                        item
                        .toLowerCase()
                        .replace(/[()]/g, "")
                        .replace(/&/g, "and")
                        .replace(/\s+/g, "-");

                    window.location.href =
                        `career.html?id=${careerSlug}`;

                }
            );

        }

        else {

            li.textContent =
                item;

        }

        container.appendChild(li);

    });

}