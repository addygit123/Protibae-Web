'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary-client';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  crop?: string;
}

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDkiIGhlaWdodD0iNDA5IiB2aWV3Qm94PSIwIDAgMzA5IDQwOSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWIyZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjZTFiZWMzIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tk8gSU1BR0U8L3RleHQ+PC9zdmc+';

export function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  crop = 'fill',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_IMAGE);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImgSrc(src || FALLBACK_IMAGE);
    setIsError(false);
  }, [src]);

  // Generate blur placeholder URL if it's a Cloudinary URL
  let blurDataURL = undefined;
  if (src && src.includes('res.cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length >= 2) {
      blurDataURL = `${parts[0]}/upload/c_scale,w_40,q_auto,e_blur:1000/${parts[1]}`;
    }
  }

  // Fallback blurDataURL if Cloudinary is not used or fails
  if (!blurDataURL) {
    blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzE5MWEyMCIvPjwvc3ZnPg==';
  }

  // Get optimized Cloudinary URL for main source if it's Cloudinary
  const optimizedSrc = getOptimizedCloudinaryUrl(imgSrc, {
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    crop,
  });

  return (
    <Image
      src={isError ? FALLBACK_IMAGE : optimizedSrc}
      alt={alt || 'Product Image'}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={cn('transition-all duration-300', className)}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurDataURL}
      onError={() => {
        setIsError(true);
        setImgSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
