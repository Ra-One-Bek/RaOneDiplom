import type { Product } from '../../types/product';
import type { CatalogFilters } from './catalog.types';

export const applyFilters = (
  products: Product[],
  filters: CatalogFilters
): Product[] => {
  let result = [...products];

  // поиск
  if (filters.search) {
    result = result.filter((p) =>
      p.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  // категория
  if (filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  // тип
  if (filters.type !== 'all') {
    result = result.filter((p) => p.type === filters.type);
  }

  // сортировка
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result = result.filter((p) => p.isNew);
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.rating - a.rating);
      break;
  }

  return result;
};