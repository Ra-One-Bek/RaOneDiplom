import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-16">
        <PageContainer>
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              Регистрация
            </h1>
            <p className="mb-6 text-neutral-600">
              Создайте аккаунт, чтобы настроить 3D-аватар и пользоваться примерочной.
            </p>

            <form className="flex flex-col gap-4">
              <Input
                label="Имя"
                type="text"
                placeholder="Введите имя"
              />

              <Input
                label="Email"
                type="email"
                placeholder="Введите email"
              />

              <Input
                label="Пароль"
                type="password"
                placeholder="Введите пароль"
              />

              <Button type="submit" fullWidth>
                Зарегистрироваться
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