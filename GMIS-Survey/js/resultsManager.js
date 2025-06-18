import { executeQuery, getTableColumns } from './dbManager.js';
import { 
    dropdownButtonGetAllInnerOptions, 
    updateDropdownButtonArrow,
    addEventListenerToDropdownButtonMultiSelect 
    } from './dropdownMenusManager.js';


function getAllUniqueElementsInColumn(column, table) {
    // get all elements
    let list_of_objects = executeQuery(`SELECT ${column} FROM ${table};`)
    list_of_objects = list_of_objects[0]['values'].map(element => element[0]);
    // make a list with all of them together
    let full_list = []
    list_of_objects.forEach(element => {
        let divided_element = element.split(', ');
        full_list = full_list.concat(divided_element);
    });
    // keep unique ones, order alphabetical
    let unique_sorted_list = [...new Set(full_list)].sort();
    return unique_sorted_list;
}

function compileChoicesIntoDropdownButton(list_of_choices) {
    list_of_choices = list_of_choices.map(
        element => '<button>' + element + '</button>'
    );
    return list_of_choices.join(` `);
}

function refillButton(button, list_of_values) {
    // - remove options buttons
    const existingButtons = dropdownButtonGetAllInnerOptions(button);
    existingButtons.forEach(button => {
        button.remove();
    });
    // - add new option buttons
    const options_container = button.parentNode.querySelector('div.dropdown-content');
    const new_content = compileChoicesIntoDropdownButton(list_of_values);
    options_container.insertAdjacentHTML('beforeend', new_content);
    // Arrow
    updateDropdownButtonArrow(button);
}


export function resultsSetup() {
    // When datasets button is pressed, and an option is selected,
    // update the content and choices of the selection button.
    // - button text
    // - button content
    const organs_or_dataset_button = document.querySelector('button#dropdown-dataset-organ-button');
    const organs_or_dataset_choices_buttons = dropdownButtonGetAllInnerOptions(organs_or_dataset_button);
    const object_multichoice_button = document.querySelector('button#dropdown-specific-dataset-organ-button');
    const object_multichoice_container = object_multichoice_button.parentNode.querySelector('div.dropdown-content');
    
    // - get all datasets
    let all_datasets = getAllUniqueElementsInColumn('Name', 'Datasets');

    // get all organs
    let all_organs = getAllUniqueElementsInColumn('Objects', 'Datasets');

    // get all main anatomical structures
    let all_main_anatomical_structures = getAllUniqueElementsInColumn('"Main Anatomical Structure"', 'Datasets');

    // get all main anatomical structures
    let all_anatomical_regions = getAllUniqueElementsInColumn('"Region"', 'Datasets');

    let content_dict = {
        'Organs': all_organs,
        'Datasets': all_datasets,
        'Main Anatomical Structure': all_main_anatomical_structures,
        'Anatomical Region': all_anatomical_regions,
    }

    // Now, based on the user choice on the organs_or_dataset_button, 
    // we change content of object_multichoice_button
    organs_or_dataset_choices_buttons.forEach(first_btn => {
        first_btn.addEventListener('click', () => {
            // Content
            let choice = first_btn.innerHTML;
            // refill second button
            refillButton(object_multichoice_button, content_dict[choice]);
            // Name
            let name = `Select ${choice}`;
            let name_element = object_multichoice_button.querySelector('span.dropbtn-text');
            name_element.innerHTML = name;
        });
    });


    // Other filters include framework, architecture, and release date
    let all_frameworks = getAllUniqueElementsInColumn('Framework', 'Models');
    
    let all_architectures = getAllUniqueElementsInColumn('Architecture', 'Models');

    let all_visual_backbones = getAllUniqueElementsInColumn('"Visual Backbone"', 'Models');

    let all_release_dates = getAllUniqueElementsInColumn('"First Publication Date"', 'Models');
    all_release_dates = [...new Set(all_release_dates.map(element => element.split('-')[0]) )];
    
    // - put values into buttons
    const frameworks_button = document.querySelector('button#results-model-filter-framework');
    const architecture_button = document.querySelector('button#results-model-filter-architecture');
    const visual_backbone_button = document.querySelector('button#results-model-filter-visual-backbone');
    const release_dates_button = document.querySelector('button#results-model-filter-release-date');

    const buttons = [frameworks_button, architecture_button, visual_backbone_button, release_dates_button];
    const lists = [all_frameworks, all_architectures, all_visual_backbones, all_release_dates];
    buttons.forEach((button, i) => {
        refillButton(button, lists[i]);
        if (lists[i].length <= 5) {
            const searchbox = button.parentNode.querySelector("div.search-input");
            searchbox.classList.add('hidden');
        }
    });

}