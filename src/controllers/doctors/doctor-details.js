app.controller('DoctorDetailsController',function($scope,$rootScope,DoctorService,$stateParams){
	$scope.loadDoctorDetails = function(){
		$rootScope.showPreloader = true;
		if($stateParams.profileName){
			DoctorService.doctorDetails($stateParams.profileName).then(function(response){
				$rootScope.showPreloader = false;
				$scope.doctorDetails = response.data.Data.result;
				console.log(response.data.Data);
				$scope.initMap($scope.doctorDetails.address);
			})
		}
	}
	$scope.initMap = function(address) {
      if(document.getElementById('googleMap')){
        if(address.lat != '' || address.lng != ''){
          var myLatLng = {lat: parseFloat(address.lat), lng: parseFloat(address.lng)};
          map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 15,
            center: myLatLng
          });

          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map
          });
        }
      }
    }
})