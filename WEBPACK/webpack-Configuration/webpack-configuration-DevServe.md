# DevServer

webpack-dev-sercer can be used to quickly develop an application.

## devServer

object

This set of options is picked up by webpack-dev-server and can be used to change its behavior in various ways. Here's a simple example tht gzips and serves everything from our dist/ directory in the project root:

webpack.config.js

``` js
var path = require('path');

module.exports = {
  // ...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
```

When the server is started, there will be a message prior to the list of resolved modules:

``` js
http://localhost:9000/
webpack output is served from /build/
Content not from webpack is served from /path/to/dist/
```

that will give some background on where the server is located and what it's serving.

If you're using dev-server through the Node.js API, the options in devServer will be ignored. Pass the options as a second parameter instead: new WebpackDevServer(compiler, {...}).

## devServer.after

function (app, server)

Provides the ability to execute custom middleware after all other middleware internally within the server.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    after: function(app, server) {
      // do fancy stuff
    }
  }
};
```

## devServr.allowedHosts

array

Provides the ability to execute custom middleware after all other middleware internally within the server.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    after: function(app, server) {
      // do fancy stuff
    }
  }
};
```

## devServer.allowedHosts

array

This option allows you to whitelist services that are allowed to access the dev server.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
  allowedHosts: [
    'host.com',
    'subdomain.host.com',
    'subdomain2.host.com',
    'host2.com'
    ]
  }
};
```

Mimicking django's ALLOWED_HOSTS, a value beginning with . can be used as a subdomain wildcard. .host.com will match host.com, www.host.com, and any other subdomain of host.com.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    // this achieves the same effect as the first example
    // with the bonus of not having to update your config
    // if new subdomain need to access the dev server
    allowedHosts: [
      'host.com',
      'host2.com'
    ]
  }
};
```

To use this option with the CLI pass the --allowed-hosts option a comma-delimited string.

``` js
webpack-deve-server --entry /entry/file --output-path /output/path --allowed-hosts .host.com,host2.com
```

## devServer.before

function (app, server)

Provides the ability to execute custom middleware prior to all other middleware internally within the server. This could be used to define custom handlers, for example: 

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    before: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.join({ custom: 'response' });
      });
    }
  }
};
```

## devServer.bonjour

This option broadcasts the server via ZeroConf networking on start.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    bonjour: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --bonjour
```

## devServer.clientLogLevel

string: 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'none' | 'warning'

none and warning are going to be deprecated at the next major version.

When usinng inline mode, the console in your DevTools will show you message e.g. before reloading, before an error or when Hot Module Replacement is enabled. Defaults to info.

devServer.clientLogLevel may be too verbose, you can turn logging off by setting it to 'silent'.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    clientLogLevel: 'silent'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --client-log-level silent
```

## devServer.color - CLI only

boolean

Enables/ Disables colors on the console.

``` js
webpack-dev-server --color
```

## devServer.compress

boolean

Enable gzip compression for everythig served:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    compress: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --compress
```

## devServer.contentBase

boolean: false string [ string ] number

Tell the server where to serve content from. 
This is only necessary if you want to serve static files.
devServer.publicPath will be used to determine where the bundles should be served from, and takes precedence.

By default it will use your current working directory to server content. To disable contentBase set it to false.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    contentBase: path.join(__dirname, 'public')
  }
};
```

It is also possible to serve fro multiple directories:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --content-base /path/to/content/dir
```

## devServer.disableHostCheck

boolean

When set to true this option bypasses host checking.
This is not recommended as apps that do not check the host are vulnerable to DNS rebinding attacks.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    disableHostCheck: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --disable-host-check
```

## devServer.filename

string

This option lets you reduce the compilations in lazy mode.
By default in lazy mode, every request results in a new compilation.
With filename, it's possible to only compile when a certain file is requested.

If output.filename is set to 'bundle.js' and devServer.filename is used like this:

webpack.config.js

``` js
module.exports = {
  // ...
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    lazy: true, 
    filename: 'bundle.js'
  }
};
```

It will now only compile the bundle when /bundle.js is requested.

filename has no effect when used without lazy mode.

## devServer.headers

object

Adds headers to all responses:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    headers: {
      'X-Custom-Foo': 'bar'
    }
  }
};
```

