// Step-by-step guide to build a real, isolated virtual attack lab.
export const labSetup = {
  intro: "Build a safe home lab: a Kali Linux attack box plus deliberately vulnerable VMs on a host-only network. Nothing vulnerable ever touches the internet.",
  requirements: {
    hardware: "8+ GB RAM (16 GB recommended), 4+ CPU cores, ~100 GB free disk, virtualization enabled in BIOS (VT-x/AMD-V)",
    software: ["VirtualBox (free) or VMware Workstation Player", "Kali Linux ISO/VM image", "Vulnerable target VMs (Metasploitable2, DVWA, VulnHub images)"],
  },
  steps: [
    {
      n: 1,
      title: "Install the hypervisor",
      detail: "Download VirtualBox from virtualbox.org (free) or VMware Workstation Player. Enable virtualization in your BIOS if VMs are slow.",
    },
    {
      n: 2,
      title: "Get Kali Linux — the perfect pentest OS",
      detail: "Download the Kali VM image or ISO from kali.org/get-kali. Import the prebuilt VM into VirtualBox (Appliance → Import) for a 10-minute setup. Default creds on the prebuilt image: kali/kali — change them immediately.",
      link: { label: "kali.org/get-kali", url: "https://www.kali.org/get-kali/" },
    },
    {
      n: 3,
      title: "Download vulnerable target VMs",
      detail: "Metasploitable2/3 (Linux with dozens of vulnerable services) from SourceForge/Rapid7 GitHub; DVWA as a Docker container (docker run -p 80:80 vulnerables/web-dvwa) or VM; more from VulnHub. Import them as VMs.",
      links: [
        { label: "Metasploitable2 (SourceForge)", url: "https://sourceforge.net/projects/metasploitable/" },
        { label: "Metasploitable3 (Rapid7 GitHub)", url: "https://github.com/rapid7/metasploitable3" },
        { label: "VulnHub vulnerable VMs", url: "https://www.vulnhub.com/" },
        { label: "DVWA official", url: "https://dvwa.co.uk/" },
      ],
    },
    {
      n: 4,
      title: "Create an isolated host-only network",
      detail: "In VirtualBox: File → Host Network Manager → create vboxnet0 (192.168.56.1/24, DHCP off). Attach Kali AND every vulnerable VM to 'Host-only adapter' — NOT NAT, NOT Bridged. This guarantees attack traffic can never leave your machine.",
    },
    {
      n: 5,
      title: "Boot and verify",
      detail: "Start Kali first, then targets. From Kali run: ip addr (expect 192.168.56.x), ping 192.168.56.101, nmap -sV 192.168.56.101. If you see open services — your lab is live.",
    },
    {
      n: 6,
      title: "Snapshot everything BEFORE attacking",
      detail: "VirtualBox → select VM → Snapshots → Take. Name it 'clean'. After each lab, restore the snapshot so the VM returns to a pristine state.",
    },
    {
      n: 7,
      title: "Add a web target (DVWA)",
      detail: "On Kali: docker run --rm -p 80:80 vulnerables/web-dvwa → browse to http://<kali-ip>/ (login admin/password, set security LOW). Configure Burp proxy at 127.0.0.1:8080 and intercept.",
    },
    {
      n: 8,
      title: "Isolation rules (non-negotiable)",
      detail: "Vulnerable VMs stay on host-only forever. Never bridge them to your Wi-Fi/LAN. Never port-forward them. Label the VMs 'VULNERABLE — LAB ONLY'. If a VM is ever exposed to a real network, treat it as compromised.",
    },
  ],
  topology: [
    "Internet  ✗  (blocked)",
    "   Host machine (your laptop)",
    "   └── vboxnet0 host-only network 192.168.56.0/24",
    "       ├── 192.168.56.100  Kali Linux (attack box)",
    "       ├── 192.168.56.101  Metasploitable2 (vulnerable)",
    "       └── 192.168.56.102  DVWA / other targets (vulnerable)",
  ],
  safety: "Only ever attack VMs inside this isolated network or authorized platforms (TryHackMe, HackTheBox). Scanning or exploiting anything else without written permission is a crime.",
};
