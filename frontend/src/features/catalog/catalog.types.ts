import type { ProductCategory, ProductType } from '../../types/product';
import type { SortOption } from '../../types/common';

export interface CatalogFilters {
  search: string;
  category: ProductCategory | 'all';
  type: ProductType | 'all';
  sort: SortOption;
}