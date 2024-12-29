
// Toggle pop-up visibility
const popups = ["noticePopup_header", "accountPopup_header"];

function togglePopup(buttonId, popupId) {
    const button = document.getElementById(buttonId);
    const popup = document.getElementById(popupId);

    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event from bubbling up

        // Close all other popups
        popups.forEach(id => {
            if (id !== popupId) {
                document.getElementById(id).style.display = 'none';
            }
        });

        // Toggle the current popup
        const isVisible = popup.style.display === 'block';
        popup.style.display = isVisible ? 'none' : 'block';
    });

    popup.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing when clicking inside popup
    });
}

document.addEventListener('click', () => {
    // Close all popups when clicking outside
    popups.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
});

// Initialize popups
togglePopup('noticeBtn_header', 'noticePopup_header');
togglePopup('accountBtn_header', 'accountPopup_header');