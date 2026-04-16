import type { AvatarWearSlot, Product } from '../../types/product';

export const getProductSlot = (product: Product): AvatarWearSlot => {
  if (product.avatarSlot) {
    return product.avatarSlot;
  }

  switch (product.type) {
    case 'dress':
      return 'dress';
    case 'jacket':
      return 'outerwear';
    case 'pants':
    case 'skirt':
      return 'bottom';
    case 'shoes':
    case 'sneakers':
      return 'footwear';
    case 'tshirt':
    case 'shirt':
    default:
      return 'top';
  }
};