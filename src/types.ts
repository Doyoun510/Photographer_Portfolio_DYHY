export type Category = "interior" | "cafe" | "portrait" | "street";

export interface Photo {
  id: string;
  cloudinaryId: string;
  category: Category;
  alt: string;
  featured: boolean;
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
