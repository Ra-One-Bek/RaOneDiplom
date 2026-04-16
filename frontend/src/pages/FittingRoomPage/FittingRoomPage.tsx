import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import AvatarCanvas from '../../features/fitting-room/AvatarCanvas';
import {
  selectedProductStorage,
  type FittingOutfit,
} from '../../services/storage/selectedProductStorage';
import type { Product, AvatarWearSlot } from '../../types/product';

const slotLabels: Record<AvatarWearSlot, string> = {
  top: 'Верх',
  bottom: 'Низ',
  outerwear: 'Верхняя одежда',
  dress: 'Платье',
  footwear: 'Обувь',
};

const DRAG_PRODUCT_KEY = 'raone-drag-product-id';

type MobileBottomSheetState = 'collapsed' | 'expanded';

const FittingRoomPage = () => {
  const { user } = useAuth();

  const [wardrobe, setWardrobe] = useState<Product[]>([]);
  const [outfit, setOutfit] = useState<FittingOutfit>({});
  const [isAvatarDropActive, setIsAvatarDropActive] = useState(false);

  const [mobileBottomSheetState, setMobileBottomSheetState] =
    useState<MobileBottomSheetState>('collapsed');
  const [isMobileOutfitOpen, setIsMobileOutfitOpen] = useState(false);

  const reloadState = () => {
    setWardrobe(selectedProductStorage.getWardrobe());
    setOutfit(selectedProductStorage.getOutfit());
  };

  useEffect(() => {
    reloadState();

    const handleWardrobeUpdate = () => {
      reloadState();
    };

    window.addEventListener('raone-wardrobe-updated', handleWardrobeUpdate);

    return () => {
      window.removeEventListener('raone-wardrobe-updated', handleWardrobeUpdate);
    };
  }, []);

  const wardrobeBySlot = useMemo(() => {
    return {
      top: wardrobe.filter((item) => item.avatarSlot === 'top'),
      bottom: wardrobe.filter((item) => item.avatarSlot === 'bottom'),
      outerwear: wardrobe.filter((item) => item.avatarSlot === 'outerwear'),
      dress: wardrobe.filter((item) => item.avatarSlot === 'dress'),
      footwear: wardrobe.filter((item) => item.avatarSlot === 'footwear'),
    };
  }, [wardrobe]);

  const outfitEntries = useMemo(() => {
    return (Object.keys(slotLabels) as AvatarWearSlot[]).map((slot) => ({
      slot,
      label: slotLabels[slot],
      item: outfit[slot],
    }));
  }, [outfit]);

  const wornCount = useMemo(() => {
    return outfitEntries.filter((entry) => Boolean(entry.item)).length;
  }, [outfitEntries]);

  const handleRemoveFromSlot = (slot: AvatarWearSlot) => {
    selectedProductStorage.unwearSlot(slot);
    reloadState();
  };

  const handleRemoveFromWardrobe = (productId: number) => {
    selectedProductStorage.removeFromWardrobe(productId);
    reloadState();
  };

  const handleClearOutfit = () => {
    selectedProductStorage.clearOutfit();
    reloadState();
  };

  const handleWear = (product: Product) => {
    selectedProductStorage.wearProduct(product);
    reloadState();
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    product: Product
  ) => {
    event.dataTransfer.setData(DRAG_PRODUCT_KEY, String(product.id));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAvatarDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsAvatarDropActive(true);
  };

  const handleAvatarDragLeave = () => {
    setIsAvatarDropActive(false);
  };

  const handleAvatarDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsAvatarDropActive(false);

    const productId = event.dataTransfer.getData(DRAG_PRODUCT_KEY);

    if (!productId) return;

    const product = wardrobe.find(
      (item) => String(item.id) === String(productId)
    );

    if (!product) return;

    selectedProductStorage.wearProduct(product);
    reloadState();
  };

  const toggleMobileBottomSheet = () => {
    setMobileBottomSheetState((prev) =>
      prev === 'collapsed' ? 'expanded' : 'collapsed'
    );
  };

  const closeMobileBottomSheet = () => {
    setMobileBottomSheetState('collapsed');
  };

  const toggleMobileOutfitPanel = () => {
    setIsMobileOutfitOpen((prev) => !prev);
  };

  const closeMobileOutfitPanel = () => {
    setIsMobileOutfitOpen(false);
  };

  if (!user?.avatarConfigured || !user.avatarProfile) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-neutral-100 py-12">
          <PageContainer>
            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
              <h1 className="text-3xl font-semibold text-neutral-900">
                Сначала создайте аватар
              </h1>

              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Чтобы пользоваться виртуальной примерочной, сначала настройте
                внешний вид своего аватара.
              </p>

              <div className="mt-8">
                <Link to={ROUTES.AVATAR_SETUP}>
                  <Button>Перейти к созданию аватара</Button>
                </Link>
              </div>
            </div>
          </PageContainer>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* DESKTOP / TABLET */}
      <main className="hidden min-h-screen bg-neutral-100 py-10 lg:block">
        <PageContainer>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">
                Виртуальная примерочная
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                Перетаскивайте вещи из правой колонки на аватар. Слева отображаются
                надетые слоты, справа — корзина пользователя.
              </p>
            </div>

            <Button variant="secondary" onClick={handleClearOutfit}>
              Очистить образ
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900">
                Надетые вещи
              </h2>

              <div className="mt-4 space-y-3 sticky top-30">
                {outfitEntries.map(({ slot, label, item }) => (
                  <div
                    key={slot}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-neutral-500">
                      {label}
                    </p>

                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {item ? item.title : 'Ничего не надето'}
                    </p>

                    {item && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFromSlot(slot)}
                        className="mt-3 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
                      >
                        Снять
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div
                onDragOver={handleAvatarDragOver}
                onDragLeave={handleAvatarDragLeave}
                onDrop={handleAvatarDrop}
                className={`relative sticky top-30 h-[700px] overflow-hidden rounded-3xl border bg-neutral-50 transition ${
                  isAvatarDropActive
                    ? 'border-black ring-2 ring-black/20'
                    : 'border-neutral-200'
                }`}
              >
                <AvatarCanvas avatarProfile={user.avatarProfile} outfit={outfit} />

                <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 px-4 py-3 text-center text-sm text-neutral-700 shadow-sm backdrop-blur">
                  Перетащите вещь из корзины на аватар
                </div>
              </div>
            </section>

            <aside className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900">
                Корзина пользователя
              </h2>

              {wardrobe.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  Здесь появятся товары после нажатия “+” или “Добавить” в каталоге.
                </div>
              ) : (
                <div className="mt-4 space-y-5">
                  {(Object.keys(wardrobeBySlot) as AvatarWearSlot[]).map((slot) => {
                    const items = wardrobeBySlot[slot];

                    if (!items.length) return null;

                    return (
                      <div key={slot}>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                          {slotLabels[slot]}
                        </h3>

                        <div className="space-y-3">
                          {items.map((item) => {
                            const isWorn = outfit[slot]?.id === item.id;

                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(event) => handleDragStart(event, item)}
                                className={`cursor-grab rounded-2xl border p-4 active:cursor-grabbing ${
                                  isWorn
                                    ? 'border-black bg-neutral-50'
                                    : 'border-neutral-200 bg-white'
                                }`}
                              >
                                <div className="flex gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-20 w-16 rounded-xl object-cover"
                                  />

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-neutral-900">
                                      {item.title}
                                    </p>

                                    <p className="mt-1 text-sm text-neutral-600">
                                      {item.price.toLocaleString('ru-RU')} ₸
                                    </p>

                                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                                      {item.description}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <span className="rounded-xl bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
                                        {isWorn
                                          ? 'Уже надето'
                                          : 'Перетащите на аватар'}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveFromWardrobe(item.id)
                                        }
                                        className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
                                      >
                                        Удалить
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        </PageContainer>
      </main>

      {/* MOBILE */}
      <main className="lg:hidden">
        <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-neutral-100">
          <div className="absolute inset-0">
            <div className="h-full w-full bg-white">
              <AvatarCanvas avatarProfile={user.avatarProfile} outfit={outfit} />
            </div>
          </div>

          <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3">
            <div className="pointer-events-auto max-w-[70%] rounded-2xl bg-white/92 px-4 py-3 shadow-sm backdrop-blur">
              <h1 className="text-lg font-semibold text-neutral-900">
                Примерочная
              </h1>
              <p className="mt-1 text-xs leading-5 text-neutral-600">
                Аватар на весь экран. Открывайте панели только когда они нужны.
              </p>
            </div>

            <div className="pointer-events-auto">
              <Button variant="secondary" size="sm" onClick={handleClearOutfit}>
                Очистить
              </Button>
            </div>
          </div>

          {/* Floating buttons */}
          <div className="absolute bottom-28 left-4 z-20 flex flex-col gap-3">
            <button
              type="button"
              onClick={toggleMobileOutfitPanel}
              className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white shadow-lg"
            >
              Надето ({wornCount})
            </button>
          </div>

          <div className="absolute bottom-28 right-4 z-20">
            <button
              type="button"
              onClick={toggleMobileBottomSheet}
              className="rounded-full bg-white px-4 py-3 text-sm font-medium text-neutral-900 shadow-lg"
            >
              Корзина ({wardrobe.length})
            </button>
          </div>

          {/* Right floating outfit panel */}
          {isMobileOutfitOpen && (
            <>
              <div
                className="fixed inset-0 z-30 bg-black/20"
                onClick={closeMobileOutfitPanel}
              />

              <aside className="fixed bottom-0 right-0 top-0 z-40 w-[82vw] max-w-[320px] bg-white shadow-2xl">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                    <div>
                      <h2 className="text-base font-semibold text-neutral-900">
                        Надетые вещи
                      </h2>
                      <p className="mt-1 text-xs text-neutral-500">
                        Управление текущим образом
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeMobileOutfitPanel}
                      className="rounded-full border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-3">
                      {outfitEntries.map(({ slot, label, item }) => (
                        <div
                          key={slot}
                          className="rounded-2xl border border-neutral-200 p-4"
                        >
                          <p className="text-xs uppercase tracking-wide text-neutral-500">
                            {label}
                          </p>

                          <p className="mt-1 text-sm font-medium text-neutral-900">
                            {item ? item.title : 'Ничего не надето'}
                          </p>

                          {item && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFromSlot(slot)}
                              className="mt-3 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
                            >
                              Снять
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </>
          )}

          {/* Bottom wardrobe sheet */}
          <div
            className="fixed inset-x-0 bottom-0 z-40 rounded-t-[28px] bg-white shadow-[0_-10px_35px_rgba(0,0,0,0.12)] transition-transform duration-300"
            style={{
              height: '72vh',
              transform:
                mobileBottomSheetState === 'expanded'
                  ? 'translateY(0)'
                  : 'translateY(calc(100% - 88px))',
            }}
          >
            <div className="flex h-full flex-col">
              <button
                type="button"
                onClick={toggleMobileBottomSheet}
                className="flex w-full flex-col items-center rounded-t-[28px] px-4 pb-4 pt-3"
              >
                <span className="h-1.5 w-16 rounded-full bg-neutral-300" />
                <div className="mt-3 flex w-full items-center justify-between">
                  <div className="text-left">
                    <h2 className="text-base font-semibold text-neutral-900">
                      Корзина пользователя
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      {mobileBottomSheetState === 'expanded'
                        ? 'Свернуть'
                        : 'Нажмите, чтобы открыть'}
                    </p>
                  </div>

                  <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                    {wardrobe.length} шт.
                  </div>
                </div>
              </button>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                {wardrobe.length === 0 ? (
                  <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    Здесь появятся товары после нажатия “+” или “Добавить” в каталоге.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(Object.keys(wardrobeBySlot) as AvatarWearSlot[]).map((slot) => {
                      const items = wardrobeBySlot[slot];

                      if (!items.length) return null;

                      return (
                        <div key={slot}>
                          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            {slotLabels[slot]}
                          </h3>

                          <div className="space-y-3">
                            {items.map((item) => {
                              const isWorn = outfit[slot]?.id === item.id;

                              return (
                                <div
                                  key={item.id}
                                  className={`rounded-2xl border p-3 ${
                                    isWorn
                                      ? 'border-black bg-neutral-50'
                                      : 'border-neutral-200 bg-white'
                                  }`}
                                >
                                  <div className="flex gap-3">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="h-20 w-16 rounded-xl object-cover"
                                    />

                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-neutral-900">
                                        {item.title}
                                      </p>

                                      <p className="mt-1 text-sm text-neutral-600">
                                        {item.price.toLocaleString('ru-RU')} ₸
                                      </p>

                                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                                        {item.description}
                                      </p>

                                      <div className="mt-3 flex flex-wrap gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleWear(item)}
                                          disabled={isWorn}
                                        >
                                          {isWorn ? 'Надето' : 'Надеть'}
                                        </Button>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveFromWardrobe(item.id)
                                          }
                                          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {mobileBottomSheetState === 'expanded' && (
                <div className="border-t border-neutral-200 px-4 py-3">
                  <Button fullWidth variant="secondary" onClick={closeMobileBottomSheet}>
                    Скрыть корзину
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FittingRoomPage;