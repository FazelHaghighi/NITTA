import { create } from 'zustand';
import { Student } from '@/types/globalTypes';

type State = {
  student: Student;
};

type Action = {
  updateStudent: (student: Student) => void;
};

export const useStudentStore = create<State & Action>((set) => ({
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
}));
