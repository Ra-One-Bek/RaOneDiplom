import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { selectedProductStorage } from '../../services/storage/selectedProductStorage';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToFittingRoom = () => {
    selectedProductStorage.addToWardrobe(product);
    window.dispatchEvent(new Event('raone-wardrobe-updated'));
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <button
        type="button"
        onClick={handleAddToFittingRoom}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black text-xl text-white shadow-md transition hover:scale-105 hover:bg-neutral-800"
        aria-label={`Добавить ${product.title} в примерочную`}
        title="Добавить в примерочную"
      >
        +
      </button>

      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="h-80 w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex gap-2">
          {product.isNew && <Badge className="bg-pink-500 text-white">New</Badge>}
          {product.isPopular && (
            <Badge className="bg-black text-white">Popular</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">★ {product.rating}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-neutral-900">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-sm text-neutral-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button fullWidth variant="outline">
              Подробнее
            </Button>
          </Link>

          <button
            type="button"
            onClick={handleAddToFittingRoom}
            className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Добавить
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;