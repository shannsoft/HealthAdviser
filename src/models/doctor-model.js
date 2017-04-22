app.factory("DoctorModel", function(){
	var compareArr = [];
	return {
		setCompareArr : function(array){
			compareArr = array;
		},
		getCompareArr : function(array){
			return compareArr;
		}
	}
})