app.controller('MainController',function($scope,$rootScope,CommonService,Config,$timeout,$state,DoctorService){
	/****************************************************************************/
    /****************fUNCTION USE FOR FIRE A EVENT TO JAVASCRIPT*****************/
  	/****************************************************************************/
  	$scope.$on('$viewContentLoaded', function(event) {
	  	$(document).trigger("TemplateLoaded");
	});
	/****************************************************************************/
    /****************THIS EVENT IS LISTEN AFTER SESSION EXPIRED******************/
  	/****************************************************************************/
  	$rootScope.$on('SESSION_EXPIRED',function(){
  		alert('Sesstion Expired');
  	})

  	/****************************************************************************/
    /****************fUNCTION USE FOR FIND THE INITIAL LOCATION******************/
  	/****************************************************************************/
  	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
  	$scope.home = {};

  	$scope.homeInit = function(reload) {
  		$scope.home.location = DoctorService.getSearchData() && DoctorService.getSearchData().place ? DoctorService.getSearchData().place.formatted_address : undefined;
  		if(!reload && $scope.home.location)
      		return;
	    if(google=="" || !google.maps || !google.maps.places)
        	googleTime = $timeout($scope.homeInit , 3000);
	    else {
	      clearTimeout(googleTime);
	      if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(
	        function(position) {
	          var pos = {
	            lat: position.coords.latitude,
	            lng: position.coords.longitude
	          };
	          var latLng = pos.lat + "," + pos.lng;
	          var urlStr = Config.getLocationUrl(latLng);
	          CommonService.fetchLocation(urlStr).then(function(response) {
	            $scope.place = response.data.results[3];
	            $scope.home.location = $scope.place.formatted_address;
	           	$scope.latLong =  $scope.place.geometry.location.lat + "," +  $scope.place.geometry.location.lng;
	            $scope.initLocation();
	          },function(err) {
	          	console.log(err);
	          },{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
	        });
	      }
	    }
  	};
  	$scope.initLocation = function() {
	    var input = (document.getElementById('main_loc'));
	    autocomplete = new google.maps.places.Autocomplete(input, {
		    types: ['geocode'],
          	componentRestrictions: {
	            country: "IN"
	        }
	    });
	    autocomplete.addListener('place_changed', onPlaceChanged);
	    $rootScope.isGoogleLoaded = true;
	    $scope.$emit("GOOGLE_LOLADED");
	};
	var onPlaceChanged = function() {
	    var place = $scope.place = autocomplete.getPlace();
	    if (place.geometry) {
	    	$scope.latLong = place.geometry.location.lat() + "," + place.geometry.location.lng();
	    } else {
	      document.getElementById('main_loc').placeholder = 'Enter a city';
	    }
	};	
	$scope.clearInputs = function(type){
	    if(type == 'loc'){
	      	$scope.home.location = '';
	    }
	    else if(type == 'name'){
	      	$scope.home.doctorName = '';
	    }
	}

	/****************************************************************************/
    /************FUNCTION USE FOR CALCULATE RATING ON EACH DOCTOR****************/
  	/****************************************************************************/
  	$scope.getRatings = function(doctor) {
	    if(doctor.avgRating){
	      rating = doctor.avgRating.toString().split(".");
	      ratingArr = [];
	      halfStar = false;
	      var isFloat = false;
	      for (var i = 0; i < 5; i++) {
	        if (i < parseInt(rating[0])) {
	          ratingArr.push("color-yellow fa fa-star");
	        } else if (parseInt(rating[1]) && !halfStar) {
	          ratingArr.push("color-yellow fa fa-star-half-o");
	          halfStar = true;
	        } else {
	          ratingArr.push("color-yellow fa fa-star-o");
	        }
	      }
	      doctor.ratingArr = ratingArr;
	    }
	}
	/****************************************************************************/
    /****************FUNCTION USE CALCULATE RATING ON EACH REVIEW****************/
  	/****************************************************************************/
  	$scope.reviewRatings = function(review) {
	    if(review && review.rating > 0){
	      rating = review.rating.toString().split(".");
	      ratingArr = [];
	      halfStar = false;
	      var isFloat = false;
	      for (var i = 0; i < 5; i++) {
	        if (i < parseInt(rating[0])) {
	          ratingArr.push("fa fa-star");
	        } else if (parseInt(rating[1]) && !halfStar) {
	          ratingArr.push("fa fa-star-half-o");
	          halfStar = true;
	        } else {
	          ratingArr.push("fa fa-star-o");
	        }
	      }
	      review.ratingArr = ratingArr;
	    }
	}

  	/****************************************************************************/
    /******************FUNCTION USE FOR PUBLIC DOCTOR SEARCH*********************/
  	/****************************************************************************/
	$scope.do_search = function() {
	    $rootScope.showPreloader = true;
	    var obj  = {
		  "searchText": $scope.home.doctorName,
		  "geoPoint": $scope.latLong,
		  "filter": {
		    "startRecord": 1
		  }
		}
	    DoctorService.fetchDoctor(obj).then(function(response) {
	      $rootScope.showPreloader = false;
	      DoctorService.setDoctorLisitng(response.data.Data);
	      DoctorService.setSearchData({latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place});
	      $timeout(function() {
	      	$scope.$emit("DOCTOR_LIST_FETCHED");
	      }, 500);
	      switch($state.current.name){
	        case "doctors-list":
	          $state.transitionTo($state.current,{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	        case "home":
	          $state.go("doctors-list",{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break; 
	        case "find-doctors":
	          $state.go("doctors-list",{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	      }
	    },function(err) {
	      $rootScope.showPreloader = false;
	    });
	};
});
