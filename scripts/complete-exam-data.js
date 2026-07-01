const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

const readJSON = (fileName) => {
    const filePath = path.join(dataDir, fileName);
    const text = fs.readFileSync(filePath, "utf8").trim();
    return text ? JSON.parse(text) : {};
};

const writeJSON = (fileName, data) => {
    fs.writeFileSync(
        path.join(dataDir, fileName),
        `${JSON.stringify(data, null, 2)}\n`,
        "utf8"
    );
};

const slugify = (value) => value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const domainLabels = {
    engineering: "Engineering",
    medicine: "Medicine & Healthcare",
    design: "Design",
    law: "Law",
    management: "Management",
    "commerce-finance": "Commerce & Finance",
    psychology: "Psychology",
    "ai-data-science": "AI & Data Science",
    "media-communication": "Media & Communication",
    architecture: "Architecture",
    education: "Education",
    sports: "Sports"
};

const templates = {
    engineering: {
        overview: "Engineering entrance pathway used for admission into technology, engineering and applied science programs.",
        eligibility: "Usually Class 12 with Physics, Chemistry and Mathematics. Exact criteria vary by exam and institution.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Physics", "Chemistry", "Mathematics", "Aptitude", "Problem Solving"],
        pattern: "Objective questions, aptitude-based sections or institute-specific format depending on the exam.",
        acceptedBy: ["Engineering colleges", "Technology institutes", "Private universities", "Participating state and national institutions"],
        admissionOptions: ["B.Tech / B.E. programs", "Integrated engineering programs", "Architecture or planning pathways where applicable", "Engineering institute counselling based on rank"]
    },
    medicine: {
        overview: "Medical and healthcare entrance pathway used for admission into clinical, dental, allied health or postgraduate medical programs.",
        eligibility: "Usually Class 12 with Physics, Chemistry and Biology for undergraduate healthcare courses. PG exams require a relevant medical degree.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Biology", "Chemistry", "Physics", "Clinical Knowledge", "Aptitude"],
        pattern: "Objective questions based on science, medical knowledge or institute-specific requirements.",
        acceptedBy: ["Medical colleges", "Dental colleges", "Allied healthcare institutes", "Participating universities"],
        admissionOptions: ["MBBS / BDS where applicable", "Nursing or allied health programs where applicable", "MD / MS / MDS for postgraduate exams", "Counselling or recruitment routes notified by the official body"]
    },
    design: {
        overview: "Design entrance pathway used for admission into design, fashion, communication, product and creative programs.",
        eligibility: "Usually Class 12 in any stream for undergraduate programs. Portfolio or creative aptitude may be required.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Design Aptitude", "Drawing", "Visualization", "Creativity", "General Awareness"],
        pattern: "Creative aptitude tests, drawing tasks, portfolio review or studio tests depending on the institute.",
        acceptedBy: ["Design institutes", "Fashion institutes", "Creative universities", "Participating private colleges"],
        admissionOptions: ["B.Des programs", "M.Des programs", "Fashion/design/communication programs", "Portfolio or studio-test based admission where applicable"]
    },
    law: {
        overview: "Law entrance pathway used for admission into integrated law degrees, LL.B. programs and legal education institutions.",
        eligibility: "Class 12 for integrated law programs or graduation for 3-year LL.B. programs, depending on the exam.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Legal Reasoning", "English", "Logical Reasoning", "Current Affairs", "Quantitative Aptitude"],
        pattern: "Objective questions testing legal aptitude, reasoning, language and general awareness.",
        acceptedBy: ["National Law Universities", "Law schools", "Private universities", "State law colleges"],
        admissionOptions: ["5-year integrated law programs", "LL.B. programs where applicable", "LL.M. programs where applicable", "Law university counselling based on rank"]
    },
    management: {
        overview: "Management entrance pathway used for admission into BBA, integrated management, MBA and PGDM programs.",
        eligibility: "Class 12 for undergraduate management programs; graduation for MBA/PGDM exams.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Quantitative Aptitude", "Verbal Ability", "Logical Reasoning", "Data Interpretation", "Business Awareness"],
        pattern: "Computer-based objective tests with aptitude, reasoning, language and data interpretation sections.",
        acceptedBy: ["Business schools", "IIMs", "Private universities", "Management institutes"],
        admissionOptions: ["MBA / PGDM programs", "BBA or integrated management programs where applicable", "Business analytics or management-specialization programs", "Institute selection through test score, interview and profile"]
    },
    finance: {
        overview: "Commerce, finance or professional certification pathway used for accounting, banking, markets and advisory careers.",
        eligibility: "Class 12, graduation or professional-course eligibility depending on the exam or certification.",
        level: "Foundation / intermediate / professional depending on the credential",
        subjects: ["Accounting", "Business Law", "Economics", "Finance", "Quantitative Aptitude"],
        pattern: "Professional papers, objective tests or certification modules depending on the body conducting the exam.",
        acceptedBy: ["Professional bodies", "Banks", "Financial institutions", "Accounting firms", "Corporate finance teams"],
        admissionOptions: ["Professional certification route", "Accounting, finance or banking careers", "Intermediate/professional levels after foundation where applicable", "Recruitment or licensing pathways where applicable"]
    },
    general: {
        overview: "General entrance pathway used by universities or institutes for admission into one or more academic programs.",
        eligibility: "Eligibility varies by course, level and institution. Students should check the official notification before applying.",
        level: "Undergraduate / postgraduate / certification depending on the exam",
        subjects: ["Aptitude", "Subject Knowledge", "Language", "Reasoning", "General Awareness"],
        pattern: "Exam pattern varies by the conducting body and selected course.",
        acceptedBy: ["Participating universities", "Private institutes", "Government institutions", "Professional programs"],
        admissionOptions: ["Undergraduate programs in participating universities", "Postgraduate programs where applicable", "Course-specific university admission", "Institute counselling or merit-list based admission"]
    },
    education: {
        overview: "Education entrance or eligibility pathway used for teaching, teacher training, research and academic careers.",
        eligibility: "Eligibility depends on teaching level and program. Graduation, teacher training or postgraduate study may be required.",
        level: "Eligibility / undergraduate / postgraduate depending on the exam",
        subjects: ["Teaching Aptitude", "Child Development", "Subject Knowledge", "Pedagogy", "Reasoning"],
        pattern: "Objective or subject-based assessment depending on the teaching level and conducting body.",
        acceptedBy: ["Schools", "Teacher education colleges", "Universities", "Research institutions"],
        admissionOptions: ["Teacher eligibility route", "B.Ed / teacher training pathways where applicable", "Research eligibility or JRF where applicable", "School teaching recruitment eligibility"]
    },
    sports: {
        overview: "Sports entrance, trial or physical test pathway used for sports science, physical education, coaching and athlete development careers.",
        eligibility: "Eligibility may include Class 12, fitness standards, sports achievements or practical trials depending on the program.",
        level: "Undergraduate / certification / trials depending on the pathway",
        subjects: ["Physical Fitness", "Sports Knowledge", "Practical Skill", "Aptitude", "Interview"],
        pattern: "Physical tests, trials, practical assessment, written tests or interviews depending on the institution.",
        acceptedBy: ["Sports institutes", "Physical education colleges", "Sports academies", "Universities"],
        admissionOptions: ["Physical education programs", "Sports science or coaching programs", "Sports quota/trials where applicable", "Academy or university selection pathways"]
    },
    media: {
        overview: "Media and communication entrance pathway used for journalism, film, public relations and digital media programs.",
        eligibility: "Usually Class 12 for undergraduate programs and graduation for postgraduate media programs.",
        level: "Undergraduate / postgraduate depending on the exam",
        subjects: ["Media Awareness", "Writing", "Language", "General Knowledge", "Creativity"],
        pattern: "Aptitude test, writing task, interview, portfolio or institute-specific assessment.",
        acceptedBy: ["Media institutes", "Film schools", "Communication schools", "Participating universities"],
        admissionOptions: ["Journalism and mass communication programs", "Film/TV/radio/media diploma programs", "Advertising, PR or digital media pathways", "Institute interview or portfolio selection where applicable"]
    }
};

