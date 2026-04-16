import { useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import { mockProducts } from '../../features/catalog/mockProducts';
import ProductGrid from '../../features/catalog/ProductGrid';
import CatalogFiltersPanel from '../../features/catalog/CatalogFiltersPanel';
import { applyFilters } from '../../features/catalog/catalog.utils';
import type { CatalogFilters as Filters } from '../../features/catalog/catalog.types';

const CatalogPage = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    type: 'all',
    sort: 'popular',
  });

  const filteredProducts = useMemo(() => {
    return applyFilters(mockProducts, filters);
  }, [filters]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-10">
        <PageContainer>
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
              Catalog
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
              Каталог одежды
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Используйте фильтры и поиск для подбора образа. Быстрое добавление
              в примерочную работает по кнопке “+” на карточке товара.
            </p>
          </div>

          <div className="space-y-6">
            <CatalogFiltersPanel filters={filters} onChange={setFilters} />
            <ProductGrid products={filteredProducts} />
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default CatalogPage;