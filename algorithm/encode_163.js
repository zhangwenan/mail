var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64encode(g) {
  var c, e, a;
  var f, d, b;
  a = g.length;
  e = 0;
  c = "";
  while (e < a) {
    f = g.charCodeAt(e++) & 255;
    if (e == a) {
      c += base64EncodeChars.charAt(f >> 2);
      c += base64EncodeChars.charAt((f & 3) << 4);
      c += "==";
      break
    }
    d = g.charCodeAt(e++);
    if (e == a) {
      c += base64EncodeChars.charAt(f >> 2);
      c += base64EncodeChars.charAt(((f & 3) << 4) | ((d & 240) >> 4));
      c += base64EncodeChars.charAt((d & 15) << 2);
      c += "=";
      break
    }
    b = g.charCodeAt(e++);
    c += base64EncodeChars.charAt(f >> 2);
    c += base64EncodeChars.charAt(((f & 3) << 4) | ((d & 240) >> 4));
    c += base64EncodeChars.charAt(((d & 15) << 2) | ((b & 192) >> 6));
    c += base64EncodeChars.charAt(b & 63)
  }
  return c
}
function utf16to8(e) {
  var b, d, a, f;
  b = "";
  a = e.length;
  for (d = 0; d < a; d++) {
    f = e.charCodeAt(d);
    if ((f >= 1) && (f <= 127)) {
      b += e.charAt(d)
    } else {
      if (f > 2047) {
        b += String.fromCharCode(224 | ((f >> 12) & 15));
        b += String.fromCharCode(128 | ((f >> 6) & 63));
        b += String.fromCharCode(128 | ((f >> 0) & 63))
      } else {
        b += String.fromCharCode(192 | ((f >> 6) & 31));
        b += String.fromCharCode(128 | ((f >> 0) & 63))
      }
    }
  }
  return b
}

function getRnd(b) {
  var a = base64encode(utf16to8(b));
  return a
}

module.exports = {
  getRnd: getRnd,
  utf16to8: utf16to8,
  base64encode: base64encode
};