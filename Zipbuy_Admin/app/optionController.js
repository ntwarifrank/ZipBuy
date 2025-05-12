import { create } from "zustand";

export const optionController = create((set) => ({
  option: false,
  toggleOption: () => set((state) => ({ option: !state.option })),
}));
