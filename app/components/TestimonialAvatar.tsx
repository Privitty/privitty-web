"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TestimonialAvatarProps {
  src?: string | null;
  authorName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    container: "w-9 h-9",
    text: "text-xs",
  },
  md: {
    container: "w-11 h-11",
    text: "text-sm",
  },
  lg: {
    container: "w-14 h-14",
    text: "text-base",
  },
};

export default function TestimonialAvatar({
  src,
  authorName = "PV",
  size = "sm",
  className = "",
}: TestimonialAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if image source updates
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.sm;

  const initials =
    (authorName || "PV")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "PV";

  const cleanSrc = src?.trim();

  if (!cleanSrc || hasError) {
    return (
      <div
        className={`${sizeStyle.container} rounded-full bg-[#3F3356] text-white flex items-center justify-center font-bold shrink-0 ${sizeStyle.text} ${className}`}
        aria-label={authorName || "Author avatar"}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeStyle.container} rounded-full overflow-hidden shrink-0 border border-[#DDD8E8] shadow-xs ${className}`}
    >
      <Image
        src={cleanSrc}
        alt={authorName || "Author portrait"}
        fill
        className="object-cover"
        unoptimized
        onError={() => setHasError(true)}
      />
    </div>
  );
}

