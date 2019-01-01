# GCalNotification

Google Apps Script で Google カレンダーの予定を通知するライブラリ

## Description

Google Apps Script で Google カレンダーの予定（全カレンダー or 指定カレンダー）を取得し、  
各カレンダー毎の予定リストを通知先サービスへ連携するライブラリ

通知先サービス：

- [LINE Notify](https://notify-bot.line.me/ja/)

## Requirement

通知先サービスが「LINE Notify」：

1. 通知を送るトークルームに「LINE Notify」アカウントを友達として追加
1. アクセストークン発行  
   [LINE Notify のマイページ](https://notify-bot.line.me/my/)にアクセスし、「トークンを発行する」

## Usage

1. Google Apps Script で本ライブラリを読み込む  
   Google Apps Script メニュー -> リソース -> ライブラリ... ->  
   プロジェクトキー"MnRX69mDwDCp0N2V3oekeTiOLEqDxVXCd"でライブラリを追加
2. Google Apps Script でのサンプル

```
  // 通知先をLINE Notifyで行う
  var line = new GCalNotification.Line('{LINE Notifyアクセストークン}');
  // 実行日の全カレンダーを通知
  line.notify();
  // 指定日の全カレンダーを通知
  line.notify([], new Date(2019,1,2));
  // 実行日の指定カレンダーを通知
  line.notify(['{カレンダーID}']);
  // 指定日の指定カレンダーを通知
  line.notify(['{カレンダーID１}','{カレンダーID２}'], new Date(2019,1,2));
```

通知メッセージのサンプル：

```
2019/01/01
◆ カレンダー名１
12:00 - 13:00 イベント名１１
15:00 - 18:00 イベント名１２

◆ カレンダー名２
終日 イベント名２１
09:00 - 11:00 イベント名２２

◆ カレンダー名３
予定なし
```

## Licence

[MIT](https://github.com/syocky/GCalNotification/blob/master/LICENSE)

## Author

[syocky](https://github.com/syocky)
