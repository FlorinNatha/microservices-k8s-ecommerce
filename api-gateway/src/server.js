const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const services = require('./config/services');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logger

// Setup Proxies
// Note: We don't use express.json() globally here because http-proxy-middleware 
// works best when it proxies the raw request stream to downstream services.

Object.keys(services).forEach(service => {
  const { url, prefix } = services[service];
  
  app.use(prefix, createProxyMiddleware({
    target: url,
    changeOrigin: true,
    pathRewrite: {
      [`^${prefix}`]: prefix, // keep the same path
    },
    onError: (err, req, res) => {
      console.error(`Error in proxy for ${service}:`, err.message);
      res.status(502).json({
        status: 'error',
        message: 'Bad Gateway: The downstream service is currently unavailable.'
      });
    }
  }));
});

// Health check endpoint for the Gateway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API Gateway is running' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
