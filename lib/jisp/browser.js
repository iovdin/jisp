(function() {
  var jisp, compile;
  jisp = require("./jisp");
  jisp.require = require;
  compile = jisp.compile;
  jisp.eval = (function(code, options) {
    if ((typeof options === 'undefined')) options = {};
    options.wrap = false;
    return eval(compile(code, options));
  });
  jisp.run = (function(code, options) {
    var compiled;
    if ((typeof options === 'undefined')) options = {};
    options.wrap = false;
    compiled = compile(code, options);
    return Function(compile(code, options))();
  });
  if ((typeof window === 'undefined')) return;
  jisp.load = (function(url, callback, options, hold) {
    var xhr;
    if ((typeof options === 'undefined')) options = {};
    if ((typeof hold === 'undefined')) hold = false;
    options.sourceFiles = [url];
    xhr = (window.ActiveXObject ? new window.ActiveXObject("Microsoft.XMLHTTP") : new window.XMLHttpRequest());
    xhr.open("GET", url, true);
    if (("overrideMimeType" in xhr)) xhr.overrideMimeType("text/plain");
    xhr.onreadystatechange = (function() {
      var param;
      if ((xhr.readyState === 4)) {
        if ((xhr.status === 0 || xhr.status === 200)) {
          param = [xhr.responseText, options];
          if (!hold) jisp.run.apply(jisp, [].concat(param));
        } else {
          throw new Error(("Could not load " + url));
        }
      }
      return (callback ? callback(param) : undefined);
    });
    return xhr.send(null);
  });

  function runScripts() {
    var scripts, jisps, index, s, i, script, _i, _ref, _len, _ref0, _len0;
    scripts = window.document.getElementsByTagName("script");
    jisps = [];
    index = 0;
    _ref = scripts;
    for (_i = 0, _len = _ref.length; _i < _len; ++_i) {
      s = _ref[_i];
      if ((s.type === "text/jisp")) jisps.push(s);
    }

    function execute() {
      var param, _ref0;
      param = jisps[index];
      if ((param instanceof Array)) {
        jisp.run.apply(jisp, [].concat(param));
        ++index;
        _ref0 = execute();
      } else {
        _ref0 = undefined;
      }
      return _ref0;
    }
    execute;
    _ref0 = jisps;
    for (i = 0, _len0 = _ref0.length; i < _len0; ++i) {
      script = _ref0[i];
      (function(script, i) {
        var options, _ref1;
        options = {};
        if (script.src) {
          _ref1 = jisp.load(script.src, (function(param) {
            jisps[i] = param;
            return execute();
          }), options, true);
        } else {
          options.sourceFiles = ["embedded"];
          _ref1 = (jisps[i] = [script.innerHTML, options]);
        }
        return _ref1;
      })(script, i);
    }
    return execute();
  }
  runScripts;
  return window.addEventListener ? window.addEventListener("DOMContentLoaded", runScripts, false) : window.attachEvent("onload", runScripts);
})['call'](this);