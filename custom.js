var app = angular.module('health-advisor',['ui.router','ngAnimate','ImageCropper','ui.bootstrap','ui.utils','bw.paging','timeRelative','ngStorage','ngSanitize','ngTagsInput','autocomplete']);
app.config(["$stateProvider", "$urlRouterProvider", "$provide", function($stateProvider, $urlRouterProvider,$provide) {
  checkLoggedin.$inject = ["$q", "$timeout", "$rootScope", "$state", "$localStorage", "HealthAuth"];
  checkLoggedout.$inject = ["$q", "$timeout", "$rootScope", "$state", "$localStorage", "HealthAuth"];
  confirmLogin.$inject = ["$q", "$timeout", "$rootScope", "$state", "$localStorage", "HealthAuth"];
  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    templateUrl: 'src/views/home/home.html',
    controller: "HomeController",
    url: '/home'
  })
  .state('login', {
    templateUrl: 'src/views/header/login.html',
    controller: "AuthenticationController",
    url: '/login',
    resolve: {
      loggedout: checkLoggedin
    }
  })
  .state('forgot-password', {
    templateUrl: 'src/views/header/forgot-password.html',
    controller: "AuthenticationController",
    url: '/forgot-password'
  })
  .state('change-password', {
    templateUrl: 'src/views/header/resetPassword.html',
    controller: "AuthenticationController",
    url: '/change-password'
  })
  .state('register', {
    templateUrl: 'src/views/header/register.html',
    controller: "AuthenticationController",
    url: '/register',
    resolve: {
      loggedout: checkLoggedin
    }
  })
  .state('doctor-verify', {
    templateUrl: 'src/views/doctors/doctor-verified.html',
    controller: "AuthenticationController",
    url: '/doctor-verify'
  })
  .state('updateDoctorProfile', {
    templateUrl: 'src/views/doctors/doctor-profile.html',
    controller: "DoctorProfileController",
    url: '/updateDoctorProfile',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('updateUserProfile', {
    templateUrl: 'src/views/customer/update-profile.html',
    controller: "UserProfileController",
    url: '/updateUserProfile',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('specialization', {
    templateUrl: 'src/views/common/specialization.html',
    url: '/specialization',
    controller:'SpecializationController'
  })
  .state('specialization-details', {
    templateUrl: 'src/views/common/sepcialization-details.html',
    url: '/specialization-details',
    controller:'SpecializationController'
  })
  .state('contact-us', {
    templateUrl: 'src/views/common/contact-us.html',
    url: '/contact-us',
    controller: 'CommonController'
  })
  .state('state-directory', {
    templateUrl: 'src/views/directory/state-directory.html',
    url: '/state-directory',
	controller: 'DirectoryController'
  })
  .state('city-directory', {
    templateUrl: 'src/views/directory/city-directory.html',
    url: '/city-directory/:cityName',
	controller: 'DirectoryController'
  })
  .state('doctors-directory', {
    templateUrl: 'src/views/directory/doctors-directory.html',
    url: '/doctors-directory/:cityName',
	controller: 'DirectoryController'
  })
  .state('doctors-list', {
    templateUrl: 'src/views/doctors/doctors-list.html',
    url: '/doctors-list',
    controller: 'DoctorsController',
    params: {
      searchParams : null
    }
  })
  .state('doctor-direction', {
    templateUrl: 'src/views/doctors/doctor-direction.html',
    url: '/doctor-direction',
    controller: 'DoctorsController'
  })
  .state('find-doctors', {
    templateUrl: 'src/views/doctors/find-doctors.html',
    url: '/find-doctors'
  })
  .state('doctor-details', {
    templateUrl: 'src/views/doctors/doctor-details.html',
    url: '/doctor-details/:profileName',
    controller: 'DoctorDetailsController'
  })
  .state('signedDoctor', {
    templateUrl: 'src/views/doctors/doctor-details.html',
    url: '/signedDoctor',
    controller: 'DoctorDetailsController',
    resolve: {
      loggedout: checkLoggedout
    }
  })
  .state('signedUser', {
    templateUrl: 'src/views/customer/customer-profile.html',
    url: '/signedUser',
    controller: 'UserProfileController'
  })
  .state('doctor-compare', {
    templateUrl: 'src/views/doctors/doctor-compare.html',
    url: '/doctor-compare',
    controller: 'DoctorsController'
  })
  .state('review-doctor', {
    templateUrl: 'src/views/doctors/review/review-doctor.html',
    url: '/review-doctor/:profileName',
    controller:"ReviewController",
    resolve: {
      loggedout: confirmLogin
    }
  })
  .state('review-preview', {
    templateUrl: 'src/views/doctors/review/review-preview.html',
    url: '/review-preview/:profileName',
    controller:"ReviewController",
    resolve: {
      loggedout: confirmLogin
    }
  })
  .state('review-success', {
    templateUrl: 'src/views/doctors/review/review-success.html',
    url: '/review-success/:profileName',
    controller:"ReviewController",
    resolve: {
      loggedout: confirmLogin
    }
  })


  function checkLoggedout($q, $timeout, $rootScope, $state, $localStorage,HealthAuth) {
    var deferred = $q.defer();
    $timeout(function(){
      if(HealthAuth.accessToken){
        deferred.resolve();
      }
      else{
        deferred.resolve();
        $state.go('login');
      }
    },100)  
  }
  function checkLoggedin($q, $timeout, $rootScope, $state, $localStorage,HealthAuth) {
    var deferred = $q.defer();
    $timeout(function(){
      if(HealthAuth.accessToken){
        deferred.resolve();
        $state.go('home');
      }
      else{
        deferred.resolve();
      }
    },100)  
  }
  function confirmLogin($q, $timeout, $rootScope, $state, $localStorage,HealthAuth) {
    var deferred = $q.defer();
    $timeout(function(){
      if(!HealthAuth.accessToken){
        $rootScope.isReload = true;
        $rootScope.reloadState = $state.next.name;
        for(var key in $state.toParams){
          $rootScope.reloadState += '/'+$state.toParams[key];
        }
        deferred.resolve();
        $state.go('login');
      }
      else{
        deferred.resolve();
      }
    })  
  }
  $provide.decorator('$state', ["$delegate", "$rootScope", function($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, state, params) {
      $delegate.next = state;
      $delegate.toParams = params;
    });
    return $delegate;
  }]);
}]);
app.run(["$http", "$rootScope", "$timeout", "AuthorizeService", function($http,$rootScope,$timeout,AuthorizeService){
  AuthorizeService.checkTokenTime();
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $rootScope.stateName = toState.name;
      window.scrollTo(0, 0);
    });
}]);
app.constant('CONFIG', {
  "API_PATH":"http://healthadvisor.ssmaktak.com/api/",
  "SERVER_PATH":1 
})
;app.factory("Config", ["$rootScope", function($rootScope) {
  var gApi = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
  var gApiKey = "AIzaSyAXBP60-UkTuNPGRX5N5jtdKZl2YRvXUdA";
  return{
  	getLocationUrl : function(param){
  		var url = gApi+param+"&key="+gApiKey;
    	return url;
  	}
  }
}]);
app.constant("HEALTH_ADVISER",function(){
	ACCESS_TOKEN_EXPIRES_IN:300
});app.controller('AuthenticationController',["$scope", "$rootScope", "$timeout", "Util", "AuthorizeService", "$state", "DoctorDetailsService", "$state", "$localStorage", "$location", function($scope,$rootScope,$timeout,Util,AuthorizeService,$state,DoctorDetailsService,$state,$localStorage,$location){
	$scope.user = {};
	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
	var options = {
	    componentRestrictions: {country: "IN"},
	    types: ['(cities)']
	};
	$scope.initRegister = function(){
			if(google=="" || !google.maps || !google.maps.places)
	      	googleTime = $timeout($scope.initRegister , 3000);
	    else {
      	clearTimeout(googleTime);
				var inputFrom = document.getElementById('city');
				var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
				google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
				    populateAddressFields(autocompleteFrom.getPlace());
				    $scope.$apply();
				});
			}
	}
	function populateAddressFields(place) {
    if (place.geometry) {
      $scope.user.latLng = place.geometry.location.lat() + "," + place.geometry.location.lng();
    }
    $scope.user.city = place.name;
	}
	$scope.validatePassword = function(){
			if($scope.user.password !== $scope.user.c_pass){
	      $scope.showPasswordMisMatch = true;
	    }
	   	if($scope.user.password === $scope.user.c_pass) {
	      $scope.showPasswordMisMatch = false;
	    }
	}
	$scope.validateUserInfo = function(email) {
		var obj = {
			"email":email
		}
  	AuthorizeService.validateUserName(obj).then(function (response) {
      if(response.data.StatusCode == 302){
      	$scope.isExist = true;
      }
      else{
      	$scope.isExist = false;
      }
  	}, function (errorResponse) {
  	});
  }
	$scope.register = function(){
		var userData = {
			"actType": "I",
      	"address": {
        	"city": $scope.user.city,
        	"lat":$scope.user.latLng
      	},
      	"phone": $scope.user.phone,
      	"profile": {
        	"fName": $scope.user.first_name,
        	"lName": $scope.user.last_name
      	},
      	"email": $scope.user.email,
      	"initial_signup_method": "health adviser",
      	"isDoctor": $scope.user.isDoctor,
      	"password": $scope.user.password,
      	"userName": $scope.user.email,
      	"hearAboutUs":$scope.user.hear_about
    };
    $rootScope.showPreloader = true;
    AuthorizeService.register(userData).then(function (response) {
    	$rootScope.showPreloader = false;
    	if(response.data.StatusCode == 200){
    	var obj = {
				"userId": $scope.user.email,
				"password": $scope.user.password
   		}
          AuthorizeService.login(obj).then(function (response) {
          		$rootScope.$emit('login-success');
          		if($scope.user.isDoctor == true){
				    		$state.go('doctor-verify');
          		}
          		else{
          			$state.go('updateUserProfile');
          		}
          	},function(error){
							$rootScope.showPreloader = false;
							Util.alertMessage('danger',"Something went wrong! unable to register");
          	})
        	}
        else{
					Util.alertMessage('danger',"Something went wrong! unable to register");
        }
    	}, function (errorResponse) {
					$rootScope.showPreloader = false;
        	Util.alertMessage('danger',"Something went wrong! unable to register");
    	});
	}
	$scope.login = function(){
		var obj = {
			"userId": $scope.user.email,
			"password": $scope.user.password
		}
		$rootScope.showPreloader = true;
  	AuthorizeService.login(obj).then(function (response) {
  		$rootScope.showPreloader = false;
			$rootScope.$emit('login-success');
  		if(response.data.StatusCode == 200){
				if($scope.user.remember){
					$localStorage.user = {
						"uname" : $scope.user.email,
						"password": $scope.user.password
					}
				}
				if($rootScope.isReload){
					$location.path($rootScope.reloadState);
				}
				else{
					$state.go('signedDoctor');
				}
  		}
			else{
				Util.alertMessage('danger',"Something went wrong! unable to login");
			}
  	},function(error){
			$rootScope.showPreloader = false;
			Util.alertMessage('danger',"Authentication faild");
		})
	}
	$scope.initLogin = function(){
		$scope.user = {};
		$scope.user.email = ($localStorage.user) ? $localStorage.user.uname : '';
		$scope.user.password = ($localStorage.user) ? $localStorage.user.password : '';
	}
	$scope.forgotPassword = function(){
		$rootScope.showPreloader = true;
		AuthorizeService.forgotPassword($scope.user.email).then(function (response) {
			$rootScope.showPreloader = false;
  		if(response.data.StatusCode == 200){
				Util.alertMessage('success',"Please check your mail we have sent a Password");
				$state.go('login');
  		}
			else{
				Util.alertMessage('danger',"Something went wrong!");
			}
		})
	}
	$scope.changePassword = function(){
		$rootScope.showPreloader = true;
		AuthorizeService.changePassword($scope.user).then(function (response) {
			$rootScope.showPreloader = false;
  		if(response.data.StatusCode == 200){
				Util.alertMessage('success',"Password successfully changed'");
  		}
			else{
				Util.alertMessage('danger',"Something went wrong!");
			}
		})
	}
}]);
;app.controller("CommonController",["$scope", "$rootScope", "CommonService", "Util", function($scope,$rootScope,CommonService,Util){
		$scope.contact = {};
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
}])
;app.controller('deleteWorkExperienceModalCtrl', ["$scope", "$uibModalInstance", "deleteWorkExperience", "workExpId", function ($scope, $uibModalInstance,deleteWorkExperience,workExpId) {
  $scope.ok = function () {
    deleteWorkExperience(workExpId);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);
app.controller('awardDetailsModalCtrl', ["$scope", "$uibModalInstance", "deleteAwardsDetails", "awardId", function ($scope, $uibModalInstance,deleteAwardsDetails,awardId) {
    $scope.ok = function () {
        deleteAwardsDetails(awardId);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
app.controller('educationModalCtrl', ["$scope", "$uibModalInstance", "deleteEducation", "eduid", function ($scope, $uibModalInstance,deleteEducation,eduid) {
    $scope.ok = function () {
        deleteEducation(eduid);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
app.controller('LicenseModalCtrl', ["$scope", "$uibModalInstance", "deleteLicense", "lid", function ($scope, $uibModalInstance,deleteLicense,lid) {
    $scope.ok = function () {
        deleteLicense(lid);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);
;app.controller("SpecializationController", ["$scope", "$rootScope", "CommonService", "$localStorage", "$state", function($scope,$rootScope,CommonService,$localStorage,$state){
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
}])
.controller('DatePickerCtrl' , ['$scope', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

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
    ]);;app.controller('UserProfileController', ["$scope", "$rootScope", "$state", "CommonService", function($scope, $rootScope, $state, CommonService){
    google = typeof google === 'undefined' ? "" : google;
    var googleTime;
    $scope.showtab = function(obj) {
        $("div[id^='div_']").each(function (i, el) {
            $(el).removeClass("in active");
        });
        $("div[id=div_" + obj +"]").addClass("in active");
        $( "ul[id='myTabs']").children().each(function (i, el) {
            $(el).removeClass("active");
            $("li[id="+el.id+"]").children().each(function(i,ay) {
                if(ay.id == obj) {
                    $(el).addClass("active");
                }
            })
        });
    }
    $scope.profileDetails = function(){
        $rootScope.showPreloader = true;
        CommonService.userDetails().then(function(response){
            $rootScope.showPreloader = false;
            if(response.data.StatusCode == 200){
                $scope.profileDetails = response.data.Data.result;
                $scope.initMapLocation();
                if($scope.profileDetails.isDoctor){
                    $state.go('home');
                }
            }
        })
    }
    $scope.loadLanguages = function(){
        CommonService.languages().then(function(response){
            if(response.data.StatusCode == 200){
                $scope.languages = [];
                angular.forEach(response.data.Data,function(item){
                    $scope.languages.push(item.name);
                });
            }
        },function(error){
        })
    }
    var options = {
        componentRestrictions: {country: "IN"}
    };
    $scope.initMapLocation = function(){
        if(google == "" || !google.maps || !google.maps.places)
            googleTime = $timeout($scope.initMapLocation , 3000);
        else {
            clearTimeout(googleTime);
            var inputFrom = document.getElementById('street');
            var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
            google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
                populateAddressFields(autocompleteFrom.getPlace());
                $scope.$apply();
            });
        }
    };
    function populateAddressFields(place) {
        var address_components = place.address_components;
        $scope.profileDetails.address.streetAddress = place.name;
        $scope.profileDetails.address.formatted = place.formatted_address;
        if (place.geometry) {
          $scope.profileDetails.address.lat = place.geometry.location.lat();
          $scope.profileDetails.address.lng = place.geometry.location.lng();
        }
        for(var i = 0; i < address_components.length; i++) {
            var types = address_components[i].types;
            if(types[0] == 'postal_code') {
                $scope.profileDetails.address.postalCode = address_components[i].long_name;
            } else if (types[0] == 'administrative_area_level_1' ) {
                $scope.profileDetails.address.state = address_components[i].long_name;
            } else if(types[0] == 'locality') {
                $scope.profileDetails.address.city = address_components[i].long_name;
            } else if(types[0] == 'country') {
                $scope.profileDetails.address.country = address_components[i].long_name;
            }
        }
    }
}]);app.controller('DirectoryController',["$scope", "$rootScope", "DoctorService", "$stateParams", "DoctorModel", "$state", "$timeout", function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state,$timeout){
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
	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
  	$scope.startRecord = 1;
	$scope.doctorsList = function(){
		if(google=="" || !google.maps || !google.maps.places || !$scope.latLong)
        	googleTime = $timeout($scope.doctorsList , 3000);
	    else {
	      	clearTimeout(googleTime);
	      	$rootScope.showPreloader = true;
	      	var obj  = {
			  "geoPoint": $scope.latLong,
			  "filter": {
			    "startRecord": $scope.startRecord
			  },
			  "city":$stateParams.cityName
			}
		    DoctorService.fetchDoctor(obj).then(function(response) {
		 	  $rootScope.showPreloader = false;
		 	  if(response.data.StatusCode == 200)
		      	$scope.doctorList = response.data.Data.result;
				console.log($scope.doctorList);
				$scope.resultCount = $scope.doctorList.length;
				$scope.totalPage = response.data.Data.totalResultCount;
		    },function(err) {
		      $rootScope.showPreloader = false;
		    });
	    }
	}
	$scope.filterChanged = function(pageNo){
		$scope.startRecord = parseInt(pageNo);
		$scope.doctorsList();
	}

}]);app.controller('DoctorDetailsController',["$scope", "$rootScope", "DoctorService", "$stateParams", "DoctorDetailsService", function($scope,$rootScope,DoctorService,$stateParams,DoctorDetailsService){
  
  $scope.signed_lawyer = $stateParams.profileName;
  
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
    else{
      DoctorDetailsService.doctorDetails().then(function(response){
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
}]);app.controller("DoctorProfileController",["$scope", "$rootScope", "CommonService", "$timeout", "DoctorDetailsService", "Util", "$filter", "$uibModal", function($scope, $rootScope,CommonService,$timeout,DoctorDetailsService,Util,$filter, $uibModal){
		google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
	  $scope.signupCollapse = {
        aboutme: false,
        workExperiance: true,
        education: true,
        license: true,
        awards: true,
        associations: true,
        publications: true,
        conference: true
    };
		$scope.specialize = {};
    $scope.collapseSignUp = function (filter) {
        angular.forEach($scope.signupCollapse, function(value, key) {
            if(key == filter){
                $scope.signupCollapse[key] = !$scope.signupCollapse[key];
            } else {
                $scope.signupCollapse[key] = true;
            }
        });
    };
    $scope.showtab = function(obj) {
        $("div[id^='div_']").each(function (i, el) {
            $(el).removeClass("in active");
        });
        $("div[id=div_" + obj +"]").addClass("in active");
        $( "ul[id='myTabs']").children().each(function (i, el) {
            $(el).removeClass("active");
            $("li[id="+el.id+"]").children().each(function(i,ay) {
                if(ay.id == obj) {
                    $(el).addClass("active");
                }
            })
        });
    }
  	$scope.loadProfileDetails = function(){
  		$rootScope.showPreloader = true;
  		CommonService.userDetails().then(function(response){
  			$rootScope.showPreloader = false;
  			if(response.data.StatusCode == 200)
  				$scope.profileDetails = response.data.Data.result;
					$scope.specialize.languageTags = [];
          angular.forEach($scope.profileDetails.profile.language,function(item){
            $scope.specialize.languageTags.push(item.language);
          })
  				$scope.initMapLocation();
  		},function(error){
  			$rootScope.showPreloader = false;
  		})
  	}
    $scope.changeOnPreffered = function(index) {
      angular.forEach($scope.profileDetails.phone, function(contact,key) {
        if (key !== index) {
          contact.isPreffered = false;
        }
      });
    }
  	$scope.loadSpecialization = function(){
			CommonService.specialization().then(function(response){
				if(response.data.StatusCode == 200){
					$scope.specializationList = [];
					angular.forEach(response.data.Data, function(item){
						$scope.specializationList.push(item.name);
					});
				}
			},function(errot){
			})
  	}
  	$scope.loadLanguagesList = function(){
			CommonService.languages().then(function(response){
				if(response.data.StatusCode == 200){
					$scope.languages = [];
					angular.forEach(response.data.Data,function(item){
						$scope.languages.push(item.name);
					});
				}
			},function(error){
			})
  	}
  	$scope.updateSpecialization = function(){
			var obj = {};
			obj.specializationOn = $scope.doctor.specialization;
			obj.yearsOfExperience = $scope.doctor.year;
			$scope.profileDetails.specialization.push(obj);
			$scope.doctor = {};
  	}
  	$scope.clearSpecializationOn = function(index){
			$scope.profileDetails.specialization.splice(index,1);
  	}
  	var options = {
        componentRestrictions: {country: "IN"}
    };
  	$scope.initMapLocation = function(){
  		if(google == "" || !google.maps || !google.maps.places)
        	googleTime = $timeout($scope.initMapLocation , 3000);
	    else {
	      	clearTimeout(googleTime);
			var inputFrom = document.getElementById('street');
			var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
			google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
			    populateAddressFields(autocompleteFrom.getPlace());
			    $scope.$apply();
			});
		}
  	};
  	function populateAddressFields(place) {
		var address_components = place.address_components;
		$scope.profileDetails.address.streetAddress = place.name;
		$scope.profileDetails.address.formatted = place.formatted_address;
        if (place.geometry) {
          $scope.profileDetails.address.lat = place.geometry.location.lat();
          $scope.profileDetails.address.lng = place.geometry.location.lng();
        }
        for(var i = 0; i < address_components.length; i++) {
            var types = address_components[i].types;
            if(types[0] == 'postal_code') {
                $scope.profileDetails.address.postalCode = address_components[i].long_name;
            } else if (types[0] == 'administrative_area_level_1' ) {
                $scope.profileDetails.address.state = address_components[i].long_name;
            } else if(types[0] == 'locality') {
                $scope.profileDetails.address.city = address_components[i].long_name;
            } else if(types[0] == 'country') {
                $scope.profileDetails.address.country = address_components[i].long_name;
            }
        }
	}
  function readAddImage(input) {
    if (input.files && input.files[0]) {
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        $scope.imageSrc = e.target.result;
        $scope.imagename= input.files[0].name;
        $scope.is_crop_image = true;
        $scope.$apply();
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }
  $("#addImg").change(function() {
      readAddImage(this);
  });
  $("#cropped_img").load(function() {
      $scope.is_crop_image = false;
      $scope.profile_image = $('#cropped_img').attr( "src");
      $scope.imageCropStep = 1;
      $scope.$apply();
  });
  $scope.clearimage = function(){
    $scope.profile_image = '';
  }
  $scope.addMobile = function(){
    $scope.profileDetails.phone.push($scope.mobile);
    $scope.mobile = {};
  }
  $scope.removeMobile = function(index){
    $scope.profileDetails.phone.splice(index,1);
  }
  $scope.updatePersonalProfile = function () {
    $rootScope.showPreloader = true;
    var personalDetails = {};
    personalDetails.profile = $scope.profileDetails.profile;
    personalDetails.address = $scope.profileDetails.address;
    personalDetails.phone = $scope.profileDetails.phone;
    personalDetails.consulation = $scope.profileDetails.consulation;
    if($scope.profile_image){
      personalDetails.fileData = {
        "fileName" : $scope.imagename,
        "inputStream" : $scope.profile_image.split(";base64,")[1]
      };
    }
    DoctorDetailsService.updatePersonalProfile(personalDetails).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        Util.alertMessage('success', 'your information successfully updated. Thank you.');
        $scope.$emit('login-success');
      }
      else{
        Util.alertMessage('danger', 'Somthing went wrong ! unable to update your information.');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
      Util.alertMessage('danger','Somthing went wrong ! unable to update your information.');
    });
  };
	$scope.updateSpecializationDetails = function () {
    $rootScope.showPreloader = true;
    var personalDetails = {};
    personalDetails.specialization = $scope.profileDetails.specialization;
    personalDetails.yearsOfExperience = $scope.profileDetails.yearsOfExperience;
		personalDetails.profile = {};
		personalDetails.profile.language = [];
		angular.forEach($scope.specialize.languageTags,function(item){
			var obj = {};
			obj.language = item.text;
			personalDetails.profile.language.push(obj);
		});
    DoctorDetailsService.updatePersonalProfile(personalDetails).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        Util.alertMessage('success', 'your information successfully updated. Thank you.');
      }
      else{
        Util.alertMessage('danger', 'Somthing went wrong ! unable to update your information.');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
      Util.alertMessage('danger','Somthing went wrong ! unable to update your information.');
    });
  };
  $scope.loadLanguages = function (query) {
      var result = $filter('filter')($scope.languages, query);
      return result;
  };
  $scope.editWorkExperience = function (index,work) {
    $scope.tempwork = {};
    $scope.tempwork.id = work.id;
    $scope.tempwork.organizationName = work.organizationName;
    $scope.tempwork.description = work.description;
    $scope.tempwork.designation = work.designation;
    $scope.tempwork.dateTo = '2016-12-31T18:30:00.000Z';
    $scope.tempwork.dateFrom = work.dateFrom;
    $scope.workEdit = index;
  };
  $scope.cancelWorkEdit = function () {
    delete $scope.workEdit;
  };
  $scope.updateWorkExpDoctor = function (work) {
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateWorkExperience($scope.tempwork).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        work.organizationName = $scope.tempwork.organizationName;
        work.description = $scope.tempwork.description;
        work.designation = $scope.tempwork.designation;
        work.dateTo = $scope.tempwork.dateTo;
        work.dateFrom = $scope.tempwork.dateFrom;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!');
      }
    }, function (errorResponse) {
        $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in update !!!');
    });
  };
  $scope.addWorkExpDoctor = function () {
    $rootScope.showPreloader = true;
    DoctorDetailsService.addWorkExperience($scope.workexperience).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.experience.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!');
      }
    }, function (errorResponse) {
        $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in update !!!');
    });
  };
  $scope.deleteWorkExperience = function (id) {
      var obj = {};
      obj.id = id;
      $rootScope.showPreloader = true;
      DoctorDetailsService.deleteWorkExperience(obj).then(function (response) {
        $rootScope.showPreloader = false;
        if(response.data.StatusCode == 200){
          $scope.profileDetails.experience.splice($scope.deleteIndex,1);
          Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
        }
        else{
          Util.alertMessage('danger', 'Error in Delete !!!');
        }
      }, function (errorResponse) {
        $rootScope.showPreloader = false;
          Util.alertMessage('danger', 'Error in Delete !!!');
      });
  };
  $scope.deleteWorkExperienceModal = function(size,workExpId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/workExpDeleteModal.html',
     controller: 'deleteWorkExperienceModalCtrl',
     size: size,
     resolve: {
       deleteWorkExperience: function () {
         return $scope.deleteWorkExperience;
       },
       workExpId:function () {
         return workExpId;
       }

     }
   });
  }
  $scope.saveAwards = function(){
    var fileData = {
      "fileName": $scope.photo.imageName,
      "inputStream": $scope.photo.image.split(";base64,")[1]
    }
    $scope.awards.fileData = fileData;
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveAwards($scope.awards).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.award.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
      }
    },function(error){
      Util.alertMessage('danger', 'something went wrong! unable to add awards');
    })
  }
  $scope.deleteAwardsModal = function(size,awardId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/awardsDetailDeleteModal.html',
     controller: 'awardDetailsModalCtrl',
     size: size,
     resolve: {
       deleteAwardsDetails: function () {
         return $scope.deleteAwardsDetails;
       },
       awardId:function () {
         return awardId;
       }
     }
    })
  }
  $scope.deleteAwardsDetails = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteAwards(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.award.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  $scope.editAwards = function (index,award) {
    $scope.tempaward = {};
    $scope.tempaward.id = award.id;
    $scope.tempaward.organizationName = award.organizationName;
    $scope.tempaward.description = award.description;
    $scope.tempaward.awardFor = award.awardFor;
    $scope.tempaward.awardDate = award.awardDate;
    $scope.tempaward.mainimage = award.awardDate.image
    $scope.awardEdit = index;
  };
  $scope.cancelAwardEdit = function () {
    delete $scope.awardEdit;
  };
  $scope.updateAwards = function (award) {
    $rootScope.showPreloader = true;
    if($scope.tempaward.imageName){
      var fileData = {
        "fileName": $scope.tempaward.imageName,
        "inputStream": $scope.tempaward.image.split(";base64,")[1]
      }
     $scope.tempaward.fileData = fileData;
    }
    DoctorDetailsService.updateAwards($scope.tempaward).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        award.organizationName = $scope.tempaward.organizationName;
        award.description = $scope.tempaward.description;
        award.awardFor = $scope.tempaward.awardFor;
        award.awardDate = $scope.tempaward.awardDate;
        award.image = response.data.Data.image;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!');
      }
    }, function (errorResponse) {
        $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in update !!!');
    });
  };
  $scope.saveEducation = function(){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveEducation($scope.education).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.education.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        $scope.education = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  $scope.deleteEducationModal = function(size,eduid,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/educationDeleteModal.html',
     controller: 'educationModalCtrl',
     size: size,
     resolve: {
       deleteEducation: function () {
         return $scope.deleteEducation;
       },
       eduid:function () {
         return eduid;
       }
     }
    })
  }
  $scope.deleteEducation = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteEducation(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.education.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  $scope.editEducationOpen = function(index,education){
    $scope.eduEdit = index;
    $scope.tempEducation = {};
    $scope.tempEducation.id = education.id;
    $scope.tempEducation.educationType = education.educationType;
    $scope.tempEducation.year = education.year;
    $scope.tempEducation.university = education.university;
    $scope.tempEducation.major = education.major;
    $scope.tempEducation.score = education.score;
    $scope.tempEducation.description = education.description;
  }
  $scope.cancelEduEdit = function () {
    delete $scope.eduEdit;
  };
  $scope.updateEducation = function(edu){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateEducation($scope.tempEducation).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        var data = response.data.Data;
        edu.educationType = data.educationType;
        edu.year = data.year;
        edu.university = data.university;
        edu.major = data.major;
        edu.score = data.score;
        edu.description = data.description;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
       Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  $scope.saveLicense = function(obj){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveLicense($scope.license).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.license.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        $scope.education = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  $scope.deleteLicenseModal = function(size,lid,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/LicenseDetailDeleteModal.html',
     controller: 'LicenseModalCtrl',
     size: size,
     resolve: {
       deleteLicense: function () {
         return $scope.deleteLicense;
       },
       lid:function () {
         return lid;
       }
     }
    })
  }
  $scope.deleteLicense = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteLicense(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.license.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  $scope.editLicenseOpen = function(index,license){
    $scope.editLicense = index;
    $scope.tempLicense = {};
    $scope.tempLicense.id = license.id;
    $scope.tempLicense.licenseNumber = license.licenseNumber;
    $scope.tempLicense.issueDate = license.issueDate;
    $scope.tempLicense.expiryDate = license.expiryDate;
    $scope.tempLicense.organizationName = license.organizationName;
    $scope.tempLicense.description = license.description;
    console.log($scope.tempLicense);
  }
  $scope.cancelLicenseEdit = function () {
    delete $scope.editLicense;
  };
  $scope.updateLicense = function(license){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateLicense($scope.tempLicense).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        var data = response.data.Data;
        license.licenseNumber = data.licenseNumber;
        license.issueDate = data.issueDate;
        license.expiryDate = data.expiryDate;
        license.organizationName = data.organizationName;
        license.description = data.description;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
       Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
	$scope.processForm = function() {
		$scope.showTheForm = false;
	}
	$scope.processForm1 = function() {
		$scope.showTheForm1 = false;
	}
  $scope.changeSelect = function(option,start,end){
      if(start && end){
        if(moment(start).isAfter(end)){
          if(option == 'start'){
            $scope.is_startError = true;
          }
          else if(option == 'end'){
            $scope.is_endError = true;
          }
          else if(option == 'e_start'){
            $scope.is_EstartError = true;
          }
          else if(option == 'e_end'){
            $scope.is_EendError = true;
          }
        }
        else{
          $scope.is_startError = false;
          $scope.is_EstartError = false;
          $scope.is_endError = false;
          $scope.is_EendError = false;
        }
      }
    }
}])
;app.controller('ReviewController',["$scope", "$rootScope", "$stateParams", "DoctorService", "CommonService", "$state", function($scope, $rootScope, $stateParams, DoctorService,CommonService,$state){
	$rootScope.isReload = false;
  	$scope.loadCurrentReview = function(){
	var tempReview = CommonService.getReviewDetails();
	    $scope.doctorDetails = tempReview.doctorDetails;
	    $scope.review = tempReview.review;
	    if(!$scope.doctorDetails){
	    	$scope.getDoctorDetails();
	    }
	}
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
  	$scope.gotoPreview = function(){
  		var review = {
  			"review" : $scope.review,
  			"doctorDetails" : $scope.doctorDetails
  		}
	    CommonService.setReviewDetails(review);
	    $state.go('review-preview',{profileName: $stateParams.profileName});
	}
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
}])
;app.controller('DoctorsController',["$scope", "$rootScope", "DoctorService", "$stateParams", "DoctorModel", "$state", "orderByFilter", function($scope,$rootScope,DoctorService,$stateParams,DoctorModel,$state,orderByFilter){
	$scope.compareDoctorArr = [{}, {}, {}, {}];
	var map;
	var directionService;
	var directionDisplay;
	var sourcePlace;
	var destination;
	$scope.paging = {currentPage:1,totalPage:0,showResult:0};
	$scope.filter = {};
	$scope.filter.sorting = 'avgRating';
	$scope.showCompare = function(operation, doctor) {
    	switch (operation) {
	      case 'show':
	        $scope.showCompareBox = true;
	        for (var i in $scope.compareDoctorArr) {
	          if (angular.equals($scope.compareDoctorArr[i], {}) && $scope.compareDoctorArr.indexOf(doctor) === -1) {
	            $scope.compareDoctorArr[i] = doctor;
	            break;
	          }
	        }
	        break;
	      case 'clear':
	        $scope.resetCompareDoctor();
	        break;
	      default:
	    }
	}
  	$scope.initListing = function() {
  		$scope.filter.sorting = 'avgRating';
      	$scope.doctorList = DoctorService.getDoctorLisitng();
      	$scope.searchData = DoctorService.getSearchData();
      	$scope.resetCompareDoctor();
	    $scope.loadMap();
	    if($scope.doctorList.result){
		    angular.forEach($scope.doctorList.result,function(doctor){
		    	doctor.specializationArray = [];
		    	angular.forEach(doctor.specialization,function(item){
		    		doctor.specializationArray.push(item.specializationOn);
		    	})
		    	doctor.specializationArray = doctor.specializationArray.toString();
		    })
		    $scope.paging.showResult = $scope.doctorList.result.length;
		    $scope.paging.totalPage = $scope.doctorList.totalResultCount;
		}
    }
    $rootScope.$on("DOCTOR_LIST_FETCHED",function(){
    	$scope.paging.currentPage = 1;
    	$scope.filter = {};
    })
	$scope.loadMap = function() {
	    $scope.markers = [];
	    map = new google.maps.Map(document.getElementById('googleMap'), {
	      zoom: 7
	    });
	    $scope.setMarkers();
	}
	$scope.setMarkers = function() {
	    var bound = new google.maps.LatLngBounds();
	    angular.forEach($scope.doctorList.result, function(item) {
	      var loc = new google.maps.LatLng(parseFloat(item.address.lat), parseFloat(item.address.lng));
	      var marker = new google.maps.Marker({
	        position: loc,
	        map: map,
	        animation: google.maps.Animation.DROP
	      });
	      console.log(marker);
	      bound.extend(loc);
	      $scope.markers.push(marker);
	    });
	    map.setCenter(bound.getCenter());
	}

	$scope.resetCompareDoctor = function() {
	    $scope.compareDoctor = [{}, {}, {}, {}];
	}
	$scope.closeCompare = function(){
	    $scope.showCompareBox = false;
	}
	$scope.closeDoctorCompare = function(index) {
	    $scope.compareDoctorArr[index] = {};
	    $scope.compareCloseCount();
	}
	$scope.compareCloseCount = function() {
	    for (var i in $scope.compareDoctorArr) {
	      if (!angular.equals($scope.compareDoctorArr[i], {})) {
	        return;
	      }
	    }
	    $scope.showCompareBox = false;
	}
	$scope.doCompare = function() {
	    DoctorModel.setCompareArr($scope.compareDoctorArr);
	    $state.go("doctor-compare");
	}
	$scope.compareInit = function(){
		$scope.compareDoctorArr = DoctorModel.getCompareArr();
	}

	$scope.filterChanged = function(pageNumber) {
		$rootScope.showPreloader = true;
    	var filterObj = {}
    	var counter = 0;
    	filterObj.startRecord =  (pageNumber) ? parseInt(pageNumber) : 1;
    	angular.forEach($scope.filter, function(value, key) {
	        switch (key) {
	        	case "languages":
	        		filterObj.language = [];
		            angular.forEach($scope.filter.languages, function(value, key) {
		              if (value)
		                filterObj.language.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.languages).length && filterObj.language.length <= 0)
		                delete filterObj['language'];
		            })
		            break;
	            case "specialization":
	        		filterObj.specialization = [];
		            angular.forEach($scope.filter.specialization, function(value, key) {
		              if (value)
		                filterObj.specialization.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.specialization).length && filterObj.specialization.length <= 0)
		                delete filterObj['specialization'];
		            })
		            break;
		        case "rating":
	        		filterObj.rating = [];
		            angular.forEach($scope.filter.rating, function(value, key) {
		              if (value)
		                filterObj.rating.push(key);
		              	counter++;
		              if (counter >= Object.keys($scope.filter.rating).length && filterObj.rating.length <= 0)
		                delete filterObj['rating'];
		            })
		            break;
		        case "distance":
		        	filterObj.distance = value;
		        	break;
	        }
	    })
	    var obj = {
	    	"searchText": $state.params.searchParams.searchText,
		    "geoPoint": $state.params.searchParams.latLong,
		    "filter": filterObj
	    }
	    DoctorService.fetchDoctor(obj).then(function(response) {
	      $rootScope.showPreloader = false;
	      DoctorService.setDoctorLisitng(response.data.Data);
	      $scope.initListing();
	      $state.current.name == "doctors-list" ? $state.transitionTo($state.current, {
	        searchParams: {
	          latLong: $scope.searchData.latLong,
	          searchText: $scope.searchData.searchText,
	          place: $scope.searchData.place
	        }
	      }) : $state.go("doctors-list", {
	        searchParams: {
	          latLong: $scope.searchData.latLong,
	          searchText: $scope.searchData.searchText,
	          place: $scope.searchData.place
	        }
	      });
	    }, function(err) {

	   });
  	}
  	$scope.numberToArray = function (n) {
        return new Array(parseInt(n));
    };
    $scope.sortList = function () {
    	var ascending = ($scope.filter.sorting == 'profile.name' || $scope.filter.sorting == 'distance') ? false : true;
	    $scope.doctorList.result = orderByFilter($scope.doctorList.result, $scope.filter.sorting, ascending);
    };
    $scope.downloadVCard = function(doctor){
    	var vCardObj = vCard.create(vCard.Version.TWO)
      	vCardObj.add(vCard.Entry.FORMATTEDNAME, doctor.profile.name)
      	if(doctor.phone.length > 0)
        	vCardObj.add(vCard.Entry.PHONE, doctor.phone[0].number)
      	vCardObj.add(vCard.Entry.EMAIL, doctor.emailId)
      	vCardObj.add(vCard.Entry.ADDRESS, doctor.address.formatted)
      	vCardObj.add(vCard.Entry.CITY, doctor.address.city)
      	vCardObj.add(vCard.Entry.STATE, doctor.address.state)
  		var link = vCard.export(vCardObj, doctor.profile.name, true)
    }

  	$scope.goToDirection = function(doctor) {
    	DoctorModel.setDoctorProfile(doctor);
  		$state.go('doctor-direction');
  	}

  	$scope.initDirection = function() {
	    $scope.doctorProfile = DoctorModel.getDoctorProfile();
	    if($scope.doctorProfile.address){
		    var address = $scope.doctorProfile.address;
		    var loc = new google.maps.LatLng(parseFloat(address.lat), parseFloat(address.lng));
		    if (navigator.geolocation) {
		      navigator.geolocation.getCurrentPosition(
		        function(position) {
		          var pos = {
		            lat: position.coords.latitude,
		            lng: position.coords.longitude
		          };
		          var pyrmont = new google.maps.LatLng(pos.lat, pos.lng);
		          map = new google.maps.Map(document.getElementById('googleMapdirection'), {
		            center: pyrmont,
		            zoom: 12
		          });
		          var rendererOptions = {
		            map: map
		          };
		          directionService = new google.maps.DirectionsService();
		          directionDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		          var geocoder = new google.maps.Geocoder();
		          geocoder.geocode({
		            'latLng': pyrmont
		          }, function(results, status) {
		            if (status == google.maps.GeocoderStatus.OK) {
		              sourcePlace = results[0]['formatted_address'];
		              geocoder.geocode({
		                'latLng': loc
		              }, function(results, status) {
		                if (status == google.maps.GeocoderStatus.OK) {
		                  destination = results[0]['formatted_address'];
		                  var request = {
		                    origin: sourcePlace,
		                    destination: destination,
		                    travelMode: google.maps.TravelMode.DRIVING
		                  };
		                  directionService.route(request, function(response, status) {
		                    if (status == google.maps.DirectionsStatus.OK) {
		                      directionDisplay.setDirections(response);
		                      var service = new google.maps.DistanceMatrixService();
		                      service.getDistanceMatrix(
		                        {
		                          origins: [sourcePlace],
		                          destinations: [destination],
		                          travelMode: 'DRIVING'
		                        }, function callback(response, status) {
		                        });

		                    } else {
		                      window.alert('Directions request failed due to ' + status);
		                    }
		                  });
		                };
		              });
		            };
		          });
		        });
		    }
		}
		else{
			$state.go('home');
		}
	}
}]);app.controller("HomeController",["$scope", function($scope){
	$scope.name = "adfasdfa";
}])
;app.controller('MainController',["$scope", "$rootScope", "CommonService", "Config", "$timeout", "$state", "DoctorService", "$timeout", "HealthAuth", "DoctorDetailsService", "AuthorizeService", "$uibModal", function($scope,$rootScope,CommonService,Config,$timeout,$state,DoctorService,$timeout,HealthAuth,DoctorDetailsService,AuthorizeService,$uibModal){
  	$scope.$on('$viewContentLoaded', function(event) {
	  	$(document).trigger("TemplateLoaded");
	});
  	$rootScope.$on('SESSION_EXPIRED',function(){
  		var modalInstance = $uibModal.open({
		    animation: true,
		    templateUrl: 'src/views/modals/sessionExpiryModal.html',
		    controller: 'modalController',
		    backdrop: 'static', 
		    keyboard: false,
		    size: 'sm',
		    resolve : {
		    	logout : function () {
			        return $scope.logout;
			    }
		    }
		});
  	})
	$rootScope.$on('login-success', function(event) {
	    $scope.signedView = false;
	    $scope.getUserDetails();
	});
	$scope.getUserDetails = function(){
	    if(HealthAuth.accessToken) {
	      	$timeout(function () {
	      		$scope.signedView = true;
	          	DoctorDetailsService.doctorDetails().then(function(response){
			        $rootScope.logedInUser = response.data.Data.result;
			    },function (errorResponse) {
	          	});
	      	}, 500);
	    }
	}
  	$scope.gotoEditProfile = function(){
	    if($rootScope.logedInUser.isDoctor){
	      $state.go('updateDoctorProfile');
	    }
	    else{
	      $state.go('updateUserProfile');
	    }
	}
  	$scope.showMyProfile = function(){
	    if($rootScope.logedInUser.isDoctor){
	      $state.go('signedDoctor');
	    }
	    else{
	      $state.go('signedUser');
	    }
	}

	$scope.logout = function () {
	    AuthorizeService.logout().then(function (response) {
	        $scope.signedView = false;
	        $rootScope.logedInUser = {};
	        $state.go('login');
	    }, function (errorResponse) {
	        $scope.signedView = false;
	        $rootScope.logedInUser = {};
	        $state.go('login');
	    });
	};
  	google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
  	$scope.home = {};

  	$scope.homeInit = function(reload) {
  		$scope.home.location = DoctorService.getSearchData() && DoctorService.getSearchData().place ? DoctorService.getSearchData().place.formatted_address : undefined;
  		if(!reload && $scope.home.location)
      		return;
	    if(google=="" || !google.maps || !google.maps.places)
        	googleTime = $timeout($scope.homeInit , 3000);
	    else {
	      clearTimeout(googleTime);
	      if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(
	        function(position) {
	          var pos = {
	            lat: position.coords.latitude,
	            lng: position.coords.longitude
	          };
	          var latLng = pos.lat + "," + pos.lng;
	          var urlStr = Config.getLocationUrl(latLng);
	          CommonService.fetchLocation(urlStr).then(function(response) {
	            $scope.place = response.data.results[3];
	            $scope.home.location = $scope.place.formatted_address;
	           	$scope.latLong =  $scope.place.geometry.location.lat + "," +  $scope.place.geometry.location.lng;
	            $scope.initLocation();
	          },function(err) {
	          	console.log(err);
	          },{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
	        });
	      }
	    }
  	};
  	$scope.initLocation = function() {
	    var input = (document.getElementById('main_loc'));
	    autocomplete = new google.maps.places.Autocomplete(input, {
		    types: ['geocode'],
          	componentRestrictions: {
	            country: "IN"
	        }
	    });
	    autocomplete.addListener('place_changed', onPlaceChanged);
	    $rootScope.isGoogleLoaded = true;
	    $scope.$emit("GOOGLE_LOLADED");
	};
	var onPlaceChanged = function() {
	    var place = $scope.place = autocomplete.getPlace();
	    if (place.geometry) {
	    	$scope.latLong = place.geometry.location.lat() + "," + place.geometry.location.lng();
	    } else {
	      document.getElementById('main_loc').placeholder = 'Enter a city';
	    }
	};	
	$scope.clearInputs = function(type){
	    if(type == 'loc'){
	      	$scope.home.location = '';
	    }
	    else if(type == 'name'){
	      	$scope.home.doctorName = '';
	    }
	}
  	$scope.getRatings = function(doctor) {
	    if(doctor.avgRating){
	      rating = doctor.avgRating.toString().split(".");
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
	      doctor.ratingArr = ratingArr;
	    }
	}
  	$scope.reviewRatings = function(review) {
	    if(review && review.rating > 0){
	      rating = review.rating.toString().split(".");
	      ratingArr = [];
	      halfStar = false;
	      var isFloat = false;
	      for (var i = 0; i < 5; i++) {
	        if (i < parseInt(rating[0])) {
	          ratingArr.push("fa fa-star");
	        } else if (parseInt(rating[1]) && !halfStar) {
	          ratingArr.push("fa fa-star-half-o");
	          halfStar = true;
	        } else {
	          ratingArr.push("fa fa-star-o");
	        }
	      }
	      review.ratingArr = ratingArr;
	    }
	}
	$scope.do_search = function() {
	    $rootScope.showPreloader = true;
	    var obj  = {
		  "searchText": $scope.home.doctorName,
		  "geoPoint": $scope.latLong,
		  "filter": {
		    "startRecord": 1
		  }
		}
	    DoctorService.fetchDoctor(obj).then(function(response) {
	      $rootScope.showPreloader = false;
	      DoctorService.setDoctorLisitng(response.data.Data);
	      DoctorService.setSearchData({latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place});
	      $timeout(function() {
	      	$scope.$emit("DOCTOR_LIST_FETCHED");
	      }, 500);
	      switch($state.current.name){
	        case "doctors-list":
	          $state.transitionTo($state.current,{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	        case "home":
	          $state.go("doctors-list",{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break; 
	        case "find-doctors":
	          $state.go("doctors-list",{searchParams:{latLong:$scope.latLong,searchText:$scope.home.doctorName,place:$scope.place}});
	          break;
	      }
	    },function(err) {
	      $rootScope.showPreloader = false;
	    });
	};
}]);
app.controller("modalController", ["$scope", "$rootScope", "$uibModalInstance", "$localStorage", "Util", "$state", "logout", function($scope, $rootScope, $uibModalInstance, $localStorage, Util, $state,logout){
	$scope.cancel = function () {
		logout();
	    $uibModalInstance.dismiss('cancel');
	};
	$scope.ok = function() {
		logout();
		$uibModalInstance.dismiss('cancel');
	}
}])
;app.directive('phonenumberDirective', ['$filter', function($filter) {
	function link(scope, element, attributes) {
		scope.inputValue = scope.phonenumberModel;
		scope.$watch('inputValue', function(value, oldValue) {
			value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
		scope.$watch('phonenumberModel', function(value, oldValue) {
    value = String(value);
			var number = value.replace(/[^0-9]+/g, '');
			scope.phonenumberModel = number;
			scope.inputValue = $filter('phonenumber')(number);
		});
	}
	return {
		link: link,
		restrict: 'E',
		scope: {
			phonenumberPlaceholder: '=placeholder',
			phonenumberModel: '=model',
    		class: '=customclass',
		},
		template: '<input ng-model="inputValue" name="phone" type="tel" class="{{class}}" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)">',
	};
}]);
app.directive("starRating",function(){
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?',
        currentRating:'='
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.currentRating = index + 1;
          }
        };
        scope.$watch('currentRating', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
});
app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      scope: {
         fileread: "=",
         filename: "=",
      },
      link: function(scope, element, attrs) {
         element.bind('change', function(){
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
               scope.$apply(function(){
                  scope.fileread = e.target.result;
                  scope.filename = element[0].files[0].name;
               });
            };
            fileReader.readAsDataURL(element[0].files[0]);
         });
      }
   };
}]);;app.filter('getShortName', function () {
    return function (value) {
      if(value){
        var temp = angular.copy(value);
        temp = temp.split(" ");
        temp = temp[0].charAt(0)+temp[temp.length-1].charAt(0);
        return temp.toUpperCase();
      }
    };
});
app.filter('dateformat', function(){
  return function(date){
    if(date){
      return moment(date).format("MM/DD/YYYY");
    }
  }
})
app.filter('yearMonth', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY MMM");
    }
  }
})
app.filter('dateYear', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY");
    }
  }
})
app.filter('dateformat1', function(){
  return function(date){
    if(date){
      return moment(date).format("DD-MM-YYYY");
    }
  }
})
app.filter('dateformat2', function(){
  return function(date){
    if(date){
      return moment(date).format("MMM DD, YYYY");
    }
  }
})
app.filter('dateformat3', function(){
  return function(date){
    if(date){
      return moment(date).format("MM-DD-YYYY");
    }
  }
})
app.filter('dateformat4', function(){
  return function(date){
    if(date){
      return moment(date).format("YYYY/MMM");
    }
  }
})
app.filter('phonenumber', function() {
  return function (number) {
    if (!number) { return ''; }
    number = String(number);
    var formattedNumber = number;
    var c = (number[0] == '1') ? '1 ' : '';
    number = number[0] == '1' ? number.slice(1) : number;
    var area = number.substring(0,3);
    var front = number.substring(3, 6);
    var end = number.substring(6, 10);
    if (front) {
      formattedNumber = (c + "(" + area + ") " + front);
    }
    if (end) {
      formattedNumber += ("-" + end);
    }
    return formattedNumber;
  };
});;app.factory("DoctorModel", function(){
	var compareArr = [];
	var doctorProfile = {};
	return {
		setCompareArr : function(array){
			compareArr = array;
		},
		getCompareArr : function(array){
			return compareArr;
		},
		setDoctorProfile : function(obj){
			doctorProfile = obj;
		},
		getDoctorProfile : function(){
			return doctorProfile;
		}
	}
});app.factory("AuthorizeService", ["$http", "CONFIG", "$q", "HEALTH_ADVISER", "$interval", "$timeout", "$state", "HealthAuth", "$rootScope", function($http,CONFIG,$q,HEALTH_ADVISER,$interval,$timeout,$state,HealthAuth,$rootScope){
	var timer;
	var checkTokenTime = function(){
		if(HealthAuth['currentUserId']){
			var scheduleTime = moment(HealthAuth['expireTime']).local().format()
    		var now = moment().local().format();
    		if(moment(scheduleTime).diff(now) < 0 ){
	          logout().then(function(response){
							$rootScope.$emit('login-success');
	          	$state.go('login');
	          },function(error){
							$rootScope.$emit('login-success');
	          	$state.go('login');
	          })
	        }
	        else{
	          var ms = moment(scheduleTime).diff(now);
	          timer = $timeout(function() {
	          	$rootScope.$emit('SESSION_EXPIRED');
	          }, ms);
	        }
		}
	};
	var validateUserName = function(obj){
		var response = $http({
	        method: 'POST',
	        url: CONFIG.API_PATH+'_UserSignupCheckEmail',
	        data : obj,
	        headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
	    });
	    return response;
	};
	var register = function(obj){
		var response = $http({
	        method: 'POST',
	        url: CONFIG.API_PATH+'_UserSignup',
	        data : obj,
	        headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
	    });
	    return response;
	};
	var login = function( obj ){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: CONFIG.API_PATH+'_Login',
            data : obj,
            headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
        }).then(function successCallback(response) {
        	var diff = (moment(response.data.Data.expiryDate).diff(response.data.Data.generateDate))-120000;
            HEALTH_ADVISER.ACCESS_TOKEN_EXPIRES_IN = diff;
            response.data.Data.expires_in = diff;
            HealthAuth.setUser(response , obj);
    		HealthAuth.save();
            timer = $timeout(function() {
	          	$rootScope.$emit('SESSION_EXPIRED');
	         }, diff);
            deferred.resolve(response);
        }, function errorCallback(errorResponse) {
            deferred.reject(errorResponse);
        });
        return deferred.promise;
    };
	var forgotPassword = function(email){
      var obj = {
        "email": email
      }
      var response = $http({
          method: 'POST',
          url: CONFIG.API_PATH+'_ForgotPassword',
          data : obj,
          headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
      })
      return response;
    };
	
	var changePassword = function(user){
      var obj = {
        "newPwd" : user.password,
        "oldPwd" : user.oldPwd
      }
      var response = $http({
          method: 'POST',
          url: CONFIG.API_PATH+'_ChangePassword',
          data: obj,
          headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
      })
      return response;
    };
	
    var logout  = function(){
    	var deferred = $q.defer();
        $http({
            method: 'POST',
            url: CONFIG.API_PATH+'_Logout',
            headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
        }).then(function successCallback(response) {
        	clearCredentials();
            deferred.resolve(response);
        }, function errorCallback(errorResponse) {
        	clearCredentials();
            deferred.reject(errorResponse);
        });
        return deferred.promise;
    };

    function clearCredentials() {
    	clearTimeout(timer);
        HealthAuth.clearUser();
        HealthAuth.clearStorage();
    }
    return{
    	checkTokenTime 		: checkTokenTime,
    	validateUserName	: validateUserName,
    	register			: register,
    	login 				: login,
    	logout				: logout,
		forgotPassword		: forgotPassword,
		changePassword		: changePassword
	};
}])
app.factory("HealthAuth",["HEALTH_ADVISER", function(HEALTH_ADVISER){
	var props = ['accessToken','currentUserData','expireTime','expiresIn','currentUserId'];
    var propsPrefix = '$HealthAdviser$';
	function HealthAuth() {
        var self = this;
        props.forEach(function (name) {
            self[name] = load(name);
        });
        HEALTH_ADVISER.ACCESS_TOKEN_EXPIRES_IN = this.expiresIn;
        this.currentUserData = this.currentUserData || null;
    }
    HealthAuth.prototype.save = function () {
        var self = this;
        var storage = localStorage ;
        props.forEach(function (name) {
            save(storage, name, self[name]);
        });
    };
    HealthAuth.prototype.setUser = function (response , userInfo) {
        var authData = response.data.Data;
        this.accessToken = authData.tokenUId;
        this.expiresIn = authData.expires_in;
        this.currentUserId = userInfo.userId;
        this.currentUserData = authData;
        this.expireTime = moment().add(HEALTH_ADVISER.ACCESS_TOKEN_EXPIRES_IN, 'ms');
    };
    HealthAuth.prototype.clearUser = function () {
      	this.accessToken = null;
        this.expiresIn = null;
        this.currentUserId = null;
        this.currentUserData = null;
        this.expireTime = null;
    };
    HealthAuth.prototype.clearStorage = function () {
       	props.forEach(function (name) {
            save(sessionStorage, name, null);
            save(localStorage, name, null);
        });
    };
    function load(name) {
        var key = propsPrefix + name;
        return localStorage[key] || sessionStorage[key] || null;
    }
    function save(storage, name, value) {
        var key = propsPrefix + name;
        if (value == null) value = '';
        storage[key] = value;
    }
    return new HealthAuth();
}])
;app.factory("CommonService", ["$http", "$q", "CONFIG", "HealthAuth", function ($http,$q,CONFIG,HealthAuth) {
  var reviewDetails = {};
  return{
    fetchLocation: function(params) {
      var response = $http.get(params);
      return response;
    },
    sendEnquiry : function(obj){
      var response = $http({
          method: 'POST',
          url: CONFIG.API_PATH+'_ContactUs',
          data : obj,
          headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
      });
      return response;
    },
    specialization : function(){
      var response = $http({
          method: 'GET',
          url: CONFIG.API_PATH+'_ENUM_Specialization',
          headers: {'Server': CONFIG.SERVER_PATH}
      });
      return response;
    },
    specializationDetails : function(name){
      var response = $http({
          method: 'GET',
          url: CONFIG.API_PATH+'_ENUM_Specialization?descRequired=true&specializationName='+name,
          headers: {'Server': CONFIG.SERVER_PATH}
      });
      return response;
    },
    languages : function(){
      var response = $http({
          method: 'GET',
          url: CONFIG.API_PATH+'_ENUM_Language',
          headers: {'Server': CONFIG.SERVER_PATH}
      });
      return response;
    },
    userDetails : function(){
      var response = $http({
          method: 'GET',
          url: CONFIG.API_PATH+'_UserData',
          headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
      });
      return response;
    },
    setReviewDetails : function(obj){
      reviewDetails = obj;
    },
    getReviewDetails : function(){
      return reviewDetails;
    },
    reviewDoctor : function(obj){
      var response = $http({
          method: 'POST',
          url: CONFIG.API_PATH+'_Profile_Review',
          data: obj,
          headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
      });
      return response;
    },
  }
}]);
app.factory('Util', ["$rootScope", "$timeout", function( $rootScope, $timeout){
    var Util = {};
    $rootScope.alerts = [];
    Util.alertMessage = function(msgType, message){
        var alert = { type:msgType , msg: message };
        $rootScope.alerts.push( alert );
        $timeout(function(){
            $rootScope.alerts.splice($rootScope.alerts.indexOf(alert), 1);
        }, 5000);
    };
    return Util;
}]);
;app.factory('DoctorDetailsService',["$http", "HealthAuth", "CONFIG", function($http,HealthAuth,CONFIG){
	return{
		doctorDetails : function(){
		    var response = $http({
		        method: 'GET',
		        url: CONFIG.API_PATH+'_UserData',
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
		    });
		    return response;		
		},
		doctorEducation : function(){
		    var response = $http({
		        method: 'GET',
		        url: CONFIG.API_PATH+'_Profile_Education?type=GET_EDUCATION',
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken}
		    })
		    return response;
		},
		updatePersonalProfile : function(dataDetails){
		    var response = $http({
		        method: 'PUT',
		        url: CONFIG.API_PATH+'_User',
		        data: dataDetails,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;		
		},
		updateWorkExperience : function(dataDetails){
			var response = $http({
		        method: 'PUT',
		        url: CONFIG.API_PATH+'_Profile_Experience',
		        data: dataDetails,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		addWorkExperience : function(dataDetails){
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Experience',
		        data: dataDetails,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteWorkExperience : function(obj){
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Experience',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		saveAwards : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Awards',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteAwards : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Awards',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updateAwards : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_Awards',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		saveEducation : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Education',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteEducation : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Education',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updateEducation : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_Education',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		saveLicense : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_License',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteLicense : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_License',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updateLicense : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_License',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		}
	}
}]);app.factory("DoctorService",["$http", "CONFIG", function($http,CONFIG){
	var searchData = {};
  	var lawerList = {totalRecords : 0};
	return{
		setDoctorLisitng : function(obj){
			lawerList = obj;
		},
		getDoctorLisitng : function(){
			return lawerList;
		},
		setSearchData : function(obj){
			searchData = obj;
		},
		getSearchData : function(){
			return searchData;
		},
		fetchDoctor : function(obj){
		    var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_PublicDoctorSearch',
		        data : obj,
		        headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
		    });
		    return response;		
		},
		countryDetails : function(value){
		     var response = $http({
				method: 'GET',
				url: CONFIG.API_PATH+'/_CountryCityState/'+value,
				headers: {'Content-Type':'application/json','Server': CONFIG.SERVER_PATH}
			})
			return response;		
		},
		doctorDetails : function(profileName){
		    var response = $http({
		        method: 'GET',
		        url: CONFIG.API_PATH+'_User/'+profileName,
		        headers: {'Server': CONFIG.SERVER_PATH}
		    });
		    return response;		
		}
	}
}])