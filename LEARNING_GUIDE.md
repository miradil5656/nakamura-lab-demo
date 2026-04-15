# このプロジェクトで学べること

QND Lab Website Rebuild プロジェクトは「実際に動く大学研究室サイトを作る」という具体的なゴールを持った学習素材です。
フロントエンド開発・インフラ・コンテンツ管理・国際化まで幅広くカバーしています。

---

## 1. 静的サイトジェネレータ（Hugo）

### 学べること
- Hugo のディレクトリ構造（`layouts/`, `content/`, `data/`, `static/`, `assets/`, `i18n/`）
- Go Templates の書き方（`{{ range }}`, `{{ if }}`, `{{ with }}`, `{{ partial }}`）
- Front matter（Markdownファイルの先頭メタデータ）の活用
- データ駆動レンダリング（`data/publications.yaml` → HTML に自動変換）
- Hugo Pipes（`resources.Get | resources.PostCSS | minify | fingerprint`）
- Archetype（`hugo new` コマンドで使うテンプレート）

### このプロジェクトでの具体例
```
layouts/partials/header.html  → 全ページ共通ヘッダーテンプレート
layouts/publications/list.html → YAML データを論文リストとして描画
i18n/ja.yaml / en.yaml        → 翻訳キーの定義と {{ i18n "key" }} 呼び出し
```

### 参考リソース
- https://gohugo.io/getting-started/quick-start/
- https://gohugo.io/templates/introduction/

---

## 2. Tailwind CSS

### 学べること
- ユーティリティファーストの考え方（クラス名でスタイルを直接指定する）
- レスポンシブ修飾子（`sm:`, `md:`, `lg:` プレフィックス）
- `tailwind.config.js` でのカラーパレット・フォント拡張
- JIT（Just-in-Time）モードと PurgeCSS による未使用スタイル削除
- `@apply` ディレクティブでクラスを再利用する方法

### このプロジェクトでの具体例
```html
<!-- モバイルは1列、デスクトップは3列のグリッド -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
```

### 参考リソース
- https://tailwindcss.com/docs/utility-first
- https://tailwindcss.com/docs/responsive-design

---

## 3. 多言語対応（i18n）

### 学べること
- パスベースの言語ルーティング（`/ja/` vs `/en/`）
- `hreflang` タグ（検索エンジンへの言語関連付け）
- `x-default` の意味と設定方法
- 翻訳キーファイルの管理と欠落キー検出
- `defaultContentLanguage` の挙動（`/ja/` を `/` として表示する方法）

### このプロジェクトでの具体例
```yaml
# i18n/ja.yaml
nav.research: "研究内容"
nav.members: "メンバー"

# i18n/en.yaml
nav.research: "Research"
nav.members: "Members"
```
```html
<!-- テンプレートで使う -->
<a href="{{ .URL }}">{{ i18n "nav.research" }}</a>
```

---

## 4. コンテンツ管理システム（Decap CMS）

### 学べること
- ヘッドレスCMSとは何か（コンテンツ管理 ≠ サーバー必須）
- Git-based CMS の仕組み（ブラウザで編集 → GitHubにコミット → サイト自動再ビルド）
- `config.yml` でのコレクション定義（フォールド型 vs ファイル型）
- GitHub OAuth の仕組み（コールバックURL・クライアントID/シークレット）
- なぜ GitHub Pages では Decap CMS の OAuth が動かないか（サーバーサイドトークン交換が必要）

### このプロジェクトでの具体例
- `static/admin/config.yml` — ニュース・メンバー・論文の編集フォームを定義
- Cloudflare Pages を選んだ理由の1つが「Decap CMS の OAuth を追加設定なしで使えるから」

---

## 5. SEO・構造化データ

### 学べること
- OGP タグ（`og:title`, `og:image` など）— SNS でリンクを貼ったときのプレビュー制御
- JSON-LD（Googleが読む構造化データ）— `Organization`, `Person`, `ScholarlyArticle`
- Google Scholar メタタグ（`citation_title`, `citation_doi` など）
- hreflang と canonical URL の違いと使い分け
- `sitemap.xml` と `robots.txt` の役割

### このプロジェクトでの具体例
```html
<!-- 論文ページの Google Scholar 向けメタタグ -->
<meta name="citation_title" content="Signature of spin-resolved...">
<meta name="citation_doi" content="10.1021/acs.nanolett.xxxxx">
```

---

## 6. パフォーマンス最適化

### 学べること
- Lighthouse スコアの読み方（Performance / Accessibility / SEO / Best Practices）
- Core Web Vitals（FCP, LCP, CLS, INP）— Googleの検索ランキング指標
- `<picture>` 要素と WebP 変換（ブラウザ対応に応じたフォーマット切替）
- `srcset` と `sizes` 属性（解像度に応じた画像配信）
- `font-display: swap` と `preconnect`（Web フォントの読み込み最適化）
- `loading="lazy"` と `decoding="async"`（スクロール外画像の遅延読み込み）

