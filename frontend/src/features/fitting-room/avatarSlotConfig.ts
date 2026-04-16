import type { AvatarWearSlot } from '../../types/product';

export const avatarSlotConfig: Array<{
  slot: AvatarWearSlot;
  label: string;
}> = [
  { slot: 'top', label: 'Верх' },
  { slot: 'bottom', label: 'Низ' },
  { slot: 'outerwear', label: 'Верхняя одежда' },
  { slot: 'dress', label: 'Платье' },
  { slot: 'footwear', label: 'Обувь' },
];