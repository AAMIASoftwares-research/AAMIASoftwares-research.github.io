var lastClickedTabButton = document.getElementById('main-models').innerHTML;

function hideSubelementsExcept(object, css_identifier) {
    const childern = object.querySelectorAll(':scope > div');
    const to_show = object.querySelectorAll(css_identifier);
    childern.forEach(c => {
        c.style.display = "none";
    });
    to_show.forEach(c => {
        c.style.display = "block";
    });
}

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
    // setup first view (same as case models)
    document.addEventListener('DOMContentLoaded', () => {
        const contentContainer = document.getElementById('main-container');
        hideSubelementsExcept(contentContainer, "div#empty-table");
    });
    // Set event for each tab button
    document.addEventListener('DOMContentLoaded', () => {
        const tabButtons = document.querySelectorAll('#main-tabs button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const contentContainer = document.getElementById('main-container');
                if (lastClickedTabButton != button.innerHTML) {
                    // if different do something
                    lastClickedTabButton = button.innerHTML;
                    let buttonName = button.innerHTML;
                    switch (buttonName) {
                        case 'Models':
                            hideSubelementsExcept(contentContainer, "div#empty-table");
                            break;
                        case 'Datasets':
                            hideSubelementsExcept(contentContainer, "div#empty-table");
                            break;
                        case 'Results':
                            hideSubelementsExcept(contentContainer, "div#results");
                            break;
                        default:
                            hideSubelementsExcept(contentContainer, "div#empty-table");
                            break;
                    }
                }
            });
        });
    });


}
