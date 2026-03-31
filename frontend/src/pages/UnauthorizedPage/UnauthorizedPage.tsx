import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const UnauthorizedPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-20">
        <PageContainer>
          <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 p-10 text-center">
            <h1 className="mb-4 text-4xl font-bold text-neutral-900">
              Доступ запрещен
            </h1>
            <p className="mb-6 leading-7 text-neutral-600">
              У вас нет прав для просмотра этой страницы.
            </p>

            <Link to={ROUTES.HOME}>
              <Button>На главную</Button>
            </Link>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default UnauthorizedPage;