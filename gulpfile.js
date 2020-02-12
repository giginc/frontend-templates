// モジュールの読み込み
const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const log = require('fancy-log');
const plumber = require('gulp-plumber');
const ejs = require('gulp-ejs');
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


//
// ----- 設定 -----
//
// * 必要であれば変更可能
// * 変更を加えた際はREADME.mdに追記すること
//
const options = {
  // コンパイル用に入力するディレクトリを指定
  SRC_PATH: './src',

  // ビルドしたファイルを出力するディレクトリを指定
  BUILD_PATH: './dist',

  // ローカルサーバーで監視するディレクトリを指定
  PUBLIC_PATH: './public',

  // Autoprefixerの設定
  // https://github.com/postcss/autoprefixer
  AUTOPREFIXER: {
    cascade: false,
  },

  // BrowserSyncの設定
  // https://www.browsersync.io/docs
  BROWSERSYNC: {
    server: './public',
    port: 3000,
    ghostMode: false,
    notify: false,
  },

  // EJSの設定
  EJS: {
    config: '_config.json', // EJSの設定ファイル名
  },

  // imageminの設定
  // https://github.com/sindresorhus/gulp-imagemin
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

  // ビルド時にJSを圧縮する
  MINIFY_JS: true,

  // ビルド時にCSSを圧縮する
  MINIFY_CSS: true,

  // ビルド時に画像を圧縮する
  MINIFY_IMG: true,
};


//
// ----- 開発用タスク -----
//
// * $ npm run dev で実行
// * ローカルサーバーの起動、オートコンパイル、ライブリロード
//

// EJSのコンパイル
gulp.task('ejs', (done) => {
  const configFile = `${options.SRC_PATH}/ejs/${options.EJS.config}`;

  fs.access(configFile, fs.R_OK || fs.W_OK, (err) => {
    const config = (err) ? {} : JSON.parse(fs.readFileSync(configFile, 'utf8'));

    gulp.src(
      [
        `${options.SRC_PATH}/ejs/**/*.ejs`,
        `!${options.SRC_PATH}/ejs/**/_*.ejs`,
      ],
    )
      .pipe(plumber({
        errorHandler: (_err) => {
          log.error(_err);
          this.emit('end');
        },
      }))
      .pipe(ejs({
        config,
      }, {}, {
        ext: '.html',
      }))
      .pipe(gulp.dest(`${options.PUBLIC_PATH}`));

    done();
  });
});

// HTMLファイルが変更された際にブラウザをリロードする
gulp.task('html:reload', (done) => {
  browserSync.reload();
  done();
});

// ES6->ES5へのトランスパイル
gulp.task('js', () => gulp.src(`${options.SRC_PATH}/js/entries/**/*.js`)
  .pipe(plumber())
  .pipe(webpack(Object.assign({}, webpackConfig, {
    mode: 'development',
  })))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/js`)));

// JSファイルが変更されたブラウザをリロードする
gulp.task('js:reload', (done) => {
  browserSync.reload();
  done();
});

// SCSS->CSSへのコンパイル
gulp.task('scss', () => gulp.src(`${options.SRC_PATH}/scss/entries/**/*.scss`)
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(autoprefixer(options.AUTOPREFIXER))
  .pipe(gulp.dest(`${options.PUBLIC_PATH}/assets/css`))
  .pipe(browserSync.stream()));

// 各種アセットファイルの変更を監視する
gulp.task('watch', () => {
  gulp.watch([`${options.SRC_PATH}/ejs/**/*.ejs`], gulp.series('ejs', 'html:reload'));
  gulp.watch([`${options.SRC_PATH}/js/**/*.js`], gulp.series('js', 'js:reload'));
  gulp.watch([`${options.SRC_PATH}/scss/**/*.scss`], gulp.task('scss'));
  browserSync.init(options.BROWSERSYNC);
});

// HTML, CSS, JSディレクトリを削除
gulp.task('clean:assets', () => del([
  `${options.PUBLIC_PATH}/**/*.html`,
  `${options.PUBLIC_PATH}/assets/js`,
  `${options.PUBLIC_PATH}/assets/css`,
]));

// 初期化用
gulp.task('default', gulp.series(
  'clean:assets',
  'ejs',
  'scss',
  'js',
  'watch',
));


//
// ----- ビルド用タスク -----
//
// * $ npm run build で実行
// * アセットファイルの圧縮
// * 基本的にこのコマンドで生成されたものを納品する
//

// 既存の`dist`ディレクトリを削除する
gulp.task('clean:dist', () => del([
  options.BUILD_PATH,
]));

// `public`ディレクトリから`dist`ディレクトリへファイルをコピーする
gulp.task('copy', () => gulp
  .src(`${options.PUBLIC_PATH}/**`, {
    base: options.PUBLIC_PATH,
  })
  .pipe(gulp.dest(options.BUILD_PATH)));

// JSを圧縮する
gulp.task('minify:js', () => options.MINIFY_JS && gulp.src(`${options.BUILD_PATH}/assets/js/**/*.js`)
  .pipe(plumber())
  .pipe(webpack(Object.assign({}, webpackConfig, {
    mode: 'production',
  })))
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/js`)));

// CSSを圧縮する
gulp.task('minify:css', () => options.MINIFY_CSS && gulp
  .src(`${options.BUILD_PATH}/assets/css/**/*.css`)
  .pipe(cssmin())
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/css`)));

// 画像を圧縮する
gulp.task('minify:img', () => options.MINIFY_IMG && gulp
  .src(`${options.BUILD_PATH}/assets/img/*`)
  .pipe(imagemin(options.IMAGEMIN, {
    verbose: true,
  }))
  .pipe(gulp.dest(`${options.BUILD_PATH}/assets/img`)));

// 初期化用
gulp.task('build', gulp.series(
  'clean:dist',
  'copy',
  'minify:js',
  'minify:css',
  'minify:img',
));
