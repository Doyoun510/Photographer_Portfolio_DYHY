export type Category = "interior" | "cafe" | "portrait" | "street";

export interface Photo {
  id: string;
  cloudinaryId: string;
  category: Category;
  alt: string;
  featured: boolean;
  /** 원본 크기 — 로딩 전 자리를 미리 확보해 레이아웃 흔들림을 막는 용도 */
  width?: number;
  height?: number;
}

export interface CareerItem {
  title: string;
  /** 날짜·장소 등 부가 정보 (선택) */
  meta?: string;
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
