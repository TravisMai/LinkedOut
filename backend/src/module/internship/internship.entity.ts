import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, ManyToMany } from "typeorm";
import { JobApplicants } from "../jobApplicants/jobApplicants.entity";
import { Staff } from "../staff/staff.entity";
import { Transform } from 'class-transformer';

@Entity()
export class Internship {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => JobApplicants, { eager: true })
    @JoinColumn({ name: 'jobApplicantId' })
    jobApplicants: JobApplicants;

    @OneToOne(() => Staff, { eager: true })
    @JoinColumn({ name: 'staffId' })
    staff: Staff;

    @Column({ default: "Recieved" })
    process: string;

    @Column({ nullable: true })
    @Transform(({ value }) => parseInt(value))
    result: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;
}