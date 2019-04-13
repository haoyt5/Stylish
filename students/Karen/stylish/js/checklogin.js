// This is called with the results from from FB.getLoginStatus().
			function statusChangeCallback(response) {
				console.log('statusChangeCallback');
				console.log(response);
				// The response object is returned with a status field that lets the
				// app know the current login status of the person.
				// Full docs on the response object can be found in the documentation
				// for FB.getLoginStatus().
				if (response.status === 'connected') {
                // Logged into your app and Facebook.
                localStorage.setItem('fbAccessToken', response.authResponse.accessToken);         
				checkAPI();
				console.log('Login successfully!');
				} else {
				// The person is not logged into your app or we are unable to tell.
				console.log('View as a visitor!')
				}
			}
			function checkLoginState() {
				FB.getLoginStatus(function(response) {
				statusChangeCallback(response);
				});
			}
			window.fbAsyncInit = function() {
				FB.init({
					appId      : '261453534755556',
					// appId      : '313032016232503', //localhost Test appId
					cookie     : true,
					xfbml      : true,
					version    : 'v3.2'
				});
			
				FB.getLoginStatus(function(response) {		
					statusChangeCallback(response);
					});
	
				};
			(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
	
			function checkAPI () {
				console.log('Log into the Stylish! Fetching your information...');
				FB.api('/me?fields=email,name,picture', function(response) {
                    
                    console.log('Thanks for logging in, '+ response.name + '!');
	
				});
			}