export type ProductCategory = 'male' | 'female';

export type ProductType =
  | 'tshirt'
  | 'shirt'
  | 'hoodie'
  | 'jacket'
  | 'jeans'
  | 'pants'
  | 'dress'
  | 'skirt'
  | 'sneakers'
  | 'shoes';

export type FittingSlot =
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'footwear'
  | 'dress';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: ProductCategory;
  type: ProductType;
  sizes: string[];
  colors: string[];
  rating: number;
  isNew?: boolean;
  isPopular?: boolean;
}