import type { Product, AvatarWearSlot } from '../../types/product';

const FITTING_WARDROBE_KEY = 'raone_fitting_wardrobe';
const FITTING_OUTFIT_KEY = 'raone_fitting_outfit';

export type FittingOutfit = Partial<Record<AvatarWearSlot, Product>>;

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getWardrobe = (): Product[] => {
  return parseJson<Product[]>(localStorage.getItem(FITTING_WARDROBE_KEY), []);
};

const setWardrobe = (items: Product[]) => {
  localStorage.setItem(FITTING_WARDROBE_KEY, JSON.stringify(items));
};

const getOutfit = (): FittingOutfit => {
  return parseJson<FittingOutfit>(localStorage.getItem(FITTING_OUTFIT_KEY), {});
};

const setOutfit = (outfit: FittingOutfit) => {
  localStorage.setItem(FITTING_OUTFIT_KEY, JSON.stringify(outfit));
};

const addToWardrobe = (product: Product) => {
  const wardrobe = getWardrobe();
  const exists = wardrobe.some((item) => item.id === product.id);

  if (!exists) {
    setWardrobe([...wardrobe, product]);
  }
};

const removeFromWardrobe = (productId: number) => {
  const nextWardrobe = getWardrobe().filter((item) => item.id !== productId);
  setWardrobe(nextWardrobe);

  const currentOutfit = getOutfit();
  const nextOutfit: FittingOutfit = { ...currentOutfit };

  (Object.keys(nextOutfit) as AvatarWearSlot[]).forEach((slot) => {
    if (nextOutfit[slot]?.id === productId) {
      delete nextOutfit[slot];
    }
  });

  setOutfit(nextOutfit);
};

const wearProduct = (product: Product) => {
  const slot = product.avatarSlot;
  const nextOutfit: FittingOutfit = {
    ...getOutfit(),
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

  setOutfit(nextOutfit);
};

const unwearSlot = (slot: AvatarWearSlot) => {
  const nextOutfit = { ...getOutfit() };
  delete nextOutfit[slot];
  setOutfit(nextOutfit);
};

const clearOutfit = () => {
  localStorage.removeItem(FITTING_OUTFIT_KEY);
};

const clearWardrobe = () => {
  localStorage.removeItem(FITTING_WARDROBE_KEY);
};

export const selectedProductStorage = {
  getWardrobe,
  setWardrobe,
  addToWardrobe,
  removeFromWardrobe,
  clearWardrobe,
  getOutfit,
  setOutfit,
  wearProduct,
  unwearSlot,
  clearOutfit,
};