
let allCartItems = []
var addToCartButtons = document.getElementsByClassName('shop-item-button')
if(JSON.parse(localStorage.getItem('corbeCart')) === null) {
    allCartItems = [];
}
else {
    allCartItems = JSON.parse(localStorage.getItem('corbeCart'));
}

ready()

function ready() {
    // localStorage.clear();
    for(var i = 0; i < allCartItems.length; i++){
        var tempButton = document.getElementsByClassName("shop-item-button")[allCartItems[i].id - 1];
        tempButton.style.backgroundColor = "grey";
        tempButton.innerHTML = `<span class="material-icons">done</span>`;
        tempButton.disabled = true;
    }
    
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = "";

    if(button.nodeName == "BUTTON"){
        shopItem = button.parentElement.parentElement
    }
    else if((button.nodeName == "SPAN")){
        button = button.parentElement
        shopItem = button.parentElement.parentElement
    }
    
    var id = shopItem.getAttribute("data-item-id");
    var title = shopItem.getElementsByClassName('shop-item-name')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src

    allCartItems.push({id, title, price, imageSrc})
    localStorage.setItem('corbeCart', JSON.stringify(allCartItems));

    console.log(allCartItems)

    button.disabled = true;
    button.style.backgroundColor = "grey";
    button.innerHTML = `<span class="material-icons">done</span>`;

}