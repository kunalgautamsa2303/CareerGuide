const fs = require("fs");
const https = require("https");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

const SOURCE_URLS = {
    ugcAutonomousColleges: "https://www.ugc.gov.in/colleges/Autonomous_Colleges_list",
    nmcMbbsColleges: "https://www.nmc.org.in/information-desk/for-students-to-study-in-india/list-of-college-teaching-mbbs/",
    nmcMbbsCollegeApi: "https://www.nmc.org.in/MCIRest/open/getDataFromService?service=getAllUgColleges",
    aicteApprovedInstitutions: "https://www.aicte.gov.in/sites/default/files/approval/2025-26/Groupwise-List%20of%20Institutions_compressed.pdf",
    ugcUniversityDetails: "https://www.ugc.gov.in/universitydetails/university"
};

const writeJSON = (fileName, data) => {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(
        path.join(dataDir, fileName),
        `${JSON.stringify(data, null, 2)}\n`,
        "utf8"
    );
};

const slugify = (value) => String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const titleCase = (value) => String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, letter => letter.toUpperCase())
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOf\b/g, "of")
    .replace(/\bFor\b/g, "for");

const decodeHTML = (value) => String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, "\"")
    .replace(/&rdquo;/g, "\"")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanName = (value) => decodeHTML(value)
    .replace(/^[A-Z]{2}\/\d+\/[A-Z]\/\d+:\s*/i, "")
    .replace(/\s*-\s*\d{3}\s?\d{3}\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();

const cleanWebsite = (value) => {
    const website = String(value || "").trim();
    if (!website || website.toLowerCase() === "n/a") return "";
    if (/^https?:\/\//i.test(website)) return website;
    if (/^[\w.-]+\.[a-z]{2,}/i.test(website)) return `https://${website}`;
    return "";
};

const streamTemplates = {
    Engineering: [
        ["UG", "B.Tech / B.E.", "4 years", "Class 12 PCM; entrance/merit route as notified"],
        ["PG", "M.Tech / M.E.", "2 years", "Relevant bachelor's degree; GATE/institute criteria"],
        ["Doctoral", "Ph.D. Engineering / Technology", "3-6 years", "Relevant master's degree; institute selection"]
    ],
    Science: [
        ["UG", "B.Sc / BS Programs", "3-4 years", "Class 12 with relevant science subjects"],
        ["PG", "M.Sc Programs", "2 years", "Relevant bachelor's degree"],
        ["Doctoral", "Ph.D. Science / Research", "3-6 years", "Relevant master's degree; institute selection"]
    ],
    Medicine: [
        ["UG", "MBBS / Allied Health Programs", "4-5.5 years", "Class 12 PCB; NEET UG or notified route"],
        ["PG", "MD / MS / PG Medical Programs", "3 years", "MBBS or relevant degree; NEET PG/INI-CET where applicable"],
        ["Allied", "Nursing / Pharmacy / Paramedical Programs", "2-4 years", "Class 12 PCB or course-specific eligibility"]
    ],
    Management: [
        ["UG", "BBA / BMS / Integrated Management", "3-5 years", "Class 12; entrance/merit route varies"],
        ["PG", "MBA / PGDM", "2 years", "Graduation; CAT/XAT/GMAT/institute route"],
        ["Executive", "Executive Management Programs", "Variable", "Graduation plus work experience where required"]
    ],
    Law: [
        ["UG", "BA LL.B. / BBA LL.B.", "5 years", "Class 12; CLAT/AILET/state or institute route"],
        ["UG", "LL.B.", "3 years", "Graduation; university/institute route"],
        ["PG", "LL.M.", "1-2 years", "LL.B. degree; entrance/merit route varies"]
    ],
    Design: [
        ["UG", "B.Des / Design Foundation Programs", "4 years", "Class 12; design aptitude/portfolio route"],
        ["PG", "M.Des / Design Specializations", "2 years", "Relevant bachelor's degree; CEED/institute route"],
        ["Diploma", "Design Diploma / Certificate", "Variable", "Course-specific eligibility"]
    ],
    Arts: [
        ["UG", "BA / Liberal Arts Programs", "3-4 years", "Class 12; merit/entrance route varies"],
        ["PG", "MA Programs", "2 years", "Relevant bachelor's degree"],
        ["Doctoral", "Ph.D. Humanities / Social Sciences", "3-6 years", "Relevant master's degree"]
    ],
    Commerce: [
        ["UG", "B.Com / BBA / Economics", "3-4 years", "Class 12; merit/entrance route varies"],
        ["PG", "M.Com / Economics / Finance", "2 years", "Relevant bachelor's degree"],
        ["Professional", "Finance / Accounting Certifications", "Variable", "Course-specific eligibility"]
    ],
    Architecture: [
        ["UG", "B.Arch / B.Planning", "4-5 years", "Class 12 with Mathematics; NATA/JEE Paper 2 where applicable"],
        ["PG", "M.Arch / Planning", "2 years", "Relevant bachelor's degree"],
        ["Doctoral", "Ph.D. Built Environment", "3-6 years", "Relevant master's degree"]
    ],
    Education: [
        ["UG", "Teacher Education / Education Studies", "2-4 years", "Class 12 or graduation depending on program"],
        ["PG", "M.Ed / MA Education", "2 years", "Relevant bachelor's degree"],
        ["Research", "Ph.D. Education", "3-6 years", "Relevant master's degree"]
    ],
    Media: [
        ["UG", "Journalism / Film / Communication Programs", "3-4 years", "Class 12; entrance/portfolio route varies"],
        ["PG", "Mass Communication / Media Studies", "2 years", "Relevant bachelor's degree"],
        ["Diploma", "Film / Media Diploma", "Variable", "Course-specific eligibility"]
    ],
    Pharmacy: [
        ["Diploma", "D.Pharm", "2 years", "Class 12 with Physics, Chemistry and Biology/Mathematics as notified"],
        ["UG", "B.Pharm", "4 years", "Class 12 science; state/university/pharmacy entrance route varies"],
        ["PG", "M.Pharm", "2 years", "B.Pharm; GPAT/institute route where applicable"]
    ],
    Nursing: [
        ["UG", "B.Sc Nursing", "4 years", "Class 12 PCB and English; NEET/state/institute route as notified"],
        ["Diploma", "GNM / Nursing Diploma", "3 years", "Class 12 with required subjects as notified"],
        ["PG", "M.Sc Nursing", "2 years", "B.Sc Nursing or equivalent with required registration/experience"]
    ],
    Dental: [
        ["UG", "BDS", "5 years", "Class 12 PCB and English; NEET UG route"],
        ["PG", "MDS", "3 years", "BDS; NEET MDS route"],
        ["Diploma", "Dental Hygiene / Dental Mechanics", "Variable", "Course-specific eligibility"]
    ],
    Agriculture: [
        ["UG", "B.Sc Agriculture / Allied Agriculture", "4 years", "Class 12 science/agriculture; ICAR/state/university route varies"],
        ["PG", "M.Sc Agriculture / Allied Specializations", "2 years", "Relevant bachelor's degree"],
        ["Doctoral", "Ph.D. Agriculture / Allied Sciences", "3-6 years", "Relevant master's degree"]
    ],
    "Computer Applications": [
        ["UG", "BCA / B.Sc Computer Science", "3-4 years", "Class 12; mathematics/computer criteria vary"],
        ["PG", "MCA / M.Sc Computer Science", "2 years", "Relevant bachelor's degree; NIMCET/university route where applicable"],
        ["Diploma", "Computer Applications Diploma", "Variable", "Course-specific eligibility"]
    ],
    Polytechnic: [
        ["Diploma", "Engineering Diploma", "3 years", "Class 10 or Class 12 as per state technical board rules"],
        ["Lateral Entry", "Diploma to B.Tech Lateral Entry", "3 years", "Diploma with required marks; state/institute route"],
        ["Certificate", "Technical Certificate Programs", "Variable", "Course-specific eligibility"]
    ]
};

const examByStream = {
    Engineering: ["JEE Main", "JEE Advanced", "GATE", "Institute Entrance"],
    Science: ["CUET", "IISER Aptitude Test", "NEST", "Institute Entrance"],
    Medicine: ["NEET UG", "NEET PG", "INI-CET", "Institute Entrance"],
    Management: ["CAT", "XAT", "GMAT", "CMAT", "Institute Entrance"],
    Law: ["CLAT", "AILET", "LSAT India", "Institute Entrance"],
    Design: ["UCEED", "CEED", "NID DAT", "NIFT Entrance", "Institute Entrance"],
    Arts: ["CUET", "University Entrance Tests", "Institute Entrance"],
    Commerce: ["CUET", "CA Foundation", "IPMAT", "Institute Entrance"],
    Architecture: ["NATA", "JEE Main Paper 2", "Institute Entrance"],
    Education: ["CUET", "CTET", "NET/JRF", "University Entrance Tests"],
    Media: ["CUET", "IIMC Entrance", "Institute Entrance"],
    Pharmacy: ["GPAT", "State Pharmacy Entrance", "Institute Entrance"],
    Nursing: ["NEET UG", "AIIMS Nursing", "State Nursing Entrance", "Institute Entrance"],
    Dental: ["NEET UG", "NEET MDS", "Institute Entrance"],
    Agriculture: ["ICAR AIEEA", "CUET", "State Agriculture Entrance", "Institute Entrance"],
    "Computer Applications": ["CUET", "NIMCET", "University Entrance Tests", "Institute Entrance"],
    Polytechnic: ["State Polytechnic Entrance", "Institute Entrance"]
};

const institutions = [
    ["iisc-bengaluru", "Indian Institute of Science", "Deemed University", "Bengaluru", "Karnataka", "https://iisc.ac.in/", "https://iisc.ac.in/admissions/", ["Science", "Engineering"], "Research university known for science, engineering and advanced research."],
    ["iit-madras", "Indian Institute of Technology Madras", "Institute of National Importance", "Chennai", "Tamil Nadu", "https://www.iitm.ac.in/", "https://admissions.iitm.ac.in/", ["Engineering", "Science", "Management"], "IIT known for engineering, technology, research, online degrees and innovation."],
    ["iit-delhi", "Indian Institute of Technology Delhi", "Institute of National Importance", "New Delhi", "Delhi", "https://home.iitd.ac.in/", "https://home.iitd.ac.in/admission.php", ["Engineering", "Science", "Design", "Management"], "IIT offering engineering, sciences, design, management and doctoral programs."],
    ["iit-bombay", "Indian Institute of Technology Bombay", "Institute of National Importance", "Mumbai", "Maharashtra", "https://www.iitb.ac.in/", "https://www.iitb.ac.in/en/education/admissions", ["Engineering", "Science", "Design", "Management"], "IIT with strong engineering, design, science, research and entrepreneurship ecosystem."],
    ["iit-kanpur", "Indian Institute of Technology Kanpur", "Institute of National Importance", "Kanpur", "Uttar Pradesh", "https://www.iitk.ac.in/", "https://www.iitk.ac.in/doaa/admissions", ["Engineering", "Science", "Management"], "IIT known for engineering, sciences, aerospace, computing and research."],
    ["iit-kharagpur", "Indian Institute of Technology Kharagpur", "Institute of National Importance", "Kharagpur", "West Bengal", "https://www.iitkgp.ac.in/", "https://www.iitkgp.ac.in/admission", ["Engineering", "Science", "Law", "Management", "Architecture"], "Large IIT offering engineering, architecture, law, management and research programs."],
    ["iit-roorkee", "Indian Institute of Technology Roorkee", "Institute of National Importance", "Roorkee", "Uttarakhand", "https://www.iitr.ac.in/", "https://www.iitr.ac.in/admissions/", ["Engineering", "Science", "Architecture", "Management"], "Historic IIT with engineering, architecture, sciences and management programs."],
    ["iit-guwahati", "Indian Institute of Technology Guwahati", "Institute of National Importance", "Guwahati", "Assam", "https://www.iitg.ac.in/", "https://www.iitg.ac.in/acad/admission/", ["Engineering", "Science", "Design"], "IIT with engineering, design, science and research programs."],
    ["iit-hyderabad", "Indian Institute of Technology Hyderabad", "Institute of National Importance", "Hyderabad", "Telangana", "https://www.iith.ac.in/", "https://www.iith.ac.in/academics/admissions/", ["Engineering", "Science", "Design"], "IIT known for engineering, technology, design and interdisciplinary research."],
    ["iit-bhu", "Indian Institute of Technology (BHU) Varanasi", "Institute of National Importance", "Varanasi", "Uttar Pradesh", "https://www.iitbhu.ac.in/", "https://www.iitbhu.ac.in/admissions", ["Engineering", "Science"], "IIT in Varanasi offering engineering, sciences and research programs."],
    ["nit-trichy", "National Institute of Technology Tiruchirappalli", "Institute of National Importance", "Tiruchirappalli", "Tamil Nadu", "https://www.nitt.edu/", "https://www.nitt.edu/home/admissions/", ["Engineering", "Science", "Management", "Architecture"], "NIT known for engineering, architecture, science and management programs."],
    ["nit-surathkal", "National Institute of Technology Karnataka Surathkal", "Institute of National Importance", "Surathkal", "Karnataka", "https://www.nitk.ac.in/", "https://www.nitk.ac.in/admissions", ["Engineering", "Science", "Management"], "NIT offering engineering, science, management and research programs."],
    ["nit-warangal", "National Institute of Technology Warangal", "Institute of National Importance", "Warangal", "Telangana", "https://www.nitw.ac.in/", "https://www.nitw.ac.in/admissions", ["Engineering", "Science", "Management"], "NIT with undergraduate, postgraduate and doctoral programs in engineering and sciences."],
    ["iiit-hyderabad", "International Institute of Information Technology Hyderabad", "Deemed University", "Hyderabad", "Telangana", "https://www.iiit.ac.in/", "https://ugadmissions.iiit.ac.in/", ["Engineering", "Science"], "Technology institute focused on computer science, electronics, AI and research."],
    ["iiit-delhi", "Indraprastha Institute of Information Technology Delhi", "State University", "New Delhi", "Delhi", "https://www.iiitd.ac.in/", "https://www.iiitd.ac.in/admission", ["Engineering", "Science"], "Delhi state university focused on computer science, electronics, data and design-linked technology."],
    ["dtu", "Delhi Technological University", "State University", "New Delhi", "Delhi", "https://dtu.ac.in/", "https://dtu.ac.in/Web/Admission/", ["Engineering", "Design", "Management"], "State technical university offering engineering, design, management and research programs."],
    ["nsut", "Netaji Subhas University of Technology", "State University", "New Delhi", "Delhi", "https://www.nsut.ac.in/", "https://www.nsut.ac.in/en/admissions", ["Engineering", "Management"], "Technical university in Delhi offering engineering, management and doctoral programs."],
    ["bits-pilani", "Birla Institute of Technology and Science Pilani", "Deemed University", "Pilani", "Rajasthan", "https://www.bits-pilani.ac.in/", "https://www.bitsadmission.com/", ["Engineering", "Science", "Management"], "Deemed university with Pilani, Goa, Hyderabad and Dubai campuses."],
    ["vit-vellore", "Vellore Institute of Technology", "Deemed University", "Vellore", "Tamil Nadu", "https://vit.ac.in/", "https://viteee.vit.ac.in/", ["Engineering", "Science", "Management", "Design"], "Private deemed university offering engineering, sciences, management and design-linked programs."],
    ["srmist", "SRM Institute of Science and Technology", "Deemed University", "Chennai", "Tamil Nadu", "https://www.srmist.edu.in/", "https://applications.srmist.edu.in/", ["Engineering", "Medicine", "Science", "Management", "Design"], "Deemed university offering engineering, medicine, sciences, management and liberal programs."],
    ["manipal-academy", "Manipal Academy of Higher Education", "Deemed University", "Manipal", "Karnataka", "https://www.manipal.edu/", "https://www.manipal.edu/mu/admission.html", ["Medicine", "Engineering", "Management", "Design", "Arts"], "Deemed university with health sciences, engineering, management, design and humanities programs."],
    ["amity-university", "Amity University", "Private University", "Noida", "Uttar Pradesh", "https://www.amity.edu/", "https://www.amity.edu/admission-procedure.aspx", ["Engineering", "Management", "Law", "Design", "Arts", "Science", "Media"], "Private university group offering multidisciplinary programs across campuses."],
    ["lovely-professional-university", "Lovely Professional University", "Private University", "Phagwara", "Punjab", "https://www.lpu.in/", "https://www.lpu.in/admission/", ["Engineering", "Management", "Law", "Design", "Science", "Arts", "Commerce"], "Private university offering multidisciplinary undergraduate, postgraduate and doctoral programs."],
    ["ashoka-university", "Ashoka University", "Private University", "Sonipat", "Haryana", "https://www.ashoka.edu.in/", "https://www.ashoka.edu.in/admissions/", ["Arts", "Science", "Economics", "Computer Science"], "Private liberal arts and sciences university with interdisciplinary undergraduate and postgraduate programs."],
    ["shiv-nadar-university", "Shiv Nadar University", "Private University", "Greater Noida", "Uttar Pradesh", "https://snu.edu.in/", "https://snu.edu.in/admissions/", ["Engineering", "Science", "Arts", "Management"], "Research-focused private university offering engineering, sciences, humanities and management programs."],
    ["op-jindal-global-university", "O.P. Jindal Global University", "Private University", "Sonipat", "Haryana", "https://jgu.edu.in/", "https://jgu.edu.in/admissions/", ["Law", "Management", "Arts", "International Relations"], "Private university known for law, public policy, international affairs, liberal arts and management."],
    ["university-of-delhi", "University of Delhi", "Central University", "New Delhi", "Delhi", "https://www.du.ac.in/", "https://admission.uod.ac.in/", ["Arts", "Science", "Commerce", "Management", "Law", "Education"], "Central university with colleges offering undergraduate, postgraduate and doctoral programs."],
    ["jnu", "Jawaharlal Nehru University", "Central University", "New Delhi", "Delhi", "https://www.jnu.ac.in/", "https://jnuee.jnu.ac.in/", ["Arts", "Science", "International Relations", "Language"], "Central university known for social sciences, languages, sciences and research."],
    ["bhu", "Banaras Hindu University", "Central University", "Varanasi", "Uttar Pradesh", "https://www.bhu.ac.in/", "https://bhu.ac.in/Site/UnitHomeTemplate/1_3258_6702_Main-Site-Admission", ["Arts", "Science", "Medicine", "Engineering", "Law", "Commerce"], "Central university offering broad programs including arts, sciences, medicine, engineering and law."],
    ["jamia-millia-islamia", "Jamia Millia Islamia", "Central University", "New Delhi", "Delhi", "https://jmi.ac.in/", "https://admission.jmi.ac.in/", ["Arts", "Science", "Engineering", "Law", "Education", "Media"], "Central university offering multidisciplinary education, research and professional programs."],
    ["amu", "Aligarh Muslim University", "Central University", "Aligarh", "Uttar Pradesh", "https://www.amu.ac.in/", "https://amucontrollerexams.com/", ["Arts", "Science", "Medicine", "Engineering", "Law", "Commerce"], "Central university offering arts, sciences, medicine, engineering, law and professional programs."],
    ["university-of-hyderabad", "University of Hyderabad", "Central University", "Hyderabad", "Telangana", "https://uohyd.ac.in/", "https://acad.uohyd.ac.in/", ["Science", "Arts", "Management", "Media"], "Central university known for postgraduate education, research and interdisciplinary programs."],
    ["university-of-calcutta", "University of Calcutta", "State University", "Kolkata", "West Bengal", "https://www.caluniv.ac.in/", "https://www.caluniv.ac.in/admission/Admission.html", ["Arts", "Science", "Commerce", "Law", "Education"], "State university offering undergraduate, postgraduate, research and affiliated-college programs."],
    ["university-of-mumbai", "University of Mumbai", "State University", "Mumbai", "Maharashtra", "https://mu.ac.in/", "https://mu.ac.in/admission", ["Arts", "Science", "Commerce", "Law", "Management"], "State university with a large affiliated college network and broad academic programs."],
    ["university-of-madras", "University of Madras", "State University", "Chennai", "Tamil Nadu", "https://www.unom.ac.in/", "https://www.unom.ac.in/index.php?route=admission/admission", ["Arts", "Science", "Commerce", "Management", "Education"], "State university offering postgraduate, research and affiliated-college programs."],
    ["panjab-university", "Panjab University", "State University", "Chandigarh", "Chandigarh", "https://puchd.ac.in/", "https://admissions.puchd.ac.in/", ["Arts", "Science", "Commerce", "Law", "Management"], "Public university with arts, sciences, law, management and professional programs."],
    ["university-of-rajasthan", "University of Rajasthan", "State University", "Jaipur", "Rajasthan", "https://www.uniraj.ac.in/", "https://www.uniraj.ac.in/index.php?mid=192", ["Arts", "Science", "Commerce", "Law", "Management", "Education"], "State university in Jaipur offering undergraduate, postgraduate, doctoral and affiliated-college programs."],
    ["savitribai-phule-pune-university", "Savitribai Phule Pune University", "State University", "Pune", "Maharashtra", "https://www.unipune.ac.in/", "https://campus.unipune.ac.in/CCEP/Login.aspx", ["Arts", "Science", "Commerce", "Management", "Education"], "State university offering academic and research programs across many departments and affiliated colleges."],
    ["anna-university", "Anna University", "State University", "Chennai", "Tamil Nadu", "https://www.annauniv.edu/", "https://cfa.annauniv.edu/cfa/", ["Engineering", "Architecture", "Science", "Management"], "Technical state university known for engineering, technology, architecture and affiliated colleges."],
    ["osmania-university", "Osmania University", "State University", "Hyderabad", "Telangana", "https://www.osmania.ac.in/", "https://www.osmania.ac.in/admissions.php", ["Arts", "Science", "Commerce", "Law", "Engineering", "Management"], "State university offering multidisciplinary programs and a large affiliated-college ecosystem."],
    ["gujarat-university", "Gujarat University", "State University", "Ahmedabad", "Gujarat", "https://www.gujaratuniversity.ac.in/", "https://oas2023.guadmissions.in/", ["Arts", "Science", "Commerce", "Law", "Management"], "State university offering undergraduate, postgraduate, professional and research programs."],
    ["christ-university", "Christ University", "Deemed University", "Bengaluru", "Karnataka", "https://christuniversity.in/", "https://christuniversity.in/admission-all", ["Arts", "Science", "Commerce", "Management", "Law", "Media"], "Deemed university known for commerce, management, humanities, sciences, law and media programs."],
    ["symbiosis-international", "Symbiosis International", "Deemed University", "Pune", "Maharashtra", "https://siu.edu.in/", "https://siu.edu.in/admissions.php", ["Management", "Law", "Design", "Media", "Arts", "Science"], "Deemed university group offering management, law, design, media, health and liberal programs."],
    ["nmims", "SVKM's Narsee Monjee Institute of Management Studies", "Deemed University", "Mumbai", "Maharashtra", "https://www.nmims.edu/", "https://www.nmims.edu/admissions", ["Management", "Engineering", "Commerce", "Law", "Design"], "Deemed university known for management, commerce, engineering, law and design-linked programs."],
    ["iim-ahmedabad", "Indian Institute of Management Ahmedabad", "Institute of National Importance", "Ahmedabad", "Gujarat", "https://www.iima.ac.in/", "https://www.iima.ac.in/academics/admissions", ["Management"], "IIM known for postgraduate, doctoral and executive management education."],
    ["iim-bangalore", "Indian Institute of Management Bangalore", "Institute of National Importance", "Bengaluru", "Karnataka", "https://www.iimb.ac.in/", "https://www.iimb.ac.in/programmes", ["Management"], "IIM offering management, entrepreneurship, public policy and doctoral programs."],
    ["iim-calcutta", "Indian Institute of Management Calcutta", "Institute of National Importance", "Kolkata", "West Bengal", "https://www.iimcal.ac.in/", "https://www.iimcal.ac.in/programs", ["Management"], "IIM known for management, finance, analytics, doctoral and executive programs."],
    ["xlri", "XLRI Xavier School of Management", "Private Institute", "Jamshedpur", "Jharkhand", "https://xlri.ac.in/", "https://xlri.ac.in/admissions/", ["Management"], "Management institute known for business management, human resources and executive programs."],
    ["aiims-delhi", "All India Institute of Medical Sciences Delhi", "Institute of National Importance", "New Delhi", "Delhi", "https://www.aiims.edu/", "https://www.aiimsexams.ac.in/", ["Medicine", "Science"], "Medical institute offering MBBS, postgraduate, super-specialty, nursing and research programs."],
    ["cmc-vellore", "Christian Medical College Vellore", "Private College", "Vellore", "Tamil Nadu", "https://www.cmch-vellore.edu/", "https://admissions.cmcvellore.ac.in/", ["Medicine"], "Medical college and hospital offering medical, nursing, allied health and postgraduate programs."],
    ["jipmer", "Jawaharlal Institute of Postgraduate Medical Education and Research", "Institute of National Importance", "Puducherry", "Puducherry", "https://jipmer.edu.in/", "https://jipmer.edu.in/academic/admission", ["Medicine"], "Medical institute offering undergraduate, postgraduate, nursing, allied and research programs."],
    ["kgmu", "King George's Medical University", "State University", "Lucknow", "Uttar Pradesh", "https://www.kgmu.org/", "https://www.kgmu.org/admission.php", ["Medicine"], "Medical university offering medical, dental, nursing, paramedical and postgraduate programs."],
    ["nlsiu", "National Law School of India University", "State University", "Bengaluru", "Karnataka", "https://www.nls.ac.in/", "https://www.nls.ac.in/programmes/", ["Law"], "Law university offering integrated law, postgraduate law, public policy and doctoral programs."],
    ["nalsar", "NALSAR University of Law", "State University", "Hyderabad", "Telangana", "https://www.nalsar.ac.in/", "https://www.nalsar.ac.in/admissions", ["Law"], "Law university offering integrated law, postgraduate law, management and doctoral programs."],
    ["nlu-delhi", "National Law University Delhi", "State University", "New Delhi", "Delhi", "https://nludelhi.ac.in/", "https://nationallawuniversitydelhi.in/", ["Law"], "Law university offering undergraduate, postgraduate, doctoral and professional law programs."],
    ["nid-ahmedabad", "National Institute of Design", "Institute of National Importance", "Ahmedabad", "Gujarat", "https://www.nid.edu/", "https://admissions.nid.edu/", ["Design"], "Design institute offering undergraduate and postgraduate design programs."],
    ["nift-delhi", "National Institute of Fashion Technology", "Institute of National Importance", "New Delhi", "Delhi", "https://www.nift.ac.in/", "https://www.nift.ac.in/admission", ["Design"], "Fashion and design institute with programs in fashion, textile, communication and design management."],
    ["spa-delhi", "School of Planning and Architecture Delhi", "Institute of National Importance", "New Delhi", "Delhi", "https://spa.ac.in/", "https://spa.ac.in/User_Panel/UserView.aspx?TypeID=1484", ["Architecture"], "Institute offering architecture, planning, design and built-environment programs."],
    ["cept-university", "CEPT University", "Private University", "Ahmedabad", "Gujarat", "https://cept.ac.in/", "https://cept.ac.in/admissions", ["Architecture", "Design"], "University focused on architecture, planning, design, construction technology and urban studies."],
    ["ftii-pune", "Film and Television Institute of India", "Autonomous Institute", "Pune", "Maharashtra", "https://www.ftii.ac.in/", "https://applyadmission.net/jet2024/", ["Media", "Design"], "Film and television institute offering direction, cinematography, editing, sound, acting and screen studies."],
    ["iiser-pune", "Indian Institute of Science Education and Research Pune", "Institute of National Importance", "Pune", "Maharashtra", "https://www.iiserpune.ac.in/", "https://www.iiseradmission.in/", ["Science"], "Science education and research institute offering BS-MS, integrated PhD and PhD programs."],
    ["tiss", "Tata Institute of Social Sciences", "Deemed University", "Mumbai", "Maharashtra", "https://www.tiss.edu/", "https://admissions.tiss.edu/", ["Arts", "Education", "Management", "Public Policy"], "Deemed university known for social sciences, social work, public policy and development studies."],
    ["ignou", "Indira Gandhi National Open University", "Central University", "New Delhi", "Delhi", "https://www.ignou.ac.in/", "https://ignouadmission.samarth.edu.in/", ["Arts", "Science", "Commerce", "Management", "Education"], "Open university offering distance and online learning programs across disciplines."]
];

const toPrograms = (streams) => streams.flatMap(stream => (streamTemplates[stream] || streamTemplates.Arts)
    .map(([level, name, duration, eligibility]) => ({
        level,
        name,
        stream,
        duration,
        eligibility,
        entranceExams: examByStream[stream] || ["University Entrance Tests"]
    }))
).slice(0, 9);

const inferStreams = (name, fallback = ["Arts", "Science", "Commerce"]) => {
    const text = String(name || "").toLowerCase();
    const streams = new Set();

    if (/engineering|technology|technical|polytechnic|institute of tech|iit|nit/.test(text)) streams.add("Engineering");
    if (/polytechnic|diploma/.test(text)) streams.add("Polytechnic");
    if (/medical|medicine|health|hospital|ayurved|homoeopath|homeopath/.test(text)) streams.add("Medicine");
    if (/dental/.test(text)) streams.add("Dental");
    if (/nursing/.test(text)) streams.add("Nursing");
    if (/pharmacy|pharmaceutical/.test(text)) streams.add("Pharmacy");
    if (/management|business|mba|commerce|account|finance/.test(text)) streams.add("Management");
    if (/commerce|economics/.test(text)) streams.add("Commerce");
    if (/law|legal/.test(text)) streams.add("Law");
    if (/architecture|planning/.test(text)) streams.add("Architecture");
    if (/design|fashion|nift/.test(text)) streams.add("Design");
    if (/media|journalism|communication|film|television/.test(text)) streams.add("Media");
    if (/education|teacher|training|b\.?ed|college of education/.test(text)) streams.add("Education");
    if (/agriculture|veterinary|horticulture|dairy/.test(text)) streams.add("Agriculture");
    if (/computer|information technology|informatics|applications/.test(text)) streams.add("Computer Applications");
    if (/science|arts|degree|college|university/.test(text)) {
        streams.add("Arts");
        streams.add("Science");
    }

    fallback.forEach(stream => {
        if (!streams.size) streams.add(stream);
    });

    return Array.from(streams).slice(0, 7);
};

const getEntranceExams = (streams) => Array.from(new Set(
    streams.flatMap(stream => examByStream[stream] || ["University Entrance Tests"])
));

const getSourceLabels = (record) => ({
    officialWebsiteLabel: record.officialWebsiteLabel || "Official Website",
    admissionsWebsiteLabel: record.admissionsWebsiteLabel || "Admission Page"
});

const createInstitutionRecord = (record) => {
    const streams = Array.from(new Set(record.streams && record.streams.length ? record.streams : inferStreams(record.name)));
    const city = record.city || "India";
    const state = record.state || "India";
    const officialWebsite = record.officialWebsite || record.sourceUrl || SOURCE_URLS.ugcUniversityDetails;
    const admissionsWebsite = record.admissionsWebsite || officialWebsite;
    const labels = getSourceLabels(record);
    const programs = record.programs && record.programs.length ? record.programs : toPrograms(streams);

    return {
        id: record.id || slugify(`${record.name}-${state}`),
        name: record.name,
        type: record.type || "College",
        city,
        district: record.district || "",
        state,
        country: "India",
        address: record.address || "",
        affiliatedTo: record.affiliatedTo || "",
        management: record.management || "",
        officialWebsite,
        admissionsWebsite,
        officialWebsiteLabel: labels.officialWebsiteLabel,
        admissionsWebsiteLabel: labels.admissionsWebsiteLabel,
        source: record.source || "Official institution website and public higher-education references",
        sourceUrl: record.sourceUrl || officialWebsite,
        sourceCategory: record.sourceCategory || "Curated",
        verificationStatus: record.verificationStatus || "Official link added",
        summary: record.summary || `${record.name} is listed in official/public higher-education references for ${streams.join(", ")} programs.`,
        highlights: record.highlights || [
            `${record.type || "Institution"} located in ${city}, ${state}`,
            `Known streams: ${streams.join(", ")}`,
            "Students should verify current admission dates, fees and eligibility on the official source before applying."
        ],
        streams,
        entranceExams: record.entranceExams || getEntranceExams(streams),
        programs,
        scholarships: record.scholarships || "Scholarships, fee waivers or financial aid may be available as per official institutional rules.",
        hostel: record.hostel || "Hostel/campus facilities vary by campus and program. Check the official website or official regulator source for latest details.",
        placement: record.placement || "Placement and internship details vary by department and program. Check official placement/admission pages.",
        metadata: record.metadata || {},
        lastReviewed: "2026-07-02"
    };
};

const curatedInstitutions = institutions.map(([id, name, type, city, state, officialWebsite, admissionsWebsite, streams, summary]) => createInstitutionRecord({
    id,
    name,
    type,
    city,
    state,
    officialWebsite,
    admissionsWebsite,
    officialWebsiteLabel: "Official Website",
    admissionsWebsiteLabel: "Admission Page",
    source: "Official institution website and public higher-education references",
    sourceUrl: officialWebsite,
    verificationStatus: "Official institution/admission link added",
    streams,
    summary
}));

const fetchText = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} failed with ${response.status}`);
    return response.text();
};

const fetchJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} failed with ${response.status}`);
    return response.json();
};

