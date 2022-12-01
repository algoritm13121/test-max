/* eslint-disable import/no-commonjs, global-require, no-console */

let path = require('path');
let express = require('express');
let webpack = require('webpack');
let httpProxy = require('http-proxy');
let ip = require('ip');
let net = require('net');
let port = process.env.PORT || 4000;
let host = process.env.HOST || '0.0.0.0';
let app = express();
let apiProxy = httpProxy.createProxyServer();
let rootPath = path.resolve(__dirname, '..');
let config = require('./dev.config');
let compiler = webpack(config);
let timeoutId;

function retry (cb) {
    const client = net.connect(
        { port: 3000 },
        () => {
            clearTimeout(timeoutId);
            cb();
            client.end();
            timeoutId && process.stdout.write(' Done');
            timeoutId = null;
        }
    );

    client.on('error', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('Waiting for server...');
        timeoutId = setTimeout(() => retry(cb), 100);
    });
}

const instance = require('webpack-dev-middleware')(compiler, {
    headers: { 'Access-Control-Allow-Origin': '*' },
    publicPath: config[0].output.publicPath,
    quiet: false,
    noInfo: true,
    hot: false,
    inline: false,
    serverSideRender: true,
    stats: {
        timings: true,
        chunks: false,
        errors: true,
        modules: false,
        assets: false,
        errorDetails: true,
        children: false,
        warnings: true
    }
});

app.use(instance);

app.use(express.static(rootPath));

// Proxy api requests
app.all('*', function (req, res) {
    retry(() => apiProxy.web(req, res, {
        target: {
            port: 3000,
            host: 'localhost'
        }
    }));
});

instance.waitUntilValid(() => {
    console.log('|-------------------------------------|');
    console.log('|   Local: ', 'http://localhost:' + port, '    |');
    console.log('|  Remote: ', 'http://' + ip.address() + ':' + port, ' |');
    console.log('|-------------------------------------|');
});

app.listen(port, host, err => err && console.log(err));
console.info('Running static webpack server on port', port); // eslint-disable-line no-console
