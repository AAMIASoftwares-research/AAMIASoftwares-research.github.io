// js/publicationButtons.js

// Private helper to get an element and log error if not found
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Error: Element with ID '${id}' not found for publication button functionality.`);
    }
    return element;
}

/**
 * Handles copying text to the clipboard for a publication-specific button.
 * @param {HTMLButtonElement} button The button element that triggered the copy.
 * @param {string} textToCopy The string of text to copy.
 * @param {string} originalButtonText The original text of the button, to revert to.
 */
async function handleCopyToClipboard(button, textToCopy, originalButtonText) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Publication text copied to clipboard:', textToCopy);
            button.textContent = 'Copied!';
        } else {
            console.warn('Clipboard API not available, used fallback method for publication button.');
        }
    } catch (err) {
        console.error('Failed to copy publication text to clipboard: ', err);
        button.textContent = 'Failed!';
        alert(`Failed to copy publication text. Error: ${err.message}`);
    } finally {
        setTimeout(() => {
            button.textContent = originalButtonText;
        }, 3000);
    }
}

// --- Direct Listener Setup for Publication-Specific Buttons ---

document.addEventListener('DOMContentLoaded', () => {
    const copyButtonArxiv = getElement('arxiv-bibtex-button'); 
    if (copyButtonArxiv) {
        const textToCopyArxiv = '@misc{moglia2025generalistmodelsmedicalimage,\ntitle={Generalist Models in Medical Image Segmentation: A Survey and Performance Comparison with Task-Specific Approaches}, \nauthor={Andrea Moglia and Matteo Leccardi and Matteo Cavicchioli and Alice Maccarini and Marco Marcon and Luca Mainardi and Pietro Cerveri},\nyear={2025},\neprint={2506.10825},\narchivePrefix={arXiv},\nprimaryClass={eess.IV},\nurl={https://arxiv.org/abs/2506.10825}, \n}';
        const originalTextArxiv = copyButtonArxiv.textContent;
        copyButtonArxiv.addEventListener('click', () => {
            handleCopyToClipboard(copyButtonArxiv, textToCopy, originalTextArxiv);
        });
    }

    console.log("Publication button listeners initialized.");
});

// No need to export anything, as app.js will just import this for its side effects.