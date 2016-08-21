declare module Express {
  export interface Session {
    username: string;
    userisadmin: boolean;
  }
}