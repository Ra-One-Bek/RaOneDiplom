import type { FittingSlot } from '../../types/product';

export interface AvatarSlotPosition {
  slot: FittingSlot;
  label: string;
  top: string;
  left: string;
}

export const avatarSlotConfig: AvatarSlotPosition[] = [
  {
    slot: 'dress',
    label: 'Платье',
    top: '22%',
    left: '50%',
  },
  {
    slot: 'top',
    label: 'Верх',
    top: '24%',
    left: '50%',
  },
  {
    slot: 'outerwear',
    label: 'Верхняя одежда',
    top: '34%',
    left: '50%',
  },
  {
    slot: 'bottom',
    label: 'Низ',
    top: '57%',
    left: '50%',
  },
  {
    slot: 'footwear',
    label: 'Обувь',
    top: '83%',
    left: '50%',
  },
];