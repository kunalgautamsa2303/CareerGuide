const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

const readJSON = (fileName) => {
    const filePath = path.join(dataDir, fileName);

    if (!fs.existsSync(filePath)) {
        return {};
    }

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

const extraDomains = [
    {
        id: "education",
        name: "Education",
        icon: "EDU",
        description: "Teaching, training, education technology and academic careers.",
        file: "education.json"
    },
    {
        id: "sports",
        name: "Sports",
        icon: "SPT",
        description: "Sports, fitness, coaching and performance careers.",
        file: "sports.json"
    }
];

const careerLists = {
    "ai-data-science": [
        "Data Scientist",
        "Artificial Intelligence Engineer",
        "Machine Learning Engineer",
        "Data Analyst",
        "Business Intelligence Analyst",
        "Data Engineer",
        "NLP Engineer",
        "Computer Vision Engineer",
        "AI Product Manager",
        "Robotics AI Engineer",
        "Deep Learning Engineer",
        "MLOps Engineer",
        "AI Research Scientist",
        "Big Data Engineer",
        "Prompt Engineer"
    ],
    "media-communication": [
        "Journalist",
        "Digital Content Creator",
        "Mass Communication Specialist",
        "Public Relations Officer",
        "Advertising Executive",
        "Film Director",
        "Video Editor",
        "Radio Jockey",
        "News Anchor",
        "Social Media Manager",
        "Copywriter",
        "Media Planner",
        "Corporate Communication Manager",
        "Podcast Producer",
        "Photojournalist"
    ],
    education: [
        "School Teacher",
        "College Professor",
        "Special Educator",
        "Education Counsellor",
        "Curriculum Developer",
        "Instructional Designer",
        "Education Administrator",
        "Early Childhood Educator",
        "Educational Psychologist",
        "EdTech Specialist",
        "Corporate Trainer",
        "Language Trainer",
        "Online Tutor",
        "Academic Coordinator",
        "Education Policy Analyst"
    ],
    sports: [
        "Professional Athlete",
        "Sports Coach",
        "Fitness Trainer",
        "Sports Physiotherapist",
        "Sports Nutritionist",
        "Sports Psychologist",
        "Physical Education Teacher",
        "Sports Manager",
        "Sports Analyst",
        "Referee",
        "Yoga Instructor",
        "Strength and Conditioning Coach",
        "Sports Journalist",
        "Adventure Sports Instructor",
        "Esports Player"
    ]
};

const templates = {
    engineering: {
        overview: "is an engineering career focused on design, problem solving, technology, systems thinking and practical innovation.",
        whyChoose: "Strong technical demand, structured career growth, opportunities in industry and scope for innovation.",
        eligibility: "10+2 with Physics, Chemistry and Mathematics (PCM).",
        path: "Class 12 PCM -> B.Tech/B.E. or relevant diploma -> Internship -> Job or higher studies.",
        fees: "Rs 2-25 Lakhs",
        environment: "Engineering firms, technology companies, manufacturing units, research labs, consulting teams and startups.",
        salary: ["Rs 4-8 LPA", "Rs 8-20 LPA", "Rs 20-50+ LPA"],
        future: "Strong due to infrastructure growth, digital transformation, automation and emerging technology adoption.",
        ai: "AI will automate routine tasks while increasing demand for engineers who can design, manage and improve intelligent systems.",
        skills: ["Problem Solving", "Mathematics", "Technical Knowledge", "Analytical Thinking", "Communication", "Project Work"],
        exams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE", "CUET"],
        colleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "NIT Trichy", "BITS Pilani", "VIT Vellore"],
        opportunities: ["Engineer", "Project Engineer", "Consultant", "Research Associate", "Product Specialist"],
        recruiters: ["Tata Group", "L&T", "Reliance", "Siemens", "ABB", "ISRO"],
        pros: ["Strong demand", "Good salary potential", "Technical expertise", "Multiple industries"],
        cons: ["Competitive field", "Continuous learning required", "Project pressure"]
    },
    medicine: {
        overview: "is a healthcare career focused on patient care, diagnosis, treatment, prevention and improving quality of life.",
        whyChoose: "Meaningful social impact, respected work, strong career stability and growing healthcare demand.",
        eligibility: "10+2 with Physics, Chemistry and Biology (PCB).",
        path: "Class 12 PCB -> Entrance exam or relevant degree -> Clinical training -> Practice or specialization.",
        fees: "Rs 2 Lakhs-1 Crore+",
        environment: "Hospitals, clinics, diagnostic centers, rehabilitation centers, public health teams and research institutions.",
        salary: ["Rs 3-8 LPA", "Rs 8-20 LPA", "Rs 20-60+ LPA"],
        future: "Strong due to healthcare expansion, preventive care, medical technology and public health needs.",
        ai: "AI will support diagnosis, reporting and analytics, while human judgement and patient interaction remain essential.",
        skills: ["Patient Care", "Medical Knowledge", "Empathy", "Communication", "Decision Making", "Ethics"],
        exams: ["NEET UG", "NEET PG", "INI CET", "CUET", "University Entrance Tests"],
        colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "KGMU", "AFMC Pune", "Manipal Academy"],
        opportunities: ["Clinical Practice", "Research", "Teaching", "Healthcare Administration", "Public Health"],
        recruiters: ["AIIMS", "Apollo Hospitals", "Fortis", "Max Healthcare", "Manipal Hospitals", "Medanta"],
        pros: ["High respect", "Meaningful impact", "Job stability", "Growing demand"],
        cons: ["Long education path", "High responsibility", "Stressful work"]
    },
    design: {
        overview: "is a creative career focused on solving user, visual, product or communication problems through design thinking.",
        whyChoose: "Creative expression, growing demand in digital products and opportunities across many industries.",
        eligibility: "Class 12 in any stream; portfolio and entrance exams may be required.",
        path: "Class 12 -> Design entrance or portfolio -> Design degree/diploma -> Internship -> Professional practice.",
        fees: "Rs 2-20 Lakhs",
        environment: "Design studios, product companies, agencies, media firms, fashion houses, startups and freelance practice.",
        salary: ["Rs 3-7 LPA", "Rs 7-18 LPA", "Rs 18-45+ LPA"],
        future: "Strong due to digital products, brand experience, user experience and creative technology.",
        ai: "AI will speed up ideation and production, while strategy, taste, research and original thinking become more valuable.",
        skills: ["Creativity", "Design Thinking", "Visual Communication", "Research", "Software Tools", "Portfolio Building"],
        exams: ["UCEED", "NID DAT", "NIFT Entrance", "CEED", "Private Design Tests"],
        colleges: ["NID Ahmedabad", "IIT Bombay IDC", "NIFT Delhi", "Srishti Manipal", "MIT Institute of Design"],
        opportunities: ["Designer", "Creative Associate", "UX Specialist", "Brand Designer", "Design Consultant"],
        recruiters: ["Adobe", "Google", "Microsoft", "Flipkart", "Wipro", "Design Studios"],
        pros: ["Creative work", "Portfolio-based growth", "Freelance opportunities", "Digital demand"],
        cons: ["Portfolio pressure", "Subjective feedback", "Competitive industry"]
    },
    law: {
        overview: "is a legal career focused on rights, justice, regulation, advisory work, contracts and dispute resolution.",
        whyChoose: "Intellectual challenge, public impact, strong professional identity and wide specialization options.",
        eligibility: "Class 12 for integrated law programs or graduation for 3-year LL.B.",
        path: "Class 12 -> Law entrance -> BA LL.B./BBA LL.B. or LL.B. -> Internship -> Practice or specialization.",
        fees: "Rs 1-18 Lakhs",
        environment: "Courts, law firms, corporate legal teams, government departments, NGOs and policy organizations.",
        salary: ["Rs 3-8 LPA", "Rs 8-25 LPA", "Rs 25-75+ LPA"],
        future: "Strong due to corporate regulation, technology law, compliance, disputes and policy needs.",
        ai: "AI will help with research and drafting, while argument, judgement, client strategy and ethics remain human-led.",
        skills: ["Legal Reasoning", "Research", "Writing", "Communication", "Negotiation", "Ethics"],
        exams: ["CLAT", "AILET", "LSAT India", "CUET", "State Law Entrance Tests"],
        colleges: ["NLSIU Bengaluru", "NALSAR Hyderabad", "NLU Delhi", "NUJS Kolkata", "GNLU Gandhinagar"],
        opportunities: ["Lawyer", "Legal Advisor", "Compliance Officer", "Policy Analyst", "Legal Consultant"],
        recruiters: ["Law Firms", "Corporate Legal Teams", "Courts", "Government Bodies", "Consulting Firms"],
        pros: ["High impact", "Specialization options", "Professional respect", "Strong reasoning skills"],
        cons: ["Long hours", "Competitive practice", "Continuous reading required"]
    },
    management: {
        overview: "is a business career focused on planning, organizing, decision making, leadership and organizational growth.",
        whyChoose: "Versatile career options, leadership opportunities and demand across every sector.",
        eligibility: "Class 12 for undergraduate management programs; graduation for MBA/PGDM.",
        path: "Class 12 -> BBA/B.Com/Relevant degree -> Internship -> MBA/PGDM optional -> Management role.",
        fees: "Rs 2-30 Lakhs",
        environment: "Corporates, startups, consulting firms, banks, agencies, operations teams and entrepreneurial ventures.",
        salary: ["Rs 3-8 LPA", "Rs 8-22 LPA", "Rs 22-70+ LPA"],
        future: "Strong due to entrepreneurship, analytics, digital business, operations and global markets.",
        ai: "AI will automate reporting and analysis, while strategy, leadership and decision making become more important.",
        skills: ["Leadership", "Communication", "Strategy", "Data Analysis", "Teamwork", "Problem Solving"],
        exams: ["CAT", "XAT", "MAT", "CMAT", "CUET", "IPMAT"],
        colleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "XLRI", "FMS Delhi", "NMIMS"],
        opportunities: ["Manager", "Consultant", "Business Analyst", "Operations Lead", "Entrepreneur"],
        recruiters: ["Deloitte", "EY", "KPMG", "Amazon", "Tata Group", "Accenture"],
        pros: ["Wide options", "Leadership roles", "Good salary growth", "Entrepreneurial scope"],
        cons: ["Target pressure", "Competitive roles", "People management challenges"]
    },
    "commerce-finance": {
        overview: "is a commerce and finance career focused on money, accounting, markets, business performance and financial decisions.",
        whyChoose: "Stable demand, strong professional pathways and opportunities in business, banking and advisory services.",
        eligibility: "Class 12 Commerce is preferred, though some pathways are open to other streams.",
        path: "Class 12 -> B.Com/BBA/Economics or professional course -> Internship/articleship -> Job or certification.",
        fees: "Rs 50,000-15 Lakhs",
        environment: "Banks, accounting firms, financial institutions, corporates, consulting firms and government bodies.",
        salary: ["Rs 3-7 LPA", "Rs 7-20 LPA", "Rs 20-60+ LPA"],
        future: "Strong due to financial planning, taxation, digital banking, investment and compliance demand.",
        ai: "AI will automate routine accounting and reporting while increasing demand for advisory, analytics and judgement.",
        skills: ["Accounting", "Numeracy", "Financial Analysis", "Business Awareness", "Excel", "Ethics"],
        exams: ["CA Foundation", "CUET", "CMA Foundation", "CS Executive Entrance", "Bank Exams"],
        colleges: ["SRCC", "Hindu College", "St. Xavier's College", "Christ University", "NMIMS", "Loyola College"],
        opportunities: ["Accountant", "Analyst", "Auditor", "Tax Consultant", "Banking Officer"],
        recruiters: ["Deloitte", "EY", "KPMG", "PwC", "HDFC Bank", "ICICI Bank"],
        pros: ["Stable demand", "Professional certifications", "Business relevance", "Good growth"],
        cons: ["Detail-heavy work", "Exam difficulty", "Regulatory updates"]
    },
    psychology: {
        overview: "is a behavioural science career focused on understanding people, mental processes, emotions and wellbeing.",
        whyChoose: "Growing awareness of mental health, meaningful work and opportunities in schools, hospitals and organizations.",
        eligibility: "Class 12 in any stream for BA/B.Sc Psychology; higher qualifications are needed for clinical practice.",
        path: "Class 12 -> BA/B.Sc Psychology -> MA/M.Sc specialization -> Internship -> Practice, research or organizational role.",
        fees: "Rs 1-12 Lakhs",
        environment: "Schools, hospitals, clinics, counselling centers, NGOs, HR teams, research labs and private practice.",
        salary: ["Rs 2.5-6 LPA", "Rs 6-15 LPA", "Rs 15-40+ LPA"],
        future: "Strong due to mental wellness, education support, workplace wellbeing and behavioural research.",
        ai: "AI may support screening and tools, but human empathy, ethics and therapeutic skill remain central.",
        skills: ["Empathy", "Listening", "Research", "Ethics", "Assessment", "Communication"],
        exams: ["CUET", "University Entrance Tests", "TISS Entrance", "NET/JRF for Research"],
        colleges: ["Delhi University", "Christ University", "TISS", "Ambedkar University", "Fergusson College"],
        opportunities: ["Counsellor", "Research Assistant", "HR Specialist", "School Psychologist", "Wellness Consultant"],
        recruiters: ["Schools", "Hospitals", "NGOs", "Corporate HR Teams", "Research Organizations"],
        pros: ["Meaningful work", "Growing awareness", "Multiple settings", "Human-centered career"],
        cons: ["Requires higher study", "Emotional load", "Ethical responsibility"]
    },
    "ai-data-science": {
        overview: "is a data and artificial intelligence career focused on using data, algorithms and models to solve real-world problems.",
        whyChoose: "High-growth field, strong salaries, future-ready skills and opportunities across nearly every industry.",
        eligibility: "Class 12 with Mathematics is preferred; engineering, statistics, computer science or analytics degrees are common.",
        path: "Class 12 with Mathematics -> Degree in CS/Data/Stats/Engineering -> Projects -> Internship -> AI/Data role.",
        fees: "Rs 2-25 Lakhs",
        environment: "Technology companies, analytics teams, research labs, startups, product companies and consulting firms.",
        salary: ["Rs 5-12 LPA", "Rs 12-30 LPA", "Rs 30-90+ LPA"],
        future: "Excellent due to AI adoption, automation, data-driven decisions and intelligent products.",
        ai: "AI is the core of this field; professionals who understand data, models and deployment will remain in strong demand.",
        skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL", "Problem Solving"],
        exams: ["JEE Main", "CUET", "BITSAT", "University Entrance Tests", "GATE for PG"],
        colleges: ["IIT Madras", "IIT Delhi", "IIIT Hyderabad", "BITS Pilani", "IISc Bengaluru", "VIT Vellore"],
        opportunities: ["Data Scientist", "AI Engineer", "ML Engineer", "Data Analyst", "Research Associate"],
        recruiters: ["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Fractal", "Accenture"],
        pros: ["High demand", "Strong salaries", "Future-ready skills", "Global opportunities"],
        cons: ["Fast-changing tools", "Math and coding depth required", "Portfolio pressure"]
    },
    "media-communication": {
        overview: "is a media and communication career focused on storytelling, public information, digital content and audience engagement.",
        whyChoose: "Creative, public-facing work with opportunities in digital media, journalism, branding and entertainment.",
        eligibility: "Class 12 in any stream; communication, journalism, media or film degrees are useful.",
        path: "Class 12 -> Media/Journalism/Communication degree -> Portfolio/Internship -> Media role.",
        fees: "Rs 1-15 Lakhs",
        environment: "Newsrooms, agencies, production houses, digital platforms, corporate communication teams and studios.",
        salary: ["Rs 2.5-6 LPA", "Rs 6-15 LPA", "Rs 15-40+ LPA"],
        future: "Strong due to digital content, social platforms, brand storytelling and video-first communication.",
        ai: "AI will speed up editing, research and content drafts, while originality, credibility and audience judgement remain key.",
        skills: ["Writing", "Storytelling", "Research", "Editing", "Public Speaking", "Digital Tools"],
        exams: ["CUET", "IIMC Entrance", "XIC OET", "University Entrance Tests"],
        colleges: ["IIMC Delhi", "Jamia Millia Islamia", "Symbiosis Pune", "Christ University", "Xavier Institute of Communications"],
        opportunities: ["Journalist", "Content Creator", "PR Executive", "Video Producer", "Social Media Specialist"],
        recruiters: ["News Networks", "Digital Media Companies", "Advertising Agencies", "Production Houses", "Corporate Brands"],
        pros: ["Creative work", "Public impact", "Digital opportunities", "Portfolio-led growth"],
        cons: ["Deadline pressure", "Competitive industry", "Irregular schedules"]
    },
    architecture: {
        overview: "is a built-environment career focused on designing spaces, structures, communities and functional environments.",
        whyChoose: "Combines creativity, technical planning and real-world impact through buildings and urban spaces.",
        eligibility: "10+2 with Mathematics; architecture entrance exams are usually required.",
        path: "Class 12 with Mathematics -> NATA/JEE Paper 2 -> B.Arch/B.Planning -> Internship -> Practice.",
        fees: "Rs 2-20 Lakhs",
        environment: "Architecture studios, real estate firms, urban planning teams, construction companies and design consultancies.",
        salary: ["Rs 3-7 LPA", "Rs 7-18 LPA", "Rs 18-45+ LPA"],
        future: "Strong due to urbanization, sustainable design, infrastructure and smart-city development.",
        ai: "AI will support visualization and drafting, while design judgement, site understanding and client needs remain human-led.",
        skills: ["Design", "Drawing", "Spatial Thinking", "Software Tools", "Sustainability", "Project Coordination"],
        exams: ["NATA", "JEE Main Paper 2", "CUET", "University Entrance Tests"],
        colleges: ["SPA Delhi", "CEPT University", "IIT Kharagpur", "NIT Calicut", "Sir JJ College of Architecture"],
        opportunities: ["Architect", "Urban Planner", "Interior Designer", "Landscape Designer", "Project Coordinator"],
        recruiters: ["Architecture Firms", "Real Estate Developers", "Urban Planning Bodies", "Consultancies", "Construction Firms"],
        pros: ["Creative and technical", "Visible impact", "Freelance potential", "Sustainability focus"],
        cons: ["Long project cycles", "Client revisions", "Licensing requirements"]
    },
    education: {
        overview: "is an education career focused on teaching, learning design, student development and academic systems.",
        whyChoose: "Meaningful work, stable demand and opportunities in schools, colleges, training and education technology.",
        eligibility: "Class 12 followed by graduation; B.Ed, D.El.Ed, NET or specialization may be required for some roles.",
        path: "Class 12 -> Graduation -> Teaching/training qualification -> Internship/practice -> Education role.",
        fees: "Rs 50,000-10 Lakhs",
        environment: "Schools, colleges, coaching centers, EdTech companies, training teams, NGOs and policy organizations.",
        salary: ["Rs 2.5-6 LPA", "Rs 6-14 LPA", "Rs 14-35+ LPA"],
        future: "Strong due to online learning, skill development, inclusive education and lifelong learning.",
        ai: "AI will support lesson planning and assessment while human mentorship, classroom judgement and empathy remain essential.",
        skills: ["Teaching", "Communication", "Patience", "Curriculum Planning", "Assessment", "Mentoring"],
        exams: ["CTET", "TET", "CUET", "NET/JRF", "University Entrance Tests"],
        colleges: ["Delhi University", "Jamia Millia Islamia", "TISS", "Banaras Hindu University", "Regional Institutes of Education"],
        opportunities: ["Teacher", "Trainer", "Curriculum Developer", "Academic Coordinator", "Education Counsellor"],
        recruiters: ["Schools", "Colleges", "EdTech Companies", "NGOs", "Training Organizations"],
        pros: ["Meaningful impact", "Stable demand", "Mentorship role", "Multiple settings"],
        cons: ["Patience required", "Administrative workload", "Continuous curriculum updates"]
    },
    sports: {
        overview: "is a sports career focused on performance, coaching, health, fitness, competition and sports management.",
        whyChoose: "Active work, growing sports industry, fitness awareness and opportunities beyond professional playing.",
        eligibility: "Class 12 in any stream; fitness, sports science, coaching or physical education qualifications help.",
        path: "Class 12 -> Sports training/degree/certification -> Competition/internship -> Sports or fitness role.",
        fees: "Rs 50,000-12 Lakhs",
        environment: "Sports academies, schools, fitness centers, clubs, teams, leagues, media organizations and wellness companies.",
        salary: ["Rs 2-6 LPA", "Rs 6-15 LPA", "Rs 15-50+ LPA"],
        future: "Strong due to sports leagues, fitness culture, sports science and performance analytics.",
        ai: "AI will support performance tracking and analytics, while coaching judgement and physical skill remain human-centered.",
        skills: ["Discipline", "Fitness", "Coaching", "Teamwork", "Performance Analysis", "Communication"],
        exams: ["University Entrance Tests", "Physical Education Tests", "Sports Trials", "CUET"],
        colleges: ["Lakshmibai National Institute of Physical Education", "NSNIS Patiala", "Delhi University", "Amity University", "SRM University"],
        opportunities: ["Athlete", "Coach", "Trainer", "Sports Analyst", "Sports Manager"],
        recruiters: ["Sports Academies", "Schools", "Fitness Brands", "Sports Clubs", "Media Platforms"],
        pros: ["Active career", "Growing industry", "Multiple roles", "Performance-based growth"],
        cons: ["Physical demands", "Injury risk", "Competitive field"]
    }
};

