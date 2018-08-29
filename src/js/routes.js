angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/copilotd/dashboard');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: true
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'copilot',
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
                        'js/controllers/wsConnectionCtrl.js',
                        'js/controllers/wsConnectionStateCtrl.js',
                        'js/controllers/myNodeNameCtrl.js'
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
            return $ocLazyLoad.load([
                {
                    serie: true,
                    name: 'chart.js',
                    files: [
                        'node_modules/chart.js/dist/Chart.min.js',
                        'node_modules/angular-chart.js/dist/angular-chart.min.js'
                    ]
                }
            ]);
            }],
        }
  })


    .state('copilot.dashboard', {
        url: '/copilotd/dashboard',
        //page title goes here
        ncyBreadcrumb: {
          label: 'dashboard',
        },
        //page subtitle goes here
        params: { subtitle: 'Copilotd' },

        resolve: {

            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load controllers
                return $ocLazyLoad.load({
                    files: [
                        'js/controllers/wsConnectionStateCtrl.js',
                        'js/controllers/myNodeNameCtrl.js',
                        'js/controllers/copilotdNodesCtrl.js',
                        'js/controllers/sslServiceCtrl.js'
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
            return $ocLazyLoad.load([
                {
                    serie: true,
                    name: 'chart.js',
                    files: [
                        'node_modules/chart.js/dist/Chart.min.js',
                        'node_modules/angular-chart.js/dist/angular-chart.min.js'
                    ]
                }
            ]);
            }],

        },

        views: {
            '':{
                templateUrl: 'views/pages/copilotd/copilotd.html',
            },
            'core@copilot.dashboard': {
                templateUrl: 'views/pages/copilotd/copilotdCore.html',
            },
            'nodes@copilot.dashboard': {
                templateUrl: 'views/pages/copilotd/copilotdNodes.html',
            }
        }


    })


    .state('copilot.keys', {
        url: '/copilotd/keys',
        //page title goes here
        ncyBreadcrumb: {
          label: 'keys',
        },
        //page subtitle goes here
        params: { subtitle: 'Copilotd - Key management' },

        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load controllers
                return $ocLazyLoad.load({
                    files: [
                        'js/controllers/copilotdKeysCtrl.js'
                    ]
                });
            }],
        },

        views: {
            '':{
                templateUrl: 'views/pages/copilotd/keys.html',
            }
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
                    name: 'ldap',
                    files: [
                        'views/pages/ldap/ldap.js'
                    ]
                },
                {
                    serie: true,
                    name: 'multiselect',
                    files: [ 'node_modules/isteven-angular-multiselect/isteven-multi-select.js' ],
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
                return $ocLazyLoad.load([
                {
                    serie: true,
                    name: 'Font Awesome',
                    files: ['node_modules/font-awesome/css/font-awesome.min.css']
                },
                {
                    serie: true,
                    name: 'multiselect',
                    files: ['node_modules/isteven-angular-multiselect/isteven-multi-select.css']
                }
                ]);
            }]
        }
    })

    .state('copilot.mdb', {
        url: '/copilotd/mdb',
        templateUrl: 'views/pages/mdb/mdb.html',
    //page title goes here
        ncyBreadcrumb: {
            label: 'MongoDB',
        },
    //page subtitle goes here
        params: { subtitle: 'mdb' },
        resolve: {

            loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                // you can lazy load files for an existing module
                return $ocLazyLoad.load([
                {
                    serie: true,
                    name: 'mdb',
                    files: [
                        'views/pages/mdb/mdb.js',
                    ]
                },
                {
                    serie: true,
                    name: 'ng-table',
                    files: [
                        'node_modules/ng-table/bundles/ng-table.min.js',
                    ]
                },
                ]);
            }],

            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load controllers
                return $ocLazyLoad.load({
                    files: ['js/controllers/mdbConnectionCtrl.js' ],
                });
            }],



            loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
                // you can lazy load CSS files
                return $ocLazyLoad.load([
                {
                    serie: true,
                    name: 'Font Awesome',
                    files: ['node_modules/font-awesome/css/font-awesome.min.css']
                },{
                    serie: true,
                    name: 'ng-table',
                    files: ['node_modules/ng-table/bundles/ng-table.min.css']
                }
                ]);
            }]
        }
    })





}]);
