export type UserRole = 'ADMIN' | 'USER';

export interface UserDto {
    id?: string;
    username: string;
    password: string;
    name: string;
    role: UserRole;
}