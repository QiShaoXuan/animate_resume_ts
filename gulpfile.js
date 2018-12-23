const gulp = require("gulp")
const browserify = require("browserify")
const source = require('vinyl-source-stream')
const streamify = require('gulp-streamify')
const tsify = require("tsify")
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('vinyl-buffer')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const del = require('del')
const cssMin = require('gulp-css')
const htmlMin = require('gulp-htmlmin')
const browserSync = require("browser-sync").create()

gulp.task('delete', function (cb) {
  return del(['docs/*'], cb)
})

gulp.task('sass', function () {
  gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssMin())
    .pipe(gulp.dest('./docs/styles/'))
    .pipe(browserSync.reload({stream: true}))

  gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('animateResume.css'))
    .pipe(gulp.dest('dist/'))

  gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssMin())
    .pipe(rename('animateResume.min.css'))
    .pipe(gulp.dest('dist/'))
})

gulp.task("ts", function () {
  browserify({
    basedir: '.',
    debug: true,
    entries: ['src/scripts/index.ts'],
    cache: {},
    packageCache: {},
    standalone:'umd'
  })
    .plugin(tsify)
    .bundle()
    .on('error', (error)=>console.log(error))
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("docs/scripts/"))
    .pipe(browserSync.reload({stream: true}))

  browserify({
    basedir: '.',
    debug: true,
    entries: ['src/scripts/animateResume/index.ts'],
    cache: {},
    packageCache: {},
    standalone:'umd'
  })
    .plugin(tsify)
    .bundle()
    .on('error', (error)=>console.log(error))
    .pipe(source('animateResume.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename('animateResume.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist/"))
})


gulp.task('html', function () {
  var options = {
    removeComments: true,
    collapseWhitespace: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true,
  }
  gulp.src('src/index.html')
    .pipe(htmlMin(options))
    .pipe(gulp.dest('docs'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('copy', function () {
  gulp.src(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'])
    .pipe(gulp.dest('docs/images'))
})

gulp.task('build', ['delete'], function () {
  return gulp.start('html', 'sass', 'ts', 'copy')
})

gulp.task('default', ['delete'], function () {
  gulp.start('html', 'sass', 'ts', 'copy')
  browserSync.init({
    port: (new Date).getFullYear(),
    server: {
      baseDir: ['docs']
    }
  })
  gulp.watch('src/**/*.ts', ['ts'])
  gulp.watch('src/**/*.scss', ['sass'])
  gulp.watch('src/index.html', ['html'])
  gulp.watch(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'], ['copy'])
})
