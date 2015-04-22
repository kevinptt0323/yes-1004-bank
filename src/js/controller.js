'use strict';

/* Controllers */

var ctrl = angular.module('database.homework.controller', [
  'database.homework.view',
]);
ctrl.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});

ctrl.controller('pageCtrl', ['$scope', '$sce', '$location', '$http', 'pageView', function($scope, $sce, $location, $http, pageView) {
  var loadStatus = function(config) {
    $scope.status = {};
    $http({ url: 'api/status.php' })
      .success(config.onSuccess || angular.noop)
      .error(config.onError || angular.noop);
  };
  $scope.$on('$viewContentLoaded', function(a) {
    if( a.targetScope.viewer ) {
      a.targetScope.viewer.init();
    }
  });
  $scope.$on('ngRepeatFinished', pageView.init);
  $scope.$on('$routeChangeSuccess', function (ev, current) {
    $scope.currentPage.name = current.name || 'Index';
  });
  $scope.$on('$routeChangeError', function (ev, current, previous, rejection) {
    $location.path('/error').replace();
  });
  $scope.$on('redirectToIndex', function() {
    $location.path('/').replace();
  });
  $scope.$on('loginStatusChange', function(event) {
    loadStatus({
      onSuccess: function(data) {
        if( angular.isString(data) ) {
          $scope.status.isLogin = false;
        } else {
          $scope.status = data;
        }
        if( $scope.status.isLogin ) {
          $scope.navigates = [
            { name: $sce.trustAsHtml('<i>Hello, ' + $scope.status.user.name + '</i>!')},
            { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
            { name: 'Logout', href: '#!/logout', icon: 'sign out' }
          ];
        } else {
          $scope.navigates = [
            { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
            { name: 'Sign Up',
              icon: 'add user',
              menu: [
                { name: 'Job Seeker', href: '#!/register/jobseeker' },
                { name: 'Employer', href: '#!/register/employer' }
              ]
            },
            { name: 'Login', href: '#!/login', icon: 'sign in' }
          ];
        }
      }
    });
  });
  $scope.currentPage = { name: 'Index' };
  $scope.config = { title: 'Yes, 1004 銀行' };
  (function() {
    var ret = {};
    $http({ url: 'api/options.php' })
      .success(function(data) {
        $scope.options = data;
      });
  }());
  $scope.$emit('loginStatusChange');
}])

.controller('jobsShowListCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
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
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
}])

.controller('jobsShowCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.job = { id: $routeParams.id, name: 'job ??' };
}])

.controller('registerJobseekerCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
}])

.controller('registerEmployerCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
}])

.controller('loginCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
}])

.controller('logoutCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.logout = function() {
    $http({
      method  : 'POST',
      url     : 'api/logout.php',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .success(function(data) {
        $scope.$emit('loginStatusChange');
        $scope.$emit('redirectToIndex');
      })
      .error(function() {
      });
  };
  $scope.logout();
}])
;
