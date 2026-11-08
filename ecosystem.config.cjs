/**
 * PM2 Production Ecosystem Configuration
 * Deployment Domain: kysu.fstack.asia
 *
 * CÁC LỆNH TRIỂN KHAI PRODUCTION:
 *   1. Build mã nguồn client:      npm run build
 *   2. Khởi động các tiến trình:   pm2 start ecosystem.config.cjs
 *   3. Khởi động lại khi cập nhật: npm run prod:restart
 *   4. Xem logs thời gian thực:    pm2 logs
 *   5. Dừng các tiến trình:        pm2 stop ecosystem.config.cjs
 */

module.exports = {
  apps: [
    // 1. Backend Server (Node.js Express + MySQL) - Cổng 4999
    //    Đồng thời tự động phục vụ file tĩnh client/dist (SPA Fallback)
    {
      name: 'kysu-backend',
      script: 'server.js',
      cwd: './server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4999,
        DEPLOY_DOMAIN: 'kysu.fstack.asia',
        CLIENT_ORIGIN: 'https://kysu.fstack.asia'
      }
    },

    // 2. Frontend Production Server (Vite 6 Production Preview) - Cổng 3000
    //    Phục vụ trực tiếp thư mục client/dist đã build hoàn thiện
    {
      name: 'kysu-frontend',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --host 0.0.0.0 --port 3000',
      cwd: './client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DEPLOY_DOMAIN: 'kysu.fstack.asia'
      }
    }
  ]
};
