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
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.hashPrefix('')
    BackandProvider.setAppName('scribe');
    BackandProvider.setSignUpToken('1a6494b3-0874-4ca7-81e4-abebda17f6d1');
    BackandProvider.setAnonymousToken('a3cacd9a-831f-4aa8-8872-7d80470a000e');
  });