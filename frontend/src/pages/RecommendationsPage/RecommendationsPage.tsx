import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const RecommendationsPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16">
        <PageContainer>
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              AI Recommendations
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">
              Персональные рекомендации
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              На этой странице пользователь будет получать рекомендации одежды
              с учетом погоды, предпочтений, цветовых сочетаний и желаемого стиля.
            </p>
          </div>

          <div className="rounded-3xl border border-dashed border-neutral-300 p-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-neutral-900">
              Блок рекомендаций в разработке
            </h2>
            <p className="text-neutral-600">
              Позже сюда добавим подбор образов и советы от ИИ.
            </p>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default RecommendationsPage;