/* ==========================================================
   USSC Connect
   Dashboard Suite Interactions + Local Data Store
========================================================== */

"use strict";

const USSC_STORE_KEY = "usscConnectDashboardStore.v1";

document.addEventListener("DOMContentLoaded", () => {
    const renderedRoleDashboard = initializeRoleDashboard();

    if (!renderedRoleDashboard) {
        initializeSuiteSearch();
        initializeSuiteTabs();
        initializeSuiteActions();
    }
});

function initializeRoleDashboard() {
    const role = getDashboardRole();
    const content = document.querySelector(".suite-content");

    if (!role || !content) return false;

    const store = getStore();
    content.innerHTML = renderRole(role, store);
    bindDashboardForms(role);
    bindDashboardButtons(role);
    initializeSuiteSearch();
    initializeSuiteTabs();
    initializeSuiteActions();
    return true;
}

function getDashboardRole() {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();

    if (path.includes("/student/")) return "student";
    if (path.includes("/school/dashboard")) return "school";
    if (path.includes("/counselor/")) return "counselor";
    if (path.includes("/university/dashboard")) return "university";
    if (path.includes("/school-connect/")) return "schoolConnect";
    if (path.includes("/university-connect/")) return "universityConnect";

    return "";
}

function getDefaultStore() {
    return {
        activeStudentId: "student-aanya",
        activeSchoolId: "school-dps-dwarka",
        activeCounselorId: "counselor-ria",
        activeUniversityId: "university-abc-design",
        schools: [
            {
                id: "school-dps-dwarka",
                name: "Delhi Public School Dwarka",
                board: "CBSE",
                city: "New Delhi",
                website: "https://www.dpsdwarka.com/",
                contactPerson: "Ms. Neha Kapoor",
                subscription: "Premium Active",
                counselorIds: ["counselor-ria"]
            }
        ],
        counselors: [
            {
                id: "counselor-ria",
                name: "Ria Mehra",
                email: "ria.mehra@dpsdwarka.edu",
                type: "School Counselor",
                schoolId: "school-dps-dwarka",
                canManagePrivateStudents: true
            }
        ],
        students: [
            {
                id: "student-aanya",
                name: "Aanya Sharma",
                email: "aanya.sharma@student.ussc",
                classLevel: "XI",
                stream: "PCM",
                schoolId: "school-dps-dwarka",
                counselorId: "counselor-ria",
                interests: ["Engineering", "Design", "Data Science"],
                savedCareers: ["Computer Science Engineer", "UI Designer"],
                savedUniversities: ["ABC Design University"],
                personalNotes: ["Compare B.Tech CSE with Design Technology programs."],
                psychometricStatus: "Not purchased"
            },
            {
                id: "student-kabir",
                name: "Kabir Malhotra",
                email: "kabir@student.ussc",
                classLevel: "XII",
                stream: "Commerce",
                schoolId: "school-dps-dwarka",
                counselorId: "counselor-ria",
                interests: ["Management", "Finance"],
                savedCareers: ["Business Manager"],
                savedUniversities: [],
                personalNotes: [],
                psychometricStatus: "Paid result available"
            }
        ],
        universities: [
            {
                id: "university-abc-design",
                name: "ABC Design University",
                city: "Mumbai",
                website: "https://example.edu",
                overview: "Design, management and creative technology programs.",
                subscription: "Premium Active"
            }
        ],
        programs: [
            {
                id: "program-bdes",
                universityId: "university-abc-design",
                name: "B.Des Product Design",
                level: "UG",
                eligibility: "Class 12 + design aptitude/portfolio",
                fees: "Rs 4.5L/year",
                duration: "4 years"
            }
        ],
        careerFairs: [
            {
                id: "fair-dps-july",
                schoolId: "school-dps-dwarka",
                title: "Career Fair for Classes XI-XII",
                dateTime: "20 July 2026, 10:00 AM",
                location: "School campus",
                targetStudents: "Class XI, XII",
                expectedStudents: "200",
                categories: "Design, Management, Law, Liberal Arts, Study Abroad",
                participationType: "Invitation-based",
                slots: "15",
                status: "Open"
            }
        ],
        fairApplications: [
            {
                id: "fair-app-abc",
                fairId: "fair-dps-july",
                universityId: "university-abc-design",
                message: "We would like to present design and creative technology careers.",
                status: "Pending"
            }
        ],
        workshopRequests: [
            {
                id: "workshop-req-design",
                schoolId: "school-dps-dwarka",
                title: "Design Thinking Workshop",
                classRange: "IX-XII",
                topic: "Design careers, portfolio and entrance exams",
                datePreference: "July 2026",
                mode: "Offline",
                expectedStudents: "100",
                objective: "Career awareness",
                status: "Open for proposals"
            }
        ],
        workshopProposals: [
            {
                id: "proposal-abc-design",
                universityId: "university-abc-design",
                schoolId: "school-dps-dwarka",
                requestId: "workshop-req-design",
                title: "Introduction to Design Careers",
                suitableClasses: "IX-XII",
                duration: "90 minutes",
                mode: "Offline",
                speaker: "Prof. Aditi Rao, Dean of Design",
                outcome: "Career awareness + portfolio guidance",
                status: "Pending"
            }
        ],
        counselorNotes: [
            {
                id: "note-aanya-1",
                studentId: "student-aanya",
                counselorId: "counselor-ria",
                sharedWithStudent: true,
                text: "Aanya is strong in visual problem solving. Discuss UCEED and B.Tech design-tech options.",
                createdAt: "2026-07-01"
            }
        ],
        roadmaps: [
            {
                id: "roadmap-aanya-1",
                studentId: "student-aanya",
                counselorId: "counselor-ria",
                title: "Design + Engineering Exploration",
                steps: ["Complete UCEED research", "Compare CSE and Product Design", "Prepare portfolio folder"],
                status: "In progress"
            }
        ],
        universityRecommendations: [
            {
                id: "rec-aanya-abc",
                studentId: "student-aanya",
                counselorId: "counselor-ria",
                university: "ABC Design University",
                program: "B.Des Product Design",
                reason: "Strong design interest and portfolio potential."
            }
        ],
        followups: [
            {
                id: "follow-aanya",
                studentId: "student-aanya",
                counselorId: "counselor-ria",
                task: "Review portfolio samples with student",
                dueDate: "2026-07-15",
                status: "Pending"
            }
        ],
        broadcasts: [
            {
                id: "broadcast-open-house",
                universityId: "university-abc-design",
                title: "Design Open House",
                dateTime: "28 July 2026, 5:00 PM",
                audience: "Class XI-XII",
                status: "Published"
            }
        ]
    };
}

