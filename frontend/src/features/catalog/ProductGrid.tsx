import type { Product } from '../../types/product';
import ProductCard from '../../components/shared/ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <h3 className="text-2xl font-semibold text-neutral-900">
          Товары не найдены
        </h3>
        <p className="mt-3 text-neutral-600">
          Попробуй изменить фильтры или параметры поиска.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;