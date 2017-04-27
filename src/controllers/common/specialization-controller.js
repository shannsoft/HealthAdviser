app.controller("SpecializationController", function($scope,$rootScope,CommonService){
	$scope.getSpecializationList = function(){
		$rootScope.showPreloader = true;
		CommonService.specialization().then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$scope.specializationList = response.data.Data;
			}
		},function(errot){
			$$rootScope.showPreloader = false;
		})
	}
})