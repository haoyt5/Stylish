
let orderURLstring = window.location; 
let orderURL = new URL(orderURLstring);
let orderNumber = orderURL.searchParams.get('order');

console.log(orderNumber);


const renderOrderNumber = (orderNumber) =>{
    document.querySelector('.serialnumber').textContent = " ";
    document.querySelector('.serialnumber').textContent = orderNumber;
}
renderOrderNumber(orderNumber);