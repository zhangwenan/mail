//var base = require('./base');

var cookie_util = require('cookie-util');
var http_tools = require('http-tools');

var http = require('http');
var https = require('https');
var mkdirp = require('mkdirp');
var fs = require("fs");
var rest = require('restler');
var log4js = require('log4js');
var cheerio = require('cheerio');
var querystring = require('querystring');
var iconv = require('iconv-lite');
var zlib = require('zlib');

var algorithm = require('../algorithm/algorithm_163');
var encoder = require('../algorithm/encode_163');
var encoder_util = require('../algorithm/encode_util');



function mail163(conf){
  this.user = conf.user;
  this.password = conf.password;
  this.cookies = conf.cookies || [];
}

// 判断当前cookies是否仍然有效
mail163.prototype.validateCookie = function(){

};

mail163.prototype.visitIndex = function(){

  var self = this;
  var url = 'http://mail.163.com/';

  var header_sent = {
    "Host": http_tools.getHost(url),
    "Referer": ""
    //"Cookie": self.cookies
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);


  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');

      console.log('status:' + status);
      console.log('cookies: ' + headers['set-cookie'])
      console.log(content);
    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
    file_logger.error(self.qq + e);*/
  });
};


// 登陆
mail163.prototype.login = function(){


  /**
   * var f = h[1];
   var b = h[2];
   var c = $id("pwdInput").value;
   var e = new RSAKey();
   e.setPublic(b, f);
   var d = e.encrypt(MD5(c));
   window.location.href = "http://reg.163.com/httpLoginVerifyNew.jsp?" + fUrlP("product", gOption.product, true) + fUrlP("rcode", d) + fUrlP("savelogin", $id("savelogin").value) + fUrlP("url", encodeURIComponent(window.sHttpAction)) + fUrlP("url2", encodeURIComponent(gOption.url2)) + fUrlP("username", $id("idInput").value + "@" + gOption.sDomain)

   */
  var self = this;
  var user = self.user.replace(/@163\.com/g, '');
  var password = self.password;


  var a = encoder.getRnd(user + "@163.com");
  console.log(a);

  // http://reg.163.com/httpLoginVerifyNew.jsp?product=mail163&rcode=2c5c44531bc5e0b06af911bd694444c5c25612a078536f038e180ad66787f3532d968fc282fc5ee0ed18287464d7e0fa9139c177258ab5d2b02a769d0686fd6109f3639856fed6fa81e8974e1e553549693e7e3f982b4297e3a36b045422243a8f630c165c23cdeb123206fac0872789aa3511b5b65517740c360f182b3021f2&savelogin=0&url=http%3A%2F%2Fmail.163.com%2Fentry%2Fcgi%2Fntesdoor%3Flanguage%3D-1%26net%3Dt%26from%3Dweb%26df%3Demail163%26race%3D50_38_43_gz%26module%3D%26uid%3Dyunle1770058lu%40163.com%26style%3D-1&url2=http%3A%2F%2Femail.163.com%2Ferrorpage%2Ferror163.htm&username=yunle1770058lu@163.com

  // http://entry.mail.163.com/coremail/fcg/ntesdoor2?username=tao3893530zhijiuj&lightweight=1&verifycookie=1&language=-1&style=-1
  /*var url = 'https://mail.163.com/entry/cgi/ntesdoor' +
    '?df=mail163_letter' +
    '&from=web' +
    '&funcid=loginone' +
    '&iframe=1' +
    '&language=-1' +
    '&passtype=1' +
    '&product=mail163' +
    '&net=t' +
    '&style=-1' +
    '&race=-2_-2_-2_db' +
    '&uid=' + user + '@163.com';*/

  var url = "http://reg.163.com/services/httpLoginExchgKeyNew?rnd=" + a + "&jsonp=fEnData";
  //http://reg.163.com/services/httpLoginExchgKeyNew?rnd=eXVubGUxNzcwMDU4bHVAMTYzLmNvbQ==&jsonp=fEnData
  //http://reg.163.com/services/httpLoginExchgKeyNew?rnd=dGFvMzg5MzUzMHpoaWppdWpAMTYzLmNvbQ==&jsonp=fEnData

  /*var post_obj = {
    savelogin:0,
    url2: 'http://mail.163.com/errorpage/error163.htm',
    username: user,
    password: password
  };*/

  var post_obj = {
    username: user,
    password: password,
    url: 'http://entry.mail.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=-1'
  };

  /*var post_data = querystring.stringify(post_obj);
  console.log(post_data);*/

  //msg = self.qq + ',';
  //file_logger.info(msg);


  /*var now = new Date();
  var cookies = [
    'starttime='+now.getTime()+'; Domain=mail.163.com; Path=/',
    'nts_mail_user=' + user + ':-1:1; Domain=mail.163.com; Path=/',
    'logType=; Domain=mail.163.com; Path=/',
    'df=mail163_letter; Domain=mail.163.com; Path=/'
  ];*/

  //self.cookies = cookie_util.merge_cookie(self.cookies, cookies);

  //console.log(cookie_util.get_simple_cookie_str(self.cookies));


  var header_sent = {
    "Host": http_tools.getHost(url),
    /*"Referer": "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=" + self.g_appid + "&daid=" + self.g_daid
     + "&s_url=https://mail.qq.com/cgi-bin/login?vt=passport%26vm=wpt%26ft=loginpage%26target=&style=" + self.g_style
     + "&low_login=1&proxy_url=https://mail.qq.com/proxy.html&need_qr=0&;hide_border=1&border_radius=0"
     + "&self_regurl=http://zc.qq.com/chs/index.html?type=1&app_id=11005?t=regist"
     + "&pt_feedback_link=http://support.qq.com/discuss/350_1.shtml"
     + "&css=https://res.mail.qq.com/zh_CN/htmledition/style/ptlogin_input24e6b9.css",*/
    "cookie": cookie_util.get_simple_cookie_str(self.cookies)
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);


  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');


      console.log(status);
      console.log(headers['location']);
      console.log(content);
      eval(content);

      function fEnData(g){
        var h = new Array();
        h = g.split("\n");
        var a = h[0];
        if (a == "401") {
          console.log("参数非法")
        } else {
          if (a == "500") {
            console.log("服务端异常")
          } else {
            if (a == "200") {
              var f = h[1];
              var b = h[2];
              var c = password;
              var e = new algorithm.RSAKey();
              e.setPublic(b, f);
              var d = e.encrypt(algorithm.MD5(c));
              self.login_url = 'http://reg.163.com/httpLoginVerifyNew.jsp?product=mail163&rcode='+d+'&savelogin=0&url=http%3A%2F%2Fmail.163.com%2Fentry%2Fcgi%2Fntesdoor%3Flanguage%3D-1%26net%3Dt%26from%3Dweb%26df%3Demail163%26race%3D50_38_43_gz%26module%3D%26uid%3D'+user+'%40163.com%26style%3D-1&url2=http%3A%2F%2Femail.163.com%2Ferrorpage%2Ferror163.htm&username='+user+'@163.com';
              self.redirect();

              /*window.location.href = "http://reg.163.com/httpLoginVerifyNew.jsp?" + fUrlP("product", gOption.product, true) + fUrlP("rcode", d) + fUrlP("savelogin", $id("savelogin").value) + fUrlP("url", encodeURIComponent(window.sHttpAction)) + fUrlP("url2", encodeURIComponent(gOption.url2)) + fUrlP("username", $id("idInput").value + "@" + gOption.sDomain)*/
            }
          }
        }
      }


    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
     file_logger.error(self.qq + e);*/
  });



  /*var content = '';
  var protocol = http_tools.getProtocol(url);
  var req = protocol.request({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    method: 'POST',
    headers: {
      'Host': http_tools.getHost(url),
      /!*'Origin': 'http://mail.163.com',*!/
      /!*'Referer': 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=163%E9%82%AE%E7%AE%B1&rsv_pq=a491630c0003e4ec&rsv_t=55dfzIbjemA3BUGyh2AifFjLFHc9bFWXt68z0O2T6SPQd9RW4YmO1wZRAXk&rsv_enter=1&rsv_sug3=3&rsv_sug1=3&rsv_sug7=100&sug=163%E9%82%AE%E7%AE%B1&rsv_n=1',*!/
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0',
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8',
      'Accept-Language':'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3'
      /!*'Content-Type': 'application/x-www-form-urlencoded',*!/
      //'Accept-Encoding':'gzip, deflate',
      //'Cookie': cookie_util.get_simple_cookie_str(self.cookies)
    }
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;

    /!*console.log('status: ' + JSON.stringify(headers));
    console.log('x-ntes-mailentry-result:' + headers['x-ntes-mailentry-result']);*!/

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"] || []);
    console.log(self.cookies)


    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');

      console.log(content);
      var htmlDecode = function(str) {
        return str.replace(/&#(x)?([^&]{1,5});?/g,function($,$1,$2) {
          return String.fromCharCode(parseInt($2 , $1 ? 16:10));
        });
      };
      var youdao_reg = /<META HTTP-EQUIV=REFRESH CONTENT="0;URL=([^"]+)">/;
      // &#104&#116&#116&#112&#58&#47&#47&#114&#101&#103&#46&#121&#111&#117&#100&#97&#111&#46&#99&#111&#109&#47&#110&#101&#120&#116&#46&#106&#115&#112&#63&#117&#115&#101&#114&#110&#97&#109&#101&#61&#116&#97&#110&#103&#50&#50&#54&#49&#49&#54&#103&#117&#97&#120&#105&#38&#108&#111&#103&#105&#110&#67&#111&#111&#107&#105&#101&#61&#65&#110&#95&#89&#89&#49&#103&#85&#101&#116&#90&#82&#65&#115&#119&#67&#79&#73&#74&#50&#99&#111&#98&#49&#118&#52&#95&#52&#89&#73&#65&#119&#101&#109&#51&#110&#99&#76&#118&#48&#108&#65&#49&#106&#66&#50&#107&#54&#90&#66&#86&#107&#119&#101&#109&#53&#53&#80&#95&#57&#95&#107&#86&#68&#55&#78&#75&#65&#87&#81&#97&#114&#56&#69&#116&#90&#121&#99&#106&#110&#46&#85&#54&#70&#84&#86&#85&#85&#110&#83&#76&#95&#88&#75&#71&#100&#77&#121&#107&#97&#108&#72&#109&#86&#54&#101&#108&#121&#85&#53&#89&#117&#121&#99&#99&#78&#54&#75&#110&#89&#52&#72&#114&#66&#119&#116&#46&#57&#105&#57&#120&#54&#90&#113&#118&#108&#90&#48&#54&#90&#122&#89&#88&#76&#82&#78&#100&#106&#115&#122&#72&#87&#79&#48&#108&#95&#80&#101&#118&#50&#56&#38&#115&#73&#110&#102&#111&#67&#111&#111&#107&#105&#101&#61&#49&#52&#53&#56&#48&#53&#51&#52&#57&#48&#37&#55&#67&#48&#37&#55&#67&#51&#37&#50&#54&#50&#48&#37&#50&#51&#37&#50&#51&#37&#55&#67&#116&#97&#110&#103&#50&#50&#54&#49&#49&#54&#103&#117&#97&#120&#105&#38&#112&#73&#110&#102&#111&#67&#111&#111&#107&#105&#101&#61&#116&#97&#110&#103&#50&#50&#54&#49&#49&#54&#103&#117&#97&#120&#105&#37&#52&#48&#49&#54&#51&#46&#99&#111&#109&#37&#55&#67&#49&#52&#53&#56&#48&#53&#51&#52&#57&#48&#37&#55&#67&#48&#37&#55&#67&#111&#116&#104&#101&#114&#37&#55&#67&#48&#48&#37&#50&#54&#57&#57&#37&#55&#67&#122&#104&#106&#37&#50&#54&#49&#52&#53&#56&#48&#53&#51&#52&#52&#48&#37&#50&#54&#111&#116&#104&#101&#114&#37&#50&#51&#122&#104&#106&#37&#50&#54&#51&#51&#48&#49&#48&#48&#37&#50&#51&#49&#48&#37&#50&#51&#48&#37&#50&#51&#48&#37&#55&#67&#37&#50&#54&#48&#37&#55&#67&#37&#55&#67&#116&#97&#110&#103&#50&#50&#54&#49&#49&#54&#103&#117&#97&#120&#105&#37&#52&#48&#49&#54&#51&#46&#99&#111&#109&#38&#97&#110&#116&#105&#67&#83&#82&#70&#67&#111&#111&#107&#105&#101&#61&#100&#101&#100&#98&#100&#100&#98&#102&#55&#56&#56&#97&#49&#52&#99&#55&#101&#55&#50&#49&#56&#101&#56&#52&#51&#54&#98&#52&#55&#100&#56&#100&#38&#99&#104&#101&#99&#107&#67&#111&#111&#107&#105&#101&#84&#105&#109&#101&#61&#49&#38&#110&#101&#120&#116&#61&#121&#111&#117&#100&#97&#111&#46&#99&#111&#109&#38&#117&#114&#108&#61&#104&#116&#116&#112&#37&#51&#65&#37&#50&#70&#37&#50&#70&#101&#110&#116&#114&#121&#46&#109&#97&#105&#108&#46&#49&#54&#51&#46&#99&#111&#109&#37&#50&#70&#99&#111&#114&#101&#109&#97&#105&#108&#37&#50&#70&#102&#99&#103&#37&#50&#70&#110&#116&#101&#115&#100&#111&#111&#114&#50&#37&#51&#70&#117&#115&#101&#114&#110&#97&#109&#101&#37&#51&#68&#116&#97&#110&#103&#50&#50&#54&#49&#49&#54&#103&#117&#97&#120&#105&#37&#50&#54&#108&#105&#103&#104&#116&#119&#101&#105&#103&#104&#116&#37&#51&#68&#49&#37&#50&#54&#118&#101&#114&#105&#102&#121&#99&#111&#111&#107&#105&#101&#37&#51&#68&#49&#37&#50&#54&#108&#97&#110&#103&#117&#97&#103&#101&#37&#51&#68&#45&#49&#37&#50&#54&#115&#116&#121&#108&#101&#37&#51&#68&#45&#49&#37&#48&#65

      console.log(status);
      console.log(headers['location']);
      //youdao_reg.exec(content);
      //var youdao_url = RegExp.$1;
      //console.log('youdao_url:' + youdao_url);
      //console.log('after decode:' + htmlDecode(youdao_url));
      //self.youdao_url = youdao_url;

      //self.visitYoudao();

      if(status == 200){

      }
      else{

      }
      //msg = '【' + self.qq + '】添加白名单的结果：status' + status + '返回:' + content;
      /!*console_logger.info(msg);
       file_logger.info(msg);*!/

      //callback();
    });
  });

  req.write(post_data + "\n");
  req.end();*/


};

