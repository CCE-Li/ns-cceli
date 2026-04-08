#!/bin/bash

# Nginx 修复和启动脚本

echo "🔧 检查和修复 Nginx 服务..."

# 1. 检查 Nginx 状态
echo "📊 检查 Nginx 状态..."
sudo systemctl status nginx

# 2. 检查 Nginx 配置语法
echo "🔍 检查 Nginx 配置语法..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置语法正确"
else
    echo "❌ Nginx 配置有误，请检查配置文件"
    exit 1
fi

# 3. 启动 Nginx 服务
echo "🚀 启动 Nginx 服务..."
sudo systemctl start nginx

# 4. 设置 Nginx 开机自启
echo "⚙️ 设置 Nginx 开机自启..."
sudo systemctl enable nginx

# 5. 检查 Nginx 是否正在运行
echo "🔍 验证 Nginx 运行状态..."
sudo systemctl is-active nginx
sudo systemctl status nginx

# 6. 检查 Nginx 是否监听端口
echo "🌐 检查端口监听..."
sudo netstat -tlnp | grep :80

echo "✅ Nginx 修复完成！"
echo ""
echo "📝 常用 Nginx 命令："
echo "启动: sudo systemctl start nginx"
echo "停止: sudo systemctl stop nginx"
echo "重启: sudo systemctl restart nginx"
echo "重载: sudo systemctl reload nginx"
echo "状态: sudo systemctl status nginx"
echo "配置测试: sudo nginx -t"
