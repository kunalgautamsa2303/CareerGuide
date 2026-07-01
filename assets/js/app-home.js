/* ==========================================================
   USSC Connect
   Homepage
   app-home.js
   Part 1
========================================================== */

"use strict";

/* ==========================================================
   ELEMENTS
========================================================== */

const body = document.body;

const pageLoader = document.getElementById("pageLoader");

const backToTop = document.getElementById("backToTop");

const openModal = document.getElementById("openModal");

const startModal = document.getElementById("startModal");

const closeModal = document.getElementById("closeModal");

const globalSearch = document.getElementById("globalSearch");

const heroSearch = document.getElementById("heroSearch");

const heroSearchBtn = document.getElementById("heroSearchBtn");

const mobileSearch = document.getElementById("mobileSearch");

let homeSearchIndex = [];

/* ==========================================================
   PAGE LOADER
========================================================== */

window.addEventListener("load", () => {

    if (!pageLoader) return;

    pageLoader.style.opacity = "0";

    setTimeout(() => {

        pageLoader.style.display = "none";

    }, 400);

});

/* ==========================================================
   MODAL
========================================================== */

function openGetStartedModal() {

    if (!startModal) return;

    startModal.style.display = "flex";

    body.style.overflow = "hidden";

}

function closeGetStartedModal() {

    if (!startModal) return;

    startModal.style.display = "none";

    body.style.overflow = "";

}

if (openModal) {

    openModal.addEventListener("click", openGetStartedModal);

}

if (closeModal) {

    closeModal.addEventListener("click", closeGetStartedModal);

}

if (startModal) {

    startModal.addEventListener("click", (event) => {

        if (event.target === startModal) {

            closeGetStartedModal();

        }

    });

}

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeGetStartedModal();

    }

});

/* ==========================================================
   SEARCH
========================================================== */

function performSearch(keyword) {

    const query = keyword.trim();

    if (!query) return;

    const institutionMatch = findInstitutionSearchMatch(query);
    const target = institutionMatch
        ? "universities/index.html"
        : "careers/index.html";

    window.location.href =
        `${target}?search=${encodeURIComponent(query)}`;

}

if (heroSearch) {

    heroSearch.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            performSearch(heroSearch.value);

        }

    });

}

async function initializeHomeSearchSuggestions() {

    homeSearchIndex = await loadHomeSearchIndex();

    [globalSearch, heroSearch, mobileSearch].forEach(input => {

        if (!input) return;

        const results = createSearchResults(input);

        input.addEventListener("input", () => {

            renderSearchSuggestions(input, results);

        });

        input.addEventListener("focus", () => {

            renderSearchSuggestions(input, results);

        });

    });

    document.addEventListener("click", (event) => {

        if (!event.target.closest(".search-wrapper")) {

            document
                .querySelectorAll(".live-search-results")
                .forEach(results => results.classList.remove("active"));

        }

    });

}

async function loadHomeSearchIndex() {

    try {

        const response = await fetch("data/careers.json");
        const data = await response.json();
        const domains = data.domains || [];
        const groups = await Promise.all(domains.map(async domain => {

            const listResponse = await fetch(`data/${domain.file}`);

            if (!listResponse.ok) return [];

            const text = await listResponse.text();

            if (!text.trim()) return [];

            const listData = JSON.parse(text);

            return (listData.careers || []).map(career => ({

                id: career.id,
                name: career.name,
                domainId: domain.id,
                domainName: domain.name,
                href: `careers/details.html?domain=${domain.id}&career=${career.id}`

            }));

        }));

        const careerItems = groups.flat().map(item => ({

            ...item,
            kind: "Career",
            searchableText: `${item.name} ${item.domainName}`

        }));

        let universityItems = [];

        try {

            const universityResponse = await fetch("data/universities.json");

            if (universityResponse.ok) {

                const universityData = await universityResponse.json();
                universityItems = (universityData.universities || []).map(university => ({

                    id: university.id,
                    name: university.name,
                    domainName: `${university.city}, ${university.state}`,
                    kind: university.type && university.type.includes("College") ? "College" : "University",
                    href: `universities/details.html?id=${encodeURIComponent(university.id)}`,
                    searchableText: [
                        university.name,
                        university.type,
                        university.city,
                        university.state,
                        ...(university.streams || []),
                        ...(university.entranceExams || [])
                    ].join(" ")

                }));

            }

        } catch (universityError) {

            console.error(universityError);

        }

        return [...careerItems, ...universityItems];

    }

    catch (error) {

        console.error(error);

        return [];

    }

}

function createSearchResults(input) {

    const wrapper = document.createElement("div");
    const results = document.createElement("div");

    wrapper.className = "search-wrapper";
    results.className = "live-search-results";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(results);

    return results;

}

function renderSearchSuggestions(input, results) {

    const query = input.value.trim().toLowerCase();

    if (query.length < 1) {

        results.classList.remove("active");
        results.innerHTML = "";
        return;

    }

    const matches = homeSearchIndex
        .filter(career => {

            const name = career.name.toLowerCase();
            const domain = career.domainName.toLowerCase();
            const searchText = (career.searchableText || "").toLowerCase();

            return name.startsWith(query) ||
                name.includes(query) ||
                domain.includes(query) ||
                searchText.includes(query);

        })
        .slice(0, 8);

    if (matches.length === 0) {

        results.innerHTML = `
            <button type="button" class="live-search-empty">
                No matching results found
            </button>
        `;
        results.classList.add("active");
        return;

    }

    results.innerHTML = matches.map(career => `
        <a href="${career.href}" class="live-search-item">
            <span>${career.name}</span>
            <small>${career.kind || "Career"} - ${career.domainName}</small>
        </a>
    `).join("");

    results.classList.add("active");

}

