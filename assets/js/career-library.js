/* ==========================================================
   USSC Connect
   Career Library
========================================================== */

"use strict";

const careerLibraryState = {
    domains: [],
    careers: [],
    guides: [],
    exams: [],
    selectedDomainId: ""
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
    architecture: "bi-buildings-fill",
    education: "bi-mortarboard-fill",
    sports: "bi-trophy-fill",
    "agriculture-environment": "bi-tree-fill",
    "humanities-social-sciences": "bi-people-fill",
    "hospitality-tourism": "bi-cup-hot-fill",
    "pure-sciences-research": "bi-flask",
    "performing-arts": "bi-music-note-beamed",
    "defence-public-services": "bi-shield-fill-check",
    "vocational-skills": "bi-tools",
    "computer-applications-it": "bi-pc-display",
    "cybersecurity-ethical-hacking": "bi-shield-lock-fill"
};

const featuredExamIds = [
    "jee-main",
    "neet-ug",
    "cuet",
    "clat",
    "nata",
    "aiims-exams"
];

document.addEventListener("DOMContentLoaded", initializeCareerLibrary);

async function initializeCareerLibrary() {
    try {
        const database = await loadLibraryJSON("careers.json");
        const params = new URLSearchParams(window.location.search);
        const selectedDomainId = params.get("domain");
        const initialSearch = params.get("search") || "";

        careerLibraryState.domains = database.domains || [];
        careerLibraryState.selectedDomainId = selectedDomainId || "";

        await hydrateLibraryData();

        applyLibraryViewMode(selectedDomainId);
        renderCategories();
        renderCareers(selectedDomainId, initialSearch);
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

async function hydrateLibraryData() {
    const careerGroups = await Promise.all(
        careerLibraryState.domains.map(async (domain) => {
            const listData = await loadLibraryJSON(domain.file);
            const detailsFile = domain.file.replace(".json", "-details.json");
            const detailData = await loadLibraryJSON(detailsFile, { optional: true });
            const detailCareers = detailData.careers || [];
            const listCareers = listData.careers || [];

            return listCareers.map((career) => {
                const detail = detailCareers.find(item => item.id === career.id) || {};

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

    const guideData = await loadLibraryJSON("planning-guides.json", { optional: true });
    careerLibraryState.guides = Array.isArray(guideData.guides) ? guideData.guides : [];

    const examData = await loadLibraryJSON("exams.json", { optional: true });
    careerLibraryState.exams = Array.isArray(examData.exams) ? examData.exams : [];
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
        if (heroTitle) heroTitle.textContent = "Explore Careers with Confidence";
        if (heroText) {
            heroText.textContent =
                "Discover careers, entrance exams, career guides and trusted educational resources in one place. Every career profile is designed to help students make informed academic and career decisions.";
        }
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Career Library";
        if (viewAllCareerLink) {
            viewAllCareerLink.href = "#careerGrid";
            viewAllCareerLink.innerHTML = 'Browse Careers <i class="bi bi-arrow-right"></i>';
        }
        return;
    }

    window.scrollTo(0, 0);
    document.title = `${selectedDomain.name} Careers | USSC Connect`;

    if (heroTitle) heroTitle.textContent = `${selectedDomain.name} Careers`;
    if (heroText) {
        heroText.textContent =
            `Explore ${selectedDomain.name.toLowerCase()} careers, eligibility, skills, entrance exams and future opportunities in one focused career pathway page.`;
    }
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = selectedDomain.name;
    if (viewAllCareerLink) {
        viewAllCareerLink.href = "index.html";
        viewAllCareerLink.innerHTML = 'All Categories <i class="bi bi-arrow-right"></i>';
    }
}

function renderCategories() {
    const grid = document.getElementById("categoryGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (careerLibraryState.domains.length === 0) {
        renderEmpty("categoryGrid", "No career categories found.");
        return;
    }

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
            <h3>${escapeHTML(domain.name)}</h3>
            <p>${escapeHTML(domain.description)}</p>
            <div class="category-footer">
                <span class="category-count">
                    <i class="bi bi-grid-3x3-gap"></i>
                    Explore Domain
                </span>
                <a class="category-arrow"
                   href="index.html?domain=${encodeURIComponent(domain.id)}"
                   aria-label="Explore ${escapeHTML(domain.name)}">
                    <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        `;

        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            window.location.href = `index.html?domain=${encodeURIComponent(domain.id)}`;
        });

        grid.appendChild(card);
    });
}

function renderCareers(selectedDomainId, initialSearch = "") {
    const grid = document.getElementById("careerGrid");

    if (!grid) return;

    const selectedDomain = careerLibraryState.domains.find(
        domain => domain.id === selectedDomainId
    );

    const searchQuery = initialSearch.trim().toLowerCase();
    const careers = selectedDomain
        ? careerLibraryState.careers.filter(career => career.domainId === selectedDomain.id)
        : searchQuery
            ? getSearchMatchedCareers(searchQuery)
            : getFeaturedCareers();

    updateCareerSectionTitle(selectedDomain, careers.length, initialSearch);

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
            career.entranceExams,
            career.topColleges,
            career.skills
        ]);

        card.innerHTML = `
            <span class="career-tag">${escapeHTML(career.domainName)}</span>
            <h3>${escapeHTML(career.name)}</h3>
            <p>${escapeHTML(getCareerSummary(career))}</p>
            <div class="career-meta">
                <span>
                    <i class="bi bi-mortarboard"></i>
                    ${escapeHTML(getShortEligibility(career))}
                </span>
                <span>
                    <i class="bi bi-graph-up-arrow"></i>
                    ${escapeHTML(getShortFutureScope(career))}
                </span>
            </div>
            <a href="details.html?domain=${encodeURIComponent(career.domainId)}&career=${encodeURIComponent(career.id)}">
                View Career
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        grid.appendChild(card);
    });
}

function updateCareerSectionTitle(selectedDomain, careerCount, initialSearch = "") {
    const title = document.querySelector(".featured-careers .section-title h2");
    const description = document.querySelector(".featured-careers .section-title p");

    if (!title || !description) return;

    if (!selectedDomain && initialSearch) {
        title.textContent = "Search Results";
        description.textContent =
            `Showing matching careers, guides and exams for "${initialSearch}".`;
        return;
    }

    if (!selectedDomain) {
        title.textContent = "Featured Careers";
        description.textContent =
            "Explore a mixed selection of careers across engineering, medicine, design, law, management and other domains.";
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

function getSearchMatchedCareers(query) {
    return careerLibraryState.careers
        .map(career => ({
            career,
            score: getCareerSearchScore(career, query)
        }))
        .filter(item => item.score < 99)
        .sort((a, b) =>
            a.score - b.score ||
            a.career.name.localeCompare(b.career.name)
        )
        .map(item => item.career);
}

function getCareerSearchScore(career, query) {
    const name = String(career.name || "").toLowerCase();
    const domain = String(career.domainName || "").toLowerCase();
    const primaryText = normalizeSearchText([
        career.name,
        career.domainName,
        career.skills,
        career.entranceExams
    ]);
    const fullText = normalizeSearchText([
        career.name,
        career.domainName,
        career.overview,
        career.eligibility,
        career.futureScope,
        career.aiImpact,
        career.skills,
        career.entranceExams,
        career.topColleges
    ]);

    if (name.startsWith(query)) return 0;
    if (name.includes(query)) return 1;
    if (domain.startsWith(query)) return 2;
    if (domain.includes(query)) return 3;
    if (primaryText.includes(query)) return 4;
    if (fullText.includes(query)) return 8;

    return 99;
}

function renderGuides() {
    const grid = document.getElementById("guideGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (careerLibraryState.guides.length === 0) {
        renderEmpty("guideGrid", "Planning guides are not available right now.");
        return;
    }

    careerLibraryState.guides.slice(0, 4).forEach(guide => {
        const card = document.createElement("article");

        card.className = "guide-card library-item";
        card.dataset.searchText = normalizeSearchText([
            guide.title,
            guide.description,
            guide.eyebrow
        ]);

        card.innerHTML = `
            <div class="guide-icon">
                <i class="bi ${getGuideIcon(guide.id)}"></i>
            </div>
            <h3>${escapeHTML(guide.title)}</h3>
            <p>${escapeHTML(guide.description)}</p>
            <a href="guide.html?guide=${encodeURIComponent(guide.id)}">
                Open Tool
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            window.location.href = `guide.html?guide=${encodeURIComponent(guide.id)}`;
        });

        grid.appendChild(card);
    });
}

function renderExams() {
    const grid = document.getElementById("examGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const featuredExams = featuredExamIds
        .map(id => careerLibraryState.exams.find(exam => exam.id === id))
        .filter(Boolean);
    const exams = featuredExams.length > 0
        ? featuredExams
        : careerLibraryState.exams.slice(0, 6);

    if (exams.length === 0) {
        renderEmpty("examGrid", "Exam guides are not available right now.");
        return;
    }

    exams.forEach(exam => {
        const card = document.createElement("article");

        card.className = "exam-card library-item";
        card.dataset.searchText = normalizeSearchText([
            exam.name,
            exam.description,
            exam.domain,
            exam.category
        ]);

        card.innerHTML = `
            <span class="career-tag">${escapeHTML(exam.domain || "Entrance Exam")}</span>
            <h3>${escapeHTML(exam.name)}</h3>
            <p>${escapeHTML(trimText(exam.description, 145))}</p>
            <a href="exam.html?exam=${encodeURIComponent(exam.id)}">
                View Exam Guide
                <i class="bi bi-arrow-right"></i>
            </a>
        `;

        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            window.location.href = `exam.html?exam=${encodeURIComponent(exam.id)}`;
        });

        grid.appendChild(card);
    });
}

function initializeLibrarySearch(initialSearch) {
    const searchInput = document.getElementById("careerSearch");
    const searchButton = document.getElementById("careerSearchBtn");
    const headerSearch = document.getElementById("headerCareerSearch");
    let isSearchResultsView = Boolean(initialSearch);

    const runSearch = (value, options = {}) => {
        const { shouldScroll = false, updateUrl = false } = options;
        const rawQuery = value.trim();
        const query = rawQuery.toLowerCase();

        if (query) {
            renderCareers("", rawQuery);
            isSearchResultsView = true;
        }

        if (!query && isSearchResultsView) {
            renderCareers(careerLibraryState.selectedDomainId || "", "");
            isSearchResultsView = false;
        }

        const items = document.querySelectorAll(".library-item");
        let visibleCount = 0;

        items.forEach(item => {
            const isVisible =
                query.length === 0 ||
                item.dataset.searchText.includes(query);

            item.classList.toggle("is-hidden", !isVisible);

            if (isVisible) visibleCount += 1;
        });

        updateLibrarySearchTitle(rawQuery, visibleCount);
        toggleSearchEmptyState(rawQuery, visibleCount);

        if (updateUrl) {
            updateLibrarySearchUrl(rawQuery);
        }

        if (shouldScroll) {
            scrollToLibraryResults(rawQuery, visibleCount);
        }
    };

    const searchIndex = getLibrarySearchIndex();
    const suggestionMap = new Map();

    const syncSearch = (value, options = {}) => {
        if (searchInput) searchInput.value = value;
        if (headerSearch) headerSearch.value = value;
        runSearch(value, options);
    };

    [searchInput, headerSearch].forEach(input => {
        if (!input) return;

        const results = createLibrarySearchResults(input);
        suggestionMap.set(input, results);

        input.addEventListener("input", () => {
            syncSearch(input.value);
            renderLibrarySuggestions(input, results, searchIndex);
        });
        input.addEventListener("focus", () => {
            renderLibrarySuggestions(input, results, searchIndex);
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                syncSearch(input.value, { shouldScroll: true, updateUrl: true });
                hideLibrarySuggestions();
            }
        });
    });

    if (searchButton && searchInput) {
        searchButton.addEventListener("click", () => {
            syncSearch(searchInput.value, { shouldScroll: true, updateUrl: true });
            hideLibrarySuggestions();
        });
    }

    document.addEventListener("click", event => {
        if (!event.target.closest(".search-wrapper")) {
            hideLibrarySuggestions();
        }
    });

    if (initialSearch) {
        syncSearch(initialSearch);
    }
}

function getLibrarySearchIndex() {
    const careerItems = careerLibraryState.careers.map(career => ({
        type: "Career",
        title: career.name,
        subtitle: career.domainName,
        href: `details.html?domain=${encodeURIComponent(career.domainId)}&career=${encodeURIComponent(career.id)}`,
        searchText: normalizeSearchText([
            career.name,
            career.domainName,
            career.overview,
            career.eligibility,
            career.skills,
            career.entranceExams
        ])
    }));
    const domainItems = careerLibraryState.domains.map(domain => ({
        type: "Domain",
        title: domain.name,
        subtitle: domain.description,
        href: `index.html?domain=${encodeURIComponent(domain.id)}`,
        searchText: normalizeSearchText([domain.name, domain.description])
    }));
    const guideItems = careerLibraryState.guides.map(guide => ({
        type: "Planning Guide",
        title: guide.title,
        subtitle: guide.description,
        href: `guide.html?guide=${encodeURIComponent(guide.id)}`,
        searchText: normalizeSearchText([guide.title, guide.description, guide.eyebrow])
    }));
    const examItems = careerLibraryState.exams.map(exam => ({
        type: "Exam",
        title: exam.name,
        subtitle: exam.domain || "Entrance exam",
        href: `exam.html?exam=${encodeURIComponent(exam.id)}`,
        searchText: normalizeSearchText([exam.name, exam.description, exam.domain, exam.category])
    }));

    return [...careerItems, ...domainItems, ...guideItems, ...examItems];
}

function createLibrarySearchResults(input) {
    if (input.parentElement && input.parentElement.classList.contains("search-wrapper")) {
        return input.parentElement.querySelector(".live-search-results");
    }

    const wrapper = document.createElement("div");
    const results = document.createElement("div");

    wrapper.className = "search-wrapper";
    results.className = "live-search-results";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(results);

    return results;
}

function renderLibrarySuggestions(input, results, searchIndex) {
    const query = input.value.trim().toLowerCase();

    if (!query) {
        results.classList.remove("active");
        results.innerHTML = "";
        return;
    }

    const matches = searchIndex
        .filter(item => item.title.toLowerCase().startsWith(query) || item.searchText.includes(query))
        .slice(0, 10);

    if (!matches.length) {
        results.innerHTML = '<button type="button" class="live-search-empty">No matching careers, domains, guides or exams found</button>';
        results.classList.add("active");
        return;
    }

    results.innerHTML = matches.map(item => `
        <a href="${escapeAttribute(item.href)}" class="live-search-item">
            <span>${escapeHTML(item.title)}</span>
            <small>${escapeHTML(item.type)} - ${escapeHTML(item.subtitle || "")}</small>
        </a>
    `).join("");
    results.classList.add("active");
}

function hideLibrarySuggestions() {
    document
        .querySelectorAll(".live-search-results")
        .forEach(results => results.classList.remove("active"));
}

function updateLibrarySearchTitle(query, visibleCount) {
    const selectedDomain = careerLibraryState.domains.find(
        domain => domain.id === careerLibraryState.selectedDomainId
    );

    if (query) {
        const title = document.querySelector(".featured-careers .section-title h2");
        const description = document.querySelector(".featured-careers .section-title p");

        if (title) title.textContent = "Search Results";
        if (description) {
            description.textContent =
                `${visibleCount} matching careers, guides, exams or categories found for "${query}".`;
        }
        return;
    }

    updateCareerSectionTitle(selectedDomain, selectedDomain
        ? countCareersForDomain(selectedDomain.id)
        : getFeaturedCareers().length);
}

function updateLibrarySearchUrl(query) {
    const url = new URL(window.location.href);

    if (query) {
        url.searchParams.set("search", query);
        url.searchParams.delete("domain");
    }
    else {
        url.searchParams.delete("search");
        if (careerLibraryState.selectedDomainId) {
            url.searchParams.set("domain", careerLibraryState.selectedDomainId);
        }
    }

    window.history.replaceState({}, "", url.toString());
}

function scrollToLibraryResults(query, visibleCount) {
    const empty = document.getElementById("librarySearchEmpty");
    const target = query && visibleCount === 0
        ? empty
        : document.querySelector(".featured-careers");

    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function toggleSearchEmptyState(query, visibleCount) {
    const existing = document.getElementById("librarySearchEmpty");

    if (existing) existing.remove();

    if (!query || visibleCount > 0) return;

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

function getGuideIcon(guideId) {
    const icons = {
        "choose-after-class-10": "bi-signpost-split-fill",
        "plan-after-class-12": "bi-mortarboard-fill",
        "compare-careers": "bi-columns-gap",
        "entrance-exam-planning": "bi-journal-check"
    };

    return icons[guideId] || "bi-compass-fill";
}

function getCareerSummary(career) {
    if (career.overview) {
        return trimText(career.overview, 125);
    }

    return "Explore eligibility, education path, entrance exams, skills and future opportunities for this career.";
}

function getShortEligibility(career) {
    return trimText(
        career.eligibility || "Eligibility guide included",
        58
    );
}

function getShortFutureScope(career) {
    return trimText(
        career.futureScope || "Future scope available",
        62
    );
}

function trimText(value, limit) {
    const text = String(value || "").trim();

    if (text.length <= limit) {
        return text;
    }

    return `${text.slice(0, limit).trim()}...`;
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
            <h3>${escapeHTML(message)}</h3>
        </div>
    `;
}

function renderError(containerId, message) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-exclamation-circle"></i>
            <h3>${escapeHTML(message)}</h3>
        </div>
    `;
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
}
