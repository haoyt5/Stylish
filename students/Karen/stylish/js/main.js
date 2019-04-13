//*** Render the prodouct Grids in the #list.element  
        const emptyGrids = () => {
            const list = document.getElementById('list');
			list.innerHTML = '';
		};

		let productID;
		// const renderCatorgories = (data) =>{
		// 	const 
		// }

        const renderGrids = (data) => {
			const list = document.getElementById('list');
			data.forEach(item => {
				const {main_image, colors, title, price, id } = item;

				const itemOnethird = document.createElement('DIV');
				itemOnethird.className = 'col-1-3';

				const itemContentainer = document.createElement('DIV');
				itemContentainer.className = 'item-contentainer';


				let productID = id;
				const urlHolder= document.createTextNode(' '); 
				const itemhref = document.createElement('A');
				itemhref.href = `./product.html?id=${productID}`;
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
				itemhrefthird.href = `../product.html?id=${productID}`
				itemContentainer.appendChild(itemhrefthird).appendChild(itemHolder);
				itemContentainer.appendChild(itemhrefthird).appendChild(priceHolder);

				console.log('The generating code will be: ',itemOnethird);
				list.appendChild(itemOnethird);
			});
		};


//*** Define the landing's Loading holder
		document.getElementById('list').innerHTML = '<img src="./images/loading.gif" />';
		const domain = 'https://api.appworks-school.tw/api/1.0/';
		const src = `${domain}products/all`;
		let currentPagenumber;
		let pageSwitchTag= true;
//*** Fetch All products src as renderGrids() default page
		fetch(src)
			.then(function(response){
				console.log('load the all product data succesully!', response);
				return response.json(); //convert the data into JSON format
			})
			.then(json => {
				currentPagenumber = json.paging;
                emptyGrids();
				renderGrids(json.data)
				if (json.paging ===undefined){
					let pageSwitchTag =false;
					let currentPagenumber =1;
				}
			});



		const categoryDefault = "all"
		let categorySwitch = "all"; 



//*** Make the catergory renderGrids button by document.querySelectorAll('.btn-catergories').addEventListenr('click') and fetch corresponding API to renderGrids
		document
			.querySelectorAll('.btn-catergories')
			.forEach((btn) => {
				btn.addEventListener('click', function () {
					const category = this.id;
					categorySwitch = categoryDefault.replace("all",this.id);
					const src = `${domain}products/${category}`;
					fetch(src)
						.then(function(response){
							console.log('load the certain category\'s data succesully!', response);
							return response.json(); //convert the data into JSON format
						})
						.then(json => {
							currentPagenumber = json.data.paging;
							
                            emptyGrids();
							renderGrids(json.data);
							if( json.paging == undefined){
								let pageSwitchTag = false; 
							}
							if (categorySwitch !== "all" && json.paging !== undefined ){
								currentPagenumber = 1;
								pageSwitchTag = true;
							}
							// if( currentPagenumber === undefined){
							// 	let pageSwitchTag = false;
							// }

						});
				}, false);
			});

//Define the position value of the Footer's bottom 
const FooterDiv = document.querySelector('.footer');
const FooterDivBottom =  FooterDiv.getBoundingClientRect().bottom;

const windowInnerHeight = window.innerHeight;
const windowScrollY = window.scrollY;
window.onscroll = scroll;

let currentUrl;

// let currentPagenumber = 0;
let testUrl;
let newUrl;



//*** Scroll Pagination Feature
function scroll( ){
					// console.log(Math.round(FooterDiv.getBoundingClientRect().bottom) ,windowInnerHeight);
					// // Make an undefined paging number filter 'pageSwitchTag' for the end of the gagination 
					// 	testUrl = `http://18.214.165.31/api/1.0/products/${categorySwitch}?paging=${currentPagenumber}`;
					// 	fetch(testUrl)
					// 	.then(function(response){
					// 			return response.json(); 
					// 	})
					// 	.then(function(json){
					// 		currentPagenumber = json.paging;
					// 		if (json.paging === undefined){
					// 			pageSwitchTag = false; 
					// 		}
					// 	});




	// Scroll to the buttom
	if ( Math.round(FooterDiv.getBoundingClientRect().bottom) === window.innerHeight && pageSwitchTag ) {

		console.log('Start the pagination feature HERE');
		// if (categorySwitch === "all" && currentPagenumber ===0){ 
		// 	currentPagenumber =1;// the landing page already generate the page 0 make the all producta psge start from page 1
		// }
		// if (currentPagenumber === undefined ){
		// 	let pageSwitchTag =false;
		// }
		// let pageSwitchTag ="false";
		// const desktopSearchText = document.getElementById('desktopSearchInput').value;
		// const mobileSearchText = document.getElementById('mobileSearchInput').value;
		// const searchText = desktopSearchText || mobileSearchText;

		
		testUrl = `https://api.appworks-school.tw/api/1.0/products/${categorySwitch}?paging=${currentPagenumber}`;
		console.log('滾到底部抓進來資料的來源Url',testUrl);
		fetch(testUrl)
		    .then(function(response){
		            console.log('load the pagination data successfuly!', response);
					return response.json(); 
			})
		    .then(function(json){
				if (json.paging !== undefined && currentPagenumber > 0 && pageSwitchTag){
					currentPagenumber = json.paging;
					renderGrids(json.data);
				}if (json.paging === undefined){
					pageSwitchTag =false;		
				}
		    });
		}
}


//*** Search by onSearchSubmit fuction by get the inputvalue
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








//*** Render the campaign and use setInterval to make it change every 10*1000 
		let campaignIndex = 0;
		let campaignData = [];
		const renderCampaign = (item) => {
			const { picture, story } = item;
			const hostName = 'https://api.appworks-school.tw';
			const imgUrl = hostName + picture;
			const quotes = story.split('\r\n');
			const subtitle = quotes.pop();
			const inner = `
				<div class="jombotron-imagebox" style="background-image: url('${imgUrl}') ">
					<div class="container campaigntextwrapper">
						
						<!-- <a href="#"></a> -->
						<div class="campaigntext">
							<h1>
								${quotes.join('<br />')}
							</h1>
							<h4>${subtitle}<h4>
						</div>

					</div>
				</div>
			`;

			document.getElementById('promoteList').innerHTML = inner;
        };
        
		fetch('https://api.appworks-school.tw/api/1.0/marketing/campaigns')
			.then(function(response){
				console.log('load the campaigns data succesully!', response);
				return response.json(); //convert the data into JSON format
			})
			.then(function renderJumbotron(json) {
				const { data } = json;
				const item = data[0];
				campaignData = data;
				renderCampaign(item);			
				setInterval(() => {
					campaignIndex = (campaignIndex + 1) % campaignData.length;
					renderCampaign(campaignData[campaignIndex]);
				}, 10 * 1000);
			});		