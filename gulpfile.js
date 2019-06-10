const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const log = require('fancy-log');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const cssmin = require('gulp-cssmin');

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
  EJS: {
    config: '_config.json',
  },
  WEBPACK: {
    entry: {
      common: './src/js/entries/common.js',
      top: './src/js/entries/top.js',
      sample: './src/js/entries/sample.js',
    },
    output: {
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: ['babel-loader'],
          exclude: /node_modules/
        },
      ],
    },
  },
  MINIFY_JS: true,
  MINIFY_CSS: true,
};

gulp.task('ejs', () => {
  const configFile = `${options.SRC_PATH}/ejs/${options.EJS.config}`;

  fs.access(configFile, fs.R_OK | fs.W_OK, function (err) {
    const config = (err) ? {} : JSON.parse(fs.readFileSync(configFile, 'utf8'));
    return gulp.src(
      [
        `${options.SRC_PATH}/ejs/**/*.ejs`,
        `!${options.SRC_PATH}/ejs/**/_*.ejs`,
      ]
    )
      .pipe(plumber({
        errorHandler: function (_err) {
          log.error(_err);
          this.emit('end');
        }
      }))
      .pipe(ejs({
        config: config,
      }, {}, {
          ext: '.html'
        }))
      .pipe(gulp.dest(`${options.PUBLIC_PATH}`));
  });
});

gulp.task('html-reload', ['ejs'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('js', () => {
  return gulp.src(`${options.SRC_PATH}/js/entries/**/*.js`)
    .pipe(plumber())
    .pipe(webpack(Object.assign({}, options.WEBPACK, { mode: 'development' })))
    .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/js`));
});

gulp.task('js-reload', ['js'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('scss', () => {
  return gulp.src(`${options.SRC_PATH}/scss/entries/**/*.scss`)
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer(options.AUTOPREFIXER))
    .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/css`))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  watch([`${options.SRC_PATH}/ejs/**/*.ejs`], () => {
    return gulp.start(['html-reload']);
  });
  watch([`${options.SRC_PATH}/ejs/${options.EJS.config}`], () => {
    return gulp.start(['html-reload']);
  });
  watch([`${options.SRC_PATH}/js/**/*.js`], () => {
    return gulp.start(['js-reload']);
  });
  watch([`${options.SRC_PATH}/scss/**/*.scss`], () => {
    return gulp.start(['scss']);
  });
  browserSync.init(options.BROWSERSYNC);
});

gulp.task('default', () => {
  runSequence(
    'ejs',
    'scss',
    'js',
    'watch'
  );
});

gulp.task('clean', () => {
  return del([
    options.BUILD_PATH
  ]);
});

gulp.task('copy', () => {
  return gulp
    .src(`${options.PUBLIC_PATH}/**`, {
      base: options.PUBLIC_PATH
    })
    .pipe(gulp.dest(options.BUILD_PATH));
});

gulp.task('minify:js', () => {
  if (options.MINIFY_JS) {
    return gulp.src(`${options.BUILD_PATH}/assets/js/**/*.js`)
      .pipe(plumber())
      .pipe(webpack(Object.assign({}, options.WEBPACK, { mode: 'production' })))
      .pipe(gulp.dest(`${options.BUILD_PATH}/assets/js`));
  }
});

gulp.task('minify:css', () => {
  if (options.MINIFY_CSS) {
    return gulp
      .src(`${options.BUILD_PATH}/assets/css/**/*.css`)
      .pipe(cssmin())
      .pipe(gulp.dest(`${options.BUILD_PATH}/assets/css`));
  }
});

gulp.task('build', () => {
  runSequence(
    'clean',
    'copy',
    'minify:js',
    'minify:css'
  );
});