## devServer.historyApiFallback

boolean object

When using the HTML5 History API, the index.html page will likey have to served in place of any 404 responses. devServer.historyApiFallback is disabled by default. Enable it by passing:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    historyApiFallback: true
  }
};
```

By passing an object this behavior can be controlled further using options like rewrites:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html'},
        { from: /./, to: '/views/404.html'}
      ]
    }
  }
};
```

When using dots in your path (common with Angular), you may need to use the disableDotRule:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    historyFallback: {
      disableDotRule: true
    }
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --history-api-fallback
```

## devServer.hot

boolean

Enable webpack's Hot Module Replacement feature:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    hot: true
  }
};
```

## devServer.hotOnly

boolean

Enables Hot Module Replacement (see devServer.hot) without page refresh as fallback in case of build failures.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    hotOnly: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --hot-only
```

## devServer.http2

boolean: false

Server over HTTP/2 using spdy.
This option is ignored for Node 10.0.0 and above, as spdy is broken for those versions. 

The dev server will migrate over to Node's built-in HTTP/2 once Express supports it.

If devServer.http2 is not explicitly set to false, it will default to true when devServer.https is enabled. When devServer.http2 is enabled but the server is unable to server over HTTP/2, the server defaults to HTTPS.

HTTP/2 with a self-signed certificate:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    http2: true
  }
};
```

Provide your own certificate using the https option:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    https: true,
    https: {
      key: fs.readFileSync('/path/to/server.key'),
      cert: fs.readFileSync('/path/to/server.crt'),
      ca: fs.readFileSync('/path/to/ca.pem'),
    }
  }
};
```

Usage via CLI

``` js
webpack-dev-server --http2
```

To pass your own certificate via CLI, use the following options

``` js
webpack-dev-server --http2 --key /path/to/server.key --cert /path/to/server.crt --cacert /path/to/ca.pem
```

## devServer.index

string

The filename that is considered the index file.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    index: 'index.html'
  }
};
```

## devServer.info - CLI only

boolean

Output cli information. It is enabled by default.

``` js
webpack-dev-server --info=false
```

## devServer.injdectClient

boolean: false function (compilerConfig)

Tells devServer to inject a client. 
Setting devServer.injectClient to true will result in always injecting a client. It is possible to provide a function to inject conditionally:

``` js
module.exports = {
  // ...
  devServer: {
    injectClient: (compilerConfig) => compilerConfig.name === 'only-include'
  }
};
```

## devServer.injectHot

boolean: false function (compilerConfig)

Tells devServer to inject a Hot Module Replacement.
Setting devServer.injectHot to true will result in always injecting.
It is possible to provide a function to inject conditionally:

``` js
module.exports = {
  // ...
  devServer: {
    hot: true,
    injectHot: (compilerConfig) => compilerConfig.name === 'only-include'
  }
};
```

## devServer.inline

boolean

Toggle between the dev-server's two different modes.
By default the application will be served with inline mode enabled.
This means that a script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.

It is also possible to use iframe mode, which uses an < iframe > under a notification bar with messages about the build. To switch to iframe mode:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    inline: false
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --inline=false
```

## devServer.lazy

boolean

When devServer.lazy is enabled, the dev-server will only compile the bundle when it gets requested. 
This means that webpack will not watch any file changes. We call this lazy mode.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    lazy: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --lazy
```

## devServer.liveReload

boolean: true

By default, the dev-server will reload/ refresh the page when file changes are detected.

devServer.hot option must be disabled or devServer.watchContentBase option must be enabled in order for liveReload to take effect.

