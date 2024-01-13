import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, ManyToMany } from "typeorm";
import { JobApplicants } from "../jobApplicants/jobApplicants.entity";

@Entity()
export class Internship {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => JobApplicants, { eager: true })
    @JoinColumn({ name: 'jobId' })
    jobApplicants: JobApplicants;

    @Column({ default: "Recieved" })
    process: string;

    @Column({ nullable: true })
    result: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;
}