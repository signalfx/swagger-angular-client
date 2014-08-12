'use strict';

var clientGenerator = require('../bower_components/swagger-client-generator/dist/swagger-client-generator.js');

/* global angular */
angular.module('swagger-client', [])
  .factory('swaggerClient', function($log, $http, $q){
    function requestHandler(error, request){
      if(error){
        $log.error(error);
        return $q.reject(error);
      }

      return $http({
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.body
      }).then(function(response){
        return response.data;
      });
    }

    return function(schema){
      return clientGenerator(schema, requestHandler);
    };
  });