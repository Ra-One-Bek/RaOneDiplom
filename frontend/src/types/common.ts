export type GenderCategory = 'male' | 'female';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export type SortOption =
  | 'popular'
  | 'price-asc'
  | 'price-desc'
  | 'newest';

export interface NavItem {
  label: string;
  path: string;
}

export interface SelectOption {
  label: string;
  value: string;
}