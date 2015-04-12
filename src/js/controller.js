'use strict';

/* Controllers */

var ctrl = angular.module('databaseHomeworkController', [
  'databaseHomeworkView',
]);

ctrl.controller('pageCtrl', ['$scope', '$location', 'pageView', function($scope, $location, $view) {
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $location.path('/error').replace();
  });
  $view.init();
  $scope.loading = false;
  $scope.currentPage = {
    name: 'Index'
  };
  $scope.thispage = {
    title: 'Yes, 1004 銀行'
  };
  $scope.navigates = [
    { name: 'List All Jobs', href: '#!/jobs/list' },
    { name: 'Login', href: '#!/login' },
    { name: 'Sign Up',
      menu: [
        { name: 'Job Seeker', href: '#!/signup/jobseeker' },
        { name: 'Employer', href: '#!/signup/employer' }
      ]
    }
  ];
}])

.controller('mainCtrl', ['$scope', function($scope) {
}])

.controller('jobsShowListCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.href = function(job) {
    return '#!/jobs/' + job.id;
  };
  $scope.name = function(job) {
    return job.name;
  };
  $scope.jobs = [
    { id: 1,    name: 'job 1'   },
    { id: 2,    name: 'job 2'   },
    { id: 3,    name: 'job 3'   },
    { id: 7122, name: 'job 7122'}
  ];
}])

.controller('jobsShowCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.job = { id: $routeParams.id, name: 'job ??' };
}])

.controller('signupCtrl', ['$scope', 'signupView', function($scope, $view) {
  var $view = $view;
  $scope.$on('$viewContentLoaded', function(event) {
    $view.init();
  });
}])

;