function getStore() {
    const defaults = getDefaultStore();

    try {
        const stored = JSON.parse(localStorage.getItem(USSC_STORE_KEY) || "null");
        if (stored && stored.schools && stored.students) {
            const normalized = normalizeStore(stored, defaults);
            saveStore(normalized);
            return normalized;
        }
    }
    catch (error) {
        console.error(error);
    }

    saveStore(defaults);
    return defaults;
}

function normalizeStore(stored, defaults) {
    const store = { ...defaults, ...stored };
    const listKeys = [
        "schools",
        "counselors",
        "students",
        "universities",
        "programs",
        "careerFairs",
        "fairApplications",
        "workshopRequests",
        "workshopProposals",
        "counselorNotes",
        "roadmaps",
        "universityRecommendations",
        "followups",
        "broadcasts"
    ];

    listKeys.forEach(key => {
        if (!Array.isArray(store[key])) store[key] = defaults[key] || [];
    });

    ["schools", "counselors", "students", "universities"].forEach(key => {
        if (!store[key].length) store[key] = defaults[key];
    });

    store.schools = store.schools.map(school => {
        const normalized = {
            counselorIds: [],
            subscription: "Premium Active",
            ...school
        };

        normalized.counselorIds = Array.isArray(normalized.counselorIds)
            ? normalized.counselorIds
            : [];

        return normalized;
    });

    store.students = store.students.map(student => {
        const normalized = {
            interests: [],
            savedCareers: [],
            savedUniversities: [],
            personalNotes: [],
            psychometricStatus: "Not purchased",
            ...student
        };

        normalized.interests = Array.isArray(normalized.interests) ? normalized.interests : [];
        normalized.savedCareers = Array.isArray(normalized.savedCareers) ? normalized.savedCareers : [];
        normalized.savedUniversities = Array.isArray(normalized.savedUniversities) ? normalized.savedUniversities : [];
        normalized.personalNotes = Array.isArray(normalized.personalNotes) ? normalized.personalNotes : [];

        return normalized;
    });

    if (!store.schools.some(school => school.id === store.activeSchoolId)) {
        store.activeSchoolId = store.schools[0] ? store.schools[0].id : defaults.activeSchoolId;
    }

    if (!store.counselors.some(counselor => counselor.id === store.activeCounselorId)) {
        store.activeCounselorId = store.counselors[0] ? store.counselors[0].id : defaults.activeCounselorId;
    }

    if (!store.students.some(student => student.id === store.activeStudentId)) {
        store.activeStudentId = store.students[0] ? store.students[0].id : defaults.activeStudentId;
    }

    if (!store.universities.some(university => university.id === store.activeUniversityId)) {
        store.activeUniversityId = store.universities[0] ? store.universities[0].id : defaults.activeUniversityId;
    }

    return store;
}

function saveStore(store) {
    localStorage.setItem(USSC_STORE_KEY, JSON.stringify(store));
}

function renderRole(role, store) {
    const renderers = {
        student: renderStudentWorkspace,
        school: renderSchoolDashboard,
        counselor: renderCounselorDashboard,
        university: renderUniversityDashboard,
        schoolConnect: renderSchoolConnect,
        universityConnect: renderUniversityConnect
    };

    return renderers[role] ? renderers[role](store) : "";
}

function renderStudentWorkspace(store) {
    const student = getActiveStudent(store);
    const school = getSchool(store, student.schoolId);
    const counselor = getCounselor(store, student.counselorId);
    const notes = store.counselorNotes.filter(note => note.studentId === student.id && note.sharedWithStudent);
    const roadmaps = store.roadmaps.filter(roadmap => roadmap.studentId === student.id);

    return `
        ${heroBlock("Student Workspace", "Your free career planning space", "Explore careers, save options, link your school, write personal notes and view counselor-shared roadmaps.", [
            ["Explore Careers", "../careers/index.html", "bi-search"],
            ["Plan After Class 12", "../careers/guide.html?guide=plan-after-class-12", "bi-signpost-split"]
        ], false)}
        ${statsBlock([
            ["Saved Careers", student.savedCareers.length, "bi-bookmark-check"],
            ["Saved Universities", student.savedUniversities.length, "bi-bank"],
            ["Shared Notes", notes.length, "bi-chat-square-text"],
            ["Roadmaps", roadmaps.length, "bi-map"]
        ])}
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>School Link</h2><p>If your school has purchased USSC Connect, link your profile to appear in the school and counselor dashboard.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="link-school">
                    <label>School name</label>
                    <input name="schoolName" value="${escapeAttribute(school ? school.name : "")}" placeholder="Delhi Public School Dwarka" required>
                    <button type="submit">Link School</button>
                </form>
                <article class="suite-card">
                    <div class="suite-card-icon"><i class="bi bi-buildings-fill"></i></div>
                    <h3>${school ? escapeHTML(school.name) : "No school linked"}</h3>
                    <p>${school ? `Linked counselor: ${escapeHTML(counselor ? counselor.name : "Not assigned")}` : "Enter your school name to link your student profile."}</p>
                </article>
            </div>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Student Notes</h2><p>Write your own notes. Counselor-shared notes and roadmaps appear below.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="student-note">
                    <label>Personal note</label>
                    <textarea name="note" rows="4" placeholder="Write what you want to remember..." required></textarea>
                    <button type="submit">Save Note</button>
                </form>
                <div class="suite-list">${renderSimpleList(student.personalNotes, "bi-pencil-square", "No personal notes yet.")}</div>
            </div>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Shared Roadmap & Notes</h2><p>Only notes shared by your counselor are visible here.</p></div></div>
            <div class="suite-grid two">
                ${roadmaps.map(renderRoadmapCard).join("") || emptyCard("No roadmap shared yet.")}
                ${notes.map(note => infoCard("Counselor Note", note.text, "bi-chat-heart")).join("") || emptyCard("No shared notes yet.")}
            </div>
        </section>
    `;
}

