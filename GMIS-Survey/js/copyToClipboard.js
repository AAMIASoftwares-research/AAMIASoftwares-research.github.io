/**
 * Handles copying text to the clipboard for a publication-specific button.
 * @param {HTMLButtonElement} button The button element that triggered the copy.
 * @param {string} textToCopy The string of text to copy.
 * @param {string} originalButtonText The original text of the button, to revert to.
 */
export async function copyToClipboard(button, textToCopy, originalButtonText) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Publication text copied to clipboard:', textToCopy);
            button.textContent = 'Copied!';
        } else {
            console.warn('Clipboard API not available, used  method for publication button.');
            const bibtextDialog = document.getElementById('bibtex-container');
            bibtextDialog.style.visibility = 'visible';
            const bibtextTextarea = document.getElementById('bibtex-textarea');
            bibtextTextarea.value = textToCopy
        }
    } catch (err) {
        console.error('Failed to copy publication text to clipboard: ', err);
        button.textContent = 'Failed!';
    } finally {
        setTimeout(() => {
            button.textContent = originalButtonText;
        }, 3000);
    }
}

