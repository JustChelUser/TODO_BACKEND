import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/projects.entity";
import { Task } from "src/tasks/tasks.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class List {
  @ApiProperty({example:'1',description:'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example:'Дела',description:'Название списка задач'})
  @Column()
  name: string;

  @ApiProperty({example:'2',description:'Позиция списка'})
  @Column()
  position: number;

  @ManyToOne(() => Project, (project) => project.lists, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @ApiProperty({example:'2024-08-13 20:50:13.886756',description:'Дата создания'})
  @CreateDateColumn()
  createdDate: Date;
}







