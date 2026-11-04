import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BrandTagline from "./components/BrandTagline";
import SecurityDashboardCard from "./components/SecurityDashboardCard";
import PartnerMarquee from "./components/PartnerMarquee";
import ArchitectureComparison from "./components/ArchitectureComparison";
import { getPublishedTestimonials, getPublishedPartners } from "@/app/lib/queries";
import { resolveAssetUrl } from "@/app/lib/media";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  AlertTriangleIcon,
  KeyIcon,
  ShieldIcon,
  ShieldCheckIcon,
  ChipIcon,
  LayoutIcon,
  FingerprintIcon,
  LockIcon,
  GlobeIcon,
  FileTextIcon,
  FactoryIcon,
  ZapIcon,
  CloudIcon,
} from "./components/Icons";

export default async function Home() {
  const [testimonials, partners] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedPartners(),
  ]);
  const featured = testimonials.find((t) => t.isFeatured) || testimonials[0];
  const otherTestimonials = testimonials.filter((t) => t.id !== featured?.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5FF] text-[#17151D]">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            SECTION 1: HERO SECTION
           ========================================================================= */}
        <section className="relative pt-12 sm:pt-16 pb-20 md:pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div data-gsap="fade-up" className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Brand Tagline */}
              <div>
                <BrandTagline />
              </div>

              {/* Headline with bold typography and italic serif emphasis */}
              <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-[#110E1B] font-headline tracking-[-0.035em] leading-[1.06]">
                A new standard<br className="hidden sm:inline" />{" "}
                for{" "}
                <span className="font-serif italic font-normal text-[#4C3298]">
                  machine
                </span>
                <br className="hidden sm:inline" />{" "}
                <span className="font-serif italic font-normal text-[#4C3298]">
                  identity
                </span>{" "}
                and<br className="hidden sm:inline" />{" "}
                human access.
              </h1>

              {/* Body Text */}
              <p className="text-base sm:text-lg md:text-[19px] text-[#524E5B] leading-relaxed max-w-xl font-normal">
                Privitty gives every machine a cryptographic identity and every engineer a verified, revokable channel. No VPN. No firewall rules. No hardware. Just trust between the identities that matter.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <a
                  href="#demo"
                  className="px-6 sm:px-7 py-3.5 rounded-xl sm:rounded-2xl bg-[#4A2E80] hover:bg-[#3D236E] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#4A2E80]/20 transition-all flex items-center justify-center gap-2 interactive-btn"
                >
                  <span>Book a Demo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="/whitepapers"
                  className="px-6 sm:px-7 py-3.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#E2DCED] border border-[#DDD8E8] text-[#221C30] font-semibold text-sm sm:text-base transition-all flex items-center justify-center interactive-btn"
                >
                  Whitepaper
                </a>
              </div>
            </div>

            {/* Right Graphic: Security Dashboard Card */}
            <div data-gsap="scale-up" data-gsap-delay="0.15" className="lg:col-span-5">
              <SecurityDashboardCard />
            </div>
          </div>

          {/* Bottom Feature Strip with matching icons */}
          <div
            data-gsap="fade-up"
            data-gsap-delay="0.25"
            className="mt-14 sm:mt-18 p-5 sm:p-6 rounded-[24px] bg-[#F4EFFB]/90 border border-[#E8E2F4] shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {/* Feature 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#503796] text-[#fff] flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#17151D] tracking-tight">
                  Human access, always revokable
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#503796] text-[#fff] flex items-center justify-center shrink-0">
                  <ChipIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#17151D] tracking-tight">
                  No hardware required
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#503796] text-[#fff] flex items-center justify-center shrink-0">
                  <LayoutIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#17151D] tracking-tight">
                  OEM branding available
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#503796] text-[#fff] flex items-center justify-center shrink-0">
                  <FingerprintIcon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#17151D] tracking-tight">
                  Machine identity by default
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: THE FACTORY FLOOR PROBLEM
           ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          <div data-gsap="fade-up" className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4]">THE PROBLEM</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17151D] font-headline leading-tight">
              The factory floor has an identity problem, not a network problem.
            </h2>
            <p className="text-[#625F6B] text-base md:text-lg">
              Legacy OT security relies on network perimeters and VPNs that grant overly broad access to sensitive physical equipment.
            </p>
          </div>

          <div
            data-gsap="stagger"
            data-gsap-stagger="0.1"
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-6 flex flex-col justify-between premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <AlertTriangleIcon className="w-5 h-5 text-[#fff]" />
                </div>
                <h3 className="text-xl font-bold text-[#17151D] font-headline">VPNs leak</h3>
                <p className="text-sm text-[#625F6B] leading-relaxed">
                  Virtual private networks grant broad subnet access when engineers only need granular access to a single PLC or HMI.
                </p>
              </div>
              <a href="#analysis" className="text-xs font-bold text-[#6750A4] hover:underline flex items-center gap-1 pt-4">
                <span>Read analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2 (Dark Highlight) */}
            <div data-gsap-item className="bg-[#2a2438] text-white p-8 rounded-3xl border border-[#2a2438] space-y-6 flex flex-col justify-between shadow-xl premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white font-headline">Static Keys</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Hardcoded credentials and static secrets live in plaintext across configuration files, vulnerable to credential theft.
                </p>
              </div>
              <a href="#risks" className="text-xs font-bold text-white hover:underline flex items-center gap-1 pt-4">
                <span>Explore risks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3 */}
            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-6 flex flex-col justify-between premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-[#fff]" />
                </div>
                <h3 className="text-xl font-bold text-[#17151D] font-headline">Uncontrollable Access</h3>
                <p className="text-sm text-[#625F6B] leading-relaxed">
                  Third-party vendors retain unmonitored access long after maintenance work orders have been closed.
                </p>
              </div>
              <a href="#report" className="text-xs font-bold text-[#6750A4] hover:underline flex items-center gap-1 pt-4">
                <span>View security report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: IDENTITY FIRST. ACCESS SECOND.
           ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          <div data-gsap="fade-up" className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4]">OUR APPROACH</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17151D] font-headline leading-tight">
              Identity first. Access second. Sovereignty always.
            </h2>
            <p className="text-[#625F6B] text-base md:text-lg">
              Privitty verifies every human request and machine transaction before permitting data to flow.
            </p>
          </div>

          <div
            data-gsap="stagger"
            data-gsap-stagger="0.08"
            className="grid md:grid-cols-2 gap-8"
          >
            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-3 relative premium-card">
              <span className="absolute top-8 right-8 text-[#6750A4]">
                <CheckIcon className="w-5 h-5 text-[#6750A4]" />
              </span>
              <div className="text-xs font-bold text-[#6750A4]">01</div>
              <h3 className="text-xl font-bold text-[#17151D] font-headline">Zero-Trust OT Remote Access</h3>
              <p className="text-sm text-[#625F6B] leading-relaxed">
                Direct ephemeral access tunnels to target machinery without exposing inbound firewall ports or entire subnets.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-3 relative premium-card">
              <span className="absolute top-8 right-8 text-[#6750A4]">
                <LockIcon className="w-5 h-5 text-[#6750A4]" />
              </span>
              <div className="text-xs font-bold text-[#6750A4]">02</div>
              <h3 className="text-xl font-bold text-[#17151D] font-headline">Machine Identity Engine</h3>
              <p className="text-sm text-[#625F6B] leading-relaxed">
                Automated mTLS certificate issuance, hardware TPM binding, and post-quantum cryptographic rotation for every asset.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-3 relative premium-card">
              <span className="absolute top-8 right-8 text-[#6750A4]">
                <GlobeIcon className="w-5 h-5 text-[#6750A4]" />
              </span>
              <div className="text-xs font-bold text-[#6750A4]">03</div>
              <h3 className="text-xl font-bold text-[#17151D] font-headline">Local Data Residency</h3>
              <p className="text-sm text-[#625F6B] leading-relaxed">
                Encrypted data residency enclaves ensure telemetry and logs never leave customer-controlled jurisdiction boundaries.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-3 relative premium-card">
              <span className="absolute top-8 right-8 text-[#6750A4]">
                <FileTextIcon className="w-5 h-5 text-[#6750A4]" />
              </span>
              <div className="text-xs font-bold text-[#6750A4]">04</div>
              <h3 className="text-xl font-bold text-[#17151D] font-headline">Cryptographic Non-repudiation</h3>
              <p className="text-sm text-[#625F6B] leading-relaxed">
                Immutable session recordings and signed audit trails eliminate disputes and satisfy rigorous compliance mandates.
              </p>
            </div>
          </div>

          <div data-gsap="fade-up" className="flex items-center gap-4 mt-12">
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl bg-[#6750A4] text-white font-semibold text-sm hover:bg-[#57418F] shadow-md transition-all interactive-btn"
            >
              Get Demo
            </a>
            <a
              href="/product"
              className="px-6 py-3 rounded-xl bg-white text-[#17151D] border border-[#DDD8E8] font-semibold text-sm hover:bg-[#D2D2F3]/30 transition-all interactive-btn"
            >
              Read Docs
            </a>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: BUILT ON MACHINE IDENTITY
           ========================================================================= */}
        <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Section Header */}
          <div data-gsap="fade-up" className="space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              PRODUCTS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#17151D] font-headline tracking-tight leading-[1.08] max-w-4xl">
              Built on machine identity.
              <br className="hidden sm:inline" />
              {" "}Controlled by human
              <br className="hidden sm:inline" />
              {" "}access.
            </h2>
            <p className="text-base sm:text-lg text-[#625F6B] leading-relaxed max-w-2xl font-normal pt-1">
              Every capability in Privitty flows from a single principle: access is earned through verified identity, not granted by network rules. One platform. Every topology.
            </p>
          </div>

          {/* Top Row: 2 Large Cards */}
          <div
            data-gsap="stagger"
            data-gsap-stagger="0.12"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8"
          >
            {/* Card 1: Remote Access Tunnels */}
            <div data-gsap-item className="bg-white p-8 lg:p-10 rounded-3xl border border-[#DDD8E8]/70 shadow-sm flex flex-col justify-between premium-card">
              <div>
                {/* Purple Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="18" rx="4" />
                    <path d="m7 9 3 3-3 3" />
                    <path d="M13 15h4" />
                  </svg>
                </div>

                <h3 className="text-2xl lg:text-[28px] font-bold text-[#17151D] font-headline tracking-tight mt-8">
                  Remote Access Tunnels
                </h3>

                <p className="text-sm lg:text-[15px] text-[#625F6B] leading-relaxed mt-4">
                  Our patented architecture opens SSH/RDP/VNC sessions through the same E2EE channel, not a separate VPN. Tunnels are operator-initiated, session-scoped, and revokable independently. No inbound firewall ports, only outbound from the edge.
                </p>
              </div>

              {/* Monospace Pill Bar */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAF6] border border-[#DDD5EF] text-[10.5px] sm:text-[11px] font-bold tracking-[0.06em] text-[#432F75] uppercase select-none transition-all">
                <svg className="w-4 h-4 text-[#4F378A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
                  <path d="M7.76 16.24a6 6 0 0 1 0-8.48" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>SSH / RDP / VNC / Inbound Ports = 0</span>
              </div>
            </div>

            {/* Card 2: Controlled File Transfer */}
            <div data-gsap-item className="bg-white p-8 lg:p-10 rounded-3xl border border-[#DDD8E8]/70 shadow-sm flex flex-col justify-between premium-card">
              <div>
                {/* Purple Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-4">
                    <h3 className="text-2xl lg:text-[28px] font-bold text-[#17151D] font-headline tracking-tight leading-tight">
                      Controlled File<br />Transfer
                    </h3>
                    <p className="text-sm lg:text-[15px] text-[#625F6B] leading-relaxed">
                      Every file shared through Privitty carries its own access policy. Set who can view, download, or forward. Add a time limit; the file becomes inaccessible when the clock runs out. Revoke individual files or trigger a panic wipe of all shared data at once.
                    </p>
                  </div>

                  {/* Right File Policy UI Mockup */}
                  <div className="sm:col-span-5 flex justify-center sm:justify-end">
                    <div className="bg-[#EAE4F5] rounded-2xl p-4 sm:p-5 w-full max-w-[280px] border border-[#DDD5EF] shadow-xs">
                      {/* File Header */}
                      <div className="flex items-center justify-between gap-2 pb-3">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <svg className="w-4 h-4 text-[#553C9A] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                          </svg>
                          <span className="text-xs font-bold text-[#17151D] truncate font-mono">
                            PLC_Firmware_v3._
                          </span>
                        </div>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-md bg-[#533E85] text-white text-[11px] font-semibold hover:bg-[#432F70] transition-colors shrink-0 interactive-btn cursor-pointer"
                        >
                          Save
                        </button>
                      </div>

                      {/* Policy Checkboxes */}
                      <div className="space-y-2 py-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-[#17151D] cursor-pointer">
                          <span className="w-4 h-4 rounded bg-[#533E85] flex items-center justify-center text-white shrink-0">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>Allow Download</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs font-medium text-[#17151D] cursor-pointer">
                          <span className="w-4 h-4 rounded border-2 border-[#766F8A] bg-transparent shrink-0"></span>
                          <span>Allow Forward</span>
                        </label>
                      </div>

                      {/* Expiry Box */}
                      <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#766F8A] mb-1.5">
                          TIME EXPIRY
                        </div>
                        <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between text-xs text-[#17151D] font-medium border border-[#DDD5EF]/50 shadow-xs">
                          <span>45 minutes remaining</span>
                          <svg className="w-3.5 h-3.5 text-[#766F8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Feature Cards */}
          <div
            data-gsap="stagger"
            data-gsap-stagger="0.1"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Card 3: Federated Identity Channels */}
            <div data-gsap-item className="bg-white p-8 lg:p-10 rounded-3xl border border-[#DDD8E8]/70 shadow-sm flex flex-col justify-between premium-card">
              <div>
                {/* Purple Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-[#17151D] font-headline tracking-tight mt-8">
                  Federated Identity Channels
                </h3>

                <p className="text-sm lg:text-[15px] text-[#625F6B] leading-relaxed mt-4">
                  Every connection in Privitty begins with identity, not a network address. Machine-Machine, Machine-Human, or Human-Human. Each channel is scoped, independent, and fully revokable. No shared network or implicit credentials.
                </p>
              </div>
            </div>

            {/* Card 4: Privitty Watchtower */}
            <div data-gsap-item className="bg-white p-8 lg:p-10 rounded-3xl border border-[#DDD8E8]/70 shadow-sm flex flex-col justify-between premium-card">
              <div>
                {/* Purple Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-[#17151D] font-headline tracking-tight mt-8">
                  Privitty Watchtower
                </h3>

                <p className="text-sm lg:text-[15px] text-[#625F6B] leading-relaxed mt-4">
                  The identity governance layer. Register machine and engineer identities, assign them to channels, and monitor sessions and transfers in real time. Trigger individual revoke or full panic from a single dashboard. Watchtower never stores payloads.
                </p>
              </div>
            </div>

            {/* Card 5: Software Only */}
            <div data-gsap-item className="bg-white p-8 lg:p-10 rounded-3xl border border-[#DDD8E8]/70 shadow-sm flex flex-col justify-between premium-card">
              <div>
                {/* Purple Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <path d="M15 2v2" />
                    <path d="M9 2v2" />
                    <path d="M15 20v2" />
                    <path d="M9 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                  </svg>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-[#17151D] font-headline tracking-tight mt-8">
                  Software Only
                </h3>

                <p className="text-sm lg:text-[15px] text-[#625F6B] leading-relaxed mt-4">
                  Privitty Edge runs as a lightweight industrial PC, gateway, or IoT Enterprise device. No dedicated appliance, no hardware purchase, no rack space. ~20 MB install footprint. Deploy via installer or OEM image.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: DEPLOYMENT TARGETS
           ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          <div data-gsap="fade-up" className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4]">DEPLOYMENT TARGETS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17151D] font-headline leading-tight">
              The new standard, deployed across your operation
            </h2>
            <p className="text-[#625F6B] text-base md:text-lg">
              Privitty integrates seamlessly across every layer of modern industrial and critical infrastructure.
            </p>
          </div>

          <div
            data-gsap="stagger"
            data-gsap-stagger="0.1"
            className="grid md:grid-cols-3 gap-8"
          >
            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-6 flex flex-col justify-between premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <FactoryIcon className="w-5 h-5 text-[#fff]" />
                </div>
                <h3 className="text-xl font-bold text-[#17151D] font-headline">Factory Floor &amp; Assembly Lines</h3>
                <p className="text-sm text-[#625F6B] leading-relaxed">
                  Protect PLCs, robotics, and industrial HMIs from unauthorized remote access while enabling OEM vendor maintenance.
                </p>
              </div>
              <a href="#factory" className="text-xs font-bold text-[#6750A4] hover:underline flex items-center gap-1">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-6 flex flex-col justify-between premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-[#fff]" />
                </div>
                <h3 className="text-xl font-bold text-[#17151D] font-headline">Substations &amp; Utility Grids</h3>
                <p className="text-sm text-[#625F6B] leading-relaxed">
                  Secure high-voltage grid substations and remote RTUs with hardware TPM 2.0 attestation and zero open firewall ports.
                </p>
              </div>
              <a href="#grid" className="text-xs font-bold text-[#6750A4] hover:underline flex items-center gap-1">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div data-gsap-item className="bg-white p-8 rounded-3xl border border-[#DDD8E8] space-y-6 flex flex-col justify-between premium-card">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
                  <CloudIcon className="w-5 h-5 text-[#fff]" />
                </div>
                <h3 className="text-xl font-bold text-[#17151D] font-headline">Data Centers &amp; Sovereign Clouds</h3>
                <p className="text-sm text-[#625F6B] leading-relaxed">
                  Enforce strict data residency enclaves and localized encryption keys for telemetry data streams.
                </p>
              </div>
              <a href="#cloud" className="text-xs font-bold text-[#6750A4] hover:underline flex items-center gap-1">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: SECURITY PRINCIPLES (6 CARDS)
           ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          <div data-gsap="fade-up" className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4]">SECURITY PRINCIPLES</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#17151D] font-headline leading-tight">
              Identity is the perimeter. Trust is the architecture.
            </h2>
            <p className="text-[#625F6B] text-base md:text-lg">
              Six core architectural guarantees engineered for high-consequence environments.
            </p>
          </div>

          <div
            data-gsap="stagger"
            data-gsap-stagger="0.08"
            className="grid md:grid-cols-3 gap-6"
          >
            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">01</div>
              <h4 className="font-bold text-sm text-[#17151D]">Zero open inbound firewall ports</h4>
              <p className="text-xs text-[#625F6B]">Eliminates WAN network scanning attacks completely.</p>
            </div>

            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">02</div>
              <h4 className="font-bold text-sm text-[#17151D]">Hardware TPM 2.0 attestation</h4>
              <p className="text-xs text-[#625F6B]">Binds identity certificates directly to physical chips.</p>
            </div>

            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">03</div>
              <h4 className="font-bold text-sm text-[#17151D]">mTLS protocol enforcement</h4>
              <p className="text-xs text-[#625F6B]">Mutual authentication required for every packet.</p>
            </div>

            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">04</div>
              <h4 className="font-bold text-sm text-[#17151D]">Ephemeral access sessions</h4>
              <p className="text-xs text-[#625F6B]">Permissions automatically expire post-maintenance.</p>
            </div>

            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">05</div>
              <h4 className="font-bold text-sm text-[#17151D]">Non-repudiable audit logs</h4>
              <p className="text-xs text-[#625F6B]">Cryptographically signed session recordings.</p>
            </div>

            <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8] space-y-2 premium-card">
              <div className="text-xs font-bold text-[#6750A4]">06</div>
              <h4 className="font-bold text-sm text-[#17151D]">Sovereign data residency</h4>
              <p className="text-xs text-[#625F6B]">Keys and logs stay strictly in your jurisdiction.</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION: ARCHITECTURE COMPARISON
           ========================================================================= */}
        <ArchitectureComparison />

        {/* =========================================================================
            SECTION 7: TESTIMONIALS & STATS BAR
           ========================================================================= */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Header */}
          <div data-gsap="fade-up" className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              CUSTOMERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17151D] font-headline tracking-tight">
              What Our Partners Say
            </h2>
            <p className="text-xs sm:text-sm text-[#625F6B]">
              Join operators who trust Privitty to secure their data.
            </p>
          </div>

          {/* Top Featured Testimonial Card */}
          {featured && (
            <div
              data-gsap="scale-up"
              className="bg-[#F4F1FA] rounded-[32px] p-8 sm:p-10 lg:p-12 border border-[#E8E3F2] shadow-sm premium-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Quote Content */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6 md:space-y-8">
                  {/* Purple Quote Symbol */}
                  <div className="text-[#553C9A]">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <blockquote className="text-xl sm:text-2xl lg:text-[27px] font-bold text-[#17151D] font-headline leading-snug tracking-tight">
                    {featured.quote}
                  </blockquote>

                  <div className="flex items-center gap-3.5 pt-2">
                    {featured.authorPortrait ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#DDD8E8] shadow-xs">
                        <Image
                          src={resolveAssetUrl(featured.authorPortrait)}
                          alt={featured.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#3F3356] text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {(featured.authorName || "PV")
                          .split(" ")
                          .map((w) => w[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "PV"}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-[#17151D]">{featured.authorName}</div>
                      <div className="text-xs text-[#625F6B]">
                        {featured.jobTitle}
                        {featured.companyName && featured.companyName !== featured.authorName ? ` at ${featured.companyName}` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Industrial Image */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full shadow-md border border-[#DDD5EF] group">
                    <Image
                      src={resolveAssetUrl(featured.companyLogo || featured.authorPortrait || "/industrial-partner.jpg")}
                      alt={featured.companyName || featured.authorName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Testimonial Cards */}
          {otherTestimonials.length > 0 && (
            <div
              data-gsap="stagger"
              data-gsap-stagger="0.1"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 md:mt-8"
            >
              {otherTestimonials.map((t) => {
                const initials =
                  (t.authorName || "PV")
                    .split(" ")
                    .map((w) => w[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "PV";

                return (
                  <div
                    key={t.id}
                    data-gsap-item
                    className="bg-[#F5F2FA] rounded-2xl p-6 lg:p-7 flex flex-col justify-between space-y-6 border border-[#E8E3F2] premium-card"
                  >
                    <div className="space-y-4">
                      {/* 5 Purple Stars */}
                      <div className="flex items-center gap-1 text-[#553C9A]">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-[13px] sm:text-sm text-[#17151D] font-normal leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      {t.authorPortrait ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#DDD8E8] shadow-xs">
                          <Image
                            src={resolveAssetUrl(t.authorPortrait)}
                            alt={t.authorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#3F3356] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#17151D]">{t.authorName}</div>
                        <div className="text-[11px] text-[#625F6B]">
                          {t.jobTitle}
                          {t.companyName && t.companyName !== t.authorName ? ` at ${t.companyName}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dark Statistics Bar with Animated Counters */}
          <div
            data-gsap="scale-up"
            className="mt-6 md:mt-8 bg-[#2A2733] rounded-2xl md:rounded-3xl p-6 md:py-8 md:px-12 text-white shadow-xl premium-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-6 md:gap-0 text-center">
              <div className="pt-2 md:pt-0">
                <div
                  data-gsap="counter"
                  data-target="100"
                  data-suffix="+"
                  className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-headline tracking-tight text-white"
                >
                  100+
                </div>
                <div className="text-xs text-gray-400 mt-1.5">Machines Secured</div>
              </div>

              <div className="pt-6 md:pt-0">
                <div
                  data-gsap="counter"
                  data-target="95"
                  data-suffix="%"
                  className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-headline tracking-tight text-white"
                >
                  95%
                </div>
                <div className="text-xs text-gray-400 mt-1.5">Uptime Reliability</div>
              </div>

              <div className="pt-6 md:pt-0">
                <div
                  data-gsap="counter"
                  data-target="10"
                  data-suffix="+"
                  className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold font-headline tracking-tight text-white"
                >
                  10+
                </div>
                <div className="text-xs text-gray-400 mt-1.5">Years of Edge Expertise</div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7.5: TRUSTED BY OUR PARTNERS (PARTNER LOGO MARQUEE)
           ========================================================================= */}
        <PartnerMarquee partners={partners} />


        {/* =========================================================================
            SECTION 8: BOTTOM CTA WITH CONCENTRIC CIRCLES
           ========================================================================= */}
        <section className="relative py-28 md:py-36 px-6 bg-[#F8F1FD] overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Concentric Circular Background Patterns */}
          <div
            data-gsap="parallax"
            data-gsap-speed="0.2"
            className="absolute inset-0 flex items-center justify-center pointer-events-none ambient-concentric"
          >
            {/* Center soft glow */}
            <div className="absolute w-[380px] h-[380px] bg-white/70 rounded-full blur-2xl"></div>

            {/* Outermost circle */}
            <div className="absolute w-[760px] h-[760px] md:w-[980px] md:h-[980px] rounded-full border border-[#DDD5EF]/45"></div>

            {/* Middle circle */}
            <div className="absolute w-[560px] h-[560px] md:w-[720px] md:h-[720px] rounded-full border border-[#DDD5EF]/55"></div>

            {/* Inner circle */}
            <div className="absolute w-[380px] h-[380px] md:w-[480px] md:h-[480px] rounded-full border border-[#DDD5EF]/65"></div>

            {/* Innermost circle */}
            <div className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-[#DDD5EF]/75"></div>
          </div>

          {/* Top Pill Badge */}
          <div
            data-gsap="fade-up"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff] border border-[#DDD5EF] text-[10.5px] sm:text-[11px] font-bold tracking-[0.06em] text-[#432F75] uppercase select-none transition-all z-9"
          >
            <ShieldIcon className="w-3.5 h-3.5 text-[#503796] shrink-0" />
            <span>READY TO SET THE NEW STANDARD?</span>
          </div>

          {/* Headline */}
          <h2
            data-gsap="fade-up"
            data-gsap-delay="0.1"
            className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#17151D] font-headline tracking-tight leading-[1.12] max-w-3xl mx-auto"
          >
            &ldquo;Give every machine an{" "}
            <span className="font-serif italic font-normal text-[#4C3298]">identity</span>. Give every engineer verified{" "}
            <span className="font-serif italic font-normal text-[#4C3298]">access</span>.&rdquo;
          </h2>

          {/* Subtitle */}
          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="relative z-10 text-xs sm:text-sm md:text-base text-[#625F6B] max-w-xl mx-auto leading-relaxed mt-6"
          >
            See how Privitty sets the new standard for machine identity and human access, software only, deployed on your existing infrastructure in hours.
          </p>

          {/* Action Buttons */}
          <div
            data-gsap="fade-up"
            data-gsap-delay="0.28"
            className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-8"
          >
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl bg-[#4F378A] hover:bg-[#432E76] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 group interactive-btn"
            >
              <span>Book a Demo</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="/whitepapers"
              className="px-6 py-3 rounded-xl bg-white hover:bg-[#F8F5FF] text-[#17151D] border border-[#DDD8E8] font-semibold text-xs sm:text-sm shadow-xs transition-all interactive-btn"
            >
              Whitepaper
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
