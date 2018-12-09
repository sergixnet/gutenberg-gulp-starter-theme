var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-uglifycss');
var minmediaqueries = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var del = require('del');

// Directories
var dirs = {
    devStyles: {
        src: 'resources/assets/scss',
        dist: 'resources/assets/css'
    },
    devAssets: {
        src: 'resources/assets',
        dist: 'resources/assets'
    },
    prod: {
        dist: 'dist/assets'
    }
};

/* Tasks for development:

- live reload with browserSync
- compile css styles
- watch for changes and reload the browser

*/

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: "wpdev.test",
        open: true,
        injectChanges: true,
        files: [
            'resources/**/*.php',
            dirs.devStyles.src + '/**/*.scss',
            dirs.devAssets.src + '/js/**/*.js'],
        notify: true
    });
});

gulp.task('dev:styles', function () {
    return gulp.src(dirs.devStyles.src + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.']
        }))
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'android 4',
                'opera 12',
                'iOS >= 7']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dirs.devStyles.dist))
        .pipe(browserSync.reload({ stream: true }))
    //notification message, comment if you don't like
    //.pipe(notify({ message: 'Task "Styles" finished! ', onLast: true }))
});

// watch for changes and reload the browser
gulp.task('watch', ['dev:styles', 'browserSync'], function () {
    gulp.watch(dirs.devStyles.src + '/**/*.scss', ['dev:styles']);
});

gulp.task('default', ['watch'], function (done) {
    done();
});

/* Task for staging or production environments:

- clean dist folder
- minify images on dist
- minify css and js on dist
- create css source maps

*/

// clean dist folder
gulp.task('prod:clean', function () {
    return del(dirs.prod.dist);
});

// minify images on dist
gulp.task('prod:images', function (done) {
    return gulp.src(dirs.devAssets.src + '/images/**/*')
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.gifsicle({ interlaced: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeUnknownsAndDefaults: false }, { cleanupIDs: false }] })
        ]))
        .pipe(gulp.dest(dirs.prod.dist + '/images'))
        .pipe(notify({ message: 'TASK: "prod:images" Completed!', onLast: true }));
    done();
});

// minify js on dist
gulp.task('prod:scripts', function (done) {
    gulp.src(dirs.devAssets.src + '/js/*.js')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dirs.prod.dist + '/js/'))
        .pipe(notify({ message: 'TASK: "prod:scripts" Completed!', onLast: true }));
    done();
});


// minify css and create source maps on dist
gulp.task('prod:styles', function (done) {
    gulp.src(dirs.devAssets.src + '/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compact',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'android 4',
                'opera 12',
                'iOS >= 7']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dirs.prod.dist + '/css/'))
        .pipe(minmediaqueries({ log: true })) // Merge Media Queries only for.min.css
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({ maxLineLen: 0 }))
        .pipe(gulp.dest(dirs.prod.dist + '/css/'))
        .pipe(notify({ message: 'TASK: "prod:Styles" Completed! ', onLast: true }))
    done();
});

/* Tasks to run when we want to use an staging or production environment */
gulp.task('deploy', ['prod:clean', 'prod:images', 'prod:styles', 'prod:scripts'], function (done) {
    done();
});

