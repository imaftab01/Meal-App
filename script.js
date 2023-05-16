const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const inputBox = document.getElementById("search-input");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const favCard = document.querySelector(".fav-card");
// const favCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
mealList.addEventListener("click", favRecipe);
inputBox.addEventListener("input", dropDownResult);
favCard.addEventListener("click", removeFavorite);

recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

// get meal list that matches with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3> 
                               <div class="info">                   
                                <a href = "#" class = "recipe-btn">View Recipe</a>
                                <span href = "#" class=" favlist icon fa-solid fa-heart"></span>
                            </div>
                        </div>
                    </div>
                `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
}

// favourite meal
function favRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("favlist")) {
    let favItem = e.target.parentElement.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => favRecipeModal(data.meals));
  }
}

// remove favorite meal
function removeFavorite(e) {
    if (e.target.classList.contains("fa-times")) {
      let favItem = e.target.parentElement;
      favItem.remove();
    }
  }
// favourite meal modal
function favRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let favItems = document.querySelectorAll(".fav-item p");
  let isAlreadyFav = false;
  favItems.forEach((item) => {
    if (item.textContent === meal.strMeal) {
      alert("This meal is already in your favorite list!");
      isAlreadyFav = true;
    }
  });
  if (!isAlreadyFav) {
    let html = `
      <div class="fav-item">
        <img class="fav-image" src="${meal.strMealThumb}" alt="orderImage" />
        <p>${meal.strMeal}</p>
        <i class="fas fa-times"></i>
      </div>
    `;
    favCard.insertAdjacentHTML("beforeend", html);
  }
}


// get recipe of the meal
function getMealRecipe(e) {
	e.preventDefault();
	if (e.target.classList.contains('recipe-btn')) {
		let mealItem = e.target.parentElement.parentElement.parentElement;
		fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
			.then((response) => response.json())
			.then((data) => mealRecipeModal(data.meals));
	}
}


// create a modal popup
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
//sidebar for favourite
function openNav() {
  document.getElementById("myFavourite").style.width = "350px";
}

function closeNav() {
  document.getElementById("myFavourite").style.width = "0";
}

//EventListner for input-box
let deb;
// function dropDownResult(event) {
//   if (deb) {
//     clearTimeout(deb);
//   }
//   deb = setTimeout(() => {
//  //   console.log(event.target.value);
//  let searchInputTxt = document.getElementById("search-input").value.trim();
//   fetch(
//     `www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
//   )
//     .then((response) => response.json())
//     .then((data)=>{console.log(data)} )
//   }, 500);
// }


function dropDownResult(event) {
  if (deb) {
    clearTimeout(deb);
  }
  deb = setTimeout(() => {
    let searchInputTxt = event.target.value.trim();
    if (searchInputTxt !== '') {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.meals) {
            const suggestions = data.meals.slice(0, 5).map((meal) => `
              <div class = "meal-item" data-id = "${meal.idMeal}">
                <div class = "meal-img">
                  <img src = "${meal.strMealThumb}" alt = "food">
                </div>
                <div class = "meal-name">
                  <h3>${meal.strMeal}</h3> 
                  <div class="info">                   
                    <a href = "#" class = "recipe-btn" >View Recipe</a>
                    <span href = "#" class=" favlist icon fa-solid fa-heart"></span>
                  </div>
                </div>
              </div>
            `).join('');
            mealList.innerHTML = suggestions;
            mealList.classList.remove("notFound");
          } else {
            mealList.innerHTML = '';
            mealList.classList.add("notFound");
          }
        });
    } else {
      mealList.innerHTML = '';
    }
  }, 200);
}
