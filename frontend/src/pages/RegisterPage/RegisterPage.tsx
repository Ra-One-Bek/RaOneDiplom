import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Заполните все поля.');
      return;
    }

    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate(ROUTES.AVATAR_SETUP);
    } catch {
      setError('Не удалось зарегистрироваться. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-16">
        <PageContainer>
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-neutral-900">
                Регистрация
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Создайте аккаунт. После регистрации вы сразу перейдёте к созданию
                своего 3D-аватара для примерочной.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Имя"
                placeholder="Введите ваше имя"
                value={form.name}
                onChange={updateField('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Введите email"
                value={form.email}
                onChange={updateField('email')}
              />

              <Input
                label="Пароль"
                type="password"
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={updateField('password')}
              />

              <Input
                label="Подтвердите пароль"
                type="password"
                placeholder="Повторите пароль"
                value={form.confirmPassword}
                onChange={updateField('confirmPassword')}
              />

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

export default RegisterPage;