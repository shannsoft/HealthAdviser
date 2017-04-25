app.controller('DirectoryController',function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state){
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

})