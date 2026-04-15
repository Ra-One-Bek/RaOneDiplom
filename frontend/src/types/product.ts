export type ProductCategory =
  | 'dress'
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'footwear'
  | 'accessory';

export type AvatarWearSlot =
  | 'dress'
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'footwear';

export interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;

  category: ProductCategory;
  avatarSlot: AvatarWearSlot | null;

  sizes: string[];
  colors: string[];

  brand?: string;
  material?: string;
  rating?: number;

  isFeatured?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}