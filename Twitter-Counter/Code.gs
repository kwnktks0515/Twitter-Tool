//This software includes the work that is distributed in the Apache License
//https://github.com/googlesamples/apps-script-oauth1/blob/master/samples/Twitter.gs
var CONSUMER_KEY = 'CONSUMER_KEY';
var CONSUMER_SECRET = 'CONSUMER_SECRET';
function core(){
    var service = getService();
    if (service.hasAccess()) {
        Logger.log('Already authorized');
    } else {
        var authorizationUrl = service.authorize();
        Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
    }
    return service;
}
function getService() {
  return OAuth1.createService('Twitter')
      // Set the endpoint URLs.
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
      // Set the consumer key and secret.
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)
      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}
//~~~~~~~~~~~~~~

function body(){
  var sheet = SpreadsheetApp.getActive().getSheetByName('シート1');
  var count = 200;
  var tweetid = sheet.getRange('D2').getValues()[0][0].slice(1);
  var tweet_count = 0;
  var favorite_count = 0;
  var time = new Date();
  var test = '';
  var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=' + count + '&trim_user=true&since_id=' + tweetid;
  json = JSON.parse(core().fetch(url,{  method: 'GET'  }).getContentText());
  for(var i = 0;i < json.length-1;i++){
    tweet_count++;
    favorite_count += json[i].favorite_count;
  }
  sheet.getRange('B' + (time.getDay()+2)).setValue(tweet_count);
  sheet.getRange('C' + (time.getDay()+2)).setValue(favorite_count);
  sheet.getRange('D2').setValue('a' + json[0].id);
  test = '@ユーザーID \r' + 'Tweet数:' + tweet_count + '\rいいねされた数:' + favorite_count;
  core().fetch('https://api.twitter.com/1.1/statuses/update.json',{  method: 'POST',payload: { status: test }  });
}
