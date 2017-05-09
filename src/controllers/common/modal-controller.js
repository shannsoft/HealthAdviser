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
