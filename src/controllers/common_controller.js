app.controller("CommonController",function($scope,$rootScope,CommonService,Util){
		$scope.contact = {};

		/****************************************************************************/
    /*******************FUNCTION USE FOR SEND ENQUIRY DETAILS********************/
  	/****************************************************************************/
	$scope.sendEnquiry = function(){
		$scope.contact.actType = "I";
		$rootScope.showPreloader = true;
		CommonService.sendEnquiry($scope.contact).then(function(response){
			if(response.data.StatusCode == 200){
		        Util.alertMessage('success',"Thank you! We appreciate you contacting us. We'll respond to your inquiry as soon as possible. Have a great day!");
		    }
		    else{
		        Util.alertMessage('danger',"Something went wrong! unable to send your request");
		    }
			$rootScope.showPreloader = false;
		})
	}
})
