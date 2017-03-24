//API for poker solver installed by npm
// https://github.com/goldfire/pokersolver
var Hand = require('pokersolver').Hand;

var gulp = require('gulp');
var browserify = require('gulp-browserify');
 
// Basic usage 
gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('script_poker.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./bundle.js'))
});
