import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, DatabaseConfig } from './infrastructure/configuration';
import { AuthController } from './presentation/controller/auth/auth.ctrl';
import { UserController } from './presentation/controller/user/user.ctrl';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './presentation/middleware/auth.middleware';
import { JwtTokenService } from './infrastructure/services/jwt.service';
import { AuthService } from './infrastructure/services/auth.service';
import { PermController } from './presentation/controller/perm/perm.ctrl';
import { RoleController } from './presentation/controller/role/role.ctrl';
import { UserRequestContextService } from './infrastructure/services/user-request-context.service';
import { BlogController } from './presentation/controller/blog/blog.ctrl';
import { EventController } from './presentation/controller/event/event.ctrl';
import { CommandHandlers, QueryHandlers } from './application';
import { publicRoutes } from './presentation/routes/public';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    CqrsModule,
  ],
  controllers: [
    AuthController,
    UserController,
    PermController,
    RoleController,
    BlogController,
    EventController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    JwtTokenService,
    AuthService,
    AuthMiddleware,
    UserRequestContextService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
