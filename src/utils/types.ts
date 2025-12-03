export type Role = 'guest' | 'clerk' | 'owner' | 'unauthenticated';

export interface User {
    username: string,
    roles: Role[]
}