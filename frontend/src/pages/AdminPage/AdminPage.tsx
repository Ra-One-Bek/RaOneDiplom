import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const AdminPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-16">
        <PageContainer>
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              Admin Panel
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">
              Панель администратора
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              Здесь администратор сможет добавлять, редактировать и удалять товары.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="leading-7 text-neutral-600">
              Позже сюда добавим форму добавления товара, загрузку изображений,
              описание, цену, размеры, категорию и управление каталогом.
            </p>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default AdminPage;