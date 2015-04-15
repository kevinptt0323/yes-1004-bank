'use strict';

/* App Module */

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
      controller: 'jobsShowListCtrl'
    })
    .when('/error', {
      template: 'Error! Page Not Found!'
    })
    .when('/login', {
      templateUrl: 'template/login.html',
      controller: 'loginCtrl',
      viewer: 'loginView'
    })
    .when('/register/jobseeker', {
      templateUrl: 'template/registerJobseeker.html',
      controller: 'registerJobseekerCtrl',
      viewer: 'registerJobseekerView'
    })
    .when('/register/employer', {
      templateUrl: 'template/registerEmployer.html',
      controller: 'registerEmployerCtrl',
      viewer: 'registerEmployerView'
    })
    .when('/jobs/add', {
      templateUrl: 'template/jobsAdd.html'
    })
    .when('/jobs/list', {
      templateUrl: 'template/jobsList.html',
      controller: 'jobsShowListCtrl'
    })
    .when('/jobs/:id', {
      templateUrl: 'template/jobsShow.html',
      controller: 'jobsShowCtrl',
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
      templateUrl: 'template/jobseekerList.html'
    })
    .when('/jobseeker/:id', {
      templateUrl: 'template/jobseekerList.html'
    })
    .otherwise({
      redirectTo: '/error'
    });
}]);

