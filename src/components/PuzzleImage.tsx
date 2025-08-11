"use client";

import Image from "next/image";
import { useState } from "react";

interface PuzzleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PuzzleImage({ src, alt, className = "" }: PuzzleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle different image source types
  const getImageSrc = (imageSrc: string) => {
    // If it's already a full URL, use it as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    
    // If it's a relative path, ensure it starts with /
    if (imageSrc.startsWith('/')) {
      return imageSrc;
    }
    
    // Otherwise, prepend /
    return `/${imageSrc}`;
  };

  const imageSrc = getImageSrc(src);

  if (imageError) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded border border-gray-300">
        <div className="text-center text-gray-500">
          <p className="text-sm">Image could not be loaded</p>
          <p className="text-xs mt-1">Please contact an administrator</p>
          <p className="text-xs mt-1 text-gray-400">URL: {imageSrc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-2xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded border">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}
        <Image 
          src={imageSrc}
          alt={alt}
          width={1600}
          height={1200}
          className={`h-auto w-full max-w-full rounded border object-contain ${className}`}
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
          unoptimized
          priority={false}
        />
      </div>
    </div>
  );
}
