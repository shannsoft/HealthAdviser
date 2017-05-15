app.controller('ClaimController',function($scope,$rootScope,$stateParams,DoctorService){
	/****************************************************************************/
	/*******************fUNCTION USE FOR GET CLAIM SEARCH LIST*******************/
	/****************************************************************************/
	$scope.getClaimSearchList = function(){
		var obj = {
			"name":$stateParams.profileName,
			"page":1
		}
		DoctorService.claimSearch(obj).then(function(response){
			console.log(response);
		})
	}
})
