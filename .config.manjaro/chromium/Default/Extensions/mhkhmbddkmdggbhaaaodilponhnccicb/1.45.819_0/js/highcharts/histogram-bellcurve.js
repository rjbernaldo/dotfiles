/*
 Highcharts JS v8.0.0 (2019-12-10)

 (c) 2010-2019 Highsoft AS
 Author: Sebastian Domas

 License: www.highcharts.com/license
*/
(function (a) { "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/histogram-bellcurve", ["highcharts"], function (d) { a(d); a.Highcharts = d; return a }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0) })(function (a) {
    function d(a, b, d, g) { a.hasOwnProperty(b) || (a[b] = g.apply(null, d)) } a = a ? a._modules : {}; d(a, "mixins/derived-series.js", [a["parts/Globals.js"], a["parts/Utilities.js"]], function (a, b) {
        var d = b.defined, l = a.Series,
        k = a.addEvent; return {
            hasDerivedData: !0, init: function () { l.prototype.init.apply(this, arguments); this.initialised = !1; this.baseSeries = null; this.eventRemovers = []; this.addEvents() }, setDerivedData: a.noop, setBaseSeries: function () { var a = this.chart, e = this.options.baseSeries; this.baseSeries = d(e) && (a.series[e] || a.get(e)) || null }, addEvents: function () {
                var a = this; var e = k(this.chart, "afterLinkSeries", function () {
                    a.setBaseSeries(); a.baseSeries && !a.initialised && (a.setDerivedData(), a.addBaseSeriesEvents(), a.initialised =
                        !0)
                }); this.eventRemovers.push(e)
            }, addBaseSeriesEvents: function () { var a = this; var e = k(a.baseSeries, "updatedData", function () { a.setDerivedData() }); var b = k(a.baseSeries, "destroy", function () { a.baseSeries = null; a.initialised = !1 }); a.eventRemovers.push(e, b) }, destroy: function () { this.eventRemovers.forEach(function (a) { a() }); l.prototype.destroy.apply(this, arguments) }
        }
    }); d(a, "modules/histogram.src.js", [a["parts/Globals.js"], a["parts/Utilities.js"], a["mixins/derived-series.js"]], function (a, b, d) {
        function l(a) {
            return function (c) {
                for (var f =
                    1; a[f] <= c;)f++; return a[--f]
            }
        } var k = b.arrayMax, q = b.arrayMin, e = b.correctFloat, n = b.isNumber, r = b.objectEach; b = a.seriesType; a = a.merge; var h = { "square-root": function (a) { return Math.ceil(Math.sqrt(a.options.data.length)) }, sturges: function (a) { return Math.ceil(Math.log(a.options.data.length) * Math.LOG2E) }, rice: function (a) { return Math.ceil(2 * Math.pow(a.options.data.length, 1 / 3)) } }; b("histogram", "column", {
            binsNumber: "square-root", binWidth: void 0, pointPadding: 0, groupPadding: 0, grouping: !1, pointPlacement: "between",
            tooltip: { headerFormat: "", pointFormat: '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/><span style="color:{point.color}">\u25cf</span> {series.name} <b>{point.y}</b><br/>' }
        }, a(d, {
            setDerivedData: function () { var a = this.baseSeries.yData; a.length && (a = this.derivedData(a, this.binsNumber(), this.options.binWidth), this.setData(a, !1)) }, derivedData: function (a, f, b) {
                var c = k(a), h = e(q(a)), d = [], m = {}, g = []; b = this.binWidth = this.options.pointRange = e(n(b) ? b || 1 : (c - h) / f); for (f = h; f < c && (this.userOptions.binWidth ||
                    e(c - f) >= b || 0 >= e(h + d.length * b - f)); f = e(f + b))d.push(f), m[f] = 0; 0 !== m[h] && (d.push(e(h)), m[e(h)] = 0); var p = l(d.map(function (a) { return parseFloat(a) })); a.forEach(function (a) { a = e(p(a)); m[a]++ }); r(m, function (a, c) { g.push({ x: Number(c), y: a, x2: e(Number(c) + b) }) }); g.sort(function (a, c) { return a.x - c.x }); return g
            }, binsNumber: function () { var a = this.options.binsNumber, b = h[a] || "function" === typeof a && a; return Math.ceil(b && b(this.baseSeries) || (n(a) ? a : h["square-root"](this.baseSeries))) }
        })); ""
    }); d(a, "modules/bellcurve.src.js",
        [a["parts/Globals.js"], a["parts/Utilities.js"], a["mixins/derived-series.js"]], function (a, b, d) {
            function g(a) { var b = a.length; a = a.reduce(function (a, b) { return a + b }, 0); return 0 < b && a / b } function k(a, b) { var c = a.length; b = n(b) ? b : g(a); a = a.reduce(function (a, c) { c -= b; return a + c * c }, 0); return 1 < c && Math.sqrt(a / (c - 1)) } function l(a, b, c) { a -= b; return Math.exp(-(a * a) / (2 * c * c)) / (c * Math.sqrt(2 * Math.PI)) } var e = b.correctFloat, n = b.isNumber; b = a.seriesType; a = a.merge; b("bellcurve", "areaspline", { intervals: 3, pointsInInterval: 3, marker: { enabled: !1 } },
                a(d, { setMean: function () { this.mean = e(g(this.baseSeries.yData)) }, setStandardDeviation: function () { this.standardDeviation = e(k(this.baseSeries.yData, this.mean)) }, setDerivedData: function () { 1 < this.baseSeries.yData.length && (this.setMean(), this.setStandardDeviation(), this.setData(this.derivedData(this.mean, this.standardDeviation), !1)) }, derivedData: function (a, b) { var c = this.options.intervals, d = this.options.pointsInInterval, e = a - c * b; c = c * d * 2 + 1; d = b / d; var h = [], g; for (g = 0; g < c; g++)h.push([e, l(e, a, b)]), e += d; return h } }));
            ""
        }); d(a, "masters/modules/histogram-bellcurve.src.js", [], function () { })
});
//# sourceMappingURL=histogram-bellcurve.js.map