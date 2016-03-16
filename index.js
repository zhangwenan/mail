var util = {

  /**
   *
   * @param conf
   * @returns {*}
   *
   * conf.user
   * conf.password
   * conf.cookies
   * conf.mail
   */
  create: function(conf){
    var mail = null;

    switch (conf.mail){
      case '163':
        var mail163 = require('./lib/mail163');
        mail = new mail163(conf);
        break;
      default :
        break;
    }

    return mail;
  }

};

module.exports = util;