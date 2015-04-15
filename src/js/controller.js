'use strict';

/* Controllers */

var ctrl = angular.module('database.homework.controller', [
  'database.homework.view',
]);

ctrl.controller('pageCtrl', ['$scope', '$location', 'pageView', function($scope, $location, pageView) {
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $location.path('/error').replace();
  });
  pageView.init();
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
        { name: 'Job Seeker', href: '#!/register/jobseeker' },
        { name: 'Employer', href: '#!/register/employer' }
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

.controller('registerJobseekerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  $scope.viewer = view[$route.current.viewer];
  $scope.$on('$viewContentLoaded', $scope.viewer.init);
}])

.controller('registerEmployerCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {
  $scope.viewer = view[$route.current.viewer];
  $scope.$on('$viewContentLoaded', $scope.viewer.init);
}])

.controller('loginCtrl', ['$scope', '$route', 'view', function($scope, $route, view) {

  $scope.viewer = view[$route.current.viewer];
  $scope.$on('$viewContentLoaded', $scope.viewer.init);
}])
;
