document.addEventListener("DOMContentLoaded", loadCareers);

async function loadCareers() {

    const response = await fetch("data/careers.json");
    const careers = await response.json();

    const careerGrid = document.getElementById("careerGrid");

    careerGrid.innerHTML = "";

    careers.forEach(career => {

        careerGrid.innerHTML += `

        <div class="col-md-6 col-lg-4">

            <div class="card h-100 shadow-sm border-0 rounded-4 p-3 career-card"
                 onclick="openCareer(${career.id})"
                 style="cursor:pointer;">

                <div class="display-4">
                    ${career.icon}
                </div>

                <h4 class="mt-3">
                    ${career.title}
                </h4>

                <p class="text-muted">
                    ${career.specializations} Specializations
                </p>

                <button class="btn btn-outline-primary mt-auto">
                    Explore
                </button>

            </div>

        </div>

        `;

    });

}

function openCareer(id){

    window.location.href = `pages/career.html?id=${id}`;

}