import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column('text')
    public filePath: string = '';

    @Column('text')
    public fileName: string = '';
}
