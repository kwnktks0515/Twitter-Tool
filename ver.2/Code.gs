//http://yoshiyuki-hirano.hatenablog.jp/entry/2015/10/13/010317 さんを参考

var consumer_key = 'consumer_key';
var consumer_secret = 'consumer_secret';

//認証
//~~ここから引用~~
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

function getService(){
    return OAuth1.createService('Twitter')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey(consumer_key)
    .setConsumerSecret(consumer_secret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

function authCallback(request){
    var service      = getService();
    var isAuthorized = service.handleCallback(request);
    var mimeType     = ContentService.MimeType.TEXT;
    if (isAuthorized) {
        return ContentService.createTextOutput('Success').setMimeType(mimeType);
    } else {
        return ContentService.createTextOutput('Denied').setMimeType(mimeType);
    }
}
//~~ここまで引用〜〜
//パラメータ一覧
//https://dev.twitter.com/rest/public（英語）
//http://dx.24-7.co.jp/twitterapi1-1-rest-api/（一覧だけ）
//https://syncer.jp/twitter-api-matome（詳しい）

var management = {
    home_timeline: function(content){
        return send([
            ['home_timeline','GET'],
            ['count','since_id','max_id','trim_user','exclude_replies','contributor_details','include_entities'],//7
            content
        ]);
    },
    user_timeline: function(content){
        return send([
            ['user_timeline','GET'],
            ['user_id','screen_name','since_id','count','max_id','trim_user','exclude_replies','contributor_details','include_rts'],//9
            content
        ]);
    },
    update: function(content){
        return send([
            ['update','POST'],
            ['status','in_reply_to_status_id','possibly_sensitive','lat','long','place_id','display_coordinates','trim_user','media_ids'],//9
            content
        ]);
    }
}

function send(content){
    if(content[0][0] === 'update'){
        test = (Array.isArray(content[2]) == false)?content[2]:content[2][0];
        var methods = {
            method: content[0][1],
            payload: { status: test }
        };
    } else {
        var methods = {
            method: content[0][1]
        };
    }
    url = 'https://api.twitter.com/1.1/statuses/' + content[0][0] + '.json?';
    for(var i = 0;i < content[1].length;i++){
        if(!(content[2][i] ==  null )){
            url += content[1][i] + '=' + content[2][i] + '&' 
        }
    }
    return core().fetch(url.slice(0, -1),methods);
}

//https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
//Jsonデータを整形する
function adjustjson(content){
    return JSON.stringify(JSON.parse(content), null, "    ");
}

function main(){
    Logger.log(adjustjson(management.home_timeline([1])));
}