function renderSchoolDashboard(store) {
    const school = getSchool(store, store.activeSchoolId);
    const students = getSchoolStudents(store, school.id);
    const counselors = store.counselors.filter(counselor => counselor.schoolId === school.id);
    const fairs = store.careerFairs.filter(fair => fair.schoolId === school.id);
    const requests = store.workshopRequests.filter(request => request.schoolId === school.id);
    const applications = store.fairApplications.filter(app => fairs.some(fair => fair.id === app.fairId));
    const proposals = store.workshopProposals.filter(proposal => proposal.schoolId === school.id);

    return `
        ${heroBlock("Premium School Dashboard", "Institution control centre", "Manage school profile, counselor account, connected students, career fairs, workshop requests, proposals, analytics and billing.", [
            ["Open School Connect", "../school-connect/index.html", "bi-diagram-3-fill"],
            ["Premium Active", "javascript:void(0)", "bi-gem"]
        ], true)}
        ${statsBlock([
            ["Connected Students", students.length, "bi-people-fill"],
            ["Counselor Accounts", counselors.length, "bi-person-workspace"],
            ["Career Fairs", fairs.length, "bi-megaphone-fill"],
            ["Workshop Requests", requests.length, "bi-calendar-event"]
        ])}
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>School Profile & Access</h2><p>Institution-level premium settings.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="school-profile">
                    <label>School name</label><input name="name" value="${escapeAttribute(school.name)}" required>
                    <label>Website</label><input name="website" value="${escapeAttribute(school.website || "")}">
                    <label>Board</label><input name="board" value="${escapeAttribute(school.board || "")}">
                    <label>City</label><input name="city" value="${escapeAttribute(school.city || "")}">
                    <label>Contact person</label><input name="contactPerson" value="${escapeAttribute(school.contactPerson || "")}">
                    <button type="submit">Save School Profile</button>
                </form>
                <form class="suite-form" data-dashboard-form="add-counselor">
                    <label>Included school counselor name</label><input name="name" placeholder="Counselor name" required>
                    <label>Email</label><input name="email" type="email" placeholder="name@school.edu" required>
                    <button type="submit">Add Counselor</button>
                    <p class="form-hint">One counselor account is included with the school premium dashboard.</p>
                </form>
            </div>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Student Management</h2><p>Students linked to ${escapeHTML(school.name)} appear here automatically.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="add-school-student">
                    <label>Student name</label><input name="name" required>
                    <label>Email</label><input name="email" type="email">
                    <label>Class</label><input name="classLevel" placeholder="XI">
                    <label>Stream / interest</label><input name="stream" placeholder="PCM / Commerce / Humanities">
                    <button type="submit">Add Student</button>
                </form>
                <div class="suite-table">${students.map(renderStudentRow).join("") || emptyRow("No students linked yet.")}</div>
            </div>
        </section>
        ${marketplaceForms("school")}
        ${proposalReviewBlock(applications, proposals, store, "school")}
        ${analyticsAndBillingBlock(students, applications, proposals)}
    `;
}

function renderCounselorDashboard(store) {
    const counselor = getCounselor(store, store.activeCounselorId);
    const school = getSchool(store, counselor.schoolId);
    const schoolStudents = counselor.schoolId ? getSchoolStudents(store, counselor.schoolId) : [];
    const privateStudents = store.students.filter(student => student.counselorId === counselor.id && !student.schoolId);
    const students = [...schoolStudents, ...privateStudents];

    return `
        ${heroBlock("Premium Counselor Dashboard", "Unified counseling workspace", "Manage school students and private students, write notes, create roadmaps, recommend universities, generate reports and track follow-ups.", [
            ["Open Career Library", "../careers/index.html", "bi-journal-bookmark"],
            ["Compare Careers", "../careers/guide.html?guide=compare-careers", "bi-columns-gap"]
        ], true)}
        ${statsBlock([
            ["Managed Students", students.length, "bi-people-fill"],
            ["Shared Notes", store.counselorNotes.filter(note => note.counselorId === counselor.id).length, "bi-chat-square-text"],
            ["Roadmaps", store.roadmaps.filter(item => item.counselorId === counselor.id).length, "bi-map"],
            ["Follow-ups", store.followups.filter(item => item.counselorId === counselor.id).length, "bi-calendar-check"]
        ])}
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Linked School</h2><p>School counselors see students from their school automatically.</p></div></div>
            <article class="suite-card"><div class="suite-card-icon"><i class="bi bi-buildings-fill"></i></div><h3>${escapeHTML(school ? school.name : "Independent Counselor")}</h3><p>${school ? `${students.length} school/private students visible in this workspace.` : "Manage private students and counseling notes."}</p></article>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Student Profiles & Notes</h2><p>Add students, write counselling notes, and decide what is shared with the student.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="add-private-student">
                    <label>Private student name</label><input name="name" required>
                    <label>Email</label><input name="email" type="email">
                    <label>Class</label><input name="classLevel" placeholder="XII">
                    <label>Interest</label><input name="stream" placeholder="Design / Medicine / Engineering">
                    <button type="submit">Add Private Student</button>
                </form>
                <form class="suite-form" data-dashboard-form="counselor-note">
                    <label>Student</label>${studentSelect(students)}
                    <label>Session note</label><textarea name="text" rows="4" required></textarea>
                    <label class="inline-check"><input name="sharedWithStudent" type="checkbox" checked> Share with student</label>
                    <button type="submit">Save Counseling Note</button>
                </form>
            </div>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Roadmap, Recommendations & Follow-ups</h2><p>Everything here is stored and appears across the linked student/school views.</p></div></div>
            <div class="suite-grid">
                <form class="suite-form" data-dashboard-form="roadmap">
                    <label>Student</label>${studentSelect(students)}
                    <label>Roadmap title</label><input name="title" required>
                    <label>Steps (comma separated)</label><textarea name="steps" rows="3" placeholder="Research course, Compare colleges, Prepare documents" required></textarea>
                    <button type="submit">Create Roadmap</button>
                </form>
                <form class="suite-form" data-dashboard-form="university-recommendation">
                    <label>Student</label>${studentSelect(students)}
                    <label>University</label><input name="university" required>
                    <label>Program</label><input name="program" required>
                    <label>Reason</label><textarea name="reason" rows="3" required></textarea>
                    <button type="submit">Recommend University</button>
                </form>
                <form class="suite-form" data-dashboard-form="followup">
                    <label>Student</label>${studentSelect(students)}
                    <label>Follow-up task</label><input name="task" required>
                    <label>Due date</label><input name="dueDate" type="date">
                    <button type="submit">Add Follow-up</button>
                </form>
            </div>
        </section>
        ${counselorRecordsBlock(store, counselor.id)}
    `;
}

