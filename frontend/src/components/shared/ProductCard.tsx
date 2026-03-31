import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { selectedProductStorage } from '../../services/storage/selectedProductStorage';
import { ROUTES } from '../../constants/routes';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleTryOn = () => {
    selectedProductStorage.addToWardrobe(product);
    navigate(ROUTES.FITTING_ROOM);
    };

  return (
    <div className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-[240px] overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew && <Badge className="bg-pink-500 text-white">New</Badge>}
          {product.isPopular && (
            <Badge className="bg-black text-white">Popular</Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-neutral-900">
            {product.title}
          </h3>
          <span className="shrink-0 text-xs font-medium text-amber-500">
            ★ {product.rating}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm leading-5 text-neutral-600">
          {product.description}
        </p>

        <div className="mb-3 flex items-center gap-3">
          <span className="text-base font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {product.sizes.slice(0, 3).map((size) => (
            <span
              key={size}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button fullWidth variant="outline" className="px-3 py-2 text-xs">
              Подробнее
            </Button>
          </Link>

          <div className="flex-1">
            <Button fullWidth onClick={handleTryOn} className="px-3 py-2 text-xs">
              В примерочную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;