import { StateCreator, create } from 'zustand';
import { Student, ThemeType } from '@/types/globalTypes';
import { persist, createJSONStorage } from 'zustand/middleware';

type StudentSlice = {
  student: Student;
  updateStudent: (student: Student) => void;
};

type ThemeSlice = {
  theme: ThemeType;
  switchTheme: () => void;
};

const createStudentSlice: StateCreator<StudentSlice> = (set) => ({
  student: {
    id: -1,
    email: '',
    name: '',
    username: '',
  },
  updateStudent: ({ id, email, name, username }) =>
    set(() => ({
      student: {
        id: id,
        email: email,
        name: name,
        username: username,
      },
    })),
});

const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: 'dark',
  switchTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
});

export const useBoundStore = create<StudentSlice & ThemeSlice>()(
  persist(
    (...a) => ({
      ...createStudentSlice(...a),
      ...createThemeSlice(...a),
    }),
    {
      name: 'bound-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        switchTheme: state.switchTheme,
      }),
    }
  )
);
