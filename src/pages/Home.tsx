import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import PhotoGrid from "../components/PhotoGrid";
import photosData from "../data/photos.json";
import type { Photo } from "../types";

const photos = photosData as Photo[];

export default function Home() {
  const navigate = useNavigate();
  const featured = photos.filter((photo) => photo.featured);

  return (
    <>
      <Hero photos={featured} />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="mb-10 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Selected Works
        </h2>
        <PhotoGrid
          photos={featured}
          onPhotoClick={() => navigate("/works")}
          layout="rows"
        />
        <div className="mt-12 text-center">
          <Link
            to="/works"
            className="inline-block border-b border-neutral-800 pb-1 text-sm tracking-wide transition-opacity hover:opacity-60"
          >
            View all works →
          </Link>
        </div>
      </section>
    </>
  );
}
