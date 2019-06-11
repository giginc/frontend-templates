const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
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
  IMAGEMIN: [
    pngquant('65-80'),
    mozjpeg({
      quality: 85,
      progressive: true,
    }),
    imagemin.svgo(),
    imagemin.optipng(),
    imagemin.gifsicle(),
  ],
  MINIFY_JS: true,
  MINIFY_CSS: true,
  MINIFY_IMG: true,
};

gulp.task('html-reload', (done) => {
  browserSync.reload();
  done();
});

gulp.task('js', () => gulp.src(`${options.SRC_PATH}/js/entries/**/*.js`)
  .pipe(plumber())
  .pipe(webpack(Object.assign({}, webpackConfig, { mode: 'development' })))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/js`)));

gulp.task('js-reload', gulp.series('js'), (done) => {
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
  gulp.watch([`${options.SRC_PATH}/**/*.html`], gulp.task('html-reload'));
  gulp.watch([`${options.SRC_PATH}/js/**/*.js`], gulp.task('js-reload'));
  gulp.watch([`${options.SRC_PATH}/scss/**/*.scss`], gulp.task('scss'));
  browserSync.init(options.BROWSERSYNC);
});

gulp.task('default', gulp.series(
  'scss',
  'js',
  'watch',
));

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
  .pipe(webpack(Object.assign({}, webpackConfig, { mode: 'production' })))
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/js`)));

gulp.task('minify:css', () => options.MINIFY_CSS && gulp
  .src(`${options.BUILD_PATH}/assets/css/**/*.css`)
  .pipe(cssmin())
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/css`)));

gulp.task('minify:img', () => options.MINIFY_IMG && gulp
  .src(`${options.BUILD_PATH}/assets/img/*`)
  .pipe(imagemin(options.IMAGEMIN, {
    verbose: true,
  }))
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/img`)));

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'minify:js',
  'minify:css',
  'minify:img',
));