Disable devServer.liveReload by setting it to false:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    liveReload: false
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --no-live-reload
```

## devServer.mimeTypes

object

Allows dev-server to register custom mime types.
The object is passed to the underlying webpack-dev-middleware. 

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    mimeTypes: { 
      'text/html' : ['phtml']
    }
  }
};
```

## devServer.noInfo

boolean

Tells dev-server to supress messages like the webpack bundle information.
Errors and warnings will still be shown. devServer.noInfo is disabled by default.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    noInfo: true
  }
};
```

## devServer.open

boolean: false string

Tells dev-server to open the browser after server had been started. 
Set it to true to open your default browser.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    open: true
  }
};
```

Provide browser name to use instead of the default one:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    open: 'Google Chrome'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --open 'Google Chrome'
```

## devServer.openPage

string

Specify a page to navigate to when opening the browser.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    openPage: '/different/page'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --open-page "/different/page"
```

## devServer.overlay

boolean object: { boolean errors, boolean warnings }

Shows a full-screen overlay in the browser when there are compiler errors or warnings. Disabled by default. If you want to show only compiler errors: 

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    overlay: true
  }
};
```

If you want to show warnings as well as errors:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
};
```

## devServer.pfx

string

When used via the CLI, a path to an SSL .pfx file.
If used in options, it should be the bytestream of the .pfx file.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    pfx: '/path/to/file.pfx'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --pfx /path/to/file.pfx
```

## devServer.pfxPassphrase

string

The passphrase to a SSL PFX file.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    pfxPassphrase: 'passphrase'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --pfx-passphrase passphrase
```

## devServer.port

number

Specify a port number to listen for requests on:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    port: 8080
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --port 8080
```

## devServer.proxy

object [ object, function ]

Proxying some URLS can be useful when you have a separate API backend developement server and you want to send API requests on the same domain.

The dev-server makes use of the powerful http-proxy-middleware package. Check out its documentation for more advanced usages.

Note that some of http-proxy-middleware's features do not requie a target key, e.g. its router feature, but you will still need to include a target key in your config here, otherwise webpack-dev-server won't pass it along to http-proxy-middleware.

With a backend on localhost: 3000, you can use this to enable proxying:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```

A request to /api/users will now proxy the request to http://localhost:3000/api/users.

If you don't want /api to be passed along, we need to rewrite the path:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api' : ''}
      }
    }
  }
};
```

A backend server running on HTTPS with an invalid certificate will not be accepted by default. If you want to, modify your config like this:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false
      }
    }
  }
};
```

Sometimes you don't want to proxy everything. It is possible to bypass the proxy based on the return value of a function.

In the function you get access to the request, response and proxy options. It must return either false or a path that will be served instead of continuing to proxy the request.

E.g. for a browser request, you want to serve a HTML page, but for an API request you want to proxy it.

You could do something like this:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: {
      'api': {
        target: 'http://localhost:3000',
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.index('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
};
```

If you want to proxy multiple, specific paths to the same target, you can use an array of one or more objects with a context property:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: [{
      context: ['/auth', '/api'],
      target: 'http://localhost:3000',
    }]
  }
};
```

Note that requests to root won't be proxied by default.
To enable root proxying, the devServer.index option should be specified as a falsy value:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    index: '', // specify to enable root proxying
    host: '...',
    contentBase: '...',
    proxy: {
      context: () => true,
      target: 'http://localhost:1234'
    }
  }
};
```

The origin of the host header is kept when proxying by default, you can set changeOrigin to true to override this behaviour.

It is useful in some cases like using name-based virtual hosted sites.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
      changeOrigin: true
    }
  }
};
```

## devServer.progress - CLI only

boolean

Output running progress to console.

``` js
webpack-dev-server --progress
```

## devServer.public

string

