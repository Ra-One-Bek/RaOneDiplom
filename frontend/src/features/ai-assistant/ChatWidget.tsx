import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../../types/chat';
import { getMockAIResponse } from '../../services/ai/mockAI';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await getMockAIResponse(userMessage.content);

    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
        >
        💬
        </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[340px] flex-col rounded-3xl border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
                <p className="font-semibold">AI Ассистент</p>

                <button
                    onClick={() => {
                    setIsOpen(false);
                    window.location.href = ROUTES.ASSISTANT;
                    }}
                    className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200"
                >
                    Открыть полностью
                </button>
            </div>

            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="h-[300px] space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-neutral-500">
                Привет! Чем могу помочь?
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto bg-black text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-neutral-500">Печатает...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            />

            <Button onClick={handleSend}>→</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;