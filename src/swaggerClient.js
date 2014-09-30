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

      // Strip $$hashKeys from the body if json
      try {
        request.body = angular.toJson(JSON.parse(request.body));
      } catch(e){
        
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