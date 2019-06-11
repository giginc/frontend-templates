const gulp = require('gulp');
const del = require('del');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const cssmin = require('gulp-cssmin');
const webpackConfig = require('./webpack.config');

const options = {
  SRC_PATH: './src',
  PUBLIC_PATH: './public',
  BUILD_PATH: './dist',
  AUTOPREFIXER: {
    cascade: false,
  },
  BROWSERSYNC: {
    server: './public',
    port: 3000,
    ghostMode: false,
    notify: false,
  },
  PUG: {
    pretty: true,
  },
  MINIFY_JS: true,
  MINIFY_CSS: true,
};

gulp.task('html-reload', ['pug'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('pug', () => gulp.src([`${options.SRC_PATH}/pug/entries/**/*.pug`, `!${options.SRC_PATH}/pug/**/_*.pug`])
  .pipe(plumber())
  .pipe(pug(options.PUG))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/`)));

gulp.task('js', () => gulp.src(`${options.SRC_PATH}/js/entries/**/*.js`)
  .pipe(plumber())
  .pipe(webpack(Object.assign({}, webpackConfig, { mode: 'development' })))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/js`)));

gulp.task('js-reload', ['js'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('scss', () => gulp.src(`${options.SRC_PATH}/scss/entries/**/*.scss`)
  .pipe(sassGlob())
  .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
  .pipe(autoprefixer(options.AUTOPREFIXER))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/css`))
  .pipe(browserSync.stream()));

gulp.task('watch', () => {
  watch([`${options.SRC_PATH}/pug/**/*.pug`], () => gulp.start(['html-reload']));
  watch([`${options.SRC_PATH}/js/**/*.js`], () => gulp.start(['js-reload']));
  watch([`${options.SRC_PATH}/scss/**/*.scss`], () => gulp.start(['scss']));
  browserSync.init(options.BROWSERSYNC);
});

gulp.task('default', () => {
  runSequence(
    'pug',
    'scss',
    'js',
    'watch',
  );
});

gulp.task('clean', () => del([
  options.BUILD_PATH,
]));

gulp.task('copy', () => gulp
  .src(`${options.PUBLIC_PATH}/**`, {
    base: options.PUBLIC_PATH,
  })
  .pipe(gulp.dest(options.BUILD_PATH)));

gulp.task('minify:js', () => options.MINIFY_JS && gulp.src(`${options.BUILD_PATH}/assets/js/**/*.js`)
  .pipe(plumber())
  .pipe(webpack(Object.assign({}, options.WEBPACK, { mode: 'production' })))
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/js`)));

gulp.task('minify:css', () => options.MINIFY_CSS && gulp
  .src(`${options.BUILD_PATH}/assets/css/**/*.css`)
  .pipe(cssmin())
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/css`)));


gulp.task('build', () => {
  runSequence(
    'clean',
    'copy',
    'minify:js',
    'minify:css',
  );
});
