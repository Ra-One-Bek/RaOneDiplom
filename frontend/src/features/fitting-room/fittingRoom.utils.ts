import type { FittingSlot, Product } from '../../types/product';

export const getProductSlot = (product: Product): FittingSlot => {
  switch (product.type) {
    case 'tshirt':
    case 'shirt':
    case 'hoodie':
      return 'top';

    case 'pants':
    case 'jeans':
    case 'skirt':
      return 'bottom';

    case 'jacket':
      return 'outerwear';

    case 'sneakers':
    case 'shoes':
      return 'footwear';

    case 'dress':
      return 'dress';

    default:
      return 'top';
  }
};

export const getSlotLabel = (slot: FittingSlot) => {
  switch (slot) {
    case 'top':
      return 'Верх';
    case 'bottom':
      return 'Низ';
    case 'outerwear':
      return 'Верхняя одежда';
    case 'footwear':
      return 'Обувь';
    case 'dress':
      return 'Платье';
    default:
      return slot;
  }
};