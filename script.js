const API_KEY = "d3852261adae444aa9850d237d82c06e";
        let allRecipes = []; 
        let favorites = new Set(); 

        async function fetchRecipes() {
            const loader = document.getElementById("loading");
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=20&addRecipeInformation=true`);
                if (!response.ok) throw new Error("API Limit reached.");
                const data = await response.json();
                allRecipes = data.results;
                loader.style.display = "none";
                renderCards(allRecipes, "recipeGrid");
            } catch (error) {
                loader.innerHTML = `<p style="color:red">Error: ${error.message}</p>`;
            }
        }

        function applyInteractions() {
            const query = document.getElementById("searchInput").value.toLowerCase();
            const dietFilter = document.getElementById("filterType").value;
            const sortVal = document.getElementById("sortSelect").value;

            let processed = allRecipes.filter(recipe => {
                const matchesSearch = recipe.title.toLowerCase().includes(query);
                const matchesDiet = dietFilter === "all" || recipe[dietFilter] === true;
                return matchesSearch && matchesDiet;
            });

            if (sortVal === "az") processed.sort((a, b) => a.title.localeCompare(b.title));
            else if (sortVal === "quickest") processed.sort((a, b) => a.readyInMinutes - b.readyInMinutes);

            renderCards(processed, "recipeGrid");
        }

        function renderCards(data, containerId) {
            const grid = document.getElementById(containerId);
            grid.innerHTML = "";

            data.forEach(item => {
                const isFav = favorites.has(item.id);
                const card = document.createElement("div");
                card.className = "recipe-card";
                card.innerHTML = `
                    <button class="fav-btn" onclick="event.stopPropagation(); toggleFav(${item.id})">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    <div class="recipe-image-container">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="card-hover-info">
                            <div class="hover-content">
                                <p>⏱️ <span>${item.readyInMinutes}</span> MINS</p>
                                <p>⭐ SCORE: <span>${item.healthScore}</span></p>
                                <p>🍽️ SERVINGS: <span>${item.servings}</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="tag-row">
                            <span class="tag">${item.vegetarian ? 'Veg' : 'Meat'}</span>
                            ${item.glutenFree ? '<span class="tag">GF</span>' : ''}
                        </div>
                        <h3>${item.title}</h3>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function toggleFav(id) {
            if (favorites.has(id)) favorites.delete(id);
            else favorites.add(id);
            
            applyInteractions(); // Update main grid
            updateLikedView();   // Update basket grid
        }

        function showView(view) {
            document.getElementById("mainView").style.display = view === 'main' ? 'block' : 'none';
            document.getElementById("likedView").style.display = view === 'liked' ? 'block' : 'none';
            if(view === 'liked') updateLikedView();
            window.scrollTo(0,0);
        }

        function updateLikedView() {
            const likedData = allRecipes.filter(r => favorites.has(r.id));
            const msg = document.getElementById("emptyLikedMsg");
            msg.style.display = likedData.length === 0 ? 'block' : 'none';
            renderCards(likedData, "likedGrid");
        }

        function toggleTheme() {
            const body = document.body;
            const btn = document.getElementById("themeToggle");
            const isDark = body.getAttribute("data-theme") === "dark";
            body.setAttribute("data-theme", isDark ? "light" : "dark");
            btn.innerText = isDark ? "Dark Mode" : "Light Mode";
        }

        window.onload = fetchRecipes;