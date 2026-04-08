#!/bin/bash

# DNS 和域名诊断修复脚本

echo "🔍 诊断域名解析问题..."

# 1. 检查域名解析
echo "📊 检查域名 ns.cceli.icu 的 DNS 解析..."
echo "=== 使用 nslookup 检查 ==="
nslookup ns.cceli.icu
echo ""
echo "=== 使用 dig 检查（如果可用）==="
if command -v dig &> /dev/null; then
    dig ns.cceli.icu
else
    echo "dig 命令不可用"
fi
echo ""
echo "=== 使用 host 检查 ==="
host ns.cceli.icu
echo ""

# 2. 获取服务器公网 IP
echo "🌐 获取服务器公网 IP..."
echo "=== 公网 IPv4 地址 ==="
curl -s ifconfig.me
echo ""
echo "=== 公网 IPv6 地址（如果可用）==="
curl -s ifconfig.me/ip 2>/dev/null || echo "IPv6 不可用"
echo ""

# 3. 检查本地 hosts 文件
echo "📋 检查本地 hosts 文件..."
echo "=== /etc/hosts 内容 ==="
grep -E "(ns\.cceli\.icu|cceli\.icu)" /etc/hosts || echo "hosts 文件中没有相关记录"
echo ""

# 4. 检查 Nginx 配置中的 server_name
echo "🔧 检查 Nginx 配置..."
echo "=== 当前启用的站点配置 ==="
ls -la /etc/nginx/sites-enabled/
echo ""
echo "=== 检查 ns-cceli 配置文件 ==="
if [ -f "/etc/nginx/sites-available/ns-cceli" ]; then
    grep -n "server_name" /etc/nginx/sites-available/ns-cceli
else
    echo "配置文件不存在：/etc/nginx/sites-available/ns-cceli"
fi
echo ""

# 5. 测试端口连通性
echo "🌐 测试端口连通性..."
echo "=== 测试本地 1400 端口 ==="
curl -I http://localhost:1400 2>/dev/null | head -1 || echo "本地 1400 端口连接失败"
echo ""
echo "=== 测试公网 IP 1400 端口 ==="
PUBLIC_IP=$(curl -s ifconfig.me)
curl -I http://$PUBLIC_IP:1400 2>/dev/null | head -1 || echo "公网 IP 1400 端口连接失败"
echo ""

# 6. 检查防火墙设置
echo "🔥 检查防火墙设置..."
echo "=== UFW 状态 ==="
sudo ufw status verbose || echo "UFW 不可用"
echo ""
echo "=== iptables 规则（1400 端口）==="
sudo iptables -L -n | grep 1400 || echo "没有找到 1400 端口的 iptables 规则"
echo ""

# 7. 提供解决方案
echo "💡 解决方案建议："
echo ""
echo "1. 如果 DNS 解析不正确："
echo "   - 联系域名提供商检查 DNS 记录"
echo "   - 确保 A 记录指向正确的服务器 IP"
echo ""
echo "2. 如果防火墙阻止访问："
echo "   - 开放 1400 端口：sudo ufw allow 1400"
echo "   - 或添加 iptables 规则：sudo iptables -A INPUT -p tcp --dport 1400 -j ACCEPT"
echo ""
echo "3. 临时解决方案（本地测试）："
echo "   - 在本地电脑的 hosts 文件添加："
echo "     服务器IP ns.cceli.icu"
echo "     (Windows: C:\\Windows\\System32\\drivers\\etc\\hosts)"
echo "     (Linux/Mac: /etc/hosts)"
echo ""
echo "4. Nginx 配置检查："
echo "   - 确保 server_name 包含 ns.cceli.icu"
echo "   - 重启 Nginx：sudo systemctl restart nginx"
