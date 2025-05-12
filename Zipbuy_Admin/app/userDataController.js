import { create } from "zustand";

const AdminDataStore = create((set) => ({
    AdminData: null,
    setAdminData: (newUser) => set({userData: newUser }),
    distroyAdminData: () => set({userData: null})
}))

export default AdminDataStore;
