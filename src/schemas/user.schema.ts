import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, required: true, type: mongoose.Schema.Types.Mixed })
  id: string | number;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  level: 1 | 2 | 3 | 4;
}

export const UserSchema = SchemaFactory.createForClass(User);
