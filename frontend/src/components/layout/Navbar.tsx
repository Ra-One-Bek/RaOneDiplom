import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import type { NavItem } from '../../types/common';

const Navbar = () => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Главная', path: ROUTES.HOME },
    { label: 'Каталог', path: ROUTES.CATALOG },
    { label: 'О проекте', path: ROUTES.ABOUT },
    { label: 'Рекомендации', path: ROUTES.RECOMMENDATIONS },
    { label: 'Примерочная', path: ROUTES.FITTING_ROOM },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Админ', path: ROUTES.ADMIN });
  }

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-black text-white'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;