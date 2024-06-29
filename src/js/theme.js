'use strict';

function toggleTheme() {

    const /**{string} */ currentTheme = document.documentElement.getAttribute('data-theme');
    // console.log("currentTheme", currentTheme);

    const /**{string} */ newtheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newtheme);

    localStorage.setItem('theme', newtheme); 

}

/**
 * Initialize the current theme
*/

const /**{string | null} */ storedTheme = localStorage.getItem('theme');

// console.log("Local-storage", storedTheme);

const /**{Boolen} */ systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// console.log(systemThemeIsDark);

const /**{string} */ initialTheme = storedTheme ?? (systemThemeIsDark ? 'dark' : 'light');

// console.log(initialTheme);

document.documentElement.setAttribute('data-theme', initialTheme);

// console.log(document.documentElement);

/**
 * Attach toggleTheme to theme button click event
*/

window.addEventListener('DOMContentLoaded', function (){

    const /**{HTMLElement} */ $themeBtn = document.querySelector('[data-theme-btn]');
    // console.log($themeBtn);

    if($themeBtn) $themeBtn.addEventListener('click', toggleTheme);

})