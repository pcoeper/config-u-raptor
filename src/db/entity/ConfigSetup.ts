import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParameterMod } from './ParameterMod';

@Entity()
export class ConfigSetup {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('text')
    public name: string = '';

    @Column('text')
    public description: string = '';

    @OneToMany((type) => ParameterMod, (parameterMod) => parameterMod.configSetup)
    public modifications!: ParameterMod[];
}
