# Cafe Kiosk — 画面遷移図 (Screen Transition Diagram)

```mermaid
flowchart TD
    START([🚀 アプリ起動]) --> HOME

    HOME["🏠 ホーム画面\n/\n━━━━━━━━━━━━\nカフェ写真表示"]

    MENU["☕ メニュー画面\n/menu\n━━━━━━━━━━━━\nメニュー一覧\nカテゴリフィルター\nカート追加ボタン"]

    MODAL["📋 メニュー詳細\nモーダル\n━━━━━━━━━━━━\n商品説明・価格\n数量選択\nカート追加"]

    CART["🛒 カート画面\n/cart\n━━━━━━━━━━━━\nカート内商品一覧\n数量変更\n合計金額\n注文確認ボタン"]

    CART_EMPTY["⚠️ カート空き\n状態\n━━━━━━━━━━━━\n空メッセージ表示"]

    API["🔄 注文API処理\nPOST /api/orders\n━━━━━━━━━━━━\nサーバーへ送信"]

    ANIM["✨ 注文成功\nアニメーション\n(1.1秒)"]

    ORDER_COMPLETE["✅ 注文完了画面\n/order-complete\n━━━━━━━━━━━━\n注文番号\n注文詳細\nメニューへ戻るボタン"]

    REDIRECT_HOME["🔀 ホームへ\nリダイレクト\n(注文データなし)"]

    %% Initial navigation
    HOME -->|"Navbar: メニュー"| MENU

    %% Menu page interactions
    MENU -->|"商品クリック"| MODAL
    MODAL -->|"✕ 閉じる"| MENU
    MODAL -->|"カートに追加"| MENU

    %% Cart navigation
    MENU -->|"Navbar カートアイコン\n/ BottomCartBar"| CART
    CART -->|"Navbar: メニュー"| MENU

    %% Empty cart
    CART -->|"カートが空"| CART_EMPTY
    CART_EMPTY -->|"メニューへ\n戻るリンク"| MENU

    %% Checkout flow
    CART -->|"注文するボタン\n(確認ダイアログ OK)"| API
    API -->|"✅ 成功 (200)"| ANIM
    ANIM -->|"1.1秒後\nカートクリア"| ORDER_COMPLETE
    API -->|"❌ 失敗\nエラーアラート"| CART

    %% Order complete
    ORDER_COMPLETE -->|"メニューへ\n戻るボタン"| MENU
    ORDER_COMPLETE -->|"注文データなし\n(直接アクセス)"| REDIRECT_HOME
    REDIRECT_HOME -->|"Navigate replace"| HOME

    %% Navbar always accessible
    CART -->|"Navbar: ホーム"| HOME
    ORDER_COMPLETE -->|"Navbar: ホーム"| HOME
    HOME -->|"Navbar: カート"| CART

    %% Styles
    classDef page fill:#2d6a4f,stroke:#1b4332,color:#fff,rx:8
    classDef action fill:#f0f4ff,stroke:#4a6cf7,color:#1a1a1a,rx:8
    classDef success fill:#d4edda,stroke:#28a745,color:#155724,rx:8
    classDef warning fill:#fff3cd,stroke:#ffc107,color:#856404,rx:8
    classDef error fill:#f8d7da,stroke:#dc3545,color:#721c24,rx:8

    class HOME,MENU,CART,ORDER_COMPLETE page
    class MODAL,API,ANIM action
    class CART_EMPTY warning
    class REDIRECT_HOME error
```

## 画面一覧

| 画面名 | パス | 説明 |
|---|---|---|
| ホーム画面 | `/` | カフェ写真のスプラッシュ画面 |
| メニュー画面 | `/menu` | 商品一覧・カテゴリフィルター・モーダル詳細 |
| カート画面 | `/cart` | 注文内容確認・合計金額・注文実行 |
| 注文完了画面 | `/order-complete` | 注文番号・詳細表示（注文データなしの場合ホームへリダイレクト） |

## 主要な遷移ルール

- **Navbar** — 全ページから `/`・`/menu`・`/cart` へ常時遷移可能
- **注文完了ガード** — `/order-complete` に直接アクセスすると `Navigate replace` でホームへリダイレクト
- **注文フロー** — カート → API送信 → 成功アニメーション(1.1秒) → カートクリア → 注文完了画面
