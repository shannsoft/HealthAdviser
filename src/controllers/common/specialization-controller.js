app.controller("SpecializationController", function($scope,$rootScope,CommonService,$localStorage,$state){
	$scope.getSpecializationList = function(){
		$scope.specialization = [];
		// $rootScope.showPreloader = true;
		CommonService.specialization().then(function(response){
			// $rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$scope.specializationList = response.data.Data;
				angular.forEach($scope.specializationList,function(item){
					$scope.specialization.push(item.name);
				})
			}
		},function(errot){
			$$rootScope.showPreloader = false;
		})
	}
	$scope.initSpecialization = function(isSearched){
		$scope.home.doctorName = localStorage.getItem("specialization");
	    $scope.isSearched = (isSearched) ? isSearched : false;
	    CommonService.specializationDetails($scope.home.doctorName).then(function(response){
	    	console.log(response);
	    	$scope.specializationDetails = response.data.Data[0]
	    })
	}
	$scope.gotoSpecializationDetails = function(name){
		localStorage.setItem('specialization',name);
		$state.go('specialization-details');
	}
})