
app.controller('AuthenticationController',function($scope,$rootScope,$timeout,AuthorizeService,$state,DoctorDetailsService,$state,$localStorage){
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
		console.log(place);
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
	    	console.log(response)
          if(response.data.StatusCode == 200){
          	var obj = {
   				"userId": $scope.user.email,
				"password": $scope.user.password
   			}
          	AuthorizeService.login(obj).then(function (response) {
          		$rootScope.$emit('login-success');
          		if($scope.user.isDoctor == true){
     		 		//	DoctorDetailsService.doctorDetails().then(function(response){
				    //     $rootScope.showPreloader = false;
				    //     $scope.doctorDetails = response.data.Data.result;
				    //     console.log(response.data.Data);
				    //     $scope.initMap($scope.doctorDetails.address);
				    // })
				    $state.go('doctor-verify');
          		}
          		else{

          		}
          	},function(error){

          	})
          }
          else{
          	
          }
      	}, function (errorResponse) {
          //TODO: Show error message in the Sign In Modal
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
		$localStorage.userId = $scope.user.email;
		$localStorage.password = $scope.user.password,
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
      			$state.go('signedDoctor');
      		}
      	})
  	}
	$scope.initLogin = function(){
		$scope.user = {};
		$scope.user.email = ($localStorage.user) ? $localStorage.user.uname : '';
		$scope.user.password = ($localStorage.user) ? $localStorage.user.password : '';
	}
});