### 目標値
| 指標 | モバイル | デスクトップ |
|---|---|---|
| Lighthouse Performance | ≥ 90 | ≥ 95 |
| Lighthouse Accessibility | ≥ 85 | ≥ 85 |
| First Contentful Paint | — | ≤ 1.0s |

---

## 7. アクセシビリティ（WCAG 2.1 AA）

### 学べること
- WCAG とは何か（Web Content Accessibility Guidelines）
- AA レベルの主要要件（コントラスト比 4.5:1、キーボード操作、alt 属性）
- ARIA ランドマーク（`<nav>`, `<main>`, `<footer>`, `aria-label`）
- フォーカスインジケータの重要性（Tab キーで操作する人のため）
- `axe-core` / `pa11y` による自動テストの使い方

### このプロジェクトでの具体例
- CI で `pa11y-ci` を実行して WCAG 2.1 AA 違反があればビルドを失敗させる
- 全画像に空でない具体的な `alt` 属性（例: `alt="SEM image of quantum point contact device"`）

---

## 8. CI/CD（GitHub Actions）

### 学べること
- GitHub Actions の基本構造（`on:`, `jobs:`, `steps:`）
- トリガーの種類（`push`, `pull_request`, パスフィルター）
- `peaceiris/actions-hugo` で Hugo extended をCIにインストールする方法
- artifact の upload/download（ビルド成果物を次のジョブに渡す）
- Cloudflare Pages へのデプロイ方法（`cloudflare/pages-action`）
- Lighthouse CI (`@lhci/cli`) の CI 組み込みと閾値設定

### CI パイプライン全体像
```
push to main
  └─ build ジョブ
       ├─ npm ci
       ├─ hugo --minify
       ├─ pagefind --site public
       └─ artifact upload
  └─ quality ジョブ (build 後)
       ├─ htmltest（リンク切れチェック）
       ├─ lhci autorun（Lighthouse CI）
       └─ pa11y-ci（アクセシビリティ）
  └─ deploy ジョブ (quality 後)
       └─ Cloudflare Pages デプロイ
```

---

## 9. 静的検索（Pagefind）

### 学べること
- クライアントサイド検索の仕組み（サーバー不要、ビルド時にインデックス生成）
- `data-pagefind-body` / `data-pagefind-ignore` / `data-pagefind-filter` 属性
- 日本語の形態素解析の難しさ（単語の区切りが英語と違う）
- Algolia DocSearch（無料の学術サイト向けプランの存在）

---

## 10. TypeScript スクリプト（DOI パイプライン）

### 学べること
- `fetch()` API を使った外部 REST API の呼び出し（CrossRef API）
- アトミックファイル書き込み（クラッシュ耐性のある安全なファイル更新）
- YAML のパースと生成（`js-yaml` ライブラリ）
- `npx tsx` でTypeScriptを直接実行する方法

### このプロジェクトでの具体例
```bash
# DOI を渡すだけで publications.yaml に追記される
npx tsx scripts/add-pub.ts 10.1021/acs.nanolett.1c03521
```

---

## 11. デプロイ・ホスティング戦略

### 学べること
- GitHub Pages vs Cloudflare Pages の違い（機能・制約・パフォーマンス）
- `_redirects` ファイルによる 301 リダイレクト設定
- Hugo の `baseURL` とサブパス配信（`/nano/qnd/` に配置する場合の設定）
- Brotli 圧縮と HTTP/2（Cloudflare が自動提供するもの）
- DNS / リバースプロキシの仕組み（大学サーバーから Cloudflare Pages に転送する方法）

---

## 学習の順番（おすすめ）

```
Hugo 基礎（1週間）
   ↓
Tailwind CSS（3日）
   ↓
このプロジェクトの Phase 1〜2 を実装
   ↓
i18n・SEO（Phase 2〜5 を実装しながら学ぶ）
   ↓
GitHub Actions CI/CD（Phase 7 で実践）
   ↓
Decap CMS・OAuth の仕組み（Phase 2.5 で実践）
```

---

## このプロジェクトが特に学習に向いている理由

- **実用的なゴールがある** — 動く大学サイトという具体的なアウトプット
- **全フェーズに検証基準がある** — 「動いた / 動かない」が明確
- **日英バイリンガルが要件** — i18n は後から追加すると高コスト。最初から設計する経験が得られる
- **CI/CD まで含む** — 「作って終わり」ではなく「継続的に動かす」完全な開発サイクルを体験できる
- **非エンジニアへの引き継ぎ** — 技術選定の理由を説明する力が身につく（なぜ WordPress でなく Hugo なのか、等）
