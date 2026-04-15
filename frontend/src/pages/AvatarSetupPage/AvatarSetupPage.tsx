import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import type {
  AvatarBodyType,
  AvatarGender,
  AvatarHairStyle,
  AvatarProfile,
  AvatarSkinTone,
} from '../../types/auth';
import AvatarCanvas from '../../features/fitting-room/AvatarCanvas';

const genderOptions: { value: AvatarGender; label: string }[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
  { value: 'neutral', label: 'Универсальный' },
];

const bodyTypeOptions: { value: AvatarBodyType; label: string }[] = [
  { value: 'slim', label: 'Стройное телосложение' },
  { value: 'regular', label: 'Стандартное телосложение' },
  { value: 'curvy', label: 'Выраженные формы' },
];

const hairStyleOptions: { value: AvatarHairStyle; label: string }[] = [
  { value: 'short', label: 'Короткие волосы' },
  { value: 'bob', label: 'Каре' },
  { value: 'long', label: 'Длинные волосы' },
];

const skinToneOptions: { value: AvatarSkinTone; label: string }[] = [
  { value: 'light', label: 'Светлая кожа' },
  { value: 'medium', label: 'Средний тон' },
  { value: 'dark', label: 'Тёмная кожа' },
];

const colorOptions = ['#2f1b14', '#5b3a29', '#1c1c1c', '#7a4a20', '#b08a62'];

const AvatarSetupPage = () => {
  const navigate = useNavigate();
  const { user, updateAvatar } = useAuth();

  const [avatar, setAvatar] = useState<AvatarProfile>({
    gender: user?.avatarProfile?.gender ?? 'neutral',
    bodyType: user?.avatarProfile?.bodyType ?? 'regular',
    hairStyle: user?.avatarProfile?.hairStyle ?? 'short',
    skinTone: user?.avatarProfile?.skinTone ?? 'medium',
    hairColor: user?.avatarProfile?.hairColor ?? '#2f1b14',
  });

  const title = useMemo(() => {
    if (user?.name) {
      return `Создание аватара для ${user.name}`;
    }

    return 'Создание аватара';
  }, [user?.name]);

  const selectValue =
    <T extends string>(field: keyof AvatarProfile, value: T) => {
      setAvatar((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSave = () => {
    updateAvatar(avatar);
    navigate(ROUTES.FITTING_ROOM);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-neutral-100 py-10">
        <PageContainer>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Настройте внешний вид аватара. На следующем шаге этот аватар
                  будет использоваться в примерочной.
                </p>
              </div>

              <div className="h-[560px] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
                <AvatarCanvas avatarProfile={avatar} />
              </div>
            </section>

            <aside className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <OptionGroup
                  title="Тип аватара"
                  options={genderOptions}
                  value={avatar.gender}
                  onChange={(value) => selectValue('gender', value)}
                />

                <OptionGroup
                  title="Телосложение"
                  options={bodyTypeOptions}
                  value={avatar.bodyType}
                  onChange={(value) => selectValue('bodyType', value)}
                />

                <OptionGroup
                  title="Прическа"
                  options={hairStyleOptions}
                  value={avatar.hairStyle}
                  onChange={(value) => selectValue('hairStyle', value)}
                />

                <OptionGroup
                  title="Тон кожи"
                  options={skinToneOptions}
                  value={avatar.skinTone}
                  onChange={(value) => selectValue('skinTone', value)}
                />

                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    Цвет волос
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => {
                      const isActive = avatar.hairColor === color;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => selectValue('hairColor', color)}
                          className={`h-10 w-10 rounded-full border-2 transition ${
                            isActive
                              ? 'border-black scale-110'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Выбрать цвет ${color}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  После сохранения этот аватар будет использоваться в виртуальной
                  примерочной вместо общего манекена.
                </div>

                <Button fullWidth onClick={handleSave}>
                  Сохранить аватар и перейти в примерочную
                </Button>
              </div>
            </aside>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
};

interface OptionGroupProps<T extends string> {
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

const OptionGroup = <T extends string>({
  title,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) => {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>

      <div className="grid gap-2">
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isActive
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSetupPage;