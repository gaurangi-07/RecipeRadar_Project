const API_KEY = "d3852261adae444aa9850d237d82c06e";
const container = document.getElementById("recipeContainer");


async function getRecipes() {
    container.innerHTML = "<p class='loading'>Fetching delicious recipes...</p>";

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=12&addRecipeInformation=true`
        );
        

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();


        displayRecipes(data.results);

    } catch (error) {

        console.error("Fetch error:", error);
        container.innerHTML = `<p class="error">Failed to load recipes. Please try again later.</p>`;
    }
}


function displayRecipes(recipes) {
    container.innerHTML = "";


    if (!recipes || recipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach((recipe) => {

        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";


        recipeCard.innerHTML = `
            <div class="image-wrapper">
                <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
            </div>
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-stats">
                    <span> ${recipe.readyInMinutes} mins</span>
                    <span> Health: ${recipe.healthScore}</span>
                </div>
                <button class="view-btn">View Recipe</button>
            </div>
        `;

        container.appendChild(recipeCard);
    });
}


getRecipes();