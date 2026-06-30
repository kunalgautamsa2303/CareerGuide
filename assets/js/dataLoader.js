/* ==========================================================
   Career Guide
   Data Loader
   ========================================================== */

"use strict";

/* ==========================================================
   Cache
   ========================================================== */

const dataCache = {};

/* ==========================================================
   Load JSON File
   ========================================================== */

async function loadJSON(fileName) {

    if (dataCache[fileName]) {
        return dataCache[fileName];
    }

    try {

        const response = await fetch(`../data/${fileName}`);

        if (!response.ok) {

            throw new Error(
                `Unable to load ${fileName}`
            );

        }

        const data = await response.json();

        dataCache[fileName] = data;

        return data;

    }

    catch (error) {

        console.error(error);

        return [];

    }

}

/* ==========================================================
   Career Categories
   ========================================================== */

function loadCareerCategory(category) {

    return loadJSON(`${category}.json`);

}

/* ==========================================================
   Career Details
   ========================================================== */

function loadCareerDetails(category) {

    return loadJSON(`${category}-details.json`);

}

/* ==========================================================
   Careers
   ========================================================== */

function loadAllCareers() {

    return loadJSON("careers.json");

}

/* ==========================================================
   Career Details Database
   ========================================================== */

function loadCareerDatabase() {

    return loadJSON("career-details.json");

}

/* ==========================================================
   Colleges
   ========================================================== */

function loadColleges() {

    return loadJSON("colleges.json");

}

/* ==========================================================
   Exams
   ========================================================== */

function loadExams() {

    return loadJSON("exams.json");

}

/* ==========================================================
   News
   ========================================================== */

function loadNews() {

    return loadJSON("news.json");

}