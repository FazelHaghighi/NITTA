export type Student = {
  id: string;
  email: string;
  name: string;
  username: string;
};

export type Teacher = {
  name: string;
  email: string;
  username: string;
  depName: string;
};

export type LoginErrorCode = {
  code: string;
};

export type RegisterErrorCode = {
  code: string;
};

export type TokensType = {
  access_token: string;
  refresh_token: string;
};

export type ThemeType = 'dark' | 'light';
