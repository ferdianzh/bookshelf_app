const STORAGE_KEY = "BOOK_APPS";

let bookList = [];

function checkForStorage() {
  return typeof Storage;
}

function saveBookList() {
  if (checkForStorage()) {
    const parsed = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsed);
  } else {
    alert("Perangkat tidak mendukung local storage");
  }
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } else {
    return [];
  }
}

function addBook() {
  var today = new Date();
  var date = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2);
  var time = ("0" + today.getHours()).slice(-2) + ("0" + today.getMinutes()).slice(-2) + ("0" + today.getSeconds()).slice(-2);
  const book = {
    id: date + time,
    title: document.getElementById("title").value,
    writer: document.getElementById("writer").value,
    year: document.getElementById("year").value,
    isComplete: false,
  };

  bookList.unshift(book);
  saveBookList();
  renderBook(bookList);
}

function renderBook(books) {
  const unfinishedBook = document.getElementById("unfinished-list");
  const finishedBook = document.getElementById("finished-list");

  unfinishedBook.innerHTML = "";
  finishedBook.innerHTML = "";

  for (let book of books) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;

    const bookId = document.createElement("p");
    bookId.classList.add("grey-text");
    bookId.innerText = book.id;

    const bookWriter = document.createElement("p");
    bookWriter.innerText = book.title;

    const bookYear = document.createElement("p");
    bookYear.innerText = book.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("list-text");
    textContainer.append(bookTitle, bookId, bookWriter, bookYear);

    const itemContainer = document.createElement("div");
    itemContainer.classList.add("list-item");
    itemContainer.append(textContainer);

    if (book.isComplete) {
      itemContainer.append(createUndoButton(), createTrashButton());
      finishedBook.append(itemContainer);
    } else {
      itemContainer.append(createTrashButton(), createCheckButton());
      unfinishedBook.append(itemContainer);
    }
  }
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function createCheckButton() {
  return createButton("check-button", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}
function addBookToCompleted(bookElement) {
  const bookDetail = bookElement.querySelectorAll(".list-text > p");
  const newBookId = bookDetail[0].innerText;

  for (let book of bookList) {
    if (book["id"] == newBookId) {
      book["isComplete"] = true;
      saveBookList();
    }
  }
  renderBook(bookList);
}

function createTrashButton() {
  return createButton("trash-button", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
}
function removeBookFromCompleted(bookElement) {
  const modal = document.getElementsByClassName("modal");
  const cancelBtn = document.getElementById("cancel-button");
  const confirmBtn = document.getElementById("confirm-button");

  modal[0].style.display = "block";
  cancelBtn.addEventListener("click", function () {
    confirmDelete = false;
    modal[0].style.display = "none";
  });
  confirmBtn.addEventListener("click", function () {
    confirmDelete = true;
    modal[0].style.display = "none";
    const bookDetail = bookElement.querySelectorAll(".list-text > p");
    const newBookId = bookDetail[0].innerText;

    for (let book of bookList) {
      if (book["id"] == newBookId) {
        let index = bookList.indexOf(book);
        bookList.splice(index, 1);
        saveBookList();
      }
    }
    renderBook(bookList);
  });
}

function createUndoButton() {
  return createButton("undo-button", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
}
function undoBookFromCompleted(bookElement) {
  const bookDetail = bookElement.querySelectorAll(".list-text > p");
  const newBookId = bookDetail[0].innerText;

  for (let book of bookList) {
    if (book["id"] == newBookId) {
      book["isComplete"] = false;
      saveBookList();
    }
  }
  renderBook(bookList);
}
