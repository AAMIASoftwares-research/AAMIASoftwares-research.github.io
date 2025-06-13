import { initializeDatabase, executeQuery } from './dbManager.js';

function queryDatabase() {
    if (!db) {
        document.getElementById('results').textContent = "Database not loaded yet. Please wait or check for errors.";
        return;
    }

    try {
        // Select first 5 rows from the 'models' table
        const res = db.exec("SELECT * FROM models LIMIT 2");

        console.log("Raw query result:", res);

        const resultsElement = document.getElementById('results');

        if (res.length > 0) {
            // Convert the result object to a nicely formatted JSON string
            // The third argument (2) indents the JSON for readability
            resultsElement.textContent = JSON.stringify(res, null, 2);
        } else {
            resultsElement.textContent = "No data found or table 'models' is empty.";
        }

    } catch (error) {
        console.error("Error executing query:", error);
        document.getElementById('results').textContent = `Error querying database: ${error.message}`;
    }
}

// Event listener for the button
document.getElementById('loadAndQueryButton').addEventListener('click', async () => {
    // If DB is not loaded, load it first
    if (!db) {
        await initializeDatabase();
    }
    // Then, execute the query
    queryDatabase();
});
