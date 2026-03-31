import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const CatalogPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16">
        <PageContainer>
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              Catalog
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">Каталог одежды</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              Здесь будет полный каталог товаров с фильтрацией по категории, размеру,
              стилю, цвету, сезону, цене и сортировкой по популярности, новизне и стоимости.
            </p>
          </div>

          <div className="rounded-3xl border border-dashed border-neutral-300 p-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              Страница каталога в разработке
            </h2>
            <p className="text-neutral-600">
              Следующим этапом сюда добавим фильтры, сортировку и карточки товаров.
            </p>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default CatalogPage;