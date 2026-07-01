/* ==========================================================
   USSC Connect
   Career Library
========================================================== */

"use strict";

const careerLibraryState = {
    domains: [],
    careers: [],
    guides: [],
    exams: []
};

const domainIconMap = {
    engineering: "bi-cpu-fill",
    medicine: "bi-heart-pulse-fill",
    design: "bi-palette-fill",
    law: "bi-bank2",
    management: "bi-briefcase-fill",
    "ai-data-science": "bi-robot",
    "commerce-finance": "bi-cash-coin",
    psychology: "bi-person-heart",
    "media-communication": "bi-camera-video-fill",
    architecture: "bi-buildings-fill"
};

const fallbackExamGuides = [
    {
        id: "jee-main",
        name: "JEE Main",
        description: "Engineering entrance exam for NITs, IIITs and other participating institutions.",
        domain: "engineering"
    },
    {
        id: "neet-ug",
        name: "NEET UG",
        description: "National medical entrance exam for MBBS, BDS and allied medical courses.",
        domain: "medicine"
    },
    {
        id: "cuet",
        name: "CUET",
        description: "Common entrance test for undergraduate admission in participating universities.",
        domain: "general"
    },
    {
        id: "clat",
        name: "CLAT",
        description: "Law entrance exam for national law universities and legal education pathways.",
        domain: "law"
    },
    {
        id: "nift",
        name: "NIFT",
        description: "Design and fashion entrance pathway for NIFT campuses and related programs.",
        domain: "design"
    }
];

const planningGuides = [
    {
        id: "choose-after-class-10",
        title: "Choosing a Stream After Class 10",
        description: "Understand how interests, subjects and long-term career goals connect before choosing Science, Commerce, Humanities or vocational pathways.",
        icon: "bi-signpost-split-fill",
        href: "#careerGrid",
        actionLabel: "Explore Careers"
    },
    {
        id: "plan-after-class-12",
        title: "Planning After Class 12",
        description: "Compare degrees, entrance exams, colleges and career outcomes before finalizing your undergraduate pathway.",
        icon: "bi-mortarboard-fill",
        href: "#examGrid",
        actionLabel: "View Exams"
    },
    {
        id: "compare-careers",
        title: "How to Compare Careers",
        description: "Evaluate eligibility, skills, salary range, work environment, AI impact and future scope before shortlisting careers.",
        icon: "bi-columns-gap",
        href: "#careerGrid",
        actionLabel: "Compare Options"
    },
    {
        id: "entrance-exam-planning",
        title: "Entrance Exam Planning",
        description: "Use exam guides to understand eligibility, preparation timelines and the institutions connected with each entrance pathway.",
        icon: "bi-journal-check",
        href: "#examGrid",
        actionLabel: "Open Exams"
    }
];

document.addEventListener("DOMContentLoaded", initializeCareerLibrary);

async function initializeCareerLibrary() {
    try {
        const database = await loadLibraryJSON("careers.json");
        const params = new URLSearchParams(window.location.search);
        const selectedDomainId = params.get("domain");
        const initialSearch = params.get("search") || "";

        careerLibraryState.domains = database.domains || [];

        await hydrateLibraryData();

        applyLibraryViewMode(selectedDomainId);
        renderCategories();
        renderCareers(selectedDomainId);
        renderGuides();
        renderExams();
        initializeLibrarySearch(initialSearch);
    }

    catch (error) {
        console.error(error);
        renderError("categoryGrid", "Unable to load Career Library.");
        renderError("careerGrid", "Career data is not available right now.");
        renderError("guideGrid", "Career guides are not available right now.");
        renderError("examGrid", "Exam guides are not available right now.");
    }
}

function applyLibraryViewMode(selectedDomainId) {
    const selectedDomain = careerLibraryState.domains.find(
        domain => domain.id === selectedDomainId
    );
    const categoriesSection = document.querySelector(".career-categories");
    const heroTitle = document.querySelector(".career-hero h1");
    const heroText = document.querySelector(".career-hero p");
    const breadcrumbCurrent = document.querySelector(".breadcrumb span");
    const viewAllCareerLink = document.querySelector(".featured-careers .section-title a");

    document.body.classList.toggle("domain-view", Boolean(selectedDomain));

    if (categoriesSection) {
        categoriesSection.hidden = Boolean(selectedDomain);
    }

    if (!selectedDomain) {
        if (heroTitle) {
            heroTitle.textContent = "Explore Careers with Confidence";
        }

        if (heroText) {
            heroText.textContent =
                "Discover careers, entrance exams, career guides and trusted educational resources in one place. Every career profile is designed to help students make informed academic and career decisions.";
        }

        if (breadcrumbCurrent) {
            breadcrumbCurrent.textContent = "Career Library";
        }

        if (viewAllCareerLink) {
            viewAllCareerLink.href = "#careerGrid";
            viewAllCareerLink.innerHTML = `
                View All Careers
                <i class="bi bi-arrow-right"></i>
            `;
        }

        return;
    }

    window.scrollTo(0, 0);
    document.title = `${selectedDomain.name} Careers | USSC Connect`;

    if (heroTitle) {
        heroTitle.textContent = `${selectedDomain.name} Careers`;
    }

    if (heroText) {
        heroText.textContent =
            `Explore ${selectedDomain.name.toLowerCase()} careers, eligibility, skills, entrance exams and future opportunities in one focused career pathway page.`;
    }

    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = selectedDomain.name;
    }

    if (viewAllCareerLink) {
        viewAllCareerLink.href = "index.html";
        viewAllCareerLink.innerHTML = `
            All Categories
            <i class="bi bi-arrow-right"></i>
        `;
    }
}

