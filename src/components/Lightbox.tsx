import YarLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { full } from "../lib/cloudinary";
import type { Photo } from "../types";

interface LightboxProps {
  photos: Photo[];
  index: number; // -1이면 닫힘
  onClose: () => void;
}

export default function Lightbox({ photos, index, onClose }: LightboxProps) {
  return (
    <YarLightbox
      open={index >= 0}
      index={Math.max(index, 0)}
      close={onClose}
      slides={photos.map((photo) => ({
        src: full(photo.cloudinaryId),
        alt: photo.alt,
      }))}
    />
  );
}
