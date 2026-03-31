import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-16">
        <PageContainer>
          <h1 className="mb-6 text-4xl font-bold text-neutral-900">
            Личный кабинет
          </h1>

          <div className="max-w-3xl rounded-3xl border border-neutral-200 p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</Badge>
              <Badge>{user?.avatarConfigured ? 'Аватар настроен' : 'Аватар не настроен'}</Badge>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="mb-2 text-sm text-neutral-500">Имя</p>
                <p className="font-semibold text-neutral-900">{user?.name}</p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="mb-2 text-sm text-neutral-500">Email</p>
                <p className="font-semibold text-neutral-900">{user?.email}</p>
              </div>
            </div>

            <p className="mb-6 leading-7 text-neutral-600">
              Позже здесь будет настройка профиля, управление параметрами аватара
              и история сохраненных образов.
            </p>

            <Button variant="danger" onClick={logout}>
              Выйти из аккаунта
            </Button>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default ProfilePage;