app.factory("DoctorModel", function(){
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
})