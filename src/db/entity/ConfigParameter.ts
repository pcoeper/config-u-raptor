import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ConfigParameter {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text', unique: true })
  public name!: string;

  // should be one of 'string', 'number' or 'boolean'
  @Column('text')
  public type!: string;

  @Column('text')
  public defaultValue: string = '';

  @Column('text')
  public description: string = '';
}
