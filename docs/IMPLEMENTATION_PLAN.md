# 実装計画：QND Lab Website (Hugo + Tailwind CSS)

**プロジェクト:** 千葉大学 量子ナノデバイス研究グループ（青木研究室）ホームページ再開発  
**作成日:** 2026-04-08  
**ステータス:** 計画中（未着手）

---

## 概要

現行の2018年製静的HTMLサイトを、Hugo + Tailwind CSS で再構築する。  
現在のディレクトリ `/Users/m99/Desktop/projects/openclaw` には設計書とエージェント定義のみ存在し、Hugoプロジェクトファイルは一切存在しない（グリーンフィールド実装）。

---

## フェーズ一覧

| フェーズ | 内容 | 検証基準 |
|---|---|---|
| Phase 1 | Hugoプロジェクト初期化・Tailwind CSS設定 | `hugo server` が起動する |
| Phase 2 | 共通レイアウト・i18n基盤 | `/` と `/en/` で言語切替が動作 |
| Phase 3 | データファイル・コンテンツページ作成 | 全ページが404なく表示 |
| Phase 4 | ページ固有テンプレート | 全セクションが正しいレイアウトで表示 |
| Phase 5 | SEO・構造化データ・パフォーマンス最適化 | Lighthouse 95+達成 |
| Phase 6 | Pagefind検索統合 | 日英両方で検索結果が表示 |
| Phase 7 | GitHub Actions CI/CD・デプロイ設定 | mainへのpushで自動デプロイ |

---

## Phase 1：Hugoプロジェクト初期化・Toolchain設定

**目標:** `hugo server` がエラーなく起動し、空白ページを配信する。

### 1.1 Hugoプロジェクト初期化
- ファイル: `hugo.toml`
- `hugo new site . --force` を実行（ディレクトリが非空のため `--force` 必要）
- 設定内容:
  - `baseURL = "https://adv.chiba-u.jp/nano/qnd/"`
  - `defaultContentLanguage = "ja"`
  - `defaultContentLanguageInSubdir = false`（日本語を `/` に、英語を `/en/` に配置）
  - `[languages.ja]` `weight = 1` / `[languages.en]` `weight = 2`（ナビトグルの JP/EN 順を固定）
  - `[markup.goldmark.renderer]` で `unsafe = true`
  - `[outputs]` に `home = ["HTML", "RSS", "JSON"]`（Pagefind用JSON）
  - `enableRobotsTXT = true`
  - `[sitemap]` 設定

### 1.2 Tailwind CSS + Hugo Pipes設定
- ファイル: `package.json`, `tailwind.config.js`, `postcss.config.js`, `assets/css/main.css`
- devDependencies: `tailwindcss`, `postcss`, `postcss-cli`, `autoprefixer`
- `tailwind.config.js` のコンテンツパス: `layouts/**/*.html`, `content/**/*.md`
- カラーパレット定義: primary `#006633`、accent `#1a1a2e`、base `#ffffff`、light `#f5f7fa`
- フォント定義: `"Noto Sans JP"`、`"Inter"`
- `assets/css/main.css` に Tailwind ディレクティブ（`@tailwind base/components/utilities`）
- **注意:** Hugo Pipes + PostCSS には Hugo extended edition が必要

### 1.3 ディレクトリ構造作成
```
archetypes/
assets/css/
assets/js/
content/news/
content/research/
content/en/news/
content/en/research/
data/
i18n/
layouts/_default/
layouts/partials/
layouts/shortcodes/
static/images/members/
static/images/facilities/
static/images/research/
static/images/og/
```

### 1.4 `.gitignore` 作成
- 対象: `public/`, `resources/`, `node_modules/`, `.hugo_build.lock`, `pagefind/`

### 1.5 Gitリポジトリ初期化
- `git init` → 初期コミット

**リスク:** Low  
**検証:** `npm install && hugo server` が正常起動すること

---

## Phase 2：共通レイアウト・i18n基盤

**目標:** `localhost:1313` と `localhost:1313/en/` でスタイル済みのページ骨格と言語切替が動作する。

### 2.1 ベースレイアウト
- ファイル: `layouts/_default/baseof.html`
- HTML5テンプレート、`<html lang="{{ .Language.Lang }}">`, headブロック
- Hugo Pipes でCSS処理: `resources.Get "css/main.css" | resources.PostCSS | minify | fingerprint`

