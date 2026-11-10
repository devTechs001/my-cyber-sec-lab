// Simulated Kali Linux terminal engine — Cyber EC Lab.
// Purely client-side: NO real commands are executed. It teaches command syntax
// and expected output against a fake, isolated lab network (192.168.56.0/24).

const FS = {
  "/": ["home", "etc", "var", "opt", "lab"],
  "/home": ["labuser"],
  "/home/labuser": ["notes.txt", "wordlists"],
  "/etc": ["passwd", "hosts", "os-release"],
  "/var": ["log"],
  "/var/log": ["auth.log"],
  "/opt": ["nmap", "burpsuite", "wireshark", "metasploit"],
  "/lab": ["metasploitable.txt", "dvwa.txt", "README.txt"],
};

const FILES = {
  "/home/labuser/notes.txt":
    "Lab notes:\n- attack box : kali (192.168.56.100)\n- target 1   : metasploitable2 (192.168.56.101)\n- target 2   : dvwa web app   (192.168.56.102)\n- NEVER bridge vulnerable VMs to the internet!",
  "/etc/os-release":
    "PRETTY_NAME=\"Kali Linux 2026.1\"\nNAME=\"Kali Linux\"\nVERSION=\"2026.1\"\nID=kali\nHOME_URL=\"https://www.kali.org/\"",
  "/etc/passwd":
    "root:x:0:0:root:/root:/bin/bash\nlabuser:x:1000:1000:Lab User:/home/labuser:/bin/bash",
  "/etc/hosts":
    "127.0.0.1   localhost\n192.168.56.100  kali\n192.168.56.101  metasploitable\n192.168.56.102  dvwa",
  "/var/log/auth.log":
    "Nov  4 09:12:01 kali sshd[1201]: Failed password for invalid user admin from 192.168.56.50 port 51122 ssh2\nNov  4 09:13:15 kali sshd[1233]: Accepted password for labuser from 192.168.56.1 port 51201 ssh2",
  "/lab/README.txt":
    "VULNERABLE LAB TARGETS (host-only network 192.168.56.0/24):\n  192.168.56.101  Metasploitable2 — intentionally vulnerable Linux\n  192.168.56.102  DVWA — deliberately vulnerable web app\nAuthorized targets only. Anything else: 'Host seems down'.",
  "/lab/metasploitable.txt":
    "Metasploitable2 services (from your nmap scan):\n21 ftp (vsftpd 2.3.4 - BACKDOOR), 22 ssh, 23 telnet, 25 smtp,\n53 dns, 80 http (Apache 2.2.8), 445 smb, 3306 mysql, 5432 postgres, 8180 tomcat",
  "/lab/dvwa.txt":
    "DVWA (Damn Vulnerable Web Application): http://192.168.56.102\nLogin: admin / password   Security level: LOW\nPractice: SQLi, XSS, IDOR, brute force via Burp Suite.",
};

const LAB_HOSTS = {
  "192.168.56.101": "metasploitable",
  "192.168.56.102": "dvwa",
  "metasploitable": "192.168.56.101",
  "dvwa": "192.168.56.102",
  "127.0.0.1": "kali",
  "localhost": "kali",
  "kali": "192.168.56.100",
};

const NMAP_RESULTS = {
  "192.168.56.101": [
    "PORT     STATE SERVICE      VERSION",
    "21/tcp   open  ftp          vsftpd 2.3.4",
    "22/tcp   open  ssh          OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)",
    "23/tcp   open  telnet       Linux telnetd",
    "25/tcp   open  smtp         Postfix smtpd",
    "53/tcp   open  domain       ISC BIND 9.4.2",
    "80/tcp   open  http         Apache httpd 2.2.8 ((Ubuntu) DAV/2)",
    "445/tcp  open  netbios-ssn  Samba smbd 3.X (workgroup: WORKGROUP)",
    "3306/tcp open  mysql        MySQL 5.0.51a-3ubuntu5",
    "5432/tcp open  postgresql   PostgreSQL DB 8.3.0",
    "8009/tcp open  ajp13        Apache Jserv (Protocol v1.3)",
    "8180/tcp open  http         Apache Tomcat/Coyote JSP engine 1.1",
  ],
  "192.168.56.102": [
    "PORT     STATE SERVICE VERSION",
    "80/tcp   open  http    Apache httpd 2.4.7 (Ubuntu)",
    "3306/tcp open  mysql   MySQL 5.5.47",
  ],
  "127.0.0.1": [
    "PORT     STATE SERVICE VERSION",
    "22/tcp   open  ssh     OpenSSH 9.6 (Kali)",
    "8080/tcp open  http    Burp Suite proxy",
  ],
};

