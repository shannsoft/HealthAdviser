app.controller('ClaimController',function($scope,$rootScope,$stateParams,DoctorService,Util,$sessionStorage,AuthorizeService){
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
			if(response.data.StatusCode == 200){
				$scope.doctorDetails = response.data.Data.result;
				$scope.doctorDetails.specializationArray = [];
				angular.forEach($scope.doctorDetails.specialization,function(item){
					$scope.doctorDetails.specializationArray.push(item.specializationOn);
				})
			}
		},function(error){
			$rootScope.showPreloader = false;
		})
	}
	/****************************************************************************/
	/*****************fUNCTION USE FOR GET THE TOKEN DETAIL CHANGE***************/
	/****************************************************************************/
	$scope.applyToken = function(){
		if(!$scope.claim){
			Util.alertMessage('danger',"Please select email or mobile to get the token");
		}
		else{
			var obj = {
				"userId": $scope.doctorDetails.userCode,
			}
			if($scope.claim.type == "Mobile") obj.mobile = $scope.doctorDetails.phone[0].number;
			if($scope.claim.type == "email") obj.email = $scope.doctorDetails.emailId;
			DoctorService.applyToken(obj).then(function(response){
				$rootScope.showPreloader = false;
				if(response.data.StatusCode == 200){
					console.log(response);
					$sessionStorage.claimUser = $scope.doctorDetails;
					$state.go('claim-update');
				}
			},function(error){
				$rootScope.showPreloader = false;
			})
		}
	}
	/****************************************************************************/
	/*****************FUNCTION USE FOR GET THE TOKEN DETAIL CHANGE***************/
	/****************************************************************************/
	$scope.claimUpdateInit = function(){
		$scope.user = {};
		$scope.claimUser = $sessionStorage.claimUser;
		$scope.user.email = $scope.claimUser.emailId;
	}
	/****************************************************************************/
  	/***********************FUNCTION USE FOR CHECK PASSWORD**********************/
	/****************************************************************************/
	$scope.validatePassword = function(){
		if($scope.user.password !== $scope.user.c_pass){
	      $scope.showPasswordMisMatch = true;
	    }
	   	if($scope.user.password === $scope.user.c_pass) {
	      $scope.showPasswordMisMatch = false;
	    }
	}
	/****************************************************************************/
  	/***********************FUNCTION USE FOR SET NEW PASSWORD********************/
	/****************************************************************************/
	$scope.setPassword = function(){
		var obj = {
			"userId": $scope.claimUser.userCode,
			"email":$scope.user.email,
			"pasword": $scope.user.password,
			"token":$scope.user.otp
		}
		$rootScope.showPreloader = true;
		DoctorService.setNewPassword(obj).then(function(response){
			if(response.data.StatusCode == 200){
				var obj = {
					"userId": $scope.user.email,
					"password": $scope.user.password
		   		}
		      	AuthorizeService.login(obj).then(function (res) {
		      		if(res.data.StatusCode == 200){
		      			$rootScope.$emit('login-success');
						$state.go('updateDoctorProfile');
		      		}
		      	},function(error){
					$rootScope.showPreloader = false;
		      	})
			}
			else{
				Util.alertMessage('danger', response.data.Message);
			}
		},function(error){
			Util.alertMessage('danger', error.message);
		})
	}
})
