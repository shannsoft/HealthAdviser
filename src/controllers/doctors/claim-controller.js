app.controller('ClaimController',function($scope,$rootScope,$stateParams,DoctorService){
	$scope.paging = {currentPage:1,totalPage:0,showResult:0};
	/****************************************************************************/
	/*******************fUNCTION USE FOR GET CLAIM SEARCH LIST*******************/
	/****************************************************************************/
	$scope.getClaimSearchList = function(){
		var obj = {
			"name":$stateParams.profileName,
			"page":$scope.paging.currentPage
		}
		$rootScope.showPreloader = true;
		DoctorService.claimSearch(obj).then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$scope.claimList = response.data.Data;
				$scope.paging.showResult = $scope.claimList.result.length;
		    $scope.paging.totalPage = $scope.claimList.totalResultCount;
			}
		},function(error){
			$rootScope.showPreloader = false;
		})
	}
	/****************************************************************************/
	/**********************fUNCTION USE FOR FILTER CHANGE************************/
	/****************************************************************************/
	$scope.filterChanged = function(page){
		$scope.paging.currentPage = page;
		$scope.getClaimSearchList();
	}
	/****************************************************************************/
	/*****************fUNCTION USE FOR GET DOCTOR DETAIL CHANGE******************/
	/****************************************************************************/
	$scope.getDoctorProfile = function(){
		$rootScope.showPreloader = true;
		DoctorService.doctorDetails($stateParams.profileName).then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200)
				$scope.doctorDetails = response.data.Data.result;
				$scope.doctorDetails.specializationArray = [];
				angular.forEach($scope.doctorDetails.specialization,function(item){
					$scope.doctorDetails.specializationArray.push(item.specializationOn);
				})
		},function(error){
			$rootScope.showPreloader = false;
		})
	}
})
