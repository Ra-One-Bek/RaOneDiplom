import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';

const AboutPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-950 text-white py-16">
        <PageContainer>
          <div className="mb-12 max-w-4xl">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-pink-400">
              About Project
            </p>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
              О проекте RAONE
            </h1>
            <p className="text-base leading-8 text-neutral-300 sm:text-lg">
              RAONE — это дипломный проект, представляющий собой веб-приложение
              для онлайн подбора одежды с использованием виртуальной примерочной,
              3D-визуализации образа пользователя и интеллектуальных рекомендаций.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Цель приложения</h2>
              <p className="leading-7 text-neutral-300">
                Сделать процесс покупки одежды более удобным, интересным и персонализированным.
                Пользователь сможет не только просматривать товары, но и получать
                интеллектуальную помощь в выборе подходящего образа.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Основные функции</h2>
              <p className="leading-7 text-neutral-300">
                В приложении предусмотрены каталог одежды, личный кабинет, создание
                3D-аватара, виртуальная примерочная, рекомендации ИИ и чат-ассистент
                для поддержки пользователя.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Подбор размеров</h2>
              <p className="leading-7 text-neutral-300">
                Пользователь сможет выбирать и настраивать аватар под свои параметры,
                что позволит визуально определить, насколько одежда подходит по стилю и посадке.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-4 text-2xl font-semibold">Интеллектуальная помощь</h2>
              <p className="leading-7 text-neutral-300">
                Встроенный ИИ-помощник будет помогать с подбором одежды, рекомендациями
                по погоде, стилю, цветовым сочетаниям и объяснять возможности приложения.
              </p>
            </div>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default AboutPage;