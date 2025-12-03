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