const officialWebsites = {
    "AIIMS B.Sc Nursing": "https://www.aiimsexams.ac.in/",
    "AIIMS Exams": "https://www.aiimsexams.ac.in/",
    "AIIMS M.Sc Nursing": "https://www.aiimsexams.ac.in/",
    AILET: "https://nationallawuniversitydelhi.in/",
    "Bank Exams": "https://www.ibps.in/",
    BITSAT: "https://www.bitsadmission.com/",
    "CA Foundation": "https://www.icai.org/",
    CAT: "https://iimcat.ac.in/",
    CEED: "https://www.ceed.iitb.ac.in/",
    "CEPT Admissions": "https://admissions.cept.ac.in/",
    CFA: "https://www.cfainstitute.org/programs/cfa-program",
    CLAT: "https://consortiumofnlus.ac.in/",
    "CMA Foundation": "https://icmai.in/",
    CMAT: "https://exams.nta.ac.in/CMAT/",
    CPA: "https://nasba.org/",
    "CS Executive Entrance": "https://www.icsi.edu/",
    CTET: "https://ctet.nic.in/",
    CUET: "https://cuet.nta.nic.in/",
    FRM: "https://www.garp.org/frm",
    FTII: "https://www.ftii.ac.in/p/admission",
    "GATE for PG": "https://gate2026.iitg.ac.in/",
    "GATE Psychology (selected programs)": "https://gate2026.iitg.ac.in/",
    "ICAR AIEEA": "https://icar.nta.nic.in/",
    "IIMC Entrance": "https://iimc.gov.in/",
    "INI CET": "https://www.aiimsexams.ac.in/",
    "INI-CET": "https://www.aiimsexams.ac.in/",
    "INI-SS": "https://www.aiimsexams.ac.in/",
    "Institute Specific": "https://cbsecareerguidance.in/",
    "Institute Specific Admissions": "https://cbsecareerguidance.in/",
    IPMAT: "https://www.iimidr.ac.in/",
    "JEE Advanced": "https://jeeadv.ac.in/",
    "JEE Main": "https://jeemain.nta.nic.in/",
    "JEE Paper 2": "https://jeemain.nta.nic.in/",
    "LSAT India": "https://www.lsatindia.in/",
    MAT: "https://mat.aima.in/",
    "MH CET Law": "https://cetcell.mahacet.org/",
    "MITID DAT": "https://www.mitid.edu.in/admissions/",
    NATA: "https://www.nata.in/",
    NEET: "https://neet.nta.nic.in/",
    "NEET PG": "https://natboard.edu.in/",
    "NEET UG": "https://neet.nta.nic.in/",
    "NET/JRF": "https://ugcnet.nta.nic.in/",
    "NID DAT": "https://admissions.nid.edu/",
    "NIFT Entrance": "https://www.nift.ac.in/admission",
    "NISM Certifications": "https://www.nism.ac.in/certification/",
    NMAT: "https://www.mba.com/exams/nmat",
    NORCET: "https://www.aiimsexams.ac.in/",
    "Physical Education Tests": "https://www.lnipe.edu.in/",
    "Private Design Tests": "https://cbsecareerguidance.in/",
    SLAT: "https://www.set-test.org/slat.html",
    SNAP: "https://www.snaptest.org/",
    "Sports Trials": "https://sportsauthorityofindia.nic.in/",
    SRFTI: "https://srfti.ac.in/admission/",
    SRMJEEE: "https://www.srmist.edu.in/admission-india/",
    "State Law Entrance Tests": "https://cbsecareerguidance.in/",
    TET: "https://ctet.nic.in/",
    UCEED: "https://www.uceed.iitb.ac.in/",
    "University Entrance Exams": "https://cuet.nta.nic.in/",
    "University Entrance Tests": "https://cuet.nta.nic.in/",
    VITEEE: "https://viteee.vit.ac.in/",
    XAT: "https://xatonline.in/",
    "XIC OET": "https://www.xaviercomm.org/"
};