function resolvePath(cwd, arg) {
  if (!arg || arg === "~") return "/home/labuser";
  if (arg.startsWith("/")) return normalize(arg);
  return normalize(cwd + "/" + arg);
}
function normalize(p) {
  const parts = p.split("/").filter(Boolean);
  const out = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return "/" + out.join("/");
}

const HELP = [
  "Available commands (SIMULATED lab terminal — nothing real is executed):",
  "  help                 show this help",
  "  ls [dir]             list directory",
  "  cd <dir>             change directory",
  "  pwd                  print working directory",
  "  cat <file>           print file contents",
  "  whoami / id          current user",
  "  uname -a             system info",
  "  ip addr              network interfaces (try: ip addr)",
  "  ping <host>          test reachability (lab IPs only)",
  "  nmap <target>        simulated scan — try: nmap -sV 192.168.56.101",
  "  curl -I <url>        simulated HTTP headers",
  "  msfconsole           enter the simulated Metasploit shell",
  "  burpsuite            Burp Suite quick guide",
  "  wireshark            Wireshark filter cheat-sheet",
  "  john / hashcat       password-cracking lab pointers",
  "  history              command history",
  "  clear                clear the screen",
  "  about                about this terminal",
];

export function createSession() {
  return { cwd: "/home/labuser", mode: "shell", msf: { current: null, options: {} }, history: [] };
}

export function promptFor(s) {
  return s.mode === "msf" ? "msf6 > " : `labuser@kali:${s.cwd === "/home/labuser" ? "~" : s.cwd}$ `;
}

