import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Officer {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string;
    
    @Column()
    password: string;

    @Column()
    email: string;

    @BeforeInsert()
    generateUuid() {
        this.id = `${uuidv4()}`;
    }
}