app.controller('deleteWorkExperienceModalCtrl', function ($scope, $uibModalInstance,deleteWorkExperience,workExpId) {
  $scope.ok = function () {
    deleteWorkExperience(workExpId);
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
