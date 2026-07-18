import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

/**
 * Justified 배치 — 한 줄의 높이를 통일하고 폭을 사진 비율대로 나눠
 * 줄이 컨테이너 폭을 정확히 채우게 한다. 크롭 없이 위아래 여백이 균일해진다.
 */
function JustifiedRows({
  photos,
  renderTile,
}: {
  photos: Photo[];
  renderTile: (photo: Photo, index: number) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // 첫 페인트 전에 폭을 재서 깜빡임을 막는다.
  // ResizeObserver만으로는 놓치는 환경이 있어 window resize도 함께 듣는다.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const gap = width < 640 ? 10 : 16;
  const targetHeight = width < 640 ? 200 : 320;

  const ratioOf = (p: Photo) =>
    p.width && p.height ? p.width / p.height : 1;

  // 1) 목표 높이 기준으로 줄 수를 먼저 정하고
  // 2) 각 줄의 비율 합이 고르도록 분배한다.
  //    → 마지막 줄에 한 장만 남는 일 없이 모든 줄이 폭을 꽉 채운다.
  const built: { photo: Photo; index: number; w: number }[][] = [];
  if (width > 0 && photos.length > 0) {
    const ratios = photos.map(ratioOf);
    const total = ratios.reduce((a, b) => a + b, 0);
    const rowCount = Math.min(
      photos.length,
      Math.max(1, Math.round(total / (width / targetHeight)))
    );
    const ideal = total / rowCount;

    const groups: number[][] = [];
    let cur: number[] = [];
    let sum = 0;
    ratios.forEach((ratio, i) => {
      // 이 사진을 넣으면 이상적인 합에서 더 멀어지면 줄을 끊는다
      const worseIfAdded = Math.abs(sum + ratio - ideal) > Math.abs(sum - ideal);
      if (cur.length && worseIfAdded && groups.length < rowCount - 1) {
        groups.push(cur);
        cur = [];
        sum = 0;
      }
      cur.push(i);
      sum += ratio;
    });
    if (cur.length) groups.push(cur);

    groups.forEach((idxs) => {
      const rowRatio = idxs.reduce((a, i) => a + ratios[i], 0);
      const h = (width - gap * (idxs.length - 1)) / rowRatio;
      built.push(
        idxs.map((i) => ({ photo: photos[i], index: i, w: ratios[i] * h }))
      );
    });
  }

  return (
    <div ref={containerRef}>
      {built.map((row, ri) => (
        <div
          key={ri}
          className="flex"
          style={{ gap, marginBottom: ri < built.length - 1 ? gap : 0 }}
        >
          {row.map((item) => (
            <div key={item.photo.id} style={{ width: item.w }}>
              {renderTile(item.photo, item.index)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (index: number) => void;
  /**
   * masonry: 세로(열 단위)로 흐름 — Works 아카이브용
   * rows: 가로(왼→오른쪽) 순서로 흐름 — 홈 큐레이션용
   * 두 방식 모두 사진은 원본 비율을 유지한다 (크롭 없음)
   */
  layout?: "masonry" | "rows";
}

export default function PhotoGrid({
  photos,
  onPhotoClick,
  layout = "masonry",
}: PhotoGridProps) {
  const rows = layout === "rows";

  const tile = (photo: Photo, index: number) => (
    <FadeIn>
      <button
        type="button"
        className="block w-full cursor-pointer overflow-hidden bg-neutral-100"
        onClick={() => onPhotoClick?.(index)}
        aria-label={photo.alt}
        // 원본 비율로 자리를 미리 확보 → 크롭 없이, 로딩 중 사진이 밀리지도 않음
        style={
          photo.width && photo.height
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

  if (rows) {
    return (
      <JustifiedRows photos={photos} renderTile={tile} />
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
