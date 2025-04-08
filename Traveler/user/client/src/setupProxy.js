// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 기존 localhost 프록시 (백엔드용)
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
  
  // 네이버 Geocoding API 프록시
  app.use(
    '/naver-api',
    createProxyMiddleware({
      target: 'https://naveropenapi.apigw.ntruss.com',
      changeOrigin: true,
      pathRewrite: { '^/naver-api': '' }, // 경로 리라이트
      secure: false,
    })
  );
};
