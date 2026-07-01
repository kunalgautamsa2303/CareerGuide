/* ==========================================================
   USSC Connect
   Planning Guide Details
========================================================== */

"use strict";

let allGuides = [];
let interactiveSelections = {};

const psychometricQuestions = [
    {
        id: "activity",
        title: "Which activity feels most natural to you?",
        options: [
            {
                value: "build",
                label: "Building, fixing or experimenting",
                description: "I like making things work, testing ideas or solving practical problems.",
                advice: "Your activity pattern points toward applied learning. Project-based courses and technical portfolios may suit you.",
                courseTags: ["B.Tech", "BCA", "B.Arch", "B.Des Product Design"],
                careerTags: ["Engineering", "Architecture", "Data Science", "Product Design"],
                examTags: ["JEE Main", "NATA", "UCEED", "CUET"]
            },
            {
                value: "care",
                label: "Helping, listening or caring",
                description: "I like supporting people, understanding emotions or improving health.",
                advice: "Your activity pattern points toward people-care pathways. Check health, psychology, education and social-impact careers.",
                courseTags: ["MBBS", "B.Sc Nursing", "B.Pharm", "BA Psychology"],
                careerTags: ["Doctor", "Nurse", "Psychologist", "Teacher"],
                examTags: ["NEET UG", "AIIMS Exams", "CUET"]
            },
            {
                value: "express",
                label: "Writing, speaking or presenting",
                description: "I enjoy language, debate, content, public speaking or explaining ideas.",
                advice: "Your activity pattern points toward communication-heavy fields. Strong reading, writing and speaking practice will help.",
                courseTags: ["BA English", "BA Journalism", "BA Political Science", "LL.B"],
                careerTags: ["Lawyer", "Journalist", "Teacher", "Civil Services"],
                examTags: ["CUET", "CLAT", "AILET"]
            },
            {
                value: "create",
                label: "Drawing, designing or imagining",
                description: "I enjoy visuals, aesthetics, storytelling, products or creative problem solving.",
                advice: "Your activity pattern points toward creative pathways. Start building a portfolio with sketches, projects or digital work.",
                courseTags: ["B.Des", "BFA", "Fashion Design", "Animation"],
                careerTags: ["Graphic Designer", "Product Designer", "Fashion Designer", "Animator"],
                examTags: ["UCEED", "NIFT Entrance", "NID DAT", "CUET"]
            },
            {
                value: "lead",
                label: "Organising, selling or leading",
                description: "I like planning events, managing people, business ideas or persuasion.",
                advice: "Your activity pattern points toward business and leadership routes. Build communication, finance and decision-making skills early.",
                courseTags: ["BBA", "B.Com", "Economics", "Integrated Management"],
                careerTags: ["Business Manager", "Entrepreneur", "Marketing Manager", "Financial Analyst"],
                examTags: ["CUET", "IPMAT", "CA Foundation"]
            }
        ]
    },
    {
        id: "workStyle",
        title: "What kind of work environment would you enjoy?",
        options: [
            {
                value: "deep",
                label: "Quiet focus and problem solving",
                description: "I like thinking deeply and working through complex tasks.",
                advice: "You may enjoy careers with research, analysis, coding, design thinking or specialized technical work.",
                courseTags: ["B.Sc", "B.Tech", "B.Stat", "BCA"],
                careerTags: ["Researcher", "Software Engineer", "Data Scientist", "Analyst"],
                examTags: ["JEE Main", "CUET", "GATE for PG"]
            },
            {
                value: "people",
                label: "People interaction",
                description: "I like teamwork, public interaction, counselling, teaching or client-facing work.",
                advice: "You may enjoy careers where communication and empathy matter as much as subject knowledge.",
                courseTags: ["BA Psychology", "B.Ed", "BBA", "LL.B"],
                careerTags: ["Psychologist", "Teacher", "Lawyer", "Manager"],
                examTags: ["CUET", "CLAT", "CTET"]
            },
            {
                value: "dynamic",
                label: "Fast-moving and practical",
                description: "I like variety, deadlines, events, field work or real-world action.",
                advice: "You may enjoy careers with projects, operations, media, entrepreneurship or hands-on problem solving.",
                courseTags: ["BBA", "Mass Communication", "Hospitality", "Sports Management"],
                careerTags: ["Event Manager", "Journalist", "Entrepreneur", "Sports Manager"],
                examTags: ["CUET", "IIMC Entrance", "Institute Specific Admissions"]
            },
            {
                value: "visual",
                label: "Visual and portfolio-based",
                description: "I like showing work through designs, visuals, presentations or creative outputs.",
                advice: "You may enjoy portfolio-based programs. Keep proof of your creative work, not only marks.",
                courseTags: ["B.Des", "B.Arch", "Animation", "Visual Communication"],
                careerTags: ["Architect", "Graphic Designer", "UI Designer", "Filmmaker"],
                examTags: ["NATA", "UCEED", "NIFT Entrance", "NID DAT"]
            }
        ]
    },
    {
        id: "subjectComfort",
        title: "Which subject group feels most comfortable?",
        options: [
            {
                value: "pcm",
                label: "Physics, Chemistry, Mathematics",
                description: "I can work with formulas, logic, numbers and technical concepts.",
                advice: "PCM comfort keeps engineering, architecture, technology, data and physical-science pathways open.",
                courseTags: ["B.Tech", "B.Arch", "B.Sc Physics", "B.Sc Mathematics"],
                careerTags: ["Engineer", "Architect", "Data Scientist", "Researcher"],
                examTags: ["JEE Main", "JEE Advanced", "NATA", "CUET"]
            },
            {
                value: "pcb",
                label: "Physics, Chemistry, Biology",
                description: "I enjoy life sciences, health, biology and human systems.",
                advice: "PCB comfort keeps medicine, healthcare, biotechnology, psychology and life-science pathways open.",
                courseTags: ["MBBS", "BDS", "B.Sc Nursing", "Biotechnology"],
                careerTags: ["Doctor", "Dentist", "Nurse", "Biotechnologist"],
                examTags: ["NEET UG", "AIIMS Exams", "CUET"]
            },
            {
                value: "commerce",
                label: "Accounts, Economics, Business, Maths",
                description: "I like money, markets, business, accounting or practical decision-making.",
                advice: "Commerce comfort supports finance, management, entrepreneurship, economics and business analytics routes.",
                courseTags: ["B.Com", "BBA", "Economics", "CA Foundation"],
                careerTags: ["Chartered Accountant", "Business Manager", "Economist", "Banker"],
                examTags: ["CUET", "CA Foundation", "IPMAT"]
            },
            {
                value: "humanities",
                label: "Language, society, psychology, history",
                description: "I enjoy people, ideas, reading, writing, society or human behaviour.",
                advice: "Humanities comfort supports law, psychology, media, teaching, policy and civil-service pathways.",
                courseTags: ["BA Psychology", "BA Political Science", "BA Journalism", "LL.B"],
                careerTags: ["Lawyer", "Psychologist", "Journalist", "Teacher"],
                examTags: ["CUET", "CLAT", "AILET"]
            },
            {
                value: "mixed",
                label: "Mixed or still exploring",
                description: "I like more than one subject group and want flexible options.",
                advice: "A mixed profile is normal. Choose flexible subjects where possible and compare course eligibility before deciding.",
                courseTags: ["Liberal Arts", "B.Voc", "B.Des", "BBA"],
                careerTags: ["Designer", "Manager", "Media Professional", "Entrepreneur"],
                examTags: ["CUET", "Institute Specific Admissions"]
            }
        ]
    }
];

