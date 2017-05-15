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
		},
		saveAssociation : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Association',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteAssociation : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Association',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updateAssociation : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_Association',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		saveConference : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Conference',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteConference : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Conference',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updateConference : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_Conference',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		savePublication : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Publication',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deletePublication : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Publication',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		updatePublication : function (obj) {
			var response = $http({
			    method: 'PUT',
			    url: CONFIG.API_PATH+'_Profile_Publication',
			    data: obj,
			    headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		saveTiming : function (obj) {
			var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_Profile_Timing',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},
		deleteTiming : function (obj) {
			var response = $http({
		        method: 'DELETE',
		        url: CONFIG.API_PATH+'_Profile_Timing',
		        data: obj,
		        headers: {'Server': CONFIG.SERVER_PATH,'tokenId':HealthAuth.accessToken,'content-type':'application/json'}
		    });
		    return response;
		},

	}
})