### 2.2 headパーシャル
- ファイル: `layouts/partials/head.html`
- `<title>` / `<meta name="description">`
- OGPタグ: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`
- Twitter Card タグ
- `hreflang` リンク（ja / en / x-default）
- `canonical` URL
- Google Fonts preconnect（Noto Sans JP / Inter）

### 2.3 ヘッダー・ナビゲーションパーシャル
- ファイル: `layouts/partials/header.html`
- ロゴ（左）、ナビゲーション7項目（中央）、言語トグルJP/EN（右）
- ナビテキストは `{{ i18n "nav.xxx" }}` で多言語化
- モバイル: ハンバーガーメニュー（Alpine.js またはバニラJS）
- スティッキーヘッダー

### 2.4 フッターパーシャル
- ファイル: `layouts/partials/footer.html`
- 千葉大学ロゴ、研究室連絡先、住所、関連リンク、`Copyright {{ now.Year }}`

### 2.5 i18n翻訳ファイル
- ファイル: `i18n/ja.yaml`, `i18n/en.yaml`
- キー構造: `nav.*`, `hero.*`, `footer.*`, `research.*`, `members.*`, `publications.*`, `facilities.*`, `news.*`, `access.*`, `common.*`

### 2.6 デフォルトテンプレート
- ファイル: `layouts/_default/list.html`, `layouts/_default/single.html`
- 最小限のリスト・シングルテンプレート（baseof.html を継承）

### 2.7 404ページ
- ファイル: `layouts/404.html`

**リスク:** Medium（hreflangロジック、モバイルメニューJS）  
**検証:** 言語切替が全ページで動作すること

---

## Phase 2.5：Decap CMS（コンテンツ管理UI）

**目標:** `/admin` でブラウザベースの編集フォームが起動し、GitHubにコミットできる。

**背景:** GitHub Web UI + 生YAML編集は、物理系大学院生が最初のYAMLインデントエラーでつまずいた後に更新を停止するという既知の失敗パターン（academic lab GitHub repos における "launch burst → 18-24ヶ月沈黙" パターン）。Decap CMSのブラウザフォームUIがこのリスクを排除する。

### 2.5.1 静的ファイル配置
- `static/admin/index.html` — Decap CMS のエントリーポイント（CDN経由読み込み）
- `static/admin/config.yml` — コレクション定義

### 2.5.2 config.yml 最小構成
```yaml
backend:
  name: github
  repo: [owner]/[repo-name]
  branch: main

media_folder: static/images/uploads
public_folder: /images/uploads

collections:
  - name: news
    label: ニュース
    folder: content/news
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: タイトル, name: title, widget: string }
      - { label: 日付, name: date, widget: datetime }
      - { label: カテゴリ, name: categories, widget: list }
      - { label: 本文, name: body, widget: markdown }

  - name: members
    label: メンバー
    folder: content/members
    create: true
    slug: "{{fields.name_en | slugify}}"
    fields:
      - { label: 日本語名, name: name_ja, widget: string }
      - { label: 英語名, name: name_en, widget: string }
      - { label: 役職(JP), name: title_ja, widget: string }
      - { label: 役職(EN), name: title_en, widget: string }
      - { label: メール(_at_形式), name: email, widget: string }
      - { label: 種別, name: role, widget: select, options: [staff, student, alumni] }
      - { label: 入学年度, name: year, widget: number, required: false }
      - { label: 写真, name: photo, widget: image, required: false }
      - { label: ORCID iD, name: orcid, widget: string, required: false }

  # publications: file collection (単一YAMLファイル管理)
  # folder collectionではなくfile collectionを使用 — 数百件の論文を個別ファイルで管理すると
  # Decap CMS UIが重くなりmerge conflictも発生しやすい
  files:
    - name: publications
      label: 論文リスト
      file: data/publications.yaml
      fields:
        - name: publications
          label: 論文一覧
          widget: list
          fields:
            - { label: タイトル, name: title, widget: string }
            - { label: 著者, name: authors, widget: list }
            - { label: ジャーナル, name: journal, widget: string }
            - { label: 年, name: year, widget: number }
            - { label: DOI, name: doi, widget: string, required: false }
            - { label: カテゴリ, name: category, widget: select, options: [journal, conference] }
```

### 2.5.3 GitHub OAuth 設定（Cloudflare Pages 前提）
- GitHub App または OAuth App を作成
- Callback URL: `https://[your-project].pages.dev`（パスなし — Next.jsの `/api/auth/callback/github` パスは静的サイトには存在しない）
- **重要:** `backend.name: github` は Cloudflare Pages ドメインを OAuth コールバックとして直接受け付ける。GitHub Pages では動作しない（サーバーサイドトークン交換が必要）
- `client_id` / `client_secret` を Cloudflare Pages の環境変数に設定
- `static/admin/config.yml` に以下を追加:
  - `site_url: https://adv.chiba-u.jp/nano/qnd/`
  - `display_url: https://adv.chiba-u.jp/nano/qnd/`
  （サブパスデプロイ時のメディアパス解決とプレビューリンクの修正）

