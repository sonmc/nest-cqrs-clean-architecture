import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.schema';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({ type: 'varchar' })
  @Index({ unique: true })
  username = '';

  @Column({ type: 'varchar' })
  role_ids = '';

  @Column({ type: 'varchar' })
  password = '';

  @Column({ nullable: true, type: 'varchar' })
  first_name = '';

  @Column({ nullable: true, type: 'varchar' })
  last_name = '';

  @Column({ nullable: true, type: 'varchar' })
  email = '';

  @Column({ nullable: true, type: 'datetime' })
  last_login?: Date;

  @Column({ nullable: true, type: 'text' })
  hash_refresh_token = '';

  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable({
    name: 'roles_users',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles?: Role[];
}
