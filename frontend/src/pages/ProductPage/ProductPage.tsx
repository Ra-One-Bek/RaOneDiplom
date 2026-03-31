import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import { mockProducts } from '../../features/catalog/mockProducts';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { selectedProductStorage } from '../../services/storage/selectedProductStorage';
import { ROUTES } from '../../constants/routes';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === Number(id));
  }, [id]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-neutral-600">Товар не найден</p>
        </main>
        <Footer />
      </>
    );
  }

  const handleTryOn = () => {
    selectedProductStorage.addToWardrobe(product);
    navigate(ROUTES.FITTING_ROOM);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16">
        <PageContainer>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-neutral-500 hover:text-black"
          >
            ← Назад
          </button>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* INFO */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                {product.isNew && (
                  <Badge className="bg-pink-500 text-white">New</Badge>
                )}
                {product.isPopular && (
                  <Badge className="bg-black text-white">Popular</Badge>
                )}
              </div>

              <h1 className="mb-3 text-3xl font-bold text-neutral-900">
                {product.title}
              </h1>

              <p className="mb-4 text-sm text-amber-500">
                ★ {product.rating}
              </p>

              <div className="mb-6 flex items-center gap-4">
                <span className="text-2xl font-bold text-neutral-900">
                  {formatPrice(product.price)}
                </span>

                {product.oldPrice && (
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="mb-6 text-base leading-7 text-neutral-600">
                {product.description}
              </p>

              {/* SIZE */}
              <div className="mb-6">
                <p className="mb-2 font-medium">Размер</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border text-sm ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-neutral-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR */}
              <div className="mb-8">
                <p className="mb-2 font-medium">Цвет</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl border text-sm ${
                        selectedColor === color
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-neutral-300 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button fullWidth onClick={handleTryOn}>
                  В примерочную
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate(ROUTES.CATALOG)}
                >
                  В каталог
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default ProductPage;