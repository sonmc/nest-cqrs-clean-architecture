import { RequestMethod } from '@nestjs/common';

export const publicRoutes = [
  { path: '/auth/login', method: RequestMethod.POST },
  { path: '/auth/refresh-token', method: RequestMethod.POST },
  { path: '/auth/register', method: RequestMethod.POST },
];
