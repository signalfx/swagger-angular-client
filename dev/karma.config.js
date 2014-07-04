module.exports = {
    browsers: ['PhantomJS'],
    
    frameworks: [
        'jasmine', 
        'browserify'
    ],
    
    files: [
        'src/js/module.js',
        'test/**/*.js'
    ],

    reporters: ['coverage', 'progress'],

    preprocessors: {
        'src/js/**/*.js': ['browserify', 'coverage']
    },

    browserify: {
        watch: true,
        debug: true
    },

    coverageReporter: {
        type: 'html',
        dir: 'report/'
    }
};
