app.controller('MainController',function($scope,$rootScope,CommonService,Config,$timeout,$state,DoctorService){
	/****************************************************************************/
    /****************fUNCTION USE FOR FIRE A EVENT TO JAVASCRIPT*****************/
  	/****************************************************************************/
  	$scope.$on('$viewContentLoaded', function(event) {
	  	$(document).trigger("TemplateLoaded");
	});
	/****************************************************************************/
    /****************fUNCTION USE FOR FIRE A EVENT TO JAVASCRIPT*****************/
  	/****************************************************************************/
  	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
  	$scope.home = {};

  	$scope.homeInit = function(reload) {
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
	            $scope.lat =  $scope.place.geometry.location.lat;
	            $scope.long = $scope.place.geometry.location.lng;
	            $scope.initLocation();
	          },function(err) {

	          });
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
	    	$scope.lat =  place.geometry.location.lat();
	        $scope.long = place.geometry.location.lng();
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
    /****************fUNCTION USE FOR FIRE A EVENT TO JAVASCRIPT*****************/
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
    /****************fUNCTION USE FOR FIRE A EVENT TO JAVASCRIPT*****************/
  	/****************************************************************************/
	$scope.do_search = function() {
	    $rootScope.showPreloader = true;
	    var obj  = {
		  "searchText": "SA",
		  "geoPoint": "20.2961,85.8245",
		  "filter": {
		    "startRecord": 1
		  }
		}
	    DoctorService.fetchDoctor(obj).then(function(response) {
	      $rootScope.showPreloader = false;
	      DoctorService.setDoctorLisitng(response.data.Data);
	      DoctorService.setSearchData({lat:$scope.lat,lon:$scope.long,name:$scope.home.doctorName,place:$scope.place});
	      switch($state.current.name){
	        case "doctors-list":
	          $state.transitionTo($state.current,{searchParams:{lat:$scope.lat,lon:$scope.long,name:$scope.home.doctorName,place:$scope.place}});
	          break;
	        case "home":
	          $state.go("doctors-list",{searchParams:{lat:$scope.lat,lon:$scope.long,name:$scope.home.doctorName,place:$scope.place}});
	          break;
	      }
	    },function(err) {
	      $rootScope.showPreloader = false;
	    });
	};
});
