app.controller('DoctorsController',function($scope,$rootScope,DoctorService){
	$scope.compareDoctor = [{}, {}, {}, {}];
	/****************************************************************************/
    /****************fUNCTION USE FOR ADD DOCTOR TO COMPARE BOX******************/
  	/****************************************************************************/
	$scope.compareDoctor = function(operation, doctor) {
    	switch (operation) {
	      case 'show':
	        $scope.showCompare = true;
	        // for (var i in $scope.compareLawerArr) {
	        //   if (angular.equals($scope.compareLawerArr[i], {}) && $scope.compareLawerArr.indexOf(lawer) === -1) {
	        //     $scope.compareLawerArr[i] = lawer;
	        //     break;
	        //   }
	        // }
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
      	console.log($scope.doctorList);
      	$scope.searchData = DoctorService.getSearchData();
      	$scope.resetCompareDoctor();
	    // if (navigator.geolocation && $rootScope.isGoogleLoaded) {
	    //   //$scope.loadMap();
	    // }
    }

	$scope.resetCompareDoctor = function() {
	    $scope.compareDoctor = [{}, {}, {}, {}];
	}
	$scope.closeCompare = function(){
		console.log(121);
	    $scope.showCompare = false;
	}
})