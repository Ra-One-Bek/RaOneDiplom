import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import PageContainer from './PageContainer';
import Button from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <PageContainer className="flex min-h-[80px] items-center justify-between gap-4">
        {/* ЛОГО */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg font-bold text-white shadow-md">
            R
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wide text-neutral-900">
              RAONE
            </span>
            <span className="text-xs text-neutral-500">
              Virtual Fashion Store
            </span>
          </div>
        </Link>

        {/* NAV */}
        <Navbar />

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline">Войти</Button>
              </Link>

              <Link to={ROUTES.REGISTER}>
                <Button>Регистрация</Button>
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                to={ROUTES.PROFILE}
                className="hidden rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-200 sm:block"
              >
                {user?.name}
              </Link>

              <Button variant="outline" onClick={logout}>
                Выйти
              </Button>
            </>
          )}
        </div>
      </PageContainer>
    </header>
  );
};

export default Header;