async function hydrateLibraryData() {
    const careerGroups = await Promise.all(
        careerLibraryState.domains.map(async (domain) => {
            const listData = await loadLibraryJSON(domain.file);
            const detailsFile = domain.file.replace(".json", "-details.json");
            const detailData = await loadLibraryJSON(detailsFile);
            const detailCareers = detailData.careers || [];
            const listCareers = listData.careers || [];

            return listCareers.map((career) => {
                const detail = detailCareers.find(
                    item => item.id === career.id
                ) || {};

                return {
                    ...career,
                    ...detail,
                    id: career.id,
                    name: career.name || detail.name,
                    domainId: domain.id,
                    domainName: domain.name,
                    domainDescription: domain.description
                };
            });
        })
    );

    careerLibraryState.careers = careerGroups.flat();

    careerLibraryState.guides = planningGuides;

    const examData = await loadLibraryJSON("exams.json", { optional: true });
    careerLibraryState.exams =
        Array.isArray(examData.exams) && examData.exams.length > 0
            ? examData.exams
            : fallbackExamGuides;
}

function renderCategories() {
    const grid = document.getElementById("categoryGrid");

    if (!grid) return;

    grid.innerHTML = "";

    careerLibraryState.domains.forEach(domain => {
        const count = countCareersForDomain(domain.id);
        const card = document.createElement("article");

        card.className = "category-card library-item";
        card.dataset.searchText = normalizeSearchText([
            domain.name,
            domain.description,
            `${count} careers`
        ]);

        card.innerHTML = `
            <span class="category-badge">${count} Careers</span>

            <div class="category-icon">
                <i class="bi ${getDomainIcon(domain.id)}"></i>
            </div>

            <h3>${domain.name}</h3>

            <p>${domain.description}</p>

            <div class="category-footer">
                <span class="category-count">
                    <i class="bi bi-grid-3x3-gap"></i>
                    Explore Domain
                </span>

                <a class="category-arrow"
                   href="index.html?domain=${domain.id}"
                   aria-label="Explore ${domain.name}">
                    <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `index.html?domain=${domain.id}`;
        });

        grid.appendChild(card);
    });
}

async function loadLibraryJSON(fileName, options = {}) {
    const { optional = false } = options;

    try {
        const response = await fetch(`../data/${fileName}`);

        if (!response.ok) {
            throw new Error(`Unable to load ${fileName}`);
        }

        const text = await response.text();

        if (!text.trim()) {
            return {};
        }

        return JSON.parse(text);
    }

    catch (error) {
        if (!optional) {
            console.error(error);
        }

        return {};
    }
}

function renderCareers(selectedDomainId) {
    const grid = document.getElementById("careerGrid");

    if (!grid) return;

    const selectedDomain = careerLibraryState.domains.find(
        domain => domain.id === selectedDomainId
    );

    const careers = selectedDomain
        ? careerLibraryState.careers.filter(
            career => career.domainId === selectedDomain.id
        )
        : getFeaturedCareers();

    updateCareerSectionTitle(selectedDomain, careers.length);

    grid.innerHTML = "";

    if (careers.length === 0) {
        renderEmpty("careerGrid", "No careers available in this domain yet.");
        return;
    }

    careers.forEach(career => {
        const card = document.createElement("article");

        card.className = "career-card library-item";
        card.dataset.searchText = normalizeSearchText([
            career.name,
            career.domainName,
            career.overview,
            career.eligibility,
            career.futureScope,
            career.aiImpact,
            career.entranceExams
        ]);

        card.innerHTML = `
            <span class="career-tag">${career.domainName}</span>

            <h3>${career.name}</h3>

            <p>${getCareerSummary(career)}</p>

            <div class="career-meta">
                <span>
                    <i class="bi bi-mortarboard"></i>
                    ${career.eligibility || "Eligibility guide included"}
                </span>

                <span>
                    <i class="bi bi-graph-up-arrow"></i>
                    ${career.futureScope || "Future scope available"}
                </span>
            </div>

            <a href="details.html?domain=${career.domainId}&career=${career.id}">
                View Career
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        grid.appendChild(card);
    });
}

