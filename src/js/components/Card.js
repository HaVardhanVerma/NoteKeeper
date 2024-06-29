'use strict';

/**
 * Import module 
*/

import {
    Tooltip
} from "./Tooltip.js";

import {
    getRelativeTime
} from "../utils.js";

import {
    DeleteConfirmModal,
    NoteModal
} from "./Modal.js";

import { client } from "../client.js";

import {
    db
} from "../db.js";

/**
 * Creates an HTML card element representing a note based on provided note data.
 * 
 * @param {Object} noteData - Data representing the note to be displayed in the card.
 * @returns {HTMLElement} - The generated card element.
*/


// console.log("This: ", noteData);

export const Card = function (noteData) {
    console.log("This: ", noteData);
    const {id, title, text, postedOn, notebookId} = noteData;

    const /**{HTMLElelemnt} */ $card = document.createElement('div');
    $card.classList.add('card');

    $card.setAttribute('data-note', id);

    $card.innerHTML = `
        <h3 class="card-title text-title-medium">${title}</h3>

        <p class="card-text text-body-large">${text}</p>

        <div class="wrapper">
            <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>
    
            <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-note>
                <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                <div class="state-layer"></div>
            </button>      
        </div>
                
        <div class="state-layer"></div>
    `;

    Tooltip($card.querySelector('[data-tooltip]'));

    /**
     * Note detail view & edit functionality
     * 
     * Attaches a click event listener to card element.
     * When the card is clicked, it opens a modalwith the note's detail and allows for updating the note. 
    */
   $card.addEventListener('click', function () {
    // console.log("title: ", noteData.title, " text: ", noteData.text);
    const /**{Object} */ modal = NoteModal(title, text, getRelativeTime(postedOn));
    modal.open();

    modal.onSubmit(function (noteData) {

        const updatedData = db.update.note(id, noteData);

        // Update the note in the client UI
        client.note.update(id, updatedData);

        modal.close();
    });
   });

   /**
    * Note delete functionality
    * 
    * Attaches a click event listener to delete button elelemnt within card.
    * When the delete button is clicked, it opens a confirmation madal for deleting the associated note.
    * if the deletion is confirmed, it updates the UI and database to remove the note. 
    */
   const /**{HTMLElement} */ $deleteBtn = $card.querySelector('[data-delete-note]');

   $deleteBtn.addEventListener('click', function (event) {
    event.stopImmediatePropagation();

    const /**{Object} */ modal = DeleteConfirmModal(title);

    modal.open();

    modal.onSubmit(function (isConfirm) {
        if(isConfirm) {
            const /**{Array} */ existedNotes = db.delete.note(notebookId, id);

            // Update the client ui to reflect note deletion.
            client.note.delete(id, existedNotes.length);
        }

        modal.close();
    })

   })
    return $card;
}