When using inline mode and you're proxying dev-server, the inline client script not always know where to connect to. It will try to guess the URL of the server based on window.location, but if that fails you'll need to use this.

For example, the dev-server is proxied by nginx, and available on myapp.test:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    public: 'myapp.test:80'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --public myapp.test:80
```

## devServer.publicPath

string

The bundled files will be available in the browser under this path.

Imagine that the server is runing under http://localhost:8080 and output.filename is set to bundle.js.

By default the devServer.publicPath is '/', so your bundle is available as http://localhost:8080/bundle.js.

Change devServer.publicPath to put bundle under specific directory:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    publicPath: '/assets/'
  }
};
```

The bundle will now be available as http://localhost:8080/assets/bundle.js .

It is also possible to use a full URL.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    publicPath: 'http://localhost:8080/assets/'
  }
};
```

The bundle will also be available as http://localhost:8080/assets/bundle.js.


## devServer.quiet

boolean

With devServer.quiet enabled, noting except the initial startup information will be written to the console. This also means that errors or warnings from webpack are not visible.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    quiet: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --quiet
```

## devServer.serveIndex

boolean: true

Tells dev-server to use serveIndex middleware when enabled.

serveIndex middleware generates directory listings on viewing directories that don't have an index.html file.

``` js
module.exports = {
  // ...
  devServer: {
    serveIndex: true
  }
};
```

## devServer.setup

function (app, server)

Here you can access the Express app object and add your own custom middleware to it. 
For example, to define custom handlers for some paths:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    setup: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```

## devServer.socket

string

The Unix socket to listen to (instead of a host).

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    socket: 'socket'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --socket socket
```

## devServer.sockHost

string

Tells clients connected to devServer to use provided socket host.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    sockHost: 'myhost.test'
  }
};
```

## devServer.sockPath

string: '/sockjs-node'

The path at which to connect to the reloading socket.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    sockPath: '/socket'
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --sockPath /socket
```

## devServer.sockPort

number string

Tells clients connected to devServer to use provided socket port.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    sockPort: 8080
  }
};
```

## devServer.staticOptions

It is possible to configure advanced options for serving static files from contentBase. 

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    staticOptions: {
      redirect: false
    }
  }
};
```

## devServer.stats

string: 'none' | 'errors-only' | 'minimal' | 'normal' | 'verbose' object

This option lets you precisely control what bundle information gets displayed. This can be a nice middle ground if you want some bundle information, but not all of it.

To show only errors in your bundle:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    stats: 'errors-only'
  }
};
```

## devServer.stdin - CLI only

boolean

This option closes the server when stdin ends.

``` js
webpack-dev-server --stdin
```

## devServer.useLocalIp

boolean

This option lets the browser open with your local IP.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    useLocalIp: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --useLocalIp
```

## devServer.watchContentBase

boolean

Tell dev-server to watch the files served by the devServer,contentBase option.

It is disabled by default.
When enabled, file changes will trigger a full page reload.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    watchContentBase: true
  }
};
```

Usage via the CLI

``` js
webpack-dev-server --watch-content-base
```

## devServer.watchOptions

object

Control options related to watching the files.

webpack uses the file system to get notified of file changes.
In some cases this does not work.
For example, when using Network File System (NFS).

Vagrant also has a lot of problems with this.
In these cases, use polling:

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    watchOptions: {
      poll: true
    }
  }
};
```

If this is too heavy on the file system, you can change this to an integer to set the interval in milliseconds.

## devServer.writeToDisk

boolean: false function (filePath)

Tells devServer to write generated assets to the disk.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    writeToDisk: true
  }
};
```

Providing a Function to devServer.writeToDisk can be used for filtering. The function follows the same premise as Array#filter in which a boolean return value tells if the file should be written to disk.

webpack.config.js

``` js
module.exports = {
  // ...
  devServer: {
    writeToDisk: (filePath) => {
      return /superman\.css$/.test(filePath);
    }
  }
};
```