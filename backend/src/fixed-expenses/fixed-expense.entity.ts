import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fixed_expenses')
export class FixedExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'int' })
  dayOfMonth: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastProcessedDate: Date;
}
