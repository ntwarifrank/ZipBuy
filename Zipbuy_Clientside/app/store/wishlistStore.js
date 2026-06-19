import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.find((p) => p._id === product._id);
        if (exists) {
          set({ wishlist: wishlist.filter((p) => p._id !== product._id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },
      isWishlisted: (productId) => get().wishlist.some((p) => p._id === productId),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    { name: "zipbuy_wishlist" }
  )
);

export default useWishlistStore;