const overrides = {
    "JEE Main": {
        category: "engineering",
        fullName: "Joint Entrance Examination Main",
        level: "Undergraduate",
        mode: "Computer-based test",
        frequency: "Usually conducted in multiple sessions as notified by NTA",
        overview: "JEE Main is the national engineering entrance examination conducted by the National Testing Agency for admission to NITs, IIITs, Centrally Funded Technical Institutions and other participating institutions. It is also the qualifying examination for JEE Advanced.",
        eligibility: "Students should have passed or be appearing in Class 12 or equivalent with Physics, Mathematics and the required additional subjects as per the latest information bulletin. Candidates must also satisfy year-of-appearance and institute-specific admission rules.",
        syllabus: ["Physics", "Chemistry", "Mathematics", "Numerical problem solving", "Aptitude and drawing/planning for Paper 2 pathways"],
        examPattern: "JEE Main is conducted as a computer-based test for B.E./B.Tech admissions. Questions are primarily objective and numerical-answer type from Physics, Chemistry and Mathematics. Paper 2 pathways for architecture/planning include aptitude, mathematics and drawing or planning components as notified.",
        acceptedBy: ["NITs", "IIITs", "CFTIs", "State engineering colleges", "Participating private universities"],
        admissionOptions: [
            "B.Tech / B.E. programs in engineering branches such as Computer Science, Mechanical, Civil, Electrical, Electronics, Chemical and related fields",
            "NITs, IIITs, CFTIs and participating engineering institutes through JoSAA/CSAB or institute/state counselling",
            "JEE Advanced eligibility route for admission to IIT B.Tech programs",
            "B.Arch and B.Planning routes through JEE Main Paper 2 where applicable",
            "Private and state universities that accept JEE Main rank or score"
        ],
        applicationProcess: [
            "Read the latest NTA JEE Main information bulletin.",
            "Register online, choose paper/session and complete the application form.",
            "Upload documents, pay the fee and download the admit card.",
            "Appear for the exam and check score/rank after results.",
            "Use the rank for JoSAA, CSAB, state or institute counselling as applicable."
        ],
        preparationTips: [
            "Build NCERT-level clarity first, then practice higher-level JEE questions.",
            "Keep separate formula and mistake notebooks for Physics, Chemistry and Mathematics.",
            "Solve previous years' JEE Main papers under timed conditions.",
            "Practice numerical-answer questions carefully because calculation errors cost marks.",
            "Revise weak chapters weekly instead of waiting for the final month."
        ]
    },
    "JEE Advanced": {
        category: "engineering",
        fullName: "Joint Entrance Examination Advanced",
        level: "Undergraduate",
        mode: "Computer-based test",
        frequency: "Usually once a year",
        overview: "JEE Advanced is the entrance examination for undergraduate admission to the Indian Institutes of Technology. Only eligible candidates who qualify JEE Main within the required rank criteria can appear for it.",
        eligibility: "Candidates must qualify JEE Main and meet the latest JEE Advanced eligibility rules, including performance category, age, number of attempts and Class 12 appearance requirements.",
        syllabus: ["Physics", "Chemistry", "Mathematics", "Advanced problem solving", "Multi-concept application"],
        examPattern: "The exam is computer-based and usually includes two compulsory papers. Question formats can include single correct, multiple correct, numerical and comprehension-style problems, with marking schemes announced in the exam instructions.",
        acceptedBy: ["Indian Institutes of Technology", "Selected institutes using JEE Advanced scores"],
        admissionOptions: [
            "IIT B.Tech programs across engineering branches such as Computer Science, Electrical, Mechanical, Civil, Chemical, Aerospace, Metallurgy and related disciplines",
            "Integrated M.Tech or dual-degree programs at IITs where offered",
            "B.S. or integrated science programs at IITs where offered",
            "Architecture admission at IITs through architecture-specific process where applicable",
            "Seat allotment through JoSAA based on rank, category, choices and seat availability"
        ],
        preparationTips: [
            "Move beyond formula use and practice multi-step conceptual problems.",
            "Analyze every mock test for topic-level weaknesses.",
            "Revise inorganic and organic chemistry regularly to avoid memory gaps.",
            "Practice mixed-topic papers to improve decision-making during the exam.",
            "Read marking instructions carefully because negative marking can vary by section."
        ]
    },
    BITSAT: { category: "engineering", fullName: "BITS Admission Test", level: "Undergraduate", mode: "Computer-based test" },
    VITEEE: { category: "engineering", fullName: "VIT Engineering Entrance Examination", level: "Undergraduate", mode: "Computer-based test" },
    SRMJEEE: { category: "engineering", fullName: "SRM Joint Engineering Entrance Examination", level: "Undergraduate", mode: "Computer-based test" },
    "JEE Paper 2": { category: "architecture", fullName: "JEE Main Paper 2", level: "Undergraduate", mode: "Computer-based and drawing/aptitude format depending on paper" },
    NATA: {
        category: "architecture",
        fullName: "National Aptitude Test in Architecture",
        level: "Undergraduate architecture",
        mode: "Aptitude-based test",
        frequency: "As notified by the Council of Architecture",
        overview: "NATA assesses aptitude for admission to B.Arch programs by testing architectural awareness, visual reasoning, drawing, observation, logical thinking and mathematics-related ability.",
        eligibility: "Candidates should meet the latest Council of Architecture eligibility rules for B.Arch admission, including Class 12 or equivalent subject and qualifying criteria where applicable.",
        syllabus: ["Architectural aptitude", "Drawing and visual composition", "Mathematics", "Logical reasoning", "General aptitude", "Observation skills"],
        examPattern: "NATA evaluates aptitude for architecture through questions and tasks based on visual perception, logical reasoning, mathematics, drawing/design thinking and architectural awareness as per the latest brochure.",
        acceptedBy: ["Architecture colleges in India", "B.Arch programs following Council of Architecture rules", "Participating universities"],
        admissionOptions: [
            "Bachelor of Architecture (B.Arch) programs",
            "Architecture schools and universities following Council of Architecture admission norms",
            "Design, planning or built-environment pathways where institutes use NATA score",
            "Institute/state counselling based on score, eligibility and portfolio or academic rules where applicable"
        ],
        preparationTips: [
            "Practice sketching, perspective, proportion and composition.",
            "Study buildings, materials, city spaces and basic architecture vocabulary.",
            "Revise Class 11 and 12 mathematics relevant to aptitude questions.",
            "Practice visual reasoning and pattern-based questions.",
            "Review the latest NATA brochure before final mock tests."
        ]
    },
    "NEET UG": {
        category: "medicine",
        fullName: "National Eligibility cum Entrance Test Undergraduate",
        level: "Undergraduate",
        mode: "Offline pen-and-paper objective test",
        frequency: "Usually once a year",
        overview: "NEET UG is the common national entrance examination for undergraduate medical education, including MBBS, BDS and other notified medical courses in participating institutions. AIIMS MBBS admission is also through NEET UG; there is no separate AIIMS MBBS entrance exam.",
        eligibility: "Students must have passed or be appearing in Class 12 with Physics, Chemistry, Biology/Biotechnology and English, and must satisfy the age and qualifying-mark criteria in the latest official notification.",
        syllabus: ["Physics", "Chemistry", "Botany", "Zoology", "NCERT Class 11 topics", "NCERT Class 12 topics"],
        examPattern: "NEET UG is an offline MCQ-based examination covering Physics, Chemistry, Botany and Zoology. Negative marking applies according to the official scheme in the latest information bulletin.",
        acceptedBy: ["AIIMS campuses", "Government medical colleges", "Dental colleges", "Central universities", "Participating private and deemed universities"],
        admissionOptions: [
            "MBBS admission in AIIMS, government medical colleges, central universities and participating private/deemed universities",
            "BDS admission in dental colleges",
            "AYUSH courses such as BAMS, BHMS, BUMS and BSMS where included in counselling rules",
            "Veterinary or allied medical programs where the relevant authority accepts NEET UG",
            "Seat allotment through MCC, state counselling or institution counselling based on NEET rank and category"
        ],
        applicationProcess: [
            "Register for NEET UG on the official NTA portal.",
            "Complete the application form with category, academic and document details.",
            "Download admit card when released.",
            "Appear for the examination and obtain a qualifying score or rank.",
            "Participate in MCC, state or institution counselling for seat allotment."
        ],
        preparationTips: [
            "Complete NCERT Biology thoroughly with multiple revisions.",
            "Practice Physics numerical problems daily.",
            "Revise Chemistry through NCERT theory plus question practice.",
            "Solve previous years' NEET papers and full-length mock tests.",
            "Analyze mistakes after each test and revise short notes frequently."
        ]
    },
    NEET: { category: "medicine", fullName: "National Eligibility cum Entrance Test", level: "Undergraduate", mode: "Pen-and-paper objective test" },
    "NEET PG": { category: "medicine", fullName: "National Eligibility cum Entrance Test Postgraduate", level: "Postgraduate", mode: "Computer-based test" },
    "INI CET": { category: "medicine", fullName: "Institute of National Importance Combined Entrance Test", level: "Postgraduate", mode: "Computer-based test" },
    "AIIMS Exams": {
        category: "medicine",
        fullName: "AIIMS Exams Portal and AIIMS-linked Examinations",
        level: "Undergraduate / postgraduate / recruitment depending on exam",
        mode: "Varies by examination",
        overview: "AIIMS Exams is the official examination portal for AIIMS-linked admissions and recruitment. There is no separate AIIMS MBBS entrance exam now; MBBS admission to AIIMS campuses is through NEET UG. Other AIIMS-related examinations include INI-CET, INI-SS, AIIMS nursing entrance tests and NORCET.",
        eligibility: "For AIIMS MBBS, students must qualify NEET UG and satisfy the official eligibility criteria including Class 12 with Physics, Chemistry, Biology/Biotechnology and English. For INI-CET, INI-SS, nursing and NORCET, eligibility depends on the specific course or recruitment notification.",
        syllabus: ["NEET UG for AIIMS MBBS", "INI-CET for PG medical seats", "INI-SS for super-specialty courses", "AIIMS Nursing entrance tests", "NORCET for Nursing Officer recruitment"],
        examPattern: "AIIMS does not conduct a separate MBBS entrance exam. NEET UG is a pen-and-paper MCQ exam for undergraduate medical admission. INI-CET, INI-SS, nursing exams and NORCET follow separate AIIMS notifications and patterns.",
        acceptedBy: ["AIIMS campuses", "Institutes of National Importance", "Participating medical institutions", "AIIMS nursing programs"],
        admissionOptions: [
            "AIIMS MBBS admission through NEET UG, not through a separate AIIMS MBBS entrance exam",
            "MD, MS, MDS, DM (6 years) and MCh (6 years) admission through INI-CET",
            "DM, MCh and MD Hospital Administration super-specialty admission through INI-SS",
            "AIIMS B.Sc Nursing and M.Sc Nursing programs through AIIMS nursing entrance processes",
            "Nursing Officer recruitment through NORCET"
        ],
        applicationProcess: [
            "Identify the correct AIIMS-linked exam: NEET UG for MBBS, INI-CET for PG, INI-SS for super-specialty, nursing entrance or NORCET.",
            "Read the latest official notification on the relevant official portal.",
            "Register online and complete the application form.",
            "Upload documents, pay the fee and download admit card when released.",
            "Appear for the exam and participate in counselling, admission or recruitment process as applicable."
        ],
        preparationTips: [
            "For AIIMS MBBS, prepare through NEET UG and focus strongly on NCERT Biology.",
            "Revise Physics concepts and practice numerical questions regularly.",
            "For Chemistry, combine NCERT theory with daily problem practice.",
            "Solve previous NEET papers and full-length mock tests.",
            "For INI-CET/INI-SS/NORCET/nursing exams, follow the exact syllabus in the official AIIMS notification."
        ]
    },
    "INI-CET": {
        category: "medicine",
        fullName: "Institute of National Importance Combined Entrance Test",
        level: "Postgraduate medical entrance",
        mode: "Computer-based test",
        overview: "INI-CET is used for admission to postgraduate medical courses such as MD, MS, MDS, DM (6 years) and MCh (6 years) at AIIMS and other Institutes of National Importance.",
        eligibility: "Candidates generally need a relevant MBBS/BDS degree, internship completion and registration requirements as specified in the official notification.",
        syllabus: ["MBBS/BDS curriculum", "Clinical subjects", "Pre-clinical subjects", "Para-clinical subjects", "Dental subjects for MDS pathways"],
        examPattern: "Computer-based objective examination. Exact question count, marking scheme, sessions and counselling rules should be checked from the latest AIIMS notification.",
        acceptedBy: ["AIIMS", "JIPMER", "NIMHANS", "PGIMER", "Other Institutes of National Importance"],
        admissionOptions: [
            "MD programs in clinical, pre-clinical and para-clinical medical specialties",
            "MS surgical specialty programs",
            "MDS dental postgraduate programs",
            "DM (6 years) and MCh (6 years) programs where notified",
            "Postgraduate medical seats at AIIMS and other Institutes of National Importance"
        ]
    },
    CLAT: {
        category: "law",
        fullName: "Common Law Admission Test",
        level: "Undergraduate / postgraduate",
        mode: "Objective entrance test",
        frequency: "Usually once a year",
        overview: "CLAT is a national-level law entrance examination for admission to undergraduate and postgraduate law programs offered by National Law Universities and other participating institutions.",
        eligibility: "For the undergraduate program, candidates generally need Class 12 or equivalent with the required minimum marks. For postgraduate law, candidates need an LL.B. or equivalent qualification as per the latest notification.",
        syllabus: ["English Language", "Current Affairs including General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
        examPattern: "CLAT UG is an objective comprehension-based test covering language, current affairs, legal reasoning, logical reasoning and quantitative techniques. PG pattern and eligibility follow the official consortium notification.",
        acceptedBy: ["National Law Universities", "Law schools using CLAT scores", "Participating private universities"],
        admissionOptions: [
            "5-year integrated law programs such as B.A. LL.B., B.B.A. LL.B., B.Com LL.B., B.Sc. LL.B. where offered",
            "LL.M. programs through CLAT PG",
            "National Law University admission through counselling and rank-based seat allotment",
            "Private law schools and universities that accept CLAT scores"
        ],
        preparationTips: [
            "Read newspapers and legal-current-affairs summaries consistently.",
            "Practice passage-based legal and logical reasoning questions.",
            "Build speed in comprehension without losing accuracy.",
            "Revise basic quantitative techniques and data interpretation.",
            "Attempt mock tests and analyze wrong reasoning patterns."
        ]
    },
    AILET: { category: "law", fullName: "All India Law Entrance Test", level: "Undergraduate / postgraduate", mode: "Objective entrance test" },
    "LSAT India": { category: "law", fullName: "Law School Admission Test India", level: "Undergraduate / postgraduate", mode: "Aptitude-based law test" },
    "MH CET Law": { category: "law", fullName: "Maharashtra Common Entrance Test for Law", level: "Undergraduate", mode: "Objective test" },
    SLAT: { category: "law", fullName: "Symbiosis Law Admission Test", level: "Undergraduate", mode: "Objective test" },
    UCEED: {
        category: "design",
        fullName: "Undergraduate Common Entrance Examination for Design",
        level: "Undergraduate",
        mode: "Computer-based and design aptitude assessment",
        frequency: "Usually once a year",
        overview: "UCEED is an undergraduate design entrance examination used for B.Des admission at IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, IIITDM Jabalpur and participating institutes as notified.",
        eligibility: "Candidates should satisfy the latest UCEED age, attempt and Class 12 or equivalent appearance criteria. Students from different streams may be eligible subject to the official rules.",
        syllabus: ["Visualization", "Observation", "Design sensitivity", "Analytical reasoning", "Creativity", "Drawing and communication"],
        examPattern: "UCEED includes computer-based design aptitude sections and a drawing/design component as specified for the session. It tests visual reasoning, observation, creativity, logic and communication.",
        acceptedBy: ["IIT Bombay", "IIT Delhi", "IIT Guwahati", "IIT Hyderabad", "IIITDM Jabalpur", "Participating design institutes"],
        admissionOptions: [
            "B.Des programs at participating IITs and design institutes",
            "Product design, visual communication, interaction design, mobility design or related design pathways where offered",
            "Design institute admission based on UCEED rank, portfolio/studio requirements and institute rules",
            "Participating institute seats notified for the current admission cycle"
        ],
        preparationTips: [
            "Practice observation drawing and visual communication regularly.",
            "Solve design aptitude and reasoning questions from past papers.",
            "Study everyday products, posters, layouts and interfaces critically.",
            "Improve speed for visual puzzles and spatial reasoning.",
            "Review official sample papers and marking rules before mocks."
        ]
    },
    CEED: { category: "design", fullName: "Common Entrance Examination for Design", level: "Postgraduate", mode: "Design aptitude assessment" },
    "NID DAT": { category: "design", fullName: "National Institute of Design Design Aptitude Test", level: "Undergraduate / postgraduate", mode: "Prelims, mains, studio test/interview depending on program" },
    "NIFT Entrance": { category: "design", fullName: "National Institute of Fashion Technology Entrance Examination", level: "Undergraduate / postgraduate", mode: "Creative aptitude, general ability and situation/studio tests" },
    "MITID DAT": { category: "design", fullName: "MIT Institute of Design Design Aptitude Test", level: "Undergraduate / postgraduate", mode: "Design aptitude and portfolio/interview process" },
    "Private Design Tests": { category: "design", fullName: "Private Design Entrance Tests", mode: "Institute-specific design aptitude and portfolio tests" },
    CAT: { category: "management", fullName: "Common Admission Test", level: "Postgraduate", mode: "Computer-based test" },
    XAT: { category: "management", fullName: "Xavier Aptitude Test", level: "Postgraduate", mode: "Computer-based test" },
    MAT: { category: "management", fullName: "Management Aptitude Test", level: "Postgraduate", mode: "Computer-based / paper-based depending on session" },
    CMAT: { category: "management", fullName: "Common Management Admission Test", level: "Postgraduate", mode: "Computer-based test" },
    NMAT: { category: "management", fullName: "NMAT by GMAC", level: "Postgraduate", mode: "Computer-based test" },
    SNAP: { category: "management", fullName: "Symbiosis National Aptitude Test", level: "Postgraduate", mode: "Computer-based test" },
    IPMAT: { category: "management", fullName: "Integrated Programme in Management Aptitude Test", level: "Undergraduate / integrated management", mode: "Aptitude test" },
    "CA Foundation": { category: "finance", fullName: "Chartered Accountancy Foundation", level: "Foundation", mode: "Professional examination" },
    "CMA Foundation": { category: "finance", fullName: "Cost and Management Accountancy Foundation", level: "Foundation", mode: "Professional examination" },
    "CS Executive Entrance": { category: "finance", fullName: "Company Secretary Executive Entrance Test", level: "Foundation / executive entrance", mode: "Professional entrance test" },
    CFA: { category: "finance", fullName: "Chartered Financial Analyst Program", level: "Professional certification", mode: "Professional examination" },
    CPA: { category: "finance", fullName: "Certified Public Accountant Examination", level: "Professional certification", mode: "Professional examination" },
    FRM: { category: "finance", fullName: "Financial Risk Manager Certification", level: "Professional certification", mode: "Professional examination" },
    "NISM Certifications": { category: "finance", fullName: "National Institute of Securities Markets Certifications", level: "Certification", mode: "Certification examination" },
    "Bank Exams": { category: "finance", fullName: "Banking Recruitment Examinations", level: "Recruitment", mode: "Objective recruitment tests" },
    CUET: {
        category: "general",
        fullName: "Common University Entrance Test",
        level: "Undergraduate / postgraduate depending on version",
        mode: "Computer-based test",
        frequency: "Usually once a year for each admission cycle",
        overview: "CUET is a common entrance test used by central universities and other participating universities for admission to undergraduate or postgraduate programs, depending on the CUET version and course.",
        eligibility: "Eligibility depends on the selected university, course and subject combination. Students should check both the CUET information bulletin and the admission rules of each target university.",
        syllabus: ["Language test", "Domain-specific subjects", "General test", "Reasoning", "Quantitative aptitude", "Current awareness"],
        examPattern: "CUET is conducted as a computer-based test with language, domain-subject and general-test sections. Candidates choose subjects according to their target course and university requirements.",
        acceptedBy: ["Central universities", "State universities", "Deemed universities", "Private universities", "Other participating institutions"],
        admissionOptions: [
            "Undergraduate programs such as B.A., B.Sc., B.Com, BBA, BCA, B.Voc and other university-specific courses",
            "Honours and major programs in humanities, science, commerce, languages, social sciences and interdisciplinary fields",
            "Participating central, state, deemed and private university admissions",
            "Course-specific admission based on CUET subject combination, university eligibility and merit list",
            "Postgraduate admission where the relevant CUET PG route is used"
        ],
        applicationProcess: [
            "Check target university and course subject requirements.",
            "Register for CUET and select the correct language, domain and general-test papers.",
            "Complete application, fee payment and correction steps if opened.",
            "Download admit card or city intimation as released.",
            "Use CUET scores for university-specific counselling or admission forms."
        ],
        preparationTips: [
            "Match your preparation to the exact subjects required by target universities.",
            "Revise NCERT or domain subjects for Class 12 level concepts.",
            "Practice language comprehension and vocabulary daily.",
            "Work on reasoning, arithmetic and current awareness for the general test.",
            "Track each university's separate admission portal after results."
        ]
    },
    "University Entrance Tests": { category: "general", fullName: "University Entrance Tests", mode: "Institution-specific tests" },
    "University Entrance Exams": { category: "general", fullName: "University Entrance Examinations", mode: "Institution-specific tests" },
    "Institute Specific": { category: "general", fullName: "Institute-specific Admission Process", mode: "Varies by institute" },
    "Institute Specific Admissions": { category: "general", fullName: "Institute-specific Admissions", mode: "Varies by institute" },
    "GATE for PG": { category: "engineering", fullName: "Graduate Aptitude Test in Engineering for PG Admissions", level: "Postgraduate", mode: "Computer-based test" },
    "GATE Psychology (selected programs)": { category: "psychology", fullName: "GATE Psychology for Selected Programs", level: "Postgraduate", mode: "Computer-based test" },
    "NET/JRF": { category: "education", fullName: "National Eligibility Test / Junior Research Fellowship", level: "Postgraduate / research eligibility", mode: "Objective test" },
    CTET: { category: "education", fullName: "Central Teacher Eligibility Test", level: "Teacher eligibility", mode: "Objective test" },
    TET: { category: "education", fullName: "Teacher Eligibility Test", level: "Teacher eligibility", mode: "Objective test" },
    "IIMC Entrance": { category: "media", fullName: "Indian Institute of Mass Communication Entrance Process", level: "Postgraduate / diploma", mode: "Entrance test and/or admission process" },
    "XIC OET": { category: "media", fullName: "Xavier Institute of Communications Online Entrance Test", level: "Postgraduate / diploma", mode: "Online entrance test" },
    FTII: { category: "media", fullName: "Film and Television Institute of India Admission Process", level: "Postgraduate / diploma", mode: "Entrance test, audition or interview depending on course" },
    SRFTI: { category: "media", fullName: "Satyajit Ray Film and Television Institute Admission Process", level: "Postgraduate / diploma", mode: "Entrance test and admission process" },
    "CEPT Admissions": { category: "architecture", fullName: "CEPT University Admissions", level: "Undergraduate / postgraduate", mode: "Institute-specific admission process" },
    "ICAR AIEEA": { category: "engineering", fullName: "ICAR All India Entrance Examination for Admission", level: "Undergraduate / postgraduate", mode: "Entrance examination" },
    "Physical Education Tests": { category: "sports", fullName: "Physical Education Entrance Tests", mode: "Physical, written and practical assessment" },
    "Sports Trials": { category: "sports", fullName: "Sports Trials", mode: "Performance trial and skill assessment" },
    "State Law Entrance Tests": { category: "law", fullName: "State Law Entrance Tests", mode: "State-specific legal education entrance tests" }
};

const additionalExamNames = [
    "INI-SS",
    "AIIMS B.Sc Nursing",
    "AIIMS M.Sc Nursing",
    "NORCET"
];

Object.assign(overrides, {
    "INI-SS": {
        category: "medicine",
        fullName: "Institute of National Importance Super-Speciality Entrance Test",
        level: "Super-specialty postgraduate",
        mode: "Computer-based test",
        overview: "INI-SS is conducted for admission to super-specialty courses such as DM, MCh and MD Hospital Administration at AIIMS and other participating Institutes of National Importance.",
        eligibility: "Candidates need the required postgraduate medical qualification for the chosen super-specialty course, as specified in the official notification.",
        syllabus: ["Specialty-specific medical knowledge", "Clinical decision making", "Super-specialty subject areas"],
        examPattern: "Computer-based test with specialty-specific questions. The exact structure and counselling process vary by session and should be checked from the official AIIMS notification.",
        acceptedBy: ["AIIMS", "Participating Institutes of National Importance", "Super-specialty medical departments"]
    },
    "AIIMS B.Sc Nursing": {
        category: "medicine",
        fullName: "AIIMS B.Sc Nursing Entrance Examination",
        level: "Undergraduate nursing",
        mode: "Computer-based / institute-notified mode",
        overview: "AIIMS B.Sc Nursing entrance is used for admission to undergraduate nursing programs offered by AIIMS institutes.",
        eligibility: "Students generally need Class 12 with science subjects including Biology, subject to the latest AIIMS nursing prospectus.",
        syllabus: ["Physics", "Chemistry", "Biology", "General Knowledge", "Aptitude"],
        examPattern: "The pattern is notified by AIIMS for the relevant nursing admission session and may include science and aptitude-based questions.",
        acceptedBy: ["AIIMS nursing colleges", "AIIMS undergraduate nursing programs"]
    },
    "AIIMS M.Sc Nursing": {
        category: "medicine",
        fullName: "AIIMS M.Sc Nursing Entrance Examination",
        level: "Postgraduate nursing",
        mode: "Computer-based / institute-notified mode",
        overview: "AIIMS M.Sc Nursing entrance is used for postgraduate nursing admission in AIIMS institutions.",
        eligibility: "Candidates generally need a relevant B.Sc Nursing or equivalent qualification and registration requirements as specified in the prospectus.",
        syllabus: ["Nursing foundations", "Medical-surgical nursing", "Community health nursing", "Research aptitude", "Specialty nursing areas"],
        examPattern: "The exam pattern and seat process are notified by AIIMS for the relevant session.",
        acceptedBy: ["AIIMS postgraduate nursing programs"]
    },
    NORCET: {
        category: "medicine",
        fullName: "Nursing Officer Recruitment Common Eligibility Test",
        level: "Recruitment examination",
        mode: "Computer-based test",
        overview: "NORCET is used for recruitment of Nursing Officers in AIIMS and participating institutions.",
        eligibility: "Candidates need the required nursing qualification, registration and other criteria stated in the official NORCET notification.",
        syllabus: ["Nursing subjects", "General awareness", "Aptitude", "Reasoning", "Professional knowledge"],
        examPattern: "Computer-based recruitment test. The latest notification gives exact question distribution, qualifying criteria and recruitment process.",
        acceptedBy: ["AIIMS", "Participating central medical institutions", "Nursing Officer recruitment panels"]
    }
});

const domains = readJSON("careers.json").domains || [];
const careersByExam = new Map();
const examNames = new Set();

domains.forEach((domain) => {
    const detailsFile = domain.file.replace(".json", "-details.json");
    const details = readJSON(detailsFile);

    (details.careers || []).forEach((career) => {
        (career.entranceExams || []).forEach((examName) => {
            examNames.add(examName);

            if (!careersByExam.has(examName)) {
                careersByExam.set(examName, []);
            }

            careersByExam.get(examName).push({
                id: career.id,
                name: career.name,
                domainId: domain.id,
                domainName: domain.name,
                href: `details.html?domain=${domain.id}&career=${career.id}`
            });
        });
    });
});

additionalExamNames.forEach(name => examNames.add(name));

const exams = [...examNames].sort((a, b) => a.localeCompare(b)).map((name) => {
    const override = overrides[name] || {};
    const category = override.category || "general";
    const template = templates[category] || templates.general;
    const relatedCareers = careersByExam.get(name) || [];

    const exam = {
        id: slugify(name),
        name,
        fullName: override.fullName || name,
        category,
        domain: domainLabels[category] || "General",
        level: override.level || template.level,
        mode: override.mode || "Varies by exam/session",
        frequency: override.frequency || "Usually once a year or as announced by the conducting body",
        officialWebsite: override.officialWebsite || officialWebsites[name] || "",
        overview: override.overview || `${name} ${template.overview}`,
        eligibility: override.eligibility || template.eligibility,
        syllabus: override.syllabus || template.subjects,
        examPattern: override.examPattern || template.pattern,
        admissionOptions: override.admissionOptions || template.admissionOptions,
        applicationProcess: override.applicationProcess || [
            "Check the latest official notification.",
            "Confirm eligibility for the selected course or institution.",
            "Register online and fill the application form.",
            "Upload required documents and pay the application fee.",
            "Download admit card and follow exam-day instructions."
        ],
        preparationTips: override.preparationTips || [
            "Understand the latest syllabus and pattern before starting.",
            "Make a weekly study plan with revision slots.",
            "Solve previous papers and mock tests.",
            "Track mistakes and revise weak topics regularly.",
            "Check official updates before relying on dates or rules."
        ],
        acceptedBy: override.acceptedBy || template.acceptedBy,
        relatedCareers: relatedCareers.slice(0, 12)
    };

    return exam;
});

writeJSON("exam-details.json", { exams });

writeJSON("exams.json", {
    exams: exams.map(exam => ({
        id: exam.id,
        name: exam.name,
        fullName: exam.fullName,
        category: exam.category,
        domain: exam.domain,
        level: exam.level,
        mode: exam.mode,
        officialWebsite: exam.officialWebsite,
        description: exam.overview
    }))
});

console.log(`Completed ${exams.length} exams.`);
