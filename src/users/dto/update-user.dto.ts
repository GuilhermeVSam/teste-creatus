import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Guilherme', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  password: string;

  @ApiProperty({ example: 1, description: 'Nível do usuário' })
  level: 1 | 2 | 3 | 4;
}
