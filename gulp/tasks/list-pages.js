var gulp        = require('gulp');
var consolidate = require('gulp-consolidate');
var config      = require('../config');
require('require-yaml');

gulp.task('list-pages', function() {
	delete require.cache[require.resolve('../../' + config.src.pagelist)]
    var pages = require('../../' + config.src.pagelist);
    return gulp
        .src(__dirname + '/index/index.html')
        .pipe(consolidate('lodash', {
            pages: pages
        }))
        .pipe(gulp.dest(config.dest.html));
});

// gulp.task('list-pages:watch', function() {
//     gulp.watch(config.src.root+'/*', ['list-pages']);
// });


let build =  function(gulp) {
    return gulp.parallel('list-pages');
};

let watch =  function(gulp) {
    return function(){
         gulp.watch(config.src.root+'/*', gulp.series('list-pages'));
    }
};



module.exports.build = build;
module.exports.watch = watch;
