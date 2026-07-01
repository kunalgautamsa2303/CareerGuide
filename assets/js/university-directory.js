"use strict";

const universityState = {
    universities: [],
    filtered: [],
    visibleLimit: 120,
    pageSize: 120
};

document.addEventListener("DOMContentLoaded", initializeUniversityDirectory);

async function initializeUniversityDirectory() {
    try {
        const data = await loadUniversityData();
        universityState.universities = Array.isArray(data.universities) ? data.universities : [];

        if (document.getElementById("universityGrid")) {
            initializeUniversityIndex();
        }

        if (document.getElementById("universityDetail")) {
            initializeUniversityDetail();
        }
    } catch (error) {
        console.error("Unable to load university directory", error);
        showDirectoryError("Unable to load university directory. Please refresh the page.");
    }
}

async function loadUniversityData() {
    const response = await fetch("../data/universities.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`University data failed with ${response.status}`);
    }
    return response.json();
}

function initializeUniversityIndex() {
    populateUniversityFilters();
    updateUniversityStats();
    wireUniversitySearch();

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("search") || "";
    const initialState = params.get("state") || "";
    const initialType = params.get("type") || "";
    const initialStream = params.get("stream") || "";

    setValue("universitySearch", initialQuery);
    setValue("headerUniversitySearch", initialQuery);
    setValue("stateFilter", initialState);
    setValue("typeFilter", initialType);
    setValue("streamFilter", initialStream);

    applyUniversityFilters();
}

function populateUniversityFilters() {
    const states = uniqueSorted(universityState.universities.map(item => item.state));
    const types = uniqueSorted(universityState.universities.map(item => item.type));
    const streams = uniqueSorted(universityState.universities.flatMap(item => item.streams || []));

    populateSelect("stateFilter", states, "All states");
    populateSelect("typeFilter", types, "All types");
    populateSelect("streamFilter", streams, "All streams");
}

function populateSelect(id, values, defaultLabel) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">${escapeHTML(defaultLabel)}</option>`;
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function updateUniversityStats() {
    const institutions = universityState.universities.length;
    const programs = universityState.universities.reduce((total, item) => total + (item.programs || []).length, 0);
    const states = uniqueSorted(universityState.universities.map(item => item.state)).length;
    const streams = uniqueSorted(universityState.universities.flatMap(item => item.streams || [])).length;

    setText("institutionCount", institutions);
    setText("programCount", programs);
    setText("stateCount", states);
    setText("streamCount", streams);
}

function wireUniversitySearch() {
    const searchInput = document.getElementById("universitySearch");
    const headerSearch = document.getElementById("headerUniversitySearch");
    const searchButton = document.getElementById("universitySearchBtn");
    const filters = ["stateFilter", "typeFilter", "streamFilter"]
        .map(id => document.getElementById(id))
        .filter(Boolean);

    [searchInput, headerSearch].forEach(input => {
        if (!input) return;
        const liveResults = createUniversityLiveResults(input);

        input.addEventListener("input", () => {
            syncUniversityQuery(input.value);
            renderUniversityLiveResults(input, liveResults);
            applyUniversityFilters();
        });

        input.addEventListener("focus", () => renderUniversityLiveResults(input, liveResults));

        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                syncUniversityQuery(input.value);
                applyUniversityFilters({ updateUrl: true, shouldScroll: true });
                liveResults.hidden = true;
            }
        });

        document.addEventListener("click", event => {
            if (!input.contains(event.target) && !liveResults.contains(event.target)) {
                liveResults.hidden = true;
            }
        });
    });

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            applyUniversityFilters({ updateUrl: true, shouldScroll: true });
        });
    }

    const loadMoreButton = document.getElementById("loadMoreUniversities");
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", () => {
            universityState.visibleLimit += universityState.pageSize;
            applyUniversityFilters({ keepVisibleLimit: true });
        });
    }

    filters.forEach(filter => {
        filter.addEventListener("change", () => applyUniversityFilters({ updateUrl: true }));
    });
}

function syncUniversityQuery(value) {
    setValue("universitySearch", value);
    setValue("headerUniversitySearch", value);
}

