var CONSUMER_KEY = 'Consumer key';
var CONSUMER_SECRET = 'Consumer secret';

function myFunction() {//A列の内容を読み取る。
  var sheet = SpreadsheetApp.getActiveSheet();
  run(sheet.getRange("A" + (Math.floor( Math.random() * (sheet.getLastRow() - 1) ) + 2)).getValue());
  //Math.floor( Math.random() * (max - min + 1) ) + min;乱数
}

//http://imabari.hateblo.jp/entry/2015/06/12/143021 のをコピペ
