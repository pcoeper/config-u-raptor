import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ConfigSetup } from './ConfigSetup';
import { ConfigParameter } from './ConfigParameter';

@Entity()
export class ParameterMod {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(
    (type) => ConfigParameter,
    (configParameter) => configParameter.modifications
  )
  public configParameter!: ConfigParameter;

  @Column('text')
  public value!: string;

  @ManyToOne((type) => ConfigSetup, (configSetup) => configSetup.modifications)
  public configSetup!: ConfigSetup;
}
