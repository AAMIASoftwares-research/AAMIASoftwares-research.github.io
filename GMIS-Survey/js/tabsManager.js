import { formatTable } from "./tablesFormatter.js";


export function tabsManagerSetup() {
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
                const contentContainer = document.getElementById('main-container');
                contentContainer.innerHTML = '<p>Clicked the ' + button.innerHTML + ' button. Content will be displayed here accordingly.';
                if (button.innerHTML == 'Results') {
                    contentContainer.innerHTML = contentContainer.innerHTML + formatTable();
                } 
            });
        });
    });


}
