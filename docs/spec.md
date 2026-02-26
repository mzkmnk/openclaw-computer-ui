# 仕様: OpenClaw Computer 風 UI（単独利用）

## 0. ゴール

小さな「Computer風」体験を作る：

- 専用UIでタスクを作成し、進捗を追える
- 「cheap / deep / coder」のような役割に応じて処理を振り分ける（runner側のポリシーとして実装）
- 実行はホスト上で Docker サンドボックス内に閉じ込める（runnerはOpenClawが制御）
- AWSデプロイは **AssumeRole** と **承認ゲート**に対応

非ゴール：

- マルチテナントSaaS、サブスク、複雑な課金
- 大規模コネクタエコシステム

## 1. ユーザーモデル

- 単独利用（リポジトリ所有者のみ）
- 認証は簡易でよい（任意のパスワード、VPN配下、Cloudflare Access配下など）
- ただし承認/危険操作のために **監査用の記録（誰が何をいつ承認したか）**は残す

## 2. 主要エンティティ

### Task
ユーザーが投入する「やりたいこと」。

フィールド（概念）：

- `id`（uuid）
- `title`（任意）
- `prompt`（string）
- `mode`（enum）：`auto | cheap | deep | coder`
- `status`（enum）：`queued | planning | running | needs_approval | succeeded | failed | cancelled`
- `created_at`, `updated_at`
- `runner_hint`（json, 任意）：project path / repo URL / env など

### TaskEvent
追記型（append-only）のイベントログ。

- `id`（uuid）
- `task_id`
- `ts`
- `type`（enum）：`status | log | plan | step | artifact | error | cost_estimate`
- `payload`（json）

### Approval
危険操作の承認。

- `id`（uuid）
- `task_id`
- `action`（enum）：`terraform_apply | deploy_stg | deploy_prod | run_migrations | other`
- `status`（enum）：`requested | approved | rejected`
- `requested_at`, `resolved_at`
- `note`（string, 任意）

## 3. 承認ゲート

ルール：

- runnerは read-only 相当の操作（build/test/plan）は自動で実行してよい
- runnerは以下で必ず停止し、承認を要求する：
  - `terraform apply`
  - prod へのデプロイ
  - DB migration
  - allowlist 外の操作

UIが表示する情報：

- 依頼された操作の概要
- plan差分/影響範囲のサマリ
- ロールバック方針（メモで可）
- Approve / Reject

## 4. Runnerモデル（OpenClaw）

### 責務

- APIから queued のタスクを取得（poll）
- 各タスクについて：
  - プラン作成
  - Docker サンドボックスで手順を実行
  - TaskEvent を発行（ログ/ステップ/成果物）
  - 必要なら承認を要求

### 「自動ルーティング」ポリシー

MVPのルーティング：

- `cheap`：要約 / 列挙 / 軽い調査（短い出力を基本）
- `deep`：意思決定、トレードオフ、最終結論
- `coder`：コード生成、リファクタ、PoC実装

実装方針：

- まずはルールベースの router を用意し、どの worker を動かすか決める
- worker は OpenClaw の sub-agent として、モデルを変えて起動できる形にする

### サンドボックス

実行はDockerコンテナ内：

- 作業ディレクトリを volume マウント（task workspace）
- ネットワーク制約は将来オプション
- runner がコマンド allowlist を強制

## 5. API（案）

### タスク作成

`POST /api/computer/tasks`

Body：

```json
{
  "title": "devへフロントをデプロイ",
  "prompt": "UIをビルドしてdevへデプロイして",
  "mode": "auto",
  "runnerHint": {
    "projectPath": "repos/myapp",
    "env": "dev"
  }
}
```

### タスク一覧

`GET /api/computer/tasks?status=queued|running|...`

### タスク取得

`GET /api/computer/tasks/:id`

### イベント取得（ログ/進捗）

`GET /api/computer/tasks/:id/events?after=<cursor>`

### 承認要求

`POST /api/computer/tasks/:id/approvals`

### 承認の確定

`POST /api/computer/approvals/:id/resolve`

```json
{ "status": "approved", "note": "apply OK" }
```

## 6. 成果物（artifact）とログ

- Postgresにはイベントの **メタデータ**を保存
- ログ本文は以下のどちらか：
  - ローカルファイル（例：`./data/logs/<taskId>.log`）
  - 将来的にS3

artifact例：

- build output
- terraform plan
- deployment URL

## 7. AWS連携

- 認証は AssumeRole（静的アクセスキーは置かない）
- `dev / stg / prod` で role を分離
- 権限は最小（必要なサービス操作のみ）

## 8. 実装マイルストーン

### M0: ドキュメント＋雛形
- repo + docs
- docker-compose（Postgres）

### M1: 最小UI/API
- タスク作成
- タスク一覧
- タスク詳細

### M2: Runnerループ
- queued を拾う
- events/logs を書く
- 承認ゲート

### M3: AWSデプロイシナリオ
- サンプルのパイプライン（build/test/plan/apply/deploy）

