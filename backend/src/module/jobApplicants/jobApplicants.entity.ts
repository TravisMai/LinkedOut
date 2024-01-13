import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, Min } from "class-validator";
import { Student } from "../student/student.entity";
import { Job } from "../job/job.entity";

@Entity()
export class JobApplicants {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Student, { eager: true })
    @JoinColumn({ name: 'studentId' })
    student: Student;

    @ManyToOne(() => Job, { eager: true })
    @JoinColumn({ name: 'jobId' })
    job: Job;

    @Column({ default: "Applied" })
    status: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated: Date;
}