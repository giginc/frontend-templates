# frontend-templates

GIG inc のフロントエンド用テンプレート（AMP）です。

## ダウンロード

- [ここからダウンロード](https://github.com/giginc/frontend-templates/archive/template/amp.zip)

## 特徴

- AMPのボイラープレート実装済み
- 必要最低限の構成
- 開発時はscssファイルを編集可能、ビルド時にインラインスタイルに自動書き換え

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

## 注意事項

`<link rel="stylesheet" href="/assets/css/amp.css">`のパスを変更した場合は、`gulpfile.js`の`options.AMP_CSS_FILENAME`を編集してください。

## よくある質問

**Q. HTMLファイルの名前を変更したり追加したい！**  
A. `public`配下に.htmlを追加・編集してください。

**Q. JSファイルの名前を変更したり追加したい！**  
A. `src/js/entries`配下のjsファイルを編集・追加した後、
`npm run dev`し直してローカルサーバーを再起動させてください。

**Q. CSSファイルの名前を変更したり追加したい！**  
A. `src/scss/entries`配下のscssファイルを編集・追加してください。

**Q. JSライブラリってどうするの？**  
A. 複数のJSライブラリを共通して使用する場合は、CDNから`<script>`タグで配置してください。ページでしか使わない場合は`import`して使ってください。

**Q. 画像ファイルってどこに配置するの？**  
A. `public/assets/img`配下に設置してください。

**Q. なんで一つにバンドルせずページごとにCSSやJSを読み込むようにしたの？**  
A. HTTP/2の登場で1つにまとめたバンドルファイルよりも細かく機能ごとに分割して読み込ませたほうが高速化を見込めるからです。
