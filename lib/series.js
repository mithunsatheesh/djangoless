// Generated by CoffeeScript 1.6.2
(function() {
  var AGGREGATORS, Series, assert;

  assert = require("assert");

  AGGREGATORS = {
    average: function(points) {
      var count, i, sum, value;

      sum = 0;
      count = 0;
      for (i in points) {
        value = points[i];
        if (value !== void 0) {
          sum += value;
          count++;
        }
      }
      if (count === 0) {
        return void 0;
      } else {
        return sum / count;
      }
    },
    sum: function(points) {
      var i, sum, value;

      sum = 0;
      for (i in points) {
        value = points[i];
        if (value !== void 0) {
          sum += value;
        }
      }
      return sum;
    },
    last: function(points) {
      return points[points.length - 1];
    },
    max: function(points) {
      var i, max, value;

      max = void 0;
      for (i in points) {
        value = points[i];
        if (value !== void 0) {
          if (max === void 0 || value > max) {
            max = value;
          }
        }
      }
      return max;
    },
    min: function(points) {
      var i, min, value;

      min = void 0;
      for (i in points) {
        value = points[i];
        if (value !== void 0) {
          if (min === void 0 || value < min) {
            min = value;
          }
        }
      }
      return min;
    }
  };

  Series = (function() {
    function Series(options) {
      assert(this.name = options.name, "Missing argument 'name'");
      assert(this.from = options.from, "Missing argument 'from'");
      assert(this.to = options.to, "Missing argument 'to'");
      assert(this.sec_per_point = options.sec_per_point, "Missing argument 'sec_per_point'");
      assert(this.datapoints = options.datapoints, "Missing argument 'datapoints'");
      this.points_count = this.datapoints.length;
      this.aggregator = options.aggregate || AGGREGATORS.average;
      this.width = options.width || 1;
      this.color = options.color;
    }

    Series.prototype.valueAt = function(from, to, aggregator) {
      var from_point, set, until_point;

      if (from >= this.to) {
        return void 0;
      }
      if (to < this.from) {
        return void 0;
      }
      from_point = Math.floor((from - this.from) / this.sec_per_point);
      if (from_point < 0) {
        from_point = 0;
      }
      until_point = Math.floor((to - this.from) / this.sec_per_point);
      if (until_point > this.points_count) {
        until_point = this.points_count;
      }
      set = this.datapoints.slice(from_point, until_point);
      if (set.length === 0) {
        return void 0;
      } else {
        if (aggregator == null) {
          aggregator = this.aggregator;
        }
        return aggregator(set);
      }
    };

    Series.prototype.toCumulative = function() {
      return Series.clone({
        aggregator: AGGREGATORS.sum
      });
    };

    Series.constant = function(name, value) {
      var series;

      series = {
        valueAt: function() {
          return value;
        },
        name: value
      };
      return series;
    };

    Series.modify = function(series, options) {
      var new_series;

      new_series = {
        valueAt: function(from, to) {
          return series.valueAt(from, to, aggregator);
        },
        name: options.name || series.name,
        width: options.width || series.width,
        color: options.color || series.color,
        aggregator: options.aggregator || series.aggregator
      };
      return new_series;
    };

    return Series;

  })();

  module.exports = Series;

}).call(this);