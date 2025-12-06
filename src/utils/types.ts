export type Role = 'guest' | 'clerk' | 'owner' | 'unauthenticated';

export interface AuthUser {
    username: string,
    roles: Role[]
}

export interface User {
    _id: string,
    name: string,
    roles: Role[],
    isActive: boolean,
    password: string,
}

export interface Product {
    _id: string,
    EAN: string,
    name: string,
    price: number,
    stock: number,
}