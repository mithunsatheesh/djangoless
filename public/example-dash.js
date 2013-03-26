(function() {
  var description;
  description = {
    "Application": {
      source: "/render/?from=7200&target=metric.*",
      TimeSeries: {
        parent: '#g2-3',
		width:1200,
		height:200
      }
    },
    "metric1": {
      source: "/render/?from=3600&target=metric.a",
      TimeSeries: {
        parent: '#g2-1',
		width:600,
		height:200
      }
    },
    "metric2": {
      source: "/render/?from=3600&target=metric.b",
      TimeSeries: {
        parent: '#g2-2',
		width:600,
		height:200
      }
    }
  };


  var g = new Graphene;
  //g.demo();
  g.build(description);


}).call(this);