**リスク:** Medium（GitHub OAuth 設定ミスで `/admin` がループする）  
**検証:** `/admin` で GitHub ログイン → ニュース下書き作成 → GitHubリポジトリにコミットが作成されること

---

## Phase 3：データファイル・コンテンツページ

**目標:** 全ページが404なく、実コンテンツ付きで表示される。

### 3.1 メンバーデータ

> **⚠️ アーキテクチャ注意:** Phase 2.5 で Decap CMS を導入したため、メンバーデータは単一の `data/members.yaml` ではなく、**1人1ファイルの Markdown** として `content/members/` に配置する。Decap CMS の folder collection は大量エントリを個別ファイルで管理することで CMS UI が扱いやすい（15件以上のメンバーを単一YAMLで編集すると インデントエラーのリスクが高い）。

- ファイル: `content/members/[name-en].md`（1人1ファイル）
- Front matter フィールド: `name_ja`, `name_en`, `title_ja`, `title_en`, `email`（`_at_`形式）, `role`（staff/student/alumni）, `year`（入学年度）, `photo`, `orcid`（任意 — ORCID iD バッジ用）
- 現行サイト `members.html` からデータ抽出して各ファイルを生成
- **Phase 4.3 テンプレート注意:** メンバー一覧は `{{ $members := .Site.Data.members }}` ではなく `{{ range where .Site.RegularPages "Section" "members" }}` で取得する（データソース変更）
- alumni はデータが揃っている場合のみ `content/members/` に作成し、足りない場合は `data/alumni.yaml` で補完可

### 3.2 論文データ
- ファイル: `data/publications.yaml`（単一YAMLファイル — `content/publications/` の個別ファイル管理は採用しない）
- フィールド: title, authors（配列）, journal, volume, issue, pages, year, doi, category
- 年度降順でソート
- **テンプレート参照:** `{{ range .Site.Data.publications }}` ... `{{ .doi }}`

### 3.2.1 DOI → YAML 自動取得スクリプト
- ファイル: `scripts/add-pub.ts`
- **目的:** 手動YAML入力をゼロにする。DOIを渡すだけでCrossRef APIが全フィールドを埋める。
- 実行方法: `npx tsx scripts/add-pub.ts 10.1021/acs.nanolett.xxxxx`
- 処理フロー:
  1. `https://api.crossref.org/works/{doi}` を fetch（無認証・無料）
  2. レスポンスを `data/publications.yaml` の書式に変換
  3. **重複チェック:** DOI が既存エントリに存在する場合は `--force` フラグなしで終了（重複防止）
  4. **フィールドバリデーション:** `title` と `author` がレスポンスに存在しない場合はエラー終了（CrossRefスキーマ変動対応）
  5. **アトミック書き込み:** `data/publications.yaml.tmp` に書いてバリデーション後にリネーム（YAML破損防止）
  6. 年度降順で再ソートして既存ファイルに追記
- CrossRef は DOI が正式登録されれば全フィールドを返す（著者・ジャーナル・ページ・年を含む）
- **エラーハンドリング:** DOI が見つからない場合は標準エラーに出力してゼロ修正で終了（YAML は変更しない）

### 3.2.2 add-pub.ts テストスイート
- ファイル: `scripts/add-pub.test.ts`（Bun test runner）
- テストケース:
  1. 有効な DOI → `data/publications.yaml` に正しいエントリが追記される
  2. 重複 DOI → ファイル変更なしでエラーメッセージを出力して終了
  3. CrossRef 404（未登録 DOI） → ファイル変更なしでエラーメッセージを出力して終了
  4. CrossRef レスポンスに `title` フィールドなし → フィールドバリデーションエラーで終了

### 3.3 研究設備データ
- ファイル: `data/facilities.yaml`
- フィールド: name_ja, name_en, category（fabrication/evaluation）, description_ja, description_en, photo

### 3.4 トップページコンテンツ
- ファイル: `content/_index.md`, `content/en/_index.md`
- 研究グループ概要テキスト（現行 `index.html` から抽出）

### 3.5 研究内容ページ（4テーマ）
- ファイル: `content/research/_index.md` + 4ファイル（日英各）
  - `vdw-heterostructure.md`（ファンデルワールスヘテロ接合）
  - `quantum-devices.md`（量子ポイントコンタクト・量子ドット）
  - `tmd-devices.md`（TMDデバイス / MoTe2）
  - `scanning-probe.md`（走査プローブ顕微法・ナノ加工）