function updateCareerSectionTitle(selectedDomain, careerCount) {
    const title = document.querySelector(".featured-careers .section-title h2");
    const description = document.querySelector(".featured-careers .section-title p");

    if (!title || !description) return;

    if (!selectedDomain) {
        title.textContent = "Popular Careers";
        description.textContent =
            "Discover some of the most searched and recommended careers across different domains.";
        return;
    }

    title.textContent = `${selectedDomain.name} Careers`;
    description.textContent =
        `Explore ${careerCount} career profiles in ${selectedDomain.name}, including eligibility, skills, entrance exams and future scope.`;
}

function getFeaturedCareers() {
    const careersByDomain = careerLibraryState.domains
        .map(domain => careerLibraryState.careers.filter(
            career => career.domainId === domain.id
        ))
        .filter(careers => careers.length > 0);
    const featured = [];
    let index = 0;

    while (featured.length < 12) {
        let addedInRound = false;

        careersByDomain.forEach(careers => {
            if (featured.length >= 12) return;

            if (careers[index]) {
                featured.push(careers[index]);
                addedInRound = true;
            }
        });

        if (!addedInRound) break;

        index += 1;
    }

    return featured;
}

function renderGuides() {
    const grid = document.getElementById("guideGrid");

    if (!grid) return;

    grid.innerHTML = "";

    careerLibraryState.guides.forEach(guide => {
        const card = document.createElement("article");

        card.className = "guide-card library-item";
        card.dataset.searchText = normalizeSearchText([
            guide.title,
            guide.description,
            guide.actionLabel
        ]);

        card.innerHTML = `
            <div class="guide-icon">
                <i class="bi ${guide.icon}"></i>
            </div>

            <h3>${guide.title}</h3>

            <p>${guide.description}</p>

            <a href="${guide.href}">
                ${guide.actionLabel}
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        grid.appendChild(card);
    });
}

function renderExams() {
    const grid = document.getElementById("examGrid");

    if (!grid) return;

    grid.innerHTML = "";

    careerLibraryState.exams.slice(0, 8).forEach(exam => {
        const card = document.createElement("article");

        card.className = "exam-card library-item";
        card.dataset.searchText = normalizeSearchText([
            exam.name,
            exam.description,
            exam.domain
        ]);

        card.innerHTML = `
            <h3>${exam.name}</h3>

            <p>${exam.description}</p>
        `;

        grid.appendChild(card);
    });
}

function initializeLibrarySearch(initialSearch) {
    const searchInput = document.getElementById("careerSearch");
    const searchButton = document.getElementById("careerSearchBtn");
    const headerSearch = document.querySelector(".header-search input");

    const runSearch = (value) => {
        const query = value.trim().toLowerCase();
        const items = document.querySelectorAll(".library-item");
        let visibleCount = 0;

        items.forEach(item => {
            const isVisible =
                query.length === 0 ||
                item.dataset.searchText.includes(query);

            item.classList.toggle("is-hidden", !isVisible);

            if (isVisible) {
                visibleCount += 1;
            }
        });

        toggleSearchEmptyState(query, visibleCount);
    };

    const syncSearch = (value) => {
        if (searchInput) searchInput.value = value;
        if (headerSearch) headerSearch.value = value;
        runSearch(value);
    };

    [searchInput, headerSearch].forEach(input => {
        if (!input) return;

        input.addEventListener("input", () => {
            syncSearch(input.value);
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                syncSearch(input.value);
            }
        });
    });

    if (searchButton && searchInput) {
        searchButton.addEventListener("click", () => {
            syncSearch(searchInput.value);
        });
    }

    if (initialSearch && searchInput) {
        syncSearch(initialSearch);
    }
}

function toggleSearchEmptyState(query, visibleCount) {
    const existing = document.getElementById("librarySearchEmpty");

    if (existing) {
        existing.remove();
    }

    if (!query || visibleCount > 0) {
        return;
    }

    const section = document.querySelector(".featured-careers .container");

    if (!section) return;

    const empty = document.createElement("div");
    empty.id = "librarySearchEmpty";
    empty.className = "empty-state";
    empty.innerHTML = `
        <i class="bi bi-search"></i>
        <h3>No matching careers, guides or exams found.</h3>
        <p>Try searching by domain, exam, eligibility or career name.</p>
    `;

    section.appendChild(empty);
}

function countCareersForDomain(domainId) {
    return careerLibraryState.careers.filter(
        career => career.domainId === domainId
    ).length;
}

function getDomainIcon(domainId) {
    return domainIconMap[domainId] || "bi-journal-bookmark-fill";
}

function getCareerSummary(career) {
    if (career.overview) {
        return career.overview;
    }

    return "Explore eligibility, education path, entrance exams, skills and future opportunities for this career.";
}

function normalizeSearchText(value) {
    return value
        .flat()
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function renderEmpty(containerId, message) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-search"></i>
            <h3>${message}</h3>
        </div>
    `;
}

function renderError(containerId, message) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-exclamation-circle"></i>
            <h3>${message}</h3>
        </div>
    `;
}
