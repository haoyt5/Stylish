 /* eslint-disable no-unused-vars*/
const HOSTNAME = 'https://api.appworks-school.tw';
const apiVersion = '1.0';
const productEndPoint = '/products/details';
let productURLstring = window.location;   //Retrieve the string from window.location 
let productURL = new URL(productURLstring);
let productID = productURL.searchParams.get('id');
const colorSizeMap = {};
const sizeColorMap = {};
let colorClicked;
let colornameClicked;
let sizeClicked;
const updateCartButton = document.getElementById('addToCart');

//////////// Disable the addToCart Button
function outOfStock(stock){
    if( stock < 1){
        updateCartButton.innerHTML = "此項商品已沒有庫存";
    }else{
        updateCartButton.innerHTML = `請選擇低於 ${stock} 件`;
    }
    updateCartButton.classList.add('u-disabled');
}
////// shoppingCartCount updating function
function clearInCartSum () {
    document.getElementsByClassName('current-item__shoppingcart')[0].innerHTML = "0";
    document.getElementsByClassName('current-item__shoppingcart')[1].innerHTML = "0";
}
function renderInCartSum (string){
    document.getElementsByClassName('current-item__shoppingcart')[0].innerHTML = string;
    document.getElementsByClassName('current-item__shoppingcart')[1].innerHTML = string;
}
//////////// cleanClassname Helper
const cleanClassName = (selector, className) => {
    selector.forEach((elem) => {
        elem.classList.remove(className);
    });
};

//////////// Stock Validator
const stockValidator = () => {
    // console.log('stockValidator');
    // console.log(colorClicked, sizeClicked,colornameClicked);


    const inputQuantity = parseInt(document.getElementById('number').value, 10);
    if (colorClicked && !sizeClicked) {
        cleanClassName(document.querySelectorAll('.size-element'), 'u-disabled');
        cleanClassName(document.querySelectorAll('#addToCart'), 'u-disabled');
        document.getElementById('addToCart').innerHTML = "加入購物車";
        Object.entries(colorSizeMap[colorClicked]).forEach(([size, stock]) => {
            // console.log(size, stock);
            if (inputQuantity > stock) {
                document.querySelectorAll('.size-element').forEach((item) => {
                    if (item.getAttribute('size') === size) {
                        item.classList.add('u-disabled');
                    }
                });
                // alert('存貨量為：'+ stock + ' 無法加入購物車');
                document.getElementById('number').value = stock;
                outOfStock(stock);
            }
        });
    } else if (!colorClicked && sizeClicked) {
        cleanClassName(document.querySelectorAll('.colorbox__variant'), 'u-disabled');
        cleanClassName(document.querySelectorAll('#addToCart'), 'u-disabled');
        document.getElementById('addToCart').innerHTML = "加入購物車";
        Object.entries(sizeColorMap[sizeClicked]).forEach(([color, stock]) => {
            // console.log(size, stock);
            if (inputQuantity > stock) {
                document.querySelectorAll('.colorbox__variant').forEach((item) => {
                    if (item.getAttribute('code') === color) {
                        item.classList.add('u-disabled');
                    }
                });
                // alert('存貨量為：'+ stock + ' 無法加入購物車');
                document.getElementById('number').value = stock;
                outOfStock(stock);
            }
        });
    } else if (colorClicked && sizeClicked) {
        const stock = colorSizeMap[colorClicked][sizeClicked];
        cleanClassName(document.querySelectorAll('#addToCart'), 'u-disabled');
        document.getElementById('addToCart').innerHTML = "加入購物車";
        // console.log(size, stock);
        if( inputQuantity > stock ){
            // alert('存貨量為：'+ stock + ' 無法加入購物車');
            document.getElementById('number').value = stock;
            outOfStock(stock);
        }
    }
};


function increaseValue(){
    let value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
    stockValidator();
}



function decreaseValue(){
    let value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
    stockValidator();
}

