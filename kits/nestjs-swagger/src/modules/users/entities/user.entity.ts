import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'The unique identifier of the user'
    })
    id: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user'
    })
    name: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email address of the user'
    })
    email: string;

    @ApiProperty({
        example: 'admin',
        description: 'The role of the user'
    })
    role: string;
}
