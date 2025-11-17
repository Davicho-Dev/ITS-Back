import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID'),
              brokers: [configService.get<string>('KAFKA_BROKER')!],
            },
            consumer: {
              groupId: 'api-gateway-consumer',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
