import { IsEmail, IsString, MinLength, Validate } from "class-validator";

export class SigninDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    password: string;
}