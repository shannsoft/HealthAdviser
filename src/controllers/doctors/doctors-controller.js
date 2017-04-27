app.controller('DoctorsController',function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state){
	$scope.compareDoctorArr = [{}, {}, {}, {}];
	var map;
	var directionService;
	var directionDisplay;
	var sourcePlace;
	var destination;
	$scope.paging = {currentPage:1,totalPage:0,showResult:0};
	$scope.filter = {};
	/****************************************************************************/
    /****************fUNCTION USE FOR ADD DOCTOR TO COMPARE BOX******************/
  	/****************************************************************************/
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
	/*******************************************************************************************/
  	/*************** Info - initListing() is called on init of lawer listing page***************/
  	/*******************************************************************************************/
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
    $rootScope.$on("DOCTOR_LIST_FETCHED",function(){
    	$scope.paging.currentPage = 1;
    	$scope.filter = {};
    })
    /*******************************************************************************************/
	/*************** Info - Load google map of listing page*************************************/
	/*******************************************************************************************/
	$scope.loadMap = function() {
	    $scope.markers = [];
	    map = new google.maps.Map(document.getElementById('googleMap'), {
	      zoom: 7
	    });
	    $scope.setMarkers();
	}

	/*******************************************************************************************/
	/*************** Info - setMarkers() is called for mark the lawer on map********************/
	/*******************************************************************************************/
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

	/*******************************************************************************************/
	/************************Function use for open the compare details**************************/
	/*******************************************************************************************/
	$scope.compareInit = function(){
		$scope.compareDoctorArr = DoctorModel.getCompareArr();
	}

	$scope.filterChanged = function(pageNumber) {
		$rootScope.showPreloader = true;
    	var filterObj = {}
    	var counter = 0;
    	filterObj.startRecord =  (pageNumber) ? parseInt(pageNumber) : 1;
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
    /*******************************************************************************************/
	/************************Function use for download vcard details****************************/
	/*******************************************************************************************/
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

    /*******************************************************************************************/
  	/***************                    Direction section                         **************/
  	/*******************************************************************************************/

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
		                      // var infowindow2 = new google.maps.InfoWindow();
		                      var service = new google.maps.DistanceMatrixService();
		                      service.getDistanceMatrix(
		                        {
		                          origins: [sourcePlace],
		                          destinations: [destination],
		                          travelMode: 'DRIVING'
		                        }, function callback(response, status) {
		                          //$scope.distanceElem = response.rows[0].elements[0];
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
})