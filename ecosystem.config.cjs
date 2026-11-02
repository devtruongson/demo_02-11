/**
 * PM2 Ecosystem Configuration
 * Deployment Domain: kysu.fstack.asia
 *
 * Chạy lệnh:
 *   pm2 start ecosystem.config.cjs              # Khởi động toàn bộ dịch vụ
 *   pm2 restart ecosystem.config.cjs            # Khởi động lại
 *   pm2 stop ecosystem.config.cjs               # Dừng các dịch vụ
 *   pm2 logs                                   # Xem log thời gian thực
 */

module.exports = {
  apps: [
    // 1. Backend Server (Node.js Express + MySQL)
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
        PORT: 5000,
        DEPLOY_DOMAIN: 'kysu.fstack.asia',
        CLIENT_ORIGIN: 'https://kysu.fstack.asia'
      },
      env_dev: {
        NODE_ENV: 'development',
        PORT: 5000,
        DEPLOY_DOMAIN: 'kysu.fstack.asia'
      }
    },

    // 2. Frontend Dev Server (Vite 6 Dev Server lắng nghe 0.0.0.0:3000 cho kysu.fstack.asia)
    {
      name: 'kysu-frontend',
      script: 'node_modules/vite/bin/vite.js',
      args: '--host 0.0.0.0 --port 3000',
      cwd: './client',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        DEPLOY_DOMAIN: 'kysu.fstack.asia'
      }
    }
  ]
};

