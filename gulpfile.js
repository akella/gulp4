// Require all tasks in gulp/tasks, including subfolders
// require('require-dir')('./gulp/tasks', {recurse: true});

var gulp = require("gulp");
var config = require("./gulp/config");

function getTaskBuild(task) {
  return require("./gulp/tasks/" + task).build(gulp);
}
function getTaskWatch(task) {
  return require("./gulp/tasks/" + task).watch(gulp);
}

gulp.task("clean", getTaskBuild("clean"));
gulp.task("copy", getTaskBuild("copy"));
gulp.task("nunjucks", getTaskBuild("nunjucks"));
gulp.task("sass", getTaskBuild("sass"));
gulp.task("server", getTaskBuild("server"));
gulp.task("svgo", getTaskBuild("svgo"));
gulp.task("webpack", getTaskBuild("webpack"));
gulp.task("list-pages", getTaskBuild("list-pages"));
gulp.task("sprite:svg", getTaskBuild("sprite-svg"));

gulp.task("copy:watch", getTaskWatch("copy"));
gulp.task("nunjucks:watch", getTaskWatch("nunjucks"));
gulp.task("sass:watch", getTaskWatch("sass"));
gulp.task("svgo:watch", getTaskWatch("svgo"));
gulp.task("webpack:watch", getTaskWatch("webpack"));
gulp.task("list-pages:watch", getTaskWatch("list-pages"));
gulp.task("sprite:svg:watch", getTaskWatch("sprite-svg"));

// high order tasks
function build(cb) {
  gulp.series(
    "clean",
    "sprite:svg",
    "svgo",
    "sass",
    "nunjucks",
    // 'webpack',
    "copy"
    // cb
  );
}
function setmodeProd(done) {
  config.setEnv("PROD");
  config.logEnv();
  done();
}
function setmodeDev(done) {
  config.setEnv("development");
  config.logEnv();
  done();
}
gulp.task(
  "build",
  gulp.series(
    setmodeProd,
    "clean",
    "sprite:svg",
    "svgo",
    "sass",
    "nunjucks",
    // 'webpack',
    "copy",
    // "list-pages"
  )
);
gulp.task(
  "build:dev",
  gulp.series(
    setmodeDev,
    "clean",
    "sprite:svg",
    "svgo",
    "sass",
    "nunjucks",
    // 'webpack',
    // "list-pages",
    "copy"
  )
);

gulp.task(
  "watch",
  gulp.parallel(
    "copy:watch",
    "nunjucks:watch",
    "sprite:svg:watch",
    "svgo:watch",
    // "list-pages:watch",
    // 'webpack:watch',
    "sass:watch"
  )
);

gulp.task("default", gulp.series(["build:dev", "server", "watch"]));