const interactiveTools = {
    "choose-after-class-10": {
        title: "Find Your Class 11 Direction",
        intro: "Choose what feels most true right now. The result is not a final decision; it is a smart starting point for discussion.",
        questions: [
            {
                id: "interest",
                title: "Which kind of work feels most exciting?",
                options: [
                    {
                        value: "technology",
                        label: "Solving technical problems",
                        description: "Machines, apps, math, coding, physics or systems.",
                        resultTitle: "Science with Mathematics may be your strongest first option.",
                        resultText: "Explore PCM with engineering, architecture, data science, aviation and technology pathways. Keep JEE Main, JEE Advanced, NATA and UCEED in view."
                    },
                    {
                        value: "health",
                        label: "Helping people through health",
                        description: "Biology, care, medicine, wellness or life sciences.",
                        resultTitle: "Science with Biology is worth serious exploration.",
                        resultText: "Look at PCB/PCMB pathways connected to NEET UG, AIIMS-linked exams, nursing, pharmacy, physiotherapy, nutrition and public health."
                    },
                    {
                        value: "business",
                        label: "Business, money and leadership",
                        description: "Accounts, economics, entrepreneurship, markets or management.",
                        resultTitle: "Commerce may give you a practical career base.",
                        resultText: "Explore Accountancy, Economics, Business Studies and Mathematics options with CA Foundation, CUET, IPMAT, finance and management pathways."
                    },
                    {
                        value: "people",
                        label: "People, society and communication",
                        description: "Law, psychology, media, teaching, policy or social work.",
                        resultTitle: "Humanities can open strong professional pathways.",
                        resultText: "Explore Psychology, Political Science, Sociology, History, Economics and languages with CLAT, CUET, AILET, media, teaching and public-service routes."
                    },
                    {
                        value: "creative",
                        label: "Creative or hands-on work",
                        description: "Design, media, sports, practical skills or entrepreneurship.",
                        resultTitle: "A creative or skill-based pathway may fit you well.",
                        resultText: "Explore design, media, vocational, IT, sports or entrepreneurship-linked subjects. Portfolio, projects and institute-specific admissions may matter."
                    }
                ]
            },
            {
                id: "confidence",
                title: "How confident are you about this direction?",
                options: [
                    {
                        value: "sure",
                        label: "Fairly sure",
                        description: "I want to plan subjects and exams now.",
                        advice: "Next step: verify subject requirements and entrance exams before final subject selection."
                    },
                    {
                        value: "split",
                        label: "Confused between two areas",
                        description: "I like more than one direction.",
                        advice: "Next step: choose a flexible subject combination where possible and compare two pathways side by side."
                    },
                    {
                        value: "unsure",
                        label: "Not sure yet",
                        description: "I need exploration before deciding.",
                        advice: "Next step: speak with teachers/counsellors, review marks patterns and explore 8-10 careers before locking a stream."
                    }
                ]
            }
        ],
        actions: [
            { label: "Explore Careers", href: "index.html#categoryGrid" },
            { label: "Check Exams", href: "exams.html" }
        ]
    },
    "plan-after-class-12": {
        title: "Build Your After-Class-12 Plan",
        intro: "Pick your target direction and planning status. The tool will suggest your immediate next move.",
        questions: [
            {
                id: "goal",
                title: "Which admission direction are you planning for?",
                options: [
                    {
                        value: "medical",
                        label: "Medical / healthcare",
                        description: "MBBS, BDS, nursing, pharmacy, public health or allied health.",
                        resultTitle: "Your plan should start with NEET/CUET and counselling clarity.",
                        resultText: "Map NEET UG, AIIMS-linked routes, CUET and healthcare course options. Keep counselling documents and backup health programs ready."
                    },
                    {
                        value: "engineering",
                        label: "Engineering / technology",
                        description: "B.Tech, B.E., data, AI, architecture or computing.",
                        resultTitle: "Your plan should connect exams, branches and colleges.",
                        resultText: "Compare JEE Main, JEE Advanced, state/private exams and branch choices. Shortlist colleges by branch quality, not only name."
                    },
                    {
                        value: "university",
                        label: "University degree",
                        description: "BA, B.Sc, B.Com, BBA, BCA, B.Voc or interdisciplinary courses.",
                        resultTitle: "Your plan should focus on course fit and CUET combinations.",
                        resultText: "Check target universities, required CUET subjects, eligibility rules and separate university admission portals."
                    },
                    {
                        value: "professional",
                        label: "Law / design / architecture / management",
                        description: "Professional entrance routes and portfolio-based pathways.",
                        resultTitle: "Your plan should include exam plus portfolio/interview readiness.",
                        resultText: "Track CLAT, AILET, NATA, UCEED, NIFT, IPMAT or institute tests. Build writing, portfolio or aptitude practice alongside school study."
                    }
                ]
            },
            {
                id: "stage",
                title: "Where are you right now?",
                options: [
                    {
                        value: "starting",
                        label: "Just starting",
                        description: "I need a clear list of courses and exams.",
                        advice: "Make a one-page map: career goal, courses, exams, eligibility, official links and deadlines."
                    },
                    {
                        value: "preparing",
                        label: "Preparing for exams",
                        description: "I know the exam but need structure.",
                        advice: "Create a weekly plan with syllabus targets, mock tests, revision slots and official-date tracking."
                    },
                    {
                        value: "choosing",
                        label: "Choosing colleges",
                        description: "I need to compare options after results.",
                        advice: "Compare fees, accreditation, placements, safety, internships, location, scholarship and counselling rules."
                    }
                ]
            }
        ],
        actions: [
            { label: "Open Exam Library", href: "exams.html" },
            { label: "Explore Careers", href: "index.html#careerGrid" }
        ]
    },
    "compare-careers": {
        title: "Career Comparison Studio",
        intro: "Choose what matters most to you, then choose the kind of careers you are comparing.",
        questions: [
            {
                id: "priority",
                title: "What matters most in your career decision?",
                options: [
                    {
                        value: "fit",
                        label: "Interest and personality fit",
                        description: "I want work that matches who I am.",
                        resultTitle: "Start by comparing daily work and skill fit.",
                        resultText: "Look beyond career names. Compare what people actually do each day, the skills used and whether that work energizes you."
                    },
                    {
                        value: "growth",
                        label: "Future growth",
                        description: "I want strong demand and long-term scope.",
                        resultTitle: "Start by comparing future scope and AI impact.",
                        resultText: "Check demand, technology change, specialization options, global opportunities and how AI is changing entry-level work."
                    },
                    {
                        value: "study",
                        label: "Study time and eligibility",
                        description: "I want to understand the education path.",
                        resultTitle: "Start by comparing eligibility and years of study.",
                        resultText: "Compare subjects, entrance exams, degree length, fees, licensing requirements and backup routes."
                    },
                    {
                        value: "lifestyle",
                        label: "Lifestyle and work environment",
                        description: "I care about stress, hours, location and stability.",
                        resultTitle: "Start by comparing work environment.",
                        resultText: "Compare work hours, fieldwork, public interaction, travel, stress, flexibility and income stability."
                    }
                ]
            },
            {
                id: "careerType",
                title: "Which career group are you comparing?",
                options: [
                    {
                        value: "technical",
                        label: "Technical careers",
                        description: "Engineering, data, AI, architecture or IT.",
                        advice: "Use eligibility, math readiness, project skills, internships and future technology demand as your comparison points."
                    },
                    {
                        value: "people",
                        label: "People-facing careers",
                        description: "Medicine, law, psychology, teaching, management or public service.",
                        advice: "Compare communication load, emotional demands, licensing, ethics, service mindset and long-term study requirements."
                    },
                    {
                        value: "creative",
                        label: "Creative careers",
                        description: "Design, media, writing, film, fashion or content.",
                        advice: "Compare portfolio needs, originality, feedback tolerance, software skills, internships and freelance/employment routes."
                    }
                ]
            }
        ],
        actions: [
            { label: "Explore Careers", href: "index.html#careerGrid" },
            { label: "Check Exams", href: "exams.html" }
        ]
    },
    "entrance-exam-planning": {
        title: "Entrance Exam Route Finder",
        intro: "Select your course goal and preparation situation to get a clean exam-planning route.",
        questions: [
            {
                id: "course",
                title: "Which course/admission goal are you targeting?",
                options: [
                    {
                        value: "mbbs",
                        label: "MBBS / BDS / health courses",
                        description: "Medical, dental, AYUSH or healthcare admission.",
                        resultTitle: "Your main exam route is NEET UG.",
                        resultText: "Use the NEET UG official page, check eligibility, prepare Physics/Chemistry/Biology and understand MCC/state counselling."
                    },
                    {
                        value: "btech",
                        label: "B.Tech / engineering",
                        description: "NIT, IIIT, IIT, state or private engineering routes.",
                        resultTitle: "Your main route is JEE Main, with JEE Advanced for IITs.",
                        resultText: "Track JEE Main first. If your score qualifies, JEE Advanced opens IIT routes. Keep state/private engineering backups."
                    },
                    {
                        value: "university",
                        label: "BA / BSc / BCom / BBA / BCA",
                        description: "Central or participating university admission.",
                        resultTitle: "Your main route may be CUET.",
                        resultText: "Choose CUET subjects based on target university and course. Check each university's separate admission rules."
                    },
                    {
                        value: "professional",
                        label: "Law / design / architecture",
                        description: "CLAT, NATA, UCEED, NIFT or institute-specific tests.",
                        resultTitle: "Your exam route depends on the profession.",
                        resultText: "Use CLAT/AILET for law, NATA/JEE Paper 2 for architecture, UCEED/NIFT/NID for design. Portfolio or drawing practice may matter."
                    }
                ]
            },
            {
                id: "timeline",
                title: "What is your preparation timeline?",
                options: [
                    {
                        value: "oneYear",
                        label: "One year or more",
                        description: "I can build fundamentals slowly.",
                        advice: "Use a three-phase plan: syllabus completion, mixed practice, then mocks and counselling research."
                    },
                    {
                        value: "sixMonths",
                        label: "Around 6 months",
                        description: "I need focused preparation.",
                        advice: "Prioritize high-weight topics, official syllabus, previous papers and weekly mocks."
                    },
                    {
                        value: "late",
                        label: "Very little time",
                        description: "I need a realistic backup plan too.",
                        advice: "Focus on scoring topics, official dates, application accuracy and backup exams/courses with lower preparation overlap."
                    }
                ]
            }
        ],
        actions: [
            { label: "Open Exam Library", href: "exams.html" },
            { label: "Explore Careers", href: "index.html#careerGrid" }
        ]
    }
};

