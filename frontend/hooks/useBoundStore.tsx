import { StateCreator, create } from 'zustand';
import {
  PartialStudent,
  PartialTeacher,
  Student,
  Teacher,
  ThemeType,
} from '@/types/globalTypes';
import { LessonAndTeacher } from '@/app/dashboard/student-dashboard.';

type Department = string;

type Lesson = {
  name: string;
  units: string;
};

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

type CurrentLessonSlice = {
  currLesson: Lesson;
  setCurrLesson: (currLesson: Lesson) => void;
};

type RequestSlice = {
  request: {
    reqInfo: LessonAndTeacher;
    student: Student;
  };
  setRequest: (reqInfo: LessonAndTeacher, student: Student) => void;
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
  theme: 'light',
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

const createRequestSlice: StateCreator<RequestSlice> = (set) => ({
  request: {
    reqInfo: {
      lessonName: '',
      teacherName: '',
      lessonPrerequisite: [],
      lessonUnit: -1,
      teacherEmail: '',
    },
    student: {
      id: '',
      email: '',
      name: '',
      username: '',
    },
  },
  setRequest: (reqInfo, student) =>
    set(() => ({
      request: {
        reqInfo: {
          lessonName: reqInfo.lessonName,
          teacherName: reqInfo.teacherName,
          lessonPrerequisite: reqInfo.lessonPrerequisite,
          lessonUnit: reqInfo.lessonUnit,
          teacherEmail: reqInfo.teacherEmail,
        },
        student: {
          id: student.id,
          email: student.email,
          name: student.name,
          username: student.username,
        },
      },
    })),
});

const createCurrentLessonSlice: StateCreator<CurrentLessonSlice> = (set) => ({
  currLesson: {
    name: '',
    units: '',
  },
  setCurrLesson: (currLesson) =>
    set(() => ({
      currLesson: {
        name: currLesson.name,
        units: currLesson.units,
      },
    })),
});

export const useBoundStore = create<
  StudentSlice &
    ThemeSlice &
    TeacherSlice &
    CurrentDepartmentSlice &
    RequestSlice &
    CurrentLessonSlice
>()((...a) => ({
  ...createStudentSlice(...a),
  ...createThemeSlice(...a),
  ...createTeacherSlice(...a),
  ...createCurrentDepartmentSlice(...a),
  ...createRequestSlice(...a),
  ...createCurrentLessonSlice(...a),
}));
