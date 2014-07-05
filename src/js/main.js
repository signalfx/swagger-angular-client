'use strict';

var dependency = require('./dependency');

module.exports = function(value) {
  return dependency(value) + 10;
};