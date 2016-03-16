// http://blog.csdn.net/liyifei21/article/details/11747411
var htmlDecode = function(str) {
  return str.replace(/&#(x)?([^&]{1,5});?/g,function($,$1,$2) {
    return String.fromCharCode(parseInt($2 , $1 ? 16:10));
  });
};

module.exports = {
  htmlDecode: htmlDecode
};