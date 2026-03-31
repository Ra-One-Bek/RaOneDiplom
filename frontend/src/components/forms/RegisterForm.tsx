import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    field: 'name' | 'email' | 'password',
    value: string
  ) => {
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
      name: '',
      email: '',
      password: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      nextErrors.name = 'Введите имя';
      isValid = false;
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Введите email';
      isValid = false;
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Введите пароль';
      isValid = false;
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Пароль должен быть не меньше 6 символов';
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
      await register(formData);
      navigate(ROUTES.PROFILE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        label="Имя"
        type="text"
        placeholder="Введите имя"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
      />

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

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};

export default RegisterForm;