import Image from "next/image";
import { PublicPartner } from "@/app/lib/queries";
import { resolveAssetUrl } from "@/app/lib/media";

interface PartnerMarqueeProps {
  partners: PublicPartner[];
}

export default function PartnerMarquee({ partners }: PartnerMarqueeProps) {
  if (!partners || partners.length === 0) {
    return null;
  }

  // Ensure enough elements for a continuous smooth loop
  const loopCount = partners.length < 5 ? 4 : 2;
  const repeatedPartners = Array.from({ length: loopCount }, () => partners).flat();

  return (
    <section
      aria-label="Trusted Partners"
      className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#DDD8E8] overflow-hidden"
    >
      {/* Header matching Privitty's typography and spacing */}
      <div data-gsap="fade-up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#6750A4]">
          PARTNERS &amp; INTEGRATIONS
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#17151D] font-headline tracking-tight">
          Trusted By Our Partners
        </h2>
        <p className="text-xs sm:text-sm text-[#625F6B] max-w-xl mx-auto">
          Powering identity-verified remote access and sovereign machine trust across critical industrial leaders.
        </p>
      </div>

      {/* Marquee Wrapper with Smooth Gradient Fade Mask */}
      <div
        className="relative marquee-container overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        role="region"
        aria-label="Partner Logos Carousel"
      >
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 md:gap-20">
          {repeatedPartners.map((partner, index) => {
            const logoSrc = resolveAssetUrl(partner.logoUrl);
            const content = (
              <div
                key={`${partner.id}-${index}`}
                className="group relative flex items-center justify-center shrink-0 px-4 py-2 transition-transform duration-300 hover:scale-105"
                title={partner.companyName}
              >
                <div className="relative h-20 sm:h-24 w-52 sm:w-64 flex items-center justify-center">
                  <Image
                    src={logoSrc}
                    alt={`${partner.companyName} logo`}
                    width={280}
                    height={100}
                    className="max-h-16 sm:max-h-20 max-w-full w-auto object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ease-in-out drop-shadow-xs"
                    loading="lazy"
                  />
                </div>
              </div>
            );

            if (partner.websiteUrl) {
              return (
                <a
                  key={`${partner.id}-${index}`}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-hidden focus:ring-2 focus:ring-[#6750A4] rounded-lg"
                  aria-label={`Visit ${partner.companyName} website`}
                >
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
