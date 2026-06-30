"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminStore {
  // UI
  sidebarOpen: boolean;
  darkMode: boolean;
  activeSection: string;
  setSidebarOpen: (v: boolean) => void;
  toggleDarkMode: () => void;
  setActiveSection: (s: string) => void;

  // Toast
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      activeSection: "dashboard",
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setActiveSection: (s) => set({ activeSection: s }),

      toast: null,
      showToast: (message, type = "success") => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3500);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "admin-ui-store",
      partialize: (s) => ({ darkMode: s.darkMode, sidebarOpen: s.sidebarOpen }),
    }
  )
);
