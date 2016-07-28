var gulp = require('gulp');
var htmlLocale = require('../');
var del = require('del');

gulp.task('default', function() {
	del('build');
	gulp.src('*.html')
		.pipe(htmlLocale())
		.pipe(gulp.dest('build'));
});