mail163.prototype.visitYoudao = function(){
  var self = this;
  var url = self.youdao_url;


  var header_sent = {
    "Host": http_tools.getHost(url),
    /*"Referer": "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=" + self.g_appid + "&daid=" + self.g_daid
    + "&s_url=https://mail.qq.com/cgi-bin/login?vt=passport%26vm=wpt%26ft=loginpage%26target=&style=" + self.g_style
    + "&low_login=1&proxy_url=https://mail.qq.com/proxy.html&need_qr=0&;hide_border=1&border_radius=0"
    + "&self_regurl=http://zc.qq.com/chs/index.html?type=1&app_id=11005?t=regist"
    + "&pt_feedback_link=http://support.qq.com/discuss/350_1.shtml"
    + "&css=https://res.mail.qq.com/zh_CN/htmledition/style/ptlogin_input24e6b9.css",*/
    "cookie": cookie_util.get_simple_cookie_str(self.cookies)
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);


  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');


      console.log(status);
      console.log(headers['location']);
      console.log(content);
      if(status == 302){
        self.redirect_url = headers['location'];
        self.redirect();
      }
      else{

      }

      //eval('self.' + content);

    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
    file_logger.error(self.qq + e);*/
  });
};

mail163.prototype.redirect = function(){
  var self = this;
  var url = self.login_url;
  console.log('redirecting...' + url);

  var header_sent = {
    "Host": http_tools.getHost(url),
    /*"Referer": self.youdao_url,*/
    "cookie": cookie_util.get_simple_cookie_str(self.cookies)
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);


  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');


      /*console.log(status);
      console.log(headers['location']);
      console.log(content);*/

      var ntesdoor_reg = /<META HTTP-EQUIV=REFRESH CONTENT="0;URL=([^"]+)">/;
      ntesdoor_reg.exec(content);
      self.ntesdoor_url = RegExp.$1;
      self.ntesdoor();

      /*if(status = 302){
        self.final_redirect = headers['location'];
        self.redirectLogin();
      }*/



      //eval('self.' + content);

    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
     file_logger.error(self.qq + e);*/
  });
};

