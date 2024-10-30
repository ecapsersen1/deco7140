import {
  uploadRecipeForm,
  studentNumber,
  uqcloudZoneId,
  headers,
  fetchRecipes,
} from "./components.js";

document.addEventListener("DOMContentLoaded", function () {
  const uploadButton = document.getElementById("uploadButton");
  const uploadForm = document.getElementById("uploadForm");
  const recipeForm = document.getElementById("recipeForm");
  const cancelButton = document.getElementById("cancelButton");
  const closeButton = document.getElementById("closeButton");
  const recipePhoto = document.getElementById("product_photo");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const messageDiv = document.getElementById("submitResponse");

  function handleSuccess(result) {
    messageDiv.textContent = `Recipe ${result.product_name} was uploaded!`;
    messageDiv.style.color = "green";
    recipeForm.reset();
    setTimeout(() => {
      recipeForm.reset();
      uploadForm.style.display = "none";
    }, 3000);
    loadRecipes();
  }

  function handleError(error) {
    console.log("Upload error:", error);
    messageDiv.textContent = "There was a problem. please try again.";
    messageDiv.style.color = "red";
  }

  function handleGETError(error) {
    console.error("Error fetching recipes:", error);
    document.getElementById(
      "dynamic-recipes"
    ).innerHTML = `<p>Failed to load recipes. Please try again later.</p>`;
  }

  function displayRecipes(data) {
    const containers = document.querySelectorAll(".dynamic-recipes");

    containers.forEach((container) => {
      let output = "";
      data.forEach((recipe) => {
        const recipeImage = recipe.product_photo
          ? recipe.product_photo
          : "assets/example_image.svg";

        const descriptionParts = recipe.product_description.split(", ");
        console.log(descriptionParts);
        const ingredients = descriptionParts[0].split(": ")[1];
        const directions = descriptionParts[1].split(": ")[1];
        console.log(directions);
        console.log(ingredients);

        const productInfo3Parts = recipe.product_info3.split(", ");
        const cookingTime = productInfo3Parts[0].split(": ")[1];
        const recipePrice = productInfo3Parts[1].split(": ")[1];

        let priceIcon = "";
        if (recipePrice === "1") {
          priceIcon = "assets/price_cheap.svg";
        } else if (recipePrice === "2") {
          priceIcon = "assets/price_medium.svg";
        } else if (recipePrice === "3") {
          priceIcon = "assets/price_expensive.svg";
        }

        output += `
          <div class="card" role="article" aria-label="recipe-${
            recipe.product_name
          }-name">
          <a href="recipe_detail.html?product_name=${encodeURIComponent(
            recipe.product_name
          )}">
          <img
              src="${recipeImage}" 
              alt="${recipe.product_name}"
              class="card-image"
            />
          </a>
          <div class="card-icons">
            <img
              src="${priceIcon}"
              class="card-icon card-icon-left"
              alt="price_icon_${recipePrice}"
            />
            <img src="assets/chef_hat.svg" alt="chef_hat_icon"/>
          </div>
          <p class="card-small-text">${cookingTime} minutes</p>
          <p class="card-small-text">${recipe.product_owner}</p>
          <h4 class="card-large-text">${recipe.product_name}</h4>
        </div>  
      `;
      });
      container.innerHTML = output;
    });
  }

  function loadRecipes() {
    fetchRecipes(studentNumber, uqcloudZoneId, displayRecipes, handleGETError);
  }

  loadRecipes();

  uploadButton.addEventListener("click", function () {
    uploadForm.style.display = "flex";
  });

  cancelButton.addEventListener("click", function () {
    document.getElementById("recipeForm").reset();
    fileNameDisplay.textContent = "No image chosen";
    uploadForm.style.display = "none";
  });

  closeButton.addEventListener("click", function () {
    uploadForm.style.display = "none";
    fileNameDisplay.textContent = "No image chosen";
  });

  recipePhoto.addEventListener("change", function () {
    const fileName =
      recipePhoto.files.length > 0
        ? recipePhoto.files[0].name
        : "No image chosen";
    fileNameDisplay.textContent = fileName;
  });

  recipeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(recipeForm);

    formData.append(
      "product_name",
      document.getElementById("product_name").value
    );

    formData.append(
      "product_owner",
      sessionStorage.getItem("username") || "Anonymous" //if no username is found, anonymous user
    );

    formData.append(
      "product_info2",
      document.getElementById("product_info2").value
    );

    const ingredients = document.getElementById("ingredients").value;
    const directions = document.getElementById("directions");
    const description = `Ingredients: ${ingredients}, Directions: ${directions}`;
    formData.append("product_description", description);

    const cookingTime = document.getElementById("cooking_time").value;
    const recipePrice = document.querySelector(
      'input[name="recipe_price"]:checked'
    ).value;
    const productInfo3 = `Minutes to Cook: ${cookingTime}, Price: ${recipePrice}`;
    formData.append("product_info3", productInfo3);

    const recipePhoto = document.getElementById("product_photo").files[0];
    if (recipePhoto) {
      formData.append("product_photo", recipePhoto);
    }
    uploadRecipeForm(formData, headers, handleSuccess, handleError);
  });
});
