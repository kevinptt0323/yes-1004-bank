# Database Project

本專案是用來維護作者的資料庫作業。

Url: http://dbhw.kevinptt.nctucs.net/

目前前端是以 [Angular.js](https://github.com/angular/angular.js) 加上 [Semantic UI](https://github.com/Semantic-Org/Semantic-UI/)。而後端則是 php 與 MySQL。

## Development

### Required

- php 5.6.6
- MySQL 5.6.14
- Node.js 0.10.33
- [npm](https://github.com/npm/npm/)

### Development

第一次請先執行

	$ npm install
	$ bower install

接著設定資料庫使用者帳號密碼

	$ cd src/api/include
	$ cp auth.php.example auth.php
	$ vim auth.php

然後將 `Init.sql` 匯入至 MySQL 之中，以建立初始 table 。

### Release

發布時請執行

	$ npm run gulp

