import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import AvatarCanvas from '../../features/fitting-room/AvatarCanvas';
import { selectedProductStorage, type FittingOutfit } from '../../services/storage/selectedProductStorage';
import type { Product, AvatarWearSlot } from '../../types/product';

const slotLabels: Record<AvatarWearSlot, string> = {
  dress: 'Платье',
  top: 'Верх',
  bottom: 'Низ',
  outerwear: 'Верхняя одежда',
  footwear: 'Обувь',
};

const FittingRoomPage = () => {
  const { user } = useAuth();

  const [wardrobe, setWardrobe] = useState<Product[]>([]);
  const [outfit, setOutfit] = useState<FittingOutfit>({});

  const reloadState = () => {
    setWardrobe(selectedProductStorage.getWardrobe());
    setOutfit(selectedProductStorage.getOutfit());
  };

  useEffect(() => {
    reloadState();
  }, []);

  const wardrobeBySlot = useMemo(() => {
    return {
      dress: wardrobe.filter((item) => item.avatarSlot === 'dress'),
      top: wardrobe.filter((item) => item.avatarSlot === 'top'),
      bottom: wardrobe.filter((item) => item.avatarSlot === 'bottom'),
      outerwear: wardrobe.filter((item) => item.avatarSlot === 'outerwear'),
      footwear: wardrobe.filter((item) => item.avatarSlot === 'footwear'),
    };
  }, [wardrobe]);

  const handleWear = (product: Product) => {
    selectedProductStorage.wearProduct(product);
    reloadState();
  };

  const handleRemoveFromSlot = (slot: AvatarWearSlot) => {
    selectedProductStorage.unwearSlot(slot);
    reloadState();
  };

  const handleRemoveFromWardrobe = (productId: string | number) => {
    selectedProductStorage.removeFromWardrobe(String(productId));
    reloadState();
  };

  const handleClearOutfit = () => {
    selectedProductStorage.clearOutfit();
    reloadState();
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

      <main className="min-h-screen bg-neutral-100 py-10">
        <PageContainer>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-neutral-900">
                    Виртуальная примерочная
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Выбирайте одежду из своего гардероба и примеряйте её на
                    созданного аватара.
                  </p>
                </div>

                <Button variant="secondary" onClick={handleClearOutfit}>
                  Очистить образ
                </Button>
              </div>

              <div className="h-[620px] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
                <AvatarCanvas
                  avatarProfile={user.avatarProfile}
                  outfit={outfit}
                />
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Надетые вещи
                </h2>

                <div className="mt-4 space-y-3">
                  {(Object.keys(slotLabels) as AvatarWearSlot[]).map((slot) => {
                    const item = outfit[slot];

                    return (
                      <div
                        key={slot}
                        className="rounded-2xl border border-neutral-200 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-neutral-500">
                              {slotLabels[slot]}
                            </p>
                            <p className="mt-1 text-sm font-medium text-neutral-900">
                              {item ? item.title : 'Ничего не выбрано'}
                            </p>
                          </div>

                          {item && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFromSlot(slot)}
                              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
                            >
                              Снять
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Гардероб пользователя
                </h2>

                {wardrobe.length === 0 ? (
                  <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    В гардеробе пока нет товаров. Добавьте одежду из каталога.
                  </div>
                ) : (
                  <div className="mt-4 space-y-5">
                    {(Object.keys(wardrobeBySlot) as AvatarWearSlot[]).map((slot) => {
                      const items = wardrobeBySlot[slot];

                      if (items.length === 0) return null;

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
                                  className="rounded-2xl border border-neutral-200 p-4"
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
                                        <Button
                                          size="sm"
                                          onClick={() => handleWear(item)}
                                          disabled={isWorn}
                                        >
                                          {isWorn ? 'Уже надето' : 'Надеть'}
                                        </Button>

                                        <button
                                          type="button"
                                          onClick={() => handleRemoveFromWardrobe(item.id)}
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
              </section>
            </aside>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default FittingRoomPage;