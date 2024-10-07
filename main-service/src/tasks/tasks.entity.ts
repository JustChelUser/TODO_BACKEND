import { ApiProperty } from "@nestjs/swagger";
import { List } from "src/lists/lists.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @ApiProperty({example:'1',description:'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example:'Сделать задачу',description:'Название задачи'})
  @Column()
  name: string;

  @ApiProperty({example:'Задача такая-то',description:'Описание задачи'})
  @Column()
  description: string;

  @ApiProperty({example:'1',description:'Позиция задачи'})
  @Column()
  position: number;

  @ManyToOne(() => List, (list) => list.tasks,{ cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  list: List
  
  @ApiProperty({example:'2024-08-13 20:50:13.886756',description:'Дата создания'})
  @CreateDateColumn()
  createdDate: Date
}







