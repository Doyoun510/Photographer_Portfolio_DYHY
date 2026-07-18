import { useEffect, useRef, useState, type ReactNode } from "react";
import { fallbackFor, thumb } from "../lib/cloudinary";
import type { Photo } from "../types";

/** 스크롤 진입 시 fade-in (IntersectionObserver) */
function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (index: number) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="columns-2 gap-2.5 sm:gap-4 lg:columns-3">
      {photos.map((photo, index) => (
        <div key={photo.id} className="mb-2.5 break-inside-avoid sm:mb-4">
          <FadeIn>
            <button
              type="button"
              className="block w-full cursor-pointer overflow-hidden bg-neutral-100"
              onClick={() => onPhotoClick?.(index)}
              aria-label={photo.alt}
              // 원본 비율로 자리를 미리 확보 → 로딩 중 사진이 밀리거나 순서가 바뀌지 않음
              style={
                photo.width && photo.height
                  ? { aspectRatio: `${photo.width} / ${photo.height}` }
                  : undefined
              }
            >
              <img
                src={thumb(photo.cloudinaryId)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackFor(photo.cloudinaryId, 600);
                }}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </button>
          </FadeIn>
        </div>
      ))}
    </div>
  );
}
