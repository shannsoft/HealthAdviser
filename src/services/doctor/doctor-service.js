app.factory("DoctorService",function($http,CONFIG){
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
		},
		claimSearch : function(obj){
		    var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_PublicDoctorClaimSearch',
				data:obj,
		        headers: {'Server': CONFIG.SERVER_PATH}
		    });
		    return response;
		},
		applyToken : function(obj){
		    var response = $http({
		        method: 'POST',
		        url: CONFIG.API_PATH+'_PublicClaim',
						data:obj,
		        headers: {'Server': CONFIG.SERVER_PATH}
		    });
		    return response;
		},
		setNewPassword : function(obj){
				var response = $http({
		        method: 'PUT',
		        url: CONFIG.API_PATH+'_PublicClaim',
						data:obj,
		        headers: {'Server': CONFIG.SERVER_PATH}
		    });
		    return response;
		}
	}
})
