import { ShieldIcon } from "./Icons";

interface BrandTaglineProps {
  className?: string;
}

export default function BrandTagline({ className = "" }: BrandTaglineProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff] border border-[#DDD5EF] text-[10.5px] sm:text-[11px] font-bold tracking-[0.06em] text-[#432F75] uppercase select-none transition-all ${className}`}
    >
      <ShieldIcon className="w-3.5 h-3.5 text-[#503796] shrink-0" />
      <span>THE IDENTITY LAYER FOR OPERATIONAL TECHNOLOGY</span>
    </div>
  );
}
