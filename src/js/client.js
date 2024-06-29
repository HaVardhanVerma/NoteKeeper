'use strict';

import {
    NavItem
} from "./components/NavItem.js";

import {
    activeNotebook
} from "./utils.js";

import {
    Card
} from "./components/Card.js";

const /**{HTMLElement} */ $sidebarList = document.querySelector('[data-sidebar-list]');

const /**{HTMLElement} */ $notePanelTitle = document.querySelector('[data-note-panel-title]');

const /**{Array<HTMLElement>} */ $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

const /**{HTMLElement} */ $notePanel = document.querySelector('[data-note-panel]');
// console.log($notePanel);

// console.log($notePanelTitle);

/**
 * The client object manages interactions with the user interface (UI) to create, read, update, and delete notebooks and notes.
 * It provides functions for performing these operations and updating the UI accordingly.
 * 
 * @namespace
 * @property {Object} notebook - functions for managing notebooks in the UI.
 * @property {Object} note - functions for managing notes in the UI. 
*/

const /**{string} */ emptyNotesTemplate = `
    <div class="empty-notes">
        <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>

        <div class="text-headline-small">No notes</div>
    </div>
`;

/**
 * Enables or disables "Create Note" buttons based on whether there are any notebooks.
 * 
 * @param {boolean} isThereAnyNotebook - Indicate wheather there are any notrbooks.
*/

const disableNoteCreateBtns = function (isThereAnyNotebook) {
    $noteCreateBtns.forEach($item => {
        $item[isThereAnyNotebook ? 'removeAttribute' : 'setAttribute']('disabled', '');
    })
}

export const client = {

    notebook: {
        /**
         * Creates a new notebook in the UI, based on provided notebook data.
         * 
         * @param {Object} notebookData - Data representing the new notebook. 
        */
       create(notebookData) {
        const /**{HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);
        $sidebarList.appendChild($navItem);
        activeNotebook.call($navItem);
        $notePanelTitle.textContent = notebookData.name;
        $notePanel.innerHTML = emptyNotesTemplate;
        disableNoteCreateBtns(true);
       },

       /**
        * Reads and display a list of notebooks in the UI.
        * 
        * @param {Array<Object>} notebookList - Liat of notebook data to display. 
        */

       read(notebookList) {

        disableNoteCreateBtns(notebookList.length);

        notebookList.forEach((notebookData, index) => {
            const /**{HTMLElement} */ $navItem = NavItem(notebookData.id, notebookData.name);

            if(index === 0){
                activeNotebook.call($navItem);
                $notePanelTitle.textContent = notebookData.name;
            }

            $sidebarList.appendChild($navItem);
        });  
       },

       /**
        * Updates the UI to reflect changes in the notebook.
        * 
        * @param {string} notebookId - ID of the notebook to update.
        * @param {object} notebookData - New data for the notebook.
        */

       update(notebookId, notebookData) {
            const /**{HTMLElement} */ $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);

            const /**{HTMLElement} */ $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebarList.replaceChild($newNotebook, $oldNotebook);
            activeNotebook.call($newNotebook);
        },

        /**
         * Deletes a notebook from the UI.
         * 
         * @param {string} notebookId - ID of the notebook to delete.
        */

        delete(notebookId) {
            const /**{HTMLElement} */ $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            
            const /**{HTMLElement | null} */ $activeNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            // console.log($activeNavItem.firstElementChild);

            // activeNotebook.call($activeNavItem);
            // $notePanelTitle.textContent = $activeNavItem.firstElementChild.textContent;

            if($activeNavItem) {
                $activeNavItem.click();
            }

            else{
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreateBtns(false);
            }

            $deletedNotebook.remove();

        }
       
    },
    
    note: {
        /**
         * Creates a new card in the UI based on provided note data.
         * 
         * @param {Object} noteData - Data representing a new note. 
        */
       create(noteData) {

        // Clear 'emptyNotesTemplate' from 'notePanel' if there no note exists
        if(!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';

        // Append card in notePanel
        const /**{HTMLElement} */ $card = Card(noteData);

        $notePanel.prepend($card);

       },

       /**
        * Reads and display a list of notes in the UI.
        * 
        * @param {Array<Object>} noteList - List of note data to display.
        */
       read(noteList) {

        if(noteList.length) {
            $notePanel.innerHTML = '';

            noteList.forEach(noteData => {
                const /**{HTMLElement} */ $card = Card(noteData);
                $notePanel.appendChild($card);
    
                NavItem()
            });
        }

        else {
            $notePanel.innerHTML = emptyNotesTemplate;
        }
       },

       /**
        * Updates a note card in the UI based on provided note data.
        * 
        * @param {string} noteId - ID of the note update. 
        * @param {Object} noteData - New data for the note.
        */

       update(noteId, noteData) {
        const /**{HTMLElement} */ $oldCard = document.querySelector(`[data-note="${noteId}"]`);

        const /**{HTMLElement} */ $newCard = Card(noteData);
        $notePanel.replaceChild($newCard, $oldCard);
       },

       /**
        * Deletes a note card from the UI.
        * 
        * @param {string} noteId - ID of the note to delete.
        * @param {boolean} isNoteExists - Indicates whether other notes still exist.
        */
       delete(noteId, isNoteExists) {
        document.querySelector(`[data-note="${noteId}"]`).remove();
        if(!isNoteExists) {
            $notePanel.innerHTML = emptyNotesTemplate;
        }
       }
    }


}