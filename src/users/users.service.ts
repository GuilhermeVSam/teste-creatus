import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { ApiOperation } from '@nestjs/swagger';
import { parse } from 'json2csv';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @ApiOperation({ summary: 'Cria um novo usuário' })
  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    if (await this.userModel.findOne({ email: createUserDto.email })) {
      throw new HttpException('Email duplicado', HttpStatus.CONFLICT);
    }
    if (await this.userModel.findOne({ id: createUserDto.id })) {
      throw new HttpException('ID duplicado', HttpStatus.BAD_REQUEST);
    }
    await newUser.save();
    return newUser;
  }

  @ApiOperation({ summary: 'Lista todos os usuários cadastrados' })
  findAll() {
    console.log('here');
    return this.userModel.find().exec();
  }

  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  findOne(id: string) {
    if (!isNaN(parseFloat(id)) && isFinite(Number(id))) {
      return this.userModel.find({ id: Number(id) }).exec();
    }
    return this.userModel.find({ id }).exec();
  }

  @ApiOperation({ summary: 'Busca um usuário pelo email' })
  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  @ApiOperation({ summary: 'Atualiza um usuário' })
  update(id: string, updateUserDto: UpdateUserDto) {
    if (!isNaN(parseFloat(id)) && isFinite(Number(id))) {
      return this.userModel
        .findOneAndUpdate({ id: Number(id) }, updateUserDto)
        .exec();
    } else {
      return this.userModel.findOneAndUpdate({ id }).exec();
    }
  }

  @ApiOperation({ summary: 'Remove um usuário' })
  remove(id: number) {
    return this.userModel.deleteOne({ id }).exec();
  }

  @ApiOperation({ summary: 'Gera um relatório de usuários' })
  async generateReport() {
    try {
      const users = await this.userModel
        .find({}, { id: 1, name: 1, email: 1 })
        .lean()
        .exec();
      const fields = [
        { label: 'ID', value: 'id' },
        { label: 'Nome', value: 'name' },
        { label: 'Email', value: 'email' },
      ];

      const csv = parse(users, { fields });
      return csv;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}
