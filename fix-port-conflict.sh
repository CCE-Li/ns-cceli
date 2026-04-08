#!/bin/bash

# 端口冲突诊断和修复脚本

echo "🔍 诊断端口冲突问题..."

# 1. 检查端口占用情况
echo "📊 检查端口占用情况..."
echo "=== 端口 80 ==="
sudo netstat -tlnp | grep :80
echo ""
echo "=== 端口 443 ==="
sudo netstat -tlnp | grep :443
echo ""
echo "=== 端口 8089 ==="
sudo netstat -tlnp | grep :8089
echo ""

# 2. 检查正在运行的 Web 服务器
echo "🌐 检查正在运行的 Web 服务器..."
echo "=== Nginx 进程 ==="
ps aux | grep nginx | grep -v grep
echo ""
echo "=== Apache 进程 ==="
ps aux | grep apache | grep -v grep
echo ""
echo "=== 其他 Web 服务器 ==="
ps aux | grep -E "(httpd|lighttpd|caddy)" | grep -v grep
echo ""

# 3. 停止冲突的服务
echo "🛑 停止可能冲突的服务..."

# 停止 Apache（如果运行）
if systemctl is-active --quiet apache2; then
    echo "停止 Apache2..."
    sudo systemctl stop apache2
    sudo systemctl disable apache2
fi

if systemctl is-active --quiet httpd; then
    echo "停止 httpd..."
    sudo systemctl stop httpd
    sudo systemctl disable httpd
fi

# 停止可能运行的 Nginx 进程
echo "清理 Nginx 进程..."
sudo pkill -f nginx
sleep 2

# 4. 再次检查端口占用
echo "🔍 清理后再次检查端口..."
echo "=== 端口 80 ==="
sudo netstat -tlnp | grep :80
echo ""
echo "=== 端口 443 ==="
sudo netstat -tlnp | grep :443
echo ""

# 5. 尝试启动 Nginx
echo "🚀 尝试启动 Nginx..."
sudo systemctl start nginx

# 6. 检查启动状态
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx 启动成功！"
    echo "📊 Nginx 状态："
    sudo systemctl status nginx --no-pager -l
    echo ""
    echo "🌐 监听端口："
    sudo netstat -tlnp | grep nginx
else
    echo "❌ Nginx 启动失败"
    echo "📋 详细错误信息："
    sudo journalctl -u nginx -n 20 --no-pager
fi

echo ""
echo "📝 如果端口仍然被占用，可以："
echo "1. 使用不同端口（如 8080）"
echo "2. 手动杀死占用进程：sudo kill -9 <PID>"
echo "3. 检查 Docker 容器：sudo docker ps"
