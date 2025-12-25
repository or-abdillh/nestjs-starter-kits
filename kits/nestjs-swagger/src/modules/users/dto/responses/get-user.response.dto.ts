import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../entities/user.entity";

export class GetUserDataDto {
    @ApiProperty({ type: () => User })
    user: User;
}

export class GetUserResponseDto {
    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: 'User created successfully' })
    message: string;

    @ApiProperty({ type: () => GetUserDataDto })
    data: GetUserDataDto;
}