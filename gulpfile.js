const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass')
const del = require('del')
const cssMin = require('gulp-css')
const htmlMin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const browserSync = require("browser-sync").create()

gulp.task('delete', function (cb) {
  return del(['docs/*'], cb);
})

gulp.task('sass', () => {
  gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssMin())
    .pipe(gulp.dest('./docs/styles/'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('html', function () {
  var options = {
    removeComments: true,
    collapseWhitespace: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true,
  };
  gulp.src('src/index.html')
    .pipe(htmlMin(options))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('ts', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/scripts/index.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts']
    })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('scripts/bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.reload({stream: true}));
})

gulp.task('copy', function () {
  gulp.src(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'])
    .pipe(gulp.dest('docs/images'))
})

gulp.task('build',['delete'],function () {
  return gulp.start('html', 'sass', 'ts','copy')
})

gulp.task('default', ['delete'], function () {
  gulp.start('html', 'sass', 'ts','copy')
  browserSync.init({
    port: (new Date).getFullYear(),
    server: {
      baseDir: ['docs']
    }
  })
  gulp.watch('src/**/*.ts', ['ts']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/index.html', ['html']);
  gulp.watch(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'], ['copy']);
})

