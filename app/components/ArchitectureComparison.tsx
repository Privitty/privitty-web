import React from "react";
import {
  CircleAlert,
  CheckCircle2,
  Zap,
  Infinity as InfinityIcon,
  ShieldCheck,
} from "lucide-react";

interface ComparisonRow {
  dimension: string;
  traditional: {
    isAlert?: boolean;
    text: string;
  };
  privitty: {
    icon: "check" | "dot" | "zap" | "infinity";
    text: string;
    subText?: string;
  };
}

const comparisonRows: ComparisonRow[] = [
  {
    dimension: "Extra hardware at each site",
    traditional: {
      isAlert: true,
      text: "Yes",
    },
    privitty: {
      icon: "check",
      text: "No",
      subText: "(100% software deploy)",
    },
  },
  {
    dimension: "What the engineer reaches",
    traditional: {
      text: "A network segment",
    },
    privitty: {
      icon: "dot",
      text: "One device, one task",
    },
  },
  {
    dimension: "Firewall",
    traditional: {
      text: "Ports opened and maintained",
    },
    privitty: {
      icon: "dot",
      text: "No inbound ports, one controlled port",
    },
  },
  {
    dimension: "Third party in the path",
    traditional: {
      text: "Often terminates sessions",
    },
    privitty: {
      icon: "dot",
      text: "Transport only, sees ciphertext",
    },
  },
  {
    dimension: "Authentication",
    traditional: {
      text: "Passwords and shared secrets",
    },
    privitty: {
      icon: "dot",
      text: "Cryptographic identity",
    },
  },
  {
    dimension: "Offboarding a vendor",
    traditional: {
      text: "Rotate secrets, hope for the best",
    },
    privitty: {
      icon: "zap",
      text: "Revoke the identity instantly",
    },
  },
  {
    dimension: "Scaling to 1,000s of devices",
    traditional: {
      text: "More boxes, more cost",
    },
    privitty: {
      icon: "infinity",
      text: "Software, same model",
    },
  },
];

interface ArchitectureComparisonProps {
  className?: string;
}

export default function ArchitectureComparison({
  className = "",
}: ArchitectureComparisonProps) {
  return (
    <section
      className={`py-20 px-6 max-w-7xl mx-auto border-t border-[#DDD8E8] ${className}`}
      aria-label="Architecture Comparison"
    >
      {/* Header Content */}
      <div data-gsap="fade-up" className="max-w-4xl space-y-4">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEBFA] border border-[#DDD5EF] text-[10.5px] sm:text-[11px] font-bold tracking-[0.06em] text-[#4C3298] uppercase select-none transition-all">
          <svg
            className="w-3.5 h-3.5 text-[#503796] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 11.5H5.5L9.5 4.5H13.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="2.5" cy="11.5" r="1.5" fill="currentColor" />
            <circle cx="13.5" cy="4.5" r="1.5" fill="currentColor" />
          </svg>
          <span>ARCHITECTURE COMPARISON</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#110E1B] font-headline tracking-[-0.03em] leading-[1.12]">
          Why the perimeter fails
          <br />
          where{" "}
          <span className="font-serif italic font-normal text-[#4C3298]">
            cryptographic identity
          </span>{" "}
          scales.
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-[17px] text-[#625F6B] font-normal max-w-2xl leading-relaxed pt-1">
          A direct comparison between legacy perimeter hardware and Privitty&apos;s
          sovereign identity layer.
        </p>
      </div>

      {/* Comparison Table Card */}
      <div
        data-gsap="fade-up"
        data-gsap-delay="0.15"
        className="mt-12 bg-white rounded-2xl sm:rounded-3xl border border-[#E2DCED] shadow-[0_20px_50px_rgba(76,50,152,0.06)] overflow-hidden"
      >
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-[#ECE7F6]">
                <th
                  scope="col"
                  className="py-5 sm:py-6 px-6 sm:px-8 w-[32%] text-sm sm:text-[15px] font-bold text-[#17151D]"
                >
                  Dimension / Capability
                </th>
                <th
                  scope="col"
                  className="py-5 sm:py-6 px-6 sm:px-8 w-[33%] text-sm sm:text-[15px] font-semibold text-[#625F6B]"
                >
                  Traditional VPN / broker
                </th>
                <th
                  scope="col"
                  className="py-5 sm:py-6 px-6 sm:px-8 w-[35%] bg-[#F5F2FB] text-sm sm:text-[15px]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4C3298] stroke-[2.2]" />
                      <span className="font-bold text-[#110E1B] text-sm sm:text-base">
                        Privitty
                      </span>
                    </div>
                    <span className="bg-[#34205C] text-white text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      SOVEREIGN
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => {
                const isLastRow = idx === comparisonRows.length - 1;
                return (
                  <tr
                    key={row.dimension}
                    className={`transition-colors hover:bg-[#FAF8FE]/50 ${
                      !isLastRow ? "border-b border-[#ECE7F6]" : ""
                    }`}
                  >
                    {/* Dimension / Capability */}
                    <td className="py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-[14.5px] font-semibold text-[#17151D]">
                      {row.dimension}
                    </td>

                    {/* Traditional VPN / broker */}
                    <td className="py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-[14.5px] text-[#524E5B]">
                      {row.traditional.isAlert ? (
                        <div className="flex items-center gap-2">
                          <CircleAlert className="w-4 h-4 text-[#E5484D] stroke-[2.2] shrink-0" />
                          <span>{row.traditional.text}</span>
                        </div>
                      ) : (
                        <span>{row.traditional.text}</span>
                      )}
                    </td>

                    {/* Privitty (Lavender Highlight Column) */}
                    <td className="py-4 sm:py-5 px-6 sm:px-8 bg-[#F5F2FB] text-sm sm:text-[14.5px]">
                      <div className="flex items-center gap-2 text-[#17151D]">
                        {row.privitty.icon === "check" && (
                          <CheckCircle2 className="w-4 h-4 text-[#4C3298] stroke-[2.2] shrink-0" />
                        )}
                        {row.privitty.icon === "dot" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4C3298] shrink-0 inline-block" />
                        )}
                        {row.privitty.icon === "zap" && (
                          <Zap className="w-4 h-4 text-[#4C3298] fill-[#4C3298]/20 stroke-[2] shrink-0" />
                        )}
                        {row.privitty.icon === "infinity" && (
                          <InfinityIcon className="w-4 h-4 text-[#4C3298] stroke-[2.2] shrink-0" />
                        )}

                        <span className="font-bold">{row.privitty.text}</span>

                        {row.privitty.subText && (
                          <span className="text-xs sm:text-[13px] text-[#625F6B] font-normal">
                            {row.privitty.subText}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Horizontal Scroll Hint */}
        <div className="sm:hidden px-6 py-2.5 bg-[#FAF8FE] border-t border-[#ECE7F6] text-center">
          <span className="text-[11px] font-medium text-[#6750A4]">
            ← Scroll horizontally to compare all capabilities →
          </span>
        </div>
      </div>
    </section>
  );
}

