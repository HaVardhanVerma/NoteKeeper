'use strict';

// Import module

import {
    generateID,
    findNotebook,
    findNotebookIndex,
    findNote,
    findNoteIndex 
} from "./utils.js";

// DB Object
let /**{Object} */ noteKeeperDB = {};


/**   
 * Initialize a local database. If the data exist in local storage, it is loaded;
 * Otherwise, a new empty database structure is created and stored 
*/

const initDB = function () {
    const /**{Object | undefined} */ db = localStorage.getItem('noteKeeperDB');

    if(db) { // it is not undefined | null
        noteKeeperDB = JSON.parse(db);
    }

    else {
        noteKeeperDB.notebooks = [];
        localStorage.setItem('noteKeeperDB', JSON.stringify(noteKeeperDB));
    }

    // console.log("This is db: ", db);
}

initDB();

// Read the current state of the global variable 'noteKeeperDB' from the local storage.

const ReadDB = function () {
    noteKeeperDB = JSON.parse(localStorage.getItem('noteKeeperDB'));
}

// Write the current state of the global variable 'noteKeeperDB' in the local storage.

const WriteDB = function () {
    localStorage.setItem('noteKeeperDB', JSON.stringify(noteKeeperDB));
} 

/**
 * Collection of functions for performing CRUF (Create, Read, Update, Delete) operations on database.
 * The database state is managed using global variables and local Storage.
 * 
 * @namespace
 * @property {Object} get - Functions for retrieving data from the database.
 * @property {Object} post - Functions for adding data to the database.
 * @property {Object} update - Functions for updating data in the database.
 * @property {Object} delete - Functions for deleting data from the database.
*/

export const db = {

    post: {

        /**
         * Adds a new notebook to the database.
         * 
         * @function 
         * @param {string} name - The nameof the new notebook.
         * @return {Object} The newly created notebook onject. 
        */

        notebook(name) {
            ReadDB();

            const /**{Object} */ notebookData = {
                id: generateID(),
                name,
                notes: []
            }

            noteKeeperDB.notebooks.push(notebookData);
            
            WriteDB();

            return notebookData;
        },

        /**
         * Adds a new note to a specified notebook in the database.
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook to add the note to.
         * @param {Object} object - The note object to add.
         * @returns {object} The newly created note object 
        */

        note(notebookId, object) {
            ReadDB();
            
            const /**{Object} */ notebook = findNotebook(noteKeeperDB, notebookId);

            const /**{Object} */ noteData = {
                id: generateID(),
                notebookId,
                ...object,
                postedOn: new Date().getTime()
            }

            console.log(noteData);
            notebook.notes.unshift(noteData);

            WriteDB();
            // console.log(noteKeeperDB);

            return noteData;
        }

    },

    get: {
        /**
         * Retrives all notebooks from the database
         * 
         * @function
         * @returns {Array<Object>} An array of notebook objects 
        */
       notebook() {
        ReadDB();

        return noteKeeperDB.notebooks;
       },

       note(notebookId) {

        ReadDB();

        const /**{Object} */ notebook = findNotebook(noteKeeperDB, notebookId);

        // console.log(notebook.notes);
        return notebook.notes;

       }
    },

    update: {
        /**
         * Updates the name of a notebook in the database.
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook to update.
         * @param {string} name - The new name for the notebook.
         * @return {object} The updated notebook object. 
        */
       notebook(notebookId, name) {
        ReadDB();

        const /**{Object} */ notebook = findNotebook(noteKeeperDB, notebookId);
        notebook.name = name; 

        WriteDB();

        return notebook;
       },

        /**
        *Updates the content of a note in the database. 
        * 
        * @function
        * @param {string} noteId - The ID of the note to update. 
        * @param {Object} object - The updated data for the note.
        * @returns {Object} The updated note object. 
        */
       
       note(noteId, object) {
        ReadDB();

        // console.log("Before: ", noteKeeperDB);

        const /**{Object} */ oldNote = findNote(noteKeeperDB, noteId);

        // console.log("This old note: ", oldNote);

        // console.log("Object: ", object);

        const /**{Object} */ newNote = Object.assign(oldNote, object);
        
        // console.log("This new note: ", newNote);

        WriteDB();
        // console.log("After: ", noteKeeperDB);

        return newNote;
       }
    },

    delete: {
        /**
         * Deletes a notebook from the database.
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook to delete. 
        */
        notebook(notebookId) {
            ReadDB();
            
            const /**{Number} */ notebookIndex = findNotebookIndex(noteKeeperDB, notebookId);
            // console.log("Index: ", notebookIndex);

            noteKeeperDB.notebooks.splice(notebookIndex, 1);

            WriteDB();
        },

        /**
         * Deletes a note from a specified notebook in the database.
         * 
         * @function
         * @param {string} notebookId - The ID of the notebook containing the note to delete.
         * @param {string} noteId - The ID the note to delete.
         * @returns {Array<Object>} An array of remaining notes in the notebook.
        */
       note(notebookId, noteId) {
        ReadDB();

        const /**{Object} */ notebook = findNotebook(noteKeeperDB, notebookId);

        const /**{number} */ noteIndex = findNoteIndex(notebook, noteId);

        notebook.notes.splice(noteIndex, 1);

        WriteDB();

        return notebook.notes;
       }
    }

};