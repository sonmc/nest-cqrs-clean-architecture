import { ROLE } from 'src/domain/util/const.variable';

export const roleRoute = [
  {
    access_type: ROLE.ADMIN,
    module: 'roles',
    action: 'create',
    method: 'post',
  },
  {
    access_type: ROLE.ADMIN,
    module: 'roles',
    action: 'update',
    method: 'put',
  },
  {
    access_type: ROLE.ADMIN,
    module: 'roles',
    action: 'delete',
    method: 'delete',
  },
  {
    access_type: ROLE.ADMIN,
    module: 'roles',
    action: 'list',
    method: 'get',
  },
];
