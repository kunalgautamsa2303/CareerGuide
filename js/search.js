/* =====================================================
   Career Guide v4.0
   Universal Search System
   Designed & Developed by Kunal Gautam
===================================================== */

const searchInput =
document.getElementById("careerSearch") ||
document.getElementById("searchInput");

const searchResults =
document.getElementById("searchResults") ||
document.getElementById("homeSearchResults");

if (searchInput && searchResults) {

    let careers = [];

    loadAllCareers();

    async function loadAllCareers() {

        const files = [

            "data/engineering-details.json",
            "data/medicine-details.json",
            "data/design-details.json",
            "data/finance-details.json",
            "data/management-details.json",
            "data/law-details.json",
            "data/psychology-details.json",
            "data/architecture-details.json",
            "data/media-details.json",
            "data/education-details.json",
            "data/sports-details.json"

        ];

        for (const file of files) {

            try {

                let filePath = file;

                if (window.location.pathname.includes("/pages/")) {

                    filePath = "../" + file;

                }

                const response =
                    await fetch(filePath);

                if (!response.ok) continue;

                const data =
                    await response.json();

                if (data.careers) {

                    data.careers.forEach(career => {

                        careers.push({

                            id: career.id,
                            name: career.name

                        });

                    });

                }

            }

            catch (error) {

                console.log(
                    `${file} not available`
                );

            }

        }

    }

    searchInput.addEventListener("input", () => {

        const searchTerm =
            searchInput.value
            .toLowerCase()
            .trim();

        if (searchTerm.length < 2) {

            searchResults.innerHTML = "";
            return;

        }

        const filtered =
            careers.filter(career =>
                career.name
                    .toLowerCase()
                    .includes(searchTerm)
            );

        if (filtered.length === 0) {

            searchResults.innerHTML = `
                <div class="search-item">
                    No careers found
                </div>
            `;

            return;

        }

        searchResults.innerHTML =
            filtered.slice(0, 15).map(career => `

                <div class="search-item"
                     onclick="openCareer('${career.id}')">

                    ${career.name}

                </div>

            `).join("");

    });

}

function openCareer(careerId) {

    if (
        window.location.pathname.includes("/pages/")
    ) {

        window.location.href =
            `career.html?id=${careerId}`;

    }

    else {

        window.location.href =
            `pages/career.html?id=${careerId}`;

    }

}
