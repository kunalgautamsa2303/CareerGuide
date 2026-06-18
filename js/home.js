// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadCareers();
});

// Load careers from JSON
async function loadCareers() {

    try {

        // Read careers.json
        const response = await fetch("data/careers.json");

        // Convert JSON into JavaScript objects
        const careers = await response.json();

        // Select the container
        const careerGrid = document.getElementById("careerGrid");

        // Clear existing content
        careerGrid.innerHTML = "";

        // Create one card for each career
        careers.forEach(career => {

            careerGrid.innerHTML += `
                <div class="category-card">

                    <div style="font-size:40px;">
                        ${career.icon}
                    </div>

                    <span>${career.title}</span>

                    <small>${career.specializations} Specializations</small>

                </div>
            `;

        });

    }

    catch(error){

        console.error("Unable to load careers.", error);

    }

}