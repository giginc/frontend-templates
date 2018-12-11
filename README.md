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

自動コンパイル&ローカルサーバの起動&ライブリロード

```
$ npm run dev
```

## ビルドする

css, jsファイルを最適化して出力

```
$ npm run build
```

## デプロイする（未実装）

CIサービスと連携してステージング環境へデプロイする

```
$ npm run deploy
```

## よくある質問

### Q. JSファイルの名前を変更したり追加したい！

A. `src/js/entries`配下のjsファイルを編集・追加した後、`gulpfile.js`の`options.WEBPACK`項目を編集してください。

### Q. CSSファイルの名前を変更したり追加したい！

A. `src/scss/entries`配下のscssファイルを編集・追加してください。

## Todo

- [ ] 各種テンプレートを用意する（simple, pug, ejs, wordpress, aquamarine）
- [ ] コーディング規約をつくる
- [ ] CLIツールをつくる