function renderUniversityDashboard(store) {
    const university = getUniversity(store, store.activeUniversityId);
    const programs = store.programs.filter(program => program.universityId === university.id);
    const applications = store.fairApplications.filter(app => app.universityId === university.id);
    const proposals = store.workshopProposals.filter(proposal => proposal.universityId === university.id);
    const broadcasts = store.broadcasts.filter(broadcast => broadcast.universityId === university.id);

    return `
        ${heroBlock("Premium University Dashboard", "Admissions and outreach workspace", "Manage university profile, programs, admissions details, fair applications, workshop proposals, webinars, broadcasts and proposal tracking.", [
            ["Open University Connect", "../university-connect/index.html", "bi-send-check-fill"],
            ["Premium Active", "javascript:void(0)", "bi-gem"]
        ], true)}
        ${statsBlock([
            ["Programs", programs.length, "bi-mortarboard-fill"],
            ["Fair Applications", applications.length, "bi-megaphone-fill"],
            ["Workshop Proposals", proposals.length, "bi-calendar-event"],
            ["Broadcasts", broadcasts.length, "bi-broadcast"]
        ])}
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>University Profile & Programs</h2><p>Publish programs, eligibility, fees and admissions information.</p></div></div>
            <div class="dashboard-work-grid">
                <form class="suite-form" data-dashboard-form="university-profile">
                    <label>University name</label><input name="name" value="${escapeAttribute(university.name)}" required>
                    <label>Website</label><input name="website" value="${escapeAttribute(university.website || "")}">
                    <label>Location</label><input name="city" value="${escapeAttribute(university.city || "")}">
                    <label>Overview</label><textarea name="overview" rows="3">${escapeHTML(university.overview || "")}</textarea>
                    <button type="submit">Save Profile</button>
                </form>
                <form class="suite-form" data-dashboard-form="program">
                    <label>Program name</label><input name="name" required>
                    <label>Level</label><input name="level" placeholder="UG / PG">
                    <label>Eligibility</label><input name="eligibility">
                    <label>Fees</label><input name="fees">
                    <label>Duration</label><input name="duration">
                    <button type="submit">Add Program</button>
                </form>
            </div>
        </section>
        ${universityActivityBlock(store)}
        ${trackingBlock(applications, proposals, broadcasts, store)}
    `;
}

function renderSchoolConnect(store) {
    const school = getSchool(store, store.activeSchoolId);
    const fairs = store.careerFairs.filter(fair => fair.schoolId === school.id);
    const requests = store.workshopRequests.filter(request => request.schoolId === school.id);
    const applications = store.fairApplications.filter(app => fairs.some(fair => fair.id === app.fairId));
    const proposals = store.workshopProposals.filter(proposal => proposal.schoolId === school.id);

    return `
        ${heroBlock("Premium School Connect", "School-university marketplace", "Post career fair requirements, request workshops, review university applications and approve/reject proposals.", [
            ["Post Career Fair", "#careerFairForm", "bi-megaphone-fill"],
            ["Request Workshop", "#workshopRequestForm", "bi-calendar-plus"]
        ], true)}
        ${statsBlock([
            ["Posted Fairs", fairs.length, "bi-megaphone-fill"],
            ["Fair Applications", applications.length, "bi-send-check"],
            ["Workshop Requests", requests.length, "bi-calendar-event"],
            ["Workshop Proposals", proposals.length, "bi-file-earmark-check"]
        ])}
        ${marketplaceForms("schoolConnect")}
        ${proposalReviewBlock(applications, proposals, store, "schoolConnect")}
    `;
}

function renderUniversityConnect(store) {
    const university = getUniversity(store, store.activeUniversityId);
    const openFairs = store.careerFairs.filter(fair => fair.status === "Open");
    const openRequests = store.workshopRequests.filter(request => request.status.includes("Open"));

    return `
        ${heroBlock("Premium University Connect", "University outreach marketplace", "Apply for school career fairs, send workshop proposals, publish workshop ideas and create paid broadcasts or open houses.", [
            ["Apply to Fairs", "#openFairs", "bi-send-check-fill"],
            ["Create Broadcast", "#broadcastForm", "bi-broadcast"]
        ], true)}
        ${statsBlock([
            ["Open Fairs", openFairs.length, "bi-megaphone-fill"],
            ["Workshop Requests", openRequests.length, "bi-calendar-event"],
            ["Programs", store.programs.filter(program => program.universityId === university.id).length, "bi-mortarboard"],
            ["Broadcasts", store.broadcasts.filter(broadcast => broadcast.universityId === university.id).length, "bi-broadcast"]
        ])}
        ${universityConnectMarketplace(store, openFairs, openRequests)}
    `;
}

function heroBlock(label, title, text, actions, premium) {
    return `
        <section class="suite-hero">
            <div class="suite-hero-card">
                <span class="suite-badge ${premium ? "premium" : ""}"><i class="bi ${premium ? "bi-gem" : "bi-stars"}"></i> ${escapeHTML(label)}</span>
                <h1>${escapeHTML(title)}</h1>
                <p>${escapeHTML(text)}</p>
                <div class="suite-actions">
                    ${actions.map(action => `<a class="suite-btn ${action[0].includes("Premium") ? "secondary" : ""}" href="${escapeAttribute(action[1])}"><i class="bi ${escapeAttribute(action[2])}"></i> ${escapeHTML(action[0])}</a>`).join("")}
                </div>
                ${premium ? '<div class="premium-access-card"><strong><i class="bi bi-lock-fill"></i> Premium area</strong><p>This workspace is available to paid/verified role accounts. The demo stores data locally until backend/Firebase is connected.</p></div>' : ""}
            </div>
            <aside class="suite-panel">
                <h2>Access Logic</h2>
                <div class="suite-timeline">
                    <article><i class="bi bi-person-check"></i><div><strong>Role-based access</strong><span>Students are limited; schools, counselors and universities use premium tools.</span></div></article>
                    <article><i class="bi bi-link-45deg"></i><div><strong>School linkage</strong><span>Students linked to a school appear in that school and school counselor dashboard.</span></div></article>
                    <article><i class="bi bi-database-check"></i><div><strong>Local working data</strong><span>Forms save in browser storage now; Firebase can replace this store later.</span></div></article>
                </div>
            </aside>
        </section>
    `;
}