document.addEventListener("DOMContentLoaded", initializePlanningGuide);

async function initializePlanningGuide() {
    const params = new URLSearchParams(window.location.search);
    const guideId = params.get("guide") || "choose-after-class-10";

    try {
        const data = await loadGuideJSON();
        allGuides = Array.isArray(data.guides) ? data.guides : [];
        const guide = allGuides.find(item => item.id === guideId) || allGuides[0];

        if (!guide) {
            showGuideError();
            return;
        }

        renderGuide(guide);
    }

    catch (error) {
        console.error(error);
        showGuideError();
    }
}

async function loadGuideJSON() {
    const response = await fetch("../data/planning-guides.json");

    if (!response.ok) {
        throw new Error("Unable to load planning guides.");
    }

    return response.json();
}

function renderGuide(guide) {
    document.title = `${guide.title} | USSC Connect`;

    setText("guideCrumb", guide.title);
    setText("guideEyebrow", guide.eyebrow);
    setText("guideTitle", guide.title);
    setText("guideIntro", guide.intro);
    setText("guideQuickAnswer", guide.quickAnswer);

    renderReference(guide.officialReference);
    renderBestFor(guide.bestFor);
    renderActions(guide.actions);
    renderInteractiveTool(guide.id);
    renderSteps(guide.steps);
    renderPathways(guide.pathways);
    renderMistakes(guide.mistakesToAvoid);
    renderRelatedGuides(guide.id);
}

