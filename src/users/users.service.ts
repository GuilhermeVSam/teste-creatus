import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { ApiOperation } from '@nestjs/swagger';
import * as json2csv from 'json2csv';
import { promises as fs } from 'fs';
import { createReadStream } from 'fs';

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
    const columns = ['id', 'name', 'email', 'level'];
    const users = await this.userModel.find().select(columns.join(' ')).exec();
    const opts = { columns };
    const csv = json2csv.parse(users, opts);
    const filePath = './temp/users-report.csv';
    await fs.writeFile(filePath, csv);
    return createReadStream(filePath);
  }
}
