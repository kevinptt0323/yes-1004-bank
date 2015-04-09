'use strict';

/* Controllers */

var ctrl = angular.module('databaseHomeworkController', []);

ctrl.controller('pageCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $location.path('/error').replace();
  });
  $scope.loading = false;
  $scope.currentPage = {
    name: 'Index'
  };
  $scope.thispage = {
    title: 'title1'
  };
  $scope.navigates = [
    { name: 'List All Jobs', href: '#!/jobs/list' },
    { name: 'Login', href: '#!/login' },
    { name: 'Sign Up', href: '#!/signup/jobseeker' },
    { name: 'test3', href: '#!/test/3' }
  ];
}])

.controller('mainCtrl', ['$scope', function($scope) {
}])

.controller('testCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.id = $routeParams.id
}]);
