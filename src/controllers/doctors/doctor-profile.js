app.controller("DoctorProfileController",function($scope, $rootScope,CommonService,$timeout,DoctorDetailsService,Util,$filter, $uibModal){
		google = typeof google === 'undefined' ? "" : google;
  	var googleTime;
	  $scope.signupCollapse = {
        aboutme: false,
        workExperiance: true,
        education: true,
        license: true,
        awards: true,
        associations: true,
        publications: true,
        conference: true
    };
		$scope.specialize = {};
    /****************************************************************************/
    /***********************fUNCTION USE FOR COLLAPSEMENU************************/
  	/****************************************************************************/
    $scope.collapseSignUp = function (filter) {
        angular.forEach($scope.signupCollapse, function(value, key) {
            if(key == filter){
                $scope.signupCollapse[key] = !$scope.signupCollapse[key];
            } else {
                $scope.signupCollapse[key] = true;
            }
        });
    };
    /****************************************************************************/
    /***********************fUNCTION USE FOR CHANGE TAB**************************/
  	/****************************************************************************/
    $scope.showtab = function(obj) {
        $("div[id^='div_']").each(function (i, el) {
            $(el).removeClass("in active");
        });
        $("div[id=div_" + obj +"]").addClass("in active");
        $( "ul[id='myTabs']").children().each(function (i, el) {
            $(el).removeClass("active");
            $("li[id="+el.id+"]").children().each(function(i,ay) {
                if(ay.id == obj) {
                    $(el).addClass("active");
                }
            })
        });
    }
    /****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE PROFILE DETAILS*********************/
  	/****************************************************************************/
  	$scope.loadProfileDetails = function(){
  		$rootScope.showPreloader = true;
  		CommonService.userDetails().then(function(response){
  			$rootScope.showPreloader = false;
  			if(response.data.StatusCode == 200)
  				$scope.profileDetails = response.data.Data.result;
					$scope.specialize.languageTags = [];
          angular.forEach($scope.profileDetails.profile.language,function(item){
            $scope.specialize.languageTags.push(item.language);
          })
  				$scope.initMapLocation();
  		},function(error){
  			$rootScope.showPreloader = false;
  		})
  	}
    $scope.changeOnPreffered = function(index) {
      angular.forEach($scope.profileDetails.phone, function(contact,key) {
        if (key !== index) {
          contact.isPreffered = false;
        }
      });
    }
    /****************************************************************************/
    /*************FUNCTION USE FOR LOAD THE Specialization list******************/
  	/****************************************************************************/
  	$scope.loadSpecialization = function(){
			CommonService.specialization().then(function(response){
				if(response.data.StatusCode == 200){
					$scope.specializationList = [];
					angular.forEach(response.data.Data, function(item){
						$scope.specializationList.push(item.name);
					});
				}
			},function(errot){
			})
  	}
    /****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE LANGUAGE LIST***********************/
  	/****************************************************************************/
  	$scope.loadLanguagesList = function(){
			CommonService.languages().then(function(response){
				if(response.data.StatusCode == 200){
					$scope.languages = [];
					angular.forEach(response.data.Data,function(item){
						$scope.languages.push(item.name);
					});
				}
			},function(error){
			})
  	}
    /****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE LANGUAGE LIST***********************/
  	/****************************************************************************/
  	$scope.updateSpecialization = function(){
			var obj = {};
			obj.specializationOn = $scope.doctor.specialization;
			obj.yearsOfExperience = $scope.doctor.year;
			$scope.profileDetails.specialization.push(obj);
			$scope.doctor = {};
  	}
    /****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE LANGUAGE LIST***********************/
  	/****************************************************************************/
  	$scope.clearSpecializationOn = function(index){
			$scope.profileDetails.specialization.splice(index,1);
  	}
  	/****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE GOOGLE MAPADDRESS*******************/
  	/****************************************************************************/
  	var options = {
        componentRestrictions: {country: "IN"}
    };
  	$scope.initMapLocation = function(){
  		if(google == "" || !google.maps || !google.maps.places)
        	googleTime = $timeout($scope.initMapLocation , 3000);
	    else {
	      	clearTimeout(googleTime);
			var inputFrom = document.getElementById('street');
			var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
			google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
			    populateAddressFields(autocompleteFrom.getPlace());
			    $scope.$apply();
			});
		}
  	};
  	function populateAddressFields(place) {
		var address_components = place.address_components;
		$scope.profileDetails.address.streetAddress = place.name;
		$scope.profileDetails.address.formatted = place.formatted_address;
        if (place.geometry) {
          $scope.profileDetails.address.lat = place.geometry.location.lat();
          $scope.profileDetails.address.lng = place.geometry.location.lng();
        }
        for(var i = 0; i < address_components.length; i++) {
            var types = address_components[i].types;
            if(types[0] == 'postal_code') {
                $scope.profileDetails.address.postalCode = address_components[i].long_name;
            } else if (types[0] == 'administrative_area_level_1' ) {
                $scope.profileDetails.address.state = address_components[i].long_name;
            } else if(types[0] == 'locality') {
                $scope.profileDetails.address.city = address_components[i].long_name;
            } else if(types[0] == 'country') {
                $scope.profileDetails.address.country = address_components[i].long_name;
            }
        }
	}

  /****************************************************************************/
  /**************************Read the image file*******************************/
  /****************************************************************************/
  function readAddImage(input) {
    if (input.files && input.files[0]) {
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        $scope.imageSrc = e.target.result;
        $scope.imagename= input.files[0].name;
        $scope.is_crop_image = true;
        $scope.$apply();
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }
  $("#addImg").change(function() {
      readAddImage(this);
  });
  /****************************************************************************/
  /**************************loads the croped image****************************/
  /****************************************************************************/
  $("#cropped_img").load(function() {
      $scope.is_crop_image = false;
      $scope.profile_image = $('#cropped_img').attr( "src");
      $scope.imageCropStep = 1;
      $scope.$apply();
  });
  $scope.clearimage = function(){
    $scope.profile_image = '';
  }
  $scope.addMobile = function(){
    $scope.profileDetails.phone.push($scope.mobile);
    $scope.mobile = {};
  }
  $scope.removeMobile = function(index){
    $scope.profileDetails.phone.splice(index,1);
  }
  /****************************************************************************/
  /******************************To update the basic info**********************/
  /****************************************************************************/
  $scope.updatePersonalProfile = function () {
    $rootScope.showPreloader = true;
    var personalDetails = {};
    personalDetails.profile = $scope.profileDetails.profile;
    personalDetails.address = $scope.profileDetails.address;
    personalDetails.phone = $scope.profileDetails.phone;
    personalDetails.consulation = $scope.profileDetails.consulation;
    if($scope.profile_image){
      personalDetails.fileData = {
        "fileName" : $scope.imagename,
        "inputStream" : $scope.profile_image.split(";base64,")[1]
      };
    }
    DoctorDetailsService.updatePersonalProfile(personalDetails).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        Util.alertMessage('success', 'your information successfully updated. Thank you.');
        $scope.$emit('login-success');
      }
      else{
        Util.alertMessage('danger', 'Somthing went wrong ! unable to update your information.');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
      Util.alertMessage('danger','Somthing went wrong ! unable to update your information.');
    });
  };
	$scope.updateSpecializationDetails = function () {
    $rootScope.showPreloader = true;
    var personalDetails = {};
    personalDetails.specialization = $scope.profileDetails.specialization;
    personalDetails.yearsOfExperience = $scope.profileDetails.yearsOfExperience;
		personalDetails.profile = {};
		personalDetails.profile.language = [];
		angular.forEach($scope.specialize.languageTags,function(item){
			var obj = {};
			obj.language = item.text;
			personalDetails.profile.language.push(obj);
		});
		console.log(personalDetails);
    DoctorDetailsService.updatePersonalProfile(personalDetails).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        Util.alertMessage('success', 'your information successfully updated. Thank you.');
      }
      else{
        Util.alertMessage('danger', 'Somthing went wrong ! unable to update your information.');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
      Util.alertMessage('danger','Somthing went wrong ! unable to update your information.');
    });
  };
  $scope.loadLanguages = function (query) {
      var result = $filter('filter')($scope.languages, query);
      return result;
  };
	/****************************************************************************/
  /************************FUNCTION SHOW EDIT FORM*****************************/
  /****************************************************************************/
  $scope.editWorkExperience = function (index,work) {
    $scope.tempwork = {};
    $scope.tempwork.id = work.id;
    $scope.tempwork.organizationName = work.organizationName;
    $scope.tempwork.description = work.description;
    $scope.tempwork.designation = work.designation;
    $scope.tempwork.dateTo = work.dateTo;
    $scope.tempwork.dateFrom = work.dateFrom;
    $scope.workEdit = index;
  };
  $scope.cancelWorkEdit = function () {
    delete $scope.workEdit;
  };
  $scope.updateWorkExpDoctor = function (work) {
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateWorkExperience($scope.tempwork).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        work.organizationName = $scope.tempwork.organizationName;
        work.description = $scope.tempwork.description;
        work.designation = $scope.tempwork.designation;
        work.dateTo = $scope.tempwork.dateTo;
        work.dateFrom = $scope.tempwork.dateFrom;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!');
      }
    }, function (errorResponse) {
        $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in update !!!');
    });
  };
  $scope.addWorkExpDoctor = function () {
    $rootScope.showPreloader = true;
    DoctorDetailsService.addWorkExperience($scope.workexperience).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.experience.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!');
      }
    }, function (errorResponse) {
        $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in update !!!');
    });
  };
  /****************************************************************************/
  /*****************FUNCTION IS USED TO OPEN DELETE MODAL**********************/
  /****************************************************************************/
  $scope.deleteWorkExperience = function (id) {
      var obj = {};
      obj.id = id;
      DoctorDetailsService.deleteWorkExperience(obj).then(function (response) {
        if(response.data.StatusCode == 200){
          $scope.profileDetails.experience.splice($scope.deleteIndex,1);
          Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
        }
        else{
          Util.alertMessage('danger', 'Error in Delete !!!');
        }
      }, function (errorResponse) {
          Util.alertMessage('danger', 'Error in Delete !!!');
      });
  };
  /****************************************************************************/
  /*****************FUNCTION IS USED TO OPEN DELETE MODAL**********************/
  /****************************************************************************/
  $scope.deleteWorkExperienceModal = function(size,workExpId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/workExpDeleteModal.html',
     controller: 'deleteWorkExperienceModalCtrl',
     size: size,
     resolve: {
       deleteWorkExperience: function () {
         return $scope.deleteWorkExperience;
       },
       workExpId:function () {
         return workExpId;
       }
     }
   });
  }

  /****************************************************************************/
  /************************FUNCTION HIDE EDIT FORM*****************************/
	/****************************************************************************/
	$scope.processForm = function() {
		$scope.showTheForm = false;
	}
	$scope.processForm1 = function() {
		$scope.showTheForm1 = false;
	}
  $scope.changeSelect = function(option,start,end){
      if(start && end){
        if(moment(start).isAfter(end)){
          if(option == 'start'){
            $scope.is_startError = true;
          }
          else if(option == 'end'){
            $scope.is_endError = true;
          }
          else if(option == 'e_start'){
            $scope.is_EstartError = true;
          }
          else if(option == 'e_end'){
            $scope.is_EendError = true;
          }
        }
        else{
          $scope.is_startError = false;
          $scope.is_EstartError = false;
          $scope.is_endError = false;
          $scope.is_EendError = false;
        }
      }
    }
})
