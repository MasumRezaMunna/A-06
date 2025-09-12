const categoryList = document.getElementById("category-list");
const plantContainer = document.getElementById("plant-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

let cart = [];

// Load Categories
const loadCategories = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  displayCategories(data.categories);
};

// Display Categories
const displayCategories = (categories) => {
  categoryList.innerHTML = `
    <li>
      <button onclick="loadPlants()" class="w-full text-left px-3 py-2 rounded-lg bg-green-700 text-white">
        All Trees
      </button>
    </li>
  `;

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="loadCategoryPlants(${cat.id})"
        class="w-full text-left px-3 py-2 rounded-lg hover:bg-green-100">
        ${cat.category_name}
      </button>`;
    categoryList.appendChild(li);
  });
};

// Load All Plants
const loadPlants = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants);
};

// Load Plants by Category
const loadCategoryPlants = async (id) => {
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  displayPlants(data.plants);
};

// Display Plants
const displayPlants = (plants) => {
  plantContainer.innerHTML = "";
  plants.forEach((plant) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-xl shadow p-4 flex flex-col";
    div.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" 
        class="w-full h-32 object-cover rounded-lg mb-3">
      <h4 class="font-bold text-lg">${plant.name}</h4>
      <p class="text-sm text-gray-600 mb-2">${plant.description.slice(0, 60)}...</p>
      <div class="flex justify-between">
      <span class="mt-auto bg-green-200 text-green px-2 py-1 rounded-full text-green-600 text-sm font-semibold my-2">${plant.category}</span>
      <p class="font-bold my-2">৳${plant.price}</p>
      </div>
      <button onclick="addToCart('${plant.id}', '${plant.name}', ${plant.price})" 
        class="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
        Add to Cart
      </button>
    `;
    plantContainer.appendChild(div);
  });
};

// Add to Cart
const addToCart = (id, name, price) => {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCart();
};

// Update Cart
const updateCart = () => {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg";
    li.innerHTML = `
      <span>${item.name} ৳${item.price} × ${item.quantity}</span>
      <button onclick="removeFromCart('${item.id}')" class="text-red-500">✖</button>
    `;
    cartList.appendChild(li);
  });
  cartTotal.innerText = `৳${total}`;
};
// Remove from Cart
const removeFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
};
// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadPlants();
});
