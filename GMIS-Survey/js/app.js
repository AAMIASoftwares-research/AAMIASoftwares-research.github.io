import { initializeDatabase, executeQuery } from './dbManager.js';
import { exportBibtexSetup } from './exportBibtexManager.js';

import { tabsManagerSetup } from './tabsManager.js';







// old tests

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


// Citations export Manager
exportBibtexSetup();

// Tabs Manager

tabsManagerSetup();