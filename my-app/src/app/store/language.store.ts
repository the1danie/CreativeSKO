// store/useKeyboardStore.ts
import { create } from "zustand";

export type Language = "ru" | "kz" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "ru",
  setLanguage: (lang) => set({ language: lang }),
}));
