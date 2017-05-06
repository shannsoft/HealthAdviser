var app = angular.module('health-advisor',['ui.router','ngAnimate','ImageCropper','ui.bootstrap','ui.utils','bw.paging','timeRelative','ngStorage','ngSanitize','ngTagsInput','autocomplete']);
app.config(function($stateProvider, $urlRouterProvider,$provide) {
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
  $provide.decorator('$state', function($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, state, params) {
      $delegate.next = state;
      $delegate.toParams = params;
    });
    return $delegate;
  });
});
app.run(function($http,$rootScope,$timeout,AuthorizeService){
  AuthorizeService.checkTokenTime();
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $rootScope.stateName = toState.name;
      window.scrollTo(0, 0);
    });
});
app.constant('CONFIG', {
  "API_PATH":"http://healthadvisor.ssmaktak.com/api/",
  "SERVER_PATH":1 
})
