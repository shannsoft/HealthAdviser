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
app.controller('AssociationModalCtrl', function ($scope, $uibModalInstance,deleteAssociation,assoID) {
    $scope.ok = function () {
        deleteAssociation(assoID);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('ConferenceModalCtrl', function ($scope, $uibModalInstance,deleteConference,confeID) {
    $scope.ok = function () {
        deleteConference(confeID);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('PublicationModalCtrl', function ($scope, $uibModalInstance,deletePublication,publicId) {
    $scope.ok = function () {
        deletePublication(publicId);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('TimingModalCtrl', function ($scope, $uibModalInstance,deleteTiming,timeId) {
    $scope.ok = function () {
        deleteTiming(timeId);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
