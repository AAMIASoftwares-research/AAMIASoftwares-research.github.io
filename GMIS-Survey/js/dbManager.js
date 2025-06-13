let db = null;

async function initializeDatabase() {
    try {
        // Configure where sql-wasm.wasm is located.
        const SQL = await initSqlJs({
            locateFile: filename => `./sql.js-gh-pages/dist/${filename}`
        });
        console.log("sql.js initialized!");
        // Fetch your SQLite database file
        const dbFilePath = 'database.sqlite';
        const response = await fetch(dbFilePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch database file: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        console.log("Database loaded!");
        document.getElementById('results').textContent = "Database loaded successfully. Click the button again to query!";
    } catch (error) {
        console.error("Error initializing or loading database:", error);
        document.getElementById('results').textContent = `Error: ${error.message}`;
    }
}

/**
 * Executes a SQL query on the loaded database.
 * @param {string} query The SQL query string.
 * @returns {Array} The result of the db.exec() call.
 */
export function executeQuery(query) {
    if (!db) {
        throw new Error("Database not loaded. Call initializeDatabase() first.");
    }
    return db.exec(query);
}

// Optional: Function to close the database if needed
export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
        console.log("Database closed.");
    }
}