### 3.6〜3.9 各セクションページ
- `content/members/_index.md`（front matter のみ、レンダリングはYAML駆動）
- `content/publications/_index.md`
- `content/facilities/_index.md`
- `content/access/_index.md`（住所・交通案内・Google Maps embed）
- 英語ミラー: `content/en/` 以下に同構成

### 3.10 ニュース記事（サンプル）
- ファイル: `content/news/YYYY-MM-DD-slug.md` × 5〜10件
- カテゴリ混在: 論文発表、受賞、イベント、メンバー

### 3.11 ニュースArchetype
- ファイル: `archetypes/news.md`
- `hugo new news/YYYY-MM-DD-slug.md` で自動展開

**リスク:** Medium（現行サイトのコンテンツが2021年で停止 → `draft: true` で管理）  
**検証:** 全URLが200を返すこと

---

## Phase 4：ページ固有テンプレート

**目標:** 全セクションが設計書通りのレイアウトで表示される。

### 4.1 トップページテンプレート
- ファイル: `layouts/index.html`
- Hero セクション（背景画像 + オーバーレイ + CTA）
- 研究カード4枚（レスポンシブグリッド）
- 最新ニュース5件（`{{ range first 5 (where .Site.RegularPages "Section" "news") }}`）
- アクセスサマリー

### 4.2 研究内容テンプレート
- ファイル: `layouts/research/list.html`, `layouts/research/single.html`
- 左サイドナビ（テーマ一覧）+ メインエリア
- モバイル: サイドナビがアコーディオン化

### 4.3 メンバーテンプレート
- ファイル: `layouts/members/list.html`
- `{{ range where .Site.RegularPages "Section" "members" }}` で取得（`data/members.yaml` は使用しない — Phase 3.1 参照）
- `{{ where $pages ".Params.role" "staff" }}` / `"student"` / `"alumni"` でセクション分割
- Staff: 写真カード + ORCID バッジ（`orcid` フィールドが存在する場合のみ表示 `<a href="https://orcid.org/{{ .Params.orcid }}">`）
- Students: コンパクトリスト（入学年度でソート）
- Alumni: 卒業年別グループ
- メールの難読化（CSS または JSデコード）

### 4.4 論文テンプレート
- ファイル: `layouts/publications/list.html`
- データソース: `{{ range .Site.Data.publications }}` (`data/publications.yaml` — `.md` ファイルではない)
- 年度フィルタ・カテゴリフィルタ（バニラJS、`data-year` / `data-category` 属性）
- DOIリンク自動生成: `https://doi.org/{{ .doi }}`（`.Params.doi` ではなく `.doi` — YAML データアクセス）
- no-JS フォールバック（全件表示）

### 4.5 研究設備テンプレート
- ファイル: `layouts/facilities/list.html`
- 作製装置 / 評価設備 タブ切替
- グリッド（3列→2列→1列）
- Lightbox: GLightbox（〜2KB gzipped）

### 4.6 ニューステンプレート
- ファイル: `layouts/news/list.html`, `layouts/news/single.html`
- タイムライン表示 + カテゴリフィルタ + Hugo ページネーション

### 4.7 アクセステンプレート
- ファイル: `layouts/page/single.html`（`layouts/access/list.html` ではない — アクセスページはリストではなく単一ページ）
- `content/access/_index.md` に `type: page` を設定すること
- 2カラム（地図 + テキスト）
- Google Maps iframe または OpenStreetMap（Leaflet）

### 4.8 ショートコード
- `layouts/shortcodes/figure.html`（キャプション付き画像、Lightbox対応）
- `layouts/shortcodes/doi-link.html`
- `layouts/shortcodes/email.html`（`_at_` → アイコン変換）
- `layouts/shortcodes/news-badge.html`

**リスク:** Medium  
**検証:** 全ページを3ブレークポイント（1200px+/768px-1199px/<768px）で目視確認

---

## Phase 5：SEO・構造化データ・パフォーマンス最適化

**目標:** Lighthouse Performance 95+、FCP 1.0秒以下。

### 5.1 JSON-LD構造化データ
- ファイル: `layouts/partials/json-ld.html`, `json-ld-article.html`, `json-ld-publication.html`
- スキーマ:
  - 全ページ: `ResearchOrganization`（parentOrganization: 千葉大学）
  - メンバーページ: `Person`
  - 論文ページ: `ScholarlyArticle`
  - 全ページ: `BreadcrumbList`

### 5.2 Google Scholar メタタグ
- ファイル: `layouts/partials/citation-meta.html`
- `citation_title`, `citation_author`, `citation_publication_date`, `citation_journal_title`, `citation_doi`
- 論文セクションのみ条件付き出力

