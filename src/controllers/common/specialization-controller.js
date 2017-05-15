app.controller("SpecializationController", function($scope,$rootScope,CommonService,$localStorage,$state){
	$scope.getSpecializationList = function(){
		$scope.specialization = [];
		$rootScope.showPreloader = true;
		CommonService.specialization().then(function(response){
			$rootScope.showPreloader = false;
			if(response.data.StatusCode == 200){
				$scope.specializationList = response.data.Data;
				angular.forEach($scope.specializationList,function(item){
					$scope.specialization.push(item.name);
				})
			}
		},function(errot){
			$rootScope.showPreloader = false;
		})
	}
	$scope.initSpecialization = function(isSearched){
		$scope.home.doctorName = sessionStorage.getItem("specialization");
	    $scope.isSearched = (isSearched) ? isSearched : false;
	    CommonService.specializationDetails($scope.home.doctorName).then(function(response){
	    	console.log(response);
	    	$scope.specializationDetails = response.data.Data[0]
	    })
	}
	$rootScope.$on('DOCTOR_LIST_SPECIALIZATION',function(){
		$scope.initSpecialization(true);
	})
	$scope.gotoSpecializationDetails = function(name){
		sessionStorage.setItem('specialization', name);
		// localStorage.setItem('specialization',name);
		$state.go('specialization-details');
	}
})
.controller('DatePickerCtrl' , ['$scope', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        /*
         $scope.disabled = function(date, mode) {
         return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
         };*/

        $scope.toggleMin = function() {
            $scope.minDate = null; //$scope.minDate = null || new Date();
            $scope.maxDate = new Date();
            $scope.dateMin = null || new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.mode = 'month';

        $scope.initDate = new Date();
        $scope.formats = ['MM-dd-yyyy', 'dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd/MM/yyyy', 'yyyy-MMM','shortDate'];
        $scope.format = $scope.formats[4];
        $scope.format1 = $scope.formats[5];

    }
    ]);
