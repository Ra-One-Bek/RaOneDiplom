import { useEffect, useRef, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import type { ChatMessage } from '../../types/chat';
import { getMockAIResponse } from '../../services/ai/mockAI';

const quickActions = [
  'Подбери образ на прохладную погоду',
  'Помоги выбрать размер',
  'Подскажи стиль на каждый день',
  'Как пользоваться примерочной?',
  'Что ты умеешь?',
];

const AssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Привет! Я AI-ассистент RAONE. Помогу подобрать одежду, стиль, размеры, образ для примерочной и подскажу, как пользоваться приложением.',
      createdAt: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await getMockAIResponse(trimmed);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await sendMessage(input);
  };

  const handleQuickAction = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-50 py-10">
        <PageContainer>
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-pink-500">
              AI Assistant
            </p>
            <h1 className="text-4xl font-bold text-neutral-900">
              AI ассистент RAONE
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              Здесь пользователь может получить рекомендации по стилю, подбору
              одежды, размерам, погоде и работе виртуальной примерочной.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                Быстрые действия
              </h2>

              <div className="flex flex-col gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="rounded-2xl bg-neutral-100 px-4 py-3 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-neutral-950 p-5 text-white">
                <h3 className="mb-3 text-lg font-semibold">Что умеет ассистент</h3>
                <ul className="space-y-2 text-sm leading-6 text-neutral-300">
                  <li>Подбор одежды по стилю</li>
                  <li>Советы по размерам</li>
                  <li>Рекомендации по погоде</li>
                  <li>Помощь по примерочной</li>
                  <li>Навигация по приложению</li>
                </ul>
              </div>
            </aside>

            <section className="flex min-h-[650px] flex-col rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-200 p-5">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Чат с ассистентом
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Задай вопрос про стиль, размеры, подбор одежды или работу приложения
                </p>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                        message.role === 'user'
                          ? 'bg-black text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500">
                      Ассистент печатает...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-neutral-200 p-4">
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void handleSubmit();
                      }
                    }}
                    placeholder="Напишите ваш вопрос..."
                    className="flex-1 rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                  />

                  <Button onClick={handleSubmit} disabled={loading}>
                    Отправить
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default AssistantPage;