import {TEmail, TPassword, TName, TID, TErrorCode, TErrorMessage} from './types'

export interface IUser {
    name: TName;
    email: TEmail;
    password: TPassword;
}

export interface IAuthUser {
    id: TID;
    name: TName;
    email: TEmail;
    pwdHash: TPassword;
}

export interface ILoginUser {
    email: TEmail;
    password: TPassword;
}

export interface IErrorProp {
    code: TErrorCode;
    message: TErrorMessage;
}

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    iamonline: () => void;
  }
  
  export interface ClientToServerEvents {
    connect: () => void;
  }
  
  export interface InterServerEvents {
    ping: () => void;
  }
  
  export interface SocketData {
    name: string;
    age: number;
  }
