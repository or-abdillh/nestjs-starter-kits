import { IsEmail, IsString, MinLength, IsNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/rbac/role.enum';

/**
 * DTO for user registration
 */
export class RegisterDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password (minimum 6 characters)',
        example: 'SecurePass123!',
        minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'User roles',
        example: [Role.USER],
    })
    @IsArray()
    @IsEnum(Role, { each: true })
    @IsOptional()
    roles?: Role[];
}