function renderInteractiveTool(guideId) {
    const tool = interactiveTools[guideId];
    const section = document.getElementById("interactiveTool");
    const title = document.getElementById("interactiveTitle");
    const intro = document.getElementById("interactiveIntro");
    const resetButton = document.getElementById("resetInteractiveTool");

    interactiveSelections = {};

    if (!section || !tool) {
        if (section) section.hidden = true;
        return;
    }

    section.hidden = false;
    setText("interactiveTitle", tool.title);
    setText("interactiveIntro", tool.intro);

    if (title) title.textContent = tool.title;
    if (intro) intro.textContent = tool.intro;

    if (resetButton) {
        resetButton.onclick = () => {
            interactiveSelections = {};
            renderInteractiveQuestions(tool, 0);
            renderInteractiveProgress(tool);
            hideInteractiveResult();
        };
    }

    renderInteractiveProgress(tool);
    renderInteractiveQuestions(tool, 0);
    hideInteractiveResult();
}

function renderInteractiveProgress(tool) {
    const container = document.getElementById("interactiveProgress");
    const questions = getToolQuestions(tool);

    if (!container) return;

    container.innerHTML = questions.map((question, index) => {
        const isDone = Boolean(interactiveSelections[question.id]);
        const isActive = !isDone && getCurrentQuestionIndex(questions) === index;

        return `
            <span class="${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}">
                ${index + 1}
            </span>
        `;
    }).join("");
}

