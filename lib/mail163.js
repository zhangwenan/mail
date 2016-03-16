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

// 登陆
mail163.prototype.login = function(){

  var self = this;
  var user = self.user.replace(/@163\.com/g, '');
  var password = self.password;

  var a = encoder.getRnd(user + "@163.com");

  var url = "http://reg.163.com/services/httpLoginExchgKeyNew?rnd=" + a + "&jsonp=fEnData";
  //http://reg.163.com/services/httpLoginExchgKeyNew?rnd=eXVubGUxNzcwMDU4bHVAMTYzLmNvbQ==&jsonp=fEnData


  //msg = self.qq + ',';
  //file_logger.info(msg);

  var header_sent = {
    "Host": http_tools.getHost(url),
    "Cookie": cookie_util.get_simple_cookie_str(self.cookies)
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

};

mail163.prototype.redirect = function(){
  var self = this;
  var url = self.login_url;

  //console.log('redirecting...' + url);

  var header_sent = {
    "Host": http_tools.getHost(url),
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

      var ntesdoor_reg = /<META HTTP-EQUIV=REFRESH CONTENT="0;URL=([^"]+)">/;
      ntesdoor_reg.exec(content);
      self.ntesdoor_url = RegExp.$1;
      self.ntesdoor();

    });


  }).on('error', function(e){
    /*console_logger.error(self.qq + '登陆失败, ' + e);
     file_logger.error(self.qq + e);*/
  });
};

mail163.prototype.ntesdoor = function(){

  var self = this;
  var url = encoder_util.htmlDecode(self.ntesdoor_url);
  //console.log('ntesdoor' + url);

  var header_sent = {
    "Host": http_tools.getHost(url),
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

      //console.log(headers['location']);
      //console.log(content);

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
    "Accept-Encoding": "gzip, deflate",
    "Cookie": self.cookies
  };

  //msg = self.qq + 'postToLogin';
  //file_logger.info(msg);

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

    self.cookies = cookie_util.merge_cookie(self.cookies, headers["set-cookie"]);

    var buffer = [];
    var gunzip = zlib.createGunzip();
    res.pipe(gunzip);

    gunzip.on('data',function(chunk){
      buffer.push(chunk.toString())
    });
    gunzip.on('end',function(){

      console.log(buffer.join(""));
      //content = iconv.decode(buffer,'utf8');
      //console.log(content)


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