var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sh = require('shelljs');
var del = require('del');

//var karma = require('karma').server;
var browserify = require("browserify");
var fs = require("fs");
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var babelify = require('babelify');
var sourceStream = require('vinyl-source-stream');
var server = require('gulp-server-livereload');
var autoprefixer = require('gulp-autoprefixer');
var proxy = require("./proxy.js");


var paths = {
    src: __dirname + '/app',
    www: __dirname + '/www',
    fonts: '/fonts',
    lib: '/lib',
    images: '/images',
    styles: '/styles',
    views: '/views',
    index: '/index.html',
    scripts: '/scripts',
    scriptsEntry: '/scripts/app.js',
    clean: [__dirname + '/www/**/*', '!' + __dirname + '/www/README.md'],
    test: __dirname + '/karma.conf.js'
};

gulp.task('clean', function(done) {
    return del(paths.clean, done);
});

gulp.task('babelify', function() {
    browserify({
        entries: paths.src + paths.scriptsEntry,
        debug: true
    })
        .add(require.resolve("babelify/polyfill"))
        .transform(babelify)
        .bundle()
        .on('error', function(err){
            console.log(err.message);
            this.emit("end");
        })
        .pipe(sourceStream('app.js'))
        .pipe(gulp.dest(paths.www + paths.scripts));
});

gulp.task('copy.fonts', function() {
    return gulp.src(paths.src + paths.fonts + '/**')
        .pipe(gulp.dest(paths.www + paths.fonts));
});

gulp.task('copy.images', function() {
    return gulp.src(paths.src + paths.images + '/**')
        .pipe(gulp.dest(paths.www + paths.images));
});

gulp.task('copy.lib', function() {
    return gulp.src(paths.src + paths.lib + '/**')
        .pipe(gulp.dest(paths.www + paths.lib));
});

gulp.task('copy.styles', function() {
    return gulp.src(paths.src + paths.styles + '/**')
        //.pipe(autoprefixer({
        //    browsers: ['last 2 versions'],
        //    cascade: false
        //}))
        .pipe(gulp.dest(paths.www + paths.styles))
        .on('error', gutil.log);
});

gulp.task('copy.views', function() {
    return gulp.src(paths.src + paths.views + '/**')
        .pipe(gulp.dest(paths.www + paths.views));
});

gulp.task('copy.index', function() {
    return gulp.src(paths.src + paths.index)
        .pipe(gulp.dest(paths.www));
});

gulp.task('copy', ['copy.fonts', 'copy.images', 'copy.lib', 'copy.styles', 'copy.views', 'copy.index', 'babelify']);

gulp.task('watch', function() {
    gulp.watch(paths.src + paths.fonts + '/**', ['copy.fonts']);
    gulp.watch(paths.src + paths.images + '/**', ['copy.images']);
    gulp.watch(paths.src + paths.lib + '/**', ['copy.lib']);
    gulp.watch(paths.src + paths.styles + '/**', ['copy.styles']);
    gulp.watch(paths.src + paths.views + '/**', ['copy.views']);
    gulp.watch(paths.src + paths.scripts + '/**', ['babelify']);
    gulp.watch(paths.src + paths.index, ['copy.index']);
});

gulp.task('karma', function(done) {
    karma.start({
        configFile: paths.test,
        singleRun: true
    }, done);
});

// -----------------FOR USING IN GULP CLI ------------------
gulp.task('test', function() {
    runSequence('clean', 'copy', 'karma');
});

gulp.task('build', function(done) {
    return runSequence('clean', 'copy', done);
});

gulp.task('proxy', function() {
    proxy.start();
});

gulp.task('webserver', ["proxy"], function() {
    gulp.src("www")
        .pipe(server({
            livereload: true,
            open: false
        }));
});

gulp.task('serve', function(done) {
    runSequence("build", "watch", "webserver", done)
});


gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});