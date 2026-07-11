import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterChips from "../components/FilterChips";
import PhotoGrid from "../components/PhotoGrid";
import Lightbox from "../components/Lightbox";
import photosData from "../data/photos.json";
import type { Category, Photo } from "../types";

const photos = photosData as Photo[];
const CATEGORIES: Category[] = ["interior", "cafe", "portrait", "street"];

export default function Works() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const param = searchParams.get("c");
  const category: Category | null = CATEGORIES.includes(param as Category)
    ? (param as Category)
    : null;

  const filtered = category
    ? photos.filter((photo) => photo.category === category)
    : photos;

  const handleFilterChange = (next: Category | null) => {
    setSearchParams(next ? { c: next } : {});
    setLightboxIndex(-1);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-[0.2em]">Works</h1>
      <div className="mb-10">
        <FilterChips value={category} onChange={handleFilterChange} />
      </div>
      <PhotoGrid photos={filtered} onPhotoClick={setLightboxIndex} />
      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
      />
    </section>
  );
}