function findInstitutionSearchMatch(query) {

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery || !homeSearchIndex.length) return null;

    const institutionWords = [
        "university",
        "college",
        "iit",
        "iim",
        "nit",
        "iiit",
        "aiims",
        "nift",
        "nid",
        "nlu",
        "iisc",
        "bits"
    ];

    return homeSearchIndex.find(item => {

        if (!["University", "College"].includes(item.kind)) return false;

        const name = item.name.toLowerCase();
        const looksLikeInstitution = institutionWords.some(word => normalizedQuery.includes(word));

        return name === normalizedQuery ||
            name.startsWith(normalizedQuery) ||
            (looksLikeInstitution && name.includes(normalizedQuery));

    });

}

if (heroSearchBtn && heroSearch) {

    heroSearchBtn.addEventListener("click", () => {

        performSearch(heroSearch.value);

    });

}

if (globalSearch) {

    globalSearch.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            performSearch(globalSearch.value);

        }

    });

}

if (mobileSearch) {

    mobileSearch.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            performSearch(mobileSearch.value);

        }

    });

}

/* ==========================================================
   BACK TO TOP
========================================================== */

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    if (window.scrollY > 400) {

        backToTop.classList.add("active");

    }

    else {

        backToTop.classList.remove("active");

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

/* ==========================================================
   COUNTER ANIMATION
========================================================== */

function animateCounter(id, target) {

    const element = document.getElementById(id);

    if (!element) return;

    let value = 0;

    const increment = Math.ceil(target / 80);

    const timer = setInterval(() => {

        value += increment;

        if (value >= target) {

            value = target;

            clearInterval(timer);

        }

        element.textContent = value.toLocaleString() + "+";

    }, 20);

}

document.addEventListener("DOMContentLoaded", () => {

    animateCounter("careerCount", 1500);

    animateCounter("universityCount", 500);

    animateCounter("schoolCount", 100);

    animateCounter("expertCount", 1000);

    initializeHomeSearchSuggestions();

});
/* ==========================================================
   USSC Connect
   Homepage
   app-home.js
   Part 2
========================================================== */

"use strict";

/* ==========================================================
   CONTINUE EXPLORING
========================================================== */

const continueGrid = document.getElementById("continueGrid");

if (continueGrid) {

    const continueCards = [

        {
            icon: "🎨",
            title: "Design Careers",
            tag: "Creative"
        },

        {
            icon: "💻",
            title: "Technology Careers",
            tag: "Trending"
        },

        {
            icon: "⚕️",
            title: "Healthcare Careers",
            tag: "Popular"
        },

        {
            icon: "📈",
            title: "Business Careers",
            tag: "Management"
        }

    ];

    continueGrid.innerHTML = continueCards.map(card => `

        <div class="continue-card">

            <div class="continue-image">

                ${card.icon}

            </div>

            <div class="continue-content">

                <h3>${card.title}</h3>

                <span>${card.tag}</span>

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   FEATURED CAREER DOMAINS
========================================================== */

const featuredDomains = document.getElementById("featuredDomains");

if (featuredDomains) {

    const domains = [

        "Engineering",
        "Medical",
        "Design",
        "Business",
        "Law",
        "Computer Science"

    ];

    featuredDomains.innerHTML = domains.map(domain => `

        <div class="domain-card">

            <div class="domain-banner"></div>

            <div class="domain-content">

                <h3>${domain}</h3>

                <p>

                    Explore career opportunities,
                    entrance exams,
                    colleges and future scope.

                </p>

                <div class="domain-footer">

                    <span>View Careers</span>

                    <a href="careers/index.html">

                        <i class="bi bi-arrow-right"></i>

                    </a>

                </div>

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   FEATURED UNIVERSITIES
========================================================== */

const featuredUniversities =
document.getElementById("featuredUniversities");

if (featuredUniversities) {

    const universities = [

        "IIT Delhi",
        "NIFT Delhi",
        "IIM Ahmedabad"

    ];

    featuredUniversities.innerHTML =
    universities.map(name => `

        <div class="university-card">

            <div class="university-image">

                <div class="university-rank">

                    Featured

                </div>

            </div>

            <div class="university-content">

                <h3>${name}</h3>

                <p>

                    Explore courses,
                    admissions,
                    scholarships and placements.

                </p>

                <div class="university-btn">

                    View Profile

                    <i class="bi bi-arrow-right"></i>

                </div>

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   VERIFIED CAREER EXPERTS
========================================================== */

const expertGrid =
document.getElementById("expertGrid");

if (expertGrid) {

    const experts = [

        "Career Counsellor",
        "Design Mentor",
        "Education Consultant"

    ];

    expertGrid.innerHTML =
    experts.map(title => `

        <div class="expert-card">

            <div class="expert-image">

                <img src="assets/images/default-avatar.webp"
                     alt="${title}"
                     loading="lazy">

            </div>

            <h3>${title}</h3>

            <p class="expert-designation">

                Verified Expert

            </p>

            <div class="expert-details">

                <div>

                    <strong>500+</strong>

                    <span>Sessions</span>

                </div>

                <div>

                    <strong>4.9★</strong>

                    <span>Rating</span>

                </div>

            </div>

            <div class="verify-badge">

                <i class="bi bi-patch-check-fill"></i>

                Verified

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   SECTION ANIMATION
========================================================== */

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(

(entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform =
            "translateY(0)";

        }

    });

},

{

    threshold:0.15

}

);

sections.forEach(section => {

    section.style.opacity = "0";

    section.style.transform = "translateY(40px)";

    section.style.transition =
    "all .7s ease";

    observer.observe(section);

});

/* ==========================================================
   INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("USSC Connect Homepage Loaded Successfully");

});
