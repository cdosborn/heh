var gulp = require('gulp'),
    rename = require("gulp-rename");

var filesToMove = [
    './index.html',
    './scripts/**'
    './assets/css/**'
];

// move files
gulp.task("move", function(){
    gulp.src(filesToMove, { base: './' })
    .pipe(gulp.dest("/var/www/heh"));
});

gulp.task("watch", function(){
    gulp.watch('./index.html',['move']);
    gulp.watch('./scripts/**',['move']);
    gulp.watch('./assets/**',['move']);
});

gulp.task('default', ['move', 'watch']);

