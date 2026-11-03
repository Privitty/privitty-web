import Link from "next/link";
import Image from "next/image";
import {
  GitHubIcon,
  YouTubeIcon,
  LinkedInIcon,
  XTwitterIcon,
  ShieldIcon,
} from "./Icons";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Privitty",
      icon: GitHubIcon,
      ariaLabel: "Follow Privitty on GitHub (opens in new tab)",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/privitty",
      icon: LinkedInIcon,
      ariaLabel: "Connect with Privitty on LinkedIn (opens in new tab)",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/privittyOT",
      icon: XTwitterIcon,
      ariaLabel: "Follow Privitty on X / Twitter (opens in new tab)",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@Privitty",
      icon: YouTubeIcon,
      ariaLabel: "Subscribe to Privitty on YouTube (opens in new tab)",
    },
  ];

  return (
    <footer className="border-t border-[#DDD8E8] bg-[#F8F1FD] pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div
          data-gsap="stagger"
          data-gsap-stagger="0.08"
          className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm"
        >
          {/* Logo & Tagline */}
          <div data-gsap-item className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 transition-transform hover:scale-105 duration-200">
                <Image
                  src="/logo.png"
                  alt="Privitty Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-xl text-[#17151D] font-headline">
                Privitty
              </span>
            </div>
            <p className="text-[#625F6B] text-xs leading-relaxed max-w-sm">
              The identity layer for operational technology. Machine identity by
              default. Human access, always revocable. No VPN. No hardware. No
              open ports.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF] border border-[#DDD5EF] text-[10.5px] sm:text-[11px] font-bold tracking-[0.06em] text-[#432F75] select-none transition-all">
              <ShieldIcon className="w-3.5 h-3.5 text-[#503796] shrink-0" />
              <span>Zero Open Ports &bull; Sovereign OT Architecture</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="w-8 h-8 rounded-xl bg-white border border-[#DDD8E8] text-[#553C9A] hover:text-white hover:bg-[#523B93] hover:border-[#523B93] flex items-center justify-center transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6750A4]"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div data-gsap-item>
            <h4 className="font-bold text-[#17151D] uppercase text-xs tracking-wider mb-4">
              PRODUCTS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#625F6B]">
              <li>
                <Link
                  href="/product"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Edge & Watchtower
                </Link>
              </li>
              <li>
                <Link
                  href="/product#sdk"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Communicator SDK
                </Link>
              </li>
              <li>
                <Link
                  href="/product#app"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Communicator App
                </Link>
              </li>
              <li>
                <Link
                  href="/whitepapers"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Whitepapers
                </Link>
              </li>

              <li>
                <Link
                  href="https://docs.edge.privittytech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Privitty Edge Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div data-gsap-item>
            <h4 className="font-bold text-[#17151D] uppercase text-xs tracking-wider mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#625F6B]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about#principles"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Principles
                </Link>
              </li>
              <li>
                <Link
                  href="/about#team"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/about#contact"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div data-gsap-item>
            <h4 className="font-bold text-[#17151D] uppercase text-xs tracking-wider mb-4">
              LEGAL & TRUST
            </h4>
            <ul className="space-y-2.5 text-xs text-[#625F6B]">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/report-abuse"
                  className="hover:text-[#6750A4] transition-colors inline-block hover:translate-x-0.5 duration-150"
                >
                  Report Abuse
                </Link>
              </li>
              <li>
                <span className="hover:text-[#6750A4] cursor-pointer inline-block hover:translate-x-0.5 transition-colors duration-150">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          data-gsap="fade-in"
          className="pt-8 border-t border-[#DDD8E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#625F6B]"
        >
          <div>Privitty &copy; 2026. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#6750A4] cursor-pointer transition-colors">
              Enterprise Security
            </span>
            <span className="hover:text-[#6750A4] cursor-pointer transition-colors">
              GDPR
            </span>
            <span className="hover:text-[#6750A4] cursor-pointer transition-colors">
              CCPA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
