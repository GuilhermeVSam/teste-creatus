import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '123', description: 'ID do usuário' })
  id: string | number;

  @ApiProperty({ example: 'Guilherme', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
  })
  password: string;

  @ApiProperty({
    example: 1,
    description: 'Nível do usuário',
  })
  level: 1 | 2 | 3 | 4;
}
