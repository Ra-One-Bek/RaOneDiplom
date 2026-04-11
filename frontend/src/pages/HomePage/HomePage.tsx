import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

const HomePage = () => {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.fromTo(
      container.current,
      {
        y: 400,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        transition: 0.5,
        duration: 1,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <>
      <Header />
      <div ref={container}>

        <main className="min-h-screen bg-white">
          <section className="main-panel bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 rounded-3xl text-white">
            <PageContainer className="py-20">
              <div className="content grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-pink-400">
                    Virtual Fashion Platform
                  </p>

                  <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    Онлайн подбор одежды с виртуальной примерочной и 3D-аватаром
                  </h1>

                  <p className="mb-8 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
                    RAONE — это современное веб-приложение для умного шоппинга,
                    где пользователь может получать рекомендации, собирать стильные
                    образы и примерять одежду на персонального 3D-аватара.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link to={ROUTES.CATALOG}>
                      <Button>Перейти в каталог</Button>
                    </Link>

                    <Link to={ROUTES.ABOUT}>
                      <Button variant="outline" className="bg-black text-pink-500 hover:bg-pink-500 hover:text-white">
                        Узнать о проекте
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                    <h3 className="mb-3 text-xl font-semibold">Мужская коллекция</h3>
                    <p className="mb-5 text-sm leading-6 text-neutral-300">
                      Современные мужские образы, подбор по стилю, цвету, сезону и погоде.
                    </p>
                    <Link to={ROUTES.CATALOG}>
                      <Button variant="secondary">Смотреть</Button>
                    </Link>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                    <h3 className="mb-3 text-xl font-semibold">Женская коллекция</h3>
                    <p className="mb-5 text-sm leading-6 text-neutral-300">
                      Красивые и актуальные женские образы с рекомендациями и виртуальной примеркой.
                    </p>
                    <Link to={ROUTES.CATALOG}>
                      <Button variant="secondary">Смотреть</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </PageContainer>
          </section>

          <section className="py-16">
            <PageContainer>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-neutral-200 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900">3D-примерочная</h3>
                  <p className="text-sm leading-6 text-neutral-600">
                    Пользователь может примерять одежду на своего аватара и визуально
                    оценивать готовый образ перед покупкой.
                  </p>
                </div>

                <div className="rounded-3xl border border-neutral-200 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900">ИИ-рекомендации</h3>
                  <p className="text-sm leading-6 text-neutral-600">
                    Система предлагает одежду по погоде, предпочтениям пользователя,
                    цветовым сочетаниям и стилю.
                  </p>
                </div>

                <div className="rounded-3xl border border-neutral-200 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900">ИИ-ассистент</h3>
                  <p className="text-sm leading-6 text-neutral-600">
                    Встроенный помощник отвечает на вопросы, помогает подобрать стиль
                    и объясняет, как пользоваться приложением.
                  </p>
                </div>
              </div>
            </PageContainer>
          </section>
        </main>

        <Footer />
      </div>
    </>

  );
};

export default HomePage;