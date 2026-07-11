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
    <div className="columns-2 gap-4 lg:columns-3">
      {photos.map((photo, index) => (
        <div key={photo.id} className="mb-4 break-inside-avoid">
          <FadeIn>
            <button
              type="button"
              className="block w-full cursor-pointer overflow-hidden"
              onClick={() => onPhotoClick?.(index)}
              aria-label={photo.alt}
            >
              <img
                src={thumb(photo.cloudinaryId)}
                alt={photo.alt}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackFor(photo.cloudinaryId, 600);
                }}
                className="w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </button>
          </FadeIn>
        </div>
      ))}
    </div>
  );
}
