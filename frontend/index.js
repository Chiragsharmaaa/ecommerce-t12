if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

window.addEventListener('DOMContentLoaded', () => {
  axios.get('http://localhost:3000/products').then((data) => {
    console.log(data)
    if(data.request.status===200) {
      const products = data.data.products
      const parentSection = document.getElementById('shop-items');
      products.forEach(product => {
        const productContainer = `
        <div id="shop-item">
          <h3 class="shop-item-title">${product.title}</h3>
          <div class="image-container">
            <img class="prod-images" src="${product.imageUrl}"></img>
          </div>
          <div class="prod-details">
            <h1 class="shop-item-price">${product.price}</h1>
            <button onClick="addToCart(${product.id})" class="shop-item-button" type="button">ADD to Cart</button>
          </div>
        </div>
        `
        parentSection.innerHTML += productContainer
      })
    } else {
      console.log('Network Error!');
    }
  })
})

function addToCart(productId) {
  axios.post('http://localhost:3000/cart', {productId: productId}).then(response => {
    if(response.status === 200) {
      notifyUsers(response.data.message);
    }
  }).catch(err => {
    notifyUsers(err);
  });
};

function notifyUsers(message) {
  const container = document.getElementById("container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}<h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2500);
};

function ready() {
  const removeCartItemButtons = document.getElementsByClassName("btn-danger");

  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  console.log(addToCartButtons)
  for (let i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  if (cartItems.childElementCount === 0) {
    alert("Empty cart!");
  } else {
    alert("Thank you for your Purchase!");
  }
  updateCartTotal();
}

function removeCartItem(e) {
  var buttonClicked = e.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(e) {
  var input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(e) {
  var button = e.target;
  var shopItem = button.parentElement.parentElement;
  console.log(shopItem)
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("prod-images")[0].src;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText === title) {
      alert("This item is already added to the cart!");
      return;
    }
  }
  var cartRowContents = `
     <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);

}

const parentContainer = document.getElementById("EcommerceContainer");
parentContainer.addEventListener("click", (e) => {
  if (
    e.target.className == "cart-btn-bottom" ||
    e.target.className == "cart-bottom" ||
    e.target.className == "cart-holder"
  ) {
    document.querySelector("#cart").style = "display:block;";
  }
  if (e.target.className == "cancel") {
    document.querySelector("#cart").style = "display:none;";
  }
});

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}
