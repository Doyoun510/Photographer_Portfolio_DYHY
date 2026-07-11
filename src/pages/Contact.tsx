import artistsData from "../data/artists.json";
import site from "../data/site.json";
import type { Artist } from "../types";

const artists = artistsData as Artist[];

export default function Contact() {
  return (
    <section className="mx-auto flex min-h-[60svh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
        {site.contactHeadline}
      </h1>
      <p className="mt-6 text-neutral-500">{site.contactSub}</p>

      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
        {artists.map((artist) => (
          <a
            key={artist.id}
            href={artist.instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-neutral-800 px-6 py-3 text-sm tracking-wide transition-colors hover:bg-neutral-800 hover:text-white"
          >
            {artist.name} Instagram DM
          </a>
        ))}
        <a
          href={`mailto:${site.email}`}
          className="rounded-full border border-neutral-200 px-6 py-3 text-sm tracking-wide text-neutral-500 transition-colors hover:border-neutral-400"
        >
          Email
        </a>
      </div>
    </section>
  );
}
