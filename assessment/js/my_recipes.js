function displayRecipes(data) {
    const containers = document.querySelectorAll(".dynamic-recipes");

    containers.forEach((container) => {
      let output = "";
      data.forEach((recipe) => {
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