### 5.3 robots.txt・sitemap
- `enableRobotsTXT = true`（hugo.toml設定済み）
- サイトマップに全言語バリアント + hreflang を含める

### 5.4 画像最適化パイプライン
- ファイル: `layouts/partials/image.html`
- **デュアルパス対応（重要）:** 画像ソースが2種類あるため、パーシャルで分岐処理が必要:
  - `assets/images/` の画像（コンテンツ静的画像）: `resources.Get` → Hugo Pipes → WebP + `<picture>` 要素
  - `static/images/uploads/` の画像（Decap CMS アップロード）: Hugo Pipes 不可 → 通常の `<img>` タグのみ
  - 判定: パスが `/images/uploads/` で始まる場合は `<img loading="lazy">` を使用、それ以外は Hugo Pipes パイプライン
  - CMS アップロード画像は `calibreapp/image-actions`（Phase 7.3.4）が圧縮を担当
- Hugo Pipes パス: 多解像度（400/800/1200px）+ WebP変換
- `<picture>` 要素（WebP + JPG fallback）
- `srcset`, `sizes`, `loading="lazy"`, `decoding="async"`, `alt` 必須

### 5.5 フォント最適化
- `<link rel="preconnect">` for fonts.googleapis.com / fonts.gstatic.com
- Google Fonts URL: `&display=swap&subset=japanese` を付加（Google Fonts が必要なUnicodeブロックのみ自動サブセット配信）
- Noto Sans JP: weight 400/700 のみ（ファイルサイズ削減）
- **注意:** モバイル Lighthouse ≥ 80 の目標で、Google Fonts CDN のレスポンス変動を許容。もし < 80 の場合は `fontsource/noto-sans-jp` npm パッケージによるセルフホスティングを検討する

### 5.6 CSS/JS minify
- `hugo.toml` に `[minify]` 設定
- ビルドコマンド: `hugo --minify`
- Tailwind JIT モードで未使用CSS自動削除

**リスク:** Medium（WebPにはHugo extended必須、日本語フォントサイズ問題）  
**検証:** Lighthouse Performance 95+、Accessibility 90+、SEO 95+

---

## Phase 6：Pagefind検索統合

**目標:** 日英両方でキーワード検索が機能する。

### 6.1 Pagefindインストール・設定
- `package.json` に `pagefind` 追加
- ビルドスクリプト: `"build": "hugo --minify && npx pagefind --site public"`
- 日本語対応: `--force-language ja` オプション

### 6.2 検索UIコンポーネント
- ファイル: `layouts/partials/search.html`
- Pagefind UI（CSS + JS）埋め込み
- `new PagefindUI({ element: "#search", showSubResults: true })`

### 6.3 Pagefindデータ属性設定
- メインコンテンツ: `data-pagefind-body`
- ナビ・フッター: `data-pagefind-ignore`
- 構造化メタデータ: `data-pagefind-meta`
- ニュースカテゴリ: `data-pagefind-filter`

**リスク:** Medium（日本語セグメンテーションの精度）  
**検証:** `npm run build` → 日英クエリで正しいページへのリンクが表示される

---

## Phase 7：CI/CD・デプロイ設定

**目標:** `main` ブランチへのpushで自動ビルド・デプロイが完了する。

### 7.1 GitHub Actions デプロイワークフロー
- ファイル: `.github/workflows/deploy.yml`
- トリガー: `push` to `main`
- ジョブ:
  1. **build**: Node.js セットアップ → `npm ci` → Hugo extended セットアップ（`peaceiris/actions-hugo`）→ `hugo --minify --baseURL "$HUGO_BASEURL"` → Pagefind実行 → artifact upload
     - `HUGO_BASEURL`: mainブランチは `https://adv.chiba-u.jp/nano/qnd/`、PRブランチは `$CF_PAGES_URL`（Cloudflare Pages 自動設定変数）
  2. **deploy**: artifact download → Cloudflare Pages にデプロイ

### 7.2 PRプレビューワークフロー
- ファイル: `.github/workflows/preview.yml`
- トリガー: pull_request
- **重要:** Hugo ビルド時に `--baseURL "$CF_PAGES_URL"` を渡すこと。これによりプレビューURL上でCSS・ナビ・画像が正しく表示される
- プレビューURLをPRにコメント投稿

### 7.3 品質チェック（CI組み込み）
- YAML検証: `python3 -c "import yaml; yaml.safe_load(...)"`
- リンクチェック: `htmltest public/`
- i18nキーパリティチェック: ja.yaml と en.yaml のキー一致確認
- メール形式チェック: `_at_` 形式の徹底確認
- **JSON-LD バリデーション:** ビルド後に `public/` の JSON-LD スクリプトを `ajv` または `schema-dts` で検証。`@type: ResearchOrganization` / `ScholarlyArticle` のフィールド欠落でビルドを失敗させる
- **hreflang バリデーション:** `htmltest --check-external=false` に hreflang チェックを含める。`--base-url` を Hugo ビルドで使用した `$HUGO_BASEURL` に合わせること（プレビューURLと本番URLで正しく動作させるため）

