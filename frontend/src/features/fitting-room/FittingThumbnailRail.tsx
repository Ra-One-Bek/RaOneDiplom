import type { FittingSlot } from '../../types/product';
import type { FittingOutfit } from '../../services/storage/selectedProductStorage';
import { getSlotLabel } from './fittingRoom.utils';

interface FittingThumbnailRailProps {
  outfit: FittingOutfit;
  onRemove: (slot: FittingSlot) => void;
}

const railOrder: FittingSlot[] = ['dress', 'top', 'outerwear', 'bottom', 'footwear'];

const FittingThumbnailRail = ({
  outfit,
  onRemove,
}: FittingThumbnailRailProps) => {
  return (
    <div className="flex w-[112px] flex-col gap-3">
      {railOrder.map((slot) => {
        const product = outfit[slot];

        return (
          <div
            key={slot}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex h-[112px] items-center justify-center bg-neutral-100">
              {product ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-2 text-center text-[11px] text-neutral-400">
                  {getSlotLabel(slot)}
                </span>
              )}
            </div>

            <div className="border-t border-neutral-200 px-2 py-2">
              <p className="truncate text-[11px] font-semibold text-neutral-800">
                {getSlotLabel(slot)}
              </p>

              <p className="truncate text-[10px] text-neutral-500">
                {product ? product.title : 'Не выбрано'}
              </p>

              {product && (
                <button
                  onClick={() => onRemove(slot)}
                  className="mt-2 w-full rounded-lg bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 transition hover:bg-red-100"
                >
                  Убрать
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FittingThumbnailRail;