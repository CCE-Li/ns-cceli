import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TerminalSquare, RotateCcw, Play, Trophy, CheckCircle2, XCircle, Cpu, CircleHelp, X } from "lucide-react";

const LABS = [
  {
    id: "fw-basic",
    title: "FW 基础初始化",
    device: "FW",
    points: 5,
    description: "像真机一样逐步输入命令，系统实时回显、实时判定。",
    objective: "配置设备名、3 个三层接口和 Loopback1 的 IPv4/IPv6 地址。",
    initialPrompt: "<FW> ",
    expected: [
      { cmd: "system-view", mode: "user", nextMode: "system", ok: "Enter system view, return user view with Ctrl+Z." },
      { cmd: "sysname FW", mode: "system", effect: { hostname: "FW" }, ok: "" },
      { cmd: "interface GigabitEthernet1/0/1", mode: "system", nextMode: "if-GigabitEthernet1/0/1", ok: "" },
      { cmd: "ip address 10.16.255.1 30", mode: "if-GigabitEthernet1/0/1", ok: "" },
      { cmd: "ipv6 enable", mode: "if-GigabitEthernet1/0/1", ok: "" },
      { cmd: "ipv6 address 2001:DA8:10:16:255::1/126", mode: "if-GigabitEthernet1/0/1", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/1", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/2", mode: "system", nextMode: "if-GigabitEthernet1/0/2", ok: "" },
      { cmd: "ip address 10.16.255.5 30", mode: "if-GigabitEthernet1/0/2", ok: "" },
      { cmd: "ipv6 enable", mode: "if-GigabitEthernet1/0/2", ok: "" },
      { cmd: "ipv6 address 2001:DA8:10:16:255::5/126", mode: "if-GigabitEthernet1/0/2", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/2", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet0/0/3", mode: "system", nextMode: "if-GigabitEthernet0/0/3", ok: "" },
      { cmd: "ip address 20.23.1.1 30", mode: "if-GigabitEthernet0/0/3", ok: "" },
      { cmd: "ipv6 enable", mode: "if-GigabitEthernet0/0/3", ok: "" },
      { cmd: "ipv6 address 2001:DA8:223:20:23::1/126", mode: "if-GigabitEthernet0/0/3", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet0/0/3", nextMode: "system", ok: "" },
      { cmd: "interface LoopBack1", mode: "system", nextMode: "if-LoopBack1", ok: "" },
      { cmd: "ip address 10.0.0.254 32", mode: "if-LoopBack1", ok: "" },
      { cmd: "ipv6 enable", mode: "if-LoopBack1", ok: "" },
      { cmd: "ipv6 address 2001:DA8:10::254/128", mode: "if-LoopBack1", ok: "" },
      { cmd: "quit", mode: "if-LoopBack1", nextMode: "system", ok: "" },
      { cmd: "save", mode: "system", ok: "Warning: The current configuration will be written to the device.\nAre you sure to continue?[Y/N]:y\nInfo: Save the configuration successfully." },
    ],
    hints: ["先 system-view", "interface 进入正确接口视图", "Loopback1 很容易漏掉"]
  },
  {
    id: "sw-vlan",
    title: "SW VLAN 与接入口配置",
    device: "SW",
    points: 5,
    description: "训练 VLAN、access 口、Vlanif 的完整操作流。",
    objective: "创建 VLAN 并将指定接口加入 VLAN30/31/40/50，同时配置 Vlanif21 地址。",
    initialPrompt: "<SW> ",
    expected: [
      { cmd: "system-view", mode: "user", nextMode: "system", ok: "Enter system view, return user view with Ctrl+Z." },
      { cmd: "sysname SW", mode: "system", effect: { hostname: "SW" }, ok: "" },
      { cmd: "vlan batch 10 20 21 22 23 24 30 31 40 50 1000 1001 1002", mode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/6", mode: "system", nextMode: "if-GigabitEthernet1/0/6", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/6", ok: "" },
      { cmd: "port default vlan 30", mode: "if-GigabitEthernet1/0/6", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/6", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/7", mode: "system", nextMode: "if-GigabitEthernet1/0/7", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/7", ok: "" },
      { cmd: "port default vlan 30", mode: "if-GigabitEthernet1/0/7", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/7", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/8", mode: "system", nextMode: "if-GigabitEthernet1/0/8", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/8", ok: "" },
      { cmd: "port default vlan 31", mode: "if-GigabitEthernet1/0/8", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/8", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/9", mode: "system", nextMode: "if-GigabitEthernet1/0/9", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/9", ok: "" },
      { cmd: "port default vlan 31", mode: "if-GigabitEthernet1/0/9", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/9", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/10", mode: "system", nextMode: "if-GigabitEthernet1/0/10", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/10", ok: "" },
      { cmd: "port default vlan 40", mode: "if-GigabitEthernet1/0/10", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/10", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/11", mode: "system", nextMode: "if-GigabitEthernet1/0/11", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/11", ok: "" },
      { cmd: "port default vlan 40", mode: "if-GigabitEthernet1/0/11", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/11", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/13", mode: "system", nextMode: "if-GigabitEthernet1/0/13", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/13", ok: "" },
      { cmd: "port default vlan 50", mode: "if-GigabitEthernet1/0/13", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/13", nextMode: "system", ok: "" },
      { cmd: "interface GigabitEthernet1/0/14", mode: "system", nextMode: "if-GigabitEthernet1/0/14", ok: "" },
      { cmd: "port link-type access", mode: "if-GigabitEthernet1/0/14", ok: "" },
      { cmd: "port default vlan 50", mode: "if-GigabitEthernet1/0/14", ok: "" },
      { cmd: "quit", mode: "if-GigabitEthernet1/0/14", nextMode: "system", ok: "" },
      { cmd: "interface Vlanif21", mode: "system", nextMode: "if-Vlanif21", ok: "" },
      { cmd: "ip address 10.16.255.2 255.255.255.252", mode: "if-Vlanif21", ok: "" },
      { cmd: "ipv6 enable", mode: "if-Vlanif21", ok: "" },
      { cmd: "ipv6 address 2001:DA8:10:16:255::2/126", mode: "if-Vlanif21", ok: "" },
      { cmd: "quit", mode: "if-Vlanif21", nextMode: "system", ok: "" },
    ],
    hints: ["vlan batch 先做", "access 口每个接口要完整进出一次", "Vlanif21 是三层口"]
  },
  {
    id: "ssh-sec",
    title: "SW/AC SSH 安全配置",
    device: "SW",
    points: 5,
    description: "适合练‘进入 AAA → VTY → super password’的手感。",
    objective: "启用 SSH、配置 USER-SSH、限制 VTY 仅 SSH 登录。",
    initialPrompt: "<SW> ",
    expected: [
      { cmd: "system-view", mode: "user", nextMode: "system", ok: "Enter system view, return user view with Ctrl+Z." },
      { cmd: "stelnet server enable", mode: "system", ok: "Info: Succeeded in starting the Stelnet server." },
      { cmd: "aaa", mode: "system", nextMode: "aaa", ok: "" },
      { cmd: "local-user USER-SSH password irreversible-cipher 123456", mode: "aaa", ok: "" },
      { cmd: "local-user USER-SSH service-type ssh", mode: "aaa", ok: "" },
      { cmd: "local-user USER-SSH privilege level 15", mode: "aaa", ok: "" },
      { cmd: "quit", mode: "aaa", nextMode: "system", ok: "" },
      { cmd: "user-interface vty 0 9", mode: "system", nextMode: "ui-vty-0-9", ok: "" },
      { cmd: "authentication-mode aaa", mode: "ui-vty-0-9", ok: "" },
      { cmd: "protocol inbound ssh", mode: "ui-vty-0-9", ok: "" },
      { cmd: "quit", mode: "ui-vty-0-9", nextMode: "system", ok: "" },
      { cmd: "super password level 3 cipher enable", mode: "system", ok: "" },
    ],
    hints: ["用户数 10 对应 vty 0 9", "AAA 视图最容易忘记 quit", "protocol inbound 只能 ssh"]
  },
  {
    id: "ospf-core",
    title: "SW OSPF 与默认路由发布联动",
    device: "SW",
    points: 10,
    description: "实时提示你是否在正确视图里做了正确宣告。",
    objective: "在 SW 上完成 OSPF 进程、area 0、MD5 认证、网段宣告。",
    initialPrompt: "<SW> ",
    expected: [
      { cmd: "system-view", mode: "user", nextMode: "system", ok: "Enter system view, return user view with Ctrl+Z." },
      { cmd: "ospf 1 router-id 10.0.0.253", mode: "system", nextMode: "ospf-1", ok: "" },
      { cmd: "area 0", mode: "ospf-1", nextMode: "ospf-area-0", ok: "" },
      { cmd: "authentication-mode md5 1 cipher Huawei@123", mode: "ospf-area-0", ok: "" },
      { cmd: "network 10.16.255.0 0.0.0.255", mode: "ospf-area-0", ok: "" },
      { cmd: "network 192.168.130.0 0.0.0.255", mode: "ospf-area-0", ok: "" },
      { cmd: "network 192.168.131.0 0.0.0.255", mode: "ospf-area-0", ok: "" },
      { cmd: "network 192.168.140.0 0.0.0.255", mode: "ospf-area-0", ok: "" },
      { cmd: "network 192.168.150.0 0.0.0.255", mode: "ospf-area-0", ok: "" },
      { cmd: "network 10.0.0.253 0.0.0.0", mode: "ospf-area-0", ok: "" },
      { cmd: "quit", mode: "ospf-area-0", nextMode: "ospf-1", ok: "" },
      { cmd: "quit", mode: "ospf-1", nextMode: "system", ok: "" },
    ],
    hints: ["ospf 进程下进 area", "认证在 area 视图下", "Loopback 用 0.0.0.0"]
  },
  {
    id: "fw-nat",
    title: "FW 源 NAT 与日志",
    device: "FW",
    points: 10,
    description: "训练防火墙对象、策略、NAT、日志的连续配置链。",
    objective: "创建地址集 ZBYW、源 NAT 规则与日志主机。",
    initialPrompt: "<FW> ",
    expected: [
      { cmd: "system-view", mode: "user", nextMode: "system", ok: "Enter system view, return user view with Ctrl+Z." },
      { cmd: "firewall zone trust", mode: "system", nextMode: "fw-zone-trust", ok: "" },
      { cmd: "add interface GigabitEthernet1/0/1", mode: "fw-zone-trust", ok: "" },
      { cmd: "add interface GigabitEthernet1/0/2", mode: "fw-zone-trust", ok: "" },
      { cmd: "quit", mode: "fw-zone-trust", nextMode: "system", ok: "" },
      { cmd: "nat address-group 1 223.20.23.1 223.20.23.1", mode: "system", ok: "" },
      { cmd: "address-set ZBYW type object", mode: "system", nextMode: "addrset-ZBYW", ok: "" },
      { cmd: "address 0 192.168.130.0 mask 255.255.255.0", mode: "addrset-ZBYW", ok: "" },
      { cmd: "address 1 192.168.131.0 mask 255.255.255.0", mode: "addrset-ZBYW", ok: "" },
      { cmd: "address 2 192.168.140.0 mask 255.255.255.0", mode: "addrset-ZBYW", ok: "" },
      { cmd: "address 3 192.168.150.0 mask 255.255.255.0", mode: "addrset-ZBYW", ok: "" },
      { cmd: "quit", mode: "addrset-ZBYW", nextMode: "system", ok: "" },
      { cmd: "security-policy", mode: "system", nextMode: "sec-policy", ok: "" },
      { cmd: "rule name trust_to_untrust", mode: "sec-policy", nextMode: "sec-rule-trust_to_untrust", ok: "" },
      { cmd: "source-zone trust", mode: "sec-rule-trust_to_untrust", ok: "" },
      { cmd: "destination-zone untrust", mode: "sec-rule-trust_to_untrust", ok: "" },
      { cmd: "source-address address-set ZBYW", mode: "sec-rule-trust_to_untrust", ok: "" },
      { cmd: "action permit", mode: "sec-rule-trust_to_untrust", ok: "" },
      { cmd: "quit", mode: "sec-rule-trust_to_untrust", nextMode: "sec-policy", ok: "" },
      { cmd: "quit", mode: "sec-policy", nextMode: "system", ok: "" },
      { cmd: "nat-policy", mode: "system", nextMode: "nat-policy", ok: "" },
      { cmd: "rule name NAT_ZBYW", mode: "nat-policy", nextMode: "nat-rule-NAT_ZBYW", ok: "" },
      { cmd: "source-zone trust", mode: "nat-rule-NAT_ZBYW", ok: "" },
      { cmd: "destination-zone untrust", mode: "nat-rule-NAT_ZBYW", ok: "" },
      { cmd: "source-address address-set ZBYW", mode: "nat-rule-NAT_ZBYW", ok: "" },
      { cmd: "action source-nat address-group 1 no-pat", mode: "nat-rule-NAT_ZBYW", ok: "" },
      { cmd: "quit", mode: "nat-rule-NAT_ZBYW", nextMode: "nat-policy", ok: "" },
      { cmd: "quit", mode: "nat-policy", nextMode: "system", ok: "" },
      { cmd: "info-center loghost 192.168.200.10 port 3000", mode: "system", ok: "Info: Loghost configured successfully." },
    ],
    hints: ["地址簿名字必须是 ZBYW", "no-pat 是关键题眼", "security-policy 和 nat-policy 是两段"]
  },
];

const normalize = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

function promptFor(hostname, mode) {
  if (mode === "user") return `<${hostname}> `;
  if (mode === "system") return `[${hostname}] `;
  if (mode === "aaa") return `[${hostname}-aaa] `;
  if (mode === "ospf-1") return `[${hostname}-ospf-1] `;
  if (mode === "ospf-area-0") return `[${hostname}-ospf-1-area-0.0.0.0] `;
  if (mode === "ui-vty-0-9") return `[${hostname}-ui-vty0-9] `;
  if (mode === "fw-zone-trust") return `[${hostname}-zone-trust] `;
  if (mode === "addrset-ZBYW") return `[${hostname}-address-set-ZBYW] `;
  if (mode === "sec-policy") return `[${hostname}-policy-security] `;
  if (mode === "sec-rule-trust_to_untrust") return `[${hostname}-policy-security-rule-trust_to_untrust] `;
  if (mode === "nat-policy") return `[${hostname}-policy-nat] `;
  if (mode === "nat-rule-NAT_ZBYW") return `[${hostname}-policy-nat-rule-NAT_ZBYW] `;
  if (mode.startsWith("if-")) return `[${hostname}-${mode.slice(3)}] `;
  return `[${hostname}] `;
}


function getStepExplanation(lab, step) {
  if (!step) return null;

  const cmd = step.cmd;

  if (cmd === "system-view") {
    return {
      title: "进入系统视图",
      action: "这一步是在从用户视图进入配置视图，后续大部分配置命令都必须在这里或其子视图里执行。",
      principle: "华为设备把操作分成不同视图。用户视图主要用于查看，系统视图才允许改配置，所以先切到 system-view 才能继续实验。",
    };
  }

  if (cmd.startsWith("sysname ")) {
    return {
      title: "设置设备名称",
      action: "这一步是在给设备改主机名，让提示符和配置身份更清晰。",
      principle: "设备名会出现在命令行提示符、日志和排障输出中。网络里设备多时，统一命名能明显降低误操作概率。",
    };
  }

  if (cmd.startsWith("interface ")) {
    return {
      title: "进入接口视图",
      action: "这一步是在选中要配置的接口，把后续 IP、VLAN、链路类型等配置绑定到这个端口上。",
      principle: "接口级配置只对当前接口生效。先进入接口视图，再下发参数，设备才能知道配置属于哪一个物理口或逻辑口。",
    };
  }

  if (cmd.startsWith("ip address ")) {
    return {
      title: "配置 IPv4 地址",
      action: "这一步是在给当前三层接口或逻辑接口分配 IPv4 地址。",
      principle: "IP 地址决定设备在三层网络中的身份。没有地址，接口就不能参与路由、网关转发或远程管理。",
    };
  }

  if (cmd === "ipv6 enable") {
    return {
      title: "启用 IPv6 功能",
      action: "这一步是在当前接口上打开 IPv6 能力，为后续下发 IPv6 地址做准备。",
      principle: "很多华为设备接口默认未启用 IPv6。先 enable，再配置 IPv6 地址，设备才会建立 IPv6 协议栈和相关邻居发现能力。",
    };
  }

  if (cmd.startsWith("ipv6 address ")) {
    return {
      title: "配置 IPv6 地址",
      action: "这一步是在为当前接口分配 IPv6 地址。",
      principle: "IPv6 地址让接口能参与 IPv6 通信、路由和邻居发现。IPv4 和 IPv6 是两套并行协议，通常要分别配置。",
    };
  }

  if (cmd === "save") {
    return {
      title: "保存当前配置",
      action: "这一步是在把运行配置写入持久化存储，避免设备重启后丢失。",
      principle: "很多网络设备区分运行配置和保存配置。只改运行配置虽然立即生效，但如果不 save，重启后通常会恢复。",
    };
  }

  if (cmd.startsWith("vlan batch ")) {
    return {
      title: "批量创建 VLAN",
      action: "这一步是在一次性创建实验需要的多个 VLAN。",
      principle: "VLAN 用来隔离二层广播域。先创建 VLAN，再把接口加入对应 VLAN，交换机才知道各端口属于哪个逻辑网络。",
    };
  }

  if (cmd === "port link-type access") {
    return {
      title: "把接口设为 Access 口",
      action: "这一步是在把当前接口设置成单 VLAN 接入口。",
      principle: "Access 口通常连接终端，只承载一个业务 VLAN。交换机会在入口和出口按接入口规则处理帧，不像 Trunk 那样承载多个 VLAN。",
    };
  }

  if (cmd.startsWith("port default vlan ")) {
    return {
      title: "指定接口默认 VLAN",
      action: "这一步是在把当前接入口加入目标 VLAN。",
      principle: "Access 口收到未打标签流量时，会归入默认 VLAN。这样终端接入后就被划入对应广播域和网段。",
    };
  }

  if (cmd === "aaa") {
    return {
      title: "进入 AAA 视图",
      action: "这一步是在进入认证、授权、计费相关配置视图。",
      principle: "AAA 统一管理登录用户、认证方式和权限级别。SSH、本地账号和远程接入控制都常依赖这里的配置。",
    };
  }

  if (cmd === "stelnet server enable") {
    return {
      title: "启用 SSH 服务",
      action: "这一步是在让设备开启基于 SSH 的远程管理服务。",
      principle: "SSH 会对管理流量加密，比 Telnet 更安全。只有先启用服务，后面的账号和 VTY 限制才有实际承载对象。",
    };
  }

  if (cmd.startsWith("local-user ") && cmd.includes("password")) {
    return {
      title: "创建本地 SSH 用户",
      action: "这一步是在创建本地登录账号并设置口令。",
      principle: "远程管理需要合法身份认证。本地用户是最常见的基础认证方式，设备会用它校验 SSH 登录请求。",
    };
  }

  if (cmd.startsWith("local-user ") && cmd.includes("service-type ssh")) {
    return {
      title: "限制用户服务类型",
      action: "这一步是在规定该用户只能用于 SSH 登录。",
      principle: "把账号用途限制到特定接入方式，可以减少暴露面，避免同一账号被用于不需要的服务。",
    };
  }

  if (cmd.startsWith("local-user ") && cmd.includes("privilege level")) {
    return {
      title: "设置用户权限级别",
      action: "这一步是在赋予该用户更高的管理权限。",
      principle: "设备通常按权限级别控制可执行命令。只有足够高的权限，登录后才能完成配置和维护操作。",
    };
  }

  if (cmd.startsWith("user-interface vty ")) {
    return {
      title: "进入 VTY 远程登录线路",
      action: "这一步是在配置远程登录通道本身。",
      principle: "VTY 是虚拟终端线路。即使用户和 SSH 服务已配置好，如果 VTY 不允许或未正确认证，远程登录仍然无法使用。",
    };
  }

  if (cmd === "authentication-mode aaa") {
    return {
      title: "设置 VTY 使用 AAA 认证",
      action: "这一步是在要求 VTY 登录时走 AAA 认证链路。",
      principle: "这样设备会把登录认证交给 AAA 配置处理，而不是使用更弱或不统一的独立认证方式。",
    };
  }

  if (cmd === "protocol inbound ssh") {
    return {
      title: "限制仅允许 SSH 接入",
      action: "这一步是在禁止其他远程协议，只保留 SSH。",
      principle: "把入口协议收敛到 SSH，可以减少不安全协议暴露，降低被窃听和被扫描利用的风险。",
    };
  }

  if (cmd.startsWith("super password ")) {
    return {
      title: "配置高权限口令",
      action: "这一步是在设置进入高权限级别时使用的口令。",
      principle: "分级权限可以把普通运维和高风险操作隔离开，高权限口令相当于第二道保护。",
    };
  }

  if (cmd.startsWith("ospf ")) {
    return {
      title: "创建 OSPF 进程",
      action: "这一步是在启动动态路由协议 OSPF，并设置 Router ID。",
      principle: "OSPF 通过邻居关系自动学习路由。Router ID 是逻辑标识，用来唯一标记路由器实例。",
    };
  }

  if (cmd === "area 0") {
    return {
      title: "进入 OSPF Area 0",
      action: "这一步是在把后续网络宣告和认证配置放到骨干区域。",
      principle: "Area 0 是 OSPF 的骨干区域，其他区域通常都要与它连通。把核心网段放在 Area 0 是最常见设计。",
    };
  }

  if (cmd.startsWith("authentication-mode md5")) {
    return {
      title: "开启 OSPF MD5 认证",
      action: "这一步是在要求邻居之间用 MD5 校验建立 OSPF 邻接。",
      principle: "动态路由邻居如果没有认证，伪造设备可能注入错误路由。认证可以确认对端身份并保护协议报文。",
    };
  }

  if (cmd.startsWith("network ")) {
    return {
      title: "宣告 OSPF 网段",
      action: "这一步是在告诉 OSPF 哪些接口网段要参与协议和发布。",
      principle: "network 命令会把匹配到的接口纳入 OSPF，从而发送 Hello、建立邻居并通告对应网段。",
    };
  }

  if (cmd.startsWith("firewall zone ")) {
    return {
      title: "进入安全区域配置",
      action: "这一步是在定义防火墙的安全域。",
      principle: "防火墙很多策略都是基于安全域而不是单接口。先有 zone，后续安全策略和 NAT 规则才能按流向生效。",
    };
  }

  if (cmd.startsWith("add interface ")) {
    return {
      title: "把接口加入安全区域",
      action: "这一步是在把物理接口绑定到当前安全域。",
      principle: "接口属于哪个 zone，决定流量的源区和目的区判定结果，进而影响安全策略和 NAT 匹配。",
    };
  }

  if (cmd.startsWith("nat address-group ")) {
    return {
      title: "创建 NAT 地址池",
      action: "这一步是在定义源 NAT 可转换使用的公网地址。",
      principle: "地址池是 NAT 转换时可用的出口地址集合。后续规则匹配到内网流量后，会从这里取地址做映射。",
    };
  }

  if (cmd.startsWith("address-set ")) {
    return {
      title: "创建地址对象集",
      action: "这一步是在创建一个可复用的地址集合对象。",
      principle: "把多个网段封装成地址集后，策略和 NAT 可以直接引用对象，配置更简洁，也更容易维护。",
    };
  }

  if (cmd.startsWith("address ")) {
    return {
      title: "向地址集加入网段",
      action: "这一步是在把具体业务网段加入地址对象集。",
      principle: "地址集本身只是容器，真正参与匹配的是里面的成员地址。逐条加入后，策略才知道要匹配哪些源网段。",
    };
  }

  if (cmd === "security-policy") {
    return {
      title: "进入安全策略视图",
      action: "这一步是在开始配置防火墙放行策略。",
      principle: "防火墙默认强调按策略放行，进入 security-policy 后才能定义不同区域之间允许什么流量通过。",
    };
  }

  if (cmd.startsWith("rule name ") && step.nextMode?.startsWith("sec-rule-")) {
    return {
      title: "创建安全策略规则",
      action: "这一步是在定义一条具体的访问控制规则。",
      principle: "策略是按规则逐条匹配的。命名规则后，后面才能为它设置源区、目的区、源地址和动作。",
    };
  }

  if (cmd === "source-zone trust") {
    return {
      title: "指定源安全区域",
      action: "这一步是在声明流量来自哪个安全域。",
      principle: "防火墙规则通常根据源区和目的区判定方向，只有方向明确，规则匹配才准确。",
    };
  }

  if (cmd === "destination-zone untrust") {
    return {
      title: "指定目的安全区域",
      action: "这一步是在声明流量要去往哪个安全域。",
      principle: "把目的区设为 untrust，代表这条规则主要约束内网访问外网这一方向的流量。",
    };
  }

  if (cmd.startsWith("source-address address-set ")) {
    return {
      title: "引用源地址集",
      action: "这一步是在让策略或 NAT 只匹配地址集中的业务网段。",
      principle: "对象化引用比逐条写网段更稳定，后续只改地址集成员，引用它的规则就能同步生效。",
    };
  }

  if (cmd === "action permit") {
    return {
      title: "设置动作为放行",
      action: "这一步是在明确允许匹配到的流量通过。",
      principle: "规则前面的匹配条件负责定义范围，action 才真正决定流量是被放行还是被拒绝。",
    };
  }

  if (cmd === "nat-policy") {
    return {
      title: "进入 NAT 策略视图",
      action: "这一步是在开始配置地址转换规则。",
      principle: "安全策略决定流量能不能过，NAT 策略决定地址要不要改，两者职责不同，通常需要分别配置。",
    };
  }

  if (cmd.startsWith("rule name ") && step.nextMode?.startsWith("nat-rule-")) {
    return {
      title: "创建 NAT 规则",
      action: "这一步是在定义一条源 NAT 转换规则。",
      principle: "NAT 也是按规则匹配的。创建规则后，再逐项指定源区、目的区、源地址和转换动作。",
    };
  }

  if (cmd.startsWith("action source-nat ")) {
    return {
      title: "指定源 NAT 动作",
      action: "这一步是在把匹配流量的源地址改写成地址池中的公网地址。",
      principle: "源 NAT 会把内网地址转换成出口可达地址，外部网络看到的是转换后的源地址，返回流量再映射回原主机。",
    };
  }

  if (cmd.startsWith("info-center loghost ")) {
    return {
      title: "配置日志服务器",
      action: "这一步是在把设备日志转发到远端日志主机。",
      principle: "集中日志方便审计和排障。设备本地日志容量有限，送到 loghost 后更便于留痕和统一分析。",
    };
  }

  if (cmd === "quit") {
    return {
      title: "退出当前视图",
      action: "这一步是在离开当前子视图，回到上一级配置视图。",
      principle: "华为设备采用分层视图结构。完成某个对象的配置后，需要 quit 返回上层，才能继续配置别的对象或全局命令。",
    };
  }

  return {
    title: lab.title + " 当前步骤说明",
    action: "这一步是在按实验要求完成当前命令对应的配置动作。",
    principle: "网络设备配置强调顺序和上下文。只有在正确视图、正确顺序下输入命令，配置才会按预期生效。",
  };
}

function getFastfetchOutput() {
  return [
    "                   -`                    student@archlab",
    "                  .o+`                   ---------------------------",
    "                 `ooo/                   OS: Arch Linux x86_64",
    "                `+oooo:                  Host: Huawei Router Config Simulator",
    "               `+oooooo:                 Kernel: 6.10.0-arch1-1",
    "               -+oooooo+:                Uptime: 1 hour, 23 mins",
    "             `/:-:++oooo+:               Packages: 1337 (pacman)",
    "            `/++++/+++++++:              Shell: bash 5.2.37",
    "           `/++++++++++++++:             Terminal: tty1",
    "          `/+++ooooooooooooo/`           WM: Hyprland",
    "         ./ooosssso++osssssso+`          Theme: Adwaita [GTK4]",
    "        .oossssso-````/ossssss+`         Icons: Papirus-Dark",
    "       -osssssso.      :ssssssso.        Font: JetBrainsMono Nerd Font 11",
    "      :osssssss/        osssso+++.       Cursor: Block",
    "     /ossssssss/        +ssssooo/-       Terminal Font: JetBrainsMono Nerd Font 11",
    "   `/ossssso+/:-        -:/+osssso+-     CPU: Intel(R) Core(TM) i7-12700H (20) @ 4.70 GHz",
    "  `+sso+:-`                 `.-/+oso:    GPU: NVIDIA GeForce RTX 4060 Laptop GPU",
    " `++:.                           `-/+/   Memory: 6.42 GiB / 15.53 GiB",
    " .`                                 `/   Local IP: 192.168.130.10/24",
    "                                          Hint: btw, you use Arch",
  ].join("\n");
}
function getDiffHint(expectedCmd, actualCmd) {
  const exp = normalize(expectedCmd);
  const act = normalize(actualCmd);
  if (!act) return "这一行还没有输入命令。";
  if (exp.startsWith(act) && exp !== act) return `命令还没输完整，继续往后写。目标更接近：${expectedCmd}`;
  const expParts = exp.split(" ");
  const actParts = act.split(" ");
  let i = 0;
  while (i < expParts.length && i < actParts.length && expParts[i] === actParts[i]) i += 1;
  if (i === 0) return `当前这一步应该先做：${expectedCmd}`;
  return `前半段是对的，从第 ${i + 1} 段开始偏了。参考：${expectedCmd}`;
}

export default function RouterTerminalLab() {
  const [labId, setLabId] = useState(LABS[0].id);
  const [hostname, setHostname] = useState("FW");
  const [mode, setMode] = useState("user");
  const [stepIndex, setStepIndex] = useState(0);
  const [line, setLine] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [draftLine, setDraftLine] = useState("");
  const [completionIndex, setCompletionIndex] = useState(0);
  const [stats, setStats] = useState({ ok: 0, wrong: 0, sessions: 0 });
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [showAnswerFlow, setShowAnswerFlow] = useState(false);
  const [showStepGuide, setShowStepGuide] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const terminalViewportRef = useRef(null);

  const lab = useMemo(() => LABS.find((x) => x.id === labId) || LABS[0], [labId]);
  const current = lab.expected[stepIndex];
  const progress = Math.round((stepIndex / lab.expected.length) * 100);
  const prompt = promptFor(hostname, mode);
  const stepExplanation = useMemo(() => getStepExplanation(lab, current), [lab, current]);
  const completionCandidates = useMemo(() => {
    const helperCommands = ["display this-step", "display next-3", "undo last", "fastfetch", "?"];
    const modeCommands = lab.expected
      .filter((item, index) => index >= stepIndex && item.mode === mode)
      .map((item) => item.cmd);
    const unique = [...new Set([current?.cmd, ...modeCommands, ...helperCommands].filter(Boolean))];
    const trimmed = line.trim();

    if (!trimmed) return unique;
    return unique.filter((cmd) => normalize(cmd).startsWith(normalize(trimmed)));
  }, [current?.cmd, lab.expected, line, mode, stepIndex]);
  const activeCompletion =
    completionCandidates.length > 0
      ? completionCandidates[((completionIndex % completionCandidates.length) + completionCandidates.length) % completionCandidates.length]
      : "";
  const completionSuffix =
    activeCompletion &&
    normalize(activeCompletion).startsWith(normalize(line.trim())) &&
    line.trim().length > 0 &&
    line.trim().length < activeCompletion.length
      ? activeCompletion.slice(line.trim().length)
      : "";

  useEffect(() => {
    setHostname(lab.device);
    setMode("user");
    setStepIndex(0);
    setLine("");
    setCommandHistory([]);
    setHistoryCursor(-1);
    setDraftLine("");
    setCompletionIndex(0);
    setHistory([
      { type: "boot", text: `Info: Booting ${lab.device} practice environment...` },
      { type: "boot", text: `Info: Loaded lab: ${lab.title}` },
      { type: "boot", text: `Task: ${lab.objective}` },
    ]);
    setSeconds(0);
    setRunning(true);
    setStats((s) => ({ ...s, sessions: s.sessions + 1 }));
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  }, [labId]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!terminalViewportRef.current) return;
    const viewport = terminalViewportRef.current;
    viewport.scrollTop = viewport.scrollHeight;
  }, [history, line]);

  function resetLab() {
    setHostname(lab.device);
    setMode("user");
    setStepIndex(0);
    setLine("");
    setCommandHistory([]);
    setHistoryCursor(-1);
    setDraftLine("");
    setCompletionIndex(0);
    setHistory([
      { type: "boot", text: "Info: Booting " + lab.device + " practice environment..." },
      { type: "boot", text: "Info: Loaded lab: " + lab.title },
      { type: "boot", text: "Task: " + lab.objective },
    ]);
    setSeconds(0);
    setRunning(true);
    setStats((s) => ({ ...s, sessions: s.sessions + 1 }));
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  }

  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const nextHistory = [...history, { type: "cmd", prompt, text: raw }];
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryCursor(-1);
    setDraftLine("");
    setCompletionIndex(0);

    if (!current) {
      setHistory([...nextHistory, { type: "ok", text: "All required steps are finished. Use reset to practice again." }]);
      setLine("");
      return;
    }

    if (normalize(trimmed) === "display this-step") {
      setHistory([...nextHistory, { type: "hint", text: `当前标准命令：${current.cmd}` }]);
      setLine("");
      return;
    }

    if (normalize(trimmed) === "display next-3") {
      const preview = lab.expected.slice(stepIndex, stepIndex + 3).map((x, i) => `${i + 1}. ${x.cmd}`).join(" | ");
      setHistory([...nextHistory, { type: "hint", text: preview }]);
      setLine("");
      return;
    }

    if (normalize(trimmed) === "undo last") {
      setHistory([...nextHistory, { type: "hint", text: "训练模式下不支持真正回滚，但你可以继续输入当前应做的正确命令。" }]);
      setLine("");
      return;
    }

    if (trimmed === "?") {
      const helpText = current
        ? `当前需要输入：${current.cmd}。当前视图：${promptFor(hostname, current.mode).trim()}`
        : "当前实验已经完成，可以切换实验或点击重置本实验。";
      setHistory([...nextHistory, { type: "hint", text: helpText }]);
      setLine("");
      return;
    }

    if (normalize(trimmed) === normalize(current.cmd) && mode === current.mode) {
      let newMode = mode;
      let newHostname = hostname;
      if (current.nextMode) newMode = current.nextMode;
      if (current.effect?.hostname) newHostname = current.effect.hostname;

      const feedback = current.ok ? [{ type: "ok", text: current.ok }] : [{ type: "ok", text: "Command executed successfully." }];
      const newStep = stepIndex + 1;
      const completed = newStep >= lab.expected.length;
      setStats((s) => ({ ...s, ok: s.ok + 1 }));
      setHostname(newHostname);
      setMode(newMode);
      setStepIndex(newStep);
      setHistory([
        ...nextHistory,
        ...feedback,
        ...(completed ? [{ type: "done", text: `Lab completed in ${formatTime(seconds)}. You are ready for faster repetitions.` }] : []),
      ]);
      if (completed) setRunning(false);
    } else if (mode !== current.mode) {
      setStats((s) => ({ ...s, wrong: s.wrong + 1 }));
      setHistory([
        ...nextHistory,
        { type: "err", text: `Error: Wrong view. 当前应在 ${promptFor(hostname, current.mode).trim()} 这个视图下执行。` },
        { type: "hint", text: `下一步目标命令：${current.cmd}` },
      ]);
    } else {
      setStats((s) => ({ ...s, wrong: s.wrong + 1 }));
      setHistory([
        ...nextHistory,
        { type: "err", text: "Error: Unrecognized or incorrect command for this exam step." },
        { type: "hint", text: getDiffHint(current.cmd, trimmed) },
      ]);
    }

    setLine("");
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 20);
  }

    function formatTime(total) {
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function acceptCompletion() {
    if (!activeCompletion) return;
    setLine(activeCompletion);
    setCompletionIndex(0);
  }

  function cycleCompletion(direction) {
    if (completionCandidates.length === 0) return;
    setCompletionIndex((prev) => prev + direction);
  }

  function showHistoryEntry(nextCursor) {
    if (nextCursor < 0) {
      setHistoryCursor(-1);
      setLine(draftLine);
      return;
    }
    const historyIndex = commandHistory.length - 1 - nextCursor;
    if (historyIndex < 0 || historyIndex >= commandHistory.length) return;
    if (historyCursor === -1) {
      setDraftLine(line);
    }
    setHistoryCursor(nextCursor);
    setLine(commandHistory[historyIndex]);
    setCompletionIndex(0);
  }

  function handleSubmit() {
    executeCommand(line);
  }

  function handleInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      cycleCompletion(e.shiftKey ? -1 : 1);
      return;
    }

    if (e.key === "ArrowRight" && completionSuffix) {
      const input = e.currentTarget;
      if (input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
        e.preventDefault();
        acceptCompletion();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      showHistoryEntry(Math.min(historyCursor + 1, commandHistory.length - 1));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      showHistoryEntry(historyCursor - 1);
    }
  }

  return (
    <div className="relative">
      {showStepGuide && stepExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">步骤说明</div>
                <div className="mt-2 text-xl font-bold text-slate-100">{stepExplanation.title}</div>
                <div className="mt-2 text-sm text-slate-400">当前命令：<span className="font-mono text-emerald-300">{current?.cmd}</span></div>
              </div>
              <Button
                onClick={() => setShowStepGuide(false)}
                className="h-10 rounded-2xl border border-slate-700 bg-slate-950 px-3 text-slate-100 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-5 px-6 py-6 text-sm leading-7 text-slate-300">
              <div className="rounded-2xl bg-slate-950 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-amber-300">这一步在做什么</div>
                <div className="mt-2">{stepExplanation.action}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-emerald-300">原理是什么</div>
                <div className="mt-2">{stepExplanation.principle}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-2 rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TerminalSquare className="h-6 w-6" /> 终端式网络配置训练器
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>不是默写框，而是终端逐步配置。每敲一条命令，系统立即像设备一样给你回显、报错、提示视图是否正确。</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-emerald-900 text-emerald-200">实时反馈</Badge>
                <Badge className="bg-blue-900 text-blue-200">终端操作流</Badge>
                <Badge className="bg-amber-900 text-amber-200">逐步判定</Badge>
                <Badge className="bg-fuchsia-900 text-fuchsia-200">重复刷题</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-slate-400"><Cpu className="h-4 w-4" /> 当前实验</div>
              <div className="mt-2 text-xl font-bold">{lab.title}</div>
              <div className="mt-2 text-sm text-slate-400">{lab.points} 分</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-slate-400"><Trophy className="h-4 w-4" /> 完成进度</div>
              <div className="mt-2 text-3xl font-bold">{progress}%</div>
              <div className="mt-2 text-sm text-slate-400">正确 {stats.ok} / 错误 {stats.wrong}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-lg">选择实验</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={labId} onValueChange={setLabId}>
                  <SelectTrigger className="border-slate-700 bg-slate-950 text-slate-100">
                    <SelectValue placeholder="选择实验" />
                  </SelectTrigger>
                  <SelectContent>
                    {LABS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="rounded-2xl bg-slate-950 p-3 text-sm text-slate-300">
                  <div className="font-semibold text-slate-100">实验目标</div>
                  <div className="mt-1">{lab.objective}</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 text-sm text-slate-300">
                  <div className="font-semibold text-slate-100">当前应做</div>
                  <div className="mt-1">第 {Math.min(stepIndex + 1, lab.expected.length)} / {lab.expected.length} 步</div>
                  <div className="mt-2">当前视图：<span className="text-emerald-300">{prompt.trim()}</span></div>
                  {current && (
                    <Button
                      onClick={() => setShowStepGuide(true)}
                      variant="outline"
                      className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                    >
                      <CircleHelp className="mr-2 h-4 w-4" /> 这一步在做什么？
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Button onClick={resetLab} className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500">
                    <RotateCcw className="mr-2 h-4 w-4" /> 重置本实验
                  </Button>
                  {current && (
                    <Button onClick={() => executeCommand(current.cmd)} className="w-full rounded-2xl bg-cyan-600 hover:bg-cyan-500">
                      <Play className="mr-2 h-4 w-4" /> 下一步
                    </Button>
                  )}
                  <Button onClick={() => setShowAnswerFlow((v) => !v)} variant="outline" className="w-full rounded-2xl border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800">
                    <Play className="mr-2 h-4 w-4" /> {showAnswerFlow ? "隐藏标准流程" : "显示标准流程"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-lg">训练提示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                {lab.hints.map((hint, i) => (
                  <div key={i} className="rounded-xl bg-slate-950 p-3">{hint}</div>
                ))}
                <div className="rounded-xl border border-dashed border-slate-700 p-3 text-slate-400">
                  支持辅助命令：<br />display this-step<br />display next-3<br />fastfetch<br />?<br />Tab 循环补全，右方向键接受补全，上下方向键查看历史命令
                </div>
              </CardContent>
            </Card>

            {showAnswerFlow && (
              <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-lg">标准操作流</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 rounded-xl bg-slate-950 p-3">
                    <div className="space-y-2 font-mono text-xs text-slate-300">
                      {lab.expected.map((item, idx) => (
                        <div key={idx} className={`${idx === stepIndex ? "text-emerald-300" : ""}`}>{idx + 1}. {item.cmd}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="rounded-2xl border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-lg">终端</CardTitle>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>耗时 {formatTime(seconds)}</span>
                  <span>会话 {stats.sessions}</span>
                </div>
              </div>
              <Progress value={progress} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-800 bg-black p-4">
                <ScrollArea ref={terminalViewportRef} className="h-[620px] pr-4">
                  <div className="space-y-2 font-mono text-sm leading-6">
                    {history.map((entry, idx) => (
                      <div key={idx}>
                        {entry.type === "cmd" && <div><span className="text-emerald-400">{entry.prompt}</span><span>{entry.text}</span></div>}
                        {entry.type === "boot" && <div className="whitespace-pre-wrap text-cyan-400">{entry.text}</div>}
                        {entry.type === "ok" && <div className="text-emerald-400">{entry.text}</div>}
                        {entry.type === "done" && <div className="text-yellow-300">{entry.text}</div>}
                        {entry.type === "hint" && <div className="text-blue-400">{entry.text}</div>}
                        {entry.type === "err" && <div className="text-rose-400">{entry.text}</div>}
                      </div>
                    ))}
                    {current && (
                      <>
                        <div className="flex items-center">
                          <span className="mr-1 text-emerald-400">{prompt}</span>
                          <div className="relative flex-1">
                            <div className="pointer-events-none absolute inset-0 flex items-center font-mono text-sm">
                              <span className="whitespace-pre text-slate-100">{line}</span>
                              <span
                                className={inputFocused ? "inline-block h-5 w-[0.7em] animate-pulse bg-emerald-300" : "inline-block h-5 w-[0.7em] bg-emerald-300 opacity-70"}
                              />
                              <span className="whitespace-pre text-slate-500">{completionSuffix}</span>
                            </div>
                            <Input
                              ref={inputRef}
                              value={line}
                              onChange={(e) => {
                                setLine(e.target.value);
                                setHistoryCursor(-1);
                                setCompletionIndex(0);
                              }}
                              onFocus={() => setInputFocused(true)}
                              onBlur={() => setInputFocused(false)}
                              onKeyDown={handleInputKeyDown}
                              className="relative h-8 border-0 bg-transparent p-0 font-mono text-sm text-transparent caret-transparent shadow-none focus-visible:ring-0"
                              placeholder="输入命令后回车，或输入 ? 查看当前提示"
                            />
                          </div>
                        </div>
                        <div className="pl-1 text-xs text-slate-500">
                          当前操作提示：{current.cmd}
                        </div>
                      </>
                    )}
                    {!current && (
                      <div className="mt-3 flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" /> 本实验所有必答步骤已完成。
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>
                </ScrollArea>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <div className="text-sm text-slate-400">正确提交</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-300">{stats.ok}</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <div className="text-sm text-slate-400">错误次数</div>
                  <div className="mt-2 text-2xl font-bold text-rose-300">{stats.wrong}</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <div className="text-sm text-slate-400">当前状态</div>
                  <div className="mt-2 flex items-center gap-2 text-lg font-bold">
                    {current ? <><XCircle className="h-5 w-5 text-amber-300" />进行中</> : <><CheckCircle2 className="h-5 w-5 text-emerald-300" />完成</>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}








