function renderInteractiveQuestions(tool, activeIndex) {
    const container = document.getElementById("interactiveQuestions");
    const questions = getToolQuestions(tool);

    if (!container) return;

    const visibleQuestions = questions.slice(0, activeIndex + 1);

    container.innerHTML = visibleQuestions.map((question, questionIndex) => `
        <article class="interactive-question ${questionIndex === activeIndex ? "is-current" : ""}">
            <div>
                <span>Question ${questionIndex + 1}</span>
                <h3>${escapeHTML(question.title)}</h3>
            </div>
            <div class="interactive-options">
                ${question.options.map(option => renderInteractiveOption(question, option)).join("")}
            </div>
        </article>
    `).join("");

    container.querySelectorAll("[data-question-id]").forEach(button => {
        button.addEventListener("click", () => {
            const questionId = button.dataset.questionId;
            const optionValue = button.dataset.optionValue;

            interactiveSelections[questionId] = optionValue;

            const nextIndex = getCurrentQuestionIndex(questions);

            renderInteractiveProgress(tool);
            renderInteractiveQuestions(tool, nextIndex);

            if (isInteractiveComplete(questions)) {
                renderInteractiveResult(tool);
            }
            else {
                hideInteractiveResult();
            }
        });
    });
}

function renderInteractiveOption(question, option) {
    const isSelected = interactiveSelections[question.id] === option.value;

    return `
        <button type="button"
                class="${isSelected ? "is-selected" : ""}"
                data-question-id="${escapeAttribute(question.id)}"
                data-option-value="${escapeAttribute(option.value)}">
            <strong>${escapeHTML(option.label)}</strong>
            <span>${escapeHTML(option.description)}</span>
        </button>
    `;
}

