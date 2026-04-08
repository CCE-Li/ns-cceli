#!/bin/bash

# 简化版部署脚本 - 解决 Qt 平台插件问题
# 目标目录：/home/lyx/nginx/www/ns-cceli

set -e

echo "?? 开始部署路由配置考试模拟器..."

# 1. 清理之前的构建
echo "?? 清理之前的构建..."
rm -rf dist node_modules/.vite

# 2. 重新安装依赖（确保依赖完整）
echo "?? 重新安装依赖..."
npm ci --production=false

# 3. 构建项目（使用多种方法尝试）
echo "?? 构建项目..."

# 方法1：设置环境变量
export DISPLAY=:99
export QT_QPA_PLATFORM=offscreen
export ELECTRON_RUN_AS_NODE=1

if npm run build; then
    echo "? 构建成功！"
else
    echo "??  标准构建失败，尝试备用方法..."
    
    # 方法2：使用 npx 直接调用 vite
    if npx vite build; then
        echo "? 备用构建成功！"
    else
        echo "? 构建失败，请检查依赖和配置"
        exit 1
    fi
fi

# 4. 检查构建结果
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "? 构建目录为空，构建失败"
    exit 1
fi

echo "?? 构建文件列表："
ls -la dist/

# 5. 创建目标目录
echo "?? 创建目标目录..."
sudo mkdir -p /home/lyx/nginx/www/ns-cceli

# 6. 备份现有文件（如果存在）
if [ -d "/home/lyx/nginx/www/ns-cceli" ] && [ "$(ls -A /home/lyx/nginx/www/ns-cceli)" ]; then
    echo "?? 备份现有文件..."
    sudo cp -r /home/lyx/nginx/www/ns-cceli /home/lyx/nginx/www/ns-cceli.backup.$(date +%Y%m%d_%H%M%S)
fi

# 7. 复制构建文件
echo "?? 复制文件到目标目录..."
sudo cp -r dist/* /home/lyx/nginx/www/ns-cceli/

# 8. 设置文件权限
echo "?? 设置文件权限..."
sudo chown -R lyx:lyx /home/lyx/nginx/www/ns-cceli/
sudo chmod -R 755 /home/lyx/nginx/www/ns-cceli/

# 9. 验证部署
echo "?? 验证部署..."
if [ -f "/home/lyx/nginx/www/ns-cceli/index.html" ]; then
    echo "? index.html 存在"
else
    echo "? index.html 不存在"
    exit 1
fi

# 10. 重载 Nginx
echo "?? 重载 Nginx..."
sudo systemctl reload nginx

echo "? 部署完成！"
echo "?? 访问地址：http://ns.cceli.icu:1400"
echo "?? 部署文件："
ls -la /home/lyx/nginx/www/ns-cceli/
echo ""
echo "?? 下一步操作："
echo "1. 确保 Nginx 配置已正确设置"
echo "2. 测试访问：http://ns.cceli.icu:1400"
echo "3. 如有问题，检查 Nginx 日志：sudo tail -f /var/log/nginx/error.log"