//**** Render Product Details *****//
// const detailsStroy = document.getElementById('detailsStroy');
const renderProduct = (data) =>{
    const {main_image,title,id,images,price,note,place,texture,description,story} = data;   
    const mainInfoinner =`
    <h1  itemprop="name" class="product-title">${title}</h1>
    <h4 class="product-id">${id}</h4>
    <span itemprop="offers" itemscope itemtype="http://schema.org/Offer"><h2  itemprop="price" class="product-price">${price}</h2></span>`
    ; 
    document.querySelector('#productMainInfo').innerHTML = mainInfoinner;

    const mainImageinner =`
        <div class="product-imagebox-inner">
            <img  itemprop="image" class="product-main-image" src="${main_image}">
        </div>
    `;
    document.querySelector('#productMainImage').innerHTML = mainImageinner;

    const annotations = description.split('\r\n');
    const detailInfoinner =`
    <p class="product-note">${note}</p>
    <p class="product-texture">${texture}</p>
    <p class="product-description">${annotations.join('<br/>')}</p>
    <p class="product-place">${place}</p>
    <p class="product-processing">${place}</p>`
    ;
    document.querySelector('#productDetailInfo').innerHTML = detailInfoinner;
       
    const detailsStoryBoard = document.querySelector('#detailsStoryBoard');
    detailsStoryBoard.innerHTML = "";

    images.forEach((image) =>{
        const storyImageBox = document.createElement('DIV');
        storyImageBox.className = 'content-imagesbox';
        const storyImageBoxinner = document.createElement('DIV');
        storyImageBoxinner.className = 'content-imagebox-inner';    
        const storyImage = document.createElement('img');
        storyImage.src = image;
        storyImage.className = 'content-images';

        const storyBox = document.createElement('DIV');
        storyBox.className = 'content-stroriesbox';
        storyBox.innerHTML = `<p>${story}</p>`;

        detailsStoryBoard.appendChild(storyImageBox).appendChild(storyImageBoxinner).appendChild(storyImage);
        detailsStoryBoard.appendChild(storyBox);
    });

};

const renderColorVariants = (data) =>{
    const {colors} = data;
    const colorsWrapper = document.querySelector('#colorsWrapper');
    colorsWrapper.innerHTML = "";
    let colorsdata;
    colorsdata = colors;
    colorsdata.forEach((color) => {
        const colorbox = document.createElement('DIV');
        colorbox.className = 'colorbox__variant';
        colorbox.setAttribute('code',color.code);
        colorbox.setAttribute('colorname',color.name);
        const colorelement = document.createElement('DIV');
        colorelement.className ='color-element'
        colorelement.style.backgroundColor = '#' + color.code + ' ';
        if (color.code === 'FFFFFF'){
            colorelement.classList.add('u-border-colorbox');
        }
        colorsWrapper.appendChild(colorbox).appendChild(colorelement);
    });
    // const colorfirstbox = document.getElementsByClassName('colorbox__variant')[0];
    // colorfirstbox.classList.add('u-color-selected');
};

const renderSizeVariants= (data) =>{
    const { sizes } = data;
    const sizesWrapper = document.querySelector('#sizesWrapper');
    sizesWrapper.innerHTML = "";
    let sizesData;
    sizesData = sizes;

    sizesData.forEach((size)=>{
        const sizeBox = document.createElement('DIV');
        sizeBox.className = 'sizebox__variant';
        const sizeElement = document.createElement('DIV');
        sizeElement.className = 'size-element';
        sizeElement.setAttribute('size',size);
        sizesWrapper.appendChild(sizeBox).appendChild(sizeElement).append(size);
    });    
};




fetch(`${HOSTNAME}/api/${apiVersion}${productEndPoint}?id=${productID}`)
    .then(function(response){
        console.log('load the product page data succesully!', response);
        return response.json(); //convert the data into JSON format
    })
    .then((json) =>{
        console.log('Loading to the product id=',productID);
        console.log('json.data',json.data);
        renderProduct(json.data);
        renderColorVariants(json.data);
        renderSizeVariants(json.data);
        clearInCartSum ()
/////////////////////////////////// Process the data of the variants of the product 

    json.data.variants.forEach((item) => {
        const {color_code, size, stock} = item;
        if(!colorSizeMap[color_code]) {
            colorSizeMap[color_code] ={};
        }
        colorSizeMap[color_code][size] = stock;
        if(!sizeColorMap[size]) {
            sizeColorMap[size] ={};
        }
        sizeColorMap[size][color_code]= stock;
    });
    
///////////////////////////////////////////////////////////////////////////////
        const colorBoxVariants = document.querySelectorAll('.colorbox__variant');
        colorBoxVariants.forEach((colorbtn)=>{
            colorbtn.addEventListener('click', function(event) {
                if (this.classList.contains('u-disabled')) {
                    return;
                }
                cleanClassName(document.querySelectorAll('.colorbox__variant'), 'u-color-selected');
                this.classList.add('u-color-selected');
                // colorClicked = rgbToColorCode(colorbtn.style.backgroundColor);
                colorClicked = colorbtn.getAttribute("code");
                colornameClicked = colorbtn.getAttribute('colorname');
                // console.log('Select Color:', colorClicked ,colornameClicked);
                stockValidator();
            },false);
        });
        const sizeElementVariants = document.querySelectorAll('.size-element');
        sizeElementVariants.forEach((sizebtn)=>{
            sizebtn.addEventListener('click', function(){
                if (this.classList.contains('u-disabled')) {
                    return;
                }
                cleanClassName(document.querySelectorAll('.size-element'), 'u-size-selected');
                this.classList.add('u-size-selected');
                sizeClicked = event.target.textContent;
                // console.log('Select Size:',sizeClicked);
                stockValidator();
            },false);
        });
//////////////////////////////////////////////////////////////
    })
    .catch( err => {
        console.log(err);
      });