function renderInteractiveResult(tool) {
    const container = document.getElementById("interactiveResult");
    const questions = getToolQuestions(tool);
    const firstQuestion = questions[0];
    const secondQuestion = questions[1];
    const firstOption = getSelectedOption(firstQuestion);
    const secondOption = getSelectedOption(secondQuestion);
    const selectedOptions = questions
        .map(question => getSelectedOption(question))
        .filter(Boolean);
    const courseTags = collectTags(selectedOptions, "courseTags");
    const careerTags = collectTags(selectedOptions, "careerTags");
    const examTags = collectTags(selectedOptions, "examTags");
    const extraAdvice = selectedOptions
        .slice(2)
        .map(option => option.advice)
        .filter(Boolean);

    if (!container || !firstOption || !secondOption) return;

    container.hidden = false;
    container.innerHTML = `
        <div>
            <span>Your Suggested Direction</span>
            <h3>${escapeHTML(firstOption.resultTitle)}</h3>
            <p>${escapeHTML(firstOption.resultText)}</p>
        </div>
        <div class="interactive-advice">
            <i class="bi bi-lightbulb-fill"></i>
            <p>${escapeHTML(secondOption.advice)}</p>
        </div>
        ${extraAdvice.length ? `
            <div class="interactive-signal-list">
                ${extraAdvice.map(item => `
                    <article>
                        <i class="bi bi-stars"></i>
                        <p>${escapeHTML(item)}</p>
                    </article>
                `).join("")}
            </div>
        ` : ""}
        <div class="interactive-tag-panel">
            ${renderResultTagGroup("Course Tags", courseTags, "index.html?search=")}
            ${renderResultTagGroup("Career Tags", careerTags, "index.html?search=")}
            ${renderResultTagGroup("Exam Tags", examTags, "exams.html?search=")}
        </div>
        <div class="interactive-next-actions">
            ${normalizeItems(tool.actions).map(action => `
                <a href="${escapeAttribute(action.href)}">
                    ${escapeHTML(action.label)}
                    <i class="bi bi-arrow-right"></i>
                </a>
            `).join("")}
        </div>
    `;
}

function renderResultTagGroup(title, tags, baseHref) {
    if (!tags.length) return "";

    return `
        <section>
            <span>${escapeHTML(title)}</span>
            <div>
                ${tags.map(tag => `
                    <a href="${baseHref}${encodeURIComponent(tag)}">
                        ${escapeHTML(tag)}
                    </a>
                `).join("")}
            </div>
        </section>
    `;
}

function hideInteractiveResult() {
    const container = document.getElementById("interactiveResult");

    if (!container) return;

    container.hidden = true;
    container.innerHTML = "";
}