export function runCommand(session, raw) {
  const input = raw.trim();
  const lines = [];
  const out = (text, cls = "out") => lines.push({ text, cls });
  if (!input) return { lines, session };
  session.history.push(input);
  const [cmd, ...args] = input.split(/\s+/);

  // ---- msf mode ----
  if (session.mode === "msf") {
    if (cmd === "exit" || cmd === "back") {
      session.mode = "shell";
      out("Exiting Metasploit — back to the lab shell.");
      return { lines, session };
    }
    if (cmd === "search") {
      const term = args.join(" ") || "vsftpd";
      if (term.includes("vsftpd"))
        ["exploit/unix/ftp/vsftpd_234_backdoor  2011-07-03  excellent  Yes  VSFTPD v2.3.4 Backdoor", "   -> sets a root shell on port 6200 of the LAB VM"].forEach((l) => out(l));
      else out(`No modules matched '${term}'. Try: search vsftpd`);
      return { lines, session };
    }
    if (cmd === "use") {
      if (args[0]?.includes("vsftpd")) {
        session.msf.current = "exploit/unix/ftp/vsftpd_234_backdoor";
        out("Using exploit/unix/ftp/vsftpd_234_backdoor");
      } else out("Module not found in this simulation — try: use exploit/unix/ftp/vsftpd_234_backdoor");
      return { lines, session };
    }
    if (cmd === "show" && args[0] === "options") {
      out("Module options (exploit/unix/ftp/vsftpd_234_backdoor):");
      out("  RHOSTS  yes  The target host  (currently: " + (session.msf.options.RHOSTS || "<unset>") + ")");
      out("  RPORT   yes  The target port  (currently: " + (session.msf.options.RPORT || "21") + ")");
      return { lines, session };
    }
    if (cmd === "set") {
      session.msf.options[args[0]] = args[1];
      out(`${args[0]} => ${args[1]}`);
      return { lines, session };
    }
    if (cmd === "exploit" || cmd === "run") {
      const rhosts = session.msf.options.RHOSTS;
      if (!session.msf.current) out("No exploit selected. Try: use exploit/unix/ftp/vsftpd_234_backdoor", "err");
      else if (rhosts !== "192.168.56.101") out("[*] Exploit failed: set RHOSTS 192.168.56.101 (LAB VM ONLY) first!", "err");
      else {
        out("[*] Started reverse TCP handler on 192.168.56.100:4444");
        out("[*] Command shell session 1 opened (192.168.56.101:6200 -> 192.168.56.100:4444)");
        out("[+] Backdoor shell on Metasploitable — run: whoami  (answer: root)");
      }
      return { lines, session };
    }
    if (cmd === "whoami") { out("root"); return { lines, session }; }
    out(`Unknown msf command '${cmd}'. Try: search / use / show options / set / exploit / exit`, "err");
    return { lines, session };
  }

  // ---- shell mode ----
  switch (cmd) {
    case "help": HELP.forEach((l) => out(l)); break;
    case "ls": {
      const p = resolvePath(session.cwd, args[0]);
      if (FS[p]) out(FS[p].join("   "));
      else out(`ls: cannot access '${args[0]}': No such file or directory`, "err");
      break;
    }
    case "cd": {
      const p = resolvePath(session.cwd, args[0] || "~");
      if (FS[p]) session.cwd = p;
      else out(`cd: no such directory: ${args[0]}`, "err");
      break;
    }
    case "pwd": out(session.cwd); break;
    case "cat": {
      const p = resolvePath(session.cwd, args[0]);
      if (FILES[p]) FILES[p].split("\n").forEach((l) => out(l));
      else out(`cat: ${args[0]}: No such file or directory`, "err");
      break;
    }
    case "whoami": out("labuser"); break;
    case "id": out("uid=1000(labuser) gid=1000(labuser) groups=1000(labuser),4(adm),24(cdrom),27(sudo)"); break;
    case "uname":
      out(args.includes("-a") ? "Linux kali 6.8.0-kali-amd64 #1 SMP Kali 2026.1 x86_64 GNU/Linux" : "Linux");
      break;
    case "ip": case "ifconfig": {
      out("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500");
      out("      inet 192.168.56.100  netmask 255.255.255.0  broadcast 192.168.56.255");
      out("lo:   inet 127.0.0.1  netmask 255.0.0.0");
      break;
    }
    case "ping": {
      const host = LAB_HOSTS[args[0]] || args[0];
      if (NMAP_RESULTS[host] || host === "192.168.56.100") {
        out(`PING ${args[0]} (${host}) 56(84) bytes of data.`);
        for (let i = 1; i <= 3; i++) out(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=0.4${i} ms`);
        out(`--- ${args[0]} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`);
      } else out(`ping: cannot resolve or host down: ${args[0]} (lab targets: 192.168.56.101 / 192.168.56.102)`, "err");
      break;
    }
    case "nmap": {
      const target = LAB_HOSTS[args[args.length - 1]] || args[args.length - 1];
      if (!target || target.startsWith("-")) { out("usage: nmap [flags] <target>  — try: nmap -sV 192.168.56.101", "err"); break; }
      const ip = LAB_HOSTS[target] || target;
      if (!NMAP_RESULTS[ip]) { out(`Note: simulated lab only — '${target}' seems down. Try 192.168.56.101 or 192.168.56.102`, "err"); break; }
      out(`Starting Nmap 7.94 ( https://nmap.org ) — SIMULATED output for your lab`);
      out(`Nmap scan report for ${target} (${ip})`);
      out("Host is up (0.00042s latency).");
      out("PORT   STATE  SERVICE");
      NMAP_RESULTS[ip].forEach((l) => out(l));
      out("Service detection performed. Scan complete.");
      break;
    }
    case "curl": {
      if (args.includes("192.168.56.102") || args.join(" ").includes("dvwa")) {
        ["HTTP/1.1 200 OK", "Server: Apache/2.4.7 (Ubuntu)", "X-Powered-By: PHP/5.5.9", "Set-Cookie: PHPSESSID=labsim; HttpOnly", "Content-Type: text/html; charset=UTF-8"].forEach((l) => out(l));
      } else out("curl: (7) simulated — only lab URLs are reachable (try: curl -I http://192.168.56.102)", "err");
      break;
    }
    case "msfconsole": {
      session.mode = "msf";
      ["", "     =[ metasploit v6.4. SIMULATED lab shell ]=", "   =[ 2400 exploits · 1200 payloads · lab VMs only ]=", "", "msf6 > try: search vsftpd"].forEach((l) => out(l));
      break;
    }
    case "burpsuite":
      ["Burp Suite quick guide (lab):", " 1. Start Burp → Proxy tab → 127.0.0.1:8080", " 2. Set browser proxy to 127.0.0.1:8080, install Burp CA cert", " 3. Browse http://192.168.56.102 (DVWA) through the proxy", " 4. Send requests to Repeater; test SQLi / XSS / IDOR", " 5. Only ever test apps you own or are authorized for"].forEach((l) => out(l));
      break;
    case "wireshark":
      ["Wireshark cheat-sheet:", "  tcp.flags.syn==1 && tcp.flags.ack==0   -> spot SYN scans", "  http.request.method == \"POST\"          -> find form logins", "  dns.qry.name contains \"dvwa\"           -> DNS for lab host", "  Right-click TCP packet → Follow TCP Stream", "  Capture only traffic on networks you own/authorized"].forEach((l) => out(l));
      break;
    case "john": case "hashcat":
      ["Offline cracking — YOUR OWN hashes only:", "  echo -n 'password' | md5sum > myhash.txt", "  john --wordlist=/usr/share/wordlists/rockyou.txt myhash.txt", "  Defenses: bcrypt/argon2id + salt + MFA + unique passphrases"].forEach((l) => out(l));
      break;
    case "history": session.history.forEach((h, i) => out(`  ${i + 1}  ${h}`)); break;
    case "clear": return { lines: [], session, clear: true };
    case "echo": out(args.join(" ")); break;
    case "date": out(new Date().toString()); break;
    case "sudo": out("[sudo] password for labuser: ", "out"); out("labuser is not in the sudoers file. This incident will be reported.", "err"); break;
    case "about":
      ["Cyber EC Lab — simulated terminal.", "Nothing here executes real commands; it trains syntax against a fake", "isolated lab network (192.168.56.0/24). For real practice use your own", "Kali VM — see the Lab Setup page. Always stay authorized."].forEach((l) => out(l));
      break;
    case "gobuster": case "ffuf": case "dirb": {
      if ((args.join(" ") + " ").includes("192.168.56.102") || args.includes("dir")) {
        ["/# ---- gobuster dir (simulated, lab target) ----",
         "/.git/            (Status: 301)", "/admin/           (Status: 301)",
         "/backup.zip       (Status: 200)  [size: 4.2 KB]", "/config.php.bak   (Status: 200)",
         "/uploads/         (Status: 301)", "/robots.txt       (Status: 200)"].forEach((l) => out(l));
      } else out("usage: gobuster dir -u http://192.168.56.102 -w common.txt  (lab target)", "err");
      break;
    }
    case "sqlmap": {
      if (!input.includes("192.168.56.102")) { out("usage: sqlmap -u 'http://192.168.56.102/sqli/?id=1' --dbs   (lab only)", "err"); break; }
      ["[*] testing GET parameter 'id'", "[+] 'id' is vulnerable — back-end DBMS: MySQL 5.0",
       "available databases [2]:", "[*] dvwa", "[*] information_schema",
       "# then: sqlmap -u '...' -D dvwa -T users --dump  → admin hash: 5f4dcc3b5aa765d61d8327deb882cf99 (md5 of 'password')"].forEach((l) => out(l));
      break;
    }
    case "hydra": {
      if (!input.includes("192.168.56.101")) { out("usage: hydra -l msfadmin -P words.txt 192.168.56.101 ssh  (lab only)", "err"); break; }
      ["[22][ssh] host: 192.168.56.101   login: msfadmin   password: msfadmin",
       "1 of 1 target successfully completed, 1 valid password found"].forEach((l) => out(l));
      break;
    }
    case "john": case "hashcat": {
      ["Loaded 1 password hash (md5crypt)", "'password' → 5f4dcc3b5aa765d61d8327deb882cf99  [CRACKED in 0.4s]",
       "# rule: never crack real hashes — own/authorized lab hashes only"].forEach((l) => out(l));
      break;
    }
    case "enum4linux": case "crackmapexec": case "nmap-ad": {
      ["//192.168.56.10  SAM SAMR (simulated lab DC output)", "Users: Administrator, svc-iis, labuser", "Shares: ADMIN$, C$, IPC$, wwwroot"].forEach((l) => out(l));
      break;
    }
    case "nikto": case "wpscan": {
      ["+ Server: Apache/2.2.8 (Ubuntu) — outdated!", "+ /admin/: directory exists (lab)", "+ Retrieved x-powered-by header: PHP/5.2.4 — outdated!"].forEach((l) => out(l));
      break;
    }
    case "mission": {
      ["🎯 GUIDED MISSION — 'Operation Lab Breach' (all targets are the fake lab VMs):",
       "  Stage 1  RECON      : nmap -sV 192.168.56.101   → find vsftpd 2.3.4",
       "  Stage 2  WEB ENUM   : gobuster dir -u http://192.168.56.102 ... → /admin/",
       "  Stage 3  EXPLOIT    : msfconsole → use exploit/unix/ftp/vsftpd_234_backdoor",
       "                       → set RHOSTS 192.168.56.101 → exploit  → root shell",
       "  Stage 4  WEB ATTACK : sqlmap -u 'http://192.168.56.102/sqli/?id=1' -D dvwa -T users --dump",
       "  Stage 5  FLAG       : cat /lab/README.txt → FLAG{lab_breach_complete}",
       "Type the commands stage by stage — each is simulated but teaches the real flow."].forEach((l) => out(l));
      break;
    }
    case "exit": out("Use the navbar to explore lessons, labs and tools. Session stays open 🙂"); break;
    default:
      out(`${cmd}: command not found — type 'help'`, "err");
  }
  return { lines, session };
}
