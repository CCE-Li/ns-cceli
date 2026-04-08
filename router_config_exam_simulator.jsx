import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TerminalSquare, RotateCcw, Play, Trophy, TimerReset, CheckCircle2, XCircle, Cpu } from "lucide-react";

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
  const [stats, setStats] = useState({ ok: 0, wrong: 0, sessions: 0 });
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [showAnswerFlow, setShowAnswerFlow] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  const lab = useMemo(() => LABS.find((x) => x.id === labId) || LABS[0], [labId]);
  const current = lab.expected[stepIndex];
  const progress = Math.round((stepIndex / lab.expected.length) * 100);
  const prompt = promptFor(hostname, mode);

  useEffect(() => {
    setHostname(lab.device);
    setMode("user");
    setStepIndex(0);
    setLine("");
    setHistory([
      { type: "boot", text: `Info: Booting ${lab.device} practice environment...` },
      { type: "boot", text: `Info: Loaded lab: ${lab.title}` },
      { type: "boot", text: `Task: ${lab.objective}` },
    ]);
    setSeconds(0);
    setRunning(true);
    setStats((s) => ({ ...s, sessions: s.sessions + 1 }));
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [labId]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, line]);

  function resetLab() {
    setLabId(lab.id);
  }

  function handleSubmit() {
    const raw = line;
    const trimmed = raw.trim();
    if (!trimmed) return;

    const nextHistory = [...history, { type: "cmd", prompt, text: raw }];

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
    setTimeout(() => inputRef.current?.focus(), 20);
  }

  function formatTime(total) {
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
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
                </div>
                <div className="space-y-2">
                  <Button onClick={resetLab} className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500">
                    <RotateCcw className="mr-2 h-4 w-4" /> 重置本实验
                  </Button>
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
                  支持辅助命令：<br />display this-step<br />display next-3
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
                <ScrollArea className="h-[620px] pr-4">
                  <div className="space-y-2 font-mono text-sm leading-6">
                    {history.map((entry, idx) => (
                      <div key={idx}>
                        {entry.type === "cmd" && <div><span className="text-emerald-400">{entry.prompt}</span><span>{entry.text}</span></div>}
                        {entry.type === "boot" && <div className="text-cyan-400">{entry.text}</div>}
                        {entry.type === "ok" && <div className="text-emerald-400">{entry.text}</div>}
                        {entry.type === "done" && <div className="text-yellow-300">{entry.text}</div>}
                        {entry.type === "hint" && <div className="text-blue-400">{entry.text}</div>}
                        {entry.type === "err" && <div className="text-rose-400">{entry.text}</div>}
                      </div>
                    ))}
                    {current && (
                      <div className="flex items-center">
                        <span className="mr-1 text-emerald-400">{prompt}</span>
                        <Input
                          ref={inputRef}
                          value={line}
                          onChange={(e) => setLine(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSubmit();
                            }
                          }}
                          className="h-8 border-0 bg-transparent p-0 font-mono text-sm text-slate-100 shadow-none focus-visible:ring-0"
                          placeholder="输入命令后回车"
                        />
                      </div>
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
  );
}
