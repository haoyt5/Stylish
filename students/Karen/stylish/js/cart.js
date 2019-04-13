
const shoppingcart_block = document.getElementById('shoppingcart-block');
const payment_block = document.getElementById('payment-block');
const order_info_block = document.getElementById('order-info-block');
const order_sum_block = document.getElementById('order-sum-block');
const inCartCountHolder = document.querySelector('.bag-count');
function clearShoppingCartBlock (){
    shoppingcart_block.innerHTML = "";
}


function zeroIntheCart (){
    shoppingcart_block.innerHTML = `<div class="item-shippingcart-wrapper u-flex-cente">
    <div class="item-row">
        <p class="empty-words">您的購物車是空的</p>
    </div>
</div>`;
    payment_block.innerHTML = "";
    order_info_block.innerHTML = "";
    order_sum_block.innerHTML = "";
    inCartCountHolder.textContent = "0";
}


    

const getSubtotal = () =>{
    const checkOutArray = JSON.parse(localStorage.getItem('inCartData')) || [];
    let total = 0;
    checkOutArray.forEach((item) =>{
        const { qty,price } = item;
        const itemSubtotal = parseInt(qty)*parseInt(price);
        total += itemSubtotal;
    }); 
    return total;
}
const removeItemInCart = (modelNum) => {
    const checkOutArray = JSON.parse(localStorage.getItem('inCartData')) || [];
    const filteredArray = checkOutArray.filter((item) => item.model_number !== modelNum)
    localStorage.setItem('inCartData', JSON.stringify(filteredArray));
    shoppingcart_block.innerHTML = '';
    filteredArray.forEach((item) => {
        const elem = renderCheckoutItem(item);
        shoppingcart_block.innerHTML += elem;
    });
    if ( checkOutArray.length === 1 ){
        zeroIntheCart ()
    }else{
        renderSumBlock();
    }



    const inCartData = JSON.parse(localStorage.getItem('inCartData')) || [];
    console.log('已存在的inCartData有：', inCartData );
    let inCartItemQuantity = 0;
    for(let i = 0; i< inCartData.length; i++){
        inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
    }
    clearInCartSum();
    renderInCartSum(inCartItemQuantity);
};


const onQuantityChange = (modelNum, val) => {
    const checkOutArray = JSON.parse(localStorage.getItem('inCartData')) || [];
    const adjustedArray = checkOutArray.map((item) => {
        if (modelNum === item.model_number) {
            item.qty = val;
        }
        return item;
    });
    console.log(adjustedArray);
    localStorage.setItem('inCartData', JSON.stringify(adjustedArray));
    shoppingcart_block.innerHTML = '';
    adjustedArray.forEach((item) => {
        const elem = renderCheckoutItem(item);
        shoppingcart_block.innerHTML += elem;
    });
    renderSumBlock();

    const inCartData = JSON.parse(localStorage.getItem('inCartData')) || [];
    console.log('已存在的inCartData有：', inCartData );
    let inCartItemQuantity = 0;
    for(let i = 0; i< inCartData.length; i++){
        inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
    }
    clearInCartSum();
    renderInCartSum(inCartItemQuantity);
};

