import { create } from "zustand";

const userDataStore = create((set) => ({
  userData: null,
  setUserData: (newUser) => set({ userData: newUser }),
  destroyUserData: () => set({ userData: null }),
  distroyUserData: () => set({ userData: null }),
}));

export default userDataStore;
