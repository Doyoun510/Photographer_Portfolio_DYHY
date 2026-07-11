import { useState } from "react";
import artistsData from "../data/artists.json";
import site from "../data/site.json";
import type { Artist } from "../types";

const artists = artistsData as Artist[];

// URL 끝 슬래시 제거 후 비교 / 핸들(@아이디) 추출
const normalize = (url: string) => url.replace(/\/+$/, "");
const handle = (url: string) => "@" + normalize(url).split("/").pop();

// 대표(스튜디오) 계정 — 이 계정 버튼만 검은색으로 강조
const mainInsta = site.instagram;

export default function Contact() {
  // 복사된 항목의 key를 저장 (kakao / email)
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    let ok = false;
    // 1) 최신 Clipboard API
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // 2) 인앱 브라우저(인스타·카톡) 대응 폴백
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const pill =
    "rounded-full border px-6 py-3 text-sm tracking-wide transition-colors";

  return (
    <section className="mx-auto flex min-h-[60svh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
        {site.contactHeadline}
      </h1>
      <p className="mt-6 text-neutral-500">{site.contactSub}</p>

      {/* 작가 인스타 문의 — 두 계정 가로 배치, 대표 계정만 검은색 강조 */}
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-400">
        작가 인스타 문의
      </p>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {artists.map((artist) => {
          const isMain = normalize(artist.instagram) === normalize(mainInsta);
          return (
            <a
              key={artist.id}
              href={artist.instagram}
              target="_blank"
              rel="noreferrer"
              className={`${pill} ${
                isMain
                  ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
              }`}
            >
              {artist.name} · {handle(artist.instagram)} →
            </a>
          );
        })}
      </div>

      {/* 카카오톡 · 이메일 (클릭 시 복사) */}
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-400">
        카카오톡, 이메일 연락 (클릭 시 복사)
      </p>
      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => copy("kakao", site.kakaoId)}
          className={`${pill} border-neutral-200 text-neutral-600 hover:border-neutral-400`}
        >
          {copied === "kakao"
            ? "카카오 아이디 복사됨 ✓"
            : `카카오톡 ID  ${site.kakaoId}`}
        </button>
        <button
          type="button"
          onClick={() => copy("email", site.email)}
          className={`${pill} border-neutral-200 text-neutral-600 hover:border-neutral-400`}
        >
          {copied === "email" ? "이메일 복사됨 ✓" : site.email}
        </button>
      </div>
    </section>
  );
}
