(function() {
  function range(start, end) {
    var a, _res, _ref;
    if ((typeof end === 'undefined')) {
      end = start;
      start = 0;
    }
    _res = [];
    while (true) {
      if ((start <= end)) {
        a = start;
        ++start;
        _ref = a;
      } else {
        _ref = undefined;
        break;
      }
      if (typeof _ref !== 'undefined') _res.push(_ref);
    }
    return _res;
  }
  var execSync = function(env) {
    var newBody, src, _i;
    var body = 2 <= arguments.length ? [].slice.call(arguments, 1, _i = arguments.length - 0) : (_i = 1, []);
    newBody = [].concat([
      ["=", "params", {}],
      ["try", ["=", "params", ["JSON.parse", "process.env.params"]],
        ["catch", "err", ["prn", "\"error\"", "err"]]
      ],
      ["over", "value", "key", "params", ["=", "global[key]", "value"]]
    ]).concat(body);
    src = JSON.stringify(compile(newBody, {
      topScope: false,
      wrap: false
    }));
    return ["do", ["=", "cp", ["require", "\"child_process\""], "env", {}, "process", ["require", "\"process\""]],
      ["over", "value", "key", "process.env", ["=", "env[key]", "value"]],
      ["=", "env.params", ["JSON.stringify", env], "env.scriptSource", src],
      ["=", "result", ["cp.spawnSync", "process.execPath", ["list", "\"-e\"", "\"require('vm').runInThisContext(process.env.scriptSource)\""],
        [":", "\"env\"", "env"]
      ]],
      ["if", "result.stdout.length", "result.stdout", "result.stderr"]
    ];
  };
  var includeSource = function(url) {
    var parsed;
    parsed = parse(lex(tokenise(load(JSON.parse(url)))));
    parsed.unshift("do");
    return parsed;
  };
  var gistCheckout = function() {
    var repo, args, arg, _i, _i0, _res, _ref, _len, _ref0;
    var args = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
    repo = "iovdin/2e3169e10a77ce91d9a9";
    if ((args[0].indexOf("/") !== -1)) {
      repo = args[0];
      args = args["slice"](1);
    }
    _res = [];
    _ref = args;
    for (_i0 = 0, _len = _ref.length; _i0 < _len; ++_i0) {
      arg = _ref[_i0];
      if (typeof(_ref0 = ["includeSource", JSON.stringify("https://gist.githubusercontent.com/" + repo + "/raw/" + arg)]) !== 'undefined') _res.push(_ref0);
    }
    return [].concat(["do"]).concat(_res);
  };
  var fileCheckout = function() {
    var arg, _i, _i0, _res, _ref, _len, _ref0;
    var args = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
    _res = [];
    _ref = args;
    for (_i0 = 0, _len = _ref.length; _i0 < _len; ++_i0) {
      arg = _ref[_i0];
      if (typeof(_ref0 = ["includeSource", arg]) !== 'undefined') _res.push(_ref0);
    }
    return [].concat(["do"]).concat(_res);
  };

  function load(url) {
    var req, process, cp, env, key, value, result, _ref, _len, _ref0;
    if (loadCache[url]) {
      console.log("load", url, "cached", !!loadCache[url]);
      return loadCache[url];
    }

    function list() {
      var _i;
      var args = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
      return [].concat(args);
    }
    list;
    if ((typeof window !== 'undefined')) {
      req = new window.XMLHttpRequest();
      req.open("GET", url, false);
      req.send();
      _ref0 = req.responseText;
    } else {
      if ((url.indexOf("http") === -1)) {
        fs = require("fs");
        return fs.readFileSync(url, {
          encoding: "utf-8"
        });
      }
      process = require("process");
      cp = require("child_process");
      env = {};
      process = require("process");
      _ref = process.env;
      for (key in _ref) {
        value = _ref[key];
        env[key] = value;
      }
      env.params = JSON.stringify({
        "url": url
      });
      env.scriptSource = "var params, key, value, http, parsedURL, req, _ref, _len;\nparams = {};\ntry {\n  params = JSON.parse(process.env.params);\n} catch (err) {\n  console.log(\"error\", err);\n}\n_ref = params;\nfor (key in _ref) {\n  value = _ref[key];\n  global[key] = value;\n}\nhttp = require(((url.indexOf(\"https\") < 0) ? \"http\" : \"https\"));\nparsedURL = require(\"url\").parse(url);\nreq = http.request(parsedURL, (function(res) {\n  return res.pipe(process.stdout);\n}));\nreq.end();";
      result = cp.spawnSync(process.execPath, ["-e", "require('vm').runInThisContext(process.env.scriptSource)"], {
        "env": env
      });
      result = (result.stdout.length ? result.stdout : result.stderr);
      result = result.toString('utf-8');
      loadCache[url] = result;
      _ref0 = result;
    }
    return _ref0;
  }
  var vm, fs, path, beautify, utils, ops, operators, opFuncs, tokenise, lex, parse, Uniq, pr, spr, render, isAtom, isHash, isList, isVarName, isIdentifier, isService, getServicePart, assertExp, plusname, functionsRedeclare, functionsRedefine, specials, macros, functions;
  exports.version = "0.3.15";
  vm = require("vm");
  fs = require("fs");
  path = require("path");
  beautify = require("js-beautify");
  utils = require("./utils");
  ops = require("./operators");
  operators = ops.operators;
  opFuncs = ops.opFuncs;
  tokenise = require("./tokenise");
  lex = require("./lex");
  parse = require("./parse");
  Uniq = require("./uniq");
  pr = utils.pr;
  spr = utils.spr;
  render = utils.render;
  isAtom = utils.isAtom;
  isHash = utils.isHash;
  isList = utils.isList;
  isVarName = utils.isVarName;
  isIdentifier = utils.isIdentifier;
  isService = utils.isService;
  getServicePart = utils.getServicePart;
  assertExp = utils.assertExp;
  plusname = utils.plusname;
  functionsRedeclare = [];
  functionsRedefine = [];

  function declareVar(name, scope) {
    var _ref;
    if (([].indexOf.call(scope.hoist, name) >= 0)) {
      _ref = scope;
    } else {
      scope.hoist.push(name);
      _ref = scope;
    }
    return _ref;
  }
  declareVar;

  function declareService(name, scope) {
    while (([].indexOf.call(scope.hoist, name) >= 0) || ([].indexOf.call(scope.service, name) >= 0)) {
      name = plusname(name);
    }
    scope.service.push(name);
    return [name, scope];
  }
  declareService;

  function hasSpread(form) {
    return (isList(form) && (form[0] === "spread"));
  }
  hasSpread;

  function compileResolve(form, buffer, scope, opts, nested) {
    var compiled, i, name, newname, re, subst, str, _ref, _i, _ref0, _len, _ref1, _len0;
    _ref = compileForm(form, scope, opts, nested);
    compiled = _ref[0];
    scope = _ref[1];
    _ref0 = scope.service;
    for (i in _ref0) {
      name = _ref0[i];
      if (([].indexOf.call(scope.hoist, name) >= 0)) {
        newname = name;
        while ([].indexOf.call(scope.hoist, newname) >= 0) {
          newname = plusname(newname);
        }
        scope.service[i] = newname;
        re = RegExp("(?=(?:[^$#_A-Za-z0-9]{1}|^)" + name + "(?:[^$#_A-Za-z0-9]{1}|$))([^$#_A-Za-z0-9]|^)" + name, "g");
        subst = "$1" + newname;
        _ref1 = buffer;
        for (i = 0, _len0 = _ref1.length; i < _len0; ++i) {
          str = _ref1[i];
          if (((typeof str !== 'undefined') && (typeof str === "string"))) buffer[i] = str.replace(re, subst);
        }
      }
    }
    return [compiled, buffer, scope];
  }
  compileResolve;

  function compileAdd(form, buffer, scope, opts, nested) {
    var compiled, _ref, _i;
    _ref = compileResolve(form, buffer, scope, opts, nested);
    compiled = _ref[0];
    buffer = _ref[1];
    scope = _ref[2];
    buffer.push.apply(buffer, [].concat(compiled));
    return [buffer, scope];
  }
  compileAdd;

  function compileGetLast(form, buffer, scope, opts, nested) {
    var lastItem, _ref, _i;
    _ref = compileAdd(form, buffer, scope, opts, nested);
    buffer = _ref[0];
    scope = _ref[1];
    lastItem = buffer.pop();
    return [lastItem, buffer, scope];
  }
  compileGetLast;

  function returnify(form) {
    var _ref;
    if ((isAtom(form) || isHash(form))) {
      _ref = ["return", form];
    } else if (isList(form) && utils.isBlankObject(form)) {
      _ref = form;
    } else if (isList(form) && (form.length === 1) && utils.isBlankObject(form[0])) {
      _ref = form[0];
    } else if (isList(form) && (form[0] !== "return")) {
      _ref = ["return", form];
    } else {
      _ref = form;
    }
    return _ref;
  }
  returnify;

  function getArgNames(args) {
    var arr, arg, _i, _ref, _len;
    arr = [];
    _ref = args;
    for (_i = 0, _len = _ref.length; _i < _len; ++_i) {
      arg = _ref[_i];
      if ((isAtom(arg) && isVarName(arg))) {
        arr.push(arg);
      } else if (isList(arg) && isVarName(arg[0]) && !([].indexOf.call(Object.keys(specials), arg[0]) >= 0) && !([].indexOf.call(Object.keys(macros), arg[0]) >= 0) && !(arg[0] === "mac")) {
        arr.push(arg[0]);
      }
    }
    return arr;
  }
  getArgNames;

  function notRedefined(name) {
    return (!([].indexOf.call(functionsRedeclare, name) >= 0) && !([].indexOf.call(functionsRedefine, name) >= 0));
  }
  notRedefined;

  function isPropertyExp(form) {
    return (isList(form) && ((isList(form[0]) && (form[0].length === 2) && (form[0][0] === "get")) || utils.isPropSyntax(form[0])));
  }
  isPropertyExp;

  function compileForm(form, scope, opts, nested) {
    var buffer, nestedLocal, first, isOuterOperator, innerType, i, arg, argsSpread, split, method, name, collector, oldReplace, serv, re, key, val, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _len, _ref3, _i2, _ref4, _i3, _ref5, _i4, _ref6, _i5, _ref7, _i6, _ref8, _i7, _ref9, _i8, _ref10, _ref11, _i9, _ref12, _i10, _ref13, _i11, _ref14, _len0, _ref15, _i12, _ref16;
    if ((typeof opts === 'undefined')) opts = {};
    try {
      if ((isList(form) && utils.isBlankObject(form))) {
        _ref10 = [
          [""], scope
        ];
      } else if (isAtom(form)) {
        if (((([].indexOf.call(Object.keys(functions), form) >= 0) && notRedefined(form)) || ([].indexOf.call(Object.keys(macros), form) >= 0))) {
          if (isService(form)) {
            _ref11 = compileGetLast(form, buffer, scope, opts, nested);
            form = _ref11[0];
            buffer = _ref11[1];
            scope = _ref11[2];
          } else {
            assertExp(form, isVarName, "valid identifier");
            scope = declareVar(form, scope);
          }
        } else if ([].indexOf.call(Object.keys(opFuncs), form) >= 0) {
          if (isService(form)) {
            _ref12 = compileGetLast(form, buffer, scope, opts, nested);
            form = _ref12[0];
            buffer = _ref12[1];
            scope = _ref12[2];
          } else {
            assertExp(form, isVarName, "valid identifier");
            scope = declareVar(form, scope);
          }
          form = opFuncs[form].name;
        }
        if (isService(form)) {
          serv = getServicePart(form);
          re = RegExp("^" + serv);
          if (!([].indexOf.call(Object.keys(scope.replace), serv) >= 0)) {
            _ref13 = declareService(serv["slice"](1), scope, (opts.function ? args : undefined));
            scope.replace[serv] = _ref13[0];
            scope = _ref13[1];
          }
          form = form.replace(re, scope.replace[serv]);
        }
        _ref10 = [
          [form], scope
        ];
      } else if (isHash(form)) {
        buffer = [];
        nested = undefined;
        _ref14 = form;
        for (key in _ref14) {
          val = _ref14[key];
          _ref15 = compileGetLast(val, buffer, scope, opts, nested);
          form[key] = _ref15[0];
          buffer = _ref15[1];
          scope = _ref15[2];
        }
        buffer.push(form);
        _ref10 = [buffer, scope];
      } else {
        if (!isList(form)) throw Error("expecting list, got: " + pr(form));
        buffer = [];
        form = form.slice();
        if (([].indexOf.call(Object.keys(specials), form[0]) >= 0)) {
          _ref = specials[form[0]](form, scope, opts, nested);
          buffer = _ref[0];
          scope = _ref[1];
        } else if (form[0] === "mac") {
          _ref8 = compileAdd(parseMacros(form), buffer, scope, opts, nested);
          buffer = _ref8[0];
          scope = _ref8[1];
        } else if ([].indexOf.call(Object.keys(macros), form[0]) >= 0) {
          oldReplace = scope.replace;
          scope.replace = {};
          _ref9 = compileAdd(expandMacros(form), buffer, scope, opts, nested);
          buffer = _ref9[0];
          scope = _ref9[1];
          scope.replace = oldReplace;
        } else {
          nestedLocal = nested;
          nested = undefined;
          _ref0 = compileGetLast(form.shift(), buffer, scope, opts, nested);
          first = _ref0[0];
          buffer = _ref0[1];
          scope = _ref0[2];
          if ((([].indexOf.call(Object.keys(functions), first) >= 0) && notRedefined(first))) {
            if (isService(first)) {
              _ref1 = compileGetLast(first, buffer, scope, opts, nested);
              first = _ref1[0];
              buffer = _ref1[1];
              scope = _ref1[2];
            } else {
              assertExp(first, isVarName, "valid identifier");
              scope = declareVar(first, scope);
            }
          }
          if (([].indexOf.call(Object.keys(operators), first) >= 0)) {
            if (!opts.compilingOperator) isOuterOperator = true;
            innerType = nestedLocal || !!opts.compilingOperator;
            opts.compilingOperator = true;
          } else {
            opts = JSON.parse(JSON.stringify(opts));
            delete opts.compilingOperator;
          }
          _ref2 = form;
          for (i = 0, _len = _ref2.length; i < _len; ++i) {
            arg = _ref2[i];
            if (hasSpread(arg)) {
              argsSpread = true;
              _ref3 = compileGetLast(arg, buffer, scope, opts, nested);
              arg = _ref3[0];
              buffer = _ref3[1];
              scope = _ref3[2];
              form[i] = ["spread", arg];
            } else {
              _ref4 = compileGetLast(arg, buffer, scope, opts, nested);
              arg = _ref4[0];
              buffer = _ref4[1];
              scope = _ref4[2];
              form[i] = arg;
            }
          }
          if ((typeof argsSpread === 'undefined')) {
            ([].indexOf.call(Object.keys(operators), first) >= 0) ? buffer.push(operators[first](form, innerType)): buffer.push(pr(first) + "(" + spr(form) + ")");
          } else {
            form = ["quote", form];
            _ref5 = compileGetLast(form, buffer, scope, opts, nested);
            form = _ref5[0];
            buffer = _ref5[1];
            scope = _ref5[2];
            if (([].indexOf.call(Object.keys(operators), first) >= 0)) {
              if ((([].indexOf.call(Object.keys(opFuncs), first) >= 0) && spr(opFuncs[first]))) {
                if (isService(first)) {
                  _ref6 = compileGetLast(first, buffer, scope, opts, nested);
                  first = _ref6[0];
                  buffer = _ref6[1];
                  scope = _ref6[2];
                } else {
                  assertExp(first, isVarName, "valid identifier");
                  scope = declareVar(first, scope);
                }
                first = opFuncs[first].name;
              } else {
                throw Error(pr(first) + " can't spread arguments (yet)");
              }
            }
            split = utils.splitName(first);
            if ((split.length > 1)) {
              method = split.pop();
              name = split.join("");
            } else {
              method = "";
              name = split[0];
            }
            if (isIdentifier(name)) {
              buffer.push(name + method + ".apply(" + name + ", " + pr(form) + ")");
            } else {
              _ref7 = declareService("_ref", scope);
              collector = _ref7[0];
              scope = _ref7[1];
              buffer.push("(" + collector + " = " + name + ")" + method + ".apply(" + collector + ", " + pr(form) + ")");
            }
          }
        }
        if ((typeof isOuterOperator !== 'undefined')) delete opts.compilingOperator;
        _ref10 = [buffer, scope];
      }
      _ref16 = _ref10;
    } catch (e) {
      if ((((typeof e !== 'undefined') && (typeof e.lvl !== 'undefined')) && (e.lvl === 3))) console.error("source error context", form);
      e.lvl = e.lvl || 0;
      e.lvl++;
      throw e;
    }
    return _ref16;
  }
  compileForm;
  specials = {};
  specials["awaitn"] = (function(form, scope, opts, nested) {
    var compiled, buffer, h, t, _ref, _i, _ref0, _i0;
    if ((typeof opts === 'undefined')) opts = {};
    _ref = compileResolve(form["slice"](1), [
      []
    ], scope, opts, nested);
    compiled = _ref[0];
    buffer = _ref[1];
    scope = _ref[2];
    _ref0 = compiled;
    var h = 2 <= _ref0.length ? [].slice.call(_ref0, 0, _i0 = _ref0.length - 1) : (_i0 = 0, []);
    t = _ref0[_i0++];
    h.push("await " + t);
    return Array(h, scope);
  });
  specials.do = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, isTopLevel, outerScope, i, exp, ref, vars, funcs, dec, args, name, func, _ref, _len, _ref0, _i, _ref1, _i0, _i1, _ref2, _len0, _i2, _ref3, _len1, _i3, _ref4, _len2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    if (opts.isTopLevel) {
      isTopLevel = true;
      delete opts.isTopLevel;
    }
    if (isTopLevel) {
      outerScope = scope;
      scope = JSON.parse(JSON.stringify(outerScope));
      delete opts.topScope;
    }
    _ref = form;
    for (i = 0, _len = _ref.length; i < _len; ++i) {
      exp = _ref[i];
      nested = (!isTopLevel && (i === (form.length - 1)) && nestedLocal) || isPropertyExp(form[i + 1]);
      if ((typeof exp === 'undefined')) {
        buffer.push(exp);
      } else {
        if (isPropertyExp(exp)) {
          ref = buffer.pop();
          if ((typeof ref === 'undefined')) ref = "";
          _ref0 = compileAdd(exp, buffer, scope, opts, nested);
          buffer = _ref0[0];
          scope = _ref0[1];
          buffer.push(ref + "\n" + buffer.pop());
        } else {
          _ref1 = compileAdd(exp, buffer, scope, opts, nested);
          buffer = _ref1[0];
          scope = _ref1[1];
        }
      }
    }
    if (isTopLevel) {
      vars = [];
      funcs = [];
      dec = "var ";
      if ((typeof args === 'undefined')) args = [];
      _ref2 = scope.hoist;
      for (_i1 = 0, _len0 = _ref2.length; _i1 < _len0; ++_i1) {
        name = _ref2[_i1];
        if ((!([].indexOf.call(outerScope.hoist, name) >= 0) && !([].indexOf.call(args, name) >= 0))) {
          if (([].indexOf.call(Object.keys(functions), name) >= 0)) {
            if ((opts.topScope && ([].indexOf.call(functionsRedeclare, name) >= 0))) {
              vars.push(name);
            } else {
              if (notRedefined(name)) funcs.push(name);
            }
          } else if (([].indexOf.call(Object.keys(opFuncs), name) >= 0) || ([].indexOf.call(Object.keys(macros), name) >= 0)) {
            funcs.push(name);
          } else {
            if (!(name === "this")) vars.push(name);
          }
        }
      }
      _ref3 = scope.service;
      for (_i2 = 0, _len1 = _ref3.length; _i2 < _len1; ++_i2) {
        name = _ref3[_i2];
        if (!([].indexOf.call(outerScope.service, name) >= 0)) vars.push(name);
      }
      while (vars.length > 0) {
        name = vars.shift();
        if (([].indexOf.call(vars, name) >= 0)) throw Error("compiler error: duplicate var in declarations:" + name);
        dec += (name + ", ");
      }
      if ((dec.length > 4)) {
        dec = dec.slice(0, dec.length - 2);
        buffer
          .unshift(dec);
      }
      if (((typeof isTopLevel !== 'undefined') && isTopLevel)) {
        while (funcs.length > 0) {
          func = funcs.pop();
          if (([].indexOf.call(funcs, func) >= 0)) throw Error("compiler error: duplicate func in declarations:" + func);
          if (([].indexOf.call(Object.keys(functions), func) >= 0)) {
            if (notRedefined(func)) {
              if ((((typeof functions !== 'undefined') && (typeof functions[func] !== 'undefined') && (typeof functions[func].name !== 'undefined')) && (functions[func].name !== ""))) {
                buffer
                  .unshift(functions[func].toString());
              } else {
                if (isVarName(func)) buffer
                  .unshift("var " + func + " = " + functions[func].toString() + ";");
              }
            }
          } else if (([].indexOf.call(Object.keys(macros), func) >= 0) && isVarName(func)) {
            buffer
              .unshift("var " + func + " = " + macros[func].toString() + ";");
          } else if (([].indexOf.call(Object.keys(opFuncs), func) >= 0) && isVarName(func)) {
            buffer
              .unshift("var " + opFuncs[func].name + " = " + opFuncs[func].func.toString() + ";");
          } else {
            throw Error("unrecognised func: " + pr(func));
          }
        }
      } else {
        _ref4 = funcs;
        for (_i3 = 0, _len2 = _ref4.length; _i3 < _len2; ++_i3) {
          func = _ref4[_i3];
          if (!([].indexOf.call(outerScope.hoist, func) >= 0)) outerScope.hoist.push(func);
        }
      }
      scope = outerScope;
    }
    return Array(buffer, scope);
  });
  specials.quote = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, arr, res, exp, i, item, key, newform, _i, _ref, _len, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _len0, _ref6, _i5, _ref7, _i6, _ref8, _len1, _ref9, _i7, _ref10, _len2, _ref11, _i8;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    if ((form.length > 1)) throw Error(pr(formName) + " expects no more than " + pr(1) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    form = form[0];
    if ((isAtom(form) && !utils.isPrimitive(form) && !utils.isSpecialValue(form))) {
      buffer.push(JSON.stringify(form));
    } else if (isAtom(form)) {
      buffer.push(form);
    } else if (isHash(form)) {
      if (!opts.macro) {
        _ref8 = form;
        for (key in _ref8) {
          exp = _ref8[key];
          _ref9 = compileGetLast(exp, buffer, scope, opts, nested);
          form[key] = _ref9[0];
          buffer = _ref9[1];
          scope = _ref9[2];
        }
        buffer.push(form);
      } else {
        newform = {};
        _ref10 = form;
        for (key in _ref10) {
          exp = _ref10[key];
          key = JSON.stringify(key);
          _ref11 = compileGetLast(["quote", exp], buffer, scope, opts, nested);
          newform[key] = _ref11[0];
          buffer = _ref11[1];
          scope = _ref11[2];
        }
        buffer.push(newform);
      }
    } else {
      arr = [];
      res = "[]";
      _ref = form;
      for (_i = 0, _len = _ref.length; _i < _len; ++_i) {
        exp = _ref[_i];
        if ((isList(exp) && (exp[0] === "quote") && isList(exp[1]) && (exp[1].length === 0))) {
          arr.push([]);
        } else if (isList(exp) && (exp[0] === "unquote") && isList(exp[1]) && (exp[1][0] === "spread")) {
          _ref2 = compileGetLast(exp["slice"](1)[0], buffer, scope, opts, nested);
          exp = _ref2[0];
          buffer = _ref2[1];
          scope = _ref2[2];
          if ((typeof exp !== 'undefined')) {
            if ((arr.length > 0)) {
              res += (".concat(" + pr(arr) + ")");
              arr = [];
            }
            res += (".concat(" + pr(exp) + ")");
          }
        } else if (isList(exp) && (exp[0] === "quote")) {
          _ref3 = compileGetLast(exp, buffer, scope, opts, nested);
          exp = _ref3[0];
          buffer = _ref3[1];
          scope = _ref3[2];
          if ((typeof exp !== 'undefined')) arr.push(exp);
        } else if (isList(exp) && (exp[0] === "unquote")) {
          _ref4 = compileGetLast(exp, buffer, scope, opts, nested);
          exp = _ref4[0];
          buffer = _ref4[1];
          scope = _ref4[2];
          if (((typeof exp !== 'undefined') && opts.macro)) {
            if (isList(exp)) {
              _ref5 = exp;
              for (i = 0, _len0 = _ref5.length; i < _len0; ++i) {
                item = _ref5[i];
                if (isAtom(item)) {
                  _ref6 = compileGetLast(["quote", item], buffer, scope, opts, nested);
                  exp[i] = _ref6[0];
                  buffer = _ref6[1];
                  scope = _ref6[2];
                }
              }
            }
          }
          if ((typeof exp !== 'undefined')) arr.push(exp);
        } else if (isList(exp) && (exp[0] === "spread") && !opts.macro) {
          _ref7 = compileGetLast(exp, buffer, scope, opts, nested);
          exp = _ref7[0];
          buffer = _ref7[1];
          scope = _ref7[2];
          if ((typeof exp !== 'undefined')) {
            if ((arr.length > 0)) {
              res += (".concat(" + pr(arr) + ")");
              arr = [];
            }
            res += (".concat(" + pr(exp) + ")");
          }
        } else {
          if ((isAtom(exp) && !opts.macro)) {
            _ref0 = compileGetLast(exp, buffer, scope, opts, nested);
            exp = _ref0[0];
            buffer = _ref0[1];
            scope = _ref0[2];
          } else {
            _ref1 = compileGetLast(["quote", exp], buffer, scope, opts, nested);
            exp = _ref1[0];
            buffer = _ref1[1];
            scope = _ref1[2];
          }
          if ((typeof exp !== 'undefined')) arr.push(exp);
        }
      }
      if ((arr.length > 0))(res === "[]") ? res = pr(arr) : res += (".concat(" + pr(arr) + ")");
      buffer.push(res);
    }
    return Array(buffer, scope);
  });
  specials.unquote = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, _ref, _i, _ref0, _i0;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    if ((form.length > 1)) throw Error(pr(formName) + " expects no more than " + pr(1) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    form = form[0];
    if ((isList(form) && (form[0] === "quote"))) {
      _ref = compileGetLast(form, buffer, scope, opts, nested);
      form = _ref[0];
      buffer = _ref[1];
      scope = _ref[2];
    }
    _ref0 = compileAdd(form, buffer, scope, opts, nested);
    buffer = _ref0[0];
    scope = _ref0[1];
    return Array(buffer, scope);
  });
  specials["="] = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, left, right, lastAssign, res, ref, ind, spreads, i, name, spreadname, spreadind, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _i5, _ref6, _i6, _ref7, _len, _ref8, _i7, _ref9, _i8, _ref10, _i9, _ref11, _i10, _ref12, _i11, _ref13, _i12;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    if ((form.length === 1)) {
      if (isService(form[0])) {
        _ref = compileGetLast(form[0], buffer, scope, opts, nested);
        form[0] = _ref[0];
        buffer = _ref[1];
        scope = _ref[2];
      } else {
        assertExp(form[0], isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), form[0]) >= 0) && !([].indexOf.call(scope.hoist, form[0]) >= 0) && notRedefined(form[0]))) functionsRedeclare.push(form[0]);
        scope = declareVar(form[0], scope);
      }
      _ref0 = compileAdd(form[0], buffer, scope, opts, nested);
      buffer = _ref0[0];
      scope = _ref0[1];
    } else {
      assertExp(form, (function() {
        return ((arguments[0].length % 2) === 0);
      }), "an even number of arguments");
      while (form.length > 0) {
        left = form.shift();
        right = form.shift();
        lastAssign = ((form.length === 0) ? true : undefined);
        _ref1 = compileGetLast(right, buffer, scope, opts, nested);
        right = _ref1[0];
        buffer = _ref1[1];
        scope = _ref1[2];
        if ((isList(left) && ([].indexOf.call(Object.keys(macros), left[0]) >= 0))) {
          _ref2 = compileGetLast(left, buffer, scope, opts, nested);
          left = _ref2[0];
          buffer = _ref2[1];
          scope = _ref2[2];
        }
        if ((isList(left) && (left[0] === "get"))) {
          _ref3 = compileGetLast(left, buffer, scope, opts, nested);
          left = _ref3[0];
          buffer = _ref3[1];
          scope = _ref3[2];
          res = pr(left) + " = " + pr(right);
          if ((lastAssign && nestedLocal && (nestedLocal !== "parens"))) res = "(" + res + ")";
          buffer.push(res);
        } else if (isList(left)) {
          _ref5 = declareService("_ref", scope, (opts.function ? args : undefined));
          ref = _ref5[0];
          scope = _ref5[1];
          _ref6 = declareService("_i", scope, (opts.function ? args : undefined));
          ind = _ref6[0];
          scope = _ref6[1];
          buffer.push(ref + " = " + pr(right));
          spreads = 0;
          _ref7 = left;
          for (i = 0, _len = _ref7.length; i < _len; ++i) {
            name = _ref7[i];
            if ((name[0] === "spread")) {
              if ((++spreads > 1)) throw Error("an assignment can only have one spread");
              _ref8 = compileGetLast(name, buffer, scope, opts, nested);
              name = _ref8[0];
              buffer = _ref8[1];
              scope = _ref8[2];
              if (isService(name)) {
                _ref9 = compileGetLast(name, buffer, scope, opts, nested);
                name = _ref9[0];
                buffer = _ref9[1];
                scope = _ref9[2];
              } else {
                assertExp(name, isVarName, "valid identifier");
                if ((opts.topScope && ([].indexOf.call(Object.keys(functions), name) >= 0) && !([].indexOf.call(scope.hoist, name) >= 0) && notRedefined(name))) functionsRedeclare.push(name);
                scope = declareVar(name, scope);
              }
              spreadname = name;
              spreadind = i;
              buffer.push("var " + spreadname + " = " + left.length + " <= " + ref + ".length ? [].slice.call(" + ref + ", " + spreadind + ", " + ind + " = " + ref + ".length - " + (left.length - spreadind - 1) + ") : (" + ind + " = " + spreadind + ", [])");
            } else if (typeof spreadname === 'undefined') {
              _ref12 = compileGetLast(name, buffer, scope, opts, nested);
              name = _ref12[0];
              buffer = _ref12[1];
              scope = _ref12[2];
              if (isVarName(name)) {
                if (isService(name)) {
                  _ref13 = compileGetLast(name, buffer, scope, opts, nested);
                  name = _ref13[0];
                  buffer = _ref13[1];
                  scope = _ref13[2];
                } else {
                  assertExp(name, isVarName, "valid identifier");
                  if ((opts.topScope && ([].indexOf.call(Object.keys(functions), name) >= 0) && !([].indexOf.call(scope.hoist, name) >= 0) && notRedefined(name))) functionsRedeclare.push(name);
                  scope = declareVar(name, scope);
                }
              }
              buffer.push(pr(name) + " = " + ref + "[" + i + "]");
            } else {
              _ref10 = compileGetLast(name, buffer, scope, opts, nested);
              name = _ref10[0];
              buffer = _ref10[1];
              scope = _ref10[2];
              if (isVarName(name)) {
                if (isService(name)) {
                  _ref11 = compileGetLast(name, buffer, scope, opts, nested);
                  name = _ref11[0];
                  buffer = _ref11[1];
                  scope = _ref11[2];
                } else {
                  assertExp(name, isVarName, "valid identifier");
                  if ((opts.topScope && ([].indexOf.call(Object.keys(functions), name) >= 0) && !([].indexOf.call(scope.hoist, name) >= 0) && notRedefined(name))) functionsRedeclare.push(name);
                  scope = declareVar(name, scope);
                }
              }
              buffer.push(pr(name) + " = " + ref + "[" + ind + "++]");
            }
          }
        } else {
          if (isVarName(left)) {
            if (isService(left)) {
              _ref4 = compileGetLast(left, buffer, scope, opts, nested);
              left = _ref4[0];
              buffer = _ref4[1];
              scope = _ref4[2];
            } else {
              assertExp(left, isVarName, "valid identifier");
              if ((opts.topScope && ([].indexOf.call(Object.keys(functions), left) >= 0) && !([].indexOf.call(scope.hoist, left) >= 0) && notRedefined(left))) functionsRedeclare.push(left);
              scope = declareVar(left, scope);
            }
          }
          assertExp(left, isIdentifier);
          res = pr(left) + " = " + pr(right);
          if ((isHash(right) && !nestedLocal)) res += ";";
          if ((lastAssign && nestedLocal && (nestedLocal !== "parens"))) res = "(" + res + ")";
          buffer.push(res);
        }
      }
    }
    return Array(buffer, scope);
  });
  specials.fn = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, outerScope, args, body, optionals, spreads, i, arg, ind, name, restname, restind, rest, vars, funcs, dec, func, aprefix, _ref, _i, _ref0, _len, _ref1, _i0, _ref2, _i1, _ref3, _i2, _ref4, _i3, _i4, _ref5, _len0, _i5, _ref6, _len1, _i6, _ref7, _len2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    outerScope = scope;
    scope = JSON.parse(JSON.stringify(outerScope));
    delete opts.topScope;
    _ref = form;
    var args = 2 <= _ref.length ? [].slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []);
    body = _ref[_i++];
    scope.hoist.push.apply(scope.hoist, [].concat(getArgNames(args)));
    if ((typeof body === 'undefined')) body = [];
    optionals = [];
    spreads = 0;
    _ref0 = args;
    for (i = 0, _len = _ref0.length; i < _len; ++i) {
      arg = _ref0[i];
      if ((isList(arg) && ([].indexOf.call(Object.keys(macros), arg[0]) >= 0))) {
        _ref1 = compileGetLast(arg, buffer, scope, opts, nested);
        arg = _ref1[0];
        buffer = _ref1[1];
        scope = _ref1[2];
      }
      if (isList(arg)) {
        assertExp(arg, (function() {
          return (arguments[0].length === 2);
        }), "optional or rest parameter");
        if ((arg[0] === "spread")) {
          if ((++spreads > 1)) throw Error("cannot define more than one rest parameter");
          _ref2 = declareService("_i", scope, (opts.function ? args : undefined));
          ind = _ref2[0];
          scope = _ref2[1];
          _ref3 = compileGetLast(arg, buffer, scope, opts, nested);
          name = _ref3[0];
          buffer = _ref3[1];
          scope = _ref3[2];
          assertExp(name, isVarName, "valid identifier");
          restname = name;
          restind = i;
          args[i] = restname;
          rest = ["var " + name + " = " + args.length + " <= arguments.length ? [].slice.call(arguments, " + i + ", " + ind + " = arguments.length - " + (args.length - i - 1) + ") : (" + ind + " = " + restind + ", [])"];
        } else {
          assertExp((name = arg[0]), isVarName, "valid parameter name");
          args[i] = name;
          optionals.push(["if", ["?!", name],
            ["=", name, arg[1]]
          ]);
        }
      } else if (restname) {
        rest.push(pr(arg) + " = arguments[" + ind + "++]");
      }
    }
    if ((typeof restind !== 'undefined')) args = args.slice(0, restind);
    if ((optionals.length > 0)) body = [].concat(["do"]).concat(optionals).concat([body]);
    body = returnify(body);
    _ref4 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref4[0];
    buffer = _ref4[1];
    scope = _ref4[2];
    if (rest) body.unshift.apply(body, [].concat(rest));
    vars = [];
    funcs = [];
    dec = "var ";
    if ((typeof args === 'undefined')) args = [];
    _ref5 = scope.hoist;
    for (_i4 = 0, _len0 = _ref5.length; _i4 < _len0; ++_i4) {
      name = _ref5[_i4];
      if ((!([].indexOf.call(outerScope.hoist, name) >= 0) && !([].indexOf.call(args, name) >= 0))) {
        if (([].indexOf.call(Object.keys(functions), name) >= 0)) {
          if ((opts.topScope && ([].indexOf.call(functionsRedeclare, name) >= 0))) {
            vars.push(name);
          } else {
            if (notRedefined(name)) funcs.push(name);
          }
        } else if (([].indexOf.call(Object.keys(opFuncs), name) >= 0) || ([].indexOf.call(Object.keys(macros), name) >= 0)) {
          funcs.push(name);
        } else {
          if (!(name === "this")) vars.push(name);
        }
      }
    }
    _ref6 = scope.service;
    for (_i5 = 0, _len1 = _ref6.length; _i5 < _len1; ++_i5) {
      name = _ref6[_i5];
      if (!([].indexOf.call(outerScope.service, name) >= 0)) vars.push(name);
    }
    while (vars.length > 0) {
      name = vars.shift();
      if (([].indexOf.call(vars, name) >= 0)) throw Error("compiler error: duplicate var in declarations:" + name);
      dec += (name + ", ");
    }
    if ((dec.length > 4)) {
      dec = dec.slice(0, dec.length - 2);
      body
        .unshift(dec);
    }
    if (((typeof isTopLevel !== 'undefined') && isTopLevel)) {
      while (funcs.length > 0) {
        func = funcs.pop();
        if (([].indexOf.call(funcs, func) >= 0)) throw Error("compiler error: duplicate func in declarations:" + func);
        if (([].indexOf.call(Object.keys(functions), func) >= 0)) {
          if (notRedefined(func)) {
            if ((((typeof functions !== 'undefined') && (typeof functions[func] !== 'undefined') && (typeof functions[func].name !== 'undefined')) && (functions[func].name !== ""))) {
              body
                .unshift(functions[func].toString());
            } else {
              if (isVarName(func)) body
                .unshift("var " + func + " = " + functions[func].toString() + ";");
            }
          }
        } else if (([].indexOf.call(Object.keys(macros), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + func + " = " + macros[func].toString() + ";");
        } else if (([].indexOf.call(Object.keys(opFuncs), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + opFuncs[func].name + " = " + opFuncs[func].func.toString() + ";");
        } else {
          throw Error("unrecognised func: " + pr(func));
        }
      }
    } else {
      _ref7 = funcs;
      for (_i6 = 0, _len2 = _ref7.length; _i6 < _len2; ++_i6) {
        func = _ref7[_i6];
        if (!([].indexOf.call(outerScope.hoist, func) >= 0)) outerScope.hoist.push(func);
      }
    }
    scope = outerScope;
    aprefix = "";
    buffer.push("(" + aprefix + "function(" + spr(args) + ") {" + render(body) + " })");
    return Array(buffer, scope);
  });
  specials.def = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, outerScope, fname, args, body, optionals, spreads, i, arg, ind, name, restname, restind, rest, vars, funcs, dec, func, aprefix, _ref, _i, _ref0, _i0, _ref1, _len, _ref2, _i1, _ref3, _i2, _ref4, _i3, _ref5, _i4, _i5, _ref6, _len0, _i6, _ref7, _len1, _i7, _ref8, _len2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    outerScope = scope;
    scope = JSON.parse(JSON.stringify(outerScope));
    delete opts.topScope;
    _ref = form;
    fname = _ref[0];
    var args = 3 <= _ref.length ? [].slice.call(_ref, 1, _i = _ref.length - 1) : (_i = 1, []);
    body = _ref[_i++];
    if (isService(fname)) {
      _ref0 = compileGetLast(fname, buffer, scope, opts, nested);
      fname = _ref0[0];
      buffer = _ref0[1];
      scope = _ref0[2];
    } else {
      assertExp(fname, isVarName, "valid identifier");
      if ((opts.topScope && ([].indexOf.call(Object.keys(functions), fname) >= 0) && !([].indexOf.call(scope.hoist, fname) >= 0) && notRedefined(fname))) functionsRedefine.push(fname);
    }
    scope.hoist.push.apply(scope.hoist, [].concat(getArgNames(args)));
    if ((typeof body === 'undefined')) body = [];
    optionals = [];
    spreads = 0;
    _ref1 = args;
    for (i = 0, _len = _ref1.length; i < _len; ++i) {
      arg = _ref1[i];
      if ((isList(arg) && ([].indexOf.call(Object.keys(macros), arg[0]) >= 0))) {
        _ref2 = compileGetLast(arg, buffer, scope, opts, nested);
        arg = _ref2[0];
        buffer = _ref2[1];
        scope = _ref2[2];
      }
      if (isList(arg)) {
        assertExp(arg, (function() {
          return (arguments[0].length === 2);
        }), "optional or rest parameter");
        if ((arg[0] === "spread")) {
          if ((++spreads > 1)) throw Error("cannot define more than one rest parameter");
          _ref3 = declareService("_i", scope, (opts.function ? args : undefined));
          ind = _ref3[0];
          scope = _ref3[1];
          _ref4 = compileGetLast(arg, buffer, scope, opts, nested);
          name = _ref4[0];
          buffer = _ref4[1];
          scope = _ref4[2];
          assertExp(name, isVarName, "valid identifier");
          restname = name;
          restind = i;
          args[i] = restname;
          rest = ["var " + name + " = " + args.length + " <= arguments.length ? [].slice.call(arguments, " + i + ", " + ind + " = arguments.length - " + (args.length - i - 1) + ") : (" + ind + " = " + restind + ", [])"];
        } else {
          assertExp((name = arg[0]), isVarName, "valid parameter name");
          args[i] = name;
          optionals.push(["if", ["?!", name],
            ["=", name, arg[1]]
          ]);
        }
      } else if (restname) {
        rest.push(pr(arg) + " = arguments[" + ind + "++]");
      }
    }
    if ((typeof restind !== 'undefined')) args = args.slice(0, restind);
    if ((optionals.length > 0)) body = [].concat(["do"]).concat(optionals).concat([body]);
    body = returnify(body);
    _ref5 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref5[0];
    buffer = _ref5[1];
    scope = _ref5[2];
    if (rest) body.unshift.apply(body, [].concat(rest));
    vars = [];
    funcs = [];
    dec = "var ";
    if ((typeof args === 'undefined')) args = [];
    _ref6 = scope.hoist;
    for (_i5 = 0, _len0 = _ref6.length; _i5 < _len0; ++_i5) {
      name = _ref6[_i5];
      if ((!([].indexOf.call(outerScope.hoist, name) >= 0) && !([].indexOf.call(args, name) >= 0))) {
        if (([].indexOf.call(Object.keys(functions), name) >= 0)) {
          if ((opts.topScope && ([].indexOf.call(functionsRedeclare, name) >= 0))) {
            vars.push(name);
          } else {
            if (notRedefined(name)) funcs.push(name);
          }
        } else if (([].indexOf.call(Object.keys(opFuncs), name) >= 0) || ([].indexOf.call(Object.keys(macros), name) >= 0)) {
          funcs.push(name);
        } else {
          if (!(name === "this")) vars.push(name);
        }
      }
    }
    _ref7 = scope.service;
    for (_i6 = 0, _len1 = _ref7.length; _i6 < _len1; ++_i6) {
      name = _ref7[_i6];
      if (!([].indexOf.call(outerScope.service, name) >= 0)) vars.push(name);
    }
    while (vars.length > 0) {
      name = vars.shift();
      if (([].indexOf.call(vars, name) >= 0)) throw Error("compiler error: duplicate var in declarations:" + name);
      dec += (name + ", ");
    }
    if ((dec.length > 4)) {
      dec = dec.slice(0, dec.length - 2);
      body
        .unshift(dec);
    }
    if (((typeof isTopLevel !== 'undefined') && isTopLevel)) {
      while (funcs.length > 0) {
        func = funcs.pop();
        if (([].indexOf.call(funcs, func) >= 0)) throw Error("compiler error: duplicate func in declarations:" + func);
        if (([].indexOf.call(Object.keys(functions), func) >= 0)) {
          if (notRedefined(func)) {
            if ((((typeof functions !== 'undefined') && (typeof functions[func] !== 'undefined') && (typeof functions[func].name !== 'undefined')) && (functions[func].name !== ""))) {
              body
                .unshift(functions[func].toString());
            } else {
              if (isVarName(func)) body
                .unshift("var " + func + " = " + functions[func].toString() + ";");
            }
          }
        } else if (([].indexOf.call(Object.keys(macros), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + func + " = " + macros[func].toString() + ";");
        } else if (([].indexOf.call(Object.keys(opFuncs), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + opFuncs[func].name + " = " + opFuncs[func].func.toString() + ";");
        } else {
          throw Error("unrecognised func: " + pr(func));
        }
      }
    } else {
      _ref8 = funcs;
      for (_i7 = 0, _len2 = _ref8.length; _i7 < _len2; ++_i7) {
        func = _ref8[_i7];
        if (!([].indexOf.call(outerScope.hoist, func) >= 0)) outerScope.hoist.push(func);
      }
    }
    scope = outerScope;
    aprefix = "";
    buffer.push(aprefix + "function " + fname + "(" + spr(args) + ") {" + render(body) + " }");
    buffer.push(fname);
    return Array(buffer, scope);
  });
  specials.afn = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, outerScope, args, body, optionals, spreads, i, arg, ind, name, restname, restind, rest, vars, funcs, dec, func, aprefix, _ref, _i, _ref0, _len, _ref1, _i0, _ref2, _i1, _ref3, _i2, _ref4, _i3, _i4, _ref5, _len0, _i5, _ref6, _len1, _i6, _ref7, _len2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    outerScope = scope;
    scope = JSON.parse(JSON.stringify(outerScope));
    delete opts.topScope;
    _ref = form;
    var args = 2 <= _ref.length ? [].slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []);
    body = _ref[_i++];
    scope.hoist.push.apply(scope.hoist, [].concat(getArgNames(args)));
    if ((typeof body === 'undefined')) body = [];
    optionals = [];
    spreads = 0;
    _ref0 = args;
    for (i = 0, _len = _ref0.length; i < _len; ++i) {
      arg = _ref0[i];
      if ((isList(arg) && ([].indexOf.call(Object.keys(macros), arg[0]) >= 0))) {
        _ref1 = compileGetLast(arg, buffer, scope, opts, nested);
        arg = _ref1[0];
        buffer = _ref1[1];
        scope = _ref1[2];
      }
      if (isList(arg)) {
        assertExp(arg, (function() {
          return (arguments[0].length === 2);
        }), "optional or rest parameter");
        if ((arg[0] === "spread")) {
          if ((++spreads > 1)) throw Error("cannot define more than one rest parameter");
          _ref2 = declareService("_i", scope, (opts.function ? args : undefined));
          ind = _ref2[0];
          scope = _ref2[1];
          _ref3 = compileGetLast(arg, buffer, scope, opts, nested);
          name = _ref3[0];
          buffer = _ref3[1];
          scope = _ref3[2];
          assertExp(name, isVarName, "valid identifier");
          restname = name;
          restind = i;
          args[i] = restname;
          rest = ["var " + name + " = " + args.length + " <= arguments.length ? [].slice.call(arguments, " + i + ", " + ind + " = arguments.length - " + (args.length - i - 1) + ") : (" + ind + " = " + restind + ", [])"];
        } else {
          assertExp((name = arg[0]), isVarName, "valid parameter name");
          args[i] = name;
          optionals.push(["if", ["?!", name],
            ["=", name, arg[1]]
          ]);
        }
      } else if (restname) {
        rest.push(pr(arg) + " = arguments[" + ind + "++]");
      }
    }
    if ((typeof restind !== 'undefined')) args = args.slice(0, restind);
    if ((optionals.length > 0)) body = [].concat(["do"]).concat(optionals).concat([body]);
    body = returnify(body);
    _ref4 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref4[0];
    buffer = _ref4[1];
    scope = _ref4[2];
    if (rest) body.unshift.apply(body, [].concat(rest));
    vars = [];
    funcs = [];
    dec = "var ";
    if ((typeof args === 'undefined')) args = [];
    _ref5 = scope.hoist;
    for (_i4 = 0, _len0 = _ref5.length; _i4 < _len0; ++_i4) {
      name = _ref5[_i4];
      if ((!([].indexOf.call(outerScope.hoist, name) >= 0) && !([].indexOf.call(args, name) >= 0))) {
        if (([].indexOf.call(Object.keys(functions), name) >= 0)) {
          if ((opts.topScope && ([].indexOf.call(functionsRedeclare, name) >= 0))) {
            vars.push(name);
          } else {
            if (notRedefined(name)) funcs.push(name);
          }
        } else if (([].indexOf.call(Object.keys(opFuncs), name) >= 0) || ([].indexOf.call(Object.keys(macros), name) >= 0)) {
          funcs.push(name);
        } else {
          if (!(name === "this")) vars.push(name);
        }
      }
    }
    _ref6 = scope.service;
    for (_i5 = 0, _len1 = _ref6.length; _i5 < _len1; ++_i5) {
      name = _ref6[_i5];
      if (!([].indexOf.call(outerScope.service, name) >= 0)) vars.push(name);
    }
    while (vars.length > 0) {
      name = vars.shift();
      if (([].indexOf.call(vars, name) >= 0)) throw Error("compiler error: duplicate var in declarations:" + name);
      dec += (name + ", ");
    }
    if ((dec.length > 4)) {
      dec = dec.slice(0, dec.length - 2);
      body
        .unshift(dec);
    }
    if (((typeof isTopLevel !== 'undefined') && isTopLevel)) {
      while (funcs.length > 0) {
        func = funcs.pop();
        if (([].indexOf.call(funcs, func) >= 0)) throw Error("compiler error: duplicate func in declarations:" + func);
        if (([].indexOf.call(Object.keys(functions), func) >= 0)) {
          if (notRedefined(func)) {
            if ((((typeof functions !== 'undefined') && (typeof functions[func] !== 'undefined') && (typeof functions[func].name !== 'undefined')) && (functions[func].name !== ""))) {
              body
                .unshift(functions[func].toString());
            } else {
              if (isVarName(func)) body
                .unshift("var " + func + " = " + functions[func].toString() + ";");
            }
          }
        } else if (([].indexOf.call(Object.keys(macros), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + func + " = " + macros[func].toString() + ";");
        } else if (([].indexOf.call(Object.keys(opFuncs), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + opFuncs[func].name + " = " + opFuncs[func].func.toString() + ";");
        } else {
          throw Error("unrecognised func: " + pr(func));
        }
      }
    } else {
      _ref7 = funcs;
      for (_i6 = 0, _len2 = _ref7.length; _i6 < _len2; ++_i6) {
        func = _ref7[_i6];
        if (!([].indexOf.call(outerScope.hoist, func) >= 0)) outerScope.hoist.push(func);
      }
    }
    scope = outerScope;
    aprefix = "async ";
    buffer.push("(" + aprefix + "function(" + spr(args) + ") {" + render(body) + " })");
    return Array(buffer, scope);
  });
  specials.adef = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, outerScope, fname, args, body, optionals, spreads, i, arg, ind, name, restname, restind, rest, vars, funcs, dec, func, aprefix, _ref, _i, _ref0, _i0, _ref1, _len, _ref2, _i1, _ref3, _i2, _ref4, _i3, _ref5, _i4, _i5, _ref6, _len0, _i6, _ref7, _len1, _i7, _ref8, _len2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    outerScope = scope;
    scope = JSON.parse(JSON.stringify(outerScope));
    delete opts.topScope;
    _ref = form;
    fname = _ref[0];
    var args = 3 <= _ref.length ? [].slice.call(_ref, 1, _i = _ref.length - 1) : (_i = 1, []);
    body = _ref[_i++];
    if (isService(fname)) {
      _ref0 = compileGetLast(fname, buffer, scope, opts, nested);
      fname = _ref0[0];
      buffer = _ref0[1];
      scope = _ref0[2];
    } else {
      assertExp(fname, isVarName, "valid identifier");
      if ((opts.topScope && ([].indexOf.call(Object.keys(functions), fname) >= 0) && !([].indexOf.call(scope.hoist, fname) >= 0) && notRedefined(fname))) functionsRedefine.push(fname);
    }
    scope.hoist.push.apply(scope.hoist, [].concat(getArgNames(args)));
    if ((typeof body === 'undefined')) body = [];
    optionals = [];
    spreads = 0;
    _ref1 = args;
    for (i = 0, _len = _ref1.length; i < _len; ++i) {
      arg = _ref1[i];
      if ((isList(arg) && ([].indexOf.call(Object.keys(macros), arg[0]) >= 0))) {
        _ref2 = compileGetLast(arg, buffer, scope, opts, nested);
        arg = _ref2[0];
        buffer = _ref2[1];
        scope = _ref2[2];
      }
      if (isList(arg)) {
        assertExp(arg, (function() {
          return (arguments[0].length === 2);
        }), "optional or rest parameter");
        if ((arg[0] === "spread")) {
          if ((++spreads > 1)) throw Error("cannot define more than one rest parameter");
          _ref3 = declareService("_i", scope, (opts.function ? args : undefined));
          ind = _ref3[0];
          scope = _ref3[1];
          _ref4 = compileGetLast(arg, buffer, scope, opts, nested);
          name = _ref4[0];
          buffer = _ref4[1];
          scope = _ref4[2];
          assertExp(name, isVarName, "valid identifier");
          restname = name;
          restind = i;
          args[i] = restname;
          rest = ["var " + name + " = " + args.length + " <= arguments.length ? [].slice.call(arguments, " + i + ", " + ind + " = arguments.length - " + (args.length - i - 1) + ") : (" + ind + " = " + restind + ", [])"];
        } else {
          assertExp((name = arg[0]), isVarName, "valid parameter name");
          args[i] = name;
          optionals.push(["if", ["?!", name],
            ["=", name, arg[1]]
          ]);
        }
      } else if (restname) {
        rest.push(pr(arg) + " = arguments[" + ind + "++]");
      }
    }
    if ((typeof restind !== 'undefined')) args = args.slice(0, restind);
    if ((optionals.length > 0)) body = [].concat(["do"]).concat(optionals).concat([body]);
    body = returnify(body);
    _ref5 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref5[0];
    buffer = _ref5[1];
    scope = _ref5[2];
    if (rest) body.unshift.apply(body, [].concat(rest));
    vars = [];
    funcs = [];
    dec = "var ";
    if ((typeof args === 'undefined')) args = [];
    _ref6 = scope.hoist;
    for (_i5 = 0, _len0 = _ref6.length; _i5 < _len0; ++_i5) {
      name = _ref6[_i5];
      if ((!([].indexOf.call(outerScope.hoist, name) >= 0) && !([].indexOf.call(args, name) >= 0))) {
        if (([].indexOf.call(Object.keys(functions), name) >= 0)) {
          if ((opts.topScope && ([].indexOf.call(functionsRedeclare, name) >= 0))) {
            vars.push(name);
          } else {
            if (notRedefined(name)) funcs.push(name);
          }
        } else if (([].indexOf.call(Object.keys(opFuncs), name) >= 0) || ([].indexOf.call(Object.keys(macros), name) >= 0)) {
          funcs.push(name);
        } else {
          if (!(name === "this")) vars.push(name);
        }
      }
    }
    _ref7 = scope.service;
    for (_i6 = 0, _len1 = _ref7.length; _i6 < _len1; ++_i6) {
      name = _ref7[_i6];
      if (!([].indexOf.call(outerScope.service, name) >= 0)) vars.push(name);
    }
    while (vars.length > 0) {
      name = vars.shift();
      if (([].indexOf.call(vars, name) >= 0)) throw Error("compiler error: duplicate var in declarations:" + name);
      dec += (name + ", ");
    }
    if ((dec.length > 4)) {
      dec = dec.slice(0, dec.length - 2);
      body
        .unshift(dec);
    }
    if (((typeof isTopLevel !== 'undefined') && isTopLevel)) {
      while (funcs.length > 0) {
        func = funcs.pop();
        if (([].indexOf.call(funcs, func) >= 0)) throw Error("compiler error: duplicate func in declarations:" + func);
        if (([].indexOf.call(Object.keys(functions), func) >= 0)) {
          if (notRedefined(func)) {
            if ((((typeof functions !== 'undefined') && (typeof functions[func] !== 'undefined') && (typeof functions[func].name !== 'undefined')) && (functions[func].name !== ""))) {
              body
                .unshift(functions[func].toString());
            } else {
              if (isVarName(func)) body
                .unshift("var " + func + " = " + functions[func].toString() + ";");
            }
          }
        } else if (([].indexOf.call(Object.keys(macros), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + func + " = " + macros[func].toString() + ";");
        } else if (([].indexOf.call(Object.keys(opFuncs), func) >= 0) && isVarName(func)) {
          body
            .unshift("var " + opFuncs[func].name + " = " + opFuncs[func].func.toString() + ";");
        } else {
          throw Error("unrecognised func: " + pr(func));
        }
      }
    } else {
      _ref8 = funcs;
      for (_i7 = 0, _len2 = _ref8.length; _i7 < _len2; ++_i7) {
        func = _ref8[_i7];
        if (!([].indexOf.call(outerScope.hoist, func) >= 0)) outerScope.hoist.push(func);
      }
    }
    scope = outerScope;
    aprefix = "async ";
    buffer.push(aprefix + "function " + fname + "(" + spr(args) + ") {" + render(body) + " }");
    buffer.push(fname);
    return Array(buffer, scope);
  });
  specials.mac = (function(form) {
    return makeMacro(form);
  });

  function collect(compiled, collector, isCase, nestedLocal) {
    var plug, lastItem;
    if ((typeof isCase === 'undefined')) isCase = false;
    if ((typeof nestedLocal === 'undefined')) nestedLocal = true;
    if ((isList(compiled) && (compiled.length > 0))) {
      if (/\{$/.test(compiled["slice"](-1)[0])) plug = compiled.pop();
      lastItem = compiled.pop();
      if (nestedLocal) {
        if (/^return\s/.test(lastItem)) {
          lastItem = lastItem.replace(/^return\s/, "return " + collector + " = ");
        } else if (utils.kwtest(lastItem)) {
          lastItem = collector + " = undefined; " + lastItem;
        } else {
          lastItem = collector + " = " + pr(lastItem);
        }
      }
      compiled.push(lastItem);
      if (isCase) compiled.push("break");
      if ((typeof plug !== 'undefined')) compiled.push(plug);
    }
    return compiled;
  }
  collect;
  specials.if = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, predicate, prebranch, midcases, postbranch, res, collector, i, mid, midtest, midbranch, comp, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _len, _ref5, _i4, _ref6, _i5, _ref7, _i6, _i7, _ref8, _len0;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    predicate = _ref[0];
    prebranch = _ref[1];
    var midcases = 4 <= _ref.length ? [].slice.call(_ref, 2, _i = _ref.length - 1) : (_i = 2, []);
    postbranch = _ref[_i++];
    if ((isList(postbranch) && (postbranch[0] === "elif"))) {
      midcases.push(postbranch);
      postbranch = undefined;
    }
    nested = true;
    _ref0 = compileGetLast(predicate, buffer, scope, opts, nested);
    predicate = _ref0[0];
    buffer = _ref0[1];
    scope = _ref0[2];
    if ((typeof predicate === 'undefined')) predicate = "false";
    nested = nestedLocal;
    _ref1 = compileResolve(prebranch, buffer, scope, opts, nested);
    prebranch = _ref1[0];
    buffer = _ref1[1];
    scope = _ref1[2];
    _ref2 = compileResolve(postbranch, buffer, scope, opts, nested);
    postbranch = _ref2[0];
    buffer = _ref2[1];
    scope = _ref2[2];
    if ((!nestedLocal && (prebranch.length <= 1) && (midcases.length === 0) && ((postbranch.length === 0) || (typeof postbranch[0] === 'undefined') || (postbranch[0] === "")))) {
      res = "if (" + pr(predicate) + ")" + pr(prebranch[0]) + ";";
      buffer.push(res, "");
    } else if ((prebranch.length === 1) && !utils.kwtest(prebranch[0]) && (midcases.length === 0) && (postbranch.length === 1) && !utils.kwtest(postbranch[0])) {
      res = pr(predicate) + " ? " + (pr(prebranch[0]) || undefined) + " : " + (pr(postbranch[0]) || undefined);
      if ((nestedLocal && (nestedLocal !== "parens"))) res = "(" + res + ")";
      buffer.push(res);
    } else {
      if (nestedLocal) {
        _ref3 = declareService("_ref", scope, (opts.function ? args : undefined));
        collector = _ref3[0];
        scope = _ref3[1];
      }
      prebranch = collect(prebranch, collector, false, nestedLocal);
      postbranch = collect(postbranch, collector, false, nestedLocal);
      _ref4 = midcases;
      for (i = 0, _len = _ref4.length; i < _len; ++i) {
        mid = _ref4[i];
        assertExp(mid, (function(x) {
          return (x.shift() === "elif");
        }), "elif");
        _ref5 = mid;
        midtest = _ref5[0];
        midbranch = _ref5[1];
        _ref6 = compileResolve(midtest, buffer, scope, opts, "parens");
        midtest = _ref6[0];
        buffer = _ref6[1];
        scope = _ref6[2];
        if ((typeof midtest === 'undefined')) midtest = "false";
        if ((midtest.length > 1)) throw Error(pr("elif") + " must compile to single expression (todo fix later); got:" + pr(midtest));
        _ref7 = compileResolve(midbranch, buffer, scope, opts, nested);
        midbranch = _ref7[0];
        buffer = _ref7[1];
        scope = _ref7[2];
        midcases[i] = {
          test: midtest,
          branch: collect(midbranch, collector, false, nestedLocal)
        };
      }
      comp = "if (" + pr(predicate) + ") { " + render(prebranch) + " } ";
      _ref8 = midcases;
      for (_i7 = 0, _len0 = _ref8.length; _i7 < _len0; ++_i7) {
        mid = _ref8[_i7];
        comp += (" else if (" + spr(mid.test) + ") { " + render(mid.branch) + " }");
      }
      if (((typeof postbranch !== 'undefined') && ((postbranch.length > 1) || (typeof postbranch[0] !== 'undefined')))) comp += (" else { " + render(postbranch) + " }");
      buffer.push(comp);
      nestedLocal ? buffer.push(collector) : buffer.push("");
    }
    return Array(buffer, scope);
  });
  specials.switch = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, predicate, midcases, postbranch, collector, i, mid, midtest, midbranch, comp, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _len, _ref3, _i2, _ref4, _i3, _ref5, _i4, _ref6, _i5, _i6, _ref7, _len0;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    predicate = _ref[0];
    var midcases = 3 <= _ref.length ? [].slice.call(_ref, 1, _i = _ref.length - 1) : (_i = 1, []);
    postbranch = _ref[_i++];
    if (((typeof postbranch !== 'undefined') && (postbranch[0] === "case"))) {
      midcases.push(postbranch);
      postbranch = undefined;
    }
    if (nestedLocal) {
      _ref0 = declareService("_ref", scope, (opts.function ? args : undefined));
      collector = _ref0[0];
      scope = _ref0[1];
    }
    _ref1 = compileGetLast(predicate, buffer, scope, opts, "parens");
    predicate = _ref1[0];
    buffer = _ref1[1];
    scope = _ref1[2];
    if ((typeof predicate === 'undefined')) predicate = "false";
    nested = nestedLocal;
    _ref2 = midcases;
    for (i = 0, _len = _ref2.length; i < _len; ++i) {
      mid = _ref2[i];
      assertExp(mid, (function(x) {
        return (x.shift() === "case");
      }), "case");
      _ref3 = mid;
      midtest = _ref3[0];
      midbranch = _ref3[1];
      _ref4 = compileResolve(midtest, buffer, scope, opts, nested);
      midtest = _ref4[0];
      buffer = _ref4[1];
      scope = _ref4[2];
      if ((typeof midtest === 'undefined')) midtest = "false";
      if ((midtest.length > 1)) throw Error(pr("case") + " must compile to single expression (todo fix later); got: " + pr(midtest));
      _ref5 = compileResolve(midbranch, buffer, scope, opts, nested);
      midbranch = _ref5[0];
      buffer = _ref5[1];
      scope = _ref5[2];
      midcases[i] = {
        test: midtest,
        branch: collect(midbranch, collector, true, nestedLocal)
      };
    }
    _ref6 = compileResolve(postbranch, buffer, scope, opts, nested);
    postbranch = _ref6[0];
    buffer = _ref6[1];
    scope = _ref6[2];
    postbranch = collect(postbranch, collector, false, nestedLocal);
    comp = "switch (" + pr(predicate) + ") { ";
    _ref7 = midcases;
    for (_i6 = 0, _len0 = _ref7.length; _i6 < _len0; ++_i6) {
      mid = _ref7[_i6];
      comp += (" case " + spr(mid.test) + ": " + render(mid.branch));
    }
    comp += (" default: " + render(postbranch) + " }");
    buffer.push(comp);
    nestedLocal ? buffer.push(collector) : buffer.push("");
    return Array(buffer, scope);
  });
  specials.for = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, value, key, iterable, body, collector, ref, len, rear, subst, tested, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _i5, _ref6, _i6, _ref7, _i7, _ref8, _i8, _ref9, _i9, _ref10, _i10, _ref11, _i11, _ref12, _i12;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 2)) throw Error(pr(formName) + " expects no less than " + pr(2) + " arguments");
    if ((form.length > 4)) throw Error(pr(formName) + " expects no more than " + pr(4) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    value = _ref[0];
    key = _ref[1];
    iterable = _ref[2];
    body = _ref[3];
    if ((typeof body === 'undefined')) {
      if ((typeof iterable === 'undefined')) {
        if ((isNaN(Number(value)) || !(parseInt(value) > 0))) throw Error("expecting integer, got " + pr(value));
        body = key;
        iterable = ["quote", [range, 1, [parseInt, value]]];
        _ref0 = declareService("_i", scope, (opts.function ? args : undefined));
        key = _ref0[0];
        scope = _ref0[1];
        _ref1 = declareService("_val", scope, (opts.function ? args : undefined));
        value = _ref1[0];
        scope = _ref1[1];
      } else {
        body = iterable;
        iterable = key;
        _ref2 = declareService("_i", scope, (opts.function ? args : undefined));
        key = _ref2[0];
        scope = _ref2[1];
        if (isService(value)) {
          _ref3 = compileGetLast(value, buffer, scope, opts, nested);
          value = _ref3[0];
          buffer = _ref3[1];
          scope = _ref3[2];
        } else {
          assertExp(value, isVarName, "valid identifier");
          if ((opts.topScope && ([].indexOf.call(Object.keys(functions), value) >= 0) && !([].indexOf.call(scope.hoist, value) >= 0) && notRedefined(value))) functionsRedeclare.push(value);
          scope = declareVar(value, scope);
        }
      }
    } else {
      if (isService(key)) {
        _ref4 = compileGetLast(key, buffer, scope, opts, nested);
        key = _ref4[0];
        buffer = _ref4[1];
        scope = _ref4[2];
      } else {
        assertExp(key, isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), key) >= 0) && !([].indexOf.call(scope.hoist, key) >= 0) && notRedefined(key))) functionsRedeclare.push(key);
        scope = declareVar(key, scope);
      }
      if (isService(value)) {
        _ref5 = compileGetLast(value, buffer, scope, opts, nested);
        value = _ref5[0];
        buffer = _ref5[1];
        scope = _ref5[2];
      } else {
        assertExp(value, isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), value) >= 0) && !([].indexOf.call(scope.hoist, value) >= 0) && notRedefined(value))) functionsRedeclare.push(value);
        scope = declareVar(value, scope);
      }
    }
    assertExp(key, isVarName, "valid identifier");
    assertExp(value, isVarName, "valid identifier");
    if (nestedLocal) {
      _ref6 = declareService("_res", scope, (opts.function ? args : undefined));
      collector = _ref6[0];
      scope = _ref6[1];
      buffer.push(collector + " = []");
    }
    _ref7 = declareService("_ref", scope, (opts.function ? args : undefined));
    ref = _ref7[0];
    scope = _ref7[1];
    _ref8 = declareService("_len", scope, (opts.function ? args : undefined));
    len = _ref8[0];
    scope = _ref8[1];
    _ref9 = compileGetLast(iterable, buffer, scope, opts, nested);
    iterable = _ref9[0];
    buffer = _ref9[1];
    scope = _ref9[2];
    buffer.push(ref + " = " + pr(iterable));
    nested = nestedLocal;
    _ref10 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref10[0];
    buffer = _ref10[1];
    scope = _ref10[2];
    if ((nestedLocal && !utils.kwtest(pr(body["slice"](-1)[0])))) {
      rear = body.pop();
      if ((utils.isPrimitive(rear) || utils.isString(rear) || utils.isSpecialValue(rear) || utils.isSpecialValueStr(rear))) {
        body.push(collector + ".push(" + pr(rear) + ")");
      } else if (isIdentifier(rear)) {
        _ref12 = compileGetLast(["?", rear], buffer, scope, opts, "parens");
        tested = _ref12[0];
        buffer = _ref12[1];
        scope = _ref12[2];
        body.push("if (" + tested + ") " + collector + ".push(" + pr(rear) + ")");
      } else {
        _ref11 = declareService("_ref", scope, (opts.function ? args : undefined));
        subst = _ref11[0];
        scope = _ref11[1];
        body.push("if (typeof (" + subst + " = " + pr(rear) + ") !== 'undefined') " + collector + ".push(" + subst + ")");
      }
    }
    buffer.push("for (" + key + " = 0, " + len + " = " + ref + ".length; " + key + " < " + len + "; ++" + key + ") { " + value + " = " + ref + "[" + key + "]; " + render(body) + " }");
    nestedLocal ? buffer.push(collector) : buffer.push("");
    return Array(buffer, scope);
  });
  specials.over = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, value, key, iterable, body, collector, ref, len, rear, subst, tested, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _i5, _ref6, _i6, _ref7, _i7, _ref8, _i8, _ref9, _i9, _ref10, _i10, _ref11, _i11, _ref12, _i12;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 2)) throw Error(pr(formName) + " expects no less than " + pr(2) + " arguments");
    if ((form.length > 4)) throw Error(pr(formName) + " expects no more than " + pr(4) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    value = _ref[0];
    key = _ref[1];
    iterable = _ref[2];
    body = _ref[3];
    if ((typeof body === 'undefined')) {
      body = iterable;
      iterable = key;
      _ref0 = declareService("_key", scope, (opts.function ? args : undefined));
      key = _ref0[0];
      scope = _ref0[1];
      if (isService(value)) {
        _ref1 = compileGetLast(value, buffer, scope, opts, nested);
        value = _ref1[0];
        buffer = _ref1[1];
        scope = _ref1[2];
      } else {
        assertExp(value, isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), value) >= 0) && !([].indexOf.call(scope.hoist, value) >= 0) && notRedefined(value))) functionsRedeclare.push(value);
        scope = declareVar(value, scope);
      }
    } else if (typeof iterable === 'undefined') {
      body = key;
      iterable = value;
      _ref4 = declareService("_key", scope, (opts.function ? args : undefined));
      key = _ref4[0];
      scope = _ref4[1];
      _ref5 = declareService("_val", scope, (opts.function ? args : undefined));
      value = _ref5[0];
      scope = _ref5[1];
    } else {
      if (isService(key)) {
        _ref2 = compileGetLast(key, buffer, scope, opts, nested);
        key = _ref2[0];
        buffer = _ref2[1];
        scope = _ref2[2];
      } else {
        assertExp(key, isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), key) >= 0) && !([].indexOf.call(scope.hoist, key) >= 0) && notRedefined(key))) functionsRedeclare.push(key);
        scope = declareVar(key, scope);
      }
      if (isService(value)) {
        _ref3 = compileGetLast(value, buffer, scope, opts, nested);
        value = _ref3[0];
        buffer = _ref3[1];
        scope = _ref3[2];
      } else {
        assertExp(value, isVarName, "valid identifier");
        if ((opts.topScope && ([].indexOf.call(Object.keys(functions), value) >= 0) && !([].indexOf.call(scope.hoist, value) >= 0) && notRedefined(value))) functionsRedeclare.push(value);
        scope = declareVar(value, scope);
      }
    }
    assertExp(key, isVarName, "valid identifier");
    assertExp(value, isVarName, "valid identifier");
    if (nestedLocal) {
      _ref6 = declareService("_res", scope, (opts.function ? args : undefined));
      collector = _ref6[0];
      scope = _ref6[1];
      buffer.push(collector + " = []");
    }
    _ref7 = declareService("_ref", scope, (opts.function ? args : undefined));
    ref = _ref7[0];
    scope = _ref7[1];
    _ref8 = declareService("_len", scope, (opts.function ? args : undefined));
    len = _ref8[0];
    scope = _ref8[1];
    _ref9 = compileGetLast(iterable, buffer, scope, opts, nested);
    iterable = _ref9[0];
    buffer = _ref9[1];
    scope = _ref9[2];
    buffer.push(ref + " = " + pr(iterable));
    nested = nestedLocal;
    _ref10 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref10[0];
    buffer = _ref10[1];
    scope = _ref10[2];
    if ((nestedLocal && !utils.kwtest(pr(body["slice"](-1)[0])))) {
      rear = body.pop();
      if ((utils.isPrimitive(rear) || utils.isString(rear) || utils.isSpecialValue(rear) || utils.isSpecialValueStr(rear))) {
        body.push(collector + ".push(" + pr(rear) + ")");
      } else if (isIdentifier(rear)) {
        _ref12 = compileGetLast(["?", rear], buffer, scope, opts, "parens");
        tested = _ref12[0];
        buffer = _ref12[1];
        scope = _ref12[2];
        body.push("if (" + tested + ") " + collector + ".push(" + pr(rear) + ")");
      } else {
        _ref11 = declareService("_ref", scope, (opts.function ? args : undefined));
        subst = _ref11[0];
        scope = _ref11[1];
        body.push("if (typeof (" + subst + " = " + pr(rear) + ") !== 'undefined') " + collector + ".push(" + subst + ")");
      }
    }
    buffer.push("for (" + key + " in " + ref + ") { " + value + " = " + ref + "[" + key + "]; " + render(body) + " }");
    nestedLocal ? buffer.push(collector) : buffer.push("");
    return Array(buffer, scope);
  });
  specials.while = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, test, body, rvalue, collector, comp, rear, subst, tested, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _i5;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 2)) throw Error(pr(formName) + " expects no less than " + pr(2) + " arguments");
    if ((form.length > 3)) throw Error(pr(formName) + " expects no more than " + pr(3) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    test = _ref[0];
    body = _ref[1];
    rvalue = _ref[2];
    if ((form.length === 2)) {
      if (nestedLocal) {
        _ref0 = declareService("_res", scope, (opts.function ? args : undefined));
        collector = _ref0[0];
        scope = _ref0[1];
        buffer.push(collector + " = []");
      }
    } else {
      comp = "";
    }
    _ref1 = compileGetLast(test, buffer, scope, opts, "parens");
    test = _ref1[0];
    buffer = _ref1[1];
    scope = _ref1[2];
    nested = nestedLocal;
    _ref2 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref2[0];
    buffer = _ref2[1];
    scope = _ref2[2];
    if ((nestedLocal && (form.length === 2) && !utils.kwtest(pr(body["slice"](-1)[0])))) {
      rear = body.pop();
      if ((utils.isPrimitive(rear) || utils.isString(rear) || utils.isSpecialValue(rear) || utils.isSpecialValueStr(rear))) {
        body.push(collector + ".push(" + pr(rear) + ")");
      } else if (isIdentifier(rear)) {
        _ref4 = compileGetLast(["?", rear], buffer, scope, opts, "parens");
        tested = _ref4[0];
        buffer = _ref4[1];
        scope = _ref4[2];
        body.push("if (" + tested + ") " + collector + ".push(" + pr(rear) + ")");
      } else {
        _ref3 = declareService("_ref", scope, (opts.function ? args : undefined));
        subst = _ref3[0];
        scope = _ref3[1];
        body.push("if (typeof (" + subst + " = " + pr(rear) + ") !== 'undefined') " + collector + ".push(" + subst + ")");
      }
    }
    buffer.push("while (" + pr(test) + ") { " + render(body) + " }");
    if ((form.length === 2)) {
      nestedLocal ? buffer.push(collector) : buffer.push("");
    } else {
      _ref5 = compileResolve(rvalue, buffer, scope, opts, nested);
      rvalue = _ref5[0];
      buffer = _ref5[1];
      scope = _ref5[2];
      buffer.push(render(rvalue));
    }
    return Array(buffer, scope);
  });
  specials.try = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, tryForm, catchForm, finalForm, collector, err, res, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2, _ref3, _i3, _ref4, _i4, _ref5, _i5;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    if ((form.length > 3)) throw Error(pr(formName) + " expects no more than " + pr(3) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    tryForm = _ref[0];
    catchForm = _ref[1];
    finalForm = _ref[2];
    _ref0 = compileResolve(tryForm, buffer, scope, opts, "parens");
    tryForm = _ref0[0];
    buffer = _ref0[1];
    scope = _ref0[2];
    if (nestedLocal) {
      _ref1 = declareService("_ref", scope, (opts.function ? args : undefined));
      collector = _ref1[0];
      scope = _ref1[1];
      tryForm.push(collector + " = " + pr(tryForm.pop()));
    }
    if ((isList(catchForm) && (catchForm[0] === "catch"))) {
      assertExp(catchForm, (function() {
        return (arguments[0].length === 2 || arguments[0].length === 3);
      }), "valid catch form");
      _ref2 = catchForm;
      catchForm = _ref2[0];
      err = _ref2[1];
      catchForm = _ref2[2];
      assertExp(err, isVarName, "valid identifier");
    } else {
      _ref3 = declareService("_err", scope, (opts.function ? args : undefined));
      err = _ref3[0];
      scope = _ref3[1];
    }
    if ((typeof catchForm === 'undefined')) catchForm = undefined;
    nested = nestedLocal;
    _ref4 = compileResolve(catchForm, buffer, scope, opts, nested);
    catchForm = _ref4[0];
    buffer = _ref4[1];
    scope = _ref4[2];
    if ((nestedLocal && !utils.kwtest(pr(catchForm["slice"](-1)[0])))) catchForm.push(collector + " = " + pr(catchForm.pop()));
    if ((typeof finalForm !== 'undefined')) {
      if ((isList(finalForm) && (finalForm[0] === "finally"))) {
        assertExp(finalForm, (function() {
          return (arguments[0].length === 2);
        }));
        finalForm = finalForm["slice"](-1)[0];
      }
      _ref5 = compileResolve(finalForm, buffer, scope, opts, nested);
      finalForm = _ref5[0];
      buffer = _ref5[1];
      scope = _ref5[2];
      if ((nestedLocal && !utils.kwtest(pr(finalForm["slice"](-1)[0])))) finalForm.push(collector + " = " + pr(finalForm.pop()));
    }
    res = "try { " + render(tryForm) + " } catch (" + pr(err) + ") { " + render(catchForm) + " }";
    if ((typeof finalForm !== 'undefined')) res += (" finally { " + render(finalForm) + " }");
    buffer.push(res);
    nestedLocal ? buffer.push(collector) : buffer.push("");
    return Array(buffer, scope);
  });
  specials.get = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, object, property, _ref, _i, _ref0, _i0, _ref1, _i1;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    if ((form.length > 2)) throw Error(pr(formName) + " expects no more than " + pr(2) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    object = _ref[0];
    property = _ref[1];
    if ((typeof property === 'undefined')) {
      property = object;
      object = "";
    }
    _ref0 = compileGetLast(object, buffer, scope, opts, nested);
    object = _ref0[0];
    buffer = _ref0[1];
    scope = _ref0[2];
    _ref1 = compileGetLast(property, buffer, scope, opts, nested);
    property = _ref1[0];
    buffer = _ref1[1];
    scope = _ref1[2];
    assertExp(object, (function() {
      return ((typeof arguments !== 'undefined') && (typeof arguments[0] !== 'undefined'));
    }), "valid object");
    utils.isDotName(property) ? buffer.push(pr(object) + property) : buffer.push(pr(object) + "[" + pr(property) + "]");
    return Array(buffer, scope);
  });
  specials.spread = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, _ref, _i;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length < 1)) throw Error(pr(formName) + " expects no less than " + pr(1) + " arguments");
    if ((form.length > 1)) throw Error(pr(formName) + " expects no more than " + pr(1) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    form = form[0];
    if (isList(form)) {
      _ref = compileAdd(form, buffer, scope, opts, nested);
      buffer = _ref[0];
      scope = _ref[1];
    } else if (isAtom(form)) {
      buffer.push(form);
    } else {
      throw Error("spread requires atom, got: " + pr(form));
    }
    return Array(buffer, scope);
  });
  specials.return = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, _ref, _i;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    if ((form.length > 1)) throw Error(pr(formName) + " expects no more than " + pr(1) + " arguments");
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    if ((form.length !== 0)) {
      _ref = compileGetLast(form[0], buffer, scope, opts, true);
      form = _ref[0];
      buffer = _ref[1];
      scope = _ref[2];
      if (!utils.kwtest(form)) form = "return " + pr(form);
      buffer.push(form);
    }
    return Array(buffer, scope);
  });
  specials.list = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, item, _i, _res, _ref, _len, _ref0, _i0, _ref1;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _res = [];
    _ref = form;
    for (_i = 0, _len = _ref.length; _i < _len; ++_i) {
      item = _ref[_i];
      if (isList(item)) {
        _ref0 = compileGetLast(item, buffer, scope, opts, nested);
        item = _ref0[0];
        buffer = _ref0[1];
        scope = _ref0[2];
        _ref1 = item;
      } else {
        _ref1 = pr(item);
      }
      if (typeof _ref1 !== 'undefined') _res.push(_ref1);
    }
    buffer.push("[" + _res
      .join(", ") + "]");
    return Array(buffer, scope);
  });
  specials.with = (function(form, scope, opts, nested) {
    var buffer, formName, nestedLocal, self, body, collector, _ref, _i, _ref0, _i0, _ref1, _i1, _ref2, _i2;
    if ((typeof opts === 'undefined')) opts = {};
    buffer = [];
    form = form.slice();
    formName = form.shift();
    nestedLocal = ((typeof nested !== 'undefined') ? nested : true);
    nested = undefined;
    _ref = form;
    self = _ref[0];
    var body = 2 <= _ref.length ? [].slice.call(_ref, 1, _i = _ref.length - 0) : (_i = 1, []);
    _ref0 = compileGetLast(self, buffer, scope, opts, "parens");
    self = _ref0[0];
    buffer = _ref0[1];
    scope = _ref0[2];
    body = Array.apply(Array, [].concat(["do"]).concat(body));
    _ref1 = compileResolve(body, buffer, scope, opts, nested);
    body = _ref1[0];
    buffer = _ref1[1];
    scope = _ref1[2];
    if (nestedLocal) {
      _ref2 = declareService("_ref", scope, (opts.function ? args : undefined));
      collector = _ref2[0];
      scope = _ref2[1];
      body.push(collector + " = " + pr(body.pop()));
    }
    buffer.push("with (" + pr(self) + ") { " + render(body) + " }");
    if (nestedLocal) buffer.push(collector);
    return Array(buffer, scope);
  });
  macros = {};

  function importMacros() {
    var store, key, val, _i, _i0, _ref, _len, _ref0, _len0;
    var stores = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
    _ref = stores;
    for (_i0 = 0, _len = _ref.length; _i0 < _len; ++_i0) {
      store = _ref[_i0];
      _ref0 = store;
      for (key in _ref0) {
        val = _ref0[key];
        macros[key] = val;
      }
    }
    return macros;
  }
  exports.importMacros = importMacros;
  importMacros(require("./macros"));
  global.loadCache = global.loadCache || {}

  function load(url) {
    var req, process, cp, env, key, value, result, _ref, _len, _ref0;
    if (loadCache[url]) {
      console.log("load", url, "cached", !!loadCache[url]);
      return loadCache[url];
    }

    function list() {
      var _i;
      var args = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
      return [].concat(args);
    }
    list;
    if ((typeof window !== 'undefined')) {
      req = new window.XMLHttpRequest();
      req.open("GET", url, false);
      req.send();
      _ref0 = req.responseText;
    } else {
      if ((url.indexOf("http") === -1)) {
        fs = require("fs");
        return fs.readFileSync(url, {
          encoding: "utf-8"
        });
      }
      process = require("process");
      cp = require("child_process");
      env = {};
      process = require("process");
      _ref = process.env;
      for (key in _ref) {
        value = _ref[key];
        env[key] = value;
      }
      env.params = JSON.stringify({
        "url": url
      });
      env.scriptSource = "var params, key, value, http, parsedURL, req, _ref, _len;\nparams = {};\ntry {\n  params = JSON.parse(process.env.params);\n} catch (err) {\n  console.log(\"error\", err);\n}\n_ref = params;\nfor (key in _ref) {\n  value = _ref[key];\n  global[key] = value;\n}\nhttp = require(((url.indexOf(\"https\") < 0) ? \"http\" : \"https\"));\nparsedURL = require(\"url\").parse(url);\nreq = http.request(parsedURL, (function(res) {\n  return res.pipe(process.stdout);\n}));\nreq.end();";
      result = cp.spawnSync(process.execPath, ["-e", "require('vm').runInThisContext(process.env.scriptSource)"], {
        "env": env
      });
      result = (result.stdout.length ? result.stdout : result.stderr);
      result = result.toString('utf-8');
      loadCache[url] = result;
      _ref0 = result;
    }
    return _ref0;
  }
  load;
  importMacros({
    execSync: execSync,
    includeSource: includeSource,
    gistCheckout: gistCheckout,
    fileCheckout: fileCheckout
  });

  function parseMacros(form) {
    var key, val, i, _ref, _len, _ref0, _len0;
    if (utils.isHash(form)) {
      _ref = form;
      for (key in _ref) {
        val = _ref[key];
        form[key] = parseMacros(val);
      }
    } else if (utils.isList(form)) {
      if ((form[0] === "mac")) {
        form = makeMacro(form["slice"](1));
      } else if ((form.length >= 1) && utils.isList(form[0]) && (form[0][0] === "mac")) {
        form[0] = makeMacro(form[0]["slice"](1), true);
      } else {
        _ref0 = form;
        for (i = 0, _len0 = _ref0.length; i < _len0; ++i) {
          val = _ref0[i];
          form[i] = parseMacros(val);
        }
      }
    }
    return form;
  }
  parseMacros;

  function makeMacro(form, selfExpand) {
    var name, body, compiled, scope, rendered, _ref, _i, _ref0, _i0;
    _ref = form;
    name = _ref[0];
    var body = 2 <= _ref.length ? [].slice.call(_ref, 1, _i = _ref.length - 0) : (_i = 1, []);
    if ((typeof name === 'undefined')) throw Error("a macro requires a name");
    if ((typeof body === 'undefined')) throw Error("a macro requires a body");
    body = ["do", [].concat(["fn"]).concat(body)];
    _ref0 = compileForm(body, {
      hoist: [],
      service: [],
      replace: {}
    }, {
      macro: true,
      isTopLevel: true
    });
    compiled = _ref0[0];
    scope = _ref0[1];
    rendered = render(compiled);
    macros[name] = jispEval(rendered);
    return (selfExpand ? name : []);
  }
  makeMacro;

  function expandMacros(form) {
    var key, val, i, args, _ref, _len, _ref0, _len0;
    if (utils.isHash(form)) {
      _ref = form;
      for (key in _ref) {
        val = _ref[key];
        form[key] = expandMacros(val);
      }
    } else if (utils.isList(form)) {
      if ((form[0] === "mac")) {
        form = parseMacros(form);
      } else if ([].indexOf.call(Object.keys(macros), form[0]) >= 0) {
        args = form["slice"](1);
        form = macros[form[0]].apply(macros, [].concat(args));
        if ((typeof form === "undefined")) form = [];
      } else {
        _ref0 = form;
        for (i = 0, _len0 = _ref0.length; i < _len0; ++i) {
          val = _ref0[i];
          form[i] = expandMacros(val);
        }
      }
    }
    return form;
  }
  expandMacros;

  function macroexpand(form, uniq) {
    var i, elem, key, val, _ref, _len, _ref0, _len0;
    if ((typeof uniq === 'undefined')) uniq = new Uniq(undefined);
    if (isAtom(form)) {
      if (isService(form)) form = uniq.checkAndReplace(form);
    } else if (isList(form)) {
      if ((form[0] === "mac")) {
        form = macroexpand(parseMacros(form), uniq);
      } else if ([].indexOf.call(Object.keys(macros), form[0]) >= 0) {
        form = macroexpand(expandMacros(form), new Uniq(uniq));
      } else {
        _ref = form;
        for (i = 0, _len = _ref.length; i < _len; ++i) {
          elem = _ref[i];
          form[i] = macroexpand(elem, uniq);
        }
      }
    } else if (isHash(form)) {
      _ref0 = form;
      for (key in _ref0) {
        val = _ref0[key];
        form[key] = macroexpand(val, uniq);
      }
    } else {
      throw Error, ("unexpected form: " + pr(form));
    }
    return form;
  }
  macroexpand;
  functions = {};

  function importFunctions() {
    var store, key, val, _i, _i0, _ref, _len, _ref0, _len0;
    var stores = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
    _ref = stores;
    for (_i0 = 0, _len = _ref.length; _i0 < _len; ++_i0) {
      store = _ref[_i0];
      _ref0 = store;
      for (key in _ref0) {
        val = _ref0[key];
        if ((typeof val === "function"))(((typeof val !== 'undefined') && (typeof val.name !== 'undefined')) && (val.name !== "")) ? functions[val.name] = val : functions[key] = val;
      }
    }
    return functions;
  }
  exports.importFunctions = importFunctions;
  importFunctions(require("./functions"), {
    load: load
  });
  exports.utils = utils;
  exports.fileExtensions = [".jisp"];
  exports.register = (function() {
    return require("./register");
  });
  exports.tokenise = (function(src) {
    return tokenise(src);
  });
  exports.lex = (function(src) {
    return lex(tokenise(src));
  });
  exports.parse = (function(src) {
    return parse(lex(tokenise(src)));
  });
  exports.macroexpand = (function(src) {
    return macroexpand(parseMacros((Array.isArray(src) ? src : parse(lex(tokenise(src))))));
  });
  exports.macros = macros;
  exports.functions = functions;

  function compile(src, opts) {
    var defaults, parsed, compiled, scope, _ref, _i;
    defaults = {
      wrap: true,
      topScope: true,
      isTopLevel: true,
      pretty: true
    };
    opts = utils.merge(defaults, opts);
    parsed = (Array.isArray(src) ? src : parse(lex(tokenise(src))));
    parsed.unshift("do");
    if (opts.wrap) parsed = [
      ["get", ["fn", parsed], "'call'"], "this"
    ];
    if (!opts.repl) {
      functionsRedeclare = [];
      functionsRedefine = [];
    }
    macros._uniq = 0;
    _ref = compileForm(macroexpand(parseMacros(parsed)), {
      hoist: [],
      service: [],
      replace: {}
    }, opts);
    compiled = _ref[0];
    scope = _ref[1];
    return ((opts.pretty && (typeof beautify !== 'undefined')) ? beautify(render(compiled), {
      indent_size: 2
    }) : render(compiled));
  }
  exports.compile = compile;

  function extend() {
    var _i;
    var objects = 1 <= arguments.length ? [].slice.call(arguments, 0, _i = arguments.length - 0) : (_i = 0, []);
    return (function(result) {
      var object, key, value, _i0, _ref, _len, _ref0, _len0;
      _ref = objects;
      for (_i0 = 0, _len = _ref.length; _i0 < _len; ++_i0) {
        object = _ref[_i0];
        _ref0 = object;
        for (key in _ref0) {
          value = _ref0[key];
          if ((typeof value !== 'undefined')) result[key] = value;
        }
      }
      return result;
    })({});
  }
  extend;

  function jispEval(src) {
    return (((typeof vm !== 'undefined') && ((typeof vm !== 'undefined') && (typeof vm.runInNewContext !== 'undefined'))) ? vm.runInNewContext(src, extend(global, exports, {
      __dirname: __dirname,
      console: console,
      require: require
    })) : eval(src));
  }
  exports.eval = jispEval;

  function compileFile(filename) {
    var raw, stripped, _ref;
    raw = fs.readFileSync(filename, "utf8");
    stripped = ((raw.charCodeAt(0) === 65279) ? raw.substring(1) : raw);
    try {
      _ref = exports.compile(stripped);
    } catch (err) {
      throw err;
    }
    return _ref;
  }
  exports.compileFile = compileFile;

  function run(code, options) {
    var mainModule, dir;
    if ((typeof options === 'undefined')) options = {};
    mainModule = require.main;
    mainModule.filename = (process.argv[1] = (options.filename ? fs.realpathSync(options.filename) : "."));
    if (mainModule.moduleCache) mainModule.moduleCache = {};
    dir = (options.filename ? path.dirname(fs.realpathSync(options.filename)) : fs.realpathSync("."));
    mainModule.paths = require("module")._nodeModulePaths(dir);
    if ((!utils.isJisp(mainModule.filename) || require.extensions)) code = exports.compile(code);
    return mainModule._compile(code, mainModule.filename);
  }
  return exports.run = run;
})['call'](this);