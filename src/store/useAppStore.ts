import { create } from 'zustand';

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

type Screen = 'intro' | 'signup' | 'login' | 'home' | 'sim' | 'prog' | 'lesson';

interface AppState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  streak: number;
  xp: number;
  user: UserData | null;
  setUser: (user: AppState['user']) => void;
  // Simulator state
  balance: number;
  openPosition: {
    type: 'CALL' | 'PUT';
    entryPrice: number;
  } | null;
  setOpenPosition: (pos: AppState['openPosition']) => void;
  updateBalance: (amount: number) => void;
  // Progress state
  completedLessons: number;
  completeLesson: (xpAmount: number) => void;
  activeLessonIndex: number | null;
  setActiveLessonIndex: (index: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScreen: 'intro',
  setScreen: (screen) => set({ currentScreen: screen }),
  streak: 0,
  xp: 0,
  user: null,
  setUser: (user) => set({ user, streak: 1, xp: 0 }),
  balance: 10000,
  openPosition: null,
  setOpenPosition: (pos) => set({ openPosition: pos }),
  updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  completedLessons: 0,
  completeLesson: (xpAmount) => set((state) => ({ 
    completedLessons: state.completedLessons + 1,
    xp: state.xp + xpAmount 
  })),
  activeLessonIndex: null,
  setActiveLessonIndex: (index) => set({ activeLessonIndex: index }),
}));
