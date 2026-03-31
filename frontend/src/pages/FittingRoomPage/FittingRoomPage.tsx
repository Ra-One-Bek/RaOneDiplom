import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import {
  selectedProductStorage,
  type FittingOutfit,
} from '../../services/storage/selectedProductStorage';
import { formatPrice } from '../../utils/formatPrice';
import type { FittingSlot, Product } from '../../types/product';
import { getProductSlot, getSlotLabel } from '../../features/fitting-room/fittingRoom.utils';
import { avatarSlotConfig } from '../../features/fitting-room/avatarSlotConfig';
import FittingThumbnailRail from '../../features/fitting-room/FittingThumbnailRail';
import AvatarCanvas from '../../features/fitting-room/AvatarCanvas';

const slotOrder: FittingSlot[] = ['dress', 'top', 'bottom', 'outerwear', 'footwear'];

const FittingRoomPage = () => {
  const [outfit, setOutfit] = useState<FittingOutfit>({});
  const [wardrobe, setWardrobe] = useState<Product[]>([]);
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);

  const refreshData = () => {
    setOutfit(selectedProductStorage.getOutfit());
    setWardrobe(selectedProductStorage.getWardrobe());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const equippedEntries = useMemo(() => {
    return slotOrder.filter((slot) => outfit[slot]);
  }, [outfit]);

  const totalPrice = useMemo(() => {
    return wardrobe.reduce((sum, product) => sum + product.price, 0);
  }, [wardrobe]);

  const handleRemoveSlot = (slot: FittingSlot) => {
    selectedProductStorage.removeBySlot(slot);
    refreshData();
  };

  const handleRemoveFromWardrobe = (productId: number) => {
    const equippedSlots = Object.entries(outfit).filter(
      ([, product]) => product?.id === productId
    );

    equippedSlots.forEach(([slot]) => {
      selectedProductStorage.removeBySlot(slot as FittingSlot);
    });

    selectedProductStorage.removeFromWardrobe(productId);
    refreshData();
  };

  const handleClearAll = () => {
    selectedProductStorage.clearAll();
    setOutfit({});
    setWardrobe([]);
  };

  const handleBuyOutfit = () => {
    if (!wardrobe.length) return;
    alert('Покупка образа пока в разработке. Позже здесь будет оформление заказа.');
  };

  const handleDragStart = (product: Product) => {
    setDraggedProduct(product);
  };

  const handleDropOnSlot = (slot: FittingSlot) => {
    if (!draggedProduct) return;

    const correctSlot = getProductSlot(draggedProduct);

    if (correctSlot !== slot) {
      setDraggedProduct(null);
      return;
    }

    selectedProductStorage.equipProduct(draggedProduct);
    refreshData();
    setDraggedProduct(null);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-16">
        <PageContainer>
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              Virtual Fitting Room
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">
              Примерочная и корзина
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              Сначала добавь товары в примерочную, затем перетащи нужную вещь на
              соответствующую часть тела аватара.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 md:grid-cols-[112px_1fr]">
                <FittingThumbnailRail outfit={outfit} onRemove={handleRemoveSlot} />

                <div className="relative h-[620px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-neutral-50 to-neutral-100">
                  <div className="absolute inset-0">
                    <AvatarCanvas />
                  </div>

                  {avatarSlotConfig.map((item) => {
                    const product = outfit[item.slot];

                    return (
                      <div
                        key={item.slot}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDropOnSlot(item.slot)}
                        className={`absolute z-10 w-[170px] -translate-x-1/2 rounded-2xl border px-3 py-2 text-center text-xs shadow-sm backdrop-blur-sm transition ${
                          product
                            ? 'border-black/20 bg-black/75 text-white'
                            : 'border-dashed border-neutral-300 bg-white/70 text-neutral-600'
                        }`}
                        style={{
                          top: item.top,
                          left: item.left,
                        }}
                      >
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 truncate text-[11px] opacity-90">
                          {product ? product.title : 'Перетащи сюда'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    Мои товары
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Добавлено товаров: {wardrobe.length}
                  </p>
                </div>

                <Button variant="outline" onClick={handleClearAll}>
                  Очистить
                </Button>
              </div>

              {wardrobe.length === 0 && (
                <p className="leading-7 text-neutral-600">
                  Список пуст. Перейдите в каталог и добавьте вещи в примерочную.
                </p>
              )}

              {wardrobe.length > 0 && (
                <>
                  <div className="space-y-4">
                    {wardrobe.map((product) => {
                      const slot = getProductSlot(product);
                      const isEquipped = outfit[slot]?.id === product.id;

                      return (
                        <div
                          key={product.id}
                          draggable
                          onDragStart={() => handleDragStart(product)}
                          className="cursor-grab rounded-2xl border border-neutral-200 p-4 active:cursor-grabbing"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                                {getSlotLabel(slot)}
                              </span>

                              {isEquipped && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  Надето
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemoveFromWardrobe(product.id)}
                              className="text-sm font-medium text-red-500 transition hover:text-red-600"
                            >
                              Убрать
                            </button>
                          </div>

                          <div className="mb-3 overflow-hidden rounded-2xl bg-neutral-100">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-[140px] w-full object-cover"
                            />
                          </div>

                          <h3 className="mb-2 text-base font-semibold text-neutral-900">
                            {product.title}
                          </h3>

                          <p className="mb-3 text-sm leading-6 text-neutral-600">
                            {product.description}
                          </p>

                          <p className="mb-2 font-bold text-neutral-900">
                            {formatPrice(product.price)}
                          </p>

                          <p className="text-xs text-neutral-500">
                            Перетащи карточку на соответствующую зону аватара
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white">
                    <p className="mb-2 text-sm text-neutral-300">
                      Общая стоимость выбранных товаров
                    </p>
                    <p className="mb-5 text-2xl font-bold">
                      {formatPrice(totalPrice)}
                    </p>

                    <Button fullWidth variant="secondary" onClick={handleBuyOutfit}>
                      Купить товары
                    </Button>
                  </div>
                </>
              )}

              {equippedEntries.length > 0 && (
                <div className="mt-6 rounded-2xl border border-neutral-200 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-neutral-900">
                    Надето на аватара
                  </h3>

                  <div className="space-y-2">
                    {equippedEntries.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"
                      >
                        <span className="text-sm font-medium text-neutral-700">
                          {getSlotLabel(slot)}
                        </span>
                        <span className="max-w-[180px] truncate text-sm text-neutral-500">
                          {outfit[slot]?.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default FittingRoomPage;