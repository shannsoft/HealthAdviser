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
				console.log(obj);
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
		}
	}
})