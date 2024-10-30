const studentNumber = "s4904022";
const uqcloudZoneId = "90b3c1b7";
const headers = new Headers();
headers.append("student_number", studentNumber);
headers.append("uqcloud_zone_id", uqcloudZoneId);

const params = new URLSearchParams(window.location.search);
const productName = params.get("product_name");

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function displayRecipe(recipe) {
  const descriptionParts = recipe.product_description.split(", ");
  console.log(descriptionParts);
  const ingredients = descriptionParts[0].split(": ")[1];
  const directions = descriptionParts[1].split(": ")[1];
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

  let ingredientsList = "<ul>";
  ingredients.forEach((ingredient) => {
    if (ingredient.trim()) {
      ingredientsList += `<li>${ingredient}</li>`;
    }
  });
  ingredientsList += "</ul>";

  const container = document.getElementById("recipe-container");
  container.innerHTML = `
  <div class="recipe-container">
  <!-- Recipe Header -->
  <div class="recipe-header">
    <h2 class="recipe-title">${recipe.product_name}</h2>
    <p class="recipe-description">${recipe.product_info2}</p>
  </div>

  <!-- Recipe Image -->
  <div class="recipe-image-container">
    <img
      class="recipe-image"
      src="${recipe.product_photo || "assets/example_image.svg"}"
      alt="${recipe.product_name}"
    />
  </div>

  <!-- Ingredients and Directions Box -->
  <div class="recipe-details-box">
    <!-- Ingredients Section -->
    <div class="recipe-ingredients-box">
      <h3 class="recipe-large-text">Ingredients</h3>
      <ul class="recipe-ingredients-list">
        ${ingredientsList}
      </ul>
    </div>

    <!-- Directions Section -->
    <div class="recipe-directions-box">
      <h3 class="recipe-large-text">Directions</h3>
      <ol class="recipe-directions-list">
        ${recipeDirections}
      </ol>
    </div>
  </div>

  <!-- Recipe Info (Time, Owner, etc.) -->
  <div class="recipe-info">
    <div class="recipe-icons">
      <img
        src="${priceIcon}"
        class="card-icon card-icon-left"
        alt="price-icon_${recipePrice}"
      />
      <img src="assets/chef_hat.svg" alt="chef_hat_icon"/>
    </div>
    <p class="card-small-text">${cookingTime} minutes</p>
    <p class="card-small-text">${recipe.product_owner}</p>
  </div>
</div>
  `;
}

function fetchRecipeByName() {
  const url =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";

  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errormessage ${response.statusText}`);
      }
      return response.json();
    })
    .then((recipes) => {
      const productName = decodeURIComponent(getQueryParameter("product_name"));
      const recipe = recipes.find(
        (r) => r.product_name.toLowerCase() === productName.toLowerCase()
      );
      if (recipe) {
        displayRecipe(recipe);
      } else {
        document.getElementById("recipe-container").innerHTML =
          "<p>Recipe not found</p>";
      }
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("recipe-container").innerHTML =
        "<p>Error loading recipe.</p>";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const productName = decodeURIComponent(getQueryParameter("product_name"));
  if (productName) {
    fetchRecipeByName(productName);
  } else {
    document.getElementById("recipe-container").innerHTML =
      "<p>No recipe provided.</p>";
  }
});
