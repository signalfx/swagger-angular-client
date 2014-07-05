var gulp = require('gulp'),
  boilerplate = require('boilerplate-gulp');

boilerplate(gulp, {
  karmaConfig: require('./dev/config/karma.js'),
  jsBeautifierConfig: require('./dev/config/js-beautifier.js'),
  jsHintConfig: require('./dev/config/jshint.js'),
  recessConfig: require('./dev/config/recess.js'),
  pkg: require('./package.json')
});