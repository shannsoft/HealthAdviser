app.controller("DoctorProfileController",function($scope, $rootScope,CommonService,$timeout,DoctorDetailsService,Util,$filter, $uibModal,$sce){
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
  			if(response.data.StatusCode == 200){
  				$scope.profileDetails = response.data.Data.result;
					$scope.specialize.languageTags = [];
          angular.forEach($scope.profileDetails.profile.language,function(item){
            $scope.specialize.languageTags.push(item.language);
          })
          if($scope.profileDetails.socialLink && $scope.profileDetails.socialLink.YOUTUBE != null) {
            youtube_url = CommonService.converYoutube($scope.profileDetails.socialLink.YOUTUBE);
            $scope.youtubeURL = $sce.trustAsResourceUrl(youtube_url);
          }else {
            $scope.youtubeURL = null;
          }  
  				$scope.initMapLocation();
        }
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
    // $scope.tempwork.dateTo = work.dateTo;
    $scope.tempwork.dateTo = '2016-12-31T18:30:00.000Z';
    $scope.tempwork.dateFrom = work.dateFrom;
    $scope.workEdit = index;
  };
  $scope.cancelWorkEdit = function () {
    delete $scope.workEdit;
  };
  /****************************************************************************/
  /*********************FUNCTION USE TO UPDATE WORK EXP************************/
  /****************************************************************************/
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
  /****************************************************************************/
  /*********************FUNCTION USE TO ADD WORK EXP***************************/
  /****************************************************************************/
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
      $rootScope.showPreloader = true;
      DoctorDetailsService.deleteWorkExperience(obj).then(function (response) {
        $rootScope.showPreloader = false;
        if(response.data.StatusCode == 200){
          $scope.profileDetails.experience.splice($scope.deleteIndex,1);
          Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
        }
        else{
          Util.alertMessage('danger', 'Error in Delete !!!');
        }
      }, function (errorResponse) {
        $rootScope.showPreloader = false;
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
  /*****************FUNCTION IS USED TO SAVE AWARD SECTION*********************/
  /****************************************************************************/
  $scope.saveAwards = function(){
    var fileData = {
      "fileName": $scope.photo.imageName,
      "inputStream": $scope.photo.image.split(";base64,")[1]
    }
    $scope.awards.fileData = fileData;
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveAwards($scope.awards).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.award.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
      }
    },function(error){
      Util.alertMessage('danger', 'something went wrong! unable to add awards');
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN AWARD DELETE MODAL*******************/
  /****************************************************************************/
  $scope.deleteAwardsModal = function(size,awardId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/awardsDetailDeleteModal.html',
     controller: 'awardDetailsModalCtrl',
     size: size,
     resolve: {
       deleteAwardsDetails: function () {
         return $scope.deleteAwardsDetails;
       },
       awardId:function () {
         return awardId;
       }
     }
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN AWARD DELETE MODAL*******************/
  /****************************************************************************/
  $scope.deleteAwardsDetails = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteAwards(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.award.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /************************FUNCTION SHOW EDIT FORM*****************************/
  /****************************************************************************/
  $scope.editAwards = function (index,award) {
    $scope.tempaward = {};
    $scope.tempaward.id = award.id;
    $scope.tempaward.organizationName = award.organizationName;
    $scope.tempaward.description = award.description;
    $scope.tempaward.awardFor = award.awardFor;
    $scope.tempaward.awardDate = award.awardDate;
    $scope.tempaward.mainimage = award.awardDate.image
    $scope.awardEdit = index;
  };
  $scope.cancelAwardEdit = function () {
    delete $scope.awardEdit;
  };
  /****************************************************************************/
  /*********************FUNCTION USE TO UPDATE AWARDS *************************/
  /****************************************************************************/
  $scope.updateAwards = function (award) {
    $rootScope.showPreloader = true;
    if($scope.tempaward.imageName){
      var fileData = {
        "fileName": $scope.tempaward.imageName,
        "inputStream": $scope.tempaward.image.split(";base64,")[1]
      }
     $scope.tempaward.fileData = fileData;
    }
    DoctorDetailsService.updateAwards($scope.tempaward).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        award.organizationName = $scope.tempaward.organizationName;
        award.description = $scope.tempaward.description;
        award.awardFor = $scope.tempaward.awardFor;
        award.awardDate = $scope.tempaward.awardDate;
        award.image = response.data.Data.image;
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
  /****************************************************************************/
  /*********************FUNCTION USE TO ADD EDUCATION**************************/
  /****************************************************************************/
  $scope.saveEducation = function(){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveEducation($scope.education).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.education.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        $scope.education = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN EDUCATION DELETE MODAL***************/
  /****************************************************************************/
  $scope.deleteEducationModal = function(size,eduid,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/educationDeleteModal.html',
     controller: 'educationModalCtrl',
     size: size,
     resolve: {
       deleteEducation: function () {
         return $scope.deleteEducation;
       },
       eduid:function () {
         return eduid;
       }
     }
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN EDUCATION DELETE MODAL***************/
  /****************************************************************************/
  $scope.deleteEducation = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteEducation(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.education.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN EDUCATION EDIT SECTION***************/
  /****************************************************************************/
  $scope.editEducationOpen = function(index,education){
    $scope.eduEdit = index;
    $scope.tempEducation = {};
    $scope.tempEducation.id = education.id;
    $scope.tempEducation.educationType = education.educationType;
    $scope.tempEducation.year = education.year;
    $scope.tempEducation.university = education.university;
    $scope.tempEducation.major = education.major;
    $scope.tempEducation.score = education.score;
    $scope.tempEducation.description = education.description;
  }
  $scope.cancelEduEdit = function () {
    delete $scope.eduEdit;
  };
  $scope.checkScore = function (score){
	  if(score > 100){
		$scope.isScoreError = true;
	  }
	  else{
		$scope.isScoreError = false;  
	  }
  }
  $scope.updateEducation = function(edu){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateEducation($scope.tempEducation).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        var data = response.data.Data;
        edu.educationType = data.educationType;
        edu.year = data.year;
        edu.university = data.university;
        edu.major = data.major;
        edu.score = data.score;
        edu.description = data.description;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
       Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  /****************************************************************************/
  /**********************FUNCTION USE TO ADD License***************************/
  /****************************************************************************/
  $scope.saveLicense = function(obj){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveLicense($scope.license).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.license.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        $scope.education = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO OPEN LICENSE DELETE MODAL*****************/
  /****************************************************************************/
  $scope.deleteLicenseModal = function(size,lid,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/LicenseDetailDeleteModal.html',
     controller: 'LicenseModalCtrl',
     size: size,
     resolve: {
       deleteLicense: function () {
         return $scope.deleteLicense;
       },
       lid:function () {
         return lid;
       }
     }
    })
  }
  /****************************************************************************/
  /****************FUNCTION IS USED TO OPEN LICENSE DELETE MODAL***************/
  /****************************************************************************/
  $scope.deleteLicense = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteLicense(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.license.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /****************FUNCTION IS USED TO OPEN LICENSE EDIT SECTION***************/
  /****************************************************************************/
  $scope.editLicenseOpen = function(index,license){
    $scope.editLicense = index;
    $scope.tempLicense = {};
    $scope.tempLicense.id = license.id;
    $scope.tempLicense.licenseNumber = license.licenseNumber;
    $scope.tempLicense.issueDate = license.issueDate;
    $scope.tempLicense.expiryDate = license.expiryDate;
    $scope.tempLicense.organizationName = license.organizationName;
    $scope.tempLicense.description = license.description;
    console.log($scope.tempLicense);
  }
  $scope.cancelLicenseEdit = function () {
    delete $scope.editLicense;
  };
  /****************************************************************************/
  /**************FUNCTION IS USED TO UPDATE LICENSE EDIT SECTION***************/
  /****************************************************************************/
  $scope.updateLicense = function(license){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateLicense($scope.tempLicense).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        var data = response.data.Data;
        license.licenseNumber = data.licenseNumber;
        license.issueDate = data.issueDate;
        license.expiryDate = data.expiryDate;
        license.organizationName = data.organizationName;
        license.description = data.description;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
       Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  /****************************************************************************/
  /*********************FUNCTION USE TO ADD ASSOCIATION************************/
  /****************************************************************************/
  $scope.saveAssociation = function(){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveAssociation($scope.association).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.association.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        // $scope.association = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN ASSOCIATION DELETE MODAL***************/
  /****************************************************************************/
  $scope.deleteAssociationModal = function(size,assoID,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/AssociationDetDeleteModal.html',
     controller: 'AssociationModalCtrl',
     size: size,
     resolve: {
       deleteAssociation: function () {
         return $scope.deleteAssociation;
       },
       assoID:function () {
         return assoID;
       }
     }
    })
  }
  /****************************************************************************/
  /********************FUNCTION IS USED TO DELETE ASSOCIATION******************/
  /****************************************************************************/
  $scope.deleteAssociation = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteAssociation(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.association.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN ASSOCIATION EDIT SECTION***************/
  /****************************************************************************/
  $scope.editAssociationOpen = function(index,obj){
    $scope.editassociation = index;
    $scope.tempAssociation = {};
    $scope.tempAssociation.id = obj.id;
    $scope.tempAssociation.associationName = obj.associationName;
    $scope.tempAssociation.position = obj.position;
    $scope.tempAssociation.startDate = obj.startDate;
    $scope.tempAssociation.endDate = obj.endDate;
  }
  $scope.cancelAssociationEdit = function () {
    delete $scope.editassociation;
  };
  /****************************************************************************/
  /**************FUNCTION IS USED TO UPDATE LICENSE EDIT SECTION***************/
  /****************************************************************************/
  $scope.updateAssociation = function(association){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateAssociation($scope.tempAssociation).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        association.associationName = $scope.tempAssociation.associationName;
        association.position = $scope.tempAssociation.position;
        association.startDate = $scope.tempAssociation.startDate;
        association.endDate = $scope.tempAssociation.endDate;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  /****************************************************************************/
  /*********************FUNCTION USE TO ADD CONFERENCE*************************/
  /****************************************************************************/
  $scope.saveConference = function(){
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveConference($scope.conference).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.conference.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        // $scope.association = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN CONFERENCE DELETE MODAL****************/
  /****************************************************************************/
  $scope.deleteConferenceModal = function(size,confeID,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/ConferenceDetDeleteModal.html',
     controller: 'ConferenceModalCtrl',
     size: size,
     resolve: {
       deleteConference: function () {
         return $scope.deleteConference;
       },
       confeID:function () {
         return confeID;
       }
     }
    })
  }
  /****************************************************************************/
  /********************FUNCTION IS USED TO DELETE ASSOCIATION******************/
  /****************************************************************************/
  $scope.deleteConference = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteConference(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.conference.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN ASSOCIATION EDIT SECTION***************/
  /****************************************************************************/
  $scope.editConferenceOpen = function(index,obj){
    $scope.editConference = index;
    $scope.tempConference = {};
    $scope.tempConference.id = obj.id;
    $scope.tempConference.conferenceName = obj.conferenceName;
    $scope.tempConference.location = obj.location;
    $scope.tempConference.startDate = obj.startDate;
    $scope.tempConference.endDate = obj.endDate;
    $scope.tempConference.topic = obj.topic;
  }
  $scope.cancelConferenceEdit = function () {
    delete $scope.editConference;
  };
  /****************************************************************************/
  /**************FUNCTION IS USED TO UPDATE LICENSE EDIT SECTION***************/
  /****************************************************************************/
  $scope.updateConference = function(conference){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updateConference($scope.tempConference).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        conference.conferenceName = $scope.tempConference.conferenceName;
        conference.location = $scope.tempConference.location;
        conference.startDate = $scope.tempConference.startDate;
        conference.endDate = $scope.tempConference.endDate;
        conference.topic = $scope.tempConference.topic;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  /****************************************************************************/
  /*********************FUNCTION USE TO ADD PUBLICAION*************************/
  /****************************************************************************/
  $scope.savePublication = function(){
    $rootScope.showPreloader = true;
    $scope.publication.date = moment($scope.publication.date).format('YYYY-MM-DD');
    DoctorDetailsService.savePublication($scope.publication).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        $scope.profileDetails.publication.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully added your information Thank You.'); 
        // $scope.association = {};
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to add Education');  
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to add Education');
    })
  }
  /****************************************************************************/
  /********************FUNCTION IS USED TO DELETE PUBLICATION******************/
  /****************************************************************************/
  $scope.deletePublication = function(id){
    var obj = {};
    obj.id = id;
    $rootScope.showPreloader = true;
    DoctorDetailsService.deletePublication(obj).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.publication.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in Delete !!!');
      }
    }, function (errorResponse) {
      $rootScope.showPreloader = false;
        Util.alertMessage('danger', 'Error in Delete !!!');
    });
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN PUBLICATION DELETE MODAL***************/
  /****************************************************************************/
  $scope.deletePublicationModal = function(size,publicId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/PublicationDetDeleteModal.html',
     controller: 'PublicationModalCtrl',
     size: size,
     resolve: {
       deletePublication: function () {
         return $scope.deletePublication;
       },
       publicId:function () {
         return publicId;
       }
     }
    })
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN PUBLICATION EDIT SECTION***************/
  /****************************************************************************/
  $scope.editPublicationOpen = function(index,obj){
    $scope.editpublication = index;
    $scope.tempPublication = {};
    $scope.tempPublication.id = obj.id;
    $scope.tempPublication.publicationName = obj.publicationName;
    $scope.tempPublication.date = obj.date;
    $scope.tempPublication.description = obj.description;
  }
  $scope.cancelPublicationEdit = function () {
    delete $scope.editpublication;
  };
  /****************************************************************************/
  /**************FUNCTION IS USED TO UPDATE LICENSE EDIT SECTION***************/
  /****************************************************************************/
  $scope.updatePublication = function(publication){
    $rootScope.showPreloader = true;
    DoctorDetailsService.updatePublication($scope.tempPublication).then(function(response){
      $rootScope.showPreloader = false;
      if (response.data.StatusCode == 200) {
        publication.publicationName = $scope.tempPublication.publicationName;
        publication.date = $scope.tempPublication.date;
        publication.description = $scope.tempPublication.description;
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'Error in update !!!');
    })  
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO UPDATE TIMING INFORMATION*****************/
  /****************************************************************************/
  $scope.addTiming = function(){
    var obj = {
      'day' : $scope.timing.day,
      'from' : moment($scope.timing.from).format('HH:mm:ss'),
      'to' : moment($scope.timing.to).format('HH:mm:ss')
    }
    $rootScope.showPreloader = true;
    DoctorDetailsService.saveTiming(obj).then(function(response){
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.timing.push(response.data.Data);
        Util.alertMessage('success', 'You have successfully updated your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'Error in update !!!'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'Error in update !!!'); 
    })
  }
  /****************************************************************************/
  /************FUNCTION IS USED TO OPEN TIMING DELETE MODAL***************/
  /****************************************************************************/
  $scope.deleteTimingModal = function(size,timeId,index){
    $scope.deleteIndex = index;
    var modalInstance = $uibModal.open({
     animation: true,
     templateUrl: 'src/views/modals/timingDetDeleteModal.html',
     controller: 'TimingModalCtrl',
     size: size,
     resolve: {
       deleteTiming: function () {
         return $scope.deleteTiming;
       },
       timeId:function () {
         return timeId;
       }
     }
    })
  }
  /****************************************************************************/
  /**************FUNCTION IS USED TO DELETE TIMING INFORMATION*****************/
  /****************************************************************************/
  $scope.deleteTiming = function(id){
    var obj = {
      'id' : id
    }
    $rootScope.showPreloader = true;
    DoctorDetailsService.deleteTiming(obj).then(function(response){
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        $scope.profileDetails.timing.splice($scope.deleteIndex,1);
        Util.alertMessage('success', 'You have successfully Deleted your information Thank You.');
      }
      else{
        Util.alertMessage('danger', 'something went wrong! unable to delete your information'); 
      }
    },function(error){
      $rootScope.showPreloader = false;
      Util.alertMessage('danger', 'something went wrong! unable to delete your information');
    })
  }
  /****************************************************************************/
  /************************FUNCTION HIDE EDIT FORM*****************************/
  /****************************************************************************/
  $scope.updateWebsiteUrl = function(){
    var doctor = {};
    if ($scope.profileDetails.website.match('^http://') || $scope.profileDetails.website.match('^https://')){
      var wesite = $scope.profileDetails.website.split('://');
      doctor.website = wesite[1];
    }
    else{
      doctor.website = $scope.profileDetails.website
    }
    $rootScope.showPreloader = true;
    DoctorDetailsService.updatePersonalProfile(doctor).then(function (response) {
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
  }
  $scope.clearWebsiteUrl = function () {
    $scope.profileDetails.website = "";
    $scope.updateWebsiteUrl();
  };
  /****************************************************************************/
  /****************************To Change the socila media link*****************/
  /****************************************************************************/
  $scope.selectSocialMedia = function(socialmedia) {
      $scope.boxShow = true;
      $scope.socialmedia = {};
      $scope.updateWeblinkURL(socialmedia);
      $scope.platform = socialmedia;
  };
  $scope.updateWeblinkURL = function(platform) {
      var social;
      $scope.socialmedia.webLink = '';
      if($scope.profileDetails.socialLink) {
        social = $scope.profileDetails.socialLink;
      }
      else{
        social = $scope.profileDetails.socialLink = {};
      }
      switch(platform){
        case "fb":
          $scope.placeholder = "Your facebook link";
          if(social.FACEBOOK != null){
              $scope.socialmedia.webLink = social.FACEBOOK;
          }
          break;
        case "tw":
          $scope.placeholder = "Your twitter link";
          if(social.TWITTER != null){
              $scope.socialmedia.webLink = social.TWITTER;
          }
          break;
        case "gp":
          $scope.placeholder = "Your google plus link";
          if(social.GPLUS != null){
              $scope.socialmedia.webLink = social.GPLUS;
          }
          break;
        case "ln":
          $scope.placeholder = "Your linkedin link";
          if(social.LINKEDIN != null){
              $scope.socialmedia.webLink = social.LINKEDIN;
          }
          break;  
        case "yt":
          $scope.placeholder = "Your youtube link";
          if(social.YOUTUBE != null){
              $scope.socialmedia.webLink = social.YOUTUBE;
          }
          break;
        case "pi":
          $scope.placeholder = "Your Pinterest link";
          if(social.PINTEREST != null){
              $scope.socialmedia.webLink = social.PINTEREST;
          }
          break;
      }
    }  
  /****************************************************************************/
  /****************************To Update the social media link*****************/
  /****************************************************************************/
  $scope.updateSocialMediaURL = function(){
    if(!$scope.profileDetails.socialLink)
      $scope.profileDetails.socialLink = {};
    var doctor = {};
    switch($scope.platform){
      case "fb":
        $scope.profileDetails.socialLink.FACEBOOK = $scope.socialmedia.webLink;
        break;
      case "tw":
        $scope.profileDetails.socialLink.TWITTER = $scope.socialmedia.webLink;
        break;
      case "gp":
        $scope.profileDetails.socialLink.GPLUS = $scope.socialmedia.webLink;
        break;
      case "ln":
        $scope.profileDetails.socialLink.LINKEDIN = $scope.socialmedia.webLink;
        break;
      case "yt":
        $scope.profileDetails.socialLink.YOUTUBE = $scope.socialmedia.webLink;
        var is_youtube = true;
        break;
      case "pi":
        $scope.profileDetails.socialLink.PINTEREST = $scope.socialmedia.webLink;
        break;
    }
    doctor.socialLink = $scope.profileDetails.socialLink;
    $rootScope.showPreloader = true;
    DoctorDetailsService.updatePersonalProfile(doctor).then(function (response) {
      $rootScope.showPreloader = false;
      if(response.data.StatusCode == 200){
        if(is_youtube){
          if($scope.is_remove){
            $scope.youtubeURL = '';
          }
          else{
            var you_tube_url = CommonService.converYoutube($scope.socialmedia.webLink);
            $scope.youtubeURL = $sce.trustAsResourceUrl(you_tube_url);
          }
        }
        $scope.is_remove = false;
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
  /****************************************************************************/
  /****************************To delete the social media link*****************/
  /****************************************************************************/
  $scope.clearSocialMedia = function () {
    $scope.socialmedia.webLink = null;
    $scope.is_remove = true;
    $scope.updateSocialMediaURL();
  };
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
