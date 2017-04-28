app.factory("AuthorizeService", function($http,CONFIG,$q,HEALTH_ADVISER,$interval,$timeout,$state,HealthAuth,$rootScope){
	var timer;
	var checkTokenTime = function(){
		if(HealthAuth['currentUserId']){
			var scheduleTime = moment(HealthAuth['expireTime']).local().format()
    		var now = moment().local().format();
    		console.log(moment(scheduleTime).diff(now));
    		if(moment(scheduleTime).diff(now) < 0 ){
	          logout().then(function(response){
	          	$state.go('login');
	          },function(error){
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
    	logout				: logout
	};
})
app.factory("HealthAuth",function(HEALTH_ADVISER){
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
})