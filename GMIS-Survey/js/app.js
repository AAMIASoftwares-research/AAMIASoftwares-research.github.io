import { getElement } from './utils.js'

import { initializeDatabase, executeQuery } from './dbManager.js';
import { copyToClipboard } from './copyToClipboard.js';








// old

function queryDatabase() {
    // You don't need to check for 'db' directly here anymore.
    // executeQuery will throw an error if the database isn't initialized,
    // which our catch block can handle.
    const resultsElement = document.getElementById('results');

    try {
        const res = executeQuery("SELECT * FROM models ORDER BY RANDOM() LIMIT 1");
        console.log("Raw query result:", res);
        if (res.length > 0) {
            resultsElement.textContent = JSON.stringify(res, null, 2);
        } else {
            resultsElement.textContent = "No data found or table 'models' is empty.";
        }

    } catch (error) {
        console.error("Error executing query:", error);
        // Display a more helpful message if the DB wasn't loaded
        if (error.message.includes("Database not loaded")) {
            resultsElement.textContent = "Database not yet loaded. Please click 'Load DB & Show Raw Models Data' first and wait.";
        } else {
            resultsElement.textContent = `Error querying database: ${error.message}`;
        }
    }
}

// Event listener for the button
document.getElementById('loadAndQueryButton').addEventListener('click', async () => {
    const resultsElement = document.getElementById('results'); // Get results element here too for initial messages

    // The initializeDatabase function handles checking if it's already loaded internally.
    try {
        resultsElement.textContent = "Attempting to load database...";
        await initializeDatabase(); // Call the imported initializeDatabase
        resultsElement.textContent = "Database loaded. Now querying...";
        queryDatabase(); // Then, execute the query
    } catch (error) {
        console.error("Initialization failed:", error);
        resultsElement.textContent = `Error during database initialization: ${error.message}`;
    }
});











//
//
// In here, UI elements and logic gets connected
//
//


// Listener Setup for Publication-Specific Buttons
const bibtextArxiv = `@misc{moglia2025generalistmodelsmedicalimage,\r\n\
    title={\r\n\
        Generalist Models in Medical Image Segmentation:\r\n\
        A Survey and Performance Comparison with\r\n\
        Task-Specific Approaches\r\n\
    },\r\n\
    author={
        Andrea Moglia and Matteo Leccardi and Matteo\r\n\
        Cavicchioli and Alice Maccarini and Marco Marcon\r\n\
        and Luca Mainardi and Pietro Cerveri\r\n\
    },\r\n\
    year={2025},\r\n\
    eprint={2506.10825},\r\n\
    archivePrefix={arXiv},\r\n\
    primaryClass={eess.IV},\r\n\
    url={https://arxiv.org/abs/2506.10825},\r\n\
}`;
document.addEventListener('DOMContentLoaded', () => {
    const copyButtonArxiv = getElement('arxiv-bibtex-button'); 
    if (copyButtonArxiv) {
        const originalTextArxiv = copyButtonArxiv.textContent;
        copyButtonArxiv.addEventListener('click', () => {
            copyToClipboard(copyButtonArxiv, bibtextArxiv, originalTextArxiv);
        });
    }
});
// Close bibtex dialogue
document.addEventListener('DOMContentLoaded', () => {
    const closeBibtexButton = getElement('bibtex-close');
    const bibtextDialog = getElement('bibtex-container');
    if (closeBibtexButton) {
        closeBibtexButton.addEventListener('click', () => {
            bibtextDialog.style.visibility = 'hidden';
        });
    }
});


// Set and unset active tab
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('#main-tabs button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active-tab');
            });
            button.classList.add('active-tab');
        });
    });
});


// Set event for each tab button
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('#main-tabs button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentContainer = getElement('main-container');
            contentContainer.innerHTML = '<p>Clicked the ' + button.innerHTML + ' button. Content will be displayed here accordingly.';
        });
    });
});
