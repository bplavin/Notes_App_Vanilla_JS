"use strict";
let data = [];
let filteredData = [];
let usersData = [];
let arrOfId = [];

let numberPerPage = 20;
const NOTE_BOX = "paragraphBox";

fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(commits => {
        for (let commit of commits) {
            data.push(commit);
        };
        filteredData = data;
        createPaginationButtons(filteredData);
    });

fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        for (let user of users) {
            usersData.push(user);
            createUsersCheckBox(user);
        }
    });

function addTextNote(text) {
    text = '';
    let tranferText = document.getElementById('typeSomething').value += text;
  
    let paragraph = document.createElement("DIV");
    paragraph.className = NOTE_BOX;
    paragraph.innerText = tranferText;


    let btn = document.createElement("BUTTON");
    btn.innerHTML = 'X';
    btn.className = "closingBtn";
    btn.onclick = closeParaBox;

    paragraph.appendChild(btn);
    document.getElementById("note-container").appendChild(paragraph);
    };

function createNote(oneNote) {
    let paragraph = document.createElement("DIV");
    paragraph.className = NOTE_BOX;
    paragraph.innerText = `${oneNote.title} 
    \n id: ${oneNote.id}
    \n userID: ${oneNote.userId}`;


    let btn = document.createElement("BUTTON");
    btn.innerHTML = 'X';
    btn.className = "closingBtn";
    btn.onclick = closeParaBox;

    paragraph.appendChild(btn);
    document.getElementById("note-container").appendChild(paragraph);
};

function filterNotes(filterElement) {
    deleteNotesFromDashboard();
    let value = filterElement.value;
    let selectedUseres = getUsersIds();

    filteredData = [];
    for (let note of data) {
        if (value == "allNotes" && selectedUseres.includes(note.userId)) {
            filteredData.push(note);
        } else if (value == "done_notes" && selectedUseres.includes(note.userId) && note.completed) {
            filteredData.push(note);
        } else if (value == 'pending_notes' && selectedUseres.includes(note.userId) && !note.completed) {
            filteredData.push(note);
        }
    };

    createPaginationButtons(filteredData);
};

function deleteNotesFromDashboard() {
    let noteContainer = document.getElementById('note-container');
    let notes = document.getElementsByClassName(NOTE_BOX);
    let temp = [];

    for (let i = 0; i < notes.length; i++) {
        temp.push(notes[i]);
    }

    for (let i = 0; i < temp.length; i++) {
        noteContainer.removeChild(temp[i])
    }
};

function createUsersCheckBox(user) {
    let filterContainer = document.createElement('div');
    filterContainer.className = "filter";

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = user.id;
    checkbox.checked = true;
    checkbox.addEventListener('change', function () {
        const selectDropdown = document.getElementsByClassName('drp_menu')[0];
        filterNotes(selectDropdown);
    });

    let label = document.createElement('label');
    label.innerText = user.name;

    filterContainer.appendChild(checkbox);
    filterContainer.appendChild(label);
    document.getElementById('filters-section').appendChild(filterContainer);
};

function rendorNotes(notes) {
    deleteNotesFromDashboard();
    for (let note of notes) {
        createNote(note);
    }
};

function createPaginationButtons(commits) {
    deletePaginationButtons();
    let buttonsContainer = document.getElementById('pagination-container');
    let page_count = Math.ceil(commits.length / numberPerPage);
    for (let i = 1; i < page_count + 1; i++) {
        let btn = createButton(i, commits);
        buttonsContainer.appendChild(btn);
    }
};

function deletePaginationButtons() {
    const buttons = document.querySelectorAll('#pagination-container button');
    let buttonsContainer = document.getElementById('pagination-container');

    for (let btn of buttons) {
        buttonsContainer.removeChild(btn);
    }
};

function createButton(pageNumber, commits) {
    let button = document.createElement('button');
    button.innerText = pageNumber;

    if (pageNumber === 1) {
        button.classList.add('active');
        rendorNotes(commits.slice(0, numberPerPage));
    }

    button.addEventListener('click', function () {
        let current_btn = document.querySelector('.active');
        current_btn.classList.remove('active');
        button.classList.add('active');

        const fromPage = +button.innerText;
        const fromElement = fromPage * numberPerPage - numberPerPage;
        rendorNotes(filteredData.slice(fromElement, fromElement + numberPerPage));
    });
    return button;
};

function getUsersIds() {
    let checkData = [];
    for (let user of usersData) {
        let checkbox = document.getElementById(user.id + '');
        if (checkbox.checked == true) {
            checkData.push(user.id);
        }
    }
    return checkData;
};

function closeParaBox(event) {
    let btn = event.target;
    const note = btn.parentNode;
    const mainContainer = note.parentNode;
    mainContainer.removeChild(note);
};


