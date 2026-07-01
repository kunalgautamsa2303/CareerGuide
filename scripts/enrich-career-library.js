const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

const readJSON = (fileName) => {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) return {};
    const text = fs.readFileSync(filePath, "utf8").trim();
    return text ? JSON.parse(text) : {};
};

const writeJSON = (fileName, data) => {
    fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const slugify = (value) => String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const newDomains = [
    {
        id: "agriculture-environment",
        name: "Agriculture & Environment",
        icon: "AGR",
        description: "Agriculture, food, sustainability, climate and allied science careers.",
        file: "agriculture-environment.json"
    },
    {
        id: "humanities-social-sciences",
        name: "Humanities & Social Sciences",
        icon: "SOC",
        description: "Society, policy, history, languages, development and public-impact careers.",
        file: "humanities-social-sciences.json"
    },
    {
        id: "hospitality-tourism",
        name: "Hospitality & Tourism",
        icon: "HTM",
        description: "Hotel, travel, tourism, food service, events and guest-experience careers.",
        file: "hospitality-tourism.json"
    },
    {
        id: "pure-sciences-research",
        name: "Pure Sciences & Research",
        icon: "SCI",
        description: "Physics, chemistry, biology, mathematics, research and lab-based careers.",
        file: "pure-sciences-research.json"
    },
    {
        id: "performing-arts",
        name: "Performing Arts",
        icon: "ART",
        description: "Music, theatre, dance, performance, production and creative stage careers.",
        file: "performing-arts.json"
    },
    {
        id: "defence-public-services",
        name: "Defence & Public Services",
        icon: "DPS",
        description: "Armed forces, civil services, policing, emergency and government-service careers.",
        file: "defence-public-services.json"
    },
    {
        id: "vocational-skills",
        name: "Vocational & Skilled Careers",
        icon: "VOC",
        description: "Hands-on technical, service, trade, skill-development and applied careers.",
        file: "vocational-skills.json"
    },
    {
        id: "computer-applications-it",
        name: "Computer Applications & IT",
        icon: "IT",
        description: "BCA, software, IT services, cloud, networking and application careers.",
        file: "computer-applications-it.json"
    },
    {
        id: "cybersecurity-ethical-hacking",
        name: "Cybersecurity & Ethical Hacking",
        icon: "SEC",
        description: "Cyber defence, ethical hacking, digital forensics and information-security careers.",
        file: "cybersecurity-ethical-hacking.json"
    }
];

const careerNames = {
    "agriculture-environment": [
        "Agricultural Scientist",
        "Agronomist",
        "Horticulturist",
        "Food Technologist",
        "Dairy Technologist",
        "Fisheries Scientist",
        "Forestry Officer",
        "Soil Scientist",
        "Farm Management Specialist",
        "Agri-Business Manager",
        "Plant Breeder",
        "Seed Technologist",
        "Environmental Scientist",
        "Sustainability Consultant",
        "Climate Change Analyst"
    ],
    "humanities-social-sciences": [
        "Sociologist",
        "Political Scientist",
        "Historian",
        "Archaeologist",
        "Anthropologist",
        "Civil Services Officer",
        "Public Policy Analyst",
        "Social Worker",
        "International Relations Specialist",
        "Economist",
        "Geographer",
        "Linguist",
        "Writer",
        "NGO Program Manager",
        "Development Sector Professional"
    ],
    "hospitality-tourism": [
        "Hotel Manager",
        "Chef",
        "Food and Beverage Manager",
        "Front Office Manager",
        "Travel Consultant",
        "Tour Manager",
        "Event Manager",
        "Airline Cabin Crew",
        "Hospitality Entrepreneur",
        "Resort Manager",
        "Cruise Line Professional",
        "Housekeeping Manager",
        "Bakery and Pastry Chef",
        "Tourism Officer",
        "Restaurant Manager"
    ],
    "pure-sciences-research": [
        "Physicist",
        "Chemist",
        "Mathematician",
        "Statistician",
        "Biologist",
        "Microbiologist",
        "Biochemist",
        "Zoologist",
        "Botanist",
        "Geologist",
        "Astronomer",
        "Environmental Researcher",
        "Science Communicator",
        "Lab Research Scientist",
        "Research Assistant"
    ],
    "performing-arts": [
        "Actor",
        "Theatre Artist",
        "Dancer",
        "Choreographer",
        "Musician",
        "Singer",
        "Music Producer",
        "Sound Designer",
        "Theatre Director",
        "Performing Arts Teacher",
        "Voice Artist",
        "Stage Manager",
        "Classical Artist",
        "Instrumentalist",
        "Arts Manager"
    ],
    "defence-public-services": [
        "Army Officer",
        "Navy Officer",
        "Air Force Officer",
        "Police Officer",
        "IAS Officer",
        "IPS Officer",
        "IFS Officer",
        "Defence Scientist",
        "Paramilitary Officer",
        "Disaster Management Specialist",
        "Intelligence Analyst",
        "Fire Safety Officer",
        "Customs Officer",
        "Public Administration Officer",
        "Coast Guard Officer"
    ],
    "vocational-skills": [
        "Electrician",
        "Plumber",
        "Automotive Technician",
        "HVAC Technician",
        "Welder",
        "Solar Panel Technician",
        "Beauty and Wellness Professional",
        "Retail Associate",
        "Logistics Assistant",
        "Medical Assistant",
        "Lab Assistant",
        "Graphic Production Operator",
        "Food Processing Technician",
        "Apparel Production Supervisor",
        "CNC Machine Operator"
    ],
    "computer-applications-it": [
        "BCA Developer",
        "Web Developer",
        "Mobile App Developer",
        "Cloud Computing Specialist",
        "Network Administrator",
        "Database Administrator",
        "Systems Analyst",
        "IT Support Specialist",
        "DevOps Engineer",
        "QA Tester",
        "UI Developer",
        "ERP Consultant",
        "IT Project Coordinator",
        "Technical Writer",
        "Computer Applications Teacher"
    ],
    "cybersecurity-ethical-hacking": [
        "Cybersecurity Analyst",
        "Ethical Hacker",
        "Security Architect",
        "Security Operations Center Analyst",
        "Digital Forensics Investigator",
        "Cloud Security Engineer",
        "Application Security Engineer",
        "Network Security Engineer",
        "Malware Analyst",
        "Cyber Law Consultant",
        "Incident Response Analyst",
        "Penetration Tester",
        "Information Security Auditor",
        "Governance Risk Compliance Analyst",
        "Cybersecurity Trainer"
    ]
};

const existingDomainAdditions = {
    engineering: [
        "Biomedical Engineer",
        "Telecommunication Engineer",
        "Structural Engineer",
        "Geotechnical Engineer",
        "Energy Engineer",
        "Nuclear Engineer",
        "Textile Engineer",
        "Food Technology Engineer",
        "Ceramic Engineer",
        "Instrumentation Engineer"
    ],
    medicine: [
        "Clinical Research Associate",
        "Biomedical Scientist",
        "Genetic Counselor",
        "Healthcare Administrator",
        "Medical Coder",
        "Sonographer",
        "Operation Theatre Technologist",
        "Dialysis Technologist",
        "Physician Assistant",
        "Paramedic"
    ],
    design: [
        "UX Researcher",
        "Motion Graphics Designer",
        "Interaction Designer",
        "Web Designer",
        "Toy Designer"
    ],
    management: [
        "Sales Manager",
        "Brand Manager",
        "Strategy Manager",
        "Healthcare Manager",
        "Event Manager"
    ],
    "media-communication": [
        "Screenwriter",
        "Cinematographer",
        "Sound Engineer",
        "Documentary Filmmaker",
        "Broadcast Producer"
    ]
};

const templates = {
    "agriculture-environment": {
        overview: "works with food systems, natural resources, farming, environment, sustainability and climate-aware development.",
        whyChoose: "It connects science with real-world impact in food security, sustainability and rural innovation.",
        eligibility: "Class 12 with Science is preferred for most B.Sc/B.Tech pathways; some agribusiness routes accept Commerce or Humanities.",
        educationPath: "Class 12 -> B.Sc/B.Tech/B.Voc or diploma -> Field/lab internship -> Agriculture, food or sustainability role.",
        feeRange: "Rs 50,000-12 Lakhs",
        workEnvironment: "Farms, labs, food companies, agri-tech firms, government departments, NGOs and sustainability teams.",
        salary: { fresher: "Rs 2.5-6 LPA", midLevel: "Rs 6-14 LPA", seniorLevel: "Rs 14-35+ LPA" },
        futureScope: "Strong due to food security, climate adaptation, agri-tech, sustainability reporting and allied rural development.",
        aiImpact: "AI will support crop monitoring, climate modelling and precision farming while field judgement stays important.",
        skills: ["Biology", "Field Work", "Data Handling", "Sustainability", "Problem Solving", "Communication"],
        entranceExams: ["CUET", "ICAR AIEEA", "State Agriculture Entrance Tests", "University Entrance Tests"],
        topColleges: ["ICAR Institutes", "GB Pant University", "Tamil Nadu Agricultural University", "Punjab Agricultural University", "Banaras Hindu University"],
        careerOpportunities: ["Research", "Agri-Tech", "Food Industry", "Government Projects", "Sustainability Consulting"],
        recruiters: ["Agriculture Departments", "Food Companies", "Agri-Tech Startups", "NGOs", "Research Institutes"]
    },
    "humanities-social-sciences": {
        overview: "studies people, society, culture, policy, history, language and social change to solve human problems.",
        whyChoose: "It builds strong thinking, writing, research and public-impact skills for diverse professional pathways.",
        eligibility: "Class 12 in any stream; Humanities subjects are useful but not always compulsory.",
        educationPath: "Class 12 -> BA/BSW/BPA or related degree -> Internship/research/projects -> Public, social or policy role.",
        feeRange: "Rs 50,000-10 Lakhs",
        workEnvironment: "Universities, NGOs, think tanks, media teams, policy organizations, government bodies and research firms.",
        salary: { fresher: "Rs 2.5-6 LPA", midLevel: "Rs 6-16 LPA", seniorLevel: "Rs 16-40+ LPA" },
        futureScope: "Strong for policy, development, research, communication, civil services and human-centered organizations.",
        aiImpact: "AI will support research and drafting while interpretation, judgement and field context remain human-led.",
        skills: ["Research", "Writing", "Critical Thinking", "Communication", "Field Work", "Policy Awareness"],
        entranceExams: ["CUET", "University Entrance Tests", "Civil Services Exam", "State Public Service Exams"],
        topColleges: ["Delhi University", "Jawaharlal Nehru University", "TISS", "Ashoka University", "Azim Premji University"],
        careerOpportunities: ["Research", "Policy", "Civil Services", "Development Sector", "Writing"],
        recruiters: ["NGOs", "Think Tanks", "Government Bodies", "Research Firms", "Universities"]
    },
    "hospitality-tourism": {
        overview: "manages guest experience, travel, hotels, food service, events, tourism operations and service businesses.",
        whyChoose: "It offers people-facing work, global mobility and practical career growth in a large service industry.",
        eligibility: "Class 12 in any stream; hotel management or tourism entrance exams may be required.",
        educationPath: "Class 12 -> Hotel/tourism degree or diploma -> Industrial training -> Hospitality, travel or event role.",
        feeRange: "Rs 1-15 Lakhs",
        workEnvironment: "Hotels, resorts, restaurants, airlines, travel companies, event firms, cruise lines and tourism departments.",
        salary: { fresher: "Rs 2.5-6 LPA", midLevel: "Rs 6-16 LPA", seniorLevel: "Rs 16-45+ LPA" },
        futureScope: "Strong due to tourism, food service, events, luxury experiences and global travel recovery.",
        aiImpact: "AI will support booking and service systems while hospitality, empathy and operations remain human-led.",
        skills: ["Communication", "Service Mindset", "Operations", "Teamwork", "Problem Solving", "Presentation"],
        entranceExams: ["NCHM JEE", "CUET", "Institute Specific Admissions", "University Entrance Tests"],
        topColleges: ["IHM Delhi", "IHM Mumbai", "IHM Bengaluru", "Welcomgroup Graduate School", "Christ University"],
        careerOpportunities: ["Hotel Operations", "Food Service", "Travel Planning", "Events", "Airline Services"],
        recruiters: ["Taj Hotels", "Oberoi Hotels", "Marriott", "IndiGo", "Travel Companies"]
    },
    "pure-sciences-research": {
        overview: "explores scientific principles through experiments, analysis, data, lab work and research projects.",
        whyChoose: "It is ideal for students who enjoy deep subject knowledge, discovery, experimentation and research.",
        eligibility: "Class 12 Science with relevant subjects such as PCM, PCB or PCMB.",
        educationPath: "Class 12 Science -> B.Sc/BS/MS integrated degree -> Research projects -> MSc/PhD or science role.",
        feeRange: "Rs 50,000-12 Lakhs",
        workEnvironment: "Universities, research labs, science institutes, industry R&D teams, analytics units and education organizations.",
        salary: { fresher: "Rs 2.5-6 LPA", midLevel: "Rs 6-18 LPA", seniorLevel: "Rs 18-45+ LPA" },
        futureScope: "Strong for research, analytics, biotechnology, climate science, space science, education and data-driven work.",
        aiImpact: "AI will support modelling and analysis while scientific reasoning and experimental design remain critical.",
        skills: ["Scientific Thinking", "Mathematics", "Lab Skills", "Data Analysis", "Research Writing", "Patience"],
        entranceExams: ["CUET", "IISER Aptitude Test", "NEST", "JEE Main", "University Entrance Tests"],
        topColleges: ["IISc Bengaluru", "IISERs", "Delhi University", "Banaras Hindu University", "St. Xavier's College"],
        careerOpportunities: ["Research", "Teaching", "R&D", "Analytics", "Science Communication"],
        recruiters: ["Research Institutes", "Universities", "Pharma Companies", "Analytics Firms", "Government Labs"]
    },
    "performing-arts": {
        overview: "creates live, recorded or staged artistic experiences through performance, music, theatre, movement and production.",
        whyChoose: "It suits creative students who want expression, performance, audience connection and portfolio-led growth.",
        eligibility: "Class 12 in any stream; auditions, portfolios or performance training may be required.",
        educationPath: "Class 12 -> Performing arts degree/diploma/training -> Portfolio/auditions -> Stage, studio or teaching role.",
        feeRange: "Rs 50,000-12 Lakhs",
        workEnvironment: "Theatres, studios, music labels, production houses, cultural organizations, schools and freelance projects.",
        salary: { fresher: "Rs 2-6 LPA", midLevel: "Rs 6-18 LPA", seniorLevel: "Rs 18-60+ LPA" },
        futureScope: "Strong for digital performance, entertainment, cultural education, events and creator-led careers.",
        aiImpact: "AI will support editing and production while performance, originality and stage presence remain human strengths.",
        skills: ["Practice Discipline", "Creativity", "Stage Presence", "Collaboration", "Voice/Movement", "Portfolio Building"],
        entranceExams: ["Auditions", "University Entrance Tests", "CUET", "Institute Specific Admissions"],
        topColleges: ["National School of Drama", "FTII Pune", "Delhi University", "Rabindra Bharati University", "Banaras Hindu University"],
        careerOpportunities: ["Performance", "Teaching", "Production", "Direction", "Arts Management"],
        recruiters: ["Production Houses", "Theatre Groups", "Music Labels", "Schools", "Event Companies"]
    },
    "defence-public-services": {
        overview: "serves citizens through defence, administration, policing, safety, emergency response and public institutions.",
        whyChoose: "It offers public respect, responsibility, leadership, national service and structured career growth.",
        eligibility: "Class 12 or graduation depending on role; physical, written and interview stages may apply.",
        educationPath: "Class 12/Graduation -> Entrance exam/selection -> Training academy -> Defence or public-service role.",
        feeRange: "Low training cost in many government routes; exam coaching costs vary.",
        workEnvironment: "Defence units, government offices, police departments, field operations, training academies and public agencies.",
        salary: { fresher: "Rs 4-10 LPA", midLevel: "Rs 10-22 LPA", seniorLevel: "Rs 22-50+ LPA" },
        futureScope: "Strong due to governance, national security, emergency management and public administration needs.",
        aiImpact: "AI will support surveillance, analytics and administration while leadership and ethical judgement remain central.",
        skills: ["Discipline", "Leadership", "Fitness", "Decision Making", "Public Service", "Integrity"],
        entranceExams: ["NDA", "CDS", "AFCAT", "UPSC CSE", "State PSC", "SSC Exams"],
        topColleges: ["National Defence Academy", "Indian Military Academy", "LBSNAA", "State Training Academies", "Police Academies"],
        careerOpportunities: ["Defence", "Administration", "Police", "Emergency Services", "Public Policy"],
        recruiters: ["Government of India", "State Governments", "Armed Forces", "Police Departments", "Public Agencies"]
    },
    "vocational-skills": {
        overview: "uses practical, hands-on skills to solve technical, service, repair, production or applied workplace problems.",
        whyChoose: "It gives employable skills, faster entry routes, entrepreneurship options and demand across local industries.",
        eligibility: "Class 10 or Class 12 depending on trade; ITI, diploma, NSQF, B.Voc or certification routes are common.",
        educationPath: "Class 10/12 -> ITI/diploma/B.Voc/certification -> Apprenticeship -> Skilled job or self-employment.",
        feeRange: "Rs 10,000-5 Lakhs",
        workEnvironment: "Workshops, factories, service centers, hospitals, retail units, field sites, studios and small businesses.",
        salary: { fresher: "Rs 1.8-4 LPA", midLevel: "Rs 4-10 LPA", seniorLevel: "Rs 10-25+ LPA" },
        futureScope: "Strong due to manufacturing, repair services, renewable energy, healthcare support and skill-based entrepreneurship.",
        aiImpact: "AI will support diagnostics and workflow while hands-on execution and customer service remain important.",
        skills: ["Practical Skills", "Safety", "Customer Service", "Tool Handling", "Discipline", "Problem Solving"],
        entranceExams: ["ITI Admissions", "Polytechnic Entrance Tests", "B.Voc Admissions", "NSQF Certifications"],
        topColleges: ["Government ITIs", "Polytechnic Colleges", "Community Colleges", "Skill India Training Centres", "B.Voc Institutes"],
        careerOpportunities: ["Technician", "Supervisor", "Service Specialist", "Entrepreneur", "Production Assistant"],
        recruiters: ["Manufacturing Units", "Service Companies", "Hospitals", "Retail Brands", "Local Enterprises"]
    },
    "computer-applications-it": {
        overview: "builds, manages and supports software applications, websites, networks, databases and IT systems.",
        whyChoose: "It offers strong digital career options for students interested in computers beyond only engineering routes.",
        eligibility: "Class 12 with Mathematics or Computer Science is preferred for many BCA/B.Sc IT routes, but requirements vary.",
        educationPath: "Class 12 -> BCA/B.Sc IT/diploma/certification -> Projects -> Internship -> IT role.",
        feeRange: "Rs 1-12 Lakhs",
        workEnvironment: "IT companies, startups, corporate technology teams, cloud teams, support centers and product companies.",
        salary: { fresher: "Rs 3-7 LPA", midLevel: "Rs 7-20 LPA", seniorLevel: "Rs 20-55+ LPA" },
        futureScope: "Strong due to software, cloud, automation, business digitization and IT service demand.",
        aiImpact: "AI will speed up coding and support work while system design, debugging and product thinking stay valuable.",
        skills: ["Programming", "Databases", "Networking", "Cloud Basics", "Problem Solving", "Documentation"],
        entranceExams: ["CUET", "University Entrance Tests", "NIMCET for MCA", "Institute Specific Admissions"],
        topColleges: ["Christ University", "Symbiosis Institute", "Delhi University", "VIT", "SRM Institute"],
        careerOpportunities: ["Software Development", "IT Support", "Cloud", "Testing", "Database Management"],
        recruiters: ["TCS", "Infosys", "Wipro", "Accenture", "HCL", "Startups"]
    },
    "cybersecurity-ethical-hacking": {
        overview: "protects digital systems, networks, data and users from cyber threats through security testing and defence.",
        whyChoose: "It is a fast-growing, high-responsibility field with demand across technology, banking, government and consulting.",
        eligibility: "Class 12 with Mathematics or Computer Science is useful; B.Tech/BCA/B.Sc IT and certifications are common.",
        educationPath: "Class 12 -> CS/IT/cybersecurity degree or certification -> Labs/projects -> Security role.",
        feeRange: "Rs 1-15 Lakhs",
        workEnvironment: "Security operations centers, IT companies, banks, consulting firms, government cyber units and product companies.",
        salary: { fresher: "Rs 4-9 LPA", midLevel: "Rs 9-25 LPA", seniorLevel: "Rs 25-70+ LPA" },
        futureScope: "Excellent due to digital payments, cloud, data privacy, cybercrime and organizational security needs.",
        aiImpact: "AI will support threat detection while attackers also use AI, increasing demand for skilled security professionals.",
        skills: ["Networking", "Linux", "Security Tools", "Ethical Hacking", "Risk Analysis", "Incident Response"],
        entranceExams: ["JEE Main", "CUET", "University Entrance Tests", "Cybersecurity Certifications"],
        topColleges: ["IIIT Delhi", "VIT", "SRM Institute", "Amity University", "UPES"],
        careerOpportunities: ["Cyber Defence", "Ethical Hacking", "Digital Forensics", "Security Audit", "Cloud Security"],
        recruiters: ["Banks", "Cybersecurity Firms", "IT Companies", "Consulting Firms", "Government Cyber Cells"]
    }
};

const existingFallbackTemplate = {
    overview: "works in a specialized professional pathway with applied knowledge, problem solving and industry-ready skills.",
    whyChoose: "It offers focused career growth, practical skill building and opportunities across relevant organizations.",
    eligibility: "Class 12 or graduation requirements vary by institution and specialization.",
    educationPath: "Class 12 -> Relevant degree/diploma/certification -> Internship/projects -> Professional role.",
    feeRange: "Rs 50,000-15 Lakhs",
    workEnvironment: "Companies, institutions, agencies, startups, government bodies and specialist teams.",
    salary: { fresher: "Rs 3-7 LPA", midLevel: "Rs 7-18 LPA", seniorLevel: "Rs 18-45+ LPA" },
    futureScope: "Strong for students who build practical skills, portfolios, internships and updated domain knowledge.",
    aiImpact: "AI will support routine work while judgement, communication and specialist expertise remain important.",
    skills: ["Problem Solving", "Communication", "Technical Knowledge", "Research", "Teamwork", "Adaptability"],
    entranceExams: ["CUET", "University Entrance Tests", "Institute Specific Admissions"],
    topColleges: ["Delhi University", "Christ University", "Symbiosis", "Amity University", "State Universities"],
    careerOpportunities: ["Specialist", "Associate", "Consultant", "Coordinator", "Entrepreneur"],
    recruiters: ["Companies", "Startups", "Consulting Firms", "Government Bodies", "Educational Institutions"]
};

const getTemplate = (domainId) => templates[domainId] || existingFallbackTemplate;

const makeDetail = (career, domainId, existing = {}) => {
    const template = getTemplate(domainId);
    return {
        id: career.id,
        name: career.name,
        overview: `${career.name} ${template.overview}`,
        whyChoose: `${career.name} is useful because ${template.whyChoose.charAt(0).toLowerCase()}${template.whyChoose.slice(1)}`,
        eligibility: template.eligibility,
        educationPath: template.educationPath,
        feeRange: template.feeRange,
        workEnvironment: template.workEnvironment,
        salary: template.salary,
        futureScope: template.futureScope,
        aiImpact: template.aiImpact,
        skills: template.skills,
        entranceExams: template.entranceExams,
        topColleges: template.topColleges,
        careerOpportunities: template.careerOpportunities,
        recruiters: template.recruiters,
        pros: ["Clear skill pathway", "Growing professional options", "Internship and project-based learning helps"],
        cons: ["Requires continuous learning", "Competition varies by location", "Early career may need portfolio or training"],
        relatedCareers: [],
        ...existing,
        id: career.id,
        name: career.name
    };
};

const addMissingCareers = (list, names) => {
    const existingIds = new Set((list.careers || []).map(career => career.id));
    names.forEach(name => {
        const id = slugify(name);
        if (!existingIds.has(id)) {
            list.careers.push({ id, name });
            existingIds.add(id);
        }
    });
};

const index = readJSON("careers.json");
index.domains = index.domains || [];

newDomains.forEach(domain => {
    if (!index.domains.some(item => item.id === domain.id)) {
        index.domains.push(domain);
    }
});

writeJSON("careers.json", index);

index.domains.forEach(domain => {
    const list = readJSON(domain.file);
    list.domain = list.domain || domain.name;
    list.careers = Array.isArray(list.careers) ? list.careers : [];

    if (careerNames[domain.id]) addMissingCareers(list, careerNames[domain.id]);
    if (existingDomainAdditions[domain.id]) addMissingCareers(list, existingDomainAdditions[domain.id]);

    writeJSON(domain.file, list);

    const detailsFile = domain.file.replace(".json", "-details.json");
    const details = readJSON(detailsFile);
    const existingDetails = new Map((details.careers || []).map(career => [career.id, career]));
    const completed = list.careers.map(career => makeDetail(career, domain.id, existingDetails.get(career.id)));

    completed.forEach((career, indexInList) => {
        if (!career.relatedCareers || career.relatedCareers.length === 0) {
            career.relatedCareers = completed
                .filter(item => item.id !== career.id)
                .slice(indexInList + 1, indexInList + 4)
                .map(item => item.name);
        }
        if (!career.relatedCareers.length) {
            career.relatedCareers = completed
                .filter(item => item.id !== career.id)
                .slice(0, 3)
                .map(item => item.name);
        }
    });

    writeJSON(detailsFile, {
        domain: details.domain || list.domain || domain.name,
        description: details.description || domain.description,
        careers: completed
    });
});

const finalIndex = readJSON("careers.json");
const totalCareers = finalIndex.domains.reduce((total, domain) => {
    const list = readJSON(domain.file);
    return total + (list.careers || []).length;
}, 0);

console.log(`Career library enriched: ${finalIndex.domains.length} domains, ${totalCareers} careers.`);
