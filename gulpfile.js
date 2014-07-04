var source = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  mincss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  beautify = require('gulp-beautify'),
  del = require('del'),
  karma = require('karma').server,
  _ = require('lodash'),
  gulp = require('gulp');

var jsSrc = './src/js/**/*.js';
var cssSrc = './src/css/**/*.css';
var jsEntryPath = './src/js/module.js';
var cssEntryPath = './src/css/module.less';
var buildDir = './build';
var distDir = './dist';
var karmaConfig = require('./dev/karma.config.js');

gulp.task('default', ['min']);
gulp.task('clean', ['clean-css', 'clean-js']);
gulp.task('build', ['css', 'js']);
gulp.task('min', ['min-css', 'min-js'])

gulp.task('dev', function(){
  gulp.watch('./src/js/**/*.js', ['js', 'lint']);
  gulp.watch('./src/css/**/*.js', ['css']);
  karma.start(karmaConfig);
});

gulp.task('test', function(done){
  karma.start(_.assign(
    {}, 
    karmaConfig, 
    { singleRun: true }
  ), done);
});

gulp.task('lint', function(){
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('fix-style', function(){
  return gulp.src(jsSrc)
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('src/js/'));
});

gulp.task('clean-css', function(cb){
  del(['./build/*.css'], cb); 
});

gulp.task('clean-js', function(cb){
  del(['./build/*.js'], cb); 
});

gulp.task('css', ['clean-css'], function(){
  return gulp.src(cssEntryPath)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('min-css', ['css'], function(){
  return gulp.src('./dist/module.css')
    .pipe(sourcemaps.init())
    .pipe(mincss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir))
});

gulp.task('js', ['clean-js'], function() {
  function bundle() {
    return bundler
      .bundle({debug: true})
      .pipe(source('module.js'))
      .pipe(gulp.dest(buildDir))
  }

  var bundler = browserify(jsEntryPath);

  return bundle();
});

gulp.task('min-js', ['js'], function(){
  return gulp.src('./build/module.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('module.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir));
});