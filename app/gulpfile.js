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

compile_js('common');

compile_resource('home');
compile_resource('home_logged_in');
compile_resource('zblm');
compile_resource('bid_details');
compile_resource('bid_yu_gao_sample');
compile_resource('bid_notification_sample');
compile_resource('bid_change_sample');
compile_resource('bid_result_sample');
compile_resource('project_details_sample');
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
compile_resource('zhao_biao_ding_yue');
compile_resource('cai_gou_ding_yue');
compile_resource('xiang_mu_ding_yue');
compile_resource('zhao_biao_ding_yue_xiu_gai_huo_chuang_jian');

compile_resource('deng_lu');
compile_resource('deng_lu_with_verify_code');
compile_resource('zhu_ce_1');
compile_resource('zhu_ce_2');
compile_resource('zhu_ce_3');
compile_resource('wang_ji_mi_ma_1');
compile_resource('wang_ji_mi_ma_2');

compile_resource('cai_gou_ding_yue_xiu_gai_huo_chuang_jian');
compile_resource('xiang_mu_ding_yue_xiu_gai_huo_chuang_jian');

compile_resource('sheng_ji_ye_mian');
compile_resource('shi_ji_ye_mian');

compile_resource('about_us');
compile_resource('zi_zhi_wen_jian');
compile_resource('tuan_dui_wen_hua');
compile_resource('contact_us');
compile_resource('service_list');
compile_resource('zhao_pin_ji_shu');
compile_resource('kefu');
compile_resource('kefu_common_problems');
compile_resource('mian_ze_sheng_ming');
compile_resource('yi_jian_jian_yi');
compile_resource('guang_gao_fu_wu');

compile_resource('landing_page');

compile_resource('zhan_hui_zhong_xin');
compile_resource('hang_ye_zi_xun');
compile_resource('zhao_biao_he_zhun');
compile_resource('zi_xun_xiang_qing');

compile_resource('buy_service');
compile_resource('buy');
compile_resource('buy_succeed');
compile_resource('buy_failed');

compile_resource('hang_ye_fen_lei');

gulp.task('compile', gulp.parallel(
  'compile-common-css',

  'compile-common-js',

  'compile-home-html',
  'compile-home_logged_in-html',

  'compile-zblm-html',

  'compile-bid_details-html',
  'compile-bid_yu_gao_sample-html',
  'compile-bid_notification_sample-html',
  'compile-bid_change_sample-html',
  'compile-bid_result_sample-html',
  'compile-project_details_sample-html',

  'compile-fbcg-html',

  'compile-fbgg-html',

  'compile-main_search-html',

  'compile-zbgg-html',

  'compile-bid_details_not_login-html',

  'compile-bid_details_free_account-html',

  'compile-cglm-html',

  'compile-project-html',

  'compile-constructing_project-html',

  'compile-project_details-html',

  'compile-project_details_free_account-html',

  'compile-project_details_not_login-html',

  'compile-profile-html',

  'compile-profile_edit-html',

  'compile-modify_password-html',

  'compile-manage_subscribe-html',

  'compile-orders-html',

  'compile-messages-html',

  'compile-feedback-html',

  'compile-bid_collection-html',

  'compile-cg_collection-html',

  'compile-project_collection-html',

  'compile-zhao_biao_ding_yue-html',
  'compile-cai_gou_ding_yue-html',

  'compile-xiang_mu_ding_yue-html',

  'compile-zhao_biao_ding_yue_xiu_gai_huo_chuang_jian-html',

  'compile-deng_lu-html',

  'compile-deng_lu_with_verify_code-html',

  'compile-zhu_ce_1-html',
  'compile-zhu_ce_2-html',
  'compile-zhu_ce_3-html',

  'compile-wang_ji_mi_ma_1-html',
  'compile-wang_ji_mi_ma_2-html',

  'compile-cai_gou_ding_yue_xiu_gai_huo_chuang_jian-html',

  'compile-xiang_mu_ding_yue_xiu_gai_huo_chuang_jian-html',

  'compile-sheng_ji_ye_mian-html',
  'compile-shi_ji_ye_mian-html',

  'compile-about_us-html',
  'compile-zi_zhi_wen_jian-html',
  'compile-tuan_dui_wen_hua-html',
  'compile-contact_us-html',
  'compile-service_list-html',
  'compile-zhao_pin_ji_shu-html',
  'compile-kefu-html',
  'compile-kefu_common_problems-html',
  'compile-mian_ze_sheng_ming-html',
  'compile-yi_jian_jian_yi-html',
  'compile-guang_gao_fu_wu-html',

  'compile-landing_page-html',

  'compile-zhan_hui_zhong_xin-html',
  'compile-hang_ye_zi_xun-html',
  'compile-zhao_biao_he_zhun-html',
  'compile-zi_xun_xiang_qing-html',

  'compile-buy_service-html',
  'compile-buy-html',
  'compile-buy_succeed-html',
  'compile-buy_failed-html',
  'compile-hang_ye_fen_lei-html'

));

gulp.task("build", gulp.series("clean", "precompile", "compile", "copy-assets", "optimize"));
