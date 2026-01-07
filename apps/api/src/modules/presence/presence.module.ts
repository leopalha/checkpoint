import { Module } from '@nestjs/common';

import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PresenceController],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
