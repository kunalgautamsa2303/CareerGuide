/* ==========================================================
   USSC Connect
   Entrance Exam Library
========================================================== */

"use strict";

let examLibrary = [];

document.addEventListener("DOMContentLoaded", initializeExamLibrary);

async function initializeExamLibrary() {
    try {
        const params = new URLSearchParams(window.location.search);
        const initialSearch = params.get("search") || "";
        const data = await loadExamLibraryJSON("exams.json");
        examLibrary = Array.isArray(data.exams) ? data.exams : [];

        renderExamLibrary(examLibrary);
        initializeExamSearch(initialSearch);
    }

    catch (error) {
        console.error(error);
        renderExamLibraryError();
    }
}

async function loadExamLibraryJSON(fileName) {
    const response = await fetch(`../data/${fileName}`);

    if (!response.ok) {
        throw new Error(`Unable to load ${fileName}`);
    }

    return response.json();
}

function renderExamLibrary(exams) {
    const grid = document.getElementById("allExamGrid");

    if (!grid) return;

    if (exams.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-journal-x"></i>
                <h3>No entrance exams available yet.</h3>
            </div>
        `;
        return;
    }

    grid.innerHTML = exams.map(exam => `
        <article class="exam-card library-item"
                 data-search-text="${escapeAttribute(normalizeExamText([
                     exam.name,
                     exam.description,
                     exam.domain,
                     exam.category
                 ]))}">
            <span class="career-tag">${escapeHTML(exam.domain || "Entrance Exam")}</span>
            <h3>${escapeHTML(exam.name)}</h3>
            <p>${escapeHTML(exam.description)}</p>
            <div class="exam-card-actions">
                <a href="exam.html?exam=${encodeURIComponent(exam.id)}">
                    View Exam Guide
                    <i class="bi bi-arrow-right"></i>
                </a>
                ${exam.officialWebsite ? `
                    <a href="${escapeAttribute(exam.officialWebsite)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        Official Page
                        <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                ` : ""}
            </div>
        </article>
    `).join("");

    grid.querySelectorAll(".exam-card").forEach(card => {
        card.addEventListener("click", event => {
            if (event.target.closest("a")) return;

            const link = card.querySelector("a");

            if (link) {
                window.location.href = link.href;
            }
        });
    });
}

function initializeExamSearch(initialSearch = "") {
    const input = document.getElementById("examSearch");
    const button = document.getElementById("examSearchBtn");

    if (!input) return;

    const runSearch = (options = {}) => {
        const { shouldScroll = false, updateUrl = false } = options;
        const rawQuery = input.value.trim();
        const query = rawQuery.toLowerCase();
        let visibleCount = 0;

        document.querySelectorAll("#allExamGrid .library-item").forEach(card => {
            const isVisible =
                !query ||
                card.dataset.searchText.includes(query);

            card.classList.toggle("is-hidden", !isVisible);

            if (isVisible) {
                visibleCount += 1;
            }
        });

        toggleExamEmptyState(rawQuery, visibleCount);

        if (updateUrl) {
            updateExamSearchUrl(rawQuery);
        }

        if (shouldScroll) {
            scrollToExamResults(rawQuery, visibleCount);
        }
    };

    input.addEventListener("input", runSearch);
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            runSearch({ shouldScroll: true, updateUrl: true });
        }
    });

    if (button) {
        button.addEventListener("click", () => {
            input.focus();
            runSearch({ shouldScroll: true, updateUrl: true });
        });
    }

    if (initialSearch) {
        input.value = initialSearch;
        runSearch();
    }
}

function updateExamSearchUrl(query) {
    const url = new URL(window.location.href);

    if (query) {
        url.searchParams.set("search", query);
    }
    else {
        url.searchParams.delete("search");
    }

    window.history.replaceState({}, "", url.toString());
}

function scrollToExamResults(query, visibleCount) {
    const empty = document.getElementById("examSearchEmpty");
    const target = query && visibleCount === 0
        ? empty
        : document.querySelector(".exam-guides");

    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function toggleExamEmptyState(query, visibleCount) {
    const existing = document.getElementById("examSearchEmpty");

    if (existing) {
        existing.remove();
    }

    if (!query || visibleCount > 0) {
        return;
    }

    const grid = document.getElementById("allExamGrid");

    if (!grid) return;

    const empty = document.createElement("div");
    empty.id = "examSearchEmpty";
    empty.className = "empty-state";
    empty.innerHTML = `
        <i class="bi bi-search"></i>
        <h3>No matching exams found.</h3>
        <p>Try searching by exam name, domain or career pathway.</p>
    `;

    grid.appendChild(empty);
}

function renderExamLibraryError() {
    const grid = document.getElementById("allExamGrid");

    if (!grid) return;

    grid.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-exclamation-circle"></i>
            <h3>Unable to load entrance exams.</h3>
        </div>
    `;
}

function normalizeExamText(values) {
    return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
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
