import { Link } from 'react-router-dom';
import PageContainer from './PageContainer';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <PageContainer className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-neutral-900">RAONE</h3>
            <p className="text-sm leading-6 text-neutral-600">
              Веб-приложение для онлайн подбора одежды с виртуальной примерочной,
              3D-визуализацией образа пользователя и интеллектуальными рекомендациями.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-base font-semibold text-neutral-900">
              Навигация
            </h4>

            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <Link to={ROUTES.HOME} className="hover:text-black">
                Главная
              </Link>
              <Link to={ROUTES.CATALOG} className="hover:text-black">
                Каталог
              </Link>
              <Link to={ROUTES.ABOUT} className="hover:text-black">
                О проекте
              </Link>
              <Link to={ROUTES.RECOMMENDATIONS} className="hover:text-black">
                Рекомендации
              </Link>
              <Link to={ROUTES.FITTING_ROOM} className="hover:text-black">
                Примерочная
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-base font-semibold text-neutral-900">
              О дипломе
            </h4>

            <p className="text-sm leading-6 text-neutral-600">
              Проект направлен на улучшение пользовательского опыта в онлайн-шоппинге
              за счет виртуальной примерки, персонализированных рекомендаций и
              интерактивного ИИ-помощника.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          © 2025 RAONE. Дипломный проект.
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;