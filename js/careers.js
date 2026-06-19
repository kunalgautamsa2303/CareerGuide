document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch the JSON data
        const response = await fetch("../data/careers.json");
        if (!response.ok) {
            throw new Error("Failed to load career data.");
        }
        const data = await response.json();

        // Get the container for domains
        const container = document.getElementById("domainContainer");

        // Ensure container exists before proceeding
        if (!container) {
            console.error("domainContainer not found in the HTML.");
            return;
        }

        // Clear existing content if any
        container.innerHTML = "";

        // Iterate over each domain and create cards
        data.domains.forEach(domain => {
            const card = document.createElement("div");
            card.className = "domain-card";
            card.innerHTML = `
                <div class="icon">${domain.icon}</div>
                <h4>${domain.name}</h4>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading careers:", error);
    }
});