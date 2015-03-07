var gulp = require('gulp'),
    rename = require("gulp-rename");

var filesToMove = [
    './index.html',
    './scripts/**'
];

// move files
gulp.task("move", function(){
    gulp.src(filesToMove, { base: './' })
    .pipe(gulp.dest("/var/www/heh"));
});

gulp.task('default', ['move']);
