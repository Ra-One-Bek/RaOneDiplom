import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const FittingRoomPage = () => {
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
              Виртуальная примерочная
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              На этой странице пользователь будет примерять одежду на своего
              персонального 3D-аватара и собирать готовый образ.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8">
              <p className="text-center text-lg text-neutral-500">
                Здесь позже будет 3D-сцена с аватаром
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                Панель образа
              </h2>
              <p className="leading-7 text-neutral-600">
                Здесь будут выбранные элементы одежды, параметры аватара,
                переключение категорий и действия примерки.
              </p>
            </div>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default FittingRoomPage;