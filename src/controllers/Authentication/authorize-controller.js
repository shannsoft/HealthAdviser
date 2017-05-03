
app.controller('AuthenticationController',function($scope,$rootScope,$timeout,Util,AuthorizeService,$state,DoctorDetailsService,$state,$localStorage,$location){
	$scope.user = {};
	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
	/****************************************************************************/
    /****************FUNCTION USE FOR LOAD CITY LIST FORM GOOGLE*****************/
  	/****************************************************************************/
	var options = {
	    componentRestrictions: {country: "IN"},
	    types: ['(cities)']
	};
	$scope.initRegister = function(){
		if(google=="" || !google.maps || !google.maps.places)
        	googleTime = $timeout($scope.initRegister , 3000);
	    else {
	      	clearTimeout(googleTime);
			var inputFrom = document.getElementById('city');
			var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
			google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
			    populateAddressFields(autocompleteFrom.getPlace());
			    $scope.$apply();
			});
		}
	}
	function populateAddressFields(place) {
	    if (place.geometry) {
	      $scope.user.latLng = place.geometry.location.lat() + "," + place.geometry.location.lng();
	    }
	    $scope.user.city = place.name;
	}

	/****************************************************************************/
    /***********************FUNCTION USE FOR CHECK PASSWORD**********************/
  	/****************************************************************************/
	$scope.validatePassword = function(){
		if($scope.user.password !== $scope.user.c_pass){
	      $scope.showPasswordMisMatch = true;
	    }
	   	if($scope.user.password === $scope.user.c_pass) {
	      $scope.showPasswordMisMatch = false;
	    }
	}
	/****************************************************************************/
    /***********************FUNCTION USE VALIDATE USER MAIL**********************/
  	/****************************************************************************/
	$scope.validateUserInfo = function(email) {
		var obj = {
			"email":email
		}
      	AuthorizeService.validateUserName(obj).then(function (response) {
          console.log(response);
          if(response.data.StatusCode == 302){
          	$scope.isExist = true;
          }
          else{
          	$scope.isExist = false;
          }
      	}, function (errorResponse) {
          //TODO: Show error message in the Sign In Modal
      	});
  	}
	/****************************************************************************/
    /***********************FUNCTION USE FOR REGISTER USER***********************/
  	/****************************************************************************/
  	$scope.register = function(){
  		var userData = {
  			"actType": "I",
	      	"address": {
	        	"city": $scope.user.city,
	        	"lat":$scope.user.latLng
	      	},
	      	"phone": $scope.user.phone,
	      	"profile": {
	        	"fName": $scope.user.first_name,
	        	"lName": $scope.user.last_name
	      	},
	      	"email": $scope.user.email,
	      	"initial_signup_method": "health adviser",
	      	"isDoctor": $scope.user.isDoctor,
	      	"password": $scope.user.password,
	      	"userName": $scope.user.email,
	      	"hearAboutUs":$scope.user.hear_about
	    };
	    $rootScope.showPreloader = true;
	    AuthorizeService.register(userData).then(function (response) {
	    	$rootScope.showPreloader = false;
          	if(response.data.StatusCode == 200){
          	var obj = {
					"userId": $scope.user.email,
					"password": $scope.user.password
	   			}
	          	AuthorizeService.login(obj).then(function (response) {
	          		$rootScope.$emit('login-success');
	          		if($scope.user.isDoctor == true){
					    $state.go('doctor-verify');
	          		}
	          		else{
	          			$state.go('updateUserProfile');
	          		}
	          	},function(error){
					$rootScope.showPreloader = false;
					Util.alertMessage('danger',"Something went wrong! unable to register");
	          	})
          	}
	        else{
				Util.alertMessage('danger',"Something went wrong! unable to register");
	        }
      	}, function (errorResponse) {
			$rootScope.showPreloader = false;
          	Util.alertMessage('danger',"Something went wrong! unable to register");
      	});
	}
	/****************************************************************************/
    /***********************FUNCTION USE FOR login USER**************************/
  	/****************************************************************************/
  	$scope.login = function(){
  		var obj = {
			"userId": $scope.user.email,
			"password": $scope.user.password
		}
		$rootScope.showPreloader = true;
      	AuthorizeService.login(obj).then(function (response) {
      		$rootScope.showPreloader = false;
			$rootScope.$emit('login-success');
      		if(response.data.StatusCode == 200){
				if($scope.user.remember){
					$localStorage.user = {
						"uname" : $scope.user.email,
						"password": $scope.user.password
					}
				}
				if($rootScope.isReload){
					$location.path($rootScope.reloadState);
				}
				else{
					$state.go('signedDoctor');
				}
      		}
			else{
				Util.alertMessage('danger',"Something went wrong! unable to login");
			}
      	},function(error){
			$rootScope.showPreloader = false;
			Util.alertMessage('danger',"Authentication faild");
		})
  	}
	$scope.initLogin = function(){
		$scope.user = {};
		$scope.user.email = ($localStorage.user) ? $localStorage.user.uname : '';
		$scope.user.password = ($localStorage.user) ? $localStorage.user.password : '';
	}

});
