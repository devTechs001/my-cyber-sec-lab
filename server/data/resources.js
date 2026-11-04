// Real, official resources for learning and practicing ethical hacking legally.
export const resources = [
  {
    category: "Operating Systems (attack boxes)",
    items: [
      { name: "Kali Linux", url: "https://www.kali.org/get-kali/", desc: "The standard Debian-based pentest OS — hundreds of tools preinstalled (Nmap, Burp, Metasploit, Wireshark…)." },
      { name: "Parrot OS", url: "https://www.parrotsec.org/", desc: "Privacy/security-focused alternative to Kali, lightweight MATE edition available." },
      { name: "Tails", url: "https://tails.net/", desc: "Amnesic live OS for privacy — useful for OSINT work without leaving traces." },
    ],
  },
  {
    category: "Vulnerable targets (install in YOUR lab only)",
    items: [
      { name: "Metasploitable2", url: "https://sourceforge.net/projects/metasploitable/", desc: "Ubuntu 8.04 VM packed with vulnerable services — the classic first exploitation target." },
      { name: "Metasploitable3", url: "https://github.com/rapid7/metasploitable3", desc: "Modern Windows + Ubuntu vulnerable lab built with Vagrant/Packer." },
      { name: "DVWA", url: "https://dvwa.co.uk/", desc: "Damn Vulnerable Web Application — practice SQLi, XSS, CSRF, file upload… (also: docker run vulnerables/web-dvwa)." },
      { name: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", desc: "Modern vulnerable web app with 100+ CTF-style challenges, runnable via Docker/npm." },
      { name: "VulnHub", url: "https://www.vulnhub.com/", desc: "Hundreds of free downloadable vulnerable VMs (Kioptrix, Mr. Robot, …)." },
    ],
  },
  {
    category: "Practice platforms (legal, remote)",
    items: [
      { name: "TryHackMe", url: "https://tryhackme.com/", desc: "Guided rooms and learning paths — perfect beginner → intermediate path." },
      { name: "HackTheBox", url: "https://www.hackthebox.com/", desc: "Machines + Starting Point track; great for portfolio write-ups." },
      { name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", desc: "Free, hands-on web security labs from the makers of Burp Suite." },
      { name: "picoCTF", url: "https://picoctf.org/", desc: "Beginner-friendly CTF with permanent archive of challenges." },
      { name: "CTFtime", url: "https://ctftime.org/", desc: "Calendar of live CTF competitions worldwide." },
    ],
  },
  {
    category: "Tools & references",
    items: [
      { name: "Nmap", url: "https://nmap.org/", desc: "Network scanner — official docs + NSE script reference." },
      { name: "Burp Suite", url: "https://portswigger.net/burp", desc: "Download Community/Pro; the Web Security Academy teaches it hands-on." },
      { name: "Wireshark + sample pcaps", url: "https://www.wireshark.org/", desc: "Packet analysis; sample captures at wiki.wireshark.org/SampleCaptures." },
      { name: "Metasploit docs", url: "https://docs.rapid7.com/metasploit/", desc: "Official framework documentation." },
      { name: "GTFOBins", url: "https://gtfobins.github.io/", desc: "How Unix binaries can be abused for privesc/shells — study for defense too." },
      { name: "Exploit-DB", url: "https://www.exploit-db.com/", desc: "Archive of public exploits and PoCs (read to understand, use only in labs)." },
      { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", desc: "The standard list of critical web application security risks." },
    ],
  },
  {
    category: "Careers, certs & disclosure",
    items: [
      { name: "eJPT (INE)", url: "https://ine.com/learning/certifications/internal/elearning-security-junior-penetration-tester-cert", desc: "Entry-level junior pentester cert — great first goal." },
      { name: "CompTIA Security+", url: "https://www.comptia.org/certifications/security/", desc: "Widely recognized baseline security certification." },
      { name: "OSCP (OffSec)", url: "https://www.offsec.com/courses/pen-200/", desc: "The gold-standard hands-on pentest certification (PEN-200)." },
      { name: "HackerOne / Bugcrowd", url: "https://www.hackerone.com/", desc: "Legal bug-bounty programs — disclose responsibly, get paid." },
      { name: "FIRST CVSS calculator", url: "https://www.first.org/cvss/calculator/3.1", desc: "Score vulnerability severity consistently in reports." },
    ],
  },
];
