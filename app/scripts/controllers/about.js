'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('AboutCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
