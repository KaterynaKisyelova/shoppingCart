const [...removeCartItemButtons] = document.querySelectorAll(".btn-danger");
const cartItemContainer = document.querySelector(".cart-items");
const cartQuantity = document.querySelectorAll(".cart-quantity-input");
const [...addToCardBtns] = document.querySelectorAll(".shop-item-button");
const purchaseBtn = document.querySelector(".btn-purchase");
let cart =[];

document.addEventListener('DOMContentLoaded', getFromLocalStorage);

removeCartItemButtons.forEach((button) => {
  button.addEventListener("click", removeCartItem);
});

cartItemContainer.addEventListener("change", (e) => {
  let input = e.target;
  if (input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
});

addToCardBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedItem = button.parentElement.parentElement;
    const selectedItemTitle =
      selectedItem.querySelector(".shop-item-title").innerText;
    const selectedItemImage =
      selectedItem.querySelector(".shop-item-image").src;
    const selectedItemPrice =
      selectedItem.querySelector(".shop-item-price").innerText;
    addSelectedItemInfoToCart(
      selectedItemTitle,
      selectedItemImage,
      selectedItemPrice
    );
  });
});

purchaseBtn.addEventListener("click", (e) => {
  [...cartItemContainer.children].forEach((item) => {
    item.remove();
  });
  alert("Thank you for your purchase");
  updateCartTotal();
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
});

function removeCartItem(e) {
  const buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  cart = cart.filter(item => item.title !== buttonClicked.parentElement.parentElement.querySelector('.cart-item-title').innerText);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartTotal();
}

function updateCartTotal() {
  let [...cartRows] = cartItemContainer.querySelectorAll(".cart-row");
  let totalPrice = document.querySelector(".cart-total-price");
  if (cartRows.length === 0) {
    return (totalPrice.innerText = `$0`);
  }
  let currentTotalPrice = cartRows.reduce((acc, row) => {
    let itemPrice = row.querySelector(".cart-price").innerText;
    let cartQuantity = row.querySelector(".cart-quantity-input");
    let rowTotal = parseFloat(itemPrice.match(/\d+\.\d+/)) * cartQuantity.value;
    return (acc += rowTotal);
  }, 0);
  currentTotalPrice = Math.round(currentTotalPrice * 100) / 100;
  return (totalPrice.innerText = `$${currentTotalPrice}`);
}

function createTemplate() {
  let cartTemplate = document.importNode(template.content, true);
  return cartTemplate;
}

function getIsProductAdded(title) {
  let isProductAdded = false;
  const [...cartItemsNames] =
    cartItemContainer.querySelectorAll(".cart-item-title");
  cartItemsNames.forEach((name) => {
    if (name.innerText === title) {
      alert("This item is already added to the cart");
      isProductAdded = true;
    }
  });

  return isProductAdded;
}

function updateLocalStorageData(newGood){
    cart.push(newGood);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart')).forEach(item => addSelectedItemInfoToCart(item.title, item.img, item.price, item.quantityValue));
}

function addSelectedItemInfoToCart(title, img, price) {
  const isProductAdded = getIsProductAdded(title);

  if (isProductAdded) {
    return;
  }

  const cartTemplate = createTemplate();
  const templateTitle = cartTemplate.querySelector(".cart-item-title");
  const templateImage = cartTemplate.querySelector(".cart-item-image");
  const temlatePrice = cartTemplate.querySelector(".cart-price");
  const quantityValue = cartTemplate.querySelector('.cart-quantity-input').value;
  templateTitle.innerText = title;
  templateImage.src = img;
  temlatePrice.innerText = price;
  cartItemContainer.appendChild(cartTemplate);
  cartItemContainer.querySelectorAll(".btn-danger").forEach((button) => {
    button.addEventListener("click", removeCartItem);
  });
  updateLocalStorageData({title, img, price, quantityValue})
  updateCartTotal();
}
