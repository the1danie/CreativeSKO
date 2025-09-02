// store/useKeyboardStore.ts
import { create } from "zustand";

export type Language = "RU" | "EN" | "KZ";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "RU",
  setLanguage: (lang) => set({ language: lang }),
}));
