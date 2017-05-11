app.controller('UserProfileController', function($scope, $rootScope, $state, CommonService,Util){
    google = typeof google === 'undefined' ? "" : google;
    var googleTime;
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
    /*****************fUNCTION USE FOR GET PROFILE DETAILS***********************/
    /****************************************************************************/
    $scope.profileDetails = function(){
        $rootScope.showPreloader = true;
        CommonService.userDetails().then(function(response){
            $rootScope.showPreloader = false;
            if(response.data.StatusCode == 200){
                $scope.profileDetails = response.data.Data.result;
                $scope.profileDetails.language = ($scope.profileDetails.profile.language.length > 0) ? $scope.profileDetails.profile.language[0].language : "";
                $scope.initMapLocation();
                if($scope.profileDetails.isDoctor){
                    $state.go('home');
                }
            }
        })
    }
    /****************************************************************************/
    /**************FUNCTION USE FOR LOAD THE LANGUAGE LIST***********************/
    /****************************************************************************/
    $scope.loadLanguagesList = function(){
        CommonService.languages().then(function(response){
            if(response.data.StatusCode == 200){
                $scope.languages = response.data.Data;
                // angular.forEach(response.data.Data,function(item){
                //     $scope.languages.push(item.name);
                // });
            }
        },function(error){

        })
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
        var obj = {};
            obj.language = $scope.profileDetails.language;
        personalDetails.profile.language[0] = obj;
        if($scope.profile_image){
          personalDetails.fileData = {
            "fileName" : $scope.imagename,
            "inputStream" : $scope.profile_image.split(";base64,")[1]
          };
        }
        CommonService.updatePersonalProfile(personalDetails).then(function (response) {
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
    $scope.getSettings = function(){
      CommonService.getSettings().then(function(response){
        if (response.data.StatusCode == 200) {
            $scope.settings = response.data.Data;
        }
      })  
    }
    $scope.updateSettings = function(){
        $rootScope.showPreloader = true;
        CommonService.updateSettings($scope.settings).then(function(response){
            $rootScope.showPreloader = false;
            if (response.data.StatusCode == 200) {
                Util.alertMessage('success', 'your information successfully updated. Thank you.');
            }
            else{
                Util.alertMessage('danger', 'Somthing went wrong ! unable to update your information.'); 
            }
        },function(error){
            $rootScope.showPreloader = false;
            Util.alertMessage('danger','Somthing went wrong ! unable to update your information.');
        })  
    }
})