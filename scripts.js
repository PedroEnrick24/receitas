const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const recipeDetaills = document.querySelector(".recipe-detaills");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputValue = event.target[0].value;

  searchRecipes(inputValue);
});

async function searchRecipes(igredient) {
  recipeList.innerHTML = `<p>Carregando receita</p>`;
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${igredient}`
    );
    const data = await response.json();

    showRecpies(data.meals);
  } catch (err) {
    recipeList.innerHTML = `
  <p>Nenhuma receita encontrada</p>
  `;
  }
}

function showRecpies(recipes) {
  recipeList.innerHTML = recipes
    .map(
      (item) => `
    <div class="recipe-card" onclick="getRecipesDetails(${item.idMeal})">
        <img src="${item.strMealThumb}" alt="receita-foto">
        <h3>${item.strMeal}</h3>
    </div>
    `
    )
    .join("");
}

async function getRecipesDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  const recipe = data.meals[0];
  console.log(recipe);

  let igredient = "";

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      igredient += `<li>${recipe[`strIngredient${i}`]} - ${
        recipe[`strMeasure${i}`]
      } </li>`;
    } else {
      break;
    }
  }

  recipeDetaills.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal} image" class="recipe-img">
    <h6>Categoria: ${recipe.strCategory}</h6>
    <h7>Origem: ${recipe.strArea}</h7>
    <h7>Igredientes:</h7>
    <ul>${igredient}</ul>
    <h7>Instruções:</h7>
    <p>${recipe.strInstructions}</p>
    <p>Tags: ${recipe.strTags}</p>
    <p>Assista O Video <a href="${recipe.strYoutube}" target="_blank">Tutorial.</a></p>
  `;
}
