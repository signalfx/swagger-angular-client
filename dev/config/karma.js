module.exports = {
  browsers: ['PhantomJS'],

  frameworks: [
    'jasmine',
    'commonjs'
  ],

  files: [
    'src/js/**/*.js'
  ],

  preprocessors: {
    '**/src/js/**/*.js': ['coverage', 'commonjs']
  },

  reporters: ['progress', 'coverage'],

  coverageReporter: {
    type: 'html',
    dir: 'reports/coverage'
  }
};