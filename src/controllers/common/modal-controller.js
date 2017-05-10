app.controller('deleteWorkExperienceModalCtrl', function ($scope, $uibModalInstance,deleteWorkExperience,workExpId) {
  $scope.ok = function () {
    deleteWorkExperience(workExpId);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
app.controller('awardDetailsModalCtrl', function ($scope, $uibModalInstance,deleteAwardsDetails,awardId) {
    $scope.ok = function () {
        deleteAwardsDetails(awardId);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('educationModalCtrl', function ($scope, $uibModalInstance,deleteEducation,eduid) {
    $scope.ok = function () {
        deleteEducation(eduid);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('LicenseModalCtrl', function ($scope, $uibModalInstance,deleteLicense,lid) {
    $scope.ok = function () {
        deleteLicense(lid);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
});
