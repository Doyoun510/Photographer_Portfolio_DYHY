import { useEffect, useState } from "react";
import { fallbackFor, hero } from "../lib/cloudinary";
import site from "../data/site.json";
import type { Photo } from "../types";

export default function Hero({ photos }: { photos: Photo[] }) {
  const slides = photos.slice(0, 4);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(
      () => setCurrent((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-svh w-full overflow-hidden">
      {slides.map((photo, i) => (
        <img
          key={photo.id}
          src={hero(photo.cloudinaryId, photo.rotate)}
          alt={photo.alt}
          loading={i === 0 ? "eager" : "lazy"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackFor(photo.cloudinaryId, 1600);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div className="absolute bottom-12 left-6 text-white md:left-12">
        <h1 className="text-4xl font-semibold tracking-[0.35em] md:text-6xl">
          DYHY
        </h1>
        <p className="mt-4 text-sm tracking-wide text-white/90 md:text-base">
          {site.tagline}
        </p>
      </div>
    </section>
  );
}
