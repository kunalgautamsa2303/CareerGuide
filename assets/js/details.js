document.addEventListener("DOMContentLoaded", () => {
    loadCareer();
});

async function loadCareer() {

    // Read the ID from the URL
    const params = new URLSearchParams(window.location.search);
    const careerId = Number(params.get("id"));

    // Load careers.json
    const response = await fetch("../data/careers.json");
    const careers = await response.json();

    // Find the selected career
    const career = careers.find(c => c.id === careerId);

    // If no career is found
    if (!career) {
        document.getElementById("careerTitle").textContent = "Career Not Found";
        document.getElementById("careerDescription").textContent =
            "The requested career does not exist.";
        return;
    }

    // Display the career
    document.getElementById("careerTitle").textContent = career.title;
    document.getElementById("careerDescription").textContent = career.description;
}