function applyUniversityFilters(options = {}) {
    if (!options.keepVisibleLimit) {
        universityState.visibleLimit = universityState.pageSize;
    }

    const query = (getValue("universitySearch") || getValue("headerUniversitySearch")).trim();
    const state = getValue("stateFilter");
    const type = getValue("typeFilter");
    const stream = getValue("streamFilter");
    const tokens = normalizeText(query).split(" ").filter(Boolean);

    let results = universityState.universities
        .filter(item => !state || item.state === state)
        .filter(item => !type || item.type === type)
        .filter(item => !stream || (item.streams || []).includes(stream))
        .map(item => ({ item, score: scoreUniversity(item, tokens) }))
        .filter(entry => !tokens.length || entry.score > 0)
        .sort((first, second) => {
            if (tokens.length && second.score !== first.score) return second.score - first.score;
            return first.item.name.localeCompare(second.item.name);
        })
        .map(entry => entry.item);

    universityState.filtered = results;
    renderUniversityCards(results);
    updateResultsSummary(results.length, query, state, type, stream);
    renderActiveFilters(query, state, type, stream);
    updateLoadMoreButton();

    if (options.updateUrl) {
        updateUniversityUrl(query, state, type, stream);
    }

    if (options.shouldScroll) {
        document.querySelector(".uni-directory-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function scoreUniversity(item, tokens) {
    if (!tokens.length) return 1;

    const name = normalizeText(item.name);
    const location = normalizeText([item.city, item.state].join(" "));
    const type = normalizeText(item.type);
    const secondary = normalizeText([
        item.summary,
        ...(item.streams || []),
        ...(item.entranceExams || []),
        ...(item.programs || []).flatMap(program => [program.name, program.stream, program.level, program.eligibility])
    ].join(" "));

    return tokens.reduce((score, token) => {
        if (name.startsWith(token)) return score + 18;
        if (name.includes(token)) return score + 14;
        if (location.includes(token)) return score + 6;
        if (type.includes(token)) return score + 3;
        if (secondary.includes(token)) return score + 3;
        return score;
    }, 0);
}

function renderUniversityCards(universities) {
    const grid = document.getElementById("universityGrid");
    const empty = document.getElementById("universityEmpty");
    if (!grid) return;

    if (!universities.length) {
        grid.innerHTML = "";
        if (empty) empty.hidden = false;
        return;
    }

    if (empty) empty.hidden = true;
    grid.innerHTML = universities.slice(0, universityState.visibleLimit).map(renderUniversityCard).join("");
}

function renderUniversityCard(item) {
    const streams = (item.streams || []).slice(0, 5)
        .map(stream => `<span class="uni-stream-chip">${escapeHTML(stream)}</span>`)
        .join("");
    const extraStreams = (item.streams || []).length > 5
        ? `<span class="uni-stream-chip">+${(item.streams || []).length - 5} more</span>`
        : "";

    return `
        <article class="university-card">
            <span class="uni-card-type">${escapeHTML(item.type)}</span>
            <h3><a href="details.html?id=${encodeURIComponent(item.id)}">${escapeHTML(item.name)}</a></h3>
            <div class="uni-location"><i class="bi bi-geo-alt"></i>${escapeHTML(item.city)}, ${escapeHTML(item.state)}</div>
            <p>${escapeHTML(item.summary)}</p>
            <div class="uni-streams">${streams}${extraStreams}</div>
            <div class="uni-card-meta">
                <div><strong>${escapeHTML((item.programs || []).length)}</strong><small>Programs</small></div>
                <div><strong>${escapeHTML((item.entranceExams || []).length)}</strong><small>Exams</small></div>
                <div><strong>${escapeHTML((item.streams || []).length)}</strong><small>Streams</small></div>
            </div>
            <div class="uni-card-actions">
                <a href="details.html?id=${encodeURIComponent(item.id)}">View Details</a>
                <a href="${escapeAttribute(item.officialWebsite)}" target="_blank" rel="noopener">${escapeHTML(item.officialWebsiteLabel || "Official Site")}</a>
            </div>
        </article>
    `;
}

function updateResultsSummary(count, query, state, type, stream) {
    const summary = document.getElementById("resultsSummary");
    if (!summary) return;

    const active = [query && `"${query}"`, state, type, stream].filter(Boolean);
    const suffix = active.length ? ` for ${active.join(", ")}` : "";
    const visible = Math.min(count, universityState.visibleLimit);
    summary.textContent = `Showing ${visible} of ${count} institution${count === 1 ? "" : "s"}${suffix}. Search or filter to narrow the full directory.`;
}

function updateLoadMoreButton() {
    const button = document.getElementById("loadMoreUniversities");
    if (!button) return;

    const remaining = Math.max(universityState.filtered.length - universityState.visibleLimit, 0);
    button.hidden = remaining === 0;
    button.textContent = remaining > 0
        ? `Load More Institutions (${remaining} more)`
        : "Load More Institutions";
}

function renderActiveFilters(query, state, type, stream) {
    const row = document.getElementById("activeFilters");
    if (!row) return;

    const filters = [
        query ? `Search: ${query}` : "",
        state ? `State: ${state}` : "",
        type ? `Type: ${type}` : "",
        stream ? `Stream: ${stream}` : ""
    ].filter(Boolean);

    row.innerHTML = filters.map(filter => `<span>${escapeHTML(filter)}</span>`).join("");
}

function updateUniversityUrl(query, state, type, stream) {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (state) params.set("state", state);
    if (type) params.set("type", type);
    if (stream) params.set("stream", stream);

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState({}, "", nextUrl);
}

function createUniversityLiveResults(input) {
    const wrapper = input.closest(".uni-search-box") || input.closest(".uni-header-search") || input.parentElement;
    const results = document.createElement("div");
    results.className = "live-search-results";
    results.hidden = true;
    wrapper.style.position = "relative";
    wrapper.appendChild(results);
    return results;
}

function renderUniversityLiveResults(input, results) {
    const query = input.value.trim();
    const tokens = normalizeText(query).split(" ").filter(Boolean);

    if (!query || query.length < 1) {
        results.hidden = true;
        results.innerHTML = "";
        return;
    }

    const matches = universityState.universities
        .map(item => ({ item, score: scoreUniversity(item, tokens) }))
        .filter(entry => entry.score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 7);

    if (!matches.length) {
        results.hidden = true;
        results.innerHTML = "";
        return;
    }

    results.innerHTML = matches.map(({ item }) => `
        <button type="button" class="live-search-item" data-query="${escapeAttribute(item.name)}">
            <strong>${escapeHTML(item.name)}</strong>
            <span>${escapeHTML(item.city)}, ${escapeHTML(item.state)} - ${escapeHTML((item.streams || []).slice(0, 3).join(", "))}</span>
        </button>
    `).join("");
    results.hidden = false;

    results.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            syncUniversityQuery(button.dataset.query || "");
            results.hidden = true;
            applyUniversityFilters({ updateUrl: true, shouldScroll: true });
        });
    });
}

function initializeUniversityDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const university = universityState.universities.find(item => item.id === id);

    if (!university) {
        showDetailNotFound();
        return;
    }

    document.title = `${university.name} | USSC Connect`;
    renderDetailHero(university);
    renderPrograms(university);
    renderAdmissionSteps(university);
    renderEntranceExams(university);
    renderQuickFacts(university);
    renderStudentNotes(university);
}

function renderDetailHero(item) {
    const target = document.getElementById("detailHero");
    if (!target) return;

    const streams = (item.streams || [])
        .map(stream => `<span class="uni-stream-chip">${escapeHTML(stream)}</span>`)
        .join("");

    target.innerHTML = `
        <div class="uni-detail-title">
            <span class="uni-kicker">${escapeHTML(item.type)}</span>
            <h1>${escapeHTML(item.name)}</h1>
            <p>${escapeHTML(item.summary)}</p>
            <div class="uni-location"><i class="bi bi-geo-alt"></i>${escapeHTML(item.city)}, ${escapeHTML(item.state)}, ${escapeHTML(item.country || "India")}</div>
            <div class="uni-streams">${streams}</div>
            <div class="uni-detail-actions">
                <a href="${escapeAttribute(item.officialWebsite)}" target="_blank" rel="noopener">
                    <i class="bi bi-box-arrow-up-right"></i> ${escapeHTML(item.officialWebsiteLabel || "Official Website")}
                </a>
                <a href="${escapeAttribute(item.admissionsWebsite)}" target="_blank" rel="noopener">
                    <i class="bi bi-send-check"></i> ${escapeHTML(item.admissionsWebsiteLabel || "Admission Page")}
                </a>
            </div>
        </div>
        <aside class="uni-detail-card">
            <h2>Official Source Links</h2>
            <div class="detail-source">
                <a href="${escapeAttribute(item.officialWebsite)}" target="_blank" rel="noopener">
                    ${escapeHTML(item.officialWebsiteLabel || "Institution website")} <span>Open</span>
                </a>
                <a href="${escapeAttribute(item.admissionsWebsite)}" target="_blank" rel="noopener">
                    ${escapeHTML(item.admissionsWebsiteLabel || "Admissions page")} <span>Open</span>
                </a>
            </div>
            <p>${escapeHTML(item.source || "Official institution website and public higher-education references.")}</p>
        </aside>
    `;
}

