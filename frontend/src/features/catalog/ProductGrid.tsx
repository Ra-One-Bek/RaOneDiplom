import type { Product } from '../../types/product';
import ProductCard from '../../components/shared/ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <h3 className="mb-3 text-2xl font-semibold text-neutral-900">
          Товары не найдены
        </h3>
        <p className="text-neutral-600">
          Попробуй изменить фильтры или параметры поиска.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;