function makeCareerDetail(career, domainId) {
    const template = templates[domainId] || templates.management;
    const name = career.name;

    return {
        id: career.id,
        name,
        overview: `${name} ${template.overview}`,
        whyChoose: `${name} offers ${template.whyChoose.charAt(0).toLowerCase()}${template.whyChoose.slice(1)}`,
        eligibility: template.eligibility,
        educationPath: template.path,
        feeRange: template.fees,
        workEnvironment: template.environment,
        salary: {
            fresher: template.salary[0],
            midLevel: template.salary[1],
            seniorLevel: template.salary[2]
        },
        futureScope: template.future,
        aiImpact: template.ai,
        skills: template.skills,
        entranceExams: template.exams,
        topColleges: template.colleges,
        careerOpportunities: template.opportunities,
        recruiters: template.recruiters,
        pros: template.pros,
        cons: template.cons,
        relatedCareers: []
    };
}

let careersIndex = readJSON("careers.json");

extraDomains.forEach((domain) => {
    if (!careersIndex.domains.some(item => item.id === domain.id)) {
        careersIndex.domains.push(domain);
    }
});

writeJSON("careers.json", careersIndex);

careersIndex = readJSON("careers.json");

careersIndex.domains.forEach((domain) => {
    const providedNames = careerLists[domain.id];
    const listData = readJSON(domain.file);

    if ((!listData.careers || listData.careers.length === 0) && providedNames) {
        writeJSON(domain.file, {
            domain: domain.name,
            careers: providedNames.map(name => ({
                id: slugify(name),
                name
            }))
        });
    }

    const currentList = readJSON(domain.file);
    const careers = currentList.careers || [];
    const detailFile = domain.file.replace(".json", "-details.json");
    const detailData = readJSON(detailFile);
    const existingDetails = detailData.careers || [];
    const detailById = new Map(existingDetails.map(item => [item.id, item]));
    const completedDetails = careers.map((career) => {
        const existing = detailById.get(career.id);

        if (existing) {
            return {
                ...makeCareerDetail(career, domain.id),
                ...existing,
                id: career.id,
                name: career.name || existing.name
            };
        }

        return makeCareerDetail(career, domain.id);
    });

    for (let index = 0; index < completedDetails.length; index += 1) {
        const related = completedDetails
            .filter(item => item.id !== completedDetails[index].id)
            .slice(0, 3)
            .map(item => item.name);

        completedDetails[index].relatedCareers =
            completedDetails[index].relatedCareers && completedDetails[index].relatedCareers.length > 0
                ? completedDetails[index].relatedCareers
                : related;
    }

    writeJSON(detailFile, {
        domain: detailData.domain || currentList.domain || domain.name,
        description: detailData.description || domain.description,
        careers: completedDetails
    });
});

