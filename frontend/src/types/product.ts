export type ProductCategory = 'male' | 'female';

export type ProductType =
  | 'tshirt'
  | 'shirt'
  | 'jacket'
  | 'pants'
  | 'skirt'
  | 'dress'
  | 'shoes'
  | 'sneakers';

export type AvatarWearSlot =
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'dress'
  | 'footwear';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;

  category: ProductCategory;
  type: ProductType;
  avatarSlot: AvatarWearSlot;

  sizes: string[];
  colors: string[];
  rating: number;

  isNew?: boolean;
  isPopular?: boolean;
}