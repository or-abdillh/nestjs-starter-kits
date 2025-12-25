import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {

  private users: User[] = [
    { id: randomUUID(), name: 'John Doe', email: 'john.doe@example.com', role: 'admin' },
    { id: randomUUID(), name: 'Jane Smith', email: 'jane.smith@example.com', role: 'staff' },
    { id: randomUUID(), name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'viewer' },
    { id: randomUUID(), name: 'Bob Brown', email: 'bob.brown@example.com', role: 'admin' },
    { id: randomUUID(), name: 'Charlie Davis', email: 'charlie.davis@example.com', role: 'staff' },
  ];

  private findById(id: string) {
    return this.users.find((user: User) => user.id === id)
  }

  create(createUserDto: CreateUserDto) {

    // Create a new user
    const created = { id: randomUUID(), ...createUserDto };

    // Add the new user to the users array
    this.users.push(created);

    return {
      status: true,
      message: 'User created successfully',
      data: {
        user: created,
      },
    };
  }

  findAll() {
    return {
      status: true,
      message: 'Users found successfully',
      data: {
        users: this.users,
      },
    };
  }

  findOne(id: string) {

    const user = this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: true,
      message: 'User found successfully',
      data: {
        user,
      },
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {

    const user = this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: true,
      message: 'User updated successfully',
      data: {
        user,
      },
    };
  }

  remove(id: string) {

    const user = this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: true,
      message: 'User removed successfully',
      data: {
        user,
      },
    };
  }
}
