var app = angular.module('health-advisor',['ui.router','ngAnimate']);
app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    templateUrl: 'src/views/home/home.html',
    controller: "HomeController",
    url: '/home'
  })
  .state('login', {
    templateUrl: 'src/views/header/login.html',
    controller: "AuthenticationController",
    url: '/login'
  })
  .state('register', {
    templateUrl: 'src/views/header/register.html',
    controller: "AuthenticationController",
    url: '/register'
  })
  .state('specialization', {
    templateUrl: 'src/views/common/specialization.html',
    url: '/specialization'
  })
  .state('contact-us', {
    templateUrl: 'src/views/common/contact-us.html',
    url: '/contact-us'
  })
  .state('state-directory', {
    templateUrl: 'src/views/directory/state-directory.html',
    url: '/state-directory'
  })
  .state('city-directory', {
    templateUrl: 'src/views/directory/city-directory.html',
    url: '/city-directory'
  })
  .state('doctors-directory', {
    templateUrl: 'src/views/directory/doctors-directory.html',
    url: '/doctors-directory'
  })
  .state('doctors-list', {
    templateUrl: 'src/views/doctors/doctors-list.html',
    url: '/doctors-list',
    controller: 'DoctorsController',
    params: {
      searchParams : null
    }
  })
  .state('find-doctors', {
    templateUrl: 'src/views/doctors/find-doctors.html',
    url: '/find-doctors',
    controller: 'DoctorsController'
  })
  .state('doctor-details', {
    templateUrl: 'src/views/doctors/doctor-details.html',
    url: '/doctor-details/:profileName',
    controller: 'DoctorDetailsController'
  })
}]);
app.run(["$http", "$rootScope", "$timeout", function($http,$rootScope,$timeout){
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $rootScope.stateName = toState.name;
      window.scrollTo(0, 0);
    });
}]);
app.constant('CONFIG', {
  "API_PATH":"http://healthadvisor.ssmaktak.com/api/",
  "SERVER_PATH":1 
});app.factory("Config", ["$rootScope", function($rootScope) {
  var gApi = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
  var gApiKey = "AIzaSyAXBP60-UkTuNPGRX5N5jtdKZl2YRvXUdA";
  return{
  	getLocationUrl : function(param){
  		var url = gApi+param+"&key="+gApiKey;
    	return url;
  	}
  }
}]);
;app.controller('AuthenticationController',["$scope", "$rootScope", function($scope,$rootScope){
	
}]);;app.controller('DoctorDetailsController',["$scope", "$rootScope", function($scope,$rootScope){
	
}]);app.controller('DoctorsController',["$scope", "$rootScope", "DoctorService", function($scope,$rootScope,DoctorService){
	$scope.compareDoctor = [{}, {}, {}, {}];
	$scope.compareDoctor = function(operation, doctor) {
    	switch (operation) {
	      case 'show':
	        $scope.showCompare = true;
	        break;
	      case 'clear':
	        $scope.resetCompareDoctor();
	        break;
	      default:
	    }
	}
  	$scope.initListing = function() {
      	$scope.doctorList = DoctorService.getDoctorLisitng();
      	console.log($scope.doctorList);
      	$scope.searchData = DoctorService.getSearchData();
      	$scope.resetCompareDoctor();
    }

	$scope.resetCompareDoctor = function() {
	    $scope.compareDoctor = [{}, {}, {}, {}];
	}
	$scope.closeCompare = function(){
		console.log(121);
	    $scope.showCompare = false;
	}
}]);app.controller("HomeController",["$scope", function($scope){

}])
;app.controller('MainController',["$scope", "$rootScope", "CommonService", "Config", "$timeout", "$state", "DoctorService", function($scope,$rootScope,CommonService,Config,$timeout,$state,DoctorService){
  	$scope.$on('$viewContentLoaded', function(event) {
	  	$(document).trigger("TemplateLoaded");
	});
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
}]);
;app.factory("CommonService", ["$http", "$q", function ($http,$q) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var encode = function (input){
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;
      do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }
          output = output +
              keyStr.charAt(enc1) +
              keyStr.charAt(enc2) +
              keyStr.charAt(enc3) +
              keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);
      return output;
  };
  var decode = function ( input ){
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
          window.alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);
      return output;
  };
  var fetchLocation = function(params) {
    var response = $http.get(params);
    return response;
  };
  return {
      encode                : encode,
      decode                : decode,
      fetchLocation         : fetchLocation
  };
}]);
app.factory('Util', ["$rootScope", "$timeout", function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts = [];
    Util.alertMessage = function(msgType, message){
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
    };
    return Util;
}]);
;app.factory("DoctorService",["$http", "CONFIG", function($http,CONFIG){
	var searchData = {};
  	var lawerList = {totalRecords : 0};
	return{
		setDoctorLisitng : function(obj){
			lawerList = obj;
		},
		getDoctorLisitng : function(){
			return lawerList;
		},
		setSearchData : function(obj){
			searchData = obj;
		},
		getSearchData : function(){
			return searchData;
		},
		fetchDoctor : function(obj){
		    var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_PublicDoctorSearch',
		        data : obj,
		        headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
		    });
		    return response;		
		}
	}
}])