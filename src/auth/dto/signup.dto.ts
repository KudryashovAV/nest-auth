import { IsPasswordsMatchingConstraint } from "@shared/decorators";
import { IsEmail, IsString, MinLength, Validate } from "class-validator";

export class SignupDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    password: string;
    
    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    passwordRepeat: string;
}