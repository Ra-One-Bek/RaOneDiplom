import type { Product, AvatarWearSlot } from '../../types/product';
import type { FittingOutfit } from '../../services/storage/selectedProductStorage';

interface FittingThumbnailRailProps {
  outfit: FittingOutfit;
  onRemove?: (slot: AvatarWearSlot) => void;
}

const slotLabels: Record<AvatarWearSlot, string> = {
  top: 'Верх',
  bottom: 'Низ',
  outerwear: 'Верхняя одежда',
  dress: 'Платье',
  footwear: 'Обувь',
};

const FittingThumbnailRail = ({ outfit, onRemove }: FittingThumbnailRailProps) => {
  return (
    <div className="space-y-3">
      {(Object.keys(slotLabels) as AvatarWearSlot[]).map((slot) => {
        const item: Product | undefined = outfit[slot];

        return (
          <div key={slot} className="rounded-2xl border border-neutral-200 p-3">
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              {slotLabels[slot]}
            </div>

            <div className="mt-1 text-sm font-medium text-neutral-900">
              {item ? item.title : 'Пусто'}
            </div>

            {item && onRemove && (
              <button
                type="button"
                onClick={() => onRemove(slot)}
                className="mt-2 text-xs text-neutral-600 underline underline-offset-2"
              >
                Снять
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FittingThumbnailRail;