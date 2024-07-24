import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Perm } from './perm.schema';
import { User } from './user.schema';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column({ type: 'varchar' })
  title = '';

  @Column({ type: 'int' })
  access_type = 0;

  @Column({ nullable: true, type: 'varchar' })
  description = '';

  @ManyToMany(() => User, (user: User) => user.roles)
  @JoinTable({
    name: 'roles_users',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[] | undefined;

  @ManyToMany(() => Perm, (perm) => perm.roles, {
    eager: true,
  })
  @JoinTable({
    name: 'roles_perms',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'perm_id' },
  })
  permissions: Perm[] | undefined;
}
