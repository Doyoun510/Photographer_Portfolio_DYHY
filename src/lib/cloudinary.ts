const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const USE_PLACEHOLDER = import.meta.env.VITE_USE_PLACEHOLDER === "true";

const BASE = `https://res.cloudinary.com/${CLOUD_NAME ?? ""}/image/upload`;

// 플레이스홀더용: id에서 결정적으로 세로/가로 비율을 뽑아 masonry가 자연스럽게 보이게 한다
const RATIOS = [4 / 3, 3 / 2, 1, 5 / 4, 2 / 3, 3 / 4];
const hash = (s: string) =>
  Math.abs([...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0));
const dims = (id: string, w: number) => ({
  w,
  h: Math.round(w * RATIOS[hash(id) % RATIOS.length]),
});
const placeholder = (id: string, w: number) => {
  const { h } = dims(id, w);
  const seed = id.replace(/[^a-zA-Z0-9]+/g, "-");
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

/** 플레이스홀더 로드 실패 시 사용할 동일 비율의 회색 SVG (오프라인 대응) */
export const fallbackFor = (id: string, w: number) => {
  const { h } = dims(id, w);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e5e5e5"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// 그리드 썸네일 — 사진작가 PR 페이지라 화질 우선. 레티나에서도 선명하도록 1200px
export const thumb = (id: string) =>
  USE_PLACEHOLDER ? placeholder(id, 1200) : `${BASE}/f_auto,q_auto,w_1200/${id}`;

// About 프로필 사진 전용 — 크게 보이는 자리라 2000px
export const profile = (id: string) =>
  USE_PLACEHOLDER ? placeholder(id, 2000) : `${BASE}/f_auto,q_auto,w_2000/${id}`;

export const full = (id: string) =>
  USE_PLACEHOLDER ? placeholder(id, 1600) : `${BASE}/f_auto,q_auto,w_2000/${id}`;

// 메인 히어로 자동 슬라이드 — 풀스크린으로 크게 깔리는 사진이라 2000px
export const hero = (id: string) =>
  USE_PLACEHOLDER ? placeholder(id, 2000) : `${BASE}/f_auto,q_auto,w_2000/${id}`;
