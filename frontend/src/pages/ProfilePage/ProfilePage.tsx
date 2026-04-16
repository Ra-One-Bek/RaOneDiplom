import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-12">
        <PageContainer>
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-neutral-900">Профиль</h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Управляйте аккаунтом и настройками виртуальной примерочной.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard label="Имя" value={user?.name ?? '—'} />
              <InfoCard label="Email" value={user?.email ?? '—'} />
              <InfoCard label="Роль" value={user?.role ?? '—'} />
              <InfoCard
                label="Аватар"
                value={user?.avatarConfigured ? 'Настроен' : 'Не настроен'}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={ROUTES.AVATAR_SETUP}>
                <Button variant="secondary">
                  {user?.avatarConfigured ? 'Изменить аватар' : 'Создать аватар'}
                </Button>
              </Link>

              <Link to={ROUTES.FITTING_ROOM}>
                <Button>Открыть примерочную</Button>
              </Link>

              <Button variant="danger" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-base font-medium text-neutral-900">{value}</p>
    </div>
  );
};

export default ProfilePage;