import { headers } from "./components.js";

function getCurrentUser() {
  return sessionStorage.getItem("username");
}

function displayUserRecipes(userRecipes) {
  const container = document.querySelector(".user-dynamic-recipes");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!container) {
    console.error("Container not found");
    return;
  }

  if (!Array.isArray(userRecipes) || userRecipes.length === 0) {
    container.innerHTML = "<p>No recipes yet.</p>";
    return;
  }

  let output = "";

  userRecipes.forEach((recipe) => {
    const recipeImage = recipe.product_photo
      ? recipe.product_photo
      : "assets/example_image.svg";

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

    const isFavorite = favorites.includes(recipe.product_name);
    const chefHatIcon = isFavorite
      ? "assets/chef_hat_filled.svg"
      : "assets/chef_hat.svg";

    output += `
      <div class="card" role="article" aria-label="user-recipe-${
        recipe.product_name
      }">
        <a href="recipe_detail.html?product_name=${encodeURIComponent(
          recipe.product_name
        )}">
          <img src="${recipeImage}" alt="${
            recipe.product_name
          }" class="card-image"/>
        </a>
        <div class="card-icons">
          <img src="${priceIcon}" class="card-icon card-icon-left" alt="price_icon_${recipePrice}"/>
          <button class="chef-hat-button" data-recipe="${
            recipe.product_name
          }" aria-label="Add ${recipe.product_name} to favorites">
            <img src="${chefHatIcon}" alt="chef_hat_icon"/>
          </button>
        </div>
        <p class="card-small-text">${cookingTime} minutes</p>
        <p class="card-small-text">${recipe.product_owner}</p>
        <h4 class="card-large-text">${recipe.product_name}</h4>
      </div>  
    `;
  });

  container.innerHTML = output;
}

export function fetchUserRecipes() {
  const url =
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/";

  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((recipes) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        document.querySelector(".user-dynamic-recipes").innerHTML =
          "<p>No user logged in.</p>";
        return;
      }

      const userRecipes = recipes.filter(
        (recipe) => recipe.product_owner === currentUser
      );
      displayUserRecipes(userRecipes);
    })
    .catch((error) => {
      console.error("Error fetching user recipes: ", error);
      document.querySelector(".user-dynamic-recipes").innerHTML =
        "<p>Error loading recipes.</p>";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    fetchUserRecipes();
  } else {
    document.querySelector(".user-dynamic-recipes").innerHTML =
      "<p>No user logged in.</p>";
  }
});
