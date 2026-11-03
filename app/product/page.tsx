"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandTagline from "../components/BrandTagline";
import { ArrowRight, ArrowUpRight, ZapIcon, ShieldIcon } from "../components/Icons";

export default function ProductPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F5FF] text-[#17151D]">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION
           ========================================================================= */}
        <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto text-center">
          <div data-gsap="fade-up" className="mb-6 flex justify-center">
            <BrandTagline />
          </div>

          <h1
            data-gsap="fade-up"
            data-gsap-delay="0.1"
            className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#17151D] font-headline tracking-tight leading-[1.08] max-w-4xl mx-auto"
          >
            Machine identity. Human<br />access.<br />
            <span className="font-serif italic font-normal text-[#4C3298]">Built into every layer.</span>
          </h1>

          <p
            data-gsap="fade-up"
            data-gsap-delay="0.2"
            className="text-base sm:text-lg text-[#625F6B] max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            A complete platform for zero-trust remote access, machine identity lifecycle management, and encrypted data streams across industrial operations.
          </p>

          {/* Quick Nav Pills */}
          <div
            data-gsap="stagger"
            data-gsap-delay="0.25"
            data-gsap-stagger="0.08"
            className="flex flex-wrap justify-center items-center gap-3 mt-8"
          >
            <a
              data-gsap-item
              href="#edge"
              className="px-5 py-2.5 rounded-full bg-[#1E1B26] text-white hover:bg-[#2D2938] transition-all text-xs font-semibold shadow-sm interactive-btn"
            >
              Privitty Edge &amp; Watchtower
            </a>
            <a
              data-gsap-item
              href="#console"
              className="px-5 py-2.5 rounded-full bg-[#1E1B26] text-white hover:bg-[#2D2938] transition-all text-xs font-semibold shadow-sm interactive-btn"
            >
              Identity governance console
            </a>
            <a
              data-gsap-item
              href="#sdk"
              className="px-5 py-2.5 rounded-full bg-[#1E1B26] text-white hover:bg-[#2D2938] transition-all text-xs font-semibold shadow-sm interactive-btn"
            >
              Privitty Communicator SDK
            </a>
            <a
              data-gsap-item
              href="#app"
              className="px-5 py-2.5 rounded-full bg-[#1E1B26] text-white hover:bg-[#2D2938] transition-all text-xs font-semibold shadow-sm interactive-btn"
            >
              Privitty Communicator App
            </a>
          </div>
        </section>

        {/* =========================================================================
            MODULE 1: PRIVITTY EDGE & WATCHTOWER
           ========================================================================= */}
        <section id="edge" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Header */}
          <div data-gsap="fade-up" className="space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              EDGE DEPLOYMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151D] font-headline tracking-tight">
              Privitty Edge &amp; Watchtower
            </h2>
            <p className="text-sm sm:text-base text-[#625F6B] max-w-3xl leading-relaxed">
              Lightweight industrial edge software that secures hardware devices, monitors traffic, and establishes zero-trust tunnels without opening inbound ports.
            </p>
          </div>

          {/* Top Block: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Left Column: 2 Stacked Cards + Buttons */}
            <div data-gsap="fade-up" className="lg:col-span-6 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD8E8]/70 shadow-sm space-y-3 premium-card">
                <div className="w-10 h-10 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <path d="M15 2v2" />
                    <path d="M9 2v2" />
                    <path d="M15 20v2" />
                    <path d="M9 20v2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#17151D] font-headline">
                  Hardware Attestation
                </h3>
                <p className="text-xs sm:text-sm text-[#625F6B] leading-relaxed">
                  Watchtower sits alongside your PLCs, RTUs, and HMIs. It binds machine identities directly to hardware TPM 2.0 modules and establishes outbound mTLS tunnels only when authorized sessions are initiated.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDD8E8]/70 shadow-sm space-y-3 premium-card">
                <div className="w-10 h-10 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#17151D] font-headline">
                  Outbound Ephemeral Tunneling
                </h3>
                <p className="text-xs sm:text-sm text-[#625F6B] leading-relaxed">
                  Tunnels are operator-initiated, session-scoped, and revokable independently. No inbound firewall ports, only outbound from the edge.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#architecture"
                  className="px-5 py-2.5 rounded-xl bg-[#ECE7F6] hover:bg-[#DFD8F0] text-[#17151D] text-xs font-semibold transition-all interactive-btn"
                >
                  Get Technical Specs
                </a>
                <a
                  href="#demo"
                  className="px-5 py-2.5 rounded-xl bg-[#4F378A] hover:bg-[#432E76] text-white text-xs font-semibold shadow-md transition-all interactive-btn"
                >
                  Deploy Edge Daemon
                </a>
              </div>
            </div>

            {/* Right Column: Console Mockup Card */}
            <div data-gsap="scale-up" className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDD8E8] shadow-lg space-y-5 premium-card">
                {/* Console Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#DDD8E8]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                      <ZapIcon className="w-3.5 h-3.5 text-[#553C9A]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-[#17151D]">plc-substation-04.local</div>
                      <div className="text-[10px] text-gray-500 font-sans">Edge Daemon #8802</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#ECE7F6] text-[#4F378A] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    TPM 2.0 Hardware Attested
                  </span>
                </div>

                {/* Console Status Rows */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[#17151D] font-bold">Policy Enforcement</div>
                      <div className="text-[11px] text-[#625F6B]">Modbus TCP Strict Mode</div>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                      Enforcing
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[#17151D] font-bold">Inbound Ports</div>
                      <div className="text-[11px] text-[#625F6B]">0 Open Inbound Ports (0/65535)</div>
                    </div>
                    <span className="text-[10px] bg-[#ECE7F6] text-[#4F378A] font-bold px-2 py-0.5 rounded">
                      0 Open
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[#17151D] font-bold">Active Session</div>
                      <div className="text-[11px] text-[#625F6B]">engineer.schmidt@privitty.cloud</div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Ephemeral
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/80 flex items-center justify-between">
                    <div>
                      <div className="text-[#17151D] font-bold">mTLS Stream</div>
                      <div className="text-[11px] text-[#625F6B]">256-bit AES-GCM Encrypted &bull; 4ms</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Connected
                    </span>
                  </div>
                </div>

                {/* Console Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-[#DDD8E8] text-xs">
                  <span className="text-[11px] text-[#625F6B]">Watchtower Agent v2.4.1 &mdash; Operational</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors interactive-btn cursor-pointer"
                  >
                    Revoke All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 6 Sub-Cards Grid */}
          <div
            data-gsap="stagger"
            data-gsap-stagger="0.08"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Hardware Identity Attestation</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Every machine connection is verified through hardware TPM cryptographic binding, eliminating static credentials.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Outbound-Only Tunnels</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Opens outbound mTLS connections to the Privitty network fabric without exposing any inbound firewall ports or modifying subnets.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 14.14 14.14" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Zero Open Inbound Ports</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Total immunity to external port scanning and perimeter probing attacks. The edge remains invisible to internet scanners.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Modbus &amp; OPC-UA Inspection</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Deep protocol packet inspection validates industrial payloads down to command function codes, preventing out-of-range PLC writes.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Instant Revocation (&lt;1s)</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Revoke any active session or compromised device certificate globally across your fleet in under one second.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Zero Hardware Footprint</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Deploys as a lightweight container or native binary on existing industrial PCs (IPC, Raspberry Pi, Debian, Windows IoT).
              </p>
            </div>
          </div>

          {/* Section Action Buttons */}
          <div data-gsap="fade-up" className="flex items-center justify-center gap-3 mt-10">
            <a
              href="#demo"
              className="px-6 py-2.5 rounded-xl bg-[#1E1B26] hover:bg-[#2D2938] text-white text-xs font-semibold shadow-sm transition-all interactive-btn"
            >
              Schedule Demo
            </a>
            <a
              href="/whitepapers"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#F8F5FF] text-[#17151D] border border-[#DDD8E8] text-xs font-semibold shadow-xs transition-all interactive-btn"
            >
              Read Whitepaper
            </a>
          </div>
        </section>

        {/* =========================================================================
            MODULE 2: IDENTITY GOVERNANCE CONSOLE
           ========================================================================= */}
        <section id="console" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Header */}
          <div data-gsap="fade-up" className="space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              CENTRALIZED CONTROL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151D] font-headline tracking-tight">
              The identity governance console
            </h2>
            <p className="text-sm sm:text-base text-[#625F6B] max-w-3xl leading-relaxed">
              A single pane of glass to register machine identities, govern access policies, monitor active streams, and enforce panic revocation across your fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Fleet Mockup Card */}
            <div data-gsap="scale-up" className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDD8E8] shadow-lg space-y-4 premium-card">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD8E8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs font-bold text-[#17151D]">FLEET ACCESS SESSIONS</span>
                  </div>
                  <span className="text-[10px] bg-[#ECE7F6] text-[#4F378A] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Live Fleet
                  </span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#17151D]">SUBSTATION-04 // PLC-Main</div>
                      <div className="text-[11px] text-[#625F6B]">engineer.schmidt@privitty.cloud</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#17151D]">ROBOTICS-LINE-3 // KUKA-Arm-02</div>
                      <div className="text-[11px] text-[#625F6B]">vendor.kuka@contractor.io</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#17151D]">TURBINE-GATEWAY // RTU-Unit</div>
                      <div className="text-[11px] text-[#625F6B]">ops.turbine@energy.corp</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8]/70 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#17151D]">HMI-CELL-09 // Siemens-HMI</div>
                      <div className="text-[11px] text-[#625F6B]">oem.service@siemens-partner.com</div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Ephemeral
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#625F6B] border-t border-[#DDD8E8]">
                  <span>4 active sessions across 12 connected edge nodes</span>
                  <a href="#audit" className="text-[#6750A4] font-bold hover:underline inline-flex items-center gap-1">
                    <span>View Audit Log</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Cards (2x2 grid) */}
            <div
              data-gsap="stagger"
              data-gsap-stagger="0.08"
              className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8]/70 space-y-2.5 shadow-xs premium-card">
                <div className="w-8 h-8 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#17151D] font-headline">Granular Identity RBAC</h4>
                <p className="text-xs text-[#625F6B] leading-relaxed">
                  Assign permissions down to specific PLCs, ports, or protocols based on engineer identity and work orders.
                </p>
              </div>

              <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8]/70 space-y-2.5 shadow-xs premium-card">
                <div className="w-8 h-8 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#17151D] font-headline">One-Click Kill Switch</h4>
                <p className="text-xs text-[#625F6B] leading-relaxed">
                  Terminate any active session or trigger a full panic disconnect across a whole site in milliseconds.
                </p>
              </div>

              <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8]/70 space-y-2.5 shadow-xs premium-card">
                <div className="w-8 h-8 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#17151D] font-headline">Just-in-Time Ephemeral Grants</h4>
                <p className="text-xs text-[#625F6B] leading-relaxed">
                  Access automatically expires after maintenance windows close, preventing dormant credentials.
                </p>
              </div>

              <div data-gsap-item className="bg-white p-6 rounded-2xl border border-[#DDD8E8]/70 space-y-2.5 shadow-xs premium-card">
                <div className="w-8 h-8 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#17151D] font-headline">Tamper-Proof Audit Trails</h4>
                <p className="text-xs text-[#625F6B] leading-relaxed">
                  Signed audit records capture session metadata and transaction logs with complete cryptographic non-repudiation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MODULE 3: COMMUNICATOR SDK
           ========================================================================= */}
        <section id="sdk" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Header */}
          <div data-gsap="fade-up" className="space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              DEVELOPER TOOLS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151D] font-headline tracking-tight">
              Privitty Communicator SDK
            </h2>
            <p className="text-sm sm:text-base text-[#625F6B] max-w-3xl leading-relaxed">
              Embed native zero-trust identity and encrypted communications directly into custom firmware, IoT gateways, and proprietary industrial software.
            </p>
          </div>

          {/* Top Block: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Left Column: Description & Buttons */}
            <div data-gsap="fade-up" className="lg:col-span-6 space-y-6">
              <p className="text-sm sm:text-base text-[#625F6B] leading-relaxed">
                The Privitty Communicator SDK abstracts away the complexity of hardware attestation, mTLS session negotiation, and dynamic cryptographic key rotation into a clean, modern API.
              </p>
              <p className="text-sm sm:text-base text-[#625F6B] leading-relaxed">
                Available for C/C++, Rust, and Python, the SDK allows OEMs and systems integrators to build zero-trust security natively into edge applications without modifying networking infrastructure.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#docs"
                  className="px-5 py-2.5 rounded-xl bg-[#ECE7F6] hover:bg-[#DFD8F0] text-[#17151D] text-xs font-semibold transition-all interactive-btn"
                >
                  SDK Documentation
                </a>
                <a
                  href="#demo"
                  className="px-5 py-2.5 rounded-xl bg-[#4F378A] hover:bg-[#432E76] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 interactive-btn"
                >
                  <span>Get API Keys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Code Editor Mockup */}
            <div data-gsap="scale-up" className="lg:col-span-6">
              <div className="bg-[#1E1B26] text-white rounded-2xl p-6 font-mono text-xs shadow-2xl border border-white/10 space-y-3 premium-card">
                {/* Window header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-sans">privitty_connect.rs</span>
                  <div className="w-10"></div>
                </div>

                {/* Code body */}
                <div className="space-y-1.5 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-gray-300">
                  <div className="text-gray-500">// Initialize Privitty Zero-Trust Client</div>
                  <div>
                    <span className="text-purple-400">let</span> config = PrivittyConfig::<span className="text-blue-400">builder</span>()
                  </div>
                  <div className="pl-4">
                    .<span className="text-blue-300">identity_server</span>(<span className="text-amber-300">&quot;https://identity.privitty.cloud&quot;</span>)
                  </div>
                  <div className="pl-4">
                    .<span className="text-blue-300">tpm_device</span>(<span className="text-amber-300">&quot;/dev/tpm0&quot;</span>)
                  </div>
                  <div className="pl-4">
                    .<span className="text-blue-300">build</span>()?;
                  </div>
                  <div className="pt-2">
                    <span className="text-purple-400">let</span> client = PrivittyClient::<span className="text-blue-400">init</span>(config).<span className="text-purple-400">await</span>?;
                  </div>
                  <div className="pt-2 text-gray-500">// Establish ephemeral connection to PLC</div>
                  <div>
                    <span className="text-purple-400">let</span> session = client.<span className="text-blue-300">connect</span>(<span className="text-amber-300">&quot;plc-substation-04&quot;</span>)
                  </div>
                  <div className="pl-4">
                    .<span className="text-blue-300">scope</span>(<span className="text-amber-300">&quot;modbus-read-only&quot;</span>)
                  </div>
                  <div className="pl-4">
                    .<span className="text-blue-300">expires_in</span>(Duration::<span className="text-blue-300">from_secs</span>(<span className="text-amber-300">3600</span>))
                  </div>
                  <div className="pl-4">
                    .<span className="text-purple-400">await</span>?;
                  </div>
                  <div className="pt-2 text-emerald-400">
                    println!(&quot;Connected with TPM hardware identity!&quot;);
                  </div>
                  <div>
                    session.<span className="text-blue-300">send_command</span>(ModbusFrame::<span className="text-blue-300">read_holding</span>(<span className="text-amber-300">0x01</span>, <span className="text-amber-300">10</span>)).<span className="text-purple-400">await</span>?;
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 6 Sub-Cards Grid */}
          <div
            data-gsap="stagger"
            data-gsap-stagger="0.08"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Multi-Language Bindings</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                First-class support for C, C++, Rust, and Python with zero runtime overhead on resource-constrained embedded chips.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Hardware TPM Abstraction</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Clean interfaces for TPM 2.0, Secure Enclaves, and ATECC608 secure elements without low-level driver headaches.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Post-Quantum Ready mTLS</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Modern cryptographic suites with automatic session key rotation and forward secrecy built directly into every stream.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Fine-Grained Scopes</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Define fine-grained permission scopes in application code to restrict data access to only authorized command sets.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="m8 21 8 0" />
                  <path d="m12 17 0 4" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Lightweight Footprint</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Minimal binary size (~2 MB compiled) with sub-millisecond handshake latency suitable for low-power edge gateways.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Air-Gapped Deployment</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Operates seamlessly in isolated OT networks with optional on-premise local identity verification nodes.
              </p>
            </div>
          </div>

          {/* Section Action Buttons */}
          <div data-gsap="fade-up" className="flex items-center justify-center gap-3 mt-10">
            <a
              href="#demo"
              className="px-6 py-2.5 rounded-xl bg-[#1E1B26] hover:bg-[#2D2938] text-white text-xs font-semibold shadow-sm transition-all interactive-btn"
            >
              Schedule Demo
            </a>
            <a
              href="/whitepapers"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#F8F5FF] text-[#17151D] border border-[#DDD8E8] text-xs font-semibold shadow-xs transition-all interactive-btn"
            >
              Read Whitepaper
            </a>
          </div>
        </section>

        {/* =========================================================================
            MODULE 4: COMMUNICATOR APP
           ========================================================================= */}
        <section id="app" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8]">
          {/* Header */}
          <div data-gsap="fade-up" className="space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
              ENGINEER ACCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151D] font-headline tracking-tight">
              Privitty Communicator App
            </h2>
            <p className="text-sm sm:text-base text-[#625F6B] max-w-3xl leading-relaxed">
              The desktop and mobile client that enables authorized engineers to connect directly to factory floor assets from anywhere without a VPN.
            </p>
          </div>

          {/* Top Block: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Left Column: Description & Buttons */}
            <div data-gsap="fade-up" className="lg:col-span-6 space-y-6">
              <p className="text-sm sm:text-base text-[#625F6B] leading-relaxed">
                Privitty Communicator provides a frictionless experience for internal engineers and third-party OEM technicians. Instead of dealing with clunky VPN clients, IP routing conflicts, and broad network exposure, engineers select authorized machines from a verified directory.
              </p>
              <p className="text-sm sm:text-base text-[#625F6B] leading-relaxed">
                Sessions are ephemeral and verified cryptographically through SSO and biometric MFA. When the maintenance task is complete, access terminates instantly.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#download"
                  className="px-5 py-2.5 rounded-xl bg-[#ECE7F6] hover:bg-[#DFD8F0] text-[#17151D] text-xs font-semibold transition-all interactive-btn"
                >
                  Download Client
                </a>
                <a
                  href="#demo"
                  className="px-5 py-2.5 rounded-xl bg-[#4F378A] hover:bg-[#432E76] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 interactive-btn"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Communicator App Mockup Card */}
            <div data-gsap="scale-up" className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDD8E8] shadow-lg space-y-4 premium-card">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD8E8]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#17151D]">Privitty Communicator Desktop</div>
                      <div className="text-[10px] text-gray-500 font-mono">v3.1.2 &bull; macOS / Windows / Linux</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Connected
                  </span>
                </div>

                {/* Target input field */}
                <div className="p-2.5 bg-[#F8F5FF] rounded-xl border border-[#DDD8E8] flex items-center gap-2 font-mono text-xs text-[#625F6B]">
                  <span className="text-[#6750A4] font-bold">&gt;</span>
                  <span>Connecting to plc-substation-04.local...</span>
                </div>

                {/* Active Session Highlight Container */}
                <div className="bg-[#4F378A] text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans uppercase tracking-wider text-purple-200">
                      Ephemeral Session Active
                    </span>
                    <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded">
                      AES-256-GCM
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-sm font-bold text-white">Target: plc-substation-04</div>
                    <div className="text-purple-200 text-[11px]">Protocol: Modbus/TCP &bull; Latency: 4ms</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-purple-400/30 text-xs">
                    <span className="text-amber-300 font-bold font-mono">Time Remaining: 42m 18s</span>
                    <button
                      type="button"
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-semibold transition-colors interactive-btn cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-1 flex items-center justify-between text-xs text-[#625F6B]">
                  <span className="text-[11px]">Audit signature verified &bull; Non-repudiation active</span>
                  <button type="button" className="text-xs text-[#6750A4] font-bold hover:underline cursor-pointer">
                    Session Log
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 6 Sub-Cards Grid */}
          <div
            data-gsap="stagger"
            data-gsap-stagger="0.08"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Zero-Config Native Clients</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Available for Windows, macOS, Linux, iOS, and Android. No routing tables, subnet conflicts, or virtual adapters needed.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Ephemeral Sessions</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Access is granted strictly for the duration of the approved work order and automatically revokes upon expiry.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Identity-Verified MFA</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Integrates with Okta, Azure AD, Ping, and hardware FIDO2 keys before any edge connection can be established.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">SSH, RDP, VNC &amp; Web Support</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Seamless tunneling for standard industrial management protocols directly within familiar engineering tools.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 7 16 12 23 17 23 7Z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Full Session Recording</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Optional end-to-end recorded audit trails with non-repudiable cryptographic signatures for forensic compliance.
              </p>
            </div>

            <div data-gsap-item className="bg-white p-7 rounded-2xl border border-[#DDD8E8]/70 space-y-3 shadow-xs premium-card">
              <div className="w-9 h-9 rounded-xl bg-[#ECE7F6] text-[#553C9A] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-[#17151D] font-headline">Third-Party Vendor Isolation</h4>
              <p className="text-xs text-[#625F6B] leading-relaxed">
                Contractor technicians access only their designated machine without seeing internal corporate network assets.
              </p>
            </div>
          </div>

          {/* Section Action Buttons */}
          <div data-gsap="fade-up" className="flex items-center justify-center gap-3 mt-10">
            <a
              href="#demo"
              className="px-6 py-2.5 rounded-xl bg-[#1E1B26] hover:bg-[#2D2938] text-white text-xs font-semibold shadow-sm transition-all interactive-btn"
            >
              Schedule Demo
            </a>
            <a
              href="/whitepapers"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#F8F5FF] text-[#17151D] border border-[#DDD8E8] text-xs font-semibold shadow-xs transition-all interactive-btn"
            >
              Read Whitepaper
            </a>
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CTA WITH CONCENTRIC CIRCLES
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
              href="/#demo"
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
