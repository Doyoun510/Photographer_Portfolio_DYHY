export type Category = "interior" | "cafe" | "portrait" | "street";

export interface Photo {
  id: string;
  cloudinaryId: string;
  category: Category;
  alt: string;
  featured: boolean;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  career: string[];
  instagram: string;
  profileCloudinaryId: string;
}
