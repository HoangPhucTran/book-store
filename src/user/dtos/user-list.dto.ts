import { IsEnum, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class UserListDto {
    @IsString()
    id: string;

    @IsString()
    username: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;
}