### 7.3.1 Lighthouse CI ゲート
- パッケージ: `@lhci/cli`
- 設定ファイル: `.lighthouserc.yml`
- 閾値:
  - Performance: **モバイル ≥ 80** / デスクトップ ≥ 95（Google Fonts CDN レスポンス変動を考慮してモバイルは 90 から引き下げ）
  - Accessibility: ≥ 85
  - SEO: ≥ 95
- CI ジョブ内で `lhci autorun` を実行。閾値未達でビルドを失敗させる
- **もしモバイル ≥ 80 も安定しない場合:** `fontsource/noto-sans-jp` npm パッケージでセルフホスティングに切り替え（CDN変動を排除）

### 7.3.2 アクセシビリティ CI ゲート（pa11y-ci）
- パッケージ: `pa11y-ci`
- 設定ファイル: `.pa11yci.yml`
- 標準: WCAG 2.1 AA
- 対象: 全 JP ページ + `/en/` 配下の全 EN ページ
- CI ジョブ内で `pa11y-ci --sitemap public/sitemap.xml` を実行。違反検出でビルドを失敗させる
- Lighthouse Accessibility スコアと axe-core の両方で二重確認

### 7.3.3 レガシー URL リダイレクト
- ファイル: `static/_redirects`（Cloudflare Pages の `_redirects` 形式）
- 内容（旧HTMLサイトのURLが論文等に引用されている可能性があるため 301 リダイレクトを設置）:
  ```
  /research.html      /research/      301
  /members.html       /members/       301
  /members-e.html     /en/members/    301
  /facility.html      /facilities/    301
  /index-e.html       /en/            301
  ```
- 検証: `curl -I https://[preview-url]/research.html` で 301 を確認

### 7.3.4 Decap CMS アップロード画像の自動最適化
- **問題:** Decap CMS 経由でアップロードされた画像（`static/images/uploads/`）は Hugo Pipes を経由しないため WebP 変換・リサイズが適用されない。
- **対策:** `calibreapp/image-actions` GitHub Action を追加
- ファイル: `.github/workflows/image-optimize.yml`
- トリガー: `push` で `static/images/uploads/**` に変更があった場合
- 処理: JPEG/PNG を圧縮してコミットし直す（変更がなければスキップ）
- これにより教授が 4MB の iPhone 写真をアップロードしても Lighthouse スコアに影響しない

### 7.4 htmltest設定
- ファイル: `.htmltest.yml`
- 外部DOIリンクのスキップ設定（レートリミット対策）

### 7.5 README
- ファイル: `README.md`
- 前提条件（Hugo extended / Node.js）
- ローカル開発手順: `npm install && hugo server`
- コンテンツ更新ガイド（ニュース・論文・メンバー）
- ディレクトリ構造説明

### 7.6 コンテンツ更新ドキュメント
- `docs/how-to-add-news.md`
- `docs/how-to-add-publication.md`
- `docs/how-to-update-members.md`
- 対象読者: Web開発経験のない大学院生

**リスク:** Medium（GitHub Pages パーミッション設定、Cloudflare Pages APIトークン）  
**検証:** mainへのpushでCI通過・自動デプロイ完了

---

## 作成ファイル一覧（約55〜65ファイル）

### 設定ファイル
- `hugo.toml`
- `package.json`
- `tailwind.config.js`
- `postcss.config.js`
- `.gitignore`
- `.htmltest.yml`
- `.lighthouserc.yml`
- `.pa11yci.yml`

### アセット
- `assets/css/main.css`

### i18n
- `i18n/ja.yaml`
- `i18n/en.yaml`

### データ
- `data/publications.yaml`（手動管理または `scripts/add-pub.ts` で自動追記）
- `data/facilities.yaml`
- `data/alumni.yaml`（alumni データが不足する場合の補完用）
- ~~`data/members.yaml`~~ → `content/members/*.md`（1人1ファイル）に変更済み（Phase 3.1 参照）

### レイアウト（テンプレート）
- `layouts/_default/baseof.html`
- `layouts/_default/list.html`
- `layouts/_default/single.html`
- `layouts/index.html`
- `layouts/404.html`
- `layouts/research/list.html`
- `layouts/research/single.html`
- `layouts/members/list.html`
- `layouts/publications/list.html`
- `layouts/facilities/list.html`
- `layouts/news/list.html`
- `layouts/news/single.html`
- `layouts/page/single.html`（アクセスページ用 — `layouts/access/list.html` は使用しない）