writeJSON("exams.json", {
    exams: [
        {
            id: "jee-main",
            name: "JEE Main",
            description: "Engineering entrance exam for NITs, IIITs and many participating engineering institutions.",
            domain: "engineering"
        },
        {
            id: "jee-advanced",
            name: "JEE Advanced",
            description: "Entrance exam for admission to undergraduate programs at IITs.",
            domain: "engineering"
        },
        {
            id: "neet-ug",
            name: "NEET UG",
            description: "National entrance exam for MBBS, BDS and several allied healthcare programs.",
            domain: "medicine"
        },
        {
            id: "clat",
            name: "CLAT",
            description: "Law entrance exam for National Law Universities and legal education pathways.",
            domain: "law"
        },
        {
            id: "cuet",
            name: "CUET",
            description: "Common university entrance test for undergraduate admission in participating universities.",
            domain: "general"
        },
        {
            id: "uceed",
            name: "UCEED",
            description: "Design entrance exam for undergraduate design programs at participating institutes.",
            domain: "design"
        },
        {
            id: "nift",
            name: "NIFT Entrance",
            description: "Entrance pathway for fashion, design and related programs at NIFT campuses.",
            domain: "design"
        },
        {
            id: "nata",
            name: "NATA",
            description: "Aptitude test for admission to architecture programs in India.",
            domain: "architecture"
        },
        {
            id: "cat",
            name: "CAT",
            description: "Management entrance exam used by IIMs and many business schools.",
            domain: "management"
        },
        {
            id: "ctet",
            name: "CTET",
            description: "Teacher eligibility test for school teaching roles.",
            domain: "education"
        }
    ]
});

console.log("Career data completed.");
