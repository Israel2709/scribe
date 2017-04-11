'use strict';

/**
 * @ngdoc overview
 * @name scribeApp
 * @description
 * # scribeApp
 *
 * Main module of the application.
 */
angular
  .module('scribeApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'backand'
  ])
  .config(function ($routeProvider,BackandProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/uploadform', {
        templateUrl: 'views/uploadform.html',
        controller: 'UploadformCtrl',
        controllerAs: 'uploadForm'
      })
      .when('/swipe', {
        templateUrl: 'views/swipe.html',
        controller: 'SwipeCtrl',
        controllerAs: 'swipe'
      })
      .otherwise({
        redirectTo: '/'
      });
      BackandProvider.setAppName('scribev2');
      BackandProvider.setSignUpToken('c810661b-2ae2-4dbb-ac5f-e3f44dc9358c');
      BackandProvider.setAnonymousToken('85287cc5-3404-4318-97e7-0571e2c805e8');
    $locationProvider.hashPrefix('')

    
  });
