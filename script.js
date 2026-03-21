const button = document.getElementById("click-button");
const buttonImg = button.querySelector("img");
const count = document.getElementById("click-count");
let totalClickCount = 0;
const shopContainer = document.getElementById("shop-items");
const statsContainer = document.getElementById("stats-items");
const em = document.getElementById("empty-message")
let itemsOwned = [];
const shopItems = [
  {
    name: "Cat",
    description: "Cats click for you, earning you money.",
    cost: 10,
    startingCost: 10,
    type: "normal",
  },
  {
    name: "Multiplier",
    description: "Multiplies the value of each click by 2.",
    cost: 50,
    startingCost: 50,
    type: "op",
  },
  {
    name: "Lucky",
    description: "10% chance to gain +10 bonus clicks for each \"Lucky\" owned.",
    cost: 150,
    startingCost: 150,
    type: "op",
  },
];
function createShopItems() {
  // remove all items already in the shop
  document.querySelectorAll(".shop-item").forEach((element) => {
    element.remove();
  });

  // add new items
  shopItems.forEach((item) => {
    const shopItem = document.createElement("div");
    shopItem.className = "shop-item";

    shopItem.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <button onclick="buyItem('${item.name}')">
        Buy $${item.cost}
      </button>
    `;

    shopContainer.appendChild(shopItem);
  });
}
function createStatsItems() {

  document.querySelectorAll(".stats-item").forEach((el) => {
    el.remove();
  });
  em.remove();

  itemsOwned.forEach((item) => {
    const statsItem = document.createElement("div");
    statsItem.className = "stats-item";

    statsItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>Owned: ${item.amount}</p>
    `;

    statsContainer.appendChild(statsItem);
  });
}
// Buy item function
// Buy item function
function buyItem(itemName) {
  const item = shopItems.find((i) => i.name === itemName);
  if (totalClickCount >= item.cost) {
    totalClickCount -= item.cost;
    count.textContent = totalClickCount;

    let amount = 1;

    // check if we already own item, if we do then ++ it, else add it
    const itemInArray = itemsOwned.find((obj) => obj.name === item.name);
    if (itemInArray) {
      itemInArray.amount++;
      console.log(`Found ${item.name}, added 1!`);
      amount = itemInArray.amount;
    } else {
      itemsOwned.push({ name: item.name, amount: 1 });
      console.log(`Added ${item.name} to itemsOwned!`);
    }

    // make the item cost more each time you buy it
    if (item.type === "op") {
      item.cost = Math.floor(item.startingCost * amount * Math.pow(2, amount * 2)*1.5);
    } 
    else if (item.type === "normal") {
      item.cost = Math.floor(item.startingCost * Math.pow(1.25, amount)* 2);
    }
    createShopItems(); // redraw the shop with new prices
    createStatsItems();

    console.log(`Bought ${itemName}!`);
  } else {
    console.log(`Not enough clicks! Need ${item.cost}`);
  }
}
setInterval(() => {
  // For every cat we own, we need to click the button
  const catOwned = itemsOwned.find((i) => i.name === "Cat");
  if (catOwned) {
    // If you own cats
    for (let i = 0; i < catOwned.amount; i++) {
      buttonClick();
    }
  }
}, 1000); // <-- This makes it run every 1000ms
function buttonClick() {
  console.log("Button was clicked!");

  const multiplierOwned = itemsOwned.find((i) => i.name === "Multiplier");
  const multiplierCount = multiplierOwned ? multiplierOwned.amount : 0;

  totalClickCount = totalClickCount + 1 * 2 ** multiplierCount;

  count.textContent = totalClickCount;
  buttonImg.style.transition = "transform 0.05s";
    buttonImg.style.transform = "scale(0.8)";

    setTimeout(() => {
    buttonImg.style.transform = "scale(1)";
    }, 200);
    const lucky = itemsOwned.find(i => i.name === "Lucky");
    if (lucky && Math.random() < 0.1 * lucky.amount) {
    totalClickCount += 10 * lucky.amount;
    }
}

button.addEventListener("click", function () {
  buttonClick();
});
createShopItems();