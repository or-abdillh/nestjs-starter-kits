import { ApiProperty } from '@nestjs/swagger';

/**
 * User data returned in authentication responses
 * Excludes sensitive information like password
 */
export class UserResponseDto {
    @ApiProperty({
        description: 'User unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    lastName: string;

    @ApiProperty({
        description: 'OAuth provider (if applicable)',
        example: 'google',
        required: false,
    })
    provider?: string;

    @ApiProperty({
        description: 'Account creation timestamp',
        example: '2024-01-05T10:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'User roles',
        example: ['USER'],
        isArray: true,
    })
    roles?: string[];
}

/**
 * Standard authentication response
 * Returned by login, register, and OAuth endpoints
 */
export class AuthResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Authenticated user data',
        type: UserResponseDto,
    })
    user: UserResponseDto;
}
