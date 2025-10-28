import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  address: string;

  @Column()
  whatsappNumber: string;

  @Column({ type: 'json', nullable: true })
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };

  @CreateDateColumn()
  createdAt: Date;
}
