var gulp          = require('gulp');
var webpack       = require('webpack');
const webpackStream = require('webpack-stream');
var gutil         = require('gulp-util');
var notify        = require('gulp-notify');
var server        = require('./server');
var config        = require('../config');
var webpackConfig = require('../../webpack.config').createConfig;

function handler(err, stats, cb) {
    var errors = stats.compilation.errors;

    if (err) throw new gutil.PluginError('webpack', err);

    if (errors.length > 0) {
        notify.onError({
            title: 'Webpack Error',
            message: '<%= error.message %>',
            sound: 'Submarine'
        }).call(null, errors[0]);
    }

    gutil.log('[webpack]', stats.toString({
        colors: true,
        chunks: false
    }));

    server.server.reload();
    if (typeof cb === 'function') cb();
}

// gulp.task('webpack', gulp.parallel(function(done) {
//     webpack(webpackConfig(config.env)).run(function(err, stats) {
//         handler(err, stats, done);
//     });
// }));



gulp.task('webpack', function() {
  return gulp.src('src/js/app.js')
    .pipe(webpackStream(webpackConfig(config.env), webpack, function(err, stats) {
      /* Use stats to do more things if needed */
      handler(err, stats);
      // return false;
    }))
    .pipe(gulp.dest('dist/'));
});

// gulp.task('webpack:watch', function() {
//     webpack(webpackConfig(config.env)).watch({
//         aggregateTimeout: 100,
//         poll: false
//     }, handler);
// });


let build =  function(gulp) {
    return gulp.parallel('webpack'); 
};

let watch =  function(gulp) {
    return function(){
        return gulp.watch(config.src.js + '/*.*', gulp.parallel('webpack'));
    }
};



module.exports.build = build;
module.exports.watch = watch;
