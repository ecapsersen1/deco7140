document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".search-bar-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector(".main-search-bar-input").value; // Get the value of the input

    if (input) {
      sessionStorage.setItem("username", input);
      window.location.href = "home_page.html";
    } else {
      alert("Please enter a name.");
    }
  });
});
