(function() {
  var tokens, recode, recomment, redstring, resstring, rereg;
  tokens = [];
  recode = /^[^]*?(?=;.*[\n\r]?|""|"[^]*?(?:[^\\]")|''|'[^]*?(?:[^\\]')|\/[^\s]+\/[\w]*)/;
  recomment = /^[^\(];.*[\n\r]?/;
  redstring = /^""|^"[^]*?(?:[^\\]")[^\s):\[\]\{\}]*/;
  resstring = /^''|^'[^]*?(?:[^\\]')[^\s):\[\]\{\}]*/;
  rereg = /^\/[^\s]+\/[\w]*[^\s)]*/;

  function grate(str) {
    return str
      .replace(/[^\(];.*$/gm, "")
      .replace(/\{/g, "(fn (")
      .replace(/\}/g, "))")
      .replace(/\(/g, " ( ")
      .replace(/\)/g, " ) ")
      .replace(/\[$/g, " [ ")
      .replace(/\['/g, " [ '")
      .replace(/\["/g, ' [ "')
      .replace(/'\]/g, "' ] ")
      .replace(/"\]/g, '" ] ')
      .replace(/\[[\s]*\(/g, " [ ( ")
      .replace(/\)[\s]*\]/g, " ) ] ")
      .replace(/([^:]):(?!\:)/g, "$1 : ")
      .replace(/`/g, " ` ")
      .replace(/,/g, " , ")
      .replace(/\.\.\./g, " ... ")
      .replace(/…/g, " … ")
      .trim()
      .split(/\s+/);
  }
  grate;

  function concatNewLines(str) {
    return str.replace(/\n|\n\r/g, "\\n");
  }
  concatNewLines;

  function match(str, re) {
    var mask;
    return (((mask = str.match(re)) && (mask[0].length > 0)) ? mask[0] : null);
  }
  match;

  function tokenise(str) {
    var mask, openBrackets;
    tokens = [];
    while ((str = str.trim()).length > 0) {
      if ((mask = match(str, recode))) {
        tokens.push.apply(tokens, [].concat(grate(mask)));
        str = str.replace(recode, "");
      } else if (mask = match(str, recomment)) {
        str = str.replace(recomment, "");
      } else if (mask = match(str, redstring)) {
        tokens.push(concatNewLines(mask));
        str = str.replace(redstring, "");
      } else if (mask = match(str, resstring)) {
        tokens.push(concatNewLines(mask));
        str = str.replace(resstring, "");
      } else if (mask = match(str, rereg)) {
        tokens.push(mask);
        str = str.replace(rereg, "");
      } else {
        tokens.push.apply(tokens, [].concat(grate(str)));
        str = "";
      }
    }
    openBrackets = 0;
    return tokens.filter((function(x) {
        return ((typeof x !== 'undefined') && (x !== "" && x !== undefined && x !== null));
      }))
      .filter((function(token, index, array) {
        var _ref;
        if (((openBrackets === 0) && (token === "(") && ((index + 1) < array.length) && (array[(index + 1)] === ";"))) {
          openBrackets++;
          _ref = false;
        } else if ((openBrackets > 0) && (token === "(")) {
          openBrackets++;
          _ref = false;
        } else if ((openBrackets > 0) && (token === ")")) {
          openBrackets--;
          _ref = false;
        } else if (openBrackets > 0) {
          _ref = false;
        } else {
          _ref = true;
        }
        return _ref;
      }));
  }
  tokenise;
  return module.exports = tokenise;
})['call'](this);