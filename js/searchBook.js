const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", function (event) {
  let searchText = document.getElementById("search-box").value;
  let searchResult = [];
  event.preventDefault();

  for (let book of bookList) {
    let title = book["title"];
    if (title.includes(searchText)) {
      searchResult.push(book);
    }
    renderBook(searchResult);
  }
});
