import { create } from "zustand";

const AdminDataStore = create((set) => ({
    AdminData: null,
    setAdminData: (newUser) => set({ AdminData: newUser }),
    destroyAdminData: () => set({ AdminData: null })
}))

export default AdminDataStore;
