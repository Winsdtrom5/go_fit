const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Define the proxy options
const proxyOptions = {
  target: 'http://gofit10858.byethost24.com', // Replace with the target URL
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/Server_Go_Fit/public', // Replace with the base path of your API
  },
};

// Create the proxy middleware
const apiProxy = createProxyMiddleware('/api', proxyOptions);

// Apply the proxy middleware
app.use(apiProxy);

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