////// Update Add to Shopping Cart Feature(By Local Storage)////////////////////////////////////////////////////////


function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e){
            return false;
        }
}

window.onload = function () {
    // console.log('start the window.load');
    const shoppingCartForm = document.getElementById('shoppingCartForm');
    const shoppingId = document.querySelector('.product-id').textContent;
    const shoppingTitle = document.querySelector('.product-title').textContent;
    const shoppingPrice = document.querySelector('.product-price').textContent;
    // const shoppingImg = document.querySelector('.product-main-image').src;
    const inCartData = JSON.parse(localStorage.getItem('inCartData')) || [];
    console.log('Already Exist inCartData：', inCartData );

    let inCartItemQuantity = 0;
        for(let i = 0; i< inCartData.length; i++){
            inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
        }
        clearInCartSum ()
        renderInCartSum (inCartItemQuantity);
    shoppingCartForm.addEventListener('submit',function(event){ 
        event.preventDefault();
        if(document.querySelector('.u-color-selected') == null){
            alert('請選擇顏色');
            document.getElementsByClassName('addtocart-button')[0].innerHTML = "請選擇顏色";
            return;
        }
        if(document.querySelector('.u-size-selected') == null){
            alert('請選擇尺寸');
            document.getElementsByClassName('addtocart-button')[0].innerHTML = "請選擇尺寸";
            return;
        }
        if(document.getElementById('number').value < 1 ){
            alert('請選擇數量');
            document.getElementsByClassName('addtocart-button')[0].innerHTML = "請選擇數量";
            return;
        }
        let model_number = shoppingId + colorClicked + sizeClicked;
        let updateCartData = {
                        model_number: model_number,
                        id:  shoppingId,
                        name: shoppingTitle,
                        price: shoppingPrice,
                        color: {
                            name: colornameClicked,
                             code:  colorClicked
                        },
                        size: sizeClicked,
                        qty: document.getElementById('number').value,
                        main_image: document.querySelector('.product-main-image').src,
                        current_stock : colorSizeMap[colorClicked][sizeClicked] ///This is the initial stock get from the API 
                    };

        const inCartArray = JSON.parse(localStorage.getItem('inCartData')) 
        if ( inCartArray ){
            let repeatedItem = inCartArray.find( element => element.model_number === updateCartData.model_number);
            // let repeatedIndex = inCartArray.findIndex(item => item === updateCartData.model_number);
            if ( repeatedItem ) {
                let initialStock = repeatedItem.current_stock;
                if( parseInt(updateCartData.qty) + parseInt(repeatedItem.qty) > initialStock ){
                    alert('數量超過庫存,無法加入購物車'); //The input quantity is out of the initial stock.
                    let restStock = initialStock - parseInt(repeatedItem.qty);
                    outOfStock(restStock);
                } else {
                    repeatedItem.qty = parseInt(updateCartData.qty) + parseInt(repeatedItem.qty);
                    localStorage.setItem('inCartData' , JSON.stringify(inCartArray));
                    alert('成功加入購物車'); // Add to localStorage
                    // Render the cart count //
                    const inCartData = JSON.parse(localStorage.getItem('inCartData'));
                    let inCartItemQuantity = 0;
                    for(let i = 0; i< inCartData.length; i++){
                        inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
                    }
                    clearInCartSum ();
                    renderInCartSum (inCartItemQuantity);
                }
            } else {
                inCartArray.push(updateCartData);
                localStorage.setItem('inCartData',JSON.stringify(inCartArray));
                alert('成功加入購物車'); // Add to localStorage
                // Render the cart count //
                const inCartData = JSON.parse(localStorage.getItem('inCartData'));
                let inCartItemQuantity = 0;
                for(let i = 0; i< inCartData.length; i++){
                    inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
                }
                clearInCartSum ();
                renderInCartSum (inCartItemQuantity);
            }   
        }else{
            const emptyInCartArray =[]
            emptyInCartArray.push(updateCartData);
            localStorage.setItem('inCartData' ,JSON.stringify(emptyInCartArray));   
            // Render the cart count //
            const inCartData = JSON.parse(localStorage.getItem('inCartData'));
            alert('成功加入購物車'); 
            let inCartItemQuantity = 0;
            for(let i = 0; i< inCartData.length; i++){
                inCartItemQuantity = inCartItemQuantity + parseInt(inCartData[i].qty);
            }
            clearInCartSum ();
            renderInCartSum (inCartItemQuantity);
        }

        });

};



