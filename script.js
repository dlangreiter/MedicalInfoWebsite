// script.js

document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim();

    if (query === "") {
        alert("Please enter a medical condition or emergency.");
        return;
    }

    fetchMedicalInfo(query);
});

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});

// Add at the beginning of fetchMedicalInfo function
function fetchMedicalInfo(query) {
    const formattedQuery = query.replace(/ /g, '_');
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedQuery}`;
    const infoSection = document.getElementById('infoSection');

    // Show loading message
    infoSection.innerHTML = `<p>Loading...</p>`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Medical condition not found.');
            }
            return response.json();
        })
        .then(data => {
            displayInfo(data);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function displayInfo(data) {
    const infoSection = document.getElementById('infoSection');
    infoSection.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.extract}</p>
        ${data.description ? `<p><strong>Type:</strong> ${data.description}</p>` : ''}
        ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}" />` : ''}
        ${data.content_urls ? `<p><a href="${data.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a></p>` : ''}
        ${getResponseGuidelines(data.title)}
    `;
}

function displayError(message) {
    const infoSection = document.getElementById('infoSection');
    infoSection.innerHTML = `<p class="error">${message}</p>`;
}

function getResponseGuidelines(title) {
    // Define response guidelines for specific emergencies
    const guidelines = {
        "Heart attack": `
            <h3>Appropriate Response:</h3>
            <ol>
                <li>Call emergency services immediately.</li>
                <li>Chew and swallow an aspirin if not allergic.</li>
                <li>Keep the person calm and have them sit down.</li>
                <li>If the person becomes unconscious, begin CPR if trained.</li>
            </ol>
        `,
        "Stroke": `
            <h3>Appropriate Response:</h3>
            <ol>
                <li>Call emergency services immediately.</li>
                <li>Note the time of symptom onset.</li>
                <li>Keep the person comfortable and monitor their condition.</li>
                <li>Do not give food or drink.</li>
            </ol>
        `,
        "Choking": `
            <h3>Appropriate Response:</h3>
            <ol>
                <li>Encourage the person to cough if they can.</li>
                <li>If coughing fails, perform the Heimlich maneuver.</li>
                <li>Call emergency services if the blockage isn't cleared.</li>
                <li>Begin CPR if the person becomes unconscious.</li>
            </ol>
        `,
        // Add more conditions and their guidelines as needed
    };

    const response = guidelines[title] || `
        <h3>Appropriate Response:</h3>
        <p>Please consult a healthcare professional for appropriate response guidelines.</p>
    `;

    return response;
}
