'use strict';

var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var Path = require('path');

module.exports = function(opts) {
	function createFile(context, file, locale) {
		var extname = Path.extname(file.relative);
		var basename = Path.basename(file.relative, extname);

		var createdFile = file.clone({ contents: false });
		createdFile.path = Path.join(file.base, basename + '.'+ locale + extname);
		createdFile.contents = new Buffer(String(file.contents).replace(/\.html/g, '.' + locale + '.html'));
		context.push(createdFile);
	}

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) { // ignore empty files
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('gulp-html-locale',  'Streaming not supported'));
			cb();
			return;
		}

		createFile(this, file, 'en');
		createFile(this, file, 'zh');

		cb();
	});
};