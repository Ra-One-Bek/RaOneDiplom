import { STORAGE_KEYS } from '../../constants/storage';
import type { FittingSlot, Product } from '../../types/product';
import { getProductSlot } from '../../features/fitting-room/fittingRoom.utils';

export type FittingOutfit = Partial<Record<FittingSlot, Product>>;

export const selectedProductStorage = {
  getOutfit(): FittingOutfit {
    const raw = localStorage.getItem(STORAGE_KEYS.FITTING_OUTFIT);

    if (!raw) return {};

    try {
      return JSON.parse(raw) as FittingOutfit;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.FITTING_OUTFIT);
      return {};
    }
  },

  saveOutfit(outfit: FittingOutfit) {
    localStorage.setItem(STORAGE_KEYS.FITTING_OUTFIT, JSON.stringify(outfit));
  },

  getWardrobe(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FITTING_WARDROBE);

    if (!raw) return [];

    try {
      return JSON.parse(raw) as Product[];
    } catch {
      localStorage.removeItem(STORAGE_KEYS.FITTING_WARDROBE);
      return [];
    }
  },

  saveWardrobe(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.FITTING_WARDROBE, JSON.stringify(products));
  },

  addToWardrobe(product: Product) {
    const wardrobe = this.getWardrobe();
    const exists = wardrobe.some((item) => item.id === product.id);

    if (exists) return;

    this.saveWardrobe([...wardrobe, product]);
  },

  removeFromWardrobe(productId: number) {
    const wardrobe = this.getWardrobe().filter((item) => item.id !== productId);
    this.saveWardrobe(wardrobe);
  },

  equipProduct(product: Product) {
    const currentOutfit = this.getOutfit();
    const slot = getProductSlot(product);

    const nextOutfit: FittingOutfit = {
      ...currentOutfit,
      [slot]: product,
    };

    if (slot === 'dress') {
      delete nextOutfit.top;
      delete nextOutfit.bottom;
      delete nextOutfit.outerwear;
    }

    if (slot === 'top' || slot === 'bottom' || slot === 'outerwear') {
      delete nextOutfit.dress;
    }

    this.saveOutfit(nextOutfit);
  },

  removeBySlot(slot: FittingSlot) {
    const currentOutfit = this.getOutfit();
    const nextOutfit = { ...currentOutfit };
    delete nextOutfit[slot];
    this.saveOutfit(nextOutfit);
  },

  clearOutfit() {
    localStorage.removeItem(STORAGE_KEYS.FITTING_OUTFIT);
  },

  clearWardrobe() {
    localStorage.removeItem(STORAGE_KEYS.FITTING_WARDROBE);
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.FITTING_OUTFIT);
    localStorage.removeItem(STORAGE_KEYS.FITTING_WARDROBE);
  },

  getEquippedProductsList(): Product[] {
    return Object.values(this.getOutfit()).filter(Boolean) as Product[];
  },

  getWardrobeTotalPrice(): number {
    return this.getWardrobe().reduce((sum, product) => sum + product.price, 0);
  },
};