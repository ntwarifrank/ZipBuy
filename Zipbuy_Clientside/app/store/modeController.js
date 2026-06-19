import { create } from "zustand";
import { persist } from "zustand/middleware";

const useToggleModeStore = create(
  persist(
    (set) => ({
      mode: true,
      toggleMode: () =>
        set((state) => ({ mode: !state.mode })),
    }),
    { name: "zipbuy_mode" }
  )
);

export default useToggleModeStore;

const useToggleDashboardStateStore = create((set) => ({
  dashboardState: false,
  toggleDashboardState: () =>
    set((state) => ({ dashboardState: !state.dashboardState })),
}));

export { useToggleDashboardStateStore };
