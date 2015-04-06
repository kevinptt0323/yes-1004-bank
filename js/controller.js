'use strict';

/* Controllers */

var ctrl = angular.module('databaseHomeworkController', []);

ctrl.controller('pageCtrl', ['$scope', function($scope) {
  $scope.includePath = 'test1.html';
  $scope.loading = false;
  $scope.currentPage = {
    name: 'Index'
  };
  $scope.thispage = {
    title: 'title1'
  };
  $scope.navigates = [
    { name: 'test1', href: '#!/test/1' },
    { name: 'test2', href: '#!/test/2' },
    { name: 'test3', href: '#!/test/3' }
  ];
}])

.controller('mainCtrl', ['$scope', function($scope) {
}])

.controller('testCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.id = $routeParams.id
}]);
