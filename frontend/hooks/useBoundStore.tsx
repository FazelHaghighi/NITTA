import { StateCreator, create } from 'zustand';
import { Student, Teacher, ThemeType } from '@/types/globalTypes';

type Department = string;

type StudentSlice = {
  student: Student;
  updateStudent: (student: Student) => void;
};

type TeacherSlice = {
  teacher: Teacher;
  updateTeacher: (teacher: Teacher) => void;
};

type ThemeSlice = {
  theme: ThemeType;
  switchTheme: () => void;
  setTheme: (theme: ThemeType) => void;
};

type CurrentDepartmentSlice = {
  currDep: Department;
  setCurrDep: (currDep: Department) => void;
};

const createStudentSlice: StateCreator<StudentSlice> = (set) => ({
  student: {
    id: '',
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

const createTeacherSlice: StateCreator<TeacherSlice> = (set) => ({
  teacher: {
    depName: '',
    email: '',
    name: '',
    username: '',
  },
  updateTeacher: ({ depName, email, name, username }) =>
    set(() => ({
      teacher: {
        depName: depName,
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
  setTheme: (theme) => set(() => ({ theme: theme })),
});

const createCurrentDepartmentSlice: StateCreator<CurrentDepartmentSlice> = (
  set
) => ({
  currDep: '',
  setCurrDep: (currDep) => set(() => ({ currDep: currDep })),
});

export const useBoundStore = create<
  StudentSlice & ThemeSlice & TeacherSlice & CurrentDepartmentSlice
>()((...a) => ({
  ...createStudentSlice(...a),
  ...createThemeSlice(...a),
  ...createTeacherSlice(...a),
  ...createCurrentDepartmentSlice(...a),
}));
