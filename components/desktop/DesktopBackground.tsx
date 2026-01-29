"use client";

import React from "react";
import Image from "next/image";

type DesktopBackgroundProps = {
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: boolean;
};

export default function DesktopBackground({ 
  backgroundImage = "/bg.jpg", 
  backgroundColor,
  overlay = true 
}: DesktopBackgroundProps) {
  return (
    <>
      {/* Desktop Background */}
      {backgroundColor ? (
        <div className="absolute inset-0" style={{ backgroundColor }} />
      ) : (
        <div className="absolute inset-x-0 bottom-0 top-[20%] md:inset-0 w-full h-auto md:h-full">
           <Image
            src={backgroundImage}
            alt="Desktop Background"
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
            className="object-cover object-center md:object-cover"
            style={{ 
               objectPosition: '50%',
               transform: 'scale(1)', // Ensure no initial scale up
            }}
            quality={90}
          />
        </div>
      )}
      
      {/* Background Overlay */}
      {overlay && <div className="absolute inset-0 bg-black/20" />}
    </>
  );
}
