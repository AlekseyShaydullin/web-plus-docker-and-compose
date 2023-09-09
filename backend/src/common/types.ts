export type TToken = { access_token: string };
export interface IJwtPayload {
  id: number;
  username: string;
}
export type TUserRequest = { user: IJwtPayload };
