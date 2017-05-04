app.factory('DoctorDetailsService',function($http,HealthAuth,CONFIG){
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
		    });
		    return response;		
		}
	}
})