function statsBlock(stats) {
    return `<section class="suite-stats">${stats.map(stat => `
        <article class="suite-stat"><i class="bi ${escapeAttribute(stat[2])}"></i><strong>${escapeHTML(stat[1])}</strong><span>${escapeHTML(stat[0])}</span></article>
    `).join("")}</section>`;
}

function marketplaceForms(context) {
    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Career Fair Marketplace</h2><p>School posts fair -> universities apply -> school approves/rejects.</p></div></div>
            <form id="careerFairForm" class="suite-form suite-form-wide" data-dashboard-form="career-fair">
                <div class="form-grid">
                    <label>Fair title<input name="title" placeholder="Career Fair for Classes XI-XII" required></label>
                    <label>Date/time<input name="dateTime" placeholder="20 July 2026, 10:00 AM" required></label>
                    <label>Location<input name="location" placeholder="School campus / online"></label>
                    <label>Target students<input name="targetStudents" placeholder="Class XI, XII"></label>
                    <label>Expected students<input name="expectedStudents" placeholder="200"></label>
                    <label>Categories<input name="categories" placeholder="Design, Management, Law"></label>
                    <label>Participation type<input name="participationType" placeholder="Free / paid / invitation-based"></label>
                    <label>University slots<input name="slots" placeholder="10-20"></label>
                </div>
                <button type="submit">Post Career Fair</button>
            </form>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Workshop Marketplace</h2><p>Schools request workshops; universities propose ideas or respond to requests.</p></div></div>
            <form id="workshopRequestForm" class="suite-form suite-form-wide" data-dashboard-form="workshop-request">
                <div class="form-grid">
                    <label>Workshop title<input name="title" placeholder="Design Thinking Workshop" required></label>
                    <label>Class<input name="classRange" placeholder="IX-XII"></label>
                    <label>Topic<input name="topic" placeholder="Design careers / portfolio / entrance exams"></label>
                    <label>Date preference<input name="datePreference" placeholder="July 2026"></label>
                    <label>Mode<input name="mode" placeholder="Offline / online"></label>
                    <label>Expected students<input name="expectedStudents" placeholder="100"></label>
                </div>
                <label>Objective<textarea name="objective" rows="3" placeholder="Career awareness"></textarea></label>
                <button type="submit">Post Workshop Requirement</button>
            </form>
        </section>
    `;
}

function proposalReviewBlock(applications, proposals, store, context) {
    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Proposal Review</h2><p>Approve or reject university applications and workshop proposals.</p></div></div>
            <div class="dashboard-work-grid">
                <div class="suite-table">
                    ${applications.map(app => renderApplicationRow(app, store)).join("") || emptyRow("No fair applications yet.")}
                </div>
                <div class="suite-table">
                    ${proposals.map(proposal => renderProposalRow(proposal, store)).join("") || emptyRow("No workshop proposals yet.")}
                </div>
            </div>
        </section>
    `;
}

function analyticsAndBillingBlock(students, applications, proposals) {
    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Analytics & Billing</h2><p>Premium subscription overview.</p></div></div>
            <div class="suite-grid">
                ${infoCard("Student Interest", `${students.length} linked students across streams and career interests.`, "bi-pie-chart-fill")}
                ${infoCard("Proposal Activity", `${applications.length + proposals.length} fair/workshop proposals tracked.`, "bi-activity")}
                ${infoCard("Subscription", "School Premium Active. Renewal and payment workflow can connect to billing backend.", "bi-credit-card-fill")}
            </div>
        </section>
    `;
}

function counselorRecordsBlock(store, counselorId) {
    const notes = store.counselorNotes.filter(note => note.counselorId === counselorId);
    const roadmaps = store.roadmaps.filter(item => item.counselorId === counselorId);
    const recs = store.universityRecommendations.filter(item => item.counselorId === counselorId);
    const followups = store.followups.filter(item => item.counselorId === counselorId);

    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Counselling Records</h2><p>Notes, roadmaps, recommendations and follow-ups.</p></div></div>
            <div class="suite-grid">
                ${infoCard("Notes", notes.map(note => getStudent(store, note.studentId).name + ": " + note.text).join(" | ") || "No notes yet.", "bi-chat-square-text")}
                ${roadmaps.map(renderRoadmapCard).join("") || emptyCard("No roadmaps yet.")}
                ${infoCard("University Recommendations", recs.map(rec => `${getStudent(store, rec.studentId).name}: ${rec.university} - ${rec.program}`).join(" | ") || "No recommendations yet.", "bi-bank")}
                ${infoCard("Follow-ups", followups.map(item => `${getStudent(store, item.studentId).name}: ${item.task}`).join(" | ") || "No follow-ups yet.", "bi-calendar-check")}
            </div>
        </section>
    `;
}

