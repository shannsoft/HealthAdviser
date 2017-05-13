app.controller('ReviewController',function($scope, $rootScope, $stateParams, DoctorService,CommonService,$state){
	$rootScope.isReload = false;
	
	/****************************************************************************/
    /***************FUNCTION USE FOR LOAD THE CURRENT REVIEW*********************/
  	/****************************************************************************/
  	$scope.loadCurrentReview = function(){
    	var tempReview = CommonService.getReviewDetails();
      $scope.doctorDetails = tempReview.doctorDetails;
      $scope.review = tempReview.review;
      if(!$scope.doctorDetails){
      	$scope.getDoctorDetails();
      }
  	}
  	/****************************************************************************/
    /***********************FUNCTION USE FOR login USER**************************/
  	/****************************************************************************/
  	$scope.getDoctorDetails = function(){
  		$scope.review = {};
  		$scope.review.isAnonymous = false;
  		$scope.review.willRecomended = false;
  		$scope.review.hasConsulted = false;
  		$rootScope.showPreloader = true;
  		if($stateParams.profileName){
			DoctorService.doctorDetails($stateParams.profileName).then(function(response){
				$rootScope.showPreloader = false;
				$scope.doctorDetails = response.data.Data.result;
			})
		}
  	}
  /****************************************************************************/
  /******************FUNCTION USE FOR GOTO PREVIEW SECTION*********************/
  /****************************************************************************/
  $scope.gotoPreview = function(){
    var review = {
      "review" : $scope.review,
      "doctorDetails" : $scope.doctorDetails
    }
    CommonService.setReviewDetails(review);
    $state.go('review-preview',{profileName: $stateParams.profileName});
  }
  /****************************************************************************/
  /******************FUNCTION USE FOR GOTO PREVIEW SECTION*********************/
	/****************************************************************************/
	$scope.endorsePreview = function(){
		var review = {
			"review" : $scope.review,
			"doctorDetails" : $scope.doctorDetails
		}
    CommonService.setReviewDetails(review);
    $state.go('endorse-preview',{profileName: $stateParams.profileName});
  }
	/****************************************************************************/
  /******************FUNCTION USE FOR GOTO PREVIEW SECTION*********************/
	/****************************************************************************/
	$scope.currentRatings = function(review) {
    rating = review.rating.toString().split(".");
    ratingArr = [];
    halfStar = false;
    var isFloat = false;
    for (var i = 0; i < 5; i++) {
      if (i < parseInt(rating[0])) {
        ratingArr.push("color-yellow fa fa-star");
      } else if (parseInt(rating[1]) && !halfStar) {
        ratingArr.push("color-yellow fa fa-star-half-o");
        halfStar = true;
      } else {
        ratingArr.push("color-yellow fa fa-star-o");
      }
    }
	  $scope.currentRating = ratingArr;
	}
	/****************************************************************************/
  /******************FUNCTION USE FOR SUBMIT REVIEW SECTION********************/
  /****************************************************************************/
  $scope.submitReview = function(){
    $scope.review.doctorId = $scope.doctorDetails.userCode
    console.log($scope.review);
    $rootScope.showPreloader = true;
    CommonService.reviewDoctor($scope.review).then(function(response){
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $state.go('review-success',{profileName: $stateParams.profileName});
      }
    })
  }
  /****************************************************************************/
  /******************FUNCTION USE FOR SUBMIT REVIEW SECTION********************/
	/****************************************************************************/
	$scope.submitEndorsement = function(){
		$scope.review.docCode = $scope.doctorDetails.userCode
		$rootScope.showPreloader = true;
		CommonService.endorseDoctor($scope.review).then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$state.go('endorse-success',{profileName: $stateParams.profileName});
			}
		})
  }
})
