let gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith'),
    cssnano = require('gulp-cssnano'),
    connect = require('gulp-connect');

let path = {
    dev: './src',
    dist: './dist'
};

gulp.task('sprite', gulp.series(function (done) {
    let spriteData = gulp.src(path.dev + '/assets/slice/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        imgPath: '/dist/imgs/sprite.png',
        padding: 1
    }));

    spriteData.img.pipe(gulp.dest(path.dist + '/imgs'));

    spriteData.css.pipe(gulp.dest(path.dev + '/assets')).pipe(cssnano()).pipe(gulp.dest(path.dev + '/css'));

    done();
}));

gulp.task('connect', gulp.series(function (done) {
    connect.server({
        root: './',
        livereload: true,
        port: 8080
    });

    done();
}));

gulp.task('default', gulp.series(['connect']));
