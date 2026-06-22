/* =====================================================
   Career Guide v5.0
   Premium Homepage Script
   Designed & Developed by Kunal Gautam
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    updateGreeting();

    loadCareerSpotlight();

    loadCareerInsights();

    rotateCareerSpotlight();

    rotateInsights();

});

/* =========================
   DYNAMIC GREETING
========================= */

function updateGreeting() {

    const greeting =
        document.getElementById("greeting");

    if (!greeting) return;

    const hour =
        new Date().getHours();

    let message = "";

    if (hour < 12) {

        message =
            "🌅 Good Morning, Kunal";

    }

    else if (hour < 17) {

        message =
            "☀️ Good Afternoon, Kunal";

    }

    else {

        message =
            "🌙 Good Evening, Kunal";

    }

    greeting.textContent =
        message;

}

/* =========================
   CAREER SPOTLIGHT
========================= */

const spotlightCareers = [

    {
        name: "Artificial Intelligence Engineer",
        description:
            "Build intelligent systems using machine learning, neural networks and advanced AI technologies.",
        salary: "₹8–25 LPA"
    },

    {
        name: "Data Scientist",
        description:
            "Analyze data and generate insights for business, healthcare, finance and technology sectors.",
        salary: "₹7–22 LPA"
    },

    {
        name: "Clinical Psychologist",
        description:
            "Assess, diagnose and help individuals overcome emotional and mental health challenges.",
        salary: "₹5–18 LPA"
    },

    {
        name: "Investment Banker",
        description:
            "Advise organizations on investments, mergers, acquisitions and financial growth strategies.",
        salary: "₹10–40 LPA"
    },

    {
        name: "UX Designer",
        description:
            "Create user-friendly digital experiences and improve customer satisfaction through design.",
        salary: "₹6–20 LPA"
    }

];

let spotlightIndex = 0;

function loadCareerSpotlight() {

    const career =
        spotlightCareers[spotlightIndex];

    const careerName =
        document.getElementById(
            "spotlightCareer"
        );

    const careerDescription =
        document.getElementById(
            "spotlightDescription"
        );

    const salary =
        document.querySelector(
            ".spotlight-salary"
        );

    if (careerName)
        careerName.textContent =
        career.name;

    if (careerDescription)
        careerDescription.textContent =
        career.description;

    if (salary)
        salary.textContent =
        career.salary;

}

function rotateCareerSpotlight() {

    setInterval(() => {

        spotlightIndex++;

        if (
            spotlightIndex >=
            spotlightCareers.length
        ) {

            spotlightIndex = 0;

        }

        loadCareerSpotlight();

    }, 5000);

}

/* =========================
   LIVE INSIGHTS
========================= */

const insights = [

    "Artificial Intelligence continues to be one of the fastest-growing career fields globally.",

    "Cyber Security professionals remain among the most in-demand technology experts.",

    "Clinical Psychology is witnessing rapid growth due to increased mental health awareness.",

    "Data Science and Analytics roles continue to expand across industries.",

    "Sustainability and Climate Technology careers are emerging as future-ready professions.",

    "FinTech is transforming banking and creating new career opportunities worldwide."

];

let insightIndex = 0;

function loadCareerInsights() {

    const insightElement =
        document.getElementById(
            "insightText"
        );

    if (!insightElement) return;

    insightElement.textContent =
        insights[insightIndex];

}

function rotateInsights() {

    setInterval(() => {

        insightIndex++;

        if (
            insightIndex >=
            insights.length
        ) {

            insightIndex = 0;

        }

        loadCareerInsights();

    }, 6000);

}

/* =========================
   CAREER OF THE DAY
========================= */

const careerOfDay = [

    "Artificial Intelligence Engineer",

    "Data Scientist",

    "Investment Banker",

    "Clinical Psychologist",

    "UX Designer",

    "Cyber Security Specialist"

];

function getCareerOfDay() {

    const day =
        new Date().getDate();

    const career =
        careerOfDay[
            day %
            careerOfDay.length
        ];

    const heading =
        document.querySelector(
            ".content-card h4"
        );

    if (heading) {

        heading.textContent =
            career;

    }

}

getCareerOfDay();

/* =========================
   CONSOLE MESSAGE
========================= */

console.log(
    "Career Guide v5.0 Loaded Successfully"
);
