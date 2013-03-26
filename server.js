var Express, File, Path, RequestContext, Whisper, server, whisper, appConfig;

express = require("express");

appConfig = require('./config.json');

File = require("fs");

  Path = require("path");

  Whisper = require("./lib/whisper");

  RequestContext = require("./lib/request_context");

  server = express();

  server.configure(function() {
    server.use(express.query());
    server.use(express["static"]("" + __dirname + "/public"));
    server.set("views", "" + __dirname + "/views");
    server.set("view engine", "jade");
    server.enable("json callback");
  });

  server.listen(appConfig.PORT);

  whisper = new Whisper(process.env.GRAPHITE_STORAGE || "/opt/graphite/storage");

  server.get("/", function(req, res, next) {
    whisper.index(function(error, metrics) {
      if (error) {
        next(error);
      }
      res.render("dashbd.jade",{metrics:metrics});
      
    });
  });

  server.get("/render", function(req, res, next) {
    var context, from, to;
	
	from = (Date.now() / 1000 - ((req.query.from) ? req.query.from : 7200)) ;
    
    to = Date.now() / 1000;
    context = new RequestContext({
      whisper: whisper,
      from: from,
      to: to,
      width: 800
    });
    context.evaluate(req.query.target.split(";"), function(error, results) {
      if (error) {
        res.send({
          error: error.message
        }, 400);
      } else {
        res.send(results);
      }
    });
  });
  
