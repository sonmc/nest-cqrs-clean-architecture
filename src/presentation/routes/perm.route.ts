import { ROLE } from '@domain/util/const.variable';

export const permRoute = [
  {
    access_type: ROLE.ADMIN,
    module: 'perms',
    action: 'list',
    method: 'get',
  },
];