const fetchJSONWithCertificateFallback = async (url) => {
    try {
        return await fetchJSON(url);
    } catch (error) {
        if (!/nmc\.org\.in/i.test(url)) throw error;
        const text = await new Promise((resolve, reject) => {
            https.get(url, { rejectUnauthorized: false }, response => {
                let body = "";
                response.setEncoding("utf8");
                response.on("data", chunk => {
                    body += chunk;
                });
                response.on("end", () => {
                    if (response.statusCode >= 200 && response.statusCode < 300) {
                        resolve(body);
                    } else {
                        reject(new Error(`${url} failed with ${response.statusCode}`));
                    }
                });
            }).on("error", reject);
        });
        return JSON.parse(text);
    }
};

const parseRows = (html) => Array.from(html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi))
    .map(row => Array.from(row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(cell => decodeHTML(cell[1])))
    .filter(cells => cells.length);

const getCollegeNameAndCity = (collegeText) => {
    const cleaned = cleanName(collegeText);
    const parts = cleaned.split(",").map(part => part.trim()).filter(Boolean);
    const name = parts[0] || cleaned;
    const cityPart = parts.slice(1).find(part => /[a-z]/i.test(part)) || "";
    const city = cityPart
        .replace(/\b\d{3}\s?\d{3}\b/g, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/dist\.?|district|dt\.?/ig, "")
        .replace(/[-–]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return {
        name,
        address: cleaned,
        city: city ? titleCase(city) : "India"
    };
};

const importUgcAutonomousColleges = async () => {
    const html = await fetchText(SOURCE_URLS.ugcAutonomousColleges);
    return parseRows(html)
        .filter(cells => cells.length >= 6 && /^\d+$/.test(cells[0]))
        .map(cells => {
            const [, rawState, rawCollege, firstGiven, validUpto, affiliatedTo] = cells;
            const parsed = getCollegeNameAndCity(rawCollege);
            const state = titleCase(rawState);
            const streams = inferStreams(parsed.name);

            return createInstitutionRecord({
                id: `ugc-autonomous-${slugify(`${parsed.name}-${state}`)}`,
                name: parsed.name,
                type: "Autonomous College",
                city: parsed.city,
                state,
                address: parsed.address,
                affiliatedTo,
                officialWebsite: SOURCE_URLS.ugcAutonomousColleges,
                admissionsWebsite: SOURCE_URLS.ugcAutonomousColleges,
                officialWebsiteLabel: "UGC Source",
                admissionsWebsiteLabel: "Autonomy Record",
                source: "University Grants Commission autonomous colleges list",
                sourceUrl: SOURCE_URLS.ugcAutonomousColleges,
                sourceCategory: "UGC Autonomous Colleges",
                verificationStatus: "Listed by UGC as an autonomous college",
                streams,
                summary: `${parsed.name} is listed by UGC as an autonomous college${affiliatedTo ? ` affiliated to ${affiliatedTo}` : ""}. Students should verify course-specific admission details on the college or affiliating university website.`,
                highlights: [
                    `UGC-listed autonomous college in ${state}`,
                    affiliatedTo ? `Affiliated to ${affiliatedTo}` : "Affiliation details available in UGC record",
                    validUpto ? `Autonomy validity in UGC record: ${validUpto}` : "Autonomy validity should be checked on the UGC record"
                ],
                metadata: {
                    autonomyFirstGiven: firstGiven,
                    autonomyValidUpto: validUpto,
                    affiliatedTo
                }
            });
        });
};

const getMedicalCollegeType = (management) => {
    const text = String(management || "").toLowerCase();
    if (/private|trust|society|self/.test(text)) return "Private Medical College";
    if (/gov|government|state|central|municipal/.test(text)) return "Government Medical College";
    return "Medical College";
};

const importNmcMedicalColleges = async () => {
    const data = await fetchJSONWithCertificateFallback(SOURCE_URLS.nmcMbbsCollegeApi);
    const rows = Array.isArray(data.ugCollege) ? data.ugCollege : [];

    return rows
        .filter(row => row && row.collegeName && row.type)
        .map(row => {
            const website = cleanWebsite(row.website);
            const name = cleanName(row.collegeName);
            const state = titleCase(row.stateName || row.state || "");
            const type = getMedicalCollegeType(row.managementupdate || row.management);
            const seats = row.ugApproved ? String(row.ugApproved) : "";

            return createInstitutionRecord({
                id: `nmc-mbbs-${slugify(`${name}-${state}`)}`,
                name,
                type,
                city: titleCase(row.city || state || "India"),
                state,
                address: decodeHTML(row.address || ""),
                affiliatedTo: row.universityName || "",
                management: row.managementupdate || row.management || "",
                officialWebsite: website || SOURCE_URLS.nmcMbbsColleges,
                admissionsWebsite: website || SOURCE_URLS.nmcMbbsColleges,
                officialWebsiteLabel: website ? "Official Website" : "NMC Source",
                admissionsWebsiteLabel: website ? "College Website" : "NMC MBBS Record",
                source: "National Medical Commission list of colleges teaching MBBS",
                sourceUrl: SOURCE_URLS.nmcMbbsColleges,
                sourceCategory: "NMC MBBS Colleges",
                verificationStatus: "Listed by NMC for MBBS",
                streams: ["Medicine"],
                entranceExams: ["NEET UG", "NEET PG", "INI-CET", "Institute Entrance"],
                programs: [{
                    level: "UG",
                    name: "MBBS",
                    stream: "Medicine",
                    duration: "5.5 years including internship",
                    eligibility: "Class 12 PCB and English; NEET UG qualification and counselling as per current rules",
                    entranceExams: ["NEET UG"],
                    seats
                }],
                summary: `${name} is listed by the National Medical Commission for MBBS education${row.universityName ? ` under ${row.universityName}` : ""}. Students should confirm current recognition, seats and counselling details from NMC and official admission portals.`,
                highlights: [
                    `${type} in ${titleCase(row.city || state || "India")}, ${state}`,
                    row.universityName ? `University: ${row.universityName}` : "University details available in NMC record",
                    seats ? `Annual MBBS intake shown by NMC: ${seats}` : "Seat intake should be verified on NMC"
                ],
                metadata: {
                    nmcCollegeId: row.collegeId,
                    nmcCode: String(row.collegeName || "").split(":")[0],
                    yearOfInspection: row.yearOfInc || "",
                    annualIntakeSeats: seats,
                    recognitionStatus: row.statusText || ""
                }
            });
        });
};

const mergeInstitutions = (groups) => {
    const merged = [];
    const seen = new Set();

    groups.flat().forEach(institution => {
        const key = slugify(`${institution.name}-${institution.state}`);
        if (seen.has(key)) return;
        seen.add(key);
        merged.push(institution);
    });

    return merged.sort((first, second) => {
        const stateCompare = first.state.localeCompare(second.state);
        if (stateCompare !== 0) return stateCompare;
        return first.name.localeCompare(second.name);
    });
};

const build = async () => {
    const sourceGroups = [curatedInstitutions];

    try {
        const ugcAutonomousColleges = await importUgcAutonomousColleges();
        sourceGroups.push(ugcAutonomousColleges);
        console.log(`Imported UGC autonomous colleges: ${ugcAutonomousColleges.length}`);
    } catch (error) {
        console.warn(`UGC autonomous import skipped: ${error.message}`);
    }

    try {
        const nmcMedicalColleges = await importNmcMedicalColleges();
        sourceGroups.push(nmcMedicalColleges);
        console.log(`Imported NMC MBBS colleges: ${nmcMedicalColleges.length}`);
    } catch (error) {
        console.warn(`NMC MBBS import skipped: ${error.message}`);
    }

    const universities = mergeInstitutions(sourceGroups);
    const sources = [
        {
            name: "Curated official institution links",
            url: "Multiple official institution websites",
            status: "Seeded"
        },
        {
            name: "UGC Autonomous Colleges",
            url: SOURCE_URLS.ugcAutonomousColleges,
            status: "Imported"
        },
        {
            name: "NMC MBBS Colleges",
            url: SOURCE_URLS.nmcMbbsColleges,
            status: "Imported"
        },
        {
            name: "AICTE Approved Institutions 2025-26",
            url: SOURCE_URLS.aicteApprovedInstitutions,
            status: "Next bulk import source"
        },
        {
            name: "AISHE Institutional Directory",
            url: "https://aishe.gov.in/",
            status: "Next bulk import source"
        }
    ];

    writeJSON("universities.json", {
        generatedAt: "2026-07-02",
        coverageNote: "This directory is built from official/public sources. Regulator records may provide an official source link even when a college's own website is not present in the source data.",
        sources,
        universities
    });

    console.log(`University directory data written: ${universities.length} institutions.`);
};

build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
