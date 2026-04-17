# 大学研究室ホームページ 汎用テンプレート — 基本設計書

**プロジェクト名:** Lab Website Hugo Template  
**バージョン:** 1.0  
**ベース:** 千葉大学 量子ナノデバイス研究グループ（青木研究室）サイトを汎用化

---

## 1. テンプレート概要

このプロジェクトは、大学研究室のホームページを素早く立ち上げるためのHugo静的サイトテンプレートである。forkして必要情報を埋めるだけで、モダンでレスポンシブな研究室サイトを公開できる。

### 特徴

- **多言語対応（日本語・英語）**: i18nルーティング、言語切替UI
- **更新容易**: Markdown/YAMLの編集のみでコンテンツ更新可能
- **Decap CMS対応**: ブラウザからGUI編集可能（Git連携）
- **全文検索**: Pagefind（クライアントサイド、日本語対応）
- **CI/CD**: GitHub ActionsによるCloudflare Workers自動デプロイ
- **高パフォーマンス**: Tailwind CSS、WebP画像最適化、minify

---

## 2. セットアップ（新規研究室向け）

### 2.1 必須の書き換え箇所

forkした後、以下を自研究室の情報に置き換える。

| ファイル | 置き換え箇所 |
|---|---|
| `hugo.toml` | `baseURL`, `title`, `[params]` の全項目 |
| `data/members.yaml` | 全メンバー情報 |
| `data/publications.yaml` | 論文リスト |
| `data/facilities.yaml` | 研究設備情報 |
| `content/_index.md` | サイトのtitle, description |
| `content/en/_index.md` | 英語版のtitle, description |
| `static/admin/config.yml` | `backend.repo` と `app_id` |
| `i18n/ja.yaml` | サイト名、研究室名、大学名 |
| `i18n/en.yaml` | 英語版のサイト名等 |

**プレースホルダ一覧（`{{...}}` 形式で検索して置換）:**

```
{{LAB_NAME}}        — 研究室名（日本語）例: 量子ナノデバイス研究グループ
{{LAB_NAME_EN}}     — 研究室名（英語）例: Quantum Nanodevice Research Group
{{UNIVERSITY}}      — 大学名（日本語）例: 千葉大学
{{UNIVERSITY_EN}}   — 大学名（英語）例: Chiba University
{{PI_NAME}}         — 教授名（日本語）
{{PI_NAME_EN}}      — 教授名（英語）
```

### 2.2 デプロイ設定

1. `wrangler.jsonc` の `name` と `routes` を自サイトに合わせて変更
2. Cloudflare Workers の設定: `CF_ACCOUNT_ID`, `CF_API_TOKEN` をGitHub Secretsに登録
3. Decap CMS用: GitHub OAuth App を作成し `app_id` を設定

---

## 3. コンテンツ更新フロー

### ニュース追加

```bash
hugo new news/YYYY-MM-DD-slug.md
```

または `content/news/` に以下形式で新規ファイル作成:

```yaml
---
title: "ニュースタイトル"
date: YYYY-MM-DD
categories: ["論文発表", "受賞", "イベント", "メンバー"]
tags: ["キーワード"]
draft: false
---
本文をMarkdownで記述
```

### メンバー更新

`data/members.yaml` を直接編集。staff / students / alumni の3セクション構成。

### 論文追加

`data/publications.yaml` の先頭に新しいエントリを追加。DOIは自動でリンク化される。

---

## 4. 技術スタック

| レイヤー | 技術 |
|---|---|
| 静的サイトジェネレータ | Hugo（Go製、多言語ネイティブ対応） |
| CSSフレームワーク | Tailwind CSS |
| コンテンツ管理 | Markdown + YAML Front Matter |
| データ管理 | YAML（data/）|
| CMS UI | Decap CMS（GitHub連携） |
| 検索 | Pagefind（静的インデックス、日本語対応） |
| ホスティング | Cloudflare Workers（CI/CD: GitHub Actions） |
| バージョン管理 | Git + GitHub |

---

## 5. サイト構造

```
/（トップページ）
├── /research（研究内容）
├── /members（メンバー）
├── /publications（業績）
├── /facilities（研究設備）
├── /news（ニュース・お知らせ）
├── /access（アクセス・連絡先）
└── /en/（英語版、同一構造）
```

---

## 6. 開発コマンド

```bash
# ローカル開発サーバー起動
hugo server

# プロダクションビルド
npm run build

# Pagefindインデックス生成（ビルド後）
npx pagefind --source public

# デプロイ（GitHub Actions経由、手動トリガー可）
# mainブランチへpushで自動実行
```

---

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
