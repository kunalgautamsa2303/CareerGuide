document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response =
            await fetch("../data/careers.json");

        const data =
            await response.json();

        const container =
            document.getElementById("domainContainer");

        container.innerHTML = "";

        data.domains.forEach(domain => {

            const card =
                document.createElement("div");

            card.className =
                "domain-card";

            card.innerHTML = `
                <div class="icon">
                    ${domain.icon}
                </div>

                <h4>
                    ${domain.name}
                </h4>
            `;

            card.addEventListener("click", () => {

                window.location.href =
                    `career-domain.html?id=${domain.id}`;

            });

            container.appendChild(card);

        });

    }

    catch(error){

        console.error(
            "Error loading careers:",
            error
        );

    }

});

