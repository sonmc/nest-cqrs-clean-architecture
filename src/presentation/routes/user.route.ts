import { ROLE } from '@domain/util/const.variable';

export const userRoute = [
  {
    access_type: ROLE.ADMIN + ',' + ROLE.STAFF,
    module: 'users',
    action: 'create',
    method: 'post',
  },
  {
    access_type: ROLE.ADMIN + ',' + ROLE.STAFF,
    module: 'users',
    action: 'update',
    method: 'put',
  },
  {
    access_type: ROLE.ADMIN + ',' + ROLE.STAFF,
    module: 'users',
    action: 'delete',
    method: 'delete',
  },
  {
    access_type: ROLE.ADMIN + ',' + ROLE.STAFF,
    module: 'users',
    action: 'list',
    method: 'get',
  },
];
