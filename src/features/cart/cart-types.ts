export type CartItemKind = "product" | "bundle";

export type CartItem = {
  id: string;
  kind: CartItemKind;
  productId?: string;
  variantId?: string;
  bundleId?: string;
  label: string;
  detail?: string;
  unitPrice: number;
  quantity: number;
};

export type CartSnapshot = {
  items: CartItem[];
};
