export type Category = "interior" | "cafe" | "portrait" | "street";

export interface Photo {
  id: string;
  cloudinaryId: string;
  category: Category;
  alt: string;
  featured: boolean;
  /** 원본 크기 — 로딩 전 자리를 미리 확보해 레이아웃 흔들림을 막는 용도.
   *  rotate가 있으면 회전 후 기준 크기를 넣는다. */
  width?: number;
  height?: number;
  /** 회전 각도 (선택) — 음수는 왼쪽(반시계). 예) -90 */
  rotate?: number;
}

export interface CareerItem {
  title: string;
  /** 날짜·장소 등 부가 정보 (선택) */
  meta?: string;
  /** 관련 링크 (선택) — 있으면 해당 항목이 클릭 가능한 링크로 표시된다 */
  url?: string;
}

export interface CareerGroup {
  /** 그룹명 (예: 전시 / 공모 · 선정 / 협업) */
  group: string;
  items: CareerItem[];
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  career: CareerGroup[];
  instagram: string;
  profileCloudinaryId: string;
}