function universityActivityBlock(store) {
    const university = getUniversity(store, store.activeUniversityId);
    const openFairs = store.careerFairs.filter(fair => fair.status === "Open");
    const openRequests = store.workshopRequests.filter(request => request.status.includes("Open"));

    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Admissions Outreach</h2><p>Apply to fairs, send workshop proposals and publish broadcasts.</p></div></div>
            <div class="suite-grid">
                <form class="suite-form" data-dashboard-form="workshop-proposal">
                    <label>Respond to school request</label>${workshopRequestSelect(openRequests)}
                    <label>Workshop title</label><input name="title" placeholder="Introduction to Design Careers" required>
                    <label>Suitable classes</label><input name="suitableClasses" placeholder="IX-XII">
                    <label>Duration</label><input name="duration" placeholder="60-90 minutes">
                    <label>Mode</label><input name="mode" placeholder="Online / offline">
                    <label>Faculty / speaker</label><input name="speaker">
                    <label>Learning outcome</label><textarea name="outcome" rows="3"></textarea>
                    <button type="submit">Send Workshop Proposal</button>
                </form>
                <form class="suite-form" data-dashboard-form="broadcast">
                    <label>Broadcast title</label><input name="title" placeholder="Open House / Webinar" required>
                    <label>Date/time</label><input name="dateTime" placeholder="28 July 2026, 5 PM">
                    <label>Audience</label><input name="audience" placeholder="Class XI-XII">
                    <button type="submit">Publish Broadcast</button>
                </form>
                <div class="suite-table">
                    ${openFairs.map(fair => `<div class="suite-row"><strong>${escapeHTML(fair.title)}</strong><span>${escapeHTML(getSchool(store, fair.schoolId).name)}</span><span>${escapeHTML(fair.dateTime)}</span><button data-dashboard-action="apply-fair" data-id="${escapeAttribute(fair.id)}">Apply</button></div>`).join("") || emptyRow("No open fairs right now.")}
                </div>
            </div>
        </section>
    `;
}

function trackingBlock(applications, proposals, broadcasts, store) {
    return `
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Proposal Tracking</h2><p>Track accepted, rejected and pending outreach activity.</p></div></div>
            <div class="suite-grid">
                ${infoCard("Fair Applications", applications.map(app => `${getFair(store, app.fairId).title}: ${app.status}`).join(" | ") || "No applications yet.", "bi-megaphone-fill")}
                ${infoCard("Workshop Proposals", proposals.map(proposal => `${proposal.title}: ${proposal.status}`).join(" | ") || "No proposals yet.", "bi-calendar-event")}
                ${infoCard("Broadcast Space", broadcasts.map(item => `${item.title}: ${item.status}`).join(" | ") || "No broadcasts yet.", "bi-broadcast")}
            </div>
        </section>
    `;
}

function universityConnectMarketplace(store, openFairs, openRequests) {
    return `
        <section id="openFairs" class="suite-section">
            <div class="suite-section-head"><div><h2>Open School Career Fairs</h2><p>Universities can apply/register to participate.</p></div></div>
            <div class="suite-table">${openFairs.map(fair => `<div class="suite-row"><strong>${escapeHTML(fair.title)}</strong><span>${escapeHTML(getSchool(store, fair.schoolId).name)}</span><span>${escapeHTML(fair.categories)}</span><button data-dashboard-action="apply-fair" data-id="${escapeAttribute(fair.id)}">Apply</button></div>`).join("") || emptyRow("No open fairs right now.")}</div>
        </section>
        <section class="suite-section">
            <div class="suite-section-head"><div><h2>Open Workshop Requests</h2><p>Send proposals to schools.</p></div></div>
            <div class="suite-grid">
                <form class="suite-form" data-dashboard-form="workshop-proposal">
                    <label>School request</label>${workshopRequestSelect(openRequests)}
                    <label>Workshop title</label><input name="title" required>
                    <label>Suitable classes</label><input name="suitableClasses">
                    <label>Duration</label><input name="duration">
                    <label>Mode</label><input name="mode">
                    <label>Speaker</label><input name="speaker">
                    <label>Learning outcome</label><textarea name="outcome" rows="3"></textarea>
                    <button type="submit">Send Proposal</button>
                </form>
                <form class="suite-form" data-dashboard-form="workshop-idea">
                    <label>University workshop idea</label><input name="title" required>
                    <label>Suitable classes</label><input name="suitableClasses" placeholder="IX-XII">
                    <label>Duration</label><input name="duration" placeholder="60-90 minutes">
                    <label>Mode</label><input name="mode" placeholder="Online / offline">
                    <label>Speaker</label><input name="speaker">
                    <label>Learning outcome</label><textarea name="outcome" rows="3"></textarea>
                    <button type="submit">Publish Workshop Idea</button>
                </form>
                <form id="broadcastForm" class="suite-form" data-dashboard-form="broadcast">
                    <label>Broadcast/webinar title</label><input name="title" required>
                    <label>Date/time</label><input name="dateTime">
                    <label>Audience</label><input name="audience">
                    <button type="submit">Publish Broadcast</button>
                </form>
            </div>
        </section>
    `;
}

function bindDashboardForms(role) {
    document.querySelectorAll("[data-dashboard-form]").forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();
            const store = getStore();
            const values = Object.fromEntries(new FormData(form).entries());
            const type = form.dataset.dashboardForm;
            handleDashboardForm(type, values, store, form);
            saveStore(store);
            showSuiteToast("Saved", "Dashboard data updated successfully.");
            initializeRoleDashboard();
        });
    });
}

function handleDashboardForm(type, values, store, form) {
    const school = getSchool(store, store.activeSchoolId);
    const counselor = getCounselor(store, store.activeCounselorId);
    const university = getUniversity(store, store.activeUniversityId);
    const student = getActiveStudent(store);

    if (type === "link-school") {
        let linkedSchool = store.schools.find(item => item.name.toLowerCase() === values.schoolName.trim().toLowerCase());
        if (!linkedSchool) {
            linkedSchool = {
                id: createId("school"),
                name: values.schoolName.trim(),
                board: "CBSE",
                city: "",
                website: "",
                contactPerson: "",
                subscription: "Premium Pending",
                counselorIds: []
            };
            store.schools.push(linkedSchool);
        }
        student.schoolId = linkedSchool.id;
        const schoolCounselor = store.counselors.find(item => item.schoolId === linkedSchool.id);
        student.counselorId = schoolCounselor ? schoolCounselor.id : "";
    }

    if (type === "student-note") {
        student.personalNotes.push(values.note);
    }

    if (type === "school-profile") {
        Object.assign(school, values);
    }

    if (type === "add-counselor") {
        const newCounselor = {
            id: createId("counselor"),
            name: values.name,
            email: values.email,
            type: "School Counselor",
            schoolId: school.id,
            canManagePrivateStudents: true
        };
        store.counselors.push(newCounselor);
        school.counselorIds.push(newCounselor.id);
    }

    if (type === "add-school-student" || type === "add-private-student") {
        store.students.push({
            id: createId("student"),
            name: values.name,
            email: values.email || "",
            classLevel: values.classLevel || "",
            stream: values.stream || "",
            schoolId: type === "add-school-student" ? school.id : "",
            counselorId: counselor.id,
            interests: values.stream ? [values.stream] : [],
            savedCareers: [],
            savedUniversities: [],
            personalNotes: [],
            psychometricStatus: "Not purchased"
        });
    }

    if (type === "career-fair") {
        store.careerFairs.push({
            id: createId("fair"),
            schoolId: school.id,
            title: values.title,
            dateTime: values.dateTime,
            location: values.location,
            targetStudents: values.targetStudents,
            expectedStudents: values.expectedStudents,
            categories: values.categories,
            participationType: values.participationType,
            slots: values.slots,
            status: "Open"
        });
    }

    if (type === "workshop-request") {
        store.workshopRequests.push({
            id: createId("workshop"),
            schoolId: school.id,
            title: values.title,
            classRange: values.classRange,
            topic: values.topic,
            datePreference: values.datePreference,
            mode: values.mode,
            expectedStudents: values.expectedStudents,
            objective: values.objective,
            status: "Open for proposals"
        });
    }

    if (type === "counselor-note") {
        store.counselorNotes.push({
            id: createId("note"),
            studentId: values.studentId,
            counselorId: counselor.id,
            sharedWithStudent: form.querySelector("[name='sharedWithStudent']").checked,
            text: values.text,
            createdAt: new Date().toISOString().slice(0, 10)
        });
    }

    if (type === "roadmap") {
        store.roadmaps.push({
            id: createId("roadmap"),
            studentId: values.studentId,
            counselorId: counselor.id,
            title: values.title,
            steps: values.steps.split(",").map(step => step.trim()).filter(Boolean),
            status: "In progress"
        });
    }

    if (type === "university-recommendation") {
        store.universityRecommendations.push({
            id: createId("rec"),
            studentId: values.studentId,
            counselorId: counselor.id,
            university: values.university,
            program: values.program,
            reason: values.reason
        });
    }

    if (type === "followup") {
        store.followups.push({
            id: createId("followup"),
            studentId: values.studentId,
            counselorId: counselor.id,
            task: values.task,
            dueDate: values.dueDate || "",
            status: "Pending"
        });
    }

    if (type === "university-profile") {
        Object.assign(university, values);
    }

    if (type === "program") {
        store.programs.push({
            id: createId("program"),
            universityId: university.id,
            name: values.name,
            level: values.level,
            eligibility: values.eligibility,
            fees: values.fees,
            duration: values.duration
        });
    }

    if (type === "workshop-proposal" || type === "workshop-idea") {
        const request = values.requestId ? store.workshopRequests.find(item => item.id === values.requestId) : null;
        store.workshopProposals.push({
            id: createId("proposal"),
            universityId: university.id,
            schoolId: request ? request.schoolId : "",
            requestId: request ? request.id : "",
            title: values.title,
            suitableClasses: values.suitableClasses,
            duration: values.duration,
            mode: values.mode,
            speaker: values.speaker,
            outcome: values.outcome,
            status: request ? "Pending" : "Published idea"
        });
    }

    if (type === "broadcast") {
        store.broadcasts.push({
            id: createId("broadcast"),
            universityId: university.id,
            title: values.title,
            dateTime: values.dateTime,
            audience: values.audience,
            status: "Published"
        });
    }
}

function bindDashboardButtons(role) {
    document.querySelectorAll("[data-dashboard-action]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            const store = getStore();
            const action = button.dataset.dashboardAction;
            const id = button.dataset.id;

            if (action === "apply-fair") {
                const university = getUniversity(store, store.activeUniversityId);
                const exists = store.fairApplications.some(app => app.fairId === id && app.universityId === university.id);
                if (!exists) {
                    store.fairApplications.push({
                        id: createId("fairapp"),
                        fairId: id,
                        universityId: university.id,
                        message: `${university.name} wants to participate.`,
                        status: "Pending"
                    });
                }
            }

            if (action === "approve-application" || action === "reject-application") {
                const app = store.fairApplications.find(item => item.id === id);
                if (app) app.status = action === "approve-application" ? "Approved" : "Rejected";
            }

            if (action === "approve-proposal" || action === "reject-proposal") {
                const proposal = store.workshopProposals.find(item => item.id === id);
                if (proposal) proposal.status = action === "approve-proposal" ? "Accepted" : "Rejected";
            }

            if (action === "mark-fair-full") {
                const fair = store.careerFairs.find(item => item.id === id);
                if (fair) fair.status = "Closed";
            }

            saveStore(store);
            showSuiteToast("Updated", "Status changed successfully.");
            initializeRoleDashboard();
        });
    });
}

function initializeSuiteSearch() {
    document.querySelectorAll("[data-suite-search]").forEach(input => {
        const wrapper = input.closest(".suite-search");
        let button = wrapper ? wrapper.querySelector("[data-suite-search-submit]") : null;

        if (wrapper && !button) {
            button = document.createElement("button");
            button.type = "button";
            button.className = "suite-search-submit";
            button.dataset.suiteSearchSubmit = "true";
            button.setAttribute("aria-label", "Search dashboard");
            button.innerHTML = '<i class="bi bi-arrow-return-left"></i>';
            wrapper.appendChild(button);
        }

        if (input.dataset.suiteSearchBound === "true") {
            runSuiteSearch(input, false);
            return;
        }

        input.dataset.suiteSearchBound = "true";

        input.addEventListener("input", () => runSuiteSearch(input, false));
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                runSuiteSearch(input, true);
            }
        });

        if (button) {
            button.addEventListener("click", event => {
                event.preventDefault();
                input.focus();
                runSuiteSearch(input, true);
            });
        }

        runSuiteSearch(input, false);
    });
}

function runSuiteSearch(input, shouldScroll) {
    const query = input.value.trim().toLowerCase();
    const targets = getSuiteSearchTargets();
    let visibleCount = 0;

    targets.forEach(item => {
        const text = (item.dataset.searchItem || item.textContent || "").toLowerCase();
        const isVisible = !query || text.includes(query);
        item.hidden = !isVisible;

        if (isVisible) visibleCount += 1;
    });

    const empty = ensureSuiteSearchEmpty();
    empty.classList.toggle("show", Boolean(query) && visibleCount === 0);

    if (shouldScroll && query) {
        const target = targets.find(item => !item.hidden) || empty;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function getSuiteSearchTargets() {
    return Array.from(document.querySelectorAll(".suite-card, .suite-row, [data-search-item]"))
        .filter((item, index, all) =>
            all.indexOf(item) === index &&
            !item.closest(".suite-hero") &&
            !item.closest(".suite-sidebar")
        );
}

function ensureSuiteSearchEmpty() {
    let empty = document.getElementById("suiteSearchEmpty");

    if (!empty) {
        empty = document.createElement("div");
        empty.id = "suiteSearchEmpty";
        empty.className = "suite-search-empty";
        empty.textContent = "No matching dashboard records found. Try a student name, program, fair, workshop, exam or task keyword.";

        const firstSection = document.querySelector(".suite-content .suite-section");
        const content = document.querySelector(".suite-content");

        if (firstSection && content) {
            content.insertBefore(empty, firstSection);
        }
        else if (content) {
            content.appendChild(empty);
        }
    }

    return empty;
}

function initializeSuiteTabs() {
    document.querySelectorAll("[data-tab-filter]").forEach(button => {
        button.addEventListener("click", () => {
            const group = button.closest("[data-tab-group]");
            const filter = button.dataset.tabFilter;

            if (!group) return;

            group.querySelectorAll("[data-tab-filter]").forEach(tab => {
                tab.classList.toggle("active", tab === button);
            });

            const target = document.querySelector(group.dataset.tabTarget);

            if (!target) return;

            target.querySelectorAll("[data-category]").forEach(item => {
                item.hidden = filter !== "all" && item.dataset.category !== filter;
            });
        });
    });
}

function initializeSuiteActions() {
    document.querySelectorAll("[data-suite-action]").forEach(action => {
        action.addEventListener("click", event => {
            event.preventDefault();
            showSuiteToast(
                action.dataset.suiteAction,
                action.dataset.suiteMessage || "This premium action is ready for backend connection."
            );
        });
    });
}

function showSuiteToast(title, message) {
    let toast = document.querySelector(".suite-modal-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "suite-modal-toast";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<strong>${escapeHTML(title)}</strong><span>${escapeHTML(message)}</span>`;
    toast.classList.add("show");

    window.clearTimeout(showSuiteToast.timer);
    showSuiteToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function getActiveStudent(store) {
    return getStudent(store, store.activeStudentId) || store.students[0];
}

function getStudent(store, id) {
    return store.students.find(student => student.id === id) || { name: "Student" };
}

function getSchool(store, id) {
    return store.schools.find(school => school.id === id) || null;
}

function getCounselor(store, id) {
    return store.counselors.find(counselor => counselor.id === id) || store.counselors[0];
}

function getUniversity(store, id) {
    return store.universities.find(university => university.id === id) || store.universities[0];
}

function getFair(store, id) {
    return store.careerFairs.find(fair => fair.id === id) || { title: "Career Fair" };
}

function getSchoolStudents(store, schoolId) {
    return store.students.filter(student => student.schoolId === schoolId);
}

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function studentSelect(students) {
    return `<select name="studentId" required>${students.map(student => `<option value="${escapeAttribute(student.id)}">${escapeHTML(student.name)} - ${escapeHTML(student.classLevel || "Student")}</option>`).join("")}</select>`;
}

function workshopRequestSelect(requests) {
    return `<select name="requestId">${requests.map(request => `<option value="${escapeAttribute(request.id)}">${escapeHTML(request.title)}</option>`).join("")}</select>`;
}

function renderStudentRow(student) {
    return `<div class="suite-row" data-search-item="${escapeAttribute([student.name, student.email, student.classLevel, student.stream].join(" "))}"><strong>${escapeHTML(student.name)}</strong><span>${escapeHTML(student.classLevel || "-")}</span><span>${escapeHTML(student.stream || "-")}</span><span class="suite-pill blue">${escapeHTML(student.psychometricStatus || "Not purchased")}</span></div>`;
}

function renderApplicationRow(app, store) {
    const fair = getFair(store, app.fairId);
    const university = getUniversity(store, app.universityId);
    return `<div class="suite-row"><strong>${escapeHTML(university.name)}</strong><span>${escapeHTML(fair.title)}</span><span class="suite-pill ${app.status === "Approved" ? "" : "gold"}">${escapeHTML(app.status)}</span><span><button data-dashboard-action="approve-application" data-id="${escapeAttribute(app.id)}">Approve</button> <button data-dashboard-action="reject-application" data-id="${escapeAttribute(app.id)}">Reject</button></span></div>`;
}

function renderProposalRow(proposal, store) {
    const university = getUniversity(store, proposal.universityId);
    return `<div class="suite-row"><strong>${escapeHTML(proposal.title)}</strong><span>${escapeHTML(university.name)}</span><span class="suite-pill ${proposal.status === "Accepted" ? "" : "gold"}">${escapeHTML(proposal.status)}</span><span><button data-dashboard-action="approve-proposal" data-id="${escapeAttribute(proposal.id)}">Accept</button> <button data-dashboard-action="reject-proposal" data-id="${escapeAttribute(proposal.id)}">Reject</button></span></div>`;
}

function renderRoadmapCard(roadmap) {
    return `<article class="suite-card"><div class="suite-card-icon"><i class="bi bi-map-fill"></i></div><h3>${escapeHTML(roadmap.title)}</h3><p>${roadmap.steps.map(escapeHTML).join(" -> ")}</p><span class="suite-pill blue">${escapeHTML(roadmap.status)}</span></article>`;
}

function renderSimpleList(items, icon, empty) {
    if (!items.length) return emptyCard(empty);
    return items.map(item => infoCard("Note", item, icon)).join("");
}

function infoCard(title, text, icon) {
    return `<article class="suite-card"><div class="suite-card-icon"><i class="bi ${escapeAttribute(icon)}"></i></div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></article>`;
}

function emptyCard(message) {
    return `<article class="suite-card"><div class="suite-card-icon"><i class="bi bi-inbox"></i></div><h3>No data yet</h3><p>${escapeHTML(message)}</p></article>`;
}

function emptyRow(message) {
    return `<div class="suite-row"><strong>${escapeHTML(message)}</strong><span>-</span><span>-</span><span>-</span></div>`;
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