//*** Render the prodouct Grids in the #list.element  
const emptyGrids = () => {
    const list = document.getElementById('list');
    list.innerHTML = '';
};

const renderGrids = (data) => {
    const list = document.getElementById('list');
    data.forEach(item => {
        const {main_image, colors, title, price } = item;
        const itemOnethird = document.createElement('DIV');
        itemOnethird.className = 'col-1-3';

        const itemContentainer = document.createElement('DIV');
        itemContentainer.className = 'item-contentainer';

        const urlHolder= document.createTextNode(' ');
        const itemhref = document.createElement('A');

        const imageHolder = document.createElement('DIV');
        imageHolder.className ='itempic' ;
        imageHolder.classList.add('u-margin-tp-30');
        imageHolder.style.backgroundImage = 'url(\''+ main_image +' \')';
        
        itemhref.appendChild(itemContentainer).appendChild(urlHolder);

        itemOnethird.appendChild(itemContentainer).appendChild(itemhref).appendChild(imageHolder).appendChild(urlHolder);

        const contentHolder = document.createElement('DIV');
        contentHolder.className='itemcolors';
        const itemhrefsecond = document.createElement('A');

        itemhrefsecond.appendChild(contentHolder);

        colors.forEach((color) => {
            const selectorHolder = document.createElement('DIV');
            const isWhite = color.code === 'FFFFFF';
            selectorHolder.className = isWhite ? 'u-grey-border' : 'colorselector';
            selectorHolder.style.backgroundColor = '#' + color.code + ' ';
            itemhrefsecond.appendChild(contentHolder).appendChild(selectorHolder);
        });


        itemContentainer.appendChild(itemhrefsecond).appendChild(contentHolder).appendChild(urlHolder);
        

        const itemHolder = document.createElement('P');
        itemHolder.append(title);
        itemHolder.className='itemname';
        itemHolder.classList.add('itemfont');

        const priceHolder = document.createElement('P');
        priceHolder.append(price);
        priceHolder.className='itemprice';
        priceHolder.classList.add('itemfont');

        const itemhrefthird = document.createElement('A');
        itemContentainer.appendChild(itemhrefthird).appendChild(itemHolder);
        itemContentainer.appendChild(itemhrefthird).appendChild(priceHolder);

        // console.log('The generating code will be: ',itemOnethird);
        list.appendChild(itemOnethird);
    });
};
//*** Search by onSearchSubmit fuction by get the inputvalue
/* exported onSearchSubmit */

const onSearchSubmit = (e) => {
    e.preventDefault();
    const desktopSearchText = document.getElementById('desktopSearchInput').value;
    const mobileSearchText = document.getElementById('mobileSearchInput').value;
    const searchText = desktopSearchText || mobileSearchText;
    console.log('here is text');
    console.log(searchText);
    const url = `https://api.appworks-school.tw/api/1.0/products/search?keyword=${searchText}`;
    console.log('here');
            console.log(url);
    fetch(url)
        .then(res => res.json())
        .then((json) => {
            console.log('here is data');
            console.log(json);
            const { data } = json;
            if (data.length) {			
                emptyGrids();	
                renderGrids(json.data);
            } else {
                document.getElementById('list').innerHTML = '<h2 style="padding:10vh 0" >沒有相關的物品。</h2>';
            }
        });
};

//// RGBtoHexConverter
const rgbToHex = function (rgb) { 
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = '0' + hex;
    }
    return hex;
};

const fullColorHex = function(r,g,b) {   
    const red = rgbToHex(r);
    const green = rgbToHex(g);
    const blue = rgbToHex(b);
    console.log(red, green, blue);
    return red+green+blue;
  };
function rgbToColorCode(str){
    console.log(str);
    const [r, g, b] = str.match(/\d+/g);
    let hex = fullColorHex(r, g, b).toUpperCase();
    return hex;
}