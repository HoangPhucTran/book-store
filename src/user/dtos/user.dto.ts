import { IsEnum, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;
}