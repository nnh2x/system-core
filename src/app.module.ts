import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './services/users/users.module';
import { OrdersModule } from './services/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { LicenseModule } from './modules/license/license.module';
import { EntitlementModule } from './modules/entitlement/entitlement.module';
import { ExampleModule } from './modules/examples/example.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MiddlewareConsumer } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    // Core modules
    UsersModule,
    OrdersModule,
    // IAM & License modules
    AuthModule,
    RbacModule,
    OrganizationsModule,
    LicenseModule,
    EntitlementModule,
    // Example module
    ExampleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
