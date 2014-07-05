'use strict';

var source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  csso = require('gulp-csso'),
  jshint = require('gulp-jshint'),
  beautify = require('js-beautify'),
  del = require('del'),
  recess = require('gulp-recess'),
  karma = require('karma').server,
  _ = require('lodash'),
  gutil = require('gulp-util'),
  es = require('event-stream'),
  fs = require('fs'),
  livereload = require('gulp-livereload'),
  connectLivereload = require('connect-livereload'),
  connect = require('connect'),
  serveStatic = require('serve-static'),
  path = require('path'),
  gulp = require('gulp');

var pkg = require('./package.json');

var jsSrcDir = './src/js';
var cssSrcDir = './src/css';
var buildDir = './build';
var distDir = './dist';

gulp.task('default', ['min']);

gulp.task('build', ['css', 'js']);
gulp.task('build-min', ['css-min', 'js-min']);


//*******************//
// Development Tasks //
//*******************//
// Wipe out all generated files which are generated via build tasks.
gulp.task('clean', function(done) {
  del(['./build', './reports', './dist'], done);
});

// Incrementally build JavaScript and CSS files as they're modified and then
// execute testing and linting tasks.
gulp.task('dev', function() {
  var server = connect();

  server.use(livereload.middleware({ server: server }))
    .use(serveStatic('./example'))
    .use(connectLivereload())
    .listen(3000);

  var lr = livereload();

  gulp.watch('example/**').on('change', function(file){
    lr.changed(file.path);
  });
  gulp.watch('./src/js/**/*.js', ['js', 'lint']);
  gulp.watch('./src/css/**/*.js', ['css']);
  karma.start(require('./dev/config/karma.js'));
});


// Creates a clean, full build will all testing, linting, and minification
// included then copies the results to the dist folder.
gulp.task('dist', ['clean', 'test', 'lint', 'build-min'], function() {
  return gulp.src(buildDir + '/**/*')
    .pipe(gulp.dest(distDir));
});

//*************************//
// JavaScript Bundler Tasks //
//*************************//
// Generates a JavaScript bundle of src/js/main.js and its dependencies using
// browserify in the build directory with an embedded sourcemap.
gulp.task('js', ['clean-js'], function() {
  return browserify(pkg.main)
    .bundle({
      debug: true,
      standalone: pkg.name
    }) // Debug enables source maps
    .pipe(source(path.basename(pkg.main))) // gulpifies the browserify stream
    .pipe(rename(pkg.name + '.js'))
    .pipe(gulp.dest(buildDir));
});

// Generates a minified JavaScript bundle in the build directory with an
// accompanying source map file.
gulp.task('js-min', ['js'], function() {
  return gulp.src(buildDir + '/' + pkg.name + '.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(pkg.name + '.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir));
});

// Deletes generated JavaScript files (and source maps) from the build
// directory.
gulp.task('clean-js', function(done) {
  del([buildDir + '/**/*.js{,.map}'], done);
});


//*******************//
// CSS Bundler Tasks //
//*******************//

// Deletes generated CSS files (and source maps) from the build directory.
gulp.task('clean-css', function(cb) {
  del([buildDir + '/**/*.css{,map}'], cb);
});

// Generates a CSS bundle of src/css/main.less and its dependencies using LESS
// in the build directory with an embedded source map.
gulp.task('css', ['clean-css'], function() {
  return gulp.src(cssSrcDir + './main.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(rename(pkg.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildDir));
});

// Generates a minified CSS bundle in the build directory with an accompanying
// source map.
gulp.task('css-min', ['css'], function() {
  return gulp.src(buildDir + '/' + pkg.name + '.css')
    .pipe(rename(pkg.name + '.min.css'))
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir));
});


//*******************//
// Quality Ensurance //
//*******************//

// Run tests found in ./test/ against the JavaScript source files using karma
// with the configuration defined in ./dev/config/karma.js.
gulp.task('test', function(done) {
  karma.start(_.assign({},
    require('./dev/config/karma.js'), {
      singleRun: true
    }
  ), done);
});

gulp.task('lint', ['lint-js', 'lint-css']);

// Runs the JavaScript source files via JSHint according to the options set in
// ./dev/config/jshint.js.
gulp.task('lint-js', function() {
  var config = require('./dev/config/jshint.js');

  return gulp.src([
      jsSrcDir + '/**/*.js',
      'dev/**/*.js',
      'gulpfile.js'
    ])
    .pipe(jshint(config))
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(jshint.reporter('fail'));
});

// Runs the LESS source files via recess according to the options set in
// ./dev/config/recess.js.
gulp.task('lint-css', function() {
  var config = require('./dev/config/recess.js');

  return gulp.src(cssSrcDir + '/**/*.less')
    .pipe(recess(config));
});

// *REWRITES* This project's JavaScript files, passing them through JS 
// Beautifier with the options set in dev/config/js-beautifer.js
gulp.task('fix-style', function() {
  var config = require('./dev/config/js-beautifier.js');

  return gulp.src([
      jsSrcDir + '**/*.js',
      './dev/**/*.js',
      './gulpfile.js'
    ])
    .pipe(es.map(function(file, cb) {
      try {
        file.contents = new Buffer(beautify(String(file.contents), config));
        fs.writeFile(file.path, file.contents, function() {
          cb(null, file);
        });
      } catch (err) {
        return cb(new gutil.PluginError('fix-style', err, config));
      }
    }));
});