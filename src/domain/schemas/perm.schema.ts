import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.schema';

@Entity({ name: 'permissions' })
export class Perm {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({ type: 'varchar' })
  access_type = '';

  @Column({ type: 'varchar' })
  module = '';

  @Column({ type: 'varchar' })
  action = '';

  @Column({ type: 'varchar' })
  method = '';

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'roles_perms',
    joinColumn: { name: 'perm_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[] | undefined;
}
