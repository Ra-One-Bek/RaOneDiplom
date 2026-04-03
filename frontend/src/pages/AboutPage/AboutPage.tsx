import { useRef } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageContainer from "../../components/layout/PageContainer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const AboutPage = () => {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.from(".main-panel", {
      scaleX: 0.45,
      scaleY: 0.12,
      transformOrigin: "center center",
      duration: 1.2,
    })
      .to(".content", {
        opacity: 1,
        duration: 0.01,
      })
      .from(".eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.5,
      })
      .from(
        ".title",
        {
          x: -60,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.2"
      )
      .from(
        ".description",
        {
          x: -40,
          opacity: 0,
          duration: 0.7,
        },
        "-=0.4"
      )
      .from(
        ".card",
        {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
        },
        "-=0.2"
      );
  }, { scope: container });

  return (
    
    <div ref={container}>
      <Header />

      <main className="min-h-screen overflow-hidden text-white">
        <section className="scene flex min-h-screen items-center justify-center">
          <div className="main-panel relative w-full min-h-screen bg-neutral-950 rounded-3xl origin-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12),transparent_60%)]" />

            <PageContainer>
              <div className="content relative z-10 py-16 opacity-0">
                <div className="mb-12 max-w-4xl">
                  <p className="eyebrow mb-3 text-sm uppercase tracking-[0.25em] text-pink-400">
                    About Project
                  </p>

                  <h1 className="title mb-6 text-4xl font-bold sm:text-5xl">
                    О проекте RAONE
                  </h1>

                  <p className="description text-base leading-8 text-neutral-300 sm:text-lg">
                    RAONE — это дипломный проект, представляющий собой
                    веб-приложение для онлайн подбора одежды с использованием
                    виртуальной примерочной, 3D-визуализации образа пользователя
                    и интеллектуальных рекомендаций.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="card rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-4 text-2xl font-semibold">Цель приложения</h2>
                    <p className="leading-7 text-neutral-300">
                      Сделать процесс покупки одежды более удобным, интересным и
                      персонализированным. Пользователь сможет не только
                      просматривать товары, но и получать интеллектуальную помощь
                      в выборе подходящего образа.
                    </p>
                  </div>

                  <div className="card rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-4 text-2xl font-semibold">Основные функции</h2>
                    <p className="leading-7 text-neutral-300">
                      В приложении предусмотрены каталог одежды, личный кабинет,
                      создание 3D-аватара, виртуальная примерочная,
                      рекомендации ИИ и чат-ассистент для поддержки пользователя.
                    </p>
                  </div>

                  <div className="card rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-4 text-2xl font-semibold">Подбор размеров</h2>
                    <p className="leading-7 text-neutral-300">
                      Пользователь сможет выбирать и настраивать аватар под свои
                      параметры, что позволит визуально определить, насколько
                      одежда подходит по стилю и посадке.
                    </p>
                  </div>

                  <div className="card rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="mb-4 text-2xl font-semibold">Интеллектуальная помощь</h2>
                    <p className="leading-7 text-neutral-300">
                      Встроенный ИИ-помощник будет помогать с подбором одежды,
                      рекомендациями по погоде, стилю, цветовым сочетаниям и
                      объяснять возможности приложения.
                    </p>
                  </div>
                </div>
              </div>
            </PageContainer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;