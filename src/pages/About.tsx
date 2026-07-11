import { fallbackFor, thumb } from "../lib/cloudinary";
import artistsData from "../data/artists.json";
import type { Artist } from "../types";

const artists = artistsData as Artist[];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <h1 className="mb-12 text-2xl font-semibold tracking-[0.2em]">About</h1>

      <div className="space-y-20 md:space-y-28">
        {artists.map((artist, index) => (
          <article
            key={artist.id}
            className={`flex flex-col gap-8 md:items-center md:gap-14 ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="md:w-1/2">
              <img
                src={thumb(artist.profileCloudinaryId)}
                alt={`${artist.name} 프로필 사진`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackFor(artist.profileCloudinaryId, 600);
                }}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold">{artist.name}</h2>
              <p className="mt-1 text-sm text-neutral-500">{artist.role}</p>
              {artist.bio && (
                <p className="mt-6 leading-relaxed text-neutral-800">
                  {artist.bio}
                </p>
              )}
              <div className="mt-8 space-y-6">
                {artist.career.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                      {group.group}
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item.title}>
                          <p className="text-sm leading-snug text-neutral-700">
                            {item.title}
                          </p>
                          {item.meta && (
                            <p className="mt-0.5 text-xs text-neutral-400">
                              {item.meta}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <a
                href={artist.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block border-b border-neutral-800 pb-0.5 text-sm tracking-wide transition-opacity hover:opacity-60"
              >
                Instagram →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
