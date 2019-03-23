var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config      = require('../config');

// function build(cb) {
//     runSequence(
//         'clean',
//         'sprite:svg',
//         'svgo',
//         'sass',
//         'nunjucks',
//         'webpack',
//         'copy',
        
//         cb
//     );
// }

gulp.task('build', gulp.series('clean'));

// gulp.task('build:dev', function(cb) {
//     config.setEnv('development');
//     config.logEnv();
//     build(cb);
// });
