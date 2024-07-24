import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles_perms' })
export class RolePerm {
  @Column()
  @PrimaryColumn()
  role_id: number;

  @Column()
  @PrimaryColumn()
  perm_id: number;

  constructor(role_id: number, perm_id: number) {
    this.role_id = role_id;
    this.perm_id = perm_id;
  }
}