function renderPrograms(item) {
    const target = document.getElementById("programList");
    if (!target) return;

    target.innerHTML = (item.programs || []).map(program => `
        <article class="program-card">
            <span>${escapeHTML(program.level)} - ${escapeHTML(program.stream)}</span>
            <h3>${escapeHTML(program.name)}</h3>
            <p><strong>Duration:</strong> ${escapeHTML(program.duration)}</p>
            <p><strong>Eligibility:</strong> ${escapeHTML(program.eligibility)}</p>
            <p><strong>Possible exams:</strong> ${escapeHTML((program.entranceExams || []).join(", "))}</p>
        </article>
    `).join("");
}

function renderAdmissionSteps(item) {
    const target = document.getElementById("admissionSteps");
    if (!target) return;

    const steps = [
        ["bi-link-45deg", "Open official links", "Start from the official website and admissions page shown above. Dates, fees and seat matrix can change every year."],
        ["bi-clipboard2-check", "Check eligibility", `Match your class, subjects and stream with the program requirements for ${item.name}.`],
        ["bi-pencil-square", "Prepare exams", `Common routes here include ${(item.entranceExams || []).slice(0, 5).join(", ")}.`],
        ["bi-calendar-check", "Apply and track", "Submit forms on the official portal, save acknowledgement details and monitor counselling or merit-list updates."]
    ];

    target.innerHTML = steps.map(([icon, title, text]) => `
        <article class="admission-step">
            <i class="bi ${icon}"></i>
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(text)}</p>
        </article>
    `).join("");
}

function renderEntranceExams(item) {
    const target = document.getElementById("entranceExamList");
    if (!target) return;

    target.innerHTML = (item.entranceExams || [])
        .map(exam => `<span>${escapeHTML(exam)}</span>`)
        .join("");
}

function renderQuickFacts(item) {
    const target = document.getElementById("quickFacts");
    if (!target) return;

    const facts = [
        ["Institution type", item.type],
        ["Location", `${item.city}, ${item.state}`],
        ["Streams", (item.streams || []).join(", ")],
        ["Programs listed", `${(item.programs || []).length}`],
        ["Last reviewed", item.lastReviewed || "2026-07-01"]
    ];

    target.innerHTML = facts.map(([label, value]) => `
        <div>
            <strong>${escapeHTML(label)}</strong>
            <span>${escapeHTML(value)}</span>
        </div>
    `).join("");
}

function renderStudentNotes(item) {
    const target = document.getElementById("studentNotes");
    if (!target) return;

    const notes = [
        ["Scholarships", item.scholarships],
        ["Hostel", item.hostel],
        ["Placements", item.placement],
        ["Verification", item.verificationStatus]
    ];

    target.innerHTML = notes.map(([label, value]) => `
        <div>
            <strong>${escapeHTML(label)}</strong>
            <span>${escapeHTML(value)}</span>
        </div>
    `).join("");
}

function showDetailNotFound() {
    const target = document.getElementById("detailHero");
    if (!target) return;

    target.innerHTML = `
        <div class="uni-empty">
            <i class="bi bi-exclamation-circle"></i>
            <h3>Institution not found</h3>
            <p>Please return to the directory and choose another college or university.</p>
            <a class="uni-outline-link" href="index.html">Back to Directory</a>
        </div>
    `;
}

function showDirectoryError(message) {
    const grid = document.getElementById("universityGrid") || document.getElementById("detailHero");
    if (!grid) return;

    grid.innerHTML = `
        <div class="uni-empty">
            <i class="bi bi-exclamation-circle"></i>
            <h3>Could not load data</h3>
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}

function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function setText(id, value) {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
}

function setValue(id, value) {
    const target = document.getElementById(id);
    if (target) target.value = value || "";
}

function getValue(id) {
    const target = document.getElementById(id);
    return target ? target.value : "";
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
}
