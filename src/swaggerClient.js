'use strict';

var clientGenerator = require('../bower_components/swagger-client-generator/dist/swagger-client-generator.js');

/* global angular */
angular.module('swagger-client', [])
  .provider('swaggerClient', function(){
    var schemas = {};

    this.add = function(name, theSchema){
      if(!name || !theSchema) return;
      schemas[name] = theSchema;
    };

    this.$get = function($log, $http, $q){
      var api = {};

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

      Object.keys(schemas).forEach(function(name){
        api[name] = clientGenerator(schemas[name], requestHandler);
      });

      return api;
    };
    
    return this;
  });