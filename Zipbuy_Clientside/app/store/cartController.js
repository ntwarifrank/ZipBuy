import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cartIds: [],
      setCartIds: (id) =>
        set((state) => ({
          cartIds: [...state.cartIds, id],
        })),
      removeProduct: (id) =>
        set((state) => ({
          cartIds: state.cartIds.filter((item) => item !== id),
        })),
      removeLastId: (id) =>
        set((state) => {
          const cartIds = [...state.cartIds];
          const occurrences = cartIds.filter((item) => item === id).length;
          if (occurrences > 1) {
            const index = cartIds.lastIndexOf(id);
            if (index !== -1) {
              cartIds.splice(index, 1);
            }
          }
          return { cartIds };
        }),
    }),
    { name: "zipbuy_cart" }
  )
);

export default useCartStore;