const renderSumBlock = () => {
    const subtotal = getSubtotal();
    order_sum_block.innerHTML = `                <div class="container">
    <div class="item-row">
        <div class="col-r-3-12">
            <div class="item-row u-padding-tb-sum">
               <div class="col-3-24">
                   <div class="label-sum">總金額</div>
               </div>
               <div class="col-3-24">
                   <div class="amount">${subtotal}</div>
               </div>
            </div>
            <div class="item-row u-padding-tb-sum">
               <div class="col-3-24">
                   <div class="label-sum">運費</div>
               </div>
               <div class="col-3-24">
                   <div class="amount">30</div>
               </div>
           </div>
            <div class="item-row">
            <hr>
            </div>
            <div class="item-row u-padding-tb-sum">
               <div class="col-3-24">
                   <div class="label-sum">應付金額</div>
               </div>
               <div class="col-3-24">
                   <div class="amount">${subtotal + 30}</div>
               </div>
            </div>
        </div>
    </div>
    <div class="item-row">
        <div class="col-r-btn-3-12">
           <div class="buttonwrapper u-padding-tb-sum u-padding-button-t">
           <button class="checkout-button" type="submit" onclick=" onSubmit(event)">確認付款</button>
           </div>
        </div>
    </div>
</div>
</div>`;
}
const renderInfoBlock = () =>{
    order_info_block.innerHTML=`                 <div class="container">
    <div class="order-heading">
        訂購資料
    </div>
    <hr>
    <div class="order-row">
       <label for="order-name" class="label-name">收件人姓名</label>
       <input type="text" id="order-name" class="input-order"><br>
       <div class="notification-words">
           <span class="u-float-right">務必填寫完整收件人姓名，避免包裹無法順利簽收</span>
       </div>
    </div>
    <div class="order-row">
    <label for="order-phone" class="label-order">手機</label>
    <input type="tel" id="order-phone" class="input-order"><br>
   </div>
   <div class="order-row">
    <label for="order-address" class="label-order">地址</label>
    <input type="text" id="order-address" class="input-order"><br>
   </div>
   <div class="order-row">
   <label for="order-email" class="label-order">Email</label>
   <input type="text" id="order-email" class="input-order"><br>
   </div>
  <div class="order-row"> 
   <label class="label-time">配送時間</label>
    <input type="radio" id="for_8_12" value="morning" name="delivery_time"><label class="radio-order" for="for_8_12">08:00-12:00</label>
    <input type="radio" id="for_14_16" value="afternoon" name="delivery_time"><label class="radio-order" for="for_14_16">14:00-18:00</label>
    <input type="radio" id="for_anytime" value="anytime" name="delivery_time"><label class="radio-order" for="for_anytime">不指定</label>
   </div>
</div>`;
}
const renderPaymentBlock = () =>{
    payment_block.innerHTML=`               <div class="container">
    <!-- Start the paymnet dropdown selection-->
    <div class="payment-wrapper u-grey-backgroundcolor u-payment-tb-padding">
        <div class="item-row">
            <div class="col-7-24">
                <div class="u-flex">
                    <label class="payment-label" for="shipment">配送國家</label>
                    <select class="payment-dropdown" name="shipment" id="shipment">
                        <option value="domestic">臺灣及離島</option>
                    </select>
                </div>
            </div>
            <div class="col-7-24">
                <div class="u-flex">
                    <label  class="payment-label" for="payment">付款方式</label>
                    <select class="payment-dropdown" name="payment" id="payment">
                    <option value="to_door">宅配貨到付款</option>
                    </select>
                </div>
            </div>
        </div> 
    </div>
    <!-- End the paymnet dropdown selection-->
    <!-- Start the notification div-->
    <div class="payment-notification-wrapper u-payment-tb-padding">
        <div class="notification-graph">
            ※ 提醒您：<br>
            ● 選擇宅配-請填寫正確收件人資訊，避免包裹配送不達<br>
            ● 選擇超商-請填寫正確收件人姓名(與證件相符)，避免無法領取
        </div>
    </div>
    <!-- End the notification div-->
</div>
`;
}
const renderCheckoutItem = (item) =>{
    const {main_image, name, id, color: { name: colorName }, size, qty, current_stock, model_number,price} = item;
    const subtotal = parseInt(qty)*parseInt(price)
    return `                            <div class="item-shippingcart-wrapper">
    <div class="item-row u-flex-center">
        <div class="card-2-12 ">
            <div class="cart-main-imagebox ">
                <div class="cart-imagebox-inner">
                    <img class="cart-image" src="${main_image}" alt="">
                </div>
            </div>
        </div>
        <div class="card-3-12">
            <div class="cart-item-info">
                <div class="cart-item-tittle">${name}</div>
                <div class="cart-item-id">${id}</div>
                <div class="cart-item-color">${colorName}</div>
                <div class="cart-item-size">${size}</div>
            </div>
        </div>
        <div class="card-1-12 u-holder ">
            <div class="cart-removebox mobile-remove">
                <div class="cart-removebox-inner">
                    <div class="icon-removecart" onclick="removeItemInCart('${model_number}')"></div>
                </div>
            </div>
        </div>
        <div class="card-5-36 desktop-remove">
            <div class="card-info unit-count">
                <select name="count" class="unit_quantity" onchange="onQuantityChange('${model_number}', event.target.value)">
                    ${
                        Array(parseInt(current_stock, 10)).fill(0).map((_, i) => {
                            const q = i + 1;
                            if (q  === parseInt(qty, 10)) {
                                return `<option value="${q}" selected>${q}</option>`;
                            } else {
                                return `<option value="${q}">${q}</option>`;
                            }
                        })
                    }
                </select>
            </div>
        </div>
        <div class="card-5-36 desktop-remove">
            <div class="card-info unit-price">${price}</div>
        </div>
        <div class="card-5-36 desktop-remove ">
            <div class="card-info unit-sum">${subtotal}</div>
        </div>
        <div class="card-1-12 desktop-remove">
            <div class="card-info">
                <div class="cart-removebox">
                    <div class="cart-removebox-inner">
                        <div class="icon-removecart" onclick="removeItemInCart('${model_number}')"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="item-row u-flex-center mobile-remove">
        <div class="card-1-3">
            <div class="mobile-unit-label">數量</div>
            <div class="card-info unit-count">
                <select name="count" class="unit_quantity" onchange="onQuantityChange('${model_number}', event.target.value)">
                ${
                    Array(parseInt(current_stock, 10)).fill(0).map((_, i) => {
                        const q = i + 1;
                        if (q  === parseInt(qty, 10)) {
                            return `<option value="${q}" selected>${q}</option>`;
                        } else {
                            return `<option value="${q}">${q}</option>`;
                        }
                    })
                }
                </select>
            </div>
        </div>
        <div class="card-1-3">
            <div class="mobile-unit-label">單價</div>
            <div class="card-info unit-price">${price}</div>
        </div>
        <div class="card-1-3">
            <div class="mobile-unit-label">小計</div>
            <div class="card-info unit-sum">${subtotal}</div>
        </div>
    </div>`;

}
{
    const CheckoutData = JSON.parse(localStorage.getItem('inCartData')) || [];
    console.log('CheckoutData ', CheckoutData );
    zeroIntheCart ();
    if(localStorage.getItem('inCartData')=== null || CheckoutData.length === 0 ){
        zeroIntheCart ();
    }else{
        renderSumBlock();
        renderInfoBlock();
        renderPaymentBlock();
        clearShoppingCartBlock ();
        CheckoutData.forEach((item) => {
            const elem = renderCheckoutItem(item);
            shoppingcart_block.innerHTML += elem;
        });

    }
}
