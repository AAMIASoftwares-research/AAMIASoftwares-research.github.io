import { startDatabase, executeQuery } from './dbManager.js';
import { exportBibtexSetup } from './exportBibtexManager.js';

import { tabsManagerSetup } from './tabsManager.js';
import { dropdownMenuSetup } from './dropdownMenusManager.js';

//
//
// In here, UI elements and logic gets connected
//
//

// First, load the database
startDatabase();


// Citations export Manager
exportBibtexSetup();

// Tabs Manager
tabsManagerSetup();

// Dropdown menus
dropdownMenuSetup();