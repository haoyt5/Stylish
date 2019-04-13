/* global TPirect */
/* exported  TPirect */   
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')
TPDirect.card.setup({
fields: {
number: {
    // css selector
    element: '#card-number',
    placeholder: '**** **** **** ****'
},
expirationDate: {
    // DOM object
    element: document.getElementById('card-expiration-date'),
    placeholder: 'MM / YY'
},
ccv: {
    element: '#card-ccv',
    placeholder: '後三碼'
}
},
styles: {
// Style all elements
'input': {
    'color': 'gray'
},
// Styling ccv field
'input.cvc': {
    // 'font-size': '16px'
},
// Styling expiration-date field
'input.expiration-date': {
    // 'font-size': '16px'
},
// Styling card-number field
'input.card-number': {
    // 'font-size': '16px'
},
// style focus state
':focus': {
    // 'color': 'black'
},
// style valid state
'.valid': {
    'color': 'green'
},
// style invalid state
'.invalid': {
    'color': 'red'
},
// Media queries
// Note that these apply to the iframe, not the root window.
'@media screen and (max-width: 400px)': {
    'input': {
        'color': 'orange'
    }
}
}
})
// TPDirect.card.onUpdate(callback)
TPDirect.card.onUpdate(function (update) {
// update.canGetPrime === true
// --> you can call TPDirect.card.getPrime()
if (update.canGetPrime) {
// Enable submit Button to get prime.
// submitButton.removeAttribute('disabled')
} else {
// Disable submit Button to get prime.
// submitButton.setAttribute('disabled', true)
}

// cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
if (update.cardType === 'visa') {
// Handle card type visa.
}

// number 欄位是錯誤的
if (update.status.number === 2) {
// setNumberFormGroupToError()
} else if (update.status.number === 0) {
// setNumberFormGroupToSuccess()
} else {
// setNumberFormGroupToNormal()
}

if (update.status.expiry === 2) {
// setNumberFormGroupToError()
} else if (update.status.expiry === 0) {
// setNumberFormGroupToSuccess()
} else {
// setNumberFormGroupToNormal()
}

if (update.status.cvc === 2) {
// setNumberFormGroupToError()
} else if (update.status.cvc === 0) {
// setNumberFormGroupToSuccess()
} else {
// setNumberFormGroupToNormal()
}
})
TPDirect.card.getTappayFieldsStatus()
// TPDirect.card.getPrime(callback)
// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)
function getCheckedTime () {
    let selectedDeliveryTime =[];
    const deliveryOptions = document.getElementsByName('delivery_time');
    for(let i = 0; i < deliveryOptions.length ; i++){
        if(deliveryOptions[i].checked){
            selectedDeliveryTime.push(deliveryOptions[i].value);
        }
    }
    return  selectedDeliveryTime.join();
}

 /* eslint-disable no-unused-vars*/


function onSubmit(event) {
    event.preventDefault();

    if ( document.querySelector('#order-name').value.length === 0){
    alert('請輸入姓名')
    document.querySelector('.checkout-button').textContent = "請輸入姓名";
    return
    }
    if (document.querySelector('#order-phone').value.length === 0 ){
    alert('請輸入手機')
    document.querySelector('.checkout-button').textContent = "請輸入手機";
    return
    }
    if ( document.querySelector('#order-address').value.length === 0){
    alert('請輸入地址')
    document.querySelector('.checkout-button').textContent = "請輸入地址";
    return
    }
    if( document.querySelector('#order-email').value.length === 0){
    alert('請輸入Email')
    document.querySelector('.checkout-button').textContent = "請輸入Email";
    return
    }
    if( getCheckedTime().length === 0 ){
    alert('請選擇配送時段');
    document.querySelector('.checkout-button').textContent = "請選擇配送時段";
    return
    }

    let inCartArray = [];
    if (localStorage.getItem('inCartData')){
        inCartArray = JSON.parse(localStorage.getItem('inCartData'));
    }
    let  fbAccessToken = JSON.stringify(localStorage.getItem('fbAccessToken')) || [];

    const getCheckOutList = () => {
        const orderListArray = inCartArray.map( (item) => {
        const {id, name, size, qty,price, color: {name:colorName, code:colorCode}} = item ;
            return   `{
                "id": ${id},
                "name": ${name},
                "price": ${price},
                color: {
                    name: ${colorName},
                    code: ${colorCode}
                },
                "size": ${size},
                "qty": ${qty}
            }
            `
        });
        return orderListArray
    }
    console.log( getCheckOutList() );

    function generateOrder(cardPrime) {
        const checkedTime = getCheckedTime();
        const checkOutList = getCheckOutList();
        let subtotal = 0;
        inCartArray.forEach((item)=>{
            const { qty,price } = item;
            const itemSubtotal = parseInt(qty)*parseInt(price);
            subtotal += itemSubtotal;
        });
        return {
                    "prime": cardPrime,
                    "order": {
                    "shipping": "delivery",
                    "payment": "credit_card",
                    "subtotal":subtotal,
                    "freight": 30,
                    "total": parseInt(subtotal)+30,
                    "recipient": {
                        "name": document.querySelector('#order-name').value,
                        "phone": document.querySelector('#order-phone').value,
                        "email": document.querySelector('#order-email').value,
                        "address": document.querySelector('#order-address').value,
                        "time": checkedTime
                    },
                    "list": checkOutList
                    }
                 }
    }
    console.log(generateOrder());

function postCheckOut (postOrderData){
    const url = `https://api.appworks-school.tw/api/1.0/order/checkout`;
    fetch(url, {
        body: JSON.stringify(postOrderData), // must match 'Content-Type' header
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, same-origin, *omit
        headers: { 'content-type': 'application/json',
                    'authorization': `Bearer ${fbAccessToken}`
        },

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, cors, *same-origin
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // *client, no-referrer
      })
      .then(response => { 
        return  response.json();
      })
      .then( json => {
          const {number} = json.data;
          console.log(number);
        //   console.log(fbAccessToken);
          localStorage.removeItem('inCartData');
          window.location.href = `thankyou.html?order=${number}`;

      })
      .catch(error => {console.log(error)})

}

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime');
        document.querySelector('.checkout-button').textContent = "請重新輸入信用卡號";
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {

            console.log('get prime error ' + result.msg);
            return
        }
            alert(' 付款成功！');
            document.querySelector('.checkout-button').textContent = "付款成功";
            
            
            const postOrderData = generateOrder(result.card.prime);
            console.log(result.card.prime);
            console.log(postOrderData);
            postCheckOut(postOrderData);
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        })

 

}