var gulp = require("gulp");
var plumber = require("gulp-plumber");
var svgmin = require("gulp-svgmin");
var svgStore = require("gulp-svgstore");
var rename = require("gulp-rename");
var cheerio = require("cheerio");
var gulpcheerio = require("gulp-cheerio");
var through2 = require("through2");
var consolidate = require("gulp-consolidate");
var config = require("../config");

gulp.task("sprite:svg", function() {
  return (
    gulp
      .src(config.src.iconsSvg + "/*.svg")
      .pipe(
        gulpcheerio({
          run: function($, file) {

            $('[fill]:not([fill="currentColor"])').removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            var w,h,size;
            if($('svg').attr('height')){
                w = $('svg').attr('width').replace(/\D/g,'');
                h = $('svg').attr('height').replace(/\D/g,'');
            } else{
                size = $('svg').attr('viewbox').split(' ').splice(2);
                w = size[0];
                h = size[1];
                $('svg').attr('width', parseInt(w));
                $('svg').attr('height', parseInt(h));
            }
            $('svg').attr('viewBox', '0 0 ' + parseInt(w) + ' ' + parseInt(h));
          },
          parserOptions: { xmlMode: true }
        })
      )
      .pipe(plumber({
          errorHandler: config.errorHandler
      }))
      .pipe(svgmin({
          js2svg: {
              pretty: true
          },
          plugins: [{
              removeDesc: true
          }, {
              cleanupIDs: true
          }, {
              removeViewBox: false
          }, {
              mergePaths: false
          }]
      }))
      .pipe(rename({ prefix: 'icon-' }))
      .pipe(svgStore({ inlineSvg: false }))
      .pipe(through2.obj(function (file, encoding, cb) {
          
          var $ = cheerio.load(file.contents.toString(), {xmlMode: true});

          var data = $('svg > symbol').map(function() {
              var $this  = $(this);
              var size   = $this.attr('viewBox').split(' ').splice(2);
              var name   = $this.attr('id');
              var ratio  = size[0] / size[1]; // symbol width / symbol height
              var fill   = $this.find('[fill]:not([fill="currentColor"])').attr('fill');
              var stroke = $this.find('[stroke]').attr('stroke');
              return {
                  name: name,
                  ratio: +ratio.toFixed(2),
                  fill: fill || 'initial',
                  stroke: stroke || 'initial'
              };
          }).get();
          this.push(file);
          gulp.src(__dirname + '/sprite-svg/_sprite-svg.scss')
              .pipe(consolidate('lodash', {
                  symbols: data
              }))
              .pipe(gulp.dest(config.src.sassGen));
          // gulp.src(__dirname + '/sprite.html')
          //     .pipe(consolidate('lodash', {
          //         symbols: data
          //     }))
          //     .pipe(gulp.dest(config.src.root));
          cb();
      }))
      
      .pipe(rename({ basename: "sprite" }))
      .pipe(gulp.dest(config.dest.img))
  );
});

// gulp.task('sprite:svg:watch', function() {
//     gulp.watch(config.src.iconsSvg + '/*.svg', ['sprite:svg']);
// });

let build = function() {
  return gulp.series("sprite:svg");
};

let watch = function(gulp) {
  return function() {
    gulp.watch(config.src.iconsSvg + "/*.svg", gulp.parallel("sprite:svg"));
  };
};

module.exports.build = build;
module.exports.watch = watch;
