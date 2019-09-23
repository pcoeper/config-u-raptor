import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParameterMod } from './ParameterMod';

@Entity()
export class ConfigParameter {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('text')
    public name: string = '';

    // should be one of 'string', 'number' or 'boolean'
    @Column('text')
    public type: string = 'string';

    @Column('text')
    public defaultValue: string = '';

    @Column('text')
    public description: string = '';

    @OneToMany((type) => ParameterMod, (parameterMod) => parameterMod.configParameter)
    public modifications!: ParameterMod[];
}
