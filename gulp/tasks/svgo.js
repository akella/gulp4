var gulp     = require('gulp');
var svgmin   = require('gulp-svgmin');
var changed  = require('gulp-changed');
var plumber  = require('gulp-plumber');
var config   = require('../config');

gulp.task('svgo', function() {
    return gulp
        .src(config.src.img + '/svgo/**/*.svg')
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(changed(config.dest.img))
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [{
                removeDesc: true
            }, {
                cleanupIDs: true
            }, {
                mergePaths: false
            }]
        }))
        .pipe(gulp.dest(config.dest.img));
});

// gulp.task('svgo:watch', function() {
//     gulp.watch(config.src.img + '/svgo/**/*.svg', ['svgo']);
// });


let build =  function(gulp) {
    return gulp.parallel('svgo');
};

let watch =  function(gulp) {
    return function(){
        gulp.watch(config.src.img + '/svgo/**/*.svg', gulp.parallel('svgo'));
    }
};



module.exports.build = build;
module.exports.watch = watch;
