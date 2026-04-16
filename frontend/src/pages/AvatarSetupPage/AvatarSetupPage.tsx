import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import type {
  AvatarBuild,
  AvatarGender,
  AvatarHeightPreset,
  AvatarMuscle,
  AvatarProfile,
  AvatarSkinTone,
} from '../../types/auth';
import AvatarCanvas from '../../features/fitting-room/AvatarCanvas';

const genderOptions: { value: AvatarGender; label: string }[] = [
  { value: 'male', label: 'Мужчина' },
  { value: 'female', label: 'Женщина' },
];

const buildOptions: { value: AvatarBuild; label: string }[] = [
  { value: 'slim', label: 'Худой' },
  { value: 'medium', label: 'Средний' },
  { value: 'full', label: 'Полный' },
];

const muscleOptions: { value: AvatarMuscle; label: string }[] = [
  { value: 'min', label: 'Min' },
  { value: 'mid', label: 'Mid' },
  { value: 'max', label: 'Max' },
];

const heightOptions: { value: AvatarHeightPreset; label: string }[] = [
  { value: 'short', label: '150–160' },
  { value: 'medium', label: '170–180' },
  { value: 'tall', label: '190–200' },
];

const skinToneOptions: { value: AvatarSkinTone; label: string }[] = [
  { value: 'light', label: 'Светлая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'dark', label: 'Тёмная' },
];

const buildPresetProfile = (
  gender: AvatarGender,
  build: AvatarBuild,
  muscle: AvatarMuscle,
  heightPreset: AvatarHeightPreset,
  skinTone: AvatarSkinTone,
  previous?: Partial<AvatarProfile>
): AvatarProfile => {
  const base: AvatarProfile = {
    gender,
    build,
    muscle,
    heightPreset,
    skinTone,

    morphAsianMaleYoung: 0,
    morphCaucasianMaleYoung: 0,
    morphAfricanMaleYoung: 0,

    morphMaleMaxMuscleAvgWeight: 0,
    morphMaleMaxMuscleAvgWeightMaxHeight: 0,
    morphMaleMaxMuscleMaxWeight: 0,
    morphMaleMaxMuscleMaxWeightMaxHeight: 0,
    morphMaleAvgMuscleAvgWeight: 0,

    morphMaleMaxMuscleAvgWeightIdealProportions: 0,
    morphMaleMaxMuscleMaxWeightIdealProportions: 0,
    morphMaleAvgMuscleAvgWeightIdealProportions: 0,
  };

  // Основа пола
  if (gender === 'male') {
    base.morphMaleAvgMuscleAvgWeight = 0.42;
    base.morphMaleAvgMuscleAvgWeightIdealProportions = 0.08;
  } else {
    // Женщина на male-базе: делаем мягче и менее спортивной
    base.morphMaleAvgMuscleAvgWeight = 0.36;
    base.morphMaleAvgMuscleAvgWeightIdealProportions = 0.14;
    base.morphMaleMaxMuscleAvgWeight = 0.03;
    base.morphMaleMaxMuscleMaxWeight = 0.02;
  }

  // Телосложение
  switch (build) {
    case 'slim':
      base.morphMaleAvgMuscleAvgWeight =
        gender === 'male' ? 0.26 : 0.22;
      base.morphMaleMaxMuscleAvgWeightIdealProportions += 0.04;
      break;

    case 'medium':
      base.morphMaleAvgMuscleAvgWeight += 0.08;
      break;

    case 'full':
      // здесь делаем реально массивнее
      base.morphMaleMaxMuscleMaxWeight = gender === 'male' ? 0.9 : 0.58;
      base.morphMaleMaxMuscleMaxWeightIdealProportions =
        gender === 'male' ? 0.34 : 0.2;
      base.morphMaleAvgMuscleAvgWeight += 0.18;
      break;
  }

  // Мускулатура
  switch (muscle) {
    case 'min':
      if (gender === 'male') {
        base.morphMaleMaxMuscleAvgWeight += 0.05;
      }
      break;

    case 'mid':
      if (gender === 'male') {
        base.morphMaleMaxMuscleAvgWeight += 0.32;
      } else {
        base.morphMaleMaxMuscleAvgWeight += 0.08;
      }
      break;

    case 'max':
      if (gender === 'male') {
        base.morphMaleMaxMuscleAvgWeight += 0.82;
        base.morphMaleMaxMuscleAvgWeightIdealProportions += 0.22;
        base.morphMaleMaxMuscleMaxWeight += 0.18;
      } else {
        base.morphMaleMaxMuscleAvgWeight += 0.14;
      }
      break;
  }

  // Рост
  switch (heightPreset) {
    case 'short':
      break;

    case 'medium':
      base.morphMaleMaxMuscleAvgWeightMaxHeight +=
        gender === 'male' ? 0.18 : 0.08;
      break;

    case 'tall':
      base.morphMaleMaxMuscleAvgWeightMaxHeight +=
        gender === 'male' ? 0.72 : 0.2;
      base.morphMaleMaxMuscleMaxWeightMaxHeight +=
        build === 'full'
          ? gender === 'male'
            ? 0.7
            : 0.22
          : gender === 'male'
            ? 0.16
            : 0.04;
      break;
  }

  // Подчищаем значения
  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  base.morphAsianMaleYoung = clamp(base.morphAsianMaleYoung);
  base.morphCaucasianMaleYoung = clamp(base.morphCaucasianMaleYoung);
  base.morphAfricanMaleYoung = clamp(base.morphAfricanMaleYoung);

  base.morphMaleMaxMuscleAvgWeight = clamp(base.morphMaleMaxMuscleAvgWeight);
  base.morphMaleMaxMuscleAvgWeightMaxHeight = clamp(
    base.morphMaleMaxMuscleAvgWeightMaxHeight
  );
  base.morphMaleMaxMuscleMaxWeight = clamp(base.morphMaleMaxMuscleMaxWeight);
  base.morphMaleMaxMuscleMaxWeightMaxHeight = clamp(
    base.morphMaleMaxMuscleMaxWeightMaxHeight
  );
  base.morphMaleAvgMuscleAvgWeight = clamp(base.morphMaleAvgMuscleAvgWeight);

  base.morphMaleMaxMuscleAvgWeightIdealProportions = clamp(
    base.morphMaleMaxMuscleAvgWeightIdealProportions
  );
  base.morphMaleMaxMuscleMaxWeightIdealProportions = clamp(
    base.morphMaleMaxMuscleMaxWeightIdealProportions
  );
  base.morphMaleAvgMuscleAvgWeightIdealProportions = clamp(
    base.morphMaleAvgMuscleAvgWeightIdealProportions
  );

  return {
    ...base,
    ...previous,
    gender,
    build,
    muscle,
    heightPreset,
    skinTone,
  };
};

const AvatarSetupPage = () => {
  const navigate = useNavigate();
  const { user, updateAvatar } = useAuth();

  const initialProfile = useMemo(() => {
    if (user?.avatarProfile) {
      return user.avatarProfile;
    }

    return buildPresetProfile('male', 'medium', 'mid', 'medium', 'medium');
  }, [user?.avatarProfile]);

  const [avatar, setAvatar] = useState<AvatarProfile>(initialProfile);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const title = useMemo(() => {
    return user?.name
      ? `Создание аватара для ${user.name}`
      : 'Создание аватара';
  }, [user?.name]);

  const applyPreset = (
    next: Partial<
      Pick<AvatarProfile, 'gender' | 'build' | 'muscle' | 'heightPreset' | 'skinTone'>
    >
  ) => {
    const nextGender = next.gender ?? avatar.gender;
    const nextBuild = next.build ?? avatar.build;
    const nextMuscle = next.muscle ?? avatar.muscle;
    const nextHeight = next.heightPreset ?? avatar.heightPreset;
    const nextSkinTone = next.skinTone ?? avatar.skinTone;

    setAvatar(
      buildPresetProfile(
        nextGender,
        nextBuild,
        nextMuscle,
        nextHeight,
        nextSkinTone
      )
    );
  };

  const updateSlider =
    (
      field:
        | 'morphAsianMaleYoung'
        | 'morphCaucasianMaleYoung'
        | 'morphAfricanMaleYoung'
        | 'morphMaleMaxMuscleAvgWeight'
        | 'morphMaleMaxMuscleAvgWeightMaxHeight'
        | 'morphMaleMaxMuscleMaxWeight'
        | 'morphMaleMaxMuscleMaxWeightMaxHeight'
        | 'morphMaleAvgMuscleAvgWeight'
        | 'morphMaleMaxMuscleAvgWeightIdealProportions'
        | 'morphMaleMaxMuscleMaxWeightIdealProportions'
        | 'morphMaleAvgMuscleAvgWeightIdealProportions'
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAvatar((prev) => ({
        ...prev,
        [field]: Number(event.target.value),
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
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Гибридный вариант: быстрые пресеты кнопками и точная ручная
                  настройка реальными morph-ползунками. Волосы отключены.
                </p>
              </div>

              <div className="h-[680px] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
                <AvatarCanvas avatarProfile={avatar} />
              </div>
            </section>

            <aside className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <OptionGroup
                  title="Пол"
                  options={genderOptions}
                  value={avatar.gender}
                  onChange={(value) => applyPreset({ gender: value })}
                />

                <OptionGroup
                  title="Телосложение"
                  options={buildOptions}
                  value={avatar.build}
                  onChange={(value) => applyPreset({ build: value })}
                />

                <OptionGroup
                  title="Мускулистость"
                  options={muscleOptions}
                  value={avatar.muscle}
                  onChange={(value) => applyPreset({ muscle: value })}
                />

                <OptionGroup
                  title="Рост"
                  options={heightOptions}
                  value={avatar.heightPreset}
                  onChange={(value) => applyPreset({ heightPreset: value })}
                />

                <OptionGroup
                  title="Тон кожи"
                  options={skinToneOptions}
                  value={avatar.skinTone}
                  onChange={(value) => applyPreset({ skinTone: value })}
                />

                <div className="rounded-2xl border border-neutral-200 p-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        Расширенные параметры
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Ползунки реальных morph из текущего avatar.glb
                      </p>
                    </div>

                    <span className="text-sm text-neutral-600">
                      {showAdvanced ? 'Скрыть' : 'Открыть'}
                    </span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-5 space-y-4">
                      <SliderField
                        label="Asian male young"
                        value={avatar.morphAsianMaleYoung}
                        onChange={updateSlider('morphAsianMaleYoung')}
                      />

                      <SliderField
                        label="Caucasian male young"
                        value={avatar.morphCaucasianMaleYoung}
                        onChange={updateSlider('morphCaucasianMaleYoung')}
                      />

                      <SliderField
                        label="African male young"
                        value={avatar.morphAfricanMaleYoung}
                        onChange={updateSlider('morphAfricanMaleYoung')}
                      />

                      <SliderField
                        label="Male max muscle / avg weight"
                        value={avatar.morphMaleMaxMuscleAvgWeight}
                        onChange={updateSlider('morphMaleMaxMuscleAvgWeight')}
                      />

                      <SliderField
                        label="Male tall athletic"
                        value={avatar.morphMaleMaxMuscleAvgWeightMaxHeight}
                        onChange={updateSlider(
                          'morphMaleMaxMuscleAvgWeightMaxHeight'
                        )}
                      />

                      <SliderField
                        label="Male heavy"
                        value={avatar.morphMaleMaxMuscleMaxWeight}
                        onChange={updateSlider('morphMaleMaxMuscleMaxWeight')}
                      />

                      <SliderField
                        label="Male tall heavy"
                        value={avatar.morphMaleMaxMuscleMaxWeightMaxHeight}
                        onChange={updateSlider(
                          'morphMaleMaxMuscleMaxWeightMaxHeight'
                        )}
                      />

                      <SliderField
                        label="Male average"
                        value={avatar.morphMaleAvgMuscleAvgWeight}
                        onChange={updateSlider('morphMaleAvgMuscleAvgWeight')}
                      />

                      <SliderField
                        label="Athletic proportions"
                        value={avatar.morphMaleMaxMuscleAvgWeightIdealProportions}
                        onChange={updateSlider(
                          'morphMaleMaxMuscleAvgWeightIdealProportions'
                        )}
                      />

                      <SliderField
                        label="Heavy proportions"
                        value={avatar.morphMaleMaxMuscleMaxWeightIdealProportions}
                        onChange={updateSlider(
                          'morphMaleMaxMuscleMaxWeightIdealProportions'
                        )}
                      />

                      <SliderField
                        label="Average proportions"
                        value={avatar.morphMaleAvgMuscleAvgWeightIdealProportions}
                        onChange={updateSlider(
                          'morphMaleAvgMuscleAvgWeightIdealProportions'
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
                  Для настоящего женского тела и параметров вроде груди/талии/бёдер
                  нужен второй экспорт из Blender с female morph targets. Но этот
                  вариант уже рабочий и намного сильнее старой ручной схемы.
                </div>

                <Button fullWidth onClick={handleSave}>
                  Сохранить аватар
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

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderField = ({ label, value, onChange }: SliderFieldProps) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-neutral-800">{label}</p>
        <span className="text-sm text-neutral-500">{value.toFixed(2)}</span>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={onChange}
        className="w-full accent-black"
      />
    </div>
  );
};

export default AvatarSetupPage;