'use strict';

/* App Module */

var app = angular.module('databaseHomeworkApp', [
  'databaseHomeworkController',
  'ngRoute'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enable: true,
    requireBase: false
  }).hashPrefix('!');
  $routeProvider
    .when('/', {
      redirectTo: '/jobs/list'
    })
    .when('/error', {
      template: 'Error! Page Not Found!'
    })
    .when('/login', {
      templateUrl: 'template/login.html'
    })
    .when('/signup/jobseeker', {
      templateUrl: 'template/signup_jobseeker.html'
    })
    .when('/signup/employer', {
      templateUrl: 'template/signup_employer.html'
    })
    .when('/jobs/add', {
      templateUrl: 'template/job_add.html'
    })
    .when('/jobs/list', {
      templateUrl: 'template/job_list.html',
      controller: 'jobsShowListCtrl'
    })
    .when('/jobs/:id', {
      templateUrl: 'template/job_show.html',
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
      templateUrl: 'template/jobseeker_list.html'
    })
    .when('/jobseeker/:id', {
      templateUrl: 'template/jobseeker_list.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

