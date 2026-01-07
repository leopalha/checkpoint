import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { OrganizerEventsService } from './events.service';
import { OrganizerEventsController } from './events.controller';
import { OrganizerGuard } from './guards/organizer.guard';
import { OrganizersGateway } from './organizers.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OrganizersController, OrganizerEventsController],
  providers: [OrganizersService, OrganizerEventsService, OrganizerGuard, OrganizersGateway],
  exports: [OrganizersService, OrganizerEventsService, OrganizerGuard, OrganizersGateway],
})
export class OrganizersModule {}
