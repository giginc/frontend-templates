# frontend-templates [pug利用]

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
- pug

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
