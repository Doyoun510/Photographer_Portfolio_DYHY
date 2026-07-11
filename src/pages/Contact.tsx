import { useState } from "react";
import artistsData from "../data/artists.json";
import site from "../data/site.json";
import type { Artist } from "../types";

const artists = artistsData as Artist[];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyKakao = async () => {
    try {
      await navigator.clipboard.writeText(site.kakaoId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 접근 불가 시 조용히 무시 */
    }
  };

  return (
    <section className="mx-auto flex min-h-[60svh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
        {site.contactHeadline}
      </h1>
      <p className="mt-6 text-neutral-500">{site.contactSub}</p>

      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        {artists.map((artist) => (
          <a
            key={artist.id}
            href={artist.instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-neutral-800 px-6 py-3 text-sm tracking-wide transition-colors hover:bg-neutral-800 hover:text-white"
          >
            {artist.name} Instagram
          </a>
        ))}
        <button
          type="button"
          onClick={copyKakao}
          className="rounded-full border border-neutral-200 px-6 py-3 text-sm tracking-wide text-neutral-500 transition-colors hover:border-neutral-400"
        >
          {copied ? "아이디 복사됨 ✓" : `KakaoTalk ID ${site.kakaoId}`}
        </button>
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
