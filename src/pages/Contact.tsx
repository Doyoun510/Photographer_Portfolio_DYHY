import { useState } from "react";
import artistsData from "../data/artists.json";
import site from "../data/site.json";
import type { Artist } from "../types";

const artists = artistsData as Artist[];

// URL 끝 슬래시 제거 후 비교 / 핸들(@아이디) 추출
const normalize = (url: string) => url.replace(/\/+$/, "");
const handle = (url: string) => "@" + normalize(url).split("/").pop();

// 대표(스튜디오) 계정과 개별 작가 계정 분리
const mainInsta = site.instagram;
const otherArtists = artists.filter(
  (a) => normalize(a.instagram) !== normalize(mainInsta)
);

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

      {/* 메인 소통 창구 — 스튜디오 대표 인스타 DM */}
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-400">
        메인 소통 창구
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        가장 빠른 연락은 스튜디오 인스타그램 DM으로 주세요
      </p>
      <a
        href={mainInsta}
        target="_blank"
        rel="noreferrer"
        className={`${pill} mt-5 border-neutral-900 bg-neutral-900 px-8 text-base text-white hover:bg-neutral-700`}
      >
        {handle(mainInsta)} 으로 DM 보내기 →
      </a>

      {/* 작가 개별 문의 */}
      {otherArtists.length > 0 && (
        <>
          <p className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-400">
            작가 개별 문의
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {otherArtists.map((artist) => (
              <a
                key={artist.id}
                href={artist.instagram}
                target="_blank"
                rel="noreferrer"
                className={`${pill} border-neutral-300 text-neutral-700 hover:border-neutral-500`}
              >
                {artist.name} · {handle(artist.instagram)} →
              </a>
            ))}
          </div>
        </>
      )}

      {/* 카카오톡 · 이메일 (클릭 시 복사) */}
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-neutral-400">
        또는 복사해서 연락
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
