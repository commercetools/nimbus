import * as re from "react";
import z, { createContext as ae, useContext as Q, forwardRef as V, useMemo as G, memo as tu, createElement as Wv, Children as Wi, isValidElement as ji, cloneElement as Qr, useRef as B, useLayoutEffect as ru, useEffect as ee, useSyncExternalStore as au, useCallback as ie, useId as jv, useState as se, Fragment as iu } from "react";
import ou, { createPortal as Dn, flushSync as nu } from "react-dom";
function Vv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Wo = { exports: {} }, ua = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xl;
function Hv() {
  if (Xl) return ua;
  Xl = 1;
  var e = z, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), a = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function n(l, s, d) {
    var c, h = {}, u = null, f = null;
    d !== void 0 && (u = "" + d), s.key !== void 0 && (u = "" + s.key), s.ref !== void 0 && (f = s.ref);
    for (c in s) a.call(s, c) && !o.hasOwnProperty(c) && (h[c] = s[c]);
    if (l && l.defaultProps) for (c in s = l.defaultProps, s) h[c] === void 0 && (h[c] = s[c]);
    return { $$typeof: t, type: l, key: u, ref: f, props: h, _owner: i.current };
  }
  return ua.Fragment = r, ua.jsx = n, ua.jsxs = n, ua;
}
var ha = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zl;
function Uv() {
  return Zl || (Zl = 1, process.env.NODE_ENV !== "production" && function() {
    var e = z, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), n = Symbol.for("react.provider"), l = Symbol.for("react.context"), s = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), c = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), u = Symbol.for("react.lazy"), f = Symbol.for("react.offscreen"), g = Symbol.iterator, v = "@@iterator";
    function b(y) {
      if (y === null || typeof y != "object")
        return null;
      var L = g && y[g] || y[v];
      return typeof L == "function" ? L : null;
    }
    var m = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function x(y) {
      {
        for (var L = arguments.length, K = new Array(L > 1 ? L - 1 : 0), X = 1; X < L; X++)
          K[X - 1] = arguments[X];
        S("error", y, K);
      }
    }
    function S(y, L, K) {
      {
        var X = m.ReactDebugCurrentFrame, pe = X.getStackAddendum();
        pe !== "" && (L += "%s", K = K.concat([pe]));
        var ye = K.map(function(de) {
          return String(de);
        });
        ye.unshift("Warning: " + L), Function.prototype.apply.call(console[y], console, ye);
      }
    }
    var T = !1, k = !1, $ = !1, D = !1, p = !1, w;
    w = Symbol.for("react.module.reference");
    function I(y) {
      return !!(typeof y == "string" || typeof y == "function" || y === a || y === o || p || y === i || y === d || y === c || D || y === f || T || k || $ || typeof y == "object" && y !== null && (y.$$typeof === u || y.$$typeof === h || y.$$typeof === n || y.$$typeof === l || y.$$typeof === s || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      y.$$typeof === w || y.getModuleId !== void 0));
    }
    function P(y, L, K) {
      var X = y.displayName;
      if (X)
        return X;
      var pe = L.displayName || L.name || "";
      return pe !== "" ? K + "(" + pe + ")" : K;
    }
    function O(y) {
      return y.displayName || "Context";
    }
    function _(y) {
      if (y == null)
        return null;
      if (typeof y.tag == "number" && x("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof y == "function")
        return y.displayName || y.name || null;
      if (typeof y == "string")
        return y;
      switch (y) {
        case a:
          return "Fragment";
        case r:
          return "Portal";
        case o:
          return "Profiler";
        case i:
          return "StrictMode";
        case d:
          return "Suspense";
        case c:
          return "SuspenseList";
      }
      if (typeof y == "object")
        switch (y.$$typeof) {
          case l:
            var L = y;
            return O(L) + ".Consumer";
          case n:
            var K = y;
            return O(K._context) + ".Provider";
          case s:
            return P(y, y.render, "ForwardRef");
          case h:
            var X = y.displayName || null;
            return X !== null ? X : _(y.type) || "Memo";
          case u: {
            var pe = y, ye = pe._payload, de = pe._init;
            try {
              return _(de(ye));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var E = Object.assign, F = 0, W, H, R, U, J, Ce, Fe;
    function He() {
    }
    He.__reactDisabledLog = !0;
    function Ue() {
      {
        if (F === 0) {
          W = console.log, H = console.info, R = console.warn, U = console.error, J = console.group, Ce = console.groupCollapsed, Fe = console.groupEnd;
          var y = {
            configurable: !0,
            enumerable: !0,
            value: He,
            writable: !0
          };
          Object.defineProperties(console, {
            info: y,
            log: y,
            warn: y,
            error: y,
            group: y,
            groupCollapsed: y,
            groupEnd: y
          });
        }
        F++;
      }
    }
    function Ge() {
      {
        if (F--, F === 0) {
          var y = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: E({}, y, {
              value: W
            }),
            info: E({}, y, {
              value: H
            }),
            warn: E({}, y, {
              value: R
            }),
            error: E({}, y, {
              value: U
            }),
            group: E({}, y, {
              value: J
            }),
            groupCollapsed: E({}, y, {
              value: Ce
            }),
            groupEnd: E({}, y, {
              value: Fe
            })
          });
        }
        F < 0 && x("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ut = m.ReactCurrentDispatcher, kt;
    function A(y, L, K) {
      {
        if (kt === void 0)
          try {
            throw Error();
          } catch (pe) {
            var X = pe.stack.trim().match(/\n( *(at )?)/);
            kt = X && X[1] || "";
          }
        return `
` + kt + y;
      }
    }
    var N = !1, Y;
    {
      var ce = typeof WeakMap == "function" ? WeakMap : Map;
      Y = new ce();
    }
    function M(y, L) {
      if (!y || N)
        return "";
      {
        var K = Y.get(y);
        if (K !== void 0)
          return K;
      }
      var X;
      N = !0;
      var pe = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ye;
      ye = ut.current, ut.current = null, Ue();
      try {
        if (L) {
          var de = function() {
            throw Error();
          };
          if (Object.defineProperty(de.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(de, []);
            } catch (tt) {
              X = tt;
            }
            Reflect.construct(y, [], de);
          } else {
            try {
              de.call();
            } catch (tt) {
              X = tt;
            }
            y.call(de.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (tt) {
            X = tt;
          }
          y();
        }
      } catch (tt) {
        if (tt && X && typeof tt.stack == "string") {
          for (var ne = tt.stack.split(`
`), et = X.stack.split(`
`), Te = ne.length - 1, De = et.length - 1; Te >= 1 && De >= 0 && ne[Te] !== et[De]; )
            De--;
          for (; Te >= 1 && De >= 0; Te--, De--)
            if (ne[Te] !== et[De]) {
              if (Te !== 1 || De !== 1)
                do
                  if (Te--, De--, De < 0 || ne[Te] !== et[De]) {
                    var gt = `
` + ne[Te].replace(" at new ", " at ");
                    return y.displayName && gt.includes("<anonymous>") && (gt = gt.replace("<anonymous>", y.displayName)), typeof y == "function" && Y.set(y, gt), gt;
                  }
                while (Te >= 1 && De >= 0);
              break;
            }
        }
      } finally {
        N = !1, ut.current = ye, Ge(), Error.prepareStackTrace = pe;
      }
      var zr = y ? y.displayName || y.name : "", gr = zr ? A(zr) : "";
      return typeof y == "function" && Y.set(y, gr), gr;
    }
    function $e(y, L, K) {
      return M(y, !1);
    }
    function Ye(y) {
      var L = y.prototype;
      return !!(L && L.isReactComponent);
    }
    function ht(y, L, K) {
      if (y == null)
        return "";
      if (typeof y == "function")
        return M(y, Ye(y));
      if (typeof y == "string")
        return A(y);
      switch (y) {
        case d:
          return A("Suspense");
        case c:
          return A("SuspenseList");
      }
      if (typeof y == "object")
        switch (y.$$typeof) {
          case s:
            return $e(y.render);
          case h:
            return ht(y.type, L, K);
          case u: {
            var X = y, pe = X._payload, ye = X._init;
            try {
              return ht(ye(pe), L, K);
            } catch {
            }
          }
        }
      return "";
    }
    var ft = Object.prototype.hasOwnProperty, qa = {}, da = m.ReactDebugCurrentFrame;
    function Rr(y) {
      if (y) {
        var L = y._owner, K = ht(y.type, y._source, L ? L.type : null);
        da.setExtraStackFrame(K);
      } else
        da.setExtraStackFrame(null);
    }
    function Xa(y, L, K, X, pe) {
      {
        var ye = Function.call.bind(ft);
        for (var de in y)
          if (ye(y, de)) {
            var ne = void 0;
            try {
              if (typeof y[de] != "function") {
                var et = Error((X || "React class") + ": " + K + " type `" + de + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof y[de] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw et.name = "Invariant Violation", et;
              }
              ne = y[de](L, de, X, K, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Te) {
              ne = Te;
            }
            ne && !(ne instanceof Error) && (Rr(pe), x("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", X || "React class", K, de, typeof ne), Rr(null)), ne instanceof Error && !(ne.message in qa) && (qa[ne.message] = !0, Rr(pe), x("Failed %s type: %s", K, ne.message), Rr(null));
          }
      }
    }
    var oo = Array.isArray;
    function Dr(y) {
      return oo(y);
    }
    function Za(y) {
      {
        var L = typeof Symbol == "function" && Symbol.toStringTag, K = L && y[Symbol.toStringTag] || y.constructor.name || "Object";
        return K;
      }
    }
    function ca(y) {
      try {
        return Ll(y), !1;
      } catch {
        return !0;
      }
    }
    function Ll(y) {
      return "" + y;
    }
    function Ml(y) {
      if (ca(y))
        return x("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Za(y)), Ll(y);
    }
    var Bl = m.ReactCurrentOwner, wv = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Kl, Wl;
    function $v(y) {
      if (ft.call(y, "ref")) {
        var L = Object.getOwnPropertyDescriptor(y, "ref").get;
        if (L && L.isReactWarning)
          return !1;
      }
      return y.ref !== void 0;
    }
    function Ev(y) {
      if (ft.call(y, "key")) {
        var L = Object.getOwnPropertyDescriptor(y, "key").get;
        if (L && L.isReactWarning)
          return !1;
      }
      return y.key !== void 0;
    }
    function Pv(y, L) {
      typeof y.ref == "string" && Bl.current;
    }
    function Cv(y, L) {
      {
        var K = function() {
          Kl || (Kl = !0, x("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        K.isReactWarning = !0, Object.defineProperty(y, "key", {
          get: K,
          configurable: !0
        });
      }
    }
    function Tv(y, L) {
      {
        var K = function() {
          Wl || (Wl = !0, x("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", L));
        };
        K.isReactWarning = !0, Object.defineProperty(y, "ref", {
          get: K,
          configurable: !0
        });
      }
    }
    var Iv = function(y, L, K, X, pe, ye, de) {
      var ne = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: y,
        key: L,
        ref: K,
        props: de,
        // Record the component responsible for creating this element.
        _owner: ye
      };
      return ne._store = {}, Object.defineProperty(ne._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(ne, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: X
      }), Object.defineProperty(ne, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: pe
      }), Object.freeze && (Object.freeze(ne.props), Object.freeze(ne)), ne;
    };
    function Rv(y, L, K, X, pe) {
      {
        var ye, de = {}, ne = null, et = null;
        K !== void 0 && (Ml(K), ne = "" + K), Ev(L) && (Ml(L.key), ne = "" + L.key), $v(L) && (et = L.ref, Pv(L, pe));
        for (ye in L)
          ft.call(L, ye) && !wv.hasOwnProperty(ye) && (de[ye] = L[ye]);
        if (y && y.defaultProps) {
          var Te = y.defaultProps;
          for (ye in Te)
            de[ye] === void 0 && (de[ye] = Te[ye]);
        }
        if (ne || et) {
          var De = typeof y == "function" ? y.displayName || y.name || "Unknown" : y;
          ne && Cv(de, De), et && Tv(de, De);
        }
        return Iv(y, ne, et, pe, X, Bl.current, de);
      }
    }
    var no = m.ReactCurrentOwner, jl = m.ReactDebugCurrentFrame;
    function Ar(y) {
      if (y) {
        var L = y._owner, K = ht(y.type, y._source, L ? L.type : null);
        jl.setExtraStackFrame(K);
      } else
        jl.setExtraStackFrame(null);
    }
    var lo;
    lo = !1;
    function so(y) {
      return typeof y == "object" && y !== null && y.$$typeof === t;
    }
    function Vl() {
      {
        if (no.current) {
          var y = _(no.current.type);
          if (y)
            return `

Check the render method of \`` + y + "`.";
        }
        return "";
      }
    }
    function Dv(y) {
      return "";
    }
    var Hl = {};
    function Av(y) {
      {
        var L = Vl();
        if (!L) {
          var K = typeof y == "string" ? y : y.displayName || y.name;
          K && (L = `

Check the top-level render call using <` + K + ">.");
        }
        return L;
      }
    }
    function Ul(y, L) {
      {
        if (!y._store || y._store.validated || y.key != null)
          return;
        y._store.validated = !0;
        var K = Av(L);
        if (Hl[K])
          return;
        Hl[K] = !0;
        var X = "";
        y && y._owner && y._owner !== no.current && (X = " It was passed a child from " + _(y._owner.type) + "."), Ar(y), x('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', K, X), Ar(null);
      }
    }
    function Gl(y, L) {
      {
        if (typeof y != "object")
          return;
        if (Dr(y))
          for (var K = 0; K < y.length; K++) {
            var X = y[K];
            so(X) && Ul(X, L);
          }
        else if (so(y))
          y._store && (y._store.validated = !0);
        else if (y) {
          var pe = b(y);
          if (typeof pe == "function" && pe !== y.entries)
            for (var ye = pe.call(y), de; !(de = ye.next()).done; )
              so(de.value) && Ul(de.value, L);
        }
      }
    }
    function zv(y) {
      {
        var L = y.type;
        if (L == null || typeof L == "string")
          return;
        var K;
        if (typeof L == "function")
          K = L.propTypes;
        else if (typeof L == "object" && (L.$$typeof === s || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        L.$$typeof === h))
          K = L.propTypes;
        else
          return;
        if (K) {
          var X = _(L);
          Xa(K, y.props, "prop", X, y);
        } else if (L.PropTypes !== void 0 && !lo) {
          lo = !0;
          var pe = _(L);
          x("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", pe || "Unknown");
        }
        typeof L.getDefaultProps == "function" && !L.getDefaultProps.isReactClassApproved && x("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Ov(y) {
      {
        for (var L = Object.keys(y.props), K = 0; K < L.length; K++) {
          var X = L[K];
          if (X !== "children" && X !== "key") {
            Ar(y), x("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", X), Ar(null);
            break;
          }
        }
        y.ref !== null && (Ar(y), x("Invalid attribute `ref` supplied to `React.Fragment`."), Ar(null));
      }
    }
    var Yl = {};
    function ql(y, L, K, X, pe, ye) {
      {
        var de = I(y);
        if (!de) {
          var ne = "";
          (y === void 0 || typeof y == "object" && y !== null && Object.keys(y).length === 0) && (ne += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var et = Dv();
          et ? ne += et : ne += Vl();
          var Te;
          y === null ? Te = "null" : Dr(y) ? Te = "array" : y !== void 0 && y.$$typeof === t ? (Te = "<" + (_(y.type) || "Unknown") + " />", ne = " Did you accidentally export a JSX literal instead of a component?") : Te = typeof y, x("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Te, ne);
        }
        var De = Rv(y, L, K, pe, ye);
        if (De == null)
          return De;
        if (de) {
          var gt = L.children;
          if (gt !== void 0)
            if (X)
              if (Dr(gt)) {
                for (var zr = 0; zr < gt.length; zr++)
                  Gl(gt[zr], y);
                Object.freeze && Object.freeze(gt);
              } else
                x("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Gl(gt, y);
        }
        if (ft.call(L, "key")) {
          var gr = _(y), tt = Object.keys(L).filter(function(Kv) {
            return Kv !== "key";
          }), co = tt.length > 0 ? "{key: someKey, " + tt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Yl[gr + co]) {
            var Bv = tt.length > 0 ? "{" + tt.join(": ..., ") + ": ...}" : "{}";
            x(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, co, gr, Bv, gr), Yl[gr + co] = !0;
          }
        }
        return y === a ? Ov(De) : zv(De), De;
      }
    }
    function Fv(y, L, K) {
      return ql(y, L, K, !0);
    }
    function Nv(y, L, K) {
      return ql(y, L, K, !1);
    }
    var Lv = Nv, Mv = Fv;
    ha.Fragment = a, ha.jsx = Lv, ha.jsxs = Mv;
  }()), ha;
}
process.env.NODE_ENV === "production" ? Wo.exports = Hv() : Wo.exports = Uv();
var C = Wo.exports;
const lt = (...e) => e.filter(Boolean).map((t) => t.trim()).join(" ");
function Gv(e, t) {
  return `${e} returned \`undefined\`. Seems you forgot to wrap component within ${t}`;
}
function Ea(e = {}) {
  const {
    name: t,
    strict: r = !0,
    hookName: a = "useContext",
    providerName: i = "Provider",
    errorMessage: o,
    defaultValue: n
  } = e, l = ae(n);
  l.displayName = t;
  function s() {
    var c;
    const d = Q(l);
    if (!d && r) {
      const h = new Error(
        o ?? Gv(a, i)
      );
      throw h.name = "ContextError", (c = Error.captureStackTrace) == null || c.call(Error, h, s), h;
    }
    return d;
  }
  return [l.Provider, s, l];
}
function Yv(...e) {
  return function(...r) {
    e.forEach((a) => a == null ? void 0 : a(...r));
  };
}
const qv = (...e) => e.map((t) => {
  var r;
  return (r = t == null ? void 0 : t.trim) == null ? void 0 : r.call(t);
}).filter(Boolean).join(" "), Xv = /^on[A-Z]/;
function $i(...e) {
  let t = {};
  for (let r of e) {
    for (let a in t) {
      if (Xv.test(a) && typeof t[a] == "function" && typeof r[a] == "function") {
        t[a] = Yv(t[a], r[a]);
        continue;
      }
      if (a === "className" || a === "class") {
        t[a] = qv(t[a], r[a]);
        continue;
      }
      if (a === "style") {
        t[a] = Object.assign({}, t[a] ?? {}, r[a] ?? {});
        continue;
      }
      t[a] = r[a] !== void 0 ? r[a] : t[a];
    }
    for (let a in r)
      t[a] === void 0 && (t[a] = r[a]);
  }
  return t;
}
const Zv = Object.freeze({}), Jv = Object.freeze(
  {}
);
function lu(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return function(r) {
    return t[r] === void 0 && (t[r] = e(r)), t[r];
  };
}
var Qv = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/, su = /* @__PURE__ */ lu(
  function(e) {
    return Qv.test(e) || e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) < 91;
  }
  /* Z+1 */
);
function em(e) {
  if (e.sheet)
    return e.sheet;
  for (var t = 0; t < document.styleSheets.length; t++)
    if (document.styleSheets[t].ownerNode === e)
      return document.styleSheets[t];
}
function tm(e) {
  var t = document.createElement("style");
  return t.setAttribute("data-emotion", e.key), e.nonce !== void 0 && t.setAttribute("nonce", e.nonce), t.appendChild(document.createTextNode("")), t.setAttribute("data-s", ""), t;
}
var rm = /* @__PURE__ */ function() {
  function e(r) {
    var a = this;
    this._insertTag = function(i) {
      var o;
      a.tags.length === 0 ? a.insertionPoint ? o = a.insertionPoint.nextSibling : a.prepend ? o = a.container.firstChild : o = a.before : o = a.tags[a.tags.length - 1].nextSibling, a.container.insertBefore(i, o), a.tags.push(i);
    }, this.isSpeedy = r.speedy === void 0 ? !0 : r.speedy, this.tags = [], this.ctr = 0, this.nonce = r.nonce, this.key = r.key, this.container = r.container, this.prepend = r.prepend, this.insertionPoint = r.insertionPoint, this.before = null;
  }
  var t = e.prototype;
  return t.hydrate = function(a) {
    a.forEach(this._insertTag);
  }, t.insert = function(a) {
    this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(tm(this));
    var i = this.tags[this.tags.length - 1];
    if (this.isSpeedy) {
      var o = em(i);
      try {
        o.insertRule(a, o.cssRules.length);
      } catch {
      }
    } else
      i.appendChild(document.createTextNode(a));
    this.ctr++;
  }, t.flush = function() {
    this.tags.forEach(function(a) {
      var i;
      return (i = a.parentNode) == null ? void 0 : i.removeChild(a);
    }), this.tags = [], this.ctr = 0;
  }, e;
}(), Ze = "-ms-", Ei = "-moz-", ue = "-webkit-", du = "comm", An = "rule", zn = "decl", am = "@import", cu = "@keyframes", im = "@layer", om = Math.abs, Vi = String.fromCharCode, nm = Object.assign;
function lm(e, t) {
  return We(e, 0) ^ 45 ? (((t << 2 ^ We(e, 0)) << 2 ^ We(e, 1)) << 2 ^ We(e, 2)) << 2 ^ We(e, 3) : 0;
}
function uu(e) {
  return e.trim();
}
function sm(e, t) {
  return (e = t.exec(e)) ? e[0] : e;
}
function he(e, t, r) {
  return e.replace(t, r);
}
function jo(e, t) {
  return e.indexOf(t);
}
function We(e, t) {
  return e.charCodeAt(t) | 0;
}
function Ia(e, t, r) {
  return e.slice(t, r);
}
function Dt(e) {
  return e.length;
}
function On(e) {
  return e.length;
}
function Ja(e, t) {
  return t.push(e), e;
}
function dm(e, t) {
  return e.map(t).join("");
}
var Hi = 1, Jr = 1, hu = 0, nt = 0, Oe = 0, ea = "";
function Ui(e, t, r, a, i, o, n) {
  return { value: e, root: t, parent: r, type: a, props: i, children: o, line: Hi, column: Jr, length: n, return: "" };
}
function fa(e, t) {
  return nm(Ui("", null, null, "", null, null, 0), e, { length: -e.length }, t);
}
function cm() {
  return Oe;
}
function um() {
  return Oe = nt > 0 ? We(ea, --nt) : 0, Jr--, Oe === 10 && (Jr = 1, Hi--), Oe;
}
function st() {
  return Oe = nt < hu ? We(ea, nt++) : 0, Jr++, Oe === 10 && (Jr = 1, Hi++), Oe;
}
function Ft() {
  return We(ea, nt);
}
function gi() {
  return nt;
}
function Ka(e, t) {
  return Ia(ea, e, t);
}
function Ra(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function fu(e) {
  return Hi = Jr = 1, hu = Dt(ea = e), nt = 0, [];
}
function gu(e) {
  return ea = "", e;
}
function pi(e) {
  return uu(Ka(nt - 1, Vo(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function hm(e) {
  for (; (Oe = Ft()) && Oe < 33; )
    st();
  return Ra(e) > 2 || Ra(Oe) > 3 ? "" : " ";
}
function fm(e, t) {
  for (; --t && st() && !(Oe < 48 || Oe > 102 || Oe > 57 && Oe < 65 || Oe > 70 && Oe < 97); )
    ;
  return Ka(e, gi() + (t < 6 && Ft() == 32 && st() == 32));
}
function Vo(e) {
  for (; st(); )
    switch (Oe) {
      case e:
        return nt;
      case 34:
      case 39:
        e !== 34 && e !== 39 && Vo(Oe);
        break;
      case 40:
        e === 41 && Vo(e);
        break;
      case 92:
        st();
        break;
    }
  return nt;
}
function gm(e, t) {
  for (; st() && e + Oe !== 57; )
    if (e + Oe === 84 && Ft() === 47)
      break;
  return "/*" + Ka(t, nt - 1) + "*" + Vi(e === 47 ? e : st());
}
function pm(e) {
  for (; !Ra(Ft()); )
    st();
  return Ka(e, nt);
}
function vm(e) {
  return gu(vi("", null, null, null, [""], e = fu(e), 0, [0], e));
}
function vi(e, t, r, a, i, o, n, l, s) {
  for (var d = 0, c = 0, h = n, u = 0, f = 0, g = 0, v = 1, b = 1, m = 1, x = 0, S = "", T = i, k = o, $ = a, D = S; b; )
    switch (g = x, x = st()) {
      case 40:
        if (g != 108 && We(D, h - 1) == 58) {
          jo(D += he(pi(x), "&", "&\f"), "&\f") != -1 && (m = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        D += pi(x);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        D += hm(g);
        break;
      case 92:
        D += fm(gi() - 1, 7);
        continue;
      case 47:
        switch (Ft()) {
          case 42:
          case 47:
            Ja(mm(gm(st(), gi()), t, r), s);
            break;
          default:
            D += "/";
        }
        break;
      case 123 * v:
        l[d++] = Dt(D) * m;
      case 125 * v:
      case 59:
      case 0:
        switch (x) {
          case 0:
          case 125:
            b = 0;
          case 59 + c:
            m == -1 && (D = he(D, /\f/g, "")), f > 0 && Dt(D) - h && Ja(f > 32 ? Ql(D + ";", a, r, h - 1) : Ql(he(D, " ", "") + ";", a, r, h - 2), s);
            break;
          case 59:
            D += ";";
          default:
            if (Ja($ = Jl(D, t, r, d, c, i, l, S, T = [], k = [], h), o), x === 123)
              if (c === 0)
                vi(D, t, $, $, T, o, h, l, k);
              else
                switch (u === 99 && We(D, 3) === 110 ? 100 : u) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    vi(e, $, $, a && Ja(Jl(e, $, $, 0, 0, i, l, S, i, T = [], h), k), i, k, h, l, a ? T : k);
                    break;
                  default:
                    vi(D, $, $, $, [""], k, 0, l, k);
                }
        }
        d = c = f = 0, v = m = 1, S = D = "", h = n;
        break;
      case 58:
        h = 1 + Dt(D), f = g;
      default:
        if (v < 1) {
          if (x == 123)
            --v;
          else if (x == 125 && v++ == 0 && um() == 125)
            continue;
        }
        switch (D += Vi(x), x * v) {
          case 38:
            m = c > 0 ? 1 : (D += "\f", -1);
            break;
          case 44:
            l[d++] = (Dt(D) - 1) * m, m = 1;
            break;
          case 64:
            Ft() === 45 && (D += pi(st())), u = Ft(), c = h = Dt(S = D += pm(gi())), x++;
            break;
          case 45:
            g === 45 && Dt(D) == 2 && (v = 0);
        }
    }
  return o;
}
function Jl(e, t, r, a, i, o, n, l, s, d, c) {
  for (var h = i - 1, u = i === 0 ? o : [""], f = On(u), g = 0, v = 0, b = 0; g < a; ++g)
    for (var m = 0, x = Ia(e, h + 1, h = om(v = n[g])), S = e; m < f; ++m)
      (S = uu(v > 0 ? u[m] + " " + x : he(x, /&\f/g, u[m]))) && (s[b++] = S);
  return Ui(e, t, r, i === 0 ? An : l, s, d, c);
}
function mm(e, t, r) {
  return Ui(e, t, r, du, Vi(cm()), Ia(e, 2, -2), 0);
}
function Ql(e, t, r, a) {
  return Ui(e, t, r, zn, Ia(e, 0, a), Ia(e, a + 1, -1), a);
}
function Yr(e, t) {
  for (var r = "", a = On(e), i = 0; i < a; i++)
    r += t(e[i], i, e, t) || "";
  return r;
}
function bm(e, t, r, a) {
  switch (e.type) {
    case im:
      if (e.children.length) break;
    case am:
    case zn:
      return e.return = e.return || e.value;
    case du:
      return "";
    case cu:
      return e.return = e.value + "{" + Yr(e.children, a) + "}";
    case An:
      e.value = e.props.join(",");
  }
  return Dt(r = Yr(e.children, a)) ? e.return = e.value + "{" + r + "}" : "";
}
function ym(e) {
  var t = On(e);
  return function(r, a, i, o) {
    for (var n = "", l = 0; l < t; l++)
      n += e[l](r, a, i, o) || "";
    return n;
  };
}
function xm(e) {
  return function(t) {
    t.root || (t = t.return) && e(t);
  };
}
var km = function(t, r, a) {
  for (var i = 0, o = 0; i = o, o = Ft(), i === 38 && o === 12 && (r[a] = 1), !Ra(o); )
    st();
  return Ka(t, nt);
}, _m = function(t, r) {
  var a = -1, i = 44;
  do
    switch (Ra(i)) {
      case 0:
        i === 38 && Ft() === 12 && (r[a] = 1), t[a] += km(nt - 1, r, a);
        break;
      case 2:
        t[a] += pi(i);
        break;
      case 4:
        if (i === 44) {
          t[++a] = Ft() === 58 ? "&\f" : "", r[a] = t[a].length;
          break;
        }
      default:
        t[a] += Vi(i);
    }
  while (i = st());
  return t;
}, Sm = function(t, r) {
  return gu(_m(fu(t), r));
}, es = /* @__PURE__ */ new WeakMap(), wm = function(t) {
  if (!(t.type !== "rule" || !t.parent || // positive .length indicates that this rule contains pseudo
  // negative .length indicates that this rule has been already prefixed
  t.length < 1)) {
    for (var r = t.value, a = t.parent, i = t.column === a.column && t.line === a.line; a.type !== "rule"; )
      if (a = a.parent, !a) return;
    if (!(t.props.length === 1 && r.charCodeAt(0) !== 58 && !es.get(a)) && !i) {
      es.set(t, !0);
      for (var o = [], n = Sm(r, o), l = a.props, s = 0, d = 0; s < n.length; s++)
        for (var c = 0; c < l.length; c++, d++)
          t.props[d] = o[s] ? n[s].replace(/&\f/g, l[c]) : l[c] + " " + n[s];
    }
  }
}, $m = function(t) {
  if (t.type === "decl") {
    var r = t.value;
    // charcode for l
    r.charCodeAt(0) === 108 && // charcode for b
    r.charCodeAt(2) === 98 && (t.return = "", t.value = "");
  }
};
function pu(e, t) {
  switch (lm(e, t)) {
    case 5103:
      return ue + "print-" + e + e;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return ue + e + e;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return ue + e + Ei + e + Ze + e + e;
    case 6828:
    case 4268:
      return ue + e + Ze + e + e;
    case 6165:
      return ue + e + Ze + "flex-" + e + e;
    case 5187:
      return ue + e + he(e, /(\w+).+(:[^]+)/, ue + "box-$1$2" + Ze + "flex-$1$2") + e;
    case 5443:
      return ue + e + Ze + "flex-item-" + he(e, /flex-|-self/, "") + e;
    case 4675:
      return ue + e + Ze + "flex-line-pack" + he(e, /align-content|flex-|-self/, "") + e;
    case 5548:
      return ue + e + Ze + he(e, "shrink", "negative") + e;
    case 5292:
      return ue + e + Ze + he(e, "basis", "preferred-size") + e;
    case 6060:
      return ue + "box-" + he(e, "-grow", "") + ue + e + Ze + he(e, "grow", "positive") + e;
    case 4554:
      return ue + he(e, /([^-])(transform)/g, "$1" + ue + "$2") + e;
    case 6187:
      return he(he(he(e, /(zoom-|grab)/, ue + "$1"), /(image-set)/, ue + "$1"), e, "") + e;
    case 5495:
    case 3959:
      return he(e, /(image-set\([^]*)/, ue + "$1$`$1");
    case 4968:
      return he(he(e, /(.+:)(flex-)?(.*)/, ue + "box-pack:$3" + Ze + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + ue + e + e;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return he(e, /(.+)-inline(.+)/, ue + "$1$2") + e;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (Dt(e) - 1 - t > 6) switch (We(e, t + 1)) {
        case 109:
          if (We(e, t + 4) !== 45) break;
        case 102:
          return he(e, /(.+:)(.+)-([^]+)/, "$1" + ue + "$2-$3$1" + Ei + (We(e, t + 3) == 108 ? "$3" : "$2-$3")) + e;
        case 115:
          return ~jo(e, "stretch") ? pu(he(e, "stretch", "fill-available"), t) + e : e;
      }
      break;
    case 4949:
      if (We(e, t + 1) !== 115) break;
    case 6444:
      switch (We(e, Dt(e) - 3 - (~jo(e, "!important") && 10))) {
        case 107:
          return he(e, ":", ":" + ue) + e;
        case 101:
          return he(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + ue + (We(e, 14) === 45 ? "inline-" : "") + "box$3$1" + ue + "$2$3$1" + Ze + "$2box$3") + e;
      }
      break;
    case 5936:
      switch (We(e, t + 11)) {
        case 114:
          return ue + e + Ze + he(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
        case 108:
          return ue + e + Ze + he(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
        case 45:
          return ue + e + Ze + he(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
      }
      return ue + e + Ze + e + e;
  }
  return e;
}
var Em = function(t, r, a, i) {
  if (t.length > -1 && !t.return) switch (t.type) {
    case zn:
      t.return = pu(t.value, t.length);
      break;
    case cu:
      return Yr([fa(t, {
        value: he(t.value, "@", "@" + ue)
      })], i);
    case An:
      if (t.length) return dm(t.props, function(o) {
        switch (sm(o, /(::plac\w+|:read-\w+)/)) {
          case ":read-only":
          case ":read-write":
            return Yr([fa(t, {
              props: [he(o, /:(read-\w+)/, ":" + Ei + "$1")]
            })], i);
          case "::placeholder":
            return Yr([fa(t, {
              props: [he(o, /:(plac\w+)/, ":" + ue + "input-$1")]
            }), fa(t, {
              props: [he(o, /:(plac\w+)/, ":" + Ei + "$1")]
            }), fa(t, {
              props: [he(o, /:(plac\w+)/, Ze + "input-$1")]
            })], i);
        }
        return "";
      });
  }
}, Pm = [Em], Cm = function(t) {
  var r = t.key;
  if (r === "css") {
    var a = document.querySelectorAll("style[data-emotion]:not([data-s])");
    Array.prototype.forEach.call(a, function(v) {
      var b = v.getAttribute("data-emotion");
      b.indexOf(" ") !== -1 && (document.head.appendChild(v), v.setAttribute("data-s", ""));
    });
  }
  var i = t.stylisPlugins || Pm, o = {}, n, l = [];
  n = t.container || document.head, Array.prototype.forEach.call(
    // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll('style[data-emotion^="' + r + ' "]'),
    function(v) {
      for (var b = v.getAttribute("data-emotion").split(" "), m = 1; m < b.length; m++)
        o[b[m]] = !0;
      l.push(v);
    }
  );
  var s, d = [wm, $m];
  {
    var c, h = [bm, xm(function(v) {
      c.insert(v);
    })], u = ym(d.concat(i, h)), f = function(b) {
      return Yr(vm(b), u);
    };
    s = function(b, m, x, S) {
      c = x, f(b ? b + "{" + m.styles + "}" : m.styles), S && (g.inserted[m.name] = !0);
    };
  }
  var g = {
    key: r,
    sheet: new rm({
      key: r,
      container: n,
      nonce: t.nonce,
      speedy: t.speedy,
      prepend: t.prepend,
      insertionPoint: t.insertionPoint
    }),
    nonce: t.nonce,
    inserted: o,
    registered: {},
    insert: s
  };
  return g.sheet.hydrate(l), g;
}, Ho = { exports: {} }, ve = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ts;
function Tm() {
  if (ts) return ve;
  ts = 1;
  var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, a = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, n = e ? Symbol.for("react.provider") : 60109, l = e ? Symbol.for("react.context") : 60110, s = e ? Symbol.for("react.async_mode") : 60111, d = e ? Symbol.for("react.concurrent_mode") : 60111, c = e ? Symbol.for("react.forward_ref") : 60112, h = e ? Symbol.for("react.suspense") : 60113, u = e ? Symbol.for("react.suspense_list") : 60120, f = e ? Symbol.for("react.memo") : 60115, g = e ? Symbol.for("react.lazy") : 60116, v = e ? Symbol.for("react.block") : 60121, b = e ? Symbol.for("react.fundamental") : 60117, m = e ? Symbol.for("react.responder") : 60118, x = e ? Symbol.for("react.scope") : 60119;
  function S(k) {
    if (typeof k == "object" && k !== null) {
      var $ = k.$$typeof;
      switch ($) {
        case t:
          switch (k = k.type, k) {
            case s:
            case d:
            case a:
            case o:
            case i:
            case h:
              return k;
            default:
              switch (k = k && k.$$typeof, k) {
                case l:
                case c:
                case g:
                case f:
                case n:
                  return k;
                default:
                  return $;
              }
          }
        case r:
          return $;
      }
    }
  }
  function T(k) {
    return S(k) === d;
  }
  return ve.AsyncMode = s, ve.ConcurrentMode = d, ve.ContextConsumer = l, ve.ContextProvider = n, ve.Element = t, ve.ForwardRef = c, ve.Fragment = a, ve.Lazy = g, ve.Memo = f, ve.Portal = r, ve.Profiler = o, ve.StrictMode = i, ve.Suspense = h, ve.isAsyncMode = function(k) {
    return T(k) || S(k) === s;
  }, ve.isConcurrentMode = T, ve.isContextConsumer = function(k) {
    return S(k) === l;
  }, ve.isContextProvider = function(k) {
    return S(k) === n;
  }, ve.isElement = function(k) {
    return typeof k == "object" && k !== null && k.$$typeof === t;
  }, ve.isForwardRef = function(k) {
    return S(k) === c;
  }, ve.isFragment = function(k) {
    return S(k) === a;
  }, ve.isLazy = function(k) {
    return S(k) === g;
  }, ve.isMemo = function(k) {
    return S(k) === f;
  }, ve.isPortal = function(k) {
    return S(k) === r;
  }, ve.isProfiler = function(k) {
    return S(k) === o;
  }, ve.isStrictMode = function(k) {
    return S(k) === i;
  }, ve.isSuspense = function(k) {
    return S(k) === h;
  }, ve.isValidElementType = function(k) {
    return typeof k == "string" || typeof k == "function" || k === a || k === d || k === o || k === i || k === h || k === u || typeof k == "object" && k !== null && (k.$$typeof === g || k.$$typeof === f || k.$$typeof === n || k.$$typeof === l || k.$$typeof === c || k.$$typeof === b || k.$$typeof === m || k.$$typeof === x || k.$$typeof === v);
  }, ve.typeOf = S, ve;
}
var me = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rs;
function Im() {
  return rs || (rs = 1, process.env.NODE_ENV !== "production" && function() {
    var e = typeof Symbol == "function" && Symbol.for, t = e ? Symbol.for("react.element") : 60103, r = e ? Symbol.for("react.portal") : 60106, a = e ? Symbol.for("react.fragment") : 60107, i = e ? Symbol.for("react.strict_mode") : 60108, o = e ? Symbol.for("react.profiler") : 60114, n = e ? Symbol.for("react.provider") : 60109, l = e ? Symbol.for("react.context") : 60110, s = e ? Symbol.for("react.async_mode") : 60111, d = e ? Symbol.for("react.concurrent_mode") : 60111, c = e ? Symbol.for("react.forward_ref") : 60112, h = e ? Symbol.for("react.suspense") : 60113, u = e ? Symbol.for("react.suspense_list") : 60120, f = e ? Symbol.for("react.memo") : 60115, g = e ? Symbol.for("react.lazy") : 60116, v = e ? Symbol.for("react.block") : 60121, b = e ? Symbol.for("react.fundamental") : 60117, m = e ? Symbol.for("react.responder") : 60118, x = e ? Symbol.for("react.scope") : 60119;
    function S(M) {
      return typeof M == "string" || typeof M == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      M === a || M === d || M === o || M === i || M === h || M === u || typeof M == "object" && M !== null && (M.$$typeof === g || M.$$typeof === f || M.$$typeof === n || M.$$typeof === l || M.$$typeof === c || M.$$typeof === b || M.$$typeof === m || M.$$typeof === x || M.$$typeof === v);
    }
    function T(M) {
      if (typeof M == "object" && M !== null) {
        var $e = M.$$typeof;
        switch ($e) {
          case t:
            var Ye = M.type;
            switch (Ye) {
              case s:
              case d:
              case a:
              case o:
              case i:
              case h:
                return Ye;
              default:
                var ht = Ye && Ye.$$typeof;
                switch (ht) {
                  case l:
                  case c:
                  case g:
                  case f:
                  case n:
                    return ht;
                  default:
                    return $e;
                }
            }
          case r:
            return $e;
        }
      }
    }
    var k = s, $ = d, D = l, p = n, w = t, I = c, P = a, O = g, _ = f, E = r, F = o, W = i, H = h, R = !1;
    function U(M) {
      return R || (R = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), J(M) || T(M) === s;
    }
    function J(M) {
      return T(M) === d;
    }
    function Ce(M) {
      return T(M) === l;
    }
    function Fe(M) {
      return T(M) === n;
    }
    function He(M) {
      return typeof M == "object" && M !== null && M.$$typeof === t;
    }
    function Ue(M) {
      return T(M) === c;
    }
    function Ge(M) {
      return T(M) === a;
    }
    function ut(M) {
      return T(M) === g;
    }
    function kt(M) {
      return T(M) === f;
    }
    function A(M) {
      return T(M) === r;
    }
    function N(M) {
      return T(M) === o;
    }
    function Y(M) {
      return T(M) === i;
    }
    function ce(M) {
      return T(M) === h;
    }
    me.AsyncMode = k, me.ConcurrentMode = $, me.ContextConsumer = D, me.ContextProvider = p, me.Element = w, me.ForwardRef = I, me.Fragment = P, me.Lazy = O, me.Memo = _, me.Portal = E, me.Profiler = F, me.StrictMode = W, me.Suspense = H, me.isAsyncMode = U, me.isConcurrentMode = J, me.isContextConsumer = Ce, me.isContextProvider = Fe, me.isElement = He, me.isForwardRef = Ue, me.isFragment = Ge, me.isLazy = ut, me.isMemo = kt, me.isPortal = A, me.isProfiler = N, me.isStrictMode = Y, me.isSuspense = ce, me.isValidElementType = S, me.typeOf = T;
  }()), me;
}
process.env.NODE_ENV === "production" ? Ho.exports = Tm() : Ho.exports = Im();
var Rm = Ho.exports, vu = Rm, Dm = {
  $$typeof: !0,
  render: !0,
  defaultProps: !0,
  displayName: !0,
  propTypes: !0
}, Am = {
  $$typeof: !0,
  compare: !0,
  defaultProps: !0,
  displayName: !0,
  propTypes: !0,
  type: !0
}, mu = {};
mu[vu.ForwardRef] = Dm;
mu[vu.Memo] = Am;
var zm = !0;
function bu(e, t, r) {
  var a = "";
  return r.split(" ").forEach(function(i) {
    e[i] !== void 0 ? t.push(e[i] + ";") : i && (a += i + " ");
  }), a;
}
var Fn = function(t, r, a) {
  var i = t.key + "-" + r.name;
  // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (a === !1 || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  zm === !1) && t.registered[i] === void 0 && (t.registered[i] = r.styles);
}, Nn = function(t, r, a) {
  Fn(t, r, a);
  var i = t.key + "-" + r.name;
  if (t.inserted[r.name] === void 0) {
    var o = r;
    do
      t.insert(r === o ? "." + i : "", o, t.sheet, !0), o = o.next;
    while (o !== void 0);
  }
};
function Om(e) {
  for (var t = 0, r, a = 0, i = e.length; i >= 4; ++a, i -= 4)
    r = e.charCodeAt(a) & 255 | (e.charCodeAt(++a) & 255) << 8 | (e.charCodeAt(++a) & 255) << 16 | (e.charCodeAt(++a) & 255) << 24, r = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16), r ^= /* k >>> r: */
    r >>> 24, t = /* Math.imul(k, m): */
    (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  switch (i) {
    case 3:
      t ^= (e.charCodeAt(a + 2) & 255) << 16;
    case 2:
      t ^= (e.charCodeAt(a + 1) & 255) << 8;
    case 1:
      t ^= e.charCodeAt(a) & 255, t = /* Math.imul(h, m): */
      (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
  }
  return t ^= t >>> 13, t = /* Math.imul(h, m): */
  (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
var Fm = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  scale: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
}, Nm = /[A-Z]|^ms/g, Lm = /_EMO_([^_]+?)_([^]*?)_EMO_/g, yu = function(t) {
  return t.charCodeAt(1) === 45;
}, as = function(t) {
  return t != null && typeof t != "boolean";
}, uo = /* @__PURE__ */ lu(function(e) {
  return yu(e) ? e : e.replace(Nm, "-$&").toLowerCase();
}), is = function(t, r) {
  switch (t) {
    case "animation":
    case "animationName":
      if (typeof r == "string")
        return r.replace(Lm, function(a, i, o) {
          return At = {
            name: i,
            styles: o,
            next: At
          }, i;
        });
  }
  return Fm[t] !== 1 && !yu(t) && typeof r == "number" && r !== 0 ? r + "px" : r;
};
function Da(e, t, r) {
  if (r == null)
    return "";
  var a = r;
  if (a.__emotion_styles !== void 0)
    return a;
  switch (typeof r) {
    case "boolean":
      return "";
    case "object": {
      var i = r;
      if (i.anim === 1)
        return At = {
          name: i.name,
          styles: i.styles,
          next: At
        }, i.name;
      var o = r;
      if (o.styles !== void 0) {
        var n = o.next;
        if (n !== void 0)
          for (; n !== void 0; )
            At = {
              name: n.name,
              styles: n.styles,
              next: At
            }, n = n.next;
        var l = o.styles + ";";
        return l;
      }
      return Mm(e, t, r);
    }
    case "function": {
      if (e !== void 0) {
        var s = At, d = r(e);
        return At = s, Da(e, t, d);
      }
      break;
    }
  }
  var c = r;
  if (t == null)
    return c;
  var h = t[c];
  return h !== void 0 ? h : c;
}
function Mm(e, t, r) {
  var a = "";
  if (Array.isArray(r))
    for (var i = 0; i < r.length; i++)
      a += Da(e, t, r[i]) + ";";
  else
    for (var o in r) {
      var n = r[o];
      if (typeof n != "object") {
        var l = n;
        t != null && t[l] !== void 0 ? a += o + "{" + t[l] + "}" : as(l) && (a += uo(o) + ":" + is(o, l) + ";");
      } else if (Array.isArray(n) && typeof n[0] == "string" && (t == null || t[n[0]] === void 0))
        for (var s = 0; s < n.length; s++)
          as(n[s]) && (a += uo(o) + ":" + is(o, n[s]) + ";");
      else {
        var d = Da(e, t, n);
        switch (o) {
          case "animation":
          case "animationName": {
            a += uo(o) + ":" + d + ";";
            break;
          }
          default:
            a += o + "{" + d + "}";
        }
      }
    }
  return a;
}
var os = /label:\s*([^\s;{]+)\s*(;|$)/g, At;
function Ln(e, t, r) {
  if (e.length === 1 && typeof e[0] == "object" && e[0] !== null && e[0].styles !== void 0)
    return e[0];
  var a = !0, i = "";
  At = void 0;
  var o = e[0];
  if (o == null || o.raw === void 0)
    a = !1, i += Da(r, t, o);
  else {
    var n = o;
    i += n[0];
  }
  for (var l = 1; l < e.length; l++)
    if (i += Da(r, t, e[l]), a) {
      var s = o;
      i += s[l];
    }
  os.lastIndex = 0;
  for (var d = "", c; (c = os.exec(i)) !== null; )
    d += "-" + c[1];
  var h = Om(i) + d;
  return {
    name: h,
    styles: i,
    next: At
  };
}
var Bm = function(t) {
  return t();
}, xu = re.useInsertionEffect ? re.useInsertionEffect : !1, ku = xu || Bm, ns = xu || re.useLayoutEffect, _u = /* @__PURE__ */ re.createContext(
  // we're doing this to avoid preconstruct's dead code elimination in this one case
  // because this module is primarily intended for the browser and node
  // but it's also required in react native and similar environments sometimes
  // and we could have a special build just for that
  // but this is much easier and the native packages
  // might use a different theme context in the future anyway
  typeof HTMLElement < "u" ? /* @__PURE__ */ Cm({
    key: "css"
  }) : null
);
_u.Provider;
var Mn = function(t) {
  return /* @__PURE__ */ V(function(r, a) {
    var i = Q(_u);
    return t(r, i, a);
  });
}, Bn = /* @__PURE__ */ re.createContext({}), Kn = {}.hasOwnProperty, Uo = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", Km = function(t, r) {
  var a = {};
  for (var i in r)
    Kn.call(r, i) && (a[i] = r[i]);
  return a[Uo] = t, a;
}, Wm = function(t) {
  var r = t.cache, a = t.serialized, i = t.isStringTag;
  return Fn(r, a, i), ku(function() {
    return Nn(r, a, i);
  }), null;
}, jm = /* @__PURE__ */ Mn(function(e, t, r) {
  var a = e.css;
  typeof a == "string" && t.registered[a] !== void 0 && (a = t.registered[a]);
  var i = e[Uo], o = [a], n = "";
  typeof e.className == "string" ? n = bu(t.registered, o, e.className) : e.className != null && (n = e.className + " ");
  var l = Ln(o, void 0, re.useContext(Bn));
  n += t.key + "-" + l.name;
  var s = {};
  for (var d in e)
    Kn.call(e, d) && d !== "css" && d !== Uo && (s[d] = e[d]);
  return s.className = n, r && (s.ref = r), /* @__PURE__ */ re.createElement(re.Fragment, null, /* @__PURE__ */ re.createElement(Wm, {
    cache: t,
    serialized: l,
    isStringTag: typeof i == "string"
  }), /* @__PURE__ */ re.createElement(i, s));
}), Vm = jm, ls = function(t, r) {
  var a = arguments;
  if (r == null || !Kn.call(r, "css"))
    return re.createElement.apply(void 0, a);
  var i = a.length, o = new Array(i);
  o[0] = Vm, o[1] = Km(t, r);
  for (var n = 2; n < i; n++)
    o[n] = a[n];
  return re.createElement.apply(null, o);
};
(function(e) {
  var t;
  t || (t = e.JSX || (e.JSX = {}));
})(ls || (ls = {}));
var ss = /* @__PURE__ */ Mn(function(e, t) {
  var r = e.styles, a = Ln([r], void 0, re.useContext(Bn)), i = re.useRef();
  return ns(function() {
    var o = t.key + "-global", n = new t.sheet.constructor({
      key: o,
      nonce: t.sheet.nonce,
      container: t.sheet.container,
      speedy: t.sheet.isSpeedy
    }), l = !1, s = document.querySelector('style[data-emotion="' + o + " " + a.name + '"]');
    return t.sheet.tags.length && (n.before = t.sheet.tags[0]), s !== null && (l = !0, s.setAttribute("data-emotion", o), n.hydrate([s])), i.current = [n, l], function() {
      n.flush();
    };
  }, [t]), ns(function() {
    var o = i.current, n = o[0], l = o[1];
    if (l) {
      o[1] = !1;
      return;
    }
    if (a.next !== void 0 && Nn(t, a.next, !0), n.tags.length) {
      var s = n.tags[n.tags.length - 1].nextElementSibling;
      n.before = s, n.flush();
    }
    t.insert("", a, n, !1);
  }, [t, a.name]), null;
});
function Hm(e, t) {
  if (e != null) {
    if (typeof e == "function") {
      e(t);
      return;
    }
    try {
      e.current = t;
    } catch {
      throw new Error(`Cannot assign value '${t}' to ref '${e}'`);
    }
  }
}
function Cr(...e) {
  return (t) => {
    e.forEach((r) => {
      Hm(r, t);
    });
  };
}
function ta(e) {
  const t = Object.assign({}, e);
  for (let r in t)
    t[r] === void 0 && delete t[r];
  return t;
}
function Um(e) {
  return e.default || e;
}
const ot = (e) => e != null && typeof e == "object" && !Array.isArray(e), Gm = (e) => /^var\(--.+\)$/.test(e), Nt = (e) => typeof e == "string", Su = (e) => typeof e == "function";
function Ym(e) {
  var r;
  const t = re.version;
  return !Nt(t) || t.startsWith("18.") ? e == null ? void 0 : e.ref : (r = e == null ? void 0 : e.props) == null ? void 0 : r.ref;
}
const [qm, Wa] = Ea({
  name: "ChakraContext",
  strict: !0,
  providerName: "<ChakraProvider />"
});
function Xm(e) {
  const { value: t, children: r } = e;
  return /* @__PURE__ */ C.jsxs(qm, { value: t, children: [
    !t._config.disableLayers && /* @__PURE__ */ C.jsx(ss, { styles: t.layers.atRule }),
    /* @__PURE__ */ C.jsx(ss, { styles: t._global }),
    r
  ] });
}
const qr = (e, t) => {
  const r = Object.getOwnPropertyDescriptors(e), a = Object.keys(r), i = (n) => {
    const l = {};
    for (let s = 0; s < n.length; s++) {
      const d = n[s];
      r[d] && (Object.defineProperty(l, d, r[d]), delete r[d]);
    }
    return l;
  }, o = (n) => i(Array.isArray(n) ? n : a.filter(n));
  return [t].map(o).concat(i(a));
}, Zm = /* @__PURE__ */ new Set([
  "htmlWidth",
  "htmlHeight",
  "htmlSize",
  "htmlTranslate"
]);
function Jm(e) {
  return typeof e == "string" && Zm.has(e);
}
function Qm(e, t, r) {
  const { css: a, isValidProperty: i } = Wa(), { children: o, ...n } = e, l = G(() => {
    const [u, f] = qr(
      n,
      (x) => r(x, t.variantKeys)
    ), [g, v] = qr(
      f,
      t.variantKeys
    ), [b, m] = qr(v, i);
    return {
      forwardedProps: u,
      variantProps: g,
      styleProps: b,
      elementProps: m
    };
  }, [t.variantKeys, r, n, i]), { css: s, ...d } = l.styleProps, c = G(() => {
    const u = { ...l.variantProps };
    return t.variantKeys.includes("colorPalette") || (u.colorPalette = n.colorPalette), t.variantKeys.includes("orientation") || (u.orientation = n.orientation), t(u);
  }, [t, l.variantProps, n.colorPalette, n.orientation]);
  return {
    styles: G(() => a(c, ...e1(s), d), [a, c, s, d]),
    props: {
      ...l.forwardedProps,
      ...l.elementProps,
      children: o
    }
  };
}
const e1 = (e) => (Array.isArray(e) ? e : [e]).filter(Boolean).flat(), t1 = Um(su), r1 = t1, a1 = (e) => e !== "theme", i1 = (e, t, r) => {
  let a;
  if (t) {
    const i = t.shouldForwardProp;
    a = e.__emotion_forwardProp && i ? (o) => e.__emotion_forwardProp(o) && i(o) : i;
  }
  return typeof a != "function" && r && (a = e.__emotion_forwardProp), a;
};
let o1 = typeof document < "u";
const ds = ({ cache: e, serialized: t, isStringTag: r }) => {
  Fn(e, t, r);
  const a = ku(
    () => Nn(e, t, r)
  );
  if (!o1 && a !== void 0) {
    let i = t.name, o = t.next;
    for (; o !== void 0; )
      i = lt(i, o.name), o = o.next;
    return /* @__PURE__ */ C.jsx(
      "style",
      {
        "data-emotion": lt(e.key, i),
        dangerouslySetInnerHTML: { __html: a },
        nonce: e.sheet.nonce
      }
    );
  }
  return null;
}, n1 = (e, t = {}, r = {}) => {
  if (process.env.NODE_ENV !== "production" && e === void 0)
    throw new Error(
      `You are trying to create a styled element with an undefined component.
You may have forgotten to import it.`
    );
  const a = e.__emotion_real === e, i = a && e.__emotion_base || e;
  let o, n;
  r !== void 0 && (o = r.label, n = r.target);
  let l = [];
  const s = Mn((d, c, h) => {
    var E;
    const { cva: u, isValidProperty: f } = Wa(), g = t.__cva__ ? t : u(t), v = s1(e.__emotion_cva, g), b = (F) => (W, H) => F.includes(W) ? !0 : !(H != null && H.includes(W)) && !f(W);
    !r.shouldForwardProp && r.forwardProps && (r.shouldForwardProp = b(r.forwardProps));
    const m = (F, W) => {
      const H = typeof e == "string" && e.charCodeAt(0) > 96 ? r1 : a1, R = !(W != null && W.includes(F)) && !f(F);
      return H(F) && R;
    }, x = i1(e, r, a) || m, S = re.useMemo(
      () => Object.assign({}, r.defaultProps, ta(d)),
      [d]
    ), { props: T, styles: k } = Qm(
      S,
      v,
      x
    );
    let $ = "", D = [k], p = T;
    if (T.theme == null) {
      p = {};
      for (let F in T)
        p[F] = T[F];
      p.theme = re.useContext(Bn);
    }
    typeof T.className == "string" ? $ = bu(
      c.registered,
      D,
      T.className
    ) : T.className != null && ($ = lt($, T.className));
    const w = Ln(
      l.concat(D),
      c.registered,
      p
    );
    $ = lt($, `${c.key}-${w.name}`), n !== void 0 && ($ = lt($, n));
    const I = !x("as");
    let P = I && T.as || i, O = {};
    for (let F in T)
      if (!(I && F === "as")) {
        if (Jm(F)) {
          const W = F.replace("html", "").toLowerCase();
          O[W] = T[F];
          continue;
        }
        x(F) && (O[F] = T[F]);
      }
    O.className = $.trim(), O.ref = h;
    const _ = r.forwardAsChild || ((E = r.forwardProps) == null ? void 0 : E.includes("asChild"));
    if (T.asChild && !_) {
      const F = re.Children.only(T.children);
      P = F.type, O.children = null, Reflect.deleteProperty(O, "asChild"), O = $i(O, F.props), O.ref = Cr(h, Ym(F));
    }
    return O.as && _ ? (O.as = void 0, /* @__PURE__ */ C.jsxs(re.Fragment, { children: [
      /* @__PURE__ */ C.jsx(
        ds,
        {
          cache: c,
          serialized: w,
          isStringTag: typeof P == "string"
        }
      ),
      /* @__PURE__ */ C.jsx(P, { asChild: !0, ...O, children: /* @__PURE__ */ C.jsx(T.as, { children: O.children }) })
    ] })) : /* @__PURE__ */ C.jsxs(re.Fragment, { children: [
      /* @__PURE__ */ C.jsx(
        ds,
        {
          cache: c,
          serialized: w,
          isStringTag: typeof P == "string"
        }
      ),
      /* @__PURE__ */ C.jsx(P, { ...O })
    ] });
  });
  return s.displayName = o !== void 0 ? o : `chakra(${typeof i == "string" ? i : i.displayName || i.name || "Component"})`, s.__emotion_real = s, s.__emotion_base = i, s.__emotion_forwardProp = r.shouldForwardProp, s.__emotion_cva = t, Object.defineProperty(s, "toString", {
    value() {
      return n === void 0 && process.env.NODE_ENV !== "production" ? "NO_COMPONENT_SELECTOR" : `.${n}`;
    }
  }), s;
}, ho = n1.bind(), fo = /* @__PURE__ */ new Map(), l1 = new Proxy(ho, {
  apply(e, t, r) {
    return ho(...r);
  },
  get(e, t) {
    return fo.has(t) || fo.set(t, ho(t)), fo.get(t);
  }
}), Ve = l1, s1 = (e, t) => e && !t ? e : !e && t ? t : e.merge(t);
function wu(e) {
  const { key: t, recipe: r } = e, a = Wa();
  return G(() => {
    const i = r || (t != null ? a.getRecipe(t) : {});
    return a.cva(structuredClone(i));
  }, [t, r, a]);
}
const d1 = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function ct(e) {
  const { key: t, recipe: r } = e, a = d1(
    t || r.className || "Component"
  ), [i, o] = Ea({
    strict: !1,
    name: `${a}PropsContext`,
    providerName: `${a}PropsContext`
  });
  function n(d) {
    const { unstyled: c, ...h } = d, u = wu({
      key: t,
      recipe: h.recipe || r
    }), [f, g] = u.splitVariantProps(h);
    return {
      styles: c ? Zv : u(f),
      className: u.className,
      props: g
    };
  }
  const l = (d, c) => {
    const h = Ve(d, {}, c), u = V((f, g) => {
      const v = $i(o(), f), { styles: b, className: m, props: x } = n(v);
      return /* @__PURE__ */ C.jsx(
        h,
        {
          ...x,
          ref: g,
          css: [b, v.css],
          className: lt(m, v.className)
        }
      );
    });
    return u.displayName = d.displayName || d.name, u;
  };
  function s() {
    return i;
  }
  return {
    withContext: l,
    PropsProvider: i,
    withPropsProvider: s,
    usePropsContext: o,
    useRecipeResult: n
  };
}
const $u = V(
  function(t, r) {
    const {
      templateAreas: a,
      column: i,
      row: o,
      autoFlow: n,
      autoRows: l,
      templateRows: s,
      autoColumns: d,
      templateColumns: c,
      inline: h,
      ...u
    } = t;
    return /* @__PURE__ */ C.jsx(
      Ve.div,
      {
        ...u,
        ref: r,
        css: [
          {
            display: h ? "inline-grid" : "grid",
            gridTemplateAreas: a,
            gridAutoColumns: d,
            gridColumn: i,
            gridRow: o,
            gridAutoFlow: n,
            gridAutoRows: l,
            gridTemplateRows: s,
            gridTemplateColumns: c
          },
          t.css
        ]
      }
    );
  }
);
var cs = (e) => Math.max(0, Math.min(1, e)), c1 = (e, t) => e.map((r, a) => e[(Math.max(t, 0) + a) % e.length]), Gi = (e) => typeof e == "object" && e !== null, u1 = 2147483647, h1 = 1, f1 = 9, g1 = 11, Je = (e) => Gi(e) && e.nodeType === h1 && typeof e.nodeName == "string", Wn = (e) => Gi(e) && e.nodeType === f1, p1 = (e) => Gi(e) && e === e.window, Eu = (e) => Je(e) ? e.localName || "" : "#document";
function v1(e) {
  return ["html", "body", "#document"].includes(Eu(e));
}
var m1 = (e) => Gi(e) && e.nodeType !== void 0, Aa = (e) => m1(e) && e.nodeType === g1 && "host" in e, b1 = (e) => Je(e) && e.localName === "input", y1 = (e) => Je(e) ? e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0 : !1, x1 = /(textarea|select)/;
function k1(e) {
  if (e == null || !Je(e)) return !1;
  try {
    return b1(e) && e.selectionStart != null || x1.test(e.localName) || e.isContentEditable || e.getAttribute("contenteditable") === "true" || e.getAttribute("contenteditable") === "";
  } catch {
    return !1;
  }
}
function Pi(e, t) {
  var a;
  if (!e || !t || !Je(e) || !Je(t)) return !1;
  const r = (a = t.getRootNode) == null ? void 0 : a.call(t);
  if (e === t || e.contains(t)) return !0;
  if (r && Aa(r)) {
    let i = t;
    for (; i; ) {
      if (e === i) return !0;
      i = i.parentNode || i.host;
    }
  }
  return !1;
}
function Zt(e) {
  return Wn(e) ? e : p1(e) ? e.document : (e == null ? void 0 : e.ownerDocument) ?? document;
}
function _1(e) {
  return Zt(e).documentElement;
}
function ra(e) {
  var t;
  return Aa(e) ? ra(e.host) : Wn(e) ? e.defaultView ?? window : Je(e) ? ((t = e.ownerDocument) == null ? void 0 : t.defaultView) ?? window : window;
}
function Pu(e) {
  let t = e.activeElement;
  for (; t != null && t.shadowRoot; ) {
    const r = t.shadowRoot.activeElement;
    if (r === t) break;
    t = r;
  }
  return t;
}
function S1(e) {
  if (Eu(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || Aa(e) && e.host || _1(e);
  return Aa(t) ? t.host : t;
}
var go = /* @__PURE__ */ new WeakMap();
function w1(e) {
  return go.has(e) || go.set(e, ra(e).getComputedStyle(e)), go.get(e);
}
var Cu = () => typeof document < "u";
function $1() {
  const e = navigator.userAgentData;
  return (e == null ? void 0 : e.platform) ?? navigator.platform;
}
var jn = (e) => Cu() && e.test($1()), E1 = (e) => Cu() && e.test(navigator.vendor), P1 = () => jn(/^Mac/), C1 = () => T1() && E1(/apple/i), T1 = () => jn(/mac|iphone|ipad|ipod/i), I1 = () => jn(/iP(hone|ad|od)|iOS/);
function R1(e) {
  var t, r, a;
  return ((t = e.composedPath) == null ? void 0 : t.call(e)) ?? ((a = (r = e.nativeEvent) == null ? void 0 : r.composedPath) == null ? void 0 : a.call(r));
}
function or(e) {
  const t = R1(e);
  return (t == null ? void 0 : t[0]) ?? e.target;
}
var D1 = (e) => e.button === 2 || P1() && e.ctrlKey && e.button === 0, zt = (e, t, r, a) => {
  const i = typeof e == "function" ? e() : e;
  return i == null || i.addEventListener(t, r, a), () => {
    i == null || i.removeEventListener(t, r, a);
  };
};
function A1(e, t) {
  const { type: r = "HTMLInputElement", property: a = "value" } = t, i = ra(e)[r].prototype;
  return Object.getOwnPropertyDescriptor(i, a) ?? {};
}
function z1(e) {
  if (e.localName === "input") return "HTMLInputElement";
  if (e.localName === "textarea") return "HTMLTextAreaElement";
  if (e.localName === "select") return "HTMLSelectElement";
}
function Tu(e, t, r = "value") {
  var i;
  const a = z1(e);
  a && ((i = A1(e, { type: a, property: r }).set) == null || i.call(e, t)), e.setAttribute(r, t);
}
function Iu(e, t) {
  const { value: r, bubbles: a = !0 } = t;
  if (!e) return;
  const i = ra(e);
  e instanceof i.HTMLInputElement && (Tu(e, `${r}`), e.dispatchEvent(new i.Event("input", { bubbles: a })));
}
var Ru = (e) => Je(e) && e.tagName === "IFRAME", O1 = (e) => !Number.isNaN(parseInt(e.getAttribute("tabindex") || "0", 10)), F1 = (e) => parseInt(e.getAttribute("tabindex") || "0", 10) < 0, Vn = "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], button:not([disabled]), [tabindex], iframe, object, embed, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false']), details > summary:first-of-type", Hn = (e, t = !1) => {
  if (!e) return [];
  const r = Array.from(e.querySelectorAll(Vn));
  (t == !0 || t == "if-empty" && r.length === 0) && Je(e) && cr(e) && r.unshift(e);
  const i = r.filter(cr);
  return i.forEach((o, n) => {
    if (Ru(o) && o.contentDocument) {
      const l = o.contentDocument.body;
      i.splice(n, 1, ...Hn(l));
    }
  }), i;
};
function cr(e) {
  return !e || e.closest("[inert]") ? !1 : e.matches(Vn) && y1(e);
}
function Du(e, t) {
  if (!e) return [];
  const a = Array.from(e.querySelectorAll(Vn)).filter(yr);
  return a.forEach((i, o) => {
    if (Ru(i) && i.contentDocument) {
      const n = i.contentDocument.body, l = Du(n);
      a.splice(o, 1, ...l);
    }
  }), a.length, a;
}
function yr(e) {
  return e != null && e.tabIndex > 0 ? !0 : cr(e) && !F1(e);
}
function ga(e) {
  return e.tabIndex < 0 && (/^(audio|video|details)$/.test(e.localName) || k1(e)) && !O1(e) ? 0 : e.tabIndex;
}
function Sr(e) {
  const t = globalThis.requestAnimationFrame(e);
  return () => {
    globalThis.cancelAnimationFrame(t);
  };
}
function Go(e) {
  const t = S1(e);
  return v1(t) ? Zt(t).body : Je(t) && L1(t) ? t : Go(t);
}
var N1 = /auto|scroll|overlay|hidden|clip/;
function L1(e) {
  const t = ra(e), { overflow: r, overflowX: a, overflowY: i, display: o } = t.getComputedStyle(e);
  return N1.test(r + i + a) && !["inline", "contents"].includes(o);
}
function Yo(e, t) {
  const { left: r, top: a, width: i, height: o } = t.getBoundingClientRect(), n = { x: e.x - r, y: e.y - a }, l = { x: cs(n.x / i), y: cs(n.y / o) };
  function s(d = {}) {
    const { dir: c = "ltr", orientation: h = "horizontal", inverted: u } = d, f = typeof u == "object" ? u.x : u, g = typeof u == "object" ? u.y : u;
    return h === "horizontal" ? c === "rtl" || f ? 1 - l.x : l.x : g ? 1 - l.y : l.y;
  }
  return { offset: n, percent: l, getPercentValue: s };
}
function Ht(e, t) {
  return Array.from((e == null ? void 0 : e.querySelectorAll(t)) ?? []);
}
function M1(e, t) {
  return (e == null ? void 0 : e.querySelector(t)) ?? null;
}
var Un = (e) => e.id;
function B1(e, t, r = Un) {
  return e.find((a) => r(a) === t);
}
function Gn(e, t, r = Un) {
  const a = B1(e, t, r);
  return a ? e.indexOf(a) : -1;
}
function Au(e, t, r = !0) {
  let a = Gn(e, t);
  return a = r ? (a + 1) % e.length : Math.min(a + 1, e.length - 1), e[a];
}
function zu(e, t, r = !0) {
  let a = Gn(e, t);
  return a === -1 ? r ? e[e.length - 1] : null : (a = r ? (a - 1 + e.length) % e.length : Math.max(0, a - 1), e[a]);
}
function Re(e) {
  const t = {
    getRootNode: (r) => {
      var a;
      return ((a = r.getRootNode) == null ? void 0 : a.call(r)) ?? document;
    },
    getDoc: (r) => Zt(t.getRootNode(r)),
    getWin: (r) => t.getDoc(r).defaultView ?? window,
    getActiveElement: (r) => Pu(t.getRootNode(r)),
    isActiveElement: (r, a) => a === t.getActiveElement(r),
    getById: (r, a) => t.getRootNode(r).getElementById(a),
    setValue: (r, a) => {
      r == null || a == null || Tu(r, a.toString());
    }
  };
  return { ...t, ...e };
}
var K1 = (e) => e.split("").map((t) => {
  const r = t.charCodeAt(0);
  return r > 0 && r < 128 ? t : r >= 128 && r <= 255 ? `/x${r.toString(16)}`.replace("/", "\\") : "";
}).join("").trim(), W1 = (e) => {
  var t;
  return K1(((t = e.dataset) == null ? void 0 : t.valuetext) ?? e.textContent ?? "");
}, j1 = (e, t) => e.trim().toLowerCase().startsWith(t.toLowerCase());
function V1(e, t, r, a = Un) {
  const i = r ? Gn(e, r, a) : -1;
  let o = r ? c1(e, i) : e;
  return t.length === 1 && (o = o.filter((l) => a(l) !== r)), o.find((l) => j1(W1(l), t));
}
var po = /* @__PURE__ */ new WeakMap();
function H1(e, t, r) {
  po.has(e) || po.set(e, /* @__PURE__ */ new Map());
  const a = po.get(e), i = a.get(t);
  if (!i)
    return a.set(t, r()), () => {
      var l;
      (l = a.get(t)) == null || l(), a.delete(t);
    };
  const o = r(), n = () => {
    o(), i(), a.delete(t);
  };
  return a.set(t, n), () => {
    a.get(t) === n && (o(), a.set(t, i));
  };
}
function U1(e, t) {
  return e ? H1(e, "style", () => {
    const a = e.style.cssText;
    return Object.assign(e.style, t), () => {
      e.style.cssText = a;
    };
  }) : () => {
  };
}
function G1(e, t) {
  const { state: r, activeId: a, key: i, timeout: o = 350, itemToId: n } = t, l = r.keysSoFar + i, d = l.length > 1 && Array.from(l).every((g) => g === l[0]) ? l[0] : l;
  let c = e.slice();
  const h = V1(c, d, a, n);
  function u() {
    clearTimeout(r.timer), r.timer = -1;
  }
  function f(g) {
    r.keysSoFar = g, u(), g !== "" && (r.timer = +setTimeout(() => {
      f(""), u();
    }, o));
  }
  return f(l), h;
}
var Y1 = /* @__PURE__ */ Object.assign(G1, {
  defaultOptions: { keysSoFar: "", timer: -1 },
  isValidEvent: q1
});
function q1(e) {
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey;
}
var X1 = 1e3 / 60;
function Z1(e, t) {
  const r = e();
  if (Je(r) && r.isConnected)
    return t(r), () => {
    };
  {
    const a = setInterval(() => {
      const i = e();
      Je(i) && i.isConnected && (t(i), clearInterval(a));
    }, X1);
    return () => clearInterval(a);
  }
}
function J1(e, t) {
  const r = [];
  return e == null || e.forEach((a) => {
    const i = Z1(a, t);
    r.push(i);
  }), () => {
    r.forEach((a) => a());
  };
}
function Q1(e, t) {
  return `${e} returned \`undefined\`. Seems you forgot to wrap component within ${t}`;
}
function aa(e = {}) {
  const {
    name: t,
    strict: r = !0,
    hookName: a = "useContext",
    providerName: i = "Provider",
    errorMessage: o,
    defaultValue: n
  } = e, l = ae(n);
  l.displayName = t;
  function s() {
    var c;
    const d = Q(l);
    if (!d && r) {
      const h = new Error(o ?? Q1(a, i));
      throw h.name = "ContextError", (c = Error.captureStackTrace) == null || c.call(Error, h, s), h;
    }
    return d;
  }
  return [l.Provider, s, l];
}
const [Uw, eb] = aa({
  name: "LocaleContext",
  hookName: "useLocaleContext",
  providerName: "<LocaleProvider />",
  strict: !1,
  defaultValue: { dir: "ltr", locale: "en-US" }
});
function tb(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function Yn(...e) {
  return (t) => {
    for (const r of e)
      tb(r, t);
  };
}
const rb = Symbol(), qn = Symbol(), _a = "a", Ou = "f", us = "p", Fu = "c", Nu = "t", Lu = "h", mi = "w", Mu = "o", Bu = "k";
let ab = (e, t) => new Proxy(e, t);
const qo = Object.getPrototypeOf, Xo = /* @__PURE__ */ new WeakMap(), Ku = (e) => e && (Xo.has(e) ? Xo.get(e) : qo(e) === Object.prototype || qo(e) === Array.prototype), hs = (e) => typeof e == "object" && e !== null, ib = (e) => Object.values(Object.getOwnPropertyDescriptors(e)).some((t) => !t.configurable && !t.writable), ob = (e) => {
  if (Array.isArray(e))
    return Array.from(e);
  const t = Object.getOwnPropertyDescriptors(e);
  return Object.values(t).forEach((r) => {
    r.configurable = !0;
  }), Object.create(qo(e), t);
}, nb = (e, t) => {
  const r = {
    [Ou]: t
  };
  let a = !1;
  const i = (l, s) => {
    if (!a) {
      let d = r[_a].get(e);
      if (d || (d = {}, r[_a].set(e, d)), l === mi)
        d[mi] = !0;
      else {
        let c = d[l];
        c || (c = /* @__PURE__ */ new Set(), d[l] = c), c.add(s);
      }
    }
  }, o = () => {
    a = !0, r[_a].delete(e);
  }, n = {
    get(l, s) {
      return s === qn ? e : (i(Bu, s), ju(Reflect.get(l, s), r[_a], r[Fu], r[Nu]));
    },
    has(l, s) {
      return s === rb ? (o(), !0) : (i(Lu, s), Reflect.has(l, s));
    },
    getOwnPropertyDescriptor(l, s) {
      return i(Mu, s), Reflect.getOwnPropertyDescriptor(l, s);
    },
    ownKeys(l) {
      return i(mi), Reflect.ownKeys(l);
    }
  };
  return t && (n.set = n.deleteProperty = () => !1), [n, r];
}, Wu = (e) => (
  // unwrap proxy
  e[qn] || // otherwise
  e
), ju = (e, t, r, a) => {
  if (!Ku(e))
    return e;
  let i = a && a.get(e);
  if (!i) {
    const s = Wu(e);
    ib(s) ? i = [s, ob(s)] : i = [s], a == null || a.set(e, i);
  }
  const [o, n] = i;
  let l = r && r.get(o);
  return (!l || l[1][Ou] !== !!n) && (l = nb(o, !!n), l[1][us] = ab(n || o, l[0]), r && r.set(o, l)), l[1][_a] = t, l[1][Fu] = r, l[1][Nu] = a, l[1][us];
}, lb = (e, t) => {
  const r = Reflect.ownKeys(e), a = Reflect.ownKeys(t);
  return r.length !== a.length || r.some((i, o) => i !== a[o]);
}, Vu = (e, t, r, a, i = Object.is) => {
  if (i(e, t))
    return !1;
  if (!hs(e) || !hs(t))
    return !0;
  const o = r.get(Wu(e));
  if (!o)
    return !0;
  if (a) {
    if (a.get(e) === t)
      return !1;
    a.set(e, t);
  }
  let n = null;
  for (const l of o[Lu] || [])
    if (n = Reflect.has(e, l) !== Reflect.has(t, l), n)
      return n;
  if (o[mi] === !0) {
    if (n = lb(e, t), n)
      return n;
  } else
    for (const l of o[Mu] || []) {
      const s = !!Reflect.getOwnPropertyDescriptor(e, l), d = !!Reflect.getOwnPropertyDescriptor(t, l);
      if (n = s !== d, n)
        return n;
    }
  for (const l of o[Bu] || [])
    if (n = Vu(e[l], t[l], r, a, i), n)
      return n;
  if (n === null)
    throw new Error("invalid used");
  return n;
}, sb = (e) => Ku(e) && e[qn] || null, fs = (e, t = !0) => {
  Xo.set(e, t);
};
function db() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof self < "u") return self;
  if (typeof window < "u") return window;
  if (typeof global < "u") return global;
}
function Xn(e, t) {
  const r = db();
  return r ? (r[e] || (r[e] = t()), r[e]) : t();
}
var Pa = Xn("__zag__refSet", () => /* @__PURE__ */ new WeakSet()), cb = (e) => typeof e == "object" && e !== null && "$$typeof" in e && "props" in e, ub = (e) => typeof e == "object" && e !== null && "__v_isVNode" in e, hb = (e) => typeof e == "object" && e !== null && "nodeType" in e && typeof e.nodeName == "string", fb = (e) => cb(e) || ub(e) || hb(e), Zo = (e) => e !== null && typeof e == "object", Jo = (e) => Zo(e) && !Pa.has(e) && (Array.isArray(e) || !(Symbol.iterator in e)) && !fb(e) && !(e instanceof WeakMap) && !(e instanceof WeakSet) && !(e instanceof Error) && !(e instanceof Number) && !(e instanceof Date) && !(e instanceof String) && !(e instanceof RegExp) && !(e instanceof ArrayBuffer) && !(e instanceof Promise), Ci = () => process.env.NODE_ENV !== "production";
function gs(e, t, r) {
  typeof r.value == "object" && !Jo(r.value) && (r.value = kr(r.value)), !r.enumerable || r.get || r.set || !r.configurable || !r.writable || t === "__proto__" ? Object.defineProperty(e, t, r) : e[t] = r.value;
}
function kr(e) {
  if (typeof e != "object") return e;
  var t = 0, r, a, i, o = Object.prototype.toString.call(e);
  if (o === "[object Object]" ? i = Object.create(Object.getPrototypeOf(e) || null) : o === "[object Array]" ? i = Array(e.length) : o === "[object Set]" ? (i = /* @__PURE__ */ new Set(), e.forEach(function(n) {
    i.add(kr(n));
  })) : o === "[object Map]" ? (i = /* @__PURE__ */ new Map(), e.forEach(function(n, l) {
    i.set(kr(l), kr(n));
  })) : o === "[object Date]" ? i = /* @__PURE__ */ new Date(+e) : o === "[object RegExp]" ? i = new RegExp(e.source, e.flags) : o === "[object DataView]" ? i = new e.constructor(kr(e.buffer)) : o === "[object ArrayBuffer]" ? i = e.slice(0) : o === "[object Blob]" ? i = e.slice() : o.slice(-6) === "Array]" && (i = new e.constructor(e)), i) {
    for (a = Object.getOwnPropertySymbols(e); t < a.length; t++)
      gs(i, a[t], Object.getOwnPropertyDescriptor(e, a[t]));
    for (t = 0, a = Object.getOwnPropertyNames(e); t < a.length; t++)
      Object.hasOwnProperty.call(i, r = a[t]) && i[r] === e[r] || gs(i, r, Object.getOwnPropertyDescriptor(e, r));
  }
  return i || e;
}
var xr = Xn("__zag__proxyStateMap", () => /* @__PURE__ */ new WeakMap()), gb = (e = Object.is, t = (l, s) => new Proxy(l, s), r = /* @__PURE__ */ new WeakMap(), a = (l, s) => {
  const d = r.get(l);
  if ((d == null ? void 0 : d[0]) === s)
    return d[1];
  const c = Array.isArray(l) ? [] : Object.create(Object.getPrototypeOf(l));
  return fs(c, !0), r.set(l, [s, c]), Reflect.ownKeys(l).forEach((h) => {
    const u = Reflect.get(l, h);
    Pa.has(u) ? (fs(u, !1), c[h] = u) : xr.has(u) ? c[h] = nr(u) : c[h] = u;
  }), Object.freeze(c);
}, i = /* @__PURE__ */ new WeakMap(), o = [1, 1], n = (l) => {
  if (!Zo(l))
    throw new Error("object required");
  const s = i.get(l);
  if (s)
    return s;
  let d = o[0];
  const c = /* @__PURE__ */ new Set(), h = (D, p = ++o[0]) => {
    d !== p && (d = p, c.forEach((w) => w(D, p)));
  };
  let u = o[1];
  const f = (D = ++o[1]) => (u !== D && !c.size && (u = D, v.forEach(([p]) => {
    const w = p[1](D);
    w > d && (d = w);
  })), d), g = (D) => (p, w) => {
    const I = [...p];
    I[1] = [D, ...I[1]], h(I, w);
  }, v = /* @__PURE__ */ new Map(), b = (D, p) => {
    if (Ci() && v.has(D))
      throw new Error("prop listener already exists");
    if (c.size) {
      const w = p[3](g(D));
      v.set(D, [p, w]);
    } else
      v.set(D, [p]);
  }, m = (D) => {
    var w;
    const p = v.get(D);
    p && (v.delete(D), (w = p[1]) == null || w.call(p));
  }, x = (D) => (c.add(D), c.size === 1 && v.forEach(([w, I], P) => {
    if (Ci() && I)
      throw new Error("remove already exists");
    const O = w[3](g(P));
    v.set(P, [w, O]);
  }), () => {
    c.delete(D), c.size === 0 && v.forEach(([w, I], P) => {
      I && (I(), v.set(P, [w]));
    });
  }), S = Array.isArray(l) ? [] : Object.create(Object.getPrototypeOf(l)), k = t(S, {
    deleteProperty(D, p) {
      const w = Reflect.get(D, p);
      m(p);
      const I = Reflect.deleteProperty(D, p);
      return I && h(["delete", [p], w]), I;
    },
    set(D, p, w, I) {
      var E;
      const P = Reflect.has(D, p), O = Reflect.get(D, p, I);
      if (P && (e(O, w) || i.has(w) && e(O, i.get(w))))
        return !0;
      m(p), Zo(w) && (w = sb(w) || w);
      let _ = w;
      if (!((E = Object.getOwnPropertyDescriptor(D, p)) != null && E.set)) {
        !xr.has(w) && Jo(w) && (_ = Yi(w));
        const F = !Pa.has(_) && xr.get(_);
        F && b(p, F);
      }
      return Reflect.set(D, p, _, I), h(["set", [p], w, O]), !0;
    }
  });
  i.set(l, k);
  const $ = [S, f, a, x];
  return xr.set(k, $), Reflect.ownKeys(l).forEach((D) => {
    const p = Object.getOwnPropertyDescriptor(l, D);
    p.get || p.set ? Object.defineProperty(S, D, p) : k[D] = l[D];
  }), k;
}) => [
  // public functions
  n,
  // shared state
  xr,
  Pa,
  // internal things
  e,
  t,
  Jo,
  r,
  a,
  i,
  o
], [pb] = gb();
function Yi(e = {}) {
  return pb(e);
}
function Qo(e, t, r) {
  const a = xr.get(e);
  Ci() && !a && console.warn("Please use proxy object");
  let i;
  const o = [], n = a[3];
  let l = !1;
  const d = n((c) => {
    if (o.push(c), r) {
      t(o.splice(0));
      return;
    }
    i || (i = Promise.resolve().then(() => {
      i = void 0, l && t(o.splice(0));
    }));
  });
  return l = !0, () => {
    l = !1, d();
  };
}
function nr(e) {
  const t = xr.get(e);
  Ci() && !t && console.warn("Please use proxy object");
  const [r, a, i] = t;
  return i(r, a());
}
function Ti(e) {
  return Pa.add(e), e;
}
function vb(e, t) {
  Object.keys(t).forEach((i) => {
    if (Object.getOwnPropertyDescriptor(e, i))
      throw new Error("object property already defined");
    const o = t[i], { get: n, set: l } = typeof o == "function" ? { get: o } : o, s = {};
    s.get = () => n(nr(a)), l && (s.set = (d) => l(a, d)), Object.defineProperty(e, i, s);
  });
  const a = Yi(e);
  return a;
}
var Hu = (e) => e[0], Uu = (e) => e[e.length - 1];
function mb(e) {
  for (; e.length > 0; ) e.pop();
  return e;
}
var ps = (e, ...t) => (typeof e == "function" ? e(...t) : e) ?? void 0, Vt = (e) => e, bb = () => {
}, en = (...e) => (...t) => {
  e.forEach(function(r) {
    r == null || r(...t);
  });
}, vs = /* @__PURE__ */ (() => {
  let e = 0;
  return () => (e++, e.toString(36));
})(), yb = () => process.env.NODE_ENV !== "production", Ii = (e) => Array.isArray(e), Gu = (e) => e != null && typeof e == "object", bi = (e) => Gu(e) && !Ii(e), xb = (e) => typeof e == "number" && !Number.isNaN(e), bt = (e) => typeof e == "string", Ri = (e) => typeof e == "function", Yu = (e, t) => Object.prototype.hasOwnProperty.call(e, t), kb = (e) => Object.prototype.toString.call(e), qu = Function.prototype.toString, _b = qu.call(Object), Sb = (e) => {
  if (!Gu(e) || kb(e) != "[object Object]") return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null) return !0;
  const r = Yu(t, "constructor") && t.constructor;
  return typeof r == "function" && r instanceof r && qu.call(r) == _b;
}, { floor: wb, round: Xu, min: $b, max: Eb } = Math, Pb = (e) => Number.isNaN(e), Zn = (e) => Pb(e) ? 0 : e, Cb = (e, t) => (e % t + t) % t, Tb = (e, t, r) => Xu((Zn(e) - t) / r) * r + t, Ib = (e, t, r) => $b(Eb(Zn(e), t), r), Rb = (e, t, r) => (Zn(e) - t) / (r - t), Db = (e, t, r, a) => Ib(Tb(e * (r - t) + t, t, a), t, r), vo = (e, t) => typeof t == "number" ? wb(e * t + 0.5) / t : Xu(e), tn = (e, t) => {
  const [r, a] = e, [i, o] = t;
  return (n) => r === a || i === o ? i : i + (o - i) / (a - r) * (n - r);
};
function za(e) {
  if (!Ab(e) || e === void 0) return e;
  const t = Reflect.ownKeys(e).filter((a) => typeof a == "string"), r = {};
  for (const a of t) {
    const i = e[a];
    i !== void 0 && (r[a] = za(i));
  }
  return r;
}
var Ab = (e) => e && typeof e == "object" && e.constructor === Object;
function yi(...e) {
  const t = e.length === 1 ? e[0] : e[1];
  (e.length === 2 ? e[0] : !0) && process.env.NODE_ENV !== "production" && console.warn(t);
}
function xi(...e) {
  const t = e.length === 1 ? e[0] : e[1];
  if ((e.length === 2 ? e[0] : !0) && process.env.NODE_ENV !== "production")
    throw new Error(t);
}
var zb = Object.defineProperty, Ob = (e, t, r) => t in e ? zb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, j = (e, t, r) => Ob(e, typeof t != "symbol" ? t + "" : t, r);
function Zu(e, ...t) {
  for (const r of t) {
    const a = za(r);
    for (const i in a)
      Sb(r[i]) ? (e[i] || (e[i] = {}), Zu(e[i], r[i])) : e[i] = r[i];
  }
  return e;
}
function _t(e) {
  return bt(e) ? { type: e } : e;
}
function ar(e) {
  return e ? Ii(e) ? e.slice() : [e] : [];
}
function Ju(e) {
  return bi(e) && e.predicate != null;
}
var Fb = () => !0;
function Qu(e, t) {
  return e = e ?? Fb, (r, a, i) => {
    if (bt(e)) {
      const o = t[e];
      return Ri(o) ? o(r, a, i) : o;
    }
    return Ju(e) ? e.predicate(t)(r, a, i) : e == null ? void 0 : e(r, a, i);
  };
}
function mo(e, t) {
  return (r, a, i) => Ju(e) ? e.predicate(t)(r, a, i) : e;
}
function Nb(e) {
  var o, n;
  const t = e.computed ?? Vt({}), r = e.context ?? Vt({}), a = e.initial ? (n = (o = e.states) == null ? void 0 : o[e.initial]) == null ? void 0 : n.tags : [], i = Yi({
    value: e.initial ?? "",
    previousValue: "",
    event: Vt({}),
    previousEvent: Vt({}),
    context: vb(r, t),
    done: !1,
    tags: a ?? [],
    hasTag(l) {
      return this.tags.includes(l);
    },
    matches(...l) {
      return l.includes(this.value);
    },
    can(l) {
      return Vt(this).nextEvents.includes(l);
    },
    get nextEvents() {
      var d, c;
      const l = ((c = (d = e.states) == null ? void 0 : d[this.value]) == null ? void 0 : c.on) ?? {}, s = (e == null ? void 0 : e.on) ?? {};
      return Object.keys({ ...l, ...s });
    },
    get changed() {
      return this.event.value === "machine.init" || !this.previousValue ? !1 : this.value !== this.previousValue;
    }
  });
  return Vt(i);
}
function pa(e, t) {
  return (r, a) => {
    if (xb(e)) return e;
    if (Ri(e))
      return e(r, a);
    if (bt(e)) {
      const i = Number.parseFloat(e);
      if (!Number.isNaN(i))
        return i;
      if (t) {
        const o = t == null ? void 0 : t[e];
        return xi(
          o == null,
          `[@zag-js/core > determine-delay] Cannot determine delay for \`${e}\`. It doesn't exist in \`options.delays\``
        ), Ri(o) ? o(r, a) : o;
      }
    }
  };
}
function Lb(e) {
  return bt(e) ? { target: e } : e;
}
function Mb(e, t) {
  return (r, a, i) => ar(e).map(Lb).find((o) => Qu(o.guard, t)(r, a, i) ?? o.target ?? o.actions);
}
var Bb = class {
  // Let's get started!
  constructor(e, t) {
    var r, a, i, o, n;
    j(
      this,
      "status",
      "Not Started"
      /* NotStarted */
    ), j(this, "state"), j(this, "initialState"), j(this, "initialContext"), j(this, "id"), j(
      this,
      "type",
      "machine"
      /* Machine */
    ), j(this, "activityEvents", /* @__PURE__ */ new Map()), j(this, "delayedEvents", /* @__PURE__ */ new Map()), j(this, "stateListeners", /* @__PURE__ */ new Set()), j(this, "doneListeners", /* @__PURE__ */ new Set()), j(this, "contextWatchers", /* @__PURE__ */ new Set()), j(this, "removeStateListener", bb), j(this, "parent"), j(this, "children", /* @__PURE__ */ new Map()), j(this, "guardMap"), j(this, "actionMap"), j(this, "delayMap"), j(this, "activityMap"), j(this, "sync"), j(this, "options"), j(this, "config"), j(this, "_created", () => {
      if (!this.config.created) return;
      const l = _t(
        "machine.created"
        /* Created */
      );
      this.executeActions(this.config.created, l);
    }), j(this, "start", (l) => {
      if (this.state.value = "", this.state.tags = [], this.status === "Running")
        return this;
      this.status = "Running", this.removeStateListener = Qo(
        this.state,
        () => {
          this.stateListeners.forEach((f) => {
            f(this.stateSnapshot);
          });
        },
        this.sync
      ), this.setupContextWatchers(), this.executeActivities(
        _t(
          "machine.start"
          /* Start */
        ),
        ar(this.config.activities),
        "machine.start"
        /* Start */
      ), this.executeActions(this.config.entry, _t(
        "machine.start"
        /* Start */
      ));
      const s = _t(
        "machine.init"
        /* Init */
      ), d = bi(l) ? l.value : l, c = bi(l) ? l.context : void 0;
      c && this.setContext(c);
      const h = {
        target: d ?? this.config.initial
      }, u = this.getNextStateInfo(h, s);
      return this.initialState = u, this.performStateChangeEffects(this.state.value, u, s), this;
    }), j(this, "setupContextWatchers", () => {
      const { watch: l } = this.config;
      if (!l) return;
      let s = nr(this.state.context);
      const d = Qo(this.state.context, () => {
        var h;
        const c = nr(this.state.context);
        for (const [u, f] of Object.entries(l))
          (((h = this.options.compareFns) == null ? void 0 : h[u]) ?? Object.is)(s[u], c[u]) || this.executeActions(f, this.state.event);
        s = c;
      });
      this.contextWatchers.add(d);
    }), j(this, "stop", () => {
      if (this.status !== "Stopped")
        return this.performExitEffects(this.state.value, _t(
          "machine.stop"
          /* Stop */
        )), this.executeActions(this.config.exit, _t(
          "machine.stop"
          /* Stop */
        )), this.setState(""), this.setEvent(
          "machine.stop"
          /* Stop */
        ), this.stopStateListeners(), this.stopChildren(), this.stopActivities(), this.stopDelayedEvents(), this.stopContextWatchers(), this.status = "Stopped", this;
    }), j(this, "stopStateListeners", () => {
      this.removeStateListener(), this.stateListeners.clear();
    }), j(this, "stopContextWatchers", () => {
      this.contextWatchers.forEach((l) => l()), this.contextWatchers.clear();
    }), j(this, "stopDelayedEvents", () => {
      this.delayedEvents.forEach((l) => {
        l.forEach((s) => s());
      }), this.delayedEvents.clear();
    }), j(this, "stopActivities", (l) => {
      var s, d;
      l ? ((s = this.activityEvents.get(l)) == null || s.forEach((c) => c()), (d = this.activityEvents.get(l)) == null || d.clear(), this.activityEvents.delete(l)) : (this.activityEvents.forEach((c) => {
        c.forEach((h) => h()), c.clear();
      }), this.activityEvents.clear());
    }), j(this, "sendChild", (l, s) => {
      const d = _t(l), c = ps(s, this.contextSnapshot), h = this.children.get(c);
      h || xi(`[@zag-js/core] Cannot send '${d.type}' event to unknown child`), h.send(d);
    }), j(this, "stopChild", (l) => {
      this.children.has(l) || xi(`[@zag-js/core > stop-child] Cannot stop unknown child ${l}`), this.children.get(l).stop(), this.children.delete(l);
    }), j(this, "removeChild", (l) => {
      this.children.delete(l);
    }), j(this, "stopChildren", () => {
      this.children.forEach((l) => l.stop()), this.children.clear();
    }), j(this, "setParent", (l) => {
      this.parent = l;
    }), j(this, "spawn", (l, s) => {
      const d = ps(l);
      return s && (d.id = s), d.type = "machine.actor", d.setParent(this), this.children.set(d.id, Vt(d)), d.onDone(() => {
        this.removeChild(d.id);
      }).start(), Vt(Ti(d));
    }), j(this, "stopActivity", (l) => {
      var d;
      if (!this.state.value) return;
      const s = this.activityEvents.get(this.state.value);
      (d = s == null ? void 0 : s.get(l)) == null || d(), s == null || s.delete(l);
    }), j(this, "addActivityCleanup", (l, s, d) => {
      var c;
      l && (this.activityEvents.has(l) ? (c = this.activityEvents.get(l)) == null || c.set(s, d) : this.activityEvents.set(l, /* @__PURE__ */ new Map([[s, d]])));
    }), j(this, "setState", (l) => {
      this.state.previousValue = this.state.value, this.state.value = l;
      const s = this.getStateNode(l);
      l == null ? mb(this.state.tags) : this.state.tags = ar(s == null ? void 0 : s.tags);
    }), j(this, "setContext", (l) => {
      l && Zu(this.state.context, za(l));
    }), j(this, "setOptions", (l) => {
      const s = za(l);
      this.actionMap = { ...this.actionMap, ...s.actions }, this.delayMap = { ...this.delayMap, ...s.delays }, this.activityMap = { ...this.activityMap, ...s.activities }, this.guardMap = { ...this.guardMap, ...s.guards };
    }), j(this, "getStateNode", (l) => {
      var s;
      if (l)
        return (s = this.config.states) == null ? void 0 : s[l];
    }), j(this, "getNextStateInfo", (l, s) => {
      const d = this.determineTransition(l, s), c = !(d != null && d.target), h = (d == null ? void 0 : d.target) ?? this.state.value, u = this.state.value !== h, f = this.getStateNode(h), v = {
        reenter: !c && !u && !(d != null && d.internal),
        transition: d,
        stateNode: f,
        target: h,
        changed: u
      };
      return this.log("NextState:", `[${s.type}]`, this.state.value, "---->", v.target), v;
    }), j(this, "getAfterActions", (l, s) => {
      let d;
      const c = this.state.value;
      return {
        entry: () => {
          d = globalThis.setTimeout(() => {
            const h = this.getNextStateInfo(l, this.state.event);
            this.performStateChangeEffects(c, h, this.state.event);
          }, s);
        },
        exit: () => {
          globalThis.clearTimeout(d);
        }
      };
    }), j(this, "getDelayedEventActions", (l) => {
      const s = this.getStateNode(l), d = this.state.event;
      if (!s || !s.after) return;
      const c = [], h = [];
      if (Ii(s.after)) {
        const u = this.determineTransition(s.after, d);
        if (!u) return;
        if (!Yu(u, "delay"))
          throw new Error(`[@zag-js/core > after] Delay is required for after transition: ${JSON.stringify(u)}`);
        const g = pa(u.delay, this.delayMap)(this.contextSnapshot, d), v = this.getAfterActions(u, g);
        return c.push(v.entry), h.push(v.exit), { entries: c, exits: h };
      }
      if (bi(s.after))
        for (const u in s.after) {
          const f = s.after[u], v = pa(u, this.delayMap)(this.contextSnapshot, d), b = this.getAfterActions(f, v);
          c.push(b.entry), h.push(b.exit);
        }
      return { entries: c, exits: h };
    }), j(this, "executeActions", (l, s) => {
      var c;
      const d = mo(l, this.guardMap)(this.contextSnapshot, s, this.guardMeta);
      for (const h of ar(d)) {
        const u = bt(h) ? (c = this.actionMap) == null ? void 0 : c[h] : h;
        yi(
          bt(h) && !u,
          `[@zag-js/core > execute-actions] No implementation found for action: \`${h}\``
        ), u == null || u(this.state.context, s, this.meta);
      }
    }), j(this, "executeActivities", (l, s, d) => {
      var c;
      for (const h of s) {
        const u = bt(h) ? (c = this.activityMap) == null ? void 0 : c[h] : h;
        if (!u) {
          yi(`[@zag-js/core > execute-activity] No implementation found for activity: \`${h}\``);
          continue;
        }
        const f = u(this.state.context, l, this.meta);
        if (f) {
          const g = bt(h) ? h : h.name || vs();
          this.addActivityCleanup(d ?? this.state.value, g, f);
        }
      }
    }), j(this, "createEveryActivities", (l, s) => {
      if (l)
        if (Ii(l)) {
          const d = ar(l).find((f) => {
            const g = f.delay, b = pa(g, this.delayMap)(this.contextSnapshot, this.state.event);
            return Qu(f.guard, this.guardMap)(this.contextSnapshot, this.state.event, this.guardMeta) ?? b != null;
          });
          if (!d) return;
          const h = pa(d.delay, this.delayMap)(this.contextSnapshot, this.state.event);
          s(() => {
            const f = globalThis.setInterval(() => {
              this.executeActions(d.actions, this.state.event);
            }, h);
            return () => {
              globalThis.clearInterval(f);
            };
          });
        } else
          for (const d in l) {
            const c = l == null ? void 0 : l[d], u = pa(d, this.delayMap)(this.contextSnapshot, this.state.event);
            s(() => {
              const g = globalThis.setInterval(() => {
                this.executeActions(c, this.state.event);
              }, u);
              return () => {
                globalThis.clearInterval(g);
              };
            });
          }
    }), j(this, "setEvent", (l) => {
      this.state.previousEvent = this.state.event, this.state.event = Ti(_t(l));
    }), j(this, "performExitEffects", (l, s) => {
      const d = this.state.value;
      if (d === "") return;
      const c = l ? this.getStateNode(l) : void 0;
      this.stopActivities(d);
      const h = mo(c == null ? void 0 : c.exit, this.guardMap)(this.contextSnapshot, s, this.guardMeta), u = ar(h), f = this.delayedEvents.get(d);
      f && u.push(...f), this.executeActions(u, s), this.delayedEvents.delete(d);
    }), j(this, "performEntryEffects", (l, s) => {
      const d = this.getStateNode(l), c = ar(d == null ? void 0 : d.activities);
      this.createEveryActivities(d == null ? void 0 : d.every, (g) => {
        c.unshift(g);
      }), c.length > 0 && this.executeActivities(s, c);
      const h = mo(d == null ? void 0 : d.entry, this.guardMap)(
        this.contextSnapshot,
        s,
        this.guardMeta
      ), u = ar(h), f = this.getDelayedEventActions(l);
      d != null && d.after && f && (this.delayedEvents.set(l, f == null ? void 0 : f.exits), u.push(...f.entries)), this.executeActions(u, s), (d == null ? void 0 : d.type) === "final" && (this.state.done = !0, this.doneListeners.forEach((g) => {
        g(this.stateSnapshot);
      }), this.stop());
    }), j(this, "performTransitionEffects", (l, s) => {
      const d = this.determineTransition(l, s);
      this.executeActions(d == null ? void 0 : d.actions, s);
    }), j(this, "performStateChangeEffects", (l, s, d) => {
      this.setEvent(d);
      const c = s.changed || s.reenter;
      c && this.performExitEffects(l, d), this.performTransitionEffects(s.transition, d), this.setState(s.target), c && this.performEntryEffects(s.target, d);
    }), j(this, "determineTransition", (l, s) => {
      const d = Mb(l, this.guardMap);
      return d == null ? void 0 : d(this.contextSnapshot, s, this.guardMeta);
    }), j(this, "sendParent", (l) => {
      var d;
      this.parent || xi("[@zag-js/core > send-parent] Cannot send event to an unknown parent");
      const s = _t(l);
      (d = this.parent) == null || d.send(s);
    }), j(this, "log", (...l) => {
      yb() && this.options.debug && console.log(...l);
    }), j(this, "send", (l) => {
      const s = _t(l);
      this.transition(this.state.value, s);
    }), j(this, "transition", (l, s) => {
      var f, g;
      const d = bt(l) ? this.getStateNode(l) : l == null ? void 0 : l.stateNode, c = _t(s);
      if (!d && !this.config.on) {
        const v = this.status === "Stopped" ? "[@zag-js/core > transition] Cannot transition a stopped machine" : `[@zag-js/core > transition] State does not have a definition for \`state\`: ${l}, \`event\`: ${c.type}`;
        yi(v);
        return;
      }
      const h = (
        // @ts-expect-error - Fix this
        ((f = d == null ? void 0 : d.on) == null ? void 0 : f[c.type]) ?? ((g = this.config.on) == null ? void 0 : g[c.type])
      ), u = this.getNextStateInfo(h, c);
      return this.performStateChangeEffects(this.state.value, u, c), u.stateNode;
    }), j(this, "subscribe", (l) => (this.stateListeners.add(l), this.status === "Running" && l(this.stateSnapshot), () => {
      this.stateListeners.delete(l);
    })), j(this, "onDone", (l) => (this.doneListeners.add(l), this)), j(this, "onTransition", (l) => (this.stateListeners.add(l), this.status === "Running" && l(this.stateSnapshot), this)), this.config = kr(e), this.options = kr(t ?? {}), this.id = this.config.id ?? `machine-${vs()}`, this.guardMap = ((r = this.options) == null ? void 0 : r.guards) ?? {}, this.actionMap = ((a = this.options) == null ? void 0 : a.actions) ?? {}, this.delayMap = ((i = this.options) == null ? void 0 : i.delays) ?? {}, this.activityMap = ((o = this.options) == null ? void 0 : o.activities) ?? {}, this.sync = ((n = this.options) == null ? void 0 : n.sync) ?? !1, this.state = Nb(this.config), this.initialContext = nr(this.state.context);
  }
  // immutable state value
  get stateSnapshot() {
    return Vt(nr(this.state));
  }
  getState() {
    return this.stateSnapshot;
  }
  // immutable context value
  get contextSnapshot() {
    return this.stateSnapshot.context;
  }
  /**
   * A reference to the instance methods of the machine.
   * Useful when spawning child machines and managing the communication between them.
   */
  get self() {
    const e = this;
    return {
      id: this.id,
      send: this.send.bind(this),
      sendParent: this.sendParent.bind(this),
      sendChild: this.sendChild.bind(this),
      stop: this.stop.bind(this),
      stopChild: this.stopChild.bind(this),
      spawn: this.spawn.bind(this),
      stopActivity: this.stopActivity.bind(this),
      get state() {
        return e.stateSnapshot;
      },
      get initialContext() {
        return e.initialContext;
      },
      get initialState() {
        var t;
        return ((t = e.initialState) == null ? void 0 : t.target) ?? "";
      }
    };
  }
  get meta() {
    var e;
    return {
      state: this.stateSnapshot,
      guards: this.guardMap,
      send: this.send.bind(this),
      self: this.self,
      initialContext: this.initialContext,
      initialState: ((e = this.initialState) == null ? void 0 : e.target) ?? "",
      getState: () => this.stateSnapshot,
      getAction: (t) => this.actionMap[t],
      getGuard: (t) => this.guardMap[t]
    };
  }
  get guardMeta() {
    return {
      state: this.stateSnapshot
    };
  }
  get [Symbol.toStringTag]() {
    return "Machine";
  }
  getHydrationState() {
    const e = this.getState();
    return {
      value: e.value,
      tags: e.tags
    };
  }
}, eh = (e, t) => new Bb(e, t), Kb = (...e) => e.map((t) => {
  var r;
  return (r = t == null ? void 0 : t.trim) == null ? void 0 : r.call(t);
}).filter(Boolean).join(" "), Wb = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g, ms = (e) => {
  const t = {};
  let r;
  for (; r = Wb.exec(e); )
    t[r[1]] = r[2];
  return t;
}, jb = (e, t) => {
  if (bt(e)) {
    if (bt(t)) return `${e};${t}`;
    e = ms(e);
  } else bt(t) && (t = ms(t));
  return Object.assign({}, e ?? {}, t ?? {});
};
function $t(...e) {
  let t = {};
  for (let r of e) {
    for (let a in t) {
      if (a.startsWith("on") && typeof t[a] == "function" && typeof r[a] == "function") {
        t[a] = en(r[a], t[a]);
        continue;
      }
      if (a === "className" || a === "class") {
        t[a] = Kb(t[a], r[a]);
        continue;
      }
      if (a === "style") {
        t[a] = jb(t[a], r[a]);
        continue;
      }
      t[a] = r[a] !== void 0 ? r[a] : t[a];
    }
    for (let a in r)
      t[a] === void 0 && (t[a] = r[a]);
  }
  return t;
}
function Vb(e) {
  var a, i;
  let t = (a = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : a.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (i = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : i.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
const bo = (e) => {
  const t = tu(
    V((r, a) => {
      const { asChild: i, children: o, ...n } = r;
      if (!i)
        return Wv(e, { ...n, ref: a }, o);
      const l = Wi.only(o);
      if (!ji(l))
        return null;
      const s = Vb(l);
      return Qr(l, {
        ...$t(n, l.props),
        ref: a ? Yn(a, s) : s
      });
    })
  );
  return t.displayName = e.displayName || e.name, t;
}, Hb = () => {
  const e = /* @__PURE__ */ new Map();
  return new Proxy(bo, {
    apply(t, r, a) {
      return bo(a[0]);
    },
    get(t, r) {
      const a = r;
      return e.has(a) || e.set(a, bo(a)), e.get(a);
    }
  });
}, hr = Hb(), th = () => (e, t) => t.reduce(
  (r, a) => {
    const [i, o] = r, n = a;
    return o[n] !== void 0 && (i[n] = o[n]), delete o[n], [i, o];
  },
  [{}, { ...e }]
), rh = (e) => th()(e, [
  "immediate",
  "lazyMount",
  "onExitComplete",
  "present",
  "unmountOnExit"
]);
function Ub(e) {
  return new Proxy({}, {
    get() {
      return e;
    }
  });
}
var ge = () => (e) => Array.from(new Set(e));
function Gb(e, t, r) {
  const a = e.matches("mounted", "unmountSuspended");
  return {
    skip: !e.context.initial && a,
    present: a,
    setNode(i) {
      i && t({ type: "NODE.SET", node: i });
    },
    unmount() {
      t({ type: "UNMOUNT" });
    }
  };
}
function Yb(e) {
  return eh(
    {
      initial: e.present ? "mounted" : "unmounted",
      context: {
        node: null,
        styles: null,
        unmountAnimationName: null,
        prevAnimationName: null,
        present: !1,
        initial: !1,
        ...e
      },
      exit: ["clearInitial", "cleanupNode"],
      watch: {
        present: ["setInitial", "syncPresence"]
      },
      on: {
        "NODE.SET": {
          actions: ["setNode", "setStyles"]
        }
      },
      states: {
        mounted: {
          on: {
            UNMOUNT: {
              target: "unmounted",
              actions: ["invokeOnExitComplete"]
            },
            "UNMOUNT.SUSPEND": "unmountSuspended"
          }
        },
        unmountSuspended: {
          activities: ["trackAnimationEvents"],
          after: {
            // Fallback to timeout to ensure we exit this state even if the `animationend` event
            // did not get trigger
            ANIMATION_DURATION: {
              target: "unmounted",
              actions: ["invokeOnExitComplete"]
            }
          },
          on: {
            MOUNT: {
              target: "mounted",
              actions: ["setPrevAnimationName"]
            },
            UNMOUNT: {
              target: "unmounted",
              actions: ["invokeOnExitComplete"]
            }
          }
        },
        unmounted: {
          entry: ["clearPrevAnimationName"],
          on: {
            MOUNT: {
              target: "mounted",
              actions: ["setPrevAnimationName"]
            }
          }
        }
      }
    },
    {
      delays: {
        ANIMATION_DURATION(t) {
          var r, a;
          return bs((r = t.styles) == null ? void 0 : r.animationDuration) + bs((a = t.styles) == null ? void 0 : a.animationDelay) + qb;
        }
      },
      actions: {
        setInitial(t) {
          t.initial = !0;
        },
        clearInitial(t) {
          t.initial = !1;
        },
        cleanupNode(t) {
          t.node = null, t.styles = null;
        },
        invokeOnExitComplete(t) {
          var r;
          (r = t.onExitComplete) == null || r.call(t);
        },
        setNode(t, r) {
          t.node = Ti(r.node);
        },
        setStyles(t, r) {
          const a = r.node.ownerDocument.defaultView || window;
          t.styles = Ti(a.getComputedStyle(r.node));
        },
        syncPresence(t, r, { send: a }) {
          var n;
          if (t.present) {
            a({ type: "MOUNT", src: "presence.changed" });
            return;
          }
          if (!t.present && ((n = t.node) == null ? void 0 : n.ownerDocument.visibilityState) === "hidden") {
            a({ type: "UNMOUNT", src: "visibilitychange" });
            return;
          }
          const i = Qa(t.styles);
          (t.immediate ? queueMicrotask : requestAnimationFrame)(() => {
            var l, s;
            t.unmountAnimationName = i, i === "none" || i === t.prevAnimationName || ((l = t.styles) == null ? void 0 : l.display) === "none" || ((s = t.styles) == null ? void 0 : s.animationDuration) === "0s" ? a({ type: "UNMOUNT", src: "presence.changed" }) : a({ type: "UNMOUNT.SUSPEND" });
          });
        },
        setPrevAnimationName(t) {
          (t.immediate ? queueMicrotask : requestAnimationFrame)(() => {
            t.prevAnimationName = Qa(t.styles);
          });
        },
        clearPrevAnimationName(t) {
          t.prevAnimationName = null;
        }
      },
      activities: {
        trackAnimationEvents(t, r, { send: a }) {
          const i = t.node;
          if (!i) return;
          const o = (l) => {
            var d, c;
            (((c = (d = l.composedPath) == null ? void 0 : d.call(l)) == null ? void 0 : c[0]) ?? l.target) === i && (t.prevAnimationName = Qa(t.styles));
          }, n = (l) => {
            var c, h;
            const s = Qa(t.styles);
            (((h = (c = l.composedPath) == null ? void 0 : c.call(l)) == null ? void 0 : h[0]) ?? l.target) === i && s === t.unmountAnimationName && a({ type: "UNMOUNT", src: "animationend" });
          };
          return i.addEventListener("animationstart", o), i.addEventListener("animationcancel", n), i.addEventListener("animationend", n), () => {
            i.removeEventListener("animationstart", o), i.removeEventListener("animationcancel", n), i.removeEventListener("animationend", n);
          };
        }
      }
    }
  );
}
function Qa(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function bs(e) {
  return parseFloat(e || "0") * 1e3;
}
var qb = 16.667;
ge()(["onExitComplete", "present", "immediate"]);
var Xb = Ub((e) => e), ys = (e) => (e == null ? void 0 : e.constructor.name) === "Array", Zb = (e, t) => {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++)
    if (!Jn(e[r], t[r])) return !1;
  return !0;
}, Jn = (e, t) => {
  if (Object.is(e, t)) return !0;
  if (e == null && t != null || e != null && t == null) return !1;
  if (typeof (e == null ? void 0 : e.isEqual) == "function" && typeof (t == null ? void 0 : t.isEqual) == "function")
    return e.isEqual(t);
  if (typeof e == "function" && typeof t == "function")
    return e.toString() === t.toString();
  if (ys(e) && ys(t))
    return Zb(Array.from(e), Array.from(t));
  if (typeof e != "object" || typeof t != "object") return !1;
  const r = Object.keys(t ?? /* @__PURE__ */ Object.create(null)), a = r.length;
  for (let i = 0; i < a; i++)
    if (!Reflect.has(e, r[i])) return !1;
  for (let i = 0; i < a; i++) {
    const o = r[i];
    if (!Jn(e[o], t[o])) return !1;
  }
  return !0;
}, Jb = () => process.env.NODE_ENV !== "production", Qb = Function.prototype.toString;
Qb.call(Object);
function ah(e) {
  if (!ey(e) || e === void 0) return e;
  const t = Reflect.ownKeys(e).filter((a) => typeof a == "string"), r = {};
  for (const a of t) {
    const i = e[a];
    i !== void 0 && (r[a] = ah(i));
  }
  return r;
}
var ey = (e) => e && typeof e == "object" && e.constructor === Object;
function ty(e, t) {
  const r = B(!1), a = B(!1);
  ee(() => {
    if (r.current && a.current)
      return e();
    a.current = !0;
  }, t), ee(() => (r.current = !0, () => {
    r.current = !1;
  }), []);
}
var ry = Xn("__zag__targetCache", () => /* @__PURE__ */ new WeakMap());
function ay(e, t) {
  const { actions: r, context: a, sync: i } = t ?? {}, o = B(void 0), n = B(void 0), l = au(
    ie((h) => Qo(e.state, h, i), [i]),
    () => {
      const h = nr(e.state);
      try {
        if (o.current && n.current && !Vu(o.current, h, n.current, /* @__PURE__ */ new WeakMap()))
          return o.current;
      } catch {
      }
      return h;
    },
    () => nr(e.state)
  );
  e.setOptions({ actions: r });
  const s = G(() => ah(a ?? {}), [a]);
  ty(() => {
    const h = Object.entries(s), u = e.contextSnapshot ?? {};
    h.map(([v, b]) => ({
      key: v,
      curr: b,
      prev: u[v],
      equal: Jn(u[v], b)
    })).every(({ equal: v }) => v) || e.setContext(s);
  }, [s]);
  const d = /* @__PURE__ */ new WeakMap();
  ee(() => {
    o.current = l, n.current = d;
  });
  const c = G(() => /* @__PURE__ */ new WeakMap(), []);
  return ju(l, d, c, ry);
}
function iy(e) {
  const t = B(void 0);
  return t.current || (t.current = { v: e() }), t.current.v;
}
var oy = typeof document < "u" ? ru : ee;
function ny(e, t) {
  const { state: r, context: a } = t ?? {}, i = iy(() => {
    const n = typeof e == "function" ? e() : e;
    return a && n.setContext(a), n._created(), n;
  }), o = B(void 0);
  return oy(() => {
    const n = r ?? o.current;
    return i.start(n), () => {
      Jb() && (o.current = i.getHydrationState()), i.stop();
    };
  }, []), i;
}
function ih(e, t) {
  const r = ny(e, t);
  return [ay(r, t), r.send, r];
}
function ki(e, t = {}) {
  const { sync: r = !1 } = t, a = ly(e);
  return ie(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (...i) => {
      var o;
      return r ? queueMicrotask(() => {
        var n;
        return (n = a.current) == null ? void 0 : n.call(a, ...i);
      }) : (o = a.current) == null ? void 0 : o.call(a, ...i);
    },
    [r, a]
  );
}
function ly(e) {
  const t = B(e);
  return t.current = e, t;
}
const Qn = (e) => {
  const { lazyMount: t, unmountOnExit: r, present: a, ...i } = e, o = B(!1), n = {
    ...i,
    present: a,
    onExitComplete: ki(e.onExitComplete)
  }, [l, s] = ih(Yb(n), { context: n }), d = Gb(l, s);
  d.present && (o.current = !0);
  const c = !d.present && !o.current && t || r && !d.present && o.current, h = () => ({
    "data-state": a ? "open" : "closed",
    hidden: !d.present
  });
  return {
    ref: d.setNode,
    getPresenceProps: h,
    present: d.present,
    unmounted: c
  };
}, [oh, el] = aa({
  name: "PresenceContext",
  hookName: "usePresenceContext",
  providerName: "<PresenceProvider />"
});
var Z = (e, t = []) => ({
  parts: (...r) => {
    if (sy(t))
      return Z(e, r);
    throw new Error("createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?");
  },
  extendWith: (...r) => Z(e, [...t, ...r]),
  rename: (r) => Z(r, t),
  keys: () => t,
  build: () => [...new Set(t)].reduce(
    (r, a) => Object.assign(r, {
      [a]: {
        selector: [
          `&[data-scope="${Or(e)}"][data-part="${Or(a)}"]`,
          `& [data-scope="${Or(e)}"][data-part="${Or(a)}"]`
        ].join(", "),
        attrs: { "data-scope": Or(e), "data-part": Or(a) }
      }
    }),
    {}
  )
}), Or = (e) => e.replace(/([A-Z])([A-Z])/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase(), sy = (e) => e.length === 0, nh = Z("accordion").parts("root", "item", "itemTrigger", "itemContent", "itemIndicator");
nh.build();
var Ct = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `accordion:${e.id}`;
  },
  getItemId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.item) == null ? void 0 : a.call(r, t)) ?? `accordion:${e.id}:item:${t}`;
  },
  getItemContentId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemContent) == null ? void 0 : a.call(r, t)) ?? `accordion:${e.id}:content:${t}`;
  },
  getItemTriggerId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemTrigger) == null ? void 0 : a.call(r, t)) ?? `accordion:${e.id}:trigger:${t}`;
  },
  getRootEl: (e) => Ct.getById(e, Ct.getRootId(e)),
  getTriggerEls: (e) => {
    const r = `[aria-controls][data-ownedby='${CSS.escape(Ct.getRootId(e))}']:not([disabled])`;
    return Ht(Ct.getRootEl(e), r);
  },
  getFirstTriggerEl: (e) => Hu(Ct.getTriggerEls(e)),
  getLastTriggerEl: (e) => Uu(Ct.getTriggerEls(e)),
  getNextTriggerEl: (e, t) => Au(Ct.getTriggerEls(e), Ct.getItemTriggerId(e, t)),
  getPrevTriggerEl: (e, t) => zu(Ct.getTriggerEls(e), Ct.getItemTriggerId(e, t))
});
ge()([
  "collapsible",
  "dir",
  "disabled",
  "getRootNode",
  "id",
  "ids",
  "multiple",
  "onFocusChange",
  "onValueChange",
  "orientation",
  "value"
]);
ge()(["value", "disabled"]);
var lh = Z("collapsible").parts("root", "trigger", "content");
lh.build();
var Fr = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `collapsible:${e.id}`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `collapsible:${e.id}:content`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `collapsible:${e.id}:trigger`;
  },
  getRootEl: (e) => Fr.getById(e, Fr.getRootId(e)),
  getContentEl: (e) => Fr.getById(e, Fr.getContentId(e)),
  getTriggerEl: (e) => Fr.getById(e, Fr.getTriggerId(e))
});
ge()([
  "dir",
  "disabled",
  "getRootNode",
  "id",
  "ids",
  "onExitComplete",
  "onOpenChange",
  "open.controlled",
  "open"
]);
const [Gw, sh] = aa({
  name: "EnvironmentContext",
  hookName: "useEnvironmentContext",
  providerName: "<EnvironmentProvider />",
  strict: !1,
  defaultValue: {
    getRootNode: () => document,
    getDocument: () => document,
    getWindow: () => window
  }
});
function dy(e) {
  const t = {
    each(r) {
      var a;
      for (let i = 0; i < ((a = e.frames) == null ? void 0 : a.length); i += 1) {
        const o = e.frames[i];
        o && r(o);
      }
    },
    addEventListener(r, a, i) {
      return t.each((o) => {
        try {
          o.document.addEventListener(r, a, i);
        } catch {
        }
      }), () => {
        try {
          t.removeEventListener(r, a, i);
        } catch {
        }
      };
    },
    removeEventListener(r, a, i) {
      t.each((o) => {
        try {
          o.document.removeEventListener(r, a, i);
        } catch {
        }
      });
    }
  };
  return t;
}
function cy(e) {
  const t = e.frameElement != null ? e.parent : null;
  return {
    addEventListener: (r, a, i) => {
      try {
        t == null || t.addEventListener(r, a, i);
      } catch {
      }
      return () => {
        try {
          t == null || t.removeEventListener(r, a, i);
        } catch {
        }
      };
    },
    removeEventListener: (r, a, i) => {
      try {
        t == null || t.removeEventListener(r, a, i);
      } catch {
      }
    }
  };
}
var xs = "pointerdown.outside", ks = "focus.outside";
function uy(e) {
  for (const t of e)
    if (Je(t) && cr(t)) return !0;
  return !1;
}
var dh = (e) => "clientY" in e;
function hy(e, t) {
  if (!dh(t) || !e) return !1;
  const r = e.getBoundingClientRect();
  return r.width === 0 || r.height === 0 ? !1 : r.top <= t.clientY && t.clientY <= r.top + r.height && r.left <= t.clientX && t.clientX <= r.left + r.width;
}
function fy(e, t) {
  return e.y <= t.y && t.y <= e.y + e.height && e.x <= t.x && t.x <= e.x + e.width;
}
function _s(e, t) {
  if (!t || !dh(e)) return !1;
  const r = t.scrollHeight > t.clientHeight, a = r && e.clientX > t.offsetLeft + t.clientWidth, i = t.scrollWidth > t.clientWidth, o = i && e.clientY > t.offsetTop + t.clientHeight, n = {
    x: t.offsetLeft,
    y: t.offsetTop,
    width: t.clientWidth + (r ? 16 : 0),
    height: t.clientHeight + (i ? 16 : 0)
  }, l = {
    x: e.clientX,
    y: e.clientY
  };
  return fy(n, l) ? a || o : !1;
}
function gy(e, t) {
  const { exclude: r, onFocusOutside: a, onPointerDownOutside: i, onInteractOutside: o, defer: n } = t;
  if (!e) return;
  const l = Zt(e), s = ra(e), d = dy(s), c = cy(s);
  function h(m) {
    const x = or(m);
    if (!Je(x) || !x.isConnected || Pi(e, x) || hy(e, m)) return !1;
    const S = l.querySelector(`[aria-controls="${e.id}"]`);
    if (S) {
      const k = Go(S);
      if (_s(m, k)) return !1;
    }
    const T = Go(e);
    return _s(m, T) ? !1 : !(r != null && r(x));
  }
  const u = /* @__PURE__ */ new Set();
  function f(m) {
    function x() {
      var k;
      const S = n ? Sr : ($) => $(), T = ((k = m.composedPath) == null ? void 0 : k.call(m)) ?? [m.target];
      S(() => {
        if (!(!e || !h(m))) {
          if (i || o) {
            const $ = en(i, o);
            e.addEventListener(xs, $, { once: !0 });
          }
          Ss(e, xs, {
            bubbles: !1,
            cancelable: !0,
            detail: {
              originalEvent: m,
              contextmenu: D1(m),
              focusable: uy(T)
            }
          });
        }
      });
    }
    m.pointerType === "touch" ? (u.forEach((S) => S()), u.add(zt(l, "click", x, { once: !0 })), u.add(c.addEventListener("click", x, { once: !0 })), u.add(d.addEventListener("click", x, { once: !0 }))) : x();
  }
  const g = /* @__PURE__ */ new Set(), v = setTimeout(() => {
    g.add(zt(l, "pointerdown", f, !0)), g.add(c.addEventListener("pointerdown", f, !0)), g.add(d.addEventListener("pointerdown", f, !0));
  }, 0);
  function b(m) {
    (n ? Sr : (S) => S())(() => {
      if (!(!e || !h(m))) {
        if (a || o) {
          const S = en(a, o);
          e.addEventListener(ks, S, { once: !0 });
        }
        Ss(e, ks, {
          bubbles: !1,
          cancelable: !0,
          detail: {
            originalEvent: m,
            contextmenu: !1,
            focusable: cr(or(m))
          }
        });
      }
    });
  }
  return g.add(zt(l, "focusin", b, !0)), g.add(c.addEventListener("focusin", b, !0)), g.add(d.addEventListener("focusin", b, !0)), () => {
    clearTimeout(v), u.forEach((m) => m()), g.forEach((m) => m());
  };
}
function py(e, t) {
  const { defer: r } = t, a = r ? Sr : (o) => o(), i = [];
  return i.push(
    a(() => {
      const o = typeof e == "function" ? e() : e;
      i.push(gy(o, t));
    })
  ), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
function Ss(e, t, r) {
  const a = e.ownerDocument.defaultView || window, i = new a.CustomEvent(t, r);
  return e.dispatchEvent(i);
}
function vy(e, t) {
  const r = (a) => {
    a.key === "Escape" && (a.isComposing || t == null || t(a));
  };
  return zt(Zt(e), "keydown", r, { capture: !0 });
}
var St = {
  layers: [],
  branches: [],
  count() {
    return this.layers.length;
  },
  pointerBlockingLayers() {
    return this.layers.filter((e) => e.pointerBlocking);
  },
  topMostPointerBlockingLayer() {
    return [...this.pointerBlockingLayers()].slice(-1)[0];
  },
  hasPointerBlockingLayer() {
    return this.pointerBlockingLayers().length > 0;
  },
  isBelowPointerBlockingLayer(e) {
    var a;
    const t = this.indexOf(e), r = this.topMostPointerBlockingLayer() ? this.indexOf((a = this.topMostPointerBlockingLayer()) == null ? void 0 : a.node) : -1;
    return t < r;
  },
  isTopMost(e) {
    const t = this.layers[this.count() - 1];
    return (t == null ? void 0 : t.node) === e;
  },
  getNestedLayers(e) {
    return Array.from(this.layers).slice(this.indexOf(e) + 1);
  },
  isInNestedLayer(e, t) {
    return this.getNestedLayers(e).some((r) => Pi(r.node, t));
  },
  isInBranch(e) {
    return Array.from(this.branches).some((t) => Pi(t, e));
  },
  add(e) {
    const t = this.layers.push(e);
    e.node.style.setProperty("--layer-index", `${t}`);
  },
  addBranch(e) {
    this.branches.push(e);
  },
  remove(e) {
    const t = this.indexOf(e);
    t < 0 || (t < this.count() - 1 && this.getNestedLayers(e).forEach((a) => a.dismiss()), this.layers.splice(t, 1), e.style.removeProperty("--layer-index"));
  },
  removeBranch(e) {
    const t = this.branches.indexOf(e);
    t >= 0 && this.branches.splice(t, 1);
  },
  indexOf(e) {
    return this.layers.findIndex((t) => t.node === e);
  },
  dismiss(e) {
    var t;
    (t = this.layers[this.indexOf(e)]) == null || t.dismiss();
  },
  clear() {
    this.remove(this.layers[0].node);
  }
}, ws;
function $s() {
  St.layers.forEach(({ node: e }) => {
    e.style.pointerEvents = St.isBelowPointerBlockingLayer(e) ? "none" : "auto";
  });
}
function my(e) {
  e.style.pointerEvents = "";
}
function by(e, t) {
  const r = Zt(e), a = [];
  if (St.hasPointerBlockingLayer() && !r.body.hasAttribute("data-inert") && (ws = document.body.style.pointerEvents, queueMicrotask(() => {
    r.body.style.pointerEvents = "none", r.body.setAttribute("data-inert", "");
  })), t) {
    const i = J1(t, (o) => {
      a.push(U1(o, { pointerEvents: "auto" }));
    });
    a.push(i);
  }
  return () => {
    St.hasPointerBlockingLayer() || (queueMicrotask(() => {
      r.body.style.pointerEvents = ws, r.body.removeAttribute("data-inert"), r.body.style.length === 0 && r.body.removeAttribute("style");
    }), a.forEach((i) => i()));
  };
}
function yy(e, t) {
  if (!e) {
    yi("[@zag-js/dismissable] node is `null` or `undefined`");
    return;
  }
  const { onDismiss: r, pointerBlocking: a, exclude: i, debug: o } = t, n = { dismiss: r, node: e, pointerBlocking: a };
  St.add(n), $s();
  function l(u) {
    var g, v;
    const f = or(u.detail.originalEvent);
    St.isBelowPointerBlockingLayer(e) || St.isInBranch(f) || ((g = t.onPointerDownOutside) == null || g.call(t, u), (v = t.onInteractOutside) == null || v.call(t, u), !u.defaultPrevented && (o && console.log("onPointerDownOutside:", u.detail.originalEvent), r == null || r()));
  }
  function s(u) {
    var g, v;
    const f = or(u.detail.originalEvent);
    St.isInBranch(f) || ((g = t.onFocusOutside) == null || g.call(t, u), (v = t.onInteractOutside) == null || v.call(t, u), !u.defaultPrevented && (o && console.log("onFocusOutside:", u.detail.originalEvent), r == null || r()));
  }
  function d(u) {
    var f;
    St.isTopMost(e) && ((f = t.onEscapeKeyDown) == null || f.call(t, u), !u.defaultPrevented && r && (u.preventDefault(), r()));
  }
  function c(u) {
    var b;
    if (!e) return !1;
    const f = typeof i == "function" ? i() : i, g = Array.isArray(f) ? f : [f], v = (b = t.persistentElements) == null ? void 0 : b.map((m) => m()).filter(Je);
    return v && g.push(...v), g.some((m) => Pi(m, u)) || St.isInNestedLayer(e, u);
  }
  const h = [
    a ? by(e, t.persistentElements) : void 0,
    vy(e, d),
    py(e, { exclude: c, onFocusOutside: s, onPointerDownOutside: l, defer: t.defer })
  ];
  return () => {
    St.remove(e), $s(), my(e), h.forEach((u) => u == null ? void 0 : u());
  };
}
function xy(e, t) {
  const { defer: r } = t, a = r ? Sr : (o) => o(), i = [];
  return i.push(
    a(() => {
      const o = Ri(e) ? e() : e;
      i.push(yy(o, t));
    })
  ), () => {
    a(() => {
      i.forEach((o) => o == null ? void 0 : o());
    });
  };
}
var ch = Z("color-picker", [
  "root",
  "label",
  "control",
  "trigger",
  "positioner",
  "content",
  "area",
  "areaThumb",
  "valueText",
  "areaBackground",
  "channelSlider",
  "channelSliderLabel",
  "channelSliderTrack",
  "channelSliderThumb",
  "channelSliderValueText",
  "channelInput",
  "transparencyGrid",
  "swatchGroup",
  "swatchTrigger",
  "swatchIndicator",
  "swatch",
  "eyeDropperTrigger",
  "formatTrigger",
  "formatSelect"
]);
ch.build();
var _e = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `color-picker:${e.id}`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `color-picker:${e.id}:label`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `color-picker:${e.id}:hidden-input`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `color-picker:${e.id}:control`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `color-picker:${e.id}:trigger`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `color-picker:${e.id}:content`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `color-picker:${e.id}:positioner`;
  },
  getFormatSelectId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.formatSelect) ?? `color-picker:${e.id}:format-select`;
  },
  getAreaId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.area) ?? `color-picker:${e.id}:area`;
  },
  getAreaGradientId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.areaGradient) ?? `color-picker:${e.id}:area-gradient`;
  },
  getAreaThumbId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.areaThumb) ?? `color-picker:${e.id}:area-thumb`;
  },
  getChannelSliderTrackId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.channelSliderTrack) == null ? void 0 : a.call(r, t)) ?? `color-picker:${e.id}:slider-track:${t}`;
  },
  getChannelSliderThumbId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.channelSliderThumb) == null ? void 0 : a.call(r, t)) ?? `color-picker:${e.id}:slider-thumb:${t}`;
  },
  getContentEl: (e) => _e.getById(e, _e.getContentId(e)),
  getAreaThumbEl: (e) => _e.getById(e, _e.getAreaThumbId(e)),
  getChannelSliderThumbEl: (e, t) => _e.getById(e, _e.getChannelSliderThumbId(e, t)),
  getChannelInputEl: (e, t) => {
    const r = `input[data-channel="${t}"]`;
    return [
      ...Ht(_e.getContentEl(e), r),
      ...Ht(_e.getControlEl(e), r)
    ];
  },
  getFormatSelectEl: (e) => _e.getById(e, _e.getFormatSelectId(e)),
  getHiddenInputEl: (e) => _e.getById(e, _e.getHiddenInputId(e)),
  getAreaEl: (e) => _e.getById(e, _e.getAreaId(e)),
  getAreaValueFromPoint(e, t) {
    const r = _e.getAreaEl(e);
    if (!r) return;
    const { percent: a } = Yo(t, r);
    return a;
  },
  getControlEl: (e) => _e.getById(e, _e.getControlId(e)),
  getTriggerEl: (e) => _e.getById(e, _e.getTriggerId(e)),
  getPositionerEl: (e) => _e.getById(e, _e.getPositionerId(e)),
  getChannelSliderTrackEl: (e, t) => _e.getById(e, _e.getChannelSliderTrackId(e, t)),
  getChannelSliderValueFromPoint(e, t, r) {
    const a = _e.getChannelSliderTrackEl(e, r);
    if (!a) return;
    const { percent: i } = Yo(t, a);
    return i;
  },
  getChannelInputEls: (e) => [
    ...Ht(_e.getContentEl(e), "input[data-channel]"),
    ...Ht(_e.getControlEl(e), "input[data-channel]")
  ]
});
function ky(e, t) {
  if (t.has(e))
    throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _y(e, t, r) {
  ky(e, t), t.set(e, r);
}
const [uh, Sy] = aa({
  name: "RenderStrategyContext",
  hookName: "useRenderStrategyContext",
  providerName: "<RenderStrategyPropsProvider />"
}), hh = (e) => th()(e, ["lazyMount", "unmountOnExit"]);
var fh = Z("avatar").parts("root", "image", "fallback");
fh.build();
var ei = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `avatar:${e.id}`;
  },
  getImageId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.image) ?? `avatar:${e.id}:image`;
  },
  getFallbackId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.fallback) ?? `avatar:${e.id}:fallback`;
  },
  getRootEl: (e) => ei.getById(e, ei.getRootId(e)),
  getImageEl: (e) => ei.getById(e, ei.getImageId(e))
});
ge()(["dir", "id", "ids", "onStatusChange", "getRootNode"]);
var gh = Z("checkbox").parts("root", "label", "control", "indicator");
gh.build();
var ti = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `checkbox:${e.id}`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `checkbox:${e.id}:label`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `checkbox:${e.id}:control`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `checkbox:${e.id}:input`;
  },
  getRootEl: (e) => ti.getById(e, ti.getRootId(e)),
  getHiddenInputEl: (e) => ti.getById(e, ti.getHiddenInputId(e))
});
ge()([
  "checked",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "id",
  "ids",
  "invalid",
  "name",
  "onCheckedChange",
  "readOnly",
  "required",
  "value"
]);
const wy = gh.extendWith("group"), [Yw, $y] = aa({
  name: "FieldContext",
  hookName: "useFieldContext",
  providerName: "<FieldProvider />",
  strict: !1
}), Ey = ch.extendWith("view");
var Nr = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), ai = {}, yo = 0, ph = (e) => e && (e.host || ph(e.parentNode)), Py = (e, t) => t.map((r) => {
  if (e.contains(r)) return r;
  const a = ph(r);
  return a && e.contains(a) ? a : (console.error("[zag-js > ariaHidden] target", r, "in not contained inside", e, ". Doing nothing"), null);
}).filter((r) => !!r), Cy = (e) => e.localName === "next-route-announcer" || e.localName === "script" || e.hasAttribute("aria-live") ? !0 : e.matches("[data-live-announcer]"), Ty = (e, t) => {
  const { parentNode: r, markerName: a, controlAttribute: i } = t, o = Py(r, Array.isArray(e) ? e : [e]);
  ai[a] || (ai[a] = /* @__PURE__ */ new WeakMap());
  const n = ai[a], l = [], s = /* @__PURE__ */ new Set(), d = new Set(o), c = (u) => {
    !u || s.has(u) || (s.add(u), c(u.parentNode));
  };
  o.forEach(c);
  const h = (u) => {
    !u || d.has(u) || Array.prototype.forEach.call(u.children, (f) => {
      if (s.has(f))
        h(f);
      else
        try {
          if (Cy(f)) return;
          const g = f.getAttribute(i), v = g !== null && g !== "false", b = (Nr.get(f) || 0) + 1, m = (n.get(f) || 0) + 1;
          Nr.set(f, b), n.set(f, m), l.push(f), b === 1 && v && ri.set(f, !0), m === 1 && f.setAttribute(a, ""), v || f.setAttribute(i, "");
        } catch (g) {
          console.error("[zag-js > ariaHidden] cannot operate on ", f, g);
        }
    });
  };
  return h(r), s.clear(), yo++, () => {
    l.forEach((u) => {
      const f = Nr.get(u) - 1, g = n.get(u) - 1;
      Nr.set(u, f), n.set(u, g), f || (ri.has(u) || u.removeAttribute(i), ri.delete(u)), g || u.removeAttribute(a);
    }), yo--, yo || (Nr = /* @__PURE__ */ new WeakMap(), Nr = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), ai = {});
  };
}, Iy = (e) => (Array.isArray(e) ? e[0] : e).ownerDocument.body, Ry = (e, t = Iy(e), r = "data-aria-hidden") => {
  if (t)
    return Ty(e, {
      parentNode: t,
      markerName: r,
      controlAttribute: "aria-hidden"
    });
}, Dy = (e) => {
  const t = requestAnimationFrame(() => e());
  return () => cancelAnimationFrame(t);
};
function Ay(e, t = {}) {
  const { defer: r = !0 } = t, a = r ? Dy : (o) => o(), i = [];
  return i.push(
    a(() => {
      const n = (typeof e == "function" ? e() : e).filter(Boolean);
      n.length !== 0 && i.push(Ry(n));
    })
  ), () => {
    i.forEach((o) => o == null ? void 0 : o());
  };
}
const [vh, fr] = aa({
  name: "DialogContext",
  hookName: "useDialogContext",
  providerName: "<DialogProvider />"
}), mh = V((e, t) => {
  const r = fr(), a = Sy(), i = Qn({ ...a, present: r.open }), o = $t(r.getBackdropProps(), i.getPresenceProps(), e);
  return i.unmounted ? null : /* @__PURE__ */ C.jsx(hr.div, { ...o, ref: Yn(i.ref, t) });
});
mh.displayName = "DialogBackdrop";
const bh = V(
  (e, t) => {
    const r = fr(), a = $t(r.getCloseTriggerProps(), e);
    return /* @__PURE__ */ C.jsx(hr.button, { ...a, ref: t });
  }
);
bh.displayName = "DialogCloseTrigger";
const yh = V((e, t) => {
  const r = fr(), a = el(), i = $t(r.getContentProps(), a.getPresenceProps(), e);
  return a.unmounted ? null : /* @__PURE__ */ C.jsx(hr.div, { ...i, ref: Yn(a.ref, t) });
});
yh.displayName = "DialogContent";
const xh = V(
  (e, t) => {
    const r = fr(), a = $t(r.getDescriptionProps(), e);
    return /* @__PURE__ */ C.jsx(hr.div, { ...a, ref: t });
  }
);
xh.displayName = "DialogDescription";
const kh = V((e, t) => {
  const r = fr(), a = $t(r.getPositionerProps(), e);
  return el().unmounted ? null : /* @__PURE__ */ C.jsx(hr.div, { ...a, ref: t });
});
kh.displayName = "DialogPositioner";
var zy = Object.defineProperty, Oy = (e, t, r) => t in e ? zy(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Ee = (e, t, r) => Oy(e, typeof t != "symbol" ? t + "" : t, r), Es = {
  activateTrap(e, t) {
    if (e.length > 0) {
      const a = e[e.length - 1];
      a !== t && a.pause();
    }
    const r = e.indexOf(t);
    r === -1 || e.splice(r, 1), e.push(t);
  },
  deactivateTrap(e, t) {
    const r = e.indexOf(t);
    r !== -1 && e.splice(r, 1), e.length > 0 && e[e.length - 1].unpause();
  }
}, Fy = [], Ny = class {
  constructor(e, t) {
    Ee(this, "trapStack"), Ee(this, "config"), Ee(this, "doc"), Ee(this, "state", {
      containers: [],
      containerGroups: [],
      tabbableGroups: [],
      nodeFocusedBeforeActivation: null,
      mostRecentlyFocusedNode: null,
      active: !1,
      paused: !1,
      delayInitialFocusTimer: void 0,
      recentNavEvent: void 0
    }), Ee(this, "listenerCleanups", []), Ee(this, "handleFocus", (a) => {
      const i = or(a), o = this.findContainerIndex(i, a) >= 0;
      if (o || Wn(i))
        o && (this.state.mostRecentlyFocusedNode = i);
      else {
        a.stopImmediatePropagation();
        let n, l = !0;
        if (this.state.mostRecentlyFocusedNode)
          if (ga(this.state.mostRecentlyFocusedNode) > 0) {
            const s = this.findContainerIndex(this.state.mostRecentlyFocusedNode), { tabbableNodes: d } = this.state.containerGroups[s];
            if (d.length > 0) {
              const c = d.findIndex((h) => h === this.state.mostRecentlyFocusedNode);
              c >= 0 && (this.config.isKeyForward(this.state.recentNavEvent) ? c + 1 < d.length && (n = d[c + 1], l = !1) : c - 1 >= 0 && (n = d[c - 1], l = !1));
            }
          } else
            this.state.containerGroups.some((s) => s.tabbableNodes.some((d) => ga(d) > 0)) || (l = !1);
        else
          l = !1;
        l && (n = this.findNextNavNode({
          // move FROM the MRU node, not event-related node (which will be the node that is
          //  outside the trap causing the focus escape we're trying to fix)
          target: this.state.mostRecentlyFocusedNode,
          isBackward: this.config.isKeyBackward(this.state.recentNavEvent)
        })), n ? this.tryFocus(n) : this.tryFocus(this.state.mostRecentlyFocusedNode || this.getInitialFocusNode());
      }
      this.state.recentNavEvent = void 0;
    }), Ee(this, "handlePointerDown", (a) => {
      const i = or(a);
      if (!(this.findContainerIndex(i, a) >= 0)) {
        if (ma(this.config.clickOutsideDeactivates, a)) {
          this.deactivate({ returnFocus: this.config.returnFocusOnDeactivate });
          return;
        }
        ma(this.config.allowOutsideClick, a) || a.preventDefault();
      }
    }), Ee(this, "handleClick", (a) => {
      const i = or(a);
      this.findContainerIndex(i, a) >= 0 || ma(this.config.clickOutsideDeactivates, a) || ma(this.config.allowOutsideClick, a) || (a.preventDefault(), a.stopImmediatePropagation());
    }), Ee(this, "handleTabKey", (a) => {
      if (this.config.isKeyForward(a) || this.config.isKeyBackward(a)) {
        this.state.recentNavEvent = a;
        const i = this.config.isKeyBackward(a), o = this.findNextNavNode({ event: a, isBackward: i });
        if (!o) return;
        va(a) && a.preventDefault(), this.tryFocus(o);
      }
    }), Ee(this, "handleEscapeKey", (a) => {
      Ly(a) && ma(this.config.escapeDeactivates, a) !== !1 && (a.preventDefault(), this.deactivate());
    }), Ee(this, "_mutationObserver"), Ee(this, "setupMutationObserver", () => {
      const a = this.doc.defaultView || window;
      this._mutationObserver = new a.MutationObserver((i) => {
        i.some((n) => Array.from(n.removedNodes).some((s) => s === this.state.mostRecentlyFocusedNode)) && this.tryFocus(this.getInitialFocusNode());
      });
    }), Ee(this, "updateObservedNodes", () => {
      var a;
      (a = this._mutationObserver) == null || a.disconnect(), this.state.active && !this.state.paused && this.state.containers.map((i) => {
        var o;
        (o = this._mutationObserver) == null || o.observe(i, { subtree: !0, childList: !0 });
      });
    }), Ee(this, "getInitialFocusNode", () => {
      let a = this.getNodeForOption("initialFocus", { hasFallback: !0 });
      if (a === !1)
        return !1;
      if (a === void 0 || a && !cr(a))
        if (this.findContainerIndex(this.doc.activeElement) >= 0)
          a = this.doc.activeElement;
        else {
          const i = this.state.tabbableGroups[0];
          a = i && i.firstTabbableNode || this.getNodeForOption("fallbackFocus");
        }
      else a === null && (a = this.getNodeForOption("fallbackFocus"));
      if (!a)
        throw new Error("Your focus-trap needs to have at least one focusable element");
      return a.isConnected || (a = this.getNodeForOption("fallbackFocus")), a;
    }), Ee(this, "tryFocus", (a) => {
      if (a !== !1 && a !== Pu(this.doc)) {
        if (!a || !a.focus) {
          this.tryFocus(this.getInitialFocusNode());
          return;
        }
        a.focus({ preventScroll: !!this.config.preventScroll }), this.state.mostRecentlyFocusedNode = a, My(a) && a.select();
      }
    }), Ee(this, "deactivate", (a) => {
      if (!this.state.active) return this;
      const i = {
        onDeactivate: this.config.onDeactivate,
        onPostDeactivate: this.config.onPostDeactivate,
        checkCanReturnFocus: this.config.checkCanReturnFocus,
        ...a
      };
      clearTimeout(this.state.delayInitialFocusTimer), this.state.delayInitialFocusTimer = void 0, this.removeListeners(), this.state.active = !1, this.state.paused = !1, this.updateObservedNodes(), Es.deactivateTrap(this.trapStack, this);
      const o = this.getOption(i, "onDeactivate"), n = this.getOption(i, "onPostDeactivate"), l = this.getOption(i, "checkCanReturnFocus"), s = this.getOption(i, "returnFocus", "returnFocusOnDeactivate");
      o == null || o();
      const d = () => {
        Ps(() => {
          if (s) {
            const c = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation);
            this.tryFocus(c);
          }
          n == null || n();
        });
      };
      if (s && l) {
        const c = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation);
        return l(c).then(d, d), this;
      }
      return d(), this;
    }), Ee(this, "pause", (a) => {
      if (this.state.paused || !this.state.active)
        return this;
      const i = this.getOption(a, "onPause"), o = this.getOption(a, "onPostPause");
      return this.state.paused = !0, i == null || i(), this.removeListeners(), this.updateObservedNodes(), o == null || o(), this;
    }), Ee(this, "unpause", (a) => {
      if (!this.state.paused || !this.state.active)
        return this;
      const i = this.getOption(a, "onUnpause"), o = this.getOption(a, "onPostUnpause");
      return this.state.paused = !1, i == null || i(), this.updateTabbableNodes(), this.addListeners(), this.updateObservedNodes(), o == null || o(), this;
    }), Ee(this, "updateContainerElements", (a) => (this.state.containers = Array.isArray(a) ? a.filter(Boolean) : [a].filter(Boolean), this.state.active && this.updateTabbableNodes(), this.updateObservedNodes(), this)), Ee(this, "getReturnFocusNode", (a) => {
      const i = this.getNodeForOption("setReturnFocus", {
        params: [a]
      });
      return i || (i === !1 ? !1 : a);
    }), Ee(this, "getOption", (a, i, o) => a && a[i] !== void 0 ? a[i] : (
      // @ts-expect-error
      this.config[o || i]
    )), Ee(this, "getNodeForOption", (a, { hasFallback: i = !1, params: o = [] } = {}) => {
      let n = this.config[a];
      if (typeof n == "function" && (n = n(...o)), n === !0 && (n = void 0), !n) {
        if (n === void 0 || n === !1)
          return n;
        throw new Error(`\`${a}\` was specified but was not a node, or did not return a node`);
      }
      let l = n;
      if (typeof n == "string") {
        try {
          l = this.doc.querySelector(n);
        } catch (s) {
          throw new Error(`\`${a}\` appears to be an invalid selector; error="${s.message}"`);
        }
        if (!l && !i)
          throw new Error(`\`${a}\` as selector refers to no known node`);
      }
      return l;
    }), Ee(this, "findNextNavNode", (a) => {
      const { event: i, isBackward: o = !1 } = a, n = a.target || or(i);
      this.updateTabbableNodes();
      let l = null;
      if (this.state.tabbableGroups.length > 0) {
        const s = this.findContainerIndex(n, i), d = s >= 0 ? this.state.containerGroups[s] : void 0;
        if (s < 0)
          o ? l = this.state.tabbableGroups[this.state.tabbableGroups.length - 1].lastTabbableNode : l = this.state.tabbableGroups[0].firstTabbableNode;
        else if (o) {
          let c = this.state.tabbableGroups.findIndex(
            ({ firstTabbableNode: h }) => n === h
          );
          if (c < 0 && ((d == null ? void 0 : d.container) === n || cr(n) && !yr(n) && !(d != null && d.nextTabbableNode(n, !1))) && (c = s), c >= 0) {
            const h = c === 0 ? this.state.tabbableGroups.length - 1 : c - 1, u = this.state.tabbableGroups[h];
            l = ga(n) >= 0 ? u.lastTabbableNode : u.lastDomTabbableNode;
          } else va(i) || (l = d == null ? void 0 : d.nextTabbableNode(n, !1));
        } else {
          let c = this.state.tabbableGroups.findIndex(
            ({ lastTabbableNode: h }) => n === h
          );
          if (c < 0 && ((d == null ? void 0 : d.container) === n || cr(n) && !yr(n) && !(d != null && d.nextTabbableNode(n))) && (c = s), c >= 0) {
            const h = c === this.state.tabbableGroups.length - 1 ? 0 : c + 1, u = this.state.tabbableGroups[h];
            l = ga(n) >= 0 ? u.firstTabbableNode : u.firstDomTabbableNode;
          } else va(i) || (l = d == null ? void 0 : d.nextTabbableNode(n));
        }
      } else
        l = this.getNodeForOption("fallbackFocus");
      return l;
    }), this.trapStack = t.trapStack || Fy;
    const r = {
      returnFocusOnDeactivate: !0,
      escapeDeactivates: !0,
      delayInitialFocus: !0,
      isKeyForward(a) {
        return va(a) && !a.shiftKey;
      },
      isKeyBackward(a) {
        return va(a) && a.shiftKey;
      },
      ...t
    };
    this.doc = r.document || Zt(Array.isArray(e) ? e[0] : e), this.config = r, this.updateContainerElements(e), this.setupMutationObserver();
  }
  get active() {
    return this.state.active;
  }
  get paused() {
    return this.state.paused;
  }
  findContainerIndex(e, t) {
    const r = typeof (t == null ? void 0 : t.composedPath) == "function" ? t.composedPath() : void 0;
    return this.state.containerGroups.findIndex(
      ({ container: a, tabbableNodes: i }) => a.contains(e) || (r == null ? void 0 : r.includes(a)) || i.find((o) => o === e)
    );
  }
  updateTabbableNodes() {
    if (this.state.containerGroups = this.state.containers.map((e) => {
      const t = Du(e), r = Hn(e), a = t.length > 0 ? t[0] : void 0, i = t.length > 0 ? t[t.length - 1] : void 0, o = r.find((d) => yr(d)), n = r.slice().reverse().find((d) => yr(d)), l = !!t.find((d) => ga(d) > 0);
      function s(d, c = !0) {
        const h = t.indexOf(d);
        return h < 0 ? c ? r.slice(r.indexOf(d) + 1).find((u) => yr(u)) : r.slice(0, r.indexOf(d)).reverse().find((u) => yr(u)) : t[h + (c ? 1 : -1)];
      }
      return {
        container: e,
        tabbableNodes: t,
        focusableNodes: r,
        posTabIndexesFound: l,
        firstTabbableNode: a,
        lastTabbableNode: i,
        firstDomTabbableNode: o,
        lastDomTabbableNode: n,
        nextTabbableNode: s
      };
    }), this.state.tabbableGroups = this.state.containerGroups.filter((e) => e.tabbableNodes.length > 0), this.state.tabbableGroups.length <= 0 && !this.getNodeForOption("fallbackFocus"))
      throw new Error(
        "Your focus-trap must have at least one container with at least one tabbable node in it at all times"
      );
    if (this.state.containerGroups.find((e) => e.posTabIndexesFound) && this.state.containerGroups.length > 1)
      throw new Error(
        "At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps."
      );
  }
  addListeners() {
    if (this.state.active)
      return Es.activateTrap(this.trapStack, this), this.state.delayInitialFocusTimer = this.config.delayInitialFocus ? Ps(() => {
        this.tryFocus(this.getInitialFocusNode());
      }) : this.tryFocus(this.getInitialFocusNode()), this.listenerCleanups.push(
        zt(this.doc, "focusin", this.handleFocus, !0),
        zt(this.doc, "mousedown", this.handlePointerDown, { capture: !0, passive: !1 }),
        zt(this.doc, "touchstart", this.handlePointerDown, { capture: !0, passive: !1 }),
        zt(this.doc, "click", this.handleClick, { capture: !0, passive: !1 }),
        zt(this.doc, "keydown", this.handleTabKey, { capture: !0, passive: !1 }),
        zt(this.doc, "keydown", this.handleEscapeKey)
      ), this;
  }
  removeListeners() {
    if (this.state.active)
      return this.listenerCleanups.forEach((e) => e()), this.listenerCleanups = [], this;
  }
  activate(e) {
    if (this.state.active)
      return this;
    const t = this.getOption(e, "onActivate"), r = this.getOption(e, "onPostActivate"), a = this.getOption(e, "checkCanFocusTrap");
    a || this.updateTabbableNodes(), this.state.active = !0, this.state.paused = !1, this.state.nodeFocusedBeforeActivation = this.doc.activeElement || null, t == null || t();
    const i = () => {
      a && this.updateTabbableNodes(), this.addListeners(), this.updateObservedNodes(), r == null || r();
    };
    return a ? (a(this.state.containers.concat()).then(i, i), this) : (i(), this);
  }
}, va = (e) => e.key === "Tab", ma = (e, ...t) => typeof e == "function" ? e(...t) : e, Ly = (e) => !e.isComposing && e.key === "Escape", Ps = (e) => setTimeout(e, 0), My = (e) => e.localName === "input" && "select" in e && typeof e.select == "function";
function By(e, t = {}) {
  let r;
  const a = Sr(() => {
    const i = typeof e == "function" ? e() : e;
    if (i) {
      r = new Ny(i, {
        escapeDeactivates: !1,
        allowOutsideClick: !0,
        preventScroll: !0,
        returnFocusOnDeactivate: !0,
        delayInitialFocus: !1,
        fallbackFocus: i,
        ...t,
        document: Zt(i)
      });
      try {
        r.activate();
      } catch {
      }
    }
  });
  return function() {
    r == null || r.deactivate(), a();
  };
}
var xo = "data-scroll-lock";
function Cs(e, t) {
  if (!e) return;
  const r = Object.keys(t).reduce(
    (a, i) => (a[i] = e.style.getPropertyValue(i), a),
    {}
  );
  return Object.assign(e.style, t), () => {
    Object.assign(e.style, r);
  };
}
function Ky(e, t, r) {
  if (!e) return;
  const a = e.style.getPropertyValue(t);
  return e.style.setProperty(t, r), () => {
    a ? e.style.setProperty(t, a) : e.style.removeProperty(t);
  };
}
function Wy(e) {
  const t = e.getBoundingClientRect().left;
  return Math.round(t) + e.scrollLeft ? "paddingLeft" : "paddingRight";
}
function jy(e) {
  const t = e ?? document, r = t.defaultView ?? window, { documentElement: a, body: i } = t;
  if (i.hasAttribute(xo)) return;
  i.setAttribute(xo, "");
  const n = r.innerWidth - a.clientWidth, l = () => Ky(a, "--scrollbar-width", `${n}px`), s = Wy(a), d = () => Cs(i, {
    overflow: "hidden",
    [s]: `${n}px`
  }), c = () => {
    const { scrollX: u, scrollY: f, visualViewport: g } = r, v = (g == null ? void 0 : g.offsetLeft) ?? 0, b = (g == null ? void 0 : g.offsetTop) ?? 0, m = Cs(i, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(f - Math.floor(b))}px`,
      left: `${-(u - Math.floor(v))}px`,
      right: "0",
      [s]: `${n}px`
    });
    return () => {
      m == null || m(), r.scrollTo({ left: u, top: f, behavior: "instant" });
    };
  }, h = [l(), I1() ? c() : d()];
  return () => {
    h.forEach((u) => u == null ? void 0 : u()), i.removeAttribute(xo);
  };
}
var tl = Z("dialog").parts(
  "trigger",
  "backdrop",
  "positioner",
  "content",
  "title",
  "description",
  "closeTrigger"
), pr = tl.build(), le = Re({
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `dialog:${e.id}:positioner`;
  },
  getBackdropId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.backdrop) ?? `dialog:${e.id}:backdrop`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `dialog:${e.id}:content`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `dialog:${e.id}:trigger`;
  },
  getTitleId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.title) ?? `dialog:${e.id}:title`;
  },
  getDescriptionId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.description) ?? `dialog:${e.id}:description`;
  },
  getCloseTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.closeTrigger) ?? `dialog:${e.id}:close`;
  },
  getContentEl: (e) => le.getById(e, le.getContentId(e)),
  getPositionerEl: (e) => le.getById(e, le.getPositionerId(e)),
  getBackdropEl: (e) => le.getById(e, le.getBackdropId(e)),
  getTriggerEl: (e) => le.getById(e, le.getTriggerId(e)),
  getTitleEl: (e) => le.getById(e, le.getTitleId(e)),
  getDescriptionEl: (e) => le.getById(e, le.getDescriptionId(e)),
  getCloseTriggerEl: (e) => le.getById(e, le.getCloseTriggerId(e))
});
function Vy(e, t, r) {
  const a = e.context["aria-label"], i = e.matches("open"), o = e.context.renderedElements;
  return {
    open: i,
    setOpen(n) {
      n !== i && t(n ? "OPEN" : "CLOSE");
    },
    getTriggerProps() {
      return r.button({
        ...pr.trigger.attrs,
        dir: e.context.dir,
        id: le.getTriggerId(e.context),
        "aria-haspopup": "dialog",
        type: "button",
        "aria-expanded": i,
        "data-state": i ? "open" : "closed",
        "aria-controls": le.getContentId(e.context),
        onClick(n) {
          n.defaultPrevented || t("TOGGLE");
        }
      });
    },
    getBackdropProps() {
      return r.element({
        ...pr.backdrop.attrs,
        dir: e.context.dir,
        hidden: !i,
        id: le.getBackdropId(e.context),
        "data-state": i ? "open" : "closed"
      });
    },
    getPositionerProps() {
      return r.element({
        ...pr.positioner.attrs,
        dir: e.context.dir,
        id: le.getPositionerId(e.context),
        style: {
          pointerEvents: i ? void 0 : "none"
        }
      });
    },
    getContentProps() {
      return r.element({
        ...pr.content.attrs,
        dir: e.context.dir,
        role: e.context.role,
        hidden: !i,
        id: le.getContentId(e.context),
        tabIndex: -1,
        "data-state": i ? "open" : "closed",
        "aria-modal": !0,
        "aria-label": a || void 0,
        "aria-labelledby": a || !o.title ? void 0 : le.getTitleId(e.context),
        "aria-describedby": o.description ? le.getDescriptionId(e.context) : void 0
      });
    },
    getTitleProps() {
      return r.element({
        ...pr.title.attrs,
        dir: e.context.dir,
        id: le.getTitleId(e.context)
      });
    },
    getDescriptionProps() {
      return r.element({
        ...pr.description.attrs,
        dir: e.context.dir,
        id: le.getDescriptionId(e.context)
      });
    },
    getCloseTriggerProps() {
      return r.button({
        ...pr.closeTrigger.attrs,
        dir: e.context.dir,
        id: le.getCloseTriggerId(e.context),
        type: "button",
        onClick(n) {
          n.defaultPrevented || (n.stopPropagation(), t("CLOSE"));
        }
      });
    }
  };
}
function Hy(e) {
  const t = za(e);
  return eh(
    {
      id: "dialog",
      initial: t.open ? "open" : "closed",
      context: {
        role: "dialog",
        renderedElements: {
          title: !0,
          description: !0
        },
        modal: !0,
        trapFocus: !0,
        preventScroll: !0,
        closeOnInteractOutside: !0,
        closeOnEscape: !0,
        restoreFocus: !0,
        ...t
      },
      created: ["setAlertDialogProps"],
      watch: {
        open: ["toggleVisibility"]
      },
      states: {
        open: {
          entry: ["checkRenderedElements", "syncZIndex"],
          activities: ["trackDismissableElement", "trapFocus", "preventScroll", "hideContentBelow"],
          on: {
            "CONTROLLED.CLOSE": {
              target: "closed"
            },
            CLOSE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                target: "closed",
                actions: ["invokeOnClose"]
              }
            ],
            TOGGLE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnClose"]
              },
              {
                target: "closed",
                actions: ["invokeOnClose"]
              }
            ]
          }
        },
        closed: {
          on: {
            "CONTROLLED.OPEN": {
              target: "open"
            },
            OPEN: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen"]
              }
            ],
            TOGGLE: [
              {
                guard: "isOpenControlled",
                actions: ["invokeOnOpen"]
              },
              {
                target: "open",
                actions: ["invokeOnOpen"]
              }
            ]
          }
        }
      }
    },
    {
      guards: {
        isOpenControlled: (r) => !!r["open.controlled"]
      },
      activities: {
        trackDismissableElement(r, a, { send: i }) {
          return xy(() => le.getContentEl(r), {
            defer: !0,
            pointerBlocking: r.modal,
            exclude: [le.getTriggerEl(r)],
            onInteractOutside(n) {
              var l;
              (l = r.onInteractOutside) == null || l.call(r, n), r.closeOnInteractOutside || n.preventDefault();
            },
            persistentElements: r.persistentElements,
            onFocusOutside: r.onFocusOutside,
            onPointerDownOutside: r.onPointerDownOutside,
            onEscapeKeyDown(n) {
              var l;
              (l = r.onEscapeKeyDown) == null || l.call(r, n), r.closeOnEscape || n.preventDefault();
            },
            onDismiss() {
              i({ type: "CLOSE", src: "interact-outside" });
            }
          });
        },
        preventScroll(r) {
          if (r.preventScroll)
            return jy(le.getDoc(r));
        },
        trapFocus(r) {
          return !r.trapFocus || !r.modal ? void 0 : By(() => le.getContentEl(r), {
            preventScroll: !0,
            returnFocusOnDeactivate: !!r.restoreFocus,
            initialFocus: r.initialFocusEl,
            setReturnFocus: (i) => {
              var o;
              return ((o = r.finalFocusEl) == null ? void 0 : o.call(r)) ?? i;
            }
          });
        },
        hideContentBelow(r) {
          return r.modal ? Ay(() => [le.getContentEl(r)], { defer: !0 }) : void 0;
        }
      },
      actions: {
        setAlertDialogProps(r) {
          r.role === "alertdialog" && (r.initialFocusEl || (r.initialFocusEl = () => le.getCloseTriggerEl(r)), r.closeOnInteractOutside = !1);
        },
        checkRenderedElements(r) {
          Sr(() => {
            r.renderedElements.title = !!le.getTitleEl(r), r.renderedElements.description = !!le.getDescriptionEl(r);
          });
        },
        syncZIndex(r) {
          Sr(() => {
            const a = le.getContentEl(r);
            if (!a) return;
            const i = w1(a);
            [le.getPositionerEl(r), le.getBackdropEl(r)].forEach((n) => {
              n == null || n.style.setProperty("--z-index", i.zIndex);
            });
          });
        },
        invokeOnClose(r) {
          var a;
          (a = r.onOpenChange) == null || a.call(r, { open: !1 });
        },
        invokeOnOpen(r) {
          var a;
          (a = r.onOpenChange) == null || a.call(r, { open: !0 });
        },
        toggleVisibility(r, a, { send: i }) {
          i({ type: r.open ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE", previousEvent: a });
        }
      }
    }
  );
}
ge()([
  "aria-label",
  "closeOnEscape",
  "closeOnInteractOutside",
  "dir",
  "finalFocusEl",
  "getRootNode",
  "getRootNode",
  "id",
  "id",
  "ids",
  "initialFocusEl",
  "modal",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "open.controlled",
  "open",
  "persistentElements",
  "preventScroll",
  "restoreFocus",
  "role",
  "trapFocus"
]);
const Uy = (e = {}) => {
  const { getRootNode: t } = sh(), { dir: r } = eb(), a = {
    id: jv(),
    getRootNode: t,
    dir: r,
    open: e.defaultOpen,
    "open.controlled": e.open !== void 0,
    ...e
  }, i = {
    ...a,
    open: e.open,
    onOpenChange: ki(e.onOpenChange, { sync: !0 }),
    onEscapeKeyDown: ki(e.onEscapeKeyDown),
    onInteractOutside: ki(e.onInteractOutside)
  }, [o, n] = ih(Hy(a), { context: i });
  return Vy(o, n, Xb);
}, Gy = (e) => {
  const [t, { children: r, ...a }] = rh(e), [i] = hh(t), o = Uy(a), n = Qn($t({ present: o.open }, t));
  return /* @__PURE__ */ C.jsx(vh, { value: o, children: /* @__PURE__ */ C.jsx(uh, { value: i, children: /* @__PURE__ */ C.jsx(oh, { value: n, children: r }) }) });
}, Yy = (e) => {
  const [t, { value: r, children: a }] = rh(e), [i] = hh(t), o = Qn($t({ present: r.open }, t));
  return /* @__PURE__ */ C.jsx(vh, { value: r, children: /* @__PURE__ */ C.jsx(uh, { value: i, children: /* @__PURE__ */ C.jsx(oh, { value: o, children: a }) }) });
}, _h = V((e, t) => {
  const r = fr(), a = $t(r.getTitleProps(), e);
  return /* @__PURE__ */ C.jsx(hr.h2, { ...a, ref: t });
});
_h.displayName = "DialogTitle";
const Sh = V((e, t) => {
  const r = fr(), a = el(), i = $t(
    {
      ...r.getTriggerProps(),
      "aria-controls": a.unmounted ? void 0 : r.getTriggerProps()["aria-controls"]
    },
    e
  );
  return /* @__PURE__ */ C.jsx(hr.button, { ...i, ref: t });
});
Sh.displayName = "DialogTrigger";
var wh = Z("editable").parts(
  "root",
  "area",
  "label",
  "preview",
  "input",
  "editTrigger",
  "submitTrigger",
  "cancelTrigger",
  "control"
);
wh.build();
var Tt = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `editable:${e.id}`;
  },
  getAreaId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.area) ?? `editable:${e.id}:area`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `editable:${e.id}:label`;
  },
  getPreviewId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.preview) ?? `editable:${e.id}:preview`;
  },
  getInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.input) ?? `editable:${e.id}:input`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `editable:${e.id}:control`;
  },
  getSubmitTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.submitTrigger) ?? `editable:${e.id}:submit`;
  },
  getCancelTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.cancelTrigger) ?? `editable:${e.id}:cancel`;
  },
  getEditTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.editTrigger) ?? `editable:${e.id}:edit`;
  },
  getInputEl: (e) => Tt.getById(e, Tt.getInputId(e)),
  getPreviewEl: (e) => Tt.getById(e, Tt.getPreviewId(e)),
  getSubmitTriggerEl: (e) => Tt.getById(e, Tt.getSubmitTriggerId(e)),
  getCancelTriggerEl: (e) => Tt.getById(e, Tt.getCancelTriggerId(e)),
  getEditTriggerEl: (e) => Tt.getById(e, Tt.getEditTriggerId(e))
});
ge()([
  "activationMode",
  "autoResize",
  "dir",
  "disabled",
  "finalFocusEl",
  "form",
  "getRootNode",
  "id",
  "ids",
  "invalid",
  "maxLength",
  "name",
  "onEditChange",
  "onFocusOutside",
  "onInteractOutside",
  "onPointerDownOutside",
  "onValueChange",
  "onValueCommit",
  "onValueRevert",
  "placeholder",
  "readOnly",
  "required",
  "selectOnFocus",
  "edit",
  "edit.controlled",
  "submitMode",
  "translations",
  "value"
]);
const $h = V((e, t) => {
  const r = $y(), a = $t(r == null ? void 0 : r.getInputProps(), e);
  return /* @__PURE__ */ C.jsx(hr.input, { ...a, ref: t });
});
$h.displayName = "FieldInput";
const Eh = Z("field").parts(
  "root",
  "errorText",
  "helperText",
  "input",
  "label",
  "select",
  "textarea",
  "requiredIndicator"
);
Eh.build();
const Ph = Z("fieldset").parts(
  "root",
  "errorText",
  "helperText",
  "legend"
);
Ph.build();
var Ch = Z("file-upload").parts(
  "root",
  "dropzone",
  "item",
  "itemDeleteTrigger",
  "itemGroup",
  "itemName",
  "itemPreview",
  "itemPreviewImage",
  "itemSizeText",
  "label",
  "trigger",
  "clearTrigger"
);
Ch.build();
var Lr = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `file:${e.id}`;
  },
  getDropzoneId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.dropzone) ?? `file:${e.id}:dropzone`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `file:${e.id}:input`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `file:${e.id}:trigger`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `file:${e.id}:label`;
  },
  getItemId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.item) == null ? void 0 : a.call(r, t)) ?? `file:${e.id}:item:${t}`;
  },
  getItemNameId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemName) == null ? void 0 : a.call(r, t)) ?? `file:${e.id}:item-name:${t}`;
  },
  getItemSizeTextId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemSizeText) == null ? void 0 : a.call(r, t)) ?? `file:${e.id}:item-size:${t}`;
  },
  getItemPreviewId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemPreview) == null ? void 0 : a.call(r, t)) ?? `file:${e.id}:item-preview:${t}`;
  },
  getRootEl: (e) => Lr.getById(e, Lr.getRootId(e)),
  getHiddenInputEl: (e) => Lr.getById(e, Lr.getHiddenInputId(e)),
  getDropzoneEl: (e) => Lr.getById(e, Lr.getDropzoneId(e))
});
ge()([
  "accept",
  "allowDrop",
  "capture",
  "dir",
  "directory",
  "disabled",
  "getRootNode",
  "id",
  "ids",
  "locale",
  "maxFiles",
  "maxFileSize",
  "minFileSize",
  "name",
  "invalid",
  "onFileAccept",
  "onFileReject",
  "onFileChange",
  "preventDocumentDrop",
  "required",
  "translations",
  "validate"
]);
ge()(["file"]);
var Th = (e, t) => {
  const r = [], a = (i, o, n) => {
    o - i > 0 && r.push({ start: i, end: o, match: n });
  };
  if (e.length === 0)
    a(0, t, !1);
  else {
    let i = 0;
    for (const o of e)
      a(i, o.start, !1), a(o.start, o.end, !0), i = o.end;
    a(i, t, !1);
  }
  return r;
};
function qy(e) {
  const { text: t, query: r, ignoreCase: a } = e, i = a ? t.toLowerCase() : t, o = a && typeof r == "string" ? r.toLowerCase() : r, n = typeof i == "string" ? i.indexOf(o) : -1;
  if (n === -1)
    return [{ text: t, match: !1 }];
  const l = n + o.length;
  return Th([{ start: n, end: l }], t.length).map((d) => ({
    text: t.slice(d.start, d.end),
    match: !!d.match
  }));
}
var Xy = (e) => e.replace(/[|\\{}()[\]^$+*?.-]/g, (t) => `\\${t}`), Zy = (e, t) => {
  const r = e.filter(Boolean).map((a) => Xy(a));
  return new RegExp(`(${r.join("|")})`, t);
}, Jy = (e, t = !0) => `${e ? "i" : ""}${t ? "g" : ""}`;
function Qy(e) {
  const { text: t, query: r, ignoreCase: a, matchAll: i } = e;
  if (r.length === 0)
    return [{ text: t, match: !1 }];
  const o = Jy(a, i), n = Zy(Array.isArray(r) ? r : [r], o), l = [...t.matchAll(n)].map((s) => ({
    start: s.index || 0,
    end: (s.index || 0) + s[0].length
  }));
  return Th(l, e.text.length).map((s) => ({
    text: e.text.slice(s.start, s.end),
    match: !!s.match
  }));
}
var e2 = (e) => {
  if (e.matchAll == null && (e.matchAll = Array.isArray(e.query)), !e.matchAll && Array.isArray(e.query))
    throw new Error("matchAll must be true when using multiple queries");
  return e.matchAll ? Qy(e) : qy(e);
};
const t2 = (e) => G(() => e2(e), [e]);
var Ih = Z("hoverCard").parts("arrow", "arrowTip", "trigger", "positioner", "content");
Ih.build();
var Mr = Re({
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `hover-card:${e.id}:trigger`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `hover-card:${e.id}:content`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `hover-card:${e.id}:popper`;
  },
  getArrowId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.arrow) ?? `hover-card:${e.id}:arrow`;
  },
  getTriggerEl: (e) => Mr.getById(e, Mr.getTriggerId(e)),
  getContentEl: (e) => Mr.getById(e, Mr.getContentId(e)),
  getPositionerEl: (e) => Mr.getById(e, Mr.getPositionerId(e))
});
ge()([
  "closeDelay",
  "dir",
  "getRootNode",
  "id",
  "ids",
  "onOpenChange",
  "open.controlled",
  "open",
  "openDelay",
  "positioning"
]);
var Rh = Z("menu").parts(
  "arrow",
  "arrowTip",
  "content",
  "contextTrigger",
  "indicator",
  "item",
  "itemGroup",
  "itemGroupLabel",
  "itemIndicator",
  "itemText",
  "positioner",
  "separator",
  "trigger",
  "triggerItem"
);
Rh.build();
var qe = Re({
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `menu:${e.id}:trigger`;
  },
  getContextTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.contextTrigger) ?? `menu:${e.id}:ctx-trigger`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `menu:${e.id}:content`;
  },
  getArrowId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.arrow) ?? `menu:${e.id}:arrow`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `menu:${e.id}:popper`;
  },
  getGroupId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.group) == null ? void 0 : a.call(r, t)) ?? `menu:${e.id}:group:${t}`;
  },
  getGroupLabelId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.groupLabel) == null ? void 0 : a.call(r, t)) ?? `menu:${e.id}:group-label:${t}`;
  },
  getContentEl: (e) => qe.getById(e, qe.getContentId(e)),
  getPositionerEl: (e) => qe.getById(e, qe.getPositionerId(e)),
  getTriggerEl: (e) => qe.getById(e, qe.getTriggerId(e)),
  getHighlightedItemEl: (e) => e.highlightedValue ? qe.getById(e, e.highlightedValue) : null,
  getArrowEl: (e) => qe.getById(e, qe.getArrowId(e)),
  getElements: (e) => {
    const r = `[role^="menuitem"][data-ownedby=${CSS.escape(qe.getContentId(e))}]:not([data-disabled])`;
    return Ht(qe.getContentEl(e), r);
  },
  getFirstEl: (e) => Hu(qe.getElements(e)),
  getLastEl: (e) => Uu(qe.getElements(e)),
  getNextEl: (e, t) => Au(qe.getElements(e), e.highlightedValue, t ?? e.loopFocus),
  getPrevEl: (e, t) => zu(qe.getElements(e), e.highlightedValue, t ?? e.loopFocus),
  getElemByKey: (e, t) => Y1(qe.getElements(e), { state: e.typeaheadState, key: t, activeId: e.highlightedValue }),
  isTargetDisabled: (e) => Je(e) && (e.dataset.disabled === "" || e.hasAttribute("disabled")),
  isTriggerItem: (e) => {
    var t;
    return !!((t = e == null ? void 0 : e.getAttribute("role")) != null && t.startsWith("menuitem")) && !!(e != null && e.hasAttribute("aria-controls"));
  },
  getOptionFromItemEl(e) {
    return {
      id: e.id,
      name: e.dataset.name,
      value: e.dataset.value,
      valueText: e.dataset.valueText,
      type: e.dataset.type
    };
  }
});
ge()([
  "anchorPoint",
  "aria-label",
  "closeOnSelect",
  "composite",
  "dir",
  "getRootNode",
  "highlightedValue",
  "id",
  "ids",
  "loopFocus",
  "navigate",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onHighlightChange",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onSelect",
  "open.controlled",
  "open",
  "positioning",
  "typeahead"
]);
ge()(["closeOnSelect", "disabled", "value", "valueText"]);
ge()(["htmlFor"]);
ge()(["id"]);
ge()([
  "disabled",
  "valueText",
  "closeOnSelect",
  "type",
  "value",
  "checked",
  "onCheckedChange"
]);
let ko = /* @__PURE__ */ new Map(), rn = !1;
try {
  rn = new Intl.NumberFormat("de-DE", {
    signDisplay: "exceptZero"
  }).resolvedOptions().signDisplay === "exceptZero";
} catch {
}
let Di = !1;
try {
  Di = new Intl.NumberFormat("de-DE", {
    style: "unit",
    unit: "degree"
  }).resolvedOptions().style === "unit";
} catch {
}
const Dh = {
  degree: {
    narrow: {
      default: "°",
      "ja-JP": " 度",
      "zh-TW": "度",
      "sl-SI": " °"
    }
  }
};
class r2 {
  /** Formats a number value as a string, according to the locale and options provided to the constructor. */
  format(t) {
    let r = "";
    if (!rn && this.options.signDisplay != null ? r = i2(this.numberFormatter, this.options.signDisplay, t) : r = this.numberFormatter.format(t), this.options.style === "unit" && !Di) {
      var a;
      let { unit: i, unitDisplay: o = "short", locale: n } = this.resolvedOptions();
      if (!i) return r;
      let l = (a = Dh[i]) === null || a === void 0 ? void 0 : a[o];
      r += l[n] || l.default;
    }
    return r;
  }
  /** Formats a number to an array of parts such as separators, digits, punctuation, and more. */
  formatToParts(t) {
    return this.numberFormatter.formatToParts(t);
  }
  /** Formats a number range as a string. */
  formatRange(t, r) {
    if (typeof this.numberFormatter.formatRange == "function") return this.numberFormatter.formatRange(t, r);
    if (r < t) throw new RangeError("End date must be >= start date");
    return `${this.format(t)} – ${this.format(r)}`;
  }
  /** Formats a number range as an array of parts. */
  formatRangeToParts(t, r) {
    if (typeof this.numberFormatter.formatRangeToParts == "function") return this.numberFormatter.formatRangeToParts(t, r);
    if (r < t) throw new RangeError("End date must be >= start date");
    let a = this.numberFormatter.formatToParts(t), i = this.numberFormatter.formatToParts(r);
    return [
      ...a.map((o) => ({
        ...o,
        source: "startRange"
      })),
      {
        type: "literal",
        value: " – ",
        source: "shared"
      },
      ...i.map((o) => ({
        ...o,
        source: "endRange"
      }))
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */
  resolvedOptions() {
    let t = this.numberFormatter.resolvedOptions();
    return !rn && this.options.signDisplay != null && (t = {
      ...t,
      signDisplay: this.options.signDisplay
    }), !Di && this.options.style === "unit" && (t = {
      ...t,
      style: "unit",
      unit: this.options.unit,
      unitDisplay: this.options.unitDisplay
    }), t;
  }
  constructor(t, r = {}) {
    this.numberFormatter = a2(t, r), this.options = r;
  }
}
function a2(e, t = {}) {
  let { numberingSystem: r } = t;
  if (r && e.includes("-nu-") && (e.includes("-u-") || (e += "-u-"), e += `-nu-${r}`), t.style === "unit" && !Di) {
    var a;
    let { unit: n, unitDisplay: l = "short" } = t;
    if (!n) throw new Error('unit option must be provided with style: "unit"');
    if (!(!((a = Dh[n]) === null || a === void 0) && a[l])) throw new Error(`Unsupported unit ${n} with unitDisplay = ${l}`);
    t = {
      ...t,
      style: "decimal"
    };
  }
  let i = e + (t ? Object.entries(t).sort((n, l) => n[0] < l[0] ? -1 : 1).join() : "");
  if (ko.has(i)) return ko.get(i);
  let o = new Intl.NumberFormat(e, t);
  return ko.set(i, o), o;
}
function i2(e, t, r) {
  if (t === "auto") return e.format(r);
  if (t === "never") return e.format(Math.abs(r));
  {
    let a = !1;
    if (t === "always" ? a = r > 0 || Object.is(r, 0) : t === "exceptZero" && (Object.is(r, -0) || Object.is(r, 0) ? r = Math.abs(r) : a = r > 0), a) {
      let i = e.format(-r), o = e.format(r), n = i.replace(o, "").replace(/\u200e|\u061C/, "");
      return [
        ...n
      ].length !== 1 && console.warn("@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case"), i.replace(o, "!!!").replace(n, "+").replace("!!!", o);
    } else return e.format(r);
  }
}
var Ah = Z("numberInput").parts(
  "root",
  "label",
  "input",
  "control",
  "valueText",
  "incrementTrigger",
  "decrementTrigger",
  "scrubber"
);
Ah.build();
var Ne = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `number-input:${e.id}`;
  },
  getInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.input) ?? `number-input:${e.id}:input`;
  },
  getIncrementTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.incrementTrigger) ?? `number-input:${e.id}:inc`;
  },
  getDecrementTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.decrementTrigger) ?? `number-input:${e.id}:dec`;
  },
  getScrubberId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.scrubber) ?? `number-input:${e.id}:scrubber`;
  },
  getCursorId: (e) => `number-input:${e.id}:cursor`,
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `number-input:${e.id}:label`;
  },
  getInputEl: (e) => Ne.getById(e, Ne.getInputId(e)),
  getIncrementTriggerEl: (e) => Ne.getById(e, Ne.getIncrementTriggerId(e)),
  getDecrementTriggerEl: (e) => Ne.getById(e, Ne.getDecrementTriggerId(e)),
  getScrubberEl: (e) => Ne.getById(e, Ne.getScrubberId(e)),
  getCursorEl: (e) => Ne.getDoc(e).getElementById(Ne.getCursorId(e)),
  getPressedTriggerEl: (e, t = e.hint) => {
    let r = null;
    return t === "increment" && (r = Ne.getIncrementTriggerEl(e)), t === "decrement" && (r = Ne.getDecrementTriggerEl(e)), r;
  },
  setupVirtualCursor(e) {
    if (!C1())
      return Ne.createVirtualCursor(e), () => {
        var t;
        (t = Ne.getCursorEl(e)) == null || t.remove();
      };
  },
  preventTextSelection(e) {
    const t = Ne.getDoc(e), r = t.documentElement, a = t.body;
    return a.style.pointerEvents = "none", r.style.userSelect = "none", r.style.cursor = "ew-resize", () => {
      a.style.pointerEvents = "", r.style.userSelect = "", r.style.cursor = "", r.style.length || r.removeAttribute("style"), a.style.length || a.removeAttribute("style");
    };
  },
  getMousemoveValue(e, t) {
    const r = Ne.getWin(e), a = vo(t.movementX, r.devicePixelRatio), i = vo(t.movementY, r.devicePixelRatio);
    let o = a > 0 ? "increment" : a < 0 ? "decrement" : null;
    e.isRtl && o === "increment" && (o = "decrement"), e.isRtl && o === "decrement" && (o = "increment");
    const n = {
      x: e.scrubberCursorPoint.x + a,
      y: e.scrubberCursorPoint.y + i
    }, l = r.innerWidth, s = vo(7.5, r.devicePixelRatio);
    return n.x = Cb(n.x + s, l) - s, { hint: o, point: n };
  },
  createVirtualCursor(e) {
    const t = Ne.getDoc(e), r = t.createElement("div");
    r.className = "scrubber--cursor", r.id = Ne.getCursorId(e), Object.assign(r.style, {
      width: "15px",
      height: "15px",
      position: "fixed",
      pointerEvents: "none",
      left: "0px",
      top: "0px",
      zIndex: u1,
      transform: e.scrubberCursorPoint ? `translate3d(${e.scrubberCursorPoint.x}px, ${e.scrubberCursorPoint.y}px, 0px)` : void 0,
      willChange: "transform"
    }), r.innerHTML = `
        <svg width="46" height="15" style="left: -15.5px; position: absolute; top: 0; filter: drop-shadow(rgba(0, 0, 0, 0.4) 0px 1px 1.1px);">
          <g transform="translate(2 3)">
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z" style="stroke-width: 2px; stroke: white;"></path>
            <path fill-rule="evenodd" d="M 15 4.5L 15 2L 11.5 5.5L 15 9L 15 6.5L 31 6.5L 31 9L 34.5 5.5L 31 2L 31 4.5Z"></path>
          </g>
        </svg>`, t.body.appendChild(r);
  }
}), zh = Z("pinInput").parts("root", "label", "input", "control");
zh.build();
var It = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `pin-input:${e.id}`;
  },
  getInputId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.input) == null ? void 0 : a.call(r, t)) ?? `pin-input:${e.id}:${t}`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `pin-input:${e.id}:hidden`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `pin-input:${e.id}:label`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `pin-input:${e.id}:control`;
  },
  getRootEl: (e) => It.getById(e, It.getRootId(e)),
  getInputEls: (e) => {
    const r = `input[data-ownedby=${CSS.escape(It.getRootId(e))}]`;
    return Ht(It.getRootEl(e), r);
  },
  getInputEl: (e, t) => It.getById(e, It.getInputId(e, t)),
  getFocusedInputEl: (e) => It.getInputEls(e)[e.focusedIndex],
  getFirstInputEl: (e) => It.getInputEls(e)[0],
  getHiddenInputEl: (e) => It.getById(e, It.getHiddenInputId(e))
}), Oh = Z("popover").parts(
  "arrow",
  "arrowTip",
  "anchor",
  "trigger",
  "indicator",
  "positioner",
  "content",
  "title",
  "description",
  "closeTrigger"
);
Oh.build();
var rt = Re({
  getAnchorId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.anchor) ?? `popover:${e.id}:anchor`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `popover:${e.id}:trigger`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `popover:${e.id}:content`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `popover:${e.id}:popper`;
  },
  getArrowId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.arrow) ?? `popover:${e.id}:arrow`;
  },
  getTitleId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.title) ?? `popover:${e.id}:title`;
  },
  getDescriptionId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.description) ?? `popover:${e.id}:desc`;
  },
  getCloseTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.closeTrigger) ?? `popover:${e.id}:close`;
  },
  getAnchorEl: (e) => rt.getById(e, rt.getAnchorId(e)),
  getTriggerEl: (e) => rt.getById(e, rt.getTriggerId(e)),
  getContentEl: (e) => rt.getById(e, rt.getContentId(e)),
  getPositionerEl: (e) => rt.getById(e, rt.getPositionerId(e)),
  getTitleEl: (e) => rt.getById(e, rt.getTitleId(e)),
  getDescriptionEl: (e) => rt.getById(e, rt.getDescriptionId(e)),
  getFocusableEls: (e) => Hn(rt.getContentEl(e)),
  getFirstFocusableEl: (e) => rt.getFocusableEls(e)[0]
});
ge()([
  "autoFocus",
  "closeOnEscape",
  "closeOnInteractOutside",
  "dir",
  "getRootNode",
  "id",
  "ids",
  "initialFocusEl",
  "modal",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "open.controlled",
  "open",
  "persistentElements",
  "portalled",
  "positioning"
]);
const o2 = (e) => {
  var s;
  const { children: t, disabled: r } = e, [a, i] = se((s = e.container) == null ? void 0 : s.current), o = au(
    l2,
    () => !1,
    () => !0
  ), { getRootNode: n } = sh();
  if (ee(() => {
    i(() => {
      var d;
      return (d = e.container) == null ? void 0 : d.current;
    });
  }, [e.container]), o || r) return /* @__PURE__ */ C.jsx(C.Fragment, { children: t });
  const l = a ?? n2(n);
  return /* @__PURE__ */ C.jsx(C.Fragment, { children: Wi.map(t, (d) => Dn(d, l)) });
}, n2 = (e) => {
  const t = e == null ? void 0 : e(), r = t.getRootNode();
  return Aa(r) ? r : Zt(t).body;
}, l2 = () => () => {
};
var rl = Z("progress").parts(
  "root",
  "label",
  "track",
  "range",
  "valueText",
  "view",
  "circle",
  "circleTrack",
  "circleRange"
);
rl.build();
Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `progress-${e.id}`;
  },
  getTrackId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.track) ?? `progress-${e.id}-track`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `progress-${e.id}-label`;
  },
  getCircleId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.circle) ?? `progress-${e.id}-circle`;
  }
});
ge()([
  "dir",
  "getRootNode",
  "id",
  "ids",
  "max",
  "min",
  "orientation",
  "translations",
  "value",
  "onValueChange"
]);
var Fh = Z("qr-code").parts("root", "frame", "pattern", "overlay", "downloadTrigger");
Fh.build();
var Ts = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `qrcode:${e.id}:root`;
  },
  getFrameId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.frame) ?? `qrcode:${e.id}:frame`;
  },
  getFrameEl: (e) => Ts.getById(e, Ts.getFrameId(e))
});
ge()([
  "ids",
  "value",
  "id",
  "encoding",
  "dir",
  "getRootNode",
  "onValueChange"
]);
var al = Z("radio-group").parts(
  "root",
  "label",
  "item",
  "itemText",
  "itemControl",
  "indicator"
);
al.build();
var Xe = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `radio-group:${e.id}`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `radio-group:${e.id}:label`;
  },
  getItemId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.item) == null ? void 0 : a.call(r, t)) ?? `radio-group:${e.id}:radio:${t}`;
  },
  getItemHiddenInputId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemHiddenInput) == null ? void 0 : a.call(r, t)) ?? `radio-group:${e.id}:radio:input:${t}`;
  },
  getItemControlId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemControl) == null ? void 0 : a.call(r, t)) ?? `radio-group:${e.id}:radio:control:${t}`;
  },
  getItemLabelId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemLabel) == null ? void 0 : a.call(r, t)) ?? `radio-group:${e.id}:radio:label:${t}`;
  },
  getIndicatorId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.indicator) ?? `radio-group:${e.id}:indicator`;
  },
  getRootEl: (e) => Xe.getById(e, Xe.getRootId(e)),
  getItemHiddenInputEl: (e, t) => Xe.getById(e, Xe.getItemHiddenInputId(e, t)),
  getIndicatorEl: (e) => Xe.getById(e, Xe.getIndicatorId(e)),
  getFirstEnabledInputEl: (e) => {
    var t;
    return (t = Xe.getRootEl(e)) == null ? void 0 : t.querySelector("input:not(:disabled)");
  },
  getFirstEnabledAndCheckedInputEl: (e) => {
    var t;
    return (t = Xe.getRootEl(e)) == null ? void 0 : t.querySelector("input:not(:disabled):checked");
  },
  getInputEls: (e) => {
    const r = `input[type=radio][data-ownedby='${CSS.escape(Xe.getRootId(e))}']:not([disabled])`;
    return Ht(Xe.getRootEl(e), r);
  },
  getActiveRadioEl: (e) => {
    if (e.value)
      return Xe.getById(e, Xe.getItemId(e, e.value));
  },
  getOffsetRect: (e) => ({
    left: (e == null ? void 0 : e.offsetLeft) ?? 0,
    top: (e == null ? void 0 : e.offsetTop) ?? 0,
    width: (e == null ? void 0 : e.offsetWidth) ?? 0,
    height: (e == null ? void 0 : e.offsetHeight) ?? 0
  }),
  getRectById: (e, t) => {
    const r = Xe.getById(e, Xe.getItemId(e, t));
    if (r)
      return Xe.resolveRect(Xe.getOffsetRect(r));
  },
  resolveRect: (e) => ({
    width: `${e.width}px`,
    height: `${e.height}px`,
    left: `${e.left}px`,
    top: `${e.top}px`
  })
});
ge()([
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "id",
  "ids",
  "name",
  "onValueChange",
  "orientation",
  "readOnly",
  "value"
]);
ge()(["value", "disabled", "invalid"]);
var Nh = Z("rating-group").parts("root", "label", "item", "control");
Nh.build();
var er = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `rating:${e.id}`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `rating:${e.id}:label`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `rating:${e.id}:input`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `rating:${e.id}:control`;
  },
  getItemId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.item) == null ? void 0 : a.call(r, t)) ?? `rating:${e.id}:item:${t}`;
  },
  getRootEl: (e) => er.getById(e, er.getRootId(e)),
  getControlEl: (e) => er.getById(e, er.getControlId(e)),
  getRadioEl: (e, t = e.value) => {
    const r = `[role=radio][aria-posinset='${Math.ceil(t)}']`;
    return M1(er.getControlEl(e), r);
  },
  getHiddenInputEl: (e) => er.getById(e, er.getHiddenInputId(e)),
  dispatchChangeEvent: (e) => {
    const t = er.getHiddenInputEl(e);
    t && Iu(t, { value: e.value });
  }
});
ge()([
  "allowHalf",
  "autoFocus",
  "count",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "id",
  "ids",
  "name",
  "onHoverChange",
  "onValueChange",
  "required",
  "readOnly",
  "translations",
  "value"
]);
ge()(["index"]);
const Lh = al.rename("segment-group");
Lh.build();
var Mh = Z("select").parts(
  "label",
  "positioner",
  "trigger",
  "indicator",
  "clearTrigger",
  "item",
  "itemText",
  "itemIndicator",
  "itemGroup",
  "itemGroupLabel",
  "list",
  "content",
  "root",
  "control",
  "valueText"
);
Mh.build();
var at = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `select:${e.id}`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `select:${e.id}:content`;
  },
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `select:${e.id}:trigger`;
  },
  getClearTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.clearTrigger) ?? `select:${e.id}:clear-trigger`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `select:${e.id}:label`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `select:${e.id}:control`;
  },
  getItemId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.item) == null ? void 0 : a.call(r, t)) ?? `select:${e.id}:option:${t}`;
  },
  getHiddenSelectId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenSelect) ?? `select:${e.id}:select`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `select:${e.id}:positioner`;
  },
  getItemGroupId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemGroup) == null ? void 0 : a.call(r, t)) ?? `select:${e.id}:optgroup:${t}`;
  },
  getItemGroupLabelId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.itemGroupLabel) == null ? void 0 : a.call(r, t)) ?? `select:${e.id}:optgroup-label:${t}`;
  },
  getHiddenSelectEl: (e) => at.getById(e, at.getHiddenSelectId(e)),
  getContentEl: (e) => at.getById(e, at.getContentId(e)),
  getControlEl: (e) => at.getById(e, at.getControlId(e)),
  getTriggerEl: (e) => at.getById(e, at.getTriggerId(e)),
  getClearTriggerEl: (e) => at.getById(e, at.getClearTriggerId(e)),
  getPositionerEl: (e) => at.getById(e, at.getPositionerId(e)),
  getHighlightedOptionEl(e) {
    return e.highlightedValue ? at.getById(e, at.getItemId(e, e.highlightedValue)) : null;
  }
});
ge()([
  "closeOnSelect",
  "collection",
  "dir",
  "disabled",
  "deselectable",
  "form",
  "getRootNode",
  "highlightedValue",
  "id",
  "ids",
  "invalid",
  "loopFocus",
  "multiple",
  "name",
  "onFocusOutside",
  "onHighlightChange",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onValueChange",
  "open.controlled",
  "open",
  "composite",
  "positioning",
  "required",
  "readOnly",
  "scrollToIndexFn",
  "value"
]);
ge()(["item", "persistFocus"]);
ge()(["id"]);
ge()(["htmlFor"]);
var Bh = Z("slider").parts(
  "root",
  "label",
  "thumb",
  "valueText",
  "track",
  "range",
  "control",
  "markerGroup",
  "marker",
  "draggingIndicator"
);
Bh.build();
function s2(e) {
  const t = e[0], r = e[e.length - 1];
  return [t, r];
}
function d2(e) {
  const [t, r] = s2(e.valuePercent);
  if (e.valuePercent.length === 1) {
    if (e.origin === "center") {
      const a = e.valuePercent[0] < 50, i = a ? `${e.valuePercent[0]}%` : "50%", o = a ? "50%" : `${100 - e.valuePercent[0]}%`;
      return { start: i, end: o };
    }
    return { start: "0%", end: `${100 - r}%` };
  }
  return { start: `${t}%`, end: `${100 - r}%` };
}
function c2(e) {
  return e.isVertical ? {
    position: "absolute",
    bottom: "var(--slider-range-start)",
    top: "var(--slider-range-end)"
  } : {
    position: "absolute",
    [e.isRtl ? "right" : "left"]: "var(--slider-range-start)",
    [e.isRtl ? "left" : "right"]: "var(--slider-range-end)"
  };
}
function u2(e) {
  const { height: t = 0 } = e.thumbSize ?? {}, r = tn([e.min, e.max], [-t / 2, t / 2]);
  return parseFloat(r(e.value).toFixed(2));
}
function h2(e) {
  const { width: t = 0 } = e.thumbSize ?? {};
  if (e.isRtl) {
    const a = tn([e.max, e.min], [-t / 2, t / 2]);
    return -1 * parseFloat(a(e.value).toFixed(2));
  }
  const r = tn([e.min, e.max], [-t / 2, t / 2]);
  return parseFloat(r(e.value).toFixed(2));
}
function f2(e, t) {
  if (e.thumbAlignment === "center") return `${t}%`;
  const r = e.isVertical ? u2(e) : h2(e);
  return `calc(${t}% - ${r}px)`;
}
function Kh(e) {
  let t = Rb(e.value, e.min, e.max) * 100;
  return f2(e, t);
}
function Wh(e) {
  let t = "visible";
  return e.thumbAlignment === "contain" && !e.hasMeasuredThumbSize && (t = "hidden"), t;
}
function g2(e, t) {
  const r = e.isVertical ? "bottom" : "insetInlineStart";
  return {
    visibility: Wh(e),
    position: "absolute",
    transform: "var(--slider-thumb-transform)",
    [r]: `var(--slider-thumb-offset-${t})`
  };
}
function p2() {
  return {
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    position: "relative"
  };
}
function v2(e) {
  const t = d2(e);
  return {
    ...e.value.reduce((a, i, o) => {
      const n = Kh({ ...e, value: i });
      return { ...a, [`--slider-thumb-offset-${o}`]: n };
    }, {}),
    "--slider-thumb-transform": e.isVertical ? "translateY(50%)" : e.isRtl ? "translateX(50%)" : "translateX(-50%)",
    "--slider-range-start": t.start,
    "--slider-range-end": t.end
  };
}
function m2(e, t) {
  return {
    // @ts-expect-error
    visibility: Wh(e),
    position: "absolute",
    pointerEvents: "none",
    // @ts-expect-error
    [e.isHorizontal ? "insetInlineStart" : "bottom"]: Kh({ ...e, value: t }),
    translate: "var(--tx) var(--ty)",
    "--tx": e.isHorizontal ? e.isRtl ? "50%" : "-50%" : "0%",
    "--ty": e.isHorizontal ? "0%" : "50%"
  };
}
function b2() {
  return {
    userSelect: "none",
    WebkitUserSelect: "none",
    pointerEvents: "none",
    position: "relative"
  };
}
var y2 = {
  getRootStyle: v2,
  getControlStyle: p2,
  getThumbStyle: g2,
  getRangeStyle: c2,
  getMarkerStyle: m2,
  getMarkerGroupStyle: b2
}, it = Re({
  ...y2,
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `slider:${e.id}`;
  },
  getThumbId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.thumb) == null ? void 0 : a.call(r, t)) ?? `slider:${e.id}:thumb:${t}`;
  },
  getHiddenInputId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.hiddenInput) == null ? void 0 : a.call(r, t)) ?? `slider:${e.id}:input:${t}`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `slider:${e.id}:control`;
  },
  getTrackId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.track) ?? `slider:${e.id}:track`;
  },
  getRangeId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.range) ?? `slider:${e.id}:range`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `slider:${e.id}:label`;
  },
  getValueTextId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.valueText) ?? `slider:${e.id}:value-text`;
  },
  getMarkerId: (e, t) => {
    var r, a;
    return ((a = (r = e.ids) == null ? void 0 : r.marker) == null ? void 0 : a.call(r, t)) ?? `slider:${e.id}:marker:${t}`;
  },
  getRootEl: (e) => it.getById(e, it.getRootId(e)),
  getThumbEl: (e, t) => it.getById(e, it.getThumbId(e, t)),
  getHiddenInputEl: (e, t) => it.getById(e, it.getHiddenInputId(e, t)),
  getControlEl: (e) => it.getById(e, it.getControlId(e)),
  getElements: (e) => Ht(it.getControlEl(e), "[role=slider]"),
  getFirstEl: (e) => it.getElements(e)[0],
  getRangeEl: (e) => it.getById(e, it.getRangeId(e)),
  getValueFromPoint(e, t) {
    const r = it.getControlEl(e);
    if (!r) return;
    const i = Yo(t, r).getPercentValue({
      orientation: e.orientation,
      dir: e.dir,
      inverted: { y: !0 }
    });
    return Db(i, e.min, e.max, e.step);
  },
  dispatchChangeEvent(e) {
    Array.from(e.value).forEach((r, a) => {
      const i = it.getHiddenInputEl(e, a);
      i && Iu(i, { value: r });
    });
  }
});
ge()([
  "aria-label",
  "aria-labelledby",
  "dir",
  "disabled",
  "form",
  "getAriaValueText",
  "getRootNode",
  "id",
  "ids",
  "invalid",
  "max",
  "min",
  "minStepsBetweenThumbs",
  "name",
  "onFocusChange",
  "onValueChange",
  "onValueChangeEnd",
  "orientation",
  "origin",
  "readOnly",
  "step",
  "thumbAlignment",
  "thumbAlignment",
  "thumbSize",
  "value"
]);
ge()(["index", "name"]);
var jh = Z("switch").parts("root", "label", "control", "thumb");
jh.build();
var ii = Re({
  getRootId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.root) ?? `switch:${e.id}`;
  },
  getLabelId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.label) ?? `switch:${e.id}:label`;
  },
  getThumbId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.thumb) ?? `switch:${e.id}:thumb`;
  },
  getControlId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.control) ?? `switch:${e.id}:control`;
  },
  getHiddenInputId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.hiddenInput) ?? `switch:${e.id}:input`;
  },
  getRootEl: (e) => ii.getById(e, ii.getRootId(e)),
  getHiddenInputEl: (e) => ii.getById(e, ii.getHiddenInputId(e))
});
ge()([
  "checked",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "id",
  "ids",
  "invalid",
  "label",
  "name",
  "onCheckedChange",
  "readOnly",
  "required",
  "value"
]);
var Vh = Z("tooltip").parts("trigger", "arrow", "arrowTip", "positioner", "content");
Vh.build();
var tr = Re({
  getTriggerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.trigger) ?? `tooltip:${e.id}:trigger`;
  },
  getContentId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.content) ?? `tooltip:${e.id}:content`;
  },
  getArrowId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.arrow) ?? `tooltip:${e.id}:arrow`;
  },
  getPositionerId: (e) => {
    var t;
    return ((t = e.ids) == null ? void 0 : t.positioner) ?? `tooltip:${e.id}:popper`;
  },
  getTriggerEl: (e) => tr.getById(e, tr.getTriggerId(e)),
  getContentEl: (e) => tr.getById(e, tr.getContentId(e)),
  getPositionerEl: (e) => tr.getById(e, tr.getPositionerId(e)),
  getArrowEl: (e) => tr.getById(e, tr.getArrowId(e))
});
Yi({
  id: null,
  prevId: null,
  setId(e) {
    this.prevId = this.id, this.id = e;
  }
});
ge()([
  "aria-label",
  "closeDelay",
  "closeOnEscape",
  "closeOnPointerDown",
  "closeOnScroll",
  "closeOnClick",
  "dir",
  "disabled",
  "getRootNode",
  "id",
  "ids",
  "interactive",
  "onOpenChange",
  "open.controlled",
  "open",
  "openDelay",
  "positioning"
]);
const x2 = (e, t) => {
  var s;
  if (!e || typeof e != "string")
    return { invalid: !0, value: e };
  const [r, a] = e.split("/");
  if (!r || !a || r === "currentBg")
    return { invalid: !0, value: r };
  const i = t(`colors.${r}`), o = (s = t.raw(`opacity.${a}`)) == null ? void 0 : s.value;
  if (!o && isNaN(Number(a)))
    return { invalid: !0, value: r };
  const n = o ? Number(o) * 100 + "%" : `${a}%`, l = i ?? r;
  return {
    invalid: !1,
    color: l,
    value: `color-mix(in srgb, ${l} ${n}, transparent)`
  };
}, ke = (e) => (t, r) => {
  const a = r.utils.colorMix(t);
  if (a.invalid) return { [e]: t };
  const i = "--mix-" + e;
  return {
    [i]: a.value,
    [e]: `var(${i}, ${a.color})`
  };
};
function an(e) {
  if (e === null || typeof e != "object") return e;
  if (Array.isArray(e)) return e.map((r) => an(r));
  const t = Object.create(Object.getPrototypeOf(e));
  for (const r of Object.keys(e))
    t[r] = an(e[r]);
  return t;
}
function on(e, t) {
  if (t == null) return e;
  for (const r of Object.keys(t))
    if (!(t[r] === void 0 || r === "__proto__"))
      if (!ot(e[r]) && ot(t[r]))
        Object.assign(e, { [r]: t[r] });
      else if (e[r] && ot(t[r]))
        on(e[r], t[r]);
      else if (Array.isArray(t[r]) && Array.isArray(e[r])) {
        let a = 0;
        for (; a < t[r].length; a++)
          ot(e[r][a]) && ot(t[r][a]) ? on(e[r][a], t[r][a]) : e[r][a] = t[r][a];
      } else
        Object.assign(e, { [r]: t[r] });
  return e;
}
function ia(e, ...t) {
  for (const r of t)
    on(e, r);
  return e;
}
const k2 = (e) => e, be = (e) => e, q = (e) => e, _2 = (e) => e, Hh = (e) => e, Uh = (e) => e, Gh = (e) => e, Yh = (e) => e, qh = (e) => e;
function Xh() {
  const e = (t) => t;
  return new Proxy(e, {
    get() {
      return e;
    }
  });
}
const oe = /* @__PURE__ */ Xh(), oa = /* @__PURE__ */ Xh(), il = (e) => e, Zh = (...e) => ia({}, ...e.map(an)), S2 = /[^a-zA-Z0-9_\u0081-\uffff-]/g;
function w2(e) {
  return `${e}`.replace(S2, (t) => `\\${t}`);
}
const $2 = /[A-Z]/g;
function E2(e) {
  return e.replace($2, (t) => `-${t.toLowerCase()}`);
}
function Jh(e, t = {}) {
  const { fallback: r = "", prefix: a = "" } = t, i = E2(["-", a, w2(e)].filter(Boolean).join("-"));
  return {
    var: i,
    ref: `var(${i}${r ? `, ${r}` : ""})`
  };
}
const P2 = (e) => /^var\(--.+\)$/.test(e), Le = (e, t) => t != null ? `${e}(${t})` : t, vr = (e) => {
  if (P2(e) || e == null) return e;
  const t = typeof e == "string" && !e.endsWith("deg");
  return typeof e == "number" || t ? `${e}deg` : e;
}, Is = (e) => ({
  values: ["outside", "inside", "mixed", "none"],
  transform(t, { token: r }) {
    const a = r("colors.colorPalette.focusRing");
    return {
      inside: {
        "--focus-ring-color": a,
        [e]: {
          outlineOffset: "0px",
          outlineWidth: "var(--focus-ring-width, 1px)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style, solid)",
          borderColor: "var(--focus-ring-color)"
        }
      },
      outside: {
        "--focus-ring-color": a,
        [e]: {
          outlineWidth: "var(--focus-ring-width, 2px)",
          outlineOffset: "var(--focus-ring-offset, 2px)",
          outlineStyle: "var(--focus-ring-style, solid)",
          outlineColor: "var(--focus-ring-color)"
        }
      },
      mixed: {
        "--focus-ring-color": a,
        [e]: {
          outlineWidth: "var(--focus-ring-width, 3px)",
          outlineStyle: "var(--focus-ring-style, solid)",
          outlineColor: "color-mix(in srgb, var(--focus-ring-color), transparent 60%)",
          borderColor: "var(--focus-ring-color)"
        }
      },
      none: {
        "--focus-ring-color": a,
        [e]: {
          outline: "none"
        }
      }
    }[t] ?? {};
  }
}), C2 = ke("borderColor"), Bt = (e) => ({
  transition: e,
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  transitionDuration: "150ms"
}), T2 = k2({
  hover: [
    "@media (hover: hover)",
    "&:is(:hover, [data-hover]):not(:disabled, [data-disabled])"
  ],
  active: "&:is(:active, [data-active]):not(:disabled, [data-disabled], [data-state=open])",
  focus: "&:is(:focus, [data-focus])",
  focusWithin: "&:is(:focus-within, [data-focus-within])",
  focusVisible: "&:is(:focus-visible, [data-focus-visible])",
  disabled: "&:is(:disabled, [disabled], [data-disabled], [aria-disabled=true])",
  visited: "&:visited",
  target: "&:target",
  readOnly: "&:is([data-readonly], [aria-readonly=true], [readonly])",
  readWrite: "&:read-write",
  empty: "&:is(:empty, [data-empty])",
  checked: "&:is(:checked, [data-checked], [aria-checked=true], [data-state=checked])",
  enabled: "&:enabled",
  expanded: "&:is([aria-expanded=true], [data-expanded], [data-state=expanded])",
  highlighted: "&[data-highlighted]",
  complete: "&[data-complete]",
  incomplete: "&[data-incomplete]",
  dragging: "&[data-dragging]",
  before: "&::before",
  after: "&::after",
  firstLetter: "&::first-letter",
  firstLine: "&::first-line",
  marker: "&::marker",
  selection: "&::selection",
  file: "&::file-selector-button",
  backdrop: "&::backdrop",
  first: "&:first-of-type",
  last: "&:last-of-type",
  notFirst: "&:not(:first-of-type)",
  notLast: "&:not(:last-of-type)",
  only: "&:only-child",
  even: "&:nth-of-type(even)",
  odd: "&:nth-of-type(odd)",
  peerFocus: ".peer:is(:focus, [data-focus]) ~ &",
  peerHover: ".peer:is(:hover, [data-hover]):not(:disabled, [data-disabled]) ~ &",
  peerActive: ".peer:is(:active, [data-active]):not(:disabled, [data-disabled]) ~ &",
  peerFocusWithin: ".peer:focus-within ~ &",
  peerFocusVisible: ".peer:is(:focus-visible, [data-focus-visible]) ~ &",
  peerDisabled: ".peer:is(:disabled, [disabled], [data-disabled]) ~ &",
  peerChecked: ".peer:is(:checked, [data-checked], [aria-checked=true], [data-state=checked]) ~ &",
  peerInvalid: ".peer:is(:invalid, [data-invalid], [aria-invalid=true]) ~ &",
  peerExpanded: ".peer:is([aria-expanded=true], [data-expanded], [data-state=expanded]) ~ &",
  peerPlaceholderShown: ".peer:placeholder-shown ~ &",
  groupFocus: ".group:is(:focus, [data-focus]) &",
  groupHover: ".group:is(:hover, [data-hover]):not(:disabled, [data-disabled]) &",
  groupActive: ".group:is(:active, [data-active]):not(:disabled, [data-disabled]) &",
  groupFocusWithin: ".group:focus-within &",
  groupFocusVisible: ".group:is(:focus-visible, [data-focus-visible]) &",
  groupDisabled: ".group:is(:disabled, [disabled], [data-disabled]) &",
  groupChecked: ".group:is(:checked, [data-checked], [aria-checked=true], [data-state=checked]) &",
  groupExpanded: ".group:is([aria-expanded=true], [data-expanded], [data-state=expanded]) &",
  groupInvalid: ".group:invalid &",
  indeterminate: "&:is(:indeterminate, [data-indeterminate], [aria-checked=mixed], [data-state=indeterminate])",
  required: "&:is([data-required], [aria-required=true])",
  valid: "&:is([data-valid], [data-state=valid])",
  invalid: "&:is([data-invalid], [aria-invalid=true], [data-state=invalid])",
  autofill: "&:autofill",
  inRange: "&:is(:in-range, [data-in-range])",
  outOfRange: "&:is(:out-of-range, [data-outside-range])",
  placeholder: "&::placeholder, &[data-placeholder]",
  placeholderShown: "&:is(:placeholder-shown, [data-placeholder-shown])",
  pressed: "&:is([aria-pressed=true], [data-pressed])",
  selected: "&:is([aria-selected=true], [data-selected])",
  grabbed: "&:is([aria-grabbed=true], [data-grabbed])",
  underValue: "&[data-state=under-value]",
  overValue: "&[data-state=over-value]",
  atValue: "&[data-state=at-value]",
  default: "&:default",
  optional: "&:optional",
  open: "&:is([open], [data-open], [data-state=open])",
  closed: "&:is([closed], [data-closed], [data-state=closed])",
  fullscreen: "&is(:fullscreen, [data-fullscreen])",
  loading: "&:is([data-loading], [aria-busy=true])",
  hidden: "&:is([hidden], [data-hidden])",
  current: "&[data-current]",
  currentPage: "&[aria-current=page]",
  currentStep: "&[aria-current=step]",
  today: "&[data-today]",
  unavailable: "&[data-unavailable]",
  rangeStart: "&[data-range-start]",
  rangeEnd: "&[data-range-end]",
  now: "&[data-now]",
  topmost: "&[data-topmost]",
  motionReduce: "@media (prefers-reduced-motion: reduce)",
  motionSafe: "@media (prefers-reduced-motion: no-preference)",
  print: "@media print",
  landscape: "@media (orientation: landscape)",
  portrait: "@media (orientation: portrait)",
  dark: ".dark &, .dark .chakra-theme:not(.light) &",
  light: ":root &, .light &",
  osDark: "@media (prefers-color-scheme: dark)",
  osLight: "@media (prefers-color-scheme: light)",
  highContrast: "@media (forced-colors: active)",
  lessContrast: "@media (prefers-contrast: less)",
  moreContrast: "@media (prefers-contrast: more)",
  ltr: "[dir=ltr] &",
  rtl: "[dir=rtl] &",
  scrollbar: "&::-webkit-scrollbar",
  scrollbarThumb: "&::-webkit-scrollbar-thumb",
  scrollbarTrack: "&::-webkit-scrollbar-track",
  horizontal: "&[data-orientation=horizontal]",
  vertical: "&[data-orientation=vertical]",
  icon: "& :where(svg)",
  starting: "@starting-style"
}), Hr = Jh("bg-currentcolor"), Rs = (e) => e === Hr.ref || e === "currentBg", xe = (e) => ({
  ...e("colors"),
  currentBg: Hr
}), Qh = il({
  conditions: T2,
  utilities: {
    // background
    background: {
      values: xe,
      shorthand: ["bg"],
      transform(e, t) {
        if (Rs(t.raw)) return { background: Hr.ref };
        const r = ke("background")(e, t);
        return { ...r, [Hr.var]: r == null ? void 0 : r.background };
      }
    },
    backgroundColor: {
      values: xe,
      shorthand: ["bgColor"],
      transform(e, t) {
        if (Rs(t.raw))
          return { backgroundColor: Hr.ref };
        const r = ke("backgroundColor")(e, t);
        return {
          ...r,
          [Hr.var]: r == null ? void 0 : r.backgroundColor
        };
      }
    },
    backgroundSize: { shorthand: ["bgSize"] },
    backgroundPosition: { shorthand: ["bgPos"] },
    backgroundRepeat: { shorthand: ["bgRepeat"] },
    backgroundAttachment: { shorthand: ["bgAttachment"] },
    backgroundClip: {
      shorthand: ["bgClip"],
      values: ["text"],
      transform(e) {
        return e === "text" ? { color: "transparent", backgroundClip: "text" } : { backgroundClip: e };
      }
    },
    backgroundGradient: {
      shorthand: ["bgGradient"],
      values(e) {
        return {
          ...e("gradients"),
          "to-t": "linear-gradient(to top, var(--gradient))",
          "to-tr": "linear-gradient(to top right, var(--gradient))",
          "to-r": "linear-gradient(to right, var(--gradient))",
          "to-br": "linear-gradient(to bottom right, var(--gradient))",
          "to-b": "linear-gradient(to bottom, var(--gradient))",
          "to-bl": "linear-gradient(to bottom left, var(--gradient))",
          "to-l": "linear-gradient(to left, var(--gradient))",
          "to-tl": "linear-gradient(to top left, var(--gradient))"
        };
      },
      transform(e) {
        return {
          "--gradient-stops": "var(--gradient-from), var(--gradient-to)",
          "--gradient": "var(--gradient-via-stops, var(--gradient-stops))",
          backgroundImage: e
        };
      }
    },
    gradientFrom: {
      values: xe,
      transform: ke("--gradient-from")
    },
    gradientTo: {
      values: xe,
      transform: ke("--gradient-to")
    },
    gradientVia: {
      values: xe,
      transform(e, t) {
        return {
          ...ke("--gradient-via")(e, t),
          "--gradient-via-stops": "var(--gradient-from), var(--gradient-via), var(--gradient-to)"
        };
      }
    },
    backgroundImage: {
      values(e) {
        return { ...e("gradients"), ...e("assets") };
      },
      shorthand: ["bgImg", "bgImage"]
    },
    // border
    border: { values: "borders" },
    borderTop: { values: "borders" },
    borderLeft: { values: "borders" },
    borderBlockStart: { values: "borders" },
    borderRight: { values: "borders" },
    borderInlineEnd: { values: "borders" },
    borderBottom: { values: "borders" },
    borderBlockEnd: { values: "borders" },
    borderInlineStart: { values: "borders", shorthand: ["borderStart"] },
    borderInline: { values: "borders", shorthand: ["borderX"] },
    borderBlock: { values: "borders", shorthand: ["borderY"] },
    // border colors
    borderColor: {
      values: xe,
      transform: ke("borderColor")
    },
    borderTopColor: {
      values: xe,
      transform: ke("borderTopColor")
    },
    borderBlockStartColor: {
      values: xe,
      transform: ke("borderBlockStartColor")
    },
    borderBottomColor: {
      values: xe,
      transform: ke("borderBottomColor")
    },
    borderBlockEndColor: {
      values: xe,
      transform: ke("borderBlockEndColor")
    },
    borderLeftColor: {
      values: xe,
      transform: ke("borderLeftColor")
    },
    borderInlineStartColor: {
      values: xe,
      shorthand: ["borderStartColor"],
      transform: ke("borderInlineStartColor")
    },
    borderRightColor: {
      values: xe,
      transform: ke("borderRightColor")
    },
    borderInlineEndColor: {
      values: xe,
      shorthand: ["borderEndColor"],
      transform: ke("borderInlineEndColor")
    },
    // border styles
    borderStyle: { values: "borderStyles" },
    borderTopStyle: { values: "borderStyles" },
    borderBlockStartStyle: { values: "borderStyles" },
    borderBottomStyle: { values: "borderStyles" },
    borderBlockEndStyle: {
      values: "borderStyles"
    },
    borderInlineStartStyle: {
      values: "borderStyles",
      shorthand: ["borderStartStyle"]
    },
    borderInlineEndStyle: {
      values: "borderStyles",
      shorthand: ["borderEndStyle"]
    },
    borderLeftStyle: { values: "borderStyles" },
    borderRightStyle: { values: "borderStyles" },
    // border radius
    borderRadius: { values: "radii", shorthand: ["rounded"] },
    borderTopLeftRadius: { values: "radii", shorthand: ["roundedTopLeft"] },
    borderStartStartRadius: {
      values: "radii",
      shorthand: ["roundedStartStart", "borderTopStartRadius"]
    },
    borderEndStartRadius: {
      values: "radii",
      shorthand: ["roundedEndStart", "borderBottomStartRadius"]
    },
    borderTopRightRadius: {
      values: "radii",
      shorthand: ["roundedTopRight"]
    },
    borderStartEndRadius: {
      values: "radii",
      shorthand: ["roundedStartEnd", "borderTopEndRadius"]
    },
    borderEndEndRadius: {
      values: "radii",
      shorthand: ["roundedEndEnd", "borderBottomEndRadius"]
    },
    borderBottomLeftRadius: {
      values: "radii",
      shorthand: ["roundedBottomLeft"]
    },
    borderBottomRightRadius: {
      values: "radii",
      shorthand: ["roundedBottomRight"]
    },
    borderInlineStartRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedStart", "borderStartRadius"],
      transform: (e) => ({
        borderStartStartRadius: e,
        borderEndStartRadius: e
      })
    },
    borderInlineEndRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedEnd", "borderEndRadius"],
      transform: (e) => ({
        borderStartEndRadius: e,
        borderEndEndRadius: e
      })
    },
    borderTopRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedTop"],
      transform: (e) => ({
        borderTopLeftRadius: e,
        borderTopRightRadius: e
      })
    },
    borderBottomRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedBottom"],
      transform: (e) => ({
        borderBottomLeftRadius: e,
        borderBottomRightRadius: e
      })
    },
    borderLeftRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedLeft"],
      transform: (e) => ({
        borderTopLeftRadius: e,
        borderBottomLeftRadius: e
      })
    },
    borderRightRadius: {
      values: "radii",
      property: "borderRadius",
      shorthand: ["roundedRight"],
      transform: (e) => ({
        borderTopRightRadius: e,
        borderBottomRightRadius: e
      })
    },
    borderWidth: { values: "borderWidths" },
    borderBlockStartWidth: { values: "borderWidths" },
    borderTopWidth: { values: "borderWidths" },
    borderBottomWidth: { values: "borderWidths" },
    borderBlockEndWidth: { values: "borderWidths" },
    borderRightWidth: { values: "borderWidths" },
    borderInlineWidth: {
      values: "borderWidths",
      shorthand: ["borderXWidth"]
    },
    borderInlineStartWidth: {
      values: "borderWidths",
      shorthand: ["borderStartWidth"]
    },
    borderInlineEndWidth: {
      values: "borderWidths",
      shorthand: ["borderEndWidth"]
    },
    borderLeftWidth: { values: "borderWidths" },
    borderBlockWidth: {
      values: "borderWidths",
      shorthand: ["borderYWidth"]
    },
    // colors
    color: {
      values: xe,
      transform: ke("color")
    },
    fill: {
      values: xe,
      transform: ke("fill")
    },
    stroke: {
      values: xe,
      transform: ke("stroke")
    },
    accentColor: {
      values: xe,
      transform: ke("accentColor")
    },
    // divide
    divideX: {
      values: { type: "string" },
      transform(e) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
            borderInlineStartWidth: e,
            borderInlineEndWidth: "0px"
          }
        };
      }
    },
    divideY: {
      values: { type: "string" },
      transform(e) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
            borderTopWidth: e,
            borderBottomWidth: "0px"
          }
        };
      }
    },
    divideColor: {
      values: xe,
      transform(e, t) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": C2(
            e,
            t
          )
        };
      }
    },
    divideStyle: {
      property: "borderStyle",
      transform(e) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
            borderStyle: e
          }
        };
      }
    },
    // effects
    boxShadow: { values: "shadows", shorthand: ["shadow"] },
    boxShadowColor: {
      values: xe,
      transform: ke("--shadow-color"),
      shorthand: ["shadowColor"]
    },
    mixBlendMode: { shorthand: ["blendMode"] },
    backgroundBlendMode: { shorthand: ["bgBlendMode"] },
    opacity: { values: "opacity" },
    // filters
    filter: {
      transform(e) {
        return e !== "auto" ? { filter: e } : {
          filter: "var(--blur) var(--brightness) var(--contrast) var(--grayscale) var(--hue-rotate) var(--invert) var(--saturate) var(--sepia) var(--drop-shadow)"
        };
      }
    },
    blur: {
      values: "blurs",
      transform: (e) => ({ "--blur": Le("blur", e) })
    },
    brightness: {
      transform: (e) => ({ "--brightness": Le("brightness", e) })
    },
    contrast: {
      transform: (e) => ({ "--contrast": Le("contrast", e) })
    },
    grayscale: {
      transform: (e) => ({ "--grayscale": Le("grayscale", e) })
    },
    hueRotate: {
      transform: (e) => ({ "--hue-rotate": Le("hue-rotate", vr(e)) })
    },
    invert: { transform: (e) => ({ "--invert": Le("invert", e) }) },
    saturate: {
      transform: (e) => ({ "--saturate": Le("saturate", e) })
    },
    sepia: { transform: (e) => ({ "--sepia": Le("sepia", e) }) },
    dropShadow: {
      transform: (e) => ({ "--drop-shadow": Le("drop-shadow", e) })
    },
    // backdrop filters
    backdropFilter: {
      transform(e) {
        return e !== "auto" ? { backdropFilter: e } : {
          backdropFilter: "var(--backdrop-blur) var(--backdrop-brightness) var(--backdrop-contrast) var(--backdrop-grayscale) var(--backdrop-hue-rotate) var(--backdrop-invert) var(--backdrop-opacity) var(--backdrop-saturate) var(--backdrop-sepia)"
        };
      }
    },
    backdropBlur: {
      values: "blurs",
      transform: (e) => ({ "--backdrop-blur": Le("blur", e) })
    },
    backdropBrightness: {
      transform: (e) => ({
        "--backdrop-brightness": Le("brightness", e)
      })
    },
    backdropContrast: {
      transform: (e) => ({ "--backdrop-contrast": Le("contrast", e) })
    },
    backdropGrayscale: {
      transform: (e) => ({
        "--backdrop-grayscale": Le("grayscale", e)
      })
    },
    backdropHueRotate: {
      transform: (e) => ({
        "--backdrop-hue-rotate": Le("hue-rotate", vr(e))
      })
    },
    backdropInvert: {
      transform: (e) => ({ "--backdrop-invert": Le("invert", e) })
    },
    backdropOpacity: {
      transform: (e) => ({ "--backdrop-opacity": Le("opacity", e) })
    },
    backdropSaturate: {
      transform: (e) => ({ "--backdrop-saturate": Le("saturate", e) })
    },
    backdropSepia: {
      transform: (e) => ({ "--backdrop-sepia": Le("sepia", e) })
    },
    // flexbox
    flexBasis: { values: "sizes" },
    gap: { values: "spacing" },
    rowGap: { values: "spacing", shorthand: ["gapY"] },
    columnGap: { values: "spacing", shorthand: ["gapX"] },
    flexDirection: { shorthand: ["flexDir"] },
    // grid
    gridGap: { values: "spacing" },
    gridColumnGap: { values: "spacing" },
    gridRowGap: { values: "spacing" },
    // interactivity
    outlineColor: {
      values: xe,
      transform: ke("outlineColor")
    },
    focusRing: Is("&:is(:focus, [data-focus])"),
    focusVisibleRing: Is(
      "&:is(:focus-visible, [data-focus-visible])"
    ),
    focusRingColor: {
      values: xe,
      transform: ke("--focus-ring-color")
    },
    focusRingOffset: {
      values: "spacing",
      transform: (e) => ({ "--focus-ring-offset": e })
    },
    focusRingWidth: {
      values: "borderWidths",
      property: "outlineWidth",
      transform: (e) => ({ "--focus-ring-width": e })
    },
    focusRingStyle: {
      values: "borderStyles",
      property: "outlineStyle",
      transform: (e) => ({ "--focus-ring-style": e })
    },
    // layout
    aspectRatio: { values: "aspectRatios" },
    width: { values: "sizes", shorthand: ["w"] },
    inlineSize: { values: "sizes" },
    height: { values: "sizes", shorthand: ["h"] },
    blockSize: { values: "sizes" },
    boxSize: {
      values: "sizes",
      property: "width",
      transform: (e) => ({ width: e, height: e })
    },
    minWidth: { values: "sizes", shorthand: ["minW"] },
    minInlineSize: { values: "sizes" },
    minHeight: { values: "sizes", shorthand: ["minH"] },
    minBlockSize: { values: "sizes" },
    maxWidth: { values: "sizes", shorthand: ["maxW"] },
    maxInlineSize: { values: "sizes" },
    maxHeight: { values: "sizes", shorthand: ["maxH"] },
    maxBlockSize: { values: "sizes" },
    hideFrom: {
      values: "breakpoints",
      //@ts-ignore
      transform: (e, { raw: t, token: r }) => ({
        [r.raw(`breakpoints.${t}`) ? `@breakpoint ${t}` : `@media screen and (min-width: ${e})`]: { display: "none" }
      })
    },
    hideBelow: {
      values: "breakpoints",
      //@ts-ignore
      transform(e, { raw: t, token: r }) {
        return {
          [r.raw(`breakpoints.${t}`) ? `@breakpoint ${t}Down` : `@media screen and (max-width: ${e})`]: {
            display: "none"
          }
        };
      }
    },
    // scroll
    overscrollBehavior: { shorthand: ["overscroll"] },
    overscrollBehaviorX: { shorthand: ["overscrollX"] },
    overscrollBehaviorY: { shorthand: ["overscrollY"] },
    scrollbar: {
      values: ["visible", "hidden"],
      transform(e) {
        switch (e) {
          case "visible":
            return {
              msOverflowStyle: "auto",
              scrollbarWidth: "auto",
              "&::-webkit-scrollbar": { display: "block" }
            };
          case "hidden":
            return {
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" }
            };
          default:
            return {};
        }
      }
    },
    scrollbarColor: {
      values: xe,
      transform: ke("scrollbarColor")
    },
    scrollbarGutter: { values: "spacing" },
    scrollbarWidth: { values: "sizes" },
    // scroll margin
    scrollMargin: { values: "spacing" },
    scrollMarginTop: { values: "spacing" },
    scrollMarginBottom: { values: "spacing" },
    scrollMarginLeft: { values: "spacing" },
    scrollMarginRight: { values: "spacing" },
    scrollMarginX: {
      values: "spacing",
      transform: (e) => ({ scrollMarginLeft: e, scrollMarginRight: e })
    },
    scrollMarginY: {
      values: "spacing",
      transform: (e) => ({ scrollMarginTop: e, scrollMarginBottom: e })
    },
    // scroll padding
    scrollPadding: { values: "spacing" },
    scrollPaddingTop: { values: "spacing" },
    scrollPaddingBottom: { values: "spacing" },
    scrollPaddingLeft: { values: "spacing" },
    scrollPaddingRight: { values: "spacing" },
    scrollPaddingInline: { values: "spacing", shorthand: ["scrollPaddingX"] },
    scrollPaddingBlock: { values: "spacing", shorthand: ["scrollPaddingY"] },
    // scroll snap
    scrollSnapType: {
      values: {
        none: "none",
        x: "x var(--scroll-snap-strictness)",
        y: "y var(--scroll-snap-strictness)",
        both: "both var(--scroll-snap-strictness)"
      }
    },
    scrollSnapStrictness: {
      values: ["mandatory", "proximity"],
      transform: (e) => ({ "--scroll-snap-strictness": e })
    },
    scrollSnapMargin: { values: "spacing" },
    scrollSnapMarginTop: { values: "spacing" },
    scrollSnapMarginBottom: { values: "spacing" },
    scrollSnapMarginLeft: { values: "spacing" },
    scrollSnapMarginRight: { values: "spacing" },
    // list
    listStylePosition: { shorthand: ["listStylePos"] },
    listStyleImage: { values: "assets", shorthand: ["listStyleImg"] },
    // position
    position: { shorthand: ["pos"] },
    zIndex: { values: "zIndex" },
    inset: { values: "spacing" },
    insetInline: { values: "spacing", shorthand: ["insetX"] },
    insetBlock: { values: "spacing", shorthand: ["insetY"] },
    top: { values: "spacing" },
    insetBlockStart: { values: "spacing" },
    bottom: { values: "spacing" },
    insetBlockEnd: { values: "spacing" },
    left: { values: "spacing" },
    right: { values: "spacing" },
    insetInlineStart: {
      values: "spacing",
      shorthand: ["insetStart"]
    },
    insetInlineEnd: {
      values: "spacing",
      shorthand: ["insetEnd"]
    },
    // shadow / ring
    ring: {
      transform(e) {
        return {
          "--ring-offset-shadow": "var(--ring-inset) 0 0 0 var(--ring-offset-width) var(--ring-offset-color)",
          "--ring-shadow": "var(--ring-inset) 0 0 0 calc(var(--ring-width) + var(--ring-offset-width)) var(--ring-color)",
          "--ring-width": e,
          boxShadow: "var(--ring-offset-shadow), var(--ring-shadow), var(--shadow, 0 0 #0000)"
        };
      }
    },
    ringColor: {
      values: xe,
      transform: ke("--ring-color")
    },
    ringOffset: {
      transform: (e) => ({ "--ring-offset-width": e })
    },
    ringOffsetColor: {
      values: xe,
      transform: ke("--ring-offset-color")
    },
    ringInset: {
      transform: (e) => ({ "--ring-inset": e })
    },
    // margin
    margin: { values: "spacing", shorthand: ["m"] },
    marginTop: { values: "spacing", shorthand: ["mt"] },
    marginBlockStart: { values: "spacing", shorthand: ["mt"] },
    marginRight: { values: "spacing", shorthand: ["mr"] },
    marginBottom: { values: "spacing", shorthand: ["mb"] },
    marginBlockEnd: { values: "spacing" },
    marginLeft: { values: "spacing", shorthand: ["ml"] },
    marginInlineStart: { values: "spacing", shorthand: ["ms", "marginStart"] },
    marginInlineEnd: { values: "spacing", shorthand: ["me", "marginEnd"] },
    marginInline: { values: "spacing", shorthand: ["mx", "marginX"] },
    marginBlock: { values: "spacing", shorthand: ["my", "marginY"] },
    // padding
    padding: { values: "spacing", shorthand: ["p"] },
    paddingTop: { values: "spacing", shorthand: ["pt"] },
    paddingRight: { values: "spacing", shorthand: ["pr"] },
    paddingBottom: { values: "spacing", shorthand: ["pb"] },
    paddingBlockStart: { values: "spacing" },
    paddingBlockEnd: { values: "spacing" },
    paddingLeft: { values: "spacing", shorthand: ["pl"] },
    paddingInlineStart: {
      values: "spacing",
      shorthand: ["ps", "paddingStart"]
    },
    paddingInlineEnd: { values: "spacing", shorthand: ["pe", "paddingEnd"] },
    paddingInline: { values: "spacing", shorthand: ["px", "paddingX"] },
    paddingBlock: { values: "spacing", shorthand: ["py", "paddingY"] },
    // text decoration
    textDecoration: { shorthand: ["textDecor"] },
    textDecorationColor: {
      values: xe,
      transform: ke("textDecorationColor")
    },
    textShadow: { values: "shadows" },
    // transform
    transform: {
      transform: (e) => {
        let t = e;
        return e === "auto" && (t = "translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0)) rotate(var(--rotate, 0)) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1)) skewX(var(--skew-x, 0)) skewY(var(--skew-y, 0))"), e === "auto-gpu" && (t = "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) rotate(var(--rotate, 0)) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1)) skewX(var(--skew-x, 0)) skewY(var(--skew-y, 0))"), { transform: t };
      }
    },
    skewX: { transform: (e) => ({ "--skew-x": vr(e) }) },
    skewY: { transform: (e) => ({ "--skew-y": vr(e) }) },
    scaleX: { transform: (e) => ({ "--scale-x": e }) },
    scaleY: { transform: (e) => ({ "--scale-y": e }) },
    scale: {
      transform(e) {
        return e !== "auto" ? { scale: e } : {
          scale: "var(--scale-x, 1) var(--scale-y, 1)"
        };
      }
    },
    spaceXReverse: {
      values: { type: "boolean" },
      transform(e) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
            "--space-x-reverse": e ? "1" : void 0
          }
        };
      }
    },
    spaceX: {
      property: "marginInlineStart",
      values: "spacing",
      transform: (e) => ({
        "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
          "--space-x-reverse": "0",
          marginInlineStart: `calc(${e} * calc(1 - var(--space-x-reverse)))`,
          marginInlineEnd: `calc(${e} * var(--space-x-reverse))`
        }
      })
    },
    spaceYReverse: {
      values: { type: "boolean" },
      transform(e) {
        return {
          "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
            "--space-y-reverse": e ? "1" : void 0
          }
        };
      }
    },
    spaceY: {
      property: "marginTop",
      values: "spacing",
      transform: (e) => ({
        "& > :not(style, [hidden]) ~ :not(style, [hidden])": {
          "--space-y-reverse": "0",
          marginTop: `calc(${e} * calc(1 - var(--space-y-reverse)))`,
          marginBottom: `calc(${e} * var(--space-y-reverse))`
        }
      })
    },
    rotate: {
      transform(e) {
        return e !== "auto" ? { rotate: vr(e) } : {
          rotate: "var(--rotate-x, 0) var(--rotate-y, 0) var(--rotate-z, 0)"
        };
      }
    },
    rotateX: {
      transform(e) {
        return { "--rotate-x": vr(e) };
      }
    },
    rotateY: {
      transform(e) {
        return { "--rotate-y": vr(e) };
      }
    },
    // transform / translate
    translate: {
      transform(e) {
        return e !== "auto" ? { translate: e } : {
          translate: "var(--translate-x) var(--translate-y)"
        };
      }
    },
    translateX: {
      values: "spacing",
      transform: (e) => ({ "--translate-x": e })
    },
    translateY: {
      values: "spacing",
      transform: (e) => ({ "--translate-y": e })
    },
    // transition
    transition: {
      values: [
        "all",
        "common",
        "colors",
        "opacity",
        "position",
        "backgrounds",
        "size",
        "shadow",
        "transform"
      ],
      transform(e) {
        switch (e) {
          case "all":
            return Bt("all");
          case "position":
            return Bt(
              "left, right, top, bottom, inset-inline, inset-block"
            );
          case "colors":
            return Bt(
              "color, background-color, border-color, text-decoration-color, fill, stroke"
            );
          case "opacity":
            return Bt("opacity");
          case "shadow":
            return Bt("box-shadow");
          case "transform":
            return Bt("transform");
          case "size":
            return Bt("width, height");
          case "backgrounds":
            return Bt(
              "background, background-color, background-image, background-position"
            );
          case "common":
            return Bt(
              "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter"
            );
          default:
            return { transition: e };
        }
      }
    },
    transitionDuration: { values: "durations" },
    transitionProperty: {
      values: {
        common: "background-color, border-color, color, fill, stroke, opacity, box-shadow, translate, transform",
        colors: "background-color, border-color, color, fill, stroke",
        size: "width, height",
        position: "left, right, top, bottom, inset-inline, inset-block",
        background: "background, background-color, background-image, background-position"
      }
    },
    transitionTimingFunction: { values: "easings" },
    // animation
    animation: { values: "animations" },
    animationDuration: { values: "durations" },
    animationDelay: { values: "durations" },
    animationTimingFunction: { values: "easings" },
    // typography
    fontFamily: { values: "fonts" },
    fontSize: { values: "fontSizes" },
    fontWeight: { values: "fontWeights" },
    lineHeight: { values: "lineHeights" },
    letterSpacing: { values: "letterSpacings" },
    textIndent: { values: "spacing" },
    truncate: {
      values: { type: "boolean" },
      transform(e) {
        return e === !0 ? {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        } : {};
      }
    },
    lineClamp: {
      transform(e) {
        return e === "none" ? {
          WebkitLineClamp: "unset"
        } : {
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: e,
          WebkitBoxOrient: "vertical",
          textWrap: "wrap"
        };
      }
    },
    // helpers
    srOnly: {
      values: { type: "boolean" },
      transform(e) {
        return I2[e] || {};
      }
    },
    debug: {
      values: { type: "boolean" },
      transform(e) {
        return e ? {
          outline: "1px solid blue !important",
          "& > *": {
            outline: "1px solid red !important"
          }
        } : {};
      }
    },
    caretColor: {
      values: xe,
      transform: ke("caretColor")
    },
    cursor: { values: "cursor" }
  }
}), I2 = {
  true: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0"
  },
  false: {
    position: "static",
    width: "auto",
    height: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    clip: "auto",
    whiteSpace: "normal"
  }
};
var R2 = "", D2 = R2.split(","), A2 = "WebkitAppearance,WebkitBorderBefore,WebkitBorderBeforeColor,WebkitBorderBeforeStyle,WebkitBorderBeforeWidth,WebkitBoxReflect,WebkitLineClamp,WebkitMask,WebkitMaskAttachment,WebkitMaskClip,WebkitMaskComposite,WebkitMaskImage,WebkitMaskOrigin,WebkitMaskPosition,WebkitMaskPositionX,WebkitMaskPositionY,WebkitMaskRepeat,WebkitMaskRepeatX,WebkitMaskRepeatY,WebkitMaskSize,WebkitOverflowScrolling,WebkitTapHighlightColor,WebkitTextFillColor,WebkitTextStroke,WebkitTextStrokeColor,WebkitTextStrokeWidth,WebkitTouchCallout,WebkitUserModify,accentColor,alignContent,alignItems,alignSelf,alignTracks,all,animation,animationComposition,animationDelay,animationDirection,animationDuration,animationFillMode,animationIterationCount,animationName,animationPlayState,animationRange,animationRangeEnd,animationRangeStart,animationTimingFunction,animationTimeline,appearance,aspectRatio,azimuth,backdropFilter,backfaceVisibility,background,backgroundAttachment,backgroundBlendMode,backgroundClip,backgroundColor,backgroundImage,backgroundOrigin,backgroundPosition,backgroundPositionX,backgroundPositionY,backgroundRepeat,backgroundSize,blockSize,border,borderBlock,borderBlockColor,borderBlockStyle,borderBlockWidth,borderBlockEnd,borderBlockEndColor,borderBlockEndStyle,borderBlockEndWidth,borderBlockStart,borderBlockStartColor,borderBlockStartStyle,borderBlockStartWidth,borderBottom,borderBottomColor,borderBottomLeftRadius,borderBottomRightRadius,borderBottomStyle,borderBottomWidth,borderCollapse,borderColor,borderEndEndRadius,borderEndStartRadius,borderImage,borderImageOutset,borderImageRepeat,borderImageSlice,borderImageSource,borderImageWidth,borderInline,borderInlineEnd,borderInlineColor,borderInlineStyle,borderInlineWidth,borderInlineEndColor,borderInlineEndStyle,borderInlineEndWidth,borderInlineStart,borderInlineStartColor,borderInlineStartStyle,borderInlineStartWidth,borderLeft,borderLeftColor,borderLeftStyle,borderLeftWidth,borderRadius,borderRight,borderRightColor,borderRightStyle,borderRightWidth,borderSpacing,borderStartEndRadius,borderStartStartRadius,borderStyle,borderTop,borderTopColor,borderTopLeftRadius,borderTopRightRadius,borderTopStyle,borderTopWidth,borderWidth,bottom,boxAlign,boxDecorationBreak,boxDirection,boxFlex,boxFlexGroup,boxLines,boxOrdinalGroup,boxOrient,boxPack,boxShadow,boxSizing,breakAfter,breakBefore,breakInside,captionSide,caret,caretColor,caretShape,clear,clip,clipPath,color,colorScheme,columnCount,columnFill,columnGap,columnRule,columnRuleColor,columnRuleStyle,columnRuleWidth,columnSpan,columnWidth,columns,contain,containIntrinsicSize,containIntrinsicBlockSize,containIntrinsicHeight,containIntrinsicInlineSize,containIntrinsicWidth,container,containerName,containerType,content,contentVisibility,counterIncrement,counterReset,counterSet,cursor,direction,display,emptyCells,filter,flex,flexBasis,flexDirection,flexFlow,flexGrow,flexShrink,flexWrap,float,font,fontFamily,fontFeatureSettings,fontKerning,fontLanguageOverride,fontOpticalSizing,fontPalette,fontVariationSettings,fontSize,fontSizeAdjust,fontSmooth,fontStretch,fontStyle,fontSynthesis,fontSynthesisPosition,fontSynthesisSmallCaps,fontSynthesisStyle,fontSynthesisWeight,fontVariant,fontVariantAlternates,fontVariantCaps,fontVariantEastAsian,fontVariantEmoji,fontVariantLigatures,fontVariantNumeric,fontVariantPosition,fontWeight,forcedColorAdjust,gap,grid,gridArea,gridAutoColumns,gridAutoFlow,gridAutoRows,gridColumn,gridColumnEnd,gridColumnGap,gridColumnStart,gridGap,gridRow,gridRowEnd,gridRowGap,gridRowStart,gridTemplate,gridTemplateAreas,gridTemplateColumns,gridTemplateRows,hangingPunctuation,height,hyphenateCharacter,hyphenateLimitChars,hyphens,imageOrientation,imageRendering,imageResolution,imeMode,initialLetter,initialLetterAlign,inlineSize,inputSecurity,inset,insetBlock,insetBlockEnd,insetBlockStart,insetInline,insetInlineEnd,insetInlineStart,isolation,justifyContent,justifyItems,justifySelf,justifyTracks,left,letterSpacing,lineBreak,lineClamp,lineHeight,lineHeightStep,listStyle,listStyleImage,listStylePosition,listStyleType,margin,marginBlock,marginBlockEnd,marginBlockStart,marginBottom,marginInline,marginInlineEnd,marginInlineStart,marginLeft,marginRight,marginTop,marginTrim,mask,maskBorder,maskBorderMode,maskBorderOutset,maskBorderRepeat,maskBorderSlice,maskBorderSource,maskBorderWidth,maskClip,maskComposite,maskImage,maskMode,maskOrigin,maskPosition,maskRepeat,maskSize,maskType,masonryAutoFlow,mathDepth,mathShift,mathStyle,maxBlockSize,maxHeight,maxInlineSize,maxLines,maxWidth,minBlockSize,minHeight,minInlineSize,minWidth,mixBlendMode,objectFit,objectPosition,offset,offsetAnchor,offsetDistance,offsetPath,offsetPosition,offsetRotate,opacity,order,orphans,outline,outlineColor,outlineOffset,outlineStyle,outlineWidth,overflow,overflowAnchor,overflowBlock,overflowClipBox,overflowClipMargin,overflowInline,overflowWrap,overflowX,overflowY,overlay,overscrollBehavior,overscrollBehaviorBlock,overscrollBehaviorInline,overscrollBehaviorX,overscrollBehaviorY,padding,paddingBlock,paddingBlockEnd,paddingBlockStart,paddingBottom,paddingInline,paddingInlineEnd,paddingInlineStart,paddingLeft,paddingRight,paddingTop,page,pageBreakAfter,pageBreakBefore,pageBreakInside,paintOrder,perspective,perspectiveOrigin,placeContent,placeItems,placeSelf,pointerEvents,position,printColorAdjust,quotes,resize,right,rotate,rowGap,rubyAlign,rubyMerge,rubyPosition,scale,scrollbarColor,scrollbarGutter,scrollbarWidth,scrollBehavior,scrollMargin,scrollMarginBlock,scrollMarginBlockStart,scrollMarginBlockEnd,scrollMarginBottom,scrollMarginInline,scrollMarginInlineStart,scrollMarginInlineEnd,scrollMarginLeft,scrollMarginRight,scrollMarginTop,scrollPadding,scrollPaddingBlock,scrollPaddingBlockStart,scrollPaddingBlockEnd,scrollPaddingBottom,scrollPaddingInline,scrollPaddingInlineStart,scrollPaddingInlineEnd,scrollPaddingLeft,scrollPaddingRight,scrollPaddingTop,scrollSnapAlign,scrollSnapCoordinate,scrollSnapDestination,scrollSnapPointsX,scrollSnapPointsY,scrollSnapStop,scrollSnapType,scrollSnapTypeX,scrollSnapTypeY,scrollTimeline,scrollTimelineAxis,scrollTimelineName,shapeImageThreshold,shapeMargin,shapeOutside,tabSize,tableLayout,textAlign,textAlignLast,textCombineUpright,textDecoration,textDecorationColor,textDecorationLine,textDecorationSkip,textDecorationSkipInk,textDecorationStyle,textDecorationThickness,textEmphasis,textEmphasisColor,textEmphasisPosition,textEmphasisStyle,textIndent,textJustify,textOrientation,textOverflow,textRendering,textShadow,textSizeAdjust,textTransform,textUnderlineOffset,textUnderlinePosition,textWrap,timelineScope,top,touchAction,transform,transformBox,transformOrigin,transformStyle,transition,transitionBehavior,transitionDelay,transitionDuration,transitionProperty,transitionTimingFunction,translate,unicodeBidi,userSelect,verticalAlign,viewTimeline,viewTimelineAxis,viewTimelineInset,viewTimelineName,viewTransitionName,visibility,whiteSpace,whiteSpaceCollapse,widows,width,willChange,wordBreak,wordSpacing,wordWrap,writingMode,zIndex,zoom,alignmentBaseline,baselineShift,clipRule,colorInterpolation,colorRendering,dominantBaseline,fill,fillOpacity,fillRule,floodColor,floodOpacity,glyphOrientationVertical,lightingColor,marker,markerEnd,markerMid,markerStart,shapeRendering,stopColor,stopOpacity,stroke,strokeDasharray,strokeDashoffset,strokeLinecap,strokeLinejoin,strokeMiterlimit,strokeOpacity,strokeWidth,textAnchor,vectorEffect", z2 = A2.split(",").concat(D2), O2 = new Map(z2.map((e) => [e, !0]));
function F2(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return (r) => (t[r] === void 0 && (t[r] = e(r)), t[r]);
}
var N2 = /&|@/, L2 = /* @__PURE__ */ F2((e) => O2.has(e) || e.startsWith("--") || N2.test(e));
const M2 = (e) => e != null;
function Xt(e, t, r = {}) {
  const { stop: a, getKey: i } = r;
  function o(n, l = []) {
    if (ot(n) || Array.isArray(n)) {
      const s = {};
      for (const [d, c] of Object.entries(n)) {
        const h = (i == null ? void 0 : i(d, c)) ?? d, u = [...l, h];
        if (a != null && a(n, u))
          return t(n, l);
        const f = o(c, u);
        M2(f) && (s[h] = f);
      }
      return s;
    }
    return t(n, l);
  }
  return o(e);
}
function Ut(e, t) {
  return Array.isArray(e) ? e.map((r) => t(r)) : ot(e) ? Xt(e, (r) => t(r)) : e != null ? t(e) : e;
}
function B2(e, t) {
  const r = {};
  return Xt(
    e,
    (a, i) => {
      a && (r[i.join(".")] = a.value);
    },
    { stop: t }
  ), r;
}
const Xr = (e, t) => {
  const r = /* @__PURE__ */ Object.create(null);
  function a(...i) {
    const o = i.join("|");
    return r[o] === void 0 && (r[o] = e(...i)), r[o];
  }
  return a;
}, e0 = 16, Ai = "px", ol = "em", Ca = "rem";
function t0(e = "") {
  const t = new RegExp(String.raw`-?\d+(?:\.\d+|\d*)`), r = new RegExp(`${Ai}|${ol}|${Ca}`), a = e.match(
    new RegExp(`${t.source}(${r.source})`)
  );
  return a == null ? void 0 : a[1];
}
function r0(e = "") {
  if (typeof e == "number")
    return `${e}px`;
  const t = t0(e);
  if (!t || t === Ai)
    return e;
  if (t === ol || t === Ca)
    return `${parseFloat(e) * e0}${Ai}`;
}
function a0(e = "") {
  const t = t0(e);
  if (!t || t === Ca)
    return e;
  if (t === ol)
    return `${parseFloat(e)}${Ca}`;
  if (t === Ai)
    return `${parseFloat(e) / e0}${Ca}`;
}
const K2 = (e) => e.charAt(0).toUpperCase() + e.slice(1);
function W2(e) {
  const t = j2(e), r = Object.fromEntries(t);
  function a(u) {
    return r[u];
  }
  function i(u) {
    return Br(a(u));
  }
  function o() {
    const u = Object.keys(r), f = V2(u), g = u.flatMap((v) => {
      const b = a(v), m = [
        `${v}Down`,
        Br({ max: _i(b.min) })
      ], x = [v, Br({ min: b.min })], S = [`${v}Only`, i(v)];
      return [x, S, m];
    }).filter(([, v]) => v !== "").concat(
      f.map(([v, b]) => {
        const m = a(v), x = a(b);
        return [
          `${v}To${K2(b)}`,
          Br({ min: m.min, max: _i(x.min) })
        ];
      })
    );
    return Object.fromEntries(g);
  }
  function n() {
    const u = o();
    return Object.fromEntries(Object.entries(u));
  }
  const l = n(), s = (u) => l[u];
  function d() {
    return ["base", ...Object.keys(r)];
  }
  function c(u) {
    return Br({ min: a(u).min });
  }
  function h(u) {
    return Br({ max: _i(a(u).min) });
  }
  return {
    values: Object.values(r),
    only: i,
    keys: d,
    conditions: l,
    getCondition: s,
    up: c,
    down: h
  };
}
function _i(e) {
  const t = parseFloat(r0(e) ?? "") - 0.04;
  return a0(`${t}px`);
}
function j2(e) {
  return Object.entries(e).sort(([, r], [, a]) => parseInt(r, 10) < parseInt(a, 10) ? -1 : 1).map(([r, a], i, o) => {
    var l;
    let n = null;
    return i <= o.length - 1 && (n = (l = o[i + 1]) == null ? void 0 : l[1]), n != null && (n = _i(n)), [r, { name: r, min: a0(a), max: n }];
  });
}
function V2(e) {
  const t = [];
  return e.forEach((r, a) => {
    let i = a;
    i++;
    let o = e[i];
    for (; o; )
      t.push([r, o]), i++, o = e[i];
  }), t;
}
function Br({ min: e, max: t }) {
  return e == null && t == null ? "" : [
    "@media screen",
    e && `(min-width: ${e})`,
    t && `(max-width: ${t})`
  ].filter(Boolean).join(" and ");
}
const H2 = (e, t) => Object.fromEntries(
  Object.entries(e).map(([r, a]) => t(r, a))
), U2 = (e) => {
  const { breakpoints: t, conditions: r = {} } = e, a = H2(r, (c, h) => [`_${c}`, h]), i = Object.assign({}, a, t.conditions);
  function o() {
    return Object.keys(i);
  }
  function n(c) {
    return o().includes(c) || /^@|&|&$/.test(c) || c.startsWith("_");
  }
  function l(c) {
    return c.filter((h) => h !== "base").sort((h, u) => {
      const f = n(h), g = n(u);
      return f && !g ? 1 : !f && g ? -1 : 0;
    });
  }
  function s(c) {
    return c.startsWith("@breakpoint") ? t.getCondition(c.replace("@breakpoint ", "")) : c;
  }
  function d(c) {
    return Reflect.get(i, c) || c;
  }
  return {
    keys: o,
    sort: l,
    has: n,
    resolve: d,
    breakpoints: t.keys(),
    expandAtRule: s
  };
}, i0 = (e) => ({
  minMax: new RegExp(
    `(!?\\(\\s*min(-device-)?-${e})(.|
)+\\(\\s*max(-device)?-${e}`,
    "i"
  ),
  min: new RegExp(`\\(\\s*min(-device)?-${e}`, "i"),
  maxMin: new RegExp(
    `(!?\\(\\s*max(-device)?-${e})(.|
)+\\(\\s*min(-device)?-${e}`,
    "i"
  ),
  max: new RegExp(`\\(\\s*max(-device)?-${e}`, "i")
}), G2 = i0("width"), Y2 = i0("height"), o0 = (e) => ({
  isMin: Ns(e.minMax, e.maxMin, e.min),
  isMax: Ns(e.maxMin, e.minMax, e.max)
}), { isMin: nn, isMax: Ds } = o0(G2), { isMin: ln, isMax: As } = o0(Y2), zs = /print/i, Os = /^print$/i, q2 = /(-?\d*\.?\d+)(ch|em|ex|px|rem)/, X2 = /(\d)/, Sa = Number.MAX_VALUE, Z2 = { ch: 8.8984375, em: 16, rem: 16, ex: 8.296875, px: 1 };
function Fs(e) {
  const t = q2.exec(e) || (nn(e) || ln(e) ? X2.exec(e) : null);
  if (!t) return Sa;
  if (t[0] === "0") return 0;
  const r = parseFloat(t[1]), a = t[2];
  return r * (Z2[a] || 1);
}
function Ns(e, t, r) {
  return (a) => e.test(a) || !t.test(a) && r.test(a);
}
function J2(e, t) {
  const r = zs.test(e), a = Os.test(e), i = zs.test(t), o = Os.test(t);
  return r && i ? !a && o ? 1 : a && !o ? -1 : e.localeCompare(t) : r ? 1 : i ? -1 : null;
}
const Q2 = Xr((e, t) => {
  const r = J2(e, t);
  if (r !== null) return r;
  const a = nn(e) || ln(e), i = Ds(e) || As(e), o = nn(t) || ln(t), n = Ds(t) || As(t);
  if (a && n) return -1;
  if (i && o) return 1;
  const l = Fs(e), s = Fs(t);
  return l === Sa && s === Sa ? e.localeCompare(t) : l === Sa ? 1 : s === Sa ? -1 : l !== s ? l > s ? i ? -1 : 1 : i ? 1 : -1 : e.localeCompare(t);
});
function Ls(e) {
  return e.sort(([t], [r]) => Q2(t, r));
}
function n0(e) {
  const t = [], r = [], a = {};
  for (const [n, l] of Object.entries(e))
    n.startsWith("@media") ? t.push([n, l]) : n.startsWith("@container") ? r.push([n, l]) : ot(l) ? a[n] = n0(l) : a[n] = l;
  const i = Ls(t), o = Ls(r);
  return {
    ...a,
    ...Object.fromEntries(i),
    ...Object.fromEntries(o)
  };
}
const l0 = /\s*!(important)?/i, ex = (e) => Nt(e) ? l0.test(e) : !1, tx = (e) => Nt(e) ? e.replace(l0, "").trim() : e;
function s0(e) {
  const { transform: t, conditions: r, normalize: a } = e, i = ix(e);
  return function(...n) {
    const l = i(...n), s = a(l), d = /* @__PURE__ */ Object.create(null);
    return Xt(s, (c, h) => {
      const u = ex(c);
      if (c == null) return;
      const [f, ...g] = r.sort(h).map(r.resolve);
      u && (c = tx(c));
      let v = t(f, c) ?? /* @__PURE__ */ Object.create(null);
      v = Xt(
        v,
        (b) => Nt(b) && u ? `${b} !important` : b,
        { getKey: (b) => r.expandAtRule(b) }
      ), rx(d, g.flat(), v);
    }), n0(d);
  };
}
function rx(e, t, r) {
  let a = e;
  for (const i of t)
    i && (a[i] || (a[i] = /* @__PURE__ */ Object.create(null)), a = a[i]);
  ia(a, r);
}
function ax(...e) {
  return e.filter(
    (t) => ot(t) && Object.keys(ta(t)).length > 0
  );
}
function ix(e) {
  function t(r) {
    const a = ax(...r);
    return a.length === 1 ? a : a.map((i) => e.normalize(i));
  }
  return function(...a) {
    return ia({}, ...t(a));
  };
}
function d0(e, t = []) {
  const r = Object.assign({}, e);
  for (const a of t)
    a in r && delete r[a];
  return r;
}
const ox = (...e) => {
  const t = e.filter(Boolean);
  return Array.from(new Set(t));
}, c0 = (e) => ({
  base: {},
  variants: {},
  defaultVariants: {},
  compoundVariants: [],
  ...e
});
function nx(e) {
  const { css: t, conditions: r, normalize: a, layers: i } = e;
  function o(l = {}) {
    const { base: s, variants: d, defaultVariants: c, compoundVariants: h } = c0(l), u = s0({
      conditions: r,
      normalize: a,
      transform(x, S) {
        var T;
        return (T = d[x]) == null ? void 0 : T[S];
      }
    }), f = (x = {}) => {
      const S = a({
        ...c,
        ...ta(x)
      });
      let T = { ...s };
      ia(T, u(S));
      const k = n(
        h,
        S
      );
      return i.wrap("recipes", t(T, k));
    }, g = Object.keys(d), v = (x) => {
      const S = d0(x, ["recipe"]), [T, k] = qr(S, g);
      return g.includes("colorPalette") || (T.colorPalette = x.colorPalette || c.colorPalette), g.includes("orientation") && (k.orientation = x.orientation), [T, k];
    }, b = Object.fromEntries(
      Object.entries(d).map(([x, S]) => [
        x,
        Object.keys(S)
      ])
    );
    return Object.assign((x) => t(f(x)), {
      className: l.className,
      __cva__: !0,
      variantMap: b,
      variantKeys: g,
      raw: f,
      config: l,
      splitVariantProps: v,
      merge(x) {
        return o(lx(e)(this, x));
      }
    });
  }
  function n(l, s) {
    let d = {};
    return l.forEach((c) => {
      Object.entries(c).every(([u, f]) => u === "css" ? !0 : (Array.isArray(f) ? f : [f]).some((v) => s[u] === v)) && (d = t(d, c.css));
    }), d;
  }
  return o;
}
function lx(e) {
  const { css: t } = e;
  return function(a, i) {
    const o = c0(i.config), n = ox(a.variantKeys, Object.keys(i.variants)), l = t(a.base, o.base), s = Object.fromEntries(
      n.map((u) => [
        u,
        t(a.config.variants[u], o.variants[u])
      ])
    ), d = ia(
      a.config.defaultVariants,
      o.defaultVariants
    ), c = [
      ...a.compoundVariants,
      ...o.compoundVariants
    ];
    return {
      className: lt(a.className, i.className),
      base: l,
      variants: s,
      defaultVariants: d,
      compoundVariants: c
    };
  };
}
const sx = {
  reset: "reset",
  base: "base",
  tokens: "tokens",
  recipes: "recipes"
}, Ms = {
  reset: 0,
  base: 1,
  tokens: 2,
  recipes: 3
};
function dx(e) {
  const t = e.layers ?? sx, a = Object.values(t).sort((i, o) => Ms[i] - Ms[o]);
  return {
    names: a,
    atRule: `@layer ${a.join(", ")};`,
    wrap(i, o) {
      return e.disableLayers ? o : { [`@layer ${t[i]}`]: o };
    }
  };
}
function cx(e) {
  const { utility: t, normalize: r } = e, { hasShorthand: a, resolveShorthand: i } = t;
  return function(o) {
    return Xt(o, r, {
      stop: (n) => Array.isArray(n),
      getKey: a ? i : void 0
    });
  };
}
function ux(e) {
  const { preflight: t } = e;
  if (!t) return {};
  const { scope: r = "", level: a = "parent" } = ot(t) ? t : {};
  let i = "";
  r && a === "parent" ? i = `${r} ` : r && a === "element" && (i = `&${r}`);
  const o = {
    "*": {
      margin: "0px",
      padding: "0px",
      font: "inherit",
      wordWrap: "break-word",
      WebkitTapHighlightColor: "transparent"
    },
    "*, *::before, *::after, *::backdrop": {
      boxSizing: "border-box",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "var(--global-color-border, currentColor)"
    },
    hr: {
      height: "0px",
      color: "inherit",
      borderTopWidth: "1px"
    },
    body: {
      minHeight: "100dvh",
      position: "relative"
    },
    img: {
      borderStyle: "none"
    },
    "img, svg, video, canvas, audio, iframe, embed, object": {
      display: "block",
      verticalAlign: "middle"
    },
    iframe: { border: "none" },
    "img, video": { maxWidth: "100%", height: "auto" },
    "p, h1, h2, h3, h4, h5, h6": { overflowWrap: "break-word" },
    "ol, ul": { listStyle: "none" },
    "code, kbd, pre, samp": { fontSize: "1em" },
    "button, [type='button'], [type='reset'], [type='submit']": {
      WebkitAppearance: "button",
      backgroundColor: "transparent",
      backgroundImage: "none"
    },
    "button, input, optgroup, select, textarea": { color: "inherit" },
    "button, select": { textTransform: "none" },
    table: {
      textIndent: "0px",
      borderColor: "inherit",
      borderCollapse: "collapse"
    },
    "*::placeholder": {
      opacity: "unset",
      color: "#9ca3af",
      userSelect: "none"
    },
    textarea: {
      resize: "vertical"
    },
    summary: {
      display: "list-item"
    },
    small: {
      fontSize: "80%"
    },
    "sub, sup": {
      fontSize: "75%",
      lineHeight: 0,
      position: "relative",
      verticalAlign: "baseline"
    },
    sub: {
      bottom: "-0.25em"
    },
    sup: {
      top: "-0.5em"
    },
    dialog: {
      padding: "0px"
    },
    a: {
      color: "inherit",
      textDecoration: "inherit"
    },
    "abbr:where([title])": {
      textDecoration: "underline dotted"
    },
    "b, strong": {
      fontWeight: "bolder"
    },
    "code, kbd, samp, pre": {
      fontSize: "1em",
      "--font-mono-fallback": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New'",
      fontFamily: "var(--global-font-mono, var(--font-mono-fallback))"
    },
    'input[type="text"], input[type="email"], input[type="search"], input[type="password"]': {
      WebkitAppearance: "none",
      MozAppearance: "none"
    },
    "input[type='search']": {
      WebkitAppearance: "textfield",
      outlineOffset: "-2px"
    },
    "::-webkit-search-decoration, ::-webkit-search-cancel-button": {
      WebkitAppearance: "none"
    },
    "::-webkit-file-upload-button": {
      WebkitAppearance: "button",
      font: "inherit"
    },
    'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button': {
      height: "auto"
    },
    "input[type='number']": {
      MozAppearance: "textfield"
    },
    ":-moz-ui-invalid": {
      boxShadow: "none"
    },
    ":-moz-focusring": {
      outline: "auto"
    },
    "[hidden]:where(:not([hidden='until-found']))": {
      display: "none !important"
    }
  }, n = {
    [r || "html"]: {
      lineHeight: 1.5,
      "--font-fallback": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      WebkitTextSizeAdjust: "100%",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",
      touchAction: "manipulation",
      MozTabSize: "4",
      tabSize: "4",
      fontFamily: "var(--global-font-body, var(--font-fallback))"
    }
  };
  if (a === "element") {
    const l = Object.entries(o).reduce((s, [d, c]) => (s[d] = { [i]: c }, s), {});
    Object.assign(n, l);
  } else i ? n[i] = o : Object.assign(n, o);
  return n;
}
function hx(e) {
  const { conditions: t, isValidProperty: r } = e;
  return function(i) {
    return Xt(i, (o) => o, {
      getKey: (o, n) => ot(n) && !t.has(o) && !r(o) ? fx(o).map((l) => "&" + l).join(", ") : o
    });
  };
}
function fx(e) {
  const t = [];
  let r = 0, a = "", i = !1;
  for (let o = 0; o < e.length; o++) {
    const n = e[o];
    if (n === "\\" && !i) {
      i = !0, a += n;
      continue;
    }
    if (i) {
      i = !1, a += n;
      continue;
    }
    n === "(" ? r++ : n === ")" && r--, n === "," && r === 0 ? (t.push(a.trim()), a = "") : a += n;
  }
  return a && t.push(a.trim()), t;
}
const gx = (e = {}) => {
  const t = (i) => {
    var o;
    return {
      base: ((o = e.base) == null ? void 0 : o[i]) ?? {},
      variants: {},
      defaultVariants: e.defaultVariants ?? {},
      compoundVariants: e.compoundVariants ? px(e.compoundVariants, i) : []
    };
  }, a = (e.slots ?? []).map((i) => [i, t(i)]);
  for (const [i, o] of Object.entries(
    e.variants ?? {}
  ))
    for (const [n, l] of Object.entries(
      o
    ))
      a.forEach(([s, d]) => {
        var c;
        (c = d.variants)[i] ?? (c[i] = {}), d.variants[i][n] = l[s] ?? {};
      });
  return Object.fromEntries(a);
}, px = (e, t) => e.filter((r) => r.css[t]).map((r) => ({
  ...r,
  css: r.css[t]
}));
function vx(e) {
  const { cva: t } = e;
  return function(a = {}) {
    const i = Object.entries(gx(a)).map(
      ([h, u]) => [h, t(u)]
    );
    function o(h) {
      const u = i.map(([f, g]) => [f, g(h)]);
      return Object.fromEntries(u);
    }
    const n = a.variants ?? {}, l = Object.keys(n);
    function s(h) {
      var v;
      const u = d0(h, ["recipe"]), [f, g] = qr(u, l);
      return l.includes("colorPalette") || (f.colorPalette = h.colorPalette || ((v = a.defaultVariants) == null ? void 0 : v.colorPalette)), l.includes("orientation") && (g.orientation = h.orientation), [f, g];
    }
    const d = Object.fromEntries(
      Object.entries(n).map(([h, u]) => [h, Object.keys(u)])
    );
    let c = {};
    return a.className && (c = Object.fromEntries(
      a.slots.map((h) => [
        h,
        `${a.className}__${h}`
      ])
    )), Object.assign(o, {
      variantMap: d,
      variantKeys: l,
      splitVariantProps: s,
      classNameMap: c
    });
  };
}
const mx = () => (e) => Array.from(new Set(e)), bx = /([\0-\x1f\x7f]|^-?\d)|^-$|^-|[^\x80-\uFFFF\w-]/g, yx = function(e, t) {
  return t ? e === "\0" ? "�" : e === "-" && e.length === 1 ? "\\-" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) : "\\" + e;
}, u0 = (e) => (e + "").replace(bx, yx), h0 = (e, t) => {
  let r = "", a = 0, i = "char", o = "", n = "";
  const l = [];
  for (; a < e.length; ) {
    const s = e[a];
    if (s === "{") {
      const c = e.indexOf("}", a);
      if (c === -1)
        break;
      const h = e.slice(a + 1, c), u = t(h);
      r += u ?? h, a = c + 1;
      continue;
    }
    if (i === "token" && s === ",") {
      e[a] === "" && a++, i = "fallback", l.push(i);
      const c = t(o);
      c != null && c.endsWith(")") && (r += c.slice(0, -1)), o = "", n = "";
      continue;
    }
    if (i === "fallback" && n + s === ", var(") {
      const u = xx(e.slice(a + 1)) + a + 1, f = e.slice(a + 1, u);
      if (u === -1)
        break;
      r += ", var(" + f + ")", a = u + 1, i = l.pop() ?? i, n = "";
      continue;
    }
    if (i === "token" || i === "fallback") {
      if (a++, s === ")") {
        i = l.pop() ?? i ?? "char", n += s;
        const c = o && (t(o) ?? u0(o));
        if (n) {
          if (n = n.slice(1).trim(), !n.startsWith("token(") && n.endsWith(")") && (n = n.slice(0, -1)), n.includes("token(")) {
            const u = h0(n, t);
            u && (n = u.slice(0, -1));
          } else if (n) {
            const u = t(n);
            u && (n = u);
          }
        }
        const h = r.at(-1);
        n ? h != null && h.trim() ? r += c.slice(0, -1) + (", " + n + ")") : r += n : r += c || ")", o = "", n = "", i = "char";
        continue;
      }
      i === "token" && (o += s), i === "fallback" && (n += s);
      continue;
    }
    const d = e.indexOf("token(", a);
    if (d !== -1) {
      const c = d + 6;
      r += e.slice(a, d), a = c, i = "token", l.push(i);
      continue;
    }
    r += s, a++;
  }
  return r;
}, xx = (e) => {
  let t = 0;
  const r = ["("];
  for (; t < e.length; ) {
    const a = e[t];
    if (a === "(")
      r.push(a);
    else if (a === ")" && (r.pop(), r.length === 0))
      return t;
    t++;
  }
  return t;
};
function f0(e) {
  const t = {};
  return e.forEach((r, a) => {
    r instanceof Map ? t[a] = Object.fromEntries(r) : t[a] = r;
  }), t;
}
const g0 = /({([^}]*)})/g, kx = /[{}]/g, _x = /\w+\.\w+/, p0 = (e) => {
  if (!Nt(e)) return [];
  const t = e.match(g0);
  return t ? t.map((r) => r.replace(kx, "")).map((r) => r.trim()) : [];
}, Sx = (e) => g0.test(e);
function v0(e) {
  var r, a, i;
  if (!((r = e.extensions) != null && r.references))
    return ((i = (a = e.extensions) == null ? void 0 : a.cssVar) == null ? void 0 : i.ref) ?? e.value;
  const t = e.extensions.references ?? {};
  return e.value = Object.keys(t).reduce((o, n) => {
    const l = t[n];
    if (l.extensions.conditions)
      return o;
    const s = v0(l);
    return o.replace(`{${n}}`, s);
  }, e.value), delete e.extensions.references, e.value;
}
function m0(e) {
  return ot(e) && e.reference ? e.reference : String(e);
}
const qi = (e, ...t) => t.map(m0).join(` ${e} `).replace(/calc/g, ""), Bs = (...e) => `calc(${qi("+", ...e)})`, Ks = (...e) => `calc(${qi("-", ...e)})`, sn = (...e) => `calc(${qi("*", ...e)})`, Ws = (...e) => `calc(${qi("/", ...e)})`, js = (e) => {
  const t = m0(e);
  return t != null && !Number.isNaN(parseFloat(t)) ? String(t).startsWith("-") ? String(t).slice(1) : `-${t}` : sn(t, -1);
}, Wr = Object.assign(
  (e) => ({
    add: (...t) => Wr(Bs(e, ...t)),
    subtract: (...t) => Wr(Ks(e, ...t)),
    multiply: (...t) => Wr(sn(e, ...t)),
    divide: (...t) => Wr(Ws(e, ...t)),
    negate: () => Wr(js(e)),
    toString: () => e.toString()
  }),
  {
    add: Bs,
    subtract: Ks,
    multiply: sn,
    divide: Ws,
    negate: js
  }
), wx = {
  enforce: "pre",
  transform(e) {
    const { prefix: t, allTokens: r, formatCssVar: a, formatTokenName: i, registerToken: o } = e;
    r.filter(
      ({ extensions: l }) => l.category === "spacing"
    ).forEach((l) => {
      const s = l.path.slice(), d = a(s, t);
      if (Nt(l.value) && l.value === "0rem")
        return;
      const c = structuredClone(l);
      Object.assign(c.extensions, {
        negative: !0,
        prop: `-${l.extensions.prop}`,
        originalPath: s
      }), c.value = Wr.negate(d.ref);
      const h = c.path[c.path.length - 1];
      h != null && (c.path[c.path.length - 1] = `-${h}`), c.path && (c.name = i(c.path)), o(c);
    });
  }
}, $x = /* @__PURE__ */ new Set([
  "spacing",
  "sizes",
  "borderWidths",
  "fontSizes",
  "radii"
]), Ex = {
  enforce: "post",
  transform(e) {
    e.allTokens.filter((r) => $x.has(r.extensions.category) && !r.extensions.negative).forEach((r) => {
      Object.assign(r.extensions, {
        pixelValue: r0(r.value)
      });
    });
  }
}, Px = {
  enforce: "post",
  transform(e) {
    const { allTokens: t, registerToken: r, formatTokenName: a } = e, i = t.filter(
      ({ extensions: l }) => l.category === "colors"
    ), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
    i.forEach((l) => {
      const { colorPalette: s } = l.extensions;
      s && (s.keys.forEach((d) => {
        o.set(a(d), d);
      }), s.roots.forEach((d) => {
        var u;
        const c = a(d), h = n.get(c) || [];
        if (h.push(l), n.set(c, h), l.extensions.default && d.length === 1) {
          const f = (u = s.keys[0]) == null ? void 0 : u.filter(Boolean);
          if (!f.length) return;
          const g = d.concat(f);
          o.set(a(g), []);
        }
      }));
    }), o.forEach((l) => {
      const s = ["colors", "colorPalette", ...l].filter(Boolean), d = a(s), c = a(s.slice(1));
      r({
        name: d,
        value: d,
        originalValue: d,
        path: s,
        extensions: {
          condition: "base",
          originalPath: s,
          category: "colors",
          prop: c,
          virtual: !0
        }
      }, "pre");
    });
  }
}, Cx = {
  enforce: "post",
  transform(e) {
    e.allTokens = e.allTokens.filter(
      (t) => t.value !== ""
    );
  }
}, Tx = [
  wx,
  Px,
  Ex,
  Cx
], Ix = {
  type: "extensions",
  enforce: "pre",
  name: "tokens/css-var",
  transform(e, t) {
    const { prefix: r, formatCssVar: a } = t, { negative: i, originalPath: o } = e.extensions, n = i ? o : e.path;
    return {
      cssVar: a(n.filter(Boolean), r)
    };
  }
}, Rx = {
  enforce: "post",
  type: "value",
  name: "tokens/conditionals",
  transform(e, t) {
    const { prefix: r, formatCssVar: a } = t, i = p0(e.value);
    return i.length && i.forEach((o) => {
      const n = a(o.split("."), r);
      e.value = e.value.replace(`{${n.ref}}`, n);
    }), e.value;
  }
}, Dx = {
  type: "extensions",
  enforce: "pre",
  name: "tokens/colors/colorPalette",
  match(e) {
    return e.extensions.category === "colors" && !e.extensions.virtual;
  },
  transform(e, t) {
    let r = e.path.slice();
    if (r.pop(), r.shift(), r.length === 0) {
      const l = [...e.path];
      l.shift(), r = l;
    }
    if (r.length === 0)
      return {};
    const a = r.reduce((l, s, d, c) => {
      const h = c.slice(0, d + 1);
      return l.push(h), l;
    }, []), i = r[0], o = t.formatTokenName(r), n = e.path.slice(e.path.indexOf(i) + 1).reduce((l, s, d, c) => (l.push(c.slice(d)), l), []);
    return n.length === 0 && n.push([""]), {
      colorPalette: { value: o, roots: a, keys: n }
    };
  }
}, Ax = [
  Ix,
  Rx,
  Dx
], Vs = (e) => ot(e) && Object.prototype.hasOwnProperty.call(e, "value");
function zx(e) {
  return e ? {
    breakpoints: Ut(e, (t) => ({ value: t })),
    sizes: Object.fromEntries(
      Object.entries(e).map(([t, r]) => [
        `breakpoint-${t}`,
        { value: r }
      ])
    )
  } : { breakpoints: {}, sizes: {} };
}
function Ox(e) {
  const {
    prefix: t = "",
    tokens: r = {},
    semanticTokens: a = {},
    breakpoints: i = {}
  } = e, o = (A) => A.join("."), n = (A, N) => Jh(A.join("-"), { prefix: N }), l = [], s = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = [];
  function m(A, N) {
    l.push(A), s.set(A.name, A), N && v.forEach((Y) => {
      Y.enforce === N && J(Y, A);
    });
  }
  const x = zx(i), S = ta({
    ...r,
    breakpoints: x.breakpoints,
    sizes: {
      ...r.sizes,
      ...x.sizes
    }
  });
  function T() {
    Xt(
      S,
      (A, N) => {
        const Y = N.includes("DEFAULT");
        N = Hs(N);
        const ce = N[0], M = o(N), $e = Nt(A) ? { value: A } : A, Ye = {
          value: $e.value,
          originalValue: $e.value,
          name: M,
          path: N,
          extensions: {
            condition: "base",
            originalPath: N,
            category: ce,
            prop: o(N.slice(1))
          }
        };
        Y && (Ye.extensions.default = !0), m(Ye);
      },
      { stop: Vs }
    ), Xt(
      a,
      (A, N) => {
        const Y = N.includes("DEFAULT");
        N = b0(Hs(N));
        const ce = N[0], M = o(N), $e = Nt(A.value) ? { value: { base: A.value } } : A, Ye = {
          value: $e.value.base || "",
          originalValue: $e.value.base || "",
          name: M,
          path: N,
          extensions: {
            originalPath: N,
            category: ce,
            conditions: $e.value,
            condition: "base",
            prop: o(N.slice(1))
          }
        };
        Y && (Ye.extensions.default = !0), m(Ye);
      },
      { stop: Vs }
    );
  }
  function k(A) {
    return s.get(A);
  }
  function $(A) {
    const { condition: N } = A.extensions;
    N && (d.has(N) || d.set(N, /* @__PURE__ */ new Set()), d.get(N).add(A));
  }
  function D(A) {
    const { category: N, prop: Y } = A.extensions;
    N && (g.has(N) || g.set(N, /* @__PURE__ */ new Map()), g.get(N).set(Y, A));
  }
  function p(A) {
    const { condition: N, negative: Y, virtual: ce, cssVar: M } = A.extensions;
    Y || ce || !N || !M || (c.has(N) || c.set(N, /* @__PURE__ */ new Map()), c.get(N).set(M.var, A.value));
  }
  function w(A) {
    const { category: N, prop: Y, cssVar: ce, negative: M } = A.extensions;
    if (!N) return;
    f.has(N) || f.set(N, /* @__PURE__ */ new Map());
    const $e = M ? A.extensions.conditions ? A.originalValue : A.value : ce.ref;
    f.get(N).set(Y, $e), u.set([N, Y].join("."), $e);
  }
  function I(A) {
    const { colorPalette: N, virtual: Y, default: ce } = A.extensions;
    !N || Y || N.roots.forEach((M) => {
      var da;
      const $e = o(M);
      h.has($e) || h.set($e, /* @__PURE__ */ new Map());
      const Ye = Nx(
        [...A.path],
        [...M]
      ), ht = o(Ye), ft = k(ht);
      if (!ft || !ft.extensions.cssVar) return;
      const { var: qa } = ft.extensions.cssVar;
      if (h.get($e).set(qa, A.extensions.cssVar.ref), ce && M.length === 1) {
        const Rr = o(["colors", "colorPalette"]), Xa = k(Rr);
        if (!Xa) return;
        const oo = o(A.path), Dr = k(oo);
        if (!Dr) return;
        const Za = (da = N.keys[0]) == null ? void 0 : da.filter(Boolean);
        if (!Za.length) return;
        const ca = o(M.concat(Za));
        h.has(ca) || h.set(ca, /* @__PURE__ */ new Map()), h.get(ca).set(
          Xa.extensions.cssVar.var,
          Dr.extensions.cssVar.ref
        );
      }
    });
  }
  let P = {};
  function O() {
    l.forEach((A) => {
      $(A), D(A), p(A), w(A), I(A);
    }), P = f0(f);
  }
  const _ = (A, N) => {
    var ft;
    if (!A || typeof A != "string") return { invalid: !0, value: A };
    const [Y, ce] = A.split("/");
    if (!Y || !ce)
      return { invalid: !0, value: Y };
    const M = N(Y), $e = (ft = k(`opacity.${ce}`)) == null ? void 0 : ft.value;
    if (!$e && isNaN(Number(ce)))
      return { invalid: !0, value: Y };
    const Ye = $e ? Number($e) * 100 + "%" : `${ce}%`, ht = M ?? Y;
    return {
      invalid: !1,
      color: ht,
      value: `color-mix(in srgb, ${ht} ${Ye}, transparent)`
    };
  }, E = Xr((A, N) => u.get(A) ?? N), F = Xr((A) => P[A] || null), W = Xr((A) => h0(A, (N) => {
    if (!N) return;
    if (N.includes("/")) {
      const ce = _(N, (M) => E(M));
      if (ce.invalid)
        throw new Error("Invalid color mix at " + N + ": " + ce.value);
      return ce.value;
    }
    const Y = E(N);
    return Y || (_x.test(N) ? u0(N) : N);
  })), H = {
    prefix: t,
    allTokens: l,
    tokenMap: s,
    registerToken: m,
    getByName: k,
    formatTokenName: o,
    formatCssVar: n,
    flatMap: u,
    cssVarMap: c,
    categoryMap: g,
    colorPaletteMap: h,
    getVar: E,
    getCategoryValues: F,
    expandReferenceInValue: W
  };
  function R(...A) {
    A.forEach((N) => {
      v.set(N.name, N);
    });
  }
  function U(...A) {
    b.push(...A);
  }
  function J(A, N) {
    if (N.extensions.references || Su(A.match) && !A.match(N)) return;
    const ce = ((M) => A.transform(M, H))(N);
    switch (!0) {
      case A.type === "extensions":
        Object.assign(N.extensions, ce);
        break;
      case A.type === "value":
        N.value = ce;
        break;
      default:
        N[A.type] = ce;
        break;
    }
  }
  function Ce(A) {
    b.forEach((N) => {
      N.enforce === A && N.transform(H);
    });
  }
  function Fe(A) {
    v.forEach((N) => {
      N.enforce === A && l.forEach((Y) => {
        J(N, Y);
      });
    });
  }
  function He() {
    l.forEach((A) => {
      const N = Fx(A);
      !N || N.length === 0 || N.forEach((Y) => {
        m(Y);
      });
    });
  }
  function Ue(A) {
    return p0(A).map((Y) => k(Y)).filter(Boolean);
  }
  function Ge() {
    l.forEach((A) => {
      if (!Sx(A.value)) return;
      const N = Ue(A.value);
      A.extensions.references = N.reduce((Y, ce) => (Y[ce.name] = ce, Y), {});
    });
  }
  function ut() {
    l.forEach((A) => {
      v0(A);
    });
  }
  function kt() {
    Ce("pre"), Fe("pre"), He(), Ge(), ut(), Ce("post"), Fe("post"), O();
  }
  return T(), R(...Ax), U(...Tx), kt(), H;
}
function Hs(e) {
  return e[0] === "DEFAULT" ? e : e.filter((t) => t !== "DEFAULT");
}
function b0(e) {
  return e.filter((t) => t !== "base");
}
function Fx(e) {
  if (!e.extensions.conditions) return;
  const { conditions: t } = e.extensions, r = [];
  return Xt(t, (a, i) => {
    const o = b0(i);
    if (!o.length) return;
    const n = structuredClone(e);
    n.value = a, n.extensions.condition = o.join(":"), r.push(n);
  }), r;
}
function Nx(e, t) {
  const r = e.findIndex(
    (a, i) => t.every(
      (o, n) => e[i + n] === o
    )
  );
  return r === -1 || (e.splice(r, t.length), e.splice(r, 0, "colorPalette")), e;
}
mx()([
  "aspectRatios",
  "zIndex",
  "opacity",
  "colors",
  "fonts",
  "fontSizes",
  "fontWeights",
  "lineHeights",
  "letterSpacings",
  "sizes",
  "shadows",
  "spacing",
  "radii",
  "cursor",
  "borders",
  "borderWidths",
  "borderStyles",
  "durations",
  "easings",
  "animations",
  "blurs",
  "gradients",
  "breakpoints",
  "assets"
]);
function Lx(e) {
  return Object.fromEntries(
    Object.entries(e).map(([t, r]) => [t, r])
  );
}
function Mx(e) {
  const t = Lx(e.config), r = e.tokens, a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  function o(p, w) {
    t[p] = w, n(p, w);
  }
  const n = (p, w) => {
    const I = v(w);
    I && (i.set(p, I), h(p, w));
  }, l = () => {
    for (const [p, w] of Object.entries(t))
      w && n(p, w);
  }, s = () => {
    for (const [p, w] of Object.entries(t)) {
      const { shorthand: I } = w ?? {};
      if (!I) continue;
      (Array.isArray(I) ? I : [I]).forEach((O) => a.set(O, p));
    }
  }, d = () => {
    const p = f0(r.colorPaletteMap);
    o("colorPalette", {
      values: Object.keys(p),
      transform: Xr((w) => p[w])
    });
  }, c = /* @__PURE__ */ new Map(), h = (p, w) => {
    if (!w) return;
    const I = v(w, (O) => `type:Tokens["${O}"]`);
    if (typeof I == "object" && I.type) {
      c.set(p, /* @__PURE__ */ new Set([`type:${I.type}`]));
      return;
    }
    if (I) {
      const O = new Set(Object.keys(I));
      c.set(p, O);
    }
    const P = c.get(p) ?? /* @__PURE__ */ new Set();
    w.property && c.set(p, P.add(`CssProperties["${w.property}"]`));
  }, u = () => {
    for (const [p, w] of Object.entries(t))
      w && h(p, w);
  }, f = (p, w) => {
    const I = c.get(p) ?? /* @__PURE__ */ new Set();
    c.set(p, /* @__PURE__ */ new Set([...I, ...w]));
  }, g = () => {
    const p = /* @__PURE__ */ new Map();
    for (const [w, I] of c.entries()) {
      if (I.size === 0) {
        p.set(w, ["string"]);
        continue;
      }
      const P = Array.from(I).map((O) => O.startsWith("CssProperties") ? O : O.startsWith("type:") ? O.replace("type:", "") : JSON.stringify(O));
      p.set(w, P);
    }
    return p;
  }, v = (p, w) => {
    const { values: I } = p, P = (O) => {
      const _ = w == null ? void 0 : w(O);
      return _ ? { [_]: _ } : void 0;
    };
    return Nt(I) ? (P == null ? void 0 : P(I)) ?? r.getCategoryValues(I) ?? {} : Array.isArray(I) ? I.reduce((O, _) => (O[_] = _, O), {}) : Su(I) ? I(w ? P : r.getCategoryValues) : I;
  }, b = (p, w) => ({
    [p]: p.startsWith("--") ? r.getVar(w, w) : w
  }), m = Object.assign(r.getVar, {
    raw: (p) => r.getByName(p)
  }), x = (p, w) => {
    var E;
    const I = k(p);
    Nt(w) && !w.includes("_EMO_") && (w = r.expandReferenceInValue(w));
    const P = t[I];
    if (!P)
      return b(I, w);
    const O = (E = i.get(I)) == null ? void 0 : E[w];
    if (!P.transform)
      return b(p, O ?? w);
    const _ = (F) => x2(F, m);
    return P.transform(O ?? w, {
      raw: w,
      token: m,
      utils: { colorMix: _ }
    });
  };
  function S() {
    s(), d(), l(), u();
  }
  S();
  const T = a.size > 0, k = (p) => a.get(p) ?? p;
  return {
    keys: () => [...Array.from(a.keys()), ...Object.keys(t)],
    hasShorthand: T,
    transform: x,
    shorthands: a,
    resolveShorthand: k,
    register: o,
    getTypes: g,
    addPropertyType: f
  };
}
function y0(...e) {
  const t = Zh(...e), {
    theme: r = {},
    utilities: a = {},
    globalCss: i = {},
    cssVarsRoot: o = ":where(:root, :host)",
    cssVarsPrefix: n = "chakra",
    preflight: l
  } = t, s = dx(t), d = Ox({
    breakpoints: r.breakpoints,
    tokens: r.tokens,
    semanticTokens: r.semanticTokens,
    prefix: n
  }), c = W2(r.breakpoints ?? {}), h = U2({
    conditions: t.conditions ?? {},
    breakpoints: c
  }), u = Mx({
    config: a,
    tokens: d
  });
  function f() {
    const { textStyles: R, layerStyles: U, animationStyles: J } = r, Ce = ta({
      textStyle: R,
      layerStyle: U,
      animationStyle: J
    });
    for (const [Fe, He] of Object.entries(Ce)) {
      const Ue = B2(
        He ?? {},
        (Ge) => ot(Ge) && "value" in Ge
      );
      u.register(Fe, {
        values: Object.keys(Ue),
        transform(Ge) {
          return S(Ue[Ge]);
        }
      });
    }
  }
  f(), u.addPropertyType("animationName", Object.keys(r.keyframes ?? {}));
  const g = /* @__PURE__ */ new Set(["css", ...u.keys(), ...h.keys()]), v = Xr(
    (R) => g.has(R) || L2(R)
  ), b = (R) => Array.isArray(R) ? R.reduce((U, J, Ce) => {
    const Fe = h.breakpoints[Ce];
    return J != null && (U[Fe] = J), U;
  }, {}) : R, m = cx({
    utility: u,
    normalize: b
  }), x = hx({
    conditions: h,
    isValidProperty: v
  }), S = s0({
    transform: u.transform,
    conditions: h,
    normalize: m
  }), T = nx({
    css: S,
    conditions: h,
    normalize: m,
    layers: s
  }), k = vx({ cva: T });
  function $() {
    const R = {};
    for (const [U, J] of d.cssVarMap.entries()) {
      const Ce = Object.fromEntries(J);
      if (Object.keys(Ce).length === 0) continue;
      const Fe = U === "base" ? o : h.resolve(U), He = S(x({ [Fe]: Ce }));
      ia(R, He);
    }
    return s.wrap("tokens", R);
  }
  function D() {
    const R = Object.fromEntries(
      Object.entries(r.keyframes ?? {}).map(([J, Ce]) => [
        `@keyframes ${J}`,
        Ce
      ])
    ), U = Object.assign({}, R, S(x(i)));
    return s.wrap("base", U);
  }
  function p(R) {
    return qr(R, v);
  }
  function w() {
    const R = ux({ preflight: l });
    return s.wrap("reset", R);
  }
  const I = Bx(d), P = (R, U) => {
    var J;
    return ((J = I.get(R)) == null ? void 0 : J.value) || U;
  };
  P.var = (R, U) => {
    var J;
    return ((J = I.get(R)) == null ? void 0 : J.variable) || U;
  };
  function O(R, U) {
    var J;
    return ((J = r.recipes) == null ? void 0 : J[R]) ?? U;
  }
  function _(R, U) {
    var J;
    return ((J = r.slotRecipes) == null ? void 0 : J[R]) ?? U;
  }
  function E(R) {
    return Object.hasOwnProperty.call(r.recipes ?? {}, R);
  }
  function F(R) {
    return Object.hasOwnProperty.call(r.slotRecipes ?? {}, R);
  }
  function W(R) {
    return E(R) || F(R);
  }
  const H = [w(), D(), $()];
  return {
    $$chakra: !0,
    _config: t,
    _global: H,
    breakpoints: c,
    tokens: d,
    conditions: h,
    utility: u,
    token: P,
    properties: g,
    layers: s,
    isValidProperty: v,
    splitCssProps: p,
    normalizeValue: b,
    getTokenCss: $,
    getGlobalCss: D,
    getPreflightCss: w,
    css: S,
    cva: T,
    sva: k,
    getRecipe: O,
    getSlotRecipe: _,
    hasRecipe: W,
    isRecipe: E,
    isSlotRecipe: F
  };
}
function Bx(e) {
  const t = /* @__PURE__ */ new Map();
  return e.allTokens.forEach((r) => {
    const { cssVar: a, virtual: i, conditions: o } = r.extensions, n = o || i ? a.ref : r.value;
    t.set(r.name, { value: n, variable: a.ref });
  }), t;
}
const Kx = {
  sm: "480px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
}, _o = "var(--chakra-empty,/*!*/ /*!*/)", Wx = Hh({
  "*": {
    fontFeatureSettings: '"cv11"',
    "--ring-inset": _o,
    "--ring-offset-width": "0px",
    "--ring-offset-color": "#fff",
    "--ring-color": "rgba(66, 153, 225, 0.6)",
    "--ring-offset-shadow": "0 0 #0000",
    "--ring-shadow": "0 0 #0000",
    ...Object.fromEntries(
      [
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        "saturate",
        "sepia",
        "drop-shadow"
      ].map((e) => [`--${e}`, _o])
    ),
    ...Object.fromEntries(
      [
        "blur",
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        "opacity",
        "saturate",
        "sepia"
      ].map((e) => [`--backdrop-${e}`, _o])
    ),
    "--global-font-mono": "fonts.mono",
    "--global-font-body": "fonts.body",
    "--global-color-border": "colors.border"
  },
  html: {
    color: "fg",
    bg: "bg",
    lineHeight: "1.5",
    colorPalette: "gray"
  },
  "*::placeholder": {
    color: "fg.muted/80"
  },
  "*::selection": {
    bg: "colorPalette.muted/80"
  }
}), jx = qh({
  // fill: some background color + color combination
  "fill.muted": {
    value: {
      background: "colorPalette.muted",
      color: "colorPalette.fg"
    }
  },
  "fill.subtle": {
    value: {
      background: "colorPalette.subtle",
      color: "colorPalette.fg"
    }
  },
  "fill.surface": {
    value: {
      background: "colorPalette.subtle",
      color: "colorPalette.fg",
      boxShadow: "0 0 0px 1px var(--shadow-color)",
      boxShadowColor: "colorPalette.muted"
    }
  },
  "fill.solid": {
    value: {
      background: "colorPalette.solid",
      color: "colorPalette.contrast"
    }
  },
  // outline: some border color + color combination
  "outline.subtle": {
    value: {
      color: "colorPalette.fg",
      boxShadow: "inset 0 0 0px 1px var(--shadow-color)",
      boxShadowColor: "colorPalette.subtle"
    }
  },
  "outline.solid": {
    value: {
      borderWidth: "1px",
      borderColor: "colorPalette.solid",
      color: "colorPalette.fg"
    }
  },
  // indicator: floating border color or left/bottom border
  "indicator.bottom": {
    value: {
      position: "relative",
      "--indicator-color-fallback": "colors.colorPalette.solid",
      _before: {
        content: '""',
        position: "absolute",
        bottom: "var(--indicator-offset-y, 0)",
        insetInline: "var(--indicator-offset-x, 0)",
        height: "var(--indicator-thickness, 2px)",
        background: "var(--indicator-color, var(--indicator-color-fallback))"
      }
    }
  },
  "indicator.top": {
    value: {
      position: "relative",
      "--indicator-color-fallback": "colors.colorPalette.solid",
      _before: {
        content: '""',
        position: "absolute",
        top: "var(--indicator-offset-y, 0)",
        insetInline: "var(--indicator-offset-x, 0)",
        height: "var(--indicator-thickness, 2px)",
        background: "var(--indicator-color, var(--indicator-color-fallback))"
      }
    }
  },
  "indicator.start": {
    value: {
      position: "relative",
      "--indicator-color-fallback": "colors.colorPalette.solid",
      _before: {
        content: '""',
        position: "absolute",
        insetInlineStart: "var(--indicator-offset-x, 0)",
        insetBlock: "var(--indicator-offset-y, 0)",
        width: "var(--indicator-thickness, 2px)",
        background: "var(--indicator-color, var(--indicator-color-fallback))"
      }
    }
  },
  "indicator.end": {
    value: {
      position: "relative",
      "--indicator-color-fallback": "colors.colorPalette.solid",
      _before: {
        content: '""',
        position: "absolute",
        insetInlineEnd: "var(--indicator-offset-x, 0)",
        insetBlock: "var(--indicator-offset-y, 0)",
        width: "var(--indicator-thickness, 2px)",
        background: "var(--indicator-color, var(--indicator-color-fallback))"
      }
    }
  },
  disabled: {
    value: {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  },
  none: {
    value: {}
  }
}), Vx = Yh({
  "slide-fade-in": {
    value: {
      transformOrigin: "var(--transform-origin)",
      "&[data-placement^=top]": {
        animationName: "slide-from-bottom, fade-in"
      },
      "&[data-placement^=bottom]": {
        animationName: "slide-from-top, fade-in"
      },
      "&[data-placement^=left]": {
        animationName: "slide-from-right, fade-in"
      },
      "&[data-placement^=right]": {
        animationName: "slide-from-left, fade-in"
      }
    }
  },
  "slide-fade-out": {
    value: {
      transformOrigin: "var(--transform-origin)",
      "&[data-placement^=top]": {
        animationName: "slide-to-bottom, fade-out"
      },
      "&[data-placement^=bottom]": {
        animationName: "slide-to-top, fade-out"
      },
      "&[data-placement^=left]": {
        animationName: "slide-to-right, fade-out"
      },
      "&[data-placement^=right]": {
        animationName: "slide-to-left, fade-out"
      }
    }
  },
  "scale-fade-in": {
    value: {
      transformOrigin: "var(--transform-origin)",
      animationName: "scale-in, fade-in"
    }
  },
  "scale-fade-out": {
    value: {
      transformOrigin: "var(--transform-origin)",
      animationName: "scale-out, fade-out"
    }
  }
}), nl = be({
  className: "chakra-badge",
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "l2",
    gap: "1",
    fontWeight: "medium",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    userSelect: "none"
  },
  variants: {
    variant: {
      solid: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast"
      },
      subtle: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg"
      },
      outline: {
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted"
      },
      surface: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted"
      },
      plain: {
        color: "colorPalette.fg"
      }
    },
    size: {
      xs: {
        textStyle: "2xs",
        px: "1",
        minH: "4"
      },
      sm: {
        textStyle: "xs",
        px: "1.5",
        minH: "5"
      },
      md: {
        textStyle: "sm",
        px: "2",
        minH: "6"
      },
      lg: {
        textStyle: "sm",
        px: "2.5",
        minH: "7"
      }
    }
  },
  defaultVariants: {
    variant: "subtle",
    size: "sm"
  }
}), Hx = be({
  className: "chakra-button",
  base: {
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    position: "relative",
    borderRadius: "l2",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    borderWidth: "1px",
    borderColor: "transparent",
    cursor: "button",
    flexShrink: "0",
    outline: "0",
    lineHeight: "1.2",
    isolation: "isolate",
    fontWeight: "medium",
    transitionProperty: "common",
    transitionDuration: "moderate",
    focusVisibleRing: "outside",
    _disabled: {
      layerStyle: "disabled"
    },
    _icon: {
      flexShrink: "0"
    }
  },
  variants: {
    size: {
      "2xs": {
        h: "6",
        minW: "6",
        textStyle: "xs",
        px: "2",
        gap: "1",
        _icon: {
          width: "3.5",
          height: "3.5"
        }
      },
      xs: {
        h: "8",
        minW: "8",
        textStyle: "xs",
        px: "2.5",
        gap: "1",
        _icon: {
          width: "4",
          height: "4"
        }
      },
      sm: {
        h: "9",
        minW: "9",
        px: "3.5",
        textStyle: "sm",
        gap: "2",
        _icon: {
          width: "4",
          height: "4"
        }
      },
      md: {
        h: "10",
        minW: "10",
        textStyle: "sm",
        px: "4",
        gap: "2",
        _icon: {
          width: "5",
          height: "5"
        }
      },
      lg: {
        h: "11",
        minW: "11",
        textStyle: "md",
        px: "5",
        gap: "3",
        _icon: {
          width: "5",
          height: "5"
        }
      },
      xl: {
        h: "12",
        minW: "12",
        textStyle: "md",
        px: "5",
        gap: "2.5",
        _icon: {
          width: "5",
          height: "5"
        }
      },
      "2xl": {
        h: "16",
        minW: "16",
        textStyle: "lg",
        px: "7",
        gap: "3",
        _icon: {
          width: "6",
          height: "6"
        }
      }
    },
    variant: {
      solid: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",
        _hover: {
          bg: "colorPalette.solid/90"
        },
        _expanded: {
          bg: "colorPalette.solid/90"
        }
      },
      subtle: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        _hover: {
          bg: "colorPalette.muted"
        },
        _expanded: {
          bg: "colorPalette.muted"
        }
      },
      surface: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        shadow: "0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted",
        _hover: {
          bg: "colorPalette.muted"
        },
        _expanded: {
          bg: "colorPalette.muted"
        }
      },
      outline: {
        borderWidth: "1px",
        borderColor: "colorPalette.muted",
        color: "colorPalette.fg",
        _hover: {
          bg: "colorPalette.subtle"
        },
        _expanded: {
          bg: "colorPalette.subtle"
        }
      },
      ghost: {
        color: "colorPalette.fg",
        _hover: {
          bg: "colorPalette.subtle"
        },
        _expanded: {
          bg: "colorPalette.subtle"
        }
      },
      plain: {
        color: "colorPalette.fg"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "solid"
  }
}), Be = be({
  className: "chakra-checkmark",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    color: "white",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "l1",
    focusVisibleRing: "outside",
    _icon: {
      boxSize: "full"
    },
    _invalid: {
      colorPalette: "red",
      borderColor: "border.error"
    },
    _disabled: {
      opacity: "0.5"
    }
  },
  variants: {
    size: {
      xs: {
        boxSize: "3"
      },
      sm: {
        boxSize: "4"
      },
      md: {
        boxSize: "5",
        p: "0.5"
      },
      lg: {
        boxSize: "6",
        p: "0.5"
      }
    },
    variant: {
      solid: {
        borderColor: "border",
        "&:is([data-state=checked], [data-state=indeterminate])": {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast",
          borderColor: "colorPalette.solid"
        }
      },
      outline: {
        borderColor: "border",
        "&:is([data-state=checked], [data-state=indeterminate])": {
          color: "colorPalette.fg",
          borderColor: "colorPalette.solid"
        }
      },
      subtle: {
        bg: "colorPalette.muted",
        borderColor: "colorPalette.muted",
        "&:is([data-state=checked], [data-state=indeterminate])": {
          color: "colorPalette.fg"
        }
      },
      plain: {
        "&:is([data-state=checked], [data-state=indeterminate])": {
          color: "colorPalette.fg"
        }
      },
      inverted: {
        borderColor: "border",
        color: "colorPalette.fg",
        "&:is([data-state=checked], [data-state=indeterminate])": {
          borderColor: "colorPalette.solid"
        }
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
}), { variants: Ux, defaultVariants: Gx } = nl, Yx = be({
  className: "chakra-code",
  base: {
    fontFamily: "mono",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "l2"
  },
  variants: Ux,
  defaultVariants: Gx
}), x0 = be({
  className: "color-swatch",
  base: {
    boxSize: "var(--swatch-size)",
    shadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
    "--checker-size": "8px",
    "--checker-bg": "colors.bg",
    "--checker-fg": "colors.bg.emphasized",
    background: "linear-gradient(var(--color), var(--color)), repeating-conic-gradient(var(--checker-fg) 0%, var(--checker-fg) 25%, var(--checker-bg) 0%, var(--checker-bg) 50%) 0% 50% / var(--checker-size) var(--checker-size) !important",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0"
  },
  variants: {
    size: {
      "2xs": { "--swatch-size": "sizes.3.5" },
      xs: { "--swatch-size": "sizes.4" },
      sm: { "--swatch-size": "sizes.4.5" },
      md: { "--swatch-size": "sizes.5" },
      lg: { "--swatch-size": "sizes.6" },
      xl: { "--swatch-size": "sizes.7" },
      "2xl": { "--swatch-size": "sizes.8" },
      inherit: { "--swatch-size": "inherit" },
      full: { "--swatch-size": "100%" }
    },
    shape: {
      square: { borderRadius: "none" },
      circle: { borderRadius: "full" },
      rounded: { borderRadius: "l1" }
    }
  },
  defaultVariants: {
    size: "md",
    shape: "rounded"
  }
}), qx = be({
  className: "chakra-container",
  base: {
    position: "relative",
    maxWidth: "8xl",
    w: "100%",
    mx: "auto",
    px: { base: "4", md: "6", lg: "8" }
  },
  variants: {
    centerContent: {
      true: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }
    },
    fluid: {
      true: {
        maxWidth: "full"
      }
    }
  }
}), Xx = be({
  className: "chakra-heading",
  base: {
    fontFamily: "heading",
    fontWeight: "semibold"
  },
  variants: {
    size: {
      xs: { textStyle: "xs" },
      sm: { textStyle: "sm" },
      md: { textStyle: "md" },
      lg: { textStyle: "lg" },
      xl: { textStyle: "xl" },
      "2xl": { textStyle: "2xl" },
      "3xl": { textStyle: "3xl" },
      "4xl": { textStyle: "4xl" },
      "5xl": { textStyle: "5xl" },
      "6xl": { textStyle: "6xl" },
      "7xl": { textStyle: "7xl" }
    }
  },
  defaultVariants: {
    size: "xl"
  }
}), Zx = be({
  className: "chakra-icon",
  base: {
    display: "inline-block",
    lineHeight: "1em",
    flexShrink: "0",
    color: "currentcolor",
    verticalAlign: "middle"
  },
  variants: {
    size: {
      inherit: {},
      xs: { boxSize: "3" },
      sm: { boxSize: "4" },
      md: { boxSize: "5" },
      lg: { boxSize: "6" },
      xl: { boxSize: "7" },
      "2xl": { boxSize: "8" }
    }
  },
  defaultVariants: {
    size: "inherit"
  }
}), Ae = be({
  className: "chakra-input",
  base: {
    width: "100%",
    minWidth: "0",
    outline: "0",
    position: "relative",
    appearance: "none",
    textAlign: "start",
    borderRadius: "l2",
    _disabled: {
      layerStyle: "disabled"
    },
    height: "var(--input-height)",
    minW: "var(--input-height)",
    "--focus-color": "colors.colorPalette.focusRing",
    "--error-color": "colors.border.error",
    _invalid: {
      focusRingColor: "var(--error-color)",
      borderColor: "var(--error-color)"
    }
  },
  variants: {
    size: {
      "2xs": {
        textStyle: "xs",
        px: "2",
        "--input-height": "sizes.7"
      },
      xs: {
        textStyle: "xs",
        px: "2",
        "--input-height": "sizes.8"
      },
      sm: {
        textStyle: "sm",
        px: "2.5",
        "--input-height": "sizes.9"
      },
      md: {
        textStyle: "sm",
        px: "3",
        "--input-height": "sizes.10"
      },
      lg: {
        textStyle: "md",
        px: "4",
        "--input-height": "sizes.11"
      },
      xl: {
        textStyle: "md",
        px: "4.5",
        "--input-height": "sizes.12"
      },
      "2xl": {
        textStyle: "lg",
        px: "5",
        "--input-height": "sizes.16"
      }
    },
    variant: {
      outline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "border",
        focusVisibleRing: "inside"
      },
      subtle: {
        borderWidth: "1px",
        borderColor: "transparent",
        bg: "bg.muted",
        focusVisibleRing: "inside"
      },
      flushed: {
        bg: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "border",
        borderRadius: "0",
        px: "0",
        _focusVisible: {
          borderColor: "var(--focus-color)",
          boxShadow: "0px 1px 0px 0px var(--focus-color)"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), Jx = be({
  className: "chakra-input-addon",
  base: {
    flex: "0 0 auto",
    width: "auto",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    alignSelf: "stretch",
    borderRadius: "l2"
  },
  variants: {
    size: Ae.variants.size,
    variant: {
      outline: {
        borderWidth: "1px",
        borderColor: "border",
        bg: "bg.muted"
      },
      subtle: {
        borderWidth: "1px",
        borderColor: "transparent",
        bg: "bg.emphasized"
      },
      flushed: {
        borderBottom: "1px solid",
        borderColor: "inherit",
        borderRadius: "0",
        px: "0",
        bg: "transparent"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), Qx = be({
  className: "chakra-kbd",
  base: {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "medium",
    fontFamily: "mono",
    flexShrink: "0",
    whiteSpace: "nowrap",
    wordSpacing: "-0.5em",
    userSelect: "none",
    px: "1",
    borderRadius: "l2"
  },
  variants: {
    variant: {
      raised: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        borderWidth: "1px",
        borderBottomWidth: "2px",
        borderColor: "colorPalette.muted"
      },
      outline: {
        borderWidth: "1px",
        color: "colorPalette.fg"
      },
      subtle: {
        bg: "colorPalette.muted",
        color: "colorPalette.fg"
      },
      plain: {
        color: "colorPalette.fg"
      }
    },
    size: {
      sm: {
        textStyle: "xs",
        height: "4.5"
      },
      md: {
        textStyle: "sm",
        height: "5"
      },
      lg: {
        textStyle: "md",
        height: "6"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "raised"
  }
}), e3 = be({
  className: "chakra-link",
  base: {
    display: "inline-flex",
    alignItems: "center",
    outline: "none",
    gap: "1.5",
    cursor: "pointer",
    borderRadius: "l1",
    focusRing: "outside"
  },
  variants: {
    variant: {
      underline: {
        color: "colorPalette.fg",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/20"
      },
      plain: {
        color: "colorPalette.fg",
        _hover: {
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          textDecorationColor: "currentColor/20"
        }
      }
    }
  },
  defaultVariants: {
    variant: "plain"
  }
}), t3 = be({
  className: "chakra-mark",
  base: {
    bg: "transparent",
    color: "inherit",
    whiteSpace: "nowrap"
  },
  variants: {
    variant: {
      subtle: {
        bg: "colorPalette.subtle",
        color: "inherit"
      },
      solid: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast"
      },
      text: {
        fontWeight: "medium"
      },
      plain: {}
    }
  }
}), Ke = be({
  className: "chakra-radiomark",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    verticalAlign: "top",
    color: "white",
    borderWidth: "1px",
    borderColor: "transparent",
    borderRadius: "full",
    cursor: "radio",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "colorPalette.focusRing",
      outlineOffset: "2px"
    },
    _invalid: {
      colorPalette: "red",
      borderColor: "red.500"
    },
    _disabled: {
      opacity: "0.5",
      cursor: "disabled"
    },
    "& .dot": {
      height: "100%",
      width: "100%",
      borderRadius: "full",
      bg: "currentColor",
      scale: "0.4"
    }
  },
  variants: {
    variant: {
      solid: {
        borderWidth: "1px",
        borderColor: "border",
        _checked: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast",
          borderColor: "colorPalette.solid"
        }
      },
      subtle: {
        borderWidth: "1px",
        bg: "colorPalette.muted",
        borderColor: "colorPalette.muted",
        color: "transparent",
        _checked: {
          color: "colorPalette.fg"
        }
      },
      outline: {
        borderWidth: "1px",
        borderColor: "inherit",
        _checked: {
          color: "colorPalette.fg",
          borderColor: "colorPalette.solid"
        },
        "& .dot": {
          scale: "0.6"
        }
      },
      inverted: {
        bg: "bg",
        borderWidth: "1px",
        borderColor: "inherit",
        _checked: {
          color: "colorPalette.solid",
          borderColor: "currentcolor"
        }
      }
    },
    size: {
      xs: {
        boxSize: "3"
      },
      sm: {
        boxSize: "4"
      },
      md: {
        boxSize: "5"
      },
      lg: {
        boxSize: "6"
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
}), r3 = be({
  className: "chakra-separator",
  base: {
    display: "block",
    borderColor: "border"
  },
  variants: {
    variant: {
      solid: {
        borderStyle: "solid"
      },
      dashed: {
        borderStyle: "dashed"
      },
      dotted: {
        borderStyle: "dotted"
      }
    },
    orientation: {
      vertical: {
        borderInlineStartWidth: "var(--separator-thickness)"
      },
      horizontal: {
        borderTopWidth: "var(--separator-thickness)"
      }
    },
    size: {
      xs: {
        "--separator-thickness": "0.5px"
      },
      sm: {
        "--separator-thickness": "1px"
      },
      md: {
        "--separator-thickness": "2px"
      },
      lg: {
        "--separator-thickness": "3px"
      }
    }
  },
  defaultVariants: {
    size: "sm",
    variant: "solid",
    orientation: "horizontal"
  }
}), a3 = be({
  className: "chakra-skeleton",
  base: {},
  variants: {
    loading: {
      true: {
        borderRadius: "l2",
        boxShadow: "none",
        backgroundClip: "padding-box",
        cursor: "default",
        color: "transparent",
        pointerEvents: "none",
        userSelect: "none",
        flexShrink: "0",
        "&::before, &::after, *": {
          visibility: "hidden"
        }
      },
      false: {
        background: "unset",
        animation: "fade-in var(--fade-duration, 0.1s) ease-out !important"
      }
    },
    variant: {
      pulse: {
        background: "bg.emphasized",
        animation: "pulse",
        animationDuration: "var(--duration, 1.2s)"
      },
      shine: {
        "--animate-from": "200%",
        "--animate-to": "-200%",
        "--start-color": "colors.bg.muted",
        "--end-color": "colors.bg.emphasized",
        backgroundImage: "linear-gradient(270deg,var(--start-color),var(--end-color),var(--end-color),var(--start-color))",
        backgroundSize: "400% 100%",
        animation: "bg-position var(--duration, 5s) ease-in-out infinite"
      },
      none: {
        animation: "none"
      }
    }
  },
  defaultVariants: {
    variant: "pulse",
    loading: !0
  }
}), i3 = be({
  className: "chakra-skip-nav",
  base: {
    display: "inline-flex",
    bg: "bg.panel",
    padding: "2.5",
    borderRadius: "l2",
    fontWeight: "semibold",
    focusVisibleRing: "outside",
    textStyle: "sm",
    // visually hidden
    userSelect: "none",
    border: "0",
    height: "1px",
    width: "1px",
    margin: "-1px",
    outline: "0",
    overflow: "hidden",
    position: "absolute",
    clip: "rect(0 0 0 0)",
    _focusVisible: {
      clip: "auto",
      width: "auto",
      height: "auto",
      position: "fixed",
      top: "6",
      insetStart: "6"
    }
  }
}), o3 = be({
  className: "chakra-spinner",
  base: {
    display: "inline-block",
    borderColor: "currentColor",
    borderStyle: "solid",
    borderWidth: "2px",
    borderRadius: "full",
    width: "var(--spinner-size)",
    height: "var(--spinner-size)",
    animation: "spin",
    animationDuration: "slowest",
    "--spinner-track-color": "transparent",
    borderBottomColor: "var(--spinner-track-color)",
    borderInlineStartColor: "var(--spinner-track-color)"
  },
  variants: {
    size: {
      inherit: { "--spinner-size": "1em" },
      xs: { "--spinner-size": "sizes.3" },
      sm: { "--spinner-size": "sizes.4" },
      md: { "--spinner-size": "sizes.5" },
      lg: { "--spinner-size": "sizes.8" },
      xl: { "--spinner-size": "sizes.10" }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), n3 = be({
  className: "chakra-textarea",
  base: {
    width: "100%",
    minWidth: "0",
    outline: "0",
    position: "relative",
    appearance: "none",
    textAlign: "start",
    borderRadius: "l2",
    _disabled: {
      layerStyle: "disabled"
    },
    "--focus-color": "colors.colorPalette.focusRing",
    "--error-color": "colors.border.error",
    _invalid: {
      focusRingColor: "var(--error-color)",
      borderColor: "var(--error-color)"
    }
  },
  variants: {
    size: {
      xs: {
        textStyle: "xs",
        px: "2",
        py: "1.5",
        scrollPaddingBottom: "1.5"
      },
      sm: {
        textStyle: "sm",
        px: "2.5",
        py: "2",
        scrollPaddingBottom: "2"
      },
      md: {
        textStyle: "sm",
        px: "3",
        py: "2",
        scrollPaddingBottom: "2"
      },
      lg: {
        textStyle: "md",
        px: "4",
        py: "3",
        scrollPaddingBottom: "3"
      },
      xl: {
        textStyle: "md",
        px: "4.5",
        py: "3.5",
        scrollPaddingBottom: "3.5"
      }
    },
    variant: {
      outline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "border",
        focusVisibleRing: "inside"
      },
      subtle: {
        borderWidth: "1px",
        borderColor: "transparent",
        bg: "bg.muted",
        focusVisibleRing: "inside"
      },
      flushed: {
        bg: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "border",
        borderRadius: "0",
        px: "0",
        _focusVisible: {
          borderColor: "var(--focus-color)",
          boxShadow: "0px 1px 0px 0px var(--focus-color)"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), l3 = {
  badge: nl,
  button: Hx,
  code: Yx,
  container: qx,
  heading: Xx,
  input: Ae,
  inputAddon: Jx,
  kbd: Qx,
  link: e3,
  mark: t3,
  separator: r3,
  skeleton: a3,
  skipNavLink: i3,
  spinner: o3,
  textarea: n3,
  icon: Zx,
  checkmark: Be,
  radiomark: Ke,
  colorSwatch: x0
}, s3 = oa.colors({
  bg: {
    DEFAULT: {
      value: { _light: "{colors.white}", _dark: "{colors.black}" }
    },
    subtle: {
      value: { _light: "{colors.gray.50}", _dark: "{colors.gray.950}" }
    },
    muted: {
      value: { _light: "{colors.gray.100}", _dark: "{colors.gray.900}" }
    },
    emphasized: {
      value: { _light: "{colors.gray.200}", _dark: "{colors.gray.800}" }
    },
    inverted: {
      value: { _light: "{colors.black}", _dark: "{colors.white}" }
    },
    panel: {
      value: { _light: "{colors.white}", _dark: "{colors.gray.950}" }
    },
    error: {
      value: { _light: "{colors.red.50}", _dark: "{colors.red.950}" }
    },
    warning: {
      value: { _light: "{colors.orange.50}", _dark: "{colors.orange.950}" }
    },
    success: {
      value: { _light: "{colors.green.50}", _dark: "{colors.green.950}" }
    },
    info: {
      value: { _light: "{colors.blue.50}", _dark: "{colors.blue.950}" }
    }
  },
  fg: {
    DEFAULT: {
      value: { _light: "{colors.black}", _dark: "{colors.gray.50}" }
    },
    muted: {
      value: { _light: "{colors.gray.600}", _dark: "{colors.gray.400}" }
    },
    subtle: {
      value: { _light: "{colors.gray.400}", _dark: "{colors.gray.500}" }
    },
    inverted: {
      value: { _light: "{colors.gray.50}", _dark: "{colors.black}" }
    },
    error: {
      value: { _light: "{colors.red.500}", _dark: "{colors.red.400}" }
    },
    warning: {
      value: { _light: "{colors.orange.600}", _dark: "{colors.orange.300}" }
    },
    success: {
      value: { _light: "{colors.green.600}", _dark: "{colors.green.300}" }
    },
    info: {
      value: { _light: "{colors.blue.600}", _dark: "{colors.blue.300}" }
    }
  },
  border: {
    DEFAULT: {
      value: { _light: "{colors.gray.200}", _dark: "{colors.gray.800}" }
    },
    muted: {
      value: { _light: "{colors.gray.100}", _dark: "{colors.gray.900}" }
    },
    subtle: {
      value: { _light: "{colors.gray.50}", _dark: "{colors.gray.950}" }
    },
    emphasized: {
      value: { _light: "{colors.gray.300}", _dark: "{colors.gray.700}" }
    },
    inverted: {
      value: { _light: "{colors.gray.800}", _dark: "{colors.gray.200}" }
    },
    error: {
      value: { _light: "{colors.red.500}", _dark: "{colors.red.400}" }
    },
    warning: {
      value: { _light: "{colors.orange.500}", _dark: "{colors.orange.400}" }
    },
    success: {
      value: { _light: "{colors.green.500}", _dark: "{colors.green.400}" }
    },
    info: {
      value: { _light: "{colors.blue.500}", _dark: "{colors.blue.400}" }
    }
  },
  gray: {
    contrast: {
      value: { _light: "{colors.white}", _dark: "{colors.black}" }
    },
    fg: {
      value: { _light: "{colors.gray.800}", _dark: "{colors.gray.200}" }
    },
    subtle: {
      value: { _light: "{colors.gray.100}", _dark: "{colors.gray.900}" }
    },
    muted: {
      value: { _light: "{colors.gray.200}", _dark: "{colors.gray.800}" }
    },
    emphasized: {
      value: { _light: "{colors.gray.300}", _dark: "{colors.gray.700}" }
    },
    solid: {
      value: { _light: "{colors.gray.900}", _dark: "{colors.white}" }
    },
    focusRing: {
      value: { _light: "{colors.gray.800}", _dark: "{colors.gray.200}" }
    }
  },
  red: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.red.700}", _dark: "{colors.red.300}" }
    },
    subtle: {
      value: { _light: "{colors.red.100}", _dark: "{colors.red.900}" }
    },
    muted: {
      value: { _light: "{colors.red.200}", _dark: "{colors.red.800}" }
    },
    emphasized: {
      value: { _light: "{colors.red.300}", _dark: "{colors.red.700}" }
    },
    solid: {
      value: { _light: "{colors.red.600}", _dark: "{colors.red.600}" }
    },
    focusRing: {
      value: { _light: "{colors.red.600}", _dark: "{colors.red.600}" }
    }
  },
  orange: {
    contrast: {
      value: { _light: "white", _dark: "black" }
    },
    fg: {
      value: { _light: "{colors.orange.700}", _dark: "{colors.orange.300}" }
    },
    subtle: {
      value: { _light: "{colors.orange.100}", _dark: "{colors.orange.900}" }
    },
    muted: {
      value: { _light: "{colors.orange.200}", _dark: "{colors.orange.800}" }
    },
    emphasized: {
      value: { _light: "{colors.orange.300}", _dark: "{colors.orange.700}" }
    },
    solid: {
      value: { _light: "{colors.orange.600}", _dark: "{colors.orange.500}" }
    },
    focusRing: {
      value: { _light: "{colors.orange.600}", _dark: "{colors.orange.500}" }
    }
  },
  green: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.green.700}", _dark: "{colors.green.300}" }
    },
    subtle: {
      value: { _light: "{colors.green.100}", _dark: "{colors.green.900}" }
    },
    muted: {
      value: { _light: "{colors.green.200}", _dark: "{colors.green.800}" }
    },
    emphasized: {
      value: { _light: "{colors.green.300}", _dark: "{colors.green.700}" }
    },
    solid: {
      value: { _light: "{colors.green.600}", _dark: "{colors.green.600}" }
    },
    focusRing: {
      value: { _light: "{colors.green.600}", _dark: "{colors.green.600}" }
    }
  },
  blue: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.blue.700}", _dark: "{colors.blue.300}" }
    },
    subtle: {
      value: { _light: "{colors.blue.100}", _dark: "{colors.blue.900}" }
    },
    muted: {
      value: { _light: "{colors.blue.200}", _dark: "{colors.blue.800}" }
    },
    emphasized: {
      value: { _light: "{colors.blue.300}", _dark: "{colors.blue.700}" }
    },
    solid: {
      value: { _light: "{colors.blue.600}", _dark: "{colors.blue.600}" }
    },
    focusRing: {
      value: { _light: "{colors.blue.600}", _dark: "{colors.blue.600}" }
    }
  },
  yellow: {
    contrast: {
      value: { _light: "black", _dark: "black" }
    },
    fg: {
      value: { _light: "{colors.yellow.800}", _dark: "{colors.yellow.300}" }
    },
    subtle: {
      value: { _light: "{colors.yellow.100}", _dark: "{colors.yellow.900}" }
    },
    muted: {
      value: { _light: "{colors.yellow.200}", _dark: "{colors.yellow.800}" }
    },
    emphasized: {
      value: { _light: "{colors.yellow.300}", _dark: "{colors.yellow.700}" }
    },
    solid: {
      value: { _light: "{colors.yellow.300}", _dark: "{colors.yellow.300}" }
    },
    focusRing: {
      value: { _light: "{colors.yellow.300}", _dark: "{colors.yellow.300}" }
    }
  },
  teal: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.teal.700}", _dark: "{colors.teal.300}" }
    },
    subtle: {
      value: { _light: "{colors.teal.100}", _dark: "{colors.teal.900}" }
    },
    muted: {
      value: { _light: "{colors.teal.200}", _dark: "{colors.teal.800}" }
    },
    emphasized: {
      value: { _light: "{colors.teal.300}", _dark: "{colors.teal.700}" }
    },
    solid: {
      value: { _light: "{colors.teal.600}", _dark: "{colors.teal.600}" }
    },
    focusRing: {
      value: { _light: "{colors.teal.600}", _dark: "{colors.teal.600}" }
    }
  },
  purple: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.purple.700}", _dark: "{colors.purple.300}" }
    },
    subtle: {
      value: { _light: "{colors.purple.100}", _dark: "{colors.purple.900}" }
    },
    muted: {
      value: { _light: "{colors.purple.200}", _dark: "{colors.purple.800}" }
    },
    emphasized: {
      value: { _light: "{colors.purple.300}", _dark: "{colors.purple.700}" }
    },
    solid: {
      value: { _light: "{colors.purple.600}", _dark: "{colors.purple.600}" }
    },
    focusRing: {
      value: { _light: "{colors.purple.600}", _dark: "{colors.purple.600}" }
    }
  },
  pink: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.pink.700}", _dark: "{colors.pink.300}" }
    },
    subtle: {
      value: { _light: "{colors.pink.100}", _dark: "{colors.pink.900}" }
    },
    muted: {
      value: { _light: "{colors.pink.200}", _dark: "{colors.pink.800}" }
    },
    emphasized: {
      value: { _light: "{colors.pink.300}", _dark: "{colors.pink.700}" }
    },
    solid: {
      value: { _light: "{colors.pink.600}", _dark: "{colors.pink.600}" }
    },
    focusRing: {
      value: { _light: "{colors.pink.600}", _dark: "{colors.pink.600}" }
    }
  },
  cyan: {
    contrast: {
      value: { _light: "white", _dark: "white" }
    },
    fg: {
      value: { _light: "{colors.cyan.700}", _dark: "{colors.cyan.300}" }
    },
    subtle: {
      value: { _light: "{colors.cyan.100}", _dark: "{colors.cyan.900}" }
    },
    muted: {
      value: { _light: "{colors.cyan.200}", _dark: "{colors.cyan.800}" }
    },
    emphasized: {
      value: { _light: "{colors.cyan.300}", _dark: "{colors.cyan.700}" }
    },
    solid: {
      value: { _light: "{colors.cyan.600}", _dark: "{colors.cyan.600}" }
    },
    focusRing: {
      value: { _light: "{colors.cyan.600}", _dark: "{colors.cyan.600}" }
    }
  }
}), d3 = oa.radii({
  l1: { value: "{radii.xs}" },
  l2: { value: "{radii.sm}" },
  l3: { value: "{radii.md}" }
}), c3 = oa.shadows({
  xs: {
    value: {
      _light: "0px 1px 2px {colors.gray.900/10}, 0px 0px 1px {colors.gray.900/20}",
      _dark: "0px 1px 1px {black/64}, 0px 0px 1px inset {colors.gray.300/20}"
    }
  },
  sm: {
    value: {
      _light: "0px 2px 4px {colors.gray.900/10}, 0px 0px 1px {colors.gray.900/30}",
      _dark: "0px 2px 4px {black/64}, 0px 0px 1px inset {colors.gray.300/30}"
    }
  },
  md: {
    value: {
      _light: "0px 4px 8px {colors.gray.900/10}, 0px 0px 1px {colors.gray.900/30}",
      _dark: "0px 4px 8px {black/64}, 0px 0px 1px inset {colors.gray.300/30}"
    }
  },
  lg: {
    value: {
      _light: "0px 8px 16px {colors.gray.900/10}, 0px 0px 1px {colors.gray.900/30}",
      _dark: "0px 8px 16px {black/64}, 0px 0px 1px inset {colors.gray.300/30}"
    }
  },
  xl: {
    value: {
      _light: "0px 16px 24px {colors.gray.900/10}, 0px 0px 1px {colors.gray.900/30}",
      _dark: "0px 16px 24px {black/64}, 0px 0px 1px inset {colors.gray.300/30}"
    }
  },
  "2xl": {
    value: {
      _light: "0px 24px 40px {colors.gray.900/16}, 0px 0px 1px {colors.gray.900/30}",
      _dark: "0px 24px 40px {black/64}, 0px 0px 1px inset {colors.gray.300/30}"
    }
  },
  inner: {
    value: {
      _light: "inset 0 2px 4px 0 {black/5}",
      _dark: "inset 0 2px 4px 0 black"
    }
  },
  inset: {
    value: {
      _light: "inset 0 0 0 1px {black/5}",
      _dark: "inset 0 0 0 1px {colors.gray.300/5}"
    }
  }
}), u3 = nh.extendWith("itemBody"), h3 = Z("action-bar").parts(
  "positioner",
  "content",
  "separator",
  "selectionTrigger",
  "closeTrigger"
), f3 = Z("alert").parts(
  "title",
  "description",
  "root",
  "indicator",
  "content"
), g3 = Z("breadcrumb").parts(
  "link",
  "currentLink",
  "item",
  "list",
  "root",
  "ellipsis",
  "separator"
), p3 = Z("blockquote").parts(
  "root",
  "icon",
  "content",
  "caption"
), v3 = Z("card").parts(
  "root",
  "header",
  "body",
  "footer",
  "title",
  "description"
), m3 = Z("checkbox-card", [
  "root",
  "control",
  "label",
  "description",
  "addon",
  "indicator",
  "content"
]), b3 = Z("data-list").parts(
  "root",
  "item",
  "itemLabel",
  "itemValue"
), y3 = tl.extendWith(
  "header",
  "body",
  "footer",
  "backdrop"
), x3 = tl.extendWith(
  "header",
  "body",
  "footer",
  "backdrop"
), k3 = wh.extendWith("textarea"), _3 = Z("empty-state", [
  "root",
  "content",
  "indicator",
  "title",
  "description"
]), S3 = Eh.extendWith("requiredIndicator"), w3 = Ph.extendWith("content"), $3 = Ch.extendWith(
  "itemContent",
  "dropzoneContent"
), E3 = Z("list").parts(
  "root",
  "item",
  "indicator"
), P3 = Rh.extendWith("itemCommand"), C3 = Z("select").parts(
  "root",
  "field",
  "indicator"
), T3 = Oh.extendWith(
  "header",
  "body",
  "footer"
), k0 = al.extendWith(
  "itemAddon",
  "itemIndicator"
), I3 = k0.extendWith(
  "itemContent",
  "itemDescription"
), R3 = Nh.extendWith("itemIndicator"), D3 = Mh.extendWith("indicatorGroup"), A3 = Bh.extendWith("markerIndicator"), z3 = Z("stat").parts(
  "root",
  "label",
  "helpText",
  "valueText",
  "valueUnit",
  "indicator"
), O3 = Z("status").parts("root", "indicator"), F3 = Z("steps", [
  "root",
  "list",
  "item",
  "trigger",
  "indicator",
  "separator",
  "content",
  "title",
  "description",
  "nextTrigger",
  "prevTrigger",
  "progress"
]), N3 = jh.extendWith("indicator"), L3 = Z("table").parts(
  "root",
  "header",
  "body",
  "row",
  "columnHeader",
  "cell",
  "footer",
  "caption"
), M3 = Z("toast").parts(
  "root",
  "title",
  "description",
  "indicator",
  "closeTrigger",
  "actionTrigger"
), B3 = Z("tabs").parts(
  "root",
  "trigger",
  "list",
  "content",
  "contentGroup",
  "indicator"
), K3 = Z("tag").parts(
  "root",
  "label",
  "closeTrigger",
  "startElement",
  "endElement"
), W3 = Z("timeline").parts(
  "root",
  "item",
  "content",
  "separator",
  "indicator",
  "connector",
  "title",
  "description"
), j3 = q({
  className: "chakra-accordion",
  slots: u3.keys(),
  base: {
    root: {
      width: "full",
      "--accordion-radius": "radii.l2"
    },
    item: {
      overflowAnchor: "none"
    },
    itemTrigger: {
      display: "flex",
      alignItems: "center",
      width: "full",
      outline: "0",
      gap: "3",
      fontWeight: "medium",
      borderRadius: "var(--accordion-radius)",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "colorPalette.focusRing"
      },
      _disabled: {
        layerStyle: "disabled"
      }
    },
    itemBody: {
      pt: "var(--accordion-padding-y)",
      pb: "calc(var(--accordion-padding-y) * 2)"
    },
    itemContent: {
      overflow: "hidden",
      borderRadius: "var(--accordion-radius)",
      _open: {
        animationName: "expand-height, fade-in",
        animationDuration: "moderate"
      },
      _closed: {
        animationName: "collapse-height, fade-out",
        animationDuration: "moderate"
      }
    },
    itemIndicator: {
      transition: "rotate 0.2s",
      transformOrigin: "center",
      color: "fg.subtle",
      _open: {
        rotate: "180deg"
      },
      _icon: {
        width: "1.2em",
        height: "1.2em"
      }
    }
  },
  variants: {
    variant: {
      outline: {
        item: {
          borderBottomWidth: "1px"
        }
      },
      subtle: {
        itemTrigger: {
          px: "var(--accordion-padding-x)"
        },
        itemContent: {
          px: "var(--accordion-padding-x)"
        },
        item: {
          borderRadius: "var(--accordion-radius)",
          _open: {
            bg: "colorPalette.subtle"
          }
        }
      },
      enclosed: {
        root: {
          borderWidth: "1px",
          borderRadius: "var(--accordion-radius)",
          divideY: "1px",
          overflow: "hidden"
        },
        itemTrigger: {
          px: "var(--accordion-padding-x)"
        },
        itemContent: {
          px: "var(--accordion-padding-x)"
        },
        item: {
          _open: {
            bg: "bg.subtle"
          }
        }
      },
      plain: {}
    },
    size: {
      sm: {
        root: {
          "--accordion-padding-x": "spacing.3",
          "--accordion-padding-y": "spacing.2"
        },
        itemTrigger: {
          textStyle: "sm",
          py: "var(--accordion-padding-y)"
        }
      },
      md: {
        root: {
          "--accordion-padding-x": "spacing.4",
          "--accordion-padding-y": "spacing.2"
        },
        itemTrigger: {
          textStyle: "md",
          py: "var(--accordion-padding-y)"
        }
      },
      lg: {
        root: {
          "--accordion-padding-x": "spacing.4.5",
          "--accordion-padding-y": "spacing.2.5"
        },
        itemTrigger: {
          textStyle: "lg",
          py: "var(--accordion-padding-y)"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), V3 = q({
  className: "chakra-action-bar",
  slots: h3.keys(),
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
      insetInline: "0",
      top: "unset",
      bottom: "calc(env(safe-area-inset-bottom) + 20px)"
    },
    content: {
      bg: "bg.panel",
      shadow: "md",
      display: "flex",
      alignItems: "center",
      gap: "3",
      borderRadius: "l3",
      py: "2.5",
      px: "3",
      pointerEvents: "auto",
      // Stabilize the position of the action bar when the scrollbar is hidden
      // by using the scrollbar width to offset the position.
      translate: "calc(-1 * var(--scrollbar-width) / 2) 0px",
      _open: {
        animationName: "slide-from-bottom, fade-in",
        animationDuration: "moderate"
      },
      _closed: {
        animationName: "slide-to-bottom, fade-out",
        animationDuration: "faster"
      }
    },
    separator: {
      width: "1px",
      height: "5",
      bg: "border"
    },
    selectionTrigger: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2",
      alignSelf: "stretch",
      textStyle: "sm",
      px: "4",
      py: "1",
      borderRadius: "l2",
      borderWidth: "1px",
      borderStyle: "dashed"
    }
  }
}), H3 = q({
  slots: f3.keys(),
  className: "chakra-alert",
  base: {
    root: {
      width: "full",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
      borderRadius: "l3"
    },
    title: {
      fontWeight: "medium"
    },
    description: {
      display: "inline"
    },
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      width: "1em",
      height: "1em",
      _icon: { boxSize: "full" }
    },
    content: {
      display: "flex",
      flex: "1",
      gap: "1"
    }
  },
  variants: {
    status: {
      info: {
        root: { colorPalette: "blue" }
      },
      warning: {
        root: { colorPalette: "orange" }
      },
      success: {
        root: { colorPalette: "green" }
      },
      error: {
        root: { colorPalette: "red" }
      },
      neutral: {
        root: { colorPalette: "gray" }
      }
    },
    inline: {
      true: {
        content: {
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center"
        }
      },
      false: {
        content: {
          display: "flex",
          flexDirection: "column"
        }
      }
    },
    variant: {
      subtle: {
        root: {
          bg: "colorPalette.subtle",
          color: "colorPalette.fg"
        }
      },
      surface: {
        root: {
          bg: "colorPalette.subtle",
          color: "colorPalette.fg",
          shadow: "inset 0 0 0px 1px var(--shadow-color)",
          shadowColor: "colorPalette.muted"
        },
        indicator: {
          color: "colorPalette.fg"
        }
      },
      outline: {
        root: {
          color: "colorPalette.fg",
          shadow: "inset 0 0 0px 1px var(--shadow-color)",
          shadowColor: "colorPalette.muted"
        },
        indicator: {
          color: "colorPalette.fg"
        }
      },
      solid: {
        root: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast"
        },
        indicator: {
          color: "colorPalette.contrast"
        }
      }
    },
    size: {
      sm: {
        root: {
          gap: "2",
          px: "3",
          py: "3",
          textStyle: "xs"
        },
        indicator: {
          textStyle: "lg"
        }
      },
      md: {
        root: {
          gap: "3",
          px: "4",
          py: "4",
          textStyle: "sm"
        },
        indicator: {
          textStyle: "xl"
        }
      },
      lg: {
        root: {
          gap: "3",
          px: "4",
          py: "4",
          textStyle: "md"
        },
        indicator: {
          textStyle: "2xl"
        }
      }
    }
  },
  defaultVariants: {
    status: "info",
    variant: "subtle",
    size: "md",
    inline: !1
  }
}), U3 = q({
  slots: fh.keys(),
  className: "chakra-avatar",
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "medium",
      position: "relative",
      verticalAlign: "top",
      flexShrink: "0",
      userSelect: "none",
      width: "var(--avatar-size)",
      height: "var(--avatar-size)",
      fontSize: "var(--avatar-font-size)",
      borderRadius: "var(--avatar-radius)",
      "&[data-group-item]": {
        borderWidth: "2px",
        borderColor: "bg"
      }
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "var(--avatar-radius)"
    },
    fallback: {
      lineHeight: "1",
      textTransform: "uppercase",
      fontWeight: "medium",
      fontSize: "var(--avatar-font-size)",
      borderRadius: "var(--avatar-radius)"
    }
  },
  variants: {
    size: {
      full: {
        root: {
          "--avatar-size": "100%",
          "--avatar-font-size": "100%"
        }
      },
      "2xs": {
        root: {
          "--avatar-font-size": "fontSizes.2xs",
          "--avatar-size": "sizes.6"
        }
      },
      xs: {
        root: {
          "--avatar-font-size": "fontSizes.xs",
          "--avatar-size": "sizes.8"
        }
      },
      sm: {
        root: {
          "--avatar-font-size": "fontSizes.sm",
          "--avatar-size": "sizes.9"
        }
      },
      md: {
        root: {
          "--avatar-font-size": "fontSizes.md",
          "--avatar-size": "sizes.10"
        }
      },
      lg: {
        root: {
          "--avatar-font-size": "fontSizes.md",
          "--avatar-size": "sizes.11"
        }
      },
      xl: {
        root: {
          "--avatar-font-size": "fontSizes.lg",
          "--avatar-size": "sizes.12"
        }
      },
      "2xl": {
        root: {
          "--avatar-font-size": "fontSizes.xl",
          "--avatar-size": "sizes.16"
        }
      }
    },
    variant: {
      solid: {
        root: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast"
        }
      },
      subtle: {
        root: {
          bg: "colorPalette.muted",
          color: "colorPalette.fg"
        }
      },
      outline: {
        root: {
          color: "colorPalette.fg",
          borderWidth: "1px",
          borderColor: "colorPalette.muted"
        }
      }
    },
    shape: {
      square: {},
      rounded: {
        root: { "--avatar-radius": "radii.l3" }
      },
      full: {
        root: { "--avatar-radius": "radii.full" }
      }
    },
    borderless: {
      true: {
        root: {
          "&[data-group-item]": {
            borderWidth: "0px"
          }
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    shape: "full",
    variant: "subtle"
  }
}), G3 = q({
  className: "chakra-blockquote",
  slots: p3.keys(),
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "2"
    },
    caption: {
      textStyle: "sm",
      color: "fg.muted"
    },
    icon: {
      boxSize: "5"
    }
  },
  variants: {
    justify: {
      start: {
        root: {
          alignItems: "flex-start",
          textAlign: "start"
        }
      },
      center: {
        root: {
          alignItems: "center",
          textAlign: "center"
        }
      },
      end: {
        root: {
          alignItems: "flex-end",
          textAlign: "end"
        }
      }
    },
    variant: {
      subtle: {
        root: {
          paddingX: "5",
          borderStartWidth: "4px",
          borderStartColor: "colorPalette.muted"
        },
        icon: {
          color: "colorPalette.fg"
        }
      },
      solid: {
        root: {
          paddingX: "5",
          borderStartWidth: "4px",
          borderStartColor: "colorPalette.solid"
        },
        icon: {
          color: "colorPalette.solid"
        }
      },
      plain: {
        root: {
          paddingX: "5"
        },
        icon: {
          color: "colorPalette.solid"
        }
      }
    }
  },
  defaultVariants: {
    variant: "subtle",
    justify: "start"
  }
}), Y3 = q({
  className: "chakra-breadcrumb",
  slots: g3.keys(),
  base: {
    list: {
      display: "flex",
      alignItems: "center",
      wordBreak: "break-word",
      color: "fg.muted",
      listStyle: "none"
    },
    link: {
      outline: "0",
      textDecoration: "none",
      borderRadius: "l1",
      focusRing: "outside",
      display: "inline-flex",
      alignItems: "center",
      gap: "2"
    },
    item: {
      display: "inline-flex",
      alignItems: "center"
    },
    separator: {
      color: "fg.muted",
      opacity: "0.8",
      _icon: {
        boxSize: "1em"
      },
      _rtl: {
        rotate: "180deg"
      }
    },
    ellipsis: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      _icon: {
        boxSize: "1em"
      }
    }
  },
  variants: {
    variant: {
      underline: {
        link: {
          color: "colorPalette.fg",
          textDecoration: "underline",
          textUnderlineOffset: "0.2em",
          textDecorationColor: "colorPalette.muted"
        },
        currentLink: {
          color: "colorPalette.fg"
        }
      },
      plain: {
        link: {
          color: "fg.muted",
          _hover: { color: "fg" }
        },
        currentLink: {
          color: "fg"
        }
      }
    },
    size: {
      sm: {
        list: {
          gap: "1",
          textStyle: "xs"
        }
      },
      md: {
        list: {
          gap: "1.5",
          textStyle: "sm"
        }
      },
      lg: {
        list: {
          gap: "2",
          textStyle: "md"
        }
      }
    }
  },
  defaultVariants: {
    variant: "plain",
    size: "md"
  }
}), q3 = q({
  className: "chakra-card",
  slots: v3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: "0",
      wordWrap: "break-word",
      borderRadius: "l3",
      color: "fg",
      textAlign: "start"
    },
    title: {
      fontWeight: "semibold"
    },
    description: {
      color: "fg.muted",
      fontSize: "sm"
    },
    header: {
      paddingInline: "var(--card-padding)",
      paddingTop: "var(--card-padding)",
      display: "flex",
      flexDirection: "column",
      gap: "1.5"
    },
    body: {
      padding: "var(--card-padding)",
      flex: "1",
      display: "flex",
      flexDirection: "column"
    },
    footer: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      paddingInline: "var(--card-padding)",
      paddingBottom: "var(--card-padding)"
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          "--card-padding": "spacing.4"
        },
        title: {
          textStyle: "md"
        }
      },
      md: {
        root: {
          "--card-padding": "spacing.6"
        },
        title: {
          textStyle: "lg"
        }
      },
      lg: {
        root: {
          "--card-padding": "spacing.7"
        },
        title: {
          textStyle: "xl"
        }
      }
    },
    variant: {
      elevated: {
        root: {
          bg: "bg.panel",
          boxShadow: "md"
        }
      },
      outline: {
        root: {
          bg: "bg.panel",
          borderWidth: "1px",
          borderColor: "border"
        }
      },
      subtle: {
        root: {
          bg: "bg.muted"
        }
      }
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md"
  }
});
var Ud, Gd, Yd, qd, Xd, Zd, Jd, Qd, ec, tc, rc, ac, ic, oc;
const X3 = q({
  slots: wy.keys(),
  className: "chakra-checkbox",
  base: {
    root: {
      display: "inline-flex",
      gap: "2",
      alignItems: "center",
      verticalAlign: "top",
      position: "relative"
    },
    control: Be.base,
    label: {
      fontWeight: "medium",
      userSelect: "none",
      _disabled: {
        opacity: "0.5"
      }
    }
  },
  variants: {
    size: {
      xs: {
        root: { gap: "1.5" },
        label: { textStyle: "xs" },
        control: (Gd = (Ud = Be.variants) == null ? void 0 : Ud.size) == null ? void 0 : Gd.xs
      },
      sm: {
        root: { gap: "2" },
        label: { textStyle: "sm" },
        control: (qd = (Yd = Be.variants) == null ? void 0 : Yd.size) == null ? void 0 : qd.sm
      },
      md: {
        root: { gap: "2.5" },
        label: { textStyle: "sm" },
        control: (Zd = (Xd = Be.variants) == null ? void 0 : Xd.size) == null ? void 0 : Zd.md
      },
      lg: {
        root: { gap: "3" },
        label: { textStyle: "md" },
        control: (Qd = (Jd = Be.variants) == null ? void 0 : Jd.size) == null ? void 0 : Qd.lg
      }
    },
    variant: {
      outline: {
        control: (tc = (ec = Be.variants) == null ? void 0 : ec.variant) == null ? void 0 : tc.outline
      },
      solid: {
        control: (ac = (rc = Be.variants) == null ? void 0 : rc.variant) == null ? void 0 : ac.solid
      },
      subtle: {
        control: (oc = (ic = Be.variants) == null ? void 0 : ic.variant) == null ? void 0 : oc.subtle
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
});
var nc, lc, sc, dc, cc, uc, hc;
const Z3 = q({
  slots: m3.keys(),
  className: "chakra-checkbox-card",
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      position: "relative",
      borderRadius: "l2",
      flex: "1",
      focusVisibleRing: "outside",
      _disabled: {
        opacity: "0.8",
        borderColor: "border.subtle"
      },
      _invalid: {
        outline: "2px solid",
        outlineColor: "border.error"
      }
    },
    control: {
      display: "inline-flex",
      flex: "1",
      position: "relative",
      borderRadius: "inherit",
      justifyContent: "var(--checkbox-card-justify)",
      alignItems: "var(--checkbox-card-align)"
    },
    label: {
      fontWeight: "medium",
      display: "flex",
      alignItems: "center",
      gap: "2",
      _disabled: {
        opacity: "0.5"
      }
    },
    description: {
      opacity: "0.64",
      textStyle: "sm"
    },
    addon: {
      _disabled: {
        opacity: "0.5"
      }
    },
    indicator: Be.base,
    content: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      gap: "1",
      justifyContent: "var(--checkbox-card-justify)",
      alignItems: "var(--checkbox-card-align)"
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          textStyle: "sm"
        },
        control: {
          padding: "3",
          gap: "1.5"
        },
        addon: {
          px: "3",
          py: "1.5",
          borderTopWidth: "1px"
        },
        indicator: (nc = Be.variants) == null ? void 0 : nc.size.sm
      },
      md: {
        root: {
          textStyle: "sm"
        },
        control: {
          padding: "4",
          gap: "2.5"
        },
        addon: {
          px: "4",
          py: "2",
          borderTopWidth: "1px"
        },
        indicator: (lc = Be.variants) == null ? void 0 : lc.size.md
      },
      lg: {
        root: {
          textStyle: "md"
        },
        control: {
          padding: "4",
          gap: "3.5"
        },
        addon: {
          px: "4",
          py: "2",
          borderTopWidth: "1px"
        },
        indicator: (sc = Be.variants) == null ? void 0 : sc.size.lg
      }
    },
    variant: {
      surface: {
        root: {
          borderWidth: "1px",
          borderColor: "border",
          _checked: {
            bg: "colorPalette.subtle",
            color: "colorPalette.fg",
            borderColor: "colorPalette.muted"
          },
          _disabled: {
            bg: "bg.muted"
          }
        },
        indicator: (dc = Be.variants) == null ? void 0 : dc.variant.solid
      },
      subtle: {
        root: {
          bg: "bg.muted"
        },
        control: {
          _checked: {
            bg: "colorPalette.muted",
            color: "colorPalette.fg"
          }
        },
        indicator: (cc = Be.variants) == null ? void 0 : cc.variant.plain
      },
      outline: {
        root: {
          borderWidth: "1px",
          borderColor: "border",
          _checked: {
            boxShadow: "0 0 0 1px var(--shadow-color)",
            boxShadowColor: "colorPalette.solid",
            borderColor: "colorPalette.solid"
          }
        },
        indicator: (uc = Be.variants) == null ? void 0 : uc.variant.solid
      },
      solid: {
        root: {
          borderWidth: "1px",
          _checked: {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast",
            borderColor: "colorPalette.solid"
          }
        },
        indicator: (hc = Be.variants) == null ? void 0 : hc.variant.inverted
      }
    },
    justify: {
      start: {
        root: { "--checkbox-card-justify": "flex-start" }
      },
      end: {
        root: { "--checkbox-card-justify": "flex-end" }
      },
      center: {
        root: { "--checkbox-card-justify": "center" }
      }
    },
    align: {
      start: {
        root: { "--checkbox-card-align": "flex-start" },
        content: { textAlign: "start" }
      },
      end: {
        root: { "--checkbox-card-align": "flex-end" },
        content: { textAlign: "end" }
      },
      center: {
        root: { "--checkbox-card-align": "center" },
        content: { textAlign: "center" }
      }
    },
    orientation: {
      vertical: {
        control: { flexDirection: "column" }
      },
      horizontal: {
        control: { flexDirection: "row" }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    align: "start",
    orientation: "horizontal"
  }
}), J3 = q({
  slots: lh.keys(),
  className: "chakra-collapsible",
  base: {
    content: {
      overflow: "hidden",
      _open: {
        animationName: "expand-height, fade-in",
        animationDuration: "moderate"
      },
      _closed: {
        animationName: "collapse-height, fade-out",
        animationDuration: "moderate"
      }
    }
  }
});
var fc, gc, pc, vc, mc, bc, yc, xc, kc, _c, Sc, wc, $c, Ec, Pc, Cc, Tc, Ic;
const Q3 = q({
  className: "colorPicker",
  slots: Ey.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5"
    },
    label: {
      color: "fg",
      fontWeight: "medium",
      textStyle: "sm"
    },
    valueText: {
      textAlign: "start"
    },
    control: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      gap: "2",
      position: "relative"
    },
    swatchTrigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flexShrink: "0",
      gap: "2",
      textStyle: "sm",
      minH: "var(--input-height)",
      minW: "var(--input-height)",
      px: "1",
      rounded: "l2",
      _disabled: { opacity: "0.5" },
      "--focus-color": "colors.colorPalette.focusRing",
      "&:focus-visible": {
        borderColor: "var(--focus-color)",
        outline: "1px solid var(--focus-color)"
      },
      "&[data-fit-content]": {
        "--input-height": "unset",
        px: "0",
        border: "0"
      }
    },
    content: {
      display: "flex",
      flexDirection: "column",
      bg: "bg.panel",
      borderRadius: "l3",
      boxShadow: "lg",
      width: "64",
      p: "4",
      gap: "3",
      zIndex: "dropdown",
      _open: {
        animationStyle: "slide-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "slide-fade-out",
        animationDuration: "faster"
      }
    },
    area: {
      height: "180px",
      borderRadius: "l2",
      overflow: "hidden"
    },
    areaThumb: {
      borderRadius: "full",
      height: "var(--thumb-size)",
      width: "var(--thumb-size)",
      borderWidth: "2px",
      borderColor: "white",
      shadow: "sm",
      focusVisibleRing: "mixed",
      focusRingColor: "white"
    },
    areaBackground: {
      height: "full"
    },
    channelSlider: {
      borderRadius: "l2",
      flex: "1"
    },
    channelSliderTrack: {
      height: "var(--slider-height)",
      borderRadius: "inherit",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)"
    },
    swatchGroup: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "2"
    },
    swatch: {
      ...x0.base,
      borderRadius: "l1"
    },
    swatchIndicator: {
      color: "white",
      rounded: "full"
    },
    channelSliderThumb: {
      borderRadius: "full",
      height: "var(--thumb-size)",
      width: "var(--thumb-size)",
      borderWidth: "2px",
      borderColor: "white",
      shadow: "sm",
      transform: "translate(-50%, -50%)",
      focusVisibleRing: "outside",
      focusRingOffset: "1px"
    },
    channelInput: {
      ...Ae.base,
      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0
      }
    },
    formatSelect: {
      textStyle: "xs",
      textTransform: "uppercase",
      borderWidth: "1px",
      minH: "6",
      focusRing: "inside",
      rounded: "l2"
    },
    transparencyGrid: {
      borderRadius: "l2"
    },
    view: {
      display: "flex",
      flexDirection: "column",
      gap: "2"
    }
  },
  variants: {
    size: {
      "2xs": {
        channelInput: (gc = (fc = Ae.variants) == null ? void 0 : fc.size) == null ? void 0 : gc["2xs"],
        swatch: { "--swatch-size": "sizes.4.5" },
        trigger: { "--input-height": "sizes.7" },
        area: { "--thumb-size": "sizes.3" },
        channelSlider: {
          "--slider-height": "sizes.3",
          "--thumb-size": "sizes.3"
        }
      },
      xs: {
        channelInput: (vc = (pc = Ae.variants) == null ? void 0 : pc.size) == null ? void 0 : vc.xs,
        swatch: { "--swatch-size": "sizes.5" },
        trigger: { "--input-height": "sizes.8" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      },
      sm: {
        channelInput: (bc = (mc = Ae.variants) == null ? void 0 : mc.size) == null ? void 0 : bc.sm,
        swatch: { "--swatch-size": "sizes.6" },
        trigger: { "--input-height": "sizes.9" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      },
      md: {
        channelInput: (xc = (yc = Ae.variants) == null ? void 0 : yc.size) == null ? void 0 : xc.md,
        swatch: { "--swatch-size": "sizes.7" },
        trigger: { "--input-height": "sizes.10" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      },
      lg: {
        channelInput: (_c = (kc = Ae.variants) == null ? void 0 : kc.size) == null ? void 0 : _c.lg,
        swatch: { "--swatch-size": "sizes.7" },
        trigger: { "--input-height": "sizes.11" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      },
      xl: {
        channelInput: (wc = (Sc = Ae.variants) == null ? void 0 : Sc.size) == null ? void 0 : wc.xl,
        swatch: { "--swatch-size": "sizes.8" },
        trigger: { "--input-height": "sizes.12" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      },
      "2xl": {
        channelInput: (Ec = ($c = Ae.variants) == null ? void 0 : $c.size) == null ? void 0 : Ec["2xl"],
        swatch: { "--swatch-size": "sizes.10" },
        trigger: { "--input-height": "sizes.16" },
        area: { "--thumb-size": "sizes.3.5" },
        channelSlider: {
          "--slider-height": "sizes.3.5",
          "--thumb-size": "sizes.3.5"
        }
      }
    },
    variant: {
      outline: {
        channelInput: (Cc = (Pc = Ae.variants) == null ? void 0 : Pc.variant) == null ? void 0 : Cc.outline,
        trigger: {
          borderWidth: "1px"
        }
      },
      subtle: {
        channelInput: (Ic = (Tc = Ae.variants) == null ? void 0 : Tc.variant) == null ? void 0 : Ic.subtle,
        trigger: {
          borderWidth: "1px",
          borderColor: "transparent",
          bg: "bg.muted"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), e5 = q({
  slots: b3.keys(),
  className: "chakra-data-list",
  base: {
    itemLabel: {
      display: "flex",
      alignItems: "center",
      gap: "1"
    },
    itemValue: {
      display: "flex",
      minWidth: "0",
      flex: "1"
    }
  },
  variants: {
    orientation: {
      horizontal: {
        root: {
          display: "flex",
          flexDirection: "column"
        },
        item: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4"
        },
        itemLabel: {
          minWidth: "120px"
        }
      },
      vertical: {
        root: {
          display: "flex",
          flexDirection: "column"
        },
        item: {
          display: "flex",
          flexDirection: "column",
          gap: "1"
        }
      }
    },
    size: {
      sm: {
        root: {
          gap: "3"
        },
        item: {
          textStyle: "xs"
        }
      },
      md: {
        root: {
          gap: "4"
        },
        item: {
          textStyle: "sm"
        }
      },
      lg: {
        root: {
          gap: "5"
        },
        item: {
          textStyle: "md"
        }
      }
    },
    variant: {
      subtle: {
        itemLabel: {
          color: "fg.muted"
        }
      },
      bold: {
        itemLabel: {
          fontWeight: "medium"
        },
        itemValue: {
          color: "fg.muted"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    orientation: "vertical",
    variant: "subtle"
  }
}), t5 = q({
  slots: y3.keys(),
  className: "chakra-dialog",
  base: {
    backdrop: {
      bg: "blackAlpha.500",
      pos: "fixed",
      left: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      zIndex: "modal",
      _open: {
        animationName: "fade-in",
        animationDuration: "slow"
      },
      _closed: {
        animationName: "fade-out",
        animationDuration: "moderate"
      }
    },
    positioner: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      left: 0,
      top: 0,
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      justifyContent: "center",
      overscrollBehaviorY: "none"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      outline: 0,
      borderRadius: "l3",
      textStyle: "sm",
      my: "var(--dialog-margin, var(--dialog-base-margin))",
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      bg: "bg.panel",
      boxShadow: "lg",
      _open: {
        animationDuration: "moderate"
      },
      _closed: {
        animationDuration: "faster"
      }
    },
    header: {
      flex: 0,
      px: "6",
      pt: "6",
      pb: "4"
    },
    body: {
      flex: "1",
      px: "6",
      pt: "2",
      pb: "6"
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "3",
      px: "6",
      pt: "2",
      pb: "4"
    },
    title: {
      textStyle: "lg",
      fontWeight: "semibold"
    },
    description: {
      color: "fg.muted"
    }
  },
  variants: {
    placement: {
      center: {
        positioner: {
          alignItems: "center"
        },
        content: {
          "--dialog-base-margin": "auto",
          mx: "auto"
        }
      },
      top: {
        positioner: {
          alignItems: "flex-start"
        },
        content: {
          "--dialog-base-margin": "spacing.16",
          mx: "auto"
        }
      },
      bottom: {
        positioner: {
          alignItems: "flex-end"
        },
        content: {
          "--dialog-base-margin": "spacing.16",
          mx: "auto"
        }
      }
    },
    scrollBehavior: {
      inside: {
        positioner: {
          overflow: "hidden"
        },
        content: {
          maxH: "calc(100% - 7.5rem)"
        },
        body: {
          overflow: "auto"
        }
      },
      outside: {
        positioner: {
          overflow: "auto",
          pointerEvents: "auto"
        }
      }
    },
    size: {
      xs: {
        content: {
          maxW: "sm"
        }
      },
      sm: {
        content: {
          maxW: "md"
        }
      },
      md: {
        content: {
          maxW: "lg"
        }
      },
      lg: {
        content: {
          maxW: "2xl"
        }
      },
      xl: {
        content: {
          maxW: "4xl"
        }
      },
      cover: {
        positioner: {
          padding: "10"
        },
        content: {
          width: "100%",
          height: "100%",
          "--dialog-margin": "0"
        }
      },
      full: {
        content: {
          maxW: "100vw",
          minH: "100vh",
          "--dialog-margin": "0",
          borderRadius: "0"
        }
      }
    },
    motionPreset: {
      scale: {
        content: {
          _open: { animationName: "scale-in, fade-in" },
          _closed: { animationName: "scale-out, fade-out" }
        }
      },
      "slide-in-bottom": {
        content: {
          _open: { animationName: "slide-from-bottom, fade-in" },
          _closed: { animationName: "slide-to-bottom, fade-out" }
        }
      },
      "slide-in-top": {
        content: {
          _open: { animationName: "slide-from-top, fade-in" },
          _closed: { animationName: "slide-to-top, fade-out" }
        }
      },
      "slide-in-left": {
        content: {
          _open: { animationName: "slide-from-left, fade-in" },
          _closed: { animationName: "slide-to-left, fade-out" }
        }
      },
      "slide-in-right": {
        content: {
          _open: { animationName: "slide-from-right, fade-in" },
          _closed: { animationName: "slide-to-right, fade-out" }
        }
      },
      none: {}
    }
  },
  defaultVariants: {
    size: "md",
    scrollBehavior: "outside",
    placement: "top",
    motionPreset: "scale"
  }
}), r5 = q({
  slots: x3.keys(),
  className: "chakra-drawer",
  base: {
    backdrop: {
      bg: "blackAlpha.500",
      pos: "fixed",
      insetInlineStart: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      zIndex: "modal",
      _open: {
        animationName: "fade-in",
        animationDuration: "slow"
      },
      _closed: {
        animationName: "fade-out",
        animationDuration: "moderate"
      }
    },
    positioner: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      insetInlineStart: 0,
      top: 0,
      zIndex: "modal",
      overscrollBehaviorY: "none"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      outline: 0,
      zIndex: "modal",
      textStyle: "sm",
      maxH: "100dvh",
      color: "inherit",
      bg: "bg.panel",
      boxShadow: "lg",
      _open: {
        animationDuration: "slowest",
        animationTimingFunction: "ease-in-smooth"
      },
      _closed: {
        animationDuration: "slower",
        animationTimingFunction: "ease-in-smooth"
      }
    },
    header: {
      flex: 0,
      px: "6",
      pt: "6",
      pb: "4"
    },
    body: {
      px: "6",
      py: "2",
      flex: "1",
      overflow: "auto"
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "3",
      px: "6",
      pt: "2",
      pb: "4"
    },
    title: {
      textStyle: "lg",
      fontWeight: "semibold"
    },
    description: {
      color: "fg.muted"
    }
  },
  variants: {
    size: {
      xs: {
        content: {
          maxW: "xs"
        }
      },
      sm: {
        content: {
          maxW: "md"
        }
      },
      md: {
        content: {
          maxW: "lg"
        }
      },
      lg: {
        content: {
          maxW: "2xl"
        }
      },
      xl: {
        content: {
          maxW: "4xl"
        }
      },
      full: {
        content: {
          maxW: "100vw",
          h: "100dvh"
        }
      }
    },
    placement: {
      start: {
        positioner: {
          justifyContent: "flex-start"
        },
        content: {
          _open: {
            animationName: {
              base: "slide-from-left-full, fade-in",
              _rtl: "slide-from-right-full, fade-in"
            }
          },
          _closed: {
            animationName: {
              base: "slide-to-left-full, fade-out",
              _rtl: "slide-to-right-full, fade-out"
            }
          }
        }
      },
      end: {
        positioner: {
          justifyContent: "flex-end"
        },
        content: {
          _open: {
            animationName: {
              base: "slide-from-right-full, fade-in",
              _rtl: "slide-from-left-full, fade-in"
            }
          },
          _closed: {
            animationName: {
              base: "slide-to-right-full, fade-out",
              _rtl: "slide-to-right-full, fade-out"
            }
          }
        }
      },
      top: {
        positioner: {
          alignItems: "flex-start"
        },
        content: {
          maxW: "100%",
          _open: { animationName: "slide-from-top-full, fade-in" },
          _closed: { animationName: "slide-to-top-full, fade-out" }
        }
      },
      bottom: {
        positioner: {
          alignItems: "flex-end"
        },
        content: {
          maxW: "100%",
          _open: { animationName: "slide-from-bottom-full, fade-in" },
          _closed: { animationName: "slide-to-bottom-full, fade-out" }
        }
      }
    },
    contained: {
      true: {
        positioner: {
          padding: "4"
        },
        content: {
          borderRadius: "l3"
        }
      }
    }
  },
  defaultVariants: {
    size: "xs",
    placement: "end"
  }
}), Us = Uh({
  fontSize: "inherit",
  fontWeight: "inherit",
  textAlign: "inherit",
  bg: "transparent",
  borderRadius: "l2"
}), a5 = q({
  slots: k3.keys(),
  className: "chakra-editable",
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      gap: "1.5",
      width: "full"
    },
    preview: {
      ...Us,
      py: "1",
      px: "1",
      display: "inline-flex",
      alignItems: "center",
      transitionProperty: "common",
      transitionDuration: "normal",
      cursor: "text",
      _hover: {
        bg: "bg.muted"
      },
      _disabled: {
        userSelect: "none"
      }
    },
    input: {
      ...Us,
      outline: "0",
      py: "1",
      px: "1",
      transitionProperty: "common",
      transitionDuration: "normal",
      width: "full",
      focusVisibleRing: "inside",
      focusRingWidth: "2px",
      _placeholder: { opacity: 0.6 }
    },
    control: {
      display: "inline-flex",
      alignItems: "center",
      gap: "1.5"
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          textStyle: "sm"
        },
        preview: { minH: "8" },
        input: { minH: "8" }
      },
      md: {
        root: {
          textStyle: "sm"
        },
        preview: { minH: "9" },
        input: { minH: "9" }
      },
      lg: {
        root: {
          textStyle: "md"
        },
        preview: { minH: "10" },
        input: { minH: "10" }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), i5 = q({
  slots: _3.keys(),
  className: "chakra-empty-state",
  base: {
    root: {
      width: "full"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "fg.subtle",
      _icon: {
        boxSize: "1em"
      }
    },
    title: {
      fontWeight: "semibold"
    },
    description: {
      textStyle: "sm",
      color: "fg.muted"
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          px: "4",
          py: "6"
        },
        title: {
          textStyle: "md"
        },
        content: {
          gap: "4"
        },
        indicator: {
          textStyle: "2xl"
        }
      },
      md: {
        root: {
          px: "8",
          py: "12"
        },
        title: {
          textStyle: "lg"
        },
        content: {
          gap: "6"
        },
        indicator: {
          textStyle: "4xl"
        }
      },
      lg: {
        root: {
          px: "12",
          py: "16"
        },
        title: {
          textStyle: "xl"
        },
        content: {
          gap: "8"
        },
        indicator: {
          textStyle: "6xl"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), o5 = q({
  className: "chakra-field",
  slots: S3.keys(),
  base: {
    requiredIndicator: {
      color: "fg.error",
      lineHeight: "1"
    },
    root: {
      display: "flex",
      width: "100%",
      position: "relative",
      gap: "1.5"
    },
    label: {
      display: "flex",
      alignItems: "center",
      textAlign: "start",
      textStyle: "sm",
      fontWeight: "medium",
      gap: "1",
      userSelect: "none",
      _disabled: {
        opacity: "0.5"
      }
    },
    errorText: {
      display: "inline-flex",
      alignItems: "center",
      fontWeight: "medium",
      gap: "1",
      color: "fg.error",
      textStyle: "xs"
    },
    helperText: {
      color: "fg.muted",
      textStyle: "xs"
    }
  },
  variants: {
    orientation: {
      vertical: {
        root: {
          flexDirection: "column",
          alignItems: "flex-start"
        }
      },
      horizontal: {
        root: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        },
        label: {
          flex: "0 0 var(--field-label-width, 80px)"
        }
      }
    }
  },
  defaultVariants: {
    orientation: "vertical"
  }
}), n5 = q({
  className: "fieldset",
  slots: w3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "full"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      width: "full"
    },
    legend: {
      color: "fg",
      fontWeight: "medium",
      _disabled: {
        opacity: "0.5"
      }
    },
    helperText: {
      color: "fg.muted",
      textStyle: "sm"
    },
    errorText: {
      display: "inline-flex",
      alignItems: "center",
      color: "fg.error",
      gap: "2",
      fontWeight: "medium",
      textStyle: "sm"
    }
  },
  variants: {
    size: {
      sm: {
        root: { spaceY: "2" },
        content: { gap: "1.5" },
        legend: { textStyle: "sm" }
      },
      md: {
        root: { spaceY: "4" },
        content: { gap: "4" },
        legend: { textStyle: "sm" }
      },
      lg: {
        root: { spaceY: "6" },
        content: { gap: "4" },
        legend: { textStyle: "md" }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), l5 = q({
  className: "chakra-file-upload",
  slots: $3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "4",
      width: "100%",
      alignItems: "flex-start"
    },
    label: {
      fontWeight: "medium",
      textStyle: "sm"
    },
    dropzone: {
      background: "bg",
      borderRadius: "l3",
      borderWidth: "2px",
      borderStyle: "dashed",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      gap: "4",
      justifyContent: "center",
      minHeight: "2xs",
      px: "3",
      py: "2",
      transition: "backgrounds",
      focusVisibleRing: "outside",
      _hover: {
        bg: "bg.subtle"
      },
      _dragging: {
        bg: "colorPalette.subtle",
        borderStyle: "solid",
        borderColor: "colorPalette.solid"
      }
    },
    dropzoneContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "1",
      textStyle: "sm"
    },
    item: {
      textStyle: "sm",
      animationName: "fade-in",
      animationDuration: "moderate",
      background: "bg",
      borderRadius: "l2",
      borderWidth: "1px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "3",
      p: "4"
    },
    itemGroup: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "3"
    },
    itemName: {
      color: "fg",
      fontWeight: "medium",
      lineClamp: "1"
    },
    itemContent: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5",
      flex: "1"
    },
    itemSizeText: {
      color: "fg.muted",
      textStyle: "xs"
    },
    itemDeleteTrigger: {
      alignSelf: "flex-start"
    },
    itemPreviewImage: {
      width: "10",
      height: "10",
      objectFit: "scale-down"
    }
  },
  defaultVariants: {}
}), s5 = q({
  className: "chakra-hover-card",
  slots: Ih.keys(),
  base: {
    content: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      textStyle: "sm",
      "--hovercard-bg": "colors.bg.panel",
      bg: "var(--hovercard-bg)",
      boxShadow: "lg",
      maxWidth: "80",
      borderRadius: "l3",
      zIndex: "popover",
      transformOrigin: "var(--transform-origin)",
      outline: "0",
      _open: {
        animationStyle: "slide-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "slide-fade-out",
        animationDuration: "faster"
      }
    },
    arrow: {
      "--arrow-size": "sizes.3",
      "--arrow-background": "var(--hovercard-bg)"
    },
    arrowTip: {
      borderTopWidth: "0.5px",
      borderInlineStartWidth: "0.5px"
    }
  },
  variants: {
    size: {
      xs: {
        content: {
          padding: "3"
        }
      },
      sm: {
        content: {
          padding: "4"
        }
      },
      md: {
        content: {
          padding: "5"
        }
      },
      lg: {
        content: {
          padding: "6"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), d5 = q({
  className: "chakra-list",
  slots: E3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--list-gap)",
      "& :where(ul, ol)": {
        marginTop: "var(--list-gap)"
      }
    },
    item: {
      whiteSpace: "normal",
      display: "list-item"
    },
    indicator: {
      marginEnd: "2",
      minHeight: "1lh",
      flexShrink: 0,
      display: "inline-block",
      verticalAlign: "middle"
    }
  },
  variants: {
    variant: {
      marker: {
        root: {
          listStyle: "revert"
        },
        item: {
          _marker: {
            color: "fg.subtle"
          }
        }
      },
      plain: {
        item: {
          alignItems: "flex-start",
          display: "inline-flex"
        }
      }
    },
    align: {
      center: {
        item: { alignItems: "center" }
      },
      start: {
        item: { alignItems: "flex-start" }
      },
      end: {
        item: { alignItems: "flex-end" }
      }
    }
  },
  defaultVariants: {
    variant: "marker"
  }
}), c5 = q({
  className: "chakra-menu",
  slots: P3.keys(),
  base: {
    content: {
      outline: 0,
      bg: "bg.panel",
      boxShadow: "lg",
      color: "fg",
      maxHeight: "var(--available-height)",
      "--menu-z-index": "zIndex.dropdown",
      zIndex: "calc(var(--menu-z-index) + var(--layer-index, 0))",
      borderRadius: "l2",
      overflow: "hidden",
      overflowY: "auto",
      _open: {
        animationStyle: "slide-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "slide-fade-out",
        animationDuration: "faster"
      }
    },
    item: {
      textDecoration: "none",
      color: "fg",
      userSelect: "none",
      borderRadius: "l1",
      width: "100%",
      display: "flex",
      cursor: "menuitem",
      alignItems: "center",
      textAlign: "start",
      position: "relative",
      flex: "0 0 auto",
      outline: 0,
      _disabled: {
        layerStyle: "disabled"
      }
    },
    itemText: {
      flex: "1"
    },
    itemGroupLabel: {
      px: "2",
      py: "1.5",
      fontWeight: "semibold",
      textStyle: "sm"
    },
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0"
    },
    itemCommand: {
      opacity: "0.6",
      textStyle: "xs",
      ms: "auto",
      ps: "4",
      letterSpacing: "widest"
    },
    separator: {
      height: "1px",
      bg: "bg.muted",
      my: "1",
      mx: "-1"
    }
  },
  variants: {
    variant: {
      subtle: {
        item: {
          _highlighted: {
            bg: "bg.emphasized/60"
          }
        }
      },
      solid: {
        item: {
          _highlighted: {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast"
          }
        }
      }
    },
    size: {
      sm: {
        content: {
          minW: "8rem",
          padding: "1"
        },
        item: {
          gap: "1",
          textStyle: "xs",
          py: "1",
          px: "1.5"
        }
      },
      md: {
        content: {
          minW: "8rem",
          padding: "1.5"
        },
        item: {
          gap: "2",
          textStyle: "sm",
          py: "1.5",
          px: "2"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "subtle"
  }
}), Si = q({
  className: "chakra-select",
  slots: D3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5",
      width: "full"
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "full",
      minH: "var(--select-trigger-height)",
      px: "var(--select-trigger-padding-x)",
      borderRadius: "l2",
      userSelect: "none",
      textAlign: "start",
      focusVisibleRing: "inside",
      _placeholderShown: {
        color: "fg.muted/80"
      },
      _disabled: {
        layerStyle: "disabled"
      },
      _invalid: {
        borderColor: "border.error"
      }
    },
    indicatorGroup: {
      display: "flex",
      alignItems: "center",
      gap: "1",
      pos: "absolute",
      right: "0",
      top: "0",
      bottom: "0",
      px: "var(--select-trigger-padding-x)",
      pointerEvents: "none"
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: { base: "fg.muted", _disabled: "fg.subtle", _invalid: "fg.error" }
    },
    content: {
      background: "bg.panel",
      display: "flex",
      flexDirection: "column",
      zIndex: "dropdown",
      borderRadius: "l2",
      outline: 0,
      maxH: "96",
      overflowY: "auto",
      boxShadow: "md",
      _open: {
        animationStyle: "slide-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "slide-fade-out",
        animationDuration: "fastest"
      }
    },
    item: {
      position: "relative",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      gap: "2",
      cursor: "option",
      justifyContent: "space-between",
      flex: "1",
      textAlign: "start",
      borderRadius: "l1",
      _highlighted: {
        bg: "bg.emphasized/60"
      },
      _disabled: {
        pointerEvents: "none",
        opacity: "0.5"
      },
      _icon: {
        width: "4",
        height: "4"
      }
    },
    control: {
      pos: "relative"
    },
    itemText: {
      flex: "1"
    },
    itemGroup: {
      _first: { mt: "0" }
    },
    itemGroupLabel: {
      py: "1",
      fontWeight: "medium"
    },
    label: {
      fontWeight: "medium",
      userSelect: "none",
      textStyle: "sm",
      _disabled: {
        layerStyle: "disabled"
      }
    },
    valueText: {
      lineClamp: "1",
      maxW: "80%"
    }
  },
  variants: {
    variant: {
      outline: {
        trigger: {
          bg: "transparent",
          borderWidth: "1px",
          borderColor: "border",
          _expanded: {
            borderColor: "border.emphasized"
          }
        }
      },
      subtle: {
        trigger: {
          borderWidth: "1px",
          borderColor: "transparent",
          bg: "bg.muted"
        }
      }
    },
    size: {
      xs: {
        root: {
          "--select-trigger-height": "sizes.8",
          "--select-trigger-padding-x": "spacing.2"
        },
        content: {
          p: "1",
          gap: "1",
          textStyle: "xs"
        },
        trigger: {
          textStyle: "xs",
          gap: "1"
        },
        item: {
          py: "1",
          px: "2"
        },
        itemGroupLabel: {
          py: "1",
          px: "2"
        },
        indicator: {
          _icon: {
            width: "3.5",
            height: "3.5"
          }
        }
      },
      sm: {
        root: {
          "--select-trigger-height": "sizes.9",
          "--select-trigger-padding-x": "spacing.2.5"
        },
        content: {
          p: "1",
          textStyle: "sm"
        },
        trigger: {
          textStyle: "sm",
          gap: "1"
        },
        indicator: {
          _icon: {
            width: "4",
            height: "4"
          }
        },
        item: {
          py: "1",
          px: "1.5"
        },
        itemGroup: {
          mt: "1"
        },
        itemGroupLabel: {
          py: "1",
          px: "1.5"
        }
      },
      md: {
        root: {
          "--select-trigger-height": "sizes.10",
          "--select-trigger-padding-x": "spacing.3"
        },
        content: {
          p: "1",
          textStyle: "sm"
        },
        itemGroup: {
          mt: "1.5"
        },
        item: {
          py: "1.5",
          px: "2"
        },
        itemIndicator: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        itemGroupLabel: {
          py: "1.5",
          px: "2"
        },
        trigger: {
          textStyle: "sm",
          gap: "2"
        },
        indicator: {
          _icon: {
            width: "4",
            height: "4"
          }
        }
      },
      lg: {
        root: {
          "--select-trigger-height": "sizes.12",
          "--select-trigger-padding-x": "spacing.4"
        },
        content: {
          p: "1.5",
          textStyle: "md"
        },
        itemGroup: {
          mt: "2"
        },
        item: {
          py: "2",
          px: "3"
        },
        itemGroupLabel: {
          py: "2",
          px: "3"
        },
        trigger: {
          textStyle: "md",
          py: "3",
          gap: "2"
        },
        indicator: {
          _icon: {
            width: "5",
            height: "5"
          }
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
});
var Rc, Dc;
const u5 = q({
  className: "chakra-native-select",
  slots: C3.keys(),
  base: {
    root: {
      height: "fit-content",
      display: "flex",
      width: "100%",
      position: "relative"
    },
    field: {
      width: "100%",
      minWidth: "0",
      outline: "0",
      appearance: "none",
      borderRadius: "l2",
      "--error-color": "colors.border.error",
      _disabled: {
        layerStyle: "disabled"
      },
      _invalid: {
        focusRingColor: "var(--error-color)",
        borderColor: "var(--error-color)"
      },
      focusVisibleRing: "inside",
      lineHeight: "normal",
      "& > option, & > optgroup": {
        bg: "bg"
      }
    },
    indicator: {
      position: "absolute",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      top: "50%",
      transform: "translateY(-50%)",
      height: "100%",
      color: "fg.muted",
      _disabled: {
        opacity: "0.5"
      },
      _invalid: {
        color: "fg.error"
      },
      _icon: {
        width: "1em",
        height: "1em"
      }
    }
  },
  variants: {
    variant: {
      outline: {
        field: (Rc = Si.variants) == null ? void 0 : Rc.variant.outline.trigger
      },
      subtle: {
        field: (Dc = Si.variants) == null ? void 0 : Dc.variant.subtle.trigger
      },
      plain: {
        field: {
          bg: "transparent",
          color: "fg",
          focusRingWidth: "2px"
        }
      }
    },
    size: {
      xs: {
        field: {
          textStyle: "xs",
          ps: "2",
          pe: "6",
          height: "6"
        },
        indicator: {
          textStyle: "sm",
          insetEnd: "1.5"
        }
      },
      sm: {
        field: {
          textStyle: "sm",
          ps: "2.5",
          pe: "8",
          height: "8"
        },
        indicator: {
          textStyle: "md",
          insetEnd: "2"
        }
      },
      md: {
        field: {
          textStyle: "sm",
          ps: "3",
          pe: "8",
          height: "10"
        },
        indicator: {
          textStyle: "lg",
          insetEnd: "2"
        }
      },
      lg: {
        field: {
          textStyle: "md",
          ps: "4",
          pe: "8",
          height: "11"
        },
        indicator: {
          textStyle: "xl",
          insetEnd: "3"
        }
      },
      xl: {
        field: {
          textStyle: "md",
          ps: "4.5",
          pe: "10",
          height: "12"
        },
        indicator: {
          textStyle: "xl",
          insetEnd: "3"
        }
      }
    }
  },
  defaultVariants: Si.defaultVariants
});
function dn(e, t) {
  const r = {};
  for (const a in e) {
    const i = t(a, e[a]);
    r[i[0]] = i[1];
  }
  return r;
}
const Gs = Uh({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: "1",
  userSelect: "none",
  cursor: "button",
  lineHeight: "1",
  color: "fg.muted",
  "--stepper-base-radius": "radii.l1",
  "--stepper-radius": "calc(var(--stepper-base-radius) + 1px)",
  _icon: {
    boxSize: "1em"
  },
  _disabled: {
    opacity: "0.5"
  },
  _hover: {
    bg: "bg.muted"
  },
  _active: {
    bg: "bg.emphasized"
  }
}), h5 = q({
  className: "chakra-number-input",
  slots: Ah.keys(),
  base: {
    root: {
      position: "relative",
      zIndex: "0",
      isolation: "isolate"
    },
    input: {
      ...Ae.base,
      verticalAlign: "top",
      pe: "calc(var(--stepper-width) + 0.5rem)"
    },
    control: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "0",
      insetEnd: "0px",
      margin: "1px",
      width: "var(--stepper-width)",
      height: "calc(100% - 2px)",
      zIndex: "1",
      borderStartWidth: "1px",
      divideY: "1px"
    },
    incrementTrigger: {
      ...Gs,
      borderTopEndRadius: "var(--stepper-radius)"
    },
    decrementTrigger: {
      ...Gs,
      borderBottomEndRadius: "var(--stepper-radius)"
    },
    valueText: {
      fontWeight: "medium",
      fontFeatureSettings: "pnum",
      fontVariantNumeric: "proportional-nums"
    }
  },
  variants: {
    size: {
      xs: {
        input: Ae.variants.size.xs,
        control: {
          fontSize: "2xs",
          "--stepper-width": "sizes.4"
        }
      },
      sm: {
        input: Ae.variants.size.sm,
        control: {
          fontSize: "xs",
          "--stepper-width": "sizes.5"
        }
      },
      md: {
        input: Ae.variants.size.md,
        control: {
          fontSize: "sm",
          "--stepper-width": "sizes.6"
        }
      },
      lg: {
        input: Ae.variants.size.lg,
        control: {
          fontSize: "sm",
          "--stepper-width": "sizes.6"
        }
      }
    },
    variant: dn(Ae.variants.variant, (e, t) => [
      e,
      { input: t }
    ])
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), { variants: Ys, defaultVariants: f5 } = Ae, g5 = q({
  className: "chakra-pin-input",
  slots: zh.keys(),
  base: {
    input: {
      ...Ae.base,
      textAlign: "center",
      width: "var(--input-height)"
    }
  },
  variants: {
    size: dn(Ys.size, (e, t) => [e, { input: t }]),
    variant: dn(Ys.variant, (e, t) => [
      e,
      { input: t }
    ])
  },
  defaultVariants: f5
}), p5 = q({
  className: "chakra-popover",
  slots: T3.keys(),
  base: {
    content: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      textStyle: "sm",
      "--popover-bg": "colors.bg.panel",
      bg: "var(--popover-bg)",
      boxShadow: "lg",
      "--popover-size": "sizes.xs",
      "--popover-mobile-size": "calc(100dvw - 1rem)",
      width: {
        base: "min(var(--popover-mobile-size), var(--popover-size))",
        sm: "var(--popover-size)"
      },
      borderRadius: "l3",
      "--popover-z-index": "zIndex.popover",
      zIndex: "calc(var(--popover-z-index) + var(--layer-index, 0))",
      outline: "0",
      transformOrigin: "var(--transform-origin)",
      maxHeight: "var(--available-height)",
      _open: {
        animationStyle: "scale-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "scale-fade-out",
        animationDuration: "faster"
      }
    },
    header: {
      paddingInline: "var(--popover-padding)",
      paddingTop: "var(--popover-padding)"
    },
    body: {
      padding: "var(--popover-padding)",
      flex: "1"
    },
    footer: {
      display: "flex",
      alignItems: "center",
      paddingInline: "var(--popover-padding)",
      paddingBottom: "var(--popover-padding)"
    },
    arrow: {
      "--arrow-size": "sizes.3",
      "--arrow-background": "var(--popover-bg)"
    },
    arrowTip: {
      borderTopWidth: "1px",
      borderInlineStartWidth: "1px"
    }
  },
  variants: {
    size: {
      xs: {
        content: {
          "--popover-padding": "spacing.3"
        }
      },
      sm: {
        content: {
          "--popover-padding": "spacing.4"
        }
      },
      md: {
        content: {
          "--popover-padding": "spacing.5"
        }
      },
      lg: {
        content: {
          "--popover-padding": "spacing.6"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), v5 = q({
  slots: rl.keys(),
  className: "chakra-progress",
  base: {
    root: {
      textStyle: "sm",
      position: "relative"
    },
    track: {
      overflow: "hidden",
      position: "relative"
    },
    range: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transitionProperty: "width, height",
      transitionDuration: "slow",
      height: "100%",
      bgColor: "var(--track-color)",
      _indeterminate: {
        "--animate-from-x": "-40%",
        "--animate-to-x": "100%",
        position: "absolute",
        willChange: "left",
        minWidth: "50%",
        animation: "position 1s ease infinite normal none running",
        backgroundImage: "linear-gradient(to right, transparent 0%, var(--track-color) 50%, transparent 100%)"
      }
    },
    label: {
      display: "inline-flex",
      fontWeight: "medium",
      alignItems: "center",
      gap: "1"
    },
    valueText: {
      textStyle: "xs",
      lineHeight: "1",
      fontWeight: "medium"
    }
  },
  variants: {
    variant: {
      outline: {
        track: {
          shadow: "inset",
          bgColor: "bg.muted"
        },
        range: {
          bgColor: "colorPalette.solid"
        }
      },
      subtle: {
        track: {
          bgColor: "colorPalette.muted"
        },
        range: {
          bgColor: "colorPalette.solid/72"
        }
      }
    },
    shape: {
      square: {},
      rounded: {
        track: {
          borderRadius: "l1"
        }
      },
      full: {
        track: {
          borderRadius: "full"
        }
      }
    },
    striped: {
      true: {
        range: {
          backgroundImage: "linear-gradient(45deg, var(--stripe-color) 25%, transparent 25%, transparent 50%, var(--stripe-color) 50%, var(--stripe-color) 75%, transparent 75%, transparent)",
          backgroundSize: "var(--stripe-size) var(--stripe-size)",
          "--stripe-size": "1rem",
          "--stripe-color": {
            _light: "rgba(255, 255, 255, 0.3)",
            _dark: "rgba(0, 0, 0, 0.3)"
          }
        }
      }
    },
    animated: {
      true: {
        range: {
          "--animate-from": "var(--stripe-size)",
          animation: "bg-position 1s linear infinite"
        }
      }
    },
    size: {
      xs: {
        track: { h: "1.5" }
      },
      sm: {
        track: { h: "2" }
      },
      md: {
        track: { h: "2.5" }
      },
      lg: {
        track: { h: "3" }
      },
      xl: {
        track: { h: "4" }
      }
    }
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
    shape: "rounded"
  }
}), m5 = q({
  className: "chakra-progress-circle",
  slots: rl.keys(),
  base: {
    root: {
      display: "inline-flex",
      textStyle: "sm",
      position: "relative"
    },
    circle: {
      _indeterminate: {
        animation: "spin 2s linear infinite"
      }
    },
    circleTrack: {
      "--track-color": "colors.colorPalette.muted",
      stroke: "var(--track-color)"
    },
    circleRange: {
      stroke: "colorPalette.solid",
      transitionProperty: "stroke-dasharray",
      transitionDuration: "0.6s",
      _indeterminate: {
        animation: "circular-progress 1.5s linear infinite"
      }
    },
    label: {
      display: "inline-flex"
    },
    valueText: {
      lineHeight: "1",
      fontWeight: "medium",
      letterSpacing: "tight",
      fontVariantNumeric: "tabular-nums"
    }
  },
  variants: {
    size: {
      xs: {
        circle: {
          "--size": "24px",
          "--thickness": "4px"
        },
        valueText: {
          textStyle: "2xs"
        }
      },
      sm: {
        circle: {
          "--size": "32px",
          "--thickness": "5px"
        },
        valueText: {
          textStyle: "2xs"
        }
      },
      md: {
        circle: {
          "--size": "40px",
          "--thickness": "6px"
        },
        valueText: {
          textStyle: "xs"
        }
      },
      lg: {
        circle: {
          "--size": "48px",
          "--thickness": "7px"
        },
        valueText: {
          textStyle: "sm"
        }
      },
      xl: {
        circle: {
          "--size": "64px",
          "--thickness": "8px"
        },
        valueText: {
          textStyle: "sm"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), b5 = q({
  slots: Fh.keys(),
  className: "chakra-qr-code",
  base: {
    root: {
      position: "relative",
      width: "fit-content",
      "--qr-code-overlay-size": "calc(var(--qr-code-size) / 3)"
    },
    frame: {
      width: "var(--qr-code-size)",
      height: "var(--qr-code-size)",
      fill: "currentColor"
    },
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "var(--qr-code-overlay-size)",
      height: "var(--qr-code-overlay-size)",
      padding: "1",
      bg: "bg",
      rounded: "l1"
    }
  },
  variants: {
    size: {
      "2xs": {
        root: { "--qr-code-size": "40px" }
      },
      xs: {
        root: { "--qr-code-size": "64px" }
      },
      sm: {
        root: { "--qr-code-size": "80px" }
      },
      md: {
        root: { "--qr-code-size": "120px" }
      },
      lg: {
        root: { "--qr-code-size": "160px" }
      },
      xl: {
        root: { "--qr-code-size": "200px" }
      },
      "2xl": {
        root: { "--qr-code-size": "240px" }
      },
      full: {
        root: { "--qr-code-size": "100%" }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});
var Ac, zc, Oc, Fc, Nc, Lc, Mc;
const y5 = q({
  className: "chakra-radio-card",
  slots: I3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5",
      isolation: "isolate"
    },
    item: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      userSelect: "none",
      position: "relative",
      borderRadius: "l2",
      _focus: {
        bg: "colorPalette.muted/20"
      },
      _disabled: {
        opacity: "0.8",
        borderColor: "border.disabled"
      },
      _checked: {
        zIndex: "1"
      }
    },
    label: {
      display: "inline-flex",
      fontWeight: "medium",
      textStyle: "sm",
      _disabled: {
        opacity: "0.5"
      }
    },
    itemText: {
      fontWeight: "medium"
    },
    itemDescription: {
      opacity: "0.64",
      textStyle: "sm"
    },
    itemControl: {
      display: "inline-flex",
      flex: "1",
      pos: "relative",
      rounded: "inherit",
      justifyContent: "var(--radio-card-justify)",
      alignItems: "var(--radio-card-align)",
      _disabled: {
        bg: "bg.muted"
      }
    },
    itemIndicator: Ke.base,
    itemAddon: {
      roundedBottom: "inherit",
      _disabled: {
        color: "fg.muted"
      }
    },
    itemContent: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      gap: "1",
      justifyContent: "var(--radio-card-justify)",
      alignItems: "var(--radio-card-align)"
    }
  },
  variants: {
    size: {
      sm: {
        item: {
          textStyle: "sm"
        },
        itemControl: {
          padding: "3",
          gap: "1.5"
        },
        itemAddon: {
          px: "3",
          py: "1.5",
          borderTopWidth: "1px"
        },
        itemIndicator: (Ac = Ke.variants) == null ? void 0 : Ac.size.sm
      },
      md: {
        item: {
          textStyle: "sm"
        },
        itemControl: {
          padding: "4",
          gap: "2.5"
        },
        itemAddon: {
          px: "4",
          py: "2",
          borderTopWidth: "1px"
        },
        itemIndicator: (zc = Ke.variants) == null ? void 0 : zc.size.md
      },
      lg: {
        item: {
          textStyle: "md"
        },
        itemControl: {
          padding: "4",
          gap: "3.5"
        },
        itemAddon: {
          px: "4",
          py: "2",
          borderTopWidth: "1px"
        },
        itemIndicator: (Oc = Ke.variants) == null ? void 0 : Oc.size.lg
      }
    },
    variant: {
      surface: {
        item: {
          borderWidth: "1px",
          _checked: {
            bg: "colorPalette.subtle",
            color: "colorPalette.fg",
            borderColor: "colorPalette.muted"
          }
        },
        itemIndicator: (Fc = Ke.variants) == null ? void 0 : Fc.variant.solid
      },
      subtle: {
        item: {
          bg: "bg.muted"
        },
        itemControl: {
          _checked: {
            bg: "colorPalette.muted",
            color: "colorPalette.fg"
          }
        },
        itemIndicator: (Nc = Ke.variants) == null ? void 0 : Nc.variant.outline
      },
      outline: {
        item: {
          borderWidth: "1px",
          _checked: {
            boxShadow: "0 0 0 1px var(--shadow-color)",
            boxShadowColor: "colorPalette.solid",
            borderColor: "colorPalette.solid"
          }
        },
        itemIndicator: (Lc = Ke.variants) == null ? void 0 : Lc.variant.solid
      },
      solid: {
        item: {
          borderWidth: "1px",
          _checked: {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast",
            borderColor: "colorPalette.solid"
          }
        },
        itemIndicator: (Mc = Ke.variants) == null ? void 0 : Mc.variant.inverted
      }
    },
    justify: {
      start: {
        item: { "--radio-card-justify": "flex-start" }
      },
      end: {
        item: { "--radio-card-justify": "flex-end" }
      },
      center: {
        item: { "--radio-card-justify": "center" }
      }
    },
    align: {
      start: {
        item: { "--radio-card-align": "flex-start" },
        itemControl: { textAlign: "start" }
      },
      end: {
        item: { "--radio-card-align": "flex-end" },
        itemControl: { textAlign: "end" }
      },
      center: {
        item: { "--radio-card-align": "center" },
        itemControl: { textAlign: "center" }
      }
    },
    orientation: {
      vertical: {
        itemControl: { flexDirection: "column" }
      },
      horizontal: {
        itemControl: { flexDirection: "row" }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    align: "start",
    orientation: "horizontal"
  }
});
var Bc, Kc, Wc, jc, Vc, Hc, Uc, Gc, Yc, qc, Xc, Zc, Jc, Qc;
const x5 = q({
  className: "chakra-radio-group",
  slots: k0.keys(),
  base: {
    item: {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
      fontWeight: "medium",
      _disabled: {
        cursor: "disabled"
      }
    },
    itemControl: Ke.base,
    label: {
      userSelect: "none",
      textStyle: "sm",
      _disabled: {
        opacity: "0.5"
      }
    }
  },
  variants: {
    variant: {
      outline: {
        itemControl: (Kc = (Bc = Ke.variants) == null ? void 0 : Bc.variant) == null ? void 0 : Kc.outline
      },
      subtle: {
        itemControl: (jc = (Wc = Ke.variants) == null ? void 0 : Wc.variant) == null ? void 0 : jc.subtle
      },
      solid: {
        itemControl: (Hc = (Vc = Ke.variants) == null ? void 0 : Vc.variant) == null ? void 0 : Hc.solid
      }
    },
    size: {
      xs: {
        item: { textStyle: "xs", gap: "1.5" },
        itemControl: (Gc = (Uc = Ke.variants) == null ? void 0 : Uc.size) == null ? void 0 : Gc.xs
      },
      sm: {
        item: { textStyle: "sm", gap: "2" },
        itemControl: (qc = (Yc = Ke.variants) == null ? void 0 : Yc.size) == null ? void 0 : qc.sm
      },
      md: {
        item: { textStyle: "sm", gap: "2.5" },
        itemControl: (Zc = (Xc = Ke.variants) == null ? void 0 : Xc.size) == null ? void 0 : Zc.md
      },
      lg: {
        item: { textStyle: "md", gap: "3" },
        itemControl: (Qc = (Jc = Ke.variants) == null ? void 0 : Jc.size) == null ? void 0 : Qc.lg
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "solid"
  }
}), k5 = q({
  className: "chakra-rating-group",
  slots: R3.keys(),
  base: {
    root: {
      display: "inline-flex"
    },
    control: {
      display: "inline-flex",
      alignItems: "center"
    },
    item: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none"
    },
    itemIndicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "1em",
      height: "1em",
      position: "relative",
      _icon: {
        stroke: "currentColor",
        width: "100%",
        height: "100%",
        display: "inline-block",
        flexShrink: 0,
        position: "absolute",
        left: 0,
        top: 0
      },
      "& [data-bg]": {
        color: "bg.emphasized"
      },
      "& [data-fg]": {
        color: "transparent"
      },
      "&[data-highlighted]:not([data-half])": {
        "& [data-fg]": {
          color: "colorPalette.solid"
        }
      },
      "&[data-half]": {
        "& [data-fg]": {
          color: "colorPalette.solid",
          clipPath: "inset(0 50% 0 0)"
        }
      }
    }
  },
  variants: {
    size: {
      xs: {
        item: {
          textStyle: "sm"
        }
      },
      sm: {
        item: {
          textStyle: "md"
        }
      },
      md: {
        item: {
          textStyle: "xl"
        }
      },
      lg: {
        item: {
          textStyle: "2xl"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), _5 = q({
  className: "chakra-segment-group",
  slots: Lh.keys(),
  base: {
    root: {
      "--segment-radius": "radii.l2",
      borderRadius: "l2",
      display: "inline-flex",
      boxShadow: "inset",
      minW: "max-content",
      textAlign: "center",
      position: "relative",
      isolation: "isolate",
      bg: "bg.muted"
    },
    item: {
      display: "flex",
      alignItems: "center",
      userSelect: "none",
      fontSize: "sm",
      position: "relative",
      color: "fg",
      borderRadius: "var(--segment-radius)",
      _disabled: {
        opacity: "0.5"
      },
      "&:has(input:focus-visible)": {
        focusRing: "outside"
      },
      _before: {
        content: '""',
        position: "absolute",
        insetInlineStart: 0,
        insetBlock: "1.5",
        bg: "border",
        width: "1px",
        transition: "opacity 0.2s"
      },
      "& + &[data-state=checked], &[data-state=checked] + &, &:first-of-type": {
        _before: {
          opacity: "0"
        }
      },
      "&[data-state=checked][data-ssr]": {
        shadow: "sm",
        bg: "bg",
        borderRadius: "var(--segment-radius)"
      }
    },
    indicator: {
      shadow: "sm",
      pos: "absolute",
      bg: { _light: "bg", _dark: "bg.emphasized" },
      width: "var(--width)",
      height: "var(--height)",
      top: "var(--top)",
      left: "var(--left)",
      zIndex: -1,
      borderRadius: "var(--segment-radius)"
    }
  },
  variants: {
    size: {
      xs: {
        root: {
          height: "6"
        },
        item: {
          textStyle: "xs",
          px: "3",
          gap: "1"
        }
      },
      sm: {
        root: {
          height: "8"
        },
        item: {
          textStyle: "sm",
          px: "4",
          gap: "2"
        }
      },
      md: {
        root: {
          height: "10"
        },
        item: {
          textStyle: "sm",
          px: "4",
          gap: "2"
        }
      },
      lg: {
        root: {
          height: "10"
        },
        item: {
          textStyle: "md",
          px: "5",
          gap: "3"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), S5 = q({
  className: "chakra-slider",
  slots: A3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1",
      textStyle: "sm",
      position: "relative",
      isolation: "isolate",
      touchAction: "none"
    },
    label: {
      fontWeight: "medium",
      textStyle: "sm"
    },
    control: {
      display: "inline-flex",
      alignItems: "center",
      position: "relative"
    },
    track: {
      overflow: "hidden",
      borderRadius: "full",
      flex: "1"
    },
    range: {
      width: "inherit",
      height: "inherit",
      _disabled: { bg: "border.emphasized!" }
    },
    markerGroup: {
      position: "absolute!",
      zIndex: "1"
    },
    marker: {
      "--marker-bg": { base: "white", _underValue: "colors.bg" },
      display: "flex",
      alignItems: "center",
      gap: "calc(var(--slider-thumb-size) / 2)",
      color: "fg.muted",
      textStyle: "xs"
    },
    markerIndicator: {
      width: "var(--slider-marker-size)",
      height: "var(--slider-marker-size)",
      borderRadius: "full",
      bg: "var(--marker-bg)"
    },
    thumb: {
      width: "var(--slider-thumb-size)",
      height: "var(--slider-thumb-size)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0,
      zIndex: "2",
      borderRadius: "full",
      _focusVisible: {
        ring: "2px",
        ringColor: "colorPalette.focusRing",
        ringOffset: "2px",
        ringOffsetColor: "bg"
      }
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          "--slider-thumb-size": "sizes.4",
          "--slider-track-size": "sizes.1.5",
          "--slider-marker-center": "6px",
          "--slider-marker-size": "sizes.1",
          "--slider-marker-inset": "3px"
        }
      },
      md: {
        root: {
          "--slider-thumb-size": "sizes.5",
          "--slider-track-size": "sizes.2",
          "--slider-marker-center": "8px",
          "--slider-marker-size": "sizes.1",
          "--slider-marker-inset": "4px"
        }
      },
      lg: {
        root: {
          "--slider-thumb-size": "sizes.6",
          "--slider-track-size": "sizes.2.5",
          "--slider-marker-center": "9px",
          "--slider-marker-size": "sizes.1.5",
          "--slider-marker-inset": "5px"
        }
      }
    },
    variant: {
      outline: {
        track: {
          shadow: "inset",
          bg: "bg.emphasized/72"
        },
        range: {
          bg: "colorPalette.solid"
        },
        thumb: {
          borderWidth: "2px",
          borderColor: "colorPalette.solid",
          bg: "bg",
          _disabled: {
            bg: "border.emphasized",
            borderColor: "border.emphasized"
          }
        }
      },
      solid: {
        track: {
          bg: "colorPalette.subtle",
          _disabled: {
            bg: "bg.muted"
          }
        },
        range: {
          bg: "colorPalette.solid"
        },
        thumb: {
          bg: "colorPalette.solid",
          _disabled: {
            bg: "border.emphasized"
          }
        }
      }
    },
    orientation: {
      vertical: {
        root: {
          display: "inline-flex"
        },
        control: {
          flexDirection: "column",
          height: "100%",
          minWidth: "var(--slider-thumb-size)",
          "&[data-has-mark-label]": {
            marginEnd: "4"
          }
        },
        track: {
          width: "var(--slider-track-size)"
        },
        thumb: {
          left: "50%",
          translate: "-50% 0"
        },
        markerGroup: {
          insetStart: "var(--slider-marker-center)",
          insetBlock: "var(--slider-marker-inset)"
        },
        marker: {
          flexDirection: "row"
        }
      },
      horizontal: {
        control: {
          flexDirection: "row",
          width: "100%",
          minHeight: "var(--slider-thumb-size)",
          "&[data-has-mark-label]": {
            marginBottom: "4"
          }
        },
        track: {
          height: "var(--slider-track-size)"
        },
        thumb: {
          top: "50%",
          translate: "0 -50%"
        },
        markerGroup: {
          top: "var(--slider-marker-center)",
          insetInline: "var(--slider-marker-inset)"
        },
        marker: {
          flexDirection: "column"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
    orientation: "horizontal"
  }
}), w5 = q({
  className: "chakra-stat",
  slots: z3.keys(),
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1",
      position: "relative",
      flex: "1"
    },
    label: {
      display: "inline-flex",
      gap: "1.5",
      alignItems: "center",
      color: "fg.muted",
      textStyle: "sm"
    },
    helpText: {
      color: "fg.muted",
      textStyle: "xs"
    },
    valueUnit: {
      color: "fg.muted",
      textStyle: "xs",
      fontWeight: "initial",
      letterSpacing: "initial"
    },
    valueText: {
      verticalAlign: "baseline",
      fontWeight: "semibold",
      letterSpacing: "tight",
      fontFeatureSettings: "pnum",
      fontVariantNumeric: "proportional-nums",
      display: "inline-flex",
      gap: "1"
    },
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginEnd: 1,
      "& :where(svg)": {
        w: "1em",
        h: "1em"
      },
      "&[data-type=up]": {
        color: "fg.success"
      },
      "&[data-type=down]": {
        color: "fg.error"
      }
    }
  },
  variants: {
    size: {
      sm: {
        valueText: {
          textStyle: "xl"
        }
      },
      md: {
        valueText: {
          textStyle: "2xl"
        }
      },
      lg: {
        valueText: {
          textStyle: "3xl"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), $5 = q({
  className: "chakra-status",
  slots: O3.keys(),
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2"
    },
    indicator: {
      width: "0.64em",
      height: "0.64em",
      flexShrink: 0,
      borderRadius: "full",
      forcedColorAdjust: "none",
      bg: "colorPalette.solid"
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          textStyle: "xs"
        }
      },
      md: {
        root: {
          textStyle: "sm"
        }
      },
      lg: {
        root: {
          textStyle: "md"
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), E5 = q({
  className: "chakra-steps",
  slots: F3.keys(),
  base: {
    root: {
      display: "flex",
      width: "full"
    },
    list: {
      display: "flex",
      justifyContent: "space-between",
      "--steps-gutter": "spacing.3",
      "--steps-thickness": "2px"
    },
    title: {
      fontWeight: "medium",
      color: "fg"
    },
    description: {
      color: "fg.muted"
    },
    separator: {
      bg: "border",
      flex: "1"
    },
    indicator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: "0",
      borderRadius: "full",
      fontWeight: "medium",
      width: "var(--steps-size)",
      height: "var(--steps-size)",
      _icon: {
        flexShrink: "0",
        width: "var(--steps-icon-size)",
        height: "var(--steps-icon-size)"
      }
    },
    item: {
      position: "relative",
      display: "flex",
      flex: "1 0 0",
      "&:last-of-type": {
        flex: "initial",
        "& [data-part=separator]": {
          display: "none"
        }
      }
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      gap: "3",
      textAlign: "start",
      focusVisibleRing: "outside",
      borderRadius: "l2"
    },
    content: {
      focusVisibleRing: "outside"
    }
  },
  variants: {
    orientation: {
      vertical: {
        root: {
          flexDirection: "row",
          height: "100%"
        },
        list: {
          flexDirection: "column",
          alignItems: "flex-start"
        },
        separator: {
          position: "absolute",
          width: "var(--steps-thickness)",
          height: "100%",
          maxHeight: "calc(100% - var(--steps-size) - var(--steps-gutter) * 2)",
          top: "calc(var(--steps-size) + var(--steps-gutter))",
          insetStart: "calc(var(--steps-size) / 2 - 1px)"
        },
        item: {
          alignItems: "flex-start"
        }
      },
      horizontal: {
        root: {
          flexDirection: "column",
          width: "100%"
        },
        list: {
          flexDirection: "row",
          alignItems: "center"
        },
        separator: {
          width: "100%",
          height: "var(--steps-thickness)",
          marginX: "var(--steps-gutter)"
        },
        item: {
          alignItems: "center"
        }
      }
    },
    variant: {
      solid: {
        indicator: {
          _incomplete: {
            borderWidth: "var(--steps-thickness)"
          },
          _current: {
            bg: "colorPalette.muted",
            borderWidth: "var(--steps-thickness)",
            borderColor: "colorPalette.solid",
            color: "colorPalette.fg"
          },
          _complete: {
            bg: "colorPalette.solid",
            borderColor: "colorPalette.solid",
            color: "colorPalette.contrast"
          }
        },
        separator: {
          _complete: {
            bg: "colorPalette.solid"
          }
        }
      },
      subtle: {
        indicator: {
          _incomplete: {
            bg: "bg.muted"
          },
          _current: {
            bg: "colorPalette.muted",
            color: "colorPalette.fg"
          },
          _complete: {
            bg: "colorPalette.emphasized",
            color: "colorPalette.fg"
          }
        },
        separator: {
          _complete: {
            bg: "colorPalette.emphasized"
          }
        }
      }
    },
    size: {
      xs: {
        root: {
          gap: "2.5"
        },
        list: {
          "--steps-size": "sizes.6",
          "--steps-icon-size": "sizes.3.5",
          textStyle: "xs"
        },
        title: {
          textStyle: "sm"
        }
      },
      sm: {
        root: {
          gap: "3"
        },
        list: {
          "--steps-size": "sizes.8",
          "--steps-icon-size": "sizes.4",
          textStyle: "xs"
        },
        title: {
          textStyle: "sm"
        }
      },
      md: {
        root: {
          gap: "4"
        },
        list: {
          "--steps-size": "sizes.10",
          "--steps-icon-size": "sizes.4",
          textStyle: "sm"
        },
        title: {
          textStyle: "sm"
        }
      },
      lg: {
        root: {
          gap: "6"
        },
        list: {
          "--steps-size": "sizes.11",
          "--steps-icon-size": "sizes.5",
          textStyle: "md"
        },
        title: {
          textStyle: "md"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
    orientation: "horizontal"
  }
}), P5 = q({
  slots: N3.keys(),
  className: "chakra-switch",
  base: {
    root: {
      display: "inline-flex",
      gap: "2.5",
      alignItems: "center",
      position: "relative",
      verticalAlign: "middle",
      "--switch-diff": "calc(var(--switch-width) - var(--switch-height))",
      "--switch-x": {
        base: "var(--switch-diff)",
        _rtl: "calc(var(--switch-diff) * -1)"
      }
    },
    label: {
      lineHeight: "1",
      userSelect: "none",
      fontSize: "sm",
      fontWeight: "medium",
      _disabled: {
        opacity: "0.5"
      }
    },
    indicator: {
      position: "absolute",
      height: "var(--switch-height)",
      width: "var(--switch-height)",
      fontSize: "var(--switch-indicator-font-size)",
      fontWeight: "medium",
      flexShrink: 0,
      userSelect: "none",
      display: "grid",
      placeContent: "center",
      transition: "inset-inline-start 0.12s ease",
      insetInlineStart: "calc(var(--switch-x) - 2px)",
      _checked: {
        insetInlineStart: "2px"
      }
    },
    control: {
      display: "inline-flex",
      gap: "0.5rem",
      flexShrink: 0,
      justifyContent: "flex-start",
      cursor: "switch",
      borderRadius: "full",
      position: "relative",
      width: "var(--switch-width)",
      height: "var(--switch-height)",
      _disabled: {
        opacity: "0.5",
        cursor: "not-allowed"
      },
      _invalid: {
        outline: "2px solid",
        outlineColor: "border.error",
        outlineOffset: "2px"
      }
    },
    thumb: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transitionProperty: "translate",
      transitionDuration: "fast",
      borderRadius: "inherit",
      _checked: {
        translate: "var(--switch-x) 0"
      }
    }
  },
  variants: {
    variant: {
      solid: {
        control: {
          borderRadius: "full",
          bg: "bg.emphasized",
          focusVisibleRing: "outside",
          _checked: {
            bg: "colorPalette.solid"
          }
        },
        thumb: {
          bg: "white",
          width: "var(--switch-height)",
          height: "var(--switch-height)",
          scale: "0.8",
          boxShadow: "sm",
          _checked: {
            bg: "colorPalette.contrast"
          }
        }
      },
      raised: {
        control: {
          borderRadius: "full",
          height: "calc(var(--switch-height) / 2)",
          bg: "bg.muted",
          boxShadow: "inset",
          _checked: {
            bg: "colorPalette.solid/60"
          }
        },
        thumb: {
          width: "var(--switch-height)",
          height: "var(--switch-height)",
          position: "relative",
          top: "calc(var(--switch-height) * -0.25)",
          bg: "white",
          boxShadow: "xs",
          focusVisibleRing: "outside",
          _checked: {
            bg: "colorPalette.solid"
          }
        }
      }
    },
    size: {
      xs: {
        root: {
          "--switch-width": "sizes.6",
          "--switch-height": "sizes.3",
          "--switch-indicator-font-size": "fontSizes.xs"
        }
      },
      sm: {
        root: {
          "--switch-width": "sizes.8",
          "--switch-height": "sizes.4",
          "--switch-indicator-font-size": "fontSizes.xs"
        }
      },
      md: {
        root: {
          "--switch-width": "sizes.10",
          "--switch-height": "sizes.5",
          "--switch-indicator-font-size": "fontSizes.sm"
        }
      },
      lg: {
        root: {
          "--switch-width": "sizes.12",
          "--switch-height": "sizes.6",
          "--switch-indicator-font-size": "fontSizes.md"
        }
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
}), C5 = q({
  className: "chakra-table",
  slots: L3.keys(),
  base: {
    root: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
      textAlign: "start",
      verticalAlign: "top"
    },
    row: {
      _selected: {
        bg: "colorPalette.subtle"
      }
    },
    cell: {
      textAlign: "start",
      alignItems: "center"
    },
    columnHeader: {
      fontWeight: "medium",
      textAlign: "start",
      color: "fg"
    },
    caption: {
      fontWeight: "medium",
      textStyle: "xs"
    },
    footer: {
      fontWeight: "medium"
    }
  },
  variants: {
    interactive: {
      true: {
        body: {
          "& tr": {
            _hover: {
              bg: "colorPalette.subtle"
            }
          }
        }
      }
    },
    stickyHeader: {
      true: {
        header: {
          "& :where(tr)": {
            top: "var(--table-sticky-offset, 0)",
            position: "sticky",
            zIndex: 1
          }
        }
      }
    },
    striped: {
      true: {
        row: {
          "&:nth-of-type(odd) td": {
            bg: "bg.muted"
          }
        }
      }
    },
    showColumnBorder: {
      true: {
        columnHeader: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px"
          }
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px"
          }
        }
      }
    },
    variant: {
      line: {
        columnHeader: {
          borderBottomWidth: "1px"
        },
        cell: {
          borderBottomWidth: "1px"
        },
        row: {
          bg: "bg"
        }
      },
      outline: {
        root: {
          boxShadow: "0 0 0 1px {colors.border}",
          overflow: "hidden"
        },
        columnHeader: {
          borderBottomWidth: "1px"
        },
        header: {
          bg: "bg.muted"
        },
        row: {
          "&:not(:last-of-type)": {
            borderBottomWidth: "1px"
          }
        },
        footer: {
          borderTopWidth: "1px"
        }
      }
    },
    size: {
      sm: {
        root: {
          textStyle: "sm"
        },
        columnHeader: {
          px: "2",
          py: "2"
        },
        cell: {
          px: "2",
          py: "2"
        }
      },
      md: {
        root: {
          textStyle: "sm"
        },
        columnHeader: {
          px: "3",
          py: "3"
        },
        cell: {
          px: "3",
          py: "3"
        }
      },
      lg: {
        root: {
          textStyle: "md"
        },
        columnHeader: {
          px: "4",
          py: "3"
        },
        cell: {
          px: "4",
          py: "3"
        }
      }
    }
  },
  defaultVariants: {
    variant: "line",
    size: "md"
  }
}), T5 = q({
  slots: B3.keys(),
  className: "chakra-tabs",
  base: {
    root: {
      "--tabs-trigger-radius": "radii.l2",
      position: "relative",
      _horizontal: {
        display: "block"
      },
      _vertical: {
        display: "flex"
      }
    },
    list: {
      display: "inline-flex",
      position: "relative",
      isolation: "isolate",
      "--tabs-indicator-shadow": "shadows.xs",
      "--tabs-indicator-bg": "colors.bg",
      minH: "var(--tabs-height)",
      _horizontal: {
        flexDirection: "row"
      },
      _vertical: {
        flexDirection: "column"
      }
    },
    trigger: {
      outline: "0",
      minW: "var(--tabs-height)",
      height: "var(--tabs-height)",
      display: "flex",
      alignItems: "center",
      fontWeight: "medium",
      position: "relative",
      cursor: "button",
      gap: "2",
      _focusVisible: {
        zIndex: 1,
        outline: "2px solid",
        outlineColor: "colorPalette.focusRing"
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.5
      }
    },
    content: {
      focusVisibleRing: "inside",
      _horizontal: {
        width: "100%",
        pt: "var(--tabs-content-padding)"
      },
      _vertical: {
        height: "100%",
        ps: "var(--tabs-content-padding)"
      }
    },
    indicator: {
      width: "var(--width)",
      height: "var(--height)",
      borderRadius: "var(--tabs-indicator-radius)",
      bg: "var(--tabs-indicator-bg)",
      shadow: "var(--tabs-indicator-shadow)",
      zIndex: -1
    }
  },
  variants: {
    fitted: {
      true: {
        list: {
          display: "flex"
        },
        trigger: {
          flex: 1,
          textAlign: "center",
          justifyContent: "center"
        }
      }
    },
    justify: {
      start: {
        list: {
          justifyContent: "flex-start"
        }
      },
      center: {
        list: {
          justifyContent: "center"
        }
      },
      end: {
        list: {
          justifyContent: "flex-end"
        }
      }
    },
    size: {
      sm: {
        root: {
          "--tabs-height": "sizes.9",
          "--tabs-content-padding": "spacing.3"
        },
        trigger: {
          py: "1",
          px: "3",
          textStyle: "sm"
        }
      },
      md: {
        root: {
          "--tabs-height": "sizes.10",
          "--tabs-content-padding": "spacing.4"
        },
        trigger: {
          py: "2",
          px: "4",
          textStyle: "sm"
        }
      },
      lg: {
        root: {
          "--tabs-height": "sizes.11",
          "--tabs-content-padding": "spacing.4.5"
        },
        trigger: {
          py: "2",
          px: "4.5",
          textStyle: "md"
        }
      }
    },
    variant: {
      line: {
        list: {
          display: "flex",
          borderColor: "border",
          _horizontal: {
            borderBottomWidth: "1px"
          },
          _vertical: {
            borderEndWidth: "1px"
          }
        },
        trigger: {
          color: "fg.muted",
          _disabled: {
            _active: { bg: "initial" }
          },
          _selected: {
            color: "fg",
            _horizontal: {
              layerStyle: "indicator.bottom",
              "--indicator-offset-y": "-1px",
              "--indicator-color": "colors.colorPalette.solid"
            },
            _vertical: {
              layerStyle: "indicator.end",
              "--indicator-offset-x": "-1px"
            }
          }
        }
      },
      subtle: {
        trigger: {
          borderRadius: "var(--tabs-trigger-radius)",
          color: "fg.muted",
          _selected: {
            bg: "colorPalette.subtle",
            color: "colorPalette.fg"
          }
        }
      },
      enclosed: {
        list: {
          bg: "bg.muted",
          padding: "1",
          borderRadius: "l3",
          minH: "calc(var(--tabs-height) - 4px)"
        },
        trigger: {
          justifyContent: "center",
          color: "fg.muted",
          borderRadius: "var(--tabs-trigger-radius)",
          _selected: {
            bg: "bg",
            color: "colorPalette.fg",
            shadow: "xs"
          }
        }
      },
      outline: {
        list: {
          "--line-thickness": "1px",
          "--line-offset": "calc(var(--line-thickness) * -1)",
          borderColor: "border",
          display: "flex",
          _horizontal: {
            _before: {
              content: '""',
              position: "absolute",
              bottom: "0px",
              width: "100%",
              borderBottomWidth: "var(--line-thickness)",
              borderBottomColor: "border"
            }
          },
          _vertical: {
            _before: {
              content: '""',
              position: "absolute",
              insetInline: "var(--line-offset)",
              height: "calc(100% - calc(var(--line-thickness) * 2))",
              borderEndWidth: "var(--line-thickness)",
              borderEndColor: "border"
            }
          }
        },
        trigger: {
          color: "fg.muted",
          borderWidth: "1px",
          borderColor: "transparent",
          _selected: {
            bg: "currentBg",
            color: "colorPalette.fg"
          },
          _horizontal: {
            borderTopRadius: "var(--tabs-trigger-radius)",
            marginBottom: "var(--line-offset)",
            marginEnd: { _notLast: "var(--line-offset)" },
            _selected: {
              borderColor: "border",
              borderBottomColor: "transparent"
            }
          },
          _vertical: {
            borderStartRadius: "var(--tabs-trigger-radius)",
            marginEnd: "var(--line-offset)",
            marginBottom: { _notLast: "var(--line-offset)" },
            _selected: {
              borderColor: "border",
              borderEndColor: "transparent"
            }
          }
        }
      },
      plain: {
        trigger: {
          color: "fg.muted",
          _selected: {
            color: "colorPalette.fg"
          },
          borderRadius: "var(--tabs-trigger-radius)",
          "&[data-selected][data-ssr]": {
            bg: "var(--tabs-indicator-bg)",
            shadow: "var(--tabs-indicator-shadow)",
            borderRadius: "var(--tabs-indicator-radius)"
          }
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "line"
  }
});
var eu;
const pt = (eu = nl.variants) == null ? void 0 : eu.variant, I5 = q({
  slots: K3.keys(),
  className: "chakra-tag",
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      verticalAlign: "top",
      maxWidth: "100%",
      userSelect: "none",
      borderRadius: "l2",
      focusVisibleRing: "outside"
    },
    label: {
      lineClamp: "1"
    },
    closeTrigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: "0",
      borderRadius: "l1",
      color: "currentColor",
      focusVisibleRing: "inside",
      focusRingWidth: "2px"
    },
    startElement: {
      flexShrink: 0,
      boxSize: "var(--tag-element-size)",
      ms: "var(--tag-element-offset)",
      "&:has([data-scope=avatar])": {
        boxSize: "var(--tag-avatar-size)",
        ms: "calc(var(--tag-element-offset) * 1.5)"
      },
      _icon: { boxSize: "100%" }
    },
    endElement: {
      flexShrink: 0,
      boxSize: "var(--tag-element-size)",
      me: "var(--tag-element-offset)",
      _icon: { boxSize: "100%" },
      "&:has(button)": {
        ms: "calc(var(--tag-element-offset) * -1)"
      }
    }
  },
  variants: {
    size: {
      sm: {
        root: {
          px: "1.5",
          minH: "4.5",
          gap: "1",
          "--tag-avatar-size": "spacing.3",
          "--tag-element-size": "spacing.3",
          "--tag-element-offset": "-2px"
        },
        label: {
          textStyle: "xs"
        }
      },
      md: {
        root: {
          px: "1.5",
          minH: "5",
          gap: "1",
          "--tag-avatar-size": "spacing.3.5",
          "--tag-element-size": "spacing.3.5",
          "--tag-element-offset": "-2px"
        },
        label: {
          textStyle: "xs"
        }
      },
      lg: {
        root: {
          px: "2",
          minH: "6",
          gap: "1.5",
          "--tag-avatar-size": "spacing.4.5",
          "--tag-element-size": "spacing.4",
          "--tag-element-offset": "-3px"
        },
        label: {
          textStyle: "sm"
        }
      },
      xl: {
        root: {
          px: "2.5",
          minH: "8",
          gap: "1.5",
          "--tag-avatar-size": "spacing.6",
          "--tag-element-size": "spacing.4.5",
          "--tag-element-offset": "-4px"
        },
        label: {
          textStyle: "sm"
        }
      }
    },
    variant: {
      subtle: {
        root: pt == null ? void 0 : pt.subtle
      },
      solid: {
        root: pt == null ? void 0 : pt.solid
      },
      outline: {
        root: pt == null ? void 0 : pt.outline
      },
      surface: {
        root: pt == null ? void 0 : pt.surface
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "surface"
  }
}), R5 = q({
  slots: W3.keys(),
  className: "chakra-timeline",
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "full",
      "--timeline-thickness": "1px",
      "--timeline-gutter": "4px"
    },
    item: {
      display: "flex",
      position: "relative",
      alignItems: "flex-start",
      flexShrink: 0,
      gap: "4",
      _last: {
        "& :where(.chakra-timeline__separator)": { display: "none" }
      }
    },
    separator: {
      position: "absolute",
      borderStartWidth: "var(--timeline-thickness)",
      ms: "calc(-1 * var(--timeline-thickness) / 2)",
      insetInlineStart: "calc(var(--timeline-indicator-size) / 2)",
      insetBlock: "0",
      borderColor: "border"
    },
    indicator: {
      outline: "2px solid {colors.bg}",
      position: "relative",
      flexShrink: "0",
      boxSize: "var(--timeline-indicator-size)",
      fontSize: "var(--timeline-font-size)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "full",
      fontWeight: "medium"
    },
    connector: {
      alignSelf: "stretch",
      position: "relative"
    },
    content: {
      pb: "6",
      display: "flex",
      flexDirection: "column",
      width: "full",
      gap: "2"
    },
    title: {
      display: "flex",
      fontWeight: "medium",
      flexWrap: "wrap",
      gap: "1.5",
      alignItems: "center",
      mt: "var(--timeline-margin)"
    },
    description: {
      color: "fg.muted",
      textStyle: "xs"
    }
  },
  variants: {
    variant: {
      subtle: {
        indicator: {
          bg: "colorPalette.muted"
        }
      },
      solid: {
        indicator: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast"
        }
      },
      outline: {
        indicator: {
          bg: "currentBg",
          borderWidth: "1px",
          borderColor: "colorPalette.muted"
        }
      },
      plain: {}
    },
    size: {
      sm: {
        root: {
          "--timeline-indicator-size": "sizes.4",
          "--timeline-font-size": "fontSizes.2xs"
        },
        title: {
          textStyle: "xs"
        }
      },
      md: {
        root: {
          "--timeline-indicator-size": "sizes.5",
          "--timeline-font-size": "fontSizes.xs"
        },
        title: {
          textStyle: "sm"
        }
      },
      lg: {
        root: {
          "--timeline-indicator-size": "sizes.6",
          "--timeline-font-size": "fontSizes.xs"
        },
        title: {
          mt: "0.5",
          textStyle: "sm"
        }
      },
      xl: {
        root: {
          "--timeline-indicator-size": "sizes.8",
          "--timeline-font-size": "fontSizes.sm"
        },
        title: {
          mt: "1.5",
          textStyle: "sm"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "solid"
  }
}), D5 = q({
  slots: M3.keys(),
  className: "chakra-toast",
  base: {
    root: {
      width: "full",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
      gap: "3",
      py: "4",
      ps: "4",
      pe: "6",
      borderRadius: "l2",
      translate: "var(--x) var(--y)",
      scale: "var(--scale)",
      zIndex: "var(--z-index)",
      height: "var(--height)",
      opacity: "var(--opacity)",
      willChange: "translate, opacity, scale",
      transition: "translate 400ms, scale 400ms, opacity 400ms, height 400ms, box-shadow 200ms",
      transitionTimingFunction: "cubic-bezier(0.21, 1.02, 0.73, 1)",
      _closed: {
        transition: "translate 400ms, scale 400ms, opacity 200ms",
        transitionTimingFunction: "cubic-bezier(0.06, 0.71, 0.55, 1)"
      },
      bg: "bg.panel",
      color: "fg",
      boxShadow: "xl",
      "--toast-trigger-bg": "colors.bg.muted",
      "&[data-type=warning]": {
        bg: "orange.solid",
        color: "orange.contrast",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}"
      },
      "&[data-type=success]": {
        bg: "green.solid",
        color: "green.contrast",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}"
      },
      "&[data-type=error]": {
        bg: "red.solid",
        color: "red.contrast",
        "--toast-trigger-bg": "{white/10}",
        "--toast-border-color": "{white/40}"
      }
    },
    title: {
      fontWeight: "medium",
      textStyle: "sm",
      marginEnd: "2"
    },
    description: {
      display: "inline",
      textStyle: "sm",
      opacity: "0.8"
    },
    indicator: {
      flexShrink: "0",
      boxSize: "5"
    },
    actionTrigger: {
      textStyle: "sm",
      fontWeight: "medium",
      height: "8",
      px: "3",
      borderRadius: "l2",
      alignSelf: "center",
      borderWidth: "1px",
      borderColor: "var(--toast-border-color, inherit)",
      transition: "background 200ms",
      _hover: {
        bg: "var(--toast-trigger-bg)"
      }
    },
    closeTrigger: {
      position: "absolute",
      top: "1",
      insetEnd: "1",
      padding: "1",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "{currentColor/60}",
      borderRadius: "l2",
      textStyle: "md",
      transition: "background 200ms",
      _icon: {
        boxSize: "1em"
      }
    }
  }
}), A5 = q({
  slots: Vh.keys(),
  className: "chakra-tooltip",
  base: {
    content: {
      "--tooltip-bg": "colors.bg.inverted",
      bg: "var(--tooltip-bg)",
      color: "fg.inverted",
      px: "2.5",
      py: "1",
      borderRadius: "l2",
      fontWeight: "medium",
      textStyle: "xs",
      boxShadow: "md",
      maxW: "xs",
      zIndex: "tooltip",
      transformOrigin: "var(--transform-origin)",
      _open: {
        animationStyle: "scale-fade-in",
        animationDuration: "fast"
      },
      _closed: {
        animationStyle: "scale-fade-out",
        animationDuration: "fast"
      }
    },
    arrow: {
      "--arrow-size": "sizes.2",
      "--arrow-background": "var(--tooltip-bg)"
    },
    arrowTip: {
      borderTopWidth: "1px",
      borderInlineStartWidth: "1px",
      borderColor: "var(--tooltip-bg)"
    }
  }
}), z5 = {
  accordion: j3,
  actionBar: V3,
  alert: H3,
  avatar: U3,
  blockquote: G3,
  breadcrumb: Y3,
  card: q3,
  checkbox: X3,
  checkboxCard: Z3,
  collapsible: J3,
  dataList: e5,
  dialog: t5,
  drawer: r5,
  editable: a5,
  emptyState: i5,
  field: o5,
  fieldset: n5,
  fileUpload: l5,
  hoverCard: s5,
  list: d5,
  menu: c5,
  nativeSelect: u5,
  numberInput: h5,
  pinInput: g5,
  popover: p5,
  progress: v5,
  progressCircle: m5,
  radioCard: y5,
  radioGroup: x5,
  ratingGroup: k5,
  segmentGroup: _5,
  select: Si,
  slider: S5,
  stat: w5,
  steps: E5,
  switch: P5,
  table: C5,
  tabs: T5,
  tag: I5,
  toast: D5,
  tooltip: A5,
  status: $5,
  timeline: R5,
  colorPicker: Q3,
  qrCode: b5
}, O5 = Gh({
  "2xs": { value: { fontSize: "2xs", lineHeight: "0.75rem" } },
  xs: { value: { fontSize: "xs", lineHeight: "1rem" } },
  sm: { value: { fontSize: "sm", lineHeight: "1.25rem" } },
  md: { value: { fontSize: "md", lineHeight: "1.5rem" } },
  lg: { value: { fontSize: "lg", lineHeight: "1.75rem" } },
  xl: { value: { fontSize: "xl", lineHeight: "1.875rem" } },
  "2xl": { value: { fontSize: "2xl", lineHeight: "2rem" } },
  "3xl": { value: { fontSize: "3xl", lineHeight: "2.375rem" } },
  "4xl": {
    value: {
      fontSize: "4xl",
      lineHeight: "2.75rem",
      letterSpacing: "-0.025em"
    }
  },
  "5xl": {
    value: {
      fontSize: "5xl",
      lineHeight: "3.75rem",
      letterSpacing: "-0.025em"
    }
  },
  "6xl": {
    value: { fontSize: "6xl", lineHeight: "4.5rem", letterSpacing: "-0.025em" }
  },
  "7xl": {
    value: {
      fontSize: "7xl",
      lineHeight: "5.75rem",
      letterSpacing: "-0.025em"
    }
  },
  none: {
    value: {}
  }
}), F5 = oe.animations({
  spin: { value: "spin 1s linear infinite" },
  ping: { value: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" },
  pulse: { value: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
  bounce: { value: "bounce 1s infinite" }
}), N5 = oe.aspectRatios({
  square: { value: "1 / 1" },
  landscape: { value: "4 / 3" },
  portrait: { value: "3 / 4" },
  wide: { value: "16 / 9" },
  ultrawide: { value: "18 / 5" },
  golden: { value: "1.618 / 1" }
}), L5 = oe.blurs({
  none: { value: " " },
  sm: { value: "4px" },
  md: { value: "8px" },
  lg: { value: "12px" },
  xl: { value: "16px" },
  "2xl": { value: "24px" },
  "3xl": { value: "40px" },
  "4xl": { value: "64px" }
}), M5 = oe.borders({
  xs: { value: "0.5px solid" },
  sm: { value: "1px solid" },
  md: { value: "2px solid" },
  lg: { value: "4px solid" },
  xl: { value: "8px solid" }
}), B5 = oe.colors({
  transparent: { value: "transparent" },
  current: { value: "currentColor" },
  black: { value: "#09090B" },
  white: { value: "#FFFFFF" },
  whiteAlpha: {
    50: { value: "rgba(255, 255, 255, 0.04)" },
    100: { value: "rgba(255, 255, 255, 0.06)" },
    200: { value: "rgba(255, 255, 255, 0.08)" },
    300: { value: "rgba(255, 255, 255, 0.16)" },
    400: { value: "rgba(255, 255, 255, 0.24)" },
    500: { value: "rgba(255, 255, 255, 0.36)" },
    600: { value: "rgba(255, 255, 255, 0.48)" },
    700: { value: "rgba(255, 255, 255, 0.64)" },
    800: { value: "rgba(255, 255, 255, 0.80)" },
    900: { value: "rgba(255, 255, 255, 0.92)" },
    950: { value: "rgba(255, 255, 255, 0.95)" }
  },
  blackAlpha: {
    50: { value: "rgba(0, 0, 0, 0.04)" },
    100: { value: "rgba(0, 0, 0, 0.06)" },
    200: { value: "rgba(0, 0, 0, 0.08)" },
    300: { value: "rgba(0, 0, 0, 0.16)" },
    400: { value: "rgba(0, 0, 0, 0.24)" },
    500: { value: "rgba(0, 0, 0, 0.36)" },
    600: { value: "rgba(0, 0, 0, 0.48)" },
    700: { value: "rgba(0, 0, 0, 0.64)" },
    800: { value: "rgba(0, 0, 0, 0.80)" },
    900: { value: "rgba(0, 0, 0, 0.92)" },
    950: { value: "rgba(0, 0, 0, 0.95)" }
  },
  gray: {
    50: { value: "#fafafa" },
    100: { value: "#f4f4f5" },
    200: { value: "#e4e4e7" },
    300: { value: "#d4d4d8" },
    400: { value: "#a1a1aa" },
    500: { value: "#71717a" },
    600: { value: "#52525b" },
    700: { value: "#3f3f46" },
    800: { value: "#27272a" },
    900: { value: "#18181b" },
    950: { value: "#111111" }
  },
  red: {
    50: { value: "#fef2f2" },
    100: { value: "#fee2e2" },
    200: { value: "#fecaca" },
    300: { value: "#fca5a5" },
    400: { value: "#f87171" },
    500: { value: "#ef4444" },
    600: { value: "#dc2626" },
    700: { value: "#991919" },
    800: { value: "#511111" },
    900: { value: "#300c0c" },
    950: { value: "#1f0808" }
  },
  orange: {
    50: { value: "#fff7ed" },
    100: { value: "#ffedd5" },
    200: { value: "#fed7aa" },
    300: { value: "#fdba74" },
    400: { value: "#fb923c" },
    500: { value: "#f97316" },
    600: { value: "#ea580c" },
    700: { value: "#92310a" },
    800: { value: "#6c2710" },
    900: { value: "#3b1106" },
    950: { value: "#220a04" }
  },
  yellow: {
    50: { value: "#fefce8" },
    100: { value: "#fef9c3" },
    200: { value: "#fef08a" },
    300: { value: "#fde047" },
    400: { value: "#facc15" },
    500: { value: "#eab308" },
    600: { value: "#ca8a04" },
    700: { value: "#845209" },
    800: { value: "#713f12" },
    900: { value: "#422006" },
    950: { value: "#281304" }
  },
  green: {
    50: { value: "#f0fdf4" },
    100: { value: "#dcfce7" },
    200: { value: "#bbf7d0" },
    300: { value: "#86efac" },
    400: { value: "#4ade80" },
    500: { value: "#22c55e" },
    600: { value: "#16a34a" },
    700: { value: "#116932" },
    800: { value: "#124a28" },
    900: { value: "#042713" },
    950: { value: "#03190c" }
  },
  teal: {
    50: { value: "#f0fdfa" },
    100: { value: "#ccfbf1" },
    200: { value: "#99f6e4" },
    300: { value: "#5eead4" },
    400: { value: "#2dd4bf" },
    500: { value: "#14b8a6" },
    600: { value: "#0d9488" },
    700: { value: "#0c5d56" },
    800: { value: "#114240" },
    900: { value: "#032726" },
    950: { value: "#021716" }
  },
  blue: {
    50: { value: "#eff6ff" },
    100: { value: "#dbeafe" },
    200: { value: "#bfdbfe" },
    300: { value: "#a3cfff" },
    400: { value: "#60a5fa" },
    500: { value: "#3b82f6" },
    600: { value: "#2563eb" },
    700: { value: "#173da6" },
    800: { value: "#1a3478" },
    900: { value: "#14204a" },
    950: { value: "#0c142e" }
  },
  cyan: {
    50: { value: "#ecfeff" },
    100: { value: "#cffafe" },
    200: { value: "#a5f3fc" },
    300: { value: "#67e8f9" },
    400: { value: "#22d3ee" },
    500: { value: "#06b6d4" },
    600: { value: "#0891b2" },
    700: { value: "#0c5c72" },
    800: { value: "#134152" },
    900: { value: "#072a38" },
    950: { value: "#051b24" }
  },
  purple: {
    50: { value: "#faf5ff" },
    100: { value: "#f3e8ff" },
    200: { value: "#e9d5ff" },
    300: { value: "#d8b4fe" },
    400: { value: "#c084fc" },
    500: { value: "#a855f7" },
    600: { value: "#9333ea" },
    700: { value: "#641ba3" },
    800: { value: "#4a1772" },
    900: { value: "#2f0553" },
    950: { value: "#1a032e" }
  },
  pink: {
    50: { value: "#fdf2f8" },
    100: { value: "#fce7f3" },
    200: { value: "#fbcfe8" },
    300: { value: "#f9a8d4" },
    400: { value: "#f472b6" },
    500: { value: "#ec4899" },
    600: { value: "#db2777" },
    700: { value: "#a41752" },
    800: { value: "#6d0e34" },
    900: { value: "#45061f" },
    950: { value: "#2c0514" }
  }
}), K5 = oe.cursor({
  button: { value: "pointer" },
  checkbox: { value: "default" },
  disabled: { value: "not-allowed" },
  menuitem: { value: "default" },
  option: { value: "default" },
  radio: { value: "default" },
  slider: { value: "default" },
  switch: { value: "pointer" }
}), W5 = oe.durations({
  fastest: { value: "50ms" },
  faster: { value: "100ms" },
  fast: { value: "150ms" },
  moderate: { value: "200ms" },
  slow: { value: "300ms" },
  slower: { value: "400ms" },
  slowest: { value: "500ms" }
}), j5 = oe.easings({
  "ease-in": { value: "cubic-bezier(0.42, 0, 1, 1)" },
  "ease-out": { value: "cubic-bezier(0, 0, 0.58, 1)" },
  "ease-in-out": { value: "cubic-bezier(0.42, 0, 0.58, 1)" },
  "ease-in-smooth": { value: "cubic-bezier(0.32, 0.72, 0, 1)" }
}), V5 = oe.fontSizes({
  "2xs": { value: "0.625rem" },
  xs: { value: "0.75rem" },
  sm: { value: "0.875rem" },
  md: { value: "1rem" },
  lg: { value: "1.125rem" },
  xl: { value: "1.25rem" },
  "2xl": { value: "1.5rem" },
  "3xl": { value: "1.875rem" },
  "4xl": { value: "2.25rem" },
  "5xl": { value: "3rem" },
  "6xl": { value: "3.75rem" },
  "7xl": { value: "4.5rem" },
  "8xl": { value: "6rem" },
  "9xl": { value: "8rem" }
}), H5 = oe.fontWeights({
  thin: { value: "100" },
  extralight: { value: "200" },
  light: { value: "300" },
  normal: { value: "400" },
  medium: { value: "500" },
  semibold: { value: "600" },
  bold: { value: "700" },
  extrabold: { value: "800" },
  black: { value: "900" }
}), qs = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', U5 = oe.fonts({
  heading: {
    value: `Inter, ${qs}`
  },
  body: {
    value: `Inter, ${qs}`
  },
  mono: {
    value: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
  }
}), G5 = _2({
  spin: {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  },
  pulse: {
    "50%": { opacity: "0.5" }
  },
  ping: {
    "75%, 100%": {
      transform: "scale(2)",
      opacity: "0"
    }
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
    },
    "50%": {
      transform: "none",
      animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
    }
  },
  "bg-position": {
    from: { backgroundPosition: "var(--animate-from, 1rem) 0" },
    to: { backgroundPosition: "var(--animate-to, 0) 0" }
  },
  position: {
    from: {
      insetInlineStart: "var(--animate-from-x)",
      insetBlockStart: "var(--animate-from-y)"
    },
    to: {
      insetInlineStart: "var(--animate-to-x)",
      insetBlockStart: "var(--animate-to-y)"
    }
  },
  "circular-progress": {
    "0%": {
      strokeDasharray: "1, 400",
      strokeDashoffset: "0"
    },
    "50%": {
      strokeDasharray: "400, 400",
      strokeDashoffset: "-100%"
    },
    "100%": {
      strokeDasharray: "400, 400",
      strokeDashoffset: "-260%"
    }
  },
  // collapse
  "expand-height": {
    from: { height: "0" },
    to: { height: "var(--height)" }
  },
  "collapse-height": {
    from: { height: "var(--height)" },
    to: { height: "0" }
  },
  "expand-width": {
    from: { width: "0" },
    to: { width: "var(--width)" }
  },
  "collapse-width": {
    from: { height: "var(--width)" },
    to: { height: "0" }
  },
  // fade
  "fade-in": {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  "fade-out": {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  // slide from (full)
  "slide-from-left-full": {
    from: { translate: "-100% 0" },
    to: { translate: "0 0" }
  },
  "slide-from-right-full": {
    from: { translate: "100% 0" },
    to: { translate: "0 0" }
  },
  "slide-from-top-full": {
    from: { translate: "0 -100%" },
    to: { translate: "0 0" }
  },
  "slide-from-bottom-full": {
    from: { translate: "0 100%" },
    to: { translate: "0 0" }
  },
  // slide to (full)
  "slide-to-left-full": {
    from: { translate: "0 0" },
    to: { translate: "-100% 0" }
  },
  "slide-to-right-full": {
    from: { translate: "0 0" },
    to: { translate: "100% 0" }
  },
  "slide-to-top-full": {
    from: { translate: "0 0" },
    to: { translate: "0 -100%" }
  },
  "slide-to-bottom-full": {
    from: { translate: "0 0" },
    to: { translate: "0 100%" }
  },
  // slide from
  "slide-from-top": {
    "0%": { translate: "0 -0.5rem" },
    to: { translate: "0" }
  },
  "slide-from-bottom": {
    "0%": { translate: "0 0.5rem" },
    to: { translate: "0" }
  },
  "slide-from-left": {
    "0%": { translate: "-0.5rem 0" },
    to: { translate: "0" }
  },
  "slide-from-right": {
    "0%": { translate: "0.5rem 0" },
    to: { translate: "0" }
  },
  // slide to
  "slide-to-top": {
    "0%": { translate: "0" },
    to: { translate: "0 -0.5rem" }
  },
  "slide-to-bottom": {
    "0%": { translate: "0" },
    to: { translate: "0 0.5rem" }
  },
  "slide-to-left": {
    "0%": { translate: "0" },
    to: { translate: "-0.5rem 0" }
  },
  "slide-to-right": {
    "0%": { translate: "0" },
    to: { translate: "0.5rem 0" }
  },
  // scale
  "scale-in": {
    from: { scale: "0.95" },
    to: { scale: "1" }
  },
  "scale-out": {
    from: { scale: "1" },
    to: { scale: "0.95" }
  }
}), Y5 = oe.letterSpacings({
  tighter: { value: "-0.05em" },
  tight: { value: "-0.025em" },
  wide: { value: "0.025em" },
  wider: { value: "0.05em" },
  widest: { value: "0.1em" }
}), q5 = oe.lineHeights({
  shorter: { value: 1.25 },
  short: { value: 1.375 },
  moderate: { value: 1.5 },
  tall: { value: 1.625 },
  taller: { value: 2 }
}), X5 = oe.radii({
  none: { value: "0" },
  "2xs": { value: "0.0625rem" },
  xs: { value: "0.125rem" },
  sm: { value: "0.25rem" },
  md: { value: "0.375rem" },
  lg: { value: "0.5rem" },
  xl: { value: "0.75rem" },
  "2xl": { value: "1rem" },
  "3xl": { value: "1.5rem" },
  "4xl": { value: "2rem" },
  full: { value: "9999px" }
}), _0 = oe.spacing({
  0.5: { value: "0.125rem" },
  1: { value: "0.25rem" },
  1.5: { value: "0.375rem" },
  2: { value: "0.5rem" },
  2.5: { value: "0.625rem" },
  3: { value: "0.75rem" },
  3.5: { value: "0.875rem" },
  4: { value: "1rem" },
  4.5: { value: "1.125rem" },
  5: { value: "1.25rem" },
  6: { value: "1.5rem" },
  7: { value: "1.75rem" },
  8: { value: "2rem" },
  9: { value: "2.25rem" },
  10: { value: "2.5rem" },
  11: { value: "2.75rem" },
  12: { value: "3rem" },
  14: { value: "3.5rem" },
  16: { value: "4rem" },
  20: { value: "5rem" },
  24: { value: "6rem" },
  28: { value: "7rem" },
  32: { value: "8rem" },
  36: { value: "9rem" },
  40: { value: "10rem" },
  44: { value: "11rem" },
  48: { value: "12rem" },
  52: { value: "13rem" },
  56: { value: "14rem" },
  60: { value: "15rem" },
  64: { value: "16rem" },
  72: { value: "18rem" },
  80: { value: "20rem" },
  96: { value: "24rem" }
}), Z5 = oe.sizes({
  "3xs": { value: "14rem" },
  "2xs": { value: "16rem" },
  xs: { value: "20rem" },
  sm: { value: "24rem" },
  md: { value: "28rem" },
  lg: { value: "32rem" },
  xl: { value: "36rem" },
  "2xl": { value: "42rem" },
  "3xl": { value: "48rem" },
  "4xl": { value: "56rem" },
  "5xl": { value: "64rem" },
  "6xl": { value: "72rem" },
  "7xl": { value: "80rem" },
  "8xl": { value: "90rem" }
}), J5 = oe.sizes({
  max: { value: "max-content" },
  min: { value: "min-content" },
  fit: { value: "fit-content" },
  prose: { value: "60ch" },
  full: { value: "100%" },
  dvh: { value: "100dvh" },
  svh: { value: "100svh" },
  lvh: { value: "100lvh" },
  dvw: { value: "100dvw" },
  svw: { value: "100svw" },
  lvw: { value: "100lvw" },
  vw: { value: "100vw" },
  vh: { value: "100vh" }
}), Q5 = oe.sizes({
  "1/2": { value: "50%" },
  "1/3": { value: "33.333333%" },
  "2/3": { value: "66.666667%" },
  "1/4": { value: "25%" },
  "3/4": { value: "75%" },
  "1/5": { value: "20%" },
  "2/5": { value: "40%" },
  "3/5": { value: "60%" },
  "4/5": { value: "80%" },
  "1/6": { value: "16.666667%" },
  "2/6": { value: "33.333333%" },
  "3/6": { value: "50%" },
  "4/6": { value: "66.666667%" },
  "5/6": { value: "83.333333%" },
  "1/12": { value: "8.333333%" },
  "2/12": { value: "16.666667%" },
  "3/12": { value: "25%" },
  "4/12": { value: "33.333333%" },
  "5/12": { value: "41.666667%" },
  "6/12": { value: "50%" },
  "7/12": { value: "58.333333%" },
  "8/12": { value: "66.666667%" },
  "9/12": { value: "75%" },
  "10/12": { value: "83.333333%" },
  "11/12": { value: "91.666667%" }
}), e4 = oe.sizes({
  ...Z5,
  ..._0,
  ...Q5,
  ...J5
}), t4 = oe.zIndex({
  hide: { value: -1 },
  base: { value: 0 },
  docked: { value: 10 },
  dropdown: { value: 1e3 },
  sticky: { value: 1100 },
  banner: { value: 1200 },
  overlay: { value: 1300 },
  modal: { value: 1400 },
  popover: { value: 1500 },
  skipNav: { value: 1600 },
  toast: { value: 1700 },
  tooltip: { value: 1800 },
  max: { value: 2147483647 }
}), r4 = il({
  preflight: !0,
  cssVarsPrefix: "chakra",
  cssVarsRoot: ":where(html, .chakra-theme)",
  globalCss: Wx,
  theme: {
    breakpoints: Kx,
    keyframes: G5,
    tokens: {
      aspectRatios: N5,
      animations: F5,
      blurs: L5,
      borders: M5,
      colors: B5,
      durations: W5,
      easings: j5,
      fonts: U5,
      fontSizes: V5,
      fontWeights: H5,
      letterSpacings: Y5,
      lineHeights: q5,
      radii: X5,
      spacing: _0,
      sizes: e4,
      zIndex: t4,
      cursor: K5
    },
    semanticTokens: {
      colors: s3,
      shadows: c3,
      radii: d3
    },
    recipes: l3,
    slotRecipes: z5,
    textStyles: O5,
    layerStyles: jx,
    animationStyles: Vx
  }
}), a4 = Zh(Qh, r4), S0 = y0(a4);
function ll(e) {
  const { key: t, recipe: r } = e, a = Wa();
  return G(() => {
    const i = r || (t != null ? a.getSlotRecipe(t) : {});
    return a.sva(structuredClone(i));
  }, [t, r, a]);
}
const i4 = (e) => e.charAt(0).toUpperCase() + e.slice(1), ja = (e) => {
  const { key: t, recipe: r } = e, a = i4(
    t || r.className || "Component"
  ), [i, o] = Ea({
    name: `${a}StylesContext`,
    errorMessage: `use${a}Styles returned is 'undefined'. Seems you forgot to wrap the components in "<${a}.Root />" `
  }), [n, l] = Ea({
    name: `${a}ClassNameContext`,
    errorMessage: `use${a}ClassNames returned is 'undefined'. Seems you forgot to wrap the components in "<${a}.Root />" `,
    strict: !1
  }), [s, d] = Ea({
    strict: !1,
    name: `${a}PropsContext`,
    providerName: `${a}PropsContext`,
    defaultValue: {}
  });
  function c(g) {
    const { unstyled: v, ...b } = g, m = ll({
      key: t,
      recipe: b.recipe || r
    }), [x, S] = m.splitVariantProps(b);
    return {
      styles: v ? Jv : m(x),
      classNames: m.classNameMap,
      props: S
    };
  }
  function h(g, v = {}) {
    const { defaultProps: b } = v, m = (x) => {
      const S = $i(b, d(), x), { styles: T, classNames: k, props: $ } = c(S);
      return /* @__PURE__ */ C.jsx(i, { value: T, children: /* @__PURE__ */ C.jsx(n, { value: k, children: /* @__PURE__ */ C.jsx(g, { ...$ }) }) });
    };
    return m.displayName = g.displayName || g.name, m;
  }
  return {
    StylesProvider: i,
    ClassNamesProvider: n,
    PropsProvider: s,
    usePropsContext: d,
    useRecipeResult: c,
    withProvider: (g, v, b) => {
      const { defaultProps: m, ...x } = b ?? {}, S = Ve(g, {}, x), T = V((k, $) => {
        var _;
        const D = $i(m ?? {}, d(), k), { styles: p, props: w, classNames: I } = c(D), P = I[v], O = /* @__PURE__ */ C.jsx(i, { value: p, children: /* @__PURE__ */ C.jsx(n, { value: I, children: /* @__PURE__ */ C.jsx(
          S,
          {
            ref: $,
            ...w,
            css: [p[v], D.css],
            className: lt(D.className, P)
          }
        ) }) });
        return ((_ = b == null ? void 0 : b.wrapElement) == null ? void 0 : _.call(b, O, D)) ?? O;
      });
      return T.displayName = g.displayName || g.name, T;
    },
    withContext: (g, v, b) => {
      const m = Ve(g, {}, b), x = V((S, T) => {
        const k = o(), $ = l(), D = $ == null ? void 0 : $[v];
        return /* @__PURE__ */ C.jsx(
          m,
          {
            ...S,
            css: [v ? k[v] : void 0, S.css],
            ref: T,
            className: lt(S.className, D)
          }
        );
      });
      return x.displayName = g.displayName || g.name, x;
    },
    withRootProvider: h,
    useStyles: o,
    useClassNames: l
  };
}, So = (e) => e ? "" : void 0, o4 = Ve("div", {
  base: {
    display: "inline-flex",
    gap: "0.5rem",
    isolation: "isolate",
    position: "relative",
    "& [data-group-item]": {
      _focusVisible: {
        zIndex: 1
      }
    }
  },
  variants: {
    orientation: {
      horizontal: {
        flexDirection: "row"
      },
      vertical: {
        flexDirection: "column"
      }
    },
    attached: {
      true: {
        gap: "0!"
      }
    },
    grow: {
      true: {
        display: "flex",
        "& > *": {
          flex: 1
        }
      }
    },
    stacking: {
      "first-on-top": {
        "& > [data-group-item]": {
          zIndex: "calc(var(--group-count) - var(--group-index))"
        }
      },
      "last-on-top": {
        "& > [data-group-item]": {
          zIndex: "var(--group-index)"
        }
      }
    }
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      attached: !0,
      css: {
        "& > *[data-first]": {
          borderEndRadius: "0!",
          marginEnd: "-1px"
        },
        "& > *[data-between]": {
          borderRadius: "0!",
          marginEnd: "-1px"
        },
        "& > *[data-last]": {
          borderStartRadius: "0!"
        }
      }
    },
    {
      orientation: "vertical",
      attached: !0,
      css: {
        "& > *[data-first]": {
          borderBottomRadius: "0!",
          marginBottom: "-1px"
        },
        "& > *[data-between]": {
          borderRadius: "0!",
          marginBottom: "-1px"
        },
        "& > *[data-last]": {
          borderTopRadius: "0!"
        }
      }
    }
  ],
  defaultVariants: {
    orientation: "horizontal"
  }
}), n4 = tu(
  V(function(t, r) {
    const {
      align: a = "center",
      justify: i = "flex-start",
      children: o,
      wrap: n,
      ...l
    } = t, s = G(() => {
      const d = Wi.toArray(o).filter(ji), c = d.length;
      return d.map((h, u) => {
        const f = h.props;
        return Qr(h, {
          ...f,
          "data-group-item": "",
          "data-first": So(u === 0),
          "data-last": So(u === c - 1),
          "data-between": So(u > 0 && u < c - 1),
          style: {
            "--group-count": c,
            "--group-index": u,
            ...(f == null ? void 0 : f.style) ?? {}
          }
        });
      });
    }, [o]);
    return /* @__PURE__ */ C.jsx(
      o4,
      {
        ref: r,
        alignItems: a,
        justifyContent: i,
        flexWrap: n,
        ...l,
        className: lt("chakra-group", t.className),
        children: s
      }
    );
  })
), l4 = "cm,mm,Q,in,pc,pt,px,em,ex,ch,rem,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh,cqw,cqh,cqi,cqb,cqmin,cqmax,%", s4 = `(?:${l4.split(",").join("|")})`, d4 = new RegExp(
  `^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${s4}$`
), c4 = (e) => typeof e == "string" && d4.test(e), oi = (e) => c4(e) || Gm(e) ? e : `token(spacing.${e}, ${e})`, qw = V(
  function(t, r) {
    const {
      inline: a,
      inlineStart: i,
      inlineEnd: o,
      block: n,
      blockStart: l,
      blockEnd: s,
      ...d
    } = t;
    return /* @__PURE__ */ C.jsx(
      Ve.div,
      {
        ref: r,
        ...d,
        css: {
          "--bleed-inline-start": Ut(a ?? i, oi),
          "--bleed-inline-end": Ut(a ?? o, oi),
          "--bleed-block-start": Ut(n ?? l, oi),
          "--bleed-block-end": Ut(n ?? s, oi),
          marginInlineStart: "calc(var(--bleed-inline-start, 0) * -1)",
          marginInlineEnd: "calc(var(--bleed-inline-end, 0) * -1)",
          marginBlockStart: "calc(var(--bleed-block-start, 0) * -1)",
          marginBlockEnd: "calc(var(--bleed-block-end, 0) * -1)"
        }
      }
    );
  }
), w0 = Ve("div");
w0.displayName = "Box";
const { withContext: u4 } = ct({
  key: "code"
}), Xw = u4("code"), {
  withRootProvider: $0,
  withContext: Mt
} = ja({ key: "dialog" });
$0(
  Yy,
  {
    defaultProps: { unmountOnExit: !0, lazyMount: !0 }
  }
);
const h4 = $0(Gy, {
  defaultProps: { unmountOnExit: !0, lazyMount: !0 }
}), f4 = Mt(
  Sh,
  "trigger",
  { forwardAsChild: !0 }
), g4 = Mt(kh, "positioner", { forwardAsChild: !0 }), p4 = Mt(
  yh,
  "content",
  { forwardAsChild: !0 }
), v4 = Mt(xh, "description", { forwardAsChild: !0 }), m4 = Mt(
  _h,
  "title",
  { forwardAsChild: !0 }
), b4 = Mt(bh, "closeTrigger", { forwardAsChild: !0 }), y4 = V(function(t, r) {
  const a = fr();
  return /* @__PURE__ */ C.jsx(Ve.button, { ...t, ref: r, onClick: () => a.setOpen(!1) });
}), E0 = Mt(
  mh,
  "backdrop",
  { forwardAsChild: !0 }
), x4 = Mt(
  "div",
  "body"
), k4 = Mt(
  "div",
  "footer"
), _4 = Mt(
  "div",
  "header"
), wo = V(
  function(t, r) {
    const {
      direction: a,
      align: i,
      justify: o,
      wrap: n,
      basis: l,
      grow: s,
      shrink: d,
      inline: c,
      ...h
    } = t;
    return /* @__PURE__ */ C.jsx(
      Ve.div,
      {
        ref: r,
        ...h,
        css: {
          display: c ? "inline-flex" : "flex",
          flexDirection: a,
          alignItems: i,
          justifyContent: o,
          flexWrap: n,
          flexBasis: l,
          flexGrow: s,
          flexShrink: d,
          ...t.css
        }
      }
    );
  }
);
function S4(e) {
  const { each: t, fallback: r, children: a } = e;
  return (t == null ? void 0 : t.length) === 0 ? r || null : t == null ? void 0 : t.map(a);
}
function Xs(e) {
  return Ut(
    e,
    (t) => t === "auto" ? "auto" : `span ${t}/span ${t}`
  );
}
const P0 = V(
  function(t, r) {
    const {
      area: a,
      colSpan: i,
      colStart: o,
      colEnd: n,
      rowEnd: l,
      rowSpan: s,
      rowStart: d,
      ...c
    } = t, h = ta({
      gridArea: a,
      gridColumn: Xs(i),
      gridRow: Xs(s),
      gridColumnStart: o,
      gridColumnEnd: n,
      gridRowStart: d,
      gridRowEnd: l
    });
    return /* @__PURE__ */ C.jsx(Ve.div, { ref: r, css: h, ...c });
  }
), w4 = V(
  function(t, r) {
    const { columns: a, minChildWidth: i, ...o } = t, n = Wa(), l = i ? E4(i, n) : P4(a);
    return /* @__PURE__ */ C.jsx($u, { ref: r, templateColumns: l, ...o });
  }
);
function $4(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function E4(e, t) {
  return Ut(e, (r) => {
    const a = t.tokens.getVar(`sizes.${r}`, $4(r));
    return r === null ? null : `repeat(auto-fit, minmax(${a}, 1fr))`;
  });
}
function P4(e) {
  return Ut(
    e,
    (t) => t === null ? null : `repeat(${t}, minmax(0, 1fr))`
  );
}
const { withContext: C4 } = ct({
  key: "mark"
}), T4 = C4("mark");
function Zw(e) {
  const { children: t, query: r, ignoreCase: a, matchAll: i, styles: o } = e;
  if (typeof t != "string")
    throw new Error("The children prop of Highlight must be a string");
  const n = t2({
    query: r,
    text: t,
    matchAll: i,
    ignoreCase: a
  });
  return /* @__PURE__ */ C.jsx(S4, { each: n, children: (l, s) => l.match ? /* @__PURE__ */ C.jsx(T4, { css: o, children: l.text }, s) : /* @__PURE__ */ C.jsx(iu, { children: l.text }, s) });
}
const I4 = V(
  function(t, r) {
    const { align: a, fit: i = "cover", ...o } = t;
    return /* @__PURE__ */ C.jsx(
      Ve.img,
      {
        ref: r,
        objectFit: i,
        objectPosition: a,
        className: lt("chakra-image", t.className),
        ...o
      }
    );
  }
), { withContext: R4 } = ct({
  key: "input"
}), Jw = R4($h), Zs = Ve("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
    color: "fg.subtle",
    height: "full",
    fontSize: "sm",
    px: "3"
  },
  variants: {
    placement: {
      start: {
        insetInlineStart: "0"
      },
      end: {
        insetInlineEnd: "0"
      }
    }
  }
}), { withContext: D4 } = ct({
  key: "kbd"
}), Qw = D4("kbd"), {
  withProvider: A4,
  withContext: C0,
  PropsProvider: z4
} = ja({ key: "list" }), T0 = A4(
  "ul",
  "root",
  { defaultProps: { role: "list" } }
), O4 = z4, I0 = C0("li", "item"), F4 = C0(
  "span",
  "indicator"
), e$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Indicator: F4,
  Item: I0,
  Root: T0,
  RootPropsProvider: O4
}, Symbol.toStringTag, { value: "Module" }));
function N4(e) {
  const { gap: t, direction: r } = e, a = {
    column: {
      marginY: t,
      marginX: 0,
      borderInlineStartWidth: 0,
      borderTopWidth: "1px"
    },
    "column-reverse": {
      marginY: t,
      marginX: 0,
      borderInlineStartWidth: 0,
      borderTopWidth: "1px"
    },
    row: {
      marginX: t,
      marginY: 0,
      borderInlineStartWidth: "1px",
      borderTopWidth: 0
    },
    "row-reverse": {
      marginX: t,
      marginY: 0,
      borderInlineStartWidth: "1px",
      borderTopWidth: 0
    }
  };
  return {
    "&": Ut(r, (i) => a[i])
  };
}
function L4(e) {
  return Wi.toArray(e).filter(
    (t) => ji(t)
  );
}
const M4 = V(
  function(t, r) {
    const {
      direction: a = "column",
      align: i,
      justify: o,
      gap: n = "0.5rem",
      wrap: l,
      children: s,
      separator: d,
      className: c,
      ...h
    } = t, u = G(
      () => N4({ gap: n, direction: a }),
      [n, a]
    ), f = G(() => d ? L4(s).map((g, v, b) => {
      const m = typeof g.key < "u" ? g.key : v, x = Qr(d, {
        css: [u, d.props.css]
      });
      return /* @__PURE__ */ C.jsxs(iu, { children: [
        g,
        v === b.length - 1 ? null : x
      ] }, m);
    }) : s, [s, d, u]);
    return /* @__PURE__ */ C.jsx(
      Ve.div,
      {
        ref: r,
        display: "flex",
        alignItems: i,
        justifyContent: o,
        flexDirection: a,
        flexWrap: l,
        gap: d ? void 0 : n,
        className: lt("chakra-stack", c),
        ...h,
        children: f
      }
    );
  }
), {
  StylesProvider: B4,
  ClassNamesProvider: K4,
  useRecipeResult: W4,
  withContext: Jt,
  PropsProvider: j4
} = ja({ key: "table" }), R0 = V(
  function({ native: t, ...r }, a) {
    const { styles: i, props: o, classNames: n } = W4(r), l = G(() => t ? {
      ...i.root,
      "& thead": i.header,
      "& tbody": i.body,
      "& tfoot": i.footer,
      "& thead th": i.columnHeader,
      "& tr": i.row,
      "& td": i.cell,
      "& caption": i.caption
    } : i.root, [i, t]);
    return /* @__PURE__ */ C.jsx(K4, { value: n, children: /* @__PURE__ */ C.jsx(B4, { value: i, children: /* @__PURE__ */ C.jsx(
      Ve.table,
      {
        ref: a,
        ...o,
        css: [l, r.css],
        className: lt(n == null ? void 0 : n.root, r.className)
      }
    ) }) });
  }
), V4 = j4, D0 = Jt(
  "tr",
  "row"
), H4 = Ve("div", {
  base: {
    display: "block",
    whiteSpace: "nowrap",
    WebkitOverflowScrolling: "touch",
    overflow: "auto",
    maxWidth: "100%"
  }
}), A0 = Jt("thead", "header"), z0 = Jt("tfoot", "footer"), O0 = Jt("th", "columnHeader"), F0 = Jt(
  "td",
  "cell"
), U4 = Jt("caption", "caption", {
  defaultProps: {
    captionSide: "bottom"
  }
}), N0 = Jt(
  "tbody",
  "body"
), L0 = Jt("colgroup"), M0 = Jt(
  "col"
), t$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Body: N0,
  Caption: U4,
  Cell: F0,
  Column: M0,
  ColumnGroup: L0,
  ColumnHeader: O0,
  Footer: z0,
  Header: A0,
  Root: R0,
  RootPropsProvider: V4,
  Row: D0,
  ScrollArea: H4
}, Symbol.toStringTag, { value: "Module" })), { withContext: G4 } = ct({
  key: "heading"
}), r$ = G4("h2"), { withContext: Y4 } = ct({
  key: "text"
}), q4 = Y4("p"), a$ = Ve("em", {
  base: {
    fontStyle: "italic"
  }
}), B0 = be({
  className: "avatar",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    userSelect: "none",
    borderRadius: "full",
    flexShrink: 0,
    fontWeight: "600",
    backgroundColor: "colorPalette.3",
    colorPalette: "primary",
    color: "colorPalette.11",
    focusVisibleRing: "outside",
    "button&": {
      cursor: "button"
    },
    _disabled: {
      layerStyle: "disabled"
    }
  },
  variants: {
    size: {
      md: { width: 1e3, height: 1e3, textStyle: "sm" },
      xs: { width: 800, height: 800, textStyle: "xs" },
      "2xs": { width: 600, height: 600, textStyle: "xs" }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), { withContext: X4 } = ct({ recipe: B0 }), Z4 = X4("figure");
function J4(e, t) {
  return e.split("")[0].toUpperCase() + t.split("")[0].toUpperCase();
}
const Q4 = V((e, t) => {
  const { firstName: r, lastName: a, src: i, alt: o, ...n } = e, l = `${r} ${a}`, s = {
    "aria-label": `${l} avatar`,
    ref: t,
    ...n
  };
  return /* @__PURE__ */ C.jsx(Z4, { ...s, children: i ? (
    // TODO: implement more robust error handling for image
    /* @__PURE__ */ C.jsx(I4, { src: i, alt: o || l })
  ) : J4(r, a) });
});
Q4.displayName = "Avatar";
const cn = V((e, t) => /* @__PURE__ */ C.jsx(w0, { ref: t, ...e }));
cn.displayName = "Box";
const fe = typeof document < "u" ? z.useLayoutEffect : () => {
};
function je(e) {
  const t = B(null);
  return fe(() => {
    t.current = e;
  }, [
    e
  ]), ie((...r) => {
    const a = t.current;
    return a == null ? void 0 : a(...r);
  }, []);
}
function ek(e) {
  let [t, r] = se(e), a = B(null), i = je(() => {
    if (!a.current) return;
    let n = a.current.next();
    if (n.done) {
      a.current = null;
      return;
    }
    t === n.value ? i() : r(n.value);
  });
  fe(() => {
    a.current && i();
  });
  let o = je((n) => {
    a.current = n(t), i();
  });
  return [
    t,
    o
  ];
}
const zi = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0
}, K0 = /* @__PURE__ */ z.createContext(zi), tk = /* @__PURE__ */ z.createContext(!1);
let rk = !!(typeof window < "u" && window.document && window.document.createElement), $o = /* @__PURE__ */ new WeakMap();
function ak(e = !1) {
  let t = Q(K0), r = B(null);
  if (r.current === null && !e) {
    var a, i;
    let o = (i = z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || i === void 0 || (a = i.ReactCurrentOwner) === null || a === void 0 ? void 0 : a.current;
    if (o) {
      let n = $o.get(o);
      n == null ? $o.set(o, {
        id: t.current,
        state: o.memoizedState
      }) : o.memoizedState !== n.state && (t.current = n.id, $o.delete(o));
    }
    r.current = ++t.current;
  }
  return r.current;
}
function ik(e) {
  let t = Q(K0);
  t === zi && !rk && console.warn("When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.");
  let r = ak(!!e), a = t === zi && process.env.NODE_ENV === "test" ? "react-aria" : `react-aria${t.prefix}`;
  return e || `${a}-${r}`;
}
function ok(e) {
  let t = z.useId(), [r] = se(Tr()), a = r || process.env.NODE_ENV === "test" ? "react-aria" : `react-aria${zi.prefix}`;
  return e || `${a}-${t}`;
}
const nk = typeof z.useId == "function" ? ok : ik;
function lk() {
  return !1;
}
function sk() {
  return !0;
}
function dk(e) {
  return () => {
  };
}
function Tr() {
  return typeof z.useSyncExternalStore == "function" ? z.useSyncExternalStore(dk, lk, sk) : Q(tk);
}
let ck = !!(typeof window < "u" && window.document && window.document.createElement), ir = /* @__PURE__ */ new Map();
function dt(e) {
  let [t, r] = se(e), a = B(null), i = nk(t), o = ie((n) => {
    a.current = n;
  }, []);
  return ck && (ir.has(i) && !ir.get(i).includes(o) ? ir.set(i, [
    ...ir.get(i),
    o
  ]) : ir.set(i, [
    o
  ])), fe(() => {
    let n = i;
    return () => {
      ir.delete(n);
    };
  }, [
    i
  ]), ee(() => {
    let n = a.current;
    n && (a.current = null, r(n));
  }), i;
}
function uk(e, t) {
  if (e === t) return e;
  let r = ir.get(e);
  if (r)
    return r.forEach((i) => i(t)), t;
  let a = ir.get(t);
  return a ? (a.forEach((i) => i(e)), e) : t;
}
function Oi(e = []) {
  let t = dt(), [r, a] = ek(t), i = ie(() => {
    a(function* () {
      yield t, yield document.getElementById(t) ? t : void 0;
    });
  }, [
    t,
    a
  ]);
  return fe(i, [
    t,
    i,
    ...e
  ]), r;
}
function wr(...e) {
  return (...t) => {
    for (let r of e) typeof r == "function" && r(...t);
  };
}
const we = (e) => {
  var t;
  return (t = e == null ? void 0 : e.ownerDocument) !== null && t !== void 0 ? t : document;
}, yt = (e) => e && "window" in e && e.window === e ? e : we(e).defaultView || window;
function W0(e) {
  var t, r, a = "";
  if (typeof e == "string" || typeof e == "number") a += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var i = e.length;
    for (t = 0; t < i; t++) e[t] && (r = W0(e[t])) && (a && (a += " "), a += r);
  } else for (r in e) e[r] && (a && (a += " "), a += r);
  return a;
}
function hk() {
  for (var e, t, r = 0, a = "", i = arguments.length; r < i; r++) (e = arguments[r]) && (t = W0(e)) && (a && (a += " "), a += t);
  return a;
}
function te(...e) {
  let t = {
    ...e[0]
  };
  for (let r = 1; r < e.length; r++) {
    let a = e[r];
    for (let i in a) {
      let o = t[i], n = a[i];
      typeof o == "function" && typeof n == "function" && // This is a lot faster than a regex.
      i[0] === "o" && i[1] === "n" && i.charCodeAt(2) >= /* 'A' */
      65 && i.charCodeAt(2) <= /* 'Z' */
      90 ? t[i] = wr(o, n) : (i === "className" || i === "UNSAFE_className") && typeof o == "string" && typeof n == "string" ? t[i] = hk(o, n) : i === "id" && o && n ? t.id = uk(o, n) : t[i] = n !== void 0 ? n : o;
    }
  }
  return t;
}
function j0(...e) {
  return e.length === 1 && e[0] ? e[0] : (t) => {
    for (let r of e)
      typeof r == "function" ? r(t) : r != null && (r.current = t);
  };
}
const fk = /* @__PURE__ */ new Set([
  "id"
]), gk = /* @__PURE__ */ new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-details"
]), pk = /* @__PURE__ */ new Set([
  "href",
  "hrefLang",
  "target",
  "rel",
  "download",
  "ping",
  "referrerPolicy"
]), vk = /^(data-.*)$/;
function Qe(e, t = {}) {
  let { labelable: r, isLink: a, propNames: i } = t, o = {};
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && (fk.has(n) || r && gk.has(n) || a && pk.has(n) || i != null && i.has(n) || vk.test(n)) && (o[n] = e[n]);
  return o;
}
function Gt(e) {
  if (mk()) e.focus({
    preventScroll: !0
  });
  else {
    let t = bk(e);
    e.focus(), yk(t);
  }
}
let ni = null;
function mk() {
  if (ni == null) {
    ni = !1;
    try {
      document.createElement("div").focus({
        get preventScroll() {
          return ni = !0, !0;
        }
      });
    } catch {
    }
  }
  return ni;
}
function bk(e) {
  let t = e.parentNode, r = [], a = document.scrollingElement || document.documentElement;
  for (; t instanceof HTMLElement && t !== a; )
    (t.offsetHeight < t.scrollHeight || t.offsetWidth < t.scrollWidth) && r.push({
      element: t,
      scrollTop: t.scrollTop,
      scrollLeft: t.scrollLeft
    }), t = t.parentNode;
  return a instanceof HTMLElement && r.push({
    element: a,
    scrollTop: a.scrollTop,
    scrollLeft: a.scrollLeft
  }), r;
}
function yk(e) {
  for (let { element: t, scrollTop: r, scrollLeft: a } of e)
    t.scrollTop = r, t.scrollLeft = a;
}
function Xi(e) {
  var t;
  return typeof window > "u" || window.navigator == null ? !1 : ((t = window.navigator.userAgentData) === null || t === void 0 ? void 0 : t.brands.some((r) => e.test(r.brand))) || e.test(window.navigator.userAgent);
}
function sl(e) {
  var t;
  return typeof window < "u" && window.navigator != null ? e.test(((t = window.navigator.userAgentData) === null || t === void 0 ? void 0 : t.platform) || window.navigator.platform) : !1;
}
function Qt(e) {
  let t = null;
  return () => (t == null && (t = e()), t);
}
const ur = Qt(function() {
  return sl(/^Mac/i);
}), xk = Qt(function() {
  return sl(/^iPhone/i);
}), V0 = Qt(function() {
  return sl(/^iPad/i) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  ur() && navigator.maxTouchPoints > 1;
}), Zi = Qt(function() {
  return xk() || V0();
}), kk = Qt(function() {
  return ur() || Zi();
}), dl = Qt(function() {
  return Xi(/AppleWebKit/i) && !H0();
}), H0 = Qt(function() {
  return Xi(/Chrome/i);
}), cl = Qt(function() {
  return Xi(/Android/i);
}), _k = Qt(function() {
  return Xi(/Firefox/i);
}), Sk = /* @__PURE__ */ ae({
  isNative: !0,
  open: Ek,
  useHref: (e) => e
});
function Ji() {
  return Q(Sk);
}
function wk(e, t) {
  let r = e.getAttribute("target");
  return (!r || r === "_self") && e.origin === location.origin && !e.hasAttribute("download") && !t.metaKey && // open in new tab (mac)
  !t.ctrlKey && // open in new tab (windows)
  !t.altKey && // download
  !t.shiftKey;
}
function $r(e, t, r = !0) {
  var a, i;
  let { metaKey: o, ctrlKey: n, altKey: l, shiftKey: s } = t;
  _k() && (!((i = window.event) === null || i === void 0 || (a = i.type) === null || a === void 0) && a.startsWith("key")) && e.target === "_blank" && (ur() ? o = !0 : n = !0);
  let d = dl() && ur() && !V0() ? new KeyboardEvent("keydown", {
    keyIdentifier: "Enter",
    metaKey: o,
    ctrlKey: n,
    altKey: l,
    shiftKey: s
  }) : new MouseEvent("click", {
    metaKey: o,
    ctrlKey: n,
    altKey: l,
    shiftKey: s,
    bubbles: !0,
    cancelable: !0
  });
  $r.isOpening = r, Gt(e), e.dispatchEvent(d), $r.isOpening = !1;
}
$r.isOpening = !1;
function $k(e, t) {
  if (e instanceof HTMLAnchorElement) t(e);
  else if (e.hasAttribute("data-href")) {
    let r = document.createElement("a");
    r.href = e.getAttribute("data-href"), e.hasAttribute("data-target") && (r.target = e.getAttribute("data-target")), e.hasAttribute("data-rel") && (r.rel = e.getAttribute("data-rel")), e.hasAttribute("data-download") && (r.download = e.getAttribute("data-download")), e.hasAttribute("data-ping") && (r.ping = e.getAttribute("data-ping")), e.hasAttribute("data-referrer-policy") && (r.referrerPolicy = e.getAttribute("data-referrer-policy")), e.appendChild(r), t(r), e.removeChild(r);
  }
}
function Ek(e, t) {
  $k(e, (r) => $r(r, t));
}
function U0(e) {
  let t = Ji();
  var r;
  const a = t.useHref((r = e == null ? void 0 : e.href) !== null && r !== void 0 ? r : "");
  return {
    href: e != null && e.href ? a : void 0,
    target: e == null ? void 0 : e.target,
    rel: e == null ? void 0 : e.rel,
    download: e == null ? void 0 : e.download,
    ping: e == null ? void 0 : e.ping,
    referrerPolicy: e == null ? void 0 : e.referrerPolicy
  };
}
let jr = /* @__PURE__ */ new Map(), un = /* @__PURE__ */ new Set();
function Js() {
  if (typeof window > "u") return;
  function e(a) {
    return "propertyName" in a;
  }
  let t = (a) => {
    if (!e(a) || !a.target) return;
    let i = jr.get(a.target);
    i || (i = /* @__PURE__ */ new Set(), jr.set(a.target, i), a.target.addEventListener("transitioncancel", r, {
      once: !0
    })), i.add(a.propertyName);
  }, r = (a) => {
    if (!e(a) || !a.target) return;
    let i = jr.get(a.target);
    if (i && (i.delete(a.propertyName), i.size === 0 && (a.target.removeEventListener("transitioncancel", r), jr.delete(a.target)), jr.size === 0)) {
      for (let o of un) o();
      un.clear();
    }
  };
  document.body.addEventListener("transitionrun", t), document.body.addEventListener("transitionend", r);
}
typeof document < "u" && (document.readyState !== "loading" ? Js() : document.addEventListener("DOMContentLoaded", Js));
function G0(e) {
  requestAnimationFrame(() => {
    jr.size === 0 ? e() : un.add(e);
  });
}
function Y0() {
  let e = B(/* @__PURE__ */ new Map()), t = ie((i, o, n, l) => {
    let s = l != null && l.once ? (...d) => {
      e.current.delete(n), n(...d);
    } : n;
    e.current.set(n, {
      type: o,
      eventTarget: i,
      fn: s,
      options: l
    }), i.addEventListener(o, s, l);
  }, []), r = ie((i, o, n, l) => {
    var s;
    let d = ((s = e.current.get(n)) === null || s === void 0 ? void 0 : s.fn) || n;
    i.removeEventListener(o, d, l), e.current.delete(n);
  }, []), a = ie(() => {
    e.current.forEach((i, o) => {
      r(i.eventTarget, i.type, o, i.options);
    });
  }, [
    r
  ]);
  return ee(() => a, [
    a
  ]), {
    addGlobalListener: t,
    removeGlobalListener: r,
    removeAllGlobalListeners: a
  };
}
function q0(e, t) {
  let { id: r, "aria-label": a, "aria-labelledby": i } = e;
  return r = dt(r), i && a ? i = [
    .../* @__PURE__ */ new Set([
      r,
      ...i.trim().split(/\s+/)
    ])
  ].join(" ") : i && (i = i.trim().split(/\s+/).join(" ")), !a && !i && t && (a = t), {
    id: r,
    "aria-label": a,
    "aria-labelledby": i
  };
}
function Et(e) {
  const t = B(null);
  return G(() => ({
    get current() {
      return t.current;
    },
    set current(r) {
      t.current = r, typeof e == "function" ? e(r) : e && (e.current = r);
    }
  }), [
    e
  ]);
}
function Qs(e, t) {
  const r = B(!0), a = B(null);
  fe(() => (r.current = !0, () => {
    r.current = !1;
  }), []), fe(() => {
    r.current ? r.current = !1 : (!a.current || t.some((i, o) => !Object.is(i, a[o]))) && e(), a.current = t;
  }, t);
}
function Pk() {
  return typeof window.ResizeObserver < "u";
}
function hn(e) {
  const { ref: t, box: r, onResize: a } = e;
  ee(() => {
    let i = t == null ? void 0 : t.current;
    if (i)
      if (Pk()) {
        const o = new window.ResizeObserver((n) => {
          n.length && a();
        });
        return o.observe(i, {
          box: r
        }), () => {
          i && o.unobserve(i);
        };
      } else
        return window.addEventListener("resize", a, !1), () => {
          window.removeEventListener("resize", a, !1);
        };
  }, [
    a,
    t,
    r
  ]);
}
function X0(e, t) {
  fe(() => {
    if (e && e.ref && t)
      return e.ref.current = t.current, () => {
        e.ref && (e.ref.current = null);
      };
  });
}
function Oa(e, t) {
  if (!e) return !1;
  let r = window.getComputedStyle(e), a = /(auto|scroll)/.test(r.overflow + r.overflowX + r.overflowY);
  return a && t && (a = e.scrollHeight !== e.clientHeight || e.scrollWidth !== e.clientWidth), a;
}
function Z0(e, t) {
  let r = e;
  for (Oa(r, t) && (r = r.parentElement); r && !Oa(r, t); ) r = r.parentElement;
  return r || document.scrollingElement || document.documentElement;
}
function Ck(e, t) {
  const r = [];
  for (; e && e !== document.documentElement; )
    Oa(e, t) && r.push(e), e = e.parentElement;
  return r;
}
let Tk = 0;
const Eo = /* @__PURE__ */ new Map();
function Ik(e) {
  let [t, r] = se();
  return fe(() => {
    if (!e) return;
    let a = Eo.get(e);
    if (a)
      r(a.element.id);
    else {
      let i = `react-aria-description-${Tk++}`;
      r(i);
      let o = document.createElement("div");
      o.id = i, o.style.display = "none", o.textContent = e, document.body.appendChild(o), a = {
        refCount: 0,
        element: o
      }, Eo.set(e, a);
    }
    return a.refCount++, () => {
      a && --a.refCount === 0 && (a.element.remove(), Eo.delete(e));
    };
  }, [
    e
  ]), {
    "aria-describedby": e ? t : void 0
  };
}
function li(e, t, r, a) {
  let i = je(r), o = r == null;
  ee(() => {
    if (o || !e.current) return;
    let n = e.current;
    return n.addEventListener(t, i, a), () => {
      n.removeEventListener(t, i, a);
    };
  }, [
    e,
    t,
    a,
    o,
    i
  ]);
}
function J0(e, t) {
  let r = ed(e, t, "left"), a = ed(e, t, "top"), i = t.offsetWidth, o = t.offsetHeight, n = e.scrollLeft, l = e.scrollTop, { borderTopWidth: s, borderLeftWidth: d, scrollPaddingTop: c, scrollPaddingRight: h, scrollPaddingBottom: u, scrollPaddingLeft: f } = getComputedStyle(e), g = n + parseInt(d, 10), v = l + parseInt(s, 10), b = g + e.clientWidth, m = v + e.clientHeight, x = parseInt(c, 10) || 0, S = parseInt(u, 10) || 0, T = parseInt(h, 10) || 0, k = parseInt(f, 10) || 0;
  r <= n + k ? n = r - parseInt(d, 10) - k : r + i > b - T && (n += r + i - b + T), a <= v + x ? l = a - parseInt(s, 10) - x : a + o > m - S && (l += a + o - m + S), e.scrollLeft = n, e.scrollTop = l;
}
function ed(e, t, r) {
  const a = r === "left" ? "offsetLeft" : "offsetTop";
  let i = 0;
  for (; t.offsetParent && (i += t[a], t.offsetParent !== e); ) {
    if (t.offsetParent.contains(e)) {
      i -= e[a];
      break;
    }
    t = t.offsetParent;
  }
  return i;
}
function td(e, t) {
  if (e && document.contains(e)) {
    let n = document.scrollingElement || document.documentElement;
    if (window.getComputedStyle(n).overflow === "hidden") {
      let s = Ck(e);
      for (let d of s) J0(d, e);
    } else {
      var r;
      let { left: s, top: d } = e.getBoundingClientRect();
      e == null || (r = e.scrollIntoView) === null || r === void 0 || r.call(e, {
        block: "nearest"
      });
      let { left: c, top: h } = e.getBoundingClientRect();
      if (Math.abs(s - c) > 1 || Math.abs(d - h) > 1) {
        var a, i, o;
        t == null || (i = t.containingElement) === null || i === void 0 || (a = i.scrollIntoView) === null || a === void 0 || a.call(i, {
          block: "center",
          inline: "center"
        }), (o = e.scrollIntoView) === null || o === void 0 || o.call(e, {
          block: "nearest"
        });
      }
    }
  }
}
function fn(e) {
  return e.mozInputSource === 0 && e.isTrusted ? !0 : cl() && e.pointerType ? e.type === "click" && e.buttons === 1 : e.detail === 0 && !e.pointerType;
}
function Rk(e) {
  return !cl() && e.width === 0 && e.height === 0 || e.width === 1 && e.height === 1 && e.pressure === 0 && e.detail === 0 && e.pointerType === "mouse";
}
function ul(e, t, r) {
  let a = B(t), i = je(() => {
    r && r(a.current);
  });
  ee(() => {
    var o;
    let n = e == null || (o = e.current) === null || o === void 0 ? void 0 : o.form;
    return n == null || n.addEventListener("reset", i), () => {
      n == null || n.removeEventListener("reset", i);
    };
  }, [
    e,
    i
  ]);
}
const Dk = "react-aria-clear-focus", Ak = "react-aria-focus", Q0 = "react-aria-update-activedescendant";
function Vr(e) {
  return ur() ? e.metaKey : e.ctrlKey;
}
function ef(e, t = !0) {
  let [r, a] = se(!0), i = r && t;
  return fe(() => {
    if (i && e.current && "getAnimations" in e.current)
      for (let o of e.current.getAnimations()) o instanceof CSSTransition && o.cancel();
  }, [
    e,
    i
  ]), rf(e, i, ie(() => a(!1), [])), i;
}
function tf(e, t) {
  let [r, a] = se(t ? "open" : "closed");
  switch (r) {
    case "open":
      t || a("exiting");
      break;
    case "closed":
    case "exiting":
      t && a("open");
      break;
  }
  let i = r === "exiting";
  return rf(e, i, ie(() => {
    a((o) => o === "exiting" ? "closed" : o);
  }, [])), i;
}
function rf(e, t, r) {
  fe(() => {
    if (t && e.current) {
      if (!("getAnimations" in e.current)) {
        r();
        return;
      }
      let a = e.current.getAnimations();
      if (a.length === 0) {
        r();
        return;
      }
      let i = !1;
      return Promise.all(a.map((o) => o.finished)).then(() => {
        i || nu(() => {
          r();
        });
      }).catch(() => {
      }), () => {
        i = !0;
      };
    }
  }, [
    e,
    t,
    r
  ]);
}
function Va(e, t, r) {
  let [a, i] = se(e || t), o = B(e !== void 0), n = e !== void 0;
  ee(() => {
    let d = o.current;
    d !== n && console.warn(`WARN: A component changed from ${d ? "controlled" : "uncontrolled"} to ${n ? "controlled" : "uncontrolled"}.`), o.current = n;
  }, [
    n
  ]);
  let l = n ? e : a, s = ie((d, ...c) => {
    let h = (u, ...f) => {
      r && (Object.is(l, u) || r(u, ...f)), n || (l = u);
    };
    typeof d == "function" ? (console.warn("We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320"), i((f, ...g) => {
      let v = d(n ? l : f, ...g);
      return h(v, ...c), n ? f : v;
    })) : (n || i(d), h(d, ...c));
  }, [
    n,
    l,
    r
  ]);
  return [
    l,
    s
  ];
}
function Fi(e, t = -1 / 0, r = 1 / 0) {
  return Math.min(Math.max(e, t), r);
}
let Ur = "default", gn = "", wi = /* @__PURE__ */ new WeakMap();
function rd(e) {
  if (Zi()) {
    if (Ur === "default") {
      const t = we(e);
      gn = t.documentElement.style.webkitUserSelect, t.documentElement.style.webkitUserSelect = "none";
    }
    Ur = "disabled";
  } else (e instanceof HTMLElement || e instanceof SVGElement) && (wi.set(e, e.style.userSelect), e.style.userSelect = "none");
}
function si(e) {
  if (Zi()) {
    if (Ur !== "disabled") return;
    Ur = "restoring", setTimeout(() => {
      G0(() => {
        if (Ur === "restoring") {
          const t = we(e);
          t.documentElement.style.webkitUserSelect === "none" && (t.documentElement.style.webkitUserSelect = gn || ""), gn = "", Ur = "default";
        }
      });
    }, 300);
  } else if ((e instanceof HTMLElement || e instanceof SVGElement) && e && wi.has(e)) {
    let t = wi.get(e);
    e.style.userSelect === "none" && (e.style.userSelect = t), e.getAttribute("style") === "" && e.removeAttribute("style"), wi.delete(e);
  }
}
const hl = z.createContext({
  register: () => {
  }
});
hl.displayName = "PressResponderContext";
function zk(e, t) {
  return t.get ? t.get.call(e) : t.value;
}
function af(e, t, r) {
  if (!t.has(e)) throw new TypeError("attempted to " + r + " private field on non-instance");
  return t.get(e);
}
function Ok(e, t) {
  var r = af(e, t, "get");
  return zk(e, r);
}
function Fk(e, t, r) {
  if (t.set) t.set.call(e, r);
  else {
    if (!t.writable)
      throw new TypeError("attempted to set read only private field");
    t.value = r;
  }
}
function ad(e, t, r) {
  var a = af(e, t, "set");
  return Fk(e, a, r), r;
}
function Nk(e) {
  let t = Q(hl);
  if (t) {
    let { register: r, ...a } = t;
    e = te(a, e), r();
  }
  return X0(t, e.ref), e;
}
var di = /* @__PURE__ */ new WeakMap();
class ci {
  continuePropagation() {
    ad(this, di, !1);
  }
  get shouldStopPropagation() {
    return Ok(this, di);
  }
  constructor(t, r, a, i) {
    _y(this, di, {
      writable: !0,
      value: void 0
    }), ad(this, di, !0);
    var o;
    let n = (o = i == null ? void 0 : i.target) !== null && o !== void 0 ? o : a.currentTarget;
    const l = n == null ? void 0 : n.getBoundingClientRect();
    let s, d = 0, c, h = null;
    a.clientX != null && a.clientY != null && (c = a.clientX, h = a.clientY), l && (c != null && h != null ? (s = c - l.left, d = h - l.top) : (s = l.width / 2, d = l.height / 2)), this.type = t, this.pointerType = r, this.target = a.currentTarget, this.shiftKey = a.shiftKey, this.metaKey = a.metaKey, this.ctrlKey = a.ctrlKey, this.altKey = a.altKey, this.x = s, this.y = d;
  }
}
const id = Symbol("linkClicked");
function Er(e) {
  let {
    onPress: t,
    onPressChange: r,
    onPressStart: a,
    onPressEnd: i,
    onPressUp: o,
    isDisabled: n,
    isPressed: l,
    preventFocusOnPress: s,
    shouldCancelOnPointerExit: d,
    allowTextSelectionOnPress: c,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref: h,
    ...u
  } = Nk(e), [f, g] = se(!1), v = B({
    isPressed: !1,
    ignoreEmulatedMouseEvents: !1,
    ignoreClickAfterPress: !1,
    didFirePressStart: !1,
    isTriggeringEvent: !1,
    activePointerId: null,
    target: null,
    isOverTarget: !1,
    pointerType: null
  }), { addGlobalListener: b, removeAllGlobalListeners: m } = Y0(), x = je((p, w) => {
    let I = v.current;
    if (n || I.didFirePressStart) return !1;
    let P = !0;
    if (I.isTriggeringEvent = !0, a) {
      let O = new ci("pressstart", w, p);
      a(O), P = O.shouldStopPropagation;
    }
    return r && r(!0), I.isTriggeringEvent = !1, I.didFirePressStart = !0, g(!0), P;
  }), S = je((p, w, I = !0) => {
    let P = v.current;
    if (!P.didFirePressStart) return !1;
    P.ignoreClickAfterPress = !0, P.didFirePressStart = !1, P.isTriggeringEvent = !0;
    let O = !0;
    if (i) {
      let _ = new ci("pressend", w, p);
      i(_), O = _.shouldStopPropagation;
    }
    if (r && r(!1), g(!1), t && I && !n) {
      let _ = new ci("press", w, p);
      t(_), O && (O = _.shouldStopPropagation);
    }
    return P.isTriggeringEvent = !1, O;
  }), T = je((p, w) => {
    let I = v.current;
    if (n) return !1;
    if (o) {
      I.isTriggeringEvent = !0;
      let P = new ci("pressup", w, p);
      return o(P), I.isTriggeringEvent = !1, P.shouldStopPropagation;
    }
    return !0;
  }), k = je((p) => {
    let w = v.current;
    w.isPressed && w.target && (w.isOverTarget && w.pointerType != null && S(Kt(w.target, p), w.pointerType, !1), w.isPressed = !1, w.isOverTarget = !1, w.activePointerId = null, w.pointerType = null, m(), c || si(w.target));
  }), $ = je((p) => {
    d && k(p);
  }), D = G(() => {
    let p = v.current, w = {
      onKeyDown(P) {
        if (Po(P.nativeEvent, P.currentTarget) && P.currentTarget.contains(P.target)) {
          var O;
          nd(P.target, P.key) && P.preventDefault();
          let _ = !0;
          if (!p.isPressed && !P.repeat) {
            p.target = P.currentTarget, p.isPressed = !0, _ = x(P, "keyboard");
            let E = P.currentTarget, F = (W) => {
              Po(W, E) && !W.repeat && E.contains(W.target) && p.target && T(Kt(p.target, W), "keyboard");
            };
            b(we(P.currentTarget), "keyup", wr(F, I), !0);
          }
          _ && P.stopPropagation(), P.metaKey && ur() && ((O = p.metaKeyEvents) === null || O === void 0 || O.set(P.key, P.nativeEvent));
        } else P.key === "Meta" && (p.metaKeyEvents = /* @__PURE__ */ new Map());
      },
      onClick(P) {
        if (!(P && !P.currentTarget.contains(P.target)) && P && P.button === 0 && !p.isTriggeringEvent && !$r.isOpening) {
          let O = !0;
          if (n && P.preventDefault(), !p.ignoreClickAfterPress && !p.ignoreEmulatedMouseEvents && !p.isPressed && (p.pointerType === "virtual" || fn(P.nativeEvent))) {
            !n && !s && Gt(P.currentTarget);
            let _ = x(P, "virtual"), E = T(P, "virtual"), F = S(P, "virtual");
            O = _ && E && F;
          }
          p.ignoreEmulatedMouseEvents = !1, p.ignoreClickAfterPress = !1, O && P.stopPropagation();
        }
      }
    }, I = (P) => {
      var O;
      if (p.isPressed && p.target && Po(P, p.target)) {
        var _;
        nd(P.target, P.key) && P.preventDefault();
        let F = P.target;
        S(Kt(p.target, P), "keyboard", p.target.contains(F)), m(), P.key !== "Enter" && fl(p.target) && p.target.contains(F) && !P[id] && (P[id] = !0, $r(p.target, P, !1)), p.isPressed = !1, (_ = p.metaKeyEvents) === null || _ === void 0 || _.delete(P.key);
      } else if (P.key === "Meta" && (!((O = p.metaKeyEvents) === null || O === void 0) && O.size)) {
        var E;
        let F = p.metaKeyEvents;
        p.metaKeyEvents = void 0;
        for (let W of F.values()) (E = p.target) === null || E === void 0 || E.dispatchEvent(new KeyboardEvent("keyup", W));
      }
    };
    if (typeof PointerEvent < "u") {
      w.onPointerDown = (E) => {
        if (E.button !== 0 || !E.currentTarget.contains(E.target)) return;
        if (Rk(E.nativeEvent)) {
          p.pointerType = "virtual";
          return;
        }
        To(E.currentTarget) && E.preventDefault(), p.pointerType = E.pointerType;
        let F = !0;
        if (!p.isPressed) {
          p.isPressed = !0, p.isOverTarget = !0, p.activePointerId = E.pointerId, p.target = E.currentTarget, !n && !s && Gt(E.currentTarget), c || rd(p.target), F = x(E, p.pointerType);
          let W = E.target;
          "releasePointerCapture" in W && W.releasePointerCapture(E.pointerId), b(we(E.currentTarget), "pointerup", P, !1), b(we(E.currentTarget), "pointercancel", _, !1);
        }
        F && E.stopPropagation();
      }, w.onMouseDown = (E) => {
        E.currentTarget.contains(E.target) && E.button === 0 && (To(E.currentTarget) && E.preventDefault(), E.stopPropagation());
      }, w.onPointerUp = (E) => {
        !E.currentTarget.contains(E.target) || p.pointerType === "virtual" || E.button === 0 && T(E, p.pointerType || E.pointerType);
      }, w.onPointerEnter = (E) => {
        E.pointerId === p.activePointerId && p.target && !p.isOverTarget && p.pointerType != null && (p.isOverTarget = !0, x(Kt(p.target, E), p.pointerType));
      }, w.onPointerLeave = (E) => {
        E.pointerId === p.activePointerId && p.target && p.isOverTarget && p.pointerType != null && (p.isOverTarget = !1, S(Kt(p.target, E), p.pointerType, !1), $(E));
      };
      let P = (E) => {
        E.pointerId === p.activePointerId && p.isPressed && E.button === 0 && p.target && (p.target.contains(E.target) && p.pointerType != null ? S(Kt(p.target, E), p.pointerType) : p.isOverTarget && p.pointerType != null && S(Kt(p.target, E), p.pointerType, !1), p.isPressed = !1, p.isOverTarget = !1, p.activePointerId = null, p.pointerType = null, m(), c || si(p.target), "ontouchend" in p.target && E.pointerType !== "mouse" && b(p.target, "touchend", O, {
          once: !0
        }));
      }, O = (E) => {
        of(E.currentTarget) && E.preventDefault();
      }, _ = (E) => {
        k(E);
      };
      w.onDragStart = (E) => {
        E.currentTarget.contains(E.target) && k(E);
      };
    } else {
      w.onMouseDown = (_) => {
        if (_.button !== 0 || !_.currentTarget.contains(_.target)) return;
        if (To(_.currentTarget) && _.preventDefault(), p.ignoreEmulatedMouseEvents) {
          _.stopPropagation();
          return;
        }
        p.isPressed = !0, p.isOverTarget = !0, p.target = _.currentTarget, p.pointerType = fn(_.nativeEvent) ? "virtual" : "mouse", !n && !s && Gt(_.currentTarget), x(_, p.pointerType) && _.stopPropagation(), b(we(_.currentTarget), "mouseup", P, !1);
      }, w.onMouseEnter = (_) => {
        if (!_.currentTarget.contains(_.target)) return;
        let E = !0;
        p.isPressed && !p.ignoreEmulatedMouseEvents && p.pointerType != null && (p.isOverTarget = !0, E = x(_, p.pointerType)), E && _.stopPropagation();
      }, w.onMouseLeave = (_) => {
        if (!_.currentTarget.contains(_.target)) return;
        let E = !0;
        p.isPressed && !p.ignoreEmulatedMouseEvents && p.pointerType != null && (p.isOverTarget = !1, E = S(_, p.pointerType, !1), $(_)), E && _.stopPropagation();
      }, w.onMouseUp = (_) => {
        _.currentTarget.contains(_.target) && !p.ignoreEmulatedMouseEvents && _.button === 0 && T(_, p.pointerType || "mouse");
      };
      let P = (_) => {
        if (_.button === 0) {
          if (p.isPressed = !1, m(), p.ignoreEmulatedMouseEvents) {
            p.ignoreEmulatedMouseEvents = !1;
            return;
          }
          p.target && Co(_, p.target) && p.pointerType != null ? S(Kt(p.target, _), p.pointerType) : p.target && p.isOverTarget && p.pointerType != null && S(Kt(p.target, _), p.pointerType, !1), p.isOverTarget = !1;
        }
      };
      w.onTouchStart = (_) => {
        if (!_.currentTarget.contains(_.target)) return;
        let E = Lk(_.nativeEvent);
        if (!E) return;
        p.activePointerId = E.identifier, p.ignoreEmulatedMouseEvents = !0, p.isOverTarget = !0, p.isPressed = !0, p.target = _.currentTarget, p.pointerType = "touch", !n && !s && Gt(_.currentTarget), c || rd(p.target), x(rr(p.target, _), p.pointerType) && _.stopPropagation(), b(yt(_.currentTarget), "scroll", O, !0);
      }, w.onTouchMove = (_) => {
        if (!_.currentTarget.contains(_.target)) return;
        if (!p.isPressed) {
          _.stopPropagation();
          return;
        }
        let E = od(_.nativeEvent, p.activePointerId), F = !0;
        E && Co(E, _.currentTarget) ? !p.isOverTarget && p.pointerType != null && (p.isOverTarget = !0, F = x(rr(p.target, _), p.pointerType)) : p.isOverTarget && p.pointerType != null && (p.isOverTarget = !1, F = S(rr(p.target, _), p.pointerType, !1), $(rr(p.target, _))), F && _.stopPropagation();
      }, w.onTouchEnd = (_) => {
        if (!_.currentTarget.contains(_.target)) return;
        if (!p.isPressed) {
          _.stopPropagation();
          return;
        }
        let E = od(_.nativeEvent, p.activePointerId), F = !0;
        E && Co(E, _.currentTarget) && p.pointerType != null ? (T(rr(p.target, _), p.pointerType), F = S(rr(p.target, _), p.pointerType)) : p.isOverTarget && p.pointerType != null && (F = S(rr(p.target, _), p.pointerType, !1)), F && _.stopPropagation(), p.isPressed = !1, p.activePointerId = null, p.isOverTarget = !1, p.ignoreEmulatedMouseEvents = !0, p.target && !c && si(p.target), m();
      }, w.onTouchCancel = (_) => {
        _.currentTarget.contains(_.target) && (_.stopPropagation(), p.isPressed && k(rr(p.target, _)));
      };
      let O = (_) => {
        p.isPressed && _.target.contains(p.target) && k({
          currentTarget: p.target,
          shiftKey: !1,
          ctrlKey: !1,
          metaKey: !1,
          altKey: !1
        });
      };
      w.onDragStart = (_) => {
        _.currentTarget.contains(_.target) && k(_);
      };
    }
    return w;
  }, [
    b,
    n,
    s,
    m,
    c,
    k,
    $,
    S,
    x,
    T
  ]);
  return ee(() => () => {
    var p;
    c || si((p = v.current.target) !== null && p !== void 0 ? p : void 0);
  }, [
    c
  ]), {
    isPressed: l || f,
    pressProps: te(u, D)
  };
}
function fl(e) {
  return e.tagName === "A" && e.hasAttribute("href");
}
function Po(e, t) {
  const { key: r, code: a } = e, i = t, o = i.getAttribute("role");
  return (r === "Enter" || r === " " || r === "Spacebar" || a === "Space") && !(i instanceof yt(i).HTMLInputElement && !nf(i, r) || i instanceof yt(i).HTMLTextAreaElement || i.isContentEditable) && // Links should only trigger with Enter key
  !((o === "link" || !o && fl(i)) && r !== "Enter");
}
function Lk(e) {
  const { targetTouches: t } = e;
  return t.length > 0 ? t[0] : null;
}
function od(e, t) {
  const r = e.changedTouches;
  for (let a = 0; a < r.length; a++) {
    const i = r[a];
    if (i.identifier === t) return i;
  }
  return null;
}
function rr(e, t) {
  let r = 0, a = 0;
  return t.targetTouches && t.targetTouches.length === 1 && (r = t.targetTouches[0].clientX, a = t.targetTouches[0].clientY), {
    currentTarget: e,
    shiftKey: t.shiftKey,
    ctrlKey: t.ctrlKey,
    metaKey: t.metaKey,
    altKey: t.altKey,
    clientX: r,
    clientY: a
  };
}
function Kt(e, t) {
  let r = t.clientX, a = t.clientY;
  return {
    currentTarget: e,
    shiftKey: t.shiftKey,
    ctrlKey: t.ctrlKey,
    metaKey: t.metaKey,
    altKey: t.altKey,
    clientX: r,
    clientY: a
  };
}
function Mk(e) {
  let t = 0, r = 0;
  return e.width !== void 0 ? t = e.width / 2 : e.radiusX !== void 0 && (t = e.radiusX), e.height !== void 0 ? r = e.height / 2 : e.radiusY !== void 0 && (r = e.radiusY), {
    top: e.clientY - r,
    right: e.clientX + t,
    bottom: e.clientY + r,
    left: e.clientX - t
  };
}
function Bk(e, t) {
  return !(e.left > t.right || t.left > e.right || e.top > t.bottom || t.top > e.bottom);
}
function Co(e, t) {
  let r = t.getBoundingClientRect(), a = Mk(e);
  return Bk(r, a);
}
function To(e) {
  return !(e instanceof HTMLElement) || !e.hasAttribute("draggable");
}
function of(e) {
  return e instanceof HTMLInputElement ? !1 : e instanceof HTMLButtonElement ? e.type !== "submit" && e.type !== "reset" : !fl(e);
}
function nd(e, t) {
  return e instanceof HTMLInputElement ? !nf(e, t) : of(e);
}
const Kk = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
function nf(e, t) {
  return e.type === "checkbox" || e.type === "radio" ? t === " " : Kk.has(e.type);
}
function Wk({ children: e }) {
  let t = G(() => ({
    register: () => {
    }
  }), []);
  return /* @__PURE__ */ z.createElement(hl.Provider, {
    value: t
  }, e);
}
class jk {
  isDefaultPrevented() {
    return this.nativeEvent.defaultPrevented;
  }
  preventDefault() {
    this.defaultPrevented = !0, this.nativeEvent.preventDefault();
  }
  stopPropagation() {
    this.nativeEvent.stopPropagation(), this.isPropagationStopped = () => !0;
  }
  isPropagationStopped() {
    return !1;
  }
  persist() {
  }
  constructor(t, r) {
    this.nativeEvent = r, this.target = r.target, this.currentTarget = r.currentTarget, this.relatedTarget = r.relatedTarget, this.bubbles = r.bubbles, this.cancelable = r.cancelable, this.defaultPrevented = r.defaultPrevented, this.eventPhase = r.eventPhase, this.isTrusted = r.isTrusted, this.timeStamp = r.timeStamp, this.type = t;
  }
}
function lf(e) {
  let t = B({
    isFocused: !1,
    observer: null
  });
  fe(() => {
    const a = t.current;
    return () => {
      a.observer && (a.observer.disconnect(), a.observer = null);
    };
  }, []);
  let r = je((a) => {
    e == null || e(a);
  });
  return ie((a) => {
    if (a.target instanceof HTMLButtonElement || a.target instanceof HTMLInputElement || a.target instanceof HTMLTextAreaElement || a.target instanceof HTMLSelectElement) {
      t.current.isFocused = !0;
      let i = a.target, o = (n) => {
        t.current.isFocused = !1, i.disabled && r(new jk("blur", n)), t.current.observer && (t.current.observer.disconnect(), t.current.observer = null);
      };
      i.addEventListener("focusout", o, {
        once: !0
      }), t.current.observer = new MutationObserver(() => {
        if (t.current.isFocused && i.disabled) {
          var n;
          (n = t.current.observer) === null || n === void 0 || n.disconnect();
          let l = i === document.activeElement ? null : document.activeElement;
          i.dispatchEvent(new FocusEvent("blur", {
            relatedTarget: l
          })), i.dispatchEvent(new FocusEvent("focusout", {
            bubbles: !0,
            relatedTarget: l
          }));
        }
      }), t.current.observer.observe(i, {
        attributes: !0,
        attributeFilter: [
          "disabled"
        ]
      });
    }
  }, [
    r
  ]);
}
function sf(e) {
  let { isDisabled: t, onFocus: r, onBlur: a, onFocusChange: i } = e;
  const o = ie((s) => {
    if (s.target === s.currentTarget)
      return a && a(s), i && i(!1), !0;
  }, [
    a,
    i
  ]), n = lf(o), l = ie((s) => {
    const d = we(s.target);
    s.target === s.currentTarget && d.activeElement === s.target && (r && r(s), i && i(!0), n(s));
  }, [
    i,
    r,
    n
  ]);
  return {
    focusProps: {
      onFocus: !t && (r || i || a) ? l : void 0,
      onBlur: !t && (a || i) ? o : void 0
    }
  };
}
let Ir = null, pn = /* @__PURE__ */ new Set(), Ta = /* @__PURE__ */ new Map(), Pr = !1, vn = !1;
const Vk = {
  Tab: !0,
  Escape: !0
};
function Qi(e, t) {
  for (let r of pn) r(e, t);
}
function Hk(e) {
  return !(e.metaKey || !ur() && e.altKey || e.ctrlKey || e.key === "Control" || e.key === "Shift" || e.key === "Meta");
}
function Ni(e) {
  Pr = !0, Hk(e) && (Ir = "keyboard", Qi("keyboard", e));
}
function mt(e) {
  Ir = "pointer", (e.type === "mousedown" || e.type === "pointerdown") && (Pr = !0, Qi("pointer", e));
}
function df(e) {
  fn(e) && (Pr = !0, Ir = "virtual");
}
function cf(e) {
  e.target === window || e.target === document || (!Pr && !vn && (Ir = "virtual", Qi("virtual", e)), Pr = !1, vn = !1);
}
function uf() {
  Pr = !1, vn = !0;
}
function mn(e) {
  if (typeof window > "u" || Ta.get(yt(e))) return;
  const t = yt(e), r = we(e);
  let a = t.HTMLElement.prototype.focus;
  t.HTMLElement.prototype.focus = function() {
    Pr = !0, a.apply(this, arguments);
  }, r.addEventListener("keydown", Ni, !0), r.addEventListener("keyup", Ni, !0), r.addEventListener("click", df, !0), t.addEventListener("focus", cf, !0), t.addEventListener("blur", uf, !1), typeof PointerEvent < "u" ? (r.addEventListener("pointerdown", mt, !0), r.addEventListener("pointermove", mt, !0), r.addEventListener("pointerup", mt, !0)) : (r.addEventListener("mousedown", mt, !0), r.addEventListener("mousemove", mt, !0), r.addEventListener("mouseup", mt, !0)), t.addEventListener("beforeunload", () => {
    hf(e);
  }, {
    once: !0
  }), Ta.set(t, {
    focus: a
  });
}
const hf = (e, t) => {
  const r = yt(e), a = we(e);
  t && a.removeEventListener("DOMContentLoaded", t), Ta.has(r) && (r.HTMLElement.prototype.focus = Ta.get(r).focus, a.removeEventListener("keydown", Ni, !0), a.removeEventListener("keyup", Ni, !0), a.removeEventListener("click", df, !0), r.removeEventListener("focus", cf, !0), r.removeEventListener("blur", uf, !1), typeof PointerEvent < "u" ? (a.removeEventListener("pointerdown", mt, !0), a.removeEventListener("pointermove", mt, !0), a.removeEventListener("pointerup", mt, !0)) : (a.removeEventListener("mousedown", mt, !0), a.removeEventListener("mousemove", mt, !0), a.removeEventListener("mouseup", mt, !0)), Ta.delete(r));
};
function Uk(e) {
  const t = we(e);
  let r;
  return t.readyState !== "loading" ? mn(e) : (r = () => {
    mn(e);
  }, t.addEventListener("DOMContentLoaded", r)), () => hf(e, r);
}
typeof document < "u" && Uk();
function Fa() {
  return Ir !== "pointer";
}
function Na() {
  return Ir;
}
function ff(e) {
  Ir = e, Qi(e, null);
}
const Gk = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
function Yk(e, t, r) {
  var a;
  const i = typeof window < "u" ? yt(r == null ? void 0 : r.target).HTMLInputElement : HTMLInputElement, o = typeof window < "u" ? yt(r == null ? void 0 : r.target).HTMLTextAreaElement : HTMLTextAreaElement, n = typeof window < "u" ? yt(r == null ? void 0 : r.target).HTMLElement : HTMLElement, l = typeof window < "u" ? yt(r == null ? void 0 : r.target).KeyboardEvent : KeyboardEvent;
  return e = e || (r == null ? void 0 : r.target) instanceof i && !Gk.has(r == null || (a = r.target) === null || a === void 0 ? void 0 : a.type) || (r == null ? void 0 : r.target) instanceof o || (r == null ? void 0 : r.target) instanceof n && (r == null ? void 0 : r.target.isContentEditable), !(e && t === "keyboard" && r instanceof l && !Vk[r.key]);
}
function qk(e, t, r) {
  mn(), ee(() => {
    let a = (i, o) => {
      Yk(!!(r != null && r.isTextInput), i, o) && e(Fa());
    };
    return pn.add(a), () => {
      pn.delete(a);
    };
  }, t);
}
function eo(e) {
  let { isDisabled: t, onBlurWithin: r, onFocusWithin: a, onFocusWithinChange: i } = e, o = B({
    isFocusWithin: !1
  }), n = ie((d) => {
    o.current.isFocusWithin && !d.currentTarget.contains(d.relatedTarget) && (o.current.isFocusWithin = !1, r && r(d), i && i(!1));
  }, [
    r,
    i,
    o
  ]), l = lf(n), s = ie((d) => {
    !o.current.isFocusWithin && document.activeElement === d.target && (a && a(d), i && i(!0), o.current.isFocusWithin = !0, l(d));
  }, [
    a,
    i,
    l
  ]);
  return t ? {
    focusWithinProps: {
      // These should not have been null, that would conflict in mergeProps
      onFocus: void 0,
      onBlur: void 0
    }
  } : {
    focusWithinProps: {
      onFocus: s,
      onBlur: n
    }
  };
}
let Li = !1, Io = 0;
function bn() {
  Li = !0, setTimeout(() => {
    Li = !1;
  }, 50);
}
function ld(e) {
  e.pointerType === "touch" && bn();
}
function Xk() {
  if (!(typeof document > "u"))
    return typeof PointerEvent < "u" ? document.addEventListener("pointerup", ld) : document.addEventListener("touchend", bn), Io++, () => {
      Io--, !(Io > 0) && (typeof PointerEvent < "u" ? document.removeEventListener("pointerup", ld) : document.removeEventListener("touchend", bn));
    };
}
function na(e) {
  let { onHoverStart: t, onHoverChange: r, onHoverEnd: a, isDisabled: i } = e, [o, n] = se(!1), l = B({
    isHovered: !1,
    ignoreEmulatedMouseEvents: !1,
    pointerType: "",
    target: null
  }).current;
  ee(Xk, []);
  let { hoverProps: s, triggerHoverEnd: d } = G(() => {
    let c = (f, g) => {
      if (l.pointerType = g, i || g === "touch" || l.isHovered || !f.currentTarget.contains(f.target)) return;
      l.isHovered = !0;
      let v = f.currentTarget;
      l.target = v, t && t({
        type: "hoverstart",
        target: v,
        pointerType: g
      }), r && r(!0), n(!0);
    }, h = (f, g) => {
      if (l.pointerType = "", l.target = null, g === "touch" || !l.isHovered) return;
      l.isHovered = !1;
      let v = f.currentTarget;
      a && a({
        type: "hoverend",
        target: v,
        pointerType: g
      }), r && r(!1), n(!1);
    }, u = {};
    return typeof PointerEvent < "u" ? (u.onPointerEnter = (f) => {
      Li && f.pointerType === "mouse" || c(f, f.pointerType);
    }, u.onPointerLeave = (f) => {
      !i && f.currentTarget.contains(f.target) && h(f, f.pointerType);
    }) : (u.onTouchStart = () => {
      l.ignoreEmulatedMouseEvents = !0;
    }, u.onMouseEnter = (f) => {
      !l.ignoreEmulatedMouseEvents && !Li && c(f, "mouse"), l.ignoreEmulatedMouseEvents = !1;
    }, u.onMouseLeave = (f) => {
      !i && f.currentTarget.contains(f.target) && h(f, "mouse");
    }), {
      hoverProps: u,
      triggerHoverEnd: h
    };
  }, [
    t,
    r,
    a,
    i,
    l
  ]);
  return ee(() => {
    i && d({
      currentTarget: l.target
    }, l.pointerType);
  }, [
    i
  ]), {
    hoverProps: s,
    isHovered: o
  };
}
function Zk(e) {
  let { ref: t, onInteractOutside: r, isDisabled: a, onInteractOutsideStart: i } = e, o = B({
    isPointerDown: !1,
    ignoreEmulatedMouseEvents: !1
  }), n = je((s) => {
    r && ui(s, t) && (i && i(s), o.current.isPointerDown = !0);
  }), l = je((s) => {
    r && r(s);
  });
  ee(() => {
    let s = o.current;
    if (a) return;
    const d = t.current, c = we(d);
    if (typeof PointerEvent < "u") {
      let h = (u) => {
        s.isPointerDown && ui(u, t) && l(u), s.isPointerDown = !1;
      };
      return c.addEventListener("pointerdown", n, !0), c.addEventListener("pointerup", h, !0), () => {
        c.removeEventListener("pointerdown", n, !0), c.removeEventListener("pointerup", h, !0);
      };
    } else {
      let h = (f) => {
        s.ignoreEmulatedMouseEvents ? s.ignoreEmulatedMouseEvents = !1 : s.isPointerDown && ui(f, t) && l(f), s.isPointerDown = !1;
      }, u = (f) => {
        s.ignoreEmulatedMouseEvents = !0, s.isPointerDown && ui(f, t) && l(f), s.isPointerDown = !1;
      };
      return c.addEventListener("mousedown", n, !0), c.addEventListener("mouseup", h, !0), c.addEventListener("touchstart", n, !0), c.addEventListener("touchend", u, !0), () => {
        c.removeEventListener("mousedown", n, !0), c.removeEventListener("mouseup", h, !0), c.removeEventListener("touchstart", n, !0), c.removeEventListener("touchend", u, !0);
      };
    }
  }, [
    t,
    a,
    n,
    l
  ]);
}
function ui(e, t) {
  if (e.button > 0) return !1;
  if (e.target) {
    const r = e.target.ownerDocument;
    if (!r || !r.documentElement.contains(e.target) || e.target.closest("[data-react-aria-top-layer]")) return !1;
  }
  return t.current && !t.current.contains(e.target);
}
function sd(e) {
  if (!e) return;
  let t = !0;
  return (r) => {
    let a = {
      ...r,
      preventDefault() {
        r.preventDefault();
      },
      isDefaultPrevented() {
        return r.isDefaultPrevented();
      },
      stopPropagation() {
        t ? console.error("stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.") : t = !0;
      },
      continuePropagation() {
        t = !1;
      },
      isPropagationStopped() {
        return t;
      }
    };
    e(a), t && r.stopPropagation();
  };
}
function Jk(e) {
  return {
    keyboardProps: e.isDisabled ? {} : {
      onKeyDown: sd(e.onKeyDown),
      onKeyUp: sd(e.onKeyUp)
    }
  };
}
const Qk = 500;
function gf(e) {
  let { isDisabled: t, onLongPressStart: r, onLongPressEnd: a, onLongPress: i, threshold: o = Qk, accessibilityDescription: n } = e;
  const l = B(void 0);
  let { addGlobalListener: s, removeGlobalListener: d } = Y0(), { pressProps: c } = Er({
    isDisabled: t,
    onPressStart(u) {
      if (u.continuePropagation(), (u.pointerType === "mouse" || u.pointerType === "touch") && (r && r({
        ...u,
        type: "longpressstart"
      }), l.current = setTimeout(() => {
        u.target.dispatchEvent(new PointerEvent("pointercancel", {
          bubbles: !0
        })), i && i({
          ...u,
          type: "longpress"
        }), l.current = void 0;
      }, o), u.pointerType === "touch")) {
        let f = (g) => {
          g.preventDefault();
        };
        s(u.target, "contextmenu", f, {
          once: !0
        }), s(window, "pointerup", () => {
          setTimeout(() => {
            d(u.target, "contextmenu", f);
          }, 30);
        }, {
          once: !0
        });
      }
    },
    onPressEnd(u) {
      l.current && clearTimeout(l.current), a && (u.pointerType === "mouse" || u.pointerType === "touch") && a({
        ...u,
        type: "longpressend"
      });
    }
  }), h = Ik(i && !t ? n : void 0);
  return {
    longPressProps: te(c, h)
  };
}
function La(e) {
  const t = we(e);
  if (Na() === "virtual") {
    let r = t.activeElement;
    G0(() => {
      t.activeElement === r && e.isConnected && Gt(e);
    });
  } else Gt(e);
}
function e_(e) {
  const t = yt(e);
  if (!(e instanceof t.HTMLElement) && !(e instanceof t.SVGElement)) return !1;
  let { display: r, visibility: a } = e.style, i = r !== "none" && a !== "hidden" && a !== "collapse";
  if (i) {
    const { getComputedStyle: o } = e.ownerDocument.defaultView;
    let { display: n, visibility: l } = o(e);
    i = n !== "none" && l !== "hidden" && l !== "collapse";
  }
  return i;
}
function t_(e, t) {
  return !e.hasAttribute("hidden") && // Ignore HiddenSelect when tree walking.
  !e.hasAttribute("data-react-aria-prevent-focus") && (e.nodeName === "DETAILS" && t && t.nodeName !== "SUMMARY" ? e.hasAttribute("open") : !0);
}
function pf(e, t) {
  return e.nodeName !== "#comment" && e_(e) && t_(e, t) && (!e.parentElement || pf(e.parentElement, e));
}
const dd = /* @__PURE__ */ z.createContext(null), yn = "react-aria-focus-scope-restore";
let Se = null;
function vf(e) {
  let { children: t, contain: r, restoreFocus: a, autoFocus: i } = e, o = B(null), n = B(null), l = B([]), { parentNode: s } = Q(dd) || {}, d = G(() => new kn({
    scopeRef: l
  }), [
    l
  ]);
  fe(() => {
    let u = s || ze.root;
    if (ze.getTreeNode(u.scopeRef) && Se && !Mi(Se, u.scopeRef)) {
      let f = ze.getTreeNode(Se);
      f && (u = f);
    }
    u.addChild(d), ze.addNode(d);
  }, [
    d,
    s
  ]), fe(() => {
    let u = ze.getTreeNode(l);
    u && (u.contain = !!r);
  }, [
    r
  ]), fe(() => {
    var u;
    let f = (u = o.current) === null || u === void 0 ? void 0 : u.nextSibling, g = [], v = (b) => b.stopPropagation();
    for (; f && f !== n.current; )
      g.push(f), f.addEventListener(yn, v), f = f.nextSibling;
    return l.current = g, () => {
      for (let b of g) b.removeEventListener(yn, v);
    };
  }, [
    t
  ]), s_(l, a, r), o_(l, r), d_(l, a, r), l_(l, i), ee(() => {
    const u = we(l.current ? l.current[0] : void 0).activeElement;
    let f = null;
    if (xt(u, l.current)) {
      for (let g of ze.traverse()) g.scopeRef && xt(u, g.scopeRef.current) && (f = g);
      f === ze.getTreeNode(l) && (Se = f.scopeRef);
    }
  }, [
    l
  ]), fe(() => () => {
    var u, f, g;
    let v = (g = (f = ze.getTreeNode(l)) === null || f === void 0 || (u = f.parent) === null || u === void 0 ? void 0 : u.scopeRef) !== null && g !== void 0 ? g : null;
    (l === Se || Mi(l, Se)) && (!v || ze.getTreeNode(v)) && (Se = v), ze.removeTreeNode(l);
  }, [
    l
  ]);
  let c = G(() => r_(l), []), h = G(() => ({
    focusManager: c,
    parentNode: d
  }), [
    d,
    c
  ]);
  return /* @__PURE__ */ z.createElement(dd.Provider, {
    value: h
  }, /* @__PURE__ */ z.createElement("span", {
    "data-focus-scope-start": !0,
    hidden: !0,
    ref: o
  }), t, /* @__PURE__ */ z.createElement("span", {
    "data-focus-scope-end": !0,
    hidden: !0,
    ref: n
  }));
}
function r_(e) {
  return {
    focusNext(t = {}) {
      let r = e.current, { from: a, tabbable: i, wrap: o, accept: n } = t, l = a || we(r[0]).activeElement, s = r[0].previousElementSibling, d = _r(r), c = qt(d, {
        tabbable: i,
        accept: n
      }, r);
      c.currentNode = xt(l, r) ? l : s;
      let h = c.nextNode();
      return !h && o && (c.currentNode = s, h = c.nextNode()), h && Yt(h, !0), h;
    },
    focusPrevious(t = {}) {
      let r = e.current, { from: a, tabbable: i, wrap: o, accept: n } = t, l = a || we(r[0]).activeElement, s = r[r.length - 1].nextElementSibling, d = _r(r), c = qt(d, {
        tabbable: i,
        accept: n
      }, r);
      c.currentNode = xt(l, r) ? l : s;
      let h = c.previousNode();
      return !h && o && (c.currentNode = s, h = c.previousNode()), h && Yt(h, !0), h;
    },
    focusFirst(t = {}) {
      let r = e.current, { tabbable: a, accept: i } = t, o = _r(r), n = qt(o, {
        tabbable: a,
        accept: i
      }, r);
      n.currentNode = r[0].previousElementSibling;
      let l = n.nextNode();
      return l && Yt(l, !0), l;
    },
    focusLast(t = {}) {
      let r = e.current, { tabbable: a, accept: i } = t, o = _r(r), n = qt(o, {
        tabbable: a,
        accept: i
      }, r);
      n.currentNode = r[r.length - 1].nextElementSibling;
      let l = n.previousNode();
      return l && Yt(l, !0), l;
    }
  };
}
const gl = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable^="false"])'
], a_ = gl.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])";
gl.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
const i_ = gl.join(':not([hidden]):not([tabindex="-1"]),');
function _r(e) {
  return e[0].parentElement;
}
function wa(e) {
  let t = ze.getTreeNode(Se);
  for (; t && t.scopeRef !== e; ) {
    if (t.contain) return !1;
    t = t.parent;
  }
  return !0;
}
function o_(e, t) {
  let r = B(void 0), a = B(void 0);
  fe(() => {
    let i = e.current;
    if (!t) {
      a.current && (cancelAnimationFrame(a.current), a.current = void 0);
      return;
    }
    const o = we(i ? i[0] : void 0);
    let n = (d) => {
      if (d.key !== "Tab" || d.altKey || d.ctrlKey || d.metaKey || !wa(e) || d.isComposing) return;
      let c = o.activeElement, h = e.current;
      if (!h || !xt(c, h)) return;
      let u = _r(h), f = qt(u, {
        tabbable: !0
      }, h);
      if (!c) return;
      f.currentNode = c;
      let g = d.shiftKey ? f.previousNode() : f.nextNode();
      g || (f.currentNode = d.shiftKey ? h[h.length - 1].nextElementSibling : h[0].previousElementSibling, g = d.shiftKey ? f.previousNode() : f.nextNode()), d.preventDefault(), g && Yt(g, !0);
    }, l = (d) => {
      (!Se || Mi(Se, e)) && xt(d.target, e.current) ? (Se = e, r.current = d.target) : wa(e) && !lr(d.target, e) ? r.current ? r.current.focus() : Se && Se.current && xn(Se.current) : wa(e) && (r.current = d.target);
    }, s = (d) => {
      a.current && cancelAnimationFrame(a.current), a.current = requestAnimationFrame(() => {
        let c = Na();
        if (!((c === "virtual" || c === null) && cl() && H0()) && o.activeElement && wa(e) && !lr(o.activeElement, e))
          if (Se = e, o.body.contains(d.target)) {
            var u;
            r.current = d.target, (u = r.current) === null || u === void 0 || u.focus();
          } else Se.current && xn(Se.current);
      });
    };
    return o.addEventListener("keydown", n, !1), o.addEventListener("focusin", l, !1), i == null || i.forEach((d) => d.addEventListener("focusin", l, !1)), i == null || i.forEach((d) => d.addEventListener("focusout", s, !1)), () => {
      o.removeEventListener("keydown", n, !1), o.removeEventListener("focusin", l, !1), i == null || i.forEach((d) => d.removeEventListener("focusin", l, !1)), i == null || i.forEach((d) => d.removeEventListener("focusout", s, !1));
    };
  }, [
    e,
    t
  ]), fe(() => () => {
    a.current && cancelAnimationFrame(a.current);
  }, [
    a
  ]);
}
function mf(e) {
  return lr(e);
}
function xt(e, t) {
  return !e || !t ? !1 : t.some((r) => r.contains(e));
}
function lr(e, t = null) {
  if (e instanceof Element && e.closest("[data-react-aria-top-layer]")) return !0;
  for (let { scopeRef: r } of ze.traverse(ze.getTreeNode(t)))
    if (r && xt(e, r.current)) return !0;
  return !1;
}
function n_(e) {
  return lr(e, Se);
}
function Mi(e, t) {
  var r;
  let a = (r = ze.getTreeNode(t)) === null || r === void 0 ? void 0 : r.parent;
  for (; a; ) {
    if (a.scopeRef === e) return !0;
    a = a.parent;
  }
  return !1;
}
function Yt(e, t = !1) {
  if (e != null && !t) try {
    La(e);
  } catch {
  }
  else if (e != null) try {
    e.focus();
  } catch {
  }
}
function bf(e, t = !0) {
  let r = e[0].previousElementSibling, a = _r(e), i = qt(a, {
    tabbable: t
  }, e);
  i.currentNode = r;
  let o = i.nextNode();
  return t && !o && (a = _r(e), i = qt(a, {
    tabbable: !1
  }, e), i.currentNode = r, o = i.nextNode()), o;
}
function xn(e, t = !0) {
  Yt(bf(e, t));
}
function l_(e, t) {
  const r = z.useRef(t);
  ee(() => {
    if (r.current) {
      Se = e;
      const a = we(e.current ? e.current[0] : void 0);
      !xt(a.activeElement, Se.current) && e.current && xn(e.current);
    }
    r.current = !1;
  }, [
    e
  ]);
}
function s_(e, t, r) {
  fe(() => {
    if (t || r) return;
    let a = e.current;
    const i = we(a ? a[0] : void 0);
    let o = (n) => {
      let l = n.target;
      xt(l, e.current) ? Se = e : mf(l) || (Se = null);
    };
    return i.addEventListener("focusin", o, !1), a == null || a.forEach((n) => n.addEventListener("focusin", o, !1)), () => {
      i.removeEventListener("focusin", o, !1), a == null || a.forEach((n) => n.removeEventListener("focusin", o, !1));
    };
  }, [
    e,
    t,
    r
  ]);
}
function cd(e) {
  let t = ze.getTreeNode(Se);
  for (; t && t.scopeRef !== e; ) {
    if (t.nodeToRestore) return !1;
    t = t.parent;
  }
  return (t == null ? void 0 : t.scopeRef) === e;
}
function d_(e, t, r) {
  const a = B(typeof document < "u" ? we(e.current ? e.current[0] : void 0).activeElement : null);
  fe(() => {
    let i = e.current;
    const o = we(i ? i[0] : void 0);
    if (!t || r) return;
    let n = () => {
      (!Se || Mi(Se, e)) && xt(o.activeElement, e.current) && (Se = e);
    };
    return o.addEventListener("focusin", n, !1), i == null || i.forEach((l) => l.addEventListener("focusin", n, !1)), () => {
      o.removeEventListener("focusin", n, !1), i == null || i.forEach((l) => l.removeEventListener("focusin", n, !1));
    };
  }, [
    e,
    r
  ]), fe(() => {
    const i = we(e.current ? e.current[0] : void 0);
    if (!t) return;
    let o = (n) => {
      if (n.key !== "Tab" || n.altKey || n.ctrlKey || n.metaKey || !wa(e) || n.isComposing) return;
      let l = i.activeElement;
      if (!lr(l, e) || !cd(e)) return;
      let s = ze.getTreeNode(e);
      if (!s) return;
      let d = s.nodeToRestore, c = qt(i.body, {
        tabbable: !0
      });
      c.currentNode = l;
      let h = n.shiftKey ? c.previousNode() : c.nextNode();
      if ((!d || !i.body.contains(d) || d === i.body) && (d = void 0, s.nodeToRestore = void 0), (!h || !lr(h, e)) && d) {
        c.currentNode = d;
        do
          h = n.shiftKey ? c.previousNode() : c.nextNode();
        while (lr(h, e));
        n.preventDefault(), n.stopPropagation(), h ? Yt(h, !0) : mf(d) ? Yt(d, !0) : l.blur();
      }
    };
    return r || i.addEventListener("keydown", o, !0), () => {
      r || i.removeEventListener("keydown", o, !0);
    };
  }, [
    e,
    t,
    r
  ]), fe(() => {
    const i = we(e.current ? e.current[0] : void 0);
    if (!t) return;
    let o = ze.getTreeNode(e);
    if (o) {
      var n;
      return o.nodeToRestore = (n = a.current) !== null && n !== void 0 ? n : void 0, () => {
        let l = ze.getTreeNode(e);
        if (!l) return;
        let s = l.nodeToRestore;
        if (t && s && (i.activeElement && lr(i.activeElement, e) || i.activeElement === i.body && cd(e))) {
          let d = ze.clone();
          requestAnimationFrame(() => {
            if (i.activeElement === i.body) {
              let c = d.getTreeNode(e);
              for (; c; ) {
                if (c.nodeToRestore && c.nodeToRestore.isConnected) {
                  ud(c.nodeToRestore);
                  return;
                }
                c = c.parent;
              }
              for (c = d.getTreeNode(e); c; ) {
                if (c.scopeRef && c.scopeRef.current && ze.getTreeNode(c.scopeRef)) {
                  let h = bf(c.scopeRef.current, !0);
                  ud(h);
                  return;
                }
                c = c.parent;
              }
            }
          });
        }
      };
    }
  }, [
    e,
    t
  ]);
}
function ud(e) {
  e.dispatchEvent(new CustomEvent(yn, {
    bubbles: !0,
    cancelable: !0
  })) && Yt(e);
}
function qt(e, t, r) {
  let a = t != null && t.tabbable ? i_ : a_, i = we(e).createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode(o) {
      var n;
      return !(t == null || (n = t.from) === null || n === void 0) && n.contains(o) ? NodeFilter.FILTER_REJECT : o.matches(a) && pf(o) && (!r || xt(o, r)) && (!(t != null && t.accept) || t.accept(o)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  return t != null && t.from && (i.currentNode = t.from), i;
}
class pl {
  get size() {
    return this.fastMap.size;
  }
  getTreeNode(t) {
    return this.fastMap.get(t);
  }
  addTreeNode(t, r, a) {
    let i = this.fastMap.get(r ?? null);
    if (!i) return;
    let o = new kn({
      scopeRef: t
    });
    i.addChild(o), o.parent = i, this.fastMap.set(t, o), a && (o.nodeToRestore = a);
  }
  addNode(t) {
    this.fastMap.set(t.scopeRef, t);
  }
  removeTreeNode(t) {
    if (t === null) return;
    let r = this.fastMap.get(t);
    if (!r) return;
    let a = r.parent;
    for (let o of this.traverse()) o !== r && r.nodeToRestore && o.nodeToRestore && r.scopeRef && r.scopeRef.current && xt(o.nodeToRestore, r.scopeRef.current) && (o.nodeToRestore = r.nodeToRestore);
    let i = r.children;
    a && (a.removeChild(r), i.size > 0 && i.forEach((o) => a && a.addChild(o))), this.fastMap.delete(r.scopeRef);
  }
  // Pre Order Depth First
  *traverse(t = this.root) {
    if (t.scopeRef != null && (yield t), t.children.size > 0) for (let r of t.children) yield* this.traverse(r);
  }
  clone() {
    var t;
    let r = new pl();
    var a;
    for (let i of this.traverse()) r.addTreeNode(i.scopeRef, (a = (t = i.parent) === null || t === void 0 ? void 0 : t.scopeRef) !== null && a !== void 0 ? a : null, i.nodeToRestore);
    return r;
  }
  constructor() {
    this.fastMap = /* @__PURE__ */ new Map(), this.root = new kn({
      scopeRef: null
    }), this.fastMap.set(null, this.root);
  }
}
class kn {
  addChild(t) {
    this.children.add(t), t.parent = this;
  }
  removeChild(t) {
    this.children.delete(t), t.parent = void 0;
  }
  constructor(t) {
    this.children = /* @__PURE__ */ new Set(), this.contain = !1, this.scopeRef = t.scopeRef;
  }
}
let ze = new pl();
function Ha(e = {}) {
  let { autoFocus: t = !1, isTextInput: r, within: a } = e, i = B({
    isFocused: !1,
    isFocusVisible: t || Fa()
  }), [o, n] = se(!1), [l, s] = se(() => i.current.isFocused && i.current.isFocusVisible), d = ie(() => s(i.current.isFocused && i.current.isFocusVisible), []), c = ie((f) => {
    i.current.isFocused = f, n(f), d();
  }, [
    d
  ]);
  qk((f) => {
    i.current.isFocusVisible = f, d();
  }, [], {
    isTextInput: r
  });
  let { focusProps: h } = sf({
    isDisabled: a,
    onFocusChange: c
  }), { focusWithinProps: u } = eo({
    isDisabled: !a,
    onFocusWithinChange: c
  });
  return {
    isFocused: o,
    isFocusVisible: l,
    focusProps: a ? u : h
  };
}
let yf = /* @__PURE__ */ z.createContext(null);
function c_(e) {
  let t = Q(yf) || {};
  X0(t, e);
  let { ref: r, ...a } = t;
  return a;
}
const u_ = /* @__PURE__ */ z.forwardRef(function(t, r) {
  let { children: a, ...i } = t, o = Et(r), n = {
    ...i,
    ref: o
  };
  return /* @__PURE__ */ z.createElement(yf.Provider, {
    value: n
  }, a);
});
function la(e, t) {
  let { focusProps: r } = sf(e), { keyboardProps: a } = Jk(e), i = te(r, a), o = c_(t), n = e.isDisabled ? {} : o, l = B(e.autoFocus);
  return ee(() => {
    l.current && t.current && La(t.current), l.current = !1;
  }, [
    t
  ]), {
    focusableProps: te({
      ...i,
      tabIndex: e.excludeFromTabOrder && !e.isDisabled ? -1 : void 0
    }, n)
  };
}
function h_(e, t) {
  let {
    elementType: r = "a",
    onPress: a,
    onPressStart: i,
    onPressEnd: o,
    // @ts-ignore
    onClick: n,
    isDisabled: l,
    ...s
  } = e, d = {};
  r !== "a" && (d = {
    role: "link",
    tabIndex: l ? void 0 : 0
  });
  let { focusableProps: c } = la(e, t), { pressProps: h, isPressed: u } = Er({
    onPress: a,
    onPressStart: i,
    onPressEnd: o,
    isDisabled: l,
    ref: t
  }), f = Qe(s, {
    labelable: !0
  }), g = te(c, h), v = Ji(), b = U0(e);
  return {
    isPressed: u,
    linkProps: te(f, b, {
      ...g,
      ...d,
      "aria-disabled": l || void 0,
      "aria-current": e["aria-current"],
      onClick: (m) => {
        var x;
        (x = h.onClick) === null || x === void 0 || x.call(h, m), n && (n(m), console.warn("onClick is deprecated, please use onPress")), !v.isNative && m.currentTarget instanceof HTMLAnchorElement && m.currentTarget.href && // If props are applied to a router Link component, it may have already prevented default.
        !m.isDefaultPrevented() && wk(m.currentTarget, m) && e.href && (m.preventDefault(), v.open(m.currentTarget, m, e.href, e.routerOptions));
      }
    })
  };
}
const f_ = /* @__PURE__ */ new Set([
  "Arab",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr"
]), g_ = /* @__PURE__ */ new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi"
]);
function p_(e) {
  if (Intl.Locale) {
    let r = new Intl.Locale(e).maximize(), a = typeof r.getTextInfo == "function" ? r.getTextInfo() : r.textInfo;
    if (a) return a.direction === "rtl";
    if (r.script) return f_.has(r.script);
  }
  let t = e.split("-")[0];
  return g_.has(t);
}
const v_ = Symbol.for("react-aria.i18n.locale");
function xf() {
  let e = typeof window < "u" && window[v_] || typeof navigator < "u" && (navigator.language || navigator.userLanguage) || "en-US";
  try {
    Intl.DateTimeFormat.supportedLocalesOf([
      e
    ]);
  } catch {
    e = "en-US";
  }
  return {
    locale: e,
    direction: p_(e) ? "rtl" : "ltr"
  };
}
let _n = xf(), $a = /* @__PURE__ */ new Set();
function hd() {
  _n = xf();
  for (let e of $a) e(_n);
}
function m_() {
  let e = Tr(), [t, r] = se(_n);
  return ee(() => ($a.size === 0 && window.addEventListener("languagechange", hd), $a.add(r), () => {
    $a.delete(r), $a.size === 0 && window.removeEventListener("languagechange", hd);
  }), []), e ? {
    locale: "en-US",
    direction: "ltr"
  } : t;
}
const b_ = /* @__PURE__ */ z.createContext(null);
function sa() {
  let e = m_();
  return Q(b_) || e;
}
const y_ = Symbol.for("react-aria.i18n.locale"), x_ = Symbol.for("react-aria.i18n.strings");
let Kr;
class to {
  /** Returns a localized string for the given key and locale. */
  getStringForLocale(t, r) {
    let i = this.getStringsForLocale(r)[t];
    if (!i) throw new Error(`Could not find intl message ${t} in ${r} locale`);
    return i;
  }
  /** Returns all localized strings for the given locale. */
  getStringsForLocale(t) {
    let r = this.strings[t];
    return r || (r = k_(t, this.strings, this.defaultLocale), this.strings[t] = r), r;
  }
  static getGlobalDictionaryForPackage(t) {
    if (typeof window > "u") return null;
    let r = window[y_];
    if (Kr === void 0) {
      let i = window[x_];
      if (!i) return null;
      Kr = {};
      for (let o in i) Kr[o] = new to({
        [r]: i[o]
      }, r);
    }
    let a = Kr == null ? void 0 : Kr[t];
    if (!a) throw new Error(`Strings for package "${t}" were not included by LocalizedStringProvider. Please add it to the list passed to createLocalizedStringDictionary.`);
    return a;
  }
  constructor(t, r = "en-US") {
    this.strings = Object.fromEntries(Object.entries(t).filter(([, a]) => a)), this.defaultLocale = r;
  }
}
function k_(e, t, r = "en-US") {
  if (t[e]) return t[e];
  let a = __(e);
  if (t[a]) return t[a];
  for (let i in t)
    if (i.startsWith(a + "-")) return t[i];
  return t[r];
}
function __(e) {
  return Intl.Locale ? new Intl.Locale(e).language : e.split("-")[0];
}
const fd = /* @__PURE__ */ new Map(), gd = /* @__PURE__ */ new Map();
class S_ {
  /** Formats a localized string for the given key with the provided variables. */
  format(t, r) {
    let a = this.strings.getStringForLocale(t, this.locale);
    return typeof a == "function" ? a(r, this) : a;
  }
  plural(t, r, a = "cardinal") {
    let i = r["=" + t];
    if (i) return typeof i == "function" ? i() : i;
    let o = this.locale + ":" + a, n = fd.get(o);
    n || (n = new Intl.PluralRules(this.locale, {
      type: a
    }), fd.set(o, n));
    let l = n.select(t);
    return i = r[l] || r.other, typeof i == "function" ? i() : i;
  }
  number(t) {
    let r = gd.get(this.locale);
    return r || (r = new Intl.NumberFormat(this.locale), gd.set(this.locale, r)), r.format(t);
  }
  select(t, r) {
    let a = t[r] || t.other;
    return typeof a == "function" ? a() : a;
  }
  constructor(t, r) {
    this.locale = t, this.strings = r;
  }
}
const pd = /* @__PURE__ */ new WeakMap();
function w_(e) {
  let t = pd.get(e);
  return t || (t = new to(e), pd.set(e, t)), t;
}
function $_(e, t) {
  return t && to.getGlobalDictionaryForPackage(t) || w_(e);
}
function vl(e, t) {
  let { locale: r } = sa(), a = $_(e, t);
  return G(() => new S_(r, a), [
    r,
    a
  ]);
}
function E_(e = {}) {
  let { locale: t } = sa();
  return G(() => new r2(t, e), [
    t,
    e
  ]);
}
let Ro = /* @__PURE__ */ new Map();
function ml(e) {
  let { locale: t } = sa(), r = t + (e ? Object.entries(e).sort((i, o) => i[0] < o[0] ? -1 : 1).join() : "");
  if (Ro.has(r)) return Ro.get(r);
  let a = new Intl.Collator(t, e);
  return Ro.set(r, a), a;
}
function kf(e, t) {
  let {
    elementType: r = "button",
    isDisabled: a,
    onPress: i,
    onPressStart: o,
    onPressEnd: n,
    onPressUp: l,
    onPressChange: s,
    preventFocusOnPress: d,
    allowFocusWhenDisabled: c,
    // @ts-ignore
    onClick: h,
    href: u,
    target: f,
    rel: g,
    type: v = "button"
  } = e, b;
  r === "button" ? b = {
    type: v,
    disabled: a
  } : b = {
    role: "button",
    tabIndex: a ? void 0 : 0,
    href: r === "a" && !a ? u : void 0,
    target: r === "a" ? f : void 0,
    type: r === "input" ? v : void 0,
    disabled: r === "input" ? a : void 0,
    "aria-disabled": !a || r === "input" ? void 0 : a,
    rel: r === "a" ? g : void 0
  };
  let { pressProps: m, isPressed: x } = Er({
    onPressStart: o,
    onPressEnd: n,
    onPressChange: s,
    onPress: i,
    onPressUp: l,
    isDisabled: a,
    preventFocusOnPress: d,
    ref: t
  }), { focusableProps: S } = la(e, t);
  c && (S.tabIndex = a ? -1 : S.tabIndex);
  let T = te(S, m, Qe(e, {
    labelable: !0
  }));
  return {
    isPressed: x,
    buttonProps: te(b, T, {
      "aria-haspopup": e["aria-haspopup"],
      "aria-expanded": e["aria-expanded"],
      "aria-controls": e["aria-controls"],
      "aria-pressed": e["aria-pressed"],
      onClick: (k) => {
        h && (h(k), console.warn("onClick is deprecated, please use onPress"));
      }
    })
  };
}
const _f = 7e3;
let Rt = null;
function vd(e, t = "assertive", r = _f) {
  Rt ? Rt.announce(e, t, r) : (Rt = new P_(), (typeof IS_REACT_ACT_ENVIRONMENT == "boolean" ? IS_REACT_ACT_ENVIRONMENT : typeof jest < "u") ? Rt.announce(e, t, r) : setTimeout(() => {
    Rt != null && Rt.isAttached() && (Rt == null || Rt.announce(e, t, r));
  }, 100));
}
class P_ {
  isAttached() {
    var t;
    return (t = this.node) === null || t === void 0 ? void 0 : t.isConnected;
  }
  createLog(t) {
    let r = document.createElement("div");
    return r.setAttribute("role", "log"), r.setAttribute("aria-live", t), r.setAttribute("aria-relevant", "additions"), r;
  }
  destroy() {
    this.node && (document.body.removeChild(this.node), this.node = null);
  }
  announce(t, r = "assertive", a = _f) {
    var i, o;
    if (!this.node) return;
    let n = document.createElement("div");
    typeof t == "object" ? (n.setAttribute("role", "img"), n.setAttribute("aria-labelledby", t["aria-labelledby"])) : n.textContent = t, r === "assertive" ? (i = this.assertiveLog) === null || i === void 0 || i.appendChild(n) : (o = this.politeLog) === null || o === void 0 || o.appendChild(n), t !== "" && setTimeout(() => {
      n.remove();
    }, a);
  }
  clear(t) {
    this.node && ((!t || t === "assertive") && this.assertiveLog && (this.assertiveLog.innerHTML = ""), (!t || t === "polite") && this.politeLog && (this.politeLog.innerHTML = ""));
  }
  constructor() {
    this.node = null, this.assertiveLog = null, this.politeLog = null, typeof document < "u" && (this.node = document.createElement("div"), this.node.dataset.liveAnnouncer = "true", Object.assign(this.node.style, {
      border: 0,
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap"
    }), this.assertiveLog = this.createLog("assertive"), this.node.appendChild(this.assertiveLog), this.politeLog = this.createLog("polite"), this.node.appendChild(this.politeLog), document.body.prepend(this.node));
  }
}
const Sf = {
  badInput: !1,
  customError: !1,
  patternMismatch: !1,
  rangeOverflow: !1,
  rangeUnderflow: !1,
  stepMismatch: !1,
  tooLong: !1,
  tooShort: !1,
  typeMismatch: !1,
  valueMissing: !1,
  valid: !0
}, wf = {
  ...Sf,
  customError: !0,
  valid: !1
}, ba = {
  isInvalid: !1,
  validationDetails: Sf,
  validationErrors: []
}, C_ = ae({}), Sn = "__formValidationState" + Date.now();
function bl(e) {
  if (e[Sn]) {
    let { realtimeValidation: t, displayValidation: r, updateValidation: a, resetValidation: i, commitValidation: o } = e[Sn];
    return {
      realtimeValidation: t,
      displayValidation: r,
      updateValidation: a,
      resetValidation: i,
      commitValidation: o
    };
  }
  return T_(e);
}
function T_(e) {
  let { isInvalid: t, validationState: r, name: a, value: i, builtinValidation: o, validate: n, validationBehavior: l = "aria" } = e;
  r && (t || (t = r === "invalid"));
  let s = t !== void 0 ? {
    isInvalid: t,
    validationErrors: [],
    validationDetails: wf
  } : null, d = G(() => {
    if (!n || i == null) return null;
    let I = I_(n, i);
    return md(I);
  }, [
    n,
    i
  ]);
  o != null && o.validationDetails.valid && (o = void 0);
  let c = Q(C_), h = G(() => a ? Array.isArray(a) ? a.flatMap((I) => wn(c[I])) : wn(c[a]) : [], [
    c,
    a
  ]), [u, f] = se(c), [g, v] = se(!1);
  c !== u && (f(c), v(!1));
  let b = G(() => md(g ? [] : h), [
    g,
    h
  ]), m = B(ba), [x, S] = se(ba), T = B(ba), k = () => {
    if (!$) return;
    D(!1);
    let I = d || o || m.current;
    Do(I, T.current) || (T.current = I, S(I));
  }, [$, D] = se(!1);
  return ee(k), {
    realtimeValidation: s || b || d || o || ba,
    displayValidation: l === "native" ? s || b || x : s || b || d || o || x,
    updateValidation(I) {
      l === "aria" && !Do(x, I) ? S(I) : m.current = I;
    },
    resetValidation() {
      let I = ba;
      Do(I, T.current) || (T.current = I, S(I)), l === "native" && D(!1), v(!0);
    },
    commitValidation() {
      l === "native" && D(!0), v(!0);
    }
  };
}
function wn(e) {
  return e ? Array.isArray(e) ? e : [
    e
  ] : [];
}
function I_(e, t) {
  if (typeof e == "function") {
    let r = e(t);
    if (r && typeof r != "boolean") return wn(r);
  }
  return [];
}
function md(e) {
  return e.length ? {
    isInvalid: !0,
    validationErrors: e,
    validationDetails: wf
  } : null;
}
function Do(e, t) {
  return e === t ? !0 : !!e && !!t && e.isInvalid === t.isInvalid && e.validationErrors.length === t.validationErrors.length && e.validationErrors.every((r, a) => r === t.validationErrors[a]) && Object.entries(e.validationDetails).every(([r, a]) => t.validationDetails[r] === a);
}
function yl(e, t, r) {
  let { validationBehavior: a, focus: i } = e;
  fe(() => {
    if (a === "native" && (r != null && r.current) && !r.current.disabled) {
      let s = t.realtimeValidation.isInvalid ? t.realtimeValidation.validationErrors.join(" ") || "Invalid value." : "";
      r.current.setCustomValidity(s), r.current.hasAttribute("title") || (r.current.title = ""), t.realtimeValidation.isInvalid || t.updateValidation(D_(r.current));
    }
  });
  let o = je(() => {
    t.resetValidation();
  }), n = je((s) => {
    var d;
    t.displayValidation.isInvalid || t.commitValidation();
    let c = r == null || (d = r.current) === null || d === void 0 ? void 0 : d.form;
    if (!s.defaultPrevented && r && c && A_(c) === r.current) {
      var h;
      i ? i() : (h = r.current) === null || h === void 0 || h.focus(), ff("keyboard");
    }
    s.preventDefault();
  }), l = je(() => {
    t.commitValidation();
  });
  ee(() => {
    let s = r == null ? void 0 : r.current;
    if (!s) return;
    let d = s.form;
    return s.addEventListener("invalid", n), s.addEventListener("change", l), d == null || d.addEventListener("reset", o), () => {
      s.removeEventListener("invalid", n), s.removeEventListener("change", l), d == null || d.removeEventListener("reset", o);
    };
  }, [
    r,
    n,
    l,
    o,
    a
  ]);
}
function R_(e) {
  let t = e.validity;
  return {
    badInput: t.badInput,
    customError: t.customError,
    patternMismatch: t.patternMismatch,
    rangeOverflow: t.rangeOverflow,
    rangeUnderflow: t.rangeUnderflow,
    stepMismatch: t.stepMismatch,
    tooLong: t.tooLong,
    tooShort: t.tooShort,
    typeMismatch: t.typeMismatch,
    valueMissing: t.valueMissing,
    valid: t.valid
  };
}
function D_(e) {
  return {
    isInvalid: !e.validity.valid,
    validationDetails: R_(e),
    validationErrors: e.validationMessage ? [
      e.validationMessage
    ] : []
  };
}
function A_(e) {
  for (let t = 0; t < e.elements.length; t++) {
    let r = e.elements[t];
    if (!r.validity.valid) return r;
  }
  return null;
}
function z_(e, t, r) {
  let { isDisabled: a = !1, isReadOnly: i = !1, value: o, name: n, children: l, "aria-label": s, "aria-labelledby": d, validationState: c = "valid", isInvalid: h } = e, u = ($) => {
    $.stopPropagation(), t.setSelected($.target.checked);
  }, f = l != null, g = s != null || d != null;
  !f && !g && console.warn("If you do not provide children, you must specify an aria-label for accessibility");
  let { pressProps: v, isPressed: b } = Er({
    isDisabled: a
  }), { pressProps: m, isPressed: x } = Er({
    isDisabled: a || i,
    onPress() {
      t.toggle();
    }
  }), { focusableProps: S } = la(e, r), T = te(v, S), k = Qe(e, {
    labelable: !0
  });
  return ul(r, t.isSelected, t.setSelected), {
    labelProps: te(m, {
      onClick: ($) => $.preventDefault()
    }),
    inputProps: te(k, {
      "aria-invalid": h || c === "invalid" || void 0,
      "aria-errormessage": e["aria-errormessage"],
      "aria-controls": e["aria-controls"],
      "aria-readonly": i || void 0,
      onChange: u,
      disabled: a,
      ...o == null ? {} : {
        value: o
      },
      name: n,
      type: "checkbox",
      ...T
    }),
    isSelected: t.isSelected,
    isPressed: b || x,
    isDisabled: a,
    isReadOnly: i,
    isInvalid: h || c === "invalid"
  };
}
function O_(e, t, r) {
  let a = bl({
    ...e,
    value: t.isSelected
  }), { isInvalid: i, validationErrors: o, validationDetails: n } = a.displayValidation, { labelProps: l, inputProps: s, isSelected: d, isPressed: c, isDisabled: h, isReadOnly: u } = z_({
    ...e,
    isInvalid: i
  }, t, r);
  yl(e, a, r);
  let { isIndeterminate: f, isRequired: g, validationBehavior: v = "aria" } = e;
  ee(() => {
    r.current && (r.current.indeterminate = !!f);
  });
  let { pressProps: b } = Er({
    isDisabled: h || u,
    onPress() {
      let { [Sn]: m } = e, { commitValidation: x } = m || a;
      x();
    }
  });
  return {
    labelProps: te(l, b),
    inputProps: {
      ...s,
      checked: d,
      "aria-required": g && v === "aria" || void 0,
      required: g && v === "native"
    },
    isSelected: d,
    isPressed: c,
    isDisabled: h,
    isReadOnly: u,
    isInvalid: i,
    validationErrors: o,
    validationDetails: n
  };
}
function xl(e) {
  let { id: t, label: r, "aria-labelledby": a, "aria-label": i, labelElementType: o = "label" } = e;
  t = dt(t);
  let n = dt(), l = {};
  r ? (a = a ? `${n} ${a}` : n, l = {
    id: n,
    htmlFor: o === "label" ? t : void 0
  }) : !a && !i && console.warn("If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility");
  let s = q0({
    id: t,
    "aria-label": i,
    "aria-labelledby": a
  });
  return {
    labelProps: l,
    fieldProps: s
  };
}
function $f(e) {
  let { description: t, errorMessage: r, isInvalid: a, validationState: i } = e, { labelProps: o, fieldProps: n } = xl(e), l = Oi([
    !!t,
    !!r,
    a,
    i
  ]), s = Oi([
    !!t,
    !!r,
    a,
    i
  ]);
  return n = te(n, {
    "aria-describedby": [
      l,
      // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA. See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
      s,
      e["aria-describedby"]
    ].filter(Boolean).join(" ") || void 0
  }), {
    labelProps: o,
    fieldProps: n,
    descriptionProps: {
      id: l
    },
    errorMessageProps: {
      id: s
    }
  };
}
function F_(e = {}) {
  let { isReadOnly: t } = e, [r, a] = Va(e.isSelected, e.defaultSelected || !1, e.onChange);
  function i(n) {
    t || a(n);
  }
  function o() {
    t || a(!r);
  }
  return {
    isSelected: r,
    setSelected: i,
    toggle: o
  };
}
const bd = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap"
};
function Ef(e = {}) {
  let { style: t, isFocusable: r } = e, [a, i] = se(!1), { focusWithinProps: o } = eo({
    isDisabled: !r,
    onFocusWithinChange: (l) => i(l)
  }), n = G(() => a ? t : t ? {
    ...bd,
    ...t
  } : bd, [
    a
  ]);
  return {
    visuallyHiddenProps: {
      ...o,
      style: n
    }
  };
}
function Pf(e) {
  let { children: t, elementType: r = "div", isFocusable: a, style: i, ...o } = e, { visuallyHiddenProps: n } = Ef(e);
  return /* @__PURE__ */ z.createElement(r, te(o, n), t);
}
function N_(e, t) {
  let { inputElementType: r = "input", isDisabled: a = !1, isRequired: i = !1, isReadOnly: o = !1, type: n = "text", validationBehavior: l = "aria" } = e, [s, d] = Va(e.value, e.defaultValue || "", e.onChange), { focusableProps: c } = la(e, t), h = bl({
    ...e,
    value: s
  }), { isInvalid: u, validationErrors: f, validationDetails: g } = h.displayValidation, { labelProps: v, fieldProps: b, descriptionProps: m, errorMessageProps: x } = $f({
    ...e,
    isInvalid: u,
    errorMessage: e.errorMessage || f
  }), S = Qe(e, {
    labelable: !0
  });
  const T = {
    type: n,
    pattern: e.pattern
  };
  return ul(t, s, d), yl(e, h, t), ee(() => {
    if (t.current instanceof yt(t.current).HTMLTextAreaElement) {
      let k = t.current;
      Object.defineProperty(k, "defaultValue", {
        get: () => k.value,
        set: () => {
        },
        configurable: !0
      });
    }
  }, [
    t
  ]), {
    labelProps: v,
    inputProps: te(S, r === "input" ? T : void 0, {
      disabled: a,
      readOnly: o,
      required: i && l === "native",
      "aria-required": i && l === "aria" || void 0,
      "aria-invalid": u || void 0,
      "aria-errormessage": e["aria-errormessage"],
      "aria-activedescendant": e["aria-activedescendant"],
      "aria-autocomplete": e["aria-autocomplete"],
      "aria-haspopup": e["aria-haspopup"],
      "aria-controls": e["aria-controls"],
      value: s,
      onChange: (k) => d(k.target.value),
      autoComplete: e.autoComplete,
      autoCapitalize: e.autoCapitalize,
      maxLength: e.maxLength,
      minLength: e.minLength,
      name: e.name,
      placeholder: e.placeholder,
      inputMode: e.inputMode,
      autoCorrect: e.autoCorrect,
      spellCheck: e.spellCheck,
      // Clipboard events
      onCopy: e.onCopy,
      onCut: e.onCut,
      onPaste: e.onPaste,
      // Composition events
      onCompositionEnd: e.onCompositionEnd,
      onCompositionStart: e.onCompositionStart,
      onCompositionUpdate: e.onCompositionUpdate,
      // Selection events
      onSelect: e.onSelect,
      // Input events
      onBeforeInput: e.onBeforeInput,
      onInput: e.onInput,
      ...c,
      ...b
    }),
    descriptionProps: m,
    errorMessageProps: x,
    isInvalid: u,
    validationErrors: f,
    validationDetails: g
  };
}
const Ot = {
  top: "top",
  bottom: "top",
  left: "left",
  right: "left"
}, Bi = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, L_ = {
  top: "left",
  left: "top"
}, $n = {
  top: "height",
  left: "width"
}, Cf = {
  width: "totalWidth",
  height: "totalHeight"
}, hi = {};
let Me = typeof document < "u" ? window.visualViewport : null;
function yd(e) {
  let t = 0, r = 0, a = 0, i = 0, o = 0, n = 0, l = {};
  var s;
  let d = ((s = Me == null ? void 0 : Me.scale) !== null && s !== void 0 ? s : 1) > 1;
  if (e.tagName === "BODY") {
    let g = document.documentElement;
    a = g.clientWidth, i = g.clientHeight;
    var c;
    t = (c = Me == null ? void 0 : Me.width) !== null && c !== void 0 ? c : a;
    var h;
    r = (h = Me == null ? void 0 : Me.height) !== null && h !== void 0 ? h : i, l.top = g.scrollTop || e.scrollTop, l.left = g.scrollLeft || e.scrollLeft, Me && (o = Me.offsetTop, n = Me.offsetLeft);
  } else
    ({ width: t, height: r, top: o, left: n } = Zr(e)), l.top = e.scrollTop, l.left = e.scrollLeft, a = t, i = r;
  if (dl() && (e.tagName === "BODY" || e.tagName === "HTML") && d) {
    l.top = 0, l.left = 0;
    var u;
    o = (u = Me == null ? void 0 : Me.pageTop) !== null && u !== void 0 ? u : 0;
    var f;
    n = (f = Me == null ? void 0 : Me.pageLeft) !== null && f !== void 0 ? f : 0;
  }
  return {
    width: t,
    height: r,
    totalWidth: a,
    totalHeight: i,
    scroll: l,
    top: o,
    left: n
  };
}
function M_(e) {
  return {
    top: e.scrollTop,
    left: e.scrollLeft,
    width: e.scrollWidth,
    height: e.scrollHeight
  };
}
function xd(e, t, r, a, i, o, n) {
  var l;
  let s = (l = i.scroll[e]) !== null && l !== void 0 ? l : 0, d = a[$n[e]], c = a.scroll[Ot[e]] + o, h = d + a.scroll[Ot[e]] - o, u = t - s + n[e] - a[Ot[e]], f = t - s + r + n[e] - a[Ot[e]];
  return u < c ? c - u : f > h ? Math.max(h - f, c - u) : 0;
}
function B_(e) {
  let t = window.getComputedStyle(e);
  return {
    top: parseInt(t.marginTop, 10) || 0,
    bottom: parseInt(t.marginBottom, 10) || 0,
    left: parseInt(t.marginLeft, 10) || 0,
    right: parseInt(t.marginRight, 10) || 0
  };
}
function kd(e) {
  if (hi[e]) return hi[e];
  let [t, r] = e.split(" "), a = Ot[t] || "right", i = L_[a];
  Ot[r] || (r = "center");
  let o = $n[a], n = $n[i];
  return hi[e] = {
    placement: t,
    crossPlacement: r,
    axis: a,
    crossAxis: i,
    size: o,
    crossSize: n
  }, hi[e];
}
function Ao(e, t, r, a, i, o, n, l, s, d) {
  let { placement: c, crossPlacement: h, axis: u, crossAxis: f, size: g, crossSize: v } = a, b = {};
  var m;
  b[f] = (m = e[f]) !== null && m !== void 0 ? m : 0;
  var x, S, T, k;
  h === "center" ? b[f] += (((x = e[v]) !== null && x !== void 0 ? x : 0) - ((S = r[v]) !== null && S !== void 0 ? S : 0)) / 2 : h !== f && (b[f] += ((T = e[v]) !== null && T !== void 0 ? T : 0) - ((k = r[v]) !== null && k !== void 0 ? k : 0)), b[f] += o;
  const $ = e[f] - r[v] + s + d, D = e[f] + e[v] - s - d;
  if (b[f] = Fi(b[f], $, D), c === u) {
    const p = l ? n[g] : t[Cf[g]];
    b[Bi[u]] = Math.floor(p - e[u] + i);
  } else b[u] = Math.floor(e[u] + e[g] + i);
  return b;
}
function K_(e, t, r, a, i, o, n, l) {
  const s = a ? r.height : t[Cf.height];
  var d;
  let c = e.top != null ? r.top + e.top : r.top + (s - ((d = e.bottom) !== null && d !== void 0 ? d : 0) - n);
  var h, u, f, g, v, b;
  let m = l !== "top" ? (
    // We want the distance between the top of the overlay to the bottom of the boundary
    Math.max(0, t.height + t.top + ((h = t.scroll.top) !== null && h !== void 0 ? h : 0) - c - (((u = i.top) !== null && u !== void 0 ? u : 0) + ((f = i.bottom) !== null && f !== void 0 ? f : 0) + o))
  ) : Math.max(0, c + n - (t.top + ((g = t.scroll.top) !== null && g !== void 0 ? g : 0)) - (((v = i.top) !== null && v !== void 0 ? v : 0) + ((b = i.bottom) !== null && b !== void 0 ? b : 0) + o));
  return Math.min(t.height - o * 2, m);
}
function _d(e, t, r, a, i, o) {
  let { placement: n, axis: l, size: s } = o;
  var d, c;
  if (n === l) return Math.max(0, r[l] - e[l] - ((d = e.scroll[l]) !== null && d !== void 0 ? d : 0) + t[l] - ((c = a[l]) !== null && c !== void 0 ? c : 0) - a[Bi[l]] - i);
  var h;
  return Math.max(0, e[s] + e[l] + e.scroll[l] - t[l] - r[l] - r[s] - ((h = a[l]) !== null && h !== void 0 ? h : 0) - a[Bi[l]] - i);
}
function W_(e, t, r, a, i, o, n, l, s, d, c, h, u, f, g, v) {
  let b = kd(e), { size: m, crossAxis: x, crossSize: S, placement: T, crossPlacement: k } = b, $ = Ao(t, l, r, b, c, h, d, u, g, v), D = c, p = _d(l, d, t, i, o + c, b);
  if (n && a[m] > p) {
    let Ue = kd(`${Bi[T]} ${k}`), Ge = Ao(t, l, r, Ue, c, h, d, u, g, v);
    _d(l, d, t, i, o + c, Ue) > p && (b = Ue, $ = Ge, D = c);
  }
  let w = "bottom";
  b.axis === "top" ? b.placement === "top" ? w = "top" : b.placement === "bottom" && (w = "bottom") : b.crossAxis === "top" && (b.crossPlacement === "top" ? w = "bottom" : b.crossPlacement === "bottom" && (w = "top"));
  let I = xd(x, $[x], r[S], l, s, o, d);
  $[x] += I;
  let P = K_($, l, d, u, i, o, r.height, w);
  f && f < P && (P = f), r.height = Math.min(r.height, P), $ = Ao(t, l, r, b, D, h, d, u, g, v), I = xd(x, $[x], r[S], l, s, o, d), $[x] += I;
  let O = {}, _ = t[x] + 0.5 * t[S] - $[x] - i[Ot[x]];
  const E = g / 2 + v;
  var F, W, H, R;
  const U = Ot[x] === "left" ? ((F = i.left) !== null && F !== void 0 ? F : 0) + ((W = i.right) !== null && W !== void 0 ? W : 0) : ((H = i.top) !== null && H !== void 0 ? H : 0) + ((R = i.bottom) !== null && R !== void 0 ? R : 0), J = r[S] - U - g / 2 - v, Ce = t[x] + g / 2 - ($[x] + i[Ot[x]]), Fe = t[x] + t[S] - g / 2 - ($[x] + i[Ot[x]]), He = Fi(_, Ce, Fe);
  return O[x] = Fi(He, E, J), {
    position: $,
    maxHeight: P,
    arrowOffsetLeft: O.left,
    arrowOffsetTop: O.top,
    placement: b.placement
  };
}
function j_(e) {
  let { placement: t, targetNode: r, overlayNode: a, scrollNode: i, padding: o, shouldFlip: n, boundaryElement: l, offset: s, crossOffset: d, maxHeight: c, arrowSize: h = 0, arrowBoundaryOffset: u = 0 } = e, f = a instanceof HTMLElement ? V_(a) : document.documentElement, g = f === document.documentElement;
  const v = window.getComputedStyle(f).position;
  let b = !!v && v !== "static", m = g ? Zr(r) : Sd(r, f);
  if (!g) {
    let { marginTop: O, marginLeft: _ } = window.getComputedStyle(r);
    m.top += parseInt(O, 10) || 0, m.left += parseInt(_, 10) || 0;
  }
  let x = Zr(a), S = B_(a);
  var T, k;
  x.width += ((T = S.left) !== null && T !== void 0 ? T : 0) + ((k = S.right) !== null && k !== void 0 ? k : 0);
  var $, D;
  x.height += (($ = S.top) !== null && $ !== void 0 ? $ : 0) + ((D = S.bottom) !== null && D !== void 0 ? D : 0);
  let p = M_(i), w = yd(l), I = yd(f), P = l.tagName === "BODY" ? Zr(f) : Sd(f, l);
  return f.tagName === "HTML" && l.tagName === "BODY" && (I.scroll.top = 0, I.scroll.left = 0), W_(t, m, x, p, S, o, n, w, I, P, s, d, b, c, h, u);
}
function Zr(e) {
  let { top: t, left: r, width: a, height: i } = e.getBoundingClientRect(), { scrollTop: o, scrollLeft: n, clientTop: l, clientLeft: s } = document.documentElement;
  return {
    top: t + o - l,
    left: r + n - s,
    width: a,
    height: i
  };
}
function Sd(e, t) {
  let r = window.getComputedStyle(e), a;
  if (r.position === "fixed") {
    let { top: i, left: o, width: n, height: l } = e.getBoundingClientRect();
    a = {
      top: i,
      left: o,
      width: n,
      height: l
    };
  } else {
    a = Zr(e);
    let i = Zr(t), o = window.getComputedStyle(t);
    i.top += (parseInt(o.borderTopWidth, 10) || 0) - t.scrollTop, i.left += (parseInt(o.borderLeftWidth, 10) || 0) - t.scrollLeft, a.top -= i.top, a.left -= i.left;
  }
  return a.top -= parseInt(r.marginTop, 10) || 0, a.left -= parseInt(r.marginLeft, 10) || 0, a;
}
function V_(e) {
  let t = e.offsetParent;
  if (t && t === document.body && window.getComputedStyle(t).position === "static" && !wd(t) && (t = document.documentElement), t == null)
    for (t = e.parentElement; t && !wd(t); ) t = t.parentElement;
  return t || document.documentElement;
}
function wd(e) {
  let t = window.getComputedStyle(e);
  return t.transform !== "none" || /transform|perspective/.test(t.willChange) || t.filter !== "none" || t.contain === "paint" || "backdropFilter" in t && t.backdropFilter !== "none" || "WebkitBackdropFilter" in t && t.WebkitBackdropFilter !== "none";
}
const Tf = /* @__PURE__ */ new WeakMap();
function H_(e) {
  let { triggerRef: t, isOpen: r, onClose: a } = e;
  ee(() => {
    if (!r || a === null) return;
    let i = (o) => {
      let n = o.target;
      if (!t.current || n instanceof Node && !n.contains(t.current) || o.target instanceof HTMLInputElement || o.target instanceof HTMLTextAreaElement) return;
      let l = a || Tf.get(t.current);
      l && l();
    };
    return window.addEventListener("scroll", i, !0), () => {
      window.removeEventListener("scroll", i, !0);
    };
  }, [
    r,
    a,
    t
  ]);
}
let Ie = typeof document < "u" ? window.visualViewport : null;
function If(e) {
  let { direction: t } = sa(), { arrowSize: r = 0, targetRef: a, overlayRef: i, scrollRef: o = i, placement: n = "bottom", containerPadding: l = 12, shouldFlip: s = !0, boundaryElement: d = typeof document < "u" ? document.body : null, offset: c = 0, crossOffset: h = 0, shouldUpdatePosition: u = !0, isOpen: f = !0, onClose: g, maxHeight: v, arrowBoundaryOffset: b = 0 } = e, [m, x] = se(null), S = [
    u,
    n,
    i.current,
    a.current,
    o.current,
    l,
    s,
    d,
    c,
    h,
    f,
    t,
    v,
    b,
    r
  ], T = B(Ie == null ? void 0 : Ie.scale);
  ee(() => {
    f && (T.current = Ie == null ? void 0 : Ie.scale);
  }, [
    f
  ]);
  let k = ie(() => {
    if (u === !1 || !f || !i.current || !a.current || !d || (Ie == null ? void 0 : Ie.scale) !== T.current) return;
    let I = null;
    if (o.current && o.current.contains(document.activeElement)) {
      var P;
      let R = (P = document.activeElement) === null || P === void 0 ? void 0 : P.getBoundingClientRect(), U = o.current.getBoundingClientRect();
      var O;
      if (I = {
        type: "top",
        offset: ((O = R == null ? void 0 : R.top) !== null && O !== void 0 ? O : 0) - U.top
      }, I.offset > U.height / 2) {
        I.type = "bottom";
        var _;
        I.offset = ((_ = R == null ? void 0 : R.bottom) !== null && _ !== void 0 ? _ : 0) - U.bottom;
      }
    }
    let E = i.current;
    if (!v && i.current) {
      var F;
      E.style.top = "0px", E.style.bottom = "";
      var W;
      E.style.maxHeight = ((W = (F = window.visualViewport) === null || F === void 0 ? void 0 : F.height) !== null && W !== void 0 ? W : window.innerHeight) + "px";
    }
    let H = j_({
      placement: G_(n, t),
      overlayNode: i.current,
      targetNode: a.current,
      scrollNode: o.current || i.current,
      padding: l,
      shouldFlip: s,
      boundaryElement: d,
      offset: c,
      crossOffset: h,
      maxHeight: v,
      arrowSize: r,
      arrowBoundaryOffset: b
    });
    if (H.position) {
      if (E.style.top = "", E.style.bottom = "", E.style.left = "", E.style.right = "", Object.keys(H.position).forEach((R) => E.style[R] = H.position[R] + "px"), E.style.maxHeight = H.maxHeight != null ? H.maxHeight + "px" : "", I && document.activeElement && o.current) {
        let R = document.activeElement.getBoundingClientRect(), U = o.current.getBoundingClientRect(), J = R[I.type] - U[I.type];
        o.current.scrollTop += J - I.offset;
      }
      x(H);
    }
  }, S);
  fe(k, S), U_(k), hn({
    ref: i,
    onResize: k
  }), hn({
    ref: a,
    onResize: k
  });
  let $ = B(!1);
  fe(() => {
    let I, P = () => {
      $.current = !0, clearTimeout(I), I = setTimeout(() => {
        $.current = !1;
      }, 500), k();
    }, O = () => {
      $.current && P();
    };
    return Ie == null || Ie.addEventListener("resize", P), Ie == null || Ie.addEventListener("scroll", O), () => {
      Ie == null || Ie.removeEventListener("resize", P), Ie == null || Ie.removeEventListener("scroll", O);
    };
  }, [
    k
  ]);
  let D = ie(() => {
    $.current || g == null || g();
  }, [
    g,
    $
  ]);
  H_({
    triggerRef: a,
    isOpen: f,
    onClose: g && D
  });
  var p, w;
  return {
    overlayProps: {
      style: {
        position: "absolute",
        zIndex: 1e5,
        ...m == null ? void 0 : m.position,
        maxHeight: (p = m == null ? void 0 : m.maxHeight) !== null && p !== void 0 ? p : "100vh"
      }
    },
    placement: (w = m == null ? void 0 : m.placement) !== null && w !== void 0 ? w : null,
    arrowProps: {
      "aria-hidden": "true",
      role: "presentation",
      style: {
        left: m == null ? void 0 : m.arrowOffsetLeft,
        top: m == null ? void 0 : m.arrowOffsetTop
      }
    },
    updatePosition: k
  };
}
function U_(e) {
  fe(() => (window.addEventListener("resize", e, !1), () => {
    window.removeEventListener("resize", e, !1);
  }), [
    e
  ]);
}
function G_(e, t) {
  return t === "rtl" ? e.replace("start", "right").replace("end", "left") : e.replace("start", "left").replace("end", "right");
}
const Wt = [];
function Y_(e, t) {
  let { onClose: r, shouldCloseOnBlur: a, isOpen: i, isDismissable: o = !1, isKeyboardDismissDisabled: n = !1, shouldCloseOnInteractOutside: l } = e;
  ee(() => (i && Wt.push(t), () => {
    let g = Wt.indexOf(t);
    g >= 0 && Wt.splice(g, 1);
  }), [
    i,
    t
  ]);
  let s = () => {
    Wt[Wt.length - 1] === t && r && r();
  }, d = (g) => {
    (!l || l(g.target)) && Wt[Wt.length - 1] === t && (g.stopPropagation(), g.preventDefault());
  }, c = (g) => {
    (!l || l(g.target)) && (Wt[Wt.length - 1] === t && (g.stopPropagation(), g.preventDefault()), s());
  }, h = (g) => {
    g.key === "Escape" && !n && !g.nativeEvent.isComposing && (g.stopPropagation(), g.preventDefault(), s());
  };
  Zk({
    ref: t,
    onInteractOutside: o && i ? c : void 0,
    onInteractOutsideStart: d
  });
  let { focusWithinProps: u } = eo({
    isDisabled: !a,
    onBlurWithin: (g) => {
      !g.relatedTarget || n_(g.relatedTarget) || (!l || l(g.relatedTarget)) && (r == null || r());
    }
  }), f = (g) => {
    g.target === g.currentTarget && g.preventDefault();
  };
  return {
    overlayProps: {
      onKeyDown: h,
      ...u
    },
    underlayProps: {
      onPointerDown: f
    }
  };
}
function q_(e, t, r) {
  let { type: a } = e, { isOpen: i } = t;
  ee(() => {
    r && r.current && Tf.set(r.current, t.close);
  });
  let o;
  a === "menu" ? o = !0 : a === "listbox" && (o = "listbox");
  let n = dt();
  return {
    triggerProps: {
      "aria-haspopup": o,
      "aria-expanded": i,
      "aria-controls": i ? n : void 0,
      onPress: t.toggle
    },
    overlayProps: {
      id: n
    }
  };
}
const zo = typeof document < "u" && window.visualViewport, X_ = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
let fi = 0, Oo;
function Z_(e = {}) {
  let { isDisabled: t } = e;
  fe(() => {
    if (!t)
      return fi++, fi === 1 && (Zi() ? Oo = Q_() : Oo = J_()), () => {
        fi--, fi === 0 && Oo();
      };
  }, [
    t
  ]);
}
function J_() {
  return wr(Gr(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`), Gr(document.documentElement, "overflow", "hidden"));
}
function Q_() {
  let e, t, r = (d) => {
    e = Z0(d.target, !0), !(e === document.documentElement && e === document.body) && e instanceof HTMLElement && window.getComputedStyle(e).overscrollBehavior === "auto" && (t = Gr(e, "overscrollBehavior", "contain"));
  }, a = (d) => {
    if (!e || e === document.documentElement || e === document.body) {
      d.preventDefault();
      return;
    }
    e.scrollHeight === e.clientHeight && e.scrollWidth === e.clientWidth && d.preventDefault();
  }, i = () => {
    t && t();
  }, o = (d) => {
    let c = d.target;
    e6(c) && (l(), c.style.transform = "translateY(-2000px)", requestAnimationFrame(() => {
      c.style.transform = "", zo && (zo.height < window.innerHeight ? requestAnimationFrame(() => {
        $d(c);
      }) : zo.addEventListener("resize", () => $d(c), {
        once: !0
      }));
    }));
  }, n = null, l = () => {
    if (n) return;
    let d = () => {
      window.scrollTo(0, 0);
    }, c = window.pageXOffset, h = window.pageYOffset;
    n = wr(ya(window, "scroll", d), Gr(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`), Gr(document.documentElement, "overflow", "hidden"), Gr(document.body, "marginTop", `-${h}px`), () => {
      window.scrollTo(c, h);
    }), window.scrollTo(0, 0);
  }, s = wr(ya(document, "touchstart", r, {
    passive: !1,
    capture: !0
  }), ya(document, "touchmove", a, {
    passive: !1,
    capture: !0
  }), ya(document, "touchend", i, {
    passive: !1,
    capture: !0
  }), ya(document, "focus", o, !0));
  return () => {
    t == null || t(), n == null || n(), s();
  };
}
function Gr(e, t, r) {
  let a = e.style[t];
  return e.style[t] = r, () => {
    e.style[t] = a;
  };
}
function ya(e, t, r, a) {
  return e.addEventListener(t, r, a), () => {
    e.removeEventListener(t, r, a);
  };
}
function $d(e) {
  let t = document.scrollingElement || document.documentElement, r = e;
  for (; r && r !== t; ) {
    let a = Z0(r);
    if (a !== document.documentElement && a !== document.body && a !== r) {
      let i = a.getBoundingClientRect().top, o = r.getBoundingClientRect().top;
      o > i + r.clientHeight && (a.scrollTop += o - i);
    }
    r = a.parentElement;
  }
}
function e6(e) {
  return e instanceof HTMLInputElement && !X_.has(e.type) || e instanceof HTMLTextAreaElement || e instanceof HTMLElement && e.isContentEditable;
}
const En = /* @__PURE__ */ z.createContext(null);
function t6(e) {
  let { children: t } = e, r = Q(En), [a, i] = se(0), o = G(() => ({
    parent: r,
    modalCount: a,
    addModal() {
      i((n) => n + 1), r && r.addModal();
    },
    removeModal() {
      i((n) => n - 1), r && r.removeModal();
    }
  }), [
    r,
    a
  ]);
  return /* @__PURE__ */ z.createElement(En.Provider, {
    value: o
  }, t);
}
function r6() {
  let e = Q(En);
  return {
    modalProviderProps: {
      "aria-hidden": e && e.modalCount > 0 ? !0 : void 0
    }
  };
}
function a6(e) {
  let { modalProviderProps: t } = r6();
  return /* @__PURE__ */ z.createElement("div", {
    "data-overlay-container": !0,
    ...e,
    ...t
  });
}
function i6(e) {
  return /* @__PURE__ */ z.createElement(t6, null, /* @__PURE__ */ z.createElement(a6, e));
}
function o6(e) {
  let t = Tr(), { portalContainer: r = t ? null : document.body, ...a } = e;
  if (z.useEffect(() => {
    if (r != null && r.closest("[data-overlay-container]")) throw new Error("An OverlayContainer must not be inside another container. Please change the portalContainer prop.");
  }, [
    r
  ]), !r) return null;
  let i = /* @__PURE__ */ z.createElement(i6, a);
  return /* @__PURE__ */ ou.createPortal(i, r);
}
var Rf = {};
Rf = {
  dismiss: "تجاهل"
};
var Df = {};
Df = {
  dismiss: "Отхвърляне"
};
var Af = {};
Af = {
  dismiss: "Odstranit"
};
var zf = {};
zf = {
  dismiss: "Luk"
};
var Of = {};
Of = {
  dismiss: "Schließen"
};
var Ff = {};
Ff = {
  dismiss: "Απόρριψη"
};
var Nf = {};
Nf = {
  dismiss: "Dismiss"
};
var Lf = {};
Lf = {
  dismiss: "Descartar"
};
var Mf = {};
Mf = {
  dismiss: "Lõpeta"
};
var Bf = {};
Bf = {
  dismiss: "Hylkää"
};
var Kf = {};
Kf = {
  dismiss: "Rejeter"
};
var Wf = {};
Wf = {
  dismiss: "התעלם"
};
var jf = {};
jf = {
  dismiss: "Odbaci"
};
var Vf = {};
Vf = {
  dismiss: "Elutasítás"
};
var Hf = {};
Hf = {
  dismiss: "Ignora"
};
var Uf = {};
Uf = {
  dismiss: "閉じる"
};
var Gf = {};
Gf = {
  dismiss: "무시"
};
var Yf = {};
Yf = {
  dismiss: "Atmesti"
};
var qf = {};
qf = {
  dismiss: "Nerādīt"
};
var Xf = {};
Xf = {
  dismiss: "Lukk"
};
var Zf = {};
Zf = {
  dismiss: "Negeren"
};
var Jf = {};
Jf = {
  dismiss: "Zignoruj"
};
var Qf = {};
Qf = {
  dismiss: "Descartar"
};
var eg = {};
eg = {
  dismiss: "Dispensar"
};
var tg = {};
tg = {
  dismiss: "Revocare"
};
var rg = {};
rg = {
  dismiss: "Пропустить"
};
var ag = {};
ag = {
  dismiss: "Zrušiť"
};
var ig = {};
ig = {
  dismiss: "Opusti"
};
var og = {};
og = {
  dismiss: "Odbaci"
};
var ng = {};
ng = {
  dismiss: "Avvisa"
};
var lg = {};
lg = {
  dismiss: "Kapat"
};
var sg = {};
sg = {
  dismiss: "Скасувати"
};
var dg = {};
dg = {
  dismiss: "取消"
};
var cg = {};
cg = {
  dismiss: "關閉"
};
var ug = {};
ug = {
  "ar-AE": Rf,
  "bg-BG": Df,
  "cs-CZ": Af,
  "da-DK": zf,
  "de-DE": Of,
  "el-GR": Ff,
  "en-US": Nf,
  "es-ES": Lf,
  "et-EE": Mf,
  "fi-FI": Bf,
  "fr-FR": Kf,
  "he-IL": Wf,
  "hr-HR": jf,
  "hu-HU": Vf,
  "it-IT": Hf,
  "ja-JP": Uf,
  "ko-KR": Gf,
  "lt-LT": Yf,
  "lv-LV": qf,
  "nb-NO": Xf,
  "nl-NL": Zf,
  "pl-PL": Jf,
  "pt-BR": Qf,
  "pt-PT": eg,
  "ro-RO": tg,
  "ru-RU": rg,
  "sk-SK": ag,
  "sl-SI": ig,
  "sr-SP": og,
  "sv-SE": ng,
  "tr-TR": lg,
  "uk-UA": sg,
  "zh-CN": dg,
  "zh-TW": cg
};
function n6(e) {
  return e && e.__esModule ? e.default : e;
}
function Ed(e) {
  let { onDismiss: t, ...r } = e, a = vl(n6(ug), "@react-aria/overlays"), i = q0(r, a.format("dismiss")), o = () => {
    t && t();
  };
  return /* @__PURE__ */ z.createElement(Pf, null, /* @__PURE__ */ z.createElement("button", {
    ...i,
    tabIndex: -1,
    onClick: o,
    style: {
      width: 1,
      height: 1
    }
  }));
}
let xa = /* @__PURE__ */ new WeakMap(), vt = [];
function l6(e, t = document.body) {
  let r = new Set(e), a = /* @__PURE__ */ new Set(), i = (s) => {
    for (let u of s.querySelectorAll("[data-live-announcer], [data-react-aria-top-layer]")) r.add(u);
    let d = (u) => {
      if (r.has(u) || u.parentElement && a.has(u.parentElement) && u.parentElement.getAttribute("role") !== "row") return NodeFilter.FILTER_REJECT;
      for (let f of r)
        if (u.contains(f)) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }, c = document.createTreeWalker(s, NodeFilter.SHOW_ELEMENT, {
      acceptNode: d
    }), h = d(s);
    if (h === NodeFilter.FILTER_ACCEPT && o(s), h !== NodeFilter.FILTER_REJECT) {
      let u = c.nextNode();
      for (; u != null; )
        o(u), u = c.nextNode();
    }
  }, o = (s) => {
    var d;
    let c = (d = xa.get(s)) !== null && d !== void 0 ? d : 0;
    s.getAttribute("aria-hidden") === "true" && c === 0 || (c === 0 && s.setAttribute("aria-hidden", "true"), a.add(s), xa.set(s, c + 1));
  };
  vt.length && vt[vt.length - 1].disconnect(), i(t);
  let n = new MutationObserver((s) => {
    for (let d of s)
      if (!(d.type !== "childList" || d.addedNodes.length === 0) && ![
        ...r,
        ...a
      ].some((c) => c.contains(d.target))) {
        for (let c of d.removedNodes) c instanceof Element && (r.delete(c), a.delete(c));
        for (let c of d.addedNodes)
          (c instanceof HTMLElement || c instanceof SVGElement) && (c.dataset.liveAnnouncer === "true" || c.dataset.reactAriaTopLayer === "true") ? r.add(c) : c instanceof Element && i(c);
      }
  });
  n.observe(t, {
    childList: !0,
    subtree: !0
  });
  let l = {
    observe() {
      n.observe(t, {
        childList: !0,
        subtree: !0
      });
    },
    disconnect() {
      n.disconnect();
    }
  };
  return vt.push(l), () => {
    n.disconnect();
    for (let s of a) {
      let d = xa.get(s);
      d != null && (d === 1 ? (s.removeAttribute("aria-hidden"), xa.delete(s)) : xa.set(s, d - 1));
    }
    l === vt[vt.length - 1] ? (vt.pop(), vt.length && vt[vt.length - 1].observe()) : vt.splice(vt.indexOf(l), 1);
  };
}
function s6(e, t) {
  let { triggerRef: r, popoverRef: a, isNonModal: i, isKeyboardDismissDisabled: o, shouldCloseOnInteractOutside: n, ...l } = e, { overlayProps: s, underlayProps: d } = Y_({
    // If popover is in the top layer, it should not prevent other popovers from being dismissed.
    isOpen: t.isOpen && !l["data-react-aria-top-layer"],
    onClose: t.close,
    shouldCloseOnBlur: !0,
    isDismissable: !i,
    isKeyboardDismissDisabled: o,
    shouldCloseOnInteractOutside: n
  }, a), { overlayProps: c, arrowProps: h, placement: u } = If({
    ...l,
    targetRef: r,
    overlayRef: a,
    isOpen: t.isOpen,
    onClose: i ? t.close : null
  });
  return Z_({
    isDisabled: i || !t.isOpen
  }), fe(() => {
    if (t.isOpen && !i && a.current) return l6([
      a.current
    ]);
  }, [
    i,
    t.isOpen,
    a
  ]), {
    popoverProps: te(s, c),
    arrowProps: h,
    underlayProps: d,
    placement: u
  };
}
const d6 = /* @__PURE__ */ ae({});
function c6() {
  var e;
  return (e = Q(d6)) !== null && e !== void 0 ? e : {};
}
const u6 = /* @__PURE__ */ z.createContext(null);
function h6(e) {
  let t = Tr(), { portalContainer: r = t ? null : document.body, isExiting: a } = e, [i, o] = se(!1), n = G(() => ({
    contain: i,
    setContain: o
  }), [
    i,
    o
  ]), { getContainer: l } = c6();
  if (!e.portalContainer && l && (r = l()), !r) return null;
  let s = e.children;
  return e.disableFocusManagement || (s = /* @__PURE__ */ z.createElement(vf, {
    restoreFocus: !0,
    contain: i && !a
  }, s)), s = /* @__PURE__ */ z.createElement(u6.Provider, {
    value: n
  }, /* @__PURE__ */ z.createElement(Wk, null, s)), /* @__PURE__ */ ou.createPortal(s, r);
}
const kl = /* @__PURE__ */ new WeakMap();
function f6(e) {
  return typeof e == "string" ? e.replace(/\s*/g, "") : "" + e;
}
function g6(e, t) {
  let r = kl.get(e);
  if (!r) throw new Error("Unknown list");
  return `${r.id}-option-${f6(t)}`;
}
function Pn(e) {
  return kk() ? e.altKey : e.ctrlKey;
}
const p6 = 1e3;
function hg(e) {
  let { keyboardDelegate: t, selectionManager: r, onTypeSelect: a } = e, i = B({
    search: "",
    timeout: void 0
  }).current, o = (n) => {
    let l = v6(n.key);
    if (!(!l || n.ctrlKey || n.metaKey || !n.currentTarget.contains(n.target))) {
      if (l === " " && i.search.trim().length > 0 && (n.preventDefault(), "continuePropagation" in n || n.stopPropagation()), i.search += l, t.getKeyForSearch != null) {
        let s = t.getKeyForSearch(i.search, r.focusedKey);
        s == null && (s = t.getKeyForSearch(i.search)), s != null && (r.setFocusedKey(s), a && a(s));
      }
      clearTimeout(i.timeout), i.timeout = setTimeout(() => {
        i.search = "";
      }, p6);
    }
  };
  return {
    typeSelectProps: {
      // Using a capturing listener to catch the keydown event before
      // other hooks in order to handle the Spacebar event.
      onKeyDownCapture: t.getKeyForSearch ? o : void 0
    }
  };
}
function v6(e) {
  return e.length === 1 || !/^[A-Z]/i.test(e) ? e : "";
}
function m6(e) {
  let { selectionManager: t, keyboardDelegate: r, ref: a, autoFocus: i = !1, shouldFocusWrap: o = !1, disallowEmptySelection: n = !1, disallowSelectAll: l = !1, selectOnFocus: s = t.selectionBehavior === "replace", disallowTypeAhead: d = !1, shouldUseVirtualFocus: c, allowsTabNavigation: h = !1, isVirtualized: u, scrollRef: f = a, linkBehavior: g = "action" } = e, { direction: v } = sa(), b = Ji(), m = (_) => {
    var E;
    if (_.altKey && _.key === "Tab" && _.preventDefault(), !(!((E = a.current) === null || E === void 0) && E.contains(_.target))) return;
    const F = (A, N) => {
      if (A != null) {
        if (t.isLink(A) && g === "selection" && s && !Pn(_)) {
          var Y;
          nu(() => {
            t.setFocusedKey(A, N);
          });
          let ce = (Y = f.current) === null || Y === void 0 ? void 0 : Y.querySelector(`[data-key="${CSS.escape(A.toString())}"]`), M = t.getItemProps(A);
          ce && b.open(ce, _, M.href, M.routerOptions);
          return;
        }
        if (t.setFocusedKey(A, N), t.isLink(A) && g === "override") return;
        _.shiftKey && t.selectionMode === "multiple" ? t.extendSelection(A) : s && !Pn(_) && t.replaceSelection(A);
      }
    };
    switch (_.key) {
      case "ArrowDown":
        if (r.getKeyBelow) {
          var W, H, R;
          let A = t.focusedKey != null ? (W = r.getKeyBelow) === null || W === void 0 ? void 0 : W.call(r, t.focusedKey) : (H = r.getFirstKey) === null || H === void 0 ? void 0 : H.call(r);
          A == null && o && (A = (R = r.getFirstKey) === null || R === void 0 ? void 0 : R.call(r, t.focusedKey)), A != null && (_.preventDefault(), F(A));
        }
        break;
      case "ArrowUp":
        if (r.getKeyAbove) {
          var U, J, Ce;
          let A = t.focusedKey != null ? (U = r.getKeyAbove) === null || U === void 0 ? void 0 : U.call(r, t.focusedKey) : (J = r.getLastKey) === null || J === void 0 ? void 0 : J.call(r);
          A == null && o && (A = (Ce = r.getLastKey) === null || Ce === void 0 ? void 0 : Ce.call(r, t.focusedKey)), A != null && (_.preventDefault(), F(A));
        }
        break;
      case "ArrowLeft":
        if (r.getKeyLeftOf) {
          var Fe, He, Ue;
          let A = t.focusedKey != null ? (Fe = r.getKeyLeftOf) === null || Fe === void 0 ? void 0 : Fe.call(r, t.focusedKey) : null;
          A == null && o && (A = v === "rtl" ? (He = r.getFirstKey) === null || He === void 0 ? void 0 : He.call(r, t.focusedKey) : (Ue = r.getLastKey) === null || Ue === void 0 ? void 0 : Ue.call(r, t.focusedKey)), A != null && (_.preventDefault(), F(A, v === "rtl" ? "first" : "last"));
        }
        break;
      case "ArrowRight":
        if (r.getKeyRightOf) {
          var Ge, ut, kt;
          let A = t.focusedKey != null ? (Ge = r.getKeyRightOf) === null || Ge === void 0 ? void 0 : Ge.call(r, t.focusedKey) : null;
          A == null && o && (A = v === "rtl" ? (ut = r.getLastKey) === null || ut === void 0 ? void 0 : ut.call(r, t.focusedKey) : (kt = r.getFirstKey) === null || kt === void 0 ? void 0 : kt.call(r, t.focusedKey)), A != null && (_.preventDefault(), F(A, v === "rtl" ? "last" : "first"));
        }
        break;
      case "Home":
        if (r.getFirstKey) {
          if (t.focusedKey === null && _.shiftKey) return;
          _.preventDefault();
          let A = r.getFirstKey(t.focusedKey, Vr(_));
          t.setFocusedKey(A), A != null && (Vr(_) && _.shiftKey && t.selectionMode === "multiple" ? t.extendSelection(A) : s && t.replaceSelection(A));
        }
        break;
      case "End":
        if (r.getLastKey) {
          if (t.focusedKey === null && _.shiftKey) return;
          _.preventDefault();
          let A = r.getLastKey(t.focusedKey, Vr(_));
          t.setFocusedKey(A), A != null && (Vr(_) && _.shiftKey && t.selectionMode === "multiple" ? t.extendSelection(A) : s && t.replaceSelection(A));
        }
        break;
      case "PageDown":
        if (r.getKeyPageBelow && t.focusedKey != null) {
          let A = r.getKeyPageBelow(t.focusedKey);
          A != null && (_.preventDefault(), F(A));
        }
        break;
      case "PageUp":
        if (r.getKeyPageAbove && t.focusedKey != null) {
          let A = r.getKeyPageAbove(t.focusedKey);
          A != null && (_.preventDefault(), F(A));
        }
        break;
      case "a":
        Vr(_) && t.selectionMode === "multiple" && l !== !0 && (_.preventDefault(), t.selectAll());
        break;
      case "Escape":
        !n && t.selectedKeys.size !== 0 && (_.stopPropagation(), _.preventDefault(), t.clearSelection());
        break;
      case "Tab":
        if (!h) {
          if (_.shiftKey) a.current.focus();
          else {
            let A = qt(a.current, {
              tabbable: !0
            }), N, Y;
            do
              Y = A.lastChild(), Y && (N = Y);
            while (Y);
            N && !N.contains(document.activeElement) && Gt(N);
          }
          break;
        }
    }
  }, x = B({
    top: 0,
    left: 0
  });
  li(f, "scroll", u ? void 0 : () => {
    var _, E, F, W;
    x.current = {
      top: (F = (_ = f.current) === null || _ === void 0 ? void 0 : _.scrollTop) !== null && F !== void 0 ? F : 0,
      left: (W = (E = f.current) === null || E === void 0 ? void 0 : E.scrollLeft) !== null && W !== void 0 ? W : 0
    };
  });
  let S = (_) => {
    if (t.isFocused) {
      _.currentTarget.contains(_.target) || t.setFocused(!1);
      return;
    }
    if (_.currentTarget.contains(_.target)) {
      if (t.setFocused(!0), t.focusedKey == null) {
        var E, F;
        let R = (J) => {
          J != null && (t.setFocusedKey(J), s && t.replaceSelection(J));
        }, U = _.relatedTarget;
        var W, H;
        U && _.currentTarget.compareDocumentPosition(U) & Node.DOCUMENT_POSITION_FOLLOWING ? R((W = t.lastSelectedKey) !== null && W !== void 0 ? W : (E = r.getLastKey) === null || E === void 0 ? void 0 : E.call(r)) : R((H = t.firstSelectedKey) !== null && H !== void 0 ? H : (F = r.getFirstKey) === null || F === void 0 ? void 0 : F.call(r));
      } else !u && f.current && (f.current.scrollTop = x.current.top, f.current.scrollLeft = x.current.left);
      if (t.focusedKey != null && f.current) {
        let R = f.current.querySelector(`[data-key="${CSS.escape(t.focusedKey.toString())}"]`);
        R && (R.contains(document.activeElement) || Gt(R), Na() === "keyboard" && td(R, {
          containingElement: a.current
        }));
      }
    }
  }, T = (_) => {
    _.currentTarget.contains(_.relatedTarget) || t.setFocused(!1);
  }, k = B(!1);
  li(a, Ak, c ? (_) => {
    let { detail: E } = _;
    _.stopPropagation(), t.setFocused(!0), (E == null ? void 0 : E.focusStrategy) === "first" && (k.current = !0);
  } : void 0);
  let $ = je(() => {
    var _, E;
    let F = (E = (_ = r.getFirstKey) === null || _ === void 0 ? void 0 : _.call(r)) !== null && E !== void 0 ? E : null;
    if (F == null) {
      var W;
      (W = a.current) === null || W === void 0 || W.dispatchEvent(new CustomEvent(Q0, {
        cancelable: !0,
        bubbles: !0
      })), t.collection.size > 0 && (k.current = !1);
    } else
      t.setFocusedKey(F), k.current = !1;
  });
  Qs(() => {
    k.current && $();
  }, [
    t.collection,
    $
  ]);
  let D = je(() => {
    t.collection.size > 0 && (k.current = !1);
  });
  Qs(() => {
    D();
  }, [
    t.focusedKey,
    D
  ]), li(a, Dk, c ? (_) => {
    _.stopPropagation(), t.setFocused(!1), t.setFocusedKey(null);
  } : void 0);
  const p = B(i);
  ee(() => {
    if (p.current) {
      var _, E;
      let H = null;
      var F;
      i === "first" && (H = (F = (_ = r.getFirstKey) === null || _ === void 0 ? void 0 : _.call(r)) !== null && F !== void 0 ? F : null);
      var W;
      i === "last" && (H = (W = (E = r.getLastKey) === null || E === void 0 ? void 0 : E.call(r)) !== null && W !== void 0 ? W : null);
      let R = t.selectedKeys;
      if (R.size) {
        for (let U of R) if (t.canSelectItem(U)) {
          H = U;
          break;
        }
      }
      t.setFocused(!0), t.setFocusedKey(H), H == null && !c && a.current && La(a.current);
    }
  }, []);
  let w = B(t.focusedKey);
  ee(() => {
    if (t.isFocused && t.focusedKey != null && (t.focusedKey !== w.current || p.current) && f.current && a.current) {
      let _ = Na(), E = a.current.querySelector(`[data-key="${CSS.escape(t.focusedKey.toString())}"]`);
      if (!E)
        return;
      (_ === "keyboard" || p.current) && (J0(f.current, E), _ !== "virtual" && td(E, {
        containingElement: a.current
      }));
    }
    !c && t.isFocused && t.focusedKey == null && w.current != null && a.current && La(a.current), w.current = t.focusedKey, p.current = !1;
  }), li(a, "react-aria-focus-scope-restore", (_) => {
    _.preventDefault(), t.setFocused(!0);
  });
  let I = {
    onKeyDown: m,
    onFocus: S,
    onBlur: T,
    onMouseDown(_) {
      f.current === _.target && _.preventDefault();
    }
  }, { typeSelectProps: P } = hg({
    keyboardDelegate: r,
    selectionManager: t
  });
  d || (I = te(P, I));
  let O;
  return c ? O = -1 : O = t.focusedKey == null ? 0 : -1, {
    collectionProps: {
      ...I,
      tabIndex: O
    }
  };
}
function b6(e) {
  let { id: t, selectionManager: r, key: a, ref: i, shouldSelectOnPressUp: o, shouldUseVirtualFocus: n, focus: l, isDisabled: s, onAction: d, allowsDifferentPressOrigin: c, linkBehavior: h = "action" } = e, u = Ji();
  t = dt(t);
  let f = (R) => {
    if (R.pointerType === "keyboard" && Pn(R)) r.toggleSelection(a);
    else {
      if (r.selectionMode === "none") return;
      if (r.isLink(a)) {
        if (h === "selection" && i.current) {
          let U = r.getItemProps(a);
          u.open(i.current, R, U.href, U.routerOptions), r.setSelectedKeys(r.selectedKeys);
          return;
        } else if (h === "override" || h === "none") return;
      }
      r.selectionMode === "single" ? r.isSelected(a) && !r.disallowEmptySelection ? r.toggleSelection(a) : r.replaceSelection(a) : R && R.shiftKey ? r.extendSelection(a) : r.selectionBehavior === "toggle" || R && (Vr(R) || R.pointerType === "touch" || R.pointerType === "virtual") ? r.toggleSelection(a) : r.replaceSelection(a);
    }
  };
  ee(() => {
    if (a === r.focusedKey && r.isFocused)
      if (!n)
        l ? l() : document.activeElement !== i.current && i.current && La(i.current);
      else {
        var U;
        let J = new CustomEvent(Q0, {
          cancelable: !0,
          bubbles: !0
        });
        (U = i.current) === null || U === void 0 || U.dispatchEvent(J);
      }
  }, [
    i,
    a,
    r.focusedKey,
    r.childFocusStrategy,
    r.isFocused,
    n
  ]), s = s || r.isDisabled(a);
  let g = {};
  !n && !s ? g = {
    tabIndex: a === r.focusedKey ? 0 : -1,
    onFocus(R) {
      R.target === i.current && r.setFocusedKey(a);
    }
  } : s && (g.onMouseDown = (R) => {
    R.preventDefault();
  });
  let v = r.isLink(a) && h === "override", b = r.isLink(a) && h !== "selection" && h !== "none", m = !s && r.canSelectItem(a) && !v, x = (d || b) && !s, S = x && (r.selectionBehavior === "replace" ? !m : !m || r.isEmpty), T = x && m && r.selectionBehavior === "replace", k = S || T, $ = B(null), D = k && m, p = B(!1), w = B(!1), I = (R) => {
    if (d && d(), b && i.current) {
      let U = r.getItemProps(a);
      u.open(i.current, R, U.href, U.routerOptions);
    }
  }, P = {};
  o ? (P.onPressStart = (R) => {
    $.current = R.pointerType, p.current = D, R.pointerType === "keyboard" && (!k || Cd()) && f(R);
  }, c ? (P.onPressUp = S ? void 0 : (R) => {
    R.pointerType === "mouse" && m && f(R);
  }, P.onPress = S ? I : (R) => {
    R.pointerType !== "keyboard" && R.pointerType !== "mouse" && m && f(R);
  }) : P.onPress = (R) => {
    if (S || T && R.pointerType !== "mouse") {
      if (R.pointerType === "keyboard" && !Pd()) return;
      I(R);
    } else R.pointerType !== "keyboard" && m && f(R);
  }) : (P.onPressStart = (R) => {
    $.current = R.pointerType, p.current = D, w.current = S, m && (R.pointerType === "mouse" && !S || R.pointerType === "keyboard" && (!x || Cd())) && f(R);
  }, P.onPress = (R) => {
    (R.pointerType === "touch" || R.pointerType === "pen" || R.pointerType === "virtual" || R.pointerType === "keyboard" && k && Pd() || R.pointerType === "mouse" && w.current) && (k ? I(R) : m && f(R));
  }), g["data-key"] = a, P.preventFocusOnPress = n;
  let { pressProps: O, isPressed: _ } = Er(P), E = T ? (R) => {
    $.current === "mouse" && (R.stopPropagation(), R.preventDefault(), I(R));
  } : void 0, { longPressProps: F } = gf({
    isDisabled: !D,
    onLongPress(R) {
      R.pointerType === "touch" && (f(R), r.setSelectionBehavior("toggle"));
    }
  }), W = (R) => {
    $.current === "touch" && p.current && R.preventDefault();
  }, H = r.isLink(a) ? (R) => {
    $r.isOpening || R.preventDefault();
  } : void 0;
  return {
    itemProps: te(g, m || S ? O : {}, D ? F : {}, {
      onDoubleClick: E,
      onDragStartCapture: W,
      onClick: H,
      id: t
    }),
    isPressed: _,
    isSelected: r.isSelected(a),
    isFocused: r.isFocused && r.focusedKey === a,
    isDisabled: s,
    allowsSelection: m,
    hasAction: k
  };
}
function Pd() {
  let e = window.event;
  return (e == null ? void 0 : e.key) === "Enter";
}
function Cd() {
  let e = window.event;
  return (e == null ? void 0 : e.key) === " " || (e == null ? void 0 : e.code) === "Space";
}
class Td {
  getItemRect(t) {
    let r = this.ref.current;
    if (!r) return null;
    let a = t != null ? r.querySelector(`[data-key="${CSS.escape(t.toString())}"]`) : null;
    if (!a) return null;
    let i = r.getBoundingClientRect(), o = a.getBoundingClientRect();
    return {
      x: o.left - i.left + r.scrollLeft,
      y: o.top - i.top + r.scrollTop,
      width: o.width,
      height: o.height
    };
  }
  getContentSize() {
    let t = this.ref.current;
    var r, a;
    return {
      width: (r = t == null ? void 0 : t.scrollWidth) !== null && r !== void 0 ? r : 0,
      height: (a = t == null ? void 0 : t.scrollHeight) !== null && a !== void 0 ? a : 0
    };
  }
  getVisibleRect() {
    let t = this.ref.current;
    var r, a, i, o;
    return {
      x: (r = t == null ? void 0 : t.scrollLeft) !== null && r !== void 0 ? r : 0,
      y: (a = t == null ? void 0 : t.scrollTop) !== null && a !== void 0 ? a : 0,
      width: (i = t == null ? void 0 : t.offsetWidth) !== null && i !== void 0 ? i : 0,
      height: (o = t == null ? void 0 : t.offsetHeight) !== null && o !== void 0 ? o : 0
    };
  }
  constructor(t) {
    this.ref = t;
  }
}
class _l {
  isDisabled(t) {
    var r;
    return this.disabledBehavior === "all" && (((r = t.props) === null || r === void 0 ? void 0 : r.isDisabled) || this.disabledKeys.has(t.key));
  }
  findNextNonDisabled(t, r) {
    let a = t;
    for (; a != null; ) {
      let i = this.collection.getItem(a);
      if ((i == null ? void 0 : i.type) === "item" && !this.isDisabled(i)) return a;
      a = r(a);
    }
    return null;
  }
  getNextKey(t) {
    let r = t;
    return r = this.collection.getKeyAfter(r), this.findNextNonDisabled(r, (a) => this.collection.getKeyAfter(a));
  }
  getPreviousKey(t) {
    let r = t;
    return r = this.collection.getKeyBefore(r), this.findNextNonDisabled(r, (a) => this.collection.getKeyBefore(a));
  }
  findKey(t, r, a) {
    let i = t, o = this.layoutDelegate.getItemRect(i);
    if (!o || i == null) return null;
    let n = o;
    do {
      if (i = r(i), i == null) break;
      o = this.layoutDelegate.getItemRect(i);
    } while (o && a(n, o) && i != null);
    return i;
  }
  isSameRow(t, r) {
    return t.y === r.y || t.x !== r.x;
  }
  isSameColumn(t, r) {
    return t.x === r.x || t.y !== r.y;
  }
  getKeyBelow(t) {
    return this.layout === "grid" && this.orientation === "vertical" ? this.findKey(t, (r) => this.getNextKey(r), this.isSameRow) : this.getNextKey(t);
  }
  getKeyAbove(t) {
    return this.layout === "grid" && this.orientation === "vertical" ? this.findKey(t, (r) => this.getPreviousKey(r), this.isSameRow) : this.getPreviousKey(t);
  }
  getNextColumn(t, r) {
    return r ? this.getPreviousKey(t) : this.getNextKey(t);
  }
  getKeyRightOf(t) {
    let r = this.direction === "ltr" ? "getKeyRightOf" : "getKeyLeftOf";
    return this.layoutDelegate[r] ? (t = this.layoutDelegate[r](t), this.findNextNonDisabled(t, (a) => this.layoutDelegate[r](a))) : this.layout === "grid" ? this.orientation === "vertical" ? this.getNextColumn(t, this.direction === "rtl") : this.findKey(t, (a) => this.getNextColumn(a, this.direction === "rtl"), this.isSameColumn) : this.orientation === "horizontal" ? this.getNextColumn(t, this.direction === "rtl") : null;
  }
  getKeyLeftOf(t) {
    let r = this.direction === "ltr" ? "getKeyLeftOf" : "getKeyRightOf";
    return this.layoutDelegate[r] ? (t = this.layoutDelegate[r](t), this.findNextNonDisabled(t, (a) => this.layoutDelegate[r](a))) : this.layout === "grid" ? this.orientation === "vertical" ? this.getNextColumn(t, this.direction === "ltr") : this.findKey(t, (a) => this.getNextColumn(a, this.direction === "ltr"), this.isSameColumn) : this.orientation === "horizontal" ? this.getNextColumn(t, this.direction === "ltr") : null;
  }
  getFirstKey() {
    let t = this.collection.getFirstKey();
    return this.findNextNonDisabled(t, (r) => this.collection.getKeyAfter(r));
  }
  getLastKey() {
    let t = this.collection.getLastKey();
    return this.findNextNonDisabled(t, (r) => this.collection.getKeyBefore(r));
  }
  getKeyPageAbove(t) {
    let r = this.ref.current, a = this.layoutDelegate.getItemRect(t);
    if (!a) return null;
    if (r && !Oa(r)) return this.getFirstKey();
    let i = t;
    if (this.orientation === "horizontal") {
      let o = Math.max(0, a.x + a.width - this.layoutDelegate.getVisibleRect().width);
      for (; a && a.x > o && i != null; )
        i = this.getKeyAbove(i), a = i == null ? null : this.layoutDelegate.getItemRect(i);
    } else {
      let o = Math.max(0, a.y + a.height - this.layoutDelegate.getVisibleRect().height);
      for (; a && a.y > o && i != null; )
        i = this.getKeyAbove(i), a = i == null ? null : this.layoutDelegate.getItemRect(i);
    }
    return i ?? this.getFirstKey();
  }
  getKeyPageBelow(t) {
    let r = this.ref.current, a = this.layoutDelegate.getItemRect(t);
    if (!a) return null;
    if (r && !Oa(r)) return this.getLastKey();
    let i = t;
    if (this.orientation === "horizontal") {
      let o = Math.min(this.layoutDelegate.getContentSize().width, a.y - a.width + this.layoutDelegate.getVisibleRect().width);
      for (; a && a.x < o && i != null; )
        i = this.getKeyBelow(i), a = i == null ? null : this.layoutDelegate.getItemRect(i);
    } else {
      let o = Math.min(this.layoutDelegate.getContentSize().height, a.y - a.height + this.layoutDelegate.getVisibleRect().height);
      for (; a && a.y < o && i != null; )
        i = this.getKeyBelow(i), a = i == null ? null : this.layoutDelegate.getItemRect(i);
    }
    return i ?? this.getLastKey();
  }
  getKeyForSearch(t, r) {
    if (!this.collator) return null;
    let a = this.collection, i = r || this.getFirstKey();
    for (; i != null; ) {
      let o = a.getItem(i);
      if (!o) return null;
      let n = o.textValue.slice(0, t.length);
      if (o.textValue && this.collator.compare(n, t) === 0) return i;
      i = this.getNextKey(i);
    }
    return null;
  }
  constructor(...t) {
    if (t.length === 1) {
      let r = t[0];
      this.collection = r.collection, this.ref = r.ref, this.collator = r.collator, this.disabledKeys = r.disabledKeys || /* @__PURE__ */ new Set(), this.disabledBehavior = r.disabledBehavior || "all", this.orientation = r.orientation || "vertical", this.direction = r.direction, this.layout = r.layout || "stack", this.layoutDelegate = r.layoutDelegate || new Td(r.ref);
    } else
      this.collection = t[0], this.disabledKeys = t[1], this.ref = t[2], this.collator = t[3], this.layout = "stack", this.orientation = "vertical", this.disabledBehavior = "all", this.layoutDelegate = new Td(this.ref);
    this.layout === "stack" && this.orientation === "vertical" && (this.getKeyLeftOf = void 0, this.getKeyRightOf = void 0);
  }
}
function y6(e) {
  let { selectionManager: t, collection: r, disabledKeys: a, ref: i, keyboardDelegate: o, layoutDelegate: n } = e, l = ml({
    usage: "search",
    sensitivity: "base"
  }), s = t.disabledBehavior, d = G(() => o || new _l({
    collection: r,
    disabledKeys: a,
    disabledBehavior: s,
    ref: i,
    collator: l,
    layoutDelegate: n
  }), [
    o,
    n,
    r,
    a,
    i,
    l,
    s
  ]), { collectionProps: c } = m6({
    ...e,
    ref: i,
    selectionManager: t,
    keyboardDelegate: d
  });
  return {
    listProps: c
  };
}
function x6(e, t, r) {
  let a = Qe(e, {
    labelable: !0
  }), i = e.selectionBehavior || "toggle", o = e.linkBehavior || (i === "replace" ? "action" : "override");
  i === "toggle" && o === "action" && (o = "override");
  let { listProps: n } = y6({
    ...e,
    ref: r,
    selectionManager: t.selectionManager,
    collection: t.collection,
    disabledKeys: t.disabledKeys,
    linkBehavior: o
  }), { focusWithinProps: l } = eo({
    onFocusWithin: e.onFocus,
    onBlurWithin: e.onBlur,
    onFocusWithinChange: e.onFocusChange
  }), s = dt(e.id);
  kl.set(t, {
    id: s,
    shouldUseVirtualFocus: e.shouldUseVirtualFocus,
    shouldSelectOnPressUp: e.shouldSelectOnPressUp,
    shouldFocusOnHover: e.shouldFocusOnHover,
    isVirtualized: e.isVirtualized,
    onAction: e.onAction,
    linkBehavior: o
  });
  let { labelProps: d, fieldProps: c } = xl({
    ...e,
    id: s,
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: "span"
  });
  return {
    labelProps: d,
    listBoxProps: te(a, l, t.selectionManager.selectionMode === "multiple" ? {
      "aria-multiselectable": "true"
    } : {}, {
      role: "listbox",
      ...te(c, n)
    })
  };
}
class k6 {
  build(t, r) {
    return this.context = r, Id(() => this.iterateCollection(t));
  }
  *iterateCollection(t) {
    let { children: r, items: a } = t;
    if (z.isValidElement(r) && r.type === z.Fragment) yield* this.iterateCollection({
      children: r.props.children,
      items: a
    });
    else if (typeof r == "function") {
      if (!a) throw new Error("props.children was a function but props.items is missing");
      let i = 0;
      for (let o of a)
        yield* this.getFullNode({
          value: o,
          index: i
        }, {
          renderer: r
        }), i++;
    } else {
      let i = [];
      z.Children.forEach(r, (n) => {
        n && i.push(n);
      });
      let o = 0;
      for (let n of i) {
        let l = this.getFullNode({
          element: n,
          index: o
        }, {});
        for (let s of l)
          o++, yield s;
      }
    }
  }
  getKey(t, r, a, i) {
    if (t.key != null) return t.key;
    if (r.type === "cell" && r.key != null) return `${i}${r.key}`;
    let o = r.value;
    if (o != null) {
      var n;
      let l = (n = o.key) !== null && n !== void 0 ? n : o.id;
      if (l == null) throw new Error("No key found for item");
      return l;
    }
    return i ? `${i}.${r.index}` : `$.${r.index}`;
  }
  getChildState(t, r) {
    return {
      renderer: r.renderer || t.renderer
    };
  }
  *getFullNode(t, r, a, i) {
    if (z.isValidElement(t.element) && t.element.type === z.Fragment) {
      let b = [];
      z.Children.forEach(t.element.props.children, (x) => {
        b.push(x);
      });
      var o;
      let m = (o = t.index) !== null && o !== void 0 ? o : 0;
      for (const x of b) yield* this.getFullNode({
        element: x,
        index: m++
      }, r, a, i);
      return;
    }
    let n = t.element;
    if (!n && t.value && r && r.renderer) {
      let b = this.cache.get(t.value);
      if (b && (!b.shouldInvalidate || !b.shouldInvalidate(this.context))) {
        b.index = t.index, b.parentKey = i ? i.key : null, yield b;
        return;
      }
      n = r.renderer(t.value);
    }
    if (z.isValidElement(n)) {
      let b = n.type;
      if (typeof b != "function" && typeof b.getCollectionNode != "function") {
        let T = n.type;
        throw new Error(`Unknown element <${T}> in collection.`);
      }
      let m = b.getCollectionNode(n.props, this.context);
      var l;
      let x = (l = t.index) !== null && l !== void 0 ? l : 0, S = m.next();
      for (; !S.done && S.value; ) {
        let T = S.value;
        t.index = x;
        var s;
        let k = (s = T.key) !== null && s !== void 0 ? s : null;
        k == null && (k = T.element ? null : this.getKey(n, t, r, a));
        let D = [
          ...this.getFullNode({
            ...T,
            key: k,
            index: x,
            wrapper: _6(t.wrapper, T.wrapper)
          }, this.getChildState(r, T), a ? `${a}${n.key}` : n.key, i)
        ];
        for (let p of D) {
          var d, c;
          p.value = (c = (d = T.value) !== null && d !== void 0 ? d : t.value) !== null && c !== void 0 ? c : null, p.value && this.cache.set(p.value, p);
          var h;
          if (t.type && p.type !== t.type) throw new Error(`Unsupported type <${Fo(p.type)}> in <${Fo((h = i == null ? void 0 : i.type) !== null && h !== void 0 ? h : "unknown parent type")}>. Only <${Fo(t.type)}> is supported.`);
          x++, yield p;
        }
        S = m.next(D);
      }
      return;
    }
    if (t.key == null || t.type == null) return;
    let u = this;
    var f, g;
    let v = {
      type: t.type,
      props: t.props,
      key: t.key,
      parentKey: i ? i.key : null,
      value: (f = t.value) !== null && f !== void 0 ? f : null,
      level: i ? i.level + 1 : 0,
      index: t.index,
      rendered: t.rendered,
      textValue: (g = t.textValue) !== null && g !== void 0 ? g : "",
      "aria-label": t["aria-label"],
      wrapper: t.wrapper,
      shouldInvalidate: t.shouldInvalidate,
      hasChildNodes: t.hasChildNodes || !1,
      childNodes: Id(function* () {
        if (!t.hasChildNodes || !t.childNodes) return;
        let b = 0;
        for (let m of t.childNodes()) {
          m.key != null && (m.key = `${v.key}${m.key}`);
          let x = u.getFullNode({
            ...m,
            index: b
          }, u.getChildState(r, m), v.key, v);
          for (let S of x)
            b++, yield S;
        }
      })
    };
    yield v;
  }
  constructor() {
    this.cache = /* @__PURE__ */ new WeakMap();
  }
}
function Id(e) {
  let t = [], r = null;
  return {
    *[Symbol.iterator]() {
      for (let a of t) yield a;
      r || (r = e());
      for (let a of r)
        t.push(a), yield a;
    }
  };
}
function _6(e, t) {
  if (e && t) return (r) => e(t(r));
  if (e) return e;
  if (t) return t;
}
function Fo(e) {
  return e[0].toUpperCase() + e.slice(1);
}
function S6(e, t, r) {
  let a = G(() => new k6(), []), { children: i, items: o, collection: n } = e;
  return G(() => {
    if (n) return n;
    let s = a.build({
      children: i,
      items: o
    }, r);
    return t(s);
  }, [
    a,
    i,
    o,
    n,
    r,
    t
  ]);
}
function fg(e, t) {
  return typeof t.getChildren == "function" ? t.getChildren(e.key) : e.childNodes;
}
function w6(e) {
  return $6(e);
}
function $6(e, t) {
  for (let r of e)
    return r;
}
function No(e, t, r) {
  if (t.parentKey === r.parentKey) return t.index - r.index;
  let a = [
    ...Rd(e, t),
    t
  ], i = [
    ...Rd(e, r),
    r
  ], o = a.slice(0, i.length).findIndex((n, l) => n !== i[l]);
  return o !== -1 ? (t = a[o], r = i[o], t.index - r.index) : a.findIndex((n) => n === r) >= 0 ? 1 : (i.findIndex((n) => n === t) >= 0, -1);
}
function Rd(e, t) {
  let r = [], a = t;
  for (; (a == null ? void 0 : a.parentKey) != null; )
    a = e.getItem(a.parentKey), a && r.unshift(a);
  return r;
}
const Dd = /* @__PURE__ */ new WeakMap();
function E6(e) {
  let t = Dd.get(e);
  if (t != null) return t;
  let r = 0, a = (i) => {
    for (let o of i) o.type === "section" ? a(fg(o, e)) : r++;
  };
  return a(e), Dd.set(e, r), r;
}
function P6(e, t, r) {
  var a, i;
  let { key: o } = e, n = kl.get(t);
  var l;
  let s = (l = e.isDisabled) !== null && l !== void 0 ? l : t.selectionManager.isDisabled(o);
  var d;
  let c = (d = e.isSelected) !== null && d !== void 0 ? d : t.selectionManager.isSelected(o);
  var h;
  let u = (h = e.shouldSelectOnPressUp) !== null && h !== void 0 ? h : n == null ? void 0 : n.shouldSelectOnPressUp;
  var f;
  let g = (f = e.shouldFocusOnHover) !== null && f !== void 0 ? f : n == null ? void 0 : n.shouldFocusOnHover;
  var v;
  let b = (v = e.shouldUseVirtualFocus) !== null && v !== void 0 ? v : n == null ? void 0 : n.shouldUseVirtualFocus;
  var m;
  let x = (m = e.isVirtualized) !== null && m !== void 0 ? m : n == null ? void 0 : n.isVirtualized, S = Oi(), T = Oi(), k = {
    role: "option",
    "aria-disabled": s || void 0,
    "aria-selected": t.selectionManager.selectionMode !== "none" ? c : void 0
  };
  ur() && dl() || (k["aria-label"] = e["aria-label"], k["aria-labelledby"] = S, k["aria-describedby"] = T);
  let $ = t.collection.getItem(o);
  if (x) {
    let H = Number($ == null ? void 0 : $.index);
    k["aria-posinset"] = Number.isNaN(H) ? void 0 : H + 1, k["aria-setsize"] = E6(t.collection);
  }
  let D = n != null && n.onAction ? () => {
    var H;
    return n == null || (H = n.onAction) === null || H === void 0 ? void 0 : H.call(n, o);
  } : void 0, p = g6(t, o), { itemProps: w, isPressed: I, isFocused: P, hasAction: O, allowsSelection: _ } = b6({
    selectionManager: t.selectionManager,
    key: o,
    ref: r,
    shouldSelectOnPressUp: u,
    allowsDifferentPressOrigin: u && g,
    isVirtualized: x,
    shouldUseVirtualFocus: b,
    isDisabled: s,
    onAction: D || !($ == null || (a = $.props) === null || a === void 0) && a.onAction ? wr($ == null || (i = $.props) === null || i === void 0 ? void 0 : i.onAction, D) : void 0,
    linkBehavior: n == null ? void 0 : n.linkBehavior,
    id: p
  }), { hoverProps: E } = na({
    isDisabled: s || !g,
    onHoverStart() {
      Fa() || (t.selectionManager.setFocused(!0), t.selectionManager.setFocusedKey(o));
    }
  }), F = Qe($ == null ? void 0 : $.props);
  delete F.id;
  let W = U0($ == null ? void 0 : $.props);
  return {
    optionProps: {
      ...k,
      ...te(F, w, E, W),
      id: p
    },
    labelProps: {
      id: S
    },
    descriptionProps: {
      id: T
    },
    isFocused: P,
    isFocusVisible: P && Fa(),
    isSelected: c,
    isDisabled: s,
    isPressed: I,
    allowsSelection: _,
    hasAction: O
  };
}
function C6(e) {
  let { heading: t, "aria-label": r } = e, a = dt();
  return {
    itemProps: {
      role: "presentation"
    },
    headingProps: t ? {
      // Techincally, listbox cannot contain headings according to ARIA.
      // We hide the heading from assistive technology, using role="presentation",
      // and only use it as a visual label for the nested group.
      id: a,
      role: "presentation"
    } : {},
    groupProps: {
      role: "group",
      "aria-label": r,
      "aria-labelledby": t ? a : void 0
    }
  };
}
var gg = {};
gg = {
  longPressMessage: "اضغط مطولاً أو اضغط على Alt + السهم لأسفل لفتح القائمة"
};
var pg = {};
pg = {
  longPressMessage: "Натиснете продължително или натиснете Alt+ стрелка надолу, за да отворите менюто"
};
var vg = {};
vg = {
  longPressMessage: "Dlouhým stiskem nebo stisknutím kláves Alt + šipka dolů otevřete nabídku"
};
var mg = {};
mg = {
  longPressMessage: "Langt tryk eller tryk på Alt + pil ned for at åbne menuen"
};
var bg = {};
bg = {
  longPressMessage: "Drücken Sie lange oder drücken Sie Alt + Nach-unten, um das Menü zu öffnen"
};
var yg = {};
yg = {
  longPressMessage: "Πιέστε παρατεταμένα ή πατήστε Alt + κάτω βέλος για να ανοίξετε το μενού"
};
var xg = {};
xg = {
  longPressMessage: "Long press or press Alt + ArrowDown to open menu"
};
var kg = {};
kg = {
  longPressMessage: "Mantenga pulsado o pulse Alt + flecha abajo para abrir el menú"
};
var _g = {};
_g = {
  longPressMessage: "Menüü avamiseks vajutage pikalt või vajutage klahve Alt + allanool"
};
var Sg = {};
Sg = {
  longPressMessage: "Avaa valikko painamalla pohjassa tai näppäinyhdistelmällä Alt + Alanuoli"
};
var wg = {};
wg = {
  longPressMessage: "Appuyez de manière prolongée ou appuyez sur Alt + Flèche vers le bas pour ouvrir le menu."
};
var $g = {};
$g = {
  longPressMessage: "לחץ לחיצה ארוכה או הקש Alt + ArrowDown כדי לפתוח את התפריט"
};
var Eg = {};
Eg = {
  longPressMessage: "Dugo pritisnite ili pritisnite Alt + strelicu prema dolje za otvaranje izbornika"
};
var Pg = {};
Pg = {
  longPressMessage: "Nyomja meg hosszan, vagy nyomja meg az Alt + lefele nyíl gombot a menü megnyitásához"
};
var Cg = {};
Cg = {
  longPressMessage: "Premere a lungo o premere Alt + Freccia giù per aprire il menu"
};
var Tg = {};
Tg = {
  longPressMessage: "長押しまたは Alt+下矢印キーでメニューを開く"
};
var Ig = {};
Ig = {
  longPressMessage: "길게 누르거나 Alt + 아래쪽 화살표를 눌러 메뉴 열기"
};
var Rg = {};
Rg = {
  longPressMessage: "Norėdami atidaryti meniu, nuspaudę palaikykite arba paspauskite „Alt + ArrowDown“."
};
var Dg = {};
Dg = {
  longPressMessage: "Lai atvērtu izvēlni, turiet nospiestu vai nospiediet taustiņu kombināciju Alt + lejupvērstā bultiņa"
};
var Ag = {};
Ag = {
  longPressMessage: "Langt trykk eller trykk Alt + PilNed for å åpne menyen"
};
var zg = {};
zg = {
  longPressMessage: "Druk lang op Alt + pijl-omlaag of druk op Alt om het menu te openen"
};
var Og = {};
Og = {
  longPressMessage: "Naciśnij i przytrzymaj lub naciśnij klawisze Alt + Strzałka w dół, aby otworzyć menu"
};
var Fg = {};
Fg = {
  longPressMessage: "Pressione e segure ou pressione Alt + Seta para baixo para abrir o menu"
};
var Ng = {};
Ng = {
  longPressMessage: "Prima continuamente ou prima Alt + Seta Para Baixo para abrir o menu"
};
var Lg = {};
Lg = {
  longPressMessage: "Apăsați lung sau apăsați pe Alt + săgeată în jos pentru a deschide meniul"
};
var Mg = {};
Mg = {
  longPressMessage: "Нажмите и удерживайте или нажмите Alt + Стрелка вниз, чтобы открыть меню"
};
var Bg = {};
Bg = {
  longPressMessage: "Ponuku otvoríte dlhým stlačením alebo stlačením klávesu Alt + klávesu so šípkou nadol"
};
var Kg = {};
Kg = {
  longPressMessage: "Za odprtje menija pritisnite in držite gumb ali pritisnite Alt+puščica navzdol"
};
var Wg = {};
Wg = {
  longPressMessage: "Dugo pritisnite ili pritisnite Alt + strelicu prema dole da otvorite meni"
};
var jg = {};
jg = {
  longPressMessage: "Håll nedtryckt eller tryck på Alt + pil nedåt för att öppna menyn"
};
var Vg = {};
Vg = {
  longPressMessage: "Menüyü açmak için uzun basın veya Alt + Aşağı Ok tuşuna basın"
};
var Hg = {};
Hg = {
  longPressMessage: "Довго або звичайно натисніть комбінацію клавіш Alt і стрілка вниз, щоб відкрити меню"
};
var Ug = {};
Ug = {
  longPressMessage: "长按或按 Alt + 向下方向键以打开菜单"
};
var Gg = {};
Gg = {
  longPressMessage: "長按或按 Alt+向下鍵以開啟功能表"
};
var Yg = {};
Yg = {
  "ar-AE": gg,
  "bg-BG": pg,
  "cs-CZ": vg,
  "da-DK": mg,
  "de-DE": bg,
  "el-GR": yg,
  "en-US": xg,
  "es-ES": kg,
  "et-EE": _g,
  "fi-FI": Sg,
  "fr-FR": wg,
  "he-IL": $g,
  "hr-HR": Eg,
  "hu-HU": Pg,
  "it-IT": Cg,
  "ja-JP": Tg,
  "ko-KR": Ig,
  "lt-LT": Rg,
  "lv-LV": Dg,
  "nb-NO": Ag,
  "nl-NL": zg,
  "pl-PL": Og,
  "pt-BR": Fg,
  "pt-PT": Ng,
  "ro-RO": Lg,
  "ru-RU": Mg,
  "sk-SK": Bg,
  "sl-SI": Kg,
  "sr-SP": Wg,
  "sv-SE": jg,
  "tr-TR": Vg,
  "uk-UA": Hg,
  "zh-CN": Ug,
  "zh-TW": Gg
};
function T6(e) {
  return e && e.__esModule ? e.default : e;
}
function I6(e, t, r) {
  let { type: a = "menu", isDisabled: i, trigger: o = "press" } = e, n = dt(), { triggerProps: l, overlayProps: s } = q_({
    type: a
  }, t, r), d = (f) => {
    if (!i && !(o === "longPress" && !f.altKey) && r && r.current)
      switch (f.key) {
        case "Enter":
        case " ":
          if (o === "longPress") return;
        case "ArrowDown":
          "continuePropagation" in f || f.stopPropagation(), f.preventDefault(), t.toggle("first");
          break;
        case "ArrowUp":
          "continuePropagation" in f || f.stopPropagation(), f.preventDefault(), t.toggle("last");
          break;
        default:
          "continuePropagation" in f && f.continuePropagation();
      }
  }, c = vl(T6(Yg), "@react-aria/menu"), { longPressProps: h } = gf({
    isDisabled: i || o !== "longPress",
    accessibilityDescription: c.format("longPressMessage"),
    onLongPressStart() {
      t.close();
    },
    onLongPress() {
      t.open("first");
    }
  }), u = {
    onPressStart(f) {
      f.pointerType !== "touch" && f.pointerType !== "keyboard" && !i && t.open(f.pointerType === "virtual" ? "first" : null);
    },
    onPress(f) {
      f.pointerType === "touch" && !i && t.toggle();
    }
  };
  return delete l.onPress, {
    // @ts-ignore - TODO we pass out both DOMAttributes AND AriaButtonProps, but useButton will discard the longPress event handlers, it's only through PressResponder magic that this works for RSP and RAC. it does not work in aria examples
    menuTriggerProps: {
      ...l,
      ...o === "press" ? u : h,
      id: n,
      onKeyDown: d
    },
    menuProps: {
      ...s,
      "aria-labelledby": n,
      autoFocus: t.focusStrategy || !0,
      onClose: t.close
    }
  };
}
function R6(e) {
  let { value: t = 0, minValue: r = 0, maxValue: a = 100, valueLabel: i, isIndeterminate: o, formatOptions: n = {
    style: "percent"
  } } = e, l = Qe(e, {
    labelable: !0
  }), { labelProps: s, fieldProps: d } = xl({
    ...e,
    // Progress bar is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: "span"
  });
  t = Fi(t, r, a);
  let c = (t - r) / (a - r), h = E_(n);
  if (!o && !i) {
    let u = n.style === "percent" ? c : t;
    i = h.format(u);
  }
  return {
    progressBarProps: te(l, {
      ...d,
      "aria-valuenow": o ? void 0 : t,
      "aria-valuemin": r,
      "aria-valuemax": a,
      "aria-valuetext": o ? void 0 : i,
      role: "progressbar"
    }),
    labelProps: s
  };
}
const qg = /* @__PURE__ */ new WeakMap();
function D6(e, t, r) {
  let { keyboardDelegate: a, isDisabled: i, isRequired: o, name: n, validationBehavior: l = "aria" } = e, s = ml({
    usage: "search",
    sensitivity: "base"
  }), d = G(() => a || new _l(t.collection, t.disabledKeys, r, s), [
    a,
    t.collection,
    t.disabledKeys,
    s
  ]), { menuTriggerProps: c, menuProps: h } = I6({
    isDisabled: i,
    type: "listbox"
  }, t, r), u = (p) => {
    switch (p.key) {
      case "ArrowLeft": {
        var w, I;
        p.preventDefault();
        let _ = t.selectedKey != null ? (w = d.getKeyAbove) === null || w === void 0 ? void 0 : w.call(d, t.selectedKey) : (I = d.getFirstKey) === null || I === void 0 ? void 0 : I.call(d);
        _ && t.setSelectedKey(_);
        break;
      }
      case "ArrowRight": {
        var P, O;
        p.preventDefault();
        let _ = t.selectedKey != null ? (P = d.getKeyBelow) === null || P === void 0 ? void 0 : P.call(d, t.selectedKey) : (O = d.getFirstKey) === null || O === void 0 ? void 0 : O.call(d);
        _ && t.setSelectedKey(_);
        break;
      }
    }
  }, { typeSelectProps: f } = hg({
    keyboardDelegate: d,
    selectionManager: t.selectionManager,
    onTypeSelect(p) {
      t.setSelectedKey(p);
    }
  }), { isInvalid: g, validationErrors: v, validationDetails: b } = t.displayValidation, { labelProps: m, fieldProps: x, descriptionProps: S, errorMessageProps: T } = $f({
    ...e,
    labelElementType: "span",
    isInvalid: g,
    errorMessage: e.errorMessage || v
  });
  f.onKeyDown = f.onKeyDownCapture, delete f.onKeyDownCapture;
  let k = Qe(e, {
    labelable: !0
  }), $ = te(f, c, x), D = dt();
  return qg.set(t, {
    isDisabled: i,
    isRequired: o,
    name: n,
    validationBehavior: l
  }), {
    labelProps: {
      ...m,
      onClick: () => {
        if (!e.isDisabled) {
          var p;
          (p = r.current) === null || p === void 0 || p.focus(), ff("keyboard");
        }
      }
    },
    triggerProps: te(k, {
      ...$,
      isDisabled: i,
      onKeyDown: wr($.onKeyDown, u, e.onKeyDown),
      onKeyUp: e.onKeyUp,
      "aria-labelledby": [
        D,
        $["aria-labelledby"],
        $["aria-label"] && !$["aria-labelledby"] ? $.id : null
      ].filter(Boolean).join(" "),
      onFocus(p) {
        t.isFocused || (e.onFocus && e.onFocus(p), e.onFocusChange && e.onFocusChange(!0), t.setFocused(!0));
      },
      onBlur(p) {
        t.isOpen || (e.onBlur && e.onBlur(p), e.onFocusChange && e.onFocusChange(!1), t.setFocused(!1));
      }
    }),
    valueProps: {
      id: D
    },
    menuProps: {
      ...h,
      autoFocus: t.focusStrategy || !0,
      shouldSelectOnPressUp: !0,
      shouldFocusOnHover: !0,
      disallowEmptySelection: !0,
      linkBehavior: "selection",
      onBlur: (p) => {
        p.currentTarget.contains(p.relatedTarget) || (e.onBlur && e.onBlur(p), e.onFocusChange && e.onFocusChange(!1), t.setFocused(!1));
      },
      "aria-labelledby": [
        x["aria-labelledby"],
        $["aria-label"] && !x["aria-labelledby"] ? $.id : null
      ].filter(Boolean).join(" ")
    },
    descriptionProps: S,
    errorMessageProps: T,
    isInvalid: g,
    validationErrors: v,
    validationDetails: b
  };
}
function A6(e, t, r) {
  let a = qg.get(t) || {}, { autoComplete: i, name: o = a.name, isDisabled: n = a.isDisabled } = e, { validationBehavior: l, isRequired: s } = a, { visuallyHiddenProps: d } = Ef();
  ul(e.selectRef, t.selectedKey, t.setSelectedKey), yl({
    validationBehavior: l,
    focus: () => {
      var h;
      return (h = r.current) === null || h === void 0 ? void 0 : h.focus();
    }
  }, t, e.selectRef);
  var c;
  return {
    containerProps: {
      ...d,
      "aria-hidden": !0,
      // @ts-ignore
      "data-react-aria-prevent-focus": !0,
      // @ts-ignore
      "data-a11y-ignore": "aria-hidden-focus"
    },
    inputProps: {
      style: {
        display: "none"
      }
    },
    selectProps: {
      tabIndex: -1,
      autoComplete: i,
      disabled: n,
      required: l === "native" && s,
      name: o,
      value: (c = t.selectedKey) !== null && c !== void 0 ? c : "",
      onChange: (h) => t.setSelectedKey(h.target.value)
    }
  };
}
function z6(e) {
  let { state: t, triggerRef: r, label: a, name: i, isDisabled: o } = e, n = B(null), { containerProps: l, selectProps: s } = A6({
    ...e,
    selectRef: n
  }, t, r);
  var d;
  return t.collection.size <= 300 ? /* @__PURE__ */ z.createElement("div", {
    ...l,
    "data-testid": "hidden-select-container"
  }, /* @__PURE__ */ z.createElement("label", null, a, /* @__PURE__ */ z.createElement("select", {
    ...s,
    ref: n
  }, /* @__PURE__ */ z.createElement("option", null), [
    ...t.collection.getKeys()
  ].map((c) => {
    let h = t.collection.getItem(c);
    if (h && h.type === "item") return /* @__PURE__ */ z.createElement("option", {
      key: h.key,
      value: h.key
    }, h.textValue);
  })))) : i ? /* @__PURE__ */ z.createElement("input", {
    type: "hidden",
    autoComplete: s.autoComplete,
    name: i,
    disabled: o,
    value: (d = t.selectedKey) !== null && d !== void 0 ? d : ""
  }) : null;
}
function O6(e, t) {
  let r = Qe(e, {
    labelable: !0
  }), { hoverProps: a } = na({
    onHoverStart: () => t == null ? void 0 : t.open(!0),
    onHoverEnd: () => t == null ? void 0 : t.close()
  });
  return {
    tooltipProps: te(r, a, {
      role: "tooltip"
    })
  };
}
function F6(e, t, r) {
  let { isDisabled: a, trigger: i } = e, o = dt(), n = B(!1), l = B(!1), s = () => {
    (n.current || l.current) && t.open(l.current);
  }, d = (m) => {
    !n.current && !l.current && t.close(m);
  };
  ee(() => {
    let m = (x) => {
      r && r.current && x.key === "Escape" && (x.stopPropagation(), t.close(!0));
    };
    if (t.isOpen)
      return document.addEventListener("keydown", m, !0), () => {
        document.removeEventListener("keydown", m, !0);
      };
  }, [
    r,
    t
  ]);
  let c = () => {
    i !== "focus" && (Na() === "pointer" ? n.current = !0 : n.current = !1, s());
  }, h = () => {
    i !== "focus" && (l.current = !1, n.current = !1, d());
  }, u = () => {
    l.current = !1, n.current = !1, d(!0);
  }, f = () => {
    Fa() && (l.current = !0, s());
  }, g = () => {
    l.current = !1, n.current = !1, d(!0);
  }, { hoverProps: v } = na({
    isDisabled: a,
    onHoverStart: c,
    onHoverEnd: h
  }), { focusableProps: b } = la({
    isDisabled: a,
    onFocus: f,
    onBlur: g
  }, r);
  return {
    triggerProps: {
      "aria-describedby": t.isOpen ? o : void 0,
      ...te(b, v, {
        onPointerDown: u,
        onKeyDown: u
      })
    },
    tooltipProps: {
      id: o
    }
  };
}
const Xg = be({
  className: "bleh-ui-button",
  base: {
    borderRadius: "200",
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    position: "relative",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    borderWidth: "1px",
    borderColor: "transparent",
    cursor: "button",
    flexShrink: "0",
    outline: "0",
    lineHeight: "1.2",
    isolation: "isolate",
    fontWeight: "500",
    transitionProperty: "common",
    transitionDuration: "moderate",
    focusVisibleRing: "outside",
    _disabled: {
      layerStyle: "disabled"
    },
    _icon: {
      flexShrink: "0"
    }
  },
  variants: {
    size: {
      "2xs": {
        h: "600",
        minW: "600",
        fontSize: "300",
        fontWeight: "500",
        lineHeight: "400",
        px: "200",
        gap: "100",
        _icon: {
          width: "400",
          height: "400"
        }
      },
      xs: {
        h: "800",
        minW: "800",
        fontSize: "350",
        fontWeight: "500",
        lineHeight: "400",
        px: "300",
        gap: "100",
        _icon: {
          width: "500",
          height: "500"
        }
      },
      /* sm: {
        h: "900",
        minW: "900",
        px: "350",
        textStyle: "sm",
        gap: "200",
        _icon: {
          width: "400",
          height: "400",
        },
      }, */
      md: {
        h: "1000",
        minW: "1000",
        fontSize: "400",
        lineHeight: "500",
        px: "400",
        gap: "200",
        _icon: {
          width: "600",
          height: "600"
        }
      }
      /*  lg: {
        h: "1100",
        minW: "1100",
        textStyle: "md",
        px: "500",
        gap: "300",
        _icon: {
          width: "500",
          height: "500",
        },
      }, */
      /*  xl: {
        h: "1200",
        minW: "1200",
        textStyle: "md",
        px: "500",
        gap: "250",
        _icon: {
          width: "500",
          height: "500",
        },
      }, */
      /* "2xl": {
        h: "1600",
        minW: "1600",
        textStyle: "lg",
        px: "700",
        gap: "300",
        _icon: {
          width: "600",
          height: "600",
        },
      }, */
    },
    variant: {
      solid: {
        bg: "colorPalette.9",
        color: "colorPalette.contrast",
        _hover: {
          bg: "colorPalette.10"
        },
        _expanded: {
          bg: "colorPalette.10"
        }
      },
      subtle: {
        bg: "colorPalette.3",
        color: "colorPalette.11",
        _hover: {
          bg: "colorPalette.4"
        },
        _expanded: {
          bg: "colorPalette.4"
        }
      },
      outline: {
        borderWidth: "1px",
        borderColor: "colorPalette.7",
        color: "colorPalette.11",
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "moderate",
        _hover: {
          bg: "colorPalette.3",
          borderColor: "colorPalette.8"
        },
        _expanded: {
          bg: "colorPalette.subtle"
        }
      },
      ghost: {
        color: "colorPalette.11",
        _hover: {
          bg: "colorPalette.4"
        },
        _expanded: {
          bg: "colorPalette.4"
        }
      },
      link: {
        color: "colorPalette.11",
        _hover: {
          textDecoration: "underline"
        }
      }
    },
    tone: {
      primary: {
        colorPalette: "primary"
      },
      critical: {
        colorPalette: "error"
      },
      neutral: {
        colorPalette: "neutral"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "subtle"
  }
}), { withContext: N6 } = ct({
  recipe: Xg
}), L6 = N6(
  "button",
  {
    defaultProps: {
      type: "button"
    },
    /** make sure the `onPress` properties won't end up as attribute on the rendered DOM element */
    shouldForwardProp(e, t) {
      const r = !(t != null && t.includes(e)) && !S0.isValidProperty(e);
      return su(e) && r && !e.includes("onPress");
    }
  }
), Sl = V(
  (e, t) => {
    const { as: r, asChild: a, children: i, ...o } = e, n = B(null), l = Et(Cr(n, t)), s = r || (a ? "a" : "button") || "button", { buttonProps: d } = kf(
      {
        ...o,
        elementType: s
      },
      l
    );
    return /* @__PURE__ */ C.jsx(L6, { ...te(o, d, { as: r, asChild: a, ref: l }), children: i });
  }
);
Sl.displayName = "Button";
const i$ = V(
  function(t, r) {
    const {
      children: a,
      portalled: i = !0,
      portalRef: o,
      backdrop: n = !0,
      ...l
    } = t;
    return /* @__PURE__ */ C.jsxs(o2, { disabled: !i, container: o, children: [
      n && /* @__PURE__ */ C.jsx(E0, {}),
      /* @__PURE__ */ C.jsx(g4, { children: /* @__PURE__ */ C.jsx(p4, { ref: r, ...l, asChild: !1, children: a }) })
    ] });
  }
), o$ = V(function(t, r) {
  return /* @__PURE__ */ C.jsx(
    b4,
    {
      position: "absolute",
      top: "2",
      insetEnd: "2",
      ...t,
      asChild: !0,
      children: /* @__PURE__ */ C.jsx(Sl, { size: "xs", ref: r, children: t.children })
    }
  );
}), n$ = h4, l$ = k4, s$ = _4, d$ = x4, c$ = E0, u$ = m4, h$ = v4, f$ = f4, g$ = y4, Zg = V(
  ({ children: e, ...t }, r) => /* @__PURE__ */ C.jsx(Sl, { px: 0, py: 0, ref: r, ...t, children: e })
);
Zg.displayName = "IconButton";
const p$ = V(
  function(t, r) {
    const {
      startElement: a,
      startElementProps: i,
      endElement: o,
      endElementProps: n,
      children: l,
      ...s
    } = t;
    return /* @__PURE__ */ C.jsxs(n4, { ref: r, ...s, children: [
      a && /* @__PURE__ */ C.jsx(Zs, { pointerEvents: "none", ...i, children: a }),
      Qr(l, {
        ...a && { ps: "calc(var(--input-height) - 6px)" },
        ...o && { pe: "calc(var(--input-height) - 6px)" },
        ...l.props
      }),
      o && /* @__PURE__ */ C.jsx(Zs, { placement: "end", ...n, children: o })
    ] });
  }
), Jg = be({
  className: "bleh-ui-link",
  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    color: "colorPalette.11",
    borderRadius: "100",
    focusVisibleRing: "outside",
    bg: "transparent",
    outline: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    _hover: {
      textDecorationThickness: "12%"
    }
  },
  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      xs: {
        fontSize: "300",
        lineHeight: "450"
      },
      sm: {
        fontSize: "350",
        lineHeight: "500"
      },
      md: {
        fontSize: "400",
        lineHeight: "600"
      }
    },
    // style variants
    fontColor: {
      primary: {
        color: "primary"
      },
      inherit: {
        color: "inherit"
      }
    }
  }
}), { withContext: M6 } = ct({ recipe: Jg }), B6 = M6("a"), K6 = V(
  (e, t) => {
    const { as: r, asChild: a, children: i, ...o } = e, n = B(null), l = Et(Cr(n, t)), s = r || (a ? "span" : "a") || "a", { linkProps: d } = h_({ ...o, elementType: s }, l);
    return /* @__PURE__ */ C.jsx(B6, { ...te(o, d, { as: r, asChild: a, ref: l }), children: i });
  }
);
K6.displayName = "Link";
const v$ = (e) => /* @__PURE__ */ C.jsx(T0, { ...e }), m$ = (e) => /* @__PURE__ */ C.jsx(I0, { ...e }), Qg = V(
  (e, t) => /* @__PURE__ */ C.jsx(w4, { ref: t, ...e })
);
Qg.displayName = "SimpleGrid";
const b$ = Object.assign(Qg, {
  Item: P0
}), y$ = (e) => /* @__PURE__ */ C.jsx(R0, { ...e }), x$ = (e) => /* @__PURE__ */ C.jsx(L0, { ...e }), k$ = (e) => /* @__PURE__ */ C.jsx(M0, { ...e }), _$ = (e) => /* @__PURE__ */ C.jsx(A0, { ...e }), S$ = (e) => /* @__PURE__ */ C.jsx(z0, { ...e }), w$ = (e) => /* @__PURE__ */ C.jsx(D0, { ...e }), $$ = (e) => /* @__PURE__ */ C.jsx(F0, { ...e }), E$ = (e) => /* @__PURE__ */ C.jsx(N0, { ...e }), P$ = (e) => /* @__PURE__ */ C.jsx(O0, { ...e }), W6 = V(
  (e, t) => /* @__PURE__ */ C.jsx(q4, { ref: t, ...e })
);
W6.displayName = "Text";
const Ad = Symbol("default");
function Ua({ values: e, children: t }) {
  for (let [r, a] of e)
    t = /* @__PURE__ */ z.createElement(r.Provider, {
      value: a
    }, t);
  return t;
}
function Pt(e) {
  let { className: t, style: r, children: a, defaultClassName: i, defaultChildren: o, defaultStyle: n, values: l } = e;
  return G(() => {
    let s, d, c;
    return typeof t == "function" ? s = t({
      ...l,
      defaultClassName: i
    }) : s = t, typeof r == "function" ? d = r({
      ...l,
      defaultStyle: n || {}
    }) : d = r, typeof a == "function" ? c = a({
      ...l,
      defaultChildren: o
    }) : a == null ? c = o : c = a, {
      className: s ?? i,
      style: d || n ? {
        ...n,
        ...d
      } : void 0,
      children: c ?? o,
      "data-rac": ""
    };
  }, [
    t,
    r,
    a,
    i,
    o,
    n,
    l
  ]);
}
function ro(e, t) {
  let r = Q(e);
  if (t === null)
    return null;
  if (r && typeof r == "object" && "slots" in r && r.slots) {
    let a = new Intl.ListFormat().format(Object.keys(r.slots).map((o) => `"${o}"`));
    if (!t && !r.slots[Ad]) throw new Error(`A slot prop is required. Valid slot names are ${a}.`);
    let i = t || Ad;
    if (!r.slots[i])
      throw new Error(`Invalid slot "${t}". Valid slot names are ${a}.`);
    return r.slots[i];
  }
  return r;
}
function Lt(e, t, r) {
  let a = ro(r, e.slot) || {}, { ref: i, ...o } = a, n = Et(G(() => j0(t, i), [
    t,
    i
  ])), l = te(o, e);
  return "style" in o && o.style && "style" in e && e.style && (typeof o.style == "function" || typeof e.style == "function" ? l.style = (s) => {
    let d = typeof o.style == "function" ? o.style(s) : o.style, c = {
      ...s.defaultStyle,
      ...d
    }, h = typeof e.style == "function" ? e.style({
      ...s,
      defaultStyle: c
    }) : e.style;
    return {
      ...c,
      ...h
    };
  } : l.style = {
    ...o.style,
    ...e.style
  }), [
    l,
    n
  ];
}
function wl() {
  let [e, t] = se(!0), r = B(!1), a = ie((i) => {
    r.current = !0, t(!!i);
  }, []);
  return fe(() => {
    r.current || t(!1);
  }, []), [
    a,
    e
  ];
}
function ep(e) {
  const t = /^(data-.*)$/;
  let r = {};
  for (const a in e) t.test(a) || (r[a] = e[a]);
  return r;
}
class $l {
  get childNodes() {
    throw new Error("childNodes is not supported");
  }
  clone() {
    let t = new $l(this.type, this.key);
    return t.value = this.value, t.level = this.level, t.hasChildNodes = this.hasChildNodes, t.rendered = this.rendered, t.textValue = this.textValue, t["aria-label"] = this["aria-label"], t.index = this.index, t.parentKey = this.parentKey, t.prevKey = this.prevKey, t.nextKey = this.nextKey, t.firstChildKey = this.firstChildKey, t.lastChildKey = this.lastChildKey, t.props = this.props, t.render = this.render, t;
  }
  constructor(t, r) {
    this.value = null, this.level = 0, this.hasChildNodes = !1, this.rendered = null, this.textValue = "", this["aria-label"] = void 0, this.index = 0, this.parentKey = null, this.prevKey = null, this.nextKey = null, this.firstChildKey = null, this.lastChildKey = null, this.props = {}, this.type = t, this.key = r;
  }
}
class El {
  get size() {
    return this.keyMap.size;
  }
  getKeys() {
    return this.keyMap.keys();
  }
  *[Symbol.iterator]() {
    let t = this.firstKey != null ? this.keyMap.get(this.firstKey) : void 0;
    for (; t; )
      yield t, t = t.nextKey != null ? this.keyMap.get(t.nextKey) : void 0;
  }
  getChildren(t) {
    let r = this.keyMap;
    return {
      *[Symbol.iterator]() {
        let a = r.get(t), i = (a == null ? void 0 : a.firstChildKey) != null ? r.get(a.firstChildKey) : null;
        for (; i; )
          yield i, i = i.nextKey != null ? r.get(i.nextKey) : void 0;
      }
    };
  }
  getKeyBefore(t) {
    let r = this.keyMap.get(t);
    if (!r) return null;
    if (r.prevKey != null) {
      for (r = this.keyMap.get(r.prevKey); r && r.type !== "item" && r.lastChildKey != null; ) r = this.keyMap.get(r.lastChildKey);
      var a;
      return (a = r == null ? void 0 : r.key) !== null && a !== void 0 ? a : null;
    }
    return r.parentKey;
  }
  getKeyAfter(t) {
    let r = this.keyMap.get(t);
    if (!r) return null;
    if (r.type !== "item" && r.firstChildKey != null) return r.firstChildKey;
    for (; r; ) {
      if (r.nextKey != null) return r.nextKey;
      if (r.parentKey != null) r = this.keyMap.get(r.parentKey);
      else return null;
    }
    return null;
  }
  getFirstKey() {
    return this.firstKey;
  }
  getLastKey() {
    let t = this.lastKey != null ? this.keyMap.get(this.lastKey) : null;
    for (; (t == null ? void 0 : t.lastChildKey) != null; ) t = this.keyMap.get(t.lastChildKey);
    var r;
    return (r = t == null ? void 0 : t.key) !== null && r !== void 0 ? r : null;
  }
  getItem(t) {
    var r;
    return (r = this.keyMap.get(t)) !== null && r !== void 0 ? r : null;
  }
  at() {
    throw new Error("Not implemented");
  }
  clone() {
    let t = this.constructor, r = new t();
    return r.keyMap = new Map(this.keyMap), r.firstKey = this.firstKey, r.lastKey = this.lastKey, r;
  }
  addNode(t) {
    if (this.frozen) throw new Error("Cannot add a node to a frozen collection");
    this.keyMap.set(t.key, t);
  }
  removeNode(t) {
    if (this.frozen) throw new Error("Cannot remove a node to a frozen collection");
    this.keyMap.delete(t);
  }
  commit(t, r, a = !1) {
    if (this.frozen) throw new Error("Cannot commit a frozen collection");
    this.firstKey = t, this.lastKey = r, this.frozen = !a;
  }
  // TODO: this is pretty specific to menu, will need to check if it is generic enough
  // Will need to handle varying levels I assume but will revisit after I get searchable menu working for base menu
  // TODO: an alternative is to simply walk the collection and add all item nodes that match the filter and any sections/separators we encounter
  // to an array, then walk that new array and fix all the next/Prev keys while adding them to the new collection
  filter(t) {
    let r = new El(), a = null;
    for (let i of this)
      if (i.type === "section" && i.hasChildNodes) {
        let o = i.clone(), n = null;
        for (let l of this.getChildren(i.key)) if (t(l.textValue) || l.type === "header") {
          let s = l.clone();
          n == null && (o.firstChildKey = s.key), r.firstKey == null && (r.firstKey = o.key), n && n.parentKey === s.parentKey ? (n.nextKey = s.key, s.prevKey = n.key) : s.prevKey = null, s.nextKey = null, r.addNode(s), n = s;
        }
        n && (n.type !== "header" ? (o.lastChildKey = n.key, a == null ? o.prevKey = null : (a.type === "section" || a.type === "separator") && (a.nextKey = o.key, o.prevKey = a.key), o.nextKey = null, a = o, r.addNode(o)) : (r.firstKey === o.key && (r.firstKey = null), r.removeNode(n.key)));
      } else if (i.type === "separator") {
        let o = i.clone();
        o.nextKey = null, (a == null ? void 0 : a.type) === "section" && (a.nextKey = o.key, o.prevKey = a.key, a = o, r.addNode(o));
      } else if (t(i.textValue)) {
        let o = i.clone();
        r.firstKey == null && (r.firstKey = o.key), a != null && a.type !== "section" && a.type !== "separator" && a.parentKey === o.parentKey ? (a.nextKey = o.key, o.prevKey = a.key) : o.prevKey = null, o.nextKey = null, r.addNode(o), a = o;
      }
    if ((a == null ? void 0 : a.type) === "separator" && a.nextKey === null) {
      let i;
      a.prevKey != null && (i = r.getItem(a.prevKey), i.nextKey = null), r.removeNode(a.key), a = i;
    }
    return r.lastKey = (a == null ? void 0 : a.key) || null, r;
  }
  constructor() {
    this.keyMap = /* @__PURE__ */ new Map(), this.firstKey = null, this.lastKey = null, this.frozen = !1;
  }
}
class tp {
  *[Symbol.iterator]() {
    let t = this.firstChild;
    for (; t; )
      yield t, t = t.nextSibling;
  }
  get firstChild() {
    return this._firstChild;
  }
  set firstChild(t) {
    this._firstChild = t, this.ownerDocument.markDirty(this);
  }
  get lastChild() {
    return this._lastChild;
  }
  set lastChild(t) {
    this._lastChild = t, this.ownerDocument.markDirty(this);
  }
  get previousSibling() {
    return this._previousSibling;
  }
  set previousSibling(t) {
    this._previousSibling = t, this.ownerDocument.markDirty(this);
  }
  get nextSibling() {
    return this._nextSibling;
  }
  set nextSibling(t) {
    this._nextSibling = t, this.ownerDocument.markDirty(this);
  }
  get parentNode() {
    return this._parentNode;
  }
  set parentNode(t) {
    this._parentNode = t, this.ownerDocument.markDirty(this);
  }
  get isConnected() {
    var t;
    return ((t = this.parentNode) === null || t === void 0 ? void 0 : t.isConnected) || !1;
  }
  appendChild(t) {
    this.ownerDocument.startTransaction(), t.parentNode && t.parentNode.removeChild(t), this.firstChild == null && (this.firstChild = t), this.lastChild ? (this.lastChild.nextSibling = t, t.index = this.lastChild.index + 1, t.previousSibling = this.lastChild) : (t.previousSibling = null, t.index = 0), t.parentNode = this, t.nextSibling = null, this.lastChild = t, this.ownerDocument.markDirty(this), t.hasSetProps && this.ownerDocument.addNode(t), this.ownerDocument.endTransaction(), this.ownerDocument.queueUpdate();
  }
  insertBefore(t, r) {
    if (r == null) return this.appendChild(t);
    this.ownerDocument.startTransaction(), t.parentNode && t.parentNode.removeChild(t), t.nextSibling = r, t.previousSibling = r.previousSibling, t.index = r.index, this.firstChild === r ? this.firstChild = t : r.previousSibling && (r.previousSibling.nextSibling = t), r.previousSibling = t, t.parentNode = r.parentNode;
    let a = r;
    for (; a; )
      a.index++, a = a.nextSibling;
    t.hasSetProps && this.ownerDocument.addNode(t), this.ownerDocument.endTransaction(), this.ownerDocument.queueUpdate();
  }
  removeChild(t) {
    if (t.parentNode !== this || !this.ownerDocument.isMounted) return;
    this.ownerDocument.startTransaction();
    let r = t.nextSibling;
    for (; r; )
      r.index--, r = r.nextSibling;
    t.nextSibling && (t.nextSibling.previousSibling = t.previousSibling), t.previousSibling && (t.previousSibling.nextSibling = t.nextSibling), this.firstChild === t && (this.firstChild = t.nextSibling), this.lastChild === t && (this.lastChild = t.previousSibling), t.parentNode = null, t.nextSibling = null, t.previousSibling = null, t.index = 0, this.ownerDocument.removeNode(t), this.ownerDocument.endTransaction(), this.ownerDocument.queueUpdate();
  }
  addEventListener() {
  }
  removeEventListener() {
  }
  constructor(t) {
    this._firstChild = null, this._lastChild = null, this._previousSibling = null, this._nextSibling = null, this._parentNode = null, this.ownerDocument = t;
  }
}
class Ma extends tp {
  get index() {
    return this._index;
  }
  set index(t) {
    this._index = t, this.ownerDocument.markDirty(this);
  }
  get level() {
    return this.parentNode instanceof Ma ? this.parentNode.level + (this.node.type === "item" ? 1 : 0) : 0;
  }
  updateNode() {
    var t, r, a, i;
    let o = this.ownerDocument.getMutableNode(this);
    o.index = this.index, o.level = this.level, o.parentKey = this.parentNode instanceof Ma ? this.parentNode.node.key : null;
    var n;
    o.prevKey = (n = (t = this.previousSibling) === null || t === void 0 ? void 0 : t.node.key) !== null && n !== void 0 ? n : null;
    var l;
    o.nextKey = (l = (r = this.nextSibling) === null || r === void 0 ? void 0 : r.node.key) !== null && l !== void 0 ? l : null, o.hasChildNodes = !!this.firstChild;
    var s;
    o.firstChildKey = (s = (a = this.firstChild) === null || a === void 0 ? void 0 : a.node.key) !== null && s !== void 0 ? s : null;
    var d;
    o.lastChildKey = (d = (i = this.lastChild) === null || i === void 0 ? void 0 : i.node.key) !== null && d !== void 0 ? d : null;
  }
  setProps(t, r, a, i) {
    let o = this.ownerDocument.getMutableNode(this), { value: n, textValue: l, id: s, ...d } = t;
    if (d.ref = r, o.props = d, o.rendered = a, o.render = i, o.value = n, o.textValue = l || (typeof d.children == "string" ? d.children : "") || t["aria-label"] || "", s != null && s !== o.key) {
      if (this.hasSetProps) throw new Error("Cannot change the id of an item");
      o.key = s;
    }
    this.hasSetProps || (this.ownerDocument.addNode(this), this.ownerDocument.endTransaction(), this.hasSetProps = !0), this.ownerDocument.queueUpdate();
  }
  get style() {
    return {};
  }
  hasAttribute() {
  }
  setAttribute() {
  }
  setAttributeNS() {
  }
  removeAttribute() {
  }
  constructor(t, r) {
    super(r), this.nodeType = 8, this._index = 0, this.hasSetProps = !1, this.node = new $l(t, `react-aria-${++r.nodeId}`), this.ownerDocument.startTransaction();
  }
}
class j6 extends tp {
  get isConnected() {
    return this.isMounted;
  }
  createElement(t) {
    return new Ma(t, this);
  }
  /**
  * Lazily gets a mutable instance of a Node. If the node has already
  * been cloned during this update cycle, it just returns the existing one.
  */
  getMutableNode(t) {
    let r = t.node;
    return this.mutatedNodes.has(t) || (r = t.node.clone(), this.mutatedNodes.add(t), t.node = r), this.markDirty(t), r;
  }
  getMutableCollection() {
    return !this.isSSR && !this.collectionMutated && (this.collection = this.collection.clone(), this.collectionMutated = !0), this.collection;
  }
  markDirty(t) {
    this.dirtyNodes.add(t);
  }
  startTransaction() {
    this.transactionCount++;
  }
  endTransaction() {
    this.transactionCount--;
  }
  addNode(t) {
    let r = this.getMutableCollection();
    if (!r.getItem(t.node.key)) {
      r.addNode(t.node);
      for (let a of t) this.addNode(a);
    }
    this.markDirty(t);
  }
  removeNode(t) {
    for (let a of t) this.removeNode(a);
    this.getMutableCollection().removeNode(t.node.key), this.markDirty(t);
  }
  /** Finalizes the collection update, updating all nodes and freezing the collection. */
  getCollection() {
    return this.transactionCount > 0 ? this.collection : (this.updateCollection(), this.collection);
  }
  updateCollection() {
    for (let o of this.dirtyNodes) o instanceof Ma && o.isConnected && o.updateNode();
    if (this.dirtyNodes.clear(), this.mutatedNodes.size || this.collectionMutated) {
      var t, r;
      let o = this.getMutableCollection();
      for (let n of this.mutatedNodes) n.isConnected && o.addNode(n.node);
      var a, i;
      o.commit((a = (t = this.firstChild) === null || t === void 0 ? void 0 : t.node.key) !== null && a !== void 0 ? a : null, (i = (r = this.lastChild) === null || r === void 0 ? void 0 : r.node.key) !== null && i !== void 0 ? i : null, this.isSSR), this.mutatedNodes.clear();
    }
    this.collectionMutated = !1;
  }
  queueUpdate() {
    if (!(this.dirtyNodes.size === 0 || this.transactionCount > 0))
      for (let t of this.subscriptions) t();
  }
  subscribe(t) {
    return this.subscriptions.add(t), () => this.subscriptions.delete(t);
  }
  resetAfterSSR() {
    this.isSSR && (this.isSSR = !1, this.firstChild = null, this.lastChild = null, this.nodeId = 0);
  }
  constructor(t) {
    super(null), this.nodeType = 11, this.ownerDocument = this, this.dirtyNodes = /* @__PURE__ */ new Set(), this.isSSR = !1, this.nodeId = 0, this.nodesByProps = /* @__PURE__ */ new WeakMap(), this.isMounted = !0, this.mutatedNodes = /* @__PURE__ */ new Set(), this.subscriptions = /* @__PURE__ */ new Set(), this.transactionCount = 0, this.collection = t, this.collectionMutated = !0;
  }
}
function rp(e) {
  let { children: t, items: r, idScope: a, addIdAndValue: i, dependencies: o = [] } = e, n = G(() => /* @__PURE__ */ new WeakMap(), o);
  return G(() => {
    if (r && typeof t == "function") {
      let d = [];
      for (let c of r) {
        let h = n.get(c);
        if (!h) {
          h = t(c);
          var l, s;
          let u = (s = (l = h.props.id) !== null && l !== void 0 ? l : c.key) !== null && s !== void 0 ? s : c.id;
          if (u == null) throw new Error("Could not determine key for item");
          a && (u = a + ":" + u), h = Qr(h, i ? {
            key: u,
            id: u,
            value: c
          } : {
            key: u
          }), n.set(c, h);
        }
        d.push(h);
      }
      return d;
    } else if (typeof t != "function") return t;
  }, [
    t,
    r,
    n,
    a,
    i
  ]);
}
if (typeof HTMLTemplateElement < "u") {
  const e = Object.getOwnPropertyDescriptor(Node.prototype, "firstChild").get;
  Object.defineProperty(HTMLTemplateElement.prototype, "firstChild", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.dataset.reactAriaHidden ? this.content.firstChild : e.call(this);
    }
  });
}
const Ki = /* @__PURE__ */ ae(!1), V6 = typeof DocumentFragment < "u" ? new DocumentFragment() : null;
function H6(e) {
  let t = Q(Ki), r = Tr();
  if (t)
    return /* @__PURE__ */ z.createElement(z.Fragment, null, e.children);
  let a = /* @__PURE__ */ z.createElement(Ki.Provider, {
    value: !0
  }, e.children);
  return r ? /* @__PURE__ */ z.createElement("template", {
    "data-react-aria-hidden": !0
  }, a) : /* @__PURE__ */ Dn(a, V6);
}
function ap(e) {
  let t = (r, a) => Q(Ki) ? null : e(r, a);
  return t.displayName = e.displayName || e.name, V(t);
}
function U6() {
  return Q(Ki);
}
var Cn = { exports: {} }, Lo = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zd;
function G6() {
  if (zd) return Lo;
  zd = 1;
  var e = z;
  function t(h, u) {
    return h === u && (h !== 0 || 1 / h === 1 / u) || h !== h && u !== u;
  }
  var r = typeof Object.is == "function" ? Object.is : t, a = e.useState, i = e.useEffect, o = e.useLayoutEffect, n = e.useDebugValue;
  function l(h, u) {
    var f = u(), g = a({ inst: { value: f, getSnapshot: u } }), v = g[0].inst, b = g[1];
    return o(
      function() {
        v.value = f, v.getSnapshot = u, s(v) && b({ inst: v });
      },
      [h, f, u]
    ), i(
      function() {
        return s(v) && b({ inst: v }), h(function() {
          s(v) && b({ inst: v });
        });
      },
      [h]
    ), n(f), f;
  }
  function s(h) {
    var u = h.getSnapshot;
    h = h.value;
    try {
      var f = u();
      return !r(h, f);
    } catch {
      return !0;
    }
  }
  function d(h, u) {
    return u();
  }
  var c = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? d : l;
  return Lo.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : c, Lo;
}
var Mo = {};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Od;
function Y6() {
  return Od || (Od = 1, process.env.NODE_ENV !== "production" && function() {
    function e(f, g) {
      return f === g && (f !== 0 || 1 / f === 1 / g) || f !== f && g !== g;
    }
    function t(f, g) {
      c || i.startTransition === void 0 || (c = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var v = g();
      if (!h) {
        var b = g();
        o(v, b) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), h = !0);
      }
      b = n({
        inst: { value: v, getSnapshot: g }
      });
      var m = b[0].inst, x = b[1];
      return s(
        function() {
          m.value = v, m.getSnapshot = g, r(m) && x({ inst: m });
        },
        [f, v, g]
      ), l(
        function() {
          return r(m) && x({ inst: m }), f(function() {
            r(m) && x({ inst: m });
          });
        },
        [f]
      ), d(v), v;
    }
    function r(f) {
      var g = f.getSnapshot;
      f = f.value;
      try {
        var v = g();
        return !o(f, v);
      } catch {
        return !0;
      }
    }
    function a(f, g) {
      return g();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var i = z, o = typeof Object.is == "function" ? Object.is : e, n = i.useState, l = i.useEffect, s = i.useLayoutEffect, d = i.useDebugValue, c = !1, h = !1, u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? a : t;
    Mo.useSyncExternalStore = i.useSyncExternalStore !== void 0 ? i.useSyncExternalStore : u, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), Mo;
}
process.env.NODE_ENV === "production" ? Cn.exports = G6() : Cn.exports = Y6();
var q6 = Cn.exports;
const ip = /* @__PURE__ */ ae(!1), Ba = /* @__PURE__ */ ae(null);
function op(e) {
  if (Q(Ba))
    return e.content;
  let { collection: r, document: a } = Q6(e.createCollection);
  return /* @__PURE__ */ z.createElement(z.Fragment, null, /* @__PURE__ */ z.createElement(H6, null, /* @__PURE__ */ z.createElement(Ba.Provider, {
    value: a
  }, e.content)), /* @__PURE__ */ z.createElement(X6, {
    render: e.children,
    collection: r
  }));
}
function X6({ collection: e, render: t }) {
  return t(e);
}
function Z6(e, t, r) {
  let a = Tr(), i = B(a);
  i.current = a;
  let o = ie(() => i.current ? r() : t(), [
    t,
    r
  ]);
  return q6.useSyncExternalStore(e, o);
}
const J6 = typeof z.useSyncExternalStore == "function" ? z.useSyncExternalStore : Z6;
function Q6(e) {
  let [t] = se(() => new j6((e == null ? void 0 : e()) || new El())), r = ie((n) => t.subscribe(n), [
    t
  ]), a = ie(() => {
    let n = t.getCollection();
    return t.isSSR && t.resetAfterSSR(), n;
  }, [
    t
  ]), i = ie(() => (t.isSSR = !0, t.getCollection()), [
    t
  ]), o = J6(r, a, i);
  return fe(() => (t.isMounted = !0, () => {
    t.isMounted = !1;
  }), [
    t
  ]), {
    collection: o,
    document: t
  };
}
const Tn = /* @__PURE__ */ ae(null);
function np(e, t, r, a, i, o) {
  let n = ie((s) => {
    s == null || s.setProps(t, r, a, o);
  }, [
    t,
    r,
    a,
    o
  ]), l = Q(Tn);
  if (l) {
    let s = l.ownerDocument.nodesByProps.get(t);
    return s || (s = l.ownerDocument.createElement(e), s.setProps(t, r, a, o), l.appendChild(s), l.ownerDocument.updateCollection(), l.ownerDocument.nodesByProps.set(t, s)), i ? /* @__PURE__ */ z.createElement(Tn.Provider, {
      value: s
    }, i) : null;
  }
  return /* @__PURE__ */ z.createElement(e, {
    ref: n
  }, i);
}
function lp(e, t) {
  let r = ({ node: i }) => t(i.props, i.props.ref, i), a = V((i, o) => {
    if (!Q(ip)) {
      if (t.length >= 3) throw new Error(t.name + " cannot be rendered outside a collection.");
      return t(i, o);
    }
    return np(e, i, o, "children" in i ? i.children : null, null, (l) => /* @__PURE__ */ z.createElement(r, {
      node: l
    }));
  });
  return a.displayName = t.name, a;
}
function eS(e, t, r = sp) {
  let a = ({ node: o }) => t(o.props, o.props.ref, o), i = V((o, n) => {
    let l = r(o);
    var s;
    return (s = np(e, o, n, null, l, (d) => /* @__PURE__ */ z.createElement(a, {
      node: d
    }))) !== null && s !== void 0 ? s : /* @__PURE__ */ z.createElement(z.Fragment, null);
  });
  return i.displayName = t.name, i;
}
function sp(e) {
  return rp({
    ...e,
    addIdAndValue: !0
  });
}
const Fd = /* @__PURE__ */ ae(null);
function dp(e) {
  let t = Q(Fd), r = ((t == null ? void 0 : t.dependencies) || []).concat(e.dependencies), a = e.idScope || (t == null ? void 0 : t.idScope), i = sp({
    ...e,
    idScope: a,
    dependencies: r
  });
  return Q(Ba) && (i = /* @__PURE__ */ z.createElement(tS, null, i)), t = G(() => ({
    dependencies: r,
    idScope: a
  }), [
    a,
    ...r
  ]), /* @__PURE__ */ z.createElement(Fd.Provider, {
    value: t
  }, i);
}
function tS({ children: e }) {
  let t = Q(Ba), r = G(() => /* @__PURE__ */ z.createElement(Ba.Provider, {
    value: null
  }, /* @__PURE__ */ z.createElement(ip.Provider, {
    value: !0
  }, e)), [
    e
  ]);
  return Tr() ? /* @__PURE__ */ z.createElement(Tn.Provider, {
    value: t
  }, r) : /* @__PURE__ */ Dn(r, t);
}
const cp = /* @__PURE__ */ ae({}), rS = /* @__PURE__ */ ae(null), aS = /* @__PURE__ */ new Set([
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "name",
  "value"
]), up = /* @__PURE__ */ ae({}), iS = /* @__PURE__ */ ap(function(t, r) {
  [t, r] = Lt(t, r, up), t = oS(t);
  let a = t, { isPending: i } = a, { buttonProps: o, isPressed: n } = kf(t, r), { focusProps: l, isFocused: s, isFocusVisible: d } = Ha(t), { hoverProps: c, isHovered: h } = na({
    ...t,
    isDisabled: t.isDisabled || i
  }), u = {
    isHovered: h,
    isPressed: (a.isPressed || n) && !i,
    isFocused: s,
    isFocusVisible: d,
    isDisabled: t.isDisabled || !1,
    isPending: i ?? !1
  }, f = Pt({
    ...t,
    values: u,
    defaultClassName: "react-aria-Button"
  }), g = dt(o.id), v = dt(), b = o["aria-labelledby"];
  i && (b ? b = `${b} ${v}` : o["aria-label"] && (b = `${g} ${v}`));
  let m = B(i);
  return ee(() => {
    let x = {
      "aria-labelledby": b || g
    };
    (!m.current && s && i || m.current && s && !i) && vd(x, "assertive"), m.current = i;
  }, [
    i,
    s,
    b,
    g
  ]), /* @__PURE__ */ z.createElement("button", {
    ...Qe(t, {
      propNames: aS
    }),
    ...te(o, l, c),
    ...f,
    type: o.type === "submit" && i ? "button" : o.type,
    id: g,
    ref: r,
    "aria-labelledby": b,
    slot: t.slot || void 0,
    "aria-disabled": i ? "true" : o["aria-disabled"],
    "data-disabled": t.isDisabled || void 0,
    "data-pressed": u.isPressed || void 0,
    "data-hovered": h || void 0,
    "data-focused": s || void 0,
    "data-pending": i || void 0,
    "data-focus-visible": d || void 0
  }, /* @__PURE__ */ z.createElement(rS.Provider, {
    value: {
      id: v
    }
  }, f.children));
});
function oS(e) {
  return e.isPending && (e.onPress = void 0, e.onPressStart = void 0, e.onPressEnd = void 0, e.onPressChange = void 0, e.onPressUp = void 0, e.onKeyDown = void 0, e.onKeyUp = void 0, e.onClick = void 0, e.href = void 0), e;
}
const ao = /* @__PURE__ */ ae({}), hp = /* @__PURE__ */ ae(null);
class Nd {
  *[Symbol.iterator]() {
    yield* this.iterable;
  }
  get size() {
    return this.keyMap.size;
  }
  getKeys() {
    return this.keyMap.keys();
  }
  getKeyBefore(t) {
    let r = this.keyMap.get(t);
    var a;
    return r && (a = r.prevKey) !== null && a !== void 0 ? a : null;
  }
  getKeyAfter(t) {
    let r = this.keyMap.get(t);
    var a;
    return r && (a = r.nextKey) !== null && a !== void 0 ? a : null;
  }
  getFirstKey() {
    return this.firstKey;
  }
  getLastKey() {
    return this.lastKey;
  }
  getItem(t) {
    var r;
    return (r = this.keyMap.get(t)) !== null && r !== void 0 ? r : null;
  }
  at(t) {
    const r = [
      ...this.getKeys()
    ];
    return this.getItem(r[t]);
  }
  getChildren(t) {
    let r = this.keyMap.get(t);
    return (r == null ? void 0 : r.childNodes) || [];
  }
  constructor(t) {
    this.keyMap = /* @__PURE__ */ new Map(), this.firstKey = null, this.lastKey = null, this.iterable = t;
    let r = (n) => {
      if (this.keyMap.set(n.key, n), n.childNodes && n.type === "section") for (let l of n.childNodes) r(l);
    };
    for (let n of t) r(n);
    let a = null, i = 0;
    for (let [n, l] of this.keyMap)
      a ? (a.nextKey = n, l.prevKey = a.key) : (this.firstKey = n, l.prevKey = void 0), l.type === "item" && (l.index = i++), a = l, a.nextKey = void 0;
    var o;
    this.lastKey = (o = a == null ? void 0 : a.key) !== null && o !== void 0 ? o : null;
  }
}
class wt extends Set {
  constructor(t, r, a) {
    super(t), t instanceof wt ? (this.anchorKey = r ?? t.anchorKey, this.currentKey = a ?? t.currentKey) : (this.anchorKey = r ?? null, this.currentKey = a ?? null);
  }
}
function nS(e, t) {
  if (e.size !== t.size) return !1;
  for (let r of e)
    if (!t.has(r)) return !1;
  return !0;
}
function lS(e) {
  let { selectionMode: t = "none", disallowEmptySelection: r = !1, allowDuplicateSelectionEvents: a, selectionBehavior: i = "toggle", disabledBehavior: o = "all" } = e, n = B(!1), [, l] = se(!1), s = B(null), d = B(null), [, c] = se(null), h = G(() => Ld(e.selectedKeys), [
    e.selectedKeys
  ]), u = G(() => Ld(e.defaultSelectedKeys, new wt()), [
    e.defaultSelectedKeys
  ]), [f, g] = Va(h, u, e.onSelectionChange), v = G(() => e.disabledKeys ? new Set(e.disabledKeys) : /* @__PURE__ */ new Set(), [
    e.disabledKeys
  ]), [b, m] = se(i);
  i === "replace" && b === "toggle" && typeof f == "object" && f.size === 0 && m("replace");
  let x = B(i);
  return ee(() => {
    i !== x.current && (m(i), x.current = i);
  }, [
    i
  ]), {
    selectionMode: t,
    disallowEmptySelection: r,
    selectionBehavior: b,
    setSelectionBehavior: m,
    get isFocused() {
      return n.current;
    },
    setFocused(S) {
      n.current = S, l(S);
    },
    get focusedKey() {
      return s.current;
    },
    get childFocusStrategy() {
      return d.current;
    },
    setFocusedKey(S, T = "first") {
      s.current = S, d.current = T, c(S);
    },
    selectedKeys: f,
    setSelectedKeys(S) {
      (a || !nS(S, f)) && g(S);
    },
    disabledKeys: v,
    disabledBehavior: o
  };
}
function Ld(e, t) {
  return e ? e === "all" ? "all" : new wt(e) : t;
}
class sS {
  /**
  * The type of selection that is allowed in the collection.
  */
  get selectionMode() {
    return this.state.selectionMode;
  }
  /**
  * Whether the collection allows empty selection.
  */
  get disallowEmptySelection() {
    return this.state.disallowEmptySelection;
  }
  /**
  * The selection behavior for the collection.
  */
  get selectionBehavior() {
    return this.state.selectionBehavior;
  }
  /**
  * Sets the selection behavior for the collection.
  */
  setSelectionBehavior(t) {
    this.state.setSelectionBehavior(t);
  }
  /**
  * Whether the collection is currently focused.
  */
  get isFocused() {
    return this.state.isFocused;
  }
  /**
  * Sets whether the collection is focused.
  */
  setFocused(t) {
    this.state.setFocused(t);
  }
  /**
  * The current focused key in the collection.
  */
  get focusedKey() {
    return this.state.focusedKey;
  }
  /** Whether the first or last child of the focused key should receive focus. */
  get childFocusStrategy() {
    return this.state.childFocusStrategy;
  }
  /**
  * Sets the focused key.
  */
  setFocusedKey(t, r) {
    (t == null || this.collection.getItem(t)) && this.state.setFocusedKey(t, r);
  }
  /**
  * The currently selected keys in the collection.
  */
  get selectedKeys() {
    return this.state.selectedKeys === "all" ? new Set(this.getSelectAllKeys()) : this.state.selectedKeys;
  }
  /**
  * The raw selection value for the collection.
  * Either 'all' for select all, or a set of keys.
  */
  get rawSelection() {
    return this.state.selectedKeys;
  }
  /**
  * Returns whether a key is selected.
  */
  isSelected(t) {
    if (this.state.selectionMode === "none") return !1;
    let r = this.getKey(t);
    return r == null ? !1 : this.state.selectedKeys === "all" ? this.canSelectItem(r) : this.state.selectedKeys.has(r);
  }
  /**
  * Whether the selection is empty.
  */
  get isEmpty() {
    return this.state.selectedKeys !== "all" && this.state.selectedKeys.size === 0;
  }
  /**
  * Whether all items in the collection are selected.
  */
  get isSelectAll() {
    if (this.isEmpty) return !1;
    if (this.state.selectedKeys === "all") return !0;
    if (this._isSelectAll != null) return this._isSelectAll;
    let t = this.getSelectAllKeys(), r = this.state.selectedKeys;
    return this._isSelectAll = t.every((a) => r.has(a)), this._isSelectAll;
  }
  get firstSelectedKey() {
    let t = null;
    for (let a of this.state.selectedKeys) {
      let i = this.collection.getItem(a);
      (!t || i && No(this.collection, i, t) < 0) && (t = i);
    }
    var r;
    return (r = t == null ? void 0 : t.key) !== null && r !== void 0 ? r : null;
  }
  get lastSelectedKey() {
    let t = null;
    for (let a of this.state.selectedKeys) {
      let i = this.collection.getItem(a);
      (!t || i && No(this.collection, i, t) > 0) && (t = i);
    }
    var r;
    return (r = t == null ? void 0 : t.key) !== null && r !== void 0 ? r : null;
  }
  get disabledKeys() {
    return this.state.disabledKeys;
  }
  get disabledBehavior() {
    return this.state.disabledBehavior;
  }
  /**
  * Extends the selection to the given key.
  */
  extendSelection(t) {
    if (this.selectionMode === "none") return;
    if (this.selectionMode === "single") {
      this.replaceSelection(t);
      return;
    }
    let r = this.getKey(t);
    if (r == null) return;
    let a;
    if (this.state.selectedKeys === "all") a = new wt([
      r
    ], r, r);
    else {
      let n = this.state.selectedKeys;
      var i;
      let l = (i = n.anchorKey) !== null && i !== void 0 ? i : r;
      a = new wt(n, l, r);
      var o;
      for (let s of this.getKeyRange(l, (o = n.currentKey) !== null && o !== void 0 ? o : r)) a.delete(s);
      for (let s of this.getKeyRange(r, l)) this.canSelectItem(s) && a.add(s);
    }
    this.state.setSelectedKeys(a);
  }
  getKeyRange(t, r) {
    let a = this.collection.getItem(t), i = this.collection.getItem(r);
    return a && i ? No(this.collection, a, i) <= 0 ? this.getKeyRangeInternal(t, r) : this.getKeyRangeInternal(r, t) : [];
  }
  getKeyRangeInternal(t, r) {
    var a;
    if (!((a = this.layoutDelegate) === null || a === void 0) && a.getKeyRange) return this.layoutDelegate.getKeyRange(t, r);
    let i = [], o = t;
    for (; o != null; ) {
      let n = this.collection.getItem(o);
      if (n && (n.type === "item" || n.type === "cell" && this.allowsCellSelection) && i.push(o), o === r) return i;
      o = this.collection.getKeyAfter(o);
    }
    return [];
  }
  getKey(t) {
    let r = this.collection.getItem(t);
    if (!r || r.type === "cell" && this.allowsCellSelection) return t;
    for (; r && r.type !== "item" && r.parentKey != null; ) r = this.collection.getItem(r.parentKey);
    return !r || r.type !== "item" ? null : r.key;
  }
  /**
  * Toggles whether the given key is selected.
  */
  toggleSelection(t) {
    if (this.selectionMode === "none") return;
    if (this.selectionMode === "single" && !this.isSelected(t)) {
      this.replaceSelection(t);
      return;
    }
    let r = this.getKey(t);
    if (r == null) return;
    let a = new wt(this.state.selectedKeys === "all" ? this.getSelectAllKeys() : this.state.selectedKeys);
    a.has(r) ? a.delete(r) : this.canSelectItem(r) && (a.add(r), a.anchorKey = r, a.currentKey = r), !(this.disallowEmptySelection && a.size === 0) && this.state.setSelectedKeys(a);
  }
  /**
  * Replaces the selection with only the given key.
  */
  replaceSelection(t) {
    if (this.selectionMode === "none") return;
    let r = this.getKey(t);
    if (r == null) return;
    let a = this.canSelectItem(r) ? new wt([
      r
    ], r, r) : new wt();
    this.state.setSelectedKeys(a);
  }
  /**
  * Replaces the selection with the given keys.
  */
  setSelectedKeys(t) {
    if (this.selectionMode === "none") return;
    let r = new wt();
    for (let a of t) {
      let i = this.getKey(a);
      if (i != null && (r.add(i), this.selectionMode === "single"))
        break;
    }
    this.state.setSelectedKeys(r);
  }
  getSelectAllKeys() {
    let t = [], r = (a) => {
      for (; a != null; ) {
        if (this.canSelectItem(a)) {
          var i;
          let n = this.collection.getItem(a);
          (n == null ? void 0 : n.type) === "item" && t.push(a);
          var o;
          n != null && n.hasChildNodes && (this.allowsCellSelection || n.type !== "item") && r((o = (i = w6(fg(n, this.collection))) === null || i === void 0 ? void 0 : i.key) !== null && o !== void 0 ? o : null);
        }
        a = this.collection.getKeyAfter(a);
      }
    };
    return r(this.collection.getFirstKey()), t;
  }
  /**
  * Selects all items in the collection.
  */
  selectAll() {
    !this.isSelectAll && this.selectionMode === "multiple" && this.state.setSelectedKeys("all");
  }
  /**
  * Removes all keys from the selection.
  */
  clearSelection() {
    !this.disallowEmptySelection && (this.state.selectedKeys === "all" || this.state.selectedKeys.size > 0) && this.state.setSelectedKeys(new wt());
  }
  /**
  * Toggles between select all and an empty selection.
  */
  toggleSelectAll() {
    this.isSelectAll ? this.clearSelection() : this.selectAll();
  }
  select(t, r) {
    this.selectionMode !== "none" && (this.selectionMode === "single" ? this.isSelected(t) && !this.disallowEmptySelection ? this.toggleSelection(t) : this.replaceSelection(t) : this.selectionBehavior === "toggle" || r && (r.pointerType === "touch" || r.pointerType === "virtual") ? this.toggleSelection(t) : this.replaceSelection(t));
  }
  /**
  * Returns whether the current selection is equal to the given selection.
  */
  isSelectionEqual(t) {
    if (t === this.state.selectedKeys) return !0;
    let r = this.selectedKeys;
    if (t.size !== r.size) return !1;
    for (let a of t)
      if (!r.has(a)) return !1;
    for (let a of r)
      if (!t.has(a)) return !1;
    return !0;
  }
  canSelectItem(t) {
    var r;
    if (this.state.selectionMode === "none" || this.state.disabledKeys.has(t)) return !1;
    let a = this.collection.getItem(t);
    return !(!a || !(a == null || (r = a.props) === null || r === void 0) && r.isDisabled || a.type === "cell" && !this.allowsCellSelection);
  }
  isDisabled(t) {
    var r, a;
    return this.state.disabledBehavior === "all" && (this.state.disabledKeys.has(t) || !!(!((a = this.collection.getItem(t)) === null || a === void 0 || (r = a.props) === null || r === void 0) && r.isDisabled));
  }
  isLink(t) {
    var r, a;
    return !!(!((a = this.collection.getItem(t)) === null || a === void 0 || (r = a.props) === null || r === void 0) && r.href);
  }
  getItemProps(t) {
    var r;
    return (r = this.collection.getItem(t)) === null || r === void 0 ? void 0 : r.props;
  }
  constructor(t, r, a) {
    this.collection = t, this.state = r;
    var i;
    this.allowsCellSelection = (i = a == null ? void 0 : a.allowsCellSelection) !== null && i !== void 0 ? i : !1, this._isSelectAll = null, this.layoutDelegate = (a == null ? void 0 : a.layoutDelegate) || null;
  }
}
function fp(e) {
  let { filter: t, layoutDelegate: r } = e, a = lS(e), i = G(() => e.disabledKeys ? new Set(e.disabledKeys) : /* @__PURE__ */ new Set(), [
    e.disabledKeys
  ]), o = ie((c) => t ? new Nd(t(c)) : new Nd(c), [
    t
  ]), n = G(() => ({
    suppressTextValueWarning: e.suppressTextValueWarning
  }), [
    e.suppressTextValueWarning
  ]), l = S6(e, o, n), s = G(() => new sS(l, a, {
    layoutDelegate: r
  }), [
    l,
    a,
    r
  ]);
  const d = B(null);
  return ee(() => {
    if (a.focusedKey != null && !l.getItem(a.focusedKey) && d.current) {
      const m = d.current.getItem(a.focusedKey), x = [
        ...d.current.getKeys()
      ].map((p) => {
        const w = d.current.getItem(p);
        return (w == null ? void 0 : w.type) === "item" ? w : null;
      }).filter((p) => p !== null), S = [
        ...l.getKeys()
      ].map((p) => {
        const w = l.getItem(p);
        return (w == null ? void 0 : w.type) === "item" ? w : null;
      }).filter((p) => p !== null);
      var c, h;
      const T = ((c = x == null ? void 0 : x.length) !== null && c !== void 0 ? c : 0) - ((h = S == null ? void 0 : S.length) !== null && h !== void 0 ? h : 0);
      var u, f, g;
      let k = Math.min(T > 1 ? Math.max(((u = m == null ? void 0 : m.index) !== null && u !== void 0 ? u : 0) - T + 1, 0) : (f = m == null ? void 0 : m.index) !== null && f !== void 0 ? f : 0, ((g = S == null ? void 0 : S.length) !== null && g !== void 0 ? g : 0) - 1), $ = null, D = !1;
      for (; k >= 0; ) {
        if (!s.isDisabled(S[k].key)) {
          $ = S[k];
          break;
        }
        if (k < S.length - 1 && !D) k++;
        else {
          D = !0;
          var v, b;
          k > ((v = m == null ? void 0 : m.index) !== null && v !== void 0 ? v : 0) && (k = (b = m == null ? void 0 : m.index) !== null && b !== void 0 ? b : 0), k--;
        }
      }
      a.setFocusedKey($ ? $.key : null);
    }
    d.current = l;
  }, [
    l,
    s,
    a,
    a.focusedKey
  ]), {
    collection: l,
    disabledKeys: i,
    selectionManager: s
  };
}
function dS(e) {
  var t;
  let [r, a] = Va(e.selectedKey, (t = e.defaultSelectedKey) !== null && t !== void 0 ? t : null, e.onSelectionChange), i = G(() => r != null ? [
    r
  ] : [], [
    r
  ]), { collection: o, disabledKeys: n, selectionManager: l } = fp({
    ...e,
    selectionMode: "single",
    disallowEmptySelection: !0,
    allowDuplicateSelectionEvents: !0,
    selectedKeys: i,
    onSelectionChange: (d) => {
      if (d === "all") return;
      var c;
      let h = (c = d.values().next().value) !== null && c !== void 0 ? c : null;
      h === r && e.onSelectionChange && e.onSelectionChange(h), a(h);
    }
  }), s = r != null ? o.getItem(r) : null;
  return {
    collection: o,
    disabledKeys: n,
    selectionManager: l,
    selectedKey: r,
    setSelectedKey: a,
    selectedItem: s
  };
}
function Pl(e) {
  let [t, r] = Va(e.isOpen, e.defaultOpen || !1, e.onOpenChange);
  const a = ie(() => {
    r(!0);
  }, [
    r
  ]), i = ie(() => {
    r(!1);
  }, [
    r
  ]), o = ie(() => {
    r(!t);
  }, [
    r,
    t
  ]);
  return {
    isOpen: t,
    setOpen: r,
    open: a,
    close: i,
    toggle: o
  };
}
function cS(e) {
  let t = Pl(e), [r, a] = se(null), i = dS({
    ...e,
    onSelectionChange: (s) => {
      e.onSelectionChange != null && e.onSelectionChange(s), t.close(), o.commitValidation();
    }
  }), o = bl({
    ...e,
    value: i.selectedKey
  }), [n, l] = se(!1);
  return {
    ...o,
    ...i,
    ...t,
    focusStrategy: r,
    open(s = null) {
      i.collection.size !== 0 && (a(s), t.open());
    },
    toggle(s = null) {
      i.collection.size !== 0 && (a(s), t.toggle());
    },
    isFocused: n,
    setFocused: l
  };
}
const uS = 1500, Md = 500;
let mr = {}, hS = 0, ka = !1, jt = null, br = null;
function gp(e = {}) {
  let { delay: t = uS, closeDelay: r = Md } = e, { isOpen: a, open: i, close: o } = Pl(e), n = G(() => `${++hS}`, []), l = B(null), s = B(o), d = () => {
    mr[n] = u;
  }, c = () => {
    for (let g in mr) g !== n && (mr[g](!0), delete mr[g]);
  }, h = () => {
    l.current && clearTimeout(l.current), l.current = null, c(), d(), ka = !0, i(), jt && (clearTimeout(jt), jt = null), br && (clearTimeout(br), br = null);
  }, u = (g) => {
    g || r <= 0 ? (l.current && clearTimeout(l.current), l.current = null, s.current()) : l.current || (l.current = setTimeout(() => {
      l.current = null, s.current();
    }, r)), jt && (clearTimeout(jt), jt = null), ka && (br && clearTimeout(br), br = setTimeout(() => {
      delete mr[n], br = null, ka = !1;
    }, Math.max(Md, r)));
  }, f = () => {
    c(), d(), !a && !jt && !ka ? jt = setTimeout(() => {
      jt = null, ka = !0, h();
    }, t) : a || h();
  };
  return ee(() => {
    s.current = o;
  }, [
    o
  ]), ee(() => () => {
    l.current && clearTimeout(l.current), mr[n] && delete mr[n];
  }, [
    n
  ]), {
    isOpen: a,
    open: (g) => {
      !g && t > 0 && !l.current ? f() : h();
    },
    close: u
  };
}
const pp = /* @__PURE__ */ ae(null), In = /* @__PURE__ */ ae({});
let fS = (e) => {
  let { onHoverStart: t, onHoverChange: r, onHoverEnd: a, ...i } = e;
  return i;
};
const gS = /* @__PURE__ */ ap(function(t, r) {
  [t, r] = Lt(t, r, In);
  let { hoverProps: a, isHovered: i } = na(t), { isFocused: o, isFocusVisible: n, focusProps: l } = Ha({
    isTextInput: !0,
    autoFocus: t.autoFocus
  }), s = !!t["aria-invalid"] && t["aria-invalid"] !== "false", d = Pt({
    ...t,
    values: {
      isHovered: i,
      isFocused: o,
      isFocusVisible: n,
      isDisabled: t.disabled || !1,
      isInvalid: s
    },
    defaultClassName: "react-aria-Input"
  });
  return /* @__PURE__ */ z.createElement("input", {
    ...te(fS(t), l, a),
    ...d,
    ref: r,
    "data-focused": o || void 0,
    "data-disabled": t.disabled || void 0,
    "data-hovered": i || void 0,
    "data-focus-visible": n || void 0,
    "data-invalid": s || void 0
  });
}), pS = /* @__PURE__ */ ae({}), vS = /* @__PURE__ */ ae(null), mS = /* @__PURE__ */ V(function(t, r) {
  [t, r] = Lt(t, r, vS);
  let { validationBehavior: a } = ro(pp) || {};
  var i, o;
  let n = (o = (i = t.validationBehavior) !== null && i !== void 0 ? i : a) !== null && o !== void 0 ? o : "native", l = B(null), [s, d] = Lt({}, l, In), [c, h] = wl(), [u, f] = se("input"), { labelProps: g, inputProps: v, descriptionProps: b, errorMessageProps: m, ...x } = N_({
    ...ep(t),
    inputElementType: u,
    label: h,
    validationBehavior: n
  }, d), S = ie(($) => {
    d.current = $, $ && f($ instanceof HTMLTextAreaElement ? "textarea" : "input");
  }, [
    d
  ]), T = Pt({
    ...t,
    values: {
      isDisabled: t.isDisabled || !1,
      isInvalid: x.isInvalid,
      isReadOnly: t.isReadOnly || !1,
      isRequired: t.isRequired || !1
    },
    defaultClassName: "react-aria-TextField"
  }), k = Qe(t);
  return delete k.id, /* @__PURE__ */ z.createElement("div", {
    ...k,
    ...T,
    ref: r,
    slot: t.slot || void 0,
    "data-disabled": t.isDisabled || void 0,
    "data-invalid": x.isInvalid || void 0,
    "data-readonly": t.isReadOnly || void 0,
    "data-required": t.isRequired || void 0
  }, /* @__PURE__ */ z.createElement(Ua, {
    values: [
      [
        cp,
        {
          ...g,
          ref: c
        }
      ],
      [
        In,
        {
          ...te(v, s),
          ref: S
        }
      ],
      [
        pS,
        {
          ...v,
          ref: S
        }
      ],
      [
        ao,
        {
          slots: {
            description: b,
            errorMessage: m
          }
        }
      ],
      [
        hp,
        x
      ]
    ]
  }, T.children));
}), bS = /* @__PURE__ */ ae(null), yS = /* @__PURE__ */ ae(null), xS = {
  CollectionRoot({ collection: e, renderDropIndicator: t }) {
    return Bd(e, null, t);
  },
  CollectionBranch({ collection: e, parent: t, renderDropIndicator: r }) {
    return Bd(e, t, r);
  }
};
function Bd(e, t, r) {
  return rp({
    items: t ? e.getChildren(t.key) : e,
    dependencies: [
      r
    ],
    children(a) {
      var i;
      let o = a.render(a);
      if (!r || a.type !== "item") return o;
      let n = a.key, l = e.getKeyAfter(n);
      return /* @__PURE__ */ z.createElement(z.Fragment, null, r({
        type: "item",
        key: n,
        dropPosition: "before"
      }), o, (l == null || ((i = e.getItem(l)) === null || i === void 0 ? void 0 : i.type) !== "item") && r({
        type: "item",
        key: n,
        dropPosition: "after"
      }));
    }
  });
}
const Cl = /* @__PURE__ */ ae(xS);
var vp = {};
vp = {
  colorSwatchPicker: "تغييرات الألوان",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "حدد عنصرًا",
  tableResizer: "أداة تغيير الحجم"
};
var mp = {};
mp = {
  colorSwatchPicker: "Цветови мостри",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Изберете предмет",
  tableResizer: "Преоразмерител"
};
var bp = {};
bp = {
  colorSwatchPicker: "Vzorky barev",
  dropzoneLabel: "Místo pro přetažení",
  selectPlaceholder: "Vyberte položku",
  tableResizer: "Změna velikosti"
};
var yp = {};
yp = {
  colorSwatchPicker: "Farveprøver",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Vælg et element",
  tableResizer: "Størrelsesændring"
};
var xp = {};
xp = {
  colorSwatchPicker: "Farbfelder",
  dropzoneLabel: "Ablegebereich",
  selectPlaceholder: "Element wählen",
  tableResizer: "Größenanpassung"
};
var kp = {};
kp = {
  colorSwatchPicker: "Χρωματικά δείγματα",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Επιλέξτε ένα αντικείμενο",
  tableResizer: "Αλλαγή μεγέθους"
};
var _p = {};
_p = {
  selectPlaceholder: "Select an item",
  tableResizer: "Resizer",
  dropzoneLabel: "DropZone",
  colorSwatchPicker: "Color swatches"
};
var Sp = {};
Sp = {
  colorSwatchPicker: "Muestras de colores",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Seleccionar un artículo",
  tableResizer: "Cambiador de tamaño"
};
var wp = {};
wp = {
  colorSwatchPicker: "Värvinäidised",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Valige üksus",
  tableResizer: "Suuruse muutja"
};
var $p = {};
$p = {
  colorSwatchPicker: "Värimallit",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Valitse kohde",
  tableResizer: "Koon muuttaja"
};
var Ep = {};
Ep = {
  colorSwatchPicker: "Échantillons de couleurs",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Sélectionner un élément",
  tableResizer: "Redimensionneur"
};
var Pp = {};
Pp = {
  colorSwatchPicker: "דוגמיות צבע",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "בחר פריט",
  tableResizer: "שינוי גודל"
};
var Cp = {};
Cp = {
  colorSwatchPicker: "Uzorci boja",
  dropzoneLabel: "Zona spuštanja",
  selectPlaceholder: "Odaberite stavku",
  tableResizer: "Promjena veličine"
};
var Tp = {};
Tp = {
  colorSwatchPicker: "Színtárak",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Válasszon ki egy elemet",
  tableResizer: "Átméretező"
};
var Ip = {};
Ip = {
  colorSwatchPicker: "Campioni di colore",
  dropzoneLabel: "Zona di rilascio",
  selectPlaceholder: "Seleziona un elemento",
  tableResizer: "Ridimensionamento"
};
var Rp = {};
Rp = {
  colorSwatchPicker: "カラースウォッチ",
  dropzoneLabel: "ドロップゾーン",
  selectPlaceholder: "項目を選択",
  tableResizer: "サイズ変更ツール"
};
var Dp = {};
Dp = {
  colorSwatchPicker: "색상 견본",
  dropzoneLabel: "드롭 영역",
  selectPlaceholder: "항목 선택",
  tableResizer: "크기 조정기"
};
var Ap = {};
Ap = {
  colorSwatchPicker: "Spalvų pavyzdžiai",
  dropzoneLabel: "„DropZone“",
  selectPlaceholder: "Pasirinkite elementą",
  tableResizer: "Dydžio keitiklis"
};
var zp = {};
zp = {
  colorSwatchPicker: "Krāsu paraugi",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Izvēlēties vienumu",
  tableResizer: "Izmēra mainītājs"
};
var Op = {};
Op = {
  colorSwatchPicker: "Fargekart",
  dropzoneLabel: "Droppsone",
  selectPlaceholder: "Velg et element",
  tableResizer: "Størrelsesendrer"
};
var Fp = {};
Fp = {
  colorSwatchPicker: "kleurstalen",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Selecteer een item",
  tableResizer: "Resizer"
};
var Np = {};
Np = {
  colorSwatchPicker: "Próbki kolorów",
  dropzoneLabel: "Strefa upuszczania",
  selectPlaceholder: "Wybierz element",
  tableResizer: "Zmiana rozmiaru"
};
var Lp = {};
Lp = {
  colorSwatchPicker: "Amostras de cores",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Selecione um item",
  tableResizer: "Redimensionador"
};
var Mp = {};
Mp = {
  colorSwatchPicker: "Amostras de cores",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Selecione um item",
  tableResizer: "Redimensionador"
};
var Bp = {};
Bp = {
  colorSwatchPicker: "Specimene de culoare",
  dropzoneLabel: "Zonă de plasare",
  selectPlaceholder: "Selectați un element",
  tableResizer: "Instrument de redimensionare"
};
var Kp = {};
Kp = {
  colorSwatchPicker: "Цветовые образцы",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Выберите элемент",
  tableResizer: "Средство изменения размера"
};
var Wp = {};
Wp = {
  colorSwatchPicker: "Vzorkovníky farieb",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Vyberte položku",
  tableResizer: "Nástroj na zmenu veľkosti"
};
var jp = {};
jp = {
  colorSwatchPicker: "Barvne palete",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Izberite element",
  tableResizer: "Spreminjanje velikosti"
};
var Vp = {};
Vp = {
  colorSwatchPicker: "Uzorci boje",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Izaberite stavku",
  tableResizer: "Promena veličine"
};
var Hp = {};
Hp = {
  colorSwatchPicker: "Färgrutor",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Välj en artikel",
  tableResizer: "Storleksändrare"
};
var Up = {};
Up = {
  colorSwatchPicker: "Renk örnekleri",
  dropzoneLabel: "Bırakma Bölgesi",
  selectPlaceholder: "Bir öğe seçin",
  tableResizer: "Yeniden boyutlandırıcı"
};
var Gp = {};
Gp = {
  colorSwatchPicker: "Зразки кольорів",
  dropzoneLabel: "DropZone",
  selectPlaceholder: "Виберіть елемент",
  tableResizer: "Засіб змінення розміру"
};
var Yp = {};
Yp = {
  colorSwatchPicker: "颜色色板",
  dropzoneLabel: "放置区域",
  selectPlaceholder: "选择一个项目",
  tableResizer: "尺寸调整器"
};
var qp = {};
qp = {
  colorSwatchPicker: "色票",
  dropzoneLabel: "放置區",
  selectPlaceholder: "選取項目",
  tableResizer: "大小調整器"
};
var Xp = {};
Xp = {
  "ar-AE": vp,
  "bg-BG": mp,
  "cs-CZ": bp,
  "da-DK": yp,
  "de-DE": xp,
  "el-GR": kp,
  "en-US": _p,
  "es-ES": Sp,
  "et-EE": wp,
  "fi-FI": $p,
  "fr-FR": Ep,
  "he-IL": Pp,
  "hr-HR": Cp,
  "hu-HU": Tp,
  "it-IT": Ip,
  "ja-JP": Rp,
  "ko-KR": Dp,
  "lt-LT": Ap,
  "lv-LV": zp,
  "nb-NO": Op,
  "nl-NL": Fp,
  "pl-PL": Np,
  "pt-BR": Lp,
  "pt-PT": Mp,
  "ro-RO": Bp,
  "ru-RU": Kp,
  "sk-SK": Wp,
  "sl-SI": jp,
  "sr-SP": Vp,
  "sv-SE": Hp,
  "tr-TR": Up,
  "uk-UA": Gp,
  "zh-CN": Yp,
  "zh-TW": qp
};
const io = /* @__PURE__ */ ae({}), Zp = /* @__PURE__ */ ae(null), kS = /* @__PURE__ */ V(function(t, r) {
  let { render: a } = Q(Zp);
  return /* @__PURE__ */ z.createElement(z.Fragment, null, a(t, r));
});
function Jp(e, t) {
  var r;
  let a = e == null ? void 0 : e.renderDropIndicator, i = e == null || (r = e.isVirtualDragging) === null || r === void 0 ? void 0 : r.call(e), o = ie((n) => {
    if (i || t != null && t.isDropTarget(n)) return a ? a(n) : /* @__PURE__ */ z.createElement(kS, {
      target: n
    });
  }, [
    t == null ? void 0 : t.target,
    i,
    a
  ]);
  return e != null && e.useDropIndicator ? o : void 0;
}
function _S(e, t, r) {
  var a, i;
  let o = e.focusedKey, n = null;
  if (!(t == null || (a = t.isVirtualDragging) === null || a === void 0) && a.call(t) && (r == null || (i = r.target) === null || i === void 0 ? void 0 : i.type) === "item") {
    n = r.target.key;
    var l;
    r.target.dropPosition === "after" && (n = (l = r.collection.getKeyAfter(n)) !== null && l !== void 0 ? l : n);
  }
  return G(() => new Set([
    o,
    n
  ].filter((s) => s != null)), [
    o,
    n
  ]);
}
const Qp = /* @__PURE__ */ ae({}), SS = /* @__PURE__ */ lp("header", function(t, r) {
  return [t, r] = Lt(t, r, Qp), /* @__PURE__ */ z.createElement("header", {
    className: "react-aria-Header",
    ...t,
    ref: r
  }, t.children);
}), wS = /* @__PURE__ */ ae({}), Tl = /* @__PURE__ */ ae(null), Ga = /* @__PURE__ */ ae(null), $S = /* @__PURE__ */ V(function(t, r) {
  [t, r] = Lt(t, r, Tl);
  let a = Q(Ga);
  return a ? /* @__PURE__ */ z.createElement(ev, {
    state: a,
    props: t,
    listBoxRef: r
  }) : /* @__PURE__ */ z.createElement(op, {
    content: /* @__PURE__ */ z.createElement(dp, t)
  }, (i) => /* @__PURE__ */ z.createElement(ES, {
    props: t,
    listBoxRef: r,
    collection: i
  }));
});
function ES({ props: e, listBoxRef: t, collection: r }) {
  e = {
    ...e,
    collection: r,
    children: null,
    items: null
  };
  let { layoutDelegate: a } = Q(Cl), { filterFn: i, collectionProps: o, collectionRef: n } = Q(bS) || {};
  t = Et(G(() => j0(t, n !== void 0 ? n : null), [
    n,
    t
  ]));
  let l = G(() => i ? r.filter(i) : r, [
    r,
    i
  ]), s = fp({
    ...e,
    collection: l,
    layoutDelegate: a
  });
  return /* @__PURE__ */ z.createElement(ev, {
    state: s,
    props: {
      ...e,
      ...o
    },
    listBoxRef: t
  });
}
function ev({ state: e, props: t, listBoxRef: r }) {
  let { dragAndDropHooks: a, layout: i = "stack", orientation: o = "vertical" } = t, { collection: n, selectionManager: l } = e, s = !!(a != null && a.useDraggableCollectionState), d = !!(a != null && a.useDroppableCollectionState), { direction: c } = sa(), { disabledBehavior: h, disabledKeys: u } = l, f = ml({
    usage: "search",
    sensitivity: "base"
  }), { isVirtualized: g, layoutDelegate: v, dropTargetDelegate: b, CollectionRoot: m } = Q(Cl), x = G(() => t.keyboardDelegate || new _l({
    collection: n,
    collator: f,
    ref: r,
    disabledKeys: u,
    disabledBehavior: h,
    layout: i,
    orientation: o,
    direction: c,
    layoutDelegate: v
  }), [
    n,
    f,
    r,
    h,
    u,
    o,
    c,
    t.keyboardDelegate,
    i,
    v
  ]), { listBoxProps: S } = x6({
    ...t,
    shouldSelectOnPressUp: s || t.shouldSelectOnPressUp,
    keyboardDelegate: x,
    isVirtualized: g
  }, e, r), T = B(s), k = B(d);
  ee(() => {
    T.current !== s && console.warn("Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior."), k.current !== d && console.warn("Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.");
  }, [
    s,
    d
  ]);
  let $, D, p, w = !1, I = null, P = B(null);
  if (s && a) {
    $ = a.useDraggableCollectionState({
      collection: n,
      selectionManager: l,
      preview: a.renderDragPreview ? P : void 0
    }), a.useDraggableCollection({}, $, r);
    let R = a.DragPreview;
    I = a.renderDragPreview ? /* @__PURE__ */ z.createElement(R, {
      ref: P
    }, a.renderDragPreview) : null;
  }
  if (d && a) {
    D = a.useDroppableCollectionState({
      collection: n,
      selectionManager: l
    });
    let R = a.dropTargetDelegate || b || new a.ListDropTargetDelegate(n, r, {
      orientation: o,
      layout: i,
      direction: c
    });
    p = a.useDroppableCollection({
      keyboardDelegate: x,
      dropTargetDelegate: R
    }, D, r), w = D.isDropTarget({
      type: "root"
    });
  }
  let { focusProps: O, isFocused: _, isFocusVisible: E } = Ha(), F = {
    isDropTarget: w,
    isEmpty: e.collection.size === 0,
    isFocused: _,
    isFocusVisible: E,
    layout: t.layout || "stack",
    state: e
  }, W = Pt({
    className: t.className,
    style: t.style,
    defaultClassName: "react-aria-ListBox",
    values: F
  }), H = null;
  return e.collection.size === 0 && t.renderEmptyState && (H = /* @__PURE__ */ z.createElement("div", {
    // eslint-disable-next-line
    role: "option",
    style: {
      display: "contents"
    }
  }, t.renderEmptyState(F))), /* @__PURE__ */ z.createElement(vf, null, /* @__PURE__ */ z.createElement("div", {
    ...Qe(t),
    ...te(S, O, p == null ? void 0 : p.collectionProps),
    ...W,
    ref: r,
    slot: t.slot || void 0,
    onScroll: t.onScroll,
    "data-drop-target": w || void 0,
    "data-empty": e.collection.size === 0 || void 0,
    "data-focused": _ || void 0,
    "data-focus-visible": E || void 0,
    "data-layout": t.layout || "stack",
    "data-orientation": t.orientation || "vertical"
  }, /* @__PURE__ */ z.createElement(Ua, {
    values: [
      [
        Tl,
        t
      ],
      [
        Ga,
        e
      ],
      [
        io,
        {
          dragAndDropHooks: a,
          dragState: $,
          dropState: D
        }
      ],
      [
        wS,
        {
          elementType: "div"
        }
      ],
      [
        Zp,
        {
          render: TS
        }
      ],
      [
        yS,
        {
          name: "ListBoxSection",
          render: tv
        }
      ]
    ]
  }, /* @__PURE__ */ z.createElement(m, {
    collection: n,
    scrollRef: r,
    persistedKeys: _S(l, a, D),
    renderDropIndicator: Jp(a, D)
  })), H, I));
}
function tv(e, t, r, a = "react-aria-ListBoxSection") {
  let i = Q(Ga), { dragAndDropHooks: o, dropState: n } = Q(io), { CollectionBranch: l } = Q(Cl), [s, d] = wl();
  var c;
  let { headingProps: h, groupProps: u } = C6({
    heading: d,
    "aria-label": (c = e["aria-label"]) !== null && c !== void 0 ? c : void 0
  }), f = Pt({
    defaultClassName: a,
    className: e.className,
    style: e.style,
    values: {}
  });
  return /* @__PURE__ */ z.createElement("section", {
    ...Qe(e),
    ...u,
    ...f,
    ref: t
  }, /* @__PURE__ */ z.createElement(Qp.Provider, {
    value: {
      ...h,
      ref: s
    }
  }, /* @__PURE__ */ z.createElement(l, {
    collection: i.collection,
    parent: r,
    renderDropIndicator: Jp(o, n)
  })));
}
const PS = /* @__PURE__ */ eS("section", tv), CS = /* @__PURE__ */ lp("item", function(t, r, a) {
  let i = Et(r), o = Q(Ga), { dragAndDropHooks: n, dragState: l, dropState: s } = Q(io), { optionProps: d, labelProps: c, descriptionProps: h, ...u } = P6({
    key: a.key,
    "aria-label": t == null ? void 0 : t["aria-label"]
  }, o, i), { hoverProps: f, isHovered: g } = na({
    isDisabled: !u.allowsSelection && !u.hasAction,
    onHoverStart: a.props.onHoverStart,
    onHoverChange: a.props.onHoverChange,
    onHoverEnd: a.props.onHoverEnd
  }), v = null;
  l && n && (v = n.useDraggableItem({
    key: a.key
  }, l));
  let b = null;
  s && n && (b = n.useDroppableItem({
    target: {
      type: "item",
      key: a.key,
      dropPosition: "on"
    }
  }, s, i));
  let m = l && l.isDragging(a.key), x = Pt({
    ...t,
    id: void 0,
    children: t.children,
    defaultClassName: "react-aria-ListBoxItem",
    values: {
      ...u,
      isHovered: g,
      selectionMode: o.selectionManager.selectionMode,
      selectionBehavior: o.selectionManager.selectionBehavior,
      allowsDragging: !!l,
      isDragging: m,
      isDropTarget: b == null ? void 0 : b.isDropTarget
    }
  });
  ee(() => {
    a.textValue || console.warn("A `textValue` prop is required for <ListBoxItem> elements with non-plain text children in order to support accessibility features such as type to select.");
  }, [
    a.textValue
  ]);
  let S = t.href ? "a" : "div";
  return /* @__PURE__ */ z.createElement(S, {
    ...te(d, f, v == null ? void 0 : v.dragProps, b == null ? void 0 : b.dropProps),
    ...x,
    ref: i,
    "data-allows-dragging": !!l || void 0,
    "data-selected": u.isSelected || void 0,
    "data-disabled": u.isDisabled || void 0,
    "data-hovered": g || void 0,
    "data-focused": u.isFocused || void 0,
    "data-focus-visible": u.isFocusVisible || void 0,
    "data-pressed": u.isPressed || void 0,
    "data-dragging": m || void 0,
    "data-drop-target": (b == null ? void 0 : b.isDropTarget) || void 0,
    "data-selection-mode": o.selectionManager.selectionMode === "none" ? void 0 : o.selectionManager.selectionMode
  }, /* @__PURE__ */ z.createElement(Ua, {
    values: [
      [
        ao,
        {
          slots: {
            label: c,
            description: h
          }
        }
      ]
    ]
  }, x.children));
});
function TS(e, t) {
  t = Et(t);
  let { dragAndDropHooks: r, dropState: a } = Q(io), { dropIndicatorProps: i, isHidden: o, isDropTarget: n } = r.useDropIndicator(e, a, t);
  return o ? null : /* @__PURE__ */ z.createElement(RS, {
    ...e,
    dropIndicatorProps: i,
    isDropTarget: n,
    ref: t
  });
}
function IS(e, t) {
  let { dropIndicatorProps: r, isDropTarget: a, ...i } = e, o = Pt({
    ...i,
    defaultClassName: "react-aria-DropIndicator",
    values: {
      isDropTarget: a
    }
  });
  return /* @__PURE__ */ z.createElement("div", {
    ...r,
    ...o,
    // eslint-disable-next-line
    role: "option",
    ref: t,
    "data-drop-target": a || void 0
  });
}
const RS = /* @__PURE__ */ V(IS), rv = /* @__PURE__ */ ae({
  placement: "bottom"
}), av = /* @__PURE__ */ ae(null), DS = /* @__PURE__ */ V(function(t, r) {
  [t, r] = Lt(t, r, av);
  let a = Q(iv), i = Pl(t), o = t.isOpen != null || t.defaultOpen != null || !a ? i : a, n = tf(r, o.isOpen) || t.isExiting || !1;
  if (U6()) {
    let s = t.children;
    return typeof s == "function" && (s = s({
      trigger: t.trigger || null,
      placement: "bottom",
      isEntering: !1,
      isExiting: !1,
      defaultChildren: null
    })), /* @__PURE__ */ z.createElement(z.Fragment, null, s);
  }
  return o && !o.isOpen && !n ? null : /* @__PURE__ */ z.createElement(AS, {
    ...t,
    triggerRef: t.triggerRef,
    state: o,
    popoverRef: r,
    isExiting: n
  });
});
function AS({ state: e, isExiting: t, UNSTABLE_portalContainer: r, ...a }) {
  let i = B(null), [o, n] = se(0);
  fe(() => {
    i.current && e.isOpen && n(i.current.getBoundingClientRect().width);
  }, [
    e.isOpen,
    i
  ]);
  var l;
  let { popoverProps: s, underlayProps: d, arrowProps: c, placement: h } = s6({
    ...a,
    offset: (l = a.offset) !== null && l !== void 0 ? l : 8,
    arrowSize: o
  }, e), u = a.popoverRef, f = ef(u, !!h) || a.isEntering || !1, g = Pt({
    ...a,
    defaultClassName: "react-aria-Popover",
    values: {
      trigger: a.trigger || null,
      placement: h,
      isEntering: f,
      isExiting: t
    }
  }), v = {
    ...s.style,
    ...g.style
  };
  return /* @__PURE__ */ z.createElement(h6, {
    ...a,
    isExiting: t,
    portalContainer: r
  }, !a.isNonModal && e.isOpen && /* @__PURE__ */ z.createElement("div", {
    "data-testid": "underlay",
    ...d,
    style: {
      position: "fixed",
      inset: 0
    }
  }), /* @__PURE__ */ z.createElement("div", {
    ...te(Qe(a), s),
    ...g,
    ref: u,
    slot: a.slot || void 0,
    style: v,
    "data-trigger": a.trigger,
    "data-placement": h,
    "data-entering": f || void 0,
    "data-exiting": t || void 0
  }, !a.isNonModal && /* @__PURE__ */ z.createElement(Ed, {
    onDismiss: e.close
  }), /* @__PURE__ */ z.createElement(rv.Provider, {
    value: {
      ...c,
      placement: h,
      ref: i
    }
  }, g.children), /* @__PURE__ */ z.createElement(Ed, {
    onDismiss: e.close
  })));
}
const iv = /* @__PURE__ */ ae(null);
function zS(e) {
  return e && e.__esModule ? e.default : e;
}
const Il = /* @__PURE__ */ ae(null), Rl = /* @__PURE__ */ ae(null), OS = /* @__PURE__ */ V(function(t, r) {
  [t, r] = Lt(t, r, Il);
  let { children: a, isDisabled: i = !1, isInvalid: o = !1, isRequired: n = !1 } = t, l = G(() => typeof a == "function" ? a({
    isOpen: !1,
    isDisabled: i,
    isInvalid: o,
    isRequired: n,
    isFocused: !1,
    isFocusVisible: !1,
    defaultChildren: null
  }) : a, [
    a,
    i,
    o,
    n
  ]);
  return /* @__PURE__ */ z.createElement(op, {
    content: l
  }, (s) => /* @__PURE__ */ z.createElement(FS, {
    props: t,
    collection: s,
    selectRef: r
  }));
});
function FS({ props: e, selectRef: t, collection: r }) {
  let { validationBehavior: a } = ro(pp) || {};
  var i, o;
  let n = (o = (i = e.validationBehavior) !== null && i !== void 0 ? i : a) !== null && o !== void 0 ? o : "native", l = cS({
    ...e,
    collection: r,
    children: void 0,
    validationBehavior: n
  }), { isFocusVisible: s, focusProps: d } = Ha({
    within: !0
  }), c = B(null), [h, u] = wl(), { labelProps: f, triggerProps: g, valueProps: v, menuProps: b, descriptionProps: m, errorMessageProps: x, ...S } = D6({
    ...ep(e),
    label: u,
    validationBehavior: n
  }, l, c), [T, k] = se(null), $ = ie(() => {
    c.current && k(c.current.offsetWidth + "px");
  }, [
    c
  ]);
  hn({
    ref: c,
    onResize: $
  });
  let D = G(() => ({
    isOpen: l.isOpen,
    isFocused: l.isFocused,
    isFocusVisible: s,
    isDisabled: e.isDisabled || !1,
    isInvalid: S.isInvalid || !1,
    isRequired: e.isRequired || !1
  }), [
    l.isOpen,
    l.isFocused,
    s,
    e.isDisabled,
    S.isInvalid,
    e.isRequired
  ]), p = Pt({
    ...e,
    values: D,
    defaultClassName: "react-aria-Select"
  }), w = Qe(e);
  delete w.id;
  let I = B(null);
  return /* @__PURE__ */ z.createElement(Ua, {
    values: [
      [
        Il,
        e
      ],
      [
        Rl,
        l
      ],
      [
        ov,
        v
      ],
      [
        cp,
        {
          ...f,
          ref: h,
          elementType: "span"
        }
      ],
      [
        up,
        {
          ...g,
          ref: c,
          isPressed: l.isOpen
        }
      ],
      [
        iv,
        l
      ],
      [
        av,
        {
          trigger: "Select",
          triggerRef: c,
          scrollRef: I,
          placement: "bottom start",
          style: {
            "--trigger-width": T
          }
        }
      ],
      [
        Tl,
        {
          ...b,
          ref: I
        }
      ],
      [
        Ga,
        l
      ],
      [
        ao,
        {
          slots: {
            description: m,
            errorMessage: x
          }
        }
      ],
      [
        hp,
        S
      ]
    ]
  }, /* @__PURE__ */ z.createElement("div", {
    ...w,
    ...p,
    ...d,
    ref: t,
    slot: e.slot || void 0,
    "data-focused": l.isFocused || void 0,
    "data-focus-visible": s || void 0,
    "data-open": l.isOpen || void 0,
    "data-disabled": e.isDisabled || void 0,
    "data-invalid": S.isInvalid || void 0,
    "data-required": e.isRequired || void 0
  }), /* @__PURE__ */ z.createElement(z6, {
    autoComplete: e.autoComplete,
    state: l,
    triggerRef: c,
    label: u,
    name: e.name,
    isDisabled: e.isDisabled
  }));
}
const ov = /* @__PURE__ */ ae(null), NS = /* @__PURE__ */ V(function(t, r) {
  var a, i;
  [t, r] = Lt(t, r, ov);
  let o = Q(Rl), { placeholder: n } = ro(Il), l = o.selectedKey != null ? o.collection.getItem(o.selectedKey) : null, s = l == null ? void 0 : l.props.children;
  typeof s == "function" && (s = s({
    isHovered: !1,
    isPressed: !1,
    isSelected: !1,
    isFocused: !1,
    isFocusVisible: !1,
    isDisabled: !1,
    selectionMode: "single",
    selectionBehavior: "toggle"
  }));
  let d = vl(zS(Xp), "react-aria-components");
  var c, h, u;
  let f = Pt({
    ...t,
    defaultChildren: (c = s ?? n) !== null && c !== void 0 ? c : d.format("selectPlaceholder"),
    defaultClassName: "react-aria-SelectValue",
    values: {
      selectedItem: (h = (a = o.selectedItem) === null || a === void 0 ? void 0 : a.value) !== null && h !== void 0 ? h : null,
      selectedText: (u = (i = o.selectedItem) === null || i === void 0 ? void 0 : i.textValue) !== null && u !== void 0 ? u : null,
      isPlaceholder: !l
    }
  }), g = Qe(t);
  return /* @__PURE__ */ z.createElement("span", {
    ref: r,
    ...g,
    ...f,
    "data-placeholder": !l || void 0
  }, /* @__PURE__ */ z.createElement(ao.Provider, {
    value: void 0
  }, f.children));
}), Dl = /* @__PURE__ */ ae(null), nv = /* @__PURE__ */ ae(null);
function LS(e) {
  let t = gp(e), r = B(null), { triggerProps: a, tooltipProps: i } = F6(e, t, r);
  return /* @__PURE__ */ z.createElement(Ua, {
    values: [
      [
        Dl,
        t
      ],
      [
        nv,
        {
          ...i,
          triggerRef: r
        }
      ]
    ]
  }, /* @__PURE__ */ z.createElement(u_, {
    ...a,
    ref: r
  }, e.children));
}
const MS = /* @__PURE__ */ V(function({ UNSTABLE_portalContainer: t, ...r }, a) {
  [r, a] = Lt(r, a, nv);
  let i = Q(Dl), o = gp(r), n = r.isOpen != null || r.defaultOpen != null || !i ? o : i, l = tf(a, n.isOpen) || r.isExiting || !1;
  return !n.isOpen && !l ? null : /* @__PURE__ */ z.createElement(o6, {
    portalContainer: t
  }, /* @__PURE__ */ z.createElement(BS, {
    ...r,
    tooltipRef: a,
    isExiting: l
  }));
});
function BS(e) {
  let t = Q(Dl), r = B(null), [a, i] = se(0);
  fe(() => {
    r.current && t.isOpen && i(r.current.getBoundingClientRect().width);
  }, [
    t.isOpen,
    r
  ]);
  let { overlayProps: o, arrowProps: n, placement: l } = If({
    placement: e.placement || "top",
    targetRef: e.triggerRef,
    overlayRef: e.tooltipRef,
    offset: e.offset,
    crossOffset: e.crossOffset,
    isOpen: t.isOpen,
    arrowSize: a,
    arrowBoundaryOffset: e.arrowBoundaryOffset,
    shouldFlip: e.shouldFlip,
    onClose: () => t.close(!0)
  }), s = ef(e.tooltipRef, !!l) || e.isEntering || !1, d = Pt({
    ...e,
    defaultClassName: "react-aria-Tooltip",
    values: {
      placement: l,
      isEntering: s,
      isExiting: e.isExiting,
      state: t
    }
  });
  e = te(e, o);
  let { tooltipProps: c } = O6(e, t);
  return /* @__PURE__ */ z.createElement("div", {
    ...c,
    ref: e.tooltipRef,
    ...d,
    style: {
      ...o.style,
      ...d.style
    },
    "data-placement": l ?? void 0,
    "data-entering": s || void 0,
    "data-exiting": e.isExiting || void 0
  }, /* @__PURE__ */ z.createElement(rv.Provider, {
    value: {
      ...n,
      placement: l,
      ref: r
    }
  }, d.children));
}
const lv = be({
  // Unique class name prefix for the component
  className: "bleh-ui-tooltip",
  // Base styles applied to all instances of the component
  base: {
    color: "white",
    textStyle: "xs",
    fontWeight: "400",
    background: "slate.12",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "100",
    paddingX: "300",
    paddingY: "100",
    margin: "100",
    maxW: "6400",
    boxShadow: "1"
  }
}), { withContext: KS } = ct({ recipe: lv }), WS = KS("div"), jS = V(
  function({ children: t, placement: r = "bottom", ...a }, i) {
    return /* @__PURE__ */ C.jsx(WS, { ref: i, asChild: !0, ...a, children: /* @__PURE__ */ C.jsx(MS, { placement: r, ...a, children: t }) });
  }
);
jS.displayName = "Tooltip";
const VS = LS;
VS.displayName = "TooltipTrigger";
const HS = V(function(t, r) {
  const a = B(null), i = Et(Cr(a, r)), { focusableProps: o } = la(t, i);
  if (ji(t.children))
    return Qr(
      t.children,
      te(
        o,
        t.children.props,
        { ref: i }
      )
    );
});
HS.displayName = "MakeElementFocusable";
var US = (e, t, r, a, i, o, n, l) => {
  let s = document.documentElement, d = ["light", "dark"];
  function c(f) {
    (Array.isArray(e) ? e : [e]).forEach((g) => {
      let v = g === "class", b = v && o ? i.map((m) => o[m] || m) : i;
      v ? (s.classList.remove(...b), s.classList.add(f)) : s.setAttribute(g, f);
    }), h(f);
  }
  function h(f) {
    l && d.includes(f) && (s.style.colorScheme = f);
  }
  function u() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (a) c(a);
  else try {
    let f = localStorage.getItem(t) || r, g = n && f === "system" ? u() : f;
    c(g);
  } catch {
  }
}, Kd = ["light", "dark"], sv = "(prefers-color-scheme: dark)", GS = typeof window > "u", Al = re.createContext(void 0), YS = { setTheme: (e) => {
}, themes: [] }, qS = () => {
  var e;
  return (e = re.useContext(Al)) != null ? e : YS;
}, XS = (e) => re.useContext(Al) ? re.createElement(re.Fragment, null, e.children) : re.createElement(JS, { ...e }), ZS = ["light", "dark"], JS = ({ forcedTheme: e, disableTransitionOnChange: t = !1, enableSystem: r = !0, enableColorScheme: a = !0, storageKey: i = "theme", themes: o = ZS, defaultTheme: n = r ? "system" : "light", attribute: l = "data-theme", value: s, children: d, nonce: c, scriptProps: h }) => {
  let [u, f] = re.useState(() => Wd(i, n)), [g, v] = re.useState(() => Wd(i)), b = s ? Object.values(s) : o, m = re.useCallback((k) => {
    let $ = k;
    if (!$) return;
    k === "system" && r && ($ = jd());
    let D = s ? s[$] : $, p = t ? e9(c) : null, w = document.documentElement, I = (P) => {
      P === "class" ? (w.classList.remove(...b), D && w.classList.add(D)) : P.startsWith("data-") && (D ? w.setAttribute(P, D) : w.removeAttribute(P));
    };
    if (Array.isArray(l) ? l.forEach(I) : I(l), a) {
      let P = Kd.includes(n) ? n : null, O = Kd.includes($) ? $ : P;
      w.style.colorScheme = O;
    }
    p == null || p();
  }, [c]), x = re.useCallback((k) => {
    let $ = typeof k == "function" ? k(u) : k;
    f($);
    try {
      localStorage.setItem(i, $);
    } catch {
    }
  }, [u]), S = re.useCallback((k) => {
    let $ = jd(k);
    v($), u === "system" && r && !e && m("system");
  }, [u, e]);
  re.useEffect(() => {
    let k = window.matchMedia(sv);
    return k.addListener(S), S(k), () => k.removeListener(S);
  }, [S]), re.useEffect(() => {
    let k = ($) => {
      $.key === i && ($.newValue ? f($.newValue) : x(n));
    };
    return window.addEventListener("storage", k), () => window.removeEventListener("storage", k);
  }, [x]), re.useEffect(() => {
    m(e ?? u);
  }, [e, u]);
  let T = re.useMemo(() => ({ theme: u, setTheme: x, forcedTheme: e, resolvedTheme: u === "system" ? g : u, themes: r ? [...o, "system"] : o, systemTheme: r ? g : void 0 }), [u, x, e, g, r, o]);
  return re.createElement(Al.Provider, { value: T }, re.createElement(QS, { forcedTheme: e, storageKey: i, attribute: l, enableSystem: r, enableColorScheme: a, defaultTheme: n, value: s, themes: o, nonce: c, scriptProps: h }), d);
}, QS = re.memo(({ forcedTheme: e, storageKey: t, attribute: r, enableSystem: a, enableColorScheme: i, defaultTheme: o, value: n, themes: l, nonce: s, scriptProps: d }) => {
  let c = JSON.stringify([r, t, o, e, l, n, a, i]).slice(1, -1);
  return re.createElement("script", { ...d, suppressHydrationWarning: !0, nonce: typeof window > "u" ? s : "", dangerouslySetInnerHTML: { __html: `(${US.toString()})(${c})` } });
}), Wd = (e, t) => {
  if (GS) return;
  let r;
  try {
    r = localStorage.getItem(e) || void 0;
  } catch {
  }
  return r || t;
}, e9 = (e) => {
  let t = document.createElement("style");
  return e && t.setAttribute("nonce", e), t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(t), () => {
    window.getComputedStyle(document.body), setTimeout(() => {
      document.head.removeChild(t);
    }, 1);
  };
}, jd = (e) => (e || (e = window.matchMedia(sv)), e.matches ? "dark" : "light");
function t9(e) {
  return /* @__PURE__ */ C.jsx(XS, { attribute: "class", disableTransitionOnChange: !0, ...e });
}
function dv() {
  const { resolvedTheme: e, setTheme: t } = qS();
  return {
    colorMode: e,
    setColorMode: t,
    toggleColorMode: () => {
      t(e === "light" ? "dark" : "light");
    }
  };
}
function C$(e, t) {
  const { colorMode: r } = dv();
  return r === "light" ? e : t;
}
function T$() {
  const { colorMode: e } = dv();
  return e === "light" ? "Light Theme" : "DarkTheme";
}
const r9 = Yh({
  "slide-fade-in": {
    value: {
      transformOrigin: "var(--transform-origin)",
      "&[data-placement^=top]": {
        animationName: "slide-from-bottom, fade-in"
      },
      "&[data-placement^=bottom]": {
        animationName: "slide-from-top, fade-in"
      },
      "&[data-placement^=left]": {
        animationName: "slide-from-right, fade-in"
      },
      "&[data-placement^=right]": {
        animationName: "slide-from-left, fade-in"
      }
    }
  },
  "slide-fade-out": {
    value: {
      transformOrigin: "var(--transform-origin)",
      "&[data-placement^=top]": {
        animationName: "slide-to-bottom, fade-out"
      },
      "&[data-placement^=bottom]": {
        animationName: "slide-to-top, fade-out"
      },
      "&[data-placement^=left]": {
        animationName: "slide-to-right, fade-out"
      },
      "&[data-placement^=right]": {
        animationName: "slide-to-left, fade-out"
      }
    }
  },
  "scale-fade-in": {
    value: {
      transformOrigin: "var(--transform-origin)",
      animationName: "scale-in, fade-in"
    }
  },
  "scale-fade-out": {
    value: {
      transformOrigin: "var(--transform-origin)",
      animationName: "scale-out, fade-out"
    }
  }
});
var Pe = {
  aspectRatio: {
    square: {
      value: 1
    },
    landscape: {
      value: 1.3333
    },
    portrait: {
      value: 0.75
    },
    wide: {
      value: 1.7777
    },
    ultrawide: {
      value: 3.6
    },
    golden: {
      value: 1.618
    }
  },
  blur: {
    100: {
      value: "4px"
    },
    200: {
      value: "8px"
    },
    300: {
      value: "12px"
    },
    400: {
      value: "16px"
    },
    500: {
      value: "20px"
    },
    600: {
      value: "24px"
    },
    1e3: {
      value: "40px"
    },
    1600: {
      value: "64px"
    }
  },
  borderRadius: {
    50: {
      value: "2px"
    },
    100: {
      value: "4px"
    },
    150: {
      value: "6px"
    },
    200: {
      value: "8px"
    },
    300: {
      value: "12px"
    },
    400: {
      value: "16px"
    },
    500: {
      value: "20px"
    },
    600: {
      value: "24px"
    },
    full: {
      value: "900px"
    }
  },
  border: {
    "solid-25": {
      value: "1px solid"
    },
    "solid-50": {
      value: "2px solid"
    },
    "solid-75": {
      value: "3px solid"
    },
    "solid-100": {
      value: "4px solid"
    }
  },
  color: {
    "blacks-and-whites": {
      black: {
        value: "hsl(0, 0%, 0%)"
      },
      white: {
        value: "hsl(0, 0%, 100%)"
      },
      blackAlpha: {
        1: {
          value: "hsla(0, 0%, 0%, 0.05)"
        },
        2: {
          value: "hsla(0, 0%, 0%, 0.1)"
        },
        3: {
          value: "hsla(0, 0%, 0%, 0.15)"
        },
        4: {
          value: "hsla(0, 0%, 0%, 0.2)"
        },
        5: {
          value: "hsla(0, 0%, 0%, 0.3)"
        },
        6: {
          value: "hsla(0, 0%, 0%, 0.4)"
        },
        7: {
          value: "hsla(0, 0%, 0%, 0.5)"
        },
        8: {
          value: "hsla(0, 0%, 0%, 0.6)"
        },
        9: {
          value: "hsla(0, 0%, 0%, 0.7)"
        },
        10: {
          value: "hsla(0, 0%, 0%, 0.8)"
        },
        11: {
          value: "hsla(0, 0%, 0%, 0.9)"
        },
        12: {
          value: "hsla(0, 0%, 0%, 0.95)"
        }
      },
      whiteAlpha: {
        1: {
          value: "hsla(0, 0%, 100%, 0.05)"
        },
        2: {
          value: "hsla(0, 0%, 100%, 0.1)"
        },
        3: {
          value: "hsla(0, 0%, 100%, 0.15)"
        },
        4: {
          value: "hsla(0, 0%, 100%, 0.2)"
        },
        5: {
          value: "hsla(0, 0%, 100%, 0.3)"
        },
        6: {
          value: "hsla(0, 0%, 100%, 0.4)"
        },
        7: {
          value: "hsla(0, 0%, 100%, 0.5)"
        },
        8: {
          value: "hsla(0, 0%, 100%, 0.6)"
        },
        9: {
          value: "hsla(0, 0%, 100%, 0.7)"
        },
        10: {
          value: "hsla(0, 0%, 100%, 0.8)"
        },
        11: {
          value: "hsla(0, 0%, 100%, 0.9)"
        },
        12: {
          value: "hsla(0, 0%, 100%, 0.95)"
        }
      }
    },
    "system-palettes": {
      amber: {
        1: {
          value: {
            _light: "hsl(40, 60%, 99%)",
            _dark: "hsl(36, 29%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(51, 91%, 95%)",
            _dark: "hsl(39, 32%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(52, 100%, 88%)",
            _dark: "hsl(36, 71%, 11%)"
          }
        },
        4: {
          value: {
            _light: "hsl(50, 100%, 81%)",
            _dark: "hsl(37, 100%, 12%)"
          }
        },
        5: {
          value: {
            _light: "hsl(50, 94%, 73%)",
            _dark: "hsl(37, 100%, 15%)"
          }
        },
        6: {
          value: {
            _light: "hsl(46, 84%, 70%)",
            _dark: "hsl(39, 90%, 19%)"
          }
        },
        7: {
          value: {
            _light: "hsl(42, 75%, 65%)",
            _dark: "hsl(37, 64%, 27%)"
          }
        },
        8: {
          value: {
            _light: "hsl(38, 75%, 55%)",
            _dark: "hsl(36, 60%, 35%)"
          }
        },
        9: {
          value: {
            _light: "hsl(42, 100%, 62%)",
            _dark: "hsl(42, 100%, 62%)"
          }
        },
        10: {
          value: {
            _light: "hsl(42, 100%, 55%)",
            _dark: "hsl(50, 100%, 52%)"
          }
        },
        11: {
          value: {
            _light: "hsl(35, 100%, 34%)",
            _dark: "hsl(46, 100%, 54%)"
          }
        },
        12: {
          value: {
            _light: "hsl(24, 40%, 22%)",
            _dark: "hsl(41, 100%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(42, 100%, 62%)",
            _dark: "hsl(42, 100%, 62%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      amberAlpha: {
        1: {
          value: {
            _light: "hsla(40, 100%, 38%, 0.02)",
            _dark: "hsla(16, 100%, 45%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(51, 100%, 48%, 0.09)",
            _dark: "hsla(37, 100%, 50%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(52, 100%, 50%, 0.24)",
            _dark: "hsla(31, 100%, 49%, 0.13)"
          }
        },
        4: {
          value: {
            _light: "hsla(50, 100%, 50%, 0.39)",
            _dark: "hsla(31, 100%, 49%, 0.2)"
          }
        },
        5: {
          value: {
            _light: "hsla(50, 100%, 49%, 0.53)",
            _dark: "hsla(33, 100%, 50%, 0.25)"
          }
        },
        6: {
          value: {
            _light: "hsla(46, 100%, 46%, 0.55)",
            _dark: "hsla(37, 100%, 50%, 0.32)"
          }
        },
        7: {
          value: {
            _light: "hsla(42, 100%, 43%, 0.62)",
            _dark: "hsla(37, 100%, 57%, 0.4)"
          }
        },
        8: {
          value: {
            _light: "hsla(38, 100%, 43%, 0.79)",
            _dark: "hsla(36, 100%, 60%, 0.53)"
          }
        },
        9: {
          value: {
            _light: "hsla(42, 100%, 50%, 0.76)",
            _dark: "hsl(42, 100%, 62%)"
          }
        },
        10: {
          value: {
            _light: "hsla(42, 100%, 50%, 0.91)",
            _dark: "hsl(50, 100%, 52%)"
          }
        },
        11: {
          value: {
            _light: "hsl(35, 100%, 34%)",
            _dark: "hsl(46, 100%, 54%)"
          }
        },
        12: {
          value: {
            _light: "hsla(24, 100%, 10%, 0.87)",
            _dark: "hsl(41, 100%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(42, 100%, 50%, 0.76)",
            _dark: "hsl(42, 100%, 62%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      blue: {
        1: {
          value: {
            _light: "hsl(210, 100%, 99%)",
            _dark: "hsl(215, 42%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(207, 100%, 98%)",
            _dark: "hsl(218, 39%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(205, 92%, 95%)",
            _dark: "hsl(212, 69%, 16%)"
          }
        },
        4: {
          value: {
            _light: "hsl(203, 100%, 92%)",
            _dark: "hsl(209, 100%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(206, 100%, 88%)",
            _dark: "hsl(207, 100%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(207, 93%, 83%)",
            _dark: "hsl(209, 79%, 30%)"
          }
        },
        7: {
          value: {
            _light: "hsl(207, 85%, 76%)",
            _dark: "hsl(211, 66%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(206, 82%, 65%)",
            _dark: "hsl(211, 65%, 45%)"
          }
        },
        9: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        10: {
          value: {
            _light: "hsl(207, 96%, 48%)",
            _dark: "hsl(210, 100%, 62%)"
          }
        },
        11: {
          value: {
            _light: "hsl(208, 88%, 43%)",
            _dark: "hsl(210, 100%, 72%)"
          }
        },
        12: {
          value: {
            _light: "hsl(216, 71%, 23%)",
            _dark: "hsl(205, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      blueAlpha: {
        1: {
          value: {
            _light: "hsla(210, 100%, 50%, 0.02)",
            _dark: "hsla(221, 100%, 47%, 0.07)"
          }
        },
        2: {
          value: {
            _light: "hsla(207, 100%, 50%, 0.04)",
            _dark: "hsla(218, 97%, 53%, 0.09)"
          }
        },
        3: {
          value: {
            _light: "hsla(205, 100%, 48%, 0.1)",
            _dark: "hsla(212, 100%, 50%, 0.23)"
          }
        },
        4: {
          value: {
            _light: "hsla(203, 100%, 50%, 0.16)",
            _dark: "hsla(212, 100%, 50%, 0.34)"
          }
        },
        5: {
          value: {
            _light: "hsla(205, 100%, 50%, 0.24)",
            _dark: "hsla(209, 100%, 50%, 0.42)"
          }
        },
        6: {
          value: {
            _light: "hsla(207, 100%, 48%, 0.33)",
            _dark: "hsla(209, 98%, 53%, 0.5)"
          }
        },
        7: {
          value: {
            _light: "hsla(207, 100%, 46%, 0.44)",
            _dark: "hsla(211, 99%, 58%, 0.6)"
          }
        },
        8: {
          value: {
            _light: "hsla(206, 100%, 45%, 0.63)",
            _dark: "hsla(211, 99%, 59%, 0.73)"
          }
        },
        9: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        10: {
          value: {
            _light: "hsla(207, 100%, 47%, 0.98)",
            _dark: "hsl(210, 100%, 62%)"
          }
        },
        11: {
          value: {
            _light: "hsla(208, 100%, 40%, 0.95)",
            _dark: "hsl(210, 100%, 72%)"
          }
        },
        12: {
          value: {
            _light: "hsla(216, 100%, 17%, 0.93)",
            _dark: "hsl(205, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      bronze: {
        1: {
          value: {
            _light: "hsl(0, 20%, 99%)",
            _dark: "hsl(15, 11%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(15, 67%, 98%)",
            _dark: "hsl(24, 10%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(15, 40%, 94%)",
            _dark: "hsl(20, 9%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(19, 33%, 91%)",
            _dark: "hsl(20, 10%, 17%)"
          }
        },
        5: {
          value: {
            _light: "hsl(18, 29%, 87%)",
            _dark: "hsl(16, 10%, 21%)"
          }
        },
        6: {
          value: {
            _light: "hsl(18, 29%, 82%)",
            _dark: "hsl(16, 11%, 26%)"
          }
        },
        7: {
          value: {
            _light: "hsl(17, 27%, 76%)",
            _dark: "hsl(16, 12%, 32%)"
          }
        },
        8: {
          value: {
            _light: "hsl(16, 25%, 68%)",
            _dark: "hsl(18, 12%, 39%)"
          }
        },
        9: {
          value: {
            _light: "hsl(18, 20%, 54%)",
            _dark: "hsl(18, 20%, 54%)"
          }
        },
        10: {
          value: {
            _light: "hsl(16, 18%, 50%)",
            _dark: "hsl(18, 23%, 59%)"
          }
        },
        11: {
          value: {
            _light: "hsl(15, 20%, 41%)",
            _dark: "hsl(18, 35%, 74%)"
          }
        },
        12: {
          value: {
            _light: "hsl(12, 22%, 22%)",
            _dark: "hsl(21, 36%, 89%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(18, 20%, 54%)",
            _dark: "hsl(18, 20%, 54%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      bronzeAlpha: {
        1: {
          value: {
            _light: "hsla(0, 100%, 17%, 0.01)",
            _dark: "hsla(5, 100%, 41%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(15, 100%, 40%, 0.04)",
            _dark: "hsla(24, 93%, 78%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(15, 100%, 29%, 0.08)",
            _dark: "hsla(20, 87%, 85%, 0.09)"
          }
        },
        4: {
          value: {
            _light: "hsla(19, 100%, 25%, 0.13)",
            _dark: "hsla(20, 87%, 85%, 0.13)"
          }
        },
        5: {
          value: {
            _light: "hsla(18, 100%, 23%, 0.17)",
            _dark: "hsla(16, 100%, 88%, 0.18)"
          }
        },
        6: {
          value: {
            _light: "hsla(19, 100%, 23%, 0.23)",
            _dark: "hsla(16, 100%, 88%, 0.24)"
          }
        },
        7: {
          value: {
            _light: "hsla(17, 100%, 21%, 0.3)",
            _dark: "hsla(16, 94%, 87%, 0.31)"
          }
        },
        8: {
          value: {
            _light: "hsla(16, 100%, 20%, 0.4)",
            _dark: "hsla(18, 100%, 89%, 0.4)"
          }
        },
        9: {
          value: {
            _light: "hsla(18, 100%, 17%, 0.55)",
            _dark: "hsla(18, 98%, 84%, 0.61)"
          }
        },
        10: {
          value: {
            _light: "hsla(17, 100%, 15%, 0.59)",
            _dark: "hsla(17, 97%, 85%, 0.66)"
          }
        },
        11: {
          value: {
            _light: "hsla(15, 100%, 12%, 0.67)",
            _dark: "hsla(18, 100%, 89%, 0.82)"
          }
        },
        12: {
          value: {
            _light: "hsla(12, 100%, 6%, 0.83)",
            _dark: "hsla(22, 100%, 96%, 0.93)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(18, 100%, 17%, 0.55)",
            _dark: "hsla(18, 98%, 84%, 0.61)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      brown: {
        1: {
          value: {
            _light: "hsl(30, 50%, 99%)",
            _dark: "hsl(40, 9%, 6%)"
          }
        },
        2: {
          value: {
            _light: "hsl(30, 50%, 98%)",
            _dark: "hsl(20, 12%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(28, 45%, 94%)",
            _dark: "hsl(22, 16%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(29, 43%, 90%)",
            _dark: "hsl(26, 19%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(29, 45%, 86%)",
            _dark: "hsl(25, 22%, 20%)"
          }
        },
        6: {
          value: {
            _light: "hsl(29, 45%, 81%)",
            _dark: "hsl(26, 24%, 24%)"
          }
        },
        7: {
          value: {
            _light: "hsl(29, 47%, 74%)",
            _dark: "hsl(26, 26%, 30%)"
          }
        },
        8: {
          value: {
            _light: "hsl(28, 45%, 65%)",
            _dark: "hsl(28, 28%, 38%)"
          }
        },
        9: {
          value: {
            _light: "hsl(28, 34%, 51%)",
            _dark: "hsl(28, 34%, 51%)"
          }
        },
        10: {
          value: {
            _light: "hsl(26, 32%, 48%)",
            _dark: "hsl(27, 36%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(24, 30%, 39%)",
            _dark: "hsl(28, 50%, 72%)"
          }
        },
        12: {
          value: {
            _light: "hsl(19, 15%, 21%)",
            _dark: "hsl(35, 61%, 87%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(28, 34%, 51%)",
            _dark: "hsl(28, 34%, 51%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      brownAlpha: {
        1: {
          value: {
            _light: "hsla(30, 100%, 33%, 0.01)",
            _dark: "hsla(7, 100%, 28%, 0.01)"
          }
        },
        2: {
          value: {
            _light: "hsla(30, 100%, 33%, 0.04)",
            _dark: "hsla(20, 94%, 74%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(28, 100%, 31%, 0.09)",
            _dark: "hsla(22, 95%, 77%, 0.1)"
          }
        },
        4: {
          value: {
            _light: "hsla(29, 100%, 30%, 0.15)",
            _dark: "hsla(26, 93%, 76%, 0.14)"
          }
        },
        5: {
          value: {
            _light: "hsla(29, 100%, 31%, 0.21)",
            _dark: "hsla(25, 95%, 76%, 0.19)"
          }
        },
        6: {
          value: {
            _light: "hsla(29, 100%, 31%, 0.28)",
            _dark: "hsla(26, 97%, 76%, 0.25)"
          }
        },
        7: {
          value: {
            _light: "hsla(29, 100%, 32%, 0.38)",
            _dark: "hsla(26, 100%, 77%, 0.34)"
          }
        },
        8: {
          value: {
            _light: "hsla(28, 100%, 31%, 0.51)",
            _dark: "hsla(28, 100%, 76%, 0.45)"
          }
        },
        9: {
          value: {
            _light: "hsla(28, 100%, 25%, 0.65)",
            _dark: "hsla(27, 98%, 74%, 0.66)"
          }
        },
        10: {
          value: {
            _light: "hsla(27, 100%, 22%, 0.67)",
            _dark: "hsla(28, 100%, 77%, 0.7)"
          }
        },
        11: {
          value: {
            _light: "hsla(24, 100%, 16%, 0.73)",
            _dark: "hsla(28, 98%, 83%, 0.85)"
          }
        },
        12: {
          value: {
            _light: "hsla(18, 100%, 4%, 0.82)",
            _dark: "hsla(34, 95%, 91%, 0.95)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(28, 100%, 25%, 0.65)",
            _dark: "hsla(27, 98%, 74%, 0.66)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      crimson: {
        1: {
          value: {
            _light: "hsl(340, 100%, 99%)",
            _dark: "hsl(338, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(343, 78%, 98%)",
            _dark: "hsl(337, 25%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(341, 100%, 96%)",
            _dark: "hsl(333, 45%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(341, 94%, 93%)",
            _dark: "hsl(331, 62%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(340, 81%, 89%)",
            _dark: "hsl(331, 59%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(338, 69%, 85%)",
            _dark: "hsl(333, 49%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(338, 60%, 80%)",
            _dark: "hsl(335, 45%, 36%)"
          }
        },
        8: {
          value: {
            _light: "hsl(336, 55%, 73%)",
            _dark: "hsl(336, 45%, 48%)"
          }
        },
        9: {
          value: {
            _light: "hsl(336, 80%, 58%)",
            _dark: "hsl(336, 80%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(336, 73%, 54%)",
            _dark: "hsl(338, 82%, 63%)"
          }
        },
        11: {
          value: {
            _light: "hsl(336, 75%, 45%)",
            _dark: "hsl(345, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsl(332, 63%, 24%)",
            _dark: "hsl(330, 91%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(336, 80%, 58%)",
            _dark: "hsl(336, 80%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      crimsonAlpha: {
        1: {
          value: {
            _light: "hsla(340, 100%, 50%, 0.01)",
            _dark: "hsla(337, 91%, 51%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(343, 100%, 44%, 0.03)",
            _dark: "hsla(337, 88%, 57%, 0.07)"
          }
        },
        3: {
          value: {
            _light: "hsla(341, 100%, 50%, 0.09)",
            _dark: "hsla(333, 99%, 58%, 0.16)"
          }
        },
        4: {
          value: {
            _light: "hsla(340, 100%, 49%, 0.14)",
            _dark: "hsla(331, 98%, 54%, 0.25)"
          }
        },
        5: {
          value: {
            _light: "hsla(339, 100%, 45%, 0.19)",
            _dark: "hsla(331, 98%, 57%, 0.32)"
          }
        },
        6: {
          value: {
            _light: "hsla(338, 100%, 41%, 0.25)",
            _dark: "hsla(333, 99%, 63%, 0.39)"
          }
        },
        7: {
          value: {
            _light: "hsla(338, 100%, 37%, 0.33)",
            _dark: "hsla(335, 98%, 66%, 0.5)"
          }
        },
        8: {
          value: {
            _light: "hsla(336, 100%, 36%, 0.42)",
            _dark: "hsla(336, 99%, 68%, 0.67)"
          }
        },
        9: {
          value: {
            _light: "hsla(336, 100%, 44%, 0.76)",
            _dark: "hsla(336, 99%, 63%, 0.91)"
          }
        },
        10: {
          value: {
            _light: "hsla(336, 100%, 42%, 0.8)",
            _dark: "hsla(338, 100%, 67%, 0.93)"
          }
        },
        11: {
          value: {
            _light: "hsla(336, 100%, 38%, 0.89)",
            _dark: "hsl(345, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsla(333, 100%, 16%, 0.91)",
            _dark: "hsla(330, 100%, 92%, 0.99)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(336, 100%, 44%, 0.76)",
            _dark: "hsla(336, 99%, 63%, 0.91)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      cyan: {
        1: {
          value: {
            _light: "hsl(195, 67%, 99%)",
            _dark: "hsl(196, 41%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(187, 53%, 97%)",
            _dark: "hsl(199, 33%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(184, 69%, 92%)",
            _dark: "hsl(193, 74%, 12%)"
          }
        },
        4: {
          value: {
            _light: "hsl(187, 71%, 88%)",
            _dark: "hsl(193, 100%, 14%)"
          }
        },
        5: {
          value: {
            _light: "hsl(187, 66%, 83%)",
            _dark: "hsl(193, 100%, 17%)"
          }
        },
        6: {
          value: {
            _light: "hsl(188, 61%, 76%)",
            _dark: "hsl(192, 93%, 21%)"
          }
        },
        7: {
          value: {
            _light: "hsl(189, 58%, 68%)",
            _dark: "hsl(193, 75%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(189, 60%, 53%)",
            _dark: "hsl(192, 80%, 34%)"
          }
        },
        9: {
          value: {
            _light: "hsl(191, 100%, 39%)",
            _dark: "hsl(191, 100%, 39%)"
          }
        },
        10: {
          value: {
            _light: "hsl(191, 93%, 38%)",
            _dark: "hsl(191, 71%, 48%)"
          }
        },
        11: {
          value: {
            _light: "hsl(192, 81%, 33%)",
            _dark: "hsl(190, 75%, 60%)"
          }
        },
        12: {
          value: {
            _light: "hsl(192, 69%, 17%)",
            _dark: "hsl(190, 80%, 84%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(191, 100%, 39%)",
            _dark: "hsl(191, 100%, 39%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      cyanAlpha: {
        1: {
          value: {
            _light: "hsla(195, 100%, 40%, 0.02)",
            _dark: "hsla(205, 100%, 48%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(187, 100%, 35%, 0.05)",
            _dark: "hsla(199, 98%, 48%, 0.07)"
          }
        },
        3: {
          value: {
            _light: "hsla(184, 100%, 41%, 0.13)",
            _dark: "hsla(195, 100%, 50%, 0.16)"
          }
        },
        4: {
          value: {
            _light: "hsla(187, 100%, 42%, 0.21)",
            _dark: "hsla(196, 100%, 50%, 0.23)"
          }
        },
        5: {
          value: {
            _light: "hsla(187, 99%, 40%, 0.29)",
            _dark: "hsla(195, 100%, 50%, 0.3)"
          }
        },
        6: {
          value: {
            _light: "hsla(188, 100%, 38%, 0.38)",
            _dark: "hsla(193, 100%, 50%, 0.37)"
          }
        },
        7: {
          value: {
            _light: "hsla(189, 100%, 37%, 0.51)",
            _dark: "hsla(193, 100%, 54%, 0.46)"
          }
        },
        8: {
          value: {
            _light: "hsla(189, 100%, 38%, 0.76)",
            _dark: "hsla(192, 100%, 53%, 0.58)"
          }
        },
        9: {
          value: {
            _light: "hsl(191, 100%, 39%)",
            _dark: "hsla(191, 100%, 50%, 0.76)"
          }
        },
        10: {
          value: {
            _light: "hsla(191, 100%, 36%, 0.97)",
            _dark: "hsla(191, 100%, 58%, 0.8)"
          }
        },
        11: {
          value: {
            _light: "hsla(192, 100%, 28%, 0.94)",
            _dark: "hsla(190, 99%, 66%, 0.9)"
          }
        },
        12: {
          value: {
            _light: "hsla(192, 100%, 12%, 0.95)",
            _dark: "hsla(190, 97%, 86%, 0.97)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(191, 100%, 39%)",
            _dark: "hsla(191, 100%, 50%, 0.76)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      gold: {
        1: {
          value: {
            _light: "hsl(60, 20%, 99%)",
            _dark: "hsl(60, 3%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(53, 44%, 96%)",
            _dark: "hsl(45, 8%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(49, 30%, 93%)",
            _dark: "hsl(48, 7%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(44, 26%, 89%)",
            _dark: "hsl(43, 8%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(43, 23%, 85%)",
            _dark: "hsl(42, 10%, 20%)"
          }
        },
        6: {
          value: {
            _light: "hsl(41, 24%, 80%)",
            _dark: "hsl(38, 9%, 25%)"
          }
        },
        7: {
          value: {
            _light: "hsl(40, 24%, 73%)",
            _dark: "hsl(39, 9%, 30%)"
          }
        },
        8: {
          value: {
            _light: "hsl(37, 24%, 64%)",
            _dark: "hsl(38, 10%, 37%)"
          }
        },
        9: {
          value: {
            _light: "hsl(36, 20%, 49%)",
            _dark: "hsl(36, 20%, 49%)"
          }
        },
        10: {
          value: {
            _light: "hsl(37, 20%, 46%)",
            _dark: "hsl(36, 21%, 55%)"
          }
        },
        11: {
          value: {
            _light: "hsl(36, 20%, 37%)",
            _dark: "hsl(35, 30%, 71%)"
          }
        },
        12: {
          value: {
            _light: "hsl(38, 16%, 20%)",
            _dark: "hsl(36, 25%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(36, 20%, 49%)",
            _dark: "hsl(36, 20%, 49%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      goldAlpha: {
        1: {
          value: {
            _light: "hsla(60, 100%, 17%, 0.01)",
            _dark: "hsla(60, 79%, 32%, 0.01)"
          }
        },
        2: {
          value: {
            _light: "hsla(53, 100%, 31%, 0.05)",
            _dark: "hsla(45, 88%, 80%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(49, 100%, 23%, 0.09)",
            _dark: "hsla(48, 81%, 85%, 0.08)"
          }
        },
        4: {
          value: {
            _light: "hsla(44, 100%, 21%, 0.14)",
            _dark: "hsla(43, 100%, 88%, 0.12)"
          }
        },
        5: {
          value: {
            _light: "hsla(44, 100%, 19%, 0.19)",
            _dark: "hsla(42, 97%, 88%, 0.16)"
          }
        },
        6: {
          value: {
            _light: "hsla(41, 100%, 20%, 0.25)",
            _dark: "hsla(38, 96%, 90%, 0.22)"
          }
        },
        7: {
          value: {
            _light: "hsla(40, 100%, 19%, 0.33)",
            _dark: "hsla(38, 100%, 90%, 0.28)"
          }
        },
        8: {
          value: {
            _light: "hsla(37, 100%, 19%, 0.45)",
            _dark: "hsla(38, 93%, 89%, 0.37)"
          }
        },
        9: {
          value: {
            _light: "hsla(36, 100%, 16%, 0.6)",
            _dark: "hsla(36, 100%, 83%, 0.56)"
          }
        },
        10: {
          value: {
            _light: "hsla(37, 100%, 14%, 0.63)",
            _dark: "hsla(36, 98%, 84%, 0.62)"
          }
        },
        11: {
          value: {
            _light: "hsla(37, 100%, 11%, 0.71)",
            _dark: "hsla(35, 97%, 89%, 0.78)"
          }
        },
        12: {
          value: {
            _light: "hsla(38, 100%, 4%, 0.83)",
            _dark: "hsla(35, 89%, 96%, 0.91)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(36, 100%, 16%, 0.6)",
            _dark: "hsla(36, 100%, 83%, 0.56)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      grass: {
        1: {
          value: {
            _light: "hsl(120, 60%, 99%)",
            _dark: "hsl(146, 20%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(120, 43%, 97%)",
            _dark: "hsl(130, 13%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(120, 42%, 94%)",
            _dark: "hsl(132, 22%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(123, 45%, 90%)",
            _dark: "hsl(134, 33%, 17%)"
          }
        },
        5: {
          value: {
            _light: "hsl(122, 40%, 85%)",
            _dark: "hsl(134, 32%, 21%)"
          }
        },
        6: {
          value: {
            _light: "hsl(124, 39%, 78%)",
            _dark: "hsl(133, 32%, 26%)"
          }
        },
        7: {
          value: {
            _light: "hsl(126, 37%, 69%)",
            _dark: "hsl(132, 31%, 31%)"
          }
        },
        8: {
          value: {
            _light: "hsl(131, 38%, 56%)",
            _dark: "hsl(131, 32%, 36%)"
          }
        },
        9: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        10: {
          value: {
            _light: "hsl(131, 43%, 43%)",
            _dark: "hsl(131, 39%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(132, 50%, 33%)",
            _dark: "hsl(131, 50%, 63%)"
          }
        },
        12: {
          value: {
            _light: "hsl(131, 30%, 18%)",
            _dark: "hsl(120, 61%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      grassAlpha: {
        1: {
          value: {
            _light: "hsla(120, 100%, 38%, 0.02)",
            _dark: "hsla(125, 100%, 44%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(120, 100%, 30%, 0.04)",
            _dark: "hsla(130, 91%, 67%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(120, 100%, 30%, 0.09)",
            _dark: "hsla(132, 99%, 72%, 0.11)"
          }
        },
        4: {
          value: {
            _light: "hsla(123, 100%, 31%, 0.15)",
            _dark: "hsla(135, 100%, 67%, 0.17)"
          }
        },
        5: {
          value: {
            _light: "hsla(122, 100%, 29%, 0.21)",
            _dark: "hsla(134, 100%, 70%, 0.23)"
          }
        },
        6: {
          value: {
            _light: "hsla(124, 100%, 28%, 0.3)",
            _dark: "hsla(133, 100%, 72%, 0.29)"
          }
        },
        7: {
          value: {
            _light: "hsla(126, 99%, 27%, 0.42)",
            _dark: "hsla(132, 97%, 73%, 0.36)"
          }
        },
        8: {
          value: {
            _light: "hsla(131, 100%, 28%, 0.6)",
            _dark: "hsla(131, 97%, 73%, 0.44)"
          }
        },
        9: {
          value: {
            _light: "hsla(131, 100%, 26%, 0.73)",
            _dark: "hsla(131, 100%, 70%, 0.63)"
          }
        },
        10: {
          value: {
            _light: "hsla(131, 100%, 24%, 0.76)",
            _dark: "hsla(131, 100%, 72%, 0.68)"
          }
        },
        11: {
          value: {
            _light: "hsla(132, 100%, 20%, 0.84)",
            _dark: "hsla(131, 100%, 77%, 0.8)"
          }
        },
        12: {
          value: {
            _light: "hsla(131, 100%, 6%, 0.87)",
            _dark: "hsla(120, 100%, 90%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(131, 100%, 26%, 0.73)",
            _dark: "hsla(131, 100%, 70%, 0.63)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      gray: {
        1: {
          value: {
            _light: "hsl(0, 0%, 99%)",
            _dark: "hsl(0, 0%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 0%, 98%)",
            _dark: "hsl(0, 0%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(0, 0%, 94%)",
            _dark: "hsl(0, 0%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(0, 0%, 91%)",
            _dark: "hsl(0, 0%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(0, 0%, 88%)",
            _dark: "hsl(0, 0%, 19%)"
          }
        },
        6: {
          value: {
            _light: "hsl(0, 0%, 85%)",
            _dark: "hsl(0, 0%, 23%)"
          }
        },
        7: {
          value: {
            _light: "hsl(0, 0%, 81%)",
            _dark: "hsl(0, 0%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(0, 0%, 73%)",
            _dark: "hsl(0, 0%, 38%)"
          }
        },
        9: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        10: {
          value: {
            _light: "hsl(0, 0%, 51%)",
            _dark: "hsl(0, 0%, 48%)"
          }
        },
        11: {
          value: {
            _light: "hsl(0, 0%, 39%)",
            _dark: "hsl(0, 0%, 71%)"
          }
        },
        12: {
          value: {
            _light: "hsl(0, 0%, 13%)",
            _dark: "hsl(0, 0%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      grayAlpha: {
        1: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.01)",
            _dark: "hsla(0, 0%, 0%, 0)"
          }
        },
        2: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.02)",
            _dark: "hsla(0, 0%, 100%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.06)",
            _dark: "hsla(0, 0%, 100%, 0.07)"
          }
        },
        4: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.09)",
            _dark: "hsla(0, 0%, 100%, 0.11)"
          }
        },
        5: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.12)",
            _dark: "hsla(0, 0%, 100%, 0.13)"
          }
        },
        6: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.15)",
            _dark: "hsla(0, 0%, 100%, 0.17)"
          }
        },
        7: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.19)",
            _dark: "hsla(0, 0%, 100%, 0.23)"
          }
        },
        8: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.27)",
            _dark: "hsla(0, 0%, 100%, 0.33)"
          }
        },
        9: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.45)",
            _dark: "hsla(0, 0%, 100%, 0.39)"
          }
        },
        10: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.49)",
            _dark: "hsla(0, 0%, 100%, 0.45)"
          }
        },
        11: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.61)",
            _dark: "hsla(0, 0%, 100%, 0.69)"
          }
        },
        12: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.87)",
            _dark: "hsla(0, 0%, 100%, 0.93)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(0, 0%, 0%, 0.45)",
            _dark: "hsla(0, 0%, 100%, 0.39)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      green: {
        1: {
          value: {
            _light: "hsl(140, 60%, 99%)",
            _dark: "hsl(154, 20%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(137, 47%, 97%)",
            _dark: "hsl(153, 20%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(139, 47%, 93%)",
            _dark: "hsl(152, 41%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(140, 49%, 89%)",
            _dark: "hsl(154, 55%, 15%)"
          }
        },
        5: {
          value: {
            _light: "hsl(142, 44%, 84%)",
            _dark: "hsl(154, 52%, 19%)"
          }
        },
        6: {
          value: {
            _light: "hsl(144, 41%, 77%)",
            _dark: "hsl(153, 46%, 23%)"
          }
        },
        7: {
          value: {
            _light: "hsl(146, 40%, 68%)",
            _dark: "hsl(152, 44%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(151, 40%, 54%)",
            _dark: "hsl(151, 45%, 34%)"
          }
        },
        9: {
          value: {
            _light: "hsl(151, 55%, 42%)",
            _dark: "hsl(151, 55%, 42%)"
          }
        },
        10: {
          value: {
            _light: "hsl(152, 56%, 39%)",
            _dark: "hsl(151, 55%, 45%)"
          }
        },
        11: {
          value: {
            _light: "hsl(154, 60%, 32%)",
            _dark: "hsl(151, 65%, 54%)"
          }
        },
        12: {
          value: {
            _light: "hsl(155, 40%, 16%)",
            _dark: "hsl(144, 70%, 82%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(151, 55%, 42%)",
            _dark: "hsl(151, 55%, 42%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      greenAlpha: {
        1: {
          value: {
            _light: "hsla(140, 100%, 38%, 0.02)",
            _dark: "hsla(139, 100%, 44%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(137, 100%, 32%, 0.04)",
            _dark: "hsla(153, 95%, 57%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(139, 100%, 32%, 0.1)",
            _dark: "hsla(152, 100%, 57%, 0.12)"
          }
        },
        4: {
          value: {
            _light: "hsla(140, 100%, 33%, 0.16)",
            _dark: "hsla(154, 100%, 53%, 0.18)"
          }
        },
        5: {
          value: {
            _light: "hsla(142, 99%, 31%, 0.23)",
            _dark: "hsla(154, 100%, 58%, 0.24)"
          }
        },
        6: {
          value: {
            _light: "hsla(144, 100%, 29%, 0.32)",
            _dark: "hsla(153, 100%, 63%, 0.29)"
          }
        },
        7: {
          value: {
            _light: "hsla(146, 100%, 28%, 0.44)",
            _dark: "hsla(152, 98%, 65%, 0.37)"
          }
        },
        8: {
          value: {
            _light: "hsla(151, 100%, 29%, 0.64)",
            _dark: "hsla(151, 100%, 66%, 0.45)"
          }
        },
        9: {
          value: {
            _light: "hsla(151, 100%, 28%, 0.81)",
            _dark: "hsla(151, 100%, 63%, 0.62)"
          }
        },
        10: {
          value: {
            _light: "hsla(152, 100%, 26%, 0.83)",
            _dark: "hsla(151, 99%, 63%, 0.67)"
          }
        },
        11: {
          value: {
            _light: "hsla(153, 100%, 22%, 0.87)",
            _dark: "hsla(151, 99%, 64%, 0.83)"
          }
        },
        12: {
          value: {
            _light: "hsla(155, 100%, 7%, 0.9)",
            _dark: "hsla(145, 100%, 87%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(151, 100%, 28%, 0.81)",
            _dark: "hsla(151, 100%, 63%, 0.62)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      indigo: {
        1: {
          value: {
            _light: "hsl(240, 33%, 99%)",
            _dark: "hsl(231, 29%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(225, 100%, 98%)",
            _dark: "hsl(230, 31%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(222, 89%, 96%)",
            _dark: "hsl(225, 51%, 19%)"
          }
        },
        4: {
          value: {
            _light: "hsl(224, 100%, 94%)",
            _dark: "hsl(225, 54%, 25%)"
          }
        },
        5: {
          value: {
            _light: "hsl(224, 100%, 91%)",
            _dark: "hsl(225, 52%, 30%)"
          }
        },
        6: {
          value: {
            _light: "hsl(225, 100%, 88%)",
            _dark: "hsl(226, 47%, 35%)"
          }
        },
        7: {
          value: {
            _light: "hsl(226, 87%, 82%)",
            _dark: "hsl(226, 44%, 41%)"
          }
        },
        8: {
          value: {
            _light: "hsl(226, 75%, 75%)",
            _dark: "hsl(226, 45%, 48%)"
          }
        },
        9: {
          value: {
            _light: "hsl(226, 70%, 55%)",
            _dark: "hsl(226, 70%, 55%)"
          }
        },
        10: {
          value: {
            _light: "hsl(226, 65%, 52%)",
            _dark: "hsl(228, 73%, 61%)"
          }
        },
        11: {
          value: {
            _light: "hsl(226, 56%, 50%)",
            _dark: "hsl(228, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsl(226, 50%, 24%)",
            _dark: "hsl(224, 100%, 92%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(226, 70%, 55%)",
            _dark: "hsl(226, 70%, 55%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      indigoAlpha: {
        1: {
          value: {
            _light: "hsla(240, 100%, 25%, 0.01)",
            _dark: "hsla(231, 100%, 53%, 0.06)"
          }
        },
        2: {
          value: {
            _light: "hsla(225, 100%, 50%, 0.03)",
            _dark: "hsla(230, 95%, 59%, 0.09)"
          }
        },
        3: {
          value: {
            _light: "hsla(222, 100%, 47%, 0.07)",
            _dark: "hsla(225, 100%, 59%, 0.24)"
          }
        },
        4: {
          value: {
            _light: "hsla(224, 100%, 50%, 0.12)",
            _dark: "hsla(225, 100%, 60%, 0.34)"
          }
        },
        5: {
          value: {
            _light: "hsla(224, 100%, 50%, 0.18)",
            _dark: "hsla(225, 98%, 62%, 0.42)"
          }
        },
        6: {
          value: {
            _light: "hsla(225, 100%, 50%, 0.24)",
            _dark: "hsla(226, 98%, 65%, 0.49)"
          }
        },
        7: {
          value: {
            _light: "hsla(226, 100%, 46%, 0.33)",
            _dark: "hsla(227, 100%, 68%, 0.56)"
          }
        },
        8: {
          value: {
            _light: "hsla(226, 100%, 43%, 0.45)",
            _dark: "hsla(226, 99%, 68%, 0.67)"
          }
        },
        9: {
          value: {
            _light: "hsla(226, 100%, 41%, 0.76)",
            _dark: "hsla(226, 100%, 64%, 0.86)"
          }
        },
        10: {
          value: {
            _light: "hsla(226, 100%, 39%, 0.8)",
            _dark: "hsla(227, 99%, 68%, 0.89)"
          }
        },
        11: {
          value: {
            _light: "hsla(226, 100%, 36%, 0.77)",
            _dark: "hsl(228, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsla(226, 100%, 14%, 0.88)",
            _dark: "hsl(224, 100%, 92%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(226, 100%, 41%, 0.76)",
            _dark: "hsla(226, 100%, 64%, 0.86)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      iris: {
        1: {
          value: {
            _light: "hsl(240, 100%, 100%)",
            _dark: "hsl(240, 22%, 10%)"
          }
        },
        2: {
          value: {
            _light: "hsl(240, 100%, 99%)",
            _dark: "hsl(244, 25%, 12%)"
          }
        },
        3: {
          value: {
            _light: "hsl(236, 88%, 97%)",
            _dark: "hsl(237, 38%, 20%)"
          }
        },
        4: {
          value: {
            _light: "hsl(238, 100%, 95%)",
            _dark: "hsl(236, 45%, 27%)"
          }
        },
        5: {
          value: {
            _light: "hsl(237, 100%, 93%)",
            _dark: "hsl(237, 41%, 32%)"
          }
        },
        6: {
          value: {
            _light: "hsl(238, 100%, 90%)",
            _dark: "hsl(239, 36%, 37%)"
          }
        },
        7: {
          value: {
            _light: "hsl(238, 82%, 85%)",
            _dark: "hsl(240, 34%, 44%)"
          }
        },
        8: {
          value: {
            _light: "hsl(238, 74%, 77%)",
            _dark: "hsl(241, 36%, 52%)"
          }
        },
        9: {
          value: {
            _light: "hsl(240, 60%, 60%)",
            _dark: "hsl(240, 60%, 60%)"
          }
        },
        10: {
          value: {
            _light: "hsl(240, 55%, 56%)",
            _dark: "hsl(242, 64%, 64%)"
          }
        },
        11: {
          value: {
            _light: "hsl(242, 50%, 55%)",
            _dark: "hsl(246, 100%, 83%)"
          }
        },
        12: {
          value: {
            _light: "hsl(238, 43%, 27%)",
            _dark: "hsl(242, 94%, 94%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(240, 60%, 60%)",
            _dark: "hsl(240, 60%, 60%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      irisAlpha: {
        1: {
          value: {
            _light: "hsla(240, 100%, 50%, 0.01)",
            _dark: "hsla(240, 99%, 60%, 0.05)"
          }
        },
        2: {
          value: {
            _light: "hsla(240, 100%, 50%, 0.03)",
            _dark: "hsla(244, 94%, 64%, 0.09)"
          }
        },
        3: {
          value: {
            _light: "hsla(236, 100%, 47%, 0.06)",
            _dark: "hsla(237, 100%, 66%, 0.23)"
          }
        },
        4: {
          value: {
            _light: "hsla(237, 100%, 50%, 0.1)",
            _dark: "hsla(236, 100%, 65%, 0.35)"
          }
        },
        5: {
          value: {
            _light: "hsla(237, 100%, 50%, 0.15)",
            _dark: "hsla(237, 98%, 67%, 0.42)"
          }
        },
        6: {
          value: {
            _light: "hsla(238, 100%, 50%, 0.2)",
            _dark: "hsla(239, 97%, 71%, 0.48)"
          }
        },
        7: {
          value: {
            _light: "hsla(238, 100%, 45%, 0.28)",
            _dark: "hsla(240, 99%, 73%, 0.56)"
          }
        },
        8: {
          value: {
            _light: "hsla(238, 100%, 43%, 0.39)",
            _dark: "hsla(240, 99%, 74%, 0.67)"
          }
        },
        9: {
          value: {
            _light: "hsla(240, 100%, 38%, 0.64)",
            _dark: "hsla(240, 99%, 71%, 0.83)"
          }
        },
        10: {
          value: {
            _light: "hsla(240, 100%, 36%, 0.68)",
            _dark: "hsla(242, 100%, 74%, 0.86)"
          }
        },
        11: {
          value: {
            _light: "hsla(242, 100%, 34%, 0.67)",
            _dark: "hsl(246, 100%, 83%)"
          }
        },
        12: {
          value: {
            _light: "hsla(238, 100%, 14%, 0.85)",
            _dark: "hsla(242, 100%, 94%, 1)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(240, 100%, 38%, 0.64)",
            _dark: "hsla(240, 99%, 71%, 0.83)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      jade: {
        1: {
          value: {
            _light: "hsl(160, 60%, 99%)",
            _dark: "hsl(158, 24%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(146, 47%, 97%)",
            _dark: "hsl(156, 22%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(145, 52%, 94%)",
            _dark: "hsl(157, 51%, 12%)"
          }
        },
        4: {
          value: {
            _light: "hsl(149, 49%, 89%)",
            _dark: "hsl(161, 69%, 14%)"
          }
        },
        5: {
          value: {
            _light: "hsl(152, 46%, 84%)",
            _dark: "hsl(161, 62%, 17%)"
          }
        },
        6: {
          value: {
            _light: "hsl(154, 43%, 77%)",
            _dark: "hsl(162, 53%, 22%)"
          }
        },
        7: {
          value: {
            _light: "hsl(159, 41%, 68%)",
            _dark: "hsl(162, 49%, 27%)"
          }
        },
        8: {
          value: {
            _light: "hsl(164, 42%, 53%)",
            _dark: "hsl(164, 50%, 33%)"
          }
        },
        9: {
          value: {
            _light: "hsl(164, 60%, 40%)",
            _dark: "hsl(164, 60%, 40%)"
          }
        },
        10: {
          value: {
            _light: "hsl(164, 60%, 37%)",
            _dark: "hsl(164, 64%, 42%)"
          }
        },
        11: {
          value: {
            _light: "hsl(164, 61%, 32%)",
            _dark: "hsl(163, 75%, 48%)"
          }
        },
        12: {
          value: {
            _light: "hsl(160, 34%, 17%)",
            _dark: "hsl(155, 69%, 81%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(164, 60%, 40%)",
            _dark: "hsl(164, 60%, 40%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      jadeAlpha: {
        1: {
          value: {
            _light: "hsla(160, 100%, 38%, 0.02)",
            _dark: "hsla(139, 100%, 44%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(146, 100%, 32%, 0.04)",
            _dark: "hsla(156, 96%, 57%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(145, 100%, 34%, 0.1)",
            _dark: "hsla(157, 98%, 49%, 0.13)"
          }
        },
        4: {
          value: {
            _light: "hsla(149, 100%, 33%, 0.16)",
            _dark: "hsla(160, 100%, 50%, 0.18)"
          }
        },
        5: {
          value: {
            _light: "hsla(151, 100%, 32%, 0.24)",
            _dark: "hsla(162, 100%, 53%, 0.23)"
          }
        },
        6: {
          value: {
            _light: "hsla(154, 100%, 30%, 0.33)",
            _dark: "hsla(162, 100%, 60%, 0.29)"
          }
        },
        7: {
          value: {
            _light: "hsla(159, 100%, 29%, 0.45)",
            _dark: "hsla(162, 98%, 63%, 0.37)"
          }
        },
        8: {
          value: {
            _light: "hsla(164, 100%, 30%, 0.66)",
            _dark: "hsla(164, 100%, 64%, 0.46)"
          }
        },
        9: {
          value: {
            _light: "hsla(164, 100%, 28%, 0.84)",
            _dark: "hsla(164, 99%, 61%, 0.62)"
          }
        },
        10: {
          value: {
            _light: "hsla(164, 100%, 26%, 0.85)",
            _dark: "hsla(164, 99%, 59%, 0.67)"
          }
        },
        11: {
          value: {
            _light: "hsla(164, 100%, 22%, 0.87)",
            _dark: "hsla(163, 99%, 56%, 0.84)"
          }
        },
        12: {
          value: {
            _light: "hsla(161, 100%, 7%, 0.89)",
            _dark: "hsla(155, 100%, 86%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(164, 100%, 28%, 0.84)",
            _dark: "hsla(164, 99%, 61%, 0.62)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      lime: {
        1: {
          value: {
            _light: "hsl(80, 43%, 99%)",
            _dark: "hsl(77, 23%, 6%)"
          }
        },
        2: {
          value: {
            _light: "hsl(77, 41%, 97%)",
            _dark: "hsl(90, 24%, 8%)"
          }
        },
        3: {
          value: {
            _light: "hsl(75, 64%, 90%)",
            _dark: "hsl(93, 28%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(76, 63%, 84%)",
            _dark: "hsl(92, 31%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(78, 58%, 78%)",
            _dark: "hsl(91, 32%, 20%)"
          }
        },
        6: {
          value: {
            _light: "hsl(80, 50%, 71%)",
            _dark: "hsl(92, 32%, 24%)"
          }
        },
        7: {
          value: {
            _light: "hsl(82, 43%, 63%)",
            _dark: "hsl(91, 33%, 29%)"
          }
        },
        8: {
          value: {
            _light: "hsl(85, 40%, 52%)",
            _dark: "hsl(90, 35%, 34%)"
          }
        },
        9: {
          value: {
            _light: "hsl(81, 80%, 66%)",
            _dark: "hsl(81, 80%, 66%)"
          }
        },
        10: {
          value: {
            _light: "hsl(81, 75%, 60%)",
            _dark: "hsl(78, 100%, 72%)"
          }
        },
        11: {
          value: {
            _light: "hsl(85, 45%, 34%)",
            _dark: "hsl(80, 70%, 66%)"
          }
        },
        12: {
          value: {
            _light: "hsl(75, 39%, 18%)",
            _dark: "hsl(80, 79%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(81, 80%, 66%)",
            _dark: "hsl(81, 80%, 66%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      limeAlpha: {
        1: {
          value: {
            _light: "hsla(80, 100%, 30%, 0.02)",
            _dark: "hsla(115, 100%, 37%, 0.01)"
          }
        },
        2: {
          value: {
            _light: "hsla(77, 100%, 29%, 0.05)",
            _dark: "hsla(91, 100%, 48%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(75, 100%, 39%, 0.16)",
            _dark: "hsla(93, 98%, 65%, 0.1)"
          }
        },
        4: {
          value: {
            _light: "hsla(77, 100%, 39%, 0.26)",
            _dark: "hsla(92, 99%, 68%, 0.16)"
          }
        },
        5: {
          value: {
            _light: "hsla(79, 100%, 37%, 0.35)",
            _dark: "hsla(91, 99%, 70%, 0.22)"
          }
        },
        6: {
          value: {
            _light: "hsla(80, 100%, 33%, 0.43)",
            _dark: "hsla(91, 99%, 71%, 0.27)"
          }
        },
        7: {
          value: {
            _light: "hsla(82, 100%, 30%, 0.53)",
            _dark: "hsla(90, 100%, 72%, 0.34)"
          }
        },
        8: {
          value: {
            _light: "hsla(85, 100%, 29%, 0.67)",
            _dark: "hsla(90, 97%, 71%, 0.42)"
          }
        },
        9: {
          value: {
            _light: "hsla(81, 100%, 45%, 0.61)",
            _dark: "hsla(81, 100%, 71%, 0.93)"
          }
        },
        10: {
          value: {
            _light: "hsla(81, 100%, 43%, 0.7)",
            _dark: "hsl(78, 100%, 72%)"
          }
        },
        11: {
          value: {
            _light: "hsla(85, 100%, 19%, 0.82)",
            _dark: "hsla(80, 99%, 73%, 0.89)"
          }
        },
        12: {
          value: {
            _light: "hsla(76, 100%, 8%, 0.89)",
            _dark: "hsla(80, 97%, 87%, 0.97)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(81, 100%, 45%, 0.61)",
            _dark: "hsla(81, 100%, 71%, 0.93)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      mint: {
        1: {
          value: {
            _light: "hsl(168, 71%, 99%)",
            _dark: "hsl(180, 20%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(167, 53%, 97%)",
            _dark: "hsl(180, 29%, 8%)"
          }
        },
        3: {
          value: {
            _light: "hsl(165, 70%, 92%)",
            _dark: "hsl(178, 66%, 10%)"
          }
        },
        4: {
          value: {
            _light: "hsl(165, 67%, 87%)",
            _dark: "hsl(178, 100%, 11%)"
          }
        },
        5: {
          value: {
            _light: "hsl(165, 60%, 81%)",
            _dark: "hsl(177, 100%, 14%)"
          }
        },
        6: {
          value: {
            _light: "hsl(166, 52%, 75%)",
            _dark: "hsl(175, 69%, 20%)"
          }
        },
        7: {
          value: {
            _light: "hsl(167, 46%, 65%)",
            _dark: "hsl(173, 55%, 26%)"
          }
        },
        8: {
          value: {
            _light: "hsl(168, 45%, 52%)",
            _dark: "hsl(170, 53%, 33%)"
          }
        },
        9: {
          value: {
            _light: "hsl(167, 70%, 72%)",
            _dark: "hsl(167, 70%, 72%)"
          }
        },
        10: {
          value: {
            _light: "hsl(167, 61%, 68%)",
            _dark: "hsl(168, 79%, 81%)"
          }
        },
        11: {
          value: {
            _light: "hsl(170, 97%, 24%)",
            _dark: "hsl(167, 60%, 59%)"
          }
        },
        12: {
          value: {
            _light: "hsl(171, 51%, 17%)",
            _dark: "hsl(156, 71%, 86%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(167, 70%, 72%)",
            _dark: "hsl(167, 70%, 72%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      mintAlpha: {
        1: {
          value: {
            _light: "hsla(168, 100%, 42%, 0.02)",
            _dark: "hsla(180, 100%, 44%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(167, 100%, 35%, 0.05)",
            _dark: "hsla(180, 100%, 49%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(165, 100%, 41%, 0.13)",
            _dark: "hsla(178, 100%, 50%, 0.11)"
          }
        },
        4: {
          value: {
            _light: "hsla(165, 100%, 40%, 0.22)",
            _dark: "hsla(177, 100%, 50%, 0.17)"
          }
        },
        5: {
          value: {
            _light: "hsla(165, 100%, 38%, 0.3)",
            _dark: "hsla(177, 100%, 50%, 0.23)"
          }
        },
        6: {
          value: {
            _light: "hsla(166, 100%, 35%, 0.39)",
            _dark: "hsla(175, 100%, 53%, 0.29)"
          }
        },
        7: {
          value: {
            _light: "hsla(167, 100%, 32%, 0.51)",
            _dark: "hsla(173, 98%, 60%, 0.37)"
          }
        },
        8: {
          value: {
            _light: "hsla(168, 100%, 31%, 0.7)",
            _dark: "hsla(170, 100%, 63%, 0.46)"
          }
        },
        9: {
          value: {
            _light: "hsla(167, 100%, 41%, 0.47)",
            _dark: "hsla(167, 100%, 79%, 0.91)"
          }
        },
        10: {
          value: {
            _light: "hsla(167, 100%, 38%, 0.51)",
            _dark: "hsla(167, 98%, 84%, 0.96)"
          }
        },
        11: {
          value: {
            _light: "hsla(170, 100%, 23%, 0.99)",
            _dark: "hsla(167, 100%, 70%, 0.82)"
          }
        },
        12: {
          value: {
            _light: "hsla(171, 100%, 10%, 0.91)",
            _dark: "hsla(155, 96%, 90%, 0.96)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(167, 100%, 41%, 0.47)",
            _dark: "hsla(167, 100%, 79%, 0.91)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      orange: {
        1: {
          value: {
            _light: "hsl(20, 60%, 99%)",
            _dark: "hsl(27, 24%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(33, 100%, 96%)",
            _dark: "hsl(28, 33%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(37, 100%, 92%)",
            _dark: "hsl(29, 65%, 12%)"
          }
        },
        4: {
          value: {
            _light: "hsl(34, 100%, 85%)",
            _dark: "hsl(28, 100%, 14%)"
          }
        },
        5: {
          value: {
            _light: "hsl(33, 100%, 80%)",
            _dark: "hsl(28, 100%, 17%)"
          }
        },
        6: {
          value: {
            _light: "hsl(30, 100%, 75%)",
            _dark: "hsl(27, 79%, 22%)"
          }
        },
        7: {
          value: {
            _light: "hsl(27, 87%, 71%)",
            _dark: "hsl(25, 63%, 30%)"
          }
        },
        8: {
          value: {
            _light: "hsl(25, 80%, 63%)",
            _dark: "hsl(23, 60%, 40%)"
          }
        },
        9: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        10: {
          value: {
            _light: "hsl(24, 100%, 47%)",
            _dark: "hsl(26, 100%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(23, 100%, 40%)",
            _dark: "hsl(26, 100%, 67%)"
          }
        },
        12: {
          value: {
            _light: "hsl(16, 50%, 23%)",
            _dark: "hsl(30, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      orangeAlpha: {
        1: {
          value: {
            _light: "hsla(20, 100%, 38%, 0.02)",
            _dark: "hsla(14, 100%, 46%, 0.03)"
          }
        },
        2: {
          value: {
            _light: "hsla(33, 100%, 50%, 0.07)",
            _dark: "hsla(26, 100%, 50%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(37, 100%, 50%, 0.16)",
            _dark: "hsla(25, 100%, 49%, 0.15)"
          }
        },
        4: {
          value: {
            _light: "hsla(34, 100%, 50%, 0.29)",
            _dark: "hsla(21, 100%, 50%, 0.22)"
          }
        },
        5: {
          value: {
            _light: "hsla(33, 100%, 50%, 0.4)",
            _dark: "hsla(23, 100%, 50%, 0.29)"
          }
        },
        6: {
          value: {
            _light: "hsla(30, 100%, 50%, 0.49)",
            _dark: "hsla(27, 98%, 50%, 0.36)"
          }
        },
        7: {
          value: {
            _light: "hsla(27, 100%, 46%, 0.55)",
            _dark: "hsla(25, 100%, 59%, 0.46)"
          }
        },
        8: {
          value: {
            _light: "hsla(25, 100%, 45%, 0.67)",
            _dark: "hsla(23, 99%, 61%, 0.62)"
          }
        },
        9: {
          value: {
            _light: "hsla(23, 100%, 48%, 0.92)",
            _dark: "hsla(23, 99%, 54%, 0.97)"
          }
        },
        10: {
          value: {
            _light: "hsl(24, 100%, 47%)",
            _dark: "hsl(26, 100%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(23, 100%, 40%)",
            _dark: "hsl(26, 100%, 67%)"
          }
        },
        12: {
          value: {
            _light: "hsla(16, 100%, 13%, 0.89)",
            _dark: "hsl(30, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(23, 100%, 48%, 0.92)",
            _dark: "hsla(23, 99%, 54%, 0.97)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      pink: {
        1: {
          value: {
            _light: "hsl(320, 100%, 99%)",
            _dark: "hsl(315, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(326, 78%, 98%)",
            _dark: "hsl(316, 29%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(326, 91%, 95%)",
            _dark: "hsl(315, 41%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(323, 79%, 92%)",
            _dark: "hsl(315, 58%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(323, 69%, 89%)",
            _dark: "hsl(318, 52%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(323, 60%, 84%)",
            _dark: "hsl(319, 44%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(323, 55%, 79%)",
            _dark: "hsl(321, 40%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(322, 52%, 72%)",
            _dark: "hsl(322, 40%, 47%)"
          }
        },
        9: {
          value: {
            _light: "hsl(322, 65%, 55%)",
            _dark: "hsl(322, 65%, 55%)"
          }
        },
        10: {
          value: {
            _light: "hsl(322, 61%, 52%)",
            _dark: "hsl(323, 68%, 59%)"
          }
        },
        11: {
          value: {
            _light: "hsl(322, 65%, 46%)",
            _dark: "hsl(327, 100%, 78%)"
          }
        },
        12: {
          value: {
            _light: "hsl(320, 70%, 23%)",
            _dark: "hsl(326, 92%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(322, 65%, 55%)",
            _dark: "hsl(322, 65%, 55%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      pinkAlpha: {
        1: {
          value: {
            _light: "hsla(320, 100%, 50%, 0.01)",
            _dark: "hsla(315, 91%, 51%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(326, 100%, 44%, 0.03)",
            _dark: "hsla(316, 91%, 54%, 0.07)"
          }
        },
        3: {
          value: {
            _light: "hsla(326, 100%, 48%, 0.09)",
            _dark: "hsla(315, 99%, 61%, 0.16)"
          }
        },
        4: {
          value: {
            _light: "hsla(323, 100%, 44%, 0.14)",
            _dark: "hsla(315, 97%, 55%, 0.25)"
          }
        },
        5: {
          value: {
            _light: "hsla(322, 100%, 41%, 0.19)",
            _dark: "hsla(318, 98%, 60%, 0.31)"
          }
        },
        6: {
          value: {
            _light: "hsla(323, 100%, 38%, 0.25)",
            _dark: "hsla(319, 98%, 65%, 0.37)"
          }
        },
        7: {
          value: {
            _light: "hsla(323, 100%, 36%, 0.33)",
            _dark: "hsla(321, 97%, 69%, 0.48)"
          }
        },
        8: {
          value: {
            _light: "hsla(322, 100%, 34%, 0.42)",
            _dark: "hsla(322, 100%, 70%, 0.64)"
          }
        },
        9: {
          value: {
            _light: "hsla(322, 100%, 39%, 0.75)",
            _dark: "hsla(322, 99%, 64%, 0.83)"
          }
        },
        10: {
          value: {
            _light: "hsla(322, 100%, 38%, 0.78)",
            _dark: "hsla(323, 100%, 68%, 0.86)"
          }
        },
        11: {
          value: {
            _light: "hsla(322, 100%, 36%, 0.84)",
            _dark: "hsl(327, 100%, 78%)"
          }
        },
        12: {
          value: {
            _light: "hsla(320, 100%, 17%, 0.93)",
            _dark: "hsla(326, 100%, 91%, 0.99)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(322, 100%, 39%, 0.75)",
            _dark: "hsla(322, 99%, 64%, 0.83)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      plum: {
        1: {
          value: {
            _light: "hsl(280, 100%, 99%)",
            _dark: "hsl(300, 17%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(300, 60%, 98%)",
            _dark: "hsl(300, 25%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(300, 67%, 95%)",
            _dark: "hsl(300, 34%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(298, 65%, 92%)",
            _dark: "hsl(297, 42%, 20%)"
          }
        },
        5: {
          value: {
            _light: "hsl(298, 59%, 89%)",
            _dark: "hsl(296, 40%, 24%)"
          }
        },
        6: {
          value: {
            _light: "hsl(296, 53%, 84%)",
            _dark: "hsl(296, 34%, 28%)"
          }
        },
        7: {
          value: {
            _light: "hsl(294, 49%, 78%)",
            _dark: "hsl(294, 31%, 36%)"
          }
        },
        8: {
          value: {
            _light: "hsl(292, 48%, 71%)",
            _dark: "hsl(292, 30%, 47%)"
          }
        },
        9: {
          value: {
            _light: "hsl(292, 45%, 51%)",
            _dark: "hsl(292, 45%, 51%)"
          }
        },
        10: {
          value: {
            _light: "hsl(292, 44%, 48%)",
            _dark: "hsl(292, 48%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(292, 45%, 44%)",
            _dark: "hsl(292, 79%, 77%)"
          }
        },
        12: {
          value: {
            _light: "hsl(291, 58%, 23%)",
            _dark: "hsl(300, 59%, 89%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(292, 45%, 51%)",
            _dark: "hsl(292, 45%, 51%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      plumAlpha: {
        1: {
          value: {
            _light: "hsla(280, 100%, 50%, 0.01)",
            _dark: "hsla(300, 89%, 51%, 0.03)"
          }
        },
        2: {
          value: {
            _light: "hsla(300, 100%, 38%, 0.03)",
            _dark: "hsla(300, 88%, 57%, 0.07)"
          }
        },
        3: {
          value: {
            _light: "hsla(300, 100%, 40%, 0.08)",
            _dark: "hsla(300, 98%, 65%, 0.15)"
          }
        },
        4: {
          value: {
            _light: "hsla(298, 100%, 39%, 0.13)",
            _dark: "hsla(297, 100%, 64%, 0.23)"
          }
        },
        5: {
          value: {
            _light: "hsla(298, 100%, 37%, 0.18)",
            _dark: "hsla(296, 100%, 67%, 0.28)"
          }
        },
        6: {
          value: {
            _light: "hsla(296, 100%, 35%, 0.24)",
            _dark: "hsla(296, 100%, 71%, 0.34)"
          }
        },
        7: {
          value: {
            _light: "hsla(295, 100%, 33%, 0.32)",
            _dark: "hsla(294, 97%, 74%, 0.44)"
          }
        },
        8: {
          value: {
            _light: "hsla(292, 100%, 32%, 0.43)",
            _dark: "hsla(292, 100%, 76%, 0.58)"
          }
        },
        9: {
          value: {
            _light: "hsla(292, 100%, 31%, 0.71)",
            _dark: "hsla(292, 99%, 69%, 0.71)"
          }
        },
        10: {
          value: {
            _light: "hsla(292, 100%, 29%, 0.73)",
            _dark: "hsla(292, 100%, 72%, 0.75)"
          }
        },
        11: {
          value: {
            _light: "hsla(291, 100%, 26%, 0.76)",
            _dark: "hsla(292, 98%, 80%, 0.95)"
          }
        },
        12: {
          value: {
            _light: "hsla(291, 100%, 15%, 0.9)",
            _dark: "hsla(300, 94%, 93%, 0.96)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(292, 100%, 31%, 0.71)",
            _dark: "hsla(292, 99%, 69%, 0.71)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      purple: {
        1: {
          value: {
            _light: "hsl(300, 50%, 99%)",
            _dark: "hsl(282, 23%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(274, 78%, 98%)",
            _dark: "hsl(279, 25%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(275, 89%, 96%)",
            _dark: "hsl(279, 36%, 17%)"
          }
        },
        4: {
          value: {
            _light: "hsl(277, 81%, 94%)",
            _dark: "hsl(277, 39%, 22%)"
          }
        },
        5: {
          value: {
            _light: "hsl(275, 75%, 91%)",
            _dark: "hsl(276, 38%, 26%)"
          }
        },
        6: {
          value: {
            _light: "hsl(275, 69%, 86%)",
            _dark: "hsl(275, 35%, 31%)"
          }
        },
        7: {
          value: {
            _light: "hsl(273, 62%, 81%)",
            _dark: "hsl(274, 33%, 38%)"
          }
        },
        8: {
          value: {
            _light: "hsl(272, 60%, 74%)",
            _dark: "hsl(273, 33%, 50%)"
          }
        },
        9: {
          value: {
            _light: "hsl(272, 51%, 54%)",
            _dark: "hsl(272, 51%, 54%)"
          }
        },
        10: {
          value: {
            _light: "hsl(272, 45%, 50%)",
            _dark: "hsl(272, 55%, 59%)"
          }
        },
        11: {
          value: {
            _light: "hsl(272, 45%, 49%)",
            _dark: "hsl(272, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsl(270, 50%, 25%)",
            _dark: "hsl(275, 77%, 92%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(272, 51%, 54%)",
            _dark: "hsl(272, 51%, 54%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      purpleAlpha: {
        1: {
          value: {
            _light: "hsla(300, 100%, 33%, 0.01)",
            _dark: "hsla(282, 95%, 52%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(274, 100%, 44%, 0.03)",
            _dark: "hsla(279, 92%, 62%, 0.08)"
          }
        },
        3: {
          value: {
            _light: "hsla(275, 100%, 47%, 0.07)",
            _dark: "hsla(279, 100%, 66%, 0.18)"
          }
        },
        4: {
          value: {
            _light: "hsla(277, 100%, 45%, 0.11)",
            _dark: "hsla(277, 98%, 66%, 0.26)"
          }
        },
        5: {
          value: {
            _light: "hsla(275, 100%, 43%, 0.16)",
            _dark: "hsla(277, 98%, 68%, 0.32)"
          }
        },
        6: {
          value: {
            _light: "hsla(275, 99%, 41%, 0.23)",
            _dark: "hsla(275, 97%, 71%, 0.38)"
          }
        },
        7: {
          value: {
            _light: "hsla(274, 100%, 38%, 0.31)",
            _dark: "hsla(274, 97%, 73%, 0.48)"
          }
        },
        8: {
          value: {
            _light: "hsla(272, 100%, 38%, 0.42)",
            _dark: "hsla(273, 100%, 75%, 0.64)"
          }
        },
        9: {
          value: {
            _light: "hsla(272, 100%, 34%, 0.69)",
            _dark: "hsla(272, 100%, 69%, 0.76)"
          }
        },
        10: {
          value: {
            _light: "hsla(272, 100%, 31%, 0.72)",
            _dark: "hsla(272, 100%, 72%, 0.8)"
          }
        },
        11: {
          value: {
            _light: "hsla(272, 100%, 30%, 0.73)",
            _dark: "hsl(272, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsla(270, 100%, 14%, 0.87)",
            _dark: "hsla(275, 100%, 93%, 0.98)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(272, 100%, 34%, 0.69)",
            _dark: "hsla(272, 100%, 69%, 0.76)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      red: {
        1: {
          value: {
            _light: "hsl(0, 100%, 99%)",
            _dark: "hsl(0, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 100%, 98%)",
            _dark: "hsl(355, 25%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(357, 90%, 96%)",
            _dark: "hsl(350, 53%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(358, 100%, 93%)",
            _dark: "hsl(348, 68%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(359, 100%, 90%)",
            _dark: "hsl(350, 63%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(359, 94%, 87%)",
            _dark: "hsl(352, 53%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(359, 77%, 81%)",
            _dark: "hsl(355, 47%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(359, 70%, 74%)",
            _dark: "hsl(358, 45%, 49%)"
          }
        },
        9: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        10: {
          value: {
            _light: "hsl(358, 69%, 55%)",
            _dark: "hsl(360, 79%, 65%)"
          }
        },
        11: {
          value: {
            _light: "hsl(358, 65%, 49%)",
            _dark: "hsl(2, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsl(351, 63%, 24%)",
            _dark: "hsl(350, 100%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      redAlpha: {
        1: {
          value: {
            _light: "hsla(0, 100%, 50%, 0.01)",
            _dark: "hsla(0, 91%, 51%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(0, 100%, 50%, 0.03)",
            _dark: "hsla(355, 88%, 57%, 0.07)"
          }
        },
        3: {
          value: {
            _light: "hsla(357, 100%, 48%, 0.08)",
            _dark: "hsla(350, 100%, 55%, 0.18)"
          }
        },
        4: {
          value: {
            _light: "hsla(358, 100%, 50%, 0.14)",
            _dark: "hsla(348, 99%, 52%, 0.27)"
          }
        },
        5: {
          value: {
            _light: "hsla(359, 100%, 50%, 0.2)",
            _dark: "hsla(350, 100%, 56%, 0.34)"
          }
        },
        6: {
          value: {
            _light: "hsla(359, 100%, 49%, 0.26)",
            _dark: "hsla(353, 100%, 62%, 0.41)"
          }
        },
        7: {
          value: {
            _light: "hsla(359, 100%, 44%, 0.34)",
            _dark: "hsla(355, 100%, 66%, 0.52)"
          }
        },
        8: {
          value: {
            _light: "hsla(359, 100%, 41%, 0.44)",
            _dark: "hsla(359, 100%, 68%, 0.69)"
          }
        },
        9: {
          value: {
            _light: "hsla(358, 100%, 43%, 0.72)",
            _dark: "hsla(358, 99%, 65%, 0.89)"
          }
        },
        10: {
          value: {
            _light: "hsla(359, 100%, 41%, 0.76)",
            _dark: "hsla(360, 100%, 70%, 0.92)"
          }
        },
        11: {
          value: {
            _light: "hsla(358, 100%, 38%, 0.83)",
            _dark: "hsl(2, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsla(351, 100%, 17%, 0.91)",
            _dark: "hsl(350, 100%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(358, 100%, 43%, 0.72)",
            _dark: "hsla(358, 99%, 65%, 0.89)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      ruby: {
        1: {
          value: {
            _light: "hsl(340, 100%, 99%)",
            _dark: "hsl(345, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(353, 100%, 98%)",
            _dark: "hsl(347, 18%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(351, 91%, 96%)",
            _dark: "hsl(344, 49%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(351, 100%, 93%)",
            _dark: "hsl(342, 61%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(350, 100%, 90%)",
            _dark: "hsl(342, 57%, 24%)"
          }
        },
        6: {
          value: {
            _light: "hsl(351, 80%, 86%)",
            _dark: "hsl(344, 50%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(349, 68%, 81%)",
            _dark: "hsl(346, 45%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(348, 61%, 74%)",
            _dark: "hsl(348, 45%, 48%)"
          }
        },
        9: {
          value: {
            _light: "hsl(348, 75%, 59%)",
            _dark: "hsl(348, 75%, 59%)"
          }
        },
        10: {
          value: {
            _light: "hsl(347, 70%, 55%)",
            _dark: "hsl(350, 79%, 64%)"
          }
        },
        11: {
          value: {
            _light: "hsl(345, 70%, 47%)",
            _dark: "hsl(355, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsl(344, 63%, 24%)",
            _dark: "hsl(340, 96%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(348, 75%, 59%)",
            _dark: "hsl(348, 75%, 59%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      rubyAlpha: {
        1: {
          value: {
            _light: "hsla(340, 100%, 50%, 0.01)",
            _dark: "hsla(345, 91%, 51%, 0.04)"
          }
        },
        2: {
          value: {
            _light: "hsla(352, 100%, 50%, 0.03)",
            _dark: "hsla(346, 99%, 67%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(351, 100%, 48%, 0.08)",
            _dark: "hsla(344, 100%, 57%, 0.17)"
          }
        },
        4: {
          value: {
            _light: "hsla(351, 100%, 50%, 0.14)",
            _dark: "hsla(342, 98%, 55%, 0.26)"
          }
        },
        5: {
          value: {
            _light: "hsla(350, 100%, 50%, 0.19)",
            _dark: "hsla(342, 99%, 59%, 0.33)"
          }
        },
        6: {
          value: {
            _light: "hsla(351, 100%, 45%, 0.25)",
            _dark: "hsla(344, 100%, 63%, 0.4)"
          }
        },
        7: {
          value: {
            _light: "hsla(349, 100%, 40%, 0.33)",
            _dark: "hsla(346, 100%, 67%, 0.5)"
          }
        },
        8: {
          value: {
            _light: "hsla(348, 100%, 38%, 0.43)",
            _dark: "hsla(348, 100%, 68%, 0.68)"
          }
        },
        9: {
          value: {
            _light: "hsla(348, 100%, 43%, 0.73)",
            _dark: "hsla(348, 99%, 65%, 0.89)"
          }
        },
        10: {
          value: {
            _light: "hsla(347, 100%, 41%, 0.77)",
            _dark: "hsla(350, 100%, 69%, 0.92)"
          }
        },
        11: {
          value: {
            _light: "hsla(345, 100%, 38%, 0.86)",
            _dark: "hsl(355, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsla(344, 100%, 17%, 0.91)",
            _dark: "hsla(340, 100%, 91%, 1)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(348, 100%, 43%, 0.73)",
            _dark: "hsla(348, 99%, 65%, 0.89)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      sky: {
        1: {
          value: {
            _light: "hsl(190, 100%, 99%)",
            _dark: "hsl(217, 41%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(195, 75%, 97%)",
            _dark: "hsl(215, 39%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(195, 88%, 94%)",
            _dark: "hsl(211, 58%, 16%)"
          }
        },
        4: {
          value: {
            _light: "hsl(195, 80%, 90%)",
            _dark: "hsl(208, 67%, 20%)"
          }
        },
        5: {
          value: {
            _light: "hsl(195, 73%, 85%)",
            _dark: "hsl(206, 66%, 24%)"
          }
        },
        6: {
          value: {
            _light: "hsl(197, 65%, 80%)",
            _dark: "hsl(205, 64%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(197, 61%, 72%)",
            _dark: "hsl(203, 65%, 35%)"
          }
        },
        8: {
          value: {
            _light: "hsl(198, 60%, 61%)",
            _dark: "hsl(200, 75%, 39%)"
          }
        },
        9: {
          value: {
            _light: "hsl(193, 98%, 74%)",
            _dark: "hsl(193, 98%, 74%)"
          }
        },
        10: {
          value: {
            _light: "hsl(194, 90%, 71%)",
            _dark: "hsl(192, 100%, 83%)"
          }
        },
        11: {
          value: {
            _light: "hsl(196, 100%, 31%)",
            _dark: "hsl(200, 80%, 70%)"
          }
        },
        12: {
          value: {
            _light: "hsl(205, 50%, 23%)",
            _dark: "hsl(192, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(193, 98%, 74%)",
            _dark: "hsl(193, 98%, 74%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      skyAlpha: {
        1: {
          value: {
            _light: "hsla(190, 100%, 50%, 0.02)",
            _dark: "hsla(224, 100%, 50%, 0.06)"
          }
        },
        2: {
          value: {
            _light: "hsla(195, 100%, 43%, 0.05)",
            _dark: "hsla(215, 97%, 53%, 0.09)"
          }
        },
        3: {
          value: {
            _light: "hsla(195, 100%, 47%, 0.12)",
            _dark: "hsla(211, 98%, 53%, 0.2)"
          }
        },
        4: {
          value: {
            _light: "hsla(195, 100%, 45%, 0.18)",
            _dark: "hsla(208, 100%, 54%, 0.29)"
          }
        },
        5: {
          value: {
            _light: "hsla(195, 100%, 42%, 0.25)",
            _dark: "hsla(206, 98%, 55%, 0.36)"
          }
        },
        6: {
          value: {
            _light: "hsla(197, 100%, 40%, 0.34)",
            _dark: "hsla(205, 100%, 58%, 0.45)"
          }
        },
        7: {
          value: {
            _light: "hsla(197, 100%, 38%, 0.45)",
            _dark: "hsla(203, 99%, 58%, 0.55)"
          }
        },
        8: {
          value: {
            _light: "hsla(198, 100%, 37%, 0.62)",
            _dark: "hsla(200, 99%, 55%, 0.66)"
          }
        },
        9: {
          value: {
            _light: "hsla(193, 100%, 50%, 0.51)",
            _dark: "hsla(193, 100%, 74%, 1)"
          }
        },
        10: {
          value: {
            _light: "hsla(194, 100%, 48%, 0.55)",
            _dark: "hsl(192, 100%, 83%)"
          }
        },
        11: {
          value: {
            _light: "hsl(196, 100%, 31%)",
            _dark: "hsla(200, 100%, 74%, 0.94)"
          }
        },
        12: {
          value: {
            _light: "hsla(205, 100%, 13%, 0.89)",
            _dark: "hsl(192, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(193, 100%, 50%, 0.51)",
            _dark: "hsla(193, 100%, 74%, 1)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      slate: {
        1: {
          value: {
            _light: "hsl(240, 20%, 99%)",
            _dark: "hsl(240, 6%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(240, 20%, 98%)",
            _dark: "hsl(220, 6%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(240, 11%, 95%)",
            _dark: "hsl(225, 6%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(240, 10%, 92%)",
            _dark: "hsl(210, 7%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(230, 11%, 89%)",
            _dark: "hsl(214, 7%, 19%)"
          }
        },
        6: {
          value: {
            _light: "hsl(240, 10%, 86%)",
            _dark: "hsl(213, 8%, 23%)"
          }
        },
        7: {
          value: {
            _light: "hsl(233, 10%, 82%)",
            _dark: "hsl(213, 8%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(231, 10%, 75%)",
            _dark: "hsl(212, 8%, 38%)"
          }
        },
        9: {
          value: {
            _light: "hsl(231, 6%, 57%)",
            _dark: "hsl(219, 6%, 44%)"
          }
        },
        10: {
          value: {
            _light: "hsl(226, 5%, 53%)",
            _dark: "hsl(222, 5%, 49%)"
          }
        },
        11: {
          value: {
            _light: "hsl(220, 6%, 40%)",
            _dark: "hsl(216, 7%, 71%)"
          }
        },
        12: {
          value: {
            _light: "hsl(210, 13%, 13%)",
            _dark: "hsl(220, 9%, 94%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(231, 6%, 57%)",
            _dark: "hsl(219, 6%, 44%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      slateAlpha: {
        1: {
          value: {
            _light: "hsla(240, 100%, 17%, 0.01)",
            _dark: "hsla(0, 0%, 0%, 0)"
          }
        },
        2: {
          value: {
            _light: "hsla(240, 100%, 17%, 0.02)",
            _dark: "hsla(184, 63%, 91%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(240, 100%, 10%, 0.06)",
            _dark: "hsla(211, 66%, 92%, 0.08)"
          }
        },
        4: {
          value: {
            _light: "hsla(240, 100%, 9%, 0.09)",
            _dark: "hsla(198, 73%, 90%, 0.11)"
          }
        },
        5: {
          value: {
            _light: "hsla(229, 100%, 10%, 0.12)",
            _dark: "hsla(208, 95%, 92%, 0.15)"
          }
        },
        6: {
          value: {
            _light: "hsla(240, 100%, 9%, 0.15)",
            _dark: "hsla(208, 91%, 92%, 0.19)"
          }
        },
        7: {
          value: {
            _light: "hsla(232, 100%, 9%, 0.2)",
            _dark: "hsla(208, 100%, 93%, 0.25)"
          }
        },
        8: {
          value: {
            _light: "hsla(230, 100%, 9%, 0.27)",
            _dark: "hsla(208, 100%, 93%, 0.36)"
          }
        },
        9: {
          value: {
            _light: "hsla(230, 100%, 6%, 0.45)",
            _dark: "hsla(216, 88%, 93%, 0.43)"
          }
        },
        10: {
          value: {
            _light: "hsla(224, 100%, 5%, 0.5)",
            _dark: "hsla(220, 86%, 95%, 0.48)"
          }
        },
        11: {
          value: {
            _light: "hsla(219, 100%, 4%, 0.62)",
            _dark: "hsla(212, 87%, 97%, 0.71)"
          }
        },
        12: {
          value: {
            _light: "hsla(207, 100%, 2%, 0.89)",
            _dark: "hsla(220, 100%, 99%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(230, 100%, 6%, 0.45)",
            _dark: "hsla(216, 88%, 93%, 0.43)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      teal: {
        1: {
          value: {
            _light: "hsl(165, 67%, 99%)",
            _dark: "hsl(173, 24%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(165, 50%, 97%)",
            _dark: "hsl(175, 24%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(167, 63%, 93%)",
            _dark: "hsl(174, 55%, 11%)"
          }
        },
        4: {
          value: {
            _light: "hsl(166, 62%, 88%)",
            _dark: "hsl(176, 93%, 12%)"
          }
        },
        5: {
          value: {
            _light: "hsl(168, 54%, 82%)",
            _dark: "hsl(175, 80%, 16%)"
          }
        },
        6: {
          value: {
            _light: "hsl(168, 48%, 75%)",
            _dark: "hsl(174, 63%, 21%)"
          }
        },
        7: {
          value: {
            _light: "hsl(170, 43%, 66%)",
            _dark: "hsl(174, 58%, 26%)"
          }
        },
        8: {
          value: {
            _light: "hsl(172, 42%, 53%)",
            _dark: "hsl(173, 59%, 31%)"
          }
        },
        9: {
          value: {
            _light: "hsl(173, 80%, 36%)",
            _dark: "hsl(173, 80%, 36%)"
          }
        },
        10: {
          value: {
            _light: "hsl(173, 85%, 33%)",
            _dark: "hsl(172, 85%, 38%)"
          }
        },
        11: {
          value: {
            _light: "hsl(172, 100%, 26%)",
            _dark: "hsl(170, 90%, 45%)"
          }
        },
        12: {
          value: {
            _light: "hsl(174, 65%, 15%)",
            _dark: "hsl(163, 69%, 81%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(173, 80%, 36%)",
            _dark: "hsl(173, 80%, 36%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      tealAlpha: {
        1: {
          value: {
            _light: "hsla(165, 100%, 40%, 0.02)",
            _dark: "hsla(166, 100%, 44%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(165, 100%, 33%, 0.05)",
            _dark: "hsla(175, 97%, 53%, 0.05)"
          }
        },
        3: {
          value: {
            _light: "hsla(168, 100%, 39%, 0.12)",
            _dark: "hsla(174, 100%, 50%, 0.12)"
          }
        },
        4: {
          value: {
            _light: "hsla(166, 100%, 38%, 0.2)",
            _dark: "hsla(175, 100%, 50%, 0.18)"
          }
        },
        5: {
          value: {
            _light: "hsla(168, 100%, 35%, 0.28)",
            _dark: "hsla(175, 100%, 50%, 0.23)"
          }
        },
        6: {
          value: {
            _light: "hsla(168, 100%, 33%, 0.37)",
            _dark: "hsla(174, 100%, 55%, 0.29)"
          }
        },
        7: {
          value: {
            _light: "hsla(170, 100%, 30%, 0.49)",
            _dark: "hsla(174, 98%, 59%, 0.37)"
          }
        },
        8: {
          value: {
            _light: "hsla(172, 100%, 30%, 0.67)",
            _dark: "hsla(173, 100%, 60%, 0.46)"
          }
        },
        9: {
          value: {
            _light: "hsla(173, 100%, 31%, 0.93)",
            _dark: "hsla(173, 100%, 54%, 0.62)"
          }
        },
        10: {
          value: {
            _light: "hsla(173, 100%, 29%, 0.95)",
            _dark: "hsla(172, 100%, 53%, 0.68)"
          }
        },
        11: {
          value: {
            _light: "hsl(172, 100%, 26%)",
            _dark: "hsla(170, 99%, 52%, 0.84)"
          }
        },
        12: {
          value: {
            _light: "hsla(173, 100%, 10%, 0.95)",
            _dark: "hsla(163, 100%, 86%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(173, 100%, 31%, 0.93)",
            _dark: "hsla(173, 100%, 54%, 0.62)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      tomato: {
        1: {
          value: {
            _light: "hsl(0, 100%, 99%)",
            _dark: "hsl(0, 17%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(7, 100%, 98%)",
            _dark: "hsl(10, 24%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(10, 92%, 95%)",
            _dark: "hsl(5, 48%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(12, 100%, 91%)",
            _dark: "hsl(4, 64%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(11, 100%, 88%)",
            _dark: "hsl(5, 62%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(11, 95%, 84%)",
            _dark: "hsl(7, 55%, 28%)"
          }
        },
        7: {
          value: {
            _light: "hsl(10, 82%, 78%)",
            _dark: "hsl(9, 49%, 35%)"
          }
        },
        8: {
          value: {
            _light: "hsl(10, 75%, 70%)",
            _dark: "hsl(10, 50%, 45%)"
          }
        },
        9: {
          value: {
            _light: "hsl(10, 78%, 54%)",
            _dark: "hsl(10, 78%, 54%)"
          }
        },
        10: {
          value: {
            _light: "hsl(10, 73%, 51%)",
            _dark: "hsl(11, 82%, 59%)"
          }
        },
        11: {
          value: {
            _light: "hsl(10, 82%, 45%)",
            _dark: "hsl(12, 100%, 75%)"
          }
        },
        12: {
          value: {
            _light: "hsl(8, 50%, 24%)",
            _dark: "hsl(10, 86%, 89%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(10, 78%, 54%)",
            _dark: "hsl(10, 78%, 54%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      tomatoAlpha: {
        1: {
          value: {
            _light: "hsla(0, 100%, 50%, 0.01)",
            _dark: "hsla(0, 89%, 51%, 0.03)"
          }
        },
        2: {
          value: {
            _light: "hsla(8, 100%, 50%, 0.03)",
            _dark: "hsla(10, 100%, 60%, 0.06)"
          }
        },
        3: {
          value: {
            _light: "hsla(11, 100%, 48%, 0.09)",
            _dark: "hsla(5, 100%, 57%, 0.17)"
          }
        },
        4: {
          value: {
            _light: "hsla(12, 100%, 50%, 0.17)",
            _dark: "hsla(4, 98%, 53%, 0.26)"
          }
        },
        5: {
          value: {
            _light: "hsla(11, 100%, 50%, 0.24)",
            _dark: "hsla(5, 99%, 56%, 0.33)"
          }
        },
        6: {
          value: {
            _light: "hsla(11, 100%, 49%, 0.31)",
            _dark: "hsla(7, 100%, 61%, 0.39)"
          }
        },
        7: {
          value: {
            _light: "hsla(10, 100%, 45%, 0.4)",
            _dark: "hsla(9, 98%, 64%, 0.49)"
          }
        },
        8: {
          value: {
            _light: "hsla(10, 100%, 43%, 0.52)",
            _dark: "hsla(11, 99%, 65%, 0.65)"
          }
        },
        9: {
          value: {
            _light: "hsla(10, 100%, 44%, 0.82)",
            _dark: "hsla(10, 99%, 59%, 0.89)"
          }
        },
        10: {
          value: {
            _light: "hsla(10, 100%, 42%, 0.85)",
            _dark: "hsla(11, 100%, 64%, 0.92)"
          }
        },
        11: {
          value: {
            _light: "hsla(10, 100%, 40%, 0.92)",
            _dark: "hsl(12, 100%, 75%)"
          }
        },
        12: {
          value: {
            _light: "hsla(8, 100%, 14%, 0.88)",
            _dark: "hsla(10, 100%, 90%, 0.98)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(10, 100%, 44%, 0.82)",
            _dark: "hsla(10, 99%, 59%, 0.89)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      violet: {
        1: {
          value: {
            _light: "hsl(270, 50%, 99%)",
            _dark: "hsl(249, 27%, 10%)"
          }
        },
        2: {
          value: {
            _light: "hsl(257, 100%, 99%)",
            _dark: "hsl(263, 28%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(257, 88%, 97%)",
            _dark: "hsl(257, 37%, 19%)"
          }
        },
        4: {
          value: {
            _light: "hsl(256, 100%, 95%)",
            _dark: "hsl(256, 42%, 25%)"
          }
        },
        5: {
          value: {
            _light: "hsl(253, 100%, 93%)",
            _dark: "hsl(254, 39%, 30%)"
          }
        },
        6: {
          value: {
            _light: "hsl(252, 96%, 89%)",
            _dark: "hsl(255, 36%, 34%)"
          }
        },
        7: {
          value: {
            _light: "hsl(252, 76%, 84%)",
            _dark: "hsl(254, 33%, 41%)"
          }
        },
        8: {
          value: {
            _light: "hsl(252, 69%, 76%)",
            _dark: "hsl(252, 34%, 51%)"
          }
        },
        9: {
          value: {
            _light: "hsl(252, 56%, 57%)",
            _dark: "hsl(252, 56%, 57%)"
          }
        },
        10: {
          value: {
            _light: "hsl(252, 50%, 54%)",
            _dark: "hsl(252, 60%, 63%)"
          }
        },
        11: {
          value: {
            _light: "hsl(252, 43%, 52%)",
            _dark: "hsl(253, 100%, 83%)"
          }
        },
        12: {
          value: {
            _light: "hsl(249, 43%, 26%)",
            _dark: "hsl(249, 94%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(252, 56%, 57%)",
            _dark: "hsl(252, 56%, 57%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      violetAlpha: {
        1: {
          value: {
            _light: "hsla(270, 100%, 33%, 0.01)",
            _dark: "hsla(249, 100%, 57%, 0.06)"
          }
        },
        2: {
          value: {
            _light: "hsla(257, 100%, 50%, 0.03)",
            _dark: "hsla(263, 94%, 61%, 0.09)"
          }
        },
        3: {
          value: {
            _light: "hsla(257, 100%, 47%, 0.06)",
            _dark: "hsla(257, 99%, 66%, 0.21)"
          }
        },
        4: {
          value: {
            _light: "hsla(256, 100%, 50%, 0.11)",
            _dark: "hsla(255, 98%, 65%, 0.31)"
          }
        },
        5: {
          value: {
            _light: "hsla(253, 100%, 50%, 0.15)",
            _dark: "hsla(254, 98%, 68%, 0.37)"
          }
        },
        6: {
          value: {
            _light: "hsla(252, 100%, 49%, 0.21)",
            _dark: "hsla(254, 97%, 71%, 0.43)"
          }
        },
        7: {
          value: {
            _light: "hsla(252, 99%, 44%, 0.29)",
            _dark: "hsla(254, 100%, 74%, 0.51)"
          }
        },
        8: {
          value: {
            _light: "hsla(252, 100%, 41%, 0.4)",
            _dark: "hsla(252, 98%, 74%, 0.66)"
          }
        },
        9: {
          value: {
            _light: "hsla(252, 100%, 36%, 0.66)",
            _dark: "hsla(252, 100%, 70%, 0.8)"
          }
        },
        10: {
          value: {
            _light: "hsla(252, 100%, 34%, 0.7)",
            _dark: "hsla(252, 99%, 73%, 0.84)"
          }
        },
        11: {
          value: {
            _light: "hsla(252, 100%, 30%, 0.69)",
            _dark: "hsl(253, 100%, 83%)"
          }
        },
        12: {
          value: {
            _light: "hsla(250, 100%, 13%, 0.85)",
            _dark: "hsla(249, 100%, 94%, 1)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(252, 100%, 36%, 0.66)",
            _dark: "hsla(252, 100%, 70%, 0.8)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      yellow: {
        1: {
          value: {
            _light: "hsl(60, 50%, 98%)",
            _dark: "hsl(47, 29%, 6%)"
          }
        },
        2: {
          value: {
            _light: "hsl(54, 91%, 95%)",
            _dark: "hsl(45, 29%, 8%)"
          }
        },
        3: {
          value: {
            _light: "hsl(56, 100%, 86%)",
            _dark: "hsl(45, 80%, 10%)"
          }
        },
        4: {
          value: {
            _light: "hsl(53, 100%, 79%)",
            _dark: "hsl(48, 100%, 11%)"
          }
        },
        5: {
          value: {
            _light: "hsl(50, 100%, 72%)",
            _dark: "hsl(47, 100%, 13%)"
          }
        },
        6: {
          value: {
            _light: "hsl(48, 85%, 68%)",
            _dark: "hsl(48, 95%, 16%)"
          }
        },
        7: {
          value: {
            _light: "hsl(46, 70%, 65%)",
            _dark: "hsl(46, 63%, 25%)"
          }
        },
        8: {
          value: {
            _light: "hsl(45, 65%, 53%)",
            _dark: "hsl(45, 60%, 32%)"
          }
        },
        9: {
          value: {
            _light: "hsl(53, 100%, 58%)",
            _dark: "hsl(53, 100%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(52, 100%, 50%)",
            _dark: "hsl(60, 100%, 67%)"
          }
        },
        11: {
          value: {
            _light: "hsl(41, 100%, 31%)",
            _dark: "hsl(53, 90%, 62%)"
          }
        },
        12: {
          value: {
            _light: "hsl(42, 39%, 20%)",
            _dark: "hsl(53, 79%, 84%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(53, 100%, 58%)",
            _dark: "hsl(53, 100%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      yellowAlpha: {
        1: {
          value: {
            _light: "hsla(60, 100%, 33%, 0.02)",
            _dark: "hsla(23, 100%, 41%, 0.02)"
          }
        },
        2: {
          value: {
            _light: "hsla(54, 100%, 48%, 0.09)",
            _dark: "hsla(43, 100%, 49%, 0.04)"
          }
        },
        3: {
          value: {
            _light: "hsla(56, 100%, 50%, 0.28)",
            _dark: "hsla(40, 100%, 50%, 0.12)"
          }
        },
        4: {
          value: {
            _light: "hsla(53, 100%, 50%, 0.42)",
            _dark: "hsla(43, 100%, 50%, 0.16)"
          }
        },
        5: {
          value: {
            _light: "hsla(50, 100%, 50%, 0.56)",
            _dark: "hsla(44, 100%, 50%, 0.21)"
          }
        },
        6: {
          value: {
            _light: "hsla(48, 100%, 46%, 0.59)",
            _dark: "hsla(46, 100%, 50%, 0.27)"
          }
        },
        7: {
          value: {
            _light: "hsla(46, 100%, 41%, 0.6)",
            _dark: "hsla(46, 98%, 56%, 0.36)"
          }
        },
        8: {
          value: {
            _light: "hsla(45, 100%, 39%, 0.78)",
            _dark: "hsla(45, 98%, 59%, 0.48)"
          }
        },
        9: {
          value: {
            _light: "hsla(53, 100%, 50%, 0.84)",
            _dark: "hsl(53, 100%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(52, 100%, 50%)",
            _dark: "hsl(60, 100%, 67%)"
          }
        },
        11: {
          value: {
            _light: "hsl(41, 100%, 31%)",
            _dark: "hsla(53, 99%, 64%, 0.96)"
          }
        },
        12: {
          value: {
            _light: "hsla(42, 100%, 9%, 0.88)",
            _dark: "hsla(53, 97%, 86%, 0.96)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(53, 100%, 50%, 0.84)",
            _dark: "hsl(53, 100%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      }
    },
    "brand-palettes": {
      ctyellow: {
        1: {
          value: {
            _light: "hsl(40, 60%, 99%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        },
        2: {
          value: {
            _light: "hsl(46, 100%, 96%)",
            _dark: "hsl(40, 40%, 6%)"
          }
        },
        3: {
          value: {
            _light: "hsl(46, 100%, 91%)",
            _dark: "hsl(45, 82%, 9%)"
          }
        },
        4: {
          value: {
            _light: "hsl(46, 100%, 84%)",
            _dark: "hsl(43, 100%, 11%)"
          }
        },
        5: {
          value: {
            _light: "hsl(45, 100%, 75%)",
            _dark: "hsl(44, 100%, 14%)"
          }
        },
        6: {
          value: {
            _light: "hsl(43, 92%, 72%)",
            _dark: "hsl(46, 98%, 17%)"
          }
        },
        7: {
          value: {
            _light: "hsl(43, 72%, 65%)",
            _dark: "hsl(45, 65%, 25%)"
          }
        },
        8: {
          value: {
            _light: "hsl(44, 64%, 53%)",
            _dark: "hsl(45, 61%, 32%)"
          }
        },
        9: {
          value: {
            _light: "hsl(47, 100%, 54%)",
            _dark: "hsl(47, 100%, 54%)"
          }
        },
        10: {
          value: {
            _light: "hsl(45, 92%, 56%)",
            _dark: "hsl(48, 100%, 48%)"
          }
        },
        11: {
          value: {
            _light: "hsl(46, 100%, 29%)",
            _dark: "hsl(47, 100%, 56%)"
          }
        },
        12: {
          value: {
            _light: "hsl(43, 39%, 19%)",
            _dark: "hsl(44, 92%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(47, 100%, 54%)",
            _dark: "hsl(47, 100%, 54%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      ctyellowAlpha: {
        1: {
          value: {
            _light: "hsla(45, 100%, 40%, 0.02)",
            _dark: "hsla(0, 0%, 0%, 0)"
          }
        },
        2: {
          value: {
            _light: "hsla(47, 100%, 50%, 0.09)",
            _dark: "hsla(40, 100%, 72%, 0.08)"
          }
        },
        3: {
          value: {
            _light: "hsla(50, 100%, 50%, 0.26)",
            _dark: "hsla(45, 100%, 55%, 0.16)"
          }
        },
        4: {
          value: {
            _light: "hsla(49, 100%, 50%, 0.41)",
            _dark: "hsla(43, 100%, 50%, 0.22)"
          }
        },
        5: {
          value: {
            _light: "hsla(48, 100%, 50%, 0.56)",
            _dark: "hsla(44, 100%, 50%, 0.27)"
          }
        },
        6: {
          value: {
            _light: "hsla(44, 100%, 48%, 0.57)",
            _dark: "hsla(46, 100%, 51%, 0.33)"
          }
        },
        7: {
          value: {
            _light: "hsla(45, 100%, 42%, 0.61)",
            _dark: "hsla(45, 100%, 61%, 0.4)"
          }
        },
        8: {
          value: {
            _light: "hsla(45, 100%, 40%, 0.8)",
            _dark: "hsla(45, 100%, 62%, 0.51)"
          }
        },
        9: {
          value: {
            _light: "hsl(49, 100%, 50%)",
            _dark: "hsl(47, 100%, 54%)"
          }
        },
        10: {
          value: {
            _light: "hsl(48, 100%, 49%)",
            _dark: "hsla(48, 100%, 50%, 0.96)"
          }
        },
        11: {
          value: {
            _light: "hsl(45, 100%, 30%)",
            _dark: "hsl(47, 100%, 56%)"
          }
        },
        12: {
          value: {
            _light: "hsla(44, 100%, 9%, 0.88)",
            _dark: "hsla(44, 100%, 85%, 0.99)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(49, 100%, 50%)",
            _dark: "hsl(47, 100%, 54%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      ctviolet: {
        1: {
          value: {
            _light: "hsl(240, 100%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        },
        2: {
          value: {
            _light: "hsl(233, 100%, 98%)",
            _dark: "hsl(233, 41%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(229, 100%, 97%)",
            _dark: "hsl(236, 45%, 19%)"
          }
        },
        4: {
          value: {
            _light: "hsl(228, 100%, 94%)",
            _dark: "hsl(238, 49%, 27%)"
          }
        },
        5: {
          value: {
            _light: "hsl(229, 100%, 92%)",
            _dark: "hsl(237, 46%, 33%)"
          }
        },
        6: {
          value: {
            _light: "hsl(229, 100%, 88%)",
            _dark: "hsl(236, 42%, 37%)"
          }
        },
        7: {
          value: {
            _light: "hsl(231, 100%, 84%)",
            _dark: "hsl(236, 40%, 44%)"
          }
        },
        8: {
          value: {
            _light: "hsl(232, 88%, 77%)",
            _dark: "hsl(235, 43%, 52%)"
          }
        },
        9: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(240, 49%, 50%)",
            _dark: "hsl(242, 55%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(239, 58%, 56%)",
            _dark: "hsl(231, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsl(237, 47%, 27%)",
            _dark: "hsl(229, 100%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      ctvioletAlpha: {
        1: {
          value: {
            _light: "hsl(240, 100%, 100%)",
            _dark: "hsla(0, 0%, 0%, 0)"
          }
        },
        2: {
          value: {
            _light: "hsla(232, 100%, 50%, 0.03)",
            _dark: "hsla(233, 100%, 71%, 0.12)"
          }
        },
        3: {
          value: {
            _light: "hsla(229, 100%, 50%, 0.07)",
            _dark: "hsla(236, 100%, 69%, 0.28)"
          }
        },
        4: {
          value: {
            _light: "hsla(228, 100%, 50%, 0.11)",
            _dark: "hsla(238, 100%, 67%, 0.41)"
          }
        },
        5: {
          value: {
            _light: "hsla(228, 100%, 50%, 0.16)",
            _dark: "hsla(237, 100%, 69%, 0.47)"
          }
        },
        6: {
          value: {
            _light: "hsla(229, 100%, 50%, 0.23)",
            _dark: "hsla(236, 100%, 70%, 0.53)"
          }
        },
        7: {
          value: {
            _light: "hsla(231, 100%, 50%, 0.31)",
            _dark: "hsla(236, 100%, 71%, 0.62)"
          }
        },
        8: {
          value: {
            _light: "hsla(232, 100%, 47%, 0.43)",
            _dark: "hsla(235, 100%, 72%, 0.73)"
          }
        },
        9: {
          value: {
            _light: "hsla(240, 100%, 39%, 0.69)",
            _dark: "hsla(240, 100%, 68%, 0.85)"
          }
        },
        10: {
          value: {
            _light: "hsla(241, 100%, 33%, 0.74)",
            _dark: "hsla(242, 100%, 65%, 0.78)"
          }
        },
        11: {
          value: {
            _light: "hsla(238, 100%, 37%, 0.69)",
            _dark: "hsl(231, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsla(237, 100%, 15%, 0.85)",
            _dark: "hsl(229, 100%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(240, 100%, 39%, 0.69)",
            _dark: "hsla(240, 100%, 68%, 0.85)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      ctteal: {
        1: {
          value: {
            _light: "hsl(180, 71%, 99%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        },
        2: {
          value: {
            _light: "hsl(180, 56%, 96%)",
            _dark: "hsl(180, 45%, 6%)"
          }
        },
        3: {
          value: {
            _light: "hsl(178, 72%, 92%)",
            _dark: "hsl(180, 82%, 9%)"
          }
        },
        4: {
          value: {
            _light: "hsl(179, 69%, 86%)",
            _dark: "hsl(180, 100%, 11%)"
          }
        },
        5: {
          value: {
            _light: "hsl(179, 63%, 80%)",
            _dark: "hsl(180, 100%, 14%)"
          }
        },
        6: {
          value: {
            _light: "hsl(179, 57%, 73%)",
            _dark: "hsl(180, 100%, 17%)"
          }
        },
        7: {
          value: {
            _light: "hsl(180, 52%, 62%)",
            _dark: "hsl(180, 84%, 22%)"
          }
        },
        8: {
          value: {
            _light: "hsl(180, 98%, 37%)",
            _dark: "hsl(180, 95%, 26%)"
          }
        },
        9: {
          value: {
            _light: "hsl(180, 89%, 40%)",
            _dark: "hsl(180, 89%, 40%)"
          }
        },
        10: {
          value: {
            _light: "hsl(180, 100%, 35%)",
            _dark: "hsl(180, 100%, 35%)"
          }
        },
        11: {
          value: {
            _light: "hsl(180, 100%, 25%)",
            _dark: "hsl(180, 63%, 52%)"
          }
        },
        12: {
          value: {
            _light: "hsl(180, 100%, 12%)",
            _dark: "hsl(179, 68%, 80%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(180, 89%, 40%)",
            _dark: "hsl(180, 89%, 40%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      },
      cttealAlpha: {
        1: {
          value: {
            _light: "hsla(180, 100%, 42%, 0.02)",
            _dark: "hsla(0, 0%, 0%, 0)"
          }
        },
        2: {
          value: {
            _light: "hsla(180, 100%, 36%, 0.05)",
            _dark: "hsla(180, 100%, 69%, 0.08)"
          }
        },
        3: {
          value: {
            _light: "hsla(178, 100%, 42%, 0.15)",
            _dark: "hsla(180, 100%, 55%, 0.16)"
          }
        },
        4: {
          value: {
            _light: "hsla(179, 100%, 41%, 0.24)",
            _dark: "hsla(180, 100%, 50%, 0.22)"
          }
        },
        5: {
          value: {
            _light: "hsla(179, 100%, 39%, 0.33)",
            _dark: "hsla(180, 100%, 50%, 0.28)"
          }
        },
        6: {
          value: {
            _light: "hsla(179, 100%, 36%, 0.43)",
            _dark: "hsla(180, 100%, 50%, 0.34)"
          }
        },
        7: {
          value: {
            _light: "hsla(180, 100%, 35%, 0.58)",
            _dark: "hsla(180, 100%, 54%, 0.41)"
          }
        },
        8: {
          value: {
            _light: "hsla(180, 100%, 37%, 0.99)",
            _dark: "hsla(180, 100%, 51%, 0.51)"
          }
        },
        9: {
          value: {
            _light: "hsla(180, 100%, 37%, 0.96)",
            _dark: "hsla(180, 100%, 53%, 0.75)"
          }
        },
        10: {
          value: {
            _light: "hsl(180, 100%, 35%)",
            _dark: "hsla(180, 100%, 50%, 0.71)"
          }
        },
        11: {
          value: {
            _light: "hsl(180, 100%, 25%)",
            _dark: "hsla(180, 100%, 63%, 0.82)"
          }
        },
        12: {
          value: {
            _light: "hsl(180, 100%, 12%)",
            _dark: "hsla(179, 100%, 85%, 0.94)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsla(180, 100%, 37%, 0.96)",
            _dark: "hsla(180, 100%, 53%, 0.75)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 0%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        }
      }
    },
    "semantic-palettes": {
      neutral: {
        1: {
          value: {
            _light: "hsl(0, 0%, 99%)",
            _dark: "hsl(0, 0%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 0%, 98%)",
            _dark: "hsl(0, 0%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(0, 0%, 94%)",
            _dark: "hsl(0, 0%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(0, 0%, 91%)",
            _dark: "hsl(0, 0%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(0, 0%, 88%)",
            _dark: "hsl(0, 0%, 19%)"
          }
        },
        6: {
          value: {
            _light: "hsl(0, 0%, 85%)",
            _dark: "hsl(0, 0%, 23%)"
          }
        },
        7: {
          value: {
            _light: "hsl(0, 0%, 81%)",
            _dark: "hsl(0, 0%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(0, 0%, 73%)",
            _dark: "hsl(0, 0%, 38%)"
          }
        },
        9: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        10: {
          value: {
            _light: "hsl(0, 0%, 51%)",
            _dark: "hsl(0, 0%, 48%)"
          }
        },
        11: {
          value: {
            _light: "hsl(0, 0%, 39%)",
            _dark: "hsl(0, 0%, 71%)"
          }
        },
        12: {
          value: {
            _light: "hsl(0, 0%, 13%)",
            _dark: "hsl(0, 0%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      neutralAlpha: {
        1: {
          value: {
            _light: "hsl(0, 0%, 99%)",
            _dark: "hsl(0, 0%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 0%, 98%)",
            _dark: "hsl(0, 0%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(0, 0%, 94%)",
            _dark: "hsl(0, 0%, 13%)"
          }
        },
        4: {
          value: {
            _light: "hsl(0, 0%, 91%)",
            _dark: "hsl(0, 0%, 16%)"
          }
        },
        5: {
          value: {
            _light: "hsl(0, 0%, 88%)",
            _dark: "hsl(0, 0%, 19%)"
          }
        },
        6: {
          value: {
            _light: "hsl(0, 0%, 85%)",
            _dark: "hsl(0, 0%, 23%)"
          }
        },
        7: {
          value: {
            _light: "hsl(0, 0%, 81%)",
            _dark: "hsl(0, 0%, 28%)"
          }
        },
        8: {
          value: {
            _light: "hsl(0, 0%, 73%)",
            _dark: "hsl(0, 0%, 38%)"
          }
        },
        9: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        10: {
          value: {
            _light: "hsl(0, 0%, 51%)",
            _dark: "hsl(0, 0%, 48%)"
          }
        },
        11: {
          value: {
            _light: "hsl(0, 0%, 39%)",
            _dark: "hsl(0, 0%, 71%)"
          }
        },
        12: {
          value: {
            _light: "hsl(0, 0%, 13%)",
            _dark: "hsl(0, 0%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(0, 0%, 55%)",
            _dark: "hsl(0, 0%, 43%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      primary: {
        1: {
          value: {
            _light: "hsl(240, 100%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        },
        2: {
          value: {
            _light: "hsl(233, 100%, 98%)",
            _dark: "hsl(233, 41%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(229, 100%, 97%)",
            _dark: "hsl(236, 45%, 19%)"
          }
        },
        4: {
          value: {
            _light: "hsl(228, 100%, 94%)",
            _dark: "hsl(238, 49%, 27%)"
          }
        },
        5: {
          value: {
            _light: "hsl(229, 100%, 92%)",
            _dark: "hsl(237, 46%, 33%)"
          }
        },
        6: {
          value: {
            _light: "hsl(229, 100%, 88%)",
            _dark: "hsl(236, 42%, 37%)"
          }
        },
        7: {
          value: {
            _light: "hsl(231, 100%, 84%)",
            _dark: "hsl(236, 40%, 44%)"
          }
        },
        8: {
          value: {
            _light: "hsl(232, 88%, 77%)",
            _dark: "hsl(235, 43%, 52%)"
          }
        },
        9: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(240, 49%, 50%)",
            _dark: "hsl(242, 55%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(239, 58%, 56%)",
            _dark: "hsl(231, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsl(237, 47%, 27%)",
            _dark: "hsl(229, 100%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      primaryAlpha: {
        1: {
          value: {
            _light: "hsl(240, 100%, 100%)",
            _dark: "hsl(0, 0%, 0%)"
          }
        },
        2: {
          value: {
            _light: "hsl(233, 100%, 98%)",
            _dark: "hsl(233, 41%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(229, 100%, 97%)",
            _dark: "hsl(236, 45%, 19%)"
          }
        },
        4: {
          value: {
            _light: "hsl(228, 100%, 94%)",
            _dark: "hsl(238, 49%, 27%)"
          }
        },
        5: {
          value: {
            _light: "hsl(229, 100%, 92%)",
            _dark: "hsl(237, 46%, 33%)"
          }
        },
        6: {
          value: {
            _light: "hsl(229, 100%, 88%)",
            _dark: "hsl(236, 42%, 37%)"
          }
        },
        7: {
          value: {
            _light: "hsl(231, 100%, 84%)",
            _dark: "hsl(236, 40%, 44%)"
          }
        },
        8: {
          value: {
            _light: "hsl(232, 88%, 77%)",
            _dark: "hsl(235, 43%, 52%)"
          }
        },
        9: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        10: {
          value: {
            _light: "hsl(240, 49%, 50%)",
            _dark: "hsl(242, 55%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(239, 58%, 56%)",
            _dark: "hsl(231, 100%, 81%)"
          }
        },
        12: {
          value: {
            _light: "hsl(237, 47%, 27%)",
            _dark: "hsl(229, 100%, 93%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(240, 64%, 58%)",
            _dark: "hsl(240, 64%, 58%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      info: {
        1: {
          value: {
            _light: "hsl(210, 100%, 99%)",
            _dark: "hsl(215, 42%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(207, 100%, 98%)",
            _dark: "hsl(218, 39%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(205, 92%, 95%)",
            _dark: "hsl(212, 69%, 16%)"
          }
        },
        4: {
          value: {
            _light: "hsl(203, 100%, 92%)",
            _dark: "hsl(209, 100%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(206, 100%, 88%)",
            _dark: "hsl(207, 100%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(207, 93%, 83%)",
            _dark: "hsl(209, 79%, 30%)"
          }
        },
        7: {
          value: {
            _light: "hsl(207, 85%, 76%)",
            _dark: "hsl(211, 66%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(206, 82%, 65%)",
            _dark: "hsl(211, 65%, 45%)"
          }
        },
        9: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        10: {
          value: {
            _light: "hsl(207, 96%, 48%)",
            _dark: "hsl(210, 100%, 62%)"
          }
        },
        11: {
          value: {
            _light: "hsl(208, 88%, 43%)",
            _dark: "hsl(210, 100%, 72%)"
          }
        },
        12: {
          value: {
            _light: "hsl(216, 71%, 23%)",
            _dark: "hsl(205, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      infoAlpha: {
        1: {
          value: {
            _light: "hsl(210, 100%, 99%)",
            _dark: "hsl(215, 42%, 9%)"
          }
        },
        2: {
          value: {
            _light: "hsl(207, 100%, 98%)",
            _dark: "hsl(218, 39%, 11%)"
          }
        },
        3: {
          value: {
            _light: "hsl(205, 92%, 95%)",
            _dark: "hsl(212, 69%, 16%)"
          }
        },
        4: {
          value: {
            _light: "hsl(203, 100%, 92%)",
            _dark: "hsl(209, 100%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(206, 100%, 88%)",
            _dark: "hsl(207, 100%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(207, 93%, 83%)",
            _dark: "hsl(209, 79%, 30%)"
          }
        },
        7: {
          value: {
            _light: "hsl(207, 85%, 76%)",
            _dark: "hsl(211, 66%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(206, 82%, 65%)",
            _dark: "hsl(211, 65%, 45%)"
          }
        },
        9: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        10: {
          value: {
            _light: "hsl(207, 96%, 48%)",
            _dark: "hsl(210, 100%, 62%)"
          }
        },
        11: {
          value: {
            _light: "hsl(208, 88%, 43%)",
            _dark: "hsl(210, 100%, 72%)"
          }
        },
        12: {
          value: {
            _light: "hsl(216, 71%, 23%)",
            _dark: "hsl(205, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(206, 100%, 50%)",
            _dark: "hsl(206, 100%, 50%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      error: {
        1: {
          value: {
            _light: "hsl(0, 100%, 99%)",
            _dark: "hsl(0, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 100%, 98%)",
            _dark: "hsl(355, 25%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(357, 90%, 96%)",
            _dark: "hsl(350, 53%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(358, 100%, 93%)",
            _dark: "hsl(348, 68%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(359, 100%, 90%)",
            _dark: "hsl(350, 63%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(359, 94%, 87%)",
            _dark: "hsl(352, 53%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(359, 77%, 81%)",
            _dark: "hsl(355, 47%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(359, 70%, 74%)",
            _dark: "hsl(358, 45%, 49%)"
          }
        },
        9: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        10: {
          value: {
            _light: "hsl(358, 69%, 55%)",
            _dark: "hsl(360, 79%, 65%)"
          }
        },
        11: {
          value: {
            _light: "hsl(358, 65%, 49%)",
            _dark: "hsl(2, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsl(351, 63%, 24%)",
            _dark: "hsl(350, 100%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      errorAlpha: {
        1: {
          value: {
            _light: "hsl(0, 100%, 99%)",
            _dark: "hsl(0, 19%, 8%)"
          }
        },
        2: {
          value: {
            _light: "hsl(0, 100%, 98%)",
            _dark: "hsl(355, 25%, 10%)"
          }
        },
        3: {
          value: {
            _light: "hsl(357, 90%, 96%)",
            _dark: "hsl(350, 53%, 15%)"
          }
        },
        4: {
          value: {
            _light: "hsl(358, 100%, 93%)",
            _dark: "hsl(348, 68%, 19%)"
          }
        },
        5: {
          value: {
            _light: "hsl(359, 100%, 90%)",
            _dark: "hsl(350, 63%, 23%)"
          }
        },
        6: {
          value: {
            _light: "hsl(359, 94%, 87%)",
            _dark: "hsl(352, 53%, 29%)"
          }
        },
        7: {
          value: {
            _light: "hsl(359, 77%, 81%)",
            _dark: "hsl(355, 47%, 37%)"
          }
        },
        8: {
          value: {
            _light: "hsl(359, 70%, 74%)",
            _dark: "hsl(358, 45%, 49%)"
          }
        },
        9: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        10: {
          value: {
            _light: "hsl(358, 69%, 55%)",
            _dark: "hsl(360, 79%, 65%)"
          }
        },
        11: {
          value: {
            _light: "hsl(358, 65%, 49%)",
            _dark: "hsl(2, 100%, 79%)"
          }
        },
        12: {
          value: {
            _light: "hsl(351, 63%, 24%)",
            _dark: "hsl(350, 100%, 91%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(358, 75%, 59%)",
            _dark: "hsl(358, 75%, 59%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      danger: {
        1: {
          value: {
            _light: "hsl(20, 60%, 99%)",
            _dark: "hsl(27, 24%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(33, 100%, 96%)",
            _dark: "hsl(28, 33%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(37, 100%, 92%)",
            _dark: "hsl(29, 65%, 12%)"
          }
        },
        4: {
          value: {
            _light: "hsl(34, 100%, 85%)",
            _dark: "hsl(28, 100%, 14%)"
          }
        },
        5: {
          value: {
            _light: "hsl(33, 100%, 80%)",
            _dark: "hsl(28, 100%, 17%)"
          }
        },
        6: {
          value: {
            _light: "hsl(30, 100%, 75%)",
            _dark: "hsl(27, 79%, 22%)"
          }
        },
        7: {
          value: {
            _light: "hsl(27, 87%, 71%)",
            _dark: "hsl(25, 63%, 30%)"
          }
        },
        8: {
          value: {
            _light: "hsl(25, 80%, 63%)",
            _dark: "hsl(23, 60%, 40%)"
          }
        },
        9: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        10: {
          value: {
            _light: "hsl(24, 100%, 47%)",
            _dark: "hsl(26, 100%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(23, 100%, 40%)",
            _dark: "hsl(26, 100%, 67%)"
          }
        },
        12: {
          value: {
            _light: "hsl(16, 50%, 23%)",
            _dark: "hsl(30, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      dangerAlpha: {
        1: {
          value: {
            _light: "hsl(20, 60%, 99%)",
            _dark: "hsl(27, 24%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(33, 100%, 96%)",
            _dark: "hsl(28, 33%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(37, 100%, 92%)",
            _dark: "hsl(29, 65%, 12%)"
          }
        },
        4: {
          value: {
            _light: "hsl(34, 100%, 85%)",
            _dark: "hsl(28, 100%, 14%)"
          }
        },
        5: {
          value: {
            _light: "hsl(33, 100%, 80%)",
            _dark: "hsl(28, 100%, 17%)"
          }
        },
        6: {
          value: {
            _light: "hsl(30, 100%, 75%)",
            _dark: "hsl(27, 79%, 22%)"
          }
        },
        7: {
          value: {
            _light: "hsl(27, 87%, 71%)",
            _dark: "hsl(25, 63%, 30%)"
          }
        },
        8: {
          value: {
            _light: "hsl(25, 80%, 63%)",
            _dark: "hsl(23, 60%, 40%)"
          }
        },
        9: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        10: {
          value: {
            _light: "hsl(24, 100%, 47%)",
            _dark: "hsl(26, 100%, 56%)"
          }
        },
        11: {
          value: {
            _light: "hsl(23, 100%, 40%)",
            _dark: "hsl(26, 100%, 67%)"
          }
        },
        12: {
          value: {
            _light: "hsl(16, 50%, 23%)",
            _dark: "hsl(30, 100%, 88%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(23, 93%, 53%)",
            _dark: "hsl(23, 93%, 53%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      success: {
        1: {
          value: {
            _light: "hsl(120, 60%, 99%)",
            _dark: "hsl(146, 20%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(120, 43%, 97%)",
            _dark: "hsl(130, 13%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(120, 42%, 94%)",
            _dark: "hsl(132, 22%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(123, 45%, 90%)",
            _dark: "hsl(134, 33%, 17%)"
          }
        },
        5: {
          value: {
            _light: "hsl(122, 40%, 85%)",
            _dark: "hsl(134, 32%, 21%)"
          }
        },
        6: {
          value: {
            _light: "hsl(124, 39%, 78%)",
            _dark: "hsl(133, 32%, 26%)"
          }
        },
        7: {
          value: {
            _light: "hsl(126, 37%, 69%)",
            _dark: "hsl(132, 31%, 31%)"
          }
        },
        8: {
          value: {
            _light: "hsl(131, 38%, 56%)",
            _dark: "hsl(131, 32%, 36%)"
          }
        },
        9: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        10: {
          value: {
            _light: "hsl(131, 43%, 43%)",
            _dark: "hsl(131, 39%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(132, 50%, 33%)",
            _dark: "hsl(131, 50%, 63%)"
          }
        },
        12: {
          value: {
            _light: "hsl(131, 30%, 18%)",
            _dark: "hsl(120, 61%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      },
      successAlpha: {
        1: {
          value: {
            _light: "hsl(120, 60%, 99%)",
            _dark: "hsl(146, 20%, 7%)"
          }
        },
        2: {
          value: {
            _light: "hsl(120, 43%, 97%)",
            _dark: "hsl(130, 13%, 9%)"
          }
        },
        3: {
          value: {
            _light: "hsl(120, 42%, 94%)",
            _dark: "hsl(132, 22%, 14%)"
          }
        },
        4: {
          value: {
            _light: "hsl(123, 45%, 90%)",
            _dark: "hsl(134, 33%, 17%)"
          }
        },
        5: {
          value: {
            _light: "hsl(122, 40%, 85%)",
            _dark: "hsl(134, 32%, 21%)"
          }
        },
        6: {
          value: {
            _light: "hsl(124, 39%, 78%)",
            _dark: "hsl(133, 32%, 26%)"
          }
        },
        7: {
          value: {
            _light: "hsl(126, 37%, 69%)",
            _dark: "hsl(132, 31%, 31%)"
          }
        },
        8: {
          value: {
            _light: "hsl(131, 38%, 56%)",
            _dark: "hsl(131, 32%, 36%)"
          }
        },
        9: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        10: {
          value: {
            _light: "hsl(131, 43%, 43%)",
            _dark: "hsl(131, 39%, 51%)"
          }
        },
        11: {
          value: {
            _light: "hsl(132, 50%, 33%)",
            _dark: "hsl(131, 50%, 63%)"
          }
        },
        12: {
          value: {
            _light: "hsl(131, 30%, 18%)",
            _dark: "hsl(120, 61%, 85%)"
          }
        },
        DEFAULT: {
          value: {
            _light: "hsl(131, 41%, 46%)",
            _dark: "hsl(131, 41%, 46%)"
          }
        },
        contrast: {
          value: {
            _light: "hsl(0, 0%, 100%)",
            _dark: "hsl(0, 0%, 100%)"
          }
        }
      }
    }
  },
  fontFamily: {
    heading: {
      value: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
    },
    body: {
      value: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
    },
    mono: {
      value: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    }
  },
  fontSize: {
    250: {
      value: "10px"
    },
    300: {
      value: "12px"
    },
    350: {
      value: "14px"
    },
    400: {
      value: "16px"
    },
    450: {
      value: "18px"
    },
    500: {
      value: "20px"
    },
    600: {
      value: "24px"
    },
    750: {
      value: "30px"
    },
    900: {
      value: "36px"
    },
    1200: {
      value: "48px"
    },
    1500: {
      value: "60px"
    },
    1800: {
      value: "72px"
    },
    2400: {
      value: "96px"
    },
    3200: {
      value: "128px"
    }
  },
  fontWeight: {
    100: {
      value: 100
    },
    200: {
      value: 200
    },
    300: {
      value: 300
    },
    400: {
      value: 400
    },
    500: {
      value: 500
    },
    600: {
      value: 600
    },
    700: {
      value: 700
    },
    800: {
      value: 800
    },
    900: {
      value: 900
    }
  },
  duration: {
    fastest: {
      value: "50ms"
    },
    faster: {
      value: "100ms"
    },
    fast: {
      value: "150ms"
    },
    moderate: {
      value: "200ms"
    },
    slow: {
      value: "300ms"
    },
    slower: {
      value: "400ms"
    },
    slowest: {
      value: "500ms"
    },
    "1s": {
      value: "1s"
    },
    "2s": {
      value: "2s"
    }
  },
  easing: {
    linear: {
      value: "cubic-bezier(0, 0, 1, 1)"
    },
    "ease-in": {
      value: "cubic-bezier(0.42, 0, 1, 1)"
    },
    "ease-out": {
      value: "cubic-bezier(0, 0, 0.58, 1)"
    },
    "ease-in-out": {
      value: "cubic-bezier(0.42, 0, 0.58, 1)"
    },
    "ease-in-smooth": {
      value: "cubic-bezier(0.32, 0.72, 0, 1)"
    }
  },
  lineHeight: {
    250: {
      value: "10px"
    },
    300: {
      value: "12px"
    },
    350: {
      value: "14px"
    },
    400: {
      value: "16px"
    },
    450: {
      value: "18px"
    },
    500: {
      value: "20px"
    },
    550: {
      value: "22px"
    },
    600: {
      value: "24px"
    },
    650: {
      value: "26px"
    },
    700: {
      value: "28px"
    },
    750: {
      value: "30px"
    },
    800: {
      value: "32px"
    },
    900: {
      value: "36px"
    },
    1100: {
      value: "44px"
    },
    1200: {
      value: "48px"
    },
    1400: {
      value: "56px"
    },
    1500: {
      value: "60px"
    },
    1800: {
      value: "72px"
    },
    2e3: {
      value: "80px"
    },
    2100: {
      value: "84px"
    },
    2300: {
      value: "92px"
    },
    2400: {
      value: "96px"
    },
    2800: {
      value: "112px"
    },
    3200: {
      value: "128px"
    },
    3500: {
      value: "140px"
    },
    3800: {
      value: "152px"
    }
  },
  textStyle: {
    "2xs": {
      value: {
        fontSize: "10px",
        lineHeight: "14px"
      }
    },
    xs: {
      value: {
        fontSize: "12px",
        lineHeight: "18px"
      }
    },
    sm: {
      value: {
        fontSize: "14px",
        lineHeight: "22px"
      }
    },
    md: {
      value: {
        fontSize: "16px",
        lineHeight: "22px"
      }
    },
    lg: {
      value: {
        fontSize: "18px",
        lineHeight: "24px"
      }
    },
    xl: {
      value: {
        fontSize: "20px",
        lineHeight: "28px"
      }
    },
    "2xl": {
      value: {
        fontSize: "24px",
        lineHeight: "28px"
      }
    },
    "3xl": {
      value: {
        fontSize: "30px",
        lineHeight: "36px"
      }
    },
    "4xl": {
      value: {
        fontSize: "36px",
        lineHeight: "44px"
      }
    },
    "5xl": {
      value: {
        fontSize: "48px",
        lineHeight: "60px"
      }
    },
    "6xl": {
      value: {
        fontSize: "60px",
        lineHeight: "72px"
      }
    },
    "7xl": {
      value: {
        fontSize: "72px",
        lineHeight: "92px"
      }
    },
    caption: {
      value: {
        fontSize: "12px",
        lineHeight: "18px"
      }
    },
    detail: {
      value: {
        fontSize: "14px",
        lineHeight: "22px"
      }
    },
    body: {
      value: {
        fontSize: "16px",
        lineHeight: "26px"
      }
    }
  },
  letterSpacing: {
    tighter: {
      value: "-5%"
    },
    tight: {
      value: "-2.5%"
    },
    wide: {
      value: "2.5%"
    },
    wider: {
      value: "5%"
    },
    widest: {
      value: "10%"
    }
  },
  size: {
    25: {
      value: "1px"
    },
    50: {
      value: "2px"
    },
    100: {
      value: "4px"
    },
    150: {
      value: "6px"
    },
    200: {
      value: "8px"
    },
    250: {
      value: "10px"
    },
    300: {
      value: "12px"
    },
    350: {
      value: "14px"
    },
    400: {
      value: "16px"
    },
    450: {
      value: "18px"
    },
    500: {
      value: "20px"
    },
    600: {
      value: "24px"
    },
    700: {
      value: "28px"
    },
    800: {
      value: "32px"
    },
    900: {
      value: "36px"
    },
    1e3: {
      value: "40px"
    },
    1100: {
      value: "44px"
    },
    1200: {
      value: "48px"
    },
    1400: {
      value: "56px"
    },
    1600: {
      value: "64px"
    },
    2e3: {
      value: "80px"
    },
    2400: {
      value: "96px"
    },
    2800: {
      value: "112px"
    },
    3200: {
      value: "128px"
    },
    3600: {
      value: "144px"
    },
    4e3: {
      value: "160px"
    },
    4400: {
      value: "176px"
    },
    4800: {
      value: "192px"
    },
    5200: {
      value: "208px"
    },
    5600: {
      value: "224px"
    },
    6e3: {
      value: "240px"
    },
    6400: {
      value: "256px"
    },
    7200: {
      value: "288px"
    },
    8e3: {
      value: "320px"
    },
    9600: {
      value: "384px"
    },
    "3xs": {
      value: "224px"
    },
    "2xs": {
      value: "256px"
    },
    xs: {
      value: "320px"
    },
    sm: {
      value: "384px"
    },
    md: {
      value: "448px"
    },
    lg: {
      value: "512px"
    },
    xl: {
      value: "576px"
    },
    "2xl": {
      value: "672px"
    },
    "3xl": {
      value: "768px"
    },
    "4xl": {
      value: "896px"
    },
    "5xl": {
      value: "1024px"
    },
    "6xl": {
      value: "1152px"
    },
    "7xl": {
      value: "1280px"
    },
    "8xl": {
      value: "1440px"
    },
    "breakpoint-sm": {
      value: "480px"
    },
    "breakpoint-md": {
      value: "768px"
    },
    "breakpoint-lg": {
      value: "1024px"
    },
    "breakpoint-xl": {
      value: "1280px"
    },
    "breakpoint-2xl": {
      value: "1536px"
    }
  },
  spacing: {
    25: {
      value: "1px"
    },
    50: {
      value: "2px"
    },
    100: {
      value: "4px"
    },
    150: {
      value: "6px"
    },
    200: {
      value: "8px"
    },
    250: {
      value: "10px"
    },
    300: {
      value: "12px"
    },
    350: {
      value: "14px"
    },
    400: {
      value: "16px"
    },
    450: {
      value: "18px"
    },
    500: {
      value: "20px"
    },
    600: {
      value: "24px"
    },
    700: {
      value: "28px"
    },
    800: {
      value: "32px"
    },
    900: {
      value: "36px"
    },
    1e3: {
      value: "40px"
    },
    1100: {
      value: "44px"
    },
    1200: {
      value: "48px"
    },
    1400: {
      value: "56px"
    },
    1600: {
      value: "64px"
    },
    2e3: {
      value: "80px"
    },
    2400: {
      value: "96px"
    },
    2800: {
      value: "112px"
    },
    3200: {
      value: "128px"
    }
  },
  zIndex: {
    hide: {
      value: -1
    },
    base: {
      value: 0
    },
    docked: {
      value: 10
    },
    dropdown: {
      value: 1e3
    },
    sticky: {
      value: 1100
    },
    banner: {
      value: 1200
    },
    overlay: {
      value: 1300
    },
    modal: {
      value: 1400
    },
    popver: {
      value: 1500
    },
    skipNav: {
      value: 1600
    },
    toast: {
      value: 1700
    },
    tooltip: {
      value: 1800
    },
    max: {
      value: 2147483647
    }
  },
  shadow: {
    1: {
      value: "0 1px 4px hsla(0, 0%, 0%, 0.05)"
    },
    2: {
      value: "0 2px 8px hsla(0, 0%, 0%, 0.05)"
    },
    3: {
      value: "0 4px 12px hsla(0, 0%, 0%, 0.1)"
    },
    4: {
      value: "0 6px 16px hsla(0, 0%, 0%, 0.1)"
    },
    5: {
      value: "0 8px 20px hsla(0, 0%, 0%, 0.1)"
    },
    6: {
      value: "0 10px 24px hsla(0, 0%, 0%, 0.15)"
    }
  },
  cursor: {
    button: {
      value: "pointer"
    },
    checkbox: {
      value: "default"
    },
    disabled: {
      value: "not-allowed"
    },
    menuitem: {
      value: "default"
    },
    option: {
      value: "default"
    },
    radio: {
      value: "default"
    },
    slider: {
      value: "default"
    },
    switch: {
      value: "pointer"
    }
  },
  animation: {
    spin: {
      value: "spin 1s cubic-bezier(0, 0, 1, 1) infinite"
    },
    ping: {
      value: "ping 1s cubic-bezier(0, 0, 0.58, 1) infinite"
    },
    pulse: {
      value: "pulse 2s cubic-bezier(0.42, 0, 0.58, 1) infinite"
    },
    bounce: {
      value: "bounce 2s infinite"
    }
  },
  breakpoints: {
    sm: {
      value: "480px"
    },
    md: {
      value: "768px"
    },
    lg: {
      value: "1024px"
    },
    xl: {
      value: "1280px"
    },
    "2xl": {
      value: "1536px"
    }
  }
};
function a9(e) {
  var r;
  const t = {};
  for (const a in e)
    (r = e[a]) != null && r.value ? t[a] = e[a].value : t[a] = e[a];
  return t;
}
const i9 = a9(Pe.breakpoints), o9 = Hh({
  "*": {
    fontFeatureSettings: '"liga", "calt", "case", "ss01", "ss07", "ss08", "tnum"',
    "--ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
    "--ring-offset-width": "0px",
    "--ring-offset-color": "#fff",
    "--ring-color": "rgba(66, 153, 225, 0.6)",
    "--ring-offset-shadow": "0 0 #0000",
    "--ring-shadow": "0 0 #0000",
    "--focus-ring-color": "colors.primary.7",
    "--brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--sepia": "var(--chakra-empty,/*!*/ /*!*/)",
    "--drop-shadow": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-blur": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-opacity": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
    "--global-font-mono": "fonts.mono",
    "--global-font-body": "fonts.body",
    "--global-color-border": "colors.border"
  },
  /** 'liga' may replace 2 characters with a single one,
   * which causes differences in formatting when a monospace font is used.*/
  "code *": {
    fontFeatureSettings: '"calt", "case", "ss01", "ss07", "ss08", "tnum"'
  },
  html: {
    color: "fg",
    bg: "bg",
    lineHeight: "1.5",
    colorPalette: "neutral"
  },
  "*::placeholder": {
    color: "fg.muted/80"
  },
  "*::selection": {
    bg: "colorPalette.9",
    color: "colorPalette.contrast"
  }
}), n9 = {
  spin: {
    "0%": {
      transform: "rotate(0deg)"
    },
    "100%": {
      transform: "rotate(360deg)"
    }
  },
  pulse: {
    "50%": {
      opacity: "0.5"
    }
  },
  ping: {
    "75%, 100%": {
      transform: "scale(2)",
      opacity: "0"
    }
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
    },
    "50%": {
      transform: "none",
      animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
    }
  },
  "fade-in": {
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    }
  },
  "fade-out": {
    from: {
      opacity: 1
    },
    to: {
      opacity: 0
    }
  },
  "slide-from-left-full": {
    from: {
      translate: "-100% 0"
    },
    to: {
      translate: "0 0"
    }
  },
  "slide-from-right-full": {
    from: {
      translate: "100% 0"
    },
    to: {
      translate: "0 0"
    }
  },
  "slide-from-top-full": {
    from: {
      translate: "0 -100%"
    },
    to: {
      translate: "0 0"
    }
  },
  "slide-from-bottom-full": {
    from: {
      translate: "0 100%"
    },
    to: {
      translate: "0 0"
    }
  },
  "slide-to-left-full": {
    from: {
      translate: "0 0"
    },
    to: {
      translate: "-100% 0"
    }
  },
  "slide-to-right-full": {
    from: {
      translate: "0 0"
    },
    to: {
      translate: "100% 0"
    }
  },
  "slide-to-top-full": {
    from: {
      translate: "0 0"
    },
    to: {
      translate: "0 -100%"
    }
  },
  "slide-to-bottom-full": {
    from: {
      translate: "0 0"
    },
    to: {
      translate: "0 100%"
    }
  },
  "slide-from-top": {
    "0%": {
      translate: "0 -0.5rem"
    },
    to: {
      translate: "0"
    }
  },
  "slide-from-bottom": {
    "0%": {
      translate: "0 0.5rem"
    },
    to: {
      translate: "0"
    }
  },
  "slide-from-left": {
    "0%": {
      translate: "-0.5rem 0"
    },
    to: {
      translate: "0"
    }
  },
  "slide-from-right": {
    "0%": {
      translate: "0.5rem 0"
    },
    to: {
      translate: "0"
    }
  },
  "slide-to-top": {
    "0%": {
      translate: "0"
    },
    to: {
      translate: "0 -0.5rem"
    }
  },
  "slide-to-bottom": {
    "0%": {
      translate: "0"
    },
    to: {
      translate: "0 0.5rem"
    }
  },
  "slide-to-left": {
    "0%": {
      translate: "0"
    },
    to: {
      translate: "-0.5rem 0"
    }
  },
  "slide-to-right": {
    "0%": {
      translate: "0"
    },
    to: {
      translate: "0.5rem 0"
    }
  },
  "scale-in": {
    from: {
      scale: "0.95"
    },
    to: {
      scale: "1"
    }
  },
  "scale-out": {
    from: {
      scale: "1"
    },
    to: {
      scale: "0.95"
    }
  }
}, l9 = qh({
  disabled: {
    value: {
      opacity: "0.5",
      cursor: "not-allowed"
    }
  }
}), s9 = be({
  className: "bleh-ui-code",
  base: {
    fontFamily: "mono",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "100"
  },
  variants: {
    variant: {
      solid: {
        bg: "colorPalette.4",
        color: "colorPalette.11"
      },
      subtle: {
        bg: "colorPalette.3",
        color: "colorPalette.11"
      },
      outline: {
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted"
      },
      surface: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        shadow: "inset 0 0 0px 1px var(--shadow-color)",
        shadowColor: "colorPalette.muted"
      },
      plain: {
        color: "colorPalette.fg"
      }
    },
    size: {
      xs: {
        textStyle: "2xs",
        px: "100",
        minH: "400"
      },
      sm: {
        textStyle: "xs",
        px: "150",
        minH: "500"
      },
      md: {
        textStyle: "sm",
        px: "200",
        minH: "600"
      },
      lg: {
        textStyle: "sm",
        px: "250",
        minH: "700"
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
}), d9 = be({
  className: "bleh-ui-heading",
  base: {
    fontFamily: "heading",
    fontWeight: "600"
  },
  variants: {
    size: {
      xs: {
        textStyle: "xs"
      },
      sm: {
        textStyle: "sm"
      },
      md: {
        textStyle: "md"
      },
      lg: {
        textStyle: "lg"
      },
      xl: {
        textStyle: "xl"
      },
      "2xl": {
        textStyle: "2xl"
      },
      "3xl": {
        textStyle: "3xl"
      },
      "4xl": {
        textStyle: "4xl"
      },
      "5xl": {
        textStyle: "5xl"
      },
      "6xl": {
        textStyle: "6xl"
      },
      "7xl": {
        textStyle: "7xl"
      }
    }
  },
  defaultVariants: {
    size: "xl"
  }
}), c9 = be({
  className: "bleh-ui-input",
  base: {
    width: "full",
    minWidth: "0",
    outline: "0",
    position: "relative",
    appearance: "none",
    textAlign: "start",
    _disabled: {
      layerStyle: "disabled"
    },
    height: "var(--input-height)",
    minW: "var(--input-height)",
    "--focus-color": "colors.colorPalette.focusRing",
    "--error-color": "colors.border.error",
    "&::placeholder": {
      color: "colorPalette.11",
      opacity: 3 / 4
    },
    _invalid: {
      focusRingColor: "var(--error-color)",
      borderColor: "var(--error-color)"
    }
  },
  variants: {
    size: {
      "2xs": {
        textStyle: "xs",
        px: "200",
        "--input-height": "sizes.700"
      },
      xs: {
        textStyle: "xs",
        px: "200",
        "--input-height": "sizes.800"
      },
      sm: {
        textStyle: "sm",
        px: "250",
        "--input-height": "sizes.900"
      },
      md: {
        textStyle: "sm",
        px: "300",
        "--input-height": "sizes.1000"
      },
      lg: {
        textStyle: "md",
        px: "400",
        "--input-height": "sizes.1100"
      },
      xl: {
        textStyle: "md",
        px: "450",
        "--input-height": "sizes.1200"
      },
      "2xl": {
        textStyle: "lg",
        px: "500",
        "--input-height": "sizes.1600"
      }
    },
    variant: {
      outline: {
        bg: "transparent",
        borderWidth: "1px",
        borderColor: "border",
        focusVisibleRing: "inside"
      },
      subtle: {
        borderWidth: "1px",
        borderColor: "transparent",
        bg: "bg.muted",
        focusVisibleRing: "inside"
      },
      flushed: {
        bg: "transparent",
        borderBottomWidth: "1px",
        borderBottomColor: "border",
        px: "0",
        _focusVisible: {
          borderColor: "var(--focus-color)",
          boxShadow: "0px 1px 0px 0px var(--focus-color)"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), u9 = be({
  className: "bleh-ui-kbd",
  base: {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "medium",
    fontFamily: "mono",
    flexShrink: "0",
    whiteSpace: "nowrap",
    wordSpacing: "-0.5em",
    userSelect: "none",
    px: "100",
    borderRadius: "100"
  },
  variants: {
    variant: {
      raised: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        borderWidth: "1px",
        borderBottomWidth: "2px",
        borderColor: "colorPalette.muted"
      },
      outline: {
        borderWidth: "1px",
        color: "colorPalette.fg"
      },
      subtle: {
        bg: "colorPalette.muted",
        color: "colorPalette.fg"
      },
      plain: {
        color: "colorPalette.fg"
      }
    },
    size: {
      sm: {
        textStyle: "xs",
        height: "450"
      },
      md: {
        textStyle: "sm",
        height: "500"
      },
      lg: {
        textStyle: "md",
        height: "600"
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "raised"
  }
}), zl = be({
  // Unique class name prefix for the component
  className: "bleh-ui-text-input",
  // Base styles applied to all instances of the component
  base: {
    display: "block",
    borderRadius: "200",
    colorPalette: "neutral",
    focusVisibleRing: "outside",
    bg: "transparent",
    outline: "none",
    boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
    _placeholder: {
      opacity: 0.5,
      color: "currentColor"
    },
    _disabled: {
      layerStyle: "disabled"
    },
    "&[data-invalid='true']": {
      "--border-color": "colors.error.7",
      color: "error.11"
    }
  },
  variants: {
    size: {
      sm: {
        h: 800,
        textStyle: "sm",
        px: 300
      },
      md: {
        h: 1e3,
        textStyle: "md",
        px: 400
      }
    },
    variant: {
      solid: {
        "--border-width": "sizes.25",
        "--border-color": "colors.neutral.7",
        backgroundColor: "neutral.1",
        _hover: {
          backgroundColor: "primary.2"
        }
      },
      ghost: {
        _hover: {
          backgroundColor: "primary.2"
        }
      }
    }
  },
  defaultVariants: {
    size: "md",
    variant: "solid"
  }
}), h9 = {
  avatar: B0,
  button: Xg,
  code: s9,
  heading: d9,
  input: c9,
  kbd: u9,
  link: Jg,
  tooltip: lv,
  textInput: zl
}, f9 = oa.colors({
  bg: {
    DEFAULT: {
      value: {
        _light: "{colors.neutral.1}",
        _dark: "{colors.neutral.1}"
      }
    }
  },
  fg: {
    DEFAULT: {
      value: {
        _light: "{colors.neutral.12}",
        _dark: "{colors.neutral.12}"
      }
    }
  },
  border: {
    DEFAULT: {
      value: "{colors.neutral.6}"
    },
    muted: {
      value: "{colors.neutral.7}"
    },
    subtle: {
      value: "{colors.neutral.6}"
    },
    emphasized: {
      value: "{colors.neutral.8}"
    },
    inverted: {
      value: "{colors.neutral.9}"
    },
    error: {
      value: "{colors.error.8}"
    },
    warning: {
      value: "{colors.danger.8}"
    },
    success: {
      value: "{colors.success.8}"
    },
    info: {
      value: "{colors.ingo.8}"
    }
  },
  ...Pe.color["system-palettes"],
  ...Pe.color["brand-palettes"],
  ...Pe.color["semantic-palettes"]
}), g9 = oa.shadows(Pe.shadow), p9 = oa.radii({}), v9 = {
  colors: f9,
  shadows: g9,
  radii: p9
}, m9 = q({
  slots: [
    "trigger",
    "backdrop",
    "positioner",
    "content",
    "title",
    "description",
    "closeTrigger",
    "header",
    "body",
    "footer",
    "backdrop"
  ],
  className: "bleh-ui-dialog",
  base: {
    backdrop: {
      bg: {
        _dark: "bg/50",
        _light: "fg/50"
      },
      pos: "fixed",
      left: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      zIndex: "modal",
      _open: {
        animationName: "fade-in",
        animationDuration: "slow"
      },
      _closed: {
        animationName: "fade-out",
        animationDuration: "moderate"
      }
    },
    positioner: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      left: 0,
      top: 0,
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      justifyContent: "center",
      overscrollBehaviorY: "none"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      outline: 0,
      borderRadius: "200",
      textStyle: "sm",
      my: "var(--dialog-margin, var(--dialog-base-margin))",
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      bg: "bg",
      boxShadow: "lg",
      _open: {
        animationDuration: "moderate"
      },
      _closed: {
        animationDuration: "faster"
      }
    },
    header: {
      flex: 0,
      px: "600",
      pt: "600",
      pb: "400"
    },
    body: {
      flex: "1",
      px: "600",
      pt: "200",
      pb: "600"
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "300",
      px: "600",
      pt: "200",
      pb: "400"
    },
    title: {
      textStyle: "lg",
      fontWeight: "semibold"
    },
    description: {
      color: "fg.muted"
    }
  },
  variants: {
    placement: {
      center: {
        positioner: {
          alignItems: "center"
        },
        content: {
          "--dialog-base-margin": "auto",
          mx: "auto"
        }
      },
      top: {
        positioner: {
          alignItems: "flex-start"
        },
        content: {
          "--dialog-base-margin": "spacing.1600",
          mx: "auto"
        }
      },
      bottom: {
        positioner: {
          alignItems: "flex-end"
        },
        content: {
          "--dialog-base-margin": "spacing.1600",
          mx: "auto"
        }
      }
    },
    scrollBehavior: {
      inside: {
        positioner: {
          overflow: "hidden"
        },
        content: {
          maxH: "calc(100% - 7.5rem)"
        },
        body: {
          overflow: "auto"
        }
      },
      outside: {
        positioner: {
          overflow: "auto",
          pointerEvents: "auto"
        }
      }
    },
    size: {
      xs: {
        content: {
          maxW: "sm"
        }
      },
      sm: {
        content: {
          maxW: "md"
        }
      },
      md: {
        content: {
          maxW: "lg"
        }
      },
      lg: {
        content: {
          maxW: "2xl"
        }
      },
      xl: {
        content: {
          maxW: "4xl"
        }
      },
      cover: {
        positioner: {
          padding: "1000"
        },
        content: {
          width: "100%",
          height: "100%",
          "--dialog-margin": "0"
        }
      },
      full: {
        content: {
          maxW: "100vw",
          minH: "100vh",
          "--dialog-margin": "0",
          borderRadius: "0"
        }
      }
    },
    motionPreset: {
      scale: {
        content: {
          _open: {
            animationName: "scale-in, fade-in"
          },
          _closed: {
            animationName: "scale-out, fade-out"
          }
        }
      },
      "slide-in-bottom": {
        content: {
          _open: {
            animationName: "slide-from-bottom, fade-in"
          },
          _closed: {
            animationName: "slide-to-bottom, fade-out"
          }
        }
      },
      "slide-in-top": {
        content: {
          _open: {
            animationName: "slide-from-top, fade-in"
          },
          _closed: {
            animationName: "slide-to-top, fade-out"
          }
        }
      },
      "slide-in-left": {
        content: {
          _open: {
            animationName: "slide-from-left, fade-in"
          },
          _closed: {
            animationName: "slide-to-left, fade-out"
          }
        }
      },
      "slide-in-right": {
        content: {
          _open: {
            animationName: "slide-from-right, fade-in"
          },
          _closed: {
            animationName: "slide-to-right, fade-out"
          }
        }
      },
      none: {}
    }
  },
  defaultVariants: {
    size: "md",
    scrollBehavior: "outside",
    placement: "top",
    motionPreset: "scale"
  }
}), b9 = q({
  className: "chakra-list",
  slots: ["root", "item", "indicator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--list-gap)",
      "& :where(ul, ol)": {
        marginTop: "var(--list-gap)"
      }
    },
    item: {
      whiteSpace: "normal",
      display: "list-item"
    },
    indicator: {
      marginEnd: "200",
      minHeight: "1lh",
      flexShrink: 0,
      display: "inline-block",
      verticalAlign: "middle"
    }
  },
  variants: {
    variant: {
      marker: {
        root: {
          listStyle: "revert",
          listStylePosition: "inside"
        },
        item: {
          _marker: {
            color: "fg.subtle"
          }
        }
      },
      plain: {
        item: {
          alignItems: "flex-start",
          display: "inline-flex"
        }
      }
    },
    align: {
      center: {
        item: {
          alignItems: "center"
        }
      },
      start: {
        item: {
          alignItems: "flex-start"
        }
      },
      end: {
        item: {
          alignItems: "flex-end"
        }
      }
    }
  },
  defaultVariants: {
    variant: "marker"
  }
}), y9 = q({
  className: "chakra-table",
  slots: [
    "root",
    "header",
    "body",
    "row",
    "columnHeader",
    "cell",
    "footer",
    "caption"
  ],
  base: {
    root: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
      textAlign: "start",
      verticalAlign: "top"
    },
    row: {
      _selected: {
        bg: "colorPalette.subtle"
      }
    },
    cell: {
      textAlign: "start",
      alignItems: "center"
    },
    columnHeader: {
      fontWeight: "medium",
      textAlign: "start",
      color: "fg"
    },
    caption: {
      fontWeight: "medium",
      textStyle: "xs"
    },
    footer: {
      fontWeight: "medium"
    }
  },
  variants: {
    interactive: {
      true: {
        body: {
          "& tr": {
            _hover: {
              bg: "colorPalette.subtle"
            }
          }
        }
      }
    },
    stickyHeader: {
      true: {
        header: {
          "& :where(tr)": {
            top: "var(--table-sticky-offset, 0)",
            position: "sticky",
            zIndex: 1
          }
        }
      }
    },
    striped: {
      true: {
        row: {
          "&:nth-of-type(odd) td": {
            bg: "bg.muted"
          }
        }
      }
    },
    showColumnBorder: {
      true: {
        columnHeader: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px"
          }
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px"
          }
        }
      }
    },
    variant: {
      line: {
        columnHeader: {
          borderBottomWidth: "1px"
        },
        cell: {
          borderBottomWidth: "1px"
        },
        row: {
          bg: "bg"
        }
      },
      outline: {
        root: {
          boxShadow: "0 0 0 1px {colors.border}",
          overflow: "hidden"
        },
        columnHeader: {
          borderBottomWidth: "1px"
        },
        header: {
          bg: "bg.muted"
        },
        row: {
          "&:not(:last-of-type)": {
            borderBottomWidth: "1px"
          }
        },
        footer: {
          borderTopWidth: "1px"
        }
      }
    },
    size: {
      sm: {
        root: {
          textStyle: "sm"
        },
        columnHeader: {
          px: "200",
          py: "200"
        },
        cell: {
          px: "200",
          py: "200"
        }
      },
      md: {
        root: {
          textStyle: "sm"
        },
        columnHeader: {
          px: "300",
          py: "300"
        },
        cell: {
          px: "300",
          py: "300"
        }
      },
      lg: {
        root: {
          textStyle: "md"
        },
        columnHeader: {
          px: "400",
          py: "300"
        },
        cell: {
          px: "400",
          py: "300"
        }
      }
    }
  },
  defaultVariants: {
    variant: "line",
    size: "md"
  }
}), x9 = q({
  slots: ["root", "label", "indicator"],
  // Unique class name prefix for the component
  className: "bleh-ui-checkbox",
  base: {
    root: {
      colorPalette: "primary",
      display: "inline-flex",
      gap: "200",
      alignItems: "center",
      verticalAlign: "top",
      minWidth: "600",
      minHeight: "600",
      "&[data-disabled='true']": {
        layerStyle: "disabled"
      }
    },
    label: {
      flexShrink: 0,
      userSelect: "none",
      color: "neutral.11",
      "&[data-invalid='true']": {
        color: "error.11"
      }
    },
    indicator: {
      position: "relative",
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      border: "solid-50",
      borderRadius: "50",
      focusRing: "outside",
      borderColor: "neutral.9",
      bg: "transparent",
      color: "neutral.11",
      _icon: {
        w: "350",
        h: "350"
      },
      "&:hover": {
        borderColor: "neutral.10"
      },
      "&[data-invalid='true']": {
        bg: "transparent",
        borderColor: "error.9",
        color: "error.11",
        "&:hover": {
          borderColor: "error.10"
        }
      },
      "&[data-selected='true'], &[data-indeterminate='true']": {
        bg: "colorPalette.9",
        borderColor: "colorPalette.9",
        color: "colorPalette.contrast",
        "&:hover": {
          bg: "colorPalette.10",
          borderColor: "colorPalette.10"
        },
        "&[data-invalid='true']": {
          bg: "error.9",
          borderColor: "error.9",
          color: "error.contrast",
          "&:hover": {
            bg: "error.10",
            borderColor: "error.10"
          }
        }
      }
    }
  },
  variants: {
    size: {
      md: {
        label: {
          fontSize: "350",
          fontWeight: "400",
          lineHeight: "400"
        },
        indicator: {
          w: "400",
          h: "400",
          zIndex: 1,
          _after: {
            position: "absolute",
            content: "''",
            width: "600",
            height: "600",
            zIndex: 0
          }
        }
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
}), cv = q({
  slots: [
    "root",
    "trigger",
    "triggerLabel",
    "options",
    "optionGroup",
    "option"
  ],
  // Unique class name prefix for the component
  className: "bleh-ui-select",
  // Base styles applied to all instances of the component
  base: {
    // RA <Select>
    root: {
      colorPalette: "primary",
      display: "inline-block",
      position: "relative",
      maxWidth: "100%",
      borderRadius: "200",
      // [data-focused]
      // [data-focus-visible]
      // [data-open]
      // [data-invalid]
      // [data-required]
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none"
      }
    },
    trigger: {
      cursor: "button",
      display: "inline-flex",
      focusRing: "outside",
      alignItems: "flex-start",
      borderRadius: "200",
      color: "neutral.12",
      width: "100%",
      userSelect: "none",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      "& span": {
        display: "inline-block",
        my: "auto"
      },
      '& [slot="description"]': {
        display: "none"
      },
      "[data-invalid] &": {
        "--border-width": "sizes.50",
        "--border-color": "colors.error.7"
      }
      // [data-hovered]
      // [data-pressed]
      // [data-focused]
      // [data-focus-visible]
      // [data-disabled]
      // [data-pending]
    },
    triggerLabel: {
      // *Magic*
      // the trigger-label defines the overall width of the select,
      // but since we position 2 buttons/icons next to it, we need to account for
      // their width as well and reserve some space for them
      // = label-button-gap + button-size + icon-size
      // = 8px + 24px + 24px
      // = 56px * 25 = 1400 token
      "--button-safespace": "sizes.1400",
      color: "neutral.12",
      textAlign: "left",
      marginRight: "var(--button-safespace)",
      maxWidth: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      "&[data-placeholder]": {
        opacity: 0.5
      },
      "[data-invalid] &": {
        color: "error.11"
      }
    },
    // Popover
    options: {
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      minWidth: "var(--trigger-width)",
      p: "200",
      focusRing: "outside",
      maxHeight: "40svh",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)"
      // [data-trigger="..."]
      // [data-placement="left | right | top | bottom"]
      // [data-entering]
      // [data-exiting]
    },
    // Option group header
    optionGroup: {
      textStyle: "xs",
      color: "neutral.11",
      fontWeight: "600",
      lineHeight: "350",
      letterSpacing: "25",
      textTransform: "uppercase",
      p: "200",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      mx: "-200",
      mt: "200",
      mb: "300"
    },
    // ListBoxItem
    option: {
      focusRing: "outside",
      cursor: "menuitem",
      color: "neutral.12",
      textStyle: "sm",
      p: "200",
      borderRadius: "200",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      '&[aria-selected="true"], &[data-focused="true"]': {
        bg: "primary.4"
      },
      '& [slot="label"]': {
        display: "block"
      },
      '& [slot="description"]': {
        display: "block",
        color: "neutral.11",
        textStyle: "xs"
      },
      '&[data-disabled="true"]': {
        layerStyle: "disabled"
      }
    }
  },
  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        root: {},
        trigger: {
          h: "800",
          px: "400",
          textStyle: "sm"
        }
      },
      md: {
        root: {},
        trigger: {
          h: "1000",
          px: "400",
          textStyle: "md"
        }
      }
      // Medium
    },
    // Visual style variants
    variant: {
      outline: {
        root: {
          bg: "bg",
          "&:hover": {
            bg: "primary.2"
          }
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7"
        }
      },
      ghost: {
        root: {
          bg: "transparent",
          "&:hover": {
            bg: "primaryAlpha.2"
          }
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "transparent"
        }
      }
    }
  },
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "outline"
  }
}), k9 = {
  dialog: m9,
  list: b9,
  table: y9,
  checkbox: x9,
  select: cv
}, _9 = Gh(
  Pe.textStyle
), S9 = oe.durations(Pe.aspectRatio), w9 = oe.animations(Pe.animation), $9 = oe.blurs(Pe.blur), E9 = oe.borders(Pe.border), P9 = oe.colors({
  ...Pe.color["blacks-and-whites"]
}), C9 = oe.durations(Pe.duration), T9 = oe.easings(Pe.easing), I9 = oe.fonts(Pe.fontFamily), R9 = oe.fontSizes(Pe.fontSize), D9 = oe.fontWeights(Pe.fontWeight), A9 = (e) => Object.keys(e).reduce(
  (t, r) => {
    const i = parseFloat(e[r].value) / 100;
    return t[r] = { value: `${i}em` }, t;
  },
  {}
), z9 = oe.letterSpacings(
  A9(Pe.letterSpacing)
), O9 = oe.lineHeights(Pe.lineHeight), F9 = oe.radii(Pe.borderRadius), N9 = oe.spacing(Pe.spacing), L9 = oe.sizes({
  ...Pe.size,
  "1/2": {
    value: "50%"
  },
  "1/3": {
    value: "33.333333%"
  },
  "2/3": {
    value: "66.666667%"
  },
  "1/4": {
    value: "25%"
  },
  "3/4": {
    value: "75%"
  },
  "1/5": {
    value: "20%"
  },
  "2/5": {
    value: "40%"
  },
  "3/5": {
    value: "60%"
  },
  "4/5": {
    value: "80%"
  },
  "1/6": {
    value: "16.666667%"
  },
  "2/6": {
    value: "33.333333%"
  },
  "3/6": {
    value: "50%"
  },
  "4/6": {
    value: "66.666667%"
  },
  "5/6": {
    value: "83.333333%"
  },
  "1/12": {
    value: "8.333333%"
  },
  "2/12": {
    value: "16.666667%"
  },
  "3/12": {
    value: "25%"
  },
  "4/12": {
    value: "33.333333%"
  },
  "5/12": {
    value: "41.666667%"
  },
  "6/12": {
    value: "50%"
  },
  "7/12": {
    value: "58.333333%"
  },
  "8/12": {
    value: "66.666667%"
  },
  "9/12": {
    value: "75%"
  },
  "10/12": {
    value: "83.333333%"
  },
  "11/12": {
    value: "91.666667%"
  },
  max: {
    value: "max-content"
  },
  min: {
    value: "min-content"
  },
  fit: {
    value: "fit-content"
  },
  prose: {
    value: "60ch"
  },
  full: {
    value: "100%"
  },
  dvh: {
    value: "100dvh"
  },
  svh: {
    value: "100svh"
  },
  lvh: {
    value: "100lvh"
  },
  dvw: {
    value: "100dvw"
  },
  svw: {
    value: "100svw"
  },
  lvw: {
    value: "100lvw"
  },
  vw: {
    value: "100vw"
  },
  vh: {
    value: "100vh"
  }
}), M9 = oe.zIndex(Pe.zIndex), B9 = oe.cursor(Pe.cursor), K9 = {
  aspectRatios: S9,
  animations: w9,
  blurs: $9,
  borders: E9,
  colors: P9,
  durations: C9,
  easings: T9,
  fonts: I9,
  fontSizes: R9,
  fontWeights: D9,
  letterSpacings: z9,
  lineHeights: O9,
  radii: F9,
  spacing: N9,
  sizes: L9,
  zIndex: M9,
  cursor: B9
}, W9 = il({
  preflight: !0,
  cssVarsPrefix: "bleh-ui",
  cssVarsRoot: ":where(:root, :host)",
  globalCss: o9,
  theme: {
    breakpoints: i9,
    keyframes: n9,
    tokens: K9,
    semanticTokens: v9,
    recipes: h9,
    slotRecipes: k9,
    textStyles: _9,
    layerStyles: l9,
    animationStyles: r9
  }
}), j9 = y0(Qh, W9);
function I$() {
  const [e, t] = se(r());
  function r() {
    return document.documentElement.style.getPropertyValue("color-scheme") || localStorage.getItem("theme") || "light";
  }
  return ee(() => {
    const a = document.documentElement, i = new MutationObserver(() => {
      const o = r();
      t(o);
    });
    return i.observe(a, {
      attributes: !0,
      attributeFilter: ["style"]
    }), () => i.disconnect();
  }, []), e;
}
function R$({ children: e, ...t }) {
  return /* @__PURE__ */ C.jsx(Xm, { value: j9, children: /* @__PURE__ */ C.jsx(t9, { enableSystem: !1, ...t, children: /* @__PURE__ */ C.jsx(C.Fragment, { children: e }) }) });
}
const V9 = (e) => C.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 24 24", ...e, children: C.jsx("path", { d: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" }) }), H9 = (e) => C.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 24 24", ...e, children: C.jsx("path", { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) }), U9 = (e) => C.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 24 24", ...e, children: C.jsx("path", { d: "M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" }) }), G9 = (e) => C.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 24 24", ...e, children: C.jsx("path", { d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4z" }) }), Y9 = (e) => C.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 24 24", ...e, children: C.jsx("path", { d: "M19 13H5v-2h14z" }) }), { withProvider: q9, withContext: uv } = ja({
  key: "checkbox"
}), X9 = q9(
  "label",
  "root"
), Z9 = uv(
  "span",
  "label"
), J9 = uv("span", "indicator"), Q9 = V(
  (e, t) => {
    const r = B(null), a = Et(Cr(r, t)), i = ll({ key: "checkbox" }), [o] = i.splitVariantProps(e), n = F_(e), { inputProps: l } = O_(e, n, a), { isFocused: s, focusProps: d } = Ha(), c = n.isSelected && !e.isIndeterminate, h = e.isIndeterminate, u = {
      "data-selected": c,
      "data-indeterminate": h,
      "data-invalid": e.isInvalid,
      "data-disabled": e.isDisabled,
      "data-focus": s || void 0
    };
    return /* @__PURE__ */ C.jsxs(X9, { "data-slot": "root", ...o, ...u, children: [
      /* @__PURE__ */ C.jsxs(J9, { "data-slot": "indicator", ...u, children: [
        c && /* @__PURE__ */ C.jsx(V9, {}),
        h && /* @__PURE__ */ C.jsx(Y9, {}),
        /* @__PURE__ */ C.jsx(hv, { as: "span", children: /* @__PURE__ */ C.jsx("input", { ...te(l, d), ref: a }) })
      ] }),
      e.children && /* @__PURE__ */ C.jsx(Z9, { "data-slot": "label", ...u, children: e.children })
    ] });
  }
);
Q9.displayName = "Checkbox";
const ew = V((e, t) => /* @__PURE__ */ C.jsx(M4, { ref: t, ...e }));
ew.displayName = "Stack";
const hv = (e) => {
  const { as: t = "div", ...r } = e;
  return /* @__PURE__ */ C.jsx(Pf, { elementType: t, ...r });
};
hv.displayName = "VisuallyHidden";
const { withContext: tw } = ct({ recipe: zl }), rw = tw(
  "input"
);
function Ol(e) {
  const t = {}, r = { ...e };
  return Object.keys(e).forEach((a) => {
    Object.prototype.hasOwnProperty.call(e, a) && S0.isValidProperty(a) && (t[a] = e[a], delete r[a]);
  }), [t, r];
}
const aw = V(
  (e, t) => {
    const r = B(null), a = Et(Cr(r, t)), i = wu({ recipe: zl }), [o, n] = i.splitVariantProps(e), [l, s] = Ol(n);
    return /* @__PURE__ */ C.jsx(mS, { ...s, children: /* @__PURE__ */ C.jsx(rw, { ref: a, ...o, ...l, asChild: !0, children: /* @__PURE__ */ C.jsx(gS, {}) }) });
  }
);
aw.displayName = "TextInput";
const fv = V((e, t) => /* @__PURE__ */ C.jsx($u, { ref: t, ...e }));
fv.displayName = "Grid";
const D$ = Object.assign(fv, {
  Item: P0
}), { withProvider: iw, withContext: Ya } = ja({
  key: "select"
}), ow = iw(
  "div",
  "root"
), nw = Ya("button", "trigger"), lw = Ya("span", "triggerLabel"), sw = Ya("div", "options"), dw = Ya("div", "option"), cw = Ya("div", "optionGroup"), gv = () => {
  const e = Q(Rl);
  if (!(e != null && e.selectedKey))
    return null;
  const t = () => {
    e == null || e.setSelectedKey(null);
  };
  return /* @__PURE__ */ C.jsx(
    Zg,
    {
      pointerEvents: "all",
      size: "2xs",
      variant: "ghost",
      tone: "primary",
      "aria-label": "Clear Selection",
      onPress: t,
      children: /* @__PURE__ */ C.jsx(H9, {})
    }
  );
};
gv.displayName = "Select.ClearButton";
const pv = V(
  ({ children: e, isLoading: t, isDisabled: r, ...a }, i) => {
    const o = ll({ recipe: cv }), [n, l] = o.splitVariantProps(a), [s, d] = Ol(l), c = {
      ...d,
      isDisabled: t || r
    };
    return /* @__PURE__ */ C.jsx(ow, { asChild: !0, ref: i, ...n, ...s, children: /* @__PURE__ */ C.jsxs(OS, { ...c, children: [
      /* @__PURE__ */ C.jsxs(Ve.div, { position: "relative", children: [
        /* @__PURE__ */ C.jsx(nw, { zIndex: 0, asChild: !0, children: /* @__PURE__ */ C.jsx(iS, { children: /* @__PURE__ */ C.jsx(lw, { asChild: !0, children: /* @__PURE__ */ C.jsx(NS, {}) }) }) }),
        /* @__PURE__ */ C.jsxs(
          wo,
          {
            position: "absolute",
            top: "0",
            bottom: "0",
            zIndex: 1,
            right: "400",
            pointerEvents: "none",
            children: [
              /* @__PURE__ */ C.jsx(wo, { width: "600", my: "auto", children: /* @__PURE__ */ C.jsx(gv, {}) }),
              /* @__PURE__ */ C.jsx(wo, { my: "auto", w: "600", h: "600", pointerEvents: "none", children: /* @__PURE__ */ C.jsx(cn, { color: "neutral.9", asChild: !0, m: "auto", w: "400", h: "400", children: t ? /* @__PURE__ */ C.jsx(cn, { asChild: !0, animation: "spin", animationDuration: "slowest", children: /* @__PURE__ */ C.jsx(G9, {}) }) : /* @__PURE__ */ C.jsx(U9, {}) }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ C.jsx(DS, { children: e })
    ] }) });
  }
);
pv.displayName = "Select.Root";
const Fl = (e) => V(e), vv = Fl(
  (e, t) => {
    const [r, a] = Ol(e);
    return /* @__PURE__ */ C.jsx(sw, { asChild: !0, ...r, children: /* @__PURE__ */ C.jsx($S, { ref: t, ...a }) });
  }
);
vv.displayName = "Select.Options";
const mv = Fl(
  (e, t) => /* @__PURE__ */ C.jsx(dw, { asChild: !0, ref: t, children: /* @__PURE__ */ C.jsx(CS, { ...e }) })
);
mv.displayName = "Select.Option";
const bv = Fl(
  ({ label: e, items: t, children: r, ...a }, i) => {
    if (t && typeof r != "function")
      throw new Error(
        'SelectOptionGroup: When "items" is provided, "children" must be a function'
      );
    return /* @__PURE__ */ C.jsxs(PS, { ref: i, ...a, children: [
      /* @__PURE__ */ C.jsx(cw, { asChild: !0, children: /* @__PURE__ */ C.jsx(SS, { children: e }) }),
      t ? /* @__PURE__ */ C.jsx(dp, { items: t, children: (o) => typeof r == "function" ? r(o) : null }) : r
    ] });
  }
);
bv.displayName = "Select.OptionGroup";
const A$ = {
  Root: pv,
  Options: vv,
  Option: mv,
  OptionGroup: bv
}, uw = be({
  className: "bleh-ui-loading-spinner",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      overflow: "visible",
      // This proportionally scales the spinner to fit the container while also scaling padding
      transform: "scale(calc(1 - 2/12))"
    },
    "& svg [data-svg-path='spinner-pointer']": {
      stroke: "colorPalette.10",
      animationName: "spin",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      transformOrigin: "center center 0"
    },
    "& svg [data-svg-path='spinner-circle']": {
      stroke: "colorPalette.5"
    }
  },
  variants: {
    size: {
      "2xs": {
        width: "350",
        height: "350"
      },
      xs: {
        width: "500",
        height: "500"
      },
      sm: {
        width: "600",
        height: "600"
      },
      md: {
        width: "800",
        height: "800"
      },
      lg: {
        width: "1000",
        height: "1000"
      }
    },
    tone: {
      primary: {
        colorPalette: "ctvioletAlpha"
      },
      white: {
        colorPalette: "whiteAlpha"
      }
    }
  },
  defaultVariants: {
    size: "sm",
    tone: "primary"
  }
}), { withContext: hw } = ct({ recipe: uw }), fw = hw("div"), gw = "M22.5 12C22.5 13.3789 22.2284 14.7443 21.7007 16.0182C21.1731 17.2921 20.3996 18.4496 19.4246 19.4246C18.4496 20.3996 17.2921 21.1731 16.0182 21.7007C14.7443 22.2284 13.3789 22.5 12 22.5C10.6211 22.5 9.25574 22.2284 7.98182 21.7007C6.7079 21.1731 5.55039 20.3996 4.57538 19.4246C3.60036 18.4496 2.82694 17.2921 2.29926 16.0182C1.77159 14.7443 1.5 13.3789 1.5 12C1.5 10.6211 1.77159 9.25574 2.29927 7.98182C2.82694 6.7079 3.60037 5.55039 4.57538 4.57538C5.5504 3.60036 6.70791 2.82694 7.98183 2.29926C9.25575 1.77159 10.6211 1.5 12 1.5C13.3789 1.5 14.7443 1.77159 16.0182 2.29927C17.2921 2.82694 18.4496 3.60037 19.4246 4.57538C20.3996 5.5504 21.1731 6.70791 21.7007 7.98183C22.2284 9.25575 22.5 10.6211 22.5 12L22.5 12Z", pw = "M12 1.5C13.3789 1.5 14.7443 1.77159 16.0182 2.29927C17.2921 2.82694 18.4496 3.60036 19.4246 4.57538C20.3996 5.55039 21.1731 6.70791 21.7007 7.98183C22.2284 9.25574 22.5 10.6211 22.5 12", vw = V(
  ({ "aria-label": e = "Loading data", ...t }, r) => {
    const { progressBarProps: a } = R6({
      isIndeterminate: !0,
      ...t
    });
    return /* @__PURE__ */ C.jsx(
      fw,
      {
        ref: r,
        ...te(t, a),
        "aria-label": e,
        children: /* @__PURE__ */ C.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", children: [
          /* @__PURE__ */ C.jsx(
            "path",
            {
              d: gw,
              "data-svg-path": "spinner-circle",
              strokeWidth: "3",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          ),
          /* @__PURE__ */ C.jsx(
            "path",
            {
              d: pw,
              "data-svg-path": "spinner-pointer",
              strokeWidth: "3",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }
          )
        ] })
      }
    );
  }
);
vw.displayName = "LoadingSpinner";
const mw = be({
  className: "bleh-ui-badge",
  // Base styles applied to all instances of the component
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "200",
    justifyContent: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    py: "25",
    fontWeight: "500",
    backgroundColor: "colorPalette.3",
    color: "colorPalette.11",
    w: "auto",
    userSelect: "none",
    _icon: {
      flexShrink: "0"
    }
  },
  // Available variants for customizing the component's appearance
  variants: {
    size: {
      "2xs": {
        fontSize: "300",
        gap: "100",
        h: "600",
        lineHeight: "350",
        px: "200",
        _icon: {
          width: "400",
          height: "400"
        }
      },
      xs: {
        fontSize: "350",
        gap: "100",
        h: "800",
        lineHeight: "400",
        px: "300",
        _icon: {
          width: "500",
          height: "500"
        }
      },
      md: {
        fontSize: "400",
        gap: "200",
        h: "1000",
        lineHeight: "500",
        px: "400",
        _icon: {
          width: "600",
          height: "600"
        }
      }
    }
  },
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md"
  }
}), { withContext: bw } = ct({ recipe: mw }), yw = bw("span"), z$ = V(
  (e, t) => {
    const { as: r, asChild: a, children: i, ...o } = e, n = B(null), l = Et(Cr(n, t)), s = r || "span";
    return /* @__PURE__ */ C.jsx(yw, { as: s, ...te(o, { ref: l }), children: i });
  }
);
function Rn() {
  return Rn = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var a in r) ({}).hasOwnProperty.call(r, a) && (e[a] = r[a]);
    }
    return e;
  }, Rn.apply(null, arguments);
}
var yv = ["shift", "alt", "meta", "mod", "ctrl"], xw = {
  esc: "escape",
  return: "enter",
  ".": "period",
  ",": "comma",
  "-": "slash",
  " ": "space",
  "`": "backquote",
  "#": "backslash",
  "+": "bracketright",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  AltLeft: "alt",
  AltRight: "alt",
  MetaLeft: "meta",
  MetaRight: "meta",
  OSLeft: "meta",
  OSRight: "meta",
  ControlLeft: "ctrl",
  ControlRight: "ctrl"
};
function sr(e) {
  return (e && xw[e] || e || "").trim().toLowerCase().replace(/key|digit|numpad|arrow/, "");
}
function kw(e) {
  return yv.includes(e);
}
function Bo(e, t) {
  return t === void 0 && (t = ","), e.split(t);
}
function Ko(e, t, r) {
  t === void 0 && (t = "+");
  var a = e.toLocaleLowerCase().split(t).map(function(n) {
    return sr(n);
  }), i = {
    alt: a.includes("alt"),
    ctrl: a.includes("ctrl") || a.includes("control"),
    shift: a.includes("shift"),
    meta: a.includes("meta"),
    mod: a.includes("mod")
  }, o = a.filter(function(n) {
    return !yv.includes(n);
  });
  return Rn({}, i, {
    keys: o,
    description: r,
    hotkey: e
  });
}
(function() {
  typeof document < "u" && (document.addEventListener("keydown", function(e) {
    e.key !== void 0 && xv([sr(e.key), sr(e.code)]);
  }), document.addEventListener("keyup", function(e) {
    e.key !== void 0 && kv([sr(e.key), sr(e.code)]);
  })), typeof window < "u" && window.addEventListener("blur", function() {
    dr.clear();
  });
})();
var dr = /* @__PURE__ */ new Set();
function Nl(e) {
  return Array.isArray(e);
}
function _w(e, t) {
  t === void 0 && (t = ",");
  var r = Nl(e) ? e : e.split(t);
  return r.every(function(a) {
    return dr.has(a.trim().toLowerCase());
  });
}
function xv(e) {
  var t = Array.isArray(e) ? e : [e];
  dr.has("meta") && dr.forEach(function(r) {
    return !kw(r) && dr.delete(r.toLowerCase());
  }), t.forEach(function(r) {
    return dr.add(r.toLowerCase());
  });
}
function kv(e) {
  var t = Array.isArray(e) ? e : [e];
  e === "meta" ? dr.clear() : t.forEach(function(r) {
    return dr.delete(r.toLowerCase());
  });
}
function Sw(e, t, r) {
  (typeof r == "function" && r(e, t) || r === !0) && e.preventDefault();
}
function ww(e, t, r) {
  return typeof r == "function" ? r(e, t) : r === !0 || r === void 0;
}
function $w(e) {
  return _v(e, ["input", "textarea", "select"]);
}
function _v(e, t) {
  t === void 0 && (t = !1);
  var r = e.target, a = e.composed, i = null;
  return Ew(r) && a ? i = e.composedPath()[0] && e.composedPath()[0].tagName : i = r && r.tagName, Nl(t) ? !!(i && t && t.some(function(o) {
    var n;
    return o.toLowerCase() === ((n = i) == null ? void 0 : n.toLowerCase());
  })) : !!(i && t && t);
}
function Ew(e) {
  return !!e.tagName && !e.tagName.startsWith("-") && e.tagName.includes("-");
}
function Pw(e, t) {
  return e.length === 0 && t ? (console.warn('A hotkey has the "scopes" option set, however no active scopes were found. If you want to use the global scopes feature, you need to wrap your app in a <HotkeysProvider>'), !0) : t ? e.some(function(r) {
    return t.includes(r);
  }) || e.includes("*") : !0;
}
var Cw = function(t, r, a) {
  a === void 0 && (a = !1);
  var i = r.alt, o = r.meta, n = r.mod, l = r.shift, s = r.ctrl, d = r.keys, c = t.key, h = t.code, u = t.ctrlKey, f = t.metaKey, g = t.shiftKey, v = t.altKey, b = sr(h), m = c.toLowerCase();
  if (!(d != null && d.includes(b)) && !(d != null && d.includes(m)) && !["ctrl", "control", "unknown", "meta", "alt", "shift", "os"].includes(b))
    return !1;
  if (!a) {
    if (i === !v && m !== "alt" || l === !g && m !== "shift")
      return !1;
    if (n) {
      if (!f && !u)
        return !1;
    } else if (o === !f && m !== "meta" && m !== "os" || s === !u && m !== "ctrl" && m !== "control")
      return !1;
  }
  return d && d.length === 1 && (d.includes(m) || d.includes(b)) ? !0 : d ? _w(d) : !d;
}, Tw = /* @__PURE__ */ ae(void 0), Iw = function() {
  return Q(Tw);
};
function Sv(e, t) {
  return e && t && typeof e == "object" && typeof t == "object" ? Object.keys(e).length === Object.keys(t).length && //@ts-ignore
  Object.keys(e).reduce(function(r, a) {
    return r && Sv(e[a], t[a]);
  }, !0) : e === t;
}
var Rw = /* @__PURE__ */ ae({
  hotkeys: [],
  enabledScopes: [],
  toggleScope: function() {
  },
  enableScope: function() {
  },
  disableScope: function() {
  }
}), Dw = function() {
  return Q(Rw);
};
function Aw(e) {
  var t = B(void 0);
  return Sv(t.current, e) || (t.current = e), t.current;
}
var Vd = function(t) {
  t.stopPropagation(), t.preventDefault(), t.stopImmediatePropagation();
}, zw = typeof window < "u" ? ru : ee;
function O$(e, t, r, a) {
  var i = se(null), o = i[0], n = i[1], l = B(!1), s = r instanceof Array ? a instanceof Array ? void 0 : a : r, d = Nl(e) ? e.join(s == null ? void 0 : s.splitKey) : e, c = r instanceof Array ? r : a instanceof Array ? a : void 0, h = ie(t, c ?? []), u = B(h);
  c ? u.current = h : u.current = t;
  var f = Aw(s), g = Dw(), v = g.enabledScopes, b = Iw();
  return zw(function() {
    if (!((f == null ? void 0 : f.enabled) === !1 || !Pw(v, f == null ? void 0 : f.scopes))) {
      var m = function($, D) {
        var p;
        if (D === void 0 && (D = !1), !($w($) && !_v($, f == null ? void 0 : f.enableOnFormTags))) {
          if (o !== null) {
            var w = o.getRootNode();
            if ((w instanceof Document || w instanceof ShadowRoot) && w.activeElement !== o && !o.contains(w.activeElement)) {
              Vd($);
              return;
            }
          }
          (p = $.target) != null && p.isContentEditable && !(f != null && f.enableOnContentEditable) || Bo(d, f == null ? void 0 : f.splitKey).forEach(function(I) {
            var P, O = Ko(I, f == null ? void 0 : f.combinationKey);
            if (Cw($, O, f == null ? void 0 : f.ignoreModifiers) || (P = O.keys) != null && P.includes("*")) {
              if (f != null && f.ignoreEventWhen != null && f.ignoreEventWhen($) || D && l.current)
                return;
              if (Sw($, O, f == null ? void 0 : f.preventDefault), !ww($, O, f == null ? void 0 : f.enabled)) {
                Vd($);
                return;
              }
              u.current($, O), D || (l.current = !0);
            }
          });
        }
      }, x = function($) {
        $.key !== void 0 && (xv(sr($.code)), ((f == null ? void 0 : f.keydown) === void 0 && (f == null ? void 0 : f.keyup) !== !0 || f != null && f.keydown) && m($));
      }, S = function($) {
        $.key !== void 0 && (kv(sr($.code)), l.current = !1, f != null && f.keyup && m($, !0));
      }, T = o || (s == null ? void 0 : s.document) || document;
      return T.addEventListener("keyup", S), T.addEventListener("keydown", x), b && Bo(d, f == null ? void 0 : f.splitKey).forEach(function(k) {
        return b.addHotkey(Ko(k, f == null ? void 0 : f.combinationKey, f == null ? void 0 : f.description));
      }), function() {
        T.removeEventListener("keyup", S), T.removeEventListener("keydown", x), b && Bo(d, f == null ? void 0 : f.splitKey).forEach(function(k) {
          return b.removeHotkey(Ko(k, f == null ? void 0 : f.combinationKey, f == null ? void 0 : f.description));
        });
      };
    }
  }, [o, d, f, v]), n;
}
function Ow() {
  var e = B(!1), t = ie(function() {
    return e.current;
  }, []);
  return ee(function() {
    return e.current = !0, function() {
      e.current = !1;
    };
  }, []), t;
}
var Fw = function(e) {
  e === void 0 && (e = {});
  var t = se(e), r = t[0], a = t[1], i = ie(function(o) {
    a(function(n) {
      return Object.assign({}, n, o instanceof Function ? o(n) : o);
    });
  }, []);
  return [r, i];
}, Nw = function() {
  var e = document.getSelection();
  if (!e.rangeCount)
    return function() {
    };
  for (var t = document.activeElement, r = [], a = 0; a < e.rangeCount; a++)
    r.push(e.getRangeAt(a));
  switch (t.tagName.toUpperCase()) {
    case "INPUT":
    case "TEXTAREA":
      t.blur();
      break;
    default:
      t = null;
      break;
  }
  return e.removeAllRanges(), function() {
    e.type === "Caret" && e.removeAllRanges(), e.rangeCount || r.forEach(function(i) {
      e.addRange(i);
    }), t && t.focus();
  };
}, Lw = Nw, Hd = {
  "text/plain": "Text",
  "text/html": "Url",
  default: "Text"
}, Mw = "Copy to clipboard: #{key}, Enter";
function Bw(e) {
  var t = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return e.replace(/#{\s*key\s*}/g, t);
}
function Kw(e, t) {
  var r, a, i, o, n, l, s = !1;
  t || (t = {}), r = t.debug || !1;
  try {
    i = Lw(), o = document.createRange(), n = document.getSelection(), l = document.createElement("span"), l.textContent = e, l.ariaHidden = "true", l.style.all = "unset", l.style.position = "fixed", l.style.top = 0, l.style.clip = "rect(0, 0, 0, 0)", l.style.whiteSpace = "pre", l.style.webkitUserSelect = "text", l.style.MozUserSelect = "text", l.style.msUserSelect = "text", l.style.userSelect = "text", l.addEventListener("copy", function(c) {
      if (c.stopPropagation(), t.format)
        if (c.preventDefault(), typeof c.clipboardData > "u") {
          r && console.warn("unable to use e.clipboardData"), r && console.warn("trying IE specific stuff"), window.clipboardData.clearData();
          var h = Hd[t.format] || Hd.default;
          window.clipboardData.setData(h, e);
        } else
          c.clipboardData.clearData(), c.clipboardData.setData(t.format, e);
      t.onCopy && (c.preventDefault(), t.onCopy(c.clipboardData));
    }), document.body.appendChild(l), o.selectNodeContents(l), n.addRange(o);
    var d = document.execCommand("copy");
    if (!d)
      throw new Error("copy command was unsuccessful");
    s = !0;
  } catch (c) {
    r && console.error("unable to copy using execCommand: ", c), r && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(t.format || "text", e), t.onCopy && t.onCopy(window.clipboardData), s = !0;
    } catch (h) {
      r && console.error("unable to copy using clipboardData: ", h), r && console.error("falling back to prompt"), a = Bw("message" in t ? t.message : Mw), window.prompt(a, e);
    }
  } finally {
    n && (typeof n.removeRange == "function" ? n.removeRange(o) : n.removeAllRanges()), l && document.body.removeChild(l), i();
  }
  return s;
}
var Ww = Kw;
const jw = /* @__PURE__ */ Vv(Ww);
var F$ = function() {
  var e = Ow(), t = Fw({
    value: void 0,
    error: void 0,
    noUserInteraction: !0
  }), r = t[0], a = t[1], i = ie(function(o) {
    if (e()) {
      var n, l;
      try {
        if (typeof o != "string" && typeof o != "number") {
          var s = new Error("Cannot copy typeof " + typeof o + " to clipboard, must be a string");
          process.env.NODE_ENV === "development" && console.error(s), a({
            value: o,
            error: s,
            noUserInteraction: !0
          });
          return;
        } else if (o === "") {
          var s = new Error("Cannot copy empty string to clipboard.");
          process.env.NODE_ENV === "development" && console.error(s), a({
            value: o,
            error: s,
            noUserInteraction: !0
          });
          return;
        }
        l = o.toString(), n = jw(l), a({
          value: l,
          error: void 0,
          noUserInteraction: n
        });
      } catch (d) {
        a({
          value: l,
          error: d,
          noUserInteraction: n
        });
      }
    }
  }, []);
  return [r, i];
};
export {
  Q4 as Avatar,
  z$ as Badge,
  qw as Bleed,
  cn as Box,
  Sl as Button,
  Q9 as Checkbox,
  Xw as Code,
  T$ as ColorModeLabel,
  g$ as DialogActionTrigger,
  c$ as DialogBackdrop,
  d$ as DialogBody,
  o$ as DialogCloseTrigger,
  i$ as DialogContent,
  h$ as DialogDescription,
  l$ as DialogFooter,
  s$ as DialogHeader,
  n$ as DialogRoot,
  u$ as DialogTitle,
  f$ as DialogTrigger,
  a$ as Em,
  wo as Flex,
  D$ as Grid,
  r$ as Heading,
  Zw as Highlight,
  Zg as IconButton,
  Jw as Input,
  p$ as InputGroup,
  Qw as Kbd,
  K6 as Link,
  e$ as List,
  m$ as ListItem,
  v$ as ListRoot,
  vw as LoadingSpinner,
  HS as MakeElementFocusable,
  A$ as Select,
  b$ as SimpleGrid,
  ew as Stack,
  t$ as Table,
  E$ as TableBody,
  $$ as TableCell,
  k$ as TableColumn,
  x$ as TableColumnGroup,
  P$ as TableColumnHeader,
  S$ as TableFooter,
  _$ as TableHeader,
  y$ as TableRoot,
  w$ as TableRow,
  W6 as Text,
  aw as TextInput,
  jS as Tooltip,
  VS as TooltipTrigger,
  R$ as UiKitProvider,
  hv as VisuallyHidden,
  mv as _SelectOption,
  bv as _SelectOptionGroup,
  vv as _SelectOptions,
  pv as _SelectRoot,
  j9 as system,
  dv as useColorMode,
  C$ as useColorModeValue,
  I$ as useColorScheme,
  F$ as useCopyToClipboard,
  O$ as useHotkeys
};
