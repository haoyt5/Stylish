console.log('Implement the shopping cart count feature');
////// shoppingCartCount updating function
function clearInCartSum () {
    document.getElementsByClassName('current-item__shoppingcart')[0].innerHTML = "0";
    document.getElementsByClassName('current-item__shoppingcart')[1].innerHTML = "0";
}
function renderInCartSum (string){
    document.getElementsByClassName('current-item__shoppingcart')[0].innerHTML = string;
    document.getElementsByClassName('current-item__shoppingcart')[1].innerHTML = string;
}
{
    console.log('start the window.load');
    const inCartData = JSON.parse(localStorage.getItem('inCartData')) || [];
    console.log('已存在的inCartData有：', inCartData );
    let inCartItemQuantity = 0;
    for(let i = 0; i< inCartData.length; i++){
        inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
    }
    clearInCartSum ()
    renderInCartSum (inCartItemQuantity);
}