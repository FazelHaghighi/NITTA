export type Student = {
  id: number;
  email: string;
  name: string;
  username: string;
};

export type LoginErrorCode = {
  code: string;
};

export type TokensType = {
  access_token: string;
  refresh_token: string;
};
