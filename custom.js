var app = angular.module('health-advisor',['ui.router','ngAnimate','ui.bootstrap','ui.utils','bw.paging','timeRelative']);
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
    url: '/contact-us',
    controller: 'CommonController'
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
  .state('doctor-direction', {
    templateUrl: 'src/views/doctors/doctor-direction.html',
    url: '/doctor-direction',
    controller: 'DoctorsController'
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
  .state('doctor-compare', {
    templateUrl: 'src/views/doctors/doctor-compare.html',
    url: '/doctor-compare',
    controller: 'DoctorsController'
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
})
;app.factory("Config", ["$rootScope", function($rootScope) {
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
	
}]);;app.controller("CommonController",["$scope", "$rootScope", "CommonService", "Util", function($scope,$rootScope,CommonService,Util){
	$scope.contact = {};
	$scope.sendEnquiry = function(){
		$scope.contact.actType = "I";
		$rootScope.showPreloader = true;
		CommonService.sendEnquiry($scope.contact).then(function(response){
			if(response.data.StatusCode == 200){
		        Util.alertMessage('success',"Thank you! We appreciate you contacting us. We'll respond to your inquiry as soon as possible. Have a great day!");
		    }
		    else{
		        Util.alertMessage('danger',"Something went wrong! unable to send your request");
		    }
			$rootScope.showPreloader = false;
		})
	}
}]);app.controller('DoctorDetailsController',["$scope", "$rootScope", "DoctorService", "$stateParams", function($scope,$rootScope,DoctorService,$stateParams){
	$scope.loadDoctorDetails = function(){
		$rootScope.showPreloader = true;
		if($stateParams.profileName){
			DoctorService.doctorDetails($stateParams.profileName).then(function(response){
				$rootScope.showPreloader = false;
				$scope.doctorDetails = response.data.Data.result;
				console.log(response.data.Data);
				$scope.initMap($scope.doctorDetails.address);
			})
		}
	}
	$scope.initMap = function(address) {
    if(document.getElementById('googleMap')){
      if(address.lat != '' || address.lng != ''){
        var myLatLng = {lat: parseFloat(address.lat), lng: parseFloat(address.lng)};
        map = new google.maps.Map(document.getElementById('googleMap'), {
          zoom: 15,
          center: myLatLng
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map
        });
      }
    }
  }
}]);app.controller('DoctorsController',["$scope", "$rootScope", "DoctorService", "$stateParams", "DoctorModel", "$state", function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state){
	$scope.compareDoctorArr = [{}, {}, {}, {}];
	var map;
	var directionService;
	var directionDisplay;
	var sourcePlace;
	var destination;
	$scope.paging = {currentPage:1,totalPage:0,showResult:0};
	$scope.filter = {};
	$scope.showCompare = function(operation, doctor) {
    	switch (operation) {
	      case 'show':
	        $scope.showCompareBox = true;
	        for (var i in $scope.compareDoctorArr) {
	          if (angular.equals($scope.compareDoctorArr[i], {}) && $scope.compareDoctorArr.indexOf(doctor) === -1) {
	            $scope.compareDoctorArr[i] = doctor;
	            break;
	          }
	        }
	        break;
	      case 'clear':
	        $scope.resetCompareDoctor();
	        break;
	      default:
	    }
	}
  	$scope.initListing = function() {
      	$scope.doctorList = DoctorService.getDoctorLisitng();
      	$scope.searchData = DoctorService.getSearchData();
      	$scope.resetCompareDoctor();
	    $scope.loadMap();
	    if($scope.doctorList.result){
		    angular.forEach($scope.doctorList.result,function(doctor){
		    	doctor.specializationArray = [];
		    	angular.forEach(doctor.specialization,function(item){
		    		doctor.specializationArray.push(item.specializationOn);
		    	})
		    	doctor.specializationArray = doctor.specializationArray.toString();
		    })
		    $scope.paging.showResult = $scope.doctorList.result.length;
		    $scope.paging.totalPage = $scope.doctorList.totalResultCount;
		}
    }
	$scope.loadMap = function() {
	    $scope.markers = [];
	    map = new google.maps.Map(document.getElementById('googleMap'), {
	      zoom: 7
	    });
	    $scope.setMarkers();
	}
	$scope.setMarkers = function() {
	    var bound = new google.maps.LatLngBounds();
	    angular.forEach($scope.doctorList.result, function(item) {
	      var loc = new google.maps.LatLng(parseFloat(item.address.lat), parseFloat(item.address.lng));
	      var marker = new google.maps.Marker({
	        position: loc,
	        map: map,
	        animation: google.maps.Animation.DROP
	      });
	      console.log(marker);
	      bound.extend(loc);
	      $scope.markers.push(marker);
	    });
	    map.setCenter(bound.getCenter());
	}

	$scope.resetCompareDoctor = function() {
	    $scope.compareDoctor = [{}, {}, {}, {}];
	}
	$scope.closeCompare = function(){
	    $scope.showCompareBox = false;
	}
	$scope.closeDoctorCompare = function(index) {
	    $scope.compareDoctorArr[index] = {};
	    $scope.compareCloseCount();
	}
	$scope.compareCloseCount = function() {
	    for (var i in $scope.compareDoctorArr) {
	      if (!angular.equals($scope.compareDoctorArr[i], {})) {
	        return;
	      }
	    }
	    $scope.showCompareBox = false;
	}
	$scope.doCompare = function() {
	    DoctorModel.setCompareArr($scope.compareDoctorArr);
	    $state.go("doctor-compare");
	}
	$scope.compareInit = function(){
		$scope.compareDoctorArr = DoctorModel.getCompareArr();
	}

	$scope.filterChanged = function(pageNumber) {
		$rootScope.showPreloader = true;
    	var filterObj = {}
    	var counter = 0;
    	if(pageNumber)
    		$scope.paging.currentPage = pageNumber;
    	filterObj.startRecord =  parseInt($scope.paging.currentPage);
    	angular.forEach($scope.filter, function(value, key) {
	        switch (key) {
	        	case "languages":
	        		filterObj.language = [];
		            angular.forEach($scope.filter.languages, function(value, key) {
		              if (value)
		                filterObj.language.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.languages).length && filterObj.language.length <= 0)
		                delete filterObj['language'];
		            })
		            break;
	            case "specialization":
	        		filterObj.specialization = [];
		            angular.forEach($scope.filter.specialization, function(value, key) {
		              if (value)
		                filterObj.specialization.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.specialization).length && filterObj.specialization.length <= 0)
		                delete filterObj['specialization'];
		            })
		            break;
		        case "rating":
	        		filterObj.rating = [];
		            angular.forEach($scope.filter.rating, function(value, key) {
		              if (value)
		                filterObj.rating.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.rating).length && filterObj.rating.length <= 0)
		                delete filterObj['rating'];
		            })
		            break;
		        case "distance":
		        	filterObj.distance = value;
	        }
	    })
	    var obj = {
	    	"searchText": $state.params.searchParams.searchText,
		    "geoPoint": $state.params.searchParams.latLong,
		    "filter": filterObj
	    }
	    DoctorService.fetchDoctor(obj).then(function(response) {
	      $rootScope.showPreloader = false;
	      DoctorService.setDoctorLisitng(response.data.Data);
	      $scope.initListing();
	      $state.current.name == "doctors-list" ? $state.transitionTo($state.current, {
	        searchParams: {
	          latLong: $scope.searchData.latLong,
	          searchText: $scope.searchData.searchText,
	          place: $scope.searchData.place
	        }
	      }) : $state.go("doctors-list", {
	        searchParams: {
	          latLong: $scope.searchData.latLong,
	          searchText: $scope.searchData.searchText,
	          place: $scope.searchData.place
	        }
	      });
	    }, function(err) {

	   });
  	}
  	$scope.numberToArray = function (n) {
        return new Array(parseInt(n));
    };
    $scope.downloadVCard = function(doctor){
    	var vCardObj = vCard.create(vCard.Version.TWO)
      	vCardObj.add(vCard.Entry.FORMATTEDNAME, doctor.profile.name)
      	if(doctor.phone.length > 0)
        	vCardObj.add(vCard.Entry.PHONE, doctor.phone[0].number)
      	vCardObj.add(vCard.Entry.EMAIL, doctor.emailId)
      	vCardObj.add(vCard.Entry.ADDRESS, doctor.address.formatted)
      	vCardObj.add(vCard.Entry.CITY, doctor.address.city)
      	vCardObj.add(vCard.Entry.STATE, doctor.address.state)
  		var link = vCard.export(vCardObj, doctor.profile.name, true)
    }

  	$scope.goToDirection = function(doctor) {
    	DoctorModel.setDoctorProfile(doctor);
  		$state.go('doctor-direction');
  	}

  	$scope.initDirection = function() {
	    $scope.doctorProfile = DoctorModel.getDoctorProfile();
	    if($scope.doctorProfile.address){
		    var address = $scope.doctorProfile.address;
		    var loc = new google.maps.LatLng(parseFloat(address.lat), parseFloat(address.lng));
		    if (navigator.geolocation) {
		      navigator.geolocation.getCurrentPosition(
		        function(position) {
		          var pos = {
		            lat: position.coords.latitude,
		            lng: position.coords.longitude
		          };
		          var pyrmont = new google.maps.LatLng(pos.lat, pos.lng);
		          map = new google.maps.Map(document.getElementById('googleMapdirection'), {
		            center: pyrmont,
		            zoom: 12
		          });
		          var rendererOptions = {
		            map: map
		          };
		          directionService = new google.maps.DirectionsService();
		          directionDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		          var geocoder = new google.maps.Geocoder();
		          geocoder.geocode({
		            'latLng': pyrmont
		          }, function(results, status) {
		            if (status == google.maps.GeocoderStatus.OK) {
		              sourcePlace = results[0]['formatted_address'];
		              geocoder.geocode({
		                'latLng': loc
		              }, function(results, status) {
		                if (status == google.maps.GeocoderStatus.OK) {
		                  destination = results[0]['formatted_address'];
		                  var request = {
		                    origin: sourcePlace,
		                    destination: destination,
		                    travelMode: google.maps.TravelMode.DRIVING
		                  };
		                  directionService.route(request, function(response, status) {
		                    if (status == google.maps.DirectionsStatus.OK) {
		                      directionDisplay.setDirections(response);
		                      var service = new google.maps.DistanceMatrixService();
		                      service.getDistanceMatrix(
		                        {
		                          origins: [sourcePlace],
		                          destinations: [destination],
		                          travelMode: 'DRIVING'
		                        }, function callback(response, status) {
		                        });

		                    } else {
		                      window.alert('Directions request failed due to ' + status);
		                    }
		                  });
		                };
		              });
		            };
		          });
		        });
		    }
		}
		else{
			$state.go('home');
		}
	}
}]);app.controller("HomeController",["$scope", function($scope){
	$scope.name = "adfasdfa";
}])
;app.controller('MainController',["$scope", "$rootScope", "CommonService", "Config", "$timeout", "$state", "DoctorService", function($scope,$rootScope,CommonService,Config,$timeout,$state,DoctorService){
  	$scope.$on('$viewContentLoaded', function(event) {
	  	$(document).trigger("TemplateLoaded");
	});
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
	      switch($state.current.name){
	        case "doctors-list":
	          $state.transitionTo($state.current,{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	        case "home":
	          $state.go("doctors-list",{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	      }
	    },function(err) {
	      $rootScope.showPreloader = false;
	    });
	};
}]);
;app.directive('phonenumberDirective', ['$filter', function($filter) {
	function link(scope, element, attributes) {
		scope.inputValue = scope.phonenumberModel;
		scope.$watch('inputValue', function(value, oldValue) {
			value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
		scope.$watch('phonenumberModel', function(value, oldValue) {
    value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
	}
	return {
		link: link,
		restrict: 'E',
		scope: {
			phonenumberPlaceholder: '=placeholder',
			phonenumberModel: '=model',
    		class: '=customclass',
		},
		template: '<input ng-model="inputValue" name="phone" type="tel" class="{{class}}" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)">',
	};
}]);app.filter('getShortName', function () {
    return function (value) {
      if(value){
        var temp = angular.copy(value);
        temp = temp.split(" ");
        temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
        return temp.toUpperCase();
      }
    };
});
app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("MM/DD/YYYY");
    }
  }
})
app.filter('dateYear', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY");
    }
  }
})
app.filter('dateformat1', function(){
  return function(date){
    if(date){
      return moment(date).format("DD-MM-YYYY");
    }
  }
})
app.filter('dateformat2', function(){
  return function(date){
    if(date){
      return moment(date).format("MMM DD, YYYY");
    }
  }
})
app.filter('dateformat3', function(){
  return function(date){
    if(date){
      return moment(date).format("MM-DD-YYYY");
    }
  }
})
app.filter('phonenumber', function() {
  return function (number) {
    if (!number) { return ''; }
    number = String(number);
    var formattedNumber = number;
    var c = (number[0] == '1') ? '1 ' : '';
    number = number[0] == '1' ? number.slice(1) : number;
    var area = number.substring(0,3);
    var front = number.substring(3, 6);
    var end = number.substring(6, 10);
    if (front) {
      formattedNumber = (c + "(" + area + ") " + front);
    }
    if (end) {
      formattedNumber += ("-" + end);
    }
    return formattedNumber;
  };
});;app.factory("DoctorModel", function(){
	var compareArr = [];
	var doctorProfile = {};
	return {
		setCompareArr : function(array){
			compareArr = array;
		},
		getCompareArr : function(array){
			return compareArr;
		},
		setDoctorProfile : function(obj){
			doctorProfile = obj;
		},
		getDoctorProfile : function(){
			return doctorProfile;
		}
	}
});app.factory("CommonService", ["$http", "$q", "CONFIG", function ($http,$q,CONFIG) {
  return{
    fetchLocation: function(params) {
      var response = $http.get(params);
      return response;
    },
    sendEnquiry : function(obj){
      var response = $http({
          method: 'POST',
          url: CONFIG.API_PATH+'_ContactUs',
          data : obj,
          headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
      });
      return response;
    }
  }
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
		},
		doctorDetails : function(profileName){
		    var response = $http({
		        method: 'GET',
		        url: CONFIG.API_PATH+'_User/'+profileName,
		        headers: {'Server': CONFIG.SERVER_PATH}
		    });
		    return response;		
		}
	}
}])