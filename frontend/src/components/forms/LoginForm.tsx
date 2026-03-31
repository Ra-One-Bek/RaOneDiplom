import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validate = () => {
    const nextErrors = {
      email: '',
      password: '',
    };

    let isValid = true;

    if (!formData.email.trim()) {
      nextErrors.email = 'Введите email';
      isValid = false;
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Введите пароль';
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await login(formData);
      navigate(ROUTES.PROFILE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        placeholder="Введите email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="Введите пароль"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
      />

      <div className="rounded-2xl bg-neutral-100 p-4 text-sm leading-6 text-neutral-600">
        Для входа как админ используй:
        <br />
        <span className="font-semibold">admin@raone.com</span>
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};

export default LoginForm;