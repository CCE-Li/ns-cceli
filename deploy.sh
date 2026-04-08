#!/bin/bash

# 路由配置考试模拟器部署脚本
# 目标目录：/home/lyx/nginx/www/ns-cceli

set -e

echo "?? 开始部署路由配置考试模拟器..."

# 1. 构建项目
echo "?? 构建项目..."
# 设置环境变量禁用 GUI 相关组件
export DISPLAY=:99
export QT_QPA_PLATFORM=offscreen
npm run build

# 2. 创建目标目录（如果不存在）
echo "?? 创建目标目录..."
sudo mkdir -p /home/lyx/nginx/www/ns-cceli

# 3. 复制构建文件到目标目录
echo "?? 复制文件到目标目录..."
sudo cp -r dist/* /home/lyx/nginx/www/ns-cceli/

# 4. 设置文件权限
echo "?? 设置文件权限..."
sudo chown -R lyx:lyx /home/lyx/nginx/www/ns-cceli/
sudo chmod -R 755 /home/lyx/nginx/www/ns-cceli/

# 5. 重启 Nginx
echo "?? 重启 Nginx..."
sudo systemctl reload nginx

echo "? 部署完成！"
echo "?? 访问地址：http://ns.cceli.icu:1400"
echo "?? Nginx 配置文件已生成：nginx-ns-cceli.conf"
echo ""
echo "?? 下一步操作："
echo "1. 将 nginx-ns-cceli.conf 内容添加到 Nginx 配置中"
echo "2. 如果有 SSL 证书，取消注释 HTTPS 配置部分"
echo "3. 测试访问：http://ns.cceli.icu:1400"
