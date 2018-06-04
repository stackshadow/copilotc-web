angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/copilotd');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: true
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'copilot.copilotd',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider
  .state('copilot', {
    abstract: true,
    templateUrl: 'views/common/layouts/full.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Root',
      skip: true
    },
    resolve: {

        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load controllers
            return $ocLazyLoad.load({
                files: [
                    'js/controllers/wsConnectionStateCtrl.js',
                    'js/controllers/myNodeNameCtrl.js',
                ]
            });
        }],
        loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load CSS files
            return $ocLazyLoad.load([{
                serie: true,
                name: 'Flags',
                files: ['node_modules/flag-icon-css/css/flag-icon.min.css']
            },{
                serie: true,
                name: 'Font Awesome',
                files: ['node_modules/font-awesome/css/font-awesome.min.css']
            },{
                serie: true,
                name: 'Simple Line Icons',
                files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
            },{
                serie: true,
                name: 'Modal',
                files: ['src/css/modal-xl.css']
            }]);
        }],
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([{
          serie: true,
          name: 'chart.js',
          files: [
            'node_modules/chart.js/dist/Chart.min.js',
            'node_modules/angular-chart.js/dist/angular-chart.min.js'
          ]
        }]);
      }],
    }
  })
  .state('copilot.copilotd', {
    url: '/copilotd',
    templateUrl: 'views/pages/copilotd/copilotd.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'copilotd',
    },
    //page subtitle goes here
    params: { subtitle: 'Copilotd' },
    resolve: {
        
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load controllers
            return $ocLazyLoad.load({
                files: ['js/controllers/wsConnectionCtrl.js']
            });
        }],
        
        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
            // you can lazy load files for an existing module
            return $ocLazyLoad.load([
            {
                serie: true,
                name: 'chart.js',
                files: [
                    'node_modules/chart.js/dist/Chart.min.js',
                    'node_modules/angular-chart.js/dist/angular-chart.min.js'
                ]
            },
            ]);
        }],
        

        
        loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load CSS files
            return $ocLazyLoad.load([{
                serie: true,
                name: 'Font Awesome',
                files: ['node_modules/font-awesome/css/font-awesome.min.css']
            },{
                serie: true,
                name: 'Simple Line Icons',
                files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
            }]);
        }]
        
    }
    })
  .state('copilot.ldap', {
    url: '/copilotd/ldap',
    templateUrl: 'views/pages/ldap/ldap.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'LDAP',
    },
    //page subtitle goes here
    params: { subtitle: 'ldap' },
    resolve: {
        
        loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
            // you can lazy load files for an existing module
            return $ocLazyLoad.load([
            {
                serie: true,
                name: 'chart.js',
                files: [
                    'node_modules/chart.js/dist/Chart.min.js',
                    'node_modules/angular-chart.js/dist/angular-chart.min.js'
                ]
            },
            ]);
        }],
        
        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load controllers
            return $ocLazyLoad.load({
                files: ['js/controllers/ldapConnectionCtrl.js']
            });
        }],
        
        
        loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
            // you can lazy load CSS files
            return $ocLazyLoad.load([{
                serie: true,
                name: 'Font Awesome',
                files: ['node_modules/font-awesome/css/font-awesome.min.css']
            },{
                serie: true,
                name: 'Simple Line Icons',
                files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
            }]);
        }]
        
    }
    })

  // Additional Pages
  .state('appSimple.login', {
    url: '/login',
    templateUrl: 'views/pages/login.html'
  })
  .state('appSimple.register', {
    url: '/register',
    templateUrl: 'views/pages/register.html'
  })
  .state('appSimple.404', {
    url: '/404',
    templateUrl: 'views/pages/404.html'
  })
  .state('appSimple.500', {
    url: '/500',
    templateUrl: 'views/pages/500.html'
  })
}]);
