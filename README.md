# openclaw-computer-ui

OpenClaw 上に「Perplexity Computer 風」の体験（タスク一覧 → プラン → 承認 → 実行 → 成果物）を作るための、セルフホスト可能な UI + 実行基盤のプロトタイプです。

狙い：高額なサブスクに頼らず、以下を組み合わせて “Computerっぽい” 体験を実現します。

- **Web UI**（`/computer`）
- **API**（`/api/computer`）
- **Runner**（ホスト上の OpenClaw が Docker サンドボックス内で実行）
- タスクメタデータ保存用の **Postgres**（最小構成）

このリポジトリは、まず **ドキュメント＋MVPの骨組み**から始めます。

## これは何？（MVPスコープ）

- 専用UIからタスクを作成
- タスク / イベント / 承認情報を Postgres に保存
- ログや成果物（artifact）を紐付け
- 危険操作（例：`terraform apply`、本番デプロイ）には **承認ゲート**を挟む
- Runner がキュー（queued）のタスクを拾い、Docker サンドボックスで実行

## これは何ではない？

- マルチテナントSaaS
- 課金・サブスクシステム
- 400+コネクタの統合プラットフォーム

## アーキテクチャ（概要）

- **UI**: `/computer`（Next.js想定。実装は後で差し替え可能）
- **API**: `/api/computer/*`
- **DB**: Postgres（docker-compose）
- **Runner**: OpenClaw（host）→ Docker（`docker compose`）→ AWS（AssumeRole）

詳細：
- 要件 / API / DB は `docs/spec.md`

## ローカル開発

```bash
cp .env.example .env
pnpm install
docker compose up -d
```

### API（NestJS）を起動

```bash
pnpm api:dev
# => http://localhost:4000/health
# => http://localhost:4000/docs (Swagger)
```

`CORS_ORIGIN` はカンマ区切りで複数指定できます（`*` は禁止）。
Swagger は `NODE_ENV !== production` もしくは `SWAGGER_ENABLED=true` のとき有効です。

## デプロイ方針（予定）

- dev / stg：自動
- prod：承認ゲートを挟む

Runner は **AWS AssumeRole** を使い、長期のアクセスキーは置きません。

## ライセンス

未定（決めるまでの間は all rights reserved 扱い）。