function getSelectedOption(question) {
    if (!question) return null;

    return question.options.find(
        option => option.value === interactiveSelections[question.id]
    );
}

function getCurrentQuestionIndex(questions) {
    const nextIndex = questions.findIndex(
        question => !interactiveSelections[question.id]
    );

    return nextIndex === -1 ? questions.length - 1 : nextIndex;
}

function isInteractiveComplete(questions) {
    return questions.every(question => interactiveSelections[question.id]);
}

function getToolQuestions(tool) {
    return [
        ...tool.questions,
        ...psychometricQuestions
    ];
}

function collectTags(options, key) {
    const seen = new Set();
    const tags = [];

    options.forEach(option => {
        normalizeItems(option[key]).forEach(tag => {
            if (seen.has(tag)) return;

            seen.add(tag);
            tags.push(tag);
        });
    });

    return tags.slice(0, 10);
}

function renderReference(reference) {
    const container = document.getElementById("guideReference");

    if (!container || !reference) return;

    container.innerHTML = `
        <span>Reference direction</span>
        <a href="${escapeAttribute(reference.url)}"
           target="_blank"
           rel="noopener noreferrer">
            ${escapeHTML(reference.label)}
            <i class="bi bi-box-arrow-up-right"></i>
        </a>
    `;
}

function renderBestFor(items) {
    const container = document.getElementById("guideBestFor");

    if (!container) return;

    container.innerHTML = normalizeItems(items)
        .map(item => `<span>${escapeHTML(item)}</span>`)
        .join("");
}

function renderActions(actions) {
    const container = document.getElementById("guideActions");

    if (!container) return;

    container.innerHTML = normalizeItems(actions)
        .map((action, index) => `
            <a href="${escapeAttribute(action.href)}"
               class="btn ${index === 0 ? "btn-primary" : "btn-outline"}">
                ${escapeHTML(action.label)}
                <i class="bi bi-arrow-right"></i>
            </a>
        `)
        .join("");
}

function renderSteps(steps) {
    const container = document.getElementById("guideSteps");

    if (!container) return;

    container.innerHTML = normalizeItems(steps).map((step, index) => `
        <article class="guide-step">
            <strong>${index + 1}</strong>
            <div>
                <h3>${escapeHTML(step.title)}</h3>
                <p>${escapeHTML(step.text)}</p>
            </div>
        </article>
    `).join("");
}

function renderPathways(pathways) {
    const container = document.getElementById("guidePathways");

    if (!container) return;

    container.innerHTML = normalizeItems(pathways).map(pathway => `
        <article class="pathway-card">
            <h3>${escapeHTML(pathway.name)}</h3>
            <p>${escapeHTML(pathway.goodFor)}</p>
            <div>
                <span>Career directions</span>
                <div class="guide-mini-chips">
                    ${normalizeItems(pathway.careerLinks).map(item => `<em>${escapeHTML(item)}</em>`).join("")}
                </div>
            </div>
            <div>
                <span>Related exams</span>
                <div class="guide-mini-chips">
                    ${normalizeItems(pathway.examLinks).map(item => `<em>${escapeHTML(item)}</em>`).join("")}
                </div>
            </div>
        </article>
    `).join("");
}

function renderMistakes(mistakes) {
    const container = document.getElementById("guideMistakes");

    if (!container) return;

    container.innerHTML = normalizeItems(mistakes).map(item => `
        <article>
            <i class="bi bi-shield-exclamation"></i>
            <p>${escapeHTML(item)}</p>
        </article>
    `).join("");
}

function renderRelatedGuides(currentId) {
    const container = document.getElementById("relatedGuides");

    if (!container) return;

    container.innerHTML = allGuides
        .filter(guide => guide.id !== currentId)
        .map(guide => `
            <a class="related-guide-card"
               href="guide.html?guide=${encodeURIComponent(guide.id)}">
                <span>${escapeHTML(guide.eyebrow)}</span>
                <strong>${escapeHTML(guide.title)}</strong>
                <i class="bi bi-arrow-right"></i>
            </a>
        `)
        .join("");
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value || "";
}

function normalizeItems(items) {
    return Array.isArray(items) ? items.filter(Boolean) : [];
}

function showGuideError() {
    setText("guideTitle", "Guide Not Found");
    setText("guideIntro", "This planning guide is not available right now.");
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
