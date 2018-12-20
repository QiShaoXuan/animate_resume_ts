const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const del = require('del')
const cssMin = require('gulp-css')
const htmlMin = require('gulp-htmlmin')
const uglify = require('gulp-uglify')
const browserSync = require("browser-sync").create()

// const rollup = require('gulp-rollup')
const rollup = require('rollup-stream')
const ts = require('rollup-plugin-typescript')
const rename = require('gulp-rename')
const babel = require('rollup-plugin-babel')
const commonJs = require('rollup-plugin-commonjs')
const resolveNodeModules = require('rollup-plugin-node-resolve')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
// const babel = require('rollup-plugin-babel')
// const commonJs = require('rollup-plugin-commonjs')
// const resolveNodeModules = require('rollup-plugin-node-resolve')
//
// const commonjs = require('rollup-plugin-commonjs')
// const nodeResolve = require('rollup-plugin-node-resolve')
// const globals = require('rollup-plugin-node-globals')
// const builtins = require('rollup-plugin-node-builtins')

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

const babelConfig = {
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "external-helpers"
  ],
  babelrc: false,
  exclude: 'node_modules/**'
};
const rollupJS = (inputFile, options) => {
  return () => {
    return rollup({
      input: options.basePath + inputFile,
      format: options.format,
      sourcemap: options.sourcemap,
      context: 'window',
      moduleContext: 'window',
      plugins: [
        ts(),
        babel(babelConfig),
        resolveNodeModules(),
        commonJs(),
      ]
    })
      .pipe(source(inputFile, options.basePath))
      .pipe(buffer())
      // .pipe(uglify())
      .pipe(rename('index.js'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(options.distPath));
  };
}

gulp.task('rollup', rollupJS('index.ts', {
  basePath: './src/scripts/',
  format: 'umd',
  distPath: './docs/scripts/',
  sourcemap: true
}))

gulp.task('copy', function () {
  gulp.src(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'])
    .pipe(gulp.dest('docs/images'))
})

gulp.task('build', ['delete'], function () {
  return gulp.start('html', 'sass', 'rollup', 'copy')
})

gulp.task('default', ['delete'], function () {
  gulp.start('html', 'sass', 'rollup', 'copy')
  browserSync.init({
    port: (new Date).getFullYear(),
    server: {
      baseDir: ['docs']
    }
  })
  gulp.watch('src/**/*.ts', ['rollup'])
  gulp.watch('src/**/*.scss', ['sass'])
  gulp.watch('src/index.html', ['html'])
  gulp.watch(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'], ['copy'])
})

