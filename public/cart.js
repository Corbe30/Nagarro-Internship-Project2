var allCartItems = [];
document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

if(JSON.parse(localStorage.getItem('corbeCart')) === null) {
    allCartItems = [];
}
else {
    allCartItems = JSON.parse(localStorage.getItem('corbeCart'));
}
console.log(allCartItems)
for (var i = 0; i < allCartItems.length; i++) {
    console.log(allCartItems[i].title, allCartItems[i].price, allCartItems[i].imageSrc, allCartItems[i].id)
    addItemToCart(allCartItems[i].title, allCartItems[i].price, allCartItems[i].imageSrc, allCartItems[i].id)
}
updateCartTotal()
function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('₹', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    document.getElementsByClassName('cart-total-price')[0].innerText = '₹' + total
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var id = (buttonClicked.parentElement.parentElement.getAttribute("data-item-id"))
    buttonClicked.parentElement.parentElement.remove()

    for (var i = 0; i < allCartItems.length; i++) {
        if(allCartItems[i].id == id) {
            allCartItems.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('corbeCart', JSON.stringify(allCartItems));
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}


var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: function(token) {
        var items = []
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity = quantityElement.value
            var id = cartRow.dataset.itemId
            items.push({
                id: id,
                quantity: quantity
            })
        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message)
            var cartItems = document.getElementsByClassName('cart-items')[0]
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild)
            }
            updateCartTotal()
        }).catch(function(error) {
            console.error(error)
        })
    }
})


function purchaseClicked() {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('₹', '')) * 100
    stripeHandler.open({
        amount: price
    })
}