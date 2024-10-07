import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, IntegerType, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @ApiProperty({example:'1',description:'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example:'test@mail.ru',description:'Адрес электронной почты'})
  @Column({unique:true})
  email: string;

  @ApiProperty({example:'12345',description:'Пароль'})
  @Column()
  password: string;

  @ApiProperty({example:'false',description:'Флаг администратора'})
  @Column({ default: false }) 
  is_admin: boolean;

  @ApiProperty({example:'2024-08-13 20:50:13.886756',description:'Дата создания'})
  @CreateDateColumn()
  createdDate: Date
}






