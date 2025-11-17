import { create } from 'zustand';

type DemoMode = 'online' | 'offline';

interface DemoModeState {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
}

export const useDemoMode = create<DemoModeState>((set) => ({
  mode: 'online',
  setMode: (mode) => set({ mode })
}));