### パーシャル
- `layouts/partials/head.html`
- `layouts/partials/header.html`
- `layouts/partials/footer.html`
- `layouts/partials/json-ld.html`
- `layouts/partials/json-ld-article.html`
- `layouts/partials/json-ld-publication.html`
- `layouts/partials/citation-meta.html`
- `layouts/partials/image.html`
- `layouts/partials/search.html`

### ショートコード
- `layouts/shortcodes/figure.html`
- `layouts/shortcodes/doi-link.html`
- `layouts/shortcodes/email.html`
- `layouts/shortcodes/news-badge.html`

### コンテンツ（日本語）
- `content/_index.md`
- `content/research/_index.md` + 4テーマ
- `content/members/_index.md`
- `content/publications/_index.md`
- `content/facilities/_index.md`
- `content/access/_index.md`
- `content/news/` × 5〜10件
- `archetypes/news.md`

### コンテンツ（英語ミラー）
- `content/en/_index.md`
- `content/en/research/` × 5ファイル
- `content/en/members/_index.md`
- `content/en/publications/_index.md`
- `content/en/facilities/_index.md`
- `content/en/access/_index.md`
- `content/en/news/` × 5〜10件

### スクリプト
- `scripts/add-pub.ts`（DOI → CrossRef → data/publications.yaml 自動追記、重複チェック付き）
- `scripts/add-pub.test.ts`（Bun test: 有効DOI / 重複DOI / CrossRef 404 / フィールド欠落）

### 静的ファイル
- `static/admin/index.html`（Decap CMS エントリーポイント）
- `static/admin/config.yml`（Decap CMS コレクション定義）
- `static/_redirects`（Cloudflare Pages 旧URL 301 リダイレクト）

### CI/CD
- `.github/workflows/deploy.yml`
- `.github/workflows/preview.yml`
- `.github/workflows/image-optimize.yml`（Decap CMS アップロード画像自動圧縮）

### ドキュメント
- `README.md`
- `docs/how-to-add-news.md`
- `docs/how-to-add-publication.md`
- `docs/how-to-update-members.md`

---

## リスクと対策

| リスク | 重要度 | 対策 |
|---|---|---|
| Hugo extended版未インストール（WebP変換不可） | High | CI/CDでバージョン明示固定、READMEに明記 |
| Noto Sans JPのファイルサイズが大きい | Medium | weight 400/700のみ、`font-display: swap`、unicode-range分割 |
| Pagefindの日本語検索精度が低い | Medium | `--force-language ja`、代替としてtinyseg検討 |
| 現行サイトのコンテンツが2021年で停止 | Medium | 現状通り抽出し `draft: true` で管理、教員レビュー後に公開 |
| Google Maps embedが大学ネットワークでブロック | Low | OpenStreetMap（Leaflet）をフォールバックとして用意 |
| 研究画像（SEM写真等）が低解像度または欠損 | Low | 開発中はプレースホルダー使用、画像リクエストチェックリスト作成 |

---

## 完了基準チェックリスト

- [ ] 全7ページが日本語・英語で正しく表示される
- [ ] 全ページで言語切替が同一ページの対訳版へ遷移する
- [ ] 375px幅（iPhone SE）でモバイルレイアウトが使いやすい
- [ ] メンバーが `content/members/*.md` から正しくレンダリングされる（`data/members.yaml` は使用しない）
- [ ] Markdownファイル作成のみでニュース記事を追加できる
- [ ] 論文ページで年度・カテゴリフィルタが動作する
- [ ] 設備ページで画像クリック時にLightboxが開く
- [ ] **[Phase 2.5]** `/admin` で GitHub ログイン後、ニュース記事を作成するとリポジトリにコミットが作成される
- [ ] **[Phase 3.2.1]** `npx tsx scripts/add-pub.ts [doi]` を実行すると `data/publications.yaml` に論文が追記される
- [ ] Lighthouse Performance ≥ 90 モバイル / ≥ 95 デスクトップ（トップページ）
- [ ] Lighthouse Accessibility ≥ 85（全ページ）
- [ ] pa11y-ci WCAG 2.1 AA 違反ゼロ
- [ ] 全画像に `alt` 属性が付与されている（空文字列・"image" 禁止）
- [ ] カラーコントラスト比 4.5:1 以上（WCAG 2.1 AA）
- [ ] キーボード操作で全機能が使える
- [ ] JSON-LDがバリデーションエラーなし
- [ ] 全ページに正しい `hreflang` タグが存在する（バリデーターで確認）
- [ ] **[Phase 7.3.3]** `curl -I [preview-url]/research.html` が 301 を返す
- [ ] **[Phase 7.3.4]** `static/images/uploads/` へのアップロード後、`image-optimize.yml` が圧縮コミットを作成する
- [ ] `hugo --minify` がエラー・警告ゼロでビルドできる
- [ ] mainへのpushでGitHub Actionsが3分以内に自動デプロイする
- [ ] Pagefind: `量子ドット` で検索すると1件以上のページが返る（ゼロ件の場合は Algolia DocSearch にフォールバック）
- [ ] READMEを読んだ新メンバーが10分以内にローカル開発を開始できる

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAR | 4 cherry-picks accepted, 2 TODOs added |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 9 issues, 9 resolved |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** CEO + ENG CLEARED — ready to implement.

