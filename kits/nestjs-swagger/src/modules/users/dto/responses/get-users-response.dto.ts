import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class GetUsersDataDto {
    @ApiProperty({ type: () => [User] })
    users: User[];
}

export class GetUsersResponseDto {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 'User created successfully' })
    message: string;

    @ApiProperty({ type: () => GetUsersDataDto })
    data: GetUsersDataDto;
}