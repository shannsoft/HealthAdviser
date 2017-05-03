app.controller('UserProfileController', function($scope, $rootScope, $state, CommonService){
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
    $scope.loadLanguages = function(){
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
})