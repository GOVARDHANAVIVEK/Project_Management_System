const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 5000;

// Logging function
const logRequestDetails = (req) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
};

// Proxy Middleware with Logging
const proxyOptions = (target) => ({
    target,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logRequestDetails(req); // Log incoming request details
        console.log('Request Headers:', req.headers);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`[${new Date().toISOString()}] Response received for ${req.method} ${req.originalUrl}`);
        console.log('Response Status:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
        console.error(`[${new Date().toISOString()}] Proxy Error:`, err.message);
    },
});

// Routes
app.use('/api/auth', createProxyMiddleware(proxyOptions('http://localhost:7001/')));
app.use('/api/tasks', createProxyMiddleware(proxyOptions('http://localhost:7002/')));
app.use('/api/projects', createProxyMiddleware(proxyOptions('http://localhost:7003/')));

// Start Server
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
