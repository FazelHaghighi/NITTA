import { string } from 'zod';

export type Student = {
  id: string;
  email: string;
  name: string;
  username: string;
};

export type PartialStudent = {
  name: string;
};

export type Teacher = {
  name: string;
  email: string;
  username: string;
  depName: string;
};

export type PartialTeacher = {
  name: string;
  email: string;
  depName: string;
};

export type LoginErrorCode = {
  code: string;
};

export type RegisterErrorCode = {
  code: string;
};

export type TokensType = {
  admin?: boolean;
  access_token: string;
  refresh_token: string;
};

export type ThemeType = 'dark' | 'light';
