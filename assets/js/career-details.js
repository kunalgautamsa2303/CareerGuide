/* ==========================================================
   USSC Connect
   Career Details
========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", initializeCareerDetails);

async function initializeCareerDetails() {
    const params = new URLSearchParams(window.location.search);
    const domainId = params.get("domain");
    const careerId = params.get("career") || params.get("id");

    if (!domainId || !careerId) {
        showDetailsError("Career details not found.");
        return;
    }

    try {
        const domain = await getDomain(domainId);
        const detailData = await loadDetailsJSON(`${domain.file.replace(".json", "")}-details.json`);
        const listData = await loadDetailsJSON(domain.file);
        const careers = detailData.careers || [];
        const career = careers.find(item => item.id === careerId);

        if (!career) {
            showDetailsError("This career profile is not available yet.");
            return;
        }

        const listCareer = (listData.careers || []).find(item => item.id === careerId) || {};
        const mergedCareer = {
            ...career,
            name: listCareer.name || career.name
        };

        renderCareerDetails(mergedCareer, domain, careers);
        initializeDetailActions(mergedCareer, domain);
    }

    catch (error) {
        console.error(error);
        showDetailsError("Unable to load this career profile.");
    }
}

async function getDomain(domainId) {
    const data = await loadDetailsJSON("careers.json");
    const domain = (data.domains || []).find(item => item.id === domainId);

    if (!domain) {
        throw new Error(`Unknown domain: ${domainId}`);
    }

    return domain;
}

async function loadDetailsJSON(fileName) {
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

function renderCareerDetails(career, domain, allCareers) {
    document.title = `${career.name} | USSC Connect`;

    setText("careerDomain", domain.name);
    setText("careerName", career.name);
    setText("careerOverview", career.overview);
    setText("overviewText", career.overview);
    setText("whyChoose", career.whyChoose);
    setText("salaryRange", getSalaryRange(career.salary));
    setText("futureScope", career.futureScope);
    setText("futureScopeCard", career.futureScope);
    setText("aiImpact", career.aiImpact);
    setText("education", getShortEducation(career));
    setText("salaryFresher", getSalaryValue(career.salary, "fresher"));
    setText("salaryMid", getSalaryValue(career.salary, "midLevel"));
    setText("salarySenior", getSalaryValue(career.salary, "seniorLevel"));

    renderEducationPath(career.educationPath);
    renderChips("skillsGrid", career.skills);
    renderExamLinks("entranceExamGrid", career.entranceExams);
    renderCards("collegeGrid", career.topColleges, "bi-mortarboard-fill");
    renderChips("recruiterGrid", career.recruiters);
    renderChips("opportunityGrid", career.careerOpportunities);
    renderList("prosList", career.pros);
    renderList("consList", career.cons);
    renderRelatedCareers(career, domain, allCareers);
}

function initializeDetailActions(career, domain) {
    const saveButton = document.getElementById("saveCareerBtn");
    const shareButton = document.querySelector(".hero-buttons .btn-outline");
    const compareButton = document.querySelectorAll(".hero-buttons .btn-outline")[1];

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            saveButton.classList.toggle("is-saved");
            saveButton.innerHTML = saveButton.classList.contains("is-saved")
                ? '<i class="bi bi-bookmark-fill"></i> Saved'
                : '<i class="bi bi-bookmark"></i> Save Career';
        });
    }

    if (shareButton) {
        shareButton.addEventListener("click", async () => {
            const shareData = {
                title: `${career.name} | USSC Connect`,
                text: `Explore ${career.name} in ${domain.name}.`,
                url: window.location.href
            };

            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            shareButton.innerHTML = '<i class="bi bi-check2"></i> Copied';
        });
    }

    if (compareButton) {
        compareButton.addEventListener("click", () => {
            window.location.href = `index.html?domain=${domain.id}`;
        });
    }
}

function renderEducationPath(path) {
    const container = document.getElementById("educationPath");

    if (!container) return;

    const steps = String(path || "Class 12 / Graduation / Skill Building / Career Entry")
        .split(/->|â†’|→/)
        .map(step => step.trim())
        .filter(Boolean);

    container.innerHTML = steps.map((step, index) => `
        <div class="timeline-item">
            <span>${index + 1}</span>
            <p>${step}</p>
        </div>
    `).join("");
}

function renderChips(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const values = normalizeItems(items);

    container.innerHTML = values.length > 0
        ? values.map(item => `<span class="info-chip">${item}</span>`).join("")
        : '<span class="info-chip">Information will be updated soon.</span>';
}

function renderExamLinks(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const values = normalizeItems(items);

    container.innerHTML = values.length > 0
        ? values.map(item => `
            <a class="info-chip exam-chip"
               href="exam.html?exam=${slugify(item)}">
                ${item}
                <i class="bi bi-arrow-right"></i>
            </a>
        `).join("")
        : '<span class="info-chip">Information will be updated soon.</span>';
}

function renderCards(containerId, items, iconClass) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const values = normalizeItems(items);

    container.innerHTML = values.length > 0
        ? values.map(item => `
            <article class="mini-card">
                <i class="bi ${iconClass}"></i>
                <h3>${item}</h3>
            </article>
        `).join("")
        : '<article class="mini-card"><h3>Information will be updated soon.</h3></article>';
}

function renderList(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const values = normalizeItems(items);

    container.innerHTML = values.length > 0
        ? values.map(item => `<li>${item}</li>`).join("")
        : "<li>Information will be updated soon.</li>";
}

function renderRelatedCareers(career, domain, allCareers) {
    const relatedNames = normalizeItems(career.relatedCareers);
    const related = relatedNames.length > 0
        ? relatedNames
        : allCareers
            .filter(item => item.id !== career.id)
            .slice(0, 3)
            .map(item => item.name);

    const container = document.getElementById("relatedCareerGrid");

    if (!container) return;

    container.innerHTML = related.map(name => {
        const matchingCareer = allCareers.find(
            item => item.name.toLowerCase() === name.toLowerCase()
        );
        const href = matchingCareer
            ? `details.html?domain=${domain.id}&career=${matchingCareer.id}`
            : `index.html?domain=${domain.id}`;

        return `
            <article class="mini-card related-card">
                <i class="bi bi-compass-fill"></i>
                <h3>${name}</h3>
                <a href="${href}">
                    Explore
                    <i class="bi bi-arrow-right"></i>
                </a>
            </article>
        `;
    }).join("");
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value || "Information will be updated soon.";
}

function normalizeItems(items) {
    if (Array.isArray(items)) {
        return items.filter(Boolean);
    }

    if (typeof items === "string" && items.trim()) {
        return [items.trim()];
    }

    return [];
}

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function getSalaryValue(salary, key) {
    if (!salary) {
        return "--";
    }

    if (typeof salary === "string") {
        return salary;
    }

    return salary[key] || "--";
}

function getSalaryRange(salary) {
    if (!salary) {
        return "--";
    }

    if (typeof salary === "string") {
        return salary;
    }

    return [salary.fresher, salary.midLevel, salary.seniorLevel]
        .filter(Boolean)
        .join(" / ");
}

function getShortEducation(career) {
    if (career.eligibility) {
        return career.eligibility;
    }

    if (career.educationPath) {
        return career.educationPath;
    }

    return "Education path included";
}

function showDetailsError(message) {
    setText("careerName", "Career Not Found");
    setText("careerOverview", message);
    setText("overviewText", message);
}
