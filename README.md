# Djangoless

Use [Graphene](http://jondot.github.com/graphene/) directly on top of whisper and carbon, without the default django app of graphite. It runs on the same server where graphite is hosted avoiding the need of jsonp or CORS requests for generating the graphene graphs.

This is forked from [whisper-to-me](https://github.com/assaf/whisper-to-me) with graphene dashboard direclty integrated with the app to plot realtime graphs without any pain. Also modified the server side codes to have less dependencies.

To install carbon and whisper.

    $ sudo pip install whisper
    $ sudo pip install carbon
    $ cp /opt/graphite/conf/carbon.conf.example /opt/graphite/conf/carbon.conf
    $ cp /opt/graphite/conf/storage-schemas.conf.example /opt/graphite/conf/storage-schemas.conf

To get the stuff working, simply configure the graphene dashboard with source attribute set as a relative url. Like

    source: "/render/?from=7200&target=stats.application.*"
    
or metrics separated by `;` and give the unix timestamp from which you need to fetch the data in `from` variable.

    source: "/render/?from=7200&target=stats.application.a;stats.application.b"
    
You may find the graphe dashboard config example in the public folder.
    
Fire up Carbon and start collecting data:  

    $ /opt/graphite/bin/carbon-cache.py start

Now run the Web server with root privillages:

    $ node server.js

If your machine stores Whisper files in any other directory, you need to tell the server where to look by setting the
environment variable `GRAPHITE_STORAGE`.  The default path is `/opt/graphite/storage`.

**Note**
Its is just an experiment and nothing more.
