/* ==========================================================
   USSC Connect
   Exam Details
========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", initializeExamDetails);

async function initializeExamDetails() {
    const params = new URLSearchParams(window.location.search);
    const examId = params.get("exam");

    if (!examId) {
        showExamError("Exam not found.");
        return;
    }

    try {
        const data = await loadExamJSON("exam-details.json");
        const exam = (data.exams || []).find(item => item.id === examId);

        if (!exam) {
            showExamError("This entrance exam guide is not available yet.");
            return;
        }

        renderExam(exam);
    }

    catch (error) {
        console.error(error);
        showExamError("Unable to load this exam guide.");
    }
}

async function loadExamJSON(fileName) {
    const response = await fetch(`../data/${fileName}`);

    if (!response.ok) {
        throw new Error(`Unable to load ${fileName}`);
    }

    return response.json();
}

function renderExam(exam) {
    document.title = `${exam.name} Exam Guide | USSC Connect`;

    setText("examDomain", exam.domain);
    setText("examName", exam.name);
    setText("examOverview", exam.overview);
    setText("examFullName", exam.fullName);
    setText("examLevel", exam.level);
    setText("examMode", exam.mode);
    setText("examFrequency", exam.frequency);
    setText("examEligibility", exam.eligibility);
    setText("examPattern", exam.examPattern);

    renderOfficialLink(exam.officialWebsite);
    renderAdmissionOptions(exam.admissionOptions);
    renderChips("examSyllabus", exam.syllabus);
    renderTimeline("applicationProcess", exam.applicationProcess);
    renderTips("preparationTips", exam.preparationTips);
    renderChips("acceptedBy", exam.acceptedBy);
    renderRelatedCareers(exam.relatedCareers);
}

function renderOfficialLink(url) {
    const link = document.getElementById("officialExamLink");
    const textLink = document.getElementById("officialExamTextLink");
    const card = document.getElementById("officialExamCard");

    if (!link && !textLink && !card) return;

    if (!url) {
        if (link) link.hidden = true;
        if (card) card.hidden = true;
        return;
    }

    if (link) {
        link.hidden = false;
        link.href = url;
    }

    if (card) {
        card.hidden = false;
    }

    if (textLink) {
        textLink.href = url;
        textLink.textContent = url;
    }
}

function renderAdmissionOptions(items) {
    const container = document.getElementById("admissionOptions");

    if (!container) return;

    const values = normalizeItems(items);

    container.innerHTML = values.length > 0
        ? values.map(item => `
            <article class="mini-card admission-card">
                <i class="bi bi-mortarboard-fill"></i>
                <h3>${item}</h3>
            </article>
        `).join("")
        : '<article class="mini-card"><h3>Admission pathways will be updated soon.</h3></article>';
}

function renderChips(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = normalizeItems(items)
        .map(item => `<span class="info-chip">${item}</span>`)
        .join("");
}

function renderTimeline(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = normalizeItems(items).map((item, index) => `
        <div class="timeline-item">
            <span>${index + 1}</span>
            <p>${item}</p>
        </div>
    `).join("");
}

function renderTips(containerId, items) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = normalizeItems(items).map(item => `
        <article class="mini-card">
            <i class="bi bi-check-circle-fill"></i>
            <h3>${item}</h3>
        </article>
    `).join("");
}

function renderRelatedCareers(careers) {
    const container = document.getElementById("relatedCareerGrid");

    if (!container) return;

    const values = normalizeItems(careers);

    container.innerHTML = values.length > 0
        ? values.map(career => `
            <article class="mini-card related-card">
                <i class="bi bi-compass-fill"></i>
                <h3>${career.name}</h3>
                <p>${career.domainName}</p>
                <a href="${career.href}">
                    View Career
                    <i class="bi bi-arrow-right"></i>
                </a>
            </article>
        `).join("")
        : '<article class="mini-card"><h3>Related careers will be updated soon.</h3></article>';
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value || "Information will be updated soon.";
}

function normalizeItems(items) {
    return Array.isArray(items) ? items.filter(Boolean) : [];
}

function showExamError(message) {
    setText("examName", "Exam Not Found");
    setText("examOverview", message);
}
