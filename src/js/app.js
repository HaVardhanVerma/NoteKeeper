'use strict';

// Module import

import {
    addEventOnElements,
    getGreetingMsg,
    activeNotebook,
    makeElemEditable
} from "./utils.js";

import {
    db
} from "./db.js";

import {
    Tooltip
}from "./components/Tooltip.js";

import {
    client
} from "./client.js";

import {
    NoteModal
} from "./components/Modal.js";

// toggle sidebar in small screen

const /**{HTMLElement} */ $sidebar = document.querySelector('[data-sidebar]');

const /**{Array<HTMLElement>} */ $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');

const /**{HTMLElement} */ $overlay = document.querySelector('[data-sidebar-overlay]');

console.log($sidebarTogglers);

addEventOnElements($sidebarTogglers, 'click', () => {
    $sidebar.classList.toggle('active');
    $overlay.classList.toggle('active'); 
})

const /**{HTMLElement} */ $greetElem = document.querySelector('[data-greeting]');

const /**{number} */ currentHour = new Date().getHours();

// console.log("$greeting", $greetElem);
// console.log("greeting", greetElem);
// console.log("Hours", currentHour);

$greetElem.textContent = getGreetingMsg(currentHour);

/**
 * Initialize tooltip behaviour for all DOM elements with 'data-tooltip' attribute
*/

const /**{Array<HTMLElement} */ $toolTipElem = document.querySelectorAll('[data-tooltip]');
// console.log($toolTipElem);

$toolTipElem.forEach($elem => Tooltip($elem));


/**
 * Show current date on homepage
*/

const /**{HTMLElement} */ $currntDateElem = document.querySelector('[data-current-date]')

$currntDateElem.textContent = new Date().toDateString().replace(' ', ', ')

// console.log($currntDateElem);
// console.log(currentDate);

const /**{HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');

// console.log($sidebarList);

const /**{HTMLElement} */ $addNotebookBtn = document.querySelector('[data-add-notebook]');

// console.log($addNotebookBtn);

/**
 * shows a notebook creation field in the sidebar when the "Add Notebook" button is clicked
 * The function dynamically adds a new notebook field element, makes it editable, and listen for
 * the 'Enter' key to create a new notebook when pressed 
*/

const showNotebookField = function () {
    const /**{HTMLElement} */ $navItem = document.createElement('div');

    $navItem.classList.add('nav-item');

    $navItem.innerHTML = `
        <span class="text text-label-large" data-notebook-field></span>

        <div class="state-layer"></div>
    `;

    $sidebarList.appendChild($navItem);
    const /**{HTMLElement} */ $navItemField = $navItem.querySelector('[data-notebook-field]'); //We use $navItem to select the data-notebook-field instead of document because while select by the document it gives the odd / previous data-notebook-field but we need new. That's why we ude the $navItem to select the data-notebook-field.

    // console.log("This: ", $navItemField);

    // $navItem.addEventListener('click', activeNotebook);
    activeNotebook.call($navItem);

    makeElemEditable($navItemField);

    $navItemField.addEventListener('keydown', createNotebook);
}

$addNotebookBtn.addEventListener('click', showNotebookField);

/**
 * create new notebook
 * Creates a new notebook when the 'Enter' key is pressed while editing a notebook name field.
 * The new notebook is stored in the database.
 * @param {KeyboardEvent} event - The keyboard event that triggered notebook creation.
*/

const createNotebook = function (event) {
    // console.log(event.key === 'Enter');

    if(event.key === 'Enter') {
        // store new created notebook in database.
        const/**{Object} */ notebookData = db.post.notebook(this.textContent || 'untitled'); //this: $navItemField
        this.parentElement.remove();

        // Render the navItem
        client.notebook.create(notebookData);
    }
}

/**
 * Renders the existing notebook list by retrieving data from the database and passing it to the client. 
*/

const renderExistedNotebook = function () {
    const /**{Array} */ notebookList = db.get.notebook();
    // notebookList.forEach(element => client.notebook.create(element));
    client.notebook.read(notebookList);
}

renderExistedNotebook();

/**
 * Create new note
 * 
 * Attaches event listeners to a collection of DOM elements representing "Create Note" buttons.
 * When a button is clicked, it opens a modal for creating a new note and handles the submission
 * of the new note to the database and client. 
*/

const /**{HTMLElement} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
// console.log($noteCreateBtns);

addEventOnElements($noteCreateBtns, 'click', function () {
    // Create and open a new modal
    const /**{HTMLElement} */ modal = NoteModal();
    modal.open();

    modal.onSubmit(noteObj => {
        const /**{string} */ activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

        // console.log(noteObj);
        // console.log(activeNotebookId);

        const /**{Object} */ noteData = db.post.note(activeNotebookId, noteObj);
        
        client.note.create(noteData);
        modal.close();
    })

});

const renderExistedNote = function () {
    const /**{string | undefined} */ activeNotebookId = document.querySelector('[data-notebook].active')?.dataset.notebook;

    console.log(activeNotebookId);

    if(activeNotebookId) {
        const /**{Array<Object>} */ noteList = db.get.note(activeNotebookId);

        // console.log(noteList);

        // Display existing note
        client.note.read(noteList);
    }
}

renderExistedNote();
