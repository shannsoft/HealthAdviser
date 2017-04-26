app.controller('DirectoryController',function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state,$timeout){
	$scope.getStateList = function(){
		$rootScope.showPreloader = true;
		var data = ($stateParams.cityName) ? $stateParams.cityName : 'ind';
		DoctorService.countryDetails(data).then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$scope.stateList = response.data.Data;
			}
		})
	}
	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
  	$scope.startRecord = 1;
	$scope.doctorsList = function(){
		if(google=="" || !google.maps || !google.maps.places || !$scope.latLong)
        	googleTime = $timeout($scope.doctorsList , 3000);
	    else {
	      	clearTimeout(googleTime);
	      	$rootScope.showPreloader = true;
	      	var obj  = {
			  "geoPoint": $scope.latLong,
			  "filter": {
			    "startRecord": $scope.startRecord
			  },
			  "city":$stateParams.cityName
			}
		    DoctorService.fetchDoctor(obj).then(function(response) {
		 	  $rootScope.showPreloader = false;
		 	  if(response.data.StatusCode == 200)
		      	$scope.doctorList = response.data.Data.result;
				console.log($scope.doctorList);
				$scope.resultCount = $scope.doctorList.length;
				$scope.totalPage = response.data.Data.totalResultCount;
		    },function(err) {
		      $rootScope.showPreloader = false;
		    });
	    }
	}
	$scope.filterChanged = function(pageNo){
		$scope.startRecord = parseInt(pageNo);
		$scope.doctorsList();
	}

})