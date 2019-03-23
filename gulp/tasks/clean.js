var del    = require('del');
var util   = require('gulp-util');
var config = require('../config');


let build = function(gulp) {
	return function () {
	    return del([
	        config.dest.root
	    ]).then(function(paths) {
	        util.log('Deleted:', util.colors.magenta(paths.join('\n')));
	    });
	};
};

module.exports.build = build;
