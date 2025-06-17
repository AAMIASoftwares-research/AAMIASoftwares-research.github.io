// instructions:
// 
// The following will work automatically across the whole document
// if you follow the prototype
// (class name is important, ids are not and can be changet at will)
// class 'single' and 'multi' determine the underlying logic.
// 
// <div class="dropdown">
//     <button class="dropbtn" id="dropdown-dataset-organ-button">Choose...</button>
//     <div id="dropdown-dataset-organ-curtain" class="dropdown-content multi">
//         <button>Datasets</button>
//         <button>Organs</button>
//     </div>
// </div>






export function dropdownMenuSetup() {
    // general logic
    // multi-select logic
    document.addEventListener('DOMContentLoaded', () => {
        const dropdown_buttons = document.querySelectorAll('div.dropdown-content.multi > button');
        dropdown_buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('selected')) {
                    button.classList.remove('selected');
                } else {
                    button.classList.add('selected');
                }
                // put count of selected items in th ebutton
                const parent_parent_div = button.parentNode.parentNode;
                const main_button = parent_parent_div.querySelector('button.dropbtn');
                main_button.innerHTML = main_button.innerHTML.split(' (')[0];
                const all_selected_items = button.parentNode.querySelectorAll('button.selected');
                if (all_selected_items.length() != 0) {
                    main_button.innerHTML += ` (${all_selected_items.length()})`;
                }
            });
        });
    });

    // single select logic
    document.addEventListener('DOMContentLoaded', () => {
        const dropdown_buttons = document.querySelectorAll('div.dropdown-content.single > button');
        dropdown_buttons.forEach(button => {
            button.addEventListener('click', () => {
                // get parent div, then all button children
                const parentDiv = button.parentNode;
                const allButtons = parentDiv.querySelectorAll('button');
                // remove 'selected' from all these
                allButtons.forEach(btn => {
                    btn.classList.remove('selected');
                });
                // put selected only on this one
                button.classList.add('selected');
                // Set name of dropdown main button to the selected object
                const parent_parent_div = parentDiv.parentNode;
                const main_button = parent_parent_div.querySelector('button.dropbtn');
                main_button.innerHTML = button.innerHTML;
            });
        });
    });

    // all dropdown main buttons hide/whow
    document.addEventListener('DOMContentLoaded', () => {
        const all_dropdown_buttons = document.querySelectorAll('.dropbtn');
        all_dropdown_buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // get parent div
                const par_div = btn.parentNode;
                // select the dropdown div of that div
                const dropdown = par_div.querySelector('div.dropdown-content');
                // implement logic
                if (dropdown.style.visibility == "") {
                    dropdown.style.visibility = "visible";
                } else if (dropdown.style.visibility == "hidden") {
                    dropdown.style.visibility = "visible";
                } else {
                    dropdown.style.visibility = "hidden";
                }
            });
            
        });
    });
}