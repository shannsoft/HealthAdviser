var app = angular.module('health-advisor',['ui.router','ngAnimate','ui.bootstrap','ui.utils','bw.paging','timeRelative','ngStorage']);
app.config(function($stateProvider, $urlRouterProvider) {
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
    url: '/login'
  })
  .state('register', {
    templateUrl: 'src/views/header/register.html',
    controller: "AuthenticationController",
    url: '/register'
  })
  .state('doctor-verify', {
    templateUrl: 'src/views/doctors/doctor-verified.html',
    controller: "AuthenticationController",
    url: '/doctor-verify'
  })
  .state('updateDoctorProfile', {
    templateUrl: 'src/views/doctors/doctor-profile.html',
    controller: "DoctorProfileController",
    url: '/updateDoctorProfile'
  })
  .state('updateUserProfile', {
    templateUrl: 'src/views/doctors/doctor-profile.html',
    controller: "DoctorProfileController",
    url: '/updateUserProfile'
  })
  .state('specialization', {
    templateUrl: 'src/views/common/specialization.html',
    url: '/specialization',
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
    controller: 'DoctorDetailsController'
  })
  .state('signedUser', {
    templateUrl: 'src/views/doctors/doctor-details.html',
    url: '/signedUser',
    controller: 'DoctorDetailsController'
  })
  .state('doctor-compare', {
    templateUrl: 'src/views/doctors/doctor-compare.html',
    url: '/doctor-compare',
    controller: 'DoctorsController'
  })
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
