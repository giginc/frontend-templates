# frontend-templates

GIG inc のフロントエンド用テンプレートです。

## 特徴

- 必要最低限の構成
- css, jsファイルはページごとに管理・出力
- eslintによるコード矯正

## 構成

- webpack
- babel
- scss
- eslint(airbnb)
- gulp.js

## 開発を始める

`public`ディレクトリ配下の`index.html`を起点にローカルサーバが立ち上がります。  
`localhost:3000`でアクセスすることができ、ライブリロード&js, scssファイルの自動コンパイルが有効になります。

```
$ npm run dev
```

## 納品用にビルドする

`public/assets`配下のcss, jsファイルを圧縮して`dist/assets`へ出力します。

```
$ npm run build
```

## よくある質問

**Q. HTMLファイルの名前を変更したり追加したい！**  
A. `public`配下に.htmlを追加・編集してください。

**Q. JSファイルの名前を変更したり追加したい！**  
A. `src/js/entries`配下のjsファイルを編集・追加した後、`webpack.config.js`の`entry`項目を編集してください。

**Q. CSSファイルの名前を変更したり追加したい！**  
A. `src/scss/entries`配下のscssファイルを編集・追加してください。

**Q. JSライブラリってどうするの？**  
A. 複数のJSライブラリを共通して使用する場合は、CDNから`<script>`タグで配置してください。ページでしか使わない場合は`import`して使ってください。

**Q. 画像ファイルってどこに配置するの？**  
A. `public/assets/img`配下に設置してください。

**Q. なんで一つにバンドルせずページごとにCSSやJSを読み込むようにしたの？**  
A. HTTP/2の登場で1つにまとめたバンドルファイルよりも細かく機能ごとに分割して読み込ませたほうが高速化を見込めるからです。
