import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

/**
 * Data transfer object for the data property in create user response.
 */
export class CreateUserDataDto {
    @ApiProperty({ type: () => User })
    user: User;
}

/**
 * Data transfer object for the response after creating a user.
 */
export class CreateUserResponseDto {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 'User created successfully' })
    message: string;

    @ApiProperty({ type: () => CreateUserDataDto })
    data: CreateUserDataDto;
}