var gulp = require('gulp'),
  boilerplate = require('boilerplate-gulp-angular');

boilerplate(gulp, {
  jsMain: './src/swaggerClient.js',
  name: 'swagger-angular-client',
  karmaConfig: require('./dev/karmaConfig')
});