"use client";

import Image from "next/image";
import { useRef } from "react";
import { LinkedInIcon } from "../components/Icons";
import { resolveAssetUrl } from "@/app/lib/media";
import type { PublicTeamMember } from "@/app/lib/queries";

interface TeamCarouselProps {
  teamMembers: PublicTeamMember[];
}

export default function TeamCarousel({ teamMembers }: TeamCarouselProps) {
  const teamSliderRef = useRef<HTMLDivElement>(null);

  const scrollTeam = (direction: -1 | 1) => {
    const slider = teamSliderRef.current;
    if (!slider) return;
    slider.scrollBy({
      left: direction * slider.clientWidth,
      behavior: "smooth",
    });
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#DDD8E8]/70 text-center text-[#625F6B] text-sm">
        No team members published yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={() => scrollTeam(-1)}
          aria-label="Previous team members"
          className="w-10 h-10 rounded-full border border-[#DDD8E8] bg-white text-[#4F378A] hover:bg-[#6750A4] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ‹
          </span>
        </button>
        <button
          type="button"
          onClick={() => scrollTeam(1)}
          aria-label="Next team members"
          className="w-10 h-10 rounded-full border border-[#DDD8E8] bg-white text-[#4F378A] hover:bg-[#6750A4] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ›
          </span>
        </button>
      </div>

      <div
        ref={teamSliderRef}
        data-gsap="stagger"
        data-gsap-stagger="0.1"
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {teamMembers.map((member) => (
          <div
            key={member.id}
            data-gsap-item
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0 snap-start bg-white p-5 rounded-2xl border border-[#DDD8E8]/70 shadow-xs space-y-4 flex flex-col justify-between premium-card group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17151D] font-headline group-hover:text-[#6750A4] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[11px] font-semibold text-[#6750A4]">
                  {member.jobTitle}
                </p>
              </div>
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-[#ECE7F6] text-[#4F378A] hover:bg-[#553C9A] hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
                  aria-label={`${member.name} LinkedIn profile`}
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-[#DDD8E8]/50 bg-slate-100">
              <Image
                src={resolveAssetUrl(member.photoUrl) || "/preview.png"}
                alt={`${member.name} - ${member.jobTitle}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
