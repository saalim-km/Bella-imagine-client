export interface IUser {
    name : string;
    email : string;
    password : string;
    role : TRole
}

export type TRole = "vendor" | "client" | "admin"

export interface ILogin {
    email : string;
    password : string;
    role : TRole
}