---

### CEO Review (2026-04-15) — スコープ拡張決定

| # | 提案 | 決定 | 備考 |
|---|------|------|------|
| 1 | DOI → YAML パイプライン (`scripts/add-pub.ts`) | **採用** | 論文更新が最高頻度; 手動YAMLが最大の摩擦 |
| 2 | Lighthouse CI ゲート (perf ≥ 90 mobile / ≥ 95 desktop, a11y ≥ 85) | **採用** | 品質目標はゲートがないと口約束にしかならない |
| 3 | ORCID iD フィールド + バッジ (メンバーカード) | **採用** | 1フィールド + 1アイコン; 国際共同研究者への信頼性 |
| 4 | axe-core / pa11y-ci アクセシビリティ CI ゲート (WCAG 2.1 AA) | **採用** | 目標の WCAG 2.1 AA を自動ゲートで強制可能にする |

### Eng Review (2026-04-16) — アーキテクチャ修正

| # | 問題 | 解決 |
|---|------|------|
| 1 | 論文データソースの矛盾（Decap CMS: `content/publications/` vs Phase 3.2: `data/publications.yaml`） | `data/publications.yaml` に統一。Decap は file collection を使用 |
| 2 | PRプレビューで baseURL が本番URLに固定 → CSS/ナビ/画像が壊れる | `--baseURL "$CF_PAGES_URL"` オーバーライドを deploy.yml と preview.yml に追加 |
| 3 | Hugo i18n: `defaultContentLanguageInSubdir` と language weight が未指定 | `defaultContentLanguageInSubdir = false`、`weight = 1/2` を Phase 1.1 に追加 |
| 4 | Decap CMS OAuth callback URL が Next.js パス（静的サイトに存在しない） | `/api/auth/callback/github` → サイトオリジンのみに修正。`site_url` と `display_url` を config.yml に追加 |
| 5 | `layouts/access/list.html` — アクセスページはリストではない | `layouts/page/single.html` + `type: page` front matter に変更 |
| 6 | `layouts/partials/image.html` がデュアルパスを未考慮（Hugo Pipes vs CMS uploads） | デュアルパス検出ロジックを Phase 5.4 に明記 |
| 7 | `scripts/add-pub.ts` にテストなし・重複DOIチェックなし | `scripts/add-pub.test.ts` を追加（4ケース）。重複チェックと CrossRef フィールドバリデーションを実装仕様に追加 |
| 8 | JSON-LD・hreflang の CI 検証が手動チェックのみ | Phase 7.3 に `ajv` JSON-LD バリデーションと `htmltest` hreflang チェックを追加 |
| 9 | Lighthouse モバイル閾値 ≥ 90 は Google Fonts CDN 変動で安定しない | モバイル ≥ 80 に引き下げ（デスクトップ ≥ 95 維持） |

### クリティカルリスク（実装前に解決すること）

| リスク | 緊急度 | アクション |
|--------|--------|------------|
| 大学サブパス配備 (`adv.chiba-u.jp/nano/qnd/`) | **HARD GATE** | 大学 IT に逆プロキシ設定を依頼する。コード1行も書く前に確認すること |
| Decap CMS OAuth (Cloudflare Pages が前提) | High | GitHub OAuth App の Callback URL をサイトオリジンに設定（Phase 2.5.3 参照） |
| `Site.Data.members` への参照漏れ | Medium | Phase 3 着手前に全テンプレートを `grep -r "Site.Data.members"` で確認 |

### 推奨次ステップ

1. `/plan-design-review` — UIスコープが検出された（Tailwind、3ブレークポイント対応）。デザインレビューを推奨
2. 大学 IT へのサブパス確認メール送付（コード着手前）
3. 教授への画像リクエスト送付（SEM写真、メンバー写真）— コードより先に、今日中に
