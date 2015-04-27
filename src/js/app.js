'use strict';

/* App Module */

var angular = angular || {};

var app = angular.module('database.homework.app', [
  'database.homework.controller',
  'ngRoute'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enable: true,
    requireBase: false
  }).hashPrefix('!');
  $routeProvider
    .when('/', {
      templateUrl: 'template/jobsList.html',
      controller: 'jobsShowListCtrl',
      viewer: 'jobsShowListView',
      name: 'Index'
    })
    .when('/error', {
      template: '<h2>Oops! Page Not Found!</h2>',
      name: 'Error'
    })
    .when('/login', {
      templateUrl: 'template/login.html',
      controller: 'loginCtrl',
      viewer: 'loginView',
      name: 'Login'
    })
    .when('/logout', {
      template: '',
      controller: 'logoutCtrl'
    })
    .when('/register/jobseeker', {
      templateUrl: 'template/registerJobseeker.html',
      controller: 'registerJobseekerCtrl',
      viewer: 'registerJobseekerView',
      name: 'Register Jobseeker'
    })
    .when('/register/employer', {
      templateUrl: 'template/registerEmployer.html',
      controller: 'registerEmployerCtrl',
      viewer: 'registerEmployerView',
      name: 'Register Employer'
    })
    .when('/jobs/add', {
      templateUrl: 'template/jobsAdd.html'
    })
    .when('/jobs/list', {
      templateUrl: 'template/jobsList.html',
      controller: 'jobsShowListCtrl',
      viewer: 'jobsShowListView',
      name: 'Job List'
    })
    .when('/jobs/:id', {
      templateUrl: 'template/jobsShow.html',
      controller: 'jobsShowCtrl',
      name: 'Job List',
      resolve: {
        id: function($q, $route) {
          var deferred = $q.defer(),
              id = +$route.current.params.id;
          
          if( !isNaN(id) ) {
            deferred.resolve(id);
          } else {
            deferred.reject('Jobs Not Found.');
          }

          return deferred.promise;
        }
      }
    })
    .when('/jobseeker/list', {
      templateUrl: 'template/jobseekerList.html',
      controller: 'jobseekerListCtrl',
      name: 'Jobseeker List'
    })
    .when('/jobseeker/:id', {
      templateUrl: 'template/jobseekerList.html'
    })
    .otherwise({
      redirectTo: '/error'
    });
}]);

