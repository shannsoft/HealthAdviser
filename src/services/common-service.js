app.factory("CommonService", function ($http,$q,CONFIG,HealthAuth) {
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
});
app.factory('Util', function( $rootScope, $timeout){
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
});
