interface ILoginRequest {
  email: string;
  password: string;
}

interface IAuthPayload {
  userId: string;
  email: string;
}

export type { ILoginRequest, IAuthPayload };
