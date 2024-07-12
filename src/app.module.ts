import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://guiwojtysiak:wojtysiak05@testecreatus.km9w3yz.mongodb.net/?retryWrites=true&w=majority&appName=testeCreatus',
    ),
  ],
})
export class AppModule {}
