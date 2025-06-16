// Some utils functions


export function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Error: Element with ID '${id}' not found for publication button functionality.`);
    }
    return element;
}