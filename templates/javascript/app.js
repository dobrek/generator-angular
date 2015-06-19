'use strict';

/**
 * @ngdoc overview
 * @name <%= scriptAppName %>
 * @description
 * # <%= scriptAppName %>
 *
 * Main module of the application.
 */
angular
  .module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    // needle:route-generator
    .state('home', {
        url: '/',
        templateUrl: 'views/main.tpl.html',
        controller: '<%= mainCtrlName %>',
        controllerAs: 'main'
      });
  })<% } %>;
