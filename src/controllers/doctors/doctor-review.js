app.controller('ReviewController',function($scope, $rootScope, $stateParams, DoctorService){
	$rootScope.isReload = false;
	/****************************************************************************/
    /***********************FUNCTION USE FOR login USER**************************/
  	/****************************************************************************/
  	$scope.getDoctorDetails = function(){
  		$rootScope.showPreloader = true;
  		if($stateParams.profileName){
			DoctorService.doctorDetails($stateParams.profileName).then(function(response){
				$rootScope.showPreloader = false;
				$scope.doctorDetails = response.data.Data.result;
			})
		}
  	}
})
