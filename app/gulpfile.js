var path = require('path');
var del = require('del');
var gulp = require('gulp');
var fs = require('fs');
var deep_extend = require('deep-extend');

var swig = require('gulp-swig');
var minify_html = require('gulp-minify-html');
var minify_html_options = {
  empty: true,
  conditionals: true
};

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var replace = require('gulp-replace');

var minify_inline = require('gulp-minify-inline');

var compass = require('gulp-compass');
var minify_css = require('gulp-minify-css');
var minify_css_opts = {
  keepSpecialComments: 1 // * for keeping all (default), 1 for keeping first one only, 0 for removing all
};

var addsrc = require('gulp-add-src');

var imagemin = require('gulp-imagemin');

var config = {

};

gulp.task(function clean() {
  // Why this?
  return del([
    path.join("build", "*"),
    path.join("temp", "css"),
    path.join("temp", "sass")
  ], {
    force: true
  });
});

gulp.task("copy-assets-images", function() {
  return gulp.src([
        "images/*.{png,jpeg,jpg,svg}"
      ])
      .pipe(gulp.dest(path.join("build/images")));
});

gulp.task("copy-assets-css", function() {
  return gulp.src([
        "lib/css/*.css",
      ])
      .pipe(gulp.dest(path.join("build/css")));
});

gulp.task("copy-assets-js", function() {
  return gulp.src([
        "lib/js/*.js",
      ])
      .pipe(gulp.dest(path.join("build/js")));
});

gulp.task("copy-assets", gulp.parallel(
  "copy-assets-images",
  "copy-assets-css",
  "copy-assets-js"
));

gulp.task('optimize', function() {
  return gulp.src("build/images/*.{png,jpg,jpeg}")
      .pipe(imagemin({
        verbose: 1
      }))
      .pipe(gulp.dest(path.join("build/images")));
});

gulp.task("generate-pure-sass", function() {
  return gulp.src("sass/**/*.scss")
        .pipe(swig({
          data: config,
          ext: ".scss"
        })).pipe(gulp.dest(path.join("temp", "sass")));
});

gulp.task('precompile', gulp.series('generate-pure-sass'));

function compile_css(resource) {
  gulp.task('compile-' + resource + '-css', function() {
    return gulp.src('temp/sass/' + resource + ".scss")
            .pipe(compass({
              config_file: './config.rb',
              css: 'temp_css',
              sass: 'temp/sass'
            }))
          // .pipe(minify_css(minify_css_opts))
          .pipe(gulp.dest('build/css'));
  });
}

function compile_js(resource) {
  gulp.task('compile-' + resource + '-js', function() {
    return gulp.src('js/' + resource + '.js')
            .pipe(swig({
              data: {},
              ext: '.js'
            }))
            // .pipe(uglify())
            .on("error", function(err) {
              console(err);
            }).pipe(gulp.dest('build/js'));
  });
}

function compile_resource(resource) {
  gulp.task('compile-' + resource + '-html', function() {
    return gulp.src('html/' + resource + '.html')
            .pipe(swig({
              data: {
                main_js: 'js/' + resource + '.js',
                main_css: 'css/' + resource + '.css'
              }
            }))
            // .pipe(minify_html(minify_html_options))
            .pipe(gulp.dest('build'));
  });

  compile_css(resource);

  compile_js(resource);
}

compile_css('common');
compile_css('header');
compile_css('footer');

compile_js('common');

compile_resource('home');
compile_resource('zblm');
compile_resource('bid_details');
compile_resource('fbcg');
compile_resource('fbgg');

gulp.task('compile', gulp.parallel(
  'compile-common-css',
  'compile-header-css',
  'compile-footer-css',

  'compile-common-js',

  'compile-home-html',
  'compile-home-css',
  'compile-home-js',

  'compile-zblm-html',
  'compile-zblm-css',
  'compile-zblm-js',

  'compile-bid_details-html',
  'compile-bid_details-css',
  'compile-bid_details-js',

  'compile-fbcg-html',
  'compile-fbcg-css',
  // 'compile-fbcg-js',

  'compile-fbgg-html',
  'compile-fbgg-css'
  // 'compile-fbgg-js',
));

gulp.task("build", gulp.series("clean", "precompile", "compile", "copy-assets", "optimize"));
