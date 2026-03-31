import { useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import { mockProducts } from '../../features/catalog/mockProducts';
import ProductGrid from '../../features/catalog/ProductGrid';
import CatalogFilters from '../../features/catalog/CatalogFiltersPanel';
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

      <main className="min-h-screen bg-neutral-50 py-16">
        <PageContainer>
          <div className="mb-10">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              Catalog
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">
              Каталог одежды
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              Используйте фильтры и поиск для подбора идеального образа.
            </p>
          </div>

          {/* ФИЛЬТРЫ */}
          <div className="mb-8">
            <CatalogFilters filters={filters} onChange={setFilters} />
          </div>

          {/* РЕЗУЛЬТАТЫ */}
          <ProductGrid products={filteredProducts} />
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default CatalogPage;