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
  /**
   * masonry: 원본 비율 유지, 세로(열 단위)로 흐름 — Works 아카이브용
   * uniform: 정사각 타일을 가로(왼→오른쪽) 순서로 배치 — 홈 큐레이션용
   */
  layout?: "masonry" | "uniform";
}

export default function PhotoGrid({
  photos,
  onPhotoClick,
  layout = "masonry",
}: PhotoGridProps) {
  const uniform = layout === "uniform";

  const tile = (photo: Photo, index: number) => (
    <FadeIn>
      <button
        type="button"
        className={`block w-full cursor-pointer overflow-hidden bg-neutral-100 ${
          uniform ? "aspect-square" : ""
        }`}
        onClick={() => onPhotoClick?.(index)}
        aria-label={photo.alt}
        // masonry는 원본 비율로 자리를 미리 확보 → 로딩 중 사진이 밀리지 않음
        style={
          !uniform && photo.width && photo.height
            ? { aspectRatio: `${photo.width} / ${photo.height}` }
            : undefined
        }
      >
        <img
          src={thumb(photo.cloudinaryId, photo.rotate)}
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
  );

  // CSS 그리드는 왼→오른쪽 순서로 채워지므로 1,2,3 배치가 된다
  if (uniform) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <div key={photo.id}>{tile(photo, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 gap-2.5 sm:gap-4 lg:columns-3">
      {photos.map((photo, index) => (
        <div key={photo.id} className="mb-2.5 break-inside-avoid sm:mb-4">
          {tile(photo, index)}
        </div>
      ))}
    </div>
  );
}
