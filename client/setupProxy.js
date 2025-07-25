const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      cookieDomainRewrite: 'localhost',
      onProxyReq: (proxyReq, req, res) => {
        if (req.headers.cookie) {
          proxyReq.setHeader('cookie', req.headers.cookie);
        }
      },
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  );
};