mail163.prototype.ntesdoor = function(){

  var self = this;
  var url = encoder_util.htmlDecode(self.ntesdoor_url);
  console.log('ntesdoor' + url);

  var header_sent = {
    "Host": http_tools.getHost(url),
    /*"Referer": self.youdao_url,*/
    "cookie": cookie_util.get_simple_cookie_str(self.cookies)
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);

  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;


    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    res.on('data',function(chunk){
      content += chunk;
    });
    res.on('end',function(){
      content = iconv.decode(new Buffer(content,'binary'),'utf8');


      //console.log(status);
      console.log(headers['location']);
      console.log(content);


      if(status = 302){
        self.final_redirect = headers['location'];
        self.redirectLogin();
      }

    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
     file_logger.error(self.qq + e);*/
  });
};

mail163.prototype.redirectLogin = function(){
  var self = this;
  var url = self.final_redirect;


  console.log('final login' + url);

  var header_sent = {
    "Host": http_tools.getHost(url),
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0',
    "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    "Accept-Language": 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    //"Referer": self.login_url,
    //"cookie": cookie_util.get_simple_cookie_str(self.cookies)
    "Accept-Encoding": "gzip, deflate",
    "Cookie": self.cookies
  };
  console.log(header_sent.cookie);

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);


  var content = '';
  var protocol = http_tools.getProtocol(url);
  protocol.get({
    host:http_tools.getHost(url),
    port:http_tools.getPort(url),
    path:http_tools.getPath(url),
    headers: header_sent
  }, function(res){
    //res.setEncoding('binary');
    var status = res.statusCode;
    var headers = res.headers;
    console.log(JSON.stringify(headers))

    //self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    var buffer = [];
    var gunzip = zlib.createGunzip();
    res.pipe(gunzip);

    gunzip.on('data',function(chunk){
      //content += chunk;
      buffer.push(chunk.toString())
    });
    gunzip.on('end',function(){

      console.log(buffer.join(""));
      //content = iconv.decode(buffer,'utf8');
      //console.log(content)



      /*content = iconv.decode(new Buffer(content,'binary'),'utf8');


      console.log('final:' + status);
      console.log('final location:' + headers['location']);
      console.log('final content:' + content);*/

      /*if(status = 302){
        self.final_redirect = headers['location'];
        self.redirectLogin();
      }*/



      //eval('self.' + content);

    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
     file_logger.error(self.qq + e);*/
  });
};

// 搜索
mail163.prototype.search = function(search_conf){

};


module.exports = mail163;