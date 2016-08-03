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
compile_resource('main_search');
compile_resource('zbgg');
compile_resource('bid_details_not_login');
compile_resource('bid_details_free_account');
compile_resource('cglm');
compile_resource('project');
compile_resource('constructing_project');
compile_resource('project_details');
compile_resource('project_details_free_account');
compile_resource('project_details_not_login');

compile_css('user_header');
compile_css('user_left_side');

compile_resource('profile');
compile_resource('profile_edit');
compile_resource('modify_password');
compile_resource('manage_subscribe');
compile_resource('orders');
compile_resource('messages');
compile_resource('feedback');
compile_resource('bid_collection');
compile_resource('cg_collection');
compile_resource('project_collection');

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
  'compile-fbgg-css',
  // 'compile-fbgg-js',

  'compile-main_search-html',
  'compile-main_search-css',
  'compile-main_search-js',

  'compile-zbgg-html',
  'compile-zbgg-css',
  'compile-zbgg-js',

  'compile-bid_details_not_login-html',
  'compile-bid_details_not_login-css',

  'compile-bid_details_free_account-html',
  'compile-bid_details_free_account-css',

  'compile-cglm-html',
  'compile-cglm-css',
  'compile-cglm-js',

  'compile-project-html',
  'compile-project-css',
  'compile-project-js',

  'compile-constructing_project-html',
  'compile-constructing_project-css',
  'compile-constructing_project-js',

  'compile-project_details-html',
  'compile-project_details-css',

  'compile-project_details_free_account-html',
  'compile-project_details_free_account-css',

  'compile-project_details_not_login-html',
  'compile-project_details_not_login-css',

  'compile-user_header-css',
  'compile-user_left_side-css',

  'compile-profile-html',
  'compile-profile-css',

  'compile-profile_edit-html',
  'compile-profile_edit-css',
  'compile-profile_edit-js',

  'compile-modify_password-html',
  'compile-modify_password-css',

  'compile-manage_subscribe-html',
  'compile-manage_subscribe-css',

  'compile-orders-html',
  'compile-orders-css',

  'compile-messages-html',
  'compile-messages-css',

  'compile-feedback-html',
  'compile-feedback-css',

  'compile-bid_collection-html',
  'compile-bid_collection-css',
  'compile-bid_collection-js',

  'compile-cg_collection-html',
  'compile-cg_collection-css',
  'compile-cg_collection-js',

  'compile-project_collection-html',
  'compile-project_collection-css',
  'compile-project_collection-js'
));

gulp.task("build", gulp.series("clean", "precompile", "compile", "copy-assets", "optimize"));
