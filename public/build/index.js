//     Underscore.js 1.2.4
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore
function Gauge(a, b) {
	this.placeholderName = a;
	var c = this;
	this.configure = function (a) {
		this.config = a,
		this.config.size = this.config.size * .9,
		this.config.raduis = this.config.size * .97 / 2,
		this.config.cx = this.config.size / 2,
		this.config.cy = this.config.size / 2,
		this.config.min = a.min || 0,
		this.config.max = a.max || 100,
		this.config.range = this.config.max - this.config.min,
		this.config.majorTicks = a.majorTicks || 5,
		this.config.minorTicks = a.minorTicks || 2,
		this.config.greenColor = a.greenColor || "#109618",
		this.config.yellowColor = a.yellowColor || "#FF9900",
		this.config.redColor = a.redColor || "#DC3912"
	},
	this.render = function () {
		this.body = d3.select("#" + this.placeholderName).append("svg:svg").attr("class", "gauge").attr("width", this.config.size).attr("height", this.config.size),
		this.body.append("svg:circle").attr("class", "outer").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", this.config.raduis),
		this.body.append("svg:circle").attr("class", "inner").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", .9 * this.config.raduis);
		for (var a in this.config.greenZones)
			this.drawBand(this.config.greenZones[a].from, this.config.greenZones[a].to, c.config.greenColor);
		for (var a in this.config.yellowZones)
			this.drawBand(this.config.yellowZones[a].from, this.config.yellowZones[a].to, c.config.yellowColor);
		for (var a in this.config.redZones)
			this.drawBand(this.config.redZones[a].from, this.config.redZones[a].to, c.config.redColor);
		if (undefined != this.config.label) {
			var b = Math.round(this.config.size / 9);
			this.body.append("svg:text").attr("class", "label").attr("x", this.config.cx).attr("y", this.config.cy / 2 + b / 2).attr("dy", b / 2).attr("text-anchor", "middle").text(this.config.label).style("font-size", b + "px")
		}
		var b = Math.round(this.config.size / 16),
		d = this.config.range / (this.config.majorTicks - 1);
		for (var e = this.config.min; e <= this.config.max; e += d) {
			var f = d / this.config.minorTicks;
			for (var g = e + f; g < Math.min(e + d, this.config.max); g += f) {
				var h = this.valueToPoint(g, .75),
				i = this.valueToPoint(g, .85);
				this.body.append("svg:line").attr("class", "small-tick").attr("x1", h.x).attr("y1", h.y).attr("x2", i.x).attr("y2", i.y)
			}
			var h = this.valueToPoint(e, .7),
			i = this.valueToPoint(e, .85);
			this.body.append("svg:line").attr("class", "big-tick").attr("x1", h.x).attr("y1", h.y).attr("x2", i.x).attr("y2", i.y);
			if (e == this.config.min || e == this.config.max) {
				var j = this.valueToPoint(e, .63);
				this.body.append("svg:text").attr("class", "limit").attr("x", j.x).attr("y", j.y).attr("dy", b / 3).attr("text-anchor", e == this.config.min ? "start" : "end").text(e).style("font-size", b + "px")
			}
		}
		var k = this.body.append("svg:g").attr("class", "pointerContainer");
		this.drawPointer(0),
		k.append("svg:circle").attr("class", "pointer-circle").attr("cx", this.config.cx).attr("cy", this.config.cy).attr("r", .12 * this.config.raduis)
	},
	this.redraw = function (a, b) {
		this.drawPointer(a, b)
	},
	this.drawBand = function (a, b, d) {
		if (0 >= b - a)
			return;
		this.body.append("svg:path").style("fill", d).attr("class", "band").attr("d", d3.svg.arc().startAngle(this.valueToRadians(a)).endAngle(this.valueToRadians(b)).innerRadius(.8 * this.config.raduis).outerRadius(.85 * this.config.raduis)).attr("transform", function () {
			return "translate(" + c.config.cx + ", " + c.config.cy + ") rotate(270)"
		})
	},
	this.drawPointer = function (a, b) {
		var c = this.config.range / 13,
		d = this.valueToPoint(a, .85),
		e = this.valueToPoint(a - c, .12),
		f = this.valueToPoint(a + c, .12),
		g = a - this.config.range * (1 / .75) / 2,
		h = this.valueToPoint(g, .28),
		i = this.valueToPoint(g - c, .12),
		j = this.valueToPoint(g + c, .12),
		k = [d, e, j, h, i, f, d],
		l = d3.svg.line().x(function (a) {
				return a.x
			}).y(function (a) {
				return a.y
			}).interpolate("basis"),
		m = this.body.select(".pointerContainer"),
		n = m.selectAll("path").data([k]);
		n.enter().append("svg:path").attr("class", "pointer").attr("d", l),
		n.transition().attr("d", l);
		var o = Math.round(this.config.size / 10);
		m.selectAll("text").data([a]).text(d3.format(b)(a)).enter().append("svg:text").attr("class", "value").attr("x", this.config.cx).attr("y", this.config.size - this.config.cy / 4 - o).attr("dy", o / 2).attr("text-anchor", "middle").text(d3.format(b)(a)).style("font-size", o + "px")
	},
	this.valueToDegrees = function (a) {
		return a / this.config.range * 270 - 45
	},
	this.valueToRadians = function (a) {
		return this.valueToDegrees(a) * Math.PI / 180
	},
	this.valueToPoint = function (a, b) {
		var c = {
			x : this.config.cx - this.config.raduis * b * Math.cos(this.valueToRadians(a)),
			y : this.config.cy - this.config.raduis * b * Math.sin(this.valueToRadians(a))
		};
		return c
	},
	this.configure(b)
}
((function () {
		function A(a, b, c) {
			if (a === b)
				return a !== 0 || 1 / a == 1 / b;
			if (a == null || b == null)
				return a === b;
			a._chain && (a = a._wrapped),
			b._chain && (b = b._wrapped);
			if (a.isEqual && w.isFunction(a.isEqual))
				return a.isEqual(b);
			if (b.isEqual && w.isFunction(b.isEqual))
				return b.isEqual(a);
			var d = i.call(a);
			if (d != i.call(b))
				return !1;
			switch (d) {
			case "[object String]":
				return a == String(b);
			case "[object Number]":
				return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
			case "[object Date]":
			case "[object Boolean]":
				return +a == +b;
			case "[object RegExp]":
				return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
			}
			if (typeof a != "object" || typeof b != "object")
				return !1;
			var e = c.length;
			while (e--)
				if (c[e] == a)
					return !0;
			c.push(a);
			var f = 0,
			g = !0;
			if (d == "[object Array]") {
				f = a.length,
				g = f == b.length;
				if (g)
					while (f--)
						if (!(g = f in a == f in b && A(a[f], b[f], c)))
							break
			} else {
				if ("constructor" in a != "constructor" in b || a.constructor != b.constructor)
					return !1;
				for (var h in a)
					if (j.call(a, h)) {
						f++;
						if (!(g = j.call(b, h) && A(a[h], b[h], c)))
							break
					}
				if (g) {
					for (h in b)
						if (j.call(b, h) && !(f--))
							break;
					g = !f
				}
			}
			return c.pop(),
			g
		}
		var a = this,
		b = a._,
		c = {},
		d = Array.prototype,
		e = Object.prototype,
		f = Function.prototype,
		g = d.slice,
		h = d.unshift,
		i = e.toString,
		j = e.hasOwnProperty,
		k = d.forEach,
		l = d.map,
		m = d.reduce,
		n = d.reduceRight,
		o = d.filter,
		p = d.every,
		q = d.some,
		r = d.indexOf,
		s = d.lastIndexOf,
		t = Array.isArray,
		u = Object.keys,
		v = f.bind,
		w = function (a) {
			return new D(a)
		};
		typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = w), exports._ = w) : typeof define == "function" && define.amd ? define("underscore", function () {
			return w
		}) : a._ = w,
		w.VERSION = "1.2.4";
		var x = w.each = w.forEach = function (a, b, d) {
			if (a == null)
				return;
			if (k && a.forEach === k)
				a.forEach(b, d);
			else if (a.length === +a.length) {
				for (var e = 0, f = a.length; e < f; e++)
					if (e in a && b.call(d, a[e], e, a) === c)
						return
			} else
				for (var g in a)
					if (j.call(a, g) && b.call(d, a[g], g, a) === c)
						return
		};
		w.map = function (a, b, c) {
			var d = [];
			return a == null ? d : l && a.map === l ? a.map(b, c) : (x(a, function (a, e, f) {
					d[d.length] = b.call(c, a, e, f)
				}), a.length === +a.length && (d.length = a.length), d)
		},
		w.reduce = w.foldl = w.inject = function (a, b, c, d) {
			var e = arguments.length > 2;
			a == null && (a = []);
			if (m && a.reduce === m)
				return d && (b = w.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
			x(a, function (a, f, g) {
				e ? c = b.call(d, c, a, f, g) : (c = a, e = !0)
			});
			if (!e)
				throw new TypeError("Reduce of empty array with no initial value");
			return c
		},
		w.reduceRight = w.foldr = function (a, b, c, d) {
			var e = arguments.length > 2;
			a == null && (a = []);
			if (n && a.reduceRight === n)
				return d && (b = w.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b);
			var f = w.toArray(a).reverse();
			return d && !e && (b = w.bind(b, d)),
			e ? w.reduce(f, b, c, d) : w.reduce(f, b)
		},
		w.find = w.detect = function (a, b, c) {
			var d;
			return y(a, function (a, e, f) {
				if (b.call(c, a, e, f))
					return d = a, !0
			}),
			d
		},
		w.filter = w.select = function (a, b, c) {
			var d = [];
			return a == null ? d : o && a.filter === o ? a.filter(b, c) : (x(a, function (a, e, f) {
					b.call(c, a, e, f) && (d[d.length] = a)
				}), d)
		},
		w.reject = function (a, b, c) {
			var d = [];
			return a == null ? d : (x(a, function (a, e, f) {
					b.call(c, a, e, f) || (d[d.length] = a)
				}), d)
		},
		w.every = w.all = function (a, b, d) {
			var e = !0;
			return a == null ? e : p && a.every === p ? a.every(b, d) : (x(a, function (a, f, g) {
					if (!(e = e && b.call(d, a, f, g)))
						return c
				}), e)
		};
		var y = w.some = w.any = function (a, b, d) {
			b || (b = w.identity);
			var e = !1;
			return a == null ? e : q && a.some === q ? a.some(b, d) : (x(a, function (a, f, g) {
					if (e || (e = b.call(d, a, f, g)))
						return c
				}), !!e)
		};
		w.include = w.contains = function (a, b) {
			var c = !1;
			return a == null ? c : r && a.indexOf === r ? a.indexOf(b) != -1 : (c = y(a, function (a) {
						return a === b
					}), c)
		},
		w.invoke = function (a, b) {
			var c = g.call(arguments, 2);
			return w.map(a, function (a) {
				return (w.isFunction(b) ? b || a : a[b]).apply(a, c)
			})
		},
		w.pluck = function (a, b) {
			return w.map(a, function (a) {
				return a[b]
			})
		},
		w.max = function (a, b, c) {
			if (!b && w.isArray(a))
				return Math.max.apply(Math, a);
			if (!b && w.isEmpty(a))
				return -Infinity;
			var d = {
				computed : -Infinity
			};
			return x(a, function (a, e, f) {
				var g = b ? b.call(c, a, e, f) : a;
				g >= d.computed && (d = {
						value : a,
						computed : g
					})
			}),
			d.value
		},
		w.min = function (a, b, c) {
			if (!b && w.isArray(a))
				return Math.min.apply(Math, a);
			if (!b && w.isEmpty(a))
				return Infinity;
			var d = {
				computed : Infinity
			};
			return x(a, function (a, e, f) {
				var g = b ? b.call(c, a, e, f) : a;
				g < d.computed && (d = {
						value : a,
						computed : g
					})
			}),
			d.value
		},
		w.shuffle = function (a) {
			var b = [],
			c;
			return x(a, function (a, d, e) {
				d == 0 ? b[0] = a : (c = Math.floor(Math.random() * (d + 1)), b[d] = b[c], b[c] = a)
			}),
			b
		},
		w.sortBy = function (a, b, c) {
			return w.pluck(w.map(a, function (a, d, e) {
					return {
						value : a,
						criteria : b.call(c, a, d, e)
					}
				}).sort(function (a, b) {
					var c = a.criteria,
					d = b.criteria;
					return c < d ? -1 : c > d ? 1 : 0
				}), "value")
		},
		w.groupBy = function (a, b) {
			var c = {},
			d = w.isFunction(b) ? b : function (a) {
				return a[b]
			};
			return x(a, function (a, b) {
				var e = d(a, b);
				(c[e] || (c[e] = [])).push(a)
			}),
			c
		},
		w.sortedIndex = function (a, b, c) {
			c || (c = w.identity);
			var d = 0,
			e = a.length;
			while (d < e) {
				var f = d + e >> 1;
				c(a[f]) < c(b) ? d = f + 1 : e = f
			}
			return d
		},
		w.toArray = function (a) {
			return a ? a.toArray ? a.toArray() : w.isArray(a) ? g.call(a) : w.isArguments(a) ? g.call(a) : w.values(a) : []
		},
		w.size = function (a) {
			return w.toArray(a).length
		},
		w.first = w.head = function (a, b, c) {
			return b != null && !c ? g.call(a, 0, b) : a[0]
		},
		w.initial = function (a, b, c) {
			return g.call(a, 0, a.length - (b == null || c ? 1 : b))
		},
		w.last = function (a, b, c) {
			return b != null && !c ? g.call(a, Math.max(a.length - b, 0)) : a[a.length - 1]
		},
		w.rest = w.tail = function (a, b, c) {
			return g.call(a, b == null || c ? 1 : b)
		},
		w.compact = function (a) {
			return w.filter(a, function (a) {
				return !!a
			})
		},
		w.flatten = function (a, b) {
			return w.reduce(a, function (a, c) {
				return w.isArray(c) ? a.concat(b ? c : w.flatten(c)) : (a[a.length] = c, a)
			}, [])
		},
		w.without = function (a) {
			return w.difference(a, g.call(arguments, 1))
		},
		w.uniq = w.unique = function (a, b, c) {
			var d = c ? w.map(a, c) : a,
			e = [];
			return w.reduce(d, function (c, d, f) {
				if (0 == f || (b === !0 ? w.last(c) != d : !w.include(c, d)))
					c[c.length] = d, e[e.length] = a[f];
				return c
			}, []),
			e
		},
		w.union = function () {
			return w.uniq(w.flatten(arguments, !0))
		},
		w.intersection = w.intersect = function (a) {
			var b = g.call(arguments, 1);
			return w.filter(w.uniq(a), function (a) {
				return w.every(b, function (b) {
					return w.indexOf(b, a) >= 0
				})
			})
		},
		w.difference = function (a) {
			var b = w.flatten(g.call(arguments, 1));
			return w.filter(a, function (a) {
				return !w.include(b, a)
			})
		},
		w.zip = function () {
			var a = g.call(arguments),
			b = w.max(w.pluck(a, "length")),
			c = new Array(b);
			for (var d = 0; d < b; d++)
				c[d] = w.pluck(a, "" + d);
			return c
		},
		w.indexOf = function (a, b, c) {
			if (a == null)
				return -1;
			var d,
			e;
			if (c)
				return d = w.sortedIndex(a, b), a[d] === b ? d : -1;
			if (r && a.indexOf === r)
				return a.indexOf(b);
			for (d = 0, e = a.length; d < e; d++)
				if (d in a && a[d] === b)
					return d;
			return -1
		},
		w.lastIndexOf = function (a, b) {
			if (a == null)
				return -1;
			if (s && a.lastIndexOf === s)
				return a.lastIndexOf(b);
			var c = a.length;
			while (c--)
				if (c in a && a[c] === b)
					return c;
			return -1
		},
		w.range = function (a, b, c) {
			arguments.length <= 1 && (b = a || 0, a = 0),
			c = arguments[2] || 1;
			var d = Math.max(Math.ceil((b - a) / c), 0),
			e = 0,
			f = new Array(d);
			while (e < d)
				f[e++] = a, a += c;
			return f
		};
		var z = function () {};
		w.bind = function (b, c) {
			var d,
			e;
			if (b.bind === v && v)
				return v.apply(b, g.call(arguments, 1));
			if (!w.isFunction(b))
				throw new TypeError;
			return e = g.call(arguments, 2),
			d = function () {
				if (this instanceof d) {
					z.prototype = b.prototype;
					var a = new z,
					f = b.apply(a, e.concat(g.call(arguments)));
					return Object(f) === f ? f : a
				}
				return b.apply(c, e.concat(g.call(arguments)))
			}
		},
		w.bindAll = function (a) {
			var b = g.call(arguments, 1);
			return b.length == 0 && (b = w.functions(a)),
			x(b, function (b) {
				a[b] = w.bind(a[b], a)
			}),
			a
		},
		w.memoize = function (a, b) {
			var c = {};
			return b || (b = w.identity),
			function () {
				var d = b.apply(this, arguments);
				return j.call(c, d) ? c[d] : c[d] = a.apply(this, arguments)
			}
		},
		w.delay = function (a, b) {
			var c = g.call(arguments, 2);
			return setTimeout(function () {
				return a.apply(a, c)
			}, b)
		},
		w.defer = function (a) {
			return w.delay.apply(w, [a, 1].concat(g.call(arguments, 1)))
		},
		w.throttle = function (a, b) {
			var c,
			d,
			e,
			f,
			g,
			h = w.debounce(function () {
					g = f = !1
				}, b);
			return function () {
				c = this,
				d = arguments;
				var i = function () {
					e = null,
					g && a.apply(c, d),
					h()
				};
				e || (e = setTimeout(i, b)),
				f ? g = !0 : a.apply(c, d),
				h(),
				f = !0
			}
		},
		w.debounce = function (a, b) {
			var c;
			return function () {
				var d = this,
				e = arguments,
				f = function () {
					c = null,
					a.apply(d, e)
				};
				clearTimeout(c),
				c = setTimeout(f, b)
			}
		},
		w.once = function (a) {
			var b = !1,
			c;
			return function () {
				return b ? c : (b = !0, c = a.apply(this, arguments))
			}
		},
		w.wrap = function (a, b) {
			return function () {
				var c = [a].concat(g.call(arguments, 0));
				return b.apply(this, c)
			}
		},
		w.compose = function () {
			var a = arguments;
			return function () {
				var b = arguments;
				for (var c = a.length - 1; c >= 0; c--)
					b = [a[c].apply(this, b)];
				return b[0]
			}
		},
		w.after = function (a, b) {
			return a <= 0 ? b() : function () {
				if (--a < 1)
					return b.apply(this, arguments)
			}
		},
		w.keys = u || function (a) {
			if (a !== Object(a))
				throw new TypeError("Invalid object");
			var b = [];
			for (var c in a)
				j.call(a, c) && (b[b.length] = c);
			return b
		},
		w.values = function (a) {
			return w.map(a, w.identity)
		},
		w.functions = w.methods = function (a) {
			var b = [];
			for (var c in a)
				w.isFunction(a[c]) && b.push(c);
			return b.sort()
		},
		w.extend = function (a) {
			return x(g.call(arguments, 1), function (b) {
				for (var c in b)
					b[c] !== void 0 && (a[c] = b[c])
			}),
			a
		},
		w.defaults = function (a) {
			return x(g.call(arguments, 1), function (b) {
				for (var c in b)
					a[c] == null && (a[c] = b[c])
			}),
			a
		},
		w.clone = function (a) {
			return w.isObject(a) ? w.isArray(a) ? a.slice() : w.extend({}, a) : a
		},
		w.tap = function (a, b) {
			return b(a),
			a
		},
		w.isEqual = function (a, b) {
			return A(a, b, [])
		},
		w.isEmpty = function (a) {
			if (w.isArray(a) || w.isString(a))
				return a.length === 0;
			for (var b in a)
				if (j.call(a, b))
					return !1;
			return !0
		},
		w.isElement = function (a) {
			return !!a && a.nodeType == 1
		},
		w.isArray = t || function (a) {
			return i.call(a) == "[object Array]"
		},
		w.isObject = function (a) {
			return a === Object(a)
		},
		w.isArguments = function (a) {
			return i.call(a) == "[object Arguments]"
		},
		w.isArguments(arguments) || (w.isArguments = function (a) {
			return !!a && !!j.call(a, "callee")
		}),
		w.isFunction = function (a) {
			return i.call(a) == "[object Function]"
		},
		w.isString = function (a) {
			return i.call(a) == "[object String]"
		},
		w.isNumber = function (a) {
			return i.call(a) == "[object Number]"
		},
		w.isNaN = function (a) {
			return a !== a
		},
		w.isBoolean = function (a) {
			return a === !0 || a === !1 || i.call(a) == "[object Boolean]"
		},
		w.isDate = function (a) {
			return i.call(a) == "[object Date]"
		},
		w.isRegExp = function (a) {
			return i.call(a) == "[object RegExp]"
		},
		w.isNull = function (a) {
			return a === null
		},
		w.isUndefined = function (a) {
			return a === void 0
		},
		w.noConflict = function () {
			return a._ = b,
			this
		},
		w.identity = function (a) {
			return a
		},
		w.times = function (a, b, c) {
			for (var d = 0; d < a; d++)
				b.call(c, d)
		},
		w.escape = function (a) {
			return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
		},
		w.mixin = function (a) {
			x(w.functions(a), function (b) {
				F(b, w[b] = a[b])
			})
		};
		var B = 0;
		w.uniqueId = function (a) {
			var b = B++;
			return a ? a + b : b
		},
		w.templateSettings = {
			evaluate : /<%([\s\S]+?)%>/g,
			interpolate : /<%=([\s\S]+?)%>/g,
			escape : /<%-([\s\S]+?)%>/g
		};
		var C = /.^/;
		w.template = function (a, b) {
			var c = w.templateSettings,
			d = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + a.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(c.escape || C, function (a, b) {
					return "',_.escape(" + b.replace(/\\'/g, "'") + "),'"
				}).replace(c.interpolate || C, function (a, b) {
					return "'," + b.replace(/\\'/g, "'") + ",'"
				}).replace(c.evaluate || C, function (a, b) {
					return "');" + b.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ").replace(/\\\\/g, "\\") + ";__p.push('"
				}).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');",
			e = new Function("obj", "_", d);
			return b ? e(b, w) : function (a) {
				return e.call(this, a, w)
			}
		},
		w.chain = function (a) {
			return w(a).chain()
		};
		var D = function (a) {
			this._wrapped = a
		};
		w.prototype = D.prototype;
		var E = function (a, b) {
			return b ? w(a).chain() : a
		},
		F = function (a, b) {
			D.prototype[a] = function () {
				var a = g.call(arguments);
				return h.call(a, this._wrapped),
				E(b.apply(w, a), this._chain)
			}
		};
		w.mixin(w),
		x(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) {
			var b = d[a];
			D.prototype[a] = function () {
				var c = this._wrapped;
				b.apply(c, arguments);
				var d = c.length;
				return (a == "shift" || a == "splice") && d === 0 && delete c[0],
				E(c, this._chain)
			}
		}),
		x(["concat", "join", "slice"], function (a) {
			var b = d[a];
			D.prototype[a] = function () {
				return E(b.apply(this._wrapped, arguments), this._chain)
			}
		}),
		D.prototype.chain = function () {
			return this._chain = !0,
			this
		},
		D.prototype.value = function () {
			return this._wrapped
		}
	})).call(this), function () {
	var a = this,
	b = a.Backbone,
	c;
	typeof exports != "undefined" ? c = exports : c = a.Backbone = {},
	c.VERSION = "0.5.3";
	var d = a._;
	!d && typeof require != "undefined" && (d = require("underscore")._);
	var e = a.jQuery || a.Zepto;
	c.noConflict = function () {
		return a.Backbone = b,
		this
	},
	c.emulateHTTP = !1,
	c.emulateJSON = !1,
	c.Events = {
		bind : function (a, b, c) {
			var d = this._callbacks || (this._callbacks = {}),
			e = d[a] || (d[a] = []);
			return e.push([b, c]),
			this
		},
		unbind : function (a, b) {
			var c;
			if (!a)
				this._callbacks = {};
			else if (c = this._callbacks)
				if (!b)
					c[a] = [];
				else {
					var d = c[a];
					if (!d)
						return this;
					for (var e = 0, f = d.length; e < f; e++)
						if (d[e] && b === d[e][0]) {
							d[e] = null;
							break
						}
				}
			return this
		},
		trigger : function (a) {
			var b,
			c,
			d,
			e,
			f,
			g = 2;
			if (!(c = this._callbacks))
				return this;
			while (g--) {
				d = g ? a : "all";
				if (b = c[d])
					for (var h = 0, i = b.length; h < i; h++)
						(e = b[h]) ? (f = g ? Array.prototype.slice.call(arguments, 1) : arguments, e[0].apply(e[1] || this, f)) : (b.splice(h, 1), h--, i--)
			}
			return this
		}
	},
	c.Model = function (a, b) {
		var c;
		a || (a = {});
		if (c = this.defaults)
			d.isFunction(c) && (c = c.call(this)), a = d.extend({}, c, a);
		this.attributes = {},
		this._escapedAttributes = {},
		this.cid = d.uniqueId("c"),
		this.set(a, {
			silent : !0
		}),
		this._changed = !1,
		this._previousAttributes = d.clone(this.attributes),
		b && b.collection && (this.collection = b.collection),
		this.initialize(a, b)
	},
	d.extend(c.Model.prototype, c.Events, {
		_previousAttributes : null,
		_changed : !1,
		idAttribute : "id",
		initialize : function () {},
		toJSON : function () {
			return d.clone(this.attributes)
		},
		get : function (a) {
			return this.attributes[a]
		},
		escape : function (a) {
			var b;
			if (b = this._escapedAttributes[a])
				return b;
			var c = this.attributes[a];
			return this._escapedAttributes[a] = w(c == null ? "" : "" + c)
		},
		has : function (a) {
			return this.attributes[a] != null
		},
		set : function (a, b) {
			b || (b = {});
			if (!a)
				return this;
			a.attributes && (a = a.attributes);
			var c = this.attributes,
			e = this._escapedAttributes;
			if (!b.silent && this.validate && !this._performValidation(a, b))
				return !1;
			this.idAttribute in a && (this.id = a[this.idAttribute]);
			var f = this._changing;
			this._changing = !0;
			for (var g in a) {
				var h = a[g];
				d.isEqual(c[g], h) || (c[g] = h, delete e[g], this._changed = !0, b.silent || this.trigger("change:" + g, this, h, b))
			}
			return !f && !b.silent && this._changed && this.change(b),
			this._changing = !1,
			this
		},
		unset : function (a, b) {
			if (a in this.attributes) {
				b || (b = {});
				var c = this.attributes[a],
				d = {};
				return d[a] = void 0,
				!b.silent && this.validate && !this._performValidation(d, b) ? !1 : (delete this.attributes[a], delete this._escapedAttributes[a], a == this.idAttribute && delete this.id, this._changed = !0, b.silent || (this.trigger("change:" + a, this, void 0, b), this.change(b)), this)
			}
			return this
		},
		clear : function (a) {
			a || (a = {});
			var b,
			c = this.attributes,
			d = {};
			for (b in c)
				d[b] = void 0;
			if (!a.silent && this.validate && !this._performValidation(d, a))
				return !1;
			this.attributes = {},
			this._escapedAttributes = {},
			this._changed = !0;
			if (!a.silent) {
				for (b in c)
					this.trigger("change:" + b, this, void 0, a);
				this.change(a)
			}
			return this
		},
		fetch : function (a) {
			a || (a = {});
			var b = this,
			d = a.success;
			return a.success = function (c, e, f) {
				if (!b.set(b.parse(c, f), a))
					return !1;
				d && d(b, c)
			},
			a.error = v(a.error, b, a),
			(this.sync || c.sync).call(this, "read", this, a)
		},
		save : function (a, b) {
			b || (b = {});
			if (a && !this.set(a, b))
				return !1;
			var d = this,
			e = b.success;
			b.success = function (a, c, f) {
				if (!d.set(d.parse(a, f), b))
					return !1;
				e && e(d, a, f)
			},
			b.error = v(b.error, d, b);
			var f = this.isNew() ? "create" : "update";
			return (this.sync || c.sync).call(this, f, this, b)
		},
		destroy : function (a) {
			a || (a = {});
			if (this.isNew())
				return this.trigger("destroy", this, this.collection, a);
			var b = this,
			d = a.success;
			return a.success = function (c) {
				b.trigger("destroy", b, b.collection, a),
				d && d(b, c)
			},
			a.error = v(a.error, b, a),
			(this.sync || c.sync).call(this, "delete", this, a)
		},
		url : function () {
			var a = t(this.collection) || this.urlRoot || u();
			return this.isNew() ? a : a + (a.charAt(a.length - 1) == "/" ? "" : "/") + encodeURIComponent(this.id)
		},
		parse : function (a, b) {
			return a
		},
		clone : function () {
			return new this.constructor(this)
		},
		isNew : function () {
			return this.id == null
		},
		change : function (a) {
			this.trigger("change", this, a),
			this._previousAttributes = d.clone(this.attributes),
			this._changed = !1
		},
		hasChanged : function (a) {
			return a ? this._previousAttributes[a] != this.attributes[a] : this._changed
		},
		changedAttributes : function (a) {
			a || (a = this.attributes);
			var b = this._previousAttributes,
			c = !1;
			for (var e in a)
				d.isEqual(b[e], a[e]) || (c = c || {}, c[e] = a[e]);
			return c
		},
		previous : function (a) {
			return !a || !this._previousAttributes ? null : this._previousAttributes[a]
		},
		previousAttributes : function () {
			return d.clone(this._previousAttributes)
		},
		_performValidation : function (a, b) {
			var c = this.validate(a);
			return c ? (b.error ? b.error(this, c, b) : this.trigger("error", this, c, b), !1) : !0
		}
	}),
	c.Collection = function (a, b) {
		b || (b = {}),
		b.comparator && (this.comparator = b.comparator),
		d.bindAll(this, "_onModelEvent", "_removeReference"),
		this._reset(),
		a && this.reset(a, {
			silent : !0
		}),
		this.initialize.apply(this, arguments)
	},
	d.extend(c.Collection.prototype, c.Events, {
		model : c.Model,
		initialize : function () {},
		toJSON : function () {
			return this.map(function (a) {
				return a.toJSON()
			})
		},
		add : function (a, b) {
			if (d.isArray(a))
				for (var c = 0, e = a.length; c < e; c++)
					this._add(a[c], b);
			else
				this._add(a, b);
			return this
		},
		remove : function (a, b) {
			if (d.isArray(a))
				for (var c = 0, e = a.length; c < e; c++)
					this._remove(a[c], b);
			else
				this._remove(a, b);
			return this
		},
		get : function (a) {
			return a == null ? null : this._byId[a.id != null ? a.id : a]
		},
		getByCid : function (a) {
			return a && this._byCid[a.cid || a]
		},
		at : function (a) {
			return this.models[a]
		},
		sort : function (a) {
			a || (a = {});
			if (!this.comparator)
				throw new Error("Cannot sort a set without a comparator");
			return this.models = this.sortBy(this.comparator),
			a.silent || this.trigger("reset", this, a),
			this
		},
		pluck : function (a) {
			return d.map(this.models, function (b) {
				return b.get(a)
			})
		},
		reset : function (a, b) {
			return a || (a = []),
			b || (b = {}),
			this.each(this._removeReference),
			this._reset(),
			this.add(a, {
				silent : !0
			}),
			b.silent || this.trigger("reset", this, b),
			this
		},
		fetch : function (a) {
			a || (a = {});
			var b = this,
			d = a.success;
			return a.success = function (c, e, f) {
				b[a.add ? "add" : "reset"](b.parse(c, f), a),
				d && d(b, c)
			},
			a.error = v(a.error, b, a),
			(this.sync || c.sync).call(this, "read", this, a)
		},
		create : function (a, b) {
			var c = this;
			b || (b = {}),
			a = this._prepareModel(a, b);
			if (!a)
				return !1;
			var d = b.success;
			return b.success = function (a, e, f) {
				c.add(a, b),
				d && d(a, e, f)
			},
			a.save(null, b),
			a
		},
		parse : function (a, b) {
			return a
		},
		chain : function () {
			return d(this.models).chain()
		},
		_reset : function (a) {
			this.length = 0,
			this.models = [],
			this._byId = {},
			this._byCid = {}

		},
		_prepareModel : function (a, b) {
			if (a instanceof c.Model)
				a.collection || (a.collection = this);
			else {
				var d = a;
				a = new this.model(d, {
						collection : this
					}),
				a.validate && !a._performValidation(d, b) && (a = !1)
			}
			return a
		},
		_add : function (a, b) {
			b || (b = {}),
			a = this._prepareModel(a, b);
			if (!a)
				return !1;
			var c = this.getByCid(a);
			if (c)
				throw new Error(["Can't add the same model to a set twice", c.id]);
			this._byId[a.id] = a,
			this._byCid[a.cid] = a;
			var d = b.at != null ? b.at : this.comparator ? this.sortedIndex(a, this.comparator) : this.length;
			return this.models.splice(d, 0, a),
			a.bind("all", this._onModelEvent),
			this.length++,
			b.silent || a.trigger("add", a, this, b),
			a
		},
		_remove : function (a, b) {
			return b || (b = {}),
			a = this.getByCid(a) || this.get(a),
			a ? (delete this._byId[a.id], delete this._byCid[a.cid], this.models.splice(this.indexOf(a), 1), this.length--, b.silent || a.trigger("remove", a, this, b), this._removeReference(a), a) : null
		},
		_removeReference : function (a) {
			this == a.collection && delete a.collection,
			a.unbind("all", this._onModelEvent)
		},
		_onModelEvent : function (a, b, c, d) {
			if ((a == "add" || a == "remove") && c != this)
				return;
			a == "destroy" && this._remove(b, d),
			b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], this._byId[b.id] = b),
			this.trigger.apply(this, arguments)
		}
	});
	var f = ["forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "rest", "last", "without", "indexOf", "lastIndexOf", "isEmpty", "groupBy"];
	d.each(f, function (a) {
		c.Collection.prototype[a] = function () {
			return d[a].apply(d, [this.models].concat(d.toArray(arguments)))
		}
	}),
	c.Router = function (a) {
		a || (a = {}),
		a.routes && (this.routes = a.routes),
		this._bindRoutes(),
		this.initialize.apply(this, arguments)
	};
	var g = /:([\w\d]+)/g,
	h = /\*([\w\d]+)/g,
	i = /[-[\]{}()+?.,\\^$|#\s]/g;
	d.extend(c.Router.prototype, c.Events, {
		initialize : function () {},
		route : function (a, b, e) {
			c.history || (c.history = new c.History),
			d.isRegExp(a) || (a = this._routeToRegExp(a)),
			c.history.route(a, d.bind(function (c) {
					var d = this._extractParameters(a, c);
					e.apply(this, d),
					this.trigger.apply(this, ["route:" + b].concat(d))
				}, this))
		},
		navigate : function (a, b) {
			c.history.navigate(a, b)
		},
		_bindRoutes : function () {
			if (!this.routes)
				return;
			var a = [];
			for (var b in this.routes)
				a.unshift([b, this.routes[b]]);
			for (var c = 0, d = a.length; c < d; c++)
				this.route(a[c][0], a[c][1], this[a[c][1]])
		},
		_routeToRegExp : function (a) {
			return a = a.replace(i, "\\$&").replace(g, "([^/]*)").replace(h, "(.*?)"),
			new RegExp("^" + a + "$")
		},
		_extractParameters : function (a, b) {
			return a.exec(b).slice(1)
		}
	}),
	c.History = function () {
		this.handlers = [],
		d.bindAll(this, "checkUrl")
	};
	var j = /^#*/,
	k = /msie [\w.]+/,
	l = !1;
	d.extend(c.History.prototype, {
		interval : 50,
		getFragment : function (a, b) {
			if (a == null)
				if (this._hasPushState || b) {
					a = window.location.pathname;
					var c = window.location.search;
					c && (a += c),
					a.indexOf(this.options.root) == 0 && (a = a.substr(this.options.root.length))
				} else
					a = window.location.hash;
			return decodeURIComponent(a.replace(j, ""))
		},
		start : function (a) {
			if (l)
				throw new Error("Backbone.history has already been started");
			this.options = d.extend({}, {
					root : "/"
				}, this.options, a),
			this._wantsPushState = !!this.options.pushState,
			this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
			var b = this.getFragment(),
			c = document.documentMode,
			f = k.exec(navigator.userAgent.toLowerCase()) && (!c || c <= 7);
			f && (this.iframe = e('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(b)),
			this._hasPushState ? e(window).bind("popstate", this.checkUrl) : "onhashchange" in window && !f ? e(window).bind("hashchange", this.checkUrl) : setInterval(this.checkUrl, this.interval),
			this.fragment = b,
			l = !0;
			var g = window.location,
			h = g.pathname == this.options.root;
			if (this._wantsPushState && !this._hasPushState && !h)
				return this.fragment = this.getFragment(null, !0), window.location.replace(this.options.root + "#" + this.fragment), !0;
			this._wantsPushState && this._hasPushState && h && g.hash && (this.fragment = g.hash.replace(j, ""), window.history.replaceState({}, document.title, g.protocol + "//" + g.host + this.options.root + this.fragment));
			if (!this.options.silent)
				return this.loadUrl()
		},
		route : function (a, b) {
			this.handlers.unshift({
				route : a,
				callback : b
			})
		},
		checkUrl : function (a) {
			var b = this.getFragment();
			b == this.fragment && this.iframe && (b = this.getFragment(this.iframe.location.hash));
			if (b == this.fragment || b == decodeURIComponent(this.fragment))
				return !1;
			this.iframe && this.navigate(b),
			this.loadUrl() || this.loadUrl(window.location.hash)
		},
		loadUrl : function (a) {
			var b = this.fragment = this.getFragment(a),
			c = d.any(this.handlers, function (a) {
					if (a.route.test(b))
						return a.callback(b), !0
				});
			return c
		},
		navigate : function (a, b) {
			var c = (a || "").replace(j, "");
			if (this.fragment == c || this.fragment == decodeURIComponent(c))
				return;
			if (this._hasPushState) {
				var d = window.location;
				c.indexOf(this.options.root) != 0 && (c = this.options.root + c),
				this.fragment = c,
				window.history.pushState({}, document.title, d.protocol + "//" + d.host + c)
			} else
				window.location.hash = this.fragment = c, this.iframe && c != this.getFragment(this.iframe.location.hash) && (this.iframe.document.open().close(), this.iframe.location.hash = c);
			b && this.loadUrl(a)
		}
	}),
	c.View = function (a) {
		this.cid = d.uniqueId("view"),
		this._configure(a || {}),
		this._ensureElement(),
		this.delegateEvents(),
		this.initialize.apply(this, arguments)
	};
	var m = function (a) {
		return e(a, this.el)
	},
	n = /^(\S+)\s*(.*)$/,
	o = ["model", "collection", "el", "id", "attributes", "className", "tagName"];
	d.extend(c.View.prototype, c.Events, {
		tagName : "div",
		$ : m,
		initialize : function () {},
		render : function () {
			return this
		},
		remove : function () {
			return e(this.el).remove(),
			this
		},
		make : function (a, b, c) {
			var d = document.createElement(a);
			return b && e(d).attr(b),
			c && e(d).html(c),
			d
		},
		delegateEvents : function (a) {
			if (!a && !(a = this.events))
				return;
			d.isFunction(a) && (a = a.call(this)),
			e(this.el).unbind(".delegateEvents" + this.cid);
			for (var b in a) {
				var c = this[a[b]];
				if (!c)
					throw new Error('Event "' + a[b] + '" does not exist');
				var f = b.match(n),
				g = f[1],
				h = f[2];
				c = d.bind(c, this),
				g += ".delegateEvents" + this.cid,
				h === "" ? e(this.el).bind(g, c) : e(this.el).delegate(h, g, c)
			}
		},
		_configure : function (a) {
			this.options && (a = d.extend({}, this.options, a));
			for (var b = 0, c = o.length; b < c; b++) {
				var e = o[b];
				a[e] && (this[e] = a[e])
			}
			this.options = a
		},
		_ensureElement : function () {
			if (!this.el) {
				var a = this.attributes || {};
				this.id && (a.id = this.id),
				this.className && (a["class"] = this.className),
				this.el = this.make(this.tagName, a)
			} else
				d.isString(this.el) && (this.el = e(this.el).get(0))
		}
	});
	var p = function (a, b) {
		var c = s(this, a, b);
		return c.extend = this.extend,
		c
	};
	c.Model.extend = c.Collection.extend = c.Router.extend = c.View.extend = p;
	var q = {
		create : "POST",
		update : "PUT",
		"delete" : "DELETE",
		read : "GET"
	};
	c.sync = function (a, b, f) {
		var g = q[a],
		h = d.extend({
				type : g,
				dataType : "json"
			}, f);
		return h.url || (h.url = t(b) || u()),
		!h.data && b && (a == "create" || a == "update") && (h.contentType = "application/json", h.data = JSON.stringify(b.toJSON())),
		c.emulateJSON && (h.contentType = "application/x-www-form-urlencoded", h.data = h.data ? {
				model : h.data
			}
			 : {}),
		c.emulateHTTP && (g === "PUT" || g === "DELETE") && (c.emulateJSON && (h.data._method = g), h.type = "POST", h.beforeSend = function (a) {
			a.setRequestHeader("X-HTTP-Method-Override", g)
		}),
		h.type !== "GET" && !c.emulateJSON && (h.processData = !1),
		e.ajax(h)
	};
	var r = function () {},
	s = function (a, b, c) {
		var e;
		return b && b.hasOwnProperty("constructor") ? e = b.constructor : e = function () {
			return a.apply(this, arguments)
		},
		d.extend(e, a),
		r.prototype = a.prototype,
		e.prototype = new r,
		b && d.extend(e.prototype, b),
		c && d.extend(e, c),
		e.prototype.constructor = e,
		e.__super__ = a.prototype,
		e
	},
	t = function (a) {
		return !a || !a.url ? null : d.isFunction(a.url) ? a.url() : a.url
	},
	u = function () {
		throw new Error('A "url" property or function must be specified')
	},
	v = function (a, b, c) {
		return function (d) {
			a ? a(b, d, c) : b.trigger("error", b, d, c)
		}
	},
	w = function (a) {
		return a.replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
	}
}
.call(this), function () {
	function a(a, b) {
		try {
			for (var c in b)
				Object.defineProperty(a.prototype, c, {
					value : b[c],
					enumerable : !1
				})
		} catch (d) {
			a.prototype = b
		}
	}
	function b(a) {
		var b = -1,
		c = a.length,
		d = [];
		while (++b < c)
			d.push(a[b]);
		return d
	}
	function c(a) {
		return Array.prototype.slice.call(a)
	}
	function d() {}

	function e(a) {
		return a
	}
	function f() {
		return this
	}
	function g() {
		return !0
	}
	function h(a) {
		return typeof a == "function" ? a : function () {
			return a
		}
	}
	function i(a, b, c) {
		return function () {
			var d = c.apply(b, arguments);
			return arguments.length ? a : d
		}
	}
	function j(a) {
		return a != null && !isNaN(a)
	}
	function k(a) {
		return a.length
	}
	function l(a) {
		return a == null
	}
	function m(a) {
		return a.trim().replace(/\s+/g, " ")
	}
	function n(a) {
		var b = 1;
		while (a * b % 1)
			b *= 10;
		return b
	}
	function o() {}

	function p(a) {
		function b() {
			var b = c,
			d = -1,
			e = b.length,
			f;
			while (++d < e)
				(f = b[d].on) && f.apply(this, arguments);
			return a
		}
		var c = [],
		e = new d;
		return b.on = function (b, d) {
			var f = e.get(b),
			g;
			return arguments.length < 2 ? f && f.on : (f && (f.on = null, c = c.slice(0, g = c.indexOf(f)).concat(c.slice(g + 1)), e.remove(b)), d && c.push(e.set(b, {
						on : d
					})), a)
		},
		b
	}
	function q(a, b) {
		return b - (a ? 1 + Math.floor(Math.log(a + Math.pow(10, 1 + Math.floor(Math.log(a) / Math.LN10) - b)) / Math.LN10) : 1)
	}
	function r(a) {
		return a + ""
	}
	function s(a) {
		var b = a.lastIndexOf("."),
		c = b >= 0 ? a.substring(b) : (b = a.length, ""),
		d = [];
		while (b > 0)
			d.push(a.substring(b -= 3, b + 3));
		return d.reverse().join(",") + c
	}
	function t(a, b) {
		var c = Math.pow(10, Math.abs(8 - b) * 3);
		return {
			scale : b > 8 ? function (a) {
				return a / c
			}
			 : function (a) {
				return a * c
			},
			symbol : a
		}
	}
	function u(a) {
		return function (b) {
			return b <= 0 ? 0 : b >= 1 ? 1 : a(b)
		}
	}
	function v(a) {
		return function (b) {
			return 1 - a(1 - b)
		}
	}
	function w(a) {
		return function (b) {
			return .5 * (b < .5 ? a(2 * b) : 2 - a(2 - 2 * b))
		}
	}
	function x(a) {
		return a
	}
	function y(a) {
		return function (b) {
			return Math.pow(b, a)
		}
	}
	function z(a) {
		return 1 - Math.cos(a * Math.PI / 2)
	}
	function A(a) {
		return Math.pow(2, 10 * (a - 1))
	}
	function B(a) {
		return 1 - Math.sqrt(1 - a * a)
	}
	function C(a, b) {
		var c;
		return arguments.length < 2 && (b = .45),
		arguments.length < 1 ? (a = 1, c = b / 4) : c = b / (2 * Math.PI) * Math.asin(1 / a),
		function (d) {
			return 1 + a * Math.pow(2, 10 * -d) * Math.sin((d - c) * 2 * Math.PI / b)
		}
	}
	function D(a) {
		return a || (a = 1.70158),
		function (b) {
			return b * b * ((a + 1) * b - a)
		}
	}
	function E(a) {
		return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
	}
	function F() {
		d3.event.stopPropagation(),
		d3.event.preventDefault()
	}
	function G() {
		var a = d3.event,
		b;
		while (b = a.sourceEvent)
			a = b;
		return a
	}
	function H(a) {
		var b = new o,
		c = 0,
		d = arguments.length;
		while (++c < d)
			b[arguments[c]] = p(b);
		return b.of = function (c, d) {
			return function (e) {
				try {
					var f = e.sourceEvent = d3.event;
					e.target = a,
					d3.event = e,
					b[e.type].apply(c, d)
				}
				finally {
					d3.event = f
				}
			}
		},
		b
	}
	function I(a) {
		var b = [a.a, a.b],
		c = [a.c, a.d],
		d = K(b),
		e = J(b, c),
		f = K(L(c, b, -e)) || 0;
		b[0] * c[1] < c[0] * b[1] && (b[0] *= -1, b[1] *= -1, d *= -1, e *= -1),
		this.rotate = (d ? Math.atan2(b[1], b[0]) : Math.atan2(-c[0], c[1])) * fj,
		this.translate = [a.e, a.f],
		this.scale = [d, f],
		this.skew = f ? Math.atan2(e, f) * fj : 0
	}
	function J(a, b) {
		return a[0] * b[0] + a[1] * b[1]
	}
	function K(a) {
		var b = Math.sqrt(J(a, a));
		return b && (a[0] /= b, a[1] /= b),
		b
	}
	function L(a, b, c) {
		return a[0] += c * b[0],
		a[1] += c * b[1],
		a
	}
	function M(a) {
		return a == "transform" ? d3.interpolateTransform : d3.interpolate
	}
	function N(a, b) {
		return b = b - (a = +a) ? 1 / (b - a) : 0,
		function (c) {
			return (c - a) * b
		}
	}
	function O(a, b) {
		return b = b - (a = +a) ? 1 / (b - a) : 0,
		function (c) {
			return Math.max(0, Math.min(1, (c - a) * b))
		}
	}
	function P(a, b, c) {
		return new Q(a, b, c)
	}
	function Q(a, b, c) {
		this.r = a,
		this.g = b,
		this.b = c
	}
	function R(a) {
		return a < 16 ? "0" + Math.max(0, a).toString(16) : Math.min(255, a).toString(16)
	}
	function S(a, b, c) {
		var d = 0,
		e = 0,
		f = 0,
		g,
		h,
		i;
		g = /([a-z]+)\((.*)\)/i.exec(a);
		if (g) {
			h = g[2].split(",");
			switch (g[1]) {
			case "hsl":
				return c(parseFloat(h[0]), parseFloat(h[1]) / 100, parseFloat(h[2]) / 100);
			case "rgb":
				return b(W(h[0]), W(h[1]), W(h[2]))
			}
		}
		return (i = fm.get(a)) ? b(i.r, i.g, i.b) : (a != null && a.charAt(0) === "#" && (a.length === 4 ? (d = a.charAt(1), d += d, e = a.charAt(2), e += e, f = a.charAt(3), f += f) : a.length === 7 && (d = a.substring(1, 3), e = a.substring(3, 5), f = a.substring(5, 7)), d = parseInt(d, 16), e = parseInt(e, 16), f = parseInt(f, 16)), b(d, e, f))
	}
	function T(a, b, c) {
		var d = Math.min(a /= 255, b /= 255, c /= 255),
		e = Math.max(a, b, c),
		f = e - d,
		g,
		h,
		i = (e + d) / 2;
		return f ? (h = i < .5 ? f / (e + d) : f / (2 - e - d), a == e ? g = (b - c) / f + (b < c ? 6 : 0) : b == e ? g = (c - a) / f + 2 : g = (a - b) / f + 4, g *= 60) : h = g = 0,
		X(g, h, i)
	}
	function U(a, b, c) {
		a = V(a),
		b = V(b),
		c = V(c);
		var d = bg((.4124564 * a + .3575761 * b + .1804375 * c) / fo),
		e = bg((.2126729 * a + .7151522 * b + .072175 * c) / fp),
		f = bg((.0193339 * a + .119192 * b + .9503041 * c) / fq);
		return bb(116 * e - 16, 500 * (d - e), 200 * (e - f))
	}
	function V(a) {
		return (a /= 255) <= .04045 ? a / 12.92 : Math.pow((a + .055) / 1.055, 2.4)
	}
	function W(a) {
		var b = parseFloat(a);
		return a.charAt(a.length - 1) === "%" ? Math.round(b * 2.55) : b
	}
	function X(a, b, c) {
		return new Y(a, b, c)
	}
	function Y(a, b, c) {
		this.h = a,
		this.s = b,
		this.l = c
	}
	function Z(a, b, c) {
		function d(a) {
			return a > 360 ? a -= 360 : a < 0 && (a += 360),
			a < 60 ? f + (g - f) * a / 60 : a < 180 ? g : a < 240 ? f + (g - f) * (240 - a) / 60 : f
		}
		function e(a) {
			return Math.round(d(a) * 255)
		}
		var f,
		g;
		return a %= 360,
		a < 0 && (a += 360),
		b = b < 0 ? 0 : b > 1 ? 1 : b,
		c = c < 0 ? 0 : c > 1 ? 1 : c,
		g = c <= .5 ? c * (1 + b) : c + b - c * b,
		f = 2 * c - g,
		P(e(a + 120), e(a), e(a - 120))
	}
	function $(a, b, c) {
		return new _(a, b, c)
	}
	function _(a, b, c) {
		this.h = a,
		this.c = b,
		this.l = c
	}
	function ba(a, b, c) {
		return bb(c, Math.cos(a *= Math.PI / 180) * b, Math.sin(a) * b)
	}
	function bb(a, b, c) {
		return new bc(a, b, c)
	}
	function bc(a, b, c) {
		this.l = a,
		this.a = b,
		this.b = c
	}
	function bd(a, b, c) {
		var d = (a + 16) / 116,
		e = d + b / 500,
		f = d - c / 200;
		return e = bf(e) * fo,
		d = bf(d) * fp,
		f = bf(f) * fq,
		P(bh(3.2404542 * e - 1.5371385 * d - .4985314 * f), bh(-0.969266 * e + 1.8760108 * d + .041556 * f), bh(.0556434 * e - .2040259 * d + 1.0572252 * f))
	}
	function be(a, b, c) {
		return $(Math.atan2(c, b) / Math.PI * 180, Math.sqrt(b * b + c * c), a)
	}
	function bf(a) {
		return a > .206893034 ? a * a * a : (a - 4 / 29) / 7.787037
	}
	function bg(a) {
		return a > .008856 ? Math.pow(a, 1 / 3) : 7.787037 * a + 4 / 29
	}
	function bh(a) {
		return Math.round(255 * (a <= .00304 ? 12.92 * a : 1.055 * Math.pow(a, 1 / 2.4) - .055))
	}
	function bi(a) {
		return eX(a, fw),
		a
	}
	function bj(a) {
		return function () {
			return fr(a, this)
		}
	}
	function bk(a) {
		return function () {
			return fs(a, this)
		}
	}
	function bl(a, b) {
		function c() {
			this.removeAttribute(a)
		}
		function d() {
			this.removeAttributeNS(a.space, a.local)
		}
		function e() {
			this.setAttribute(a, b)
		}
		function f() {
			this.setAttributeNS(a.space, a.local, b)
		}
		function g() {
			var c = b.apply(this, arguments);
			c == null ? this.removeAttribute(a) : this.setAttribute(a, c)
		}
		function h() {
			var c = b.apply(this, arguments);
			c == null ? this.removeAttributeNS(a.space, a.local) : this.setAttributeNS(a.space, a.local, c)
		}
		return a = d3.ns.qualify(a),
		b == null ? a.local ? d : c : typeof b == "function" ? a.local ? h : g : a.local ? f : e
	}
	function bm(a) {
		return new RegExp("(?:^|\\s+)" + d3.requote(a) + "(?:\\s+|$)", "g")
	}
	function bn(a, b) {
		function c() {
			var c = -1;
			while (++c < e)
				a[c](this, b)
		}
		function d() {
			var c = -1,
			d = b.apply(this, arguments);
			while (++c < e)
				a[c](this, d)
		}
		a = a.trim().split(/\s+/).map(bo);
		var e = a.length;
		return typeof b == "function" ? d : c
	}
	function bo(a) {
		var b = bm(a);
		return function (c, d) {
			if (e = c.classList)
				return d ? e.add(a) : e.remove(a);
			var e = c.className,
			f = e.baseVal != null,
			g = f ? e.baseVal : e;
			d ? (b.lastIndex = 0, b.test(g) || (g = m(g + " " + a), f ? e.baseVal = g : c.className = g)) : g && (g = m(g.replace(b, " ")), f ? e.baseVal = g : c.className = g)
		}
	}
	function bp(a, b, c) {
		function d() {
			this.style.removeProperty(a)
		}
		function e() {
			this.style.setProperty(a, b, c)
		}
		function f() {
			var d = b.apply(this, arguments);
			d == null ? this.style.removeProperty(a) : this.style.setProperty(a, d, c)
		}
		return b == null ? d : typeof b == "function" ? f : e
	}
	function bq(a, b) {
		function c() {
			delete this[a]
		}
		function d() {
			this[a] = b
		}
		function e() {
			var c = b.apply(this, arguments);
			c == null ? delete this[a] : this[a] = c
		}
		return b == null ? c : typeof b == "function" ? e : d
	}
	function br(a) {
		return {
			__data__ : a
		}
	}
	function bs(a) {
		return function () {
			return fv(this, a)
		}
	}
	function bt(a) {
		return arguments.length || (a = d3.ascending),
		function (b, c) {
			return a(b && b.__data__, c && c.__data__)
		}
	}
	function bu(a, b, c) {
		function d() {
			var b = this[f];
			b && (this.removeEventListener(a, b, b.$), delete this[f])
		}
		function e() {
			function e(a) {
				var c = d3.event;
				d3.event = a,
				h[0] = g.__data__;
				try {
					b.apply(g, h)
				}
				finally {
					d3.event = c
				}
			}
			var g = this,
			h = arguments;
			d.call(this),
			this.addEventListener(a, this[f] = e, e.$ = c),
			e._ = b
		}
		var f = "__on" + a,
		g = a.indexOf(".");
		return g > 0 && (a = a.substring(0, g)),
		b ? e : d
	}
	function bv(a, b) {
		for (var c = 0, d = a.length; c < d; c++)
			for (var e = a[c], f = 0, g = e.length, h; f < g; f++)
				(h = e[f]) && b(h, f, c);
		return a
	}
	function bw(a) {
		return eX(a, fy),
		a
	}
	function bx(a, b, c) {
		eX(a, fz);
		var e = new d,
		f = d3.dispatch("start", "end"),
		g = fH;
		return a.id = b,
		a.time = c,
		a.tween = function (b, c) {
			return arguments.length < 2 ? e.get(b) : (c == null ? e.remove(b) : e.set(b, c), a)
		},
		a.ease = function (b) {
			return arguments.length ? (g = typeof b == "function" ? b : d3.ease.apply(d3, arguments), a) : g
		},
		a.each = function (b, c) {
			return arguments.length < 2 ? by.call(a, b) : (f.on(b, c), a)
		},
		d3.timer(function (d) {
			return bv(a, function (a, h, i) {
				function j(d) {
					return p.active > b ? l() : (p.active = b, e.forEach(function (b, c) {
							(c = c.call(a, q, h)) && m.push(c)
						}), f.start.call(a, q, h), k(d) || d3.timer(k, 0, c), 1)
				}
				function k(c) {
					if (p.active !== b)
						return l();
					var d = (c - n) / o,
					e = g(d),
					i = m.length;
					while (i > 0)
						m[--i].call(a, e);
					if (d >= 1)
						return l(), fB = b, f.end.call(a, q, h), fB = 0, 1
				}
				function l() {
					return --p.count || delete a.__transition__,
					1
				}
				var m = [],
				n = a.delay,
				o = a.duration,
				p = (a = a.node).__transition__ || (a.__transition__ = {
						active : 0,
						count : 0
					}),
				q = a.__data__;
				++p.count,
				n <= d ? j(d) : d3.timer(j, n, c)
			})
		}, 0, c),
		a
	}
	function by(a) {
		var b = fB,
		c = fH,
		d = fF,
		e = fG;
		return fB = this.id,
		fH = this.ease(),
		bv(this, function (b, c, d) {
			fF = b.delay,
			fG = b.duration,
			a.call(b = b.node, b.__data__, c, d)
		}),
		fB = b,
		fH = c,
		fF = d,
		fG = e,
		this
	}
	function bz(a, b, c) {
		return c != "" && fI
	}
	function bA(a, b) {
		return d3.tween(a, M(b))
	}
	function bB() {
		var a,
		b = Date.now(),
		c = fJ;
		while (c)
			a = b - c.then, a >= c.delay && (c.flush = c.callback(a)), c = c.next;
		var d = bC() - b;
		d > 24 ? (isFinite(d) && (clearTimeout(fL), fL = setTimeout(bB, d)), fK = 0) : (fK = 1, fM(bB))
	}
	function bC() {
		var a = null,
		b = fJ,
		c = Infinity;
		while (b)
			b.flush ? b = a ? a.next = b.next : fJ = b.next : (c = Math.min(c, b.then + b.delay), b = (a = b).next);
		return c
	}
	function bD(a, b) {
		var c = a.ownerSVGElement || a;
		if (c.createSVGPoint) {
			var d = c.createSVGPoint();
			if (fN < 0 && (window.scrollX || window.scrollY)) {
				c = d3.select(document.body).append("svg").style("position", "absolute").style("top", 0).style("left", 0);
				var e = c[0][0].getScreenCTM();
				fN = !e.f && !e.e,
				c.remove()
			}
			return fN ? (d.x = b.pageX, d.y = b.pageY) : (d.x = b.clientX, d.y = b.clientY),
			d = d.matrixTransform(a.getScreenCTM().inverse()),
			[d.x, d.y]
		}
		var f = a.getBoundingClientRect();
		return [b.clientX - f.left - a.clientLeft, b.clientY - f.top - a.clientTop]
	}
	function bE() {}

	function bF(a) {
		var b = a[0],
		c = a[a.length - 1];
		return b < c ? [b, c] : [c, b]
	}
	function bG(a) {
		return a.rangeExtent ? a.rangeExtent() : bF(a.range())
	}
	function bH(a, b) {
		var c = 0,
		d = a.length - 1,
		e = a[c],
		f = a[d],
		g;
		f < e && (g = c, c = d, d = g, g = e, e = f, f = g);
		if (b = b(f - e))
			a[c] = b.floor(e), a[d] = b.ceil(f);
		return a
	}
	function bI() {
		return Math
	}
	function bJ(a, b, c, d) {
		function e() {
			var e = Math.min(a.length, b.length) > 2 ? bQ : bP,
			i = d ? O : N;
			return g = e(a, b, i, c),
			h = e(b, a, i, d3.interpolate),
			f
		}
		function f(a) {
			return g(a)
		}
		var g,
		h;
		return f.invert = function (a) {
			return h(a)
		},
		f.domain = function (b) {
			return arguments.length ? (a = b.map(Number), e()) : a
		},
		f.range = function (a) {
			return arguments.length ? (b = a, e()) : b
		},
		f.rangeRound = function (a) {
			return f.range(a).interpolate(d3.interpolateRound)
		},
		f.clamp = function (a) {
			return arguments.length ? (d = a, e()) : d
		},
		f.interpolate = function (a) {
			return arguments.length ? (c = a, e()) : c
		},
		f.ticks = function (b) {
			return bN(a, b)
		},
		f.tickFormat = function (b) {
			return bO(a, b)
		},
		f.nice = function () {
			return bH(a, bL),
			e()
		},
		f.copy = function () {
			return bJ(a, b, c, d)
		},
		e()
	}
	function bK(a, b) {
		return d3.rebind(a, b, "range", "rangeRound", "interpolate", "clamp")
	}
	function bL(a) {
		return a = Math.pow(10, Math.round(Math.log(a) / Math.LN10) - 1),
		a && {
			floor : function (b) {
				return Math.floor(b / a) * a
			},
			ceil : function (b) {
				return Math.ceil(b / a) * a
			}
		}
	}
	function bM(a, b) {
		var c = bF(a),
		d = c[1] - c[0],
		e = Math.pow(10, Math.floor(Math.log(d / b) / Math.LN10)),
		f = b / d * e;
		return f <= .15 ? e *= 10 : f <= .35 ? e *= 5 : f <= .75 && (e *= 2),
		c[0] = Math.ceil(c[0] / e) * e,
		c[1] = Math.floor(c[1] / e) * e + e * .5,
		c[2] = e,
		c
	}
	function bN(a, b) {
		return d3.range.apply(d3, bM(a, b))
	}
	function bO(a, b) {
		return d3.format(",." + Math.max(0, -Math.floor(Math.log(bM(a, b)[2]) / Math.LN10 + .01)) + "f")
	}
	function bP(a, b, c, d) {
		var e = c(a[0], a[1]),
		f = d(b[0], b[1]);
		return function (a) {
			return f(e(a))
		}
	}
	function bQ(a, b, c, d) {
		var e = [],
		f = [],
		g = 0,
		h = Math.min(a.length, b.length) - 1;
		a[h] < a[0] && (a = a.slice().reverse(), b = b.slice().reverse());
		while (++g <= h)
			e.push(c(a[g - 1], a[g])), f.push(d(b[g - 1], b[g]));
		return function (b) {
			var c = d3.bisect(a, b, 1, h) - 1;
			return f[c](e[c](b))
		}
	}
	function bR(a, b) {
		function c(c) {
			return a(b(c))
		}
		var d = b.pow;
		return c.invert = function (b) {
			return d(a.invert(b))
		},
		c.domain = function (e) {
			return arguments.length ? (b = e[0] < 0 ? bT : bS, d = b.pow, a.domain(e.map(b)), c) : a.domain().map(d)
		},
		c.nice = function () {
			return a.domain(bH(a.domain(), bI)),
			c
		},
		c.ticks = function () {
			var c = bF(a.domain()),
			e = [];
			if (c.every(isFinite)) {
				var f = Math.floor(c[0]),
				g = Math.ceil(c[1]),
				h = d(c[0]),
				i = d(c[1]);
				if (b === bT) {
					e.push(d(f));
					for (; f++ < g; )
						for (var j = 9; j > 0; j--)
							e.push(d(f) * j)
				} else {
					for (; f < g; f++)
						for (var j = 1; j < 10; j++)
							e.push(d(f) * j);
					e.push(d(f))
				}
				for (f = 0; e[f] < h; f++);
				for (g = e.length; e[g - 1] > i; g--);
				e = e.slice(f, g)
			}
			return e
		},
		c.tickFormat = function (a, e) {
			arguments.length < 2 && (e = fO);
			if (arguments.length < 1)
				return e;
			var f = Math.max(.1, a / c.ticks().length),
			g = b === bT ? (h = -1e-12, Math.floor) : (h = 1e-12, Math.ceil),
			h;
			return function (a) {
				return a / d(g(b(a) + h)) <= f ? e(a) : ""
			}
		},
		c.copy = function () {
			return bR(a.copy(), b)
		},
		bK(c, a)
	}
	function bS(a) {
		return Math.log(a < 0 ? 0 : a) / Math.LN10
	}
	function bT(a) {
		return -Math.log(a > 0 ? 0 : -a) / Math.LN10
	}
	function bU(a, b) {
		function c(b) {
			return a(d(b))
		}
		var d = bV(b),
		e = bV(1 / b);
		return c.invert = function (b) {
			return e(a.invert(b))
		},
		c.domain = function (b) {
			return arguments.length ? (a.domain(b.map(d)), c) : a.domain().map(e)
		},
		c.ticks = function (a) {
			return bN(c.domain(), a)
		},
		c.tickFormat = function (a) {
			return bO(c.domain(), a)
		},
		c.nice = function () {
			return c.domain(bH(c.domain(), bL))
		},
		c.exponent = function (a) {
			if (!arguments.length)
				return b;
			var f = c.domain();
			return d = bV(b = a),
			e = bV(1 / b),
			c.domain(f)
		},
		c.copy = function () {
			return bU(a.copy(), b)
		},
		bK(c, a)
	}
	function bV(a) {
		return function (b) {
			return b < 0 ? -Math.pow(-b, a) : Math.pow(b, a)
		}
	}
	function bW(a, b) {
		function c(b) {
			return g[((f.get(b) || f.set(b, a.push(b))) - 1) % g.length]
		}
		function e(b, c) {
			return d3.range(a.length).map(function (a) {
				return b + c * a
			})
		}
		var f,
		g,
		h;
		return c.domain = function (e) {
			if (!arguments.length)
				return a;
			a = [],
			f = new d;
			var g = -1,
			h = e.length,
			i;
			while (++g < h)
				f.has(i = e[g]) || f.set(i, a.push(i));
			return c[b.t].apply(c, b.a)
		},
		c.range = function (a) {
			return arguments.length ? (g = a, h = 0, b = {
					t : "range",
					a : arguments
				}, c) : g
		},
		c.rangePoints = function (d, f) {
			arguments.length < 2 && (f = 0);
			var i = d[0],
			j = d[1],
			k = (j - i) / (a.length - 1 + f);
			return g = e(a.length < 2 ? (i + j) / 2 : i + k * f / 2, k),
			h = 0,
			b = {
				t : "rangePoints",
				a : arguments
			},
			c
		},
		c.rangeBands = function (d, f, i) {
			arguments.length < 2 && (f = 0),
			arguments.length < 3 && (i = f);
			var j = d[1] < d[0],
			k = d[j - 0],
			l = d[1 - j],
			m = (l - k) / (a.length - f + 2 * i);
			return g = e(k + m * i, m),
			j && g.reverse(),
			h = m * (1 - f),
			b = {
				t : "rangeBands",
				a : arguments
			},
			c
		},
		c.rangeRoundBands = function (d, f, i) {
			arguments.length < 2 && (f = 0),
			arguments.length < 3 && (i = f);
			var j = d[1] < d[0],
			k = d[j - 0],
			l = d[1 - j],
			m = Math.floor((l - k) / (a.length - f + 2 * i)),
			n = l - k - (a.length - f) * m;
			return g = e(k + Math.round(n / 2), m),
			j && g.reverse(),
			h = Math.round(m * (1 - f)),
			b = {
				t : "rangeRoundBands",
				a : arguments
			},
			c
		},
		c.rangeBand = function () {
			return h
		},
		c.rangeExtent = function () {
			return bF(b.a[0])
		},
		c.copy = function () {
			return bW(a, b)
		},
		c.domain(a)
	}
	function bX(a, b) {
		function c() {
			var c = 0,
			f = a.length,
			g = b.length;
			e = [];
			while (++c < g)
				e[c - 1] = d3.quantile(a, c / g);
			return d
		}
		function d(a) {
			return isNaN(a = +a) ? NaN : b[d3.bisect(e, a)]
		}
		var e;
		return d.domain = function (b) {
			return arguments.length ? (a = b.filter(function (a) {
						return !isNaN(a)
					}).sort(d3.ascending), c()) : a
		},
		d.range = function (a) {
			return arguments.length ? (b = a, c()) : b
		},
		d.quantiles = function () {
			return e
		},
		d.copy = function () {
			return bX(a, b)
		},
		c()
	}
	function bY(a, b, c) {
		function d(b) {
			return c[Math.max(0, Math.min(g, Math.floor(f * (b - a))))]
		}
		function e() {
			return f = c.length / (b - a),
			g = c.length - 1,
			d
		}
		var f,
		g;
		return d.domain = function (c) {
			return arguments.length ? (a = +c[0], b = +c[c.length - 1], e()) : [a, b]
		},
		d.range = function (a) {
			return arguments.length ? (c = a, e()) : c
		},
		d.copy = function () {
			return bY(a, b, c)
		},
		e()
	}
	function bZ(a, b) {
		function c(c) {
			return b[d3.bisect(a, c)]
		}
		return c.domain = function (b) {
			return arguments.length ? (a = b, c) : a
		},
		c.range = function (a) {
			return arguments.length ? (b = a, c) : b
		},
		c.copy = function () {
			return bZ(a, b)
		},
		c
	}
	function b$(a) {
		function b(a) {
			return +a
		}
		return b.invert = b,
		b.domain = b.range = function (c) {
			return arguments.length ? (a = c.map(b), b) : a
		},
		b.ticks = function (b) {
			return bN(a, b)
		},
		b.tickFormat = function (b) {
			return bO(a, b)
		},
		b.copy = function () {
			return b$(a)
		},
		b
	}
	function b_(a) {
		return a.innerRadius
	}
	function ca(a) {
		return a.outerRadius
	}
	function cb(a) {
		return a.startAngle
	}
	function cc(a) {
		return a.endAngle
	}
	function cd(a) {
		function b(b) {
			function g() {
				i.push("M", f(a(k), j))
			}
			var i = [],
			k = [],
			l = -1,
			m = b.length,
			n,
			o = h(c),
			p = h(d);
			while (++l < m)
				e.call(this, n = b[l], l) ? k.push([+o.call(this, n, l), +p.call(this, n, l)]) : k.length && (g(), k = []);
			return k.length && g(),
			i.length ? i.join("") : null
		}
		var c = ce,
		d = cf,
		e = g,
		f = cg,
		i = f.key,
		j = .7;
		return b.x = function (a) {
			return arguments.length ? (c = a, b) : c
		},
		b.y = function (a) {
			return arguments.length ? (d = a, b) : d
		},
		b.defined = function (a) {
			return arguments.length ? (e = a, b) : e
		},
		b.interpolate = function (a) {
			return arguments.length ? (typeof a == "function" ? i = f = a : i = (f = fV.get(a) || cg).key, b) : i
		},
		b.tension = function (a) {
			return arguments.length ? (j = a, b) : j
		},
		b
	}
	function ce(a) {
		return a[0]
	}
	function cf(a) {
		return a[1]
	}
	function cg(a) {
		return a.join("L")
	}
	function ch(a) {
		return cg(a) + "Z"
	}
	function ci(a) {
		var b = 0,
		c = a.length,
		d = a[0],
		e = [d[0], ",", d[1]];
		while (++b < c)
			e.push("V", (d = a[b])[1], "H", d[0]);
		return e.join("")
	}
	function cj(a) {
		var b = 0,
		c = a.length,
		d = a[0],
		e = [d[0], ",", d[1]];
		while (++b < c)
			e.push("H", (d = a[b])[0], "V", d[1]);
		return e.join("")
	}
	function ck(a, b) {
		return a.length < 4 ? cg(a) : a[1] + cn(a.slice(1, a.length - 1), co(a, b))
	}
	function cl(a, b) {
		return a.length < 3 ? cg(a) : a[0] + cn((a.push(a[0]), a), co([a[a.length - 2]].concat(a, [a[1]]), b))
	}
	function cm(a, b, c) {
		return a.length < 3 ? cg(a) : a[0] + cn(a, co(a, b))
	}
	function cn(a, b) {
		if (b.length < 1 || a.length != b.length && a.length != b.length + 2)
			return cg(a);
		var c = a.length != b.length,
		d = "",
		e = a[0],
		f = a[1],
		g = b[0],
		h = g,
		i = 1;
		c && (d += "Q" + (f[0] - g[0] * 2 / 3) + "," + (f[1] - g[1] * 2 / 3) + "," + f[0] + "," + f[1], e = a[1], i = 2);
		if (b.length > 1) {
			h = b[1],
			f = a[i],
			i++,
			d += "C" + (e[0] + g[0]) + "," + (e[1] + g[1]) + "," + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1];
			for (var j = 2; j < b.length; j++, i++)
				f = a[i], h = b[j], d += "S" + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1]
		}
		if (c) {
			var k = a[i];
			d += "Q" + (f[0] + h[0] * 2 / 3) + "," + (f[1] + h[1] * 2 / 3) + "," + k[0] + "," + k[1]
		}
		return d
	}
	function co(a, b) {
		var c = [],
		d = (1 - b) / 2,
		e,
		f = a[0],
		g = a[1],
		h = 1,
		i = a.length;
		while (++h < i)
			e = f, f = g, g = a[h], c.push([d * (g[0] - e[0]), d * (g[1] - e[1])]);
		return c
	}
	function cp(a) {
		if (a.length < 3)
			return cg(a);
		var b = 1,
		c = a.length,
		d = a[0],
		e = d[0],
		f = d[1],
		g = [e, e, e, (d = a[1])[0]],
		h = [f, f, f, d[1]],
		i = [e, ",", f];
		cu(i, g, h);
		while (++b < c)
			d = a[b], g.shift(), g.push(d[0]), h.shift(), h.push(d[1]), cu(i, g, h);
		b = -1;
		while (++b < 2)
			g.shift(), g.push(d[0]), h.shift(), h.push(d[1]), cu(i, g, h);
		return i.join("")
	}
	function cq(a) {
		if (a.length < 4)
			return cg(a);
		var b = [],
		c = -1,
		d = a.length,
		e,
		f = [0],
		g = [0];
		while (++c < 3)
			e = a[c], f.push(e[0]), g.push(e[1]);
		b.push(ct(fY, f) + "," + ct(fY, g)),
		--c;
		while (++c < d)
			e = a[c], f.shift(), f.push(e[0]), g.shift(), g.push(e[1]), cu(b, f, g);
		return b.join("")
	}
	function cr(a) {
		var b,
		c = -1,
		d = a.length,
		e = d + 4,
		f,
		g = [],
		h = [];
		while (++c < 4)
			f = a[c % d], g.push(f[0]), h.push(f[1]);
		b = [ct(fY, g), ",", ct(fY, h)],
		--c;
		while (++c < e)
			f = a[c % d], g.shift(), g.push(f[0]), h.shift(), h.push(f[1]), cu(b, g, h);
		return b.join("")
	}
	function cs(a, b) {
		var c = a.length - 1;
		if (c) {
			var d = a[0][0],
			e = a[0][1],
			f = a[c][0] - d,
			g = a[c][1] - e,
			h = -1,
			i,
			j;
			while (++h <= c)
				i = a[h], j = h / c, i[0] = b * i[0] + (1 - b) * (d + j * f), i[1] = b * i[1] + (1 - b) * (e + j * g)
		}
		return cp(a)
	}
	function ct(a, b) {
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
	}
	function cu(a, b, c) {
		a.push("C", ct(fW, b), ",", ct(fW, c), ",", ct(fX, b), ",", ct(fX, c), ",", ct(fY, b), ",", ct(fY, c))
	}
	function cv(a, b) {
		return (b[1] - a[1]) / (b[0] - a[0])
	}
	function cw(a) {
		var b = 0,
		c = a.length - 1,
		d = [],
		e = a[0],
		f = a[1],
		g = d[0] = cv(e, f);
		while (++b < c)
			d[b] = (g + (g = cv(e = f, f = a[b + 1]))) / 2;
		return d[b] = g,
		d
	}
	function cx(a) {
		var b = [],
		c,
		d,
		e,
		f,
		g = cw(a),
		h = -1,
		i = a.length - 1;
		while (++h < i)
			c = cv(a[h], a[h + 1]), Math.abs(c) < 1e-6 ? g[h] = g[h + 1] = 0 : (d = g[h] / c, e = g[h + 1] / c, f = d * d + e * e, f > 9 && (f = c * 3 / Math.sqrt(f), g[h] = f * d, g[h + 1] = f * e));
		h = -1;
		while (++h <= i)
			f = (a[Math.min(i, h + 1)][0] - a[Math.max(0, h - 1)][0]) / (6 * (1 + g[h] * g[h])), b.push([f || 0, g[h] * f || 0]);
		return b
	}
	function cy(a) {
		return a.length < 3 ? cg(a) : a[0] + cn(a, cx(a))
	}
	function cz(a) {
		var b,
		c = -1,
		d = a.length,
		e,
		f;
		while (++c < d)
			b = a[c], e = b[0], f = b[1] + fT, b[0] = e * Math.cos(f), b[1] = e * Math.sin(f);
		return a
	}
	function cA(a) {
		function b(b) {
			function g() {
				k.push("M", j(a(p), n), m, l(a(o.reverse()), n), "Z")
			}
			var k = [],
			o = [],
			p = [],
			q = -1,
			r = b.length,
			s,
			t = h(c),
			u = h(e),
			v = c === d ? function () {
				return x
			}
			 : h(d),
			w = e === f ? function () {
				return y
			}
			 : h(f),
			x,
			y;
			while (++q < r)
				i.call(this, s = b[q], q) ? (o.push([x = +t.call(this, s, q), y = +u.call(this, s, q)]), p.push([+v.call(this, s, q), +w.call(this, s, q)])) : o.length && (g(), o = [], p = []);
			return o.length && g(),
			k.length ? k.join("") : null
		}
		var c = ce,
		d = ce,
		e = 0,
		f = cf,
		i = g,
		j = cg,
		k = j.key,
		l = j,
		m = "L",
		n = .7;
		return b.x = function (a) {
			return arguments.length ? (c = d = a, b) : d
		},
		b.x0 = function (a) {
			return arguments.length ? (c = a, b) : c
		},
		b.x1 = function (a) {
			return arguments.length ? (d = a, b) : d
		},
		b.y = function (a) {
			return arguments.length ? (e = f = a, b) : f
		},
		b.y0 = function (a) {
			return arguments.length ? (e = a, b) : e
		},
		b.y1 = function (a) {
			return arguments.length ? (f = a, b) : f
		},
		b.defined = function (a) {
			return arguments.length ? (i = a, b) : i
		},
		b.interpolate = function (a) {
			return arguments.length ? (typeof a == "function" ? k = j = a : k = (j = fV.get(a) || cg).key, l = j.reverse || j, m = j.closed ? "M" : "L", b) : k
		},
		b.tension = function (a) {
			return arguments.length ? (n = a, b) : n
		},
		b
	}
	function cB(a) {
		return a.source
	}
	function cC(a) {
		return a.target
	}
	function cD(a) {
		return a.radius
	}
	function cE(a) {
		return a.startAngle
	}
	function cF(a) {
		return a.endAngle
	}
	function cG(a) {
		return [a.x, a.y]
	}
	function cH(a) {
		return function () {
			var b = a.apply(this, arguments),
			c = b[0],
			d = b[1] + fT;
			return [c * Math.cos(d), c * Math.sin(d)]
		}
	}
	function cI() {
		return 64
	}
	function cJ() {
		return "circle"
	}
	function cK(a) {
		var b = Math.sqrt(a / Math.PI);
		return "M0," + b + "A" + b + "," + b + " 0 1,1 0," + -b + "A" + b + "," + b + " 0 1,1 0," + b + "Z"
	}
	function cL(a, b) {
		a.attr("transform", function (a) {
			return "translate(" + b(a) + ",0)"
		})
	}
	function cM(a, b) {
		a.attr("transform", function (a) {
			return "translate(0," + b(a) + ")"
		})
	}
	function cN(a, b, c) {
		e = [];
		if (c && b.length > 1) {
			var d = bF(a.domain()),
			e,
			f = -1,
			g = b.length,
			h = (b[1] - b[0]) / ++c,
			i,
			j;
			while (++f < g)
				for (i = c; --i > 0; )
					(j = +b[f] - i * h) >= d[0] && e.push(j);
			for (--f, i = 0; ++i < c && (j = +b[f] + i * h) < d[1]; )
				e.push(j)
		}
		return e
	}
	function cO() {
		gc || (gc = d3.select("body").append("div").style("visibility", "hidden").style("top", 0).style("height", 0).style("width", 0).style("overflow-y", "scroll").append("div").style("height", "2000px").node().parentNode);
		var a = d3.event,
		b;
		try {
			gc.scrollTop = 1e3,
			gc.dispatchEvent(a),
			b = 1e3 - gc.scrollTop
		} catch (c) {
			b = a.wheelDelta || -a.detail * 5
		}
		return b
	}
	function cP(a) {
		var b = a.source,
		c = a.target,
		d = cR(b, c),
		e = [b];
		while (b !== d)
			b = b.parent, e.push(b);
		var f = e.length;
		while (c !== d)
			e.splice(f, 0, c), c = c.parent;
		return e
	}
	function cQ(a) {
		var b = [],
		c = a.parent;
		while (c != null)
			b.push(a), a = c, c = c.parent;
		return b.push(a),
		b
	}
	function cR(a, b) {
		if (a === b)
			return a;
		var c = cQ(a),
		d = cQ(b),
		e = c.pop(),
		f = d.pop(),
		g = null;
		while (e === f)
			g = e, e = c.pop(), f = d.pop();
		return g
	}
	function cS(a) {
		a.fixed |= 2
	}
	function cT(a) {
		a !== gf && (a.fixed &= 1)
	}
	function cU() {
		gf.fixed &= 1,
		ge = gf = null
	}
	function cV() {
		gf.px = d3.event.x,
		gf.py = d3.event.y,
		ge.resume()
	}
	function cW(a, b, c) {
		var d = 0,
		e = 0;
		a.charge = 0;
		if (!a.leaf) {
			var f = a.nodes,
			g = f.length,
			h = -1,
			i;
			while (++h < g) {
				i = f[h];
				if (i == null)
					continue;
				cW(i, b, c),
				a.charge += i.charge,
				d += i.charge * i.cx,
				e += i.charge * i.cy
			}
		}
		if (a.point) {
			a.leaf || (a.point.x += Math.random() - .5, a.point.y += Math.random() - .5);
			var j = b * c[a.point.index];
			a.charge += a.pointCharge = j,
			d += j * a.point.x,
			e += j * a.point.y
		}
		a.cx = d / a.charge,
		a.cy = e / a.charge
	}
	function cX(a) {
		return 20
	}
	function cY(a) {
		return 1
	}
	function cZ(a) {
		return a.x
	}
	function c$(a) {
		return a.y
	}
	function c_(a, b, c) {
		a.y0 = b,
		a.y = c
	}
	function da(a) {
		return d3.range(a.length)
	}
	function db(a) {
		var b = -1,
		c = a[0].length,
		d = [];
		while (++b < c)
			d[b] = 0;
		return d
	}
	function dc(a) {
		var b = 1,
		c = 0,
		d = a[0][1],
		e,
		f = a.length;
		for (; b < f; ++b)
			(e = a[b][1]) > d && (c = b, d = e);
		return c
	}
	function dd(a) {
		return a.reduce(de, 0)
	}
	function de(a, b) {
		return a + b[1]
	}
	function df(a, b) {
		return dg(a, Math.ceil(Math.log(b.length) / Math.LN2 + 1))
	}
	function dg(a, b) {
		var c = -1,
		d = +a[0],
		e = (a[1] - d) / b,
		f = [];
		while (++c <= b)
			f[c] = e * c + d;
		return f
	}
	function dh(a) {
		return [d3.min(a), d3.max(a)]
	}
	function di(a, b) {
		return d3.rebind(a, b, "sort", "children", "value"),
		a.links = dm,
		a.nodes = function (b) {
			return gj = !0,
			(a.nodes = a)(b)
		},
		a
	}
	function dj(a) {
		return a.children
	}
	function dk(a) {
		return a.value
	}
	function dl(a, b) {
		return b.value - a.value
	}
	function dm(a) {
		return d3.merge(a.map(function (a) {
				return (a.children || []).map(function (b) {
					return {
						source : a,
						target : b
					}
				})
			}))
	}
	function dn(a, b) {
		return a.value - b.value
	}
	function dp(a, b) {
		var c = a._pack_next;
		a._pack_next = b,
		b._pack_prev = a,
		b._pack_next = c,
		c._pack_prev = b
	}
	function dq(a, b) {
		a._pack_next = b,
		b._pack_prev = a
	}
	function dr(a, b) {
		var c = b.x - a.x,
		d = b.y - a.y,
		e = a.r + b.r;
		return e * e - c * c - d * d > .001
	}
	function ds(a) {
		function b(a) {
			d = Math.min(a.x - a.r, d),
			e = Math.max(a.x + a.r, e),
			f = Math.min(a.y - a.r, f),
			g = Math.max(a.y + a.r, g)
		}
		if (!(c = a.children) || !(n = c.length))
			return;
		var c,
		d = Infinity,
		e = -Infinity,
		f = Infinity,
		g = -Infinity,
		h,
		i,
		j,
		k,
		l,
		m,
		n;
		c.forEach(dt),
		h = c[0],
		h.x = -h.r,
		h.y = 0,
		b(h);
		if (n > 1) {
			i = c[1],
			i.x = i.r,
			i.y = 0,
			b(i);
			if (n > 2) {
				j = c[2],
				dw(h, i, j),
				b(j),
				dp(h, j),
				h._pack_prev = j,
				dp(j, i),
				i = h._pack_next;
				for (k = 3; k < n; k++) {
					dw(h, i, j = c[k]);
					var o = 0,
					p = 1,
					q = 1;
					for (l = i._pack_next; l !== i; l = l._pack_next, p++)
						if (dr(l, j)) {
							o = 1;
							break
						}
					if (o == 1)
						for (m = h._pack_prev; m !== l._pack_prev; m = m._pack_prev, q++)
							if (dr(m, j))
								break;
					o ? (p < q || p == q && i.r < h.r ? dq(h, i = l) : dq(h = m, i), k--) : (dp(h, j), i = j, b(j))
				}
			}
		}
		var r = (d + e) / 2,
		s = (f + g) / 2,
		t = 0;
		for (k = 0; k < n; k++)
			j = c[k], j.x -= r, j.y -= s, t = Math.max(t, j.r + Math.sqrt(j.x * j.x + j.y * j.y));
		a.r = t,
		c.forEach(du)
	}
	function dt(a) {
		a._pack_next = a._pack_prev = a
	}
	function du(a) {
		delete a._pack_next,
		delete a._pack_prev
	}
	function dv(a, b, c, d) {
		var e = a.children;
		a.x = b += d * a.x,
		a.y = c += d * a.y,
		a.r *= d;
		if (e) {
			var f = -1,
			g = e.length;
			while (++f < g)
				dv(e[f], b, c, d)
		}
	}
	function dw(a, b, c) {
		var d = a.r + c.r,
		e = b.x - a.x,
		f = b.y - a.y;
		if (d && (e || f)) {
			var g = b.r + c.r,
			h = e * e + f * f;
			g *= g,
			d *= d;
			var i = .5 + (d - g) / (2 * h),
			j = Math.sqrt(Math.max(0, 2 * g * (d + h) - (d -= h) * d - g * g)) / (2 * h);
			c.x = a.x + i * e + j * f,
			c.y = a.y + i * f - j * e
		} else
			c.x = a.x + d, c.y = a.y
	}
	function dx(a) {
		return 1 + d3.max(a, function (a) {
			return a.y
		})
	}
	function dy(a) {
		return a.reduce(function (a, b) {
			return a + b.x
		}, 0) / a.length
	}
	function dz(a) {
		var b = a.children;
		return b && b.length ? dz(b[0]) : a
	}
	function dA(a) {
		var b = a.children,
		c;
		return b && (c = b.length) ? dA(b[c - 1]) : a
	}
	function dB(a, b) {
		return a.parent == b.parent ? 1 : 2
	}
	function dC(a) {
		var b = a.children;
		return b && b.length ? b[0] : a._tree.thread
	}
	function dD(a) {
		var b = a.children,
		c;
		return b && (c = b.length) ? b[c - 1] : a._tree.thread
	}
	function dE(a, b) {
		var c = a.children;
		if (c && (e = c.length)) {
			var d,
			e,
			f = -1;
			while (++f < e)
				b(d = dE(c[f], b), a) > 0 && (a = d)
		}
		return a
	}
	function dF(a, b) {
		return a.x - b.x
	}
	function dG(a, b) {
		return b.x - a.x
	}
	function dH(a, b) {
		return a.depth - b.depth
	}
	function dI(a, b) {
		function c(a, d) {
			var e = a.children;
			if (e && (i = e.length)) {
				var f,
				g = null,
				h = -1,
				i;
				while (++h < i)
					f = e[h], c(f, g), g = f
			}
			b(a, d)
		}
		c(a, null)
	}
	function dJ(a) {
		var b = 0,
		c = 0,
		d = a.children,
		e = d.length,
		f;
		while (--e >= 0)
			f = d[e]._tree, f.prelim += b, f.mod += b, b += f.shift + (c += f.change)
	}
	function dK(a, b, c) {
		a = a._tree,
		b = b._tree;
		var d = c / (b.number - a.number);
		a.change += d,
		b.change -= d,
		b.shift += c,
		b.prelim += c,
		b.mod += c
	}
	function dL(a, b, c) {
		return a._tree.ancestor.parent == b.parent ? a._tree.ancestor : c
	}
	function dM(a) {
		return {
			x : a.x,
			y : a.y,
			dx : a.dx,
			dy : a.dy
		}
	}
	function dN(a, b) {
		var c = a.x + b[3],
		d = a.y + b[0],
		e = a.dx - b[1] - b[3],
		f = a.dy - b[0] - b[2];
		return e < 0 && (c += e / 2, e = 0),
		f < 0 && (d += f / 2, f = 0), {
			x : c,
			y : d,
			dx : e,
			dy : f
		}
	}
	function dO(a, b) {
		function c(a, d) {
			d3.text(a, b, function (a) {
				d(a && c.parse(a))
			})
		}
		function d(b) {
			return b.map(e).join(a)
		}
		function e(a) {
			return g.test(a) ? '"' + a.replace(/\"/g, '""') + '"' : a
		}
		var f = new RegExp("\r\n|[" + a + "\r\n]", "g"),
		g = new RegExp('["' + a + "\n]"),
		h = a.charCodeAt(0);
		return c.parse = function (a) {
			var b;
			return c.parseRows(a, function (a, c) {
				if (c) {
					var d = {},
					e = -1,
					f = b.length;
					while (++e < f)
						d[b[e]] = a[e];
					return d
				}
				return b = a,
				null
			})
		},
		c.parseRows = function (a, b) {
			function c() {
				if (f.lastIndex >= a.length)
					return e;
				if (k)
					return k = !1, d;
				var b = f.lastIndex;
				if (a.charCodeAt(b) === 34) {
					var c = b;
					while (c++ < a.length)
						if (a.charCodeAt(c) === 34) {
							if (a.charCodeAt(c + 1) !== 34)
								break;
							c++
						}
					f.lastIndex = c + 2;
					var g = a.charCodeAt(c + 1);
					return g === 13 ? (k = !0, a.charCodeAt(c + 2) === 10 && f.lastIndex++) : g === 10 && (k = !0),
					a.substring(b + 1, c).replace(/""/g, '"')
				}
				var i = f.exec(a);
				return i ? (k = i[0].charCodeAt(0) !== h, a.substring(b, i.index)) : (f.lastIndex = a.length, a.substring(b))
			}
			var d = {},
			e = {},
			g = [],
			i = 0,
			j,
			k;
			f.lastIndex = 0;
			while ((j = c()) !== e) {
				var l = [];
				while (j !== d && j !== e)
					l.push(j), j = c();
				if (b && !(l = b(l, i++)))
					continue;
				g.push(l)
			}
			return g
		},
		c.format = function (a) {
			return a.map(d).join("\n")
		},
		c
	}
	function dP(a, b) {
		return function (c) {
			return c && a.hasOwnProperty(c.type) ? a[c.type](c) : b
		}
	}
	function dQ(a) {
		return "m0," + a + "a" + a + "," + a + " 0 1,1 0," + -2 * a + "a" + a + "," + a + " 0 1,1 0," + 2 * a + "z"
	}
	function dR(a, b) {
		gl.hasOwnProperty(a.type) && gl[a.type](a, b)
	}
	function dS(a, b) {
		dR(a.geometry, b)
	}
	function dT(a, b) {
		for (var c = a.features, d = 0, e = c.length; d < e; d++)
			dR(c[d].geometry, b)
	}
	function dU(a, b) {
		for (var c = a.geometries, d = 0, e = c.length; d < e; d++)
			dR(c[d], b)
	}
	function dV(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			b.apply(null, c[d])
	}
	function dW(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			for (var f = c[d], g = 0, h = f.length; g < h; g++)
				b.apply(null, f[g])
	}
	function dX(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			for (var f = c[d][0], g = 0, h = f.length; g < h; g++)
				b.apply(null, f[g])
	}
	function dY(a, b) {
		b.apply(null, a.coordinates)
	}
	function dZ(a, b) {
		for (var c = a.coordinates[0], d = 0, e = c.length; d < e; d++)
			b.apply(null, c[d])
	}
	function d$(a) {
		return a.source
	}
	function d_(a) {
		return a.target
	}
	function ea() {
		function a(a) {
			var b = Math.sin(a *= n) * o,
			c = Math.sin(n - a) * o,
			d = c * f + b * l,
			h = c * g + b * m,
			i = c * e + b * k;
			return [Math.atan2(h, d) / gk, Math.atan2(i, Math.sqrt(d * d + h * h)) / gk]
		}
		var b,
		c,
		d,
		e,
		f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o;
		return a.distance = function () {
			return n == null && (o = 1 / Math.sin(n = Math.acos(Math.max(-1, Math.min(1, e * k + d * j * Math.cos(h - b)))))),
			n
		},
		a.source = function (h) {
			var i = Math.cos(b = h[0] * gk),
			j = Math.sin(b);
			return d = Math.cos(c = h[1] * gk),
			e = Math.sin(c),
			f = d * i,
			g = d * j,
			n = null,
			a
		},
		a.target = function (b) {
			var c = Math.cos(h = b[0] * gk),
			d = Math.sin(h);
			return j = Math.cos(i = b[1] * gk),
			k = Math.sin(i),
			l = j * c,
			m = j * d,
			n = null,
			a
		},
		a
	}
	function eb(a, b) {
		var c = ea().source(a).target(b);
		return c.distance(),
		c
	}
	function ec(a) {
		var b = 0,
		c = 0;
		for (; ; ) {
			if (a(b, c))
				return [b, c];
			b === 0 ? (b = c + 1, c = 0) : (b -= 1, c += 1)
		}
	}
	function ed(a, b, c, d) {
		var e,
		f,
		g,
		h,
		i,
		j,
		k;
		return e = d[a],
		f = e[0],
		g = e[1],
		e = d[b],
		h = e[0],
		i = e[1],
		e = d[c],
		j = e[0],
		k = e[1],
		(k - g) * (h - f) - (i - g) * (j - f) > 0
	}
	function ee(a, b, c) {
		return (c[0] - b[0]) * (a[1] - b[1]) < (c[1] - b[1]) * (a[0] - b[0])
	}
	function ef(a, b, c, d) {
		var e = a[0],
		f = b[0],
		g = c[0],
		h = d[0],
		i = a[1],
		j = b[1],
		k = c[1],
		l = d[1],
		m = e - g,
		n = f - e,
		o = h - g,
		p = i - k,
		q = j - i,
		r = l - k,
		s = (o * p - r * m) / (r * n - o * q);
		return [e + s * n, i + s * q]
	}
	function eg(a, b) {
		var c = {
			list : a.map(function (a, b) {
				return {
					index : b,
					x : a[0],
					y : a[1]
				}
			}).sort(function (a, b) {
				return a.y < b.y ? -1 : a.y > b.y ? 1 : a.x < b.x ? -1 : a.x > b.x ? 1 : 0
			}),
			bottomSite : null
		},
		d = {
			list : [],
			leftEnd : null,
			rightEnd : null,
			init : function () {
				d.leftEnd = d.createHalfEdge(null, "l"),
				d.rightEnd = d.createHalfEdge(null, "l"),
				d.leftEnd.r = d.rightEnd,
				d.rightEnd.l = d.leftEnd,
				d.list.unshift(d.leftEnd, d.rightEnd)
			},
			createHalfEdge : function (a, b) {
				return {
					edge : a,
					side : b,
					vertex : null,
					l : null,
					r : null
				}
			},
			insert : function (a, b) {
				b.l = a,
				b.r = a.r,
				a.r.l = b,
				a.r = b
			},
			leftBound : function (a) {
				var b = d.leftEnd;
				do
					b = b.r;
				while (b != d.rightEnd && e.rightOf(b, a));
				return b = b.l,
				b
			},
			del : function (a) {
				a.l.r = a.r,
				a.r.l = a.l,
				a.edge = null
			},
			right : function (a) {
				return a.r
			},
			left : function (a) {
				return a.l
			},
			leftRegion : function (a) {
				return a.edge == null ? c.bottomSite : a.edge.region[a.side]
			},
			rightRegion : function (a) {
				return a.edge == null ? c.bottomSite : a.edge.region[go[a.side]]
			}
		},
		e = {
			bisect : function (a, b) {
				var c = {
					region : {
						l : a,
						r : b
					},
					ep : {
						l : null,
						r : null
					}
				},
				d = b.x - a.x,
				e = b.y - a.y,
				f = d > 0 ? d : -d,
				g = e > 0 ? e : -e;
				return c.c = a.x * d + a.y * e + (d * d + e * e) * .5,
				f > g ? (c.a = 1, c.b = e / d, c.c /= d) : (c.b = 1, c.a = d / e, c.c /= e),
				c
			},
			intersect : function (a, b) {
				var c = a.edge,
				d = b.edge;
				if (!c || !d || c.region.r == d.region.r)
					return null;
				var e = c.a * d.b - c.b * d.a;
				if (Math.abs(e) < 1e-10)
					return null;
				var f = (c.c * d.b - d.c * c.b) / e,
				g = (d.c * c.a - c.c * d.a) / e,
				h = c.region.r,
				i = d.region.r,
				j,
				k;
				h.y < i.y || h.y == i.y && h.x < i.x ? (j = a, k = c) : (j = b, k = d);
				var l = f >= k.region.r.x;
				return l && j.side === "l" || !l && j.side === "r" ? null : {
					x : f,
					y : g
				}
			},
			rightOf : function (a, b) {
				var c = a.edge,
				d = c.region.r,
				e = b.x > d.x;
				if (e && a.side === "l")
					return 1;
				if (!e && a.side === "r")
					return 0;
				if (c.a === 1) {
					var f = b.y - d.y,
					g = b.x - d.x,
					h = 0,
					i = 0;
					!e && c.b < 0 || e && c.b >= 0 ? i = h = f >= c.b * g : (i = b.x + b.y * c.b > c.c, c.b < 0 && (i = !i), i || (h = 1));
					if (!h) {
						var j = d.x - c.region.l.x;
						i = c.b * (g * g - f * f) < j * f * (1 + 2 * g / j + c.b * c.b),
						c.b < 0 && (i = !i)
					}
				} else {
					var k = c.c - c.a * b.x,
					l = b.y - k,
					m = b.x - d.x,
					n = k - d.y;
					i = l * l > m * m + n * n
				}
				return a.side === "l" ? i : !i
			},
			endPoint : function (a, c, d) {
				a.ep[c] = d;
				if (!a.ep[go[c]])
					return;
				b(a)
			},
			distance : function (a, b) {
				var c = a.x - b.x,
				d = a.y - b.y;
				return Math.sqrt(c * c + d * d)
			}
		},
		f = {
			list : [],
			insert : function (a, b, c) {
				a.vertex = b,
				a.ystar = b.y + c;
				for (var d = 0, e = f.list, g = e.length; d < g; d++) {
					var h = e[d];
					if (a.ystar > h.ystar || a.ystar == h.ystar && b.x > h.vertex.x)
						continue;
					break
				}
				e.splice(d, 0, a)
			},
			del : function (a) {
				for (var b = 0, c = f.list, d = c.length; b < d && c[b] != a; ++b);
				c.splice(b, 1)
			},
			empty : function () {
				return f.list.length === 0
			},
			nextEvent : function (a) {
				for (var b = 0, c = f.list, d = c.length; b < d; ++b)
					if (c[b] == a)
						return c[b + 1];
				return null
			},
			min : function () {
				var a = f.list[0];
				return {
					x : a.vertex.x,
					y : a.ystar
				}
			},
			extractMin : function () {
				return f.list.shift()
			}
		};
		d.init(),
		c.bottomSite = c.list.shift();
		var g = c.list.shift(),
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		t;
		for (; ; ) {
			f.empty() || (h = f.min());
			if (g && (f.empty() || g.y < h.y || g.y == h.y && g.x < h.x))
				i = d.leftBound(g), j = d.right(i), n = d.rightRegion(i), s = e.bisect(n, g), m = d.createHalfEdge(s, "l"), d.insert(i, m), q = e.intersect(i, m), q && (f.del(i), f.insert(i, q, e.distance(q, g))), i = m, m = d.createHalfEdge(s, "r"), d.insert(i, m), q = e.intersect(m, j), q && f.insert(m, q, e.distance(q, g)), g = c.list.shift();
			else {
				if (!!f.empty())
					break;
				i = f.extractMin(),
				k = d.left(i),
				j = d.right(i),
				l = d.right(j),
				n = d.leftRegion(i),
				o = d.rightRegion(j),
				r = i.vertex,
				e.endPoint(i.edge, i.side, r),
				e.endPoint(j.edge, j.side, r),
				d.del(i),
				f.del(j),
				d.del(j),
				t = "l",
				n.y > o.y && (p = n, n = o, o = p, t = "r"),
				s = e.bisect(n, o),
				m = d.createHalfEdge(s, t),
				d.insert(k, m),
				e.endPoint(s, go[t], r),
				q = e.intersect(k, m),
				q && (f.del(k), f.insert(k, q, e.distance(q, n))),
				q = e.intersect(m, l),
				q && f.insert(m, q, e.distance(q, n))
			}
		}
		for (i = d.right(d.leftEnd); i != d.rightEnd; i = d.right(i))
			b(i.edge)
	}
	function eh() {
		return {
			leaf : !0,
			nodes : [],
			point : null
		}
	}
	function ei(a, b, c, d, e, f) {
		if (!a(b, c, d, e, f)) {
			var g = (c + e) * .5,
			h = (d + f) * .5,
			i = b.nodes;
			i[0] && ei(a, i[0], c, d, g, h),
			i[1] && ei(a, i[1], g, d, e, h),
			i[2] && ei(a, i[2], c, h, g, f),
			i[3] && ei(a, i[3], g, h, e, f)
		}
	}
	function ej(a) {
		return {
			x : a[0],
			y : a[1]
		}
	}
	function ek() {
		this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
	}
	function el(a) {
		return a.substring(0, 3)
	}
	function em(a, b, c, d) {
		var e,
		f,
		g = 0,
		h = b.length,
		i = c.length;
		while (g < h) {
			if (d >= i)
				return -1;
			e = b.charCodeAt(g++);
			if (e == 37) {
				f = gK[b.charAt(g++)];
				if (!f || (d = f(a, c, d)) < 0)
					return -1
			} else if (e != c.charCodeAt(d++))
				return -1
		}
		return d
	}
	function en(a) {
		return new RegExp("^(?:" + a.map(d3.requote).join("|") + ")", "i")
	}
	function eo(a) {
		var b = new d,
		c = -1,
		e = a.length;
		while (++c < e)
			b.set(a[c].toLowerCase(), c);
		return b
	}
	function ep(a, b, c) {
		gE.lastIndex = 0;
		var d = gE.exec(b.substring(c));
		return d ? c += d[0].length : -1
	}
	function eq(a, b, c) {
		gD.lastIndex = 0;
		var d = gD.exec(b.substring(c));
		return d ? c += d[0].length : -1
	}
	function er(a, b, c) {
		gH.lastIndex = 0;
		var d = gH.exec(b.substring(c));
		return d ? (a.m = gI.get(d[0].toLowerCase()), c += d[0].length) : -1
	}
	function es(a, b, c) {
		gF.lastIndex = 0;
		var d = gF.exec(b.substring(c));
		return d ? (a.m = gG.get(d[0].toLowerCase()), c += d[0].length) : -1
	}
	function et(a, b, c) {
		return em(a, gJ.c.toString(), b, c)
	}
	function eu(a, b, c) {
		return em(a, gJ.x.toString(), b, c)
	}
	function ev(a, b, c) {
		return em(a, gJ.X.toString(), b, c)
	}
	function ew(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 4));
		return d ? (a.y = +d[0], c += d[0].length) : -1
	}
	function ex(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.y = ey(+d[0]), c += d[0].length) : -1
	}
	function ey(a) {
		return a + (a > 68 ? 1900 : 2e3)
	}
	function ez(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.m = d[0] - 1, c += d[0].length) : -1
	}
	function eA(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.d = +d[0], c += d[0].length) : -1
	}
	function eB(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.H = +d[0], c += d[0].length) : -1
	}
	function eC(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.M = +d[0], c += d[0].length) : -1
	}
	function eD(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 2));
		return d ? (a.S = +d[0], c += d[0].length) : -1
	}
	function eE(a, b, c) {
		gL.lastIndex = 0;
		var d = gL.exec(b.substring(c, c + 3));
		return d ? (a.L = +d[0], c += d[0].length) : -1
	}
	function eF(a, b, c) {
		var d = gM.get(b.substring(c, c += 2).toLowerCase());
		return d == null ? -1 : (a.p = d, c)
	}
	function eG(a) {
		var b = a.getTimezoneOffset(),
		c = b > 0 ? "-" : "+",
		d = ~~(Math.abs(b) / 60),
		e = Math.abs(b) % 60;
		return c + gz(d) + gz(e)
	}
	function eH(a) {
		return a.toISOString()
	}
	function eI(a, b, c) {
		function d(b) {
			var c = a(b),
			d = f(c, 1);
			return b - c < d - b ? c : d
		}
		function e(c) {
			return b(c = a(new gp(c - 1)), 1),
			c
		}
		function f(a, c) {
			return b(a = new gp(+a), c),
			a
		}
		function g(a, d, f) {
			var g = e(a),
			h = [];
			if (f > 1)
				while (g < d)
					c(g) % f || h.push(new Date(+g)), b(g, 1);
			else
				while (g < d)
					h.push(new Date(+g)), b(g, 1);
			return h
		}
		function h(a, b, c) {
			try {
				gp = ek;
				var d = new ek;
				return d._ = a,
				g(d, b, c)
			}
			finally {
				gp = Date
			}
		}
		a.floor = a,
		a.round = d,
		a.ceil = e,
		a.offset = f,
		a.range = g;
		var i = a.utc = eJ(a);
		return i.floor = i,
		i.round = eJ(d),
		i.ceil = eJ(e),
		i.offset = eJ(f),
		i.range = h,
		a
	}
	function eJ(a) {
		return function (b, c) {
			try {
				gp = ek;
				var d = new ek;
				return d._ = b,
				a(d, c)._
			}
			finally {
				gp = Date
			}
		}
	}
	function eK(a, b, c) {
		function d(b) {
			return a(b)
		}
		return d.invert = function (b) {
			return eM(a.invert(b))
		},
		d.domain = function (b) {
			return arguments.length ? (a.domain(b), d) : a.domain().map(eM)
		},
		d.nice = function (a) {
			return d.domain(bH(d.domain(), function () {
					return a
				}))
		},
		d.ticks = function (c, e) {
			var f = eL(d.domain());
			if (typeof c != "function") {
				var g = f[1] - f[0],
				h = g / c,
				i = d3.bisect(gO, h);
				if (i == gO.length)
					return b.year(f, c);
				if (!i)
					return a.ticks(c).map(eM);
				Math.log(h / gO[i - 1]) < Math.log(gO[i] / h) && --i,
				c = b[i],
				e = c[1],
				c = c[0].range
			}
			return c(f[0], new Date(+f[1] + 1), e)
		},
		d.tickFormat = function () {
			return c
		},
		d.copy = function () {
			return eK(a.copy(), b, c)
		},
		d3.rebind(d, a, "range", "rangeRound", "interpolate", "clamp")
	}
	function eL(a) {
		var b = a[0],
		c = a[a.length - 1];
		return b < c ? [b, c] : [c, b]
	}
	function eM(a) {
		return new Date(a)
	}
	function eN(a) {
		return function (b) {
			var c = a.length - 1,
			d = a[c];
			while (!d[1](b))
				d = a[--c];
			return d[0](b)
		}
	}
	function eO(a) {
		var b = new Date(a, 0, 1);
		return b.setFullYear(a),
		b
	}
	function eP(a) {
		var b = a.getFullYear(),
		c = eO(b),
		d = eO(b + 1);
		return b + (a - c) / (d - c)
	}
	function eQ(a) {
		var b = new Date(Date.UTC(a, 0, 1));
		return b.setUTCFullYear(a),
		b
	}
	function eR(a) {
		var b = a.getUTCFullYear(),
		c = eQ(b),
		d = eQ(b + 1);
		return b + (a - c) / (d - c)
	}
	Date.now || (Date.now = function () {
		return  + (new Date)
	});
	try {
		document.createElement("div").style.setProperty("opacity", 0, "")
	} catch (eS) {
		var eT = CSSStyleDeclaration.prototype,
		eU = eT.setProperty;
		eT.setProperty = function (a, b, c) {
			eU.call(this, a, b + "", c)
		}
	}
	d3 = {
		version : "2.10.0"
	};
	var eV = c;
	try {
		eV(document.documentElement.childNodes)[0].nodeType
	} catch (eW) {
		eV = b
	}
	var eX = [].__proto__ ? function (a, b) {
		a.__proto__ = b
	}
	 : function (a, b) {
		for (var c in b)
			a[c] = b[c]
	};
	d3.map = function (a) {
		var b = new d;
		for (var c in a)
			b.set(c, a[c]);
		return b
	},
	a(d, {
		has : function (a) {
			return eY + a in this
		},
		get : function (a) {
			return this[eY + a]
		},
		set : function (a, b) {
			return this[eY + a] = b
		},
		remove : function (a) {
			return a = eY + a,
			a in this && delete this[a]
		},
		keys : function () {
			var a = [];
			return this.forEach(function (b) {
				a.push(b)
			}),
			a
		},
		values : function () {
			var a = [];
			return this.forEach(function (b, c) {
				a.push(c)
			}),
			a
		},
		entries : function () {
			var a = [];
			return this.forEach(function (b, c) {
				a.push({
					key : b,
					value : c
				})
			}),
			a
		},
		forEach : function (a) {
			for (var b in this)
				b.charCodeAt(0) === eZ && a.call(this, b.substring(1), this[b])
		}
	});
	var eY = "\0",
	eZ = eY.charCodeAt(0);
	d3.functor = h,
	d3.rebind = function (a, b) {
		var c = 1,
		d = arguments.length,
		e;
		while (++c < d)
			a[e = arguments[c]] = i(a, b, b[e]);
		return a
	},
	d3.ascending = function (a, b) {
		return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
	},
	d3.descending = function (a, b) {
		return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	},
	d3.mean = function (a, b) {
		var c = a.length,
		d,
		e = 0,
		f = -1,
		g = 0;
		if (arguments.length === 1)
			while (++f < c)
				j(d = a[f]) && (e += (d - e) / ++g);
		else
			while (++f < c)
				j(d = b.call(a, a[f], f)) && (e += (d - e) / ++g);
		return g ? e : undefined
	},
	d3.median = function (a, b) {
		return arguments.length > 1 && (a = a.map(b)),
		a = a.filter(j),
		a.length ? d3.quantile(a.sort(d3.ascending), .5) : undefined
	},
	d3.min = function (a, b) {
		var c = -1,
		d = a.length,
		e,
		f;
		if (arguments.length === 1) {
			while (++c < d && ((e = a[c]) == null || e != e))
				e = undefined;
			while (++c < d)
				(f = a[c]) != null && e > f && (e = f)
		} else {
			while (++c < d && ((e = b.call(a, a[c], c)) == null || e != e))
				e = undefined;
			while (++c < d)
				(f = b.call(a, a[c], c)) != null && e > f && (e = f)
		}
		return e
	},
	d3.max = function (a, b) {
		var c = -1,
		d = a.length,
		e,
		f;
		if (arguments.length === 1) {
			while (++c < d && ((e = a[c]) == null || e != e))
				e = undefined;
			while (++c < d)
				(f = a[c]) != null && f > e && (e = f)
		} else {
			while (++c < d && ((e = b.call(a, a[c], c)) == null || e != e))
				e = undefined;
			while (++c < d)
				(f = b.call(a, a[c], c)) != null && f > e && (e = f)
		}
		return e
	},
	d3.extent = function (a, b) {
		var c = -1,
		d = a.length,
		e,
		f,
		g;
		if (arguments.length === 1) {
			while (++c < d && ((e = g = a[c]) == null || e != e))
				e = g = undefined;
			while (++c < d)
				(f = a[c]) != null && (e > f && (e = f), g < f && (g = f))
		} else {
			while (++c < d && ((e = g = b.call(a, a[c], c)) == null || e != e))
				e = undefined;
			while (++c < d)
				(f = b.call(a, a[c], c)) != null && (e > f && (e = f), g < f && (g = f))
		}
		return [e, g]
	},
	d3.random = {
		normal : function (a, b) {
			var c = arguments.length;
			return c < 2 && (b = 1),
			c < 1 && (a = 0),
			function () {
				var c,
				d,
				e;
				do
					c = Math.random() * 2 - 1, d = Math.random() * 2 - 1, e = c * c + d * d;
				while (!e || e > 1);
				return a + b * c * Math.sqrt(-2 * Math.log(e) / e)
			}
		},
		logNormal : function (a, b) {
			var c = arguments.length;
			c < 2 && (b = 1),
			c < 1 && (a = 0);
			var d = d3.random.normal();
			return function () {
				return Math.exp(a + b * d())
			}
		},
		irwinHall : function (a) {
			return function () {
				for (var b = 0, c = 0; c < a; c++)
					b += Math.random();
				return b / a
			}
		}
	},
	d3.sum = function (a, b) {
		var c = 0,
		d = a.length,
		e,
		f = -1;
		if (arguments.length === 1)
			while (++f < d)
				isNaN(e = +a[f]) || (c += e);
		else
			while (++f < d)
				isNaN(e = +b.call(a, a[f], f)) || (c += e);
		return c
	},
	d3.quantile = function (a, b) {
		var c = (a.length - 1) * b + 1,
		d = Math.floor(c),
		e = a[d - 1],
		f = c - d;
		return f ? e + f * (a[d] - e) : e
	},
	d3.transpose = function (a) {
		return d3.zip.apply(d3, a)
	},
	d3.zip = function () {
		if (!(e = arguments.length))
			return [];
		for (var a = -1, b = d3.min(arguments, k), c = new Array(b); ++a < b; )
			for (var d = -1, e, f = c[a] = new Array(e); ++d < e; )
				f[d] = arguments[d][a];
		return c
	},
	d3.bisector = function (a) {
		return {
			left : function (b, c, d, e) {
				arguments.length < 3 && (d = 0),
				arguments.length < 4 && (e = b.length);
				while (d < e) {
					var f = d + e >>> 1;
					a.call(b, b[f], f) < c ? d = f + 1 : e = f
				}
				return d
			},
			right : function (b, c, d, e) {
				arguments.length < 3 && (d = 0),
				arguments.length < 4 && (e = b.length);
				while (d < e) {
					var f = d + e >>> 1;
					c < a.call(b, b[f], f) ? e = f : d = f + 1
				}
				return d
			}
		}
	};
	var e$ = d3.bisector(function (a) {
			return a
		});
	d3.bisectLeft = e$.left,
	d3.bisect = d3.bisectRight = e$.right,
	d3.first = function (a, b) {
		var c = 0,
		d = a.length,
		e = a[0],
		f;
		arguments.length === 1 && (b = d3.ascending);
		while (++c < d)
			b.call(a, e, f = a[c]) > 0 && (e = f);
		return e
	},
	d3.last = function (a, b) {
		var c = 0,
		d = a.length,
		e = a[0],
		f;
		arguments.length === 1 && (b = d3.ascending);
		while (++c < d)
			b.call(a, e, f = a[c]) <= 0 && (e = f);
		return e
	},
	d3.nest = function () {
		function a(b, f) {
			if (f >= e.length)
				return h ? h.call(c, b) : g ? b.sort(g) : b;
			var i = -1,
			j = b.length,
			k = e[f++],
			l,
			m,
			n = new d,
			o,
			p = {};
			while (++i < j)
				(o = n.get(l = k(m = b[i]))) ? o.push(m) : n.set(l, [m]);
			return n.forEach(function (b) {
				p[b] = a(n.get(b), f)
			}),
			p
		}
		function b(a, c) {
			if (c >= e.length)
				return a;
			var d = [],
			g = f[c++],
			h;
			for (h in a)
				d.push({
					key : h,
					values : b(a[h], c)
				});
			return g && d.sort(function (a, b) {
				return g(a.key, b.key)
			}),
			d
		}
		var c = {},
		e = [],
		f = [],
		g,
		h;
		return c.map = function (b) {
			return a(b, 0)
		},
		c.entries = function (c) {
			return b(a(c, 0), 0)
		},
		c.key = function (a) {
			return e.push(a),
			c
		},
		c.sortKeys = function (a) {
			return f[e.length - 1] = a,
			c
		},
		c.sortValues = function (a) {
			return g = a,
			c
		},
		c.rollup = function (a) {
			return h = a,
			c
		},
		c
	},
	d3.keys = function (a) {
		var b = [];
		for (var c in a)
			b.push(c);
		return b
	},
	d3.values = function (a) {
		var b = [];
		for (var c in a)
			b.push(a[c]);
		return b
	},
	d3.entries = function (a) {
		var b = [];
		for (var c in a)
			b.push({
				key : c,
				value : a[c]
			});
		return b
	},
	d3.permute = function (a, b) {
		var c = [],
		d = -1,
		e = b.length;
		while (++d < e)
			c[d] = a[b[d]];
		return c
	},
	d3.merge = function (a) {
		return Array.prototype.concat.apply([], a)
	},
	d3.split = function (a, b) {
		var c = [],
		d = [],
		e,
		f = -1,
		g = a.length;
		arguments.length < 2 && (b = l);
		while (++f < g)
			b.call(d, e = a[f], f) ? d = [] : (d.length || c.push(d), d.push(e));
		return c
	},
	d3.range = function (a, b, c) {
		arguments.length < 3 && (c = 1, arguments.length < 2 && (b = a, a = 0));
		if ((b - a) / c === Infinity)
			throw new Error("infinite range");
		var d = [],
		e = n(Math.abs(c)),
		f = -1,
		g;
		a *= e,
		b *= e,
		c *= e;
		if (c < 0)
			while ((g = a + c * ++f) > b)
				d.push(g / e);
		else
			while ((g = a + c * ++f) < b)
				d.push(g / e);
		return d
	},
	d3.requote = function (a) {
		return a.replace(e_, "\\$&")
	};
	var e_ = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	d3.round = function (a, b) {
		return b ? Math.round(a * (b = Math.pow(10, b))) / b : Math.round(a)
	},
	d3.xhr = function (a, b, c) {
		var d = new XMLHttpRequest;
		arguments.length < 3 ? (c = b, b = null) : b && d.overrideMimeType && d.overrideMimeType(b),
		d.open("GET", a, !0),
		b && d.setRequestHeader("Accept", b),
		d.onreadystatechange = function () {
			if (d.readyState === 4) {
				var a = d.status;
				c(!a && d.response || a >= 200 && a < 300 || a === 304 ? d : null)
			}
		},
		d.send(null)
	},
	d3.text = function (a, b, c) {
		function d(a) {
			c(a && a.responseText)
		}
		arguments.length < 3 && (c = b, b = null),
		d3.xhr(a, b, d)
	},
	d3.json = function (a, b) {
		d3.text(a, "application/json", function (a) {
			b(a ? JSON.parse(a) : null)
		})
	},
	d3.html = function (a, b) {
		d3.text(a, "text/html", function (a) {
			if (a != null) {
				var c = document.createRange();
				c.selectNode(document.body),
				a = c.createContextualFragment(a)
			}
			b(a)
		})
	},
	d3.xml = function (a, b, c) {
		function d(a) {
			c(a && a.responseXML)
		}
		arguments.length < 3 && (c = b, b = null),
		d3.xhr(a, b, d)
	};
	var fa = {
		svg : "http://www.w3.org/2000/svg",
		xhtml : "http://www.w3.org/1999/xhtml",
		xlink : "http://www.w3.org/1999/xlink",
		xml : "http://www.w3.org/XML/1998/namespace",
		xmlns : "http://www.w3.org/2000/xmlns/"
	};
	d3.ns = {
		prefix : fa,
		qualify : function (a) {
			var b = a.indexOf(":"),
			c = a;
			return b >= 0 && (c = a.substring(0, b), a = a.substring(b + 1)),
			fa.hasOwnProperty(c) ? {
				space : fa[c],
				local : a
			}
			 : a
		}
	},
	d3.dispatch = function () {
		var a = new o,
		b = -1,
		c = arguments.length;
		while (++b < c)
			a[arguments[b]] = p(a);
		return a
	},
	o.prototype.on = function (a, b) {
		var c = a.indexOf("."),
		d = "";
		return c > 0 && (d = a.substring(c + 1), a = a.substring(0, c)),
		arguments.length < 2 ? this[a].on(d) : this[a].on(d, b)
	},
	d3.format = function (a) {
		var b = fb.exec(a),
		c = b[1] || " ",
		d = b[3] || "",
		e = b[5],
		f = +b[6],
		g = b[7],
		h = b[8],
		i = b[9],
		j = 1,
		k = "",
		l = !1;
		h && (h = +h.substring(1)),
		e && (c = "0", g && (f -= Math.floor((f - 1) / 4)));
		switch (i) {
		case "n":
			g = !0,
			i = "g";
			break;
		case "%":
			j = 100,
			k = "%",
			i = "f";
			break;
		case "p":
			j = 100,
			k = "%",
			i = "r";
			break;
		case "d":
			l = !0,
			h = 0;
			break;
		case "s":
			j = -1,
			i = "r"
		}
		return i == "r" && !h && (i = "g"),
		i = fc.get(i) || r,
		function (a) {
			if (l && a % 1)
				return "";
			var b = a < 0 && (a = -a) ? "-" : d;
			if (j < 0) {
				var m = d3.formatPrefix(a, h);
				a = m.scale(a),
				k = m.symbol
			} else
				a *= j;
			a = i(a, h);
			if (e) {
				var n = a.length + b.length;
				n < f && (a = (new Array(f - n + 1)).join(c) + a),
				g && (a = s(a)),
				a = b + a
			} else {
				g && (a = s(a)),
				a = b + a;
				var n = a.length;
				n < f && (a = (new Array(f - n + 1)).join(c) + a)
			}
			return a + k
		}
	};
	var fb = /(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?([0-9]+)?(,)?(\.[0-9]+)?([a-zA-Z%])?/,
	fc = d3.map({
			g : function (a, b) {
				return a.toPrecision(b)
			},
			e : function (a, b) {
				return a.toExponential(b)
			},
			f : function (a, b) {
				return a.toFixed(b)
			},
			r : function (a, b) {
				return d3.round(a, b = q(a, b)).toFixed(Math.max(0, Math.min(20, b)))
			}
		}),
	fd = ["y", "z", "a", "f", "p", "n", "μ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(t);
	d3.formatPrefix = function (a, b) {
		var c = 0;
		return a && (a < 0 && (a *= -1), b && (a = d3.round(a, q(a, b))), c = 1 + Math.floor(1e-12 + Math.log(a) / Math.LN10), c = Math.max(-24, Math.min(24, Math.floor((c <= 0 ? c + 1 : c - 1) / 3) * 3))),
		fd[8 + c / 3]
	};
	var fe = y(2),
	ff = y(3),
	fg = function () {
		return x
	},
	fh = d3.map({
			linear : fg,
			poly : y,
			quad : function () {
				return fe
			},
			cubic : function () {
				return ff
			},
			sin : function () {
				return z
			},
			exp : function () {
				return A
			},
			circle : function () {
				return B
			},
			elastic : C,
			back : D,
			bounce : function () {
				return E
			}
		}),
	fi = d3.map({
			"in" : x,
			out : v,
			"in-out" : w,
			"out-in" : function (a) {
				return w(v(a))
			}
		});
	d3.ease = function (a) {
		var b = a.indexOf("-"),
		c = b >= 0 ? a.substring(0, b) : a,
		d = b >= 0 ? a.substring(b + 1) : "in";
		return c = fh.get(c) || fg,
		d = fi.get(d) || x,
		u(d(c.apply(null, Array.prototype.slice.call(arguments, 1))))
	},
	d3.event = null,
	d3.transform = function (a) {
		var b = document.createElementNS(d3.ns.prefix.svg, "g");
		return (d3.transform = function (a) {
			b.setAttribute("transform", a);
			var c = b.transform.baseVal.consolidate();
			return new I(c ? c.matrix : fk)
		})(a)
	},
	I.prototype.toString = function () {
		return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")"
	};
	var fj = 180 / Math.PI,
	fk = {
		a : 1,
		b : 0,
		c : 0,
		d : 1,
		e : 0,
		f : 0
	};
	d3.interpolate = function (a, b) {
		var c = d3.interpolators.length,
		d;
		while (--c >= 0 && !(d = d3.interpolators[c](a, b)));
		return d
	},
	d3.interpolateNumber = function (a, b) {
		return b -= a,
		function (c) {
			return a + b * c
		}
	},
	d3.interpolateRound = function (a, b) {
		return b -= a,
		function (c) {
			return Math.round(a + b * c)
		}
	},
	d3.interpolateString = function (a, b) {
		var c,
		d,
		e,
		f = 0,
		g = 0,
		h = [],
		i = [],
		j,
		k;
		fl.lastIndex = 0;
		for (d = 0; c = fl.exec(b); ++d)
			c.index && h.push(b.substring(f, g = c.index)), i.push({
				i : h.length,
				x : c[0]
			}), h.push(null), f = fl.lastIndex;
		f < b.length && h.push(b.substring(f));
		for (d = 0, j = i.length; (c = fl.exec(a)) && d < j; ++d) {
			k = i[d];
			if (k.x == c[0]) {
				if (k.i)
					if (h[k.i + 1] == null) {
						h[k.i - 1] += k.x,
						h.splice(k.i, 1);
						for (e = d + 1; e < j; ++e)
							i[e].i--
					} else {
						h[k.i - 1] += k.x + h[k.i + 1],
						h.splice(k.i, 2);
						for (e = d + 1; e < j; ++e)
							i[e].i -= 2
					}
				else if (h[k.i + 1] == null)
					h[k.i] = k.x;
				else {
					h[k.i] = k.x + h[k.i + 1],
					h.splice(k.i + 1, 1);
					for (e = d + 1; e < j; ++e)
						i[e].i--
				}
				i.splice(d, 1),
				j--,
				d--
			} else
				k.x = d3.interpolateNumber(parseFloat(c[0]), parseFloat(k.x))
		}
		while (d < j)
			k = i.pop(), h[k.i + 1] == null ? h[k.i] = k.x : (h[k.i] = k.x + h[k.i + 1], h.splice(k.i + 1, 1)), j--;
		return h.length === 1 ? h[0] == null ? i[0].x : function () {
			return b
		}
		 : function (a) {
			for (d = 0; d < j; ++d)
				h[(k = i[d]).i] = k.x(a);
			return h.join("")
		}
	},
	d3.interpolateTransform = function (a, b) {
		var c = [],
		d = [],
		e,
		f = d3.transform(a),
		g = d3.transform(b),
		h = f.translate,
		i = g.translate,
		j = f.rotate,
		k = g.rotate,
		l = f.skew,
		m = g.skew,
		n = f.scale,
		o = g.scale;
		return h[0] != i[0] || h[1] != i[1] ? (c.push("translate(", null, ",", null, ")"), d.push({
				i : 1,
				x : d3.interpolateNumber(h[0], i[0])
			}, {
				i : 3,
				x : d3.interpolateNumber(h[1], i[1])
			})) : i[0] || i[1] ? c.push("translate(" + i + ")") : c.push(""),
		j != k ? (j - k > 180 ? k += 360 : k - j > 180 && (j += 360), d.push({
				i : c.push(c.pop() + "rotate(", null, ")") - 2,
				x : d3.interpolateNumber(j, k)
			})) : k && c.push(c.pop() + "rotate(" + k + ")"),
		l != m ? d.push({
			i : c.push(c.pop() + "skewX(", null, ")") - 2,
			x : d3.interpolateNumber(l, m)
		}) : m && c.push(c.pop() + "skewX(" + m + ")"),
		n[0] != o[0] || n[1] != o[1] ? (e = c.push(c.pop() + "scale(", null, ",", null, ")"), d.push({
				i : e - 4,
				x : d3.interpolateNumber(n[0], o[0])
			}, {
				i : e - 2,
				x : d3.interpolateNumber(n[1], o[1])
			})) : (o[0] != 1 || o[1] != 1) && c.push(c.pop() + "scale(" + o + ")"),
		e = d.length,
		function (a) {
			var b = -1,
			f;
			while (++b < e)
				c[(f = d[b]).i] = f.x(a);
			return c.join("")
		}
	},
	d3.interpolateRgb = function (a, b) {
		a = d3.rgb(a),
		b = d3.rgb(b);
		var c = a.r,
		d = a.g,
		e = a.b,
		f = b.r - c,
		g = b.g - d,
		h = b.b - e;
		return function (a) {
			return "#" + R(Math.round(c + f * a)) + R(Math.round(d + g * a)) + R(Math.round(e + h * a))
		}
	},
	d3.interpolateHsl = function (a, b) {
		a = d3.hsl(a),
		b = d3.hsl(b);
		var c = a.h,
		d = a.s,
		e = a.l,
		f = b.h - c,
		g = b.s - d,
		h = b.l - e;
		return f > 180 ? f -= 360 : f < -180 && (f += 360),
		function (a) {
			return Z(c + f * a, d + g * a, e + h * a) + ""
		}
	},
	d3.interpolateLab = function (a, b) {
		a = d3.lab(a),
		b = d3.lab(b);
		var c = a.l,
		d = a.a,
		e = a.b,
		f = b.l - c,
		g = b.a - d,
		h = b.b - e;
		return function (a) {
			return bd(c + f * a, d + g * a, e + h * a) + ""
		}
	},
	d3.interpolateHcl = function (a, b) {
		a = d3.hcl(a),
		b = d3.hcl(b);
		var c = a.h,
		d = a.c,
		e = a.l,
		f = b.h - c,
		g = b.c - d,
		h = b.l - e;
		return f > 180 ? f -= 360 : f < -180 && (f += 360),
		function (a) {
			return ba(c + f * a, d + g * a, e + h * a) + ""
		}
	},
	d3.interpolateArray = function (a, b) {
		var c = [],
		d = [],
		e = a.length,
		f = b.length,
		g = Math.min(a.length, b.length),
		h;
		for (h = 0; h < g; ++h)
			c.push(d3.interpolate(a[h], b[h]));
		for (; h < e; ++h)
			d[h] = a[h];
		for (; h < f; ++h)
			d[h] = b[h];
		return function (a) {
			for (h = 0; h < g; ++h)
				d[h] = c[h](a);
			return d
		}
	},
	d3.interpolateObject = function (a, b) {
		var c = {},
		d = {},
		e;
		for (e in a)
			e in b ? c[e] = M(e)(a[e], b[e]) : d[e] = a[e];
		for (e in b)
			e in a || (d[e] = b[e]);
		return function (a) {
			for (e in c)
				d[e] = c[e](a);
			return d
		}
	};
	var fl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
	d3.interpolators = [d3.interpolateObject, function (a, b) {
			return b instanceof Array && d3.interpolateArray(a, b)
		}, function (a, b) {
			return (typeof a == "string" || typeof b == "string") && d3.interpolateString(a + "", b + "")
		}, function (a, b) {
			return (typeof b == "string" ? fm.has(b) || /^(#|rgb\(|hsl\()/.test(b) : b instanceof Q || b instanceof Y) && d3.interpolateRgb(a, b)
		}, function (a, b) {
			return !isNaN(a = +a) && !isNaN(b = +b) && d3.interpolateNumber(a, b)
		}
	],
	d3.rgb = function (a, b, c) {
		return arguments.length === 1 ? a instanceof Q ? P(a.r, a.g, a.b) : S("" + a, P, Z) : P(~~a, ~~b, ~~c)
	},
	Q.prototype.brighter = function (a) {
		a = Math.pow(.7, arguments.length ? a : 1);
		var b = this.r,
		c = this.g,
		d = this.b,
		e = 30;
		return !b && !c && !d ? P(e, e, e) : (b && b < e && (b = e), c && c < e && (c = e), d && d < e && (d = e), P(Math.min(255, Math.floor(b / a)), Math.min(255, Math.floor(c / a)), Math.min(255, Math.floor(d / a))))
	},
	Q.prototype.darker = function (a) {
		return a = Math.pow(.7, arguments.length ? a : 1),
		P(Math.floor(a * this.r), Math.floor(a * this.g), Math.floor(a * this.b))
	},
	Q.prototype.hsl = function () {
		return T(this.r, this.g, this.b)
	},
	Q.prototype.toString = function () {
		return "#" + R(this.r) + R(this.g) + R(this.b)
	};
	var fm = d3.map({
			aliceblue : "#f0f8ff",
			antiquewhite : "#faebd7",
			aqua : "#00ffff",
			aquamarine : "#7fffd4",
			azure : "#f0ffff",
			beige : "#f5f5dc",
			bisque : "#ffe4c4",
			black : "#000000",
			blanchedalmond : "#ffebcd",
			blue : "#0000ff",
			blueviolet : "#8a2be2",
			brown : "#a52a2a",
			burlywood : "#deb887",
			cadetblue : "#5f9ea0",
			chartreuse : "#7fff00",
			chocolate : "#d2691e",
			coral : "#ff7f50",
			cornflowerblue : "#6495ed",
			cornsilk : "#fff8dc",
			crimson : "#dc143c",
			cyan : "#00ffff",
			darkblue : "#00008b",
			darkcyan : "#008b8b",
			darkgoldenrod : "#b8860b",
			darkgray : "#a9a9a9",
			darkgreen : "#006400",
			darkgrey : "#a9a9a9",
			darkkhaki : "#bdb76b",
			darkmagenta : "#8b008b",
			darkolivegreen : "#556b2f",
			darkorange : "#ff8c00",
			darkorchid : "#9932cc",
			darkred : "#8b0000",
			darksalmon : "#e9967a",
			darkseagreen : "#8fbc8f",
			darkslateblue : "#483d8b",
			darkslategray : "#2f4f4f",
			darkslategrey : "#2f4f4f",
			darkturquoise : "#00ced1",
			darkviolet : "#9400d3",
			deeppink : "#ff1493",
			deepskyblue : "#00bfff",
			dimgray : "#696969",
			dimgrey : "#696969",
			dodgerblue : "#1e90ff",
			firebrick : "#b22222",
			floralwhite : "#fffaf0",
			forestgreen : "#228b22",
			fuchsia : "#ff00ff",
			gainsboro : "#dcdcdc",
			ghostwhite : "#f8f8ff",
			gold : "#ffd700",
			goldenrod : "#daa520",
			gray : "#808080",
			green : "#008000",
			greenyellow : "#adff2f",
			grey : "#808080",
			honeydew : "#f0fff0",
			hotpink : "#ff69b4",
			indianred : "#cd5c5c",
			indigo : "#4b0082",
			ivory : "#fffff0",
			khaki : "#f0e68c",
			lavender : "#e6e6fa",
			lavenderblush : "#fff0f5",
			lawngreen : "#7cfc00",
			lemonchiffon : "#fffacd",
			lightblue : "#add8e6",
			lightcoral : "#f08080",
			lightcyan : "#e0ffff",
			lightgoldenrodyellow : "#fafad2",
			lightgray : "#d3d3d3",
			lightgreen : "#90ee90",
			lightgrey : "#d3d3d3",
			lightpink : "#ffb6c1",
			lightsalmon : "#ffa07a",
			lightseagreen : "#20b2aa",
			lightskyblue : "#87cefa",
			lightslategray : "#778899",
			lightslategrey : "#778899",
			lightsteelblue : "#b0c4de",
			lightyellow : "#ffffe0",
			lime : "#00ff00",
			limegreen : "#32cd32",
			linen : "#faf0e6",
			magenta : "#ff00ff",
			maroon : "#800000",
			mediumaquamarine : "#66cdaa",
			mediumblue : "#0000cd",
			mediumorchid : "#ba55d3",
			mediumpurple : "#9370db",
			mediumseagreen : "#3cb371",
			mediumslateblue : "#7b68ee",
			mediumspringgreen : "#00fa9a",
			mediumturquoise : "#48d1cc",
			mediumvioletred : "#c71585",
			midnightblue : "#191970",
			mintcream : "#f5fffa",
			mistyrose : "#ffe4e1",
			moccasin : "#ffe4b5",
			navajowhite : "#ffdead",
			navy : "#000080",
			oldlace : "#fdf5e6",
			olive : "#808000",
			olivedrab : "#6b8e23",
			orange : "#ffa500",
			orangered : "#ff4500",
			orchid : "#da70d6",
			palegoldenrod : "#eee8aa",
			palegreen : "#98fb98",
			paleturquoise : "#afeeee",
			palevioletred : "#db7093",
			papayawhip : "#ffefd5",
			peachpuff : "#ffdab9",
			peru : "#cd853f",
			pink : "#ffc0cb",
			plum : "#dda0dd",
			powderblue : "#b0e0e6",
			purple : "#800080",
			red : "#ff0000",
			rosybrown : "#bc8f8f",
			royalblue : "#4169e1",
			saddlebrown : "#8b4513",
			salmon : "#fa8072",
			sandybrown : "#f4a460",
			seagreen : "#2e8b57",
			seashell : "#fff5ee",
			sienna : "#a0522d",
			silver : "#c0c0c0",
			skyblue : "#87ceeb",
			slateblue : "#6a5acd",
			slategray : "#708090",
			slategrey : "#708090",
			snow : "#fffafa",
			springgreen : "#00ff7f",
			steelblue : "#4682b4",
			tan : "#d2b48c",
			teal : "#008080",
			thistle : "#d8bfd8",
			tomato : "#ff6347",
			turquoise : "#40e0d0",
			violet : "#ee82ee",
			wheat : "#f5deb3",
			white : "#ffffff",
			whitesmoke : "#f5f5f5",
			yellow : "#ffff00",
			yellowgreen : "#9acd32"
		});
	fm.forEach(function (a, b) {
		fm.set(a, S(b, P, Z))
	}),
	d3.hsl = function (a, b, c) {
		return arguments.length === 1 ? a instanceof Y ? X(a.h, a.s, a.l) : S("" + a, T, X) : X(+a, +b, +c)
	},
	Y.prototype.brighter = function (a) {
		return a = Math.pow(.7, arguments.length ? a : 1),
		X(this.h, this.s, this.l / a)
	},
	Y.prototype.darker = function (a) {
		return a = Math.pow(.7, arguments.length ? a : 1),
		X(this.h, this.s, a * this.l)
	},
	Y.prototype.rgb = function () {
		return Z(this.h, this.s, this.l)
	},
	Y.prototype.toString = function () {
		return this.rgb().toString()
	},
	d3.hcl = function (a, b, c) {
		return arguments.length === 1 ? a instanceof _ ? $(a.h, a.c, a.l) : a instanceof bc ? be(a.l, a.a, a.b) : be((a = U((a = d3.rgb(a)).r, a.g, a.b)).l, a.a, a.b) : $(+a, +b, +c)
	},
	_.prototype.brighter = function (a) {
		return $(this.h, this.c, Math.min(100, this.l + fn * (arguments.length ? a : 1)))
	},
	_.prototype.darker = function (a) {
		return $(this.h, this.c, Math.max(0, this.l - fn * (arguments.length ? a : 1)))
	},
	_.prototype.rgb = function () {
		return ba(this.h, this.c, this.l).rgb()
	},
	_.prototype.toString = function () {
		return this.rgb() + ""
	},
	d3.lab = function (a, b, c) {
		return arguments.length === 1 ? a instanceof bc ? bb(a.l, a.a, a.b) : a instanceof _ ? ba(a.l, a.c, a.h) : U((a = d3.rgb(a)).r, a.g, a.b) : bb(+a, +b, +c)
	};
	var fn = 18,
	fo = .95047,
	fp = 1,
	fq = 1.08883;
	bc.prototype.brighter = function (a) {
		return bb(Math.min(100, this.l + fn * (arguments.length ? a : 1)), this.a, this.b)
	},
	bc.prototype.darker = function (a) {
		return bb(Math.max(0, this.l - fn * (arguments.length ? a : 1)), this.a, this.b)
	},
	bc.prototype.rgb = function () {
		return bd(this.l, this.a, this.b)
	},
	bc.prototype.toString = function () {
		return this.rgb() + ""
	};
	var fr = function (a, b) {
		return b.querySelector(a)
	},
	fs = function (a, b) {
		return b.querySelectorAll(a)
	},
	ft = document.documentElement,
	fu = ft.matchesSelector || ft.webkitMatchesSelector || ft.mozMatchesSelector || ft.msMatchesSelector || ft.oMatchesSelector,
	fv = function (a, b) {
		return fu.call(a, b)
	};
	typeof Sizzle == "function" && (fr = function (a, b) {
		return Sizzle(a, b)[0] || null
	}, fs = function (a, b) {
		return Sizzle.uniqueSort(Sizzle(a, b))
	}, fv = Sizzle.matchesSelector);
	var fw = [];
	d3.selection = function () {
		return fx
	},
	d3.selection.prototype = fw,
	fw.select = function (a) {
		var b = [],
		c,
		d,
		e,
		f;
		typeof a != "function" && (a = bj(a));
		for (var g = -1, h = this.length; ++g < h; ) {
			b.push(c = []),
			c.parentNode = (e = this[g]).parentNode;
			for (var i = -1, j = e.length; ++i < j; )
				(f = e[i]) ? (c.push(d = a.call(f, f.__data__, i)), d && "__data__" in f && (d.__data__ = f.__data__)) : c.push(null)
		}
		return bi(b)
	},
	fw.selectAll = function (a) {
		var b = [],
		c,
		d;
		typeof a != "function" && (a = bk(a));
		for (var e = -1, f = this.length; ++e < f; )
			for (var g = this[e], h = -1, i = g.length; ++h < i; )
				if (d = g[h])
					b.push(c = eV(a.call(d, d.__data__, h))), c.parentNode = d;
		return bi(b)
	},
	fw.attr = function (a, b) {
		if (arguments.length < 2) {
			if (typeof a == "string") {
				var c = this.node();
				return a = d3.ns.qualify(a),
				a.local ? c.getAttributeNS(a.space, a.local) : c.getAttribute(a)
			}
			for (b in a)
				this.each(bl(b, a[b]));
			return this
		}
		return this.each(bl(a, b))
	},
	fw.classed = function (a, b) {
		if (arguments.length < 2) {
			if (typeof a == "string") {
				var c = this.node(),
				d = (a = a.trim().split(/^|\s+/g)).length,
				e = -1;
				if (b = c.classList) {
					while (++e < d)
						if (!b.contains(a[e]))
							return !1
				} else {
					b = c.className,
					b.baseVal != null && (b = b.baseVal);
					while (++e < d)
						if (!bm(a[e]).test(b))
							return !1
				}
				return !0
			}
			for (b in a)
				this.each(bn(b, a[b]));
			return this
		}
		return this.each(bn(a, b))
	},
	fw.style = function (a, b, c) {
		var d = arguments.length;
		if (d < 3) {
			if (typeof a != "string") {
				d < 2 && (b = "");
				for (c in a)
					this.each(bp(c, a[c], b));
				return this
			}
			if (d < 2)
				return window.getComputedStyle(this.node(), null).getPropertyValue(a);
			c = ""
		}
		return this.each(bp(a, b, c))
	},
	fw.property = function (a, b) {
		if (arguments.length < 2) {
			if (typeof a == "string")
				return this.node()[a];
			for (b in a)
				this.each(bq(b, a[b]));
			return this
		}
		return this.each(bq(a, b))
	},
	fw.text = function (a) {
		return arguments.length < 1 ? this.node().textContent : this.each(typeof a == "function" ? function () {
			var b = a.apply(this, arguments);
			this.textContent = b == null ? "" : b
		}
			 : a == null ? function () {
			this.textContent = ""
		}
			 : function () {
			this.textContent = a
		})
	},
	fw.html = function (a) {
		return arguments.length < 1 ? this.node().innerHTML : this.each(typeof a == "function" ? function () {
			var b = a.apply(this, arguments);
			this.innerHTML = b == null ? "" : b
		}
			 : a == null ? function () {
			this.innerHTML = ""
		}
			 : function () {
			this.innerHTML = a
		})
	},
	fw.append = function (a) {
		function b() {
			return this.appendChild(document.createElementNS(this.namespaceURI, a))
		}
		function c() {
			return this.appendChild(document.createElementNS(a.space, a.local))
		}
		return a = d3.ns.qualify(a),
		this.select(a.local ? c : b)
	},
	fw.insert = function (a, b) {
		function c() {
			return this.insertBefore(document.createElementNS(this.namespaceURI, a), fr(b, this))
		}
		function d() {
			return this.insertBefore(document.createElementNS(a.space, a.local), fr(b, this))
		}
		return a = d3.ns.qualify(a),
		this.select(a.local ? d : c)
	},
	fw.remove = function () {
		return this.each(function () {
			var a = this.parentNode;
			a && a.removeChild(this)
		})
	},
	fw.data = function (a, b) {
		function c(a, c) {
			var e,
			f = a.length,
			g = c.length,
			h = Math.min(f, g),
			l = Math.max(f, g),
			m = [],
			n = [],
			o = [],
			p,
			q;
			if (b) {
				var r = new d,
				s = [],
				t,
				u = c.length;
				for (e = -1; ++e < f; )
					t = b.call(p = a[e], p.__data__, e), r.has(t) ? o[u++] = p : r.set(t, p), s.push(t);
				for (e = -1; ++e < g; )
					t = b.call(c, q = c[e], e), r.has(t) ? (m[e] = p = r.get(t), p.__data__ = q, n[e] = o[e] = null) : (n[e] = br(q), m[e] = o[e] = null), r.remove(t);
				for (e = -1; ++e < f; )
					r.has(s[e]) && (o[e] = a[e])
			} else {
				for (e = -1; ++e < h; )
					p = a[e], q = c[e], p ? (p.__data__ = q, m[e] = p, n[e] = o[e] = null) : (n[e] = br(q), m[e] = o[e] = null);
				for (; e < g; ++e)
					n[e] = br(c[e]), m[e] = o[e] = null;
				for (; e < l; ++e)
					o[e] = a[e], n[e] = m[e] = null
			}
			n.update = m,
			n.parentNode = m.parentNode = o.parentNode = a.parentNode,
			i.push(n),
			j.push(m),
			k.push(o)
		}
		var e = -1,
		f = this.length,
		g,
		h;
		if (!arguments.length) {
			a = new Array(f = (g = this[0]).length);
			while (++e < f)
				if (h = g[e])
					a[e] = h.__data__;
			return a
		}
		var i = bw([]),
		j = bi([]),
		k = bi([]);
		if (typeof a == "function")
			while (++e < f)
				c(g = this[e], a.call(g, g.parentNode.__data__, e));
		else
			while (++e < f)
				c(g = this[e], a);
		return j.enter = function () {
			return i
		},
		j.exit = function () {
			return k
		},
		j
	},
	fw.datum = fw.map = function (a) {
		return arguments.length < 1 ? this.property("__data__") : this.property("__data__", a)
	},
	fw.filter = function (a) {
		var b = [],
		c,
		d,
		e;
		typeof a != "function" && (a = bs(a));
		for (var f = 0, g = this.length; f < g; f++) {
			b.push(c = []),
			c.parentNode = (d = this[f]).parentNode;
			for (var h = 0, i = d.length; h < i; h++)
				(e = d[h]) && a.call(e, e.__data__, h) && c.push(e)
		}
		return bi(b)
	},
	fw.order = function () {
		for (var a = -1, b = this.length; ++a < b; )
			for (var c = this[a], d = c.length - 1, e = c[d], f; --d >= 0; )
				if (f = c[d])
					e && e !== f.nextSibling && e.parentNode.insertBefore(f, e), e = f;
		return this
	},
	fw.sort = function (a) {
		a = bt.apply(this, arguments);
		for (var b = -1, c = this.length; ++b < c; )
			this[b].sort(a);
		return this.order()
	},
	fw.on = function (a, b, c) {
		var d = arguments.length;
		if (d < 3) {
			if (typeof a != "string") {
				d < 2 && (b = !1);
				for (c in a)
					this.each(bu(c, a[c], b));
				return this
			}
			if (d < 2)
				return (d = this.node()["__on" + a]) && d._;
			c = !1
		}
		return this.each(bu(a, b, c))
	},
	fw.each = function (a) {
		return bv(this, function (b, c, d) {
			a.call(b, b.__data__, c, d)
		})
	},
	fw.call = function (a) {
		return a.apply(this, (arguments[0] = this, arguments)),
		this
	},
	fw.empty = function () {
		return !this.node()
	},
	fw.node = function (a) {
		for (var b = 0, c = this.length; b < c; b++)
			for (var d = this[b], e = 0, f = d.length; e < f; e++) {
				var g = d[e];
				if (g)
					return g
			}
		return null
	},
	fw.transition = function () {
		var a = [],
		b,
		c;
		for (var d = -1, e = this.length; ++d < e; ) {
			a.push(b = []);
			for (var f = this[d], g = -1, h = f.length; ++g < h; )
				b.push((c = f[g]) ? {
					node : c,
					delay : fF,
					duration : fG
				}
					 : null)
		}
		return bx(a, fB || ++fA, Date.now())
	};
	var fx = bi([[document]]);
	fx[0].parentNode = ft,
	d3.select = function (a) {
		return typeof a == "string" ? fx.select(a) : bi([[a]])
	},
	d3.selectAll = function (a) {
		return typeof a == "string" ? fx.selectAll(a) : bi([eV(a)])
	};
	var fy = [];
	d3.selection.enter = bw,
	d3.selection.enter.prototype = fy,
	fy.append = fw.append,
	fy.insert = fw.insert,
	fy.empty = fw.empty,
	fy.node = fw.node,
	fy.select = function (a) {
		var b = [],
		c,
		d,
		e,
		f,
		g;
		for (var h = -1, i = this.length; ++h < i; ) {
			e = (f = this[h]).update,
			b.push(c = []),
			c.parentNode = f.parentNode;
			for (var j = -1, k = f.length; ++j < k; )
				(g = f[j]) ? (c.push(e[j] = d = a.call(f.parentNode, g.__data__, j)), d.__data__ = g.__data__) : c.push(null)
		}
		return bi(b)
	};
	var fz = [],
	fA = 0,
	fB = 0,
	fC = 0,
	fD = 250,
	fE = d3.ease("cubic-in-out"),
	fF = fC,
	fG = fD,
	fH = fE;
	fz.call = fw.call,
	d3.transition = function (a) {
		return arguments.length ? fB ? a.transition() : a : fx.transition()
	},
	d3.transition.prototype = fz,
	fz.select = function (a) {
		var b = [],
		c,
		d,
		e;
		typeof a != "function" && (a = bj(a));
		for (var f = -1, g = this.length; ++f < g; ) {
			b.push(c = []);
			for (var h = this[f], i = -1, j = h.length; ++i < j; )
				(e = h[i]) && (d = a.call(e.node, e.node.__data__, i)) ? ("__data__" in e.node && (d.__data__ = e.node.__data__), c.push({
						node : d,
						delay : e.delay,
						duration : e.duration
					})) : c.push(null)
		}
		return bx(b, this.id, this.time).ease(this.ease())
	},
	fz.selectAll = function (a) {
		var b = [],
		c,
		d,
		e;
		typeof a != "function" && (a = bk(a));
		for (var f = -1, g = this.length; ++f < g; )
			for (var h = this[f], i = -1, j = h.length; ++i < j; )
				if (e = h[i]) {
					d = a.call(e.node, e.node.__data__, i),
					b.push(c = []);
					for (var k = -1, l = d.length; ++k < l; )
						c.push({
							node : d[k],
							delay : e.delay,
							duration : e.duration
						})
				}
		return bx(b, this.id, this.time).ease(this.ease())
	},
	fz.filter = function (a) {
		var b = [],
		c,
		d,
		e;
		typeof a != "function" && (a = bs(a));
		for (var f = 0, g = this.length; f < g; f++) {
			b.push(c = []);
			for (var d = this[f], h = 0, i = d.length; h < i; h++)
				(e = d[h]) && a.call(e.node, e.node.__data__, h) && c.push(e)
		}
		return bx(b, this.id, this.time).ease(this.ease())
	},
	fz.attr = function (a, b) {
		if (arguments.length < 2) {
			for (b in a)
				this.attrTween(b, bA(a[b], b));
			return this
		}
		return this.attrTween(a, bA(b, a))
	},
	fz.attrTween = function (a, b) {
		function c(a, c) {
			var d = b.call(this, a, c, this.getAttribute(e));
			return d === fI ? (this.removeAttribute(e), null) : d && function (a) {
				this.setAttribute(e, d(a))
			}
		}
		function d(a, c) {
			var d = b.call(this, a, c, this.getAttributeNS(e.space, e.local));
			return d === fI ? (this.removeAttributeNS(e.space, e.local), null) : d && function (a) {
				this.setAttributeNS(e.space, e.local, d(a))
			}
		}
		var e = d3.ns.qualify(a);
		return this.tween("attr." + a, e.local ? d : c)
	},
	fz.style = function (a, b, c) {
		var d = arguments.length;
		if (d < 3) {
			if (typeof a != "string") {
				d < 2 && (b = "");
				for (c in a)
					this.styleTween(c, bA(a[c], c), b);
				return this
			}
			c = ""
		}
		return this.styleTween(a, bA(b, a), c)
	},
	fz.styleTween = function (a, b, c) {
		return arguments.length < 3 && (c = ""),
		this.tween("style." + a, function (d, e) {
			var f = b.call(this, d, e, window.getComputedStyle(this, null).getPropertyValue(a));
			return f === fI ? (this.style.removeProperty(a), null) : f && function (b) {
				this.style.setProperty(a, f(b), c)
			}
		})
	},
	fz.text = function (a) {
		return this.tween("text", function (b, c) {
			this.textContent = typeof a == "function" ? a.call(this, b, c) : a
		})
	},
	fz.remove = function () {
		return this.each("end.transition", function () {
			var a;
			!this.__transition__ && (a = this.parentNode) && a.removeChild(this)
		})
	},
	fz.delay = function (a) {
		return bv(this, typeof a == "function" ? function (b, c, d) {
			b.delay = a.call(b = b.node, b.__data__, c, d) | 0
		}
			 : (a |= 0, function (b) {
				b.delay = a
			}))
	},
	fz.duration = function (a) {
		return bv(this, typeof a == "function" ? function (b, c, d) {
			b.duration = Math.max(1, a.call(b = b.node, b.__data__, c, d) | 0)
		}
			 : (a = Math.max(1, a | 0), function (b) {
				b.duration = a
			}))
	},
	fz.transition = function () {
		return this.select(f)
	},
	d3.tween = function (a, b) {
		function c(c, d, e) {
			var f = a.call(this, c, d);
			return f == null ? e != "" && fI : e != f && b(e, f)
		}
		function d(c, d, e) {
			return e != a && b(e, a)
		}
		return typeof a == "function" ? c : a == null ? bz : (a += "", d)
	};
	var fI = {},
	fJ = null,
	fK,
	fL;
	d3.timer = function (a, b, c) {
		var d = !1,
		e,
		f = fJ;
		if (arguments.length < 3) {
			if (arguments.length < 2)
				b = 0;
			else if (!isFinite(b))
				return;
			c = Date.now()
		}
		while (f) {
			if (f.callback === a) {
				f.then = c,
				f.delay = b,
				d = !0;
				break
			}
			e = f,
			f = f.next
		}
		d || (fJ = {
				callback : a,
				then : c,
				delay : b,
				next : fJ
			}),
		fK || (fL = clearTimeout(fL), fK = 1, fM(bB))
	},
	d3.timer.flush = function () {
		var a,
		b = Date.now(),
		c = fJ;
		while (c)
			a = b - c.then, c.delay || (c.flush = c.callback(a)), c = c.next;
		bC()
	};
	var fM = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
		setTimeout(a, 17)
	};
	d3.mouse = function (a) {
		return bD(a, G())
	};
	var fN = /WebKit/.test(navigator.userAgent) ? -1 : 0;
	d3.touches = function (a, b) {
		return arguments.length < 2 && (b = G().touches),
		b ? eV(b).map(function (b) {
			var c = bD(a, b);
			return c.identifier = b.identifier,
			c
		}) : []
	},
	d3.scale = {},
	d3.scale.linear = function () {
		return bJ([0, 1], [0, 1], d3.interpolate, !1)
	},
	d3.scale.log = function () {
		return bR(d3.scale.linear(), bS)
	};
	var fO = d3.format(".0e");
	bS.pow = function (a) {
		return Math.pow(10, a)
	},
	bT.pow = function (a) {
		return -Math.pow(10, -a)
	},
	d3.scale.pow = function () {
		return bU(d3.scale.linear(), 1)
	},
	d3.scale.sqrt = function () {
		return d3.scale.pow().exponent(.5)
	},
	d3.scale.ordinal = function () {
		return bW([], {
			t : "range",
			a : [[]]
		})
	},
	d3.scale.category10 = function () {
		return d3.scale.ordinal().range(fP)
	},
	d3.scale.category20 = function () {
		return d3.scale.ordinal().range(fQ)
	},
	d3.scale.category20b = function () {
		return d3.scale.ordinal().range(fR)
	},
	d3.scale.category20c = function () {
		return d3.scale.ordinal().range(fS)
	};
	var fP = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
	fQ = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"],
	fR = ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"],
	fS = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
	d3.scale.quantile = function () {
		return bX([], [])
	},
	d3.scale.quantize = function () {
		return bY(0, 1, [0, 1])
	},
	d3.scale.threshold = function () {
		return bZ([.5], [0, 1])
	},
	d3.scale.identity = function () {
		return b$([0, 1])
	},
	d3.svg = {},
	d3.svg.arc = function () {
		function a() {
			var a = b.apply(this, arguments),
			f = c.apply(this, arguments),
			g = d.apply(this, arguments) + fT,
			h = e.apply(this, arguments) + fT,
			i = (h < g && (i = g, g = h, h = i), h - g),
			j = i < Math.PI ? "0" : "1",
			k = Math.cos(g),
			l = Math.sin(g),
			m = Math.cos(h),
			n = Math.sin(h);
			return i >= fU ? a ? "M0," + f + "A" + f + "," + f + " 0 1,1 0," + -f + "A" + f + "," + f + " 0 1,1 0," + f + "M0," + a + "A" + a + "," + a + " 0 1,0 0," +  -
			a + "A" + a + "," + a + " 0 1,0 0," + a + "Z" : "M0," + f + "A" + f + "," + f + " 0 1,1 0," + -f + "A" + f + "," + f + " 0 1,1 0," + f + "Z" : a ? "M" + f * k + "," + f * l + "A" + f + "," + f + " 0 " + j + ",1 " + f * m + "," + f * n + "L" + a * m + "," + a * n + "A" + a + "," + a + " 0 " + j + ",0 " + a * k + "," + a * l + "Z" : "M" + f * k + "," + f * l + "A" + f + "," + f + " 0 " + j + ",1 " + f * m + "," + f * n + "L0,0" + "Z"
		}
		var b = b_,
		c = ca,
		d = cb,
		e = cc;
		return a.innerRadius = function (c) {
			return arguments.length ? (b = h(c), a) : b
		},
		a.outerRadius = function (b) {
			return arguments.length ? (c = h(b), a) : c
		},
		a.startAngle = function (b) {
			return arguments.length ? (d = h(b), a) : d
		},
		a.endAngle = function (b) {
			return arguments.length ? (e = h(b), a) : e
		},
		a.centroid = function () {
			var a = (b.apply(this, arguments) + c.apply(this, arguments)) / 2,
			f = (d.apply(this, arguments) + e.apply(this, arguments)) / 2 + fT;
			return [Math.cos(f) * a, Math.sin(f) * a]
		},
		a
	};
	var fT = -Math.PI / 2,
	fU = 2 * Math.PI - 1e-6;
	d3.svg.line = function () {
		return cd(e)
	};
	var fV = d3.map({
			linear : cg,
			"linear-closed" : ch,
			"step-before" : ci,
			"step-after" : cj,
			basis : cp,
			"basis-open" : cq,
			"basis-closed" : cr,
			bundle : cs,
			cardinal : cm,
			"cardinal-open" : ck,
			"cardinal-closed" : cl,
			monotone : cy
		});
	fV.forEach(function (a, b) {
		b.key = a,
		b.closed = /-closed$/.test(a)
	});
	var fW = [0, 2 / 3, 1 / 3, 0],
	fX = [0, 1 / 3, 2 / 3, 0],
	fY = [0, 1 / 6, 2 / 3, 1 / 6];
	d3.svg.line.radial = function () {
		var a = cd(cz);
		return a.radius = a.x,
		delete a.x,
		a.angle = a.y,
		delete a.y,
		a
	},
	ci.reverse = cj,
	cj.reverse = ci,
	d3.svg.area = function () {
		return cA(e)
	},
	d3.svg.area.radial = function () {
		var a = cA(cz);
		return a.radius = a.x,
		delete a.x,
		a.innerRadius = a.x0,
		delete a.x0,
		a.outerRadius = a.x1,
		delete a.x1,
		a.angle = a.y,
		delete a.y,
		a.startAngle = a.y0,
		delete a.y0,
		a.endAngle = a.y1,
		delete a.y1,
		a
	},
	d3.svg.chord = function () {
		function a(a, h) {
			var i = b(this, f, a, h),
			j = b(this, g, a, h);
			return "M" + i.p0 + d(i.r, i.p1, i.a1 - i.a0) + (c(i, j) ? e(i.r, i.p1, i.r, i.p0) : e(i.r, i.p1, j.r, j.p0) + d(j.r, j.p1, j.a1 - j.a0) + e(j.r, j.p1, i.r, i.p0)) + "Z"
		}
		function b(a, b, c, d) {
			var e = b.call(a, c, d),
			f = i.call(a, e, d),
			g = j.call(a, e, d) + fT,
			h = k.call(a, e, d) + fT;
			return {
				r : f,
				a0 : g,
				a1 : h,
				p0 : [f * Math.cos(g), f * Math.sin(g)],
				p1 : [f * Math.cos(h), f * Math.sin(h)]
			}
		}
		function c(a, b) {
			return a.a0 == b.a0 && a.a1 == b.a1
		}
		function d(a, b, c) {
			return "A" + a + "," + a + " 0 " +  + (c > Math.PI) + ",1 " + b
		}
		function e(a, b, c, d) {
			return "Q 0,0 " + d
		}
		var f = cB,
		g = cC,
		i = cD,
		j = cb,
		k = cc;
		return a.radius = function (b) {
			return arguments.length ? (i = h(b), a) : i
		},
		a.source = function (b) {
			return arguments.length ? (f = h(b), a) : f
		},
		a.target = function (b) {
			return arguments.length ? (g = h(b), a) : g
		},
		a.startAngle = function (b) {
			return arguments.length ? (j = h(b), a) : j
		},
		a.endAngle = function (b) {
			return arguments.length ? (k = h(b), a) : k
		},
		a
	},
	d3.svg.diagonal = function () {
		function a(a, e) {
			var f = b.call(this, a, e),
			g = c.call(this, a, e),
			h = (f.y + g.y) / 2,
			i = [f, {
					x : f.x,
					y : h
				}, {
					x : g.x,
					y : h
				}, g];
			return i = i.map(d),
			"M" + i[0] + "C" + i[1] + " " + i[2] + " " + i[3]
		}
		var b = cB,
		c = cC,
		d = cG;
		return a.source = function (c) {
			return arguments.length ? (b = h(c), a) : b
		},
		a.target = function (b) {
			return arguments.length ? (c = h(b), a) : c
		},
		a.projection = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		a
	},
	d3.svg.diagonal.radial = function () {
		var a = d3.svg.diagonal(),
		b = cG,
		c = a.projection;
		return a.projection = function (a) {
			return arguments.length ? c(cH(b = a)) : b
		},
		a
	},
	d3.svg.mouse = d3.mouse,
	d3.svg.touches = d3.touches,
	d3.svg.symbol = function () {
		function a(a, d) {
			return (fZ.get(b.call(this, a, d)) || cK)(c.call(this, a, d))
		}
		var b = cJ,
		c = cI;
		return a.type = function (c) {
			return arguments.length ? (b = h(c), a) : b
		},
		a.size = function (b) {
			return arguments.length ? (c = h(b), a) : c
		},
		a
	};
	var fZ = d3.map({
			circle : cK,
			cross : function (a) {
				var b = Math.sqrt(a / 5) / 2;
				return "M" + -3 * b + "," + -b + "H" + -b + "V" + -3 * b + "H" + b + "V" + -b + "H" + 3 * b + "V" + b + "H" + b + "V" + 3 * b + "H" + -b + "V" + b + "H" + -3 * b + "Z"
			},
			diamond : function (a) {
				var b = Math.sqrt(a / (2 * f_)),
				c = b * f_;
				return "M0," + -b + "L" + c + ",0" + " 0," + b + " " + -c + ",0" + "Z"
			},
			square : function (a) {
				var b = Math.sqrt(a) / 2;
				return "M" + -b + "," + -b + "L" + b + "," + -b + " " + b + "," + b + " " + -b + "," + b + "Z"
			},
			"triangle-down" : function (a) {
				var b = Math.sqrt(a / f$),
				c = b * f$ / 2;
				return "M0," + c + "L" + b + "," + -c + " " + -b + "," + -c + "Z"
			},
			"triangle-up" : function (a) {
				var b = Math.sqrt(a / f$),
				c = b * f$ / 2;
				return "M0," + -c + "L" + b + "," + c + " " + -b + "," + c + "Z"
			}
		});
	d3.svg.symbolTypes = fZ.keys();
	var f$ = Math.sqrt(3),
	f_ = Math.tan(30 * Math.PI / 180);
	d3.svg.axis = function () {
		function a(a) {
			a.each(function () {
				var a = d3.select(this),
				l = i == null ? b.ticks ? b.ticks.apply(b, h) : b.domain() : i,
				m = j == null ? b.tickFormat ? b.tickFormat.apply(b, h) : String : j,
				n = cN(b, l, k),
				o = a.selectAll(".minor").data(n, String),
				p = o.enter().insert("line", "g").attr("class", "tick minor").style("opacity", 1e-6),
				q = d3.transition(o.exit()).style("opacity", 1e-6).remove(),
				r = d3.transition(o).style("opacity", 1),
				s = a.selectAll("g").data(l, String),
				t = s.enter().insert("g", "path").style("opacity", 1e-6),
				u = d3.transition(s.exit()).style("opacity", 1e-6).remove(),
				v = d3.transition(s).style("opacity", 1),
				w,
				x = bG(b),
				y = a.selectAll(".domain").data([0]),
				z = y.enter().append("path").attr("class", "domain"),
				A = d3.transition(y),
				B = b.copy(),
				C = this.__chart__ || B;
				this.__chart__ = B,
				t.append("line").attr("class", "tick"),
				t.append("text");
				var D = t.select("line"),
				E = v.select("line"),
				F = s.select("text").text(m),
				G = t.select("text"),
				H = v.select("text");
				switch (c) {
				case "bottom":
					w = cL,
					p.attr("y2", e),
					r.attr("x2", 0).attr("y2", e),
					D.attr("y2", d),
					G.attr("y", Math.max(d, 0) + g),
					E.attr("x2", 0).attr("y2", d),
					H.attr("x", 0).attr("y", Math.max(d, 0) + g),
					F.attr("dy", ".71em").attr("text-anchor", "middle"),
					A.attr("d", "M" + x[0] + "," + f + "V0H" + x[1] + "V" + f);
					break;
				case "top":
					w = cL,
					p.attr("y2", -e),
					r.attr("x2", 0).attr("y2", -e),
					D.attr("y2", -d),
					G.attr("y",  - (Math.max(d, 0) + g)),
					E.attr("x2", 0).attr("y2", -d),
					H.attr("x", 0).attr("y",  - (Math.max(d, 0) + g)),
					F.attr("dy", "0em").attr("text-anchor", "middle"),
					A.attr("d", "M" + x[0] + "," + -f + "V0H" + x[1] + "V" + -f);
					break;
				case "left":
					w = cM,
					p.attr("x2", -e),
					r.attr("x2", -e).attr("y2", 0),
					D.attr("x2", -d),
					G.attr("x",  - (Math.max(d, 0) + g)),
					E.attr("x2", -d).attr("y2", 0),
					H.attr("x",  - (Math.max(d, 0) + g)).attr("y", 0),
					F.attr("dy", ".32em").attr("text-anchor", "end"),
					A.attr("d", "M" + -f + "," + x[0] + "H0V" + x[1] + "H" + -f);
					break;
				case "right":
					w = cM,
					p.attr("x2", e),
					r.attr("x2", e).attr("y2", 0),
					D.attr("x2", d),
					G.attr("x", Math.max(d, 0) + g),
					E.attr("x2", d).attr("y2", 0),
					H.attr("x", Math.max(d, 0) + g).attr("y", 0),
					F.attr("dy", ".32em").attr("text-anchor", "start"),
					A.attr("d", "M" + f + "," + x[0] + "H0V" + x[1] + "H" + f)
				}
				if (b.ticks)
					t.call(w, C), v.call(w, B), u.call(w, B), p.call(w, C), r.call(w, B), q.call(w, B);
				else {
					var I = B.rangeBand() / 2,
					J = function (a) {
						return B(a) + I
					};
					t.call(w, J),
					v.call(w, J)
				}
			})
		}
		var b = d3.scale.linear(),
		c = "bottom",
		d = 6,
		e = 6,
		f = 6,
		g = 3,
		h = [10],
		i = null,
		j,
		k = 0;
		return a.scale = function (c) {
			return arguments.length ? (b = c, a) : b
		},
		a.orient = function (b) {
			return arguments.length ? (c = b, a) : c
		},
		a.ticks = function () {
			return arguments.length ? (h = arguments, a) : h
		},
		a.tickValues = function (b) {
			return arguments.length ? (i = b, a) : i
		},
		a.tickFormat = function (b) {
			return arguments.length ? (j = b, a) : j
		},
		a.tickSize = function (b, c, g) {
			if (!arguments.length)
				return d;
			var h = arguments.length - 1;
			return d = +b,
			e = h > 1 ? +c : d,
			f = h > 0 ? +arguments[h] : d,
			a
		},
		a.tickPadding = function (b) {
			return arguments.length ? (g = +b, a) : g
		},
		a.tickSubdivide = function (b) {
			return arguments.length ? (k = +b, a) : k
		},
		a
	},
	d3.svg.brush = function () {
		function a(f) {
			f.each(function () {
				var f = d3.select(this),
				j = f.selectAll(".background").data([0]),
				k = f.selectAll(".extent").data([0]),
				l = f.selectAll(".resize").data(i, String),
				m;
				f.style("pointer-events", "all").on("mousedown.brush", e).on("touchstart.brush", e),
				j.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair"),
				k.enter().append("rect").attr("class", "extent").style("cursor", "move"),
				l.enter().append("g").attr("class", function (a) {
					return "resize " + a
				}).style("cursor", function (a) {
					return ga[a]
				}).append("rect").attr("x", function (a) {
					return /[ew]$/.test(a) ? -3 : null
				}).attr("y", function (a) {
					return /^[ns]/.test(a) ? -3 : null
				}).attr("width", 6).attr("height", 6).style("visibility", "hidden"),
				l.style("display", a.empty() ? "none" : null),
				l.exit().remove(),
				g && (m = bG(g), j.attr("x", m[0]).attr("width", m[1] - m[0]), c(f)),
				h && (m = bG(h), j.attr("y", m[0]).attr("height", m[1] - m[0]), d(f)),
				b(f)
			})
		}
		function b(a) {
			a.selectAll(".resize").attr("transform", function (a) {
				return "translate(" + j[ + /e$/.test(a)][0] + "," + j[ + /^s/.test(a)][1] + ")"
			})
		}
		function c(a) {
			a.select(".extent").attr("x", j[0][0]),
			a.selectAll(".extent,.n>rect,.s>rect").attr("width", j[1][0] - j[0][0])
		}
		function d(a) {
			a.select(".extent").attr("y", j[0][1]),
			a.selectAll(".extent,.e>rect,.w>rect").attr("height", j[1][1] - j[0][1])
		}
		function e() {
			function e() {
				var a = d3.event.changedTouches;
				return a ? d3.touches(p, a)[0] : d3.mouse(p)
			}
			function i() {
				d3.event.keyCode == 32 && (w || (x = null, y[0] -= j[1][0], y[1] -= j[1][1], w = 2), F())
			}
			function l() {
				d3.event.keyCode == 32 && w == 2 && (y[0] += j[1][0], y[1] += j[1][1], w = 0, F())
			}
			function m() {
				var a = e(),
				f = !1;
				z && (a[0] += z[0], a[1] += z[1]),
				w || (d3.event.altKey ? (x || (x = [(j[0][0] + j[1][0]) / 2, (j[0][1] + j[1][1]) / 2]), y[0] = j[ + (a[0] < x[0])][0], y[1] = j[ + (a[1] < x[1])][1]) : x = null),
				u && n(a, g, 0) && (c(s), f = !0),
				v && n(a, h, 1) && (d(s), f = !0),
				f && (b(s), r({
						type : "brush",
						mode : w ? "move" : "resize"
					}))
			}
			function n(a, b, c) {
				var d = bG(b),
				e = d[0],
				f = d[1],
				g = y[c],
				h = j[1][c] - j[0][c],
				i,
				l;
				w && (e -= g, f -= h + g),
				i = Math.max(e, Math.min(f, a[c])),
				w ? l = (i += g) + h : (x && (g = Math.max(e, Math.min(f, 2 * x[c] - i))), g < i ? (l = i, i = g) : l = g);
				if (j[0][c] !== i || j[1][c] !== l)
					return k = null, j[0][c] = i, j[1][c] = l, !0
			}
			function o() {
				m(),
				s.style("pointer-events", "all").selectAll(".resize").style("display", a.empty() ? "none" : null),
				d3.select("body").style("cursor", null),
				A.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null),
				r({
					type : "brushend"
				}),
				F()
			}
			var p = this,
			q = d3.select(d3.event.target),
			r = f.of(p, arguments),
			s = d3.select(p),
			t = q.datum(),
			u = !/^(n|s)$/.test(t) && g,
			v = !/^(e|w)$/.test(t) && h,
			w = q.classed("extent"),
			x,
			y = e(),
			z,
			A = d3.select(window).on("mousemove.brush", m).on("mouseup.brush", o).on("touchmove.brush", m).on("touchend.brush", o).on("keydown.brush", i).on("keyup.brush", l);
			if (w)
				y[0] = j[0][0] - y[0], y[1] = j[0][1] - y[1];
			else if (t) {
				var B =  + /w$/.test(t),
				C =  + /^n/.test(t);
				z = [j[1 - B][0] - y[0], j[1 - C][1] - y[1]],
				y[0] = j[B][0],
				y[1] = j[C][1]
			} else
				d3.event.altKey && (x = y.slice());
			s.style("pointer-events", "none").selectAll(".resize").style("display", null),
			d3.select("body").style("cursor", q.style("cursor")),
			r({
				type : "brushstart"
			}),
			m(),
			F()
		}
		var f = H(a, "brushstart", "brush", "brushend"),
		g = null,
		h = null,
		i = gb[0],
		j = [[0, 0], [0, 0]],
		k;
		return a.x = function (b) {
			return arguments.length ? (g = b, i = gb[!g << 1 | !h], a) : g
		},
		a.y = function (b) {
			return arguments.length ? (h = b, i = gb[!g << 1 | !h], a) : h
		},
		a.extent = function (b) {
			var c,
			d,
			e,
			f,
			i;
			return arguments.length ? (k = [[0, 0], [0, 0]], g && (c = b[0], d = b[1], h && (c = c[0], d = d[0]), k[0][0] = c, k[1][0] = d, g.invert && (c = g(c), d = g(d)), d < c && (i = c, c = d, d = i), j[0][0] = c | 0, j[1][0] = d | 0), h && (e = b[0], f = b[1], g && (e = e[1], f = f[1]), k[0][1] = e, k[1][1] = f, h.invert && (e = h(e), f = h(f)), f < e && (i = e, e = f, f = i), j[0][1] = e | 0, j[1][1] = f | 0), a) : (b = k || j, g && (c = b[0][0], d = b[1][0], k || (c = j[0][0], d = j[1][0], g.invert && (c = g.invert(c), d = g.invert(d)), d < c && (i = c, c = d, d = i))), h && (e = b[0][1], f = b[1][1], k || (e = j[0][1], f = j[1][1], h.invert && (e = h.invert(e), f = h.invert(f)), f < e && (i = e, e = f, f = i))), g && h ? [[c, e], [d, f]] : g ? [c, d] : h && [e, f])
		},
		a.clear = function () {
			return k = null,
			j[0][0] = j[0][1] = j[1][0] = j[1][1] = 0,
			a
		},
		a.empty = function () {
			return g && j[0][0] === j[1][0] || h && j[0][1] === j[1][1]
		},
		d3.rebind(a, f, "on")
	};
	var ga = {
		n : "ns-resize",
		e : "ew-resize",
		s : "ns-resize",
		w : "ew-resize",
		nw : "nwse-resize",
		ne : "nesw-resize",
		se : "nwse-resize",
		sw : "nesw-resize"
	},
	gb = [["n", "e", "s", "w", "nw", "ne", "se", "sw"], ["e", "w"], ["n", "s"], []];
	d3.behavior = {},
	d3.behavior.drag = function () {
		function a() {
			this.on("mousedown.drag", b).on("touchstart.drag", b)
		}
		function b() {
			function a() {
				var a = g.parentNode,
				b = d3.event.changedTouches;
				return b ? d3.touches(a, b)[0] : d3.mouse(a)
			}
			function b() {
				if (!g.parentNode)
					return e();
				var b = a(),
				c = b[0] - k[0],
				d = b[1] - k[1];
				l |= c | d,
				k = b,
				F(),
				h({
					type : "drag",
					x : b[0] + j[0],
					y : b[1] + j[1],
					dx : c,
					dy : d
				})
			}
			function e() {
				h({
					type : "dragend"
				}),
				l && (F(), d3.event.target === i && m.on("click.drag", f, !0)),
				m.on("mousemove.drag", null).on("touchmove.drag", null).on("mouseup.drag", null).on("touchend.drag", null)
			}
			function f() {
				F(),
				m.on("click.drag", null)
			}
			var g = this,
			h = c.of(g, arguments),
			i = d3.event.target,
			j,
			k = a(),
			l = 0,
			m = d3.select(window).on("mousemove.drag", b).on("touchmove.drag", b).on("mouseup.drag", e, !0).on("touchend.drag", e, !0);
			d ? (j = d.apply(g, arguments), j = [j.x - k[0], j.y - k[1]]) : j = [0, 0],
			F(),
			h({
				type : "dragstart"
			})
		}
		var c = H(a, "drag", "dragstart", "dragend"),
		d = null;
		return a.origin = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		d3.rebind(a, c, "on")
	},
	d3.behavior.zoom = function () {
		function a() {
			this.on("mousedown.zoom", g).on("mousewheel.zoom", h).on("mousemove.zoom", i).on("DOMMouseScroll.zoom", h).on("dblclick.zoom", j).on("touchstart.zoom", k).on("touchmove.zoom", l).on("touchend.zoom", k)
		}
		function b(a) {
			return [(a[0] - m[0]) / o, (a[1] - m[1]) / o]
		}
		function c(a) {
			return [a[0] * o + m[0], a[1] * o + m[1]]
		}
		function d(a) {
			o = Math.max(q[0], Math.min(q[1], a))
		}
		function e(a, b) {
			b = c(b),
			m[0] += a[0] - b[0],
			m[1] += a[1] - b[1]
		}
		function f(a) {
			t && t.domain(s.range().map(function (a) {
					return (a - m[0]) / o
				}).map(s.invert)),
			v && v.domain(u.range().map(function (a) {
					return (a - m[1]) / o
				}).map(u.invert)),
			d3.event.preventDefault(),
			a({
				type : "zoom",
				scale : o,
				translate : m
			})
		}
		function g() {
			function a() {
				j = 1,
				e(d3.mouse(g), l),
				f(h)
			}
			function c() {
				j && F(),
				k.on("mousemove.zoom", null).on("mouseup.zoom", null),
				j && d3.event.target === i && k.on("click.zoom", d, !0)
			}
			function d() {
				F(),
				k.on("click.zoom", null)
			}
			var g = this,
			h = r.of(g, arguments),
			i = d3.event.target,
			j = 0,
			k = d3.select(window).on("mousemove.zoom", a).on("mouseup.zoom", c),
			l = b(d3.mouse(g));
			window.focus(),
			F()
		}
		function h() {
			n || (n = b(d3.mouse(this))),
			d(Math.pow(2, cO() * .002) * o),
			e(d3.mouse(this), n),
			f(r.of(this, arguments))
		}
		function i() {
			n = null
		}
		function j() {
			var a = d3.mouse(this),
			c = b(a);
			d(d3.event.shiftKey ? o / 2 : o * 2),
			e(a, c),
			f(r.of(this, arguments))
		}
		function k() {
			var a = d3.touches(this),
			c = Date.now();
			p = o,
			n = {},
			a.forEach(function (a) {
				n[a.identifier] = b(a)
			}),
			F();
			if (a.length === 1) {
				if (c - w < 500) {
					var g = a[0],
					h = b(a[0]);
					d(o * 2),
					e(g, h),
					f(r.of(this, arguments))
				}
				w = c
			}
		}
		function l() {
			var a = d3.touches(this),
			b = a[0],
			c = n[b.identifier];
			if (g = a[1]) {
				var g,
				h = n[g.identifier];
				b = [(b[0] + g[0]) / 2, (b[1] + g[1]) / 2],
				c = [(c[0] + h[0]) / 2, (c[1] + h[1]) / 2],
				d(d3.event.scale * p)
			}
			e(b, c),
			w = null,
			f(r.of(this, arguments))
		}
		var m = [0, 0],
		n,
		o = 1,
		p,
		q = gd,
		r = H(a, "zoom"),
		s,
		t,
		u,
		v,
		w;
		return a.translate = function (b) {
			return arguments.length ? (m = b.map(Number), a) : m
		},
		a.scale = function (b) {
			return arguments.length ? (o = +b, a) : o
		},
		a.scaleExtent = function (b) {
			return arguments.length ? (q = b == null ? gd : b.map(Number), a) : q
		},
		a.x = function (b) {
			return arguments.length ? (t = b, s = b.copy(), a) : t
		},
		a.y = function (b) {
			return arguments.length ? (v = b, u = b.copy(), a) : v
		},
		d3.rebind(a, r, "on")
	};
	var gc,
	gd = [0, Infinity];
	d3.layout = {},
	d3.layout.bundle = function () {
		return function (a) {
			var b = [],
			c = -1,
			d = a.length;
			while (++c < d)
				b.push(cP(a[c]));
			return b
		}
	},
	d3.layout.chord = function () {
		function a() {
			var a = {},
			c = [],
			l = d3.range(g),
			m = [],
			n,
			o,
			p,
			q,
			r;
			d = [],
			e = [],
			n = 0,
			q = -1;
			while (++q < g) {
				o = 0,
				r = -1;
				while (++r < g)
					o += f[q][r];
				c.push(o),
				m.push(d3.range(g)),
				n += o
			}
			i && l.sort(function (a, b) {
				return i(c[a], c[b])
			}),
			j && m.forEach(function (a, b) {
				a.sort(function (a, c) {
					return j(f[b][a], f[b][c])
				})
			}),
			n = (2 * Math.PI - h * g) / n,
			o = 0,
			q = -1;
			while (++q < g) {
				p = o,
				r = -1;
				while (++r < g) {
					var s = l[q],
					t = m[s][r],
					u = f[s][t],
					v = o,
					w = o += u * n;
					a[s + "-" + t] = {
						index : s,
						subindex : t,
						startAngle : v,
						endAngle : w,
						value : u
					}
				}
				e[s] = {
					index : s,
					startAngle : p,
					endAngle : o,
					value : (o - p) / n
				},
				o += h
			}
			q = -1;
			while (++q < g) {
				r = q - 1;
				while (++r < g) {
					var x = a[q + "-" + r],
					y = a[r + "-" + q];
					(x.value || y.value) && d.push(x.value < y.value ? {
						source : y,
						target : x
					}
						 : {
						source : x,
						target : y
					})
				}
			}
			k && b()
		}
		function b() {
			d.sort(function (a, b) {
				return k((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2)
			})
		}
		var c = {},
		d,
		e,
		f,
		g,
		h = 0,
		i,
		j,
		k;
		return c.matrix = function (a) {
			return arguments.length ? (g = (f = a) && f.length, d = e = null, c) : f
		},
		c.padding = function (a) {
			return arguments.length ? (h = a, d = e = null, c) : h
		},
		c.sortGroups = function (a) {
			return arguments.length ? (i = a, d = e = null, c) : i
		},
		c.sortSubgroups = function (a) {
			return arguments.length ? (j = a, d = null, c) : j
		},
		c.sortChords = function (a) {
			return arguments.length ? (k = a, d && b(), c) : k
		},
		c.chords = function () {
			return d || a(),
			d
		},
		c.groups = function () {
			return e || a(),
			e
		},
		c
	},
	d3.layout.force = function () {
		function a(a) {
			return function (b, c, d, e, f) {
				if (b.point !== a) {
					var g = b.cx - a.x,
					h = b.cy - a.y,
					i = 1 / Math.sqrt(g * g + h * h);
					if ((e - c) * i < o) {
						var j = b.charge * i * i;
						return a.px -= g * j,
						a.py -= h * j,
						!0
					}
					if (b.point && isFinite(i)) {
						var j = b.pointCharge * i * i;
						a.px -= g * j,
						a.py -= h * j
					}
				}
				return !b.charge
			}
		}
		function b(a) {
			cS(gf = a),
			ge = c
		}
		var c = {},
		d = d3.dispatch("start", "tick", "end"),
		f = [1, 1],
		g,
		i,
		j = .9,
		k = cX,
		l = cY,
		m = -30,
		n = .1,
		o = .8,
		p,
		q = [],
		r = [],
		s,
		t,
		u;
		return c.tick = function () {
			if ((i *= .99) < .005)
				return d.end({
					type : "end",
					alpha : i = 0
				}), !0;
			var b = q.length,
			c = r.length,
			e,
			g,
			h,
			k,
			l,
			o,
			p,
			v,
			w;
			for (g = 0; g < c; ++g) {
				h = r[g],
				k = h.source,
				l = h.target,
				v = l.x - k.x,
				w = l.y - k.y;
				if (o = v * v + w * w)
					o = i * t[g] * ((o = Math.sqrt(o)) - s[g]) / o, v *= o, w *= o, l.x -= v * (p = k.weight / (l.weight + k.weight)), l.y -= w * p, k.x += v * (p = 1 - p), k.y += w * p
			}
			if (p = i * n) {
				v = f[0] / 2,
				w = f[1] / 2,
				g = -1;
				if (p)
					while (++g < b)
						h = q[g], h.x += (v - h.x) * p, h.y += (w - h.y) * p
			}
			if (m) {
				cW(e = d3.geom.quadtree(q), i, u),
				g = -1;
				while (++g < b)
					(h = q[g]).fixed || e.visit(a(h))
			}
			g = -1;
			while (++g < b)
				h = q[g], h.fixed ? (h.x = h.px, h.y = h.py) : (h.x -= (h.px - (h.px = h.x)) * j, h.y -= (h.py - (h.py = h.y)) * j);
			d.tick({
				type : "tick",
				alpha : i
			})
		},
		c.nodes = function (a) {
			return arguments.length ? (q = a, c) : q
		},
		c.links = function (a) {
			return arguments.length ? (r = a, c) : r
		},
		c.size = function (a) {
			return arguments.length ? (f = a, c) : f
		},
		c.linkDistance = function (a) {
			return arguments.length ? (k = h(a), c) : k
		},
		c.distance = c.linkDistance,
		c.linkStrength = function (a) {
			return arguments.length ? (l = h(a), c) : l
		},
		c.friction = function (a) {
			return arguments.length ? (j = a, c) : j
		},
		c.charge = function (a) {
			return arguments.length ? (m = typeof a == "function" ? a : +a, c) : m
		},
		c.gravity = function (a) {
			return arguments.length ? (n = a, c) : n
		},
		c.theta = function (a) {
			return arguments.length ? (o = a, c) : o
		},
		c.alpha = function (a) {
			return arguments.length ? (i ? a > 0 ? i = a : i = 0 : a > 0 && (d.start({
							type : "start",
							alpha : i = a
						}), d3.timer(c.tick)), c) : i
		},
		c.start = function () {
			function a(a, c) {
				var e = b(d),
				f = -1,
				g = e.length,
				h;
				while (++f < g)
					if (!isNaN(h = e[f][a]))
						return h;
				return Math.random() * c
			}
			function b() {
				if (!n) {
					n = [];
					for (e = 0; e < g; ++e)
						n[e] = [];
					for (e = 0; e < h; ++e) {
						var a = r[e];
						n[a.source.index].push(a.target),
						n[a.target.index].push(a.source)
					}
				}
				return n[d]
			}
			var d,
			e,
			g = q.length,
			h = r.length,
			i = f[0],
			j = f[1],
			n,
			o;
			for (d = 0; d < g; ++d)
				(o = q[d]).index = d, o.weight = 0;
			s = [],
			t = [];
			for (d = 0; d < h; ++d)
				o = r[d], typeof o.source == "number" && (o.source = q[o.source]), typeof o.target == "number" && (o.target = q[o.target]), s[d] = k.call(this, o, d), t[d] = l.call(this, o, d), ++o.source.weight, ++o.target.weight;
			for (d = 0; d < g; ++d)
				o = q[d], isNaN(o.x) && (o.x = a("x", i)), isNaN(o.y) && (o.y = a("y", j)), isNaN(o.px) && (o.px = o.x), isNaN(o.py) && (o.py = o.y);
			u = [];
			if (typeof m == "function")
				for (d = 0; d < g; ++d)
					u[d] = +m.call(this, q[d], d);
			else
				for (d = 0; d < g; ++d)
					u[d] = m;
			return c.resume()
		},
		c.resume = function () {
			return c.alpha(.1)
		},
		c.stop = function () {
			return c.alpha(0)
		},
		c.drag = function () {
			g || (g = d3.behavior.drag().origin(e).on("dragstart", b).on("drag", cV).on("dragend", cU)),
			this.on("mouseover.force", cS).on("mouseout.force", cT).call(g)
		},
		d3.rebind(c, d, "on")
	};
	var ge,
	gf;
	d3.layout.partition = function () {
		function a(b, c, d, e) {
			var f = b.children;
			b.x = c,
			b.y = b.depth * e,
			b.dx = d,
			b.dy = e;
			if (f && (h = f.length)) {
				var g = -1,
				h,
				i,
				j;
				d = b.value ? d / b.value : 0;
				while (++g < h)
					a(i = f[g], c, j = i.value * d, e), c += j
			}
		}
		function b(a) {
			var c = a.children,
			d = 0;
			if (c && (f = c.length)) {
				var e = -1,
				f;
				while (++e < f)
					d = Math.max(d, b(c[e]))
			}
			return 1 + d
		}
		function c(c, f) {
			var g = d.call(this, c, f);
			return a(g[0], 0, e[0], e[1] / b(g[0])),
			g
		}
		var d = d3.layout.hierarchy(),
		e = [1, 1];
		return c.size = function (a) {
			return arguments.length ? (e = a, c) : e
		},
		di(c, d)
	},
	d3.layout.pie = function () {
		function a(f, g) {
			var h = f.map(function (c, d) {
					return +b.call(a, c, d)
				}),
			i =  + (typeof d == "function" ? d.apply(this, arguments) : d),
			j = ((typeof e == "function" ? e.apply(this, arguments) : e) - d) / d3.sum(h),
			k = d3.range(f.length);
			c != null && k.sort(c === gg ? function (a, b) {
				return h[b] - h[a]
			}
				 : function (a, b) {
				return c(f[a], f[b])
			});
			var l = [];
			return k.forEach(function (a) {
				var b;
				l[a] = {
					data : f[a],
					value : b = h[a],
					startAngle : i,
					endAngle : i += b * j
				}
			}),
			l
		}
		var b = Number,
		c = gg,
		d = 0,
		e = 2 * Math.PI;
		return a.value = function (c) {
			return arguments.length ? (b = c, a) : b
		},
		a.sort = function (b) {
			return arguments.length ? (c = b, a) : c
		},
		a.startAngle = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		a.endAngle = function (b) {
			return arguments.length ? (e = b, a) : e
		},
		a
	};
	var gg = {};
	d3.layout.stack = function () {
		function a(e, i) {
			var j = e.map(function (c, d) {
					return b.call(a, c, d)
				}),
			k = j.map(function (b, c) {
					return b.map(function (b, c) {
						return [g.call(a, b, c), h.call(a, b, c)]
					})
				}),
			l = c.call(a, k, i);
			j = d3.permute(j, l),
			k = d3.permute(k, l);
			var m = d.call(a, k, i),
			n = j.length,
			o = j[0].length,
			p,
			q,
			r;
			for (q = 0; q < o; ++q) {
				f.call(a, j[0][q], r = m[q], k[0][q][1]);
				for (p = 1; p < n; ++p)
					f.call(a, j[p][q], r += k[p - 1][q][1], k[p][q][1])
			}
			return e
		}
		var b = e,
		c = da,
		d = db,
		f = c_,
		g = cZ,
		h = c$;
		return a.values = function (c) {
			return arguments.length ? (b = c, a) : b
		},
		a.order = function (b) {
			return arguments.length ? (c = typeof b == "function" ? b : gh.get(b) || da, a) : c
		},
		a.offset = function (b) {
			return arguments.length ? (d = typeof b == "function" ? b : gi.get(b) || db, a) : d
		},
		a.x = function (b) {
			return arguments.length ? (g = b, a) : g
		},
		a.y = function (b) {
			return arguments.length ? (h = b, a) : h
		},
		a.out = function (b) {
			return arguments.length ? (f = b, a) : f
		},
		a
	};
	var gh = d3.map({
			"inside-out" : function (a) {
				var b = a.length,
				c,
				d,
				e = a.map(dc),
				f = a.map(dd),
				g = d3.range(b).sort(function (a, b) {
						return e[a] - e[b]
					}),
				h = 0,
				i = 0,
				j = [],
				k = [];
				for (c = 0; c < b; ++c)
					d = g[c], h < i ? (h += f[d], j.push(d)) : (i += f[d], k.push(d));
				return k.reverse().concat(j)
			},
			reverse : function (a) {
				return d3.range(a.length).reverse()
			},
			"default" : da
		}),
	gi = d3.map({
			silhouette : function (a) {
				var b = a.length,
				c = a[0].length,
				d = [],
				e = 0,
				f,
				g,
				h,
				i = [];
				for (g = 0; g < c; ++g) {
					for (f = 0, h = 0; f < b; f++)
						h += a[f][g][1];
					h > e && (e = h),
					d.push(h)
				}
				for (g = 0; g < c; ++g)
					i[g] = (e - d[g]) / 2;
				return i
			},
			wiggle : function (a) {
				var b = a.length,
				c = a[0],
				d = c.length,
				e = 0,
				f,
				g,
				h,
				i,
				j,
				k,
				l,
				m,
				n,
				o = [];
				o[0] = m = n = 0;
				for (g = 1; g < d; ++g) {
					for (f = 0, i = 0; f < b; ++f)
						i += a[f][g][1];
					for (f = 0, j = 0, l = c[g][0] - c[g - 1][0]; f < b; ++f) {
						for (h = 0, k = (a[f][g][1] - a[f][g - 1][1]) / (2 * l); h < f; ++h)
							k += (a[h][g][1] - a[h][g - 1][1]) / l;
						j += k * a[f][g][1]
					}
					o[g] = m -= i ? j / i * l : 0,
					m < n && (n = m)
				}
				for (g = 0; g < d; ++g)
					o[g] -= n;
				return o
			},
			expand : function (a) {
				var b = a.length,
				c = a[0].length,
				d = 1 / b,
				e,
				f,
				g,
				h = [];
				for (f = 0; f < c; ++f) {
					for (e = 0, g = 0; e < b; e++)
						g += a[e][f][1];
					if (g)
						for (e = 0; e < b; e++)
							a[e][f][1] /= g;
					else
						for (e = 0; e < b; e++)
							a[e][f][1] = d
				}
				for (f = 0; f < c; ++f)
					h[f] = 0;
				return h
			},
			zero : db
		});
	d3.layout.histogram = function () {
		function a(a, f) {
			var g = [],
			h = a.map(c, this),
			i = d.call(this, h, f),
			j = e.call(this, i, h, f),
			k,
			f = -1,
			l = h.length,
			m = j.length - 1,
			n = b ? 1 : 1 / l,
			o;
			while (++f < m)
				k = g[f] = [], k.dx = j[f + 1] - (k.x = j[f]), k.y = 0;
			if (m > 0) {
				f = -1;
				while (++f < l)
					o = h[f], o >= i[0] && o <= i[1] && (k = g[d3.bisect(j, o, 1, m) - 1], k.y += n, k.push(a[f]))
			}
			return g
		}
		var b = !0,
		c = Number,
		d = dh,
		e = df;
		return a.value = function (b) {
			return arguments.length ? (c = b, a) : c
		},
		a.range = function (b) {
			return arguments.length ? (d = h(b), a) : d
		},
		a.bins = function (b) {
			return arguments.length ? (e = typeof b == "number" ? function (a) {
				return dg(a, b)
			}
				 : h(b), a) : e
		},
		a.frequency = function (c) {
			return arguments.length ? (b = !!c, a) : b
		},
		a
	},
	d3.layout.hierarchy = function () {
		function a(b, g, h) {
			var i = e.call(c, b, g),
			j = gj ? b : {
				data : b
			};
			j.depth = g,
			h.push(j);
			if (i && (l = i.length)) {
				var k = -1,
				l,
				m = j.children = [],
				n = 0,
				o = g + 1,
				p;
				while (++k < l)
					p = a(i[k], o, h), p.parent = j, m.push(p), n += p.value;
				d && m.sort(d),
				f && (j.value = n)
			} else
				f && (j.value = +f.call(c, b, g) || 0);
			return j
		}
		function b(a, d) {
			var e = a.children,
			g = 0;
			if (e && (i = e.length)) {
				var h = -1,
				i,
				j = d + 1;
				while (++h < i)
					g += b(e[h], j)
			} else
				f && (g = +f.call(c, gj ? a : a.data, d) || 0);
			return f && (a.value = g),
			g
		}
		function c(b) {
			var c = [];
			return a(b, 0, c),
			c
		}
		var d = dl,
		e = dj,
		f = dk;
		return c.sort = function (a) {
			return arguments.length ? (d = a, c) : d
		},
		c.children = function (a) {
			return arguments.length ? (e = a, c) : e
		},
		c.value = function (a) {
			return arguments.length ? (f = a, c) : f
		},
		c.revalue = function (a) {
			return b(a, 0),
			a
		},
		c
	};
	var gj = !1;
	d3.layout.pack = function () {
		function a(a, e) {
			var f = b.call(this, a, e),
			g = f[0];
			g.x = 0,
			g.y = 0,
			dI(g, function (a) {
				a.r = Math.sqrt(a.value)
			}),
			dI(g, ds);
			var h = d[0],
			i = d[1],
			j = Math.max(2 * g.r / h, 2 * g.r / i);
			if (c > 0) {
				var k = c * j / 2;
				dI(g, function (a) {
					a.r += k
				}),
				dI(g, ds),
				dI(g, function (a) {
					a.r -= k
				}),
				j = Math.max(2 * g.r / h, 2 * g.r / i)
			}
			return dv(g, h / 2, i / 2, 1 / j),
			f
		}
		var b = d3.layout.hierarchy().sort(dn),
		c = 0,
		d = [1, 1];
		return a.size = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		a.padding = function (b) {
			return arguments.length ? (c = +b, a) : c
		},
		di(a, b)
	},
	d3.layout.cluster = function () {
		function a(a, e) {
			var f = b.call(this, a, e),
			g = f[0],
			h,
			i = 0,
			j,
			k;
			dI(g, function (a) {
				var b = a.children;
				b && b.length ? (a.x = dy(b), a.y = dx(b)) : (a.x = h ? i += c(a, h) : 0, a.y = 0, h = a)
			});
			var l = dz(g),
			m = dA(g),
			n = l.x - c(l, m) / 2,
			o = m.x + c(m, l) / 2;
			return dI(g, function (a) {
				a.x = (a.x - n) / (o - n) * d[0],
				a.y = (1 - (g.y ? a.y / g.y : 1)) * d[1]
			}),
			f
		}
		var b = d3.layout.hierarchy().sort(null).value(null),
		c = dB,
		d = [1, 1];
		return a.separation = function (b) {
			return arguments.length ? (c = b, a) : c
		},
		a.size = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		di(a, b)
	},
	d3.layout.tree = function () {
		function a(a, e) {
			function f(a, b) {
				var d = a.children,
				e = a._tree;
				if (d && (g = d.length)) {
					var g,
					i = d[0],
					j,
					k = i,
					l,
					m = -1;
					while (++m < g)
						l = d[m], f(l, j), k = h(l, j, k), j = l;
					dJ(a);
					var n = .5 * (i._tree.prelim + l._tree.prelim);
					b ? (e.prelim = b._tree.prelim + c(a, b), e.mod = e.prelim - n) : e.prelim = n
				} else
					b && (e.prelim = b._tree.prelim + c(a, b))
			}
			function g(a, b) {
				a.x = a._tree.prelim + b;
				var c = a.children;
				if (c && (e = c.length)) {
					var d = -1,
					e;
					b += a._tree.mod;
					while (++d < e)
						g(c[d], b)
				}
			}
			function h(a, b, d) {
				if (b) {
					var e = a,
					f = a,
					g = b,
					h = a.parent.children[0],
					i = e._tree.mod,
					j = f._tree.mod,
					k = g._tree.mod,
					l = h._tree.mod,
					m;
					while (g = dD(g), e = dC(e), g && e)
						h = dC(h), f = dD(f), f._tree.ancestor = a, m = g._tree.prelim + k - e._tree.prelim - i + c(g, e), m > 0 && (dK(dL(g, a, d), a, m), i += m, j += m), k += g._tree.mod, i += e._tree.mod, l += h._tree.mod, j += f._tree.mod;
					g && !dD(f) && (f._tree.thread = g, f._tree.mod += k - j),
					e && !dC(h) && (h._tree.thread = e, h._tree.mod += i - l, d = a)
				}
				return d
			}
			var i = b.call(this, a, e),
			j = i[0];
			dI(j, function (a, b) {
				a._tree = {
					ancestor : a,
					prelim : 0,
					mod : 0,
					change : 0,
					shift : 0,
					number : b ? b._tree.number + 1 : 0
				}
			}),
			f(j),
			g(j, -j._tree.prelim);
			var k = dE(j, dG),
			l = dE(j, dF),
			m = dE(j, dH),
			n = k.x - c(k, l) / 2,
			o = l.x + c(l, k) / 2,
			p = m.depth || 1;
			return dI(j, function (a) {
				a.x = (a.x - n) / (o - n) * d[0],
				a.y = a.depth / p * d[1],
				delete a._tree
			}),
			i
		}
		var b = d3.layout.hierarchy().sort(null).value(null),
		c = dB,
		d = [1, 1];
		return a.separation = function (b) {
			return arguments.length ? (c = b, a) : c
		},
		a.size = function (b) {
			return arguments.length ? (d = b, a) : d
		},
		di(a, b)
	},
	d3.layout.treemap = function () {
		function a(a, b) {
			var c = -1,
			d = a.length,
			e,
			f;
			while (++c < d)
				f = (e = a[c]).value * (b < 0 ? 0 : b), e.area = isNaN(f) || f <= 0 ? 0 : f
		}
		function b(c) {
			var f = c.children;
			if (f && f.length) {
				var g = k(c),
				h = [],
				i = f.slice(),
				j,
				l = Infinity,
				m,
				n = Math.min(g.dx, g.dy),
				o;
				a(i, g.dx * g.dy / c.value),
				h.area = 0;
				while ((o = i.length) > 0)
					h.push(j = i[o - 1]), h.area += j.area, (m = d(h, n)) <= l ? (i.pop(), l = m) : (h.area -= h.pop().area, e(h, n, g, !1), n = Math.min(g.dx, g.dy), h.length = h.area = 0, l = Infinity);
				h.length && (e(h, n, g, !0), h.length = h.area = 0),
				f.forEach(b)
			}
		}
		function c(b) {
			var d = b.children;
			if (d && d.length) {
				var f = k(b),
				g = d.slice(),
				h,
				i = [];
				a(g, f.dx * f.dy / b.value),
				i.area = 0;
				while (h = g.pop())
					i.push(h), i.area += h.area, h.z != null && (e(i, h.z ? f.dx : f.dy, f, !g.length), i.length = i.area = 0);
				d.forEach(c)
			}
		}
		function d(a, b) {
			var c = a.area,
			d,
			e = 0,
			f = Infinity,
			g = -1,
			h = a.length;
			while (++g < h) {
				if (!(d = a[g].area))
					continue;
				d < f && (f = d),
				d > e && (e = d)
			}
			return c *= c,
			b *= b,
			c ? Math.max(b * e * n / c, c / (b * f * n)) : Infinity
		}
		function e(a, b, c, d) {
			var e = -1,
			f = a.length,
			g = c.x,
			i = c.y,
			j = b ? h(a.area / b) : 0,
			k;
			if (b == c.dx) {
				if (d || j > c.dy)
					j = c.dy;
				while (++e < f)
					k = a[e], k.x = g, k.y = i, k.dy = j, g += k.dx = Math.min(c.x + c.dx - g, j ? h(k.area / j) : 0);
				k.z = !0,
				k.dx += c.x + c.dx - g,
				c.y += j,
				c.dy -= j
			} else {
				if (d || j > c.dx)
					j = c.dx;
				while (++e < f)
					k = a[e], k.x = g, k.y = i, k.dx = j, i += k.dy = Math.min(c.y + c.dy - i, j ? h(k.area / j) : 0);
				k.z = !1,
				k.dy += c.y + c.dy - i,
				c.x += j,
				c.dx -= j
			}
		}
		function f(d) {
			var e = m || g(d),
			f = e[0];
			return f.x = 0,
			f.y = 0,
			f.dx = i[0],
			f.dy = i[1],
			m && g.revalue(f),
			a([f], f.dx * f.dy / f.value),
			(m ? c : b)(f),
			l && (m = e),
			e
		}
		var g = d3.layout.hierarchy(),
		h = Math.round,
		i = [1, 1],
		j = null,
		k = dM,
		l = !1,
		m,
		n = .5 * (1 + Math.sqrt(5));
		return f.size = function (a) {
			return arguments.length ? (i = a, f) : i
		},
		f.padding = function (a) {
			function b(b) {
				var c = a.call(f, b, b.depth);
				return c == null ? dM(b) : dN(b, typeof c == "number" ? [c, c, c, c] : c)
			}
			function c(b) {
				return dN(b, a)
			}
			if (!arguments.length)
				return j;
			var d;
			return k = (j = a) == null ? dM : (d = typeof a) === "function" ? b : d === "number" ? (a = [a, a, a, a], c) : c,
			f
		},
		f.round = function (a) {
			return arguments.length ? (h = a ? Math.round : Number, f) : h != Number
		},
		f.sticky = function (a) {
			return arguments.length ? (l = a, m = null, f) : l
		},
		f.ratio = function (a) {
			return arguments.length ? (n = a, f) : n
		},
		di(f, g)
	},
	d3.csv = dO(",", "text/csv"),
	d3.tsv = dO("\t", "text/tab-separated-values"),
	d3.geo = {};
	var gk = Math.PI / 180;
	d3.geo.azimuthal = function () {
		function a(a) {
			var c = a[0] * gk - f,
			g = a[1] * gk,
			j = Math.cos(c),
			k = Math.sin(c),
			l = Math.cos(g),
			m = Math.sin(g),
			n = b !== "orthographic" ? i * m + h * l * j : null,
			o,
			p = b === "stereographic" ? 1 / (1 + n) : b === "gnomonic" ? 1 / n : b === "equidistant" ? (o = Math.acos(n), o ? o / Math.sin(o) : 0) : b === "equalarea" ? Math.sqrt(2 / (1 + n)) : 1,
			q = p * l * k,
			r = p * (i * l * j - h * m);
			return [d * q + e[0], d * r + e[1]]
		}
		var b = "orthographic",
		c,
		d = 200,
		e = [480, 250],
		f,
		g,
		h,
		i;
		return a.invert = function (a) {
			var c = (a[0] - e[0]) / d,
			g = (a[1] - e[1]) / d,
			j = Math.sqrt(c * c + g * g),
			k = b === "stereographic" ? 2 * Math.atan(j) : b === "gnomonic" ? Math.atan(j) : b === "equidistant" ? j : b === "equalarea" ? 2 * Math.asin(.5 * j) : Math.asin(j),
			l = Math.sin(k),
			m = Math.cos(k);
			return [(f + Math.atan2(c * l, j * h * m + g * i * l)) / gk, Math.asin(m * i - (j ? g * l * h / j : 0)) / gk]
		},
		a.mode = function (c) {
			return arguments.length ? (b = c + "", a) : b
		},
		a.origin = function (b) {
			return arguments.length ? (c = b, f = c[0] * gk, g = c[1] * gk, h = Math.cos(g), i = Math.sin(g), a) : c
		},
		a.scale = function (b) {
			return arguments.length ? (d = +b, a) : d
		},
		a.translate = function (b) {
			return arguments.length ? (e = [+b[0], +b[1]], a) : e
		},
		a.origin([0, 0])
	},
	d3.geo.albers = function () {
		function a(a) {
			var b = h * (gk * a[0] - g),
			c = Math.sqrt(i - 2 * h * Math.sin(gk * a[1])) / h;
			return [e * c * Math.sin(b) + f[0], e * (c * Math.cos(b) - j) + f[1]]
		}
		function b() {
			var b = gk * d[0],
			e = gk * d[1],
			f = gk * c[1],
			k = Math.sin(b),
			l = Math.cos(b);
			return g = gk * c[0],
			h = .5 * (k + Math.sin(e)),
			i = l * l + 2 * h * k,
			j = Math.sqrt(i - 2 * h * Math.sin(f)) / h,
			a
		}
		var c = [-98, 38],
		d = [29.5, 45.5],
		e = 1e3,
		f = [480, 250],
		g,
		h,
		i,
		j;
		return a.invert = function (a) {
			var b = (a[0] - f[0]) / e,
			c = (a[1] - f[1]) / e,
			d = j + c,
			k = Math.atan2(b, d),
			l = Math.sqrt(b * b + d * d);
			return [(g + k / h) / gk, Math.asin((i - l * l * h * h) / (2 * h)) / gk]
		},
		a.origin = function (a) {
			return arguments.length ? (c = [+a[0], +a[1]], b()) : c
		},
		a.parallels = function (a) {
			return arguments.length ? (d = [+a[0], +a[1]], b()) : d
		},
		a.scale = function (b) {
			return arguments.length ? (e = +b, a) : e
		},
		a.translate = function (b) {
			return arguments.length ? (f = [+b[0], +b[1]], a) : f
		},
		b()
	},
	d3.geo.albersUsa = function () {
		function a(a) {
			var f = a[0],
			g = a[1];
			return (g > 50 ? c : f < -140 ? d : g < 21 ? e : b)(a)
		}
		var b = d3.geo.albers(),
		c = d3.geo.albers().origin([-160, 60]).parallels([55, 65]),
		d = d3.geo.albers().origin([-160, 20]).parallels([8, 18]),
		e = d3.geo.albers().origin([-60, 10]).parallels([8, 18]);
		return a.scale = function (f) {
			return arguments.length ? (b.scale(f), c.scale(f * .6), d.scale(f), e.scale(f * 1.5), a.translate(b.translate())) : b.scale()
		},
		a.translate = function (f) {
			if (!arguments.length)
				return b.translate();
			var g = b.scale() / 1e3,
			h = f[0],
			i = f[1];
			return b.translate(f),
			c.translate([h - 400 * g, i + 170 * g]),
			d.translate([h - 190 * g, i + 200 * g]),
			e.translate([h + 580 * g, i + 430 * g]),
			a
		},
		a.scale(b.scale())
	},
	d3.geo.bonne = function () {
		function a(a) {
			var h = a[0] * gk - d,
			i = a[1] * gk - e;
			if (f) {
				var j = g + f - i,
				k = h * Math.cos(i) / j;
				h = j * Math.sin(k),
				i = j * Math.cos(k) - g
			} else
				h *= Math.cos(i), i *= -1;
			return [b * h + c[0], b * i + c[1]]
		}
		var b = 200,
		c = [480, 250],
		d,
		e,
		f,
		g;
		return a.invert = function (a) {
			var e = (a[0] - c[0]) / b,
			h = (a[1] - c[1]) / b;
			if (f) {
				var i = g + h,
				j = Math.sqrt(e * e + i * i);
				h = g + f - j,
				e = d + j * Math.atan2(e, i) / Math.cos(h)
			} else
				h *= -1, e /= Math.cos(h);
			return [e / gk, h / gk]
		},
		a.parallel = function (b) {
			return arguments.length ? (g = 1 / Math.tan(f = b * gk), a) : f / gk
		},
		a.origin = function (b) {
			return arguments.length ? (d = b[0] * gk, e = b[1] * gk, a) : [d / gk, e / gk]
		},
		a.scale = function (c) {
			return arguments.length ? (b = +c, a) : b
		},
		a.translate = function (b) {
			return arguments.length ? (c = [+b[0], +b[1]], a) : c
		},
		a.origin([0, 0]).parallel(45)
	},
	d3.geo.equirectangular = function () {
		function a(a) {
			var d = a[0] / 360,
			e = -a[1] / 360;
			return [b * d + c[0], b * e + c[1]]
		}
		var b = 500,
		c = [480, 250];
		return a.invert = function (a) {
			var d = (a[0] - c[0]) / b,
			e = (a[1] - c[1]) / b;
			return [360 * d, -360 * e]
		},
		a.scale = function (c) {
			return arguments.length ? (b = +c, a) : b
		},
		a.translate = function (b) {
			return arguments.length ? (c = [+b[0], +b[1]], a) : c
		},
		a
	},
	d3.geo.mercator = function () {
		function a(a) {
			var d = a[0] / 360,
			e =  - (Math.log(Math.tan(Math.PI / 4 + a[1] * gk / 2)) / gk) / 360;
			return [b * d + c[0], b * Math.max(-0.5, Math.min(.5, e)) + c[1]]
		}
		var b = 500,
		c = [480, 250];
		return a.invert = function (a) {
			var d = (a[0] - c[0]) / b,
			e = (a[1] - c[1]) / b;
			return [360 * d, 2 * Math.atan(Math.exp(-360 * e * gk)) / gk - 90]
		},
		a.scale = function (c) {
			return arguments.length ? (b = +c, a) : b
		},
		a.translate = function (b) {
			return arguments.length ? (c = [+b[0], +b[1]], a) : c
		},
		a
	},
	d3.geo.path = function () {
		function a(a, b) {
			typeof f == "function" && (g = dQ(f.apply(this, arguments))),
			j(a);
			var c = i.length ? i.join("") : null;
			return i = [],
			c
		}
		function b(a) {
			return h(a).join(",")
		}
		function c(a) {
			var b = e(a[0]),
			c = 0,
			d = a.length;
			while (++c < d)
				b -= e(a[c]);
			return b
		}
		function d(a) {
			var b = d3.geom.polygon(a[0].map(h)),
			c = b.area(),
			d = b.centroid(c < 0 ? (c *= -1, 1) : -1),
			e = d[0],
			f = d[1],
			g = c,
			i = 0,
			j = a.length;
			while (++i < j)
				b = d3.geom.polygon(a[i].map(h)), c = b.area(), d = b.centroid(c < 0 ? (c *= -1, 1) : -1), e -= d[0], f -= d[1], g -= c;
			return [e, f, 6 * g]
		}
		function e(a) {
			return Math.abs(d3.geom.polygon(a.map(h)).area())
		}
		var f = 4.5,
		g = dQ(f),
		h = d3.geo.albersUsa(),
		i = [],
		j = dP({
				FeatureCollection : function (a) {
					var b = a.features,
					c = -1,
					d = b.length;
					while (++c < d)
						i.push(j(b[c].geometry))
				},
				Feature : function (a) {
					j(a.geometry)
				},
				Point : function (a) {
					i.push("M", b(a.coordinates), g)
				},
				MultiPoint : function (a) {
					var c = a.coordinates,
					d = -1,
					e = c.length;
					while (++d < e)
						i.push("M", b(c[d]), g)
				},
				LineString : function (a) {
					var c = a.coordinates,
					d = -1,
					e = c.length;
					i.push("M");
					while (++d < e)
						i.push(b(c[d]), "L");
					i.pop()
				},
				MultiLineString : function (a) {
					var c = a.coordinates,
					d = -1,
					e = c.length,
					f,
					g,
					h;
					while (++d < e) {
						f = c[d],
						g = -1,
						h = f.length,
						i.push("M");
						while (++g < h)
							i.push(b(f[g]), "L");
						i.pop()
					}
				},
				Polygon : function (a) {
					var c = a.coordinates,
					d = -1,
					e = c.length,
					f,
					g,
					h;
					while (++d < e) {
						f = c[d],
						g = -1;
						if ((h = f.length - 1) > 0) {
							i.push("M");
							while (++g < h)
								i.push(b(f[g]), "L");
							i[i.length - 1] = "Z"
						}
					}
				},
				MultiPolygon : function (a) {
					var c = a.coordinates,
					d = -1,
					e = c.length,
					f,
					g,
					h,
					j,
					k,
					l;
					while (++d < e) {
						f = c[d],
						g = -1,
						h = f.length;
						while (++g < h) {
							j = f[g],
							k = -1;
							if ((l = j.length - 1) > 0) {
								i.push("M");
								while (++k < l)
									i.push(b(j[k]), "L");
								i[i.length - 1] = "Z"
							}
						}
					}
				},
				GeometryCollection : function (a) {
					var b = a.geometries,
					c = -1,
					d = b.length;
					while (++c < d)
						i.push(j(b[c]))
				}
			}),
		k = a.area = dP({
				FeatureCollection : function (a) {
					var b = 0,
					c = a.features,
					d = -1,
					e = c.length;
					while (++d < e)
						b += k(c[d]);
					return b
				},
				Feature : function (a) {
					return k(a.geometry)
				},
				Polygon : function (a) {
					return c(a.coordinates)
				},
				MultiPolygon : function (a) {
					var b = 0,
					d = a.coordinates,
					e = -1,
					f = d.length;
					while (++e < f)
						b += c(d[e]);
					return b
				},
				GeometryCollection : function (a) {
					var b = 0,
					c = a.geometries,
					d = -1,
					e = c.length;
					while (++d < e)
						b += k(c[d]);
					return b
				}
			}, 0),
		l = a.centroid = dP({
				Feature : function (a) {
					return l(a.geometry)
				},
				Polygon : function (a) {
					var b = d(a.coordinates);
					return [b[0] / b[2], b[1] / b[2]]
				},
				MultiPolygon : function (a) {
					var b = 0,
					c = a.coordinates,
					e,
					f = 0,
					g = 0,
					h = 0,
					i = -1,
					j = c.length;
					while (++i < j)
						e = d(c[i]), f += e[0], g += e[1], h += e[2];
					return [f / h, g / h]
				}
			});
		return a.projection = function (b) {
			return h = b,
			a
		},
		a.pointRadius = function (b) {
			return typeof b == "function" ? f = b : (f = +b, g = dQ(f)),
			a
		},
		a
	},
	d3.geo.bounds = function (a) {
		var b = Infinity,
		c = Infinity,
		d = -Infinity,
		e = -Infinity;
		return dR(a, function (a, f) {
			a < b && (b = a),
			a > d && (d = a),
			f < c && (c = f),
			f > e && (e = f)
		}),
		[[b, c], [d, e]]
	};
	var gl = {
		Feature : dS,
		FeatureCollection : dT,
		GeometryCollection : dU,
		LineString : dV,
		MultiLineString : dW,
		MultiPoint : dV,
		MultiPolygon : dX,
		Point : dY,
		Polygon : dZ
	};
	d3.geo.circle = function () {
		function a() {}

		function b(a) {
			return i.distance(a) < h
		}
		function c(a) {
			var b = -1,
			c = a.length,
			e = [],
			f,
			g,
			j,
			k,
			l;
			while (++b < c)
				l = i.distance(j = a[b]), l < h ? (g && e.push(eb(g, j)((k - h) / (k - l))), e.push(j), f = g = null) : (g = j, !f && e.length && (e.push(eb(e[e.length - 1], g)((h - k) / (l - k))), f = g)), k = l;
			return f = a[0],
			g = e[0],
			g && j[0] === f[0] && j[1] === f[1] && (j[0] !== g[0] || j[1] !== g[1]) && e.push(g),
			d(e)
		}
		function d(a) {
			var b = 0,
			c = a.length,
			d,
			e,
			f = c ? [a[0]] : a,
			g,
			h = i.source();
			while (++b < c) {
				g = i.source(a[b - 1])(a[b]).coordinates;
				for (d = 0, e = g.length; ++d < e; )
					f.push(g[d])
			}
			return i.source(h),
			f
		}
		var f = [0, 0],
		g = 89.99,
		h = g * gk,
		i = d3.geo.greatArc().source(f).target(e);
		a.clip = function (a) {
			return typeof f == "function" && i.source(f.apply(this, arguments)),
			j(a) || null
		};
		var j = dP({
				FeatureCollection : function (a) {
					var b = a.features.map(j).filter(e);
					return b && (a = Object.create(a), a.features = b, a)
				},
				Feature : function (a) {
					var b = j(a.geometry);
					return b && (a = Object.create(a), a.geometry = b, a)
				},
				Point : function (a) {
					return b(a.coordinates) && a
				},
				MultiPoint : function (a) {
					var c = a.coordinates.filter(b);
					return c.length && {
						type : a.type,
						coordinates : c
					}
				},
				LineString : function (a) {
					var b = c(a.coordinates);
					return b.length && (a = Object.create(a), a.coordinates = b, a)
				},
				MultiLineString : function (a) {
					var b = a.coordinates.map(c).filter(function (a) {
							return a.length
						});
					return b.length && (a = Object.create(a), a.coordinates = b, a)
				},
				Polygon : function (a) {
					var b = a.coordinates.map(c);
					return b[0].length && (a = Object.create(a), a.coordinates = b, a)
				},
				MultiPolygon : function (a) {
					var b = a.coordinates.map(function (a) {
							return a.map(c)
						}).filter(function (a) {
							return a[0].length
						});
					return b.length && (a = Object.create(a), a.coordinates = b, a)
				},
				GeometryCollection : function (a) {
					var b = a.geometries.map(j).filter(e);
					return b.length && (a = Object.create(a), a.geometries = b, a)
				}
			});
		return a.origin = function (b) {
			return arguments.length ? (f = b, typeof f != "function" && i.source(f), a) : f
		},
		a.angle = function (b) {
			return arguments.length ? (h = (g = +b) * gk, a) : g
		},
		d3.rebind(a, i, "precision")
	},
	d3.geo.greatArc = function () {
		function a() {
			var b = a.distance.apply(this, arguments),
			d = 0,
			h = f / b,
			i = [c];
			while ((d += h) < 1)
				i.push(g(d));
			return i.push(e), {
				type : "LineString",
				coordinates : i
			}
		}
		var b = d$,
		c,
		d = d_,
		e,
		f = 6 * gk,
		g = ea();
		return a.distance = function () {
			return typeof b == "function" && g.source(c = b.apply(this, arguments)),
			typeof d == "function" && g.target(e = d.apply(this, arguments)),
			g.distance()
		},
		a.source = function (d) {
			return arguments.length ? (b = d, typeof b != "function" && g.source(c = b), a) : b
		},
		a.target = function (b) {
			return arguments.length ? (d = b, typeof d != "function" && g.target(e = d), a) : d
		},
		a.precision = function (b) {
			return arguments.length ? (f = b * gk, a) : f / gk
		},
		a
	},
	d3.geo.greatCircle = d3.geo.circle,
	d3.geom = {},
	d3.geom.contour = function (a, b) {
		var c = b || ec(a),
		d = [],
		e = c[0],
		f = c[1],
		g = 0,
		h = 0,
		i = NaN,
		j = NaN,
		k = 0;
		do
			k = 0, a(e - 1, f - 1) && (k += 1), a(e, f - 1) && (k += 2), a(e - 1, f) && (k += 4), a(e, f) && (k += 8), k === 6 ? (g = j === -1 ? -1 : 1, h = 0) : k === 9 ? (g = 0, h = i === 1 ? -1 : 1) : (g = gm[k], h = gn[k]), g != i && h != j && (d.push([e, f]), i = g, j = h), e += g, f += h;
		while (c[0] != e || c[1] != f);
		return d
	};
	var gm = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN],
	gn = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN];
	d3.geom.hull = function (a) {
		if (a.length < 3)
			return [];
		var b = a.length,
		c = b - 1,
		d = [],
		e = [],
		f,
		g,
		h = 0,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p;
		for (f = 1; f < b; ++f)
			a[f][1] < a[h][1] ? h = f : a[f][1] == a[h][1] && (h = a[f][0] < a[h][0] ? f : h);
		for (f = 0; f < b; ++f) {
			if (f === h)
				continue;
			j = a[f][1] - a[h][1],
			i = a[f][0] - a[h][0],
			d.push({
				angle : Math.atan2(j, i),
				index : f
			})
		}
		d.sort(function (a, b) {
			return a.angle - b.angle
		}),
		o = d[0].angle,
		n = d[0].index,
		m = 0;
		for (f = 1; f < c; ++f)
			g = d[f].index, o == d[f].angle ? (i = a[n][0] - a[h][0], j = a[n][1] - a[h][1], k = a[g][0] - a[h][0], l = a[g][1] - a[h][1], i * i + j * j >= k * k + l * l ? d[f].index = -1 : (d[m].index = -1, o = d[f].angle, m = f, n = g)) : (o = d[f].angle, m = f, n = g);
		e.push(h);
		for (f = 0, g = 0; f < 2; ++g)
			d[g].index !== -1 && (e.push(d[g].index), f++);
		p = e.length;
		for (; g < c; ++g) {
			if (d[g].index === -1)
				continue;
			while (!ed(e[p - 2], e[p - 1], d[g].index, a))
				--p;
			e[p++] = d[g].index
		}
		var q = [];
		for (f = 0; f < p; ++f)
			q.push(a[e[f]]);
		return q
	},
	d3.geom.polygon = function (a) {
		return a.area = function () {
			var b = 0,
			c = a.length,
			d = a[c - 1][0] * a[0][1],
			e = a[c - 1][1] * a[0][0];
			while (++b < c)
				d += a[b - 1][0] * a[b][1], e += a[b - 1][1] * a[b][0];
			return (e - d) * .5
		},
		a.centroid = function (b) {
			var c = -1,
			d = a.length,
			e = 0,
			f = 0,
			g,
			h = a[d - 1],
			i;
			arguments.length || (b = -1 / (6 * a.area()));
			while (++c < d)
				g = h, h = a[c], i = g[0] * h[1] - h[0] * g[1], e += (g[0] + h[0]) * i, f += (g[1] + h[1]) * i;
			return [e * b, f * b]
		},
		a.clip = function (b) {
			var c,
			d = -1,
			e = a.length,
			f,
			g,
			h = a[e - 1],
			i,
			j,
			k;
			while (++d < e) {
				c = b.slice(),
				b.length = 0,
				i = a[d],
				j = c[(g = c.length) - 1],
				f = -1;
				while (++f < g)
					k = c[f], ee(k, h, i) ? (ee(j, h, i) || b.push(ef(j, k, h, i)), b.push(k)) : ee(j, h, i) && b.push(ef(j, k, h, i)), j = k;
				h = i
			}
			return b
		},
		a
	},
	d3.geom.voronoi = function (a) {
		var b = a.map(function () {
				return []
			});
		return eg(a, function (a) {
			var c,
			d,
			e,
			f,
			g,
			h;
			a.a === 1 && a.b >= 0 ? (c = a.ep.r, d = a.ep.l) : (c = a.ep.l, d = a.ep.r),
			a.a === 1 ? (g = c ? c.y : -1e6, e = a.c - a.b * g, h = d ? d.y : 1e6, f = a.c - a.b * h) : (e = c ? c.x : -1e6, g = a.c - a.a * e, f = d ? d.x : 1e6, h = a.c - a.a * f);
			var i = [e, g],
			j = [f, h];
			b[a.region.l.index].push(i, j),
			b[a.region.r.index].push(i, j)
		}),
		b.map(function (b, c) {
			var d = a[c][0],
			e = a[c][1];
			return b.forEach(function (a) {
				a.angle = Math.atan2(a[0] - d, a[1] - e)
			}),
			b.sort(function (a, b) {
				return a.angle - b.angle
			}).filter(function (a, c) {
				return !c || a.angle - b[c - 1].angle > 1e-10
			})
		})
	};
	var go = {
		l : "r",
		r : "l"
	};
	d3.geom.delaunay = function (a) {
		var b = a.map(function () {
				return []
			}),
		c = [];
		return eg(a, function (c) {
			b[c.region.l.index].push(a[c.region.r.index])
		}),
		b.forEach(function (b, d) {
			var e = a[d],
			f = e[0],
			g = e[1];
			b.forEach(function (a) {
				a.angle = Math.atan2(a[0] - f, a[1] - g)
			}),
			b.sort(function (a, b) {
				return a.angle - b.angle
			});
			for (var h = 0, i = b.length - 1; h < i; h++)
				c.push([e, b[h], b[h + 1]])
		}),
		c
	},
	d3.geom.quadtree = function (a, b, c, d, e) {
		function f(a, b, c, d, e, f) {
			if (isNaN(b.x) || isNaN(b.y))
				return;
			if (a.leaf) {
				var h = a.point;
				h ? Math.abs(h.x - b.x) + Math.abs(h.y - b.y) < .01 ? g(a, b, c, d, e, f) : (a.point = null, g(a, h, c, d, e, f), g(a, b, c, d, e, f)) : a.point = b
			} else
				g(a, b, c, d, e, f)
		}
		function g(a, b, c, d, e, g) {
			var h = (c + e) * .5,
			i = (d + g) * .5,
			j = b.x >= h,
			k = b.y >= i,
			l = (k << 1) + j;
			a.leaf = !1,
			a = a.nodes[l] || (a.nodes[l] = eh()),
			j ? c = h : e = h,
			k ? d = i : g = i,
			f(a, b, c, d, e, g)
		}
		var h,
		i = -1,
		j = a.length;
		j && isNaN(a[0].x) && (a = a.map(ej));
		if (arguments.length < 5)
			if (arguments.length === 3)
				e = d = c, c = b;
			else {
				b = c = Infinity,
				d = e = -Infinity;
				while (++i < j)
					h = a[i], h.x < b && (b = h.x), h.y < c && (c = h.y), h.x > d && (d = h.x), h.y > e && (e = h.y);
				var k = d - b,
				l = e - c;
				k > l ? e = c + k : d = b + l
			}
		var m = eh();
		return m.add = function (a) {
			f(m, a, b, c, d, e)
		},
		m.visit = function (a) {
			ei(a, m, b, c, d, e)
		},
		a.forEach(m.add),
		m
	},
	d3.time = {};
	var gp = Date,
	gq = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	ek.prototype = {
		getDate : function () {
			return this._.getUTCDate()
		},
		getDay : function () {
			return this._.getUTCDay()
		},
		getFullYear : function () {
			return this._.getUTCFullYear()
		},
		getHours : function () {
			return this._.getUTCHours()
		},
		getMilliseconds : function () {
			return this._.getUTCMilliseconds()
		},
		getMinutes : function () {
			return this._.getUTCMinutes()
		},
		getMonth : function () {
			return this._.getUTCMonth()
		},
		getSeconds : function () {
			return this._.getUTCSeconds()
		},
		getTime : function () {
			return this._.getTime()
		},
		getTimezoneOffset : function () {
			return 0
		},
		valueOf : function () {
			return this._.valueOf()
		},
		setDate : function () {
			gr.setUTCDate.apply(this._, arguments)
		},
		setDay : function () {
			gr.setUTCDay.apply(this._, arguments)
		},
		setFullYear : function () {
			gr.setUTCFullYear.apply(this._, arguments)
		},
		setHours : function () {
			gr.setUTCHours.apply(this._, arguments)
		},
		setMilliseconds : function () {
			gr.setUTCMilliseconds.apply(this._, arguments)
		},
		setMinutes : function () {
			gr.setUTCMinutes.apply(this._, arguments)
		},
		setMonth : function () {
			gr.setUTCMonth.apply(this._, arguments)
		},
		setSeconds : function () {
			gr.setUTCSeconds.apply(this._, arguments)
		},
		setTime : function () {
			gr.setTime.apply(this._, arguments)
		}
	};
	var gr = Date.prototype,
	gs = "%a %b %e %H:%M:%S %Y",
	gt = "%m/%d/%y",
	gu = "%H:%M:%S",
	gv = gq,
	gw = gv.map(el),
	gx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	gy = gx.map(el);
	d3.time.format = function (a) {
		function b(b) {
			var d = [],
			e = -1,
			f = 0,
			g,
			h;
			while (++e < c)
				a.charCodeAt(e) == 37 && (d.push(a.substring(f, e), (h = gJ[g = a.charAt(++e)]) ? h(b) : g), f = e + 1);
			return d.push(a.substring(f, e)),
			d.join("")
		}
		var c = a.length;
		return b.parse = function (b) {
			var c = {
				y : 1900,
				m : 0,
				d : 1,
				H : 0,
				M : 0,
				S : 0,
				L : 0
			},
			d = em(c, a, b, 0);
			if (d != b.length)
				return null;
			"p" in c && (c.H = c.H % 12 + c.p * 12);
			var e = new gp;
			return e.setFullYear(c.y, c.m, c.d),
			e.setHours(c.H, c.M, c.S, c.L),
			e
		},
		b.toString = function () {
			return a
		},
		b
	};
	var gz = d3.format("02d"),
	gA = d3.format("03d"),
	gB = d3.format("04d"),
	gC = d3.format("2d"),
	gD = en(gv),
	gE = en(gw),
	gF = en(gx),
	gG = eo(gx),
	gH = en(gy),
	gI = eo(gy),
	gJ = {
		a : function (a) {
			return gw[a.getDay()]
		},
		A : function (a) {
			return gv[a.getDay()]
		},
		b : function (a) {
			return gy[a.getMonth()]
		},
		B : function (a) {
			return gx[a.getMonth()]
		},
		c : d3.time.format(gs),
		d : function (a) {
			return gz(a.getDate())
		},
		e : function (a) {
			return gC(a.getDate())
		},
		H : function (a) {
			return gz(a.getHours())
		},
		I : function (a) {
			return gz(a.getHours() % 12 || 12)
		},
		j : function (a) {
			return gA(1 + d3.time.dayOfYear(a))
		},
		L : function (a) {
			return gA(a.getMilliseconds())
		},
		m : function (a) {
			return gz(a.getMonth() + 1)
		},
		M : function (a) {
			return gz(a.getMinutes())
		},
		p : function (a) {
			return a.getHours() >= 12 ? "PM" : "AM"
		},
		S : function (a) {
			return gz(a.getSeconds())
		},
		U : function (a) {
			return gz(d3.time.sundayOfYear(a))
		},
		w : function (a) {
			return a.getDay()
		},
		W : function (a) {
			return gz(d3.time.mondayOfYear(a))
		},
		x : d3.time.format(gt),
		X : d3.time.format(gu),
		y : function (a) {
			return gz(a.getFullYear() % 100)
		},
		Y : function (a) {
			return gB(a.getFullYear() % 1e4)
		},
		Z : eG,
		"%" : function (a) {
			return "%"
		}
	},
	gK = {
		a : ep,
		A : eq,
		b : er,
		B : es,
		c : et,
		d : eA,
		e : eA,
		H : eB,
		I : eB,
		L : eE,
		m : ez,
		M : eC,
		p : eF,
		S : eD,
		x : eu,
		X : ev,
		y : ex,
		Y : ew
	},
	gL = /^\s*\d+/,
	gM = d3.map({
			am : 0,
			pm : 1
		});
	d3.time.format.utc = function (a) {
		function b(a) {
			try {
				gp = ek;
				var b = new gp;
				return b._ = a,
				c(b)
			}
			finally {
				gp = Date
			}
		}
		var c = d3.time.format(a);
		return b.parse = function (a) {
			try {
				gp = ek;
				var b = c.parse(a);
				return b && b._
			}
			finally {
				gp = Date
			}
		},
		b.toString = c.toString,
		b
	};
	var gN = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
	d3.time.format.iso = Date.prototype.toISOString ? eH : gN,
	eH.parse = function (a) {
		var b = new Date(a);
		return isNaN(b) ? null : b
	},
	eH.toString = gN.toString,
	d3.time.second = eI(function (a) {
			return new gp(Math.floor(a / 1e3) * 1e3)
		}, function (a, b) {
			a.setTime(a.getTime() + Math.floor(b) * 1e3)
		}, function (a) {
			return a.getSeconds()
		}),
	d3.time.seconds = d3.time.second.range,
	d3.time.seconds.utc = d3.time.second.utc.range,
	d3.time.minute = eI(function (a) {
			return new gp(Math.floor(a / 6e4) * 6e4)
		}, function (a, b) {
			a.setTime(a.getTime() + Math.floor(b) * 6e4)
		}, function (a) {
			return a.getMinutes()
		}),
	d3.time.minutes = d3.time.minute.range,
	d3.time.minutes.utc = d3.time.minute.utc.range,
	d3.time.hour = eI(function (a) {
			var b = a.getTimezoneOffset() / 60;
			return new gp((Math.floor(a / 36e5 - b) + b) * 36e5)
		}, function (a, b) {
			a.setTime(a.getTime() + Math.floor(b) * 36e5)
		}, function (a) {
			return a.getHours()
		}),
	d3.time.hours = d3.time.hour.range,
	d3.time.hours.utc = d3.time.hour.utc.range,
	d3.time.day = eI(function (a) {
			var b = new gp(0, a.getMonth(), a.getDate());
			return b.setFullYear(a.getFullYear()),
			b
		}, function (a, b) {
			a.setDate(a.getDate() + b)
		}, function (a) {
			return a.getDate() - 1
		}),
	d3.time.days = d3.time.day.range,
	d3.time.days.utc = d3.time.day.utc.range,
	d3.time.dayOfYear = function (a) {
		var b = d3.time.year(a);
		return Math.floor((a - b - (a.getTimezoneOffset() - b.getTimezoneOffset()) * 6e4) / 864e5)
	},
	gq.forEach(function (a, b) {
		a = a.toLowerCase(),
		b = 7 - b;
		var c = d3.time[a] = eI(function (a) {
				return (a = d3.time.day(a)).setDate(a.getDate() - (a.getDay() + b) % 7),
				a
			}, function (a, b) {
				a.setDate(a.getDate() + Math.floor(b) * 7)
			}, function (a) {
				var c = d3.time.year(a).getDay();
				return Math.floor((d3.time.dayOfYear(a) + (c + b) % 7) / 7) - (c !== b)
			});
		d3.time[a + "s"] = c.range,
		d3.time[a + "s"].utc = c.utc.range,
		d3.time[a + "OfYear"] = function (a) {
			var c = d3.time.year(a).getDay();
			return Math.floor((d3.time.dayOfYear(a) + (c + b) % 7) / 7)
		}
	}),
	d3.time.week = d3.time.sunday,
	d3.time.weeks = d3.time.sunday.range,
	d3.time.weeks.utc = d3.time.sunday.utc.range,
	d3.time.weekOfYear = d3.time.sundayOfYear,
	d3.time.month = eI(function (a) {
			return a = d3.time.day(a),
			a.setDate(1),
			a
		}, function (a, b) {
			a.setMonth(a.getMonth() + b)
		}, function (a) {
			return a.getMonth()
		}),
	d3.time.months = d3.time.month.range,
	d3.time.months.utc = d3.time.month.utc.range,
	d3.time.year = eI(function (a) {
			return a = d3.time.day(a),
			a.setMonth(0, 1),
			a
		}, function (a, b) {
			a.setFullYear(a.getFullYear() + b)
		}, function (a) {
			return a.getFullYear()
		}),
	d3.time.years = d3.time.year.range,
	d3.time.years.utc = d3.time.year.utc.range;
	var gO = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6],
	gP = [[d3.time.second, 1], [d3.time.second, 5], [d3.time.second, 15], [d3.time.second, 30], [d3.time.minute, 1], [d3.time.minute, 5], [d3.time.minute, 15], [d3.time.minute, 30], [d3.time.hour, 1], [d3.time.hour, 3], [d3.time.hour, 6], [d3.time.hour, 12], [d3.time.day, 1], [d3.time.day, 2], [d3.time.week, 1], [d3.time.month, 1], [d3.time.month, 3], [d3.time.year, 1]],
	gQ = [[d3.time.format("%Y"), function (a) {
				return !0
			}
		], [d3.time.format("%B"), function (a) {
				return a.getMonth()
			}
		], [d3.time.format("%b %d"), function (a) {
				return a.getDate() != 1
			}
		], [d3.time.format("%a %d"), function (a) {
				return a.getDay() && a.getDate() != 1
			}
		], [d3.time.format("%I %p"), function (a) {
				return a.getHours()
			}
		], [d3.time.format("%I:%M"), function (a) {
				return a.getMinutes()
			}
		], [d3.time.format(":%S"), function (a) {
				return a.getSeconds()
			}
		], [d3.time.format(".%L"), function (a) {
				return a.getMilliseconds()
			}
		]],
	gR = d3.scale.linear(),
	gS = eN(gQ);
	gP.year = function (a, b) {
		return gR.domain(a.map(eP)).ticks(b).map(eO)
	},
	d3.time.scale = function () {
		return eK(d3.scale.linear(), gP, gS)
	};
	var gT = gP.map(function (a) {
			return [a[0].utc, a[1]]
		}),
	gU = [[d3.time.format.utc("%Y"), function (a) {
				return !0
			}
		], [d3.time.format.utc("%B"), function (a) {
				return a.getUTCMonth()
			}
		], [d3.time.format.utc("%b %d"), function (a) {
				return a.getUTCDate() != 1
			}
		], [d3.time.format.utc("%a %d"), function (a) {
				return a.getUTCDay() && a.getUTCDate() != 1
			}
		], [d3.time.format.utc("%I %p"), function (a) {
				return a.getUTCHours()
			}
		], [d3.time.format.utc("%I:%M"), function (a) {
				return a.getUTCMinutes()
			}
		], [d3.time.format.utc(":%S"), function (a) {
				return a.getUTCSeconds()
			}
		], [d3.time.format.utc(".%L"), function (a) {
				return a.getUTCMilliseconds()
			}
		]],
	gV = eN(gU);
	gT.year = function (a, b) {
		return gR.domain(a.map(eR)).ticks(b).map(eQ)
	},
	d3.time.scale.utc = function () {
		return eK(d3.scale.linear(), gT, gV)
	}
}
(), function () {
	var Graphene,
	__bind = function (a, b) {
		return function () {
			return a.apply(b, arguments)
		}
	},
	__hasProp = Object.prototype.hasOwnProperty,
	__extends = function (a, b) {
		function d() {
			this.constructor = a
		}
		for (var c in b)
			__hasProp.call(b, c) && (a[c] = b[c]);
		return d.prototype = b.prototype,
		a.prototype = new d,
		a.__super__ = b.prototype,
		a
	};
	Graphene = function () {
		function Graphene() {
			this.build = __bind(this.build, this)
		}
		return Graphene.prototype.demo = function () {
			return this.is_demo = !0
		},
		Graphene.prototype.build = function (json) {
			var _this = this;
			return _.each(_.keys(json), function (k) {
				var klass,
				model_opts,
				ts;
				return console.log("building [" + k + "]"),
				_this.is_demo ? klass = Graphene.DemoTimeSeries : klass = Graphene.TimeSeries,
				model_opts = {
					source : json[k].source
				},
				delete json[k].source,
				json[k].refresh_interval && (model_opts.refresh_interval = json[k].refresh_interval, delete json[k].refresh_interval),
				ts = new klass(model_opts),
				_.each(json[k], function (opts, view) {
					return klass = eval("Graphene." + view + "View"),
					console.log(_.extend({
							model : ts,
							ymin : _this.getUrlParam(model_opts.source, "yMin"),
							ymax : _this.getUrlParam(model_opts.source, "yMax")
						}, opts)),
					new klass(_.extend({
							model : ts,
							ymin : _this.getUrlParam(model_opts.source, "yMin"),
							ymax : _this.getUrlParam(model_opts.source, "yMax")
						}, opts)),
					ts.start()
				})
			})
		},
		Graphene.prototype.discover = function (a, b, c, d) {
			return $.getJSON("" + a + "/dashboard/load/" + b, function (b) {
				var e,
				f;
				return f = 0,
				e = {},
				_.each(b.state.graphs, function (b) {
					var d,
					g,
					h;
					return g = b[2],
					d = b[1],
					h = d.title ? d.title : "n/a",
					e["Graph " + f] = {
						source : "" + a + g + "&format=json",
						TimeSeries : {
							title : h,
							ymin : d.yMin,
							parent : c(f, a)
						}
					},
					f++
				}),
				d(e)
			})
		},
		Graphene.prototype.getUrlParam = function (a, b) {
			var c,
			d,
			e;
			return d = "",
			c = a.split("?")[1],
			c ? (e = c.split("&"), e && e.length > 0 ? (_.each(e, function (a) {
						var c;
						c = a.split("=");
						if (decodeURIComponent(c[0]) === b)
							return d = decodeURIComponent(c[1])
					}), d) : d) : d
		},
		Graphene
	}
	(),
	this.Graphene = Graphene,
	Graphene.GraphiteModel = function (a) {
		function b() {
			this.process_data = __bind(this.process_data, this),
			this.refresh = __bind(this.refresh, this),
			this.stop = __bind(this.stop, this),
			this.start = __bind(this.start, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.defaults = {
			source : "",
			data : null,
			ymin : 0,
			ymax : 0,
			refresh_interval : 1e4
		},
		b.prototype.debug = function () {
			return console.log("" + this.get("refresh_interval"))
		},
		b.prototype.start = function () {
			return this.refresh(),
			console.log("Starting to poll at " + this.get("refresh_interval")),
			this.t_index = setInterval(this.refresh, this.get("refresh_interval"))
		},
		b.prototype.stop = function () {
			return clearInterval(this.t_index)
		},
		b.prototype.refresh = function () { console.log("refresh");
			var a,
			b,
			c = this;
			return b = this.get("source"),
			//-1 === b.indexOf("&jsonp=?") && (b += "&jsonp=?"),
			a = {
				url : b,
				dataType : "json",
				//jsonp : "jsonp",
				success : function (a) {
					return console.log("got data."),
					c.process_data(a)
				}
			},
			$.ajax(a)
		},
		b.prototype.process_data = function () {
			return null
		},
		b
	}
	(Backbone.Model),
	Graphene.DemoTimeSeries = function (a) {
		function b() {
			this.add_points = __bind(this.add_points, this),
			this.refresh = __bind(this.refresh, this),
			this.stop = __bind(this.stop, this),
			this.start = __bind(this.start, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.defaults = {
			range : [0, 1e3],
			num_points : 100,
			num_new_points : 1,
			num_series : 2,
			refresh_interval : 3e3
		},
		b.prototype.debug = function () {
			return console.log("" + this.get("refresh_interval"))
		},
		b.prototype.start = function () {
			var a = this;
			return console.log("Starting to poll at " + this.get("refresh_interval")),
			this.data = [],
			_.each(_.range(this.get("num_series")), function (b) {
				return a.data.push({
					label : "Series " + b,
					ymin : 0,
					ymax : 0,
					points : []
				})
			}),
			this.point_interval = this.get("refresh_interval") / this.get("num_new_points"),
			_.each(this.data, function (b) {
				return a.add_points(new Date, a.get("range"), a.get("num_points"), a.point_interval, b)
			}),
			this.set({
				data : this.data
			}),
			this.t_index = setInterval(this.refresh, this.get("refresh_interval"))
		},
		b.prototype.stop = function () {
			return clearInterval(this.t_index)
		},
		b.prototype.refresh = function () {
			var a,
			b,
			c,
			d = this;
			return this.data = _.map(this.data, function (a) {
					return a = _.clone(a),
					a.points = _.map(a.points, function (a) {
							return [a[0], a[1]]
						}),
					a
				}),
			a = this.data[0].points.pop(),
			this.data[0].points.push(a),
			c = a[1],
			b = this.get("num_new_points"),
			_.each(this.data, function (a) {
				return d.add_points(c, d.get("range"), b, d.point_interval, a)
			}),
			this.set({
				data : this.data
			})
		},
		b.prototype.add_points = function (a, b, c, d, e) {
			var f = this;
			return _.each(_.range(c), function (c) {
				var g;
				g = [b[0] + Math.random() * (b[1] - b[0]), new Date(a.getTime() + (c + 1) * d)],
				e.points.push(g);
				if (e.points.length > f.get("num_points"))
					return e.points.shift()
			}),
			e.ymin = d3.min(e.points, function (a) {
					return a[0]
				}),
			e.ymax = d3.max(e.points, function (a) {
					return a[0]
				})
		},
		b
	}
	(Backbone.Model),
	Graphene.BarChart = function (a) {
		function b() {
			this.process_data = __bind(this.process_data, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.process_data = function (a) {
			var b;
			return console.log("process data barchart"),
			b = _.map(a, function (a) {
					var b,
					c;
					return c = d3.min(a.datapoints, function (a) {
							return a[0]
						}),
					c === void 0 ? null : (b = d3.max(a.datapoints, function (a) {
								return a[0]
							}), b === void 0 ? null : (_.each(a.datapoints, function (a) {
								return a[1] = new Date(a[1] * 1e3)
							}), {
							points : _.reject(a.datapoints, function (a) {
								return a[0] === null
							}),
							ymin : c,
							ymax : b,
							label : a.target
						}))
				}),
			b = _.reject(b, function (a) {
					return a === null
				}),
			this.set({
				data : b
			})
		},
		b
	}
	(Graphene.GraphiteModel),
	Graphene.TimeSeries = function (a) {
		function b() {
			this.process_data = __bind(this.process_data, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.process_data = function (a) {
			var b;
			return b = _.map(a, function (a) {
					var b,
					c,
					d,
					e;
					return d = d3.min(a.datapoints, function (a) {
							return a[0]
						}),
					d === void 0 ? null : (c = d3.max(a.datapoints, function (a) {
								return a[0]
							}), c === void 0 ? null : (b = (e = _.last(a.datapoints)[0]) != null ? e : 0, b === void 0 ? null : (_.each(a.datapoints, function (a) {
									return a[1] = new Date(a[1] * 1e3)
								}), {
								points : _.reject(a.datapoints, function (a) {
									return a[0] === null
								}),
								ymin : d,
								ymax : c,
								last : b,
								label : a.target
							})))
				}),
			b = _.reject(b, function (a) {
					return a === null
				}),
			this.set({
				data : b
			})
		},
		b
	}
	(Graphene.GraphiteModel),
	Graphene.GaugeGadgetView = function (a) {
		function b() {
			this.render = __bind(this.render, this),
			this.by_type = __bind(this.by_type, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.className = "gauge-gadget-view",
		b.prototype.tagName = "div",
		b.prototype.initialize = function () {
			var a;
			return this.title = this.options.title,
			this.type = this.options.type,
			this.parent = this.options.parent || "#parent",
			this.value_format = this.options.value_format || ".3s",
			this.null_value = 0,
			this.from = this.options.from || 0,
			this.to = this.options.to || 100,
			this.observer = this.options.observer,
			this.vis = d3.select(this.parent).append("div").attr("class", "ggview").attr("id", this.title + "GaugeContainer"),
			a = {
				size : this.options.size || 120,
				label : this.title,
				minorTicks : 5,
				min : this.from,
				max : this.to
			},
			a.redZones = [],
			a.redZones.push({
				from : this.options.red_from || .9 * this.to,
				to : this.options.red_to || this.to
			}),
			a.yellowZones = [],
			a.yellowZones.push({
				from : this.options.yellow_from || .75 * this.to,
				to : this.options.yellow_to || .9 * this.to
			}),
			this.gauge = new Gauge("" + this.title + "GaugeContainer", a),
			this.gauge.render(),
			this.model.bind("change", this.render),
			console.log("GG view ")
		},
		b.prototype.by_type = function (a) {
			switch (this.type) {
			case "min":
				return a.ymin;
			case "max":
				return a.ymax;
			case "current":
				return a.last;
			default:
				return a.points[0][0]
			}
		},
		b.prototype.render = function () {
			var a,
			b;
			return console.log("rendering."),
			a = this.model.get("data"),
			b = a && a.length > 0 ? a[0] : {
				ymax : this.null_value,
				ymin : this.null_value,
				points : [[this.null_value, 0]]
			},
			this.observer && this.observer(this.by_type(b)),
			this.gauge.redraw(this.by_type(b), this.value_format)
		},
		b
	}
	(Backbone.View),
	Graphene.GaugeLabelView = function (a) {
		function b() {
			this.render = __bind(this.render, this),
			this.by_type = __bind(this.by_type, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.className = "gauge-label-view",
		b.prototype.tagName = "div",
		b.prototype.initialize = function () {
			return this.unit = this.options.unit,
			this.title = this.options.title,
			this.type = this.options.type,
			this.parent = this.options.parent || "#parent",
			this.value_format = this.options.value_format || ".3s",
			this.value_format = d3.format(this.value_format),
			this.null_value = 0,
			this.observer = this.options.observer,
			this.vis = d3.select(this.parent).append("div").attr("class", "glview"),
			this.title && this.vis.append("div").attr("class", "label").text(this.title),
			this.model.bind("change", this.render),
			console.log("GL view ")
		},
		b.prototype.by_type = function (a) {
			switch (this.type) {
			case "min":
				return a.ymin;
			case "max":
				return a.ymax;
			case "current":
				return a.last;
			default:
				return a.points[0][0]
			}
		},
		b.prototype.render = function () {
			var a,
			b,
			c,
			d,
			e,
			f = this;
			a = this.model.get("data"),
			console.log(a),
			b = a && a.length > 0 ? a[0] : {
				ymax : this.null_value,
				ymin : this.null_value,
				points : [[this.null_value, 0]]
			},
			this.observer && this.observer(this.by_type(b)),
			e = this.vis,
			d = e.selectAll("div.metric").data([b], function (a) {
					return f.by_type(a)
				}),
			d.exit().remove(),
			c = d.enter().insert("div", ":first-child").attr("class", "metric" + (this.type ? " " + this.type : "")),
			c.append("span").attr("class", "value").text(function (a) {
				return f.value_format(f.by_type(a))
			});
			if (this.unit)
				return c.append("span").attr("class", "unit").text(this.unit)
		},
		b
	}
	(Backbone.View),
	Graphene.TimeSeriesView = function (a) {
		function b() {
			this.render = __bind(this.render, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.tagName = "div",
		b.prototype.initialize = function () {
			return this.line_height = this.options.line_height || 16,
			this.animate_ms = this.options.animate_ms || 500,
			this.num_labels = this.options.num_labels || 3,
			this.sort_labels = this.options.labels_sort,
			this.display_verticals = this.options.display_verticals || !1,
			this.width = this.options.width || 400,
			this.height = this.options.height || 100,
			this.padding = this.options.padding || [this.line_height * 2, 32, this.line_height * (3 + this.num_labels), 32],
			this.title = this.options.title,
			this.label_formatter = this.options.label_formatter || function (a) {
				return a
			},
			this.firstrun = !0,
			this.parent = this.options.parent || "#parent",
			this.null_value = 0,
			this.show_current = this.options.show_current || !1,
			this.observer = this.options.observer,
			this.vis = d3.select(this.parent).append("svg").attr("class", "tsview").attr("width", this.width + (this.padding[1] + this.padding[3])).attr("height", this.height + (this.padding[0] + this.padding[2])).append("g").attr("transform", "translate(" + this.padding[3] + "," + this.padding[0] + ")"),
			this.value_format = this.options.value_format || ".3s",
			this.value_format = d3.format(this.value_format),
			this.model.bind("change", this.render),
			console.log("TS view: " + this.width + "x" + this.height + " padding:" + this.padding + " animate: " + this.animate_ms + " labels: " + this.num_labels)
		},
		b.prototype.render = function () {
			var a,
			b,
			c,
			d,
			e,
			f,
			g,
			h,
			i,
			j,
			k,
			l,
			m,
			n,
			o,
			p,
			q,
			r,
			s,
			t,
			u,
			v,
			w = this;
			return console.log("rendering."),
			c = this.model.get("data"),
			c = c && c.length > 0 ? c : [{
						ymax : this.null_value,
						ymin : this.null_value,
						points : [[this.null_value, 0], [this.null_value, 0]]
					}
				],
			d = _.max(c, function (a) {
					return a.ymax
				}),
			d.ymax_graph = this.options.ymax || d.ymax,
			e = _.min(c, function (a) {
					return a.ymin
				}),
			e.ymin_graph = (v = this.options.ymin) != null ? v : e.ymin,
			r = _.flatten(function () {
					var a,
					d,
					e;
					e = [];
					for (a = 0, d = c.length; a < d; a++)
						b = c[a], e.push(b.points.map(function (a) {
								return a[1]
							}));
					return e
				}
					()),
			q = _.min(r, function (a) {
					return a.valueOf()
				}),
			p = _.max(r, function (a) {
					return a.valueOf()
				}),
			n = d3.time.scale().domain([q, p]).range([0, this.width]),
			t = d3.scale.linear().domain([e.ymin_graph, d.ymax_graph]).range([this.height, 0]).nice(),
			s = this.display_verticals ? -this.height : 0,
			o = d3.svg.axis().scale(n).ticks(4).tickSize(s).tickSubdivide(!0),
			u = d3.svg.axis().scale(t).ticks(4).tickSize(-this.width).orient("left").tickFormat(d3.format("s")),
			m = this.vis,
			g = d3.svg.line().x(function (a) {
					return n(a[1])
				}).y(function (a) {
					return t(a[0])
				}),
			a = d3.svg.area().x(function (a) {
					return n(a[1])
				}).y0(this.height - 1).y1(function (a) {
					return t(a[0])
				}),
			this.sort_labels && (j = this.sort_labels === "desc" ? -1 : 1, c = _.sortBy(c, function (a) {
						return j * a.ymax
					})),
			this.observer && this.observer(c),
			k = _.map(c, function (a) {
					return a.points
				}),
			this.firstrun && (this.firstrun = !1, m.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")").transition().duration(this.animate_ms).call(o), m.append("svg:g").attr("class", "y axis").call(u), m.selectAll("path.line").data(k).enter().append("path").attr("d", g).attr("class", function (a, b) {
					return "line " + ("h-col-" + (b + 1))
				}), m.selectAll("path.area").data(k).enter().append("path").attr("d", a).attr("class", function (a, b) {
					return "area " + ("h-col-" + (b + 1))
				}), this.title && (l = m.append("svg:text").attr("class", "title").attr("transform", "translate(0, -" + this.line_height + ")").text(this.title)), this.legend = m.append("svg:g").attr("transform", "translate(0, " + (this.height + this.line_height * 2) + ")").attr("class", "legend")),
			f = this.legend.selectAll("g.l").data(_.first(c, this.num_labels), function (a) {
					return Math.random()
				}),
			f.exit().remove(),
			h = f.enter().append("svg:g").attr("transform", function (a, b) {
					return "translate(0, " + b * w.line_height + ")"
				}).attr("class", "l"),
			h.append("svg:rect").attr("width", 5).attr("height", 5).attr("class", function (a, b) {
				return "ts-color " + ("h-col-" + (b + 1))
			}),
			i = h.append("svg:text").attr("dx", 10).attr("dy", 6).attr("class", "ts-text").text(function (a) {
					return w.label_formatter(a.label)
				}),
			i.append("svg:tspan").attr("class", "min-tag").attr("dx", 10).text(function (a) {
				return w.value_format(a.ymin) + "min"
			}),
			i.append("svg:tspan").attr("class", "max-tag").attr("dx", 2).text(function (a) {
				return w.value_format(a.ymax) + "max"
			}),
			this.show_current === !0 && i.append("svg:tspan").attr("class", "last-tag").attr("dx", 2).text(function (a) {
				return w.value_format(a.last) + "last"
			}),
			m.transition().ease("linear").duration(this.animate_ms).select(".x.axis").call(o),
			m.select(".y.axis").call(u),
			m.selectAll("path.area").data(k).attr("d", a).transition().ease("linear").duration(this.animate_ms),
			m.selectAll("path.line").data(k).attr("d", g).transition().ease("linear").duration(this.animate_ms)
		},
		b
	}
	(Backbone.View),
	Graphene.BarChartView = function (a) {
		function b() {
			this.render = __bind(this.render, this),
			b.__super__.constructor.apply(this, arguments)
		}
		return __extends(b, a),
		b.prototype.tagName = "div",
		b.prototype.initialize = function () {
			return this.line_height = this.options.line_height || 16,
			this.animate_ms = this.options.animate_ms || 500,
			this.num_labels = this.options.labels || 3,
			this.sort_labels = this.options.labels_sort || "desc",
			this.display_verticals = this.options.display_verticals || !1,
			this.width = this.options.width || 400,
			this.height = this.options.height || 100,
			this.padding = this.options.padding || [this.line_height * 2, 32, this.line_height * (3 + this.num_labels), 32],
			this.title = this.options.title,
			this.label_formatter = this.options.label_formatter || function (a) {
				return a
			},
			this.firstrun = !0,
			this.parent = this.options.parent || "#parent",
			this.null_value = 0,
			this.vis = d3.select(this.parent).append("svg").attr("class", "tsview").attr("width", this.width + (this.padding[1] + this.padding[3])).attr("height", this.height + (this.padding[0] + this.padding[2])).append("g").attr("transform", "translate(" + this.padding[3] + "," + this.padding[0] + ")"),
			this.bar_width = Math.min(this.options.bar_width, 1) || .5,
			this.model.bind("change", this.render)
		},
		b.prototype.render = function () {
			var a,
			b,
			c,
			d,
			e,
			f,
			g,
			h,
			i,
			j,
			k,
			l;
			return c = this.model.get("data"),
			d = _.max(c, function (a) {
					return a.ymax
				}),
			e = _.min(c, function (a) {
					return a.ymin
				}),
			c = _.sortBy(c, function (a) {
					return 1 * a.ymax
				}),
			f = _.map(c, function (a) {
					return a.points
				}),
			a = function (a, b, c) {
				return c == null && (c = 1),
				console.log(c),
				b / a[0].length * c
			},
			h = d3.time.scale().domain([c[0].points[0][1], c[0].points[c[0].points.length - 1][1]]).range([0, this.width - a(f, this.width)]),
			k = d3.scale.linear().domain([e.ymin, d.ymax]).range([this.height, 0]).nice(),
			j = this.display_verticals ? -this.height : 0,
			i = d3.svg.axis().scale(h).ticks(4).tickSize(j).tickSubdivide(!0),
			l = d3.svg.axis().scale(k).ticks(4).tickSize(-this.width).orient("left").tickFormat(d3.format("s")),
			g = this.vis,
			g.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")").transition().duration(this.animate_ms).call(i),
			g.append("svg:g").attr("class", "y axis").call(l),
			b = this.height,
			this.firstrun && (this.firstrun = !1, g.selectAll("rect").remove(), g.selectAll("rect").data(f[0]).enter().append("rect").attr("x", function (a, b) {
					return console.log(h(a[1])),
					h(a[1])
				}).attr("y", function (a, c) {
					return b - (b - k(a[0]))
				}).attr("width", a(f, this.width, this.bar_width)).attr("height", function (a, c) {
					return b - k(a[0])
				}).attr("class", "h-col-1 area")),
			g.selectAll("rect").data(f[0]).transition().ease("linear").duration(250).attr("x", function (a, b) {
				return h(a[1])
			}).attr("y", function (a, c) {
				return b - (b - k(a[0]))
			}).attr("width", a(f, this.width, this.bar_width)).attr("height", function (a, c) {
				return b - k(a[0])
			}).attr("class", "h-col-1 area"),
			g.transition().ease("linear").duration(this.animate_ms).select(".x.axis").call(i),
			g.select(".y.axis").call(l),
			console.log("done drawing")
		},
		b
	}
	(Backbone.View)
}
.call(this);
