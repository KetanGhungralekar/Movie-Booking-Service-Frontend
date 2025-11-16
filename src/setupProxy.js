const { createProxyMiddleware } = require('http-proxy-middleware');



module.exports = function(app) {
  // Auth + Users → 8083
  app.use(
    ['/auth', '/users'],
    createProxyMiddleware({
      target: 'http://localhost:8083',
      changeOrigin: true,
      // allow cookies/credentials if needed later
      // cookieDomainRewrite: 'localhost',
    })
  );

  // Movies + Shows + Bookings → 8086
  app.use(
    ['/movies', '/shows', '/bookings'],
    createProxyMiddleware({
      target: 'http://localhost:8086',
      changeOrigin: true,
    })
  );
};
