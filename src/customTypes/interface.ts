import {TEmail, TPassword, TName, TID} from './types'

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
