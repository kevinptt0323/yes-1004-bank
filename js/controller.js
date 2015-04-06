'use strict';

/* Controllers */

angular.module('database-homework', [
  'ngRoute'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
}])

.controller('PageCtrl', ['$scope', function($scope) {
  $scope.currentPage = {
    name: 'Index xd'
  },
  $scope.thispage = {
    title: 'title1'
  },
  $scope.navigates = [
    { name: 'test1', href: '#!/test1.html' },
    { name: 'test2', href: '#!/test2.html' },
    { name: 'test3', href: '#!/test3.html' }
  ]
}]);
