'use strict';

/* Controllers */

var angular = angular || {};

var ctrl = angular.module('database.homework.controller', [
  'database.homework.view',
]);
ctrl.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit(attr.onFinishRender);
        });
      }
    }
  };
});

ctrl.controller('pageCtrl', ['$scope', '$sce', '$location', '$http', 'pageView', function($scope, $sce, $location, $http, pageView) {
  var load = function(config) {
    $scope[config.name] = $scope[config.name] || {};
    $http({ url: config.url })
      .success(function(data) {
        if( data.success ) {
          $scope[config.name] = data.message;
          (config.onSuccess || angular.noop)(data);
        } else {
          (config.onError || angular.noop)(data);
        }
      })
      .error(config.onError || angular.noop);
  };
  $scope.$on('$viewContentLoaded', function(a) {
    if( a.targetScope.viewer && angular.isFunction(a.targetScope.viewer.init) ) {
      a.targetScope.viewer.init();
    }
  });
  $scope.$on('initDropdown', function() {
    $('.ui.dropdown').dropdown();
  });
  $scope.$on('initCheckbox', function() {
    $('.ui.checkbox').checkbox();
  });
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
    load({
      name: 'status',
      url: 'api/status.php',
      onSuccess: function(data) {
        if( $scope.status.isLogin ) {
          if( $scope.status.user.type === "employer" ) {
            $scope.navigates = [
              { name: $sce.trustAsHtml('<i>Hello, ' + $scope.status.user.name + '</i>!')},
              { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'List All Jobseekers', href: '#!/jobseeker/list', icon: 'users' },
              { name: 'Logout', href: '#!/logout', icon: 'sign out' }
            ];
          } else {
            $scope.navigates = [
              { name: $sce.trustAsHtml('<i>Hello, ' + $scope.status.user.name + '</i>!')},
              { name: 'List All Jobs', href: '#!/jobs/list', icon: 'list' },
              { name: 'Logout', href: '#!/logout', icon: 'sign out' }
            ];
          }
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
  $scope.$on('jobsListReload', function() {
    load({
      name: 'jobs',
      url: 'api/jobsList.php'
    });
  });
  $scope.$on('jobseekerListReload', function() {
    load({
      name: 'jobseekers',
      url: 'api/jobseekerList.php'
    });
  });
  $scope.currentPage = { name: 'Index' };
  $scope.config = { title: 'Yes, 1004 銀行' };
  load({
    name: 'options',
    url: 'api/options.php'
  });
  $scope.$emit('loginStatusChange');
}])

.controller('jobsShowListCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.occupation = function(id) {
    return $scope.options.occupation[id];
  };
  $scope.location = function(id) {
    return $scope.options.location[id];
  };
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
  $scope.$emit('jobsListReload');
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

.controller('jobseekerListCtrl', ['$scope', '$route', '$http', 'view', function($scope, $route, $http, view) {
  $scope.viewer = view[$route.current.viewer]({
    '$scope': $scope,
    '$http' : $http
  });
  $scope.$emit('jobseekerListReload');
}])
;
