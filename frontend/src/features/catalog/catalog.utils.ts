import type { Product } from '../../types/product';
import type { CatalogFilters } from './catalog.types';

export const applyFilters = (
  products: Product[],
  filters: CatalogFilters
): Product[] => {
  let result = [...products];

  if (filters.search) {
    result = result.filter((p) =>
      p.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.type !== 'all') {
    result = result.filter((p) => p.type === filters.type);
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result = result.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.rating - a.rating);
      break;
  }

  return result;
};