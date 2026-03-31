import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16">
        <PageContainer>
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            Страница товара
          </h1>

          <div className="rounded-3xl border border-neutral-200 p-8">
            <p className="mb-3 text-lg text-neutral-700">
              ID товара: <span className="font-semibold">{id}</span>
            </p>

            <p className="leading-7 text-neutral-600">
              Здесь позже будет подробная информация о товаре, фотографии,
              размеры, описание, цена и кнопка перехода в виртуальную примерочную.
            </p>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default ProductPage;