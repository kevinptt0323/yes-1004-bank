'use strict';

/* App Module */

var app = angular.module('databaseHomeworkApp', [
  'databaseHomeworkController',
  'ngRoute'
])

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enable: true,
    requireBase: false
  }).hashPrefix('!');
  $routeProvider
    .when('/test/:id', {
      templateUrl: 'test.html',
      controller: 'testCtrl'
    })
    .otherwise({
      redirectTo: '